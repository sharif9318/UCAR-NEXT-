import React, { useEffect } from "react";
import type { NextPage } from "next";
import withAdminLayout from "../../libs/components/layout/LayoutAdmin";
import { useRouter } from "next/router";
import withI18n from "../../libs/i18n/withI18n";

const AdminHome: NextPage = (props: any) => {
  const router = useRouter();

  /** LIFECYCLES **/
  useEffect(() => {
    router.push("/_admin/users");
  }, []);
  return <></>;
};

export default withI18n()(withAdminLayout(AdminHome));
