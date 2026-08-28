import { T_ENTITY } from "@/shared/api/types";
import { EventPackageType } from "../EventPackageTypes/type";
import { PackageFeature } from "../PackageFeature/type";

export type EventPackages = T_ENTITY & {
  eventId: number;
  titleEn: string;
  titleRu: string;
  titleTk: string;
  status: string;
  eventPackageType: EventPackageType;
  eventPackageFee:
    | null
    | (T_ENTITY & {
        titleEn: string;
        titleRu: string;
        titleTk: string;
        status: string;
        price: number;
        currency: string;
        isLocal: boolean;
      });
  packageFeatures: PackageFeature[];
  price: number;
  oldPrice: number | null;
  currency: string;
  isLocal: boolean;
  isDiscountAvailable: boolean;
};
