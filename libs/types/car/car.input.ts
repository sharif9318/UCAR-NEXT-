import { CarLocation, CarStatus, CarType } from "../../enums/car.enum";
import { Direction } from "../../enums/common.enum";

export interface CarInput {
  carType: CarType;
  carLocation: CarLocation;
  carAddress: string;
  carTitle: string;
  carPrice: number;
  carMileage: number;
  carYear: number;
  carSeats: number;
  carImages: string[];
  car360Images?: string[];
  carDesc?: string;
  carTradeIn?: boolean;
  carLease?: boolean;
  memberId?: string;
  manufacturedAt?: Date;
}

interface CISearch {
  memberId?: string;
  locationList?: CarLocation[];
  typeList?: CarType[];
  seatsList?: Number[];
  yearsList?: Number[];
  options?: string[];
  pricesRange?: Range;
  periodsRange?: PeriodsRange;
  mileageRange?: Range;
  text?: string;
}

export interface CarsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: CISearch;
}

interface ACISearch {
  carStatus?: CarStatus;
}

export interface AgentCarsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: ACISearch;
}

interface ALCISearch {
  carStatus?: CarStatus;
  carLocationList?: CarLocation[];
}

export interface AllCarsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: ALCISearch;
}

interface Range {
  start: number;
  end: number;
}

interface PeriodsRange {
  start: Date | number;
  end: Date | number;
}
