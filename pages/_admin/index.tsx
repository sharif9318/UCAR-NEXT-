import React, { useEffect } from "react";
import type { NextPage } from "next";
import withAdminLayout from "../../libs/components/layout/LayoutAdmin";
import { useRouter } from "next/router";

const AdminHome: NextPage = (props: any) => {
  const router = useRouter();

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.isReady) {
      router.push("/_admin/dashboard");
    }
  }, [router]);
  return <></>;
};

export default withAdminLayout(AdminHome);
