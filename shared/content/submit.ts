import { CONTENT_API_URL } from "./config";

/**
 * Browser-side writes to the content API: the two public endpoints anyone on
 * the site may call. Both answer with the standard envelope, and failures are
 * re-thrown as an `Error` whose message is the API's `errorCode`, which the
 * views already know how to translate.
 */

export type VisaSubmissionResult = {
  id: number;
  reference: string;
  status: string;
  submittedAt: string;
};

export type ServiceRequestResult = {
  id: number;
  reference: string;
  type: string;
  status: string;
};

async function unwrap<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);

  if (!response.ok || !body?.success) {
    throw new Error(
      body?.errorCode ?? body?.message ?? `REQUEST_FAILED_${response.status}`,
    );
  }

  return body.data as T;
}

/** POST /visa-applications — multipart, documents included. */
export async function submitVisaApplication(
  values: Record<string, string>,
  files: Record<string, File | null>,
  locale: string,
): Promise<VisaSubmissionResult> {
  const form = new FormData();

  for (const [key, value] of Object.entries(values)) {
    if (value !== "" && value !== null && value !== undefined) {
      form.append(key, value);
    }
  }

  form.append("locale", locale);

  // The API names the two required documents; everything else is ignored.
  if (files.photo) form.append("photo", files.photo);
  if (files.passportScan) form.append("passportScan", files.passportScan);

  const response = await fetch(`${CONTENT_API_URL}/visa-applications`, {
    method: "POST",
    body: form,
  });

  return unwrap<VisaSubmissionResult>(response);
}

/** POST /visa-applications/status — reference + email, no account needed. */
export async function checkVisaStatus(
  reference: string,
  email: string,
): Promise<VisaSubmissionResult> {
  const response = await fetch(`${CONTENT_API_URL}/visa-applications/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reference, email }),
  });

  return unwrap<VisaSubmissionResult>(response);
}

/** POST /service-requests — hotel, flight, transfer or official support. */
export async function submitServiceRequest(payload: {
  type: "HOTEL" | "FLIGHT" | "TRANSFER" | "OFFICIAL_SUPPORT" | "OTHER";
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  message?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  arrivalDate?: string;
  departureDate?: string;
  payload?: Record<string, unknown>;
  locale?: string;
}): Promise<ServiceRequestResult> {
  const response = await fetch(`${CONTENT_API_URL}/service-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return unwrap<ServiceRequestResult>(response);
}
