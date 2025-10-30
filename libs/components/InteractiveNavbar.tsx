import { useReactiveVar } from "@apollo/client";
import { Box, Link } from "@mui/material";
import { userVar } from "../../apollo/store";
import { useEffect, useState } from "react";
import { getJwtToken, updateUserInfo } from "../auth";
import { useTranslation } from "react-i18next";
import HomeIcon from "@mui/icons-material/Home";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PeopleIcon from "@mui/icons-material/People";
import ForumIcon from "@mui/icons-material/Forum";
import PersonIcon from "@mui/icons-material/Person";
import HelpIcon from "@mui/icons-material/Help";

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
          <div className="menu-item">
            <span className="icon">
              <img
                src="/img/logo/ucar_logo (1).svg"
                alt="Home"
                className="custom-logo"
              />
            </span>
          </div>
        </Link>

        <Link href={"/property"}>
          <div className="menu-item">
            <span className="icon">
              <DirectionsCarIcon sx={{ fontSize: 32 }} />
            </span>
            <span className="label">{t("Cars")}</span>
          </div>
        </Link>

        <Link href={"/agent"}>
          <div className="menu-item">
            <span className="icon">
              <PeopleIcon sx={{ fontSize: 32 }} />
            </span>
            <span className="label">{t("Agents")}</span>
          </div>
        </Link>

        <Link href={"/community?articleCategory=FREE"}>
          <div className="menu-item">
            <span className="icon">
              <ForumIcon sx={{ fontSize: 32 }} />
            </span>
            <span className="label">{t("Community")}</span>
          </div>
        </Link>

        {user?._id && (
          <Link href={"/mypage"}>
            <div className="menu-item">
              <span className="icon">
                <PersonIcon sx={{ fontSize: 32 }} />
              </span>
              <span className="label">{t("My Page")}</span>
            </div>
          </Link>
        )}

        <Link href={"/cs"}>
          <div className="menu-item">
            <span className="icon">
              <HelpIcon sx={{ fontSize: 32 }} />
            </span>
            <span className="label">{t("CS")}</span>
          </div>
        </Link>
      </div>
    </Box>
  );
};

export default InteractiveNavbar;
