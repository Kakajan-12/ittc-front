import { T_ENTITY } from "@/shared/api/types";
import {} from "./EventPackages/type";
import { T_Package } from "./Packages/type";

export type RegistrationDraft = T_ENTITY & {
  eventId: number;
  firstName: string;
  lastName: string;
  patronymicName?: string | null;
  email: string;
  phoneNumber: string;
  position: string;
  privacyPolicyAccepted: boolean;
  termsAndConditionsAccepted: boolean;

  organizationName?: string | null;
  website?: string | null;
  address?: string | null;
  countryId?: number | null;
  city?: string | null;
  postalCode?: string | null;
  paymentMethodId?: number | null;
  promocodeId?: number | null;
  promocodeCode?: string | null;
  subtotalUsd?: number | null;
  subtotalTmt?: number | null;
  discountAmountUsd?: number | null;
  discountAmountTmt?: number | null;
  totalAmountUsd?: number | null;
  totalAmountTmt?: number | null;
  status?: "PENDING" | "VERIFIED" | "COMPLETED" | "EXPIRED" | "CANCELLED";
  expiredAt?: string | null;
  draftPackageRows?: T_Package[];
  emailVerification?: {
    id: number;
    registrationDraftId: number;
    codeHash: string;
    expiredAt: string;
    verifiedAt: string;
    attempts: number;
    maxAttempts: number;
    resendCount: number;
    lastSentAt: string;
    createdAt: Date;
    updatedAt: Date;
  };
  emailVerified?: boolean;
};
