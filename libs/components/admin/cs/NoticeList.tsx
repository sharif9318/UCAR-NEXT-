import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  Table,
  TableContainer,
  Button,
  Box,
  Checkbox,
  TableSortLabel,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { IconButton, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { NotePencil } from "phosphor-react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_CS } from "../../../../apollo/admin/query";
import { REMOVE_CS_BY_ADMIN } from "../../../../apollo/admin/mutation";
import { CsType } from "../../../enums/cs.enum";
import {
  sweetErrorHandling,
  sweetTopSmallSuccessAlert,
} from "../../../sweetAlert";

type Order = "asc" | "desc";

interface Data {
  category: string;
  title: string;
  id: string;
  writer: string;
  date: string;
  view: number;
  action: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "category",
    numeric: true,
    disablePadding: false,
    label: "Category",
  },
  {
    id: "title",
    numeric: true,
    disablePadding: false,
    label: "TITLE",
  },
  {
    id: "id",
    numeric: true,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "writer",
    numeric: true,
    disablePadding: false,
    label: "WRITER",
  },
  {
    id: "date",
    numeric: true,
    disablePadding: false,
    label: "DATE",
  },
  {
    id: "view",
    numeric: true,
    disablePadding: false,
    label: "TYPE",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "ACTION",
  },
];

interface EnhancedTableHeadProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

const EnhancedTableHead = (props: EnhancedTableHeadProps) => {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all notices",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "left" : "right"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

interface NoticeListType {
  dense?: boolean;
  searchNotices?: any;
}

export const NoticeList = (props: NoticeListType) => {
  const { dense, searchNotices } = props;
  const router = useRouter();
  const [noticeList, setNoticeList] = useState<any[]>([]);
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof Data>("date");
  const [selected, setSelected] = useState<readonly string[]>([]);

  /** APOLLO REQUESTS **/
  const {
    loading: getNoticesLoading,
    data: getNoticesData,
    error: getNoticesError,
    refetch: getNoticesRefetch,
  } = useQuery(GET_ALL_CS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: 1,
        limit: 10,
        sort: "createdAt",
        direction: "DESC",
        search: {
          csType: CsType.NOTICE,
          ...searchNotices,
        },
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setNoticeList(data?.getAllCs?.list || []);
    },
  });

  const [removeCsByAdmin] = useMutation(REMOVE_CS_BY_ADMIN);

  /** LIFECYCLES **/
  useEffect(() => {
    if (searchNotices) {
      getNoticesRefetch({
        input: {
          page: 1,
          limit: 10,
          sort: "createdAt",
          direction: "DESC",
          search: {
            csType: CsType.NOTICE,
            ...searchNotices,
          },
        },
      });
    }
  }, [searchNotices]);

  /** HANDLERS **/
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = noticeList.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleEditClick = (noticeId: string) => {
    router.push(`/_admin/cs/notice_create?id=${noticeId}`);
  };

  const handleDeleteClick = async (noticeId: string) => {
    try {
      if (confirm("Are you sure you want to delete this notice?")) {
        await removeCsByAdmin({
          variables: {
            csId: noticeId,
          },
        });
        await sweetTopSmallSuccessAlert("Notice deleted successfully!", 800);
        getNoticesRefetch();
      }
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  return (
    <Stack>
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={dense ? "small" : "medium"}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={noticeList.length}
          />
          <TableBody>
            {noticeList?.map((notice: any, index: number) => {
              const isItemSelected = isSelected(notice._id);
              const member_image =
                notice?.memberData?.memberImage ||
                "/img/profile/defaultUser.svg";

              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, notice._id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={notice._id}
                  selected={isItemSelected}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": `notice-${notice._id}`,
                      }}
                    />
                  </TableCell>
                  <TableCell align="left">{notice.csCategory}</TableCell>
                  <TableCell align="left">
                    <Link href={`/_admin/cs/notice_create?id=${notice._id}`}>
                      <div className={"title-cell"}>{notice.csTitle}</div>
                    </Link>
                  </TableCell>
                  <TableCell align="left">{notice._id.slice(-6)}</TableCell>
                  <TableCell align="left" className={"name"}>
                    <Stack direction={"row"} alignItems={"center"}>
                      <Avatar
                        alt={notice?.memberData?.memberNick}
                        src={member_image}
                        sx={{ ml: "2px", mr: "10px" }}
                      />
                      <div>{notice?.memberData?.memberNick || "Admin"}</div>
                    </Stack>
                  </TableCell>
                  <TableCell align="left">
                    {notice.createdAt
                      ? new Date(notice.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell align="left">
                    {notice.csEvent ? "Event" : "Normal"}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={"delete"}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(notice._id);
                        }}
                      >
                        <DeleteRoundedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="edit">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(notice._id);
                        }}
                      >
                        <NotePencil size={24} weight="fill" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
