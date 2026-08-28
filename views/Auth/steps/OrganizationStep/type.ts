export type OrganizationStepRequest = {
  organizationName: string;
  website?: string | null;
  address: string;
  countryId: number;
  city: string;
  postalCode: string;
};
