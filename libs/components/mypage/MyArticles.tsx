import React, { useState } from "react";
import { NextPage } from "next";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Pagination, Stack, Typography } from "@mui/material";
import CommunityCard from "../common/CommunityCard";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { T } from "../../types/common";
import { BoardArticle } from "../../types/board-article/board-article";
import { useTranslation } from "react-i18next";

const MyArticles: NextPage = ({ initialInput, ...props }: T) => {
  const { t } = useTranslation("common");
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const [searchCommunity, setSearchCommunity] = useState({
    ...initialInput,
    search: { memberId: user._id },
  });
  const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  /** APOLLO REQUESTS **/

  /** HANDLERS **/
  const paginationHandler = (e: T, value: number) => {
    setSearchCommunity({ ...searchCommunity, page: value });
  };

  if (device === "mobile") {
    return <>ARTICLE PAGE MOBILE</>;
  } else
    return (
      <div id="my-articles-page">
        <Stack className="main-title-box">
          <Stack className="right-box">
            <Typography className="main-title">
              {t("mypage.articles")}
            </Typography>
            <Typography className="sub-title">
              {t("We are glad to see you again!")}
            </Typography>
          </Stack>
        </Stack>
        <Stack className="article-list-box">
          {boardArticles?.length > 0 ? (
            boardArticles?.map((boardArticle: BoardArticle) => {
              return (
                <CommunityCard
                  boardArticle={boardArticle}
                  key={boardArticle?._id}
                  size={"small"}
                />
              );
            })
          ) : (
            <div className={"no-data"}>
              <img src="/img/icons/icoAlert.svg" alt="" />
              <p>{t("mypage.noArticles")}</p>
            </div>
          )}
        </Stack>

        {boardArticles?.length > 0 && (
          <Stack className="pagination-conf">
            <Stack className="pagination-box">
              <Pagination
                count={Math.ceil(totalCount / searchCommunity.limit)}
                page={searchCommunity.page}
                shape="circular"
                color="primary"
                onChange={paginationHandler}
              />
            </Stack>
            <Stack className="total">
              <Typography>
                {t("mypage.totalArticles", { count: totalCount ?? 0 })}
              </Typography>
            </Stack>
          </Stack>
        )}
      </div>
    );
};

MyArticles.defaultProps = {
  initialInput: {
    page: 1,
    limit: 6,
    sort: "createdAt",
    direction: "DESC",
    search: {},
  },
};

export default MyArticles;
