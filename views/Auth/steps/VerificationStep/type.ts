import { T_Package } from "../../Packages/type";
import { RegistrationDraft } from "../../types";

export type T_SEND_OTP = {
  revId: number;
  emaul: string;
  expiresAt: Date;
  nextResendAt:Date
  attempts:number // enter codes attempts
  maxAttempts:number // enter code max attemp
  resendCount:number // resend try count
  maxResendCount:number // max resend try
};


export type T_VERIFY_EMAIL = {
  revId: number;
  otp: string;
};

// prettier-ignore
export type T_SENT_INFO = { revId: number; sentCount: number; expiresAt: number};
export const C_SENT_INFO_KEY = "sentInfo";

export type T_COMPLETED_REGISTRATION = {
  id?: number;
  status?: RegistrationDraft["status"];
  registrationId?: string;
  user?: unknown;
  company?: unknown;
  registerRequest?: unknown;
  packages?: T_Package[];
};
