import React, { useState } from "react";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import {
  Stack,
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
} from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_CS_LIST } from "../../../apollo/user/query";
import { CsType, InquiryStatus } from "../../enums/cs.enum";

const UserInquiryList = () => {
  const device = useDeviceDetect();
  const [inquiryList, setInquiryList] = useState<any[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);

  /** APOLLO REQUESTS **/
  const {
    loading: getInquiriesLoading,
    data: getInquiriesData,
    refetch: getInquiriesRefetch,
  } = useQuery(GET_CS_LIST, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: {
        page: 1,
        limit: 50,
        sort: "createdAt",
        direction: "DESC",
        search: {
          csType: CsType.INQUIRY,
        },
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setInquiryList(data?.getCsList?.list || []);
    },
  });

  /** HANDLERS **/
  const handleInquiryClick = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedInquiry(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case InquiryStatus.PENDING:
        return "warning";
      case InquiryStatus.ANSWERED:
        return "success";
      case InquiryStatus.CLOSED:
        return "default";
      default:
        return "default";
    }
  };

  if (device === "mobile") {
    return (
      <Stack className="inquiry-list-mobile" spacing={3}>
        <Typography variant="h5" className="mobile-title">
          My Inquiries
        </Typography>
        <Typography variant="body2" className="mobile-subtitle">
          Track your inquiries and view responses from our support team
        </Typography>
        {getInquiriesLoading ? (
          <Alert severity="info" className="loading-alert">
            Loading your inquiries...
          </Alert>
        ) : inquiryList.length === 0 ? (
          <Paper elevation={0} className="empty-state-mobile">
            <Typography variant="h6" className="empty-title">
              No Inquiries Yet
            </Typography>
            <Typography variant="body2" className="empty-subtitle">
              You haven't submitted any inquiries. Visit the "Submit Inquiry"
              tab to ask a question.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {inquiryList.map((inquiry: any) => (
              <Paper
                key={inquiry._id}
                elevation={2}
                className="inquiry-card-mobile"
                onClick={() => handleInquiryClick(inquiry)}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Chip
                    label={inquiry.inquiryStatus || "PENDING"}
                    color={getStatusColor(inquiry.inquiryStatus)}
                    size="small"
                    className="status-chip-mobile"
                  />
                  <Typography variant="body2" className="inquiry-title-mobile">
                    {inquiry.csTitle}
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    );
  }

  return (
    <>
      <Stack className="inquiry-list-content" spacing={4}>
        <Box className="header-section">
          <Typography variant="h3" className="page-title">
            My Inquiries
          </Typography>
          <Typography variant="body2" className="page-subtitle">
            Track your inquiries and view responses from our support team
          </Typography>
        </Box>

        {getInquiriesLoading ? (
          <Alert severity="info" className="loading-alert">
            Loading your inquiries...
          </Alert>
        ) : inquiryList.length === 0 ? (
          <Paper elevation={0} className="empty-state-desktop">
            <Typography variant="h6" className="empty-title">
              No Inquiries Yet
            </Typography>
            <Typography variant="body2" className="empty-subtitle">
              You haven't submitted any inquiries. Visit the "Submit Inquiry"
              tab to ask a question.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {inquiryList.map((inquiry: any) => (
              <Paper
                key={inquiry._id}
                elevation={3}
                className="inquiry-card-desktop"
                onClick={() => handleInquiryClick(inquiry)}
              >
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <Chip
                      label={inquiry.inquiryStatus || "PENDING"}
                      color={getStatusColor(inquiry.inquiryStatus)}
                      className="status-chip-desktop"
                    />
                  </Stack>
                  <Typography variant="body2" className="inquiry-description">
                    {inquiry.csTitle}
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    className="view-details-btn"
                  >
                    View Details →
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        className="inquiry-dialog"
        PaperProps={{
          className: "dialog-paper",
        }}
      >
        <DialogTitle className="dialog-title">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" className="dialog-title-text">
              {selectedInquiry?.csTitle || "Inquiry Details"}
            </Typography>
            <Chip
              label={selectedInquiry?.inquiryStatus || "PENDING"}
              color={getStatusColor(selectedInquiry?.inquiryStatus)}
              className="dialog-status-chip"
            />
          </Stack>
        </DialogTitle>
        <DialogContent dividers className="dialog-content">
          {selectedInquiry ? (
            <Stack spacing={4}>
              <Stack
                direction="row"
                spacing={3}
                flexWrap="wrap"
                className="metadata-section"
              >
                <Box>
                  <Typography variant="caption" className="metadata-item">
                    Category: {selectedInquiry.csCategory}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" className="metadata-item">
                    Date:{" "}
                    {selectedInquiry.createdAt
                      ? new Date(selectedInquiry.createdAt).toLocaleDateString()
                      : "-"}
                  </Typography>
                </Box>
                {selectedInquiry.answeredAt && (
                  <Box>
                    <Typography
                      variant="caption"
                      className="metadata-item-secondary"
                    >
                      Answered:{" "}
                      {new Date(
                        selectedInquiry.answeredAt
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Stack>

              <Box>
                <Typography variant="subtitle1" className="section-title">
                  Your Question:
                </Typography>
                <Paper elevation={0} className="content-box">
                  {selectedInquiry.csContent}
                </Paper>
              </Box>

              {selectedInquiry.csAnswer ? (
                <Box>
                  <Typography
                    variant="subtitle1"
                    className="section-title-answer"
                  >
                    ✓ Answer from Support Team:
                  </Typography>
                  <Paper elevation={0} className="content-box">
                    {selectedInquiry.csAnswer}
                  </Paper>
                </Box>
              ) : (
                <Alert severity="info" className="no-answer-alert">
                  No answer yet. Our support team will respond soon.
                </Alert>
              )}
            </Stack>
          ) : (
            <Typography>No details available</Typography>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            className="close-btn"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserInquiryList;
