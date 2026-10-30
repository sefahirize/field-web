import {
  API_URL_PROD,
} from '@landing/constants/Global';
import { MAILCHIMP_AUDIENCE_ID, MAILCHIMP_JOURNEYS, setListMember, triggerJourney } from '@landing/lib/mailchimp';
import { NextRequest, NextResponse } from 'next/server';


// Type definitions
interface ContactFormData {
  name: string;
  email: string;
  message: string;
  information: string;
  phone: string;
  recaptchaToken?: string;
}

interface ReCaptchaVerificationResponse {
  success: boolean;
  score?: number;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

interface MailchimpData {
  email_address: string;
  name: string;
  lastName: string;
  message?: string;
  information?: string;
  phone?: string;
}

// interface MailchimpMergeFields {
//   FNAME: string;
//   LNAME: string;
//   PHONE?: string;
// }

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY is not set');
    return false;
  }

  try {
    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data: ReCaptchaVerificationResponse = await response.json();

    // For reCAPTCHA v3, we check success and optionally score (0.0 to 1.0)
    // A score of 0.5 or higher is typically considered legitimate
    if (data.success) {
      const score = data.score || 0;
      // You can adjust the threshold (0.5 is a common value)
      return score >= 0.5;
    }

    return false;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Verify reCAPTCHA token
    if (body.recaptchaToken) {
      const isValid = await verifyRecaptcha(body.recaptchaToken);
      if (!isValid) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400 }
        );
      }
    } else {
      // In production, you might want to require reCAPTCHA
      // For now, we'll allow requests without token but log a warning
      console.warn('Contact form submission without reCAPTCHA token');
    }

    // Remove recaptchaToken from body before sending to other services
    const { recaptchaToken, ...formData } = body;

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

async function sendContactForm(body: ContactFormData) {
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

async function SendFormDataMailchimp(formData: ContactFormData) {
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
