import { CONTENT_API_URL } from "./config";

/**
 * Browser-side writes to the content API: the public endpoint anyone on the
 * site may call. It answers with the standard envelope, and failures are
 * re-thrown as an `Error` whose message is the API's `errorCode`, which the
 * views already know how to translate.
 */

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
