import { MAILCHIMP_AUDIENCE_ID, MAILCHIMP_JOURNEYS, setListMember, triggerJourney } from '@landing/lib/mailchimp';
import { NextRequest, NextResponse } from 'next/server';

interface ParserLeadData {
  email: string;
  name: string;
  lastName: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ParserLeadData = await request.json();
    
    // Send data to Mailchimp
    await SendFormDataMailchimp(body);
    
    // Send data to parser lead API
    const response = await sendParserLeadForm(body);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Parser lead submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process parser lead request' },
      { status: 500 }
    );
  }
}

async function sendParserLeadForm(body: ParserLeadData) {
  const response = await fetch('https://gateway.hirize.hr/ch8fmhnuk0/parserLead', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Failed to send parser lead data');
  }

  return response.json();
}

async function SendFormDataMailchimp(formData: ParserLeadData) {
  try {
    const postData = {
      email_address: formData.email,
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email
    };

    // Add or update list member
    await addOrUpdateListMember(postData);

    // Trigger Mailchimp journey
    const response = await triggerJourney(
      MAILCHIMP_JOURNEYS.triedParser.journeyId,
      MAILCHIMP_JOURNEYS.triedParser.stepId,
      postData
    );

    return response;
  } catch (error) {
    console.error('Mailchimp parser lead submission error:', error);
    throw error;
  }
}

async function addOrUpdateListMember(data: ParserLeadData & { email_address: string }) {
  try {
    const { email_address, name, lastName } = data;
    const response = await setListMember(
      MAILCHIMP_AUDIENCE_ID,
      {
        email_address,
        status_if_new: 'subscribed',
        merge_fields: {
          FNAME: name,
          LNAME: lastName,
        },
      }
    );

    return response;
  } catch (error) {
    console.error('Error updating Mailchimp list member:', error);
    throw error;
  }
} 