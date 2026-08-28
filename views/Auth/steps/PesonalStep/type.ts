export interface PersonalStepRequest {
  eventId: number;
  firstName: string;
  lastName: string;
  patronymicName?: string | null;
  email: string;
  phoneNumber: string;
  position: string;
  privacyPolicyAccepted: boolean;
  termsAndConditionsAccepted: boolean;
}
