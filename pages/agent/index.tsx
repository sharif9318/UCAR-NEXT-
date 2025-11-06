import React, {
  ChangeEvent,
  MouseEvent,
  useEffect,
  useState,
  useMemo,
} from "react";
import { NextPage } from "next";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import withLayoutBasic from "../../libs/components/layout/LayoutBasic";
import { Stack, Box, Button, Pagination } from "@mui/material";
import { Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import AgentCard from "../../libs/components/common/AgentCard";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Member } from "../../libs/types/member/member";
import withI18n from "../../libs/i18n/withI18n";
import { useTranslation } from "react-i18next";

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const AgentList: NextPage = ({ initialInput, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const { t } = useTranslation("common");
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [filterSortKey, setFilterSortKey] = useState<
    "recent" | "old" | "likes" | "views"
  >("recent");
  const [sortingOpen, setSortingOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchFilter, setSearchFilter] = useState<any>(
    router?.query?.input
      ? JSON.parse(router?.query?.input as string)
      : initialInput
  );
  const [agents, setAgents] = useState<Member[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [curleasePage, setCurleasePage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");

  /** APOLLO REQUESTS **/
  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.input) {
      const input_obj = JSON.parse(router?.query?.input as string);
      setSearchFilter(input_obj);
    } else
      router.replace(
        `/agent?input=${JSON.stringify(searchFilter)}`,
        `/agent?input=${JSON.stringify(searchFilter)}`
      );

    setCurleasePage(searchFilter.page === undefined ? 1 : searchFilter.page);
  }, [router]);

  /** HANDLERS **/
  const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setSortingOpen(true);
  };

  const sortingCloseHandler = () => {
    setSortingOpen(false);
    setAnchorEl(null);
  };

  const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
    switch (e.currentTarget.id as "recent" | "old" | "likes" | "views") {
      case "recent":
        setSearchFilter({
          ...searchFilter,
          sort: "createdAt",
          direction: "DESC",
        });
        setFilterSortKey("recent");
        break;
      case "old":
        setSearchFilter({
          ...searchFilter,
          sort: "createdAt",
          direction: "ASC",
        });
        setFilterSortKey("old");
        break;
      case "likes":
        setSearchFilter({
          ...searchFilter,
          sort: "memberLikes",
          direction: "DESC",
        });
        setFilterSortKey("likes");
        break;
      case "views":
        setSearchFilter({
          ...searchFilter,
          sort: "memberViews",
          direction: "DESC",
        });
        setFilterSortKey("views");
        break;
    }
    setSortingOpen(false);
    setAnchorEl2(null);
  };

  const sortLabel = useMemo(() => {
    switch (filterSortKey) {
      case "recent":
        return t("filter.newest");
      case "old":
        return t("filter.oldest");
      case "likes":
        return t("filter.likes");
      case "views":
        return t("community.views");
    }
  }, [filterSortKey, t]);

  const paginationChangeHandler = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    searchFilter.page = value;
    await router.push(
      `/agent?input=${JSON.stringify(searchFilter)}`,
      `/agent?input=${JSON.stringify(searchFilter)}`,
      {
        scroll: false,
      }
    );
    setCurleasePage(value);
  };

  if (device === "mobile") {
    return <h1>AGENTS PAGE MOBILE</h1>;
  } else {
    return (
      <Stack className={"agent-list-page"}>
        <Stack className={"container"}>
          <Stack className={"filter"}>
            <Box component={"div"} className={"left"}>
              <input
                type="text"
                placeholder={"Search for an agent"}
                value={searchText}
                onChange={(e: any) => setSearchText(e.target.value)}
                onKeyDown={(event: any) => {
                  if (event.key == "Enter") {
                    setSearchFilter({
                      ...searchFilter,
                      search: { ...searchFilter.search, text: searchText },
                    });
                  }
                }}
              />
            </Box>
            <Box component={"div"} className={"right"}>
              <span>{t("filter.sortBy")}</span>
              <div>
                <Button
                  onClick={sortingClickHandler}
                  endIcon={<KeyboardArrowDownRoundedIcon />}
                >
                  {sortLabel}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={sortingOpen}
                  onClose={sortingCloseHandler}
                  sx={{ paddingTop: "5px" }}
                >
                  <MenuItem
                    onClick={sortingHandler}
                    id={"recent"}
                    disableRipple
                  >
                    {t("filter.newest")}
                  </MenuItem>
                  <MenuItem onClick={sortingHandler} id={"old"} disableRipple>
                    {t("filter.oldest")}
                  </MenuItem>
                  <MenuItem onClick={sortingHandler} id={"likes"} disableRipple>
                    {t("filter.likes")}
                  </MenuItem>
                  <MenuItem onClick={sortingHandler} id={"views"} disableRipple>
                    {t("community.views")}
                  </MenuItem>
                </Menu>
              </div>
            </Box>
          </Stack>
          <Stack className={"card-wrap"}>
            {agents?.length === 0 ? (
              <div className={"no-data"}>
                <img src="/img/icons/icoAlert.svg" alt="" />
                <p>{t("agent.noResults")}</p>
              </div>
            ) : (
              agents.map((agent: Member) => {
                return <AgentCard agent={agent} key={agent._id} />;
              })
            )}
          </Stack>
          <Stack className={"pagination"}>
            <Stack className="pagination-box">
              {agents.length !== 0 &&
                Math.ceil(total / searchFilter.limit) > 1 && (
                  <Stack className="pagination-box">
                    <Pagination
                      page={curleasePage}
                      count={Math.ceil(total / searchFilter.limit)}
                      onChange={paginationChangeHandler}
                      shape="circular"
                      color="primary"
                    />
                  </Stack>
                )}
            </Stack>

            {agents.length !== 0 && (
              <span>{t("agent.totalAvailable", { count: total })}</span>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

AgentList.defaultProps = {
  initialInput: {
    page: 1,
    limit: 10,
    sort: "createdAt",
    direction: "DESC",
    search: {},
  },
};

export default withI18n()(withLayoutBasic(AgentList));
