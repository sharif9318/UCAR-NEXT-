import React from "react";
import type { NextPage } from "next";
import withLayoutBasic from "../libs/components/layout/LayoutBasic";
import withI18n from "../libs/i18n/withI18n";

const Car360Demo: NextPage = () => {
  return <div>Car 360 Demo</div>;
};

export default withI18n()(withLayoutBasic(Car360Demo));
