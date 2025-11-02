import { CarLocation, CarStatus, CarType } from '../../enums/car.enum';
import { Direction } from '../../enums/common.enum';

export interface PropertyInput {
	carType: CarType;
	carLocation: CarLocation;
	carAddress: string;
	carTitle: string;
	carPrice: number;
	carMileage: number;
	carYear: number;
	carSeats: number;
	carImages: string[];
	propertyDesc?: string;
	carTradeIn?: boolean;
	carLease?: boolean;
	memberId?: string;
	manufacturedAt?: Date;
}

interface PISearch {
	memberId?: string;
	locationList?: CarLocation[];
	typeList?: CarType[];
	seatsList?: Number[];
	options?: string[];
	yearsList?: Number[];
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
	search: PISearch;
}

interface APISearch {
	carStatus?: CarStatus;
}

export interface AgentCarsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	carStatus?: CarStatus;
	carLocationList?: CarLocation[];
}

export interface AllCarsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

interface Range {
	start: number;
	end: number;
}

interface PeriodsRange {
	start: Date | number;
	end: Date | number;
}
