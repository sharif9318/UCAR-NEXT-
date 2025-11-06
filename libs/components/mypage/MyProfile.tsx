import React, { useCallback, useEffect, useRef, useState } from "react";
import { NextPage } from "next";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Button, Stack, Typography, Box } from "@mui/material";
import axios from "axios";
import { Messages, REACT_APP_API_URL } from "../../config";
import { getJwtToken, updateStorage, updateUserInfo } from "../../auth";
import { useMutation, useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { MemberUpdate } from "../../types/member/member.update";
import { UPDATE_MEMBER } from "../../../apollo/user/mutation";
import { sweetErrorHandling, sweetMixinSuccessAlert } from "../../sweetAlert";
import { useTranslation } from "react-i18next";

const MyProfile: NextPage = ({ initialValues, ...props }: any) => {
  const { t } = useTranslation("common");
  const device = useDeviceDetect();
  const token = getJwtToken();
  const user = useReactiveVar(userVar);
  const [updateData, setUpdateData] = useState<MemberUpdate>(initialValues);

  // Avatar UX states
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOverAvatar, setIsDragOverAvatar] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  /** APOLLO REQUESTS **/
  const [updateMember] = useMutation(UPDATE_MEMBER);

  /** LIFECYCLES **/
  useEffect(() => {
    setUpdateData({
      ...updateData,
      memberNick: user.memberNick,
      memberPhone: user.memberPhone,
      memberAddress: user.memberAddress,
      memberImage: user.memberImage,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /** HELPERS **/
  const phoneRegex = /^\+?[0-9\s\-().]{7,20}$/;
  const errors = {
    memberNick:
      !updateData?.memberNick || updateData.memberNick.trim().length < 3,
    memberPhone:
      !updateData?.memberPhone || !phoneRegex.test(updateData.memberPhone),
  };

  /** HANDLERS **/
  const uploadMemberImage = async (file: File) => {
    try {
      if (!file) return;
      setIsUploadingAvatar(true);

      const formData = new FormData();
      formData.append(
        "operations",
        JSON.stringify({
          query: `mutation ImageUploader($file: Upload!, $target: String!) {
            imageUploader(file: $file, target: $target) 
          }`,
          variables: { file: null, target: "member" },
        })
      );
      formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
      formData.append("0", file);

      const response = await axios.post(
        `${process.env.REACT_APP_API_GRAPHQL_URL}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "apollo-require-preflight": true,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseImage = response.data?.data?.imageUploader;
      if (responseImage) {
        updateData.memberImage = responseImage;
        setUpdateData({ ...updateData });
        return `${REACT_APP_API_URL}/${responseImage}`;
      }
    } catch (err) {
      console.log("Error, uploadMemberImage:", err);
    } finally {
      setIsUploadingAvatar(false);
      setIsDragOverAvatar(false);
    }
  };

  const onAvatarBrowse = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadMemberImage(file);
  };

  const onAvatarDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadMemberImage(file);
  };

  const removeAvatar = () => {
    setUpdateData((prev) => ({ ...prev, memberImage: "" }));
  };

  const updateCarHandler = useCallback(async () => {
    try {
      if (!user._id) throw new Error(Messages.error2);
      updateData._id = user._id;
      const result = await updateMember({
        variables: { input: updateData },
      });
      // @ts-ignore
      const jwtToken = result.data.updateMember?.accessToken;
      await updateStorage({ jwtToken });
      updateUserInfo(result.data.updateMember?.accessToken);
      await sweetMixinSuccessAlert(t("mypage.profileUpdated"));
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  }, [updateData, updateMember, user?._id, t]);

  const doDisabledCheck = () => {
    if (errors.memberNick || errors.memberPhone || isUploadingAvatar)
      return true;
    return false;
  };

  if (device === "mobile") {
    return <>MY PROFILE PAGE MOBILE</>;
  } else
    return (
      <div id="my-profile-page">
        <Stack className="main-title-box">
          <Stack className="right-box">
            <Typography className="main-title">
              {t("mypage.myProfile")}
            </Typography>
            <Typography className="sub-title">
              {t("We are glad to see you again!")}
            </Typography>
          </Stack>
        </Stack>

        {/* Creative two-column layout with live profile card */}
        <Stack className="top-box">
          <div className="two-column">
            {/* Left: Live profile preview */}
            <aside className="profile-preview-card">
              <div
                className={`avatar-wrap ${isDragOverAvatar ? "drag-over" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragOverAvatar(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragOverAvatar(false);
                }}
                onDrop={onAvatarDrop}
              >
                <img
                  className="avatar"
                  src={
                    updateData?.memberImage
                      ? `${REACT_APP_API_URL}/${updateData.memberImage}`
                      : `/img/profile/defaultUser.svg`
                  }
                  alt="avatar"
                />
                <div className="avatar-overlay">
                  <Button
                    className="change-photo-btn"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                  >
                    <Typography>
                      {isUploadingAvatar
                        ? t("mypage.uploading")
                        : t("mypage.changePhoto")}
                    </Typography>
                  </Button>
                  {updateData?.memberImage && (
                    <Button className="remove-photo-btn" onClick={removeAvatar}>
                      <Typography>{t("mypage.removePhoto")}</Typography>
                    </Button>
                  )}
                  <input
                    ref={avatarInputRef}
                    type="file"
                    hidden
                    onChange={onAvatarBrowse}
                    accept="image/png, image/jpg, image/jpeg, image/avif, image/webp"
                  />
                </div>
              </div>

              <div className="profile-meta">
                <Typography className="name">
                  {updateData.memberNick || t("mypage.guest")}
                </Typography>
                <Typography className="phone">
                  {updateData.memberPhone || "—"}
                </Typography>
                <Typography className="address">
                  {updateData.memberAddress || t("mypage.noAddress")}
                </Typography>

                <div className="chips">
                  <span className="chip">{t("role.member")}</span>
                  <span className="chip accent">{t("status.verified")}</span>
                </div>
              </div>
            </aside>

            {/* Right: Form fields */}
            <div className="form-pane">
              <Stack className="small-input-box">
                <Stack className="input-box">
                  <Typography className="title">
                    {t("mypage.username")}
                  </Typography>
                  <input
                    type="text"
                    placeholder={t("mypage.usernamePlaceholder")}
                    value={updateData.memberNick}
                    onChange={({ target: { value } }) =>
                      setUpdateData({ ...updateData, memberNick: value })
                    }
                  />
                  {errors.memberNick && (
                    <Typography className="helper-error">
                      {t("mypage.usernameError")}
                    </Typography>
                  )}
                </Stack>
                <Stack className="input-box">
                  <Typography className="title">{t("mypage.phone")}</Typography>
                  <input
                    type="text"
                    placeholder={t("mypage.phonePlaceholder")}
                    value={updateData.memberPhone}
                    onChange={({ target: { value } }) =>
                      setUpdateData({ ...updateData, memberPhone: value })
                    }
                  />
                  {errors.memberPhone && (
                    <Typography className="helper-error">
                      {t("mypage.phoneError")}
                    </Typography>
                  )}
                </Stack>
              </Stack>

              <Stack className="address-box">
                <Typography className="title">{t("mypage.address")}</Typography>
                <input
                  type="text"
                  placeholder={t("mypage.addressPlaceholder")}
                  value={updateData.memberAddress}
                  onChange={({ target: { value } }) =>
                    setUpdateData({ ...updateData, memberAddress: value })
                  }
                />
              </Stack>

              <Stack className="about-me-box">
                <Button
                  className="update-button"
                  onClick={updateCarHandler}
                  disabled={doDisabledCheck()}
                >
                  <Typography>{t("mypage.updateProfile")}</Typography>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_7065_6985)">
                      <path
                        d="M12.6389 0H4.69446C4.49486 0 4.33334 0.161518 4.33334 0.361122C4.33334 0.560727 4.49486 0.722245 4.69446 0.722245H11.7672L0.105803 12.3836C-0.0352676 12.5247 -0.0352676 12.7532 0.105803 12.8942C0.176321 12.9647 0.268743 13 0.361131 13C0.453519 13 0.545907 12.9647 0.616459 12.8942L12.2778 1.23287V8.30558C12.2778 8.50518 12.4393 8.6667 12.6389 8.6667C12.8385 8.6667 13 8.50518 13 8.30558V0.361122C13 0.161518 12.8385 0 12.6389 0Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_7065_6985">
                        <rect width="13" height="13" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </Button>
              </Stack>
            </div>
          </div>
        </Stack>
      </div>
    );
};

MyProfile.defaultProps = {
  initialValues: {
    _id: "",
    memberImage: "",
    memberNick: "",
    memberPhone: "",
    memberAddress: "",
  },
};

export default MyProfile;
