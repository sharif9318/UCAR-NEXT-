import { CarLocation, CarStatus, CarType } from "../../enums/car.enum";
import { Member } from "../member/member";

export type CarTransmission = "manual" | "automatic" | "unknown";

export interface MeLiked {
  memberId: string;
  likeRefId: string;
  myFavorite: boolean;
}

export interface TotalCounter {
  total: number;
}

export interface Car {
  _id: string;
  carType: CarType;
  carStatus: CarStatus;
  carLocation: CarLocation;
  carAddress: string;
  carTitle: string;
  carPrice: number;
  carMileage: number;
  carYear: number;
  carSeats: number;
  carTransmission?: CarTransmission; // NEW FIELD
  carViews: number;
  carLikes: number;
  carComments: number;
  carRank: number;
  carImages: string[];
  car360Images?: string[];
  carVideos?: string[];
  carDesc?: string;
  carTradeIn: boolean;
  carLease: boolean;
  memberId: string;
  soldAt?: Date;
  deletedAt?: Date;
  manufacturedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  /** from aggregation **/
  meLiked?: MeLiked[];
  memberData?: Member;
}

export interface Cars {
  list: Car[];
  metaCounter: TotalCounter[];
}
