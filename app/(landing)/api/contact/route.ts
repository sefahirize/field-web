import { z } from 'zod';
import {
  API_URL_PROD,
} from '@landing/constants/Global';
import { contactFormSchema } from '@landing/lib/contact-schema';
import { allowWithoutCaptcha, clientIp, isRateLimited, readJsonBody, verifyRecaptcha } from '@landing/lib/form-guard';
import { MAILCHIMP_AUDIENCE_ID, MAILCHIMP_JOURNEYS, setListMember, triggerJourney } from '@landing/lib/mailchimp';
import { NextRequest, NextResponse } from 'next/server';

// The form's own rules, plus length caps and the reCAPTCHA token. Unknown
// fields are dropped, so only these reach the backend and Mailchimp.
const { shape } = contactFormSchema;
const contactRequestSchema = contactFormSchema.extend({
  information: shape.information.max(100),
  topic: shape.topic.max(100),
  email: shape.email.max(254),
  name: shape.name.max(200),
  phone: shape.phone.max(40),
  message: shape.message.max(5000),
  recaptchaToken: z.string().min(1).max(4096),
});

type ContactFields = Omit<z.infer<typeof contactRequestSchema>, 'recaptchaToken'>;

interface MailchimpData {
  email_address: string;
  name: string;
  lastName: string;
  message?: string;
  information?: string;
  phone?: string;
}

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(request: NextRequest) {
  try {
    if (isRateLimited(`contact:${clientIp(request)}`)) {
      return fail('Too many messages. Please try again in a few minutes.', 429);
    }

    const parsed = contactRequestSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return fail('Please check the form and try again.', 400);
    }

    // reCAPTCHA is required: a request without a valid token never reaches
    // the backend or Mailchimp.
    const { recaptchaToken, ...formData } = parsed.data;
    const captcha = await verifyRecaptcha(recaptchaToken, 'contact_form');
    if (captcha === 'failed') {
      return fail('reCAPTCHA verification failed. Please try again.', 400);
    }
    if (captcha === 'unconfigured') {
      if (!allowWithoutCaptcha()) {
        console.error('RECAPTCHA_SECRET_KEY is not set; refusing contact form submissions');
        return fail('The contact form is temporarily unavailable. Please try again later.', 503);
      }
      console.warn('RECAPTCHA_SECRET_KEY is not set; accepting the contact form in development only');
    }

    // Send data to Mailchimp
    try {
      await SendFormDataMailchimp(formData);
    } catch (error) {
      console.error('Mailchimp contact form data submission error:', error);
    }

    // Send data to contact form API
    const response = await sendContactForm(formData);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

async function sendContactForm(body: ContactFields) {
  const response = await fetch(`${API_URL_PROD}/api/contact/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to send contact form data');
  }

  return response.json();
}

async function SendFormDataMailchimp(formData: ContactFields) {
  try {
    // Split name into first and last name
    const [firstName = '', lastName = ''] = formData.name.split(' ');

    const postData: MailchimpData = {
      email_address: formData.email,
      name: firstName,
      lastName: lastName,
      message: formData.message,
      information: formData.information,
      phone: formData.phone,
    };

    // Add or update list member
    await addOrUpdateListMember(postData);

    // Trigger Mailchimp journey
    const response = await triggerJourney(
      MAILCHIMP_JOURNEYS.contactForm.journeyId,
      MAILCHIMP_JOURNEYS.contactForm.stepId,
      postData
    );

    return response;
  } catch (error) {
    console.error('Mailchimp data submission error:', error);
    throw error;
  }
}

async function addOrUpdateListMember(data: MailchimpData) {
  try {
    const { email_address, name, lastName, phone } = data;
    const response = await setListMember(
      MAILCHIMP_AUDIENCE_ID,
      {
        email_address,
        status_if_new: 'subscribed',
        merge_fields: {
          FNAME: name,
          LNAME: lastName,
          ...(phone && { PHONE: phone }),
        },
      }
    );

    return response;
  } catch (error) {
    console.error('Error updating Mailchimp list member:', error);
    throw error;
  }
}
