import { T_Package } from "../../Packages/type";
import { RegistrationDraft } from "../../types";

export type T_SEND_OTP = {
  revId: number;
  emaul: string;
};

export type T_VERIFY_EMAIL = {
  revId: number;
  otp: string;
};

export type T_COMPLETED_REGISTRATION = {
  id?: number;
  status?: RegistrationDraft["status"];
  registrationId?: string;
  user?: unknown;
  company?: unknown;
  registerRequest?: unknown;
  packages?: T_Package[];
};
