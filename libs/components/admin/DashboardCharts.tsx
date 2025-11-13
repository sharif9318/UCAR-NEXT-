import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useQuery } from "@apollo/client";
import {
  GET_ALL_MEMBERS_BY_ADMIN,
  GET_ALL_CARS_BY_ADMIN,
  GET_ALL_BOARD_ARTICLES_BY_ADMIN,
  GET_ALL_CS,
} from "../../../apollo/admin/query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const DashboardCharts = () => {
  const theme = useTheme();

  // Fetch real data
  const { data: usersData } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
    variables: {
      input: {
        page: 1,
        limit: 100,
        sort: "createdAt",
        direction: "DESC",
        search: {},
      },
    },
  });
  const { data: carsData } = useQuery(GET_ALL_CARS_BY_ADMIN, {
    variables: {
      input: {
        page: 1,
        limit: 100,
        sort: "createdAt",
        direction: "DESC",
        search: {},
      },
    },
  });
  const { data: articlesData } = useQuery(GET_ALL_BOARD_ARTICLES_BY_ADMIN, {
    variables: {
      input: {
        page: 1,
        limit: 100,
        sort: "createdAt",
        direction: "DESC",
        search: {},
      },
    },
  });
  const { data: csData } = useQuery(GET_ALL_CS, {
    variables: {
      input: {
        page: 1,
        limit: 100,
        sort: "createdAt",
        direction: "DESC",
        search: {},
      },
    },
  });

  // Fetch inquiries (csType: 'INQUIRY')
  const { data: inquiriesData } = useQuery(GET_ALL_CS, {
    variables: {
      input: {
        page: 1,
        limit: 100,
        sort: "createdAt",
        direction: "DESC",
        search: { csType: "INQUIRY" },
      },
    },
  });

  // Prepare chart data
  const userCount =
    usersData?.getAllMembersByAdmin?.metaCounter?.[0]?.total || 0;
  const carCount = carsData?.getAllCarsByAdmin?.metaCounter?.[0]?.total || 0;
  const articleCount =
    articlesData?.getAllBoardArticlesByAdmin?.metaCounter?.[0]?.total || 0;
  const csCount = csData?.getAllCs?.metaCounter?.[0]?.total || 0;
  const inquiryCount = inquiriesData?.getAllCs?.metaCounter?.[0]?.total || 0;

  // User status breakdown
  const userList = usersData?.getAllMembersByAdmin?.list || [];
  const activeUsers = userList.filter(
    (u: any) => u.memberStatus === "ACTIVE"
  ).length;
  const inactiveUsers = userList.filter(
    (u: any) => u.memberStatus === "INACTIVE"
  ).length;
  const bannedUsers = userList.filter(
    (u: any) => u.memberStatus === "BANNED"
  ).length;

  // Inquiry status breakdown
  const inquiryList = inquiriesData?.getAllCs?.list || [];
  const pendingInquiries = inquiryList.filter(
    (i: any) => i.inquiryStatus === "PENDING"
  ).length;
  const answeredInquiries = inquiryList.filter(
    (i: any) => i.inquiryStatus === "ANSWERED"
  ).length;

  // Car status breakdown
  const carList = carsData?.getAllCarsByAdmin?.list || [];
  const activeCars = carList.filter(
    (c: any) => c.carStatus === "ACTIVE"
  ).length;
  const soldCars = carList.filter((c: any) => c.carStatus === "SOLD").length;
  const deletedCars = carList.filter(
    (c: any) => c.carStatus === "DELETE"
  ).length;

  // Bar chart: Entity counts
  const barData = {
    labels: ["Users", "Cars", "Articles", "CS"],
    datasets: [
      {
        label: "Total Count",
        data: [userCount, carCount, articleCount, csCount],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
      },
    ],
  };

  // Pie chart: User status
  const pieData = {
    labels: ["Active", "Inactive", "Banned"],
    datasets: [
      {
        label: "User Status",
        data: [activeUsers, inactiveUsers, bannedUsers],
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
      },
    ],
  };

  // Inquiry chart: Pie breakdown by status
  const inquiryPieData = {
    labels: ["Pending", "Answered"],
    datasets: [
      {
        label: "Inquiry Status",
        data: [pendingInquiries, answeredInquiries],
        backgroundColor: [
          theme.palette.warning.main,
          theme.palette.success.main,
        ],
      },
    ],
  };

  // Car status pie chart
  const carStatusPieData = {
    labels: ["Active", "Sold", "Deleted"],
    datasets: [
      {
        label: "Car Status",
        data: [activeCars, soldCars, deletedCars],
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.info.main || "#2196f3",
          theme.palette.error.main,
        ],
      },
    ],
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, mt: 4 }}>
      <Box
        sx={{
          flex: 1,
          minWidth: 320,
          bgcolor: "background.paper",
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="h6" mb={2}>
          Entity Overview
        </Typography>
        <Bar
          data={barData}
          options={{
            responsive: true,
            plugins: { legend: { display: false } },
          }}
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          minWidth: 320,
          bgcolor: "background.paper",
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="h6" mb={2}>
          User Status
        </Typography>
        <Pie data={pieData} options={{ responsive: true }} />
      </Box>
      <Box
        sx={{
          flex: 1,
          minWidth: 320,
          bgcolor: "background.paper",
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="h6" mb={2}>
          Car Status
        </Typography>
        <Pie data={carStatusPieData} options={{ responsive: true }} />
      </Box>
      <Box
        sx={{
          flex: 1,
          minWidth: 320,
          bgcolor: "background.paper",
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="h6" mb={2}>
          Inquiries
        </Typography>
        <Pie data={inquiryPieData} options={{ responsive: true }} />
        <Typography variant="body2" mt={2}>
          Total Inquiries: {inquiryCount}
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardCharts;
