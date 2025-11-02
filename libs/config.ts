export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const availableOptions = ["carTradeIn", "carLease"];

const thisYear = new Date().getFullYear();

export const carYears: any = [];

for (let i = 1970; i <= thisYear; i++) {
  carYears.push(String(i));
}

export const carMileage = [
  0, 10000, 25000, 50000, 75000, 100000, 150000, 200000, 300000, 500000,
];

export const Messages = {
  error1: "Something went wrong!",
  error2: "Please login first!",
  error3: "Please fulfill all inputs!",
  error4: "Message is empty!",
  error5: "Only images with jpeg, jpg, png format allowed!",
};

export const topCarRank = 2;
