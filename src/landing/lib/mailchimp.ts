import "server-only";
import { createHash } from "node:crypto";

// Minimal Mailchimp Marketing API client: only the two calls the forms use.
// Replaces @mailchimp/mailchimp_marketing (unmaintained since 2022) and md5.

export const MAILCHIMP_AUDIENCE_ID = "e3b8a668e1";

export const MAILCHIMP_JOURNEYS = {
  contactForm: { journeyId: "3176", stepId: "26118" },
  triedParser: { journeyId: "3177", stepId: "26100" },
  fourteenDayTrial: { journeyId: "3175", stepId: "26116" },
} as const;

function config() {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  if (!apiKey) throw new Error("MAILCHIMP_API_KEY is not set");
  // Keys end in "-<server>", e.g. "-us18"; MAILCHIMP_SERVER overrides it.
  const server = process.env.MAILCHIMP_SERVER || apiKey.split("-").pop();
  if (!server || !/^[a-z]+\d+$/.test(server)) throw new Error("MAILCHIMP_SERVER is not set or invalid");
  return { apiKey, baseUrl: `https://${server}.api.mailchimp.com/3.0` };
}

async function request(method: "POST" | "PUT", path: string, body: unknown) {
  const { apiKey, baseUrl } = config();
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(`Mailchimp ${method} ${path} failed: ${response.status} ${data.title ?? ""}`.trim());
  }
  return data;
}

/** Mailchimp identifies a member by the MD5 of the lower-cased email. */
const subscriberHash = (email: string) => createHash("md5").update(email.toLowerCase()).digest("hex");

export function setListMember(
  listId: string,
  member: { email_address: string; status_if_new: "subscribed"; merge_fields: Record<string, string> },
) {
  return request("PUT", `/lists/${listId}/members/${subscriberHash(member.email_address)}`, member);
}

export function triggerJourney<T extends { email_address: string }>(journeyId: string, stepId: string, data: T) {
  return request("POST", `/customer-journeys/journeys/${journeyId}/steps/${stepId}/actions/trigger`, data);
}
