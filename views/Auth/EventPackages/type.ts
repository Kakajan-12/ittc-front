import { T_ENTITY } from "@/shared/api/types";
import { EventPackageType } from "../EventPackageTypes/type";
import { PackageFeature } from "../PackageFeature/type";

export type EventPackages = T_ENTITY & {
  eventId: number;
  titleEn: string;
  titleRu: string;
  titleTk: string;
  price: number;
  oldPrice: number | null;
  currency: string;
  isLocal: boolean;
  isDiscountAvailable: boolean;
  status: string;
  eventPackageTypeId: number;
  eventPackageFeeId: number;
  // | null
  // | (T_ENTITY & {
  //     titleEn: string;
  //     titleRu: string;
  //     titleTk: string;
  //     status: string;
  //     price: number;
  //     currency: string;
  //     isLocal: boolean;
  //   });
  features: PackageFeature[];
};
