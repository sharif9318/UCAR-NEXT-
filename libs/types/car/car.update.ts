import { CarLocation, CarStatus, CarType } from "../../enums/car.enum";
import { CarTransmission } from "./car";

export interface CarUpdate {
  _id: string;
  carType?: CarType;
  carStatus?: CarStatus;
  carLocation?: CarLocation;
  carAddress?: string;
  carTitle?: string;
  carPrice?: number;
  carMileage?: number;
  carYear?: number;
  carSeats?: number;
  carTransmission?: CarTransmission; // NEW FIELD
  carImages?: string[];
  car360Images?: string[];
  carVideos?: string[];
  carDesc?: string;
  carTradeIn?: boolean;
  carLease?: boolean;
  soldAt?: Date;
  deletedAt?: Date;
  manufacturedAt?: Date;
}
