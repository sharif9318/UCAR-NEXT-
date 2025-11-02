import { CarLocation, CarStatus, CarType } from '../../enums/car.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Property {
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
	carViews: number;
	carLikes: number;
	propertyComments: number;
	carRank: number;
	carImages: string[];
	propertyDesc?: string;
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

export interface Properties {
	list: Car[];
	metaCounter: TotalCounter[];
}
