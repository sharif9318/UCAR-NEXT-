import React from "react";
import withAdminLayout from "../../libs/components/layout/LayoutAdmin";
import DashboardCharts from "../../libs/components/admin/DashboardCharts";
import { Box, Typography } from "@mui/material";

const AdminDashboard = () => {
  return (
    <Box className="content">
      <Typography variant="h4" mb={4} fontWeight={700}>
        Admin Dashboard
      </Typography>
      <DashboardCharts />
    </Box>
  );
};

export default withAdminLayout(AdminDashboard);
