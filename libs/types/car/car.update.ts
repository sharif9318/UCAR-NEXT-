import { CarLocation, CarStatus, CarType } from "../../enums/car.enum";

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
  carImages?: string[];
  car360Images?: string[];
  carDesc?: string;
  carTradeIn?: boolean;
  carLease?: boolean;
  soldAt?: Date;
  deletedAt?: Date;
  manufacturedAt?: Date;
}
