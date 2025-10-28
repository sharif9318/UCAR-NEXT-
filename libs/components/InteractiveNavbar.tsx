import { useReactiveVar } from "@apollo/client";
import { Box, Link } from "@mui/material";
import { userVar } from "../../apollo/store";
import { useEffect, useState } from "react";
import { getJwtToken, updateUserInfo } from "../auth";
import { useTranslation } from "react-i18next";

const InteractiveNavbar = () => {
  const user = useReactiveVar(userVar);
  const { t, i18n } = useTranslation("common");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const jwt = getJwtToken();
    if (jwt) updateUserInfo(jwt);
  }, []);

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box
      component={"div"}
      className={`InteractiveNavbar ${isExpanded ? "expanded" : "collapsed"}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="menu-toggle" onClick={toggleNavbar}>
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className="menu-items">
        <Link href={"/"}>
          <div>
            <span className="icon">🏠</span>
            <span className="label">{t("Home")}</span>
          </div>
        </Link>
        <Link href={"/property"}>
          <div>
            <span className="icon">🏢</span>
            <span className="label">{t("Properties")}</span>
          </div>
        </Link>
        <Link href={"/agent"}>
          <div>
            <span className="icon">👤</span>
            <span className="label">{t("Agents")}</span>
          </div>
        </Link>
        <Link href={"/community?articleCategory=FREE"}>
          <div>
            <span className="icon">💬</span>
            <span className="label">{t("Community")}</span>
          </div>
        </Link>
        {user?._id && (
          <Link href={"/mypage"}>
            <div>
              <span className="icon">👤</span>
              <span className="label">{t("My Page")}</span>
            </div>
          </Link>
        )}
        <Link href={"/cs"}>
          <div>
            <span className="icon">❓</span>
            <span className="label">{t("CS")}</span>
          </div>
        </Link>
      </div>
    </Box>
  );
};

export default InteractiveNavbar;
