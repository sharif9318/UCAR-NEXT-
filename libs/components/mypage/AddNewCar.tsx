import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Button, Stack, Typography, Box } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { CarLocation, CarType } from "../../enums/car.enum";
import { REACT_APP_API_URL, carMileage, carYears } from "../../config";
import { CarInput } from "../../types/car/car.input";
import { CarUpdate } from "../../types/car/car.update";
import axios from "axios";
import { getJwtToken } from "../../auth";
import { sweetMixinErrorAlert, sweetMixinSuccessAlert } from "../../sweetAlert";
import { useMutation, useReactiveVar, useQuery } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { CREATE_CAR, UPDATE_CAR } from "../../../apollo/user/mutation";
import { GET_CAR } from "../../../apollo/user/query";
import Panorama360Modal from "../common/Panorama360Modal";
import { useTranslation } from "react-i18next";

interface AddNewCarProps {
  initialValues: Partial<CarInput> & {
    carType?: CarType;
    carLocation?: CarLocation;
  };
}

const AddNewCar: React.FC<AddNewCarProps> = ({ initialValues, ...props }) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const { t } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement>(null);
  const [insertCarData, setInsertCarData] = useState<
    Partial<CarInput> & {
      carType?: CarType;
      carLocation?: CarLocation;
    }
  >(initialValues);
  const car360Ref = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const pngRef = useRef<HTMLInputElement>(null);
  const backgroundRef = useRef<HTMLInputElement>(null);
  const [carType, setCarType] = useState<CarType[]>(Object.values(CarType));
  const [carLocation, setCarLocation] = useState<CarLocation[]>(
    Object.values(CarLocation)
  );
  const token = getJwtToken();
  const user = useReactiveVar(userVar);
  const [show360Modal, setShow360Modal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragOver360, setIsDragOver360] = useState(false);
  const [isDragOverVideo, setIsDragOverVideo] = useState(false);
  const [isDragOverPng, setIsDragOverPng] = useState(false);
  const [isDragOverBackground, setIsDragOverBackground] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploading360, setIsUploading360] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingPng, setIsUploadingPng] = useState(false);
  const [isUploadingBackground, setIsUploadingBackground] = useState(false);

  /** LIFECYCLES **/
  useEffect(() => {
    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
    };

    document.addEventListener("dragover", handleGlobalDragOver);
    document.addEventListener("drop", handleGlobalDrop);

    return () => {
      document.removeEventListener("dragover", handleGlobalDragOver);
      document.removeEventListener("drop", handleGlobalDrop);
    };
  }, []);

  /** APOLLO REQUESTS **/
  const carId = (router.query.carId || router.query.id) as string;

  const {
    data: getCarData,
    loading: getCarLoading,
    error: getCarError,
  } = useQuery(GET_CAR, {
    skip: !carId,
    variables: { input: carId },
  });

  const [createCar] = useMutation(CREATE_CAR);
  const [updateCar] = useMutation(UPDATE_CAR);

  /** LIFECYCLES **/
  useEffect(() => {
    if (getCarError) {
      console.error("Car loading error:", getCarError);
      sweetMixinErrorAlert(t("common.errorLoading"));
    }
  }, [getCarError, t]);

  useEffect(() => {
    if (getCarData?.getCar && !getCarLoading) {
      const carData = getCarData.getCar;
      setInsertCarData({
        carTitle: carData.carTitle || "",
        carPrice: carData.carPrice || 0,
        carType: carData.carType as CarType | undefined,
        carLocation: carData.carLocation as CarLocation | undefined,
        carAddress: carData.carAddress || "",
        carTradeIn: carData.carTradeIn || false,
        carLease: carData.carLease || false,
        carSeats: carData.carSeats || 0,
        carYear: carData.carYear || 0,
        carMileage: carData.carMileage || 0,
        carDesc: carData.carDesc || "",
        carImages: carData.carImages || [],
        car360Images: carData.car360Images || [],
        carVideos: carData.carVideos || [],
        carPngImage: carData.carPngImage || "",
        carBackgroundImage: carData.carBackgroundImage || "",
        manufacturedAt: carData.manufacturedAt || undefined,
      });
    }
  }, [getCarLoading, getCarData]);

  /** HANDLERS **/
  async function uploadImages() {
    try {
      setIsUploading(true);
      const formData = new FormData();
      const selectedFiles = inputRef.current?.files;

      if (!selectedFiles || selectedFiles.length === 0) {
        setIsUploading(false);
        return false;
      }
      if (selectedFiles.length > 5) {
        setIsUploading(false);
        throw new Error(t("mypage.upload.limit"));
      }

      formData.append(
        "operations",
        JSON.stringify({
          query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) { 
						imagesUploader(files: $files, target: $target)
				  }`,
          variables: {
            files: Array.from(selectedFiles).map(() => null),
            target: "car",
          },
        })
      );

      const mapObject: Record<string, string[]> = {};
      for (let i = 0; i < selectedFiles.length; i++) {
        mapObject[i.toString()] = [`variables.files.${i}`];
      }

      formData.append("map", JSON.stringify(mapObject));

      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append(i.toString(), selectedFiles[i]);
      }

      if (!process.env.REACT_APP_API_GRAPHQL_URL) {
        throw new Error("REACT_APP_API_GRAPHQL_URL is not configured!");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_GRAPHQL_URL}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "apollo-require-preflight": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.errors) {
        throw new Error(
          `GraphQL Error: ${JSON.stringify(response.data.errors)}`
        );
      }

      const responseImages = response.data.data?.imagesUploader;

      if (!responseImages || responseImages.length === 0) {
        await sweetMixinErrorAlert(t("mypage.upload.noServerImages"));
        return;
      }

      setInsertCarData((prevData) => ({
        ...prevData,
        carImages: responseImages,
      }));
    } catch (err: unknown) {
      const error = err as Error;
      await sweetMixinErrorAlert(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  async function upload360Images() {
    try {
      setIsUploading360(true);
      const formData = new FormData();
      const selectedFiles = car360Ref.current?.files;

      if (!selectedFiles || selectedFiles.length === 0) {
        setIsUploading360(false);
        return false;
      }
      if (selectedFiles.length > 5) {
        setIsUploading360(false);
        throw new Error(t("mypage.upload360.limit"));
      }

      const mutationVariables = {
        files: Array.from(selectedFiles).map(() => null),
        target: "car360",
      };

      const mutationQuery = `mutation ImagesUploader($files: [Upload!]!, $target: String!) { 
						imagesUploader(files: $files, target: $target)
				  }`;

      formData.append(
        "operations",
        JSON.stringify({
          query: mutationQuery,
          variables: mutationVariables,
        })
      );

      const mapObject: Record<string, string[]> = {};
      for (let i = 0; i < selectedFiles.length; i++) {
        mapObject[i.toString()] = [`variables.files.${i}`];
      }

      formData.append("map", JSON.stringify(mapObject));

      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append(i.toString(), selectedFiles[i]);
      }

      if (!process.env.REACT_APP_API_GRAPHQL_URL) {
        throw new Error("REACT_APP_API_GRAPHQL_URL is not configured!");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_GRAPHQL_URL}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "apollo-require-preflight": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.errors) {
        throw new Error(
          `GraphQL Error: ${JSON.stringify(response.data.errors)}`
        );
      }

      const responseImages = response.data.data?.imagesUploader;

      if (!responseImages || responseImages.length === 0) {
        await sweetMixinErrorAlert(t("mypage.upload360.noServerImages"));
        return;
      }

      setInsertCarData((prevData) => ({
        ...prevData,
        car360Images: responseImages,
      }));
    } catch (err: unknown) {
      const error = err as Error;
      await sweetMixinErrorAlert(error.message);
    } finally {
      setIsUploading360(false);
    }
  }

  async function uploadVideos() {
    try {
      setIsUploadingVideo(true);
      const formData = new FormData();
      const selectedFiles = videoRef.current?.files;

      if (!selectedFiles || selectedFiles.length === 0) {
        setIsUploadingVideo(false);
        return false;
      }
      if (selectedFiles.length > 5) {
        setIsUploadingVideo(false);
        throw new Error(t("mypage.uploadVideo.limit"));
      }

      const mutationVariables = {
        files: Array.from(selectedFiles).map(() => null),
        target: "car-video",
      };

      const mutationQuery = `mutation VideosUploader($files: [Upload!]!, $target: String!) { 
						imagesUploader(files: $files, target: $target)
				  }`;

      formData.append(
        "operations",
        JSON.stringify({
          query: mutationQuery,
          variables: mutationVariables,
        })
      );

      const mapObject: Record<string, string[]> = {};
      for (let i = 0; i < selectedFiles.length; i++) {
        mapObject[i.toString()] = [`variables.files.${i}`];
      }

      formData.append("map", JSON.stringify(mapObject));

      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append(i.toString(), selectedFiles[i]);
      }

      if (!process.env.REACT_APP_API_GRAPHQL_URL) {
        throw new Error("REACT_APP_API_GRAPHQL_URL is not configured!");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_GRAPHQL_URL}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "apollo-require-preflight": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.errors) {
        throw new Error(
          `GraphQL Error: ${JSON.stringify(response.data.errors)}`
        );
      }

      const responseVideos = response.data.data?.imagesUploader;

      if (!responseVideos || responseVideos.length === 0) {
        await sweetMixinErrorAlert(t("mypage.uploadVideo.noServerVideos"));
        return;
      }

      setInsertCarData((prevData) => ({
        ...prevData,
        carVideos: responseVideos,
      }));
    } catch (err: unknown) {
      const error = err as Error;
      await sweetMixinErrorAlert(error.message);
    } finally {
      setIsUploadingVideo(false);
    }
  }

  async function uploadPngImage() {
    try {
      setIsUploadingPng(true);
      const formData = new FormData();
      const selectedFile = pngRef.current?.files?.[0];

      if (!selectedFile) {
        setIsUploadingPng(false);
        return false;
      }

      const mutationVariables = {
        files: [null],
        target: "car-png",
      };

      const mutationQuery = `mutation ImagesUploader($files: [Upload!]!, $target: String!) { 
						imagesUploader(files: $files, target: $target)
				  }`;

      formData.append(
        "operations",
        JSON.stringify({
          query: mutationQuery,
          variables: mutationVariables,
        })
      );

      formData.append("map", JSON.stringify({ "0": ["variables.files.0"] }));
      formData.append("0", selectedFile);

      if (!process.env.REACT_APP_API_GRAPHQL_URL) {
        throw new Error("REACT_APP_API_GRAPHQL_URL is not configured!");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_GRAPHQL_URL}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "apollo-require-preflight": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.errors) {
        throw new Error(
          `GraphQL Error: ${JSON.stringify(response.data.errors)}`
        );
      }

      const responseImage = response.data.data?.imagesUploader?.[0];

      if (!responseImage) {
        await sweetMixinErrorAlert(t("mypage.uploadPng.noServerImage"));
        return;
      }

      setInsertCarData((prevData) => ({
        ...prevData,
        carPngImage: responseImage,
      }));
    } catch (err: unknown) {
      const error = err as Error;
      await sweetMixinErrorAlert(error.message);
    } finally {
      setIsUploadingPng(false);
    }
  }

  async function uploadBackgroundImage() {
    try {
      setIsUploadingBackground(true);
      const formData = new FormData();
      const selectedFile = backgroundRef.current?.files?.[0];

      if (!selectedFile) {
        setIsUploadingBackground(false);
        return false;
      }

      const mutationVariables = {
        files: [null],
        target: "car-background",
      };

      const mutationQuery = `mutation ImagesUploader($files: [Upload!]!, $target: String!) { 
						imagesUploader(files: $files, target: $target)
				  }`;

      formData.append(
        "operations",
        JSON.stringify({
          query: mutationQuery,
          variables: mutationVariables,
        })
      );

      formData.append("map", JSON.stringify({ "0": ["variables.files.0"] }));
      formData.append("0", selectedFile);

      if (!process.env.REACT_APP_API_GRAPHQL_URL) {
        throw new Error("REACT_APP_API_GRAPHQL_URL is not configured!");
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_GRAPHQL_URL}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "apollo-require-preflight": "true",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.errors) {
        throw new Error(
          `GraphQL Error: ${JSON.stringify(response.data.errors)}`
        );
      }

      const responseImage = response.data.data?.imagesUploader?.[0];

      if (!responseImage) {
        await sweetMixinErrorAlert(t("mypage.uploadBackground.noServerImage"));
        return;
      }

      setInsertCarData((prevData) => ({
        ...prevData,
        carBackgroundImage: responseImage,
      }));
    } catch (err: unknown) {
      const error = err as Error;
      await sweetMixinErrorAlert(error.message);
    } finally {
      setIsUploadingBackground(false);
    }
  }

  const removeCarImage = useCallback((index: number) => {
    setInsertCarData((prev) => ({
      ...prev,
      carImages: (prev.carImages || []).filter((_, i) => i !== index),
    }));
  }, []);

  const removeCar360Image = useCallback((index: number) => {
    setInsertCarData((prev) => ({
      ...prev,
      car360Images: (prev.car360Images || []).filter((_, i) => i !== index),
    }));
  }, []);

  const removeCarVideo = useCallback((index: number) => {
    setInsertCarData((prev) => ({
      ...prev,
      carVideos: (prev.carVideos || []).filter((_, i) => i !== index),
    }));
  }, []);

  const removeCarPngImage = useCallback(() => {
    setInsertCarData((prev) => ({
      ...prev,
      carPngImage: "",
    }));
  }, []);

  const removeCarBackgroundImage = useCallback(() => {
    setInsertCarData((prev) => ({
      ...prev,
      carBackgroundImage: "",
    }));
  }, []);

  const doDisabledCheck = () => {
    const checks = {
      carTitle:
        !insertCarData.carTitle ||
        insertCarData.carTitle.length < 3 ||
        insertCarData.carTitle.length > 100,
      carPrice: !insertCarData.carPrice || insertCarData.carPrice <= 0,
      carType: !insertCarData.carType,
      carLocation: !insertCarData.carLocation,
      carAddress:
        !insertCarData.carAddress ||
        insertCarData.carAddress.length < 3 ||
        insertCarData.carAddress.length > 100,
      carSeats: !insertCarData.carSeats || insertCarData.carSeats < 2,
      carYear: !insertCarData.carYear || insertCarData.carYear < 1900,
      carMileage:
        insertCarData.carMileage === undefined ||
        insertCarData.carMileage === null ||
        insertCarData.carMileage < 0,
      carImages:
        !insertCarData.carImages || insertCarData.carImages.length === 0,
    };

    const failedChecks = Object.entries(checks).filter(([, failed]) => failed);

    return failedChecks.length > 0;
  };

  const insertCarHandler = useCallback(async () => {
    try {
      if (doDisabledCheck()) return;

      if (!insertCarData.carType || !insertCarData.carLocation) {
        await sweetMixinErrorAlert("Please select car type and location");
        return;
      }

      const input: CarInput = {
        carTitle: insertCarData.carTitle || "",
        carPrice: insertCarData.carPrice || 0,
        carType: insertCarData.carType,
        carLocation: insertCarData.carLocation,
        carAddress: insertCarData.carAddress || "",
        carTradeIn: insertCarData.carTradeIn || false,
        carLease: insertCarData.carLease || false,
        carSeats: insertCarData.carSeats || 0,
        carYear: insertCarData.carYear || 0,
        carMileage: insertCarData.carMileage || 0,
        carDesc: insertCarData.carDesc || "",
        carImages: insertCarData.carImages || [],
        car360Images: insertCarData.car360Images || [],
        carVideos: insertCarData.carVideos || [],
        carPngImage: insertCarData.carPngImage || "",
        carBackgroundImage: insertCarData.carBackgroundImage || "",
        manufacturedAt: insertCarData.manufacturedAt,
      };

      const result = await createCar({
        variables: { input },
      });

      if (result.data?.createCar) {
        await sweetMixinSuccessAlert(t("mypage.create.success"));
        await router.push(`/car/detail?id=${result.data.createCar._id}`);
      }
    } catch (err: unknown) {
      const error = err as Error;
      await sweetMixinErrorAlert(error.message || t("mypage.create.fail"));
    }
  }, [insertCarData, createCar, router, t]);

  const updateCarHandler = useCallback(async () => {
    try {
      if (!carId) {
        throw new Error(t("mypage.update.noId"));
      }

      if (!insertCarData.carType || !insertCarData.carLocation) {
        await sweetMixinErrorAlert("Please select car type and location");
        return;
      }

      const input: CarUpdate = {
        _id: carId,
        carTitle: insertCarData.carTitle || "",
        carPrice: insertCarData.carPrice || 0,
        carType: insertCarData.carType,
        carLocation: insertCarData.carLocation,
        carAddress: insertCarData.carAddress || "",
        carTradeIn: insertCarData.carTradeIn || false,
        carLease: insertCarData.carLease || false,
        carSeats: insertCarData.carSeats || 0,
        carYear: insertCarData.carYear || 0,
        carMileage: insertCarData.carMileage || 0,
        carDesc: insertCarData.carDesc || "",
        carImages: insertCarData.carImages || [],
        car360Images: insertCarData.car360Images || [],
        carVideos: insertCarData.carVideos || [],
        carPngImage: insertCarData.carPngImage || "",
        carBackgroundImage: insertCarData.carBackgroundImage || "",
        manufacturedAt: insertCarData.manufacturedAt,
      };

      const result = await updateCar({
        variables: { input },
      });

      if (result.data?.updateCar) {
        await sweetMixinSuccessAlert(t("mypage.update.success"));
        await router.push(`/car/detail?id=${result.data.updateCar._id}`);
      } else {
        throw new Error(t("mypage.update.noData"));
      }
    } catch (err: unknown) {
      const error = err as Error;
      await sweetMixinErrorAlert(error.message || t("mypage.update.fail"));
    }
  }, [insertCarData, updateCar, router, carId, t]);

  if (user?.memberType !== "AGENT") {
    router.back();
  }

  if (device === "mobile") {
    return <div>ADD NEW CAR MOBILE PAGE</div>;
  }

  if (carId && getCarLoading) {
    return (
      <div id="add-car-page">
        <Stack className="main-title-box">
          <Typography className="main-title">
            {t("mypage.loadingCar")}
          </Typography>
          <Typography className="sub-title">
            {t("mypage.loadingCarSubtitle")}
          </Typography>
        </Stack>
      </div>
    );
  }

  return (
    <div id="add-car-page">
      <Stack className="main-title-box">
        <Typography className="main-title">
          {carId ? t("mypage.editCarTitle") : t("mypage.addCarTitle")}
        </Typography>
        <Typography className="sub-title">
          {t("We are glad to see you again!")}
        </Typography>
      </Stack>

      <div>
        <Stack className="config">
          <div className="two-column">
            <div className="left-pane">
              <Stack className="description-box">
                <Stack className="config-column">
                  <Typography className="title">
                    {t("mypage.carForm.title")}
                  </Typography>
                  <input
                    type="text"
                    className="description-input"
                    placeholder={t("mypage.carForm.title")}
                    value={insertCarData.carTitle}
                    onChange={({ target: { value } }) =>
                      setInsertCarData((prevData) => ({
                        ...prevData,
                        carTitle: value,
                      }))
                    }
                  />
                </Stack>

                <Stack className="config-row">
                  <Stack className="price-year-after-price">
                    <Typography className="title">
                      {t("mypage.carForm.price")}
                    </Typography>
                    <input
                      type="text"
                      className="description-input"
                      placeholder={t("mypage.carForm.price")}
                      value={insertCarData.carPrice}
                      onChange={({ target: { value } }) =>
                        setInsertCarData((prevData) => ({
                          ...prevData,
                          carPrice: parseInt(value) || 0,
                        }))
                      }
                    />
                  </Stack>
                  <Stack className="price-year-after-price">
                    <Typography className="title">
                      {t("mypage.carForm.selectType")}
                    </Typography>
                    <select
                      className={"select-description"}
                      value={insertCarData.carType || "select"}
                      onChange={({ target: { value } }) => {
                        if (value !== "select") {
                          setInsertCarData((prevData) => ({
                            ...prevData,
                            carType: value as CarType,
                          }));
                        } else {
                          setInsertCarData((prevData) => ({
                            ...prevData,
                            carType: undefined,
                          }));
                        }
                      }}
                    >
                      <>
                        <option disabled={true} value={"select"}>
                          {t("mypage.carForm.select")}
                        </option>
                        {carType.map((type: CarType) => (
                          <option value={`${type}`} key={type}>
                            {type}
                          </option>
                        ))}
                      </>
                    </select>
                    <div className={"divider"}></div>
                    <img
                      src={"/img/icons/Vector.svg"}
                      className={"arrow-down"}
                    />
                  </Stack>
                </Stack>

                <Stack className="config-row">
                  <Stack className="price-year-after-price">
                    <Typography className="title">
                      {t("mypage.carForm.selectLocation")}
                    </Typography>
                    <select
                      className={"select-description"}
                      value={insertCarData.carLocation || "select"}
                      onChange={({ target: { value } }) => {
                        if (value !== "select") {
                          setInsertCarData((prevData) => ({
                            ...prevData,
                            carLocation: value as CarLocation,
                          }));
                        } else {
                          setInsertCarData((prevData) => ({
                            ...prevData,
                            carLocation: undefined,
                          }));
                        }
                      }}
                    >
                      <>
                        <option disabled={true} value={"select"}>
                          {t("mypage.carForm.select")}
                        </option>
                        {carLocation.map((location: CarLocation) => (
                          <option value={`${location}`} key={location}>
                            {location}
                          </option>
                        ))}
                      </>
                    </select>
                    <div className={"divider"}></div>
                    <img
                      src={"/img/icons/Vector.svg"}
                      className={"arrow-down"}
                    />
                  </Stack>
                  <Stack className="price-year-after-price">
                    <Typography className="title">
                      {t("mypage.carForm.address")}
                    </Typography>
                    <input
                      type="text"
                      className="description-input"
                      placeholder={t("mypage.carForm.address")}
                      value={insertCarData.carAddress}
                      onChange={({ target: { value } }) =>
                        setInsertCarData((prevData) => ({
                          ...prevData,
                          carAddress: value,
                        }))
                      }
                    />
                  </Stack>
                </Stack>

                <Stack className="config-row">
                  <Stack className="price-year-after-price">
                    <Typography className="title">
                      {t("mypage.carForm.tradeIn")}
                    </Typography>
                    <div className="toggle-group">
                      <button
                        type="button"
                        className={`toggle-button ${
                          insertCarData.carTradeIn ? "active" : ""
                        }`}
                        onClick={() =>
                          setInsertCarData((prev) => ({
                            ...prev,
                            carTradeIn: true,
                          }))
                        }
                      >
                        {t("mypage.common.yes")}
                      </button>
                      <button
                        type="button"
                        className={`toggle-button ${
                          !insertCarData.carTradeIn ? "active" : ""
                        }`}
                        onClick={() =>
                          setInsertCarData((prev) => ({
                            ...prev,
                            carTradeIn: false,
                          }))
                        }
                      >
                        {t("mypage.common.no")}
                      </button>
                    </div>
                  </Stack>
                  <Stack className="price-year-after-price">
                    <Typography className="title">
                      {t("mypage.carForm.lease")}
                    </Typography>
                    <div className="toggle-group">
                      <button
                        type="button"
                        className={`toggle-button ${
                          insertCarData.carLease ? "active" : ""
                        }`}
                        onClick={() =>
                          setInsertCarData((prev) => ({
                            ...prev,
                            carLease: true,
                          }))
                        }
                      >
                        {t("mypage.common.yes")}
                      </button>
                      <button
                        type="button"
                        className={`toggle-button ${
                          !insertCarData.carLease ? "active" : ""
                        }`}
                        onClick={() =>
                          setInsertCarData((prev) => ({
                            ...prev,
                            carLease: false,
                          }))
                        }
                      >
                        {t("mypage.common.no")}
                      </button>
                    </div>
                  </Stack>
                </Stack>

                <Stack className="config-row">
                  <Stack className="price-year-after-price">
                    <Typography className="title">
                      {t("mypage.carForm.seats")}
                    </Typography>
                    <select
                      className={"select-description"}
                      value={insertCarData.carSeats || "select"}
                      onChange={({ target: { value } }) =>
                        setInsertCarData((prevData) => ({
                          ...prevData,
                          carSeats: parseInt(value),
                        }))
                      }
                    >
                      <option disabled={true} value={"select"}>
                        {t("mypage.carForm.select")}
                      </option>
                      {[2, 3, 4, 5, 6, 7, 8, 9].map((seat: number) => (
                        <option value={`${seat}`} key={seat}>
                          {seat}
                        </option>
                      ))}
                    </select>
                    <div className={"divider"}></div>
                    <img
                      src={"/img/icons/Vector.svg"}
                      className={"arrow-down"}
                    />
                  </Stack>
                  <Stack className="price-year-after-price">
                    <Typography className="title">
                      {t("mypage.carForm.year")}
                    </Typography>
                    <select
                      className={"select-description"}
                      value={insertCarData.carYear || "select"}
                      onChange={({ target: { value } }) =>
                        setInsertCarData((prevData) => ({
                          ...prevData,
                          carYear: parseInt(value),
                        }))
                      }
                    >
                      <option disabled={true} value={"select"}>
                        {t("mypage.carForm.select")}
                      </option>
                      {carYears
                        .slice()
                        .reverse()
                        .map((year: string) => (
                          <option value={year} key={year}>
                            {year}
                          </option>
                        ))}
                    </select>
                    <div className={"divider"}></div>
                    <img
                      src={"/img/icons/Vector.svg"}
                      className={"arrow-down"}
                    />
                  </Stack>
                  <Stack className="price-year-after-price">
                    <Typography className="title">
                      {t("mypage.carForm.mileage")}
                    </Typography>
                    <select
                      className={"select-description"}
                      value={insertCarData.carMileage || "select"}
                      onChange={({ target: { value } }) =>
                        setInsertCarData((prevData) => ({
                          ...prevData,
                          carMileage: parseInt(value),
                        }))
                      }
                    >
                      <option disabled={true} value={"select"}>
                        {t("mypage.carForm.select")}
                      </option>
                      {carMileage.map((mileage: number) => {
                        if (mileage !== 0) {
                          return (
                            <option value={`${mileage}`} key={mileage}>
                              {mileage.toLocaleString()} {t("car.miles")}
                            </option>
                          );
                        }
                        return null;
                      })}
                    </select>
                    <div className={"divider"}></div>
                    <img
                      src={"/img/icons/Vector.svg"}
                      className={"arrow-down"}
                    />
                  </Stack>
                </Stack>

                <Typography className="car-title">
                  {t("mypage.carForm.descriptionHeader")}
                </Typography>
                <Stack className="config-column">
                  <Typography className="title">
                    {t("mypage.carForm.description")}
                  </Typography>
                  <textarea
                    name=""
                    id=""
                    className="description-text"
                    value={insertCarData.carDesc || ""}
                    onChange={({ target: { value } }) =>
                      setInsertCarData((prevData) => ({
                        ...prevData,
                        carDesc: value,
                      }))
                    }
                  ></textarea>
                </Stack>

                <Stack className="config-column">
                  <Typography className="title">
                    {t("mypage.carForm.manufacturedAt")}
                  </Typography>
                  <input
                    type="date"
                    className="description-input"
                    value={
                      insertCarData.manufacturedAt
                        ? new Date(insertCarData.manufacturedAt)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={({ target: { value } }) =>
                      setInsertCarData((prevData) => ({
                        ...prevData,
                        manufacturedAt: value ? new Date(value) : undefined,
                      }))
                    }
                  />
                </Stack>
              </Stack>
            </div>

            <aside className="right-preview">
              <Stack className="preview-card">
                <Typography className="preview-title">
                  {t("mypage.preview.title")}
                </Typography>
                <div className="preview-image">
                  <img
                    src={
                      insertCarData.carImages && insertCarData.carImages[0]
                        ? `${REACT_APP_API_URL}/${insertCarData.carImages[0]}`
                        : "/img/car/bigImage.png"
                    }
                    alt="Preview"
                  />
                  <div className="price-chip">
                    {insertCarData.carPrice
                      ? `${(insertCarData.carPrice || 0).toLocaleString()}`
                      : t("mypage.preview.setPrice")}
                  </div>
                </div>
                <div className="preview-meta">
                  <Typography className="name">
                    {insertCarData.carTitle || t("mypage.preview.untitled")}
                  </Typography>
                  <Typography className="address">
                    {insertCarData.carAddress || t("mypage.noAddress")}
                  </Typography>
                  <div className="specs">
                    <span>
                      {insertCarData.carType ||
                        t("mypage.preview.typePlaceholder")}
                    </span>
                    <span>
                      {insertCarData.carYear ||
                        t("mypage.preview.yearPlaceholder")}
                    </span>
                    <span>
                      {insertCarData.carMileage
                        ? `${insertCarData.carMileage.toLocaleString()} ${t(
                            "car.miles"
                          )}`
                        : t("mypage.preview.mileagePlaceholder")}
                    </span>
                  </div>
                  <div className="preview-thumbs">
                    {(insertCarData.carImages || [])
                      .slice(0, 4)
                      .map((img, i) => (
                        <div className="thumb" key={i}>
                          <img
                            src={`${REACT_APP_API_URL}/${img}`}
                            alt={`thumb-${i}`}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </Stack>
            </aside>
          </div>

          <Typography className="upload-title">
            {t("mypage.upload.title")}
          </Typography>
          <Stack className="images-box">
            <Stack
              className={`upload-box ${isDragOver ? "drag-over" : ""}`}
              onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isDragOver) {
                  setIsDragOver(true);
                }
              }}
              onDragEnter={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(true);
              }}
              onDragLeave={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;

                if (
                  x < rect.left ||
                  x > rect.right ||
                  y < rect.top ||
                  y > rect.bottom
                ) {
                  setIsDragOver(false);
                }
              }}
              onDrop={async (e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(false);

                try {
                  const files = Array.from(e.dataTransfer.files);

                  if (files.length === 0) {
                    await sweetMixinErrorAlert(
                      t("mypage.upload.noFilesDropped")
                    );
                    return;
                  }

                  const validFiles = files.filter((file: File) => {
                    return (
                      file.type === "image/jpeg" ||
                      file.type === "image/jpg" ||
                      file.type === "image/png" ||
                      file.type === "image/avif"
                    );
                  });

                  const invalidFiles = files.filter((file: File) => {
                    return !(
                      file.type === "image/jpeg" ||
                      file.type === "image/jpg" ||
                      file.type === "image/png" ||
                      file.type === "image/avif"
                    );
                  });

                  if (invalidFiles.length > 0) {
                    await sweetMixinErrorAlert(
                      t("mypage.upload.invalidTypes", {
                        count: invalidFiles.length,
                      })
                    );
                  }

                  if (validFiles.length === 0) {
                    return;
                  }

                  if (validFiles.length > 5) {
                    await sweetMixinErrorAlert(t("mypage.upload.limit"));
                    return;
                  }

                  const maxSize = 10 * 1024 * 1024;
                  const oversizedFiles = validFiles.filter(
                    (file: File) => file.size > maxSize
                  );

                  if (oversizedFiles.length > 0) {
                    await sweetMixinErrorAlert(
                      t("mypage.upload.maxSize", {
                        count: oversizedFiles.length,
                      })
                    );
                    return;
                  }

                  if (inputRef.current) {
                    const dataTransfer = new DataTransfer();
                    validFiles.forEach((file: File) =>
                      dataTransfer.items.add(file)
                    );
                    inputRef.current.files = dataTransfer.files;
                    await uploadImages();
                  }
                } catch (error: unknown) {
                  const err = error as Error;
                  await sweetMixinErrorAlert(
                    t("mypage.upload.dropError", { message: err.message })
                  );
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="121"
                height="120"
                viewBox="0 0 121 120"
                fill="none"
              >
                <g clipPath="url(#clip0_7037_5336)">
                  <path
                    d="M68.9453 52.0141H52.9703C52.4133 52.0681 51.8511 52.005 51.32 51.8289C50.7888 51.6528 50.3004 51.3675 49.886 50.9914C49.4716 50.6153 49.1405 50.1567 48.9139 49.645C48.6874 49.1333 48.5703 48.5799 48.5703 48.0203C48.5703 47.4607 48.6874 46.9073 48.9139 46.3956C49.1405 45.884 49.4716 45.4253 49.886 45.0492C50.3004 44.6731 50.7888 44.3878 51.32 44.2117C51.8511 44.0356 52.4133 43.9725 52.9703 44.0266H68.9828C69.5397 43.9725 70.1019 44.0356 70.633 44.2117C71.1642 44.3878 71.6527 44.6731 72.067 45.0492C72.4814 45.4253 72.8125 45.884 73.0391 46.3956C73.2657 46.9073 73.3827 47.4607 73.3827 48.0203C73.3827 48.5799 73.2657 49.1333 73.0391 49.645C72.8125 50.1567 72.4814 50.6153 72.067 50.9914C71.6527 51.3675 71.1642 51.6528 70.633 51.8289C70.1019 52.005 69.5397 52.0681 68.9828 52.0141H68.9453Z"
                    fill="#DDDDDD"
                  />
                  <path
                    d="M72.4361 65.0288L63.6236 57.0413C62.8704 56.3994 61.9132 56.0469 60.9236 56.0469C59.934 56.0469 58.9768 56.3994 58.2236 57.0413L49.4111 65.0288C48.6807 65.7585 48.2597 66.7415 48.2355 67.7736C48.2113 68.8057 48.5859 69.8074 49.2813 70.5704C49.9767 71.3335 50.9394 71.7991 51.9693 71.8705C52.9992 71.9419 54.017 71.6136 54.8111 70.9538L56.9111 69.0413V88.0163C57.0074 89.0088 57.4697 89.9298 58.208 90.6C58.9464 91.2701 59.9077 91.6414 60.9048 91.6414C61.9019 91.6414 62.8633 91.2701 63.6016 90.6C64.34 89.9298 64.8023 89.0088 64.8986 88.0163V69.0413L66.9986 70.9538C67.3823 71.3372 67.8398 71.6387 68.3434 71.8403C68.8469 72.0418 69.3861 72.1392 69.9284 72.1265C70.4706 72.1138 71.0046 71.9913 71.4982 71.7664C71.9918 71.5415 72.4346 71.2188 72.8 70.8179C73.1653 70.417 73.4456 69.9463 73.6239 69.434C73.8022 68.9217 73.8748 68.3786 73.8373 67.8375C73.7997 67.2965 73.6529 66.7686 73.4056 66.2858C73.1584 65.8031 72.8158 65.3755 72.3986 65.0288H72.4361Z"
                    fill="#DDDDDD"
                  />
                  <path
                    d="M100.975 120.003C100.418 120.057 99.8558 119.994 99.3247 119.818C98.7935 119.642 98.3051 119.357 97.8907 118.98C97.4763 118.604 97.1452 118.146 96.9186 117.634C96.6921 117.122 96.575 116.569 96.575 116.009C96.575 115.45 96.6921 114.896 96.9186 114.385C97.1452 113.873 97.4763 113.414 97.8907 113.038C98.3051 112.662 98.7935 112.377 99.3247 112.201C99.8558 112.025 100.418 111.962 100.975 112.016C104.158 112.016 107.21 110.751 109.46 108.501C111.711 106.25 112.975 103.198 112.975 100.016V19.9906C112.975 16.808 111.711 13.7558 109.46 11.5053C107.21 9.25491 104.158 7.99063 100.975 7.99063H36.9624C36.4055 8.04466 35.8433 7.98159 35.3122 7.80547C34.781 7.62935 34.2926 7.34408 33.8782 6.96797C33.4638 6.59186 33.1327 6.13324 32.9061 5.62156C32.6796 5.10989 32.5625 4.55648 32.5625 3.99688C32.5625 3.43728 32.6796 2.88386 32.9061 2.37219C33.1327 1.86051 33.4638 1.40189 33.8782 1.02578C34.2926 0.649674 34.781 0.364397 35.3122 0.188277C35.8433 0.0121578 36.4055 -0.05091 36.9624 0.00312538H100.975C106.273 0.0130374 111.351 2.12204 115.097 5.86828C118.844 9.61451 120.953 14.6927 120.962 19.9906V100.016C120.953 105.314 118.844 110.392 115.097 114.138C111.351 117.884 106.273 119.993 100.975 120.003Z"
                    fill="#DDDDDD"
                  />
                  <path
                    d="M84.9609 120.003H20.9484C15.6505 119.993 10.5723 117.884 6.82609 114.138C3.07985 110.392 0.97085 105.314 0.960938 100.016L0.960938 19.9906C0.97085 14.6927 3.07985 9.61451 6.82609 5.86828C10.5723 2.12204 15.6505 0.0130374 20.9484 0.00312538C21.5054 -0.05091 22.0676 0.0121578 22.5987 0.188277C23.1299 0.364397 23.6183 0.649674 24.0327 1.02578C24.4471 1.40189 24.7782 1.86051 25.0047 2.37219C25.2313 2.88386 25.3484 3.43728 25.3484 3.99688C25.3484 4.55648 25.2313 5.10989 25.0047 5.62156C24.7782 6.13324 24.4471 6.59186 24.0327 6.96797C23.6183 7.34408 23.1299 7.62935 22.5987 7.80547C22.0676 7.98159 21.5054 8.04466 20.9484 7.99063C17.7658 7.99063 14.7136 9.25491 12.4632 11.5053C10.2127 13.7558 8.94844 16.808 8.94844 19.9906V100.016C8.94844 103.198 10.2127 106.25 12.4632 108.501C14.7136 110.751 17.7658 112.016 20.9484 112.016H84.9609C85.5179 111.962 86.08 112.025 86.6112 112.201C87.1424 112.377 87.6308 112.662 88.0452 113.038C88.4595 113.414 88.7907 113.873 89.0172 114.385C89.2438 114.896 89.3609 115.45 89.3609 116.009C89.3609 116.569 89.2438 117.122 89.0172 117.634C88.7907 118.146 88.4595 118.604 88.0452 118.98C87.6308 119.357 87.1424 119.642 86.6112 119.818C86.08 119.994 85.5179 120.057 84.9609 120.003Z"
                    fill="#DDDDDD"
                  />
                  <path
                    d="M28.9704 24.0031H20.9454C19.9529 23.9068 19.0319 23.4445 18.3617 22.7062C17.6916 21.9679 17.3203 21.0065 17.3203 20.0094C17.3203 19.0123 17.6916 18.0509 18.3617 17.3126C19.0319 16.5743 19.9529 16.1119 20.9454 16.0156H28.9704C29.9628 16.1119 30.8839 16.5743 31.554 17.3126C32.2242 18.0509 32.5954 19.0123 32.5954 20.0094C32.5954 21.0065 32.2242 21.9679 31.554 22.7062C30.8839 23.4445 29.9628 23.9068 28.9704 24.0031Z"
                    fill="#DDDDDD"
                  />
                  <path
                    d="M76.9736 24.0016C76.4485 24.0065 75.9275 23.9074 75.4409 23.7098C74.9543 23.5123 74.5117 23.2203 74.1386 22.8507C73.7655 22.481 73.4693 22.0412 73.2672 21.5564C73.0651 21.0717 72.9611 20.5517 72.9611 20.0266C72.9537 19.2314 73.1827 18.452 73.619 17.7872C74.0554 17.1224 74.6794 16.6023 75.4119 16.2929C76.1444 15.9834 76.9524 15.8986 77.7332 16.0491C78.514 16.1997 79.2324 16.5789 79.7973 17.1385C80.3623 17.6981 80.7482 18.413 80.906 19.1924C81.0639 19.9717 80.9867 20.7804 80.6841 21.5158C80.3816 22.2512 79.8673 22.8801 79.2067 23.3226C78.546 23.7652 77.7688 24.0015 76.9736 24.0016Z"
                    fill="#DDDDDD"
                  />
                  <path
                    d="M88.9736 24.0016C88.4485 24.0065 87.9275 23.9074 87.4409 23.7098C86.9543 23.5123 86.5117 23.2203 86.1386 22.8507C85.7655 22.481 85.4693 22.0412 85.2672 21.5564C85.0651 21.0717 84.9611 20.5517 84.9611 20.0266C84.9537 19.2314 85.1827 18.452 85.619 17.7872C86.0554 17.1224 86.6794 16.6023 87.4119 16.2929C88.1444 15.9834 88.9524 15.8986 89.7332 16.0491C90.514 16.1997 91.2324 16.5789 91.7974 17.1385C92.3623 17.6981 92.7482 18.413 92.9061 19.1924C93.0639 19.9717 92.9867 20.7804 92.6841 21.5158C92.3816 22.2512 91.8673 22.8801 91.2067 23.3226C90.5461 23.7652 89.7688 24.0015 88.9736 24.0016Z"
                    fill="#DDDDDD"
                  />
                  <path
                    d="M100.974 24.0016C100.448 24.0065 99.9275 23.9074 99.4409 23.7098C98.9543 23.5123 98.5117 23.2203 98.1386 22.8507C97.7655 22.481 97.4693 22.0412 97.2672 21.5564C97.0651 21.0717 96.9611 20.5517 96.9611 20.0266C96.9537 19.2314 97.1827 18.452 97.619 17.7872C98.0554 17.1224 98.6794 16.6023 99.4119 16.2929C100.144 15.9834 100.952 15.8986 101.733 16.0491C102.514 16.1997 103.232 16.5789 103.797 17.1385C104.362 17.6981 104.748 18.413 104.906 19.1924C105.064 19.9717 104.987 20.7804 104.684 21.5158C104.382 22.2512 103.867 22.8801 103.207 23.3226C102.546 23.7652 101.769 24.0015 100.974 24.0016Z"
                    fill="#DDDDDD"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_7037_5336">
                    <rect
                      width="120"
                      height="120"
                      fill="white"
                      transform="translate(0.960938)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <Stack className="text-box">
                <Typography className="drag-title">
                  {isUploading
                    ? t("mypage.uploading")
                    : isDragOver
                    ? t("mypage.upload.dragTitleOver")
                    : t("mypage.upload.dragTitleDefault")}
                </Typography>
                <Typography className="format-title">
                  {t("mypage.upload.formatTitle")}
                </Typography>
              </Stack>
              <Button
                className="browse-button"
                disabled={isUploading}
                onClick={() => {
                  inputRef.current?.click();
                }}
              >
                <Typography className="browse-button-text">
                  {isUploading
                    ? t("mypage.uploading")
                    : t("mypage.upload.browse")}
                </Typography>
                <input
                  ref={inputRef}
                  type="file"
                  hidden={true}
                  onChange={uploadImages}
                  multiple={true}
                  accept="image/jpeg, image/jpg, image/png, image/avif"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g clipPath="url(#clip0_7309_3249)">
                    <path
                      d="M15.5556 0H5.7778C5.53214 0 5.33334 0.198792 5.33334 0.444458C5.33334 0.690125 5.53214 0.888917 5.7778 0.888917H14.4827L0.130219 15.2413C-0.0434062 15.415 -0.0434062 15.6962 0.130219 15.8698C0.21701 15.9566 0.33076 16 0.444469 16C0.558177 16 0.671885 15.9566 0.758719 15.8698L15.1111 1.51737V10.2222C15.1111 10.4679 15.3099 10.6667 15.5556 10.6667C15.8013 10.6667 16.0001 10.4679 16.0001 10.2222V0.444458C16 0.198792 15.8012 0 15.5556 0Z"
                      fill="#181A20"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_7309_3249">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </Button>
            </Stack>
            <Stack className="gallery-box">
              {insertCarData?.carImages?.length > 0 ? (
                insertCarData.carImages.map((image: string, index: number) => {
                  const imagePath: string = `${REACT_APP_API_URL}/${image}`;
                  return (
                    <Stack className="image-box" key={index}>
                      <img src={imagePath} alt={`Car ${index + 1}`} />
                      <button
                        type="button"
                        aria-label="Remove image"
                        className="remove-btn"
                        onClick={() => removeCarImage(index)}
                      >
                        ×
                      </button>
                    </Stack>
                  );
                })
              ) : (
                <Typography className="empty-text">
                  {t("mypage.upload.empty")}
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* 360° Images Upload Section */}
          <Typography className="upload-title">
            {t("mypage.upload360.title")}
          </Typography>
          <Stack className="images-box">
            <Stack
              className={`upload-box ${isDragOver360 ? "drag-over" : ""}`}
              onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isDragOver360) {
                  setIsDragOver360(true);
                }
              }}
              onDragEnter={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver360(true);
              }}
              onDragLeave={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;

                if (
                  x < rect.left ||
                  x > rect.right ||
                  y < rect.top ||
                  y > rect.bottom
                ) {
                  setIsDragOver360(false);
                }
              }}
              onDrop={async (e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver360(false);

                try {
                  const files = Array.from(e.dataTransfer.files);

                  if (files.length === 0) {
                    await sweetMixinErrorAlert(
                      t("mypage.upload.noFilesDropped")
                    );
                    return;
                  }

                  const validFiles = files.filter((file: File) => {
                    return (
                      file.type === "image/jpeg" ||
                      file.type === "image/jpg" ||
                      file.type === "image/png" ||
                      file.type === "image/avif"
                    );
                  });

                  const invalidFiles = files.filter((file: File) => {
                    return !(
                      file.type === "image/jpeg" ||
                      file.type === "image/jpg" ||
                      file.type === "image/png" ||
                      file.type === "image/avif"
                    );
                  });

                  if (invalidFiles.length > 0) {
                    await sweetMixinErrorAlert(
                      t("mypage.upload360.invalidTypes", {
                        count: invalidFiles.length,
                      })
                    );
                  }

                  if (validFiles.length === 0) {
                    return;
                  }

                  if (validFiles.length > 5) {
                    await sweetMixinErrorAlert(t("mypage.upload360.limit"));
                    return;
                  }

                  const maxSize = 10 * 1024 * 1024;
                  const oversizedFiles = validFiles.filter(
                    (file: File) => file.size > maxSize
                  );

                  if (oversizedFiles.length > 0) {
                    await sweetMixinErrorAlert(
                      t("mypage.upload360.maxSize", {
                        count: oversizedFiles.length,
                      })
                    );
                    return;
                  }

                  if (car360Ref.current) {
                    const dataTransfer = new DataTransfer();
                    validFiles.forEach((file: File) =>
                      dataTransfer.items.add(file)
                    );
                    car360Ref.current.files = dataTransfer.files;
                    await upload360Images();
                  }
                } catch (error: unknown) {
                  const err = error as Error;
                  await sweetMixinErrorAlert(
                    t("mypage.upload.dropError", { message: err.message })
                  );
                }
              }}
            >
              <Typography
                className="drag-title"
                style={{ marginBottom: "10px" }}
              >
                {isUploading360
                  ? t("mypage.upload360.uploading")
                  : isDragOver360
                  ? t("mypage.upload360.dragTitleOver")
                  : t("mypage.upload360.dragTitleDefault")}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  className="browse-button"
                  disabled={isUploading360}
                  onClick={() => {
                    car360Ref.current?.click();
                  }}
                >
                  <Typography className="browse-button-text">
                    {isUploading360
                      ? t("mypage.uploading")
                      : t("mypage.upload360.browse")}
                  </Typography>
                  <input
                    ref={car360Ref}
                    type="file"
                    hidden={true}
                    onChange={upload360Images}
                    multiple={true}
                    accept="image/jpeg, image/jpg, image/png, image/avif"
                  />
                </Button>
                {insertCarData?.car360Images &&
                  insertCarData.car360Images.length > 0 && (
                    <Button
                      variant="outlined"
                      onClick={() => setShow360Modal(true)}
                      sx={{
                        borderColor: "#e50914",
                        color: "#ffffff",
                        "&:hover": {
                          borderColor: "#ff4455",
                          backgroundColor: "rgba(229, 9, 20, 0.08)",
                        },
                      }}
                    >
                      <Typography style={{ fontSize: "14px" }}>
                        {t("mypage.upload360.preview")}
                      </Typography>
                    </Button>
                  )}
              </Stack>
            </Stack>
            <Stack className="gallery-box">
              {insertCarData?.car360Images?.map(
                (image: string, index: number) => {
                  const imagePath: string = `${REACT_APP_API_URL}/${image}`;
                  return (
                    <Stack
                      className="image-box"
                      key={index}
                      sx={{ position: "relative" }}
                    >
                      <img src={imagePath} alt={`360° ${index + 1}`} />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          backgroundColor: "rgba(0,0,0,0.7)",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        360°
                      </Box>
                      <button
                        type="button"
                        aria-label="Remove 360 image"
                        className="remove-btn"
                        onClick={() => removeCar360Image(index)}
                      >
                        ×
                      </button>
                    </Stack>
                  );
                }
              )}
            </Stack>
          </Stack>

          {/* Videos Upload Section */}
          <Typography className="upload-title">
            {t("mypage.uploadVideo.title")}
          </Typography>
          <Stack className="images-box">
            <Stack
              className={`upload-box ${isDragOverVideo ? "drag-over" : ""}`}
              onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isDragOverVideo) {
                  setIsDragOverVideo(true);
                }
              }}
              onDragEnter={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOverVideo(true);
              }}
              onDragLeave={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;

                if (
                  x < rect.left ||
                  x > rect.right ||
                  y < rect.top ||
                  y > rect.bottom
                ) {
                  setIsDragOverVideo(false);
                }
              }}
              onDrop={async (e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOverVideo(false);

                try {
                  const files = Array.from(e.dataTransfer.files);

                  if (files.length === 0) {
                    await sweetMixinErrorAlert(
                      t("mypage.uploadVideo.noFilesDropped")
                    );
                    return;
                  }

                  const validFiles = files.filter((file: File) => {
                    return (
                      file.type === "video/mp4" ||
                      file.type === "video/webm" ||
                      file.type === "video/quicktime" ||
                      file.type === "video/ogg" ||
                      file.type === "video/x-matroska" ||
                      file.type === "video/3gpp"
                    );
                  });

                  const invalidFiles = files.filter((file: File) => {
                    return !(
                      file.type === "video/mp4" ||
                      file.type === "video/webm" ||
                      file.type === "video/quicktime" ||
                      file.type === "video/ogg" ||
                      file.type === "video/x-matroska" ||
                      file.type === "video/3gpp"
                    );
                  });

                  if (invalidFiles.length > 0) {
                    await sweetMixinErrorAlert(
                      t("mypage.uploadVideo.invalidTypes", {
                        count: invalidFiles.length,
                      })
                    );
                  }

                  if (validFiles.length === 0) {
                    return;
                  }

                  if (validFiles.length > 5) {
                    await sweetMixinErrorAlert(t("mypage.uploadVideo.limit"));
                    return;
                  }

                  const maxSize = 200 * 1024 * 1024;
                  const oversizedFiles = validFiles.filter(
                    (file: File) => file.size > maxSize
                  );

                  if (oversizedFiles.length > 0) {
                    await sweetMixinErrorAlert(
                      t("mypage.uploadVideo.maxSize", {
                        count: oversizedFiles.length,
                      })
                    );
                    return;
                  }

                  if (videoRef.current) {
                    const dataTransfer = new DataTransfer();
                    validFiles.forEach((file: File) =>
                      dataTransfer.items.add(file)
                    );
                    videoRef.current.files = dataTransfer.files;
                    await uploadVideos();
                  }
                } catch (error: unknown) {
                  const err = error as Error;
                  await sweetMixinErrorAlert(
                    t("mypage.uploadVideo.dropError", {
                      message: err.message,
                    })
                  );
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="121"
                height="120"
                viewBox="0 0 121 120"
                fill="none"
              >
                <g clipPath="url(#clip0_video)">
                  <path
                    d="M100.975 120.003C100.418 120.057 99.8558 119.994 99.3247 119.818C98.7935 119.642 98.3051 119.357 97.8907 118.98C97.4763 118.604 97.1452 118.146 96.9186 117.634C96.6921 117.122 96.575 116.569 96.575 116.009C96.575 115.45 96.6921 114.896 96.9186 114.385C97.1452 113.873 97.4763 113.414 97.8907 113.038C98.3051 112.662 98.7935 112.377 99.3247 112.201C99.8558 112.025 100.418 111.962 100.975 112.016C104.158 112.016 107.21 110.751 109.46 108.501C111.711 106.25 112.975 103.198 112.975 100.016V19.9906C112.975 16.808 111.711 13.7558 109.46 11.5053C107.21 9.25491 104.158 7.99063 100.975 7.99063H36.9624C36.4055 8.04466 35.8433 7.98159 35.3122 7.80547C34.781 7.62935 34.2926 7.34408 33.8782 6.96797C33.4638 6.59186 33.1327 6.13324 32.9061 5.62156C32.6796 5.10989 32.5625 4.55648 32.5625 3.99688C32.5625 3.43728 32.6796 2.88386 32.9061 2.37219C33.1327 1.86051 33.4638 1.40189 33.8782 1.02578C34.2926 0.649674 34.781 0.364397 35.3122 0.188277C35.8433 0.0121578 36.4055 -0.05091 36.9624 0.00312538H100.975C106.273 0.0130374 111.351 2.12204 115.097 5.86828C118.844 9.61451 120.953 14.6927 120.962 19.9906V100.016C120.953 105.314 118.844 110.392 115.097 114.138C111.351 117.884 106.273 119.993 100.975 120.003Z"
                    fill="#DDDDDD"
                  />
                  <path d="M75 45L50 60L75 75V45Z" fill="#DDDDDD" />
                  <circle
                    cx="60"
                    cy="60"
                    r="25"
                    stroke="#DDDDDD"
                    strokeWidth="3"
                    fill="none"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_video">
                    <rect
                      width="120"
                      height="120"
                      fill="white"
                      transform="translate(0.960938)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <Stack className="text-box">
                <Typography className="drag-title">
                  {isUploadingVideo
                    ? t("mypage.uploadVideo.uploading")
                    : isDragOverVideo
                    ? t("mypage.uploadVideo.dragTitleOver")
                    : t("mypage.uploadVideo.dragTitleDefault")}
                </Typography>
                <Typography className="format-title">
                  {t("mypage.uploadVideo.formatTitle")}
                </Typography>
              </Stack>
              <Button
                className="browse-button"
                disabled={isUploadingVideo}
                onClick={() => {
                  videoRef.current?.click();
                }}
              >
                <Typography className="browse-button-text">
                  {isUploadingVideo
                    ? t("mypage.uploadVideo.uploading")
                    : t("mypage.uploadVideo.browse")}
                </Typography>
                <input
                  ref={videoRef}
                  type="file"
                  hidden={true}
                  onChange={uploadVideos}
                  multiple={true}
                  accept="video/mp4, video/webm, video/quicktime, video/ogg, video/x-matroska, video/3gpp, .mp4, .webm, .mov, .ogg, .mkv, .3gp"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g clipPath="url(#clip0_7309_3249)">
                    <path
                      d="M15.5556 0H5.7778C5.53214 0 5.33334 0.198792 5.33334 0.444458C5.33334 0.690125 5.53214 0.888917 5.7778 0.888917H14.4827L0.130219 15.2413C-0.0434062 15.415 -0.0434062 15.6962 0.130219 15.8698C0.21701 15.9566 0.33076 16 0.444469 16C0.558177 16 0.671885 15.9566 0.758719 15.8698L15.1111 1.51737V10.2222C15.1111 10.4679 15.3099 10.6667 15.5556 10.6667C15.8013 10.6667 16.0001 10.4679 16.0001 10.2222V0.444458C16 0.198792 15.8012 0 15.5556 0Z"
                      fill="#181A20"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_7309_3249">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </Button>
            </Stack>
            <Stack className="gallery-box">
              {(insertCarData?.carVideos || []).length > 0 ? (
                (insertCarData.carVideos || []).map(
                  (video: string, index: number) => {
                    const videoPath: string = `${REACT_APP_API_URL}/${video}`;
                    return (
                      <Stack
                        className="image-box video-box"
                        key={index}
                        sx={{ position: "relative" }}
                      >
                        <video
                          src={videoPath}
                          controls
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            backgroundColor: "rgba(0,0,0,0.7)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          VIDEO
                        </Box>
                        <button
                          type="button"
                          aria-label="Remove video"
                          className="remove-btn"
                          onClick={() => removeCarVideo(index)}
                        >
                          ×
                        </button>
                      </Stack>
                    );
                  }
                )
              ) : (
                <Typography className="empty-text">
                  {t("mypage.uploadVideo.empty")}
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* PNG Upload Section */}
          <Typography className="upload-title">Upload Car PNG Image</Typography>
          <Stack className="images-box">
            <Stack
              className={`upload-box ${isDragOverPng ? "drag-over" : ""}`}
              onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isDragOverPng) {
                  setIsDragOverPng(true);
                }
              }}
              onDragEnter={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOverPng(true);
              }}
              onDragLeave={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;

                if (
                  x < rect.left ||
                  x > rect.right ||
                  y < rect.top ||
                  y > rect.bottom
                ) {
                  setIsDragOverPng(false);
                }
              }}
              onDrop={async (e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOverPng(false);

                try {
                  const files = Array.from(e.dataTransfer.files);

                  if (files.length === 0) {
                    await sweetMixinErrorAlert(
                      t("mypage.uploadPng.noFilesDropped")
                    );
                    return;
                  }

                  const validFiles = files.filter((file: File) => {
                    return file.type === "image/png";
                  });

                  const invalidFiles = files.filter((file: File) => {
                    return file.type !== "image/png";
                  });

                  if (invalidFiles.length > 0) {
                    await sweetMixinErrorAlert(
                      t("mypage.uploadPng.invalidTypes", {
                        count: invalidFiles.length,
                      })
                    );
                  }

                  if (validFiles.length === 0) {
                    return;
                  }

                  if (validFiles.length > 1) {
                    await sweetMixinErrorAlert(t("mypage.uploadPng.limit"));
                    return;
                  }

                  const maxSize = 10 * 1024 * 1024;
                  const oversizedFiles = validFiles.filter(
                    (file: File) => file.size > maxSize
                  );

                  if (oversizedFiles.length > 0) {
                    await sweetMixinErrorAlert(
                      t("mypage.uploadPng.maxSize", {
                        count: oversizedFiles.length,
                      })
                    );
                    return;
                  }

                  if (pngRef.current) {
                    const dataTransfer = new DataTransfer();
                    validFiles.forEach((file: File) =>
                      dataTransfer.items.add(file)
                    );
                    pngRef.current.files = dataTransfer.files;
                    await uploadPngImage();
                  }
                } catch (error: unknown) {
                  const err = error as Error;
                  await sweetMixinErrorAlert(
                    t("mypage.uploadPng.dropError", {
                      message: err.message,
                    })
                  );
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="121"
                height="120"
                viewBox="0 0 121 120"
                fill="none"
              >
                <g clipPath="url(#clip0_png)">
                  <path
                    d="M100.975 120.003C100.418 120.057 99.8558 119.994 99.3247 119.818C98.7935 119.642 98.3051 119.357 97.8907 118.98C97.4763 118.604 97.1452 118.146 96.9186 117.634C96.6921 117.122 96.575 116.569 96.575 116.009C96.575 115.45 96.6921 114.896 96.9186 114.385C97.1452 113.873 97.4763 113.414 97.8907 113.038C98.3051 112.662 98.7935 112.377 99.3247 112.201C99.8558 112.025 100.418 111.962 100.975 112.016C104.158 112.016 107.21 110.751 109.46 108.501C111.711 106.25 112.975 103.198 112.975 100.016V19.9906C112.975 16.808 111.711 13.7558 109.46 11.5053C107.21 9.25491 104.158 7.99063 100.975 7.99063H36.9624C36.4055 8.04466 35.8433 7.98159 35.3122 7.80547C34.781 7.62935 34.2926 7.34408 33.8782 6.96797C33.4638 6.59186 33.1327 6.13324 32.9061 5.62156C32.6796 5.10989 32.5625 4.55648 32.5625 3.99688C32.5625 3.43728 32.6796 2.88386 32.9061 2.37219C33.1327 1.86051 33.4638 1.40189 33.8782 1.02578C34.2926 0.649674 34.781 0.364397 35.3122 0.188277C35.8433 0.0121578 36.4055 -0.05091 36.9624 0.00312538H100.975C106.273 0.0130374 111.351 2.12204 115.097 5.86828C118.844 9.61451 120.953 14.6927 120.962 19.9906V100.016C120.953 105.314 118.844 110.392 115.097 114.138C111.351 117.884 106.273 119.993 100.975 120.003Z"
                    fill="#DDDDDD"
                  />
                  <rect
                    x="30"
                    y="30"
                    width="60"
                    height="60"
                    rx="8"
                    fill="#DDDDDD"
                    stroke="#AAAAAA"
                    strokeWidth="2"
                  />
                  <text
                    x="60"
                    y="65"
                    textAnchor="middle"
                    fill="#666666"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    PNG
                  </text>
                </g>
                <defs>
                  <clipPath id="clip0_png">
                    <rect
                      width="120"
                      height="120"
                      fill="white"
                      transform="translate(0.960938)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <Stack className="text-box">
                <Typography className="drag-title">
                  {isUploadingPng
                    ? "Uploading PNG..."
                    : isDragOverPng
                    ? "Drop PNG image here"
                    : "Drag & drop PNG image here"}
                </Typography>
                <Typography className="format-title">
                  PNG format only
                </Typography>
              </Stack>
              <Button
                className="browse-button"
                disabled={isUploadingPng}
                onClick={() => {
                  pngRef.current?.click();
                }}
              >
                <Typography className="browse-button-text">
                  {isUploadingPng ? "Uploading..." : "Browse Files"}
                </Typography>
                <input
                  ref={pngRef}
                  type="file"
                  hidden={true}
                  onChange={uploadPngImage}
                  multiple={false}
                  accept="image/png"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g clipPath="url(#clip0_7309_3249)">
                    <path
                      d="M15.5556 0H5.7778C5.53214 0 5.33334 0.198792 5.33334 0.444458C5.33334 0.690125 5.53214 0.888917 5.7778 0.888917H14.4827L0.130219 15.2413C-0.0434062 15.415 -0.0434062 15.6962 0.130219 15.8698C0.21701 15.9566 0.33076 16 0.444469 16C0.558177 16 0.671885 15.9566 0.758719 15.8698L15.1111 1.51737V10.2222C15.1111 10.4679 15.3099 10.6667 15.5556 10.6667C15.8013 10.6667 16.0001 10.4679 16.0001 10.2222V0.444458C16 0.198792 15.8012 0 15.5556 0Z"
                      fill="#181A20"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_7309_3249">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </Button>
            </Stack>
            <Stack className="gallery-box">
              {insertCarData?.carPngImage ? (
                <Stack className="image-box" sx={{ position: "relative" }}>
                  <img
                    src={`${REACT_APP_API_URL}/${insertCarData.carPngImage}`}
                    alt="Car PNG"
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    PNG
                  </Box>
                  <button
                    type="button"
                    aria-label="Remove PNG image"
                    className="remove-btn"
                    onClick={removeCarPngImage}
                  >
                    ×
                  </button>
                </Stack>
              ) : (
                <Typography className="empty-text">
                  No PNG image uploaded
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* Background Upload Section */}
          <Typography className="upload-title">
            Upload Background Image
          </Typography>
          <Stack className="images-box">
            <Stack
              className={`upload-box ${
                isDragOverBackground ? "drag-over" : ""
              }`}
              onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isDragOverBackground) {
                  setIsDragOverBackground(true);
                }
              }}
              onDragEnter={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOverBackground(true);
              }}
              onDragLeave={(e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;

                if (
                  x < rect.left ||
                  x > rect.right ||
                  y < rect.top ||
                  y > rect.bottom
                ) {
                  setIsDragOverBackground(false);
                }
              }}
              onDrop={async (e: React.DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOverBackground(false);

                try {
                  const files = Array.from(e.dataTransfer.files);

                  if (files.length === 0) {
                    await sweetMixinErrorAlert(
                      t("mypage.uploadBackground.noFilesDropped")
                    );
                    return;
                  }

                  const validFiles = files.filter((file: File) => {
                    return (
                      file.type === "image/jpeg" ||
                      file.type === "image/jpg" ||
                      file.type === "image/png" ||
                      file.type === "image/avif"
                    );
                  });

                  const invalidFiles = files.filter((file: File) => {
                    return !(
                      file.type === "image/jpeg" ||
                      file.type === "image/jpg" ||
                      file.type === "image/png" ||
                      file.type === "image/avif"
                    );
                  });

                  if (invalidFiles.length > 0) {
                    await sweetMixinErrorAlert(
                      t("mypage.uploadBackground.invalidTypes", {
                        count: invalidFiles.length,
                      })
                    );
                  }

                  if (validFiles.length === 0) {
                    return;
                  }

                  if (validFiles.length > 1) {
                    await sweetMixinErrorAlert(
                      t("mypage.uploadBackground.limit")
                    );
                    return;
                  }

                  const maxSize = 10 * 1024 * 1024;
                  const oversizedFiles = validFiles.filter(
                    (file: File) => file.size > maxSize
                  );

                  if (oversizedFiles.length > 0) {
                    await sweetMixinErrorAlert(
                      t("mypage.uploadBackground.maxSize", {
                        count: oversizedFiles.length,
                      })
                    );
                    return;
                  }

                  if (backgroundRef.current) {
                    const dataTransfer = new DataTransfer();
                    validFiles.forEach((file: File) =>
                      dataTransfer.items.add(file)
                    );
                    backgroundRef.current.files = dataTransfer.files;
                    await uploadBackgroundImage();
                  }
                } catch (error: unknown) {
                  const err = error as Error;
                  await sweetMixinErrorAlert(
                    t("mypage.uploadBackground.dropError", {
                      message: err.message,
                    })
                  );
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="121"
                height="120"
                viewBox="0 0 121 120"
                fill="none"
              >
                <g clipPath="url(#clip0_background)">
                  <path
                    d="M100.975 120.003C100.418 120.057 99.8558 119.994 99.3247 119.818C98.7935 119.642 98.3051 119.357 97.8907 118.98C97.4763 118.604 97.1452 118.146 96.9186 117.634C96.6921 117.122 96.575 116.569 96.575 116.009C96.575 115.45 96.6921 114.896 96.9186 114.385C97.1452 113.873 97.4763 113.414 97.8907 113.038C98.3051 112.662 98.7935 112.377 99.3247 112.201C99.8558 112.025 100.418 111.962 100.975 112.016C104.158 112.016 107.21 110.751 109.46 108.501C111.711 106.25 112.975 103.198 112.975 100.016V19.9906C112.975 16.808 111.711 13.7558 109.46 11.5053C107.21 9.25491 104.158 7.99063 100.975 7.99063H36.9624C36.4055 8.04466 35.8433 7.98159 35.3122 7.80547C34.781 7.62935 34.2926 7.34408 33.8782 6.96797C33.4638 6.59186 33.1327 6.13324 32.9061 5.62156C32.6796 5.10989 32.5625 4.55648 32.5625 3.99688C32.5625 3.43728 32.6796 2.88386 32.9061 2.37219C33.1327 1.86051 33.4638 1.40189 33.8782 1.02578C34.2926 0.649674 34.781 0.364397 35.3122 0.188277C35.8433 0.0121578 36.4055 -0.05091 36.9624 0.00312538H100.975C106.273 0.0130374 111.351 2.12204 115.097 5.86828C118.844 9.61451 120.953 14.6927 120.962 19.9906V100.016C120.953 105.314 118.844 110.392 115.097 114.138C111.351 117.884 106.273 119.993 100.975 120.003Z"
                    fill="#DDDDDD"
                  />
                  <rect
                    x="20"
                    y="20"
                    width="80"
                    height="80"
                    rx="12"
                    fill="#CCCCCC"
                    stroke="#AAAAAA"
                    strokeWidth="2"
                  />
                  <rect x="30" y="30" width="60" height="40" fill="#DDDDDD" />
                  <rect
                    x="35"
                    y="75"
                    width="50"
                    height="15"
                    rx="4"
                    fill="#DDDDDD"
                  />
                  <text
                    x="60"
                    y="85"
                    textAnchor="middle"
                    fill="#666666"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    BACKGROUND
                  </text>
                </g>
                <defs>
                  <clipPath id="clip0_background">
                    <rect
                      width="120"
                      height="120"
                      fill="white"
                      transform="translate(0.960938)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <Stack className="text-box">
                <Typography className="drag-title">
                  {isUploadingBackground
                    ? "Uploading Background..."
                    : isDragOverBackground
                    ? "Drop background image here"
                    : "Drag & drop background image here"}
                </Typography>
                <Typography className="format-title">
                  JPG, PNG, or AVIF format
                </Typography>
              </Stack>
              <Button
                className="browse-button"
                disabled={isUploadingBackground}
                onClick={() => {
                  backgroundRef.current?.click();
                }}
              >
                <Typography className="browse-button-text">
                  {isUploadingBackground ? "Uploading..." : "Browse Files"}
                </Typography>
                <input
                  ref={backgroundRef}
                  type="file"
                  hidden={true}
                  onChange={uploadBackgroundImage}
                  multiple={false}
                  accept="image/jpeg, image/jpg, image/png, image/avif"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <g clipPath="url(#clip0_7309_3249)">
                    <path
                      d="M15.5556 0H5.7778C5.53214 0 5.33334 0.198792 5.33334 0.444458C5.33334 0.690125 5.53214 0.888917 5.7778 0.888917H14.4827L0.130219 15.2413C-0.0434062 15.415 -0.0434062 15.6962 0.130219 15.8698C0.21701 15.9566 0.33076 16 0.444469 16C0.558177 16 0.671885 15.9566 0.758719 15.8698L15.1111 1.51737V10.2222C15.1111 10.4679 15.3099 10.6667 15.5556 10.6667C15.8013 10.6667 16.0001 10.4679 16.0001 10.2222V0.444458C16 0.198792 15.8012 0 15.5556 0Z"
                      fill="#181A20"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_7309_3249">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </Button>
            </Stack>
            <Stack className="gallery-box">
              {insertCarData?.carBackgroundImage ? (
                <Stack className="image-box" sx={{ position: "relative" }}>
                  <img
                    src={`${REACT_APP_API_URL}/${insertCarData.carBackgroundImage}`}
                    alt="Car Background"
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      backgroundColor: "rgba(0,0,0,0.7)",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    BG
                  </Box>
                  <button
                    type="button"
                    aria-label="Remove background image"
                    className="remove-btn"
                    onClick={removeCarBackgroundImage}
                  >
                    ×
                  </button>
                </Stack>
              ) : (
                <Typography className="empty-text">
                  No background image uploaded
                </Typography>
              )}
            </Stack>
          </Stack>

          <Stack className="buttons-row">
            {carId ? (
              <Button
                className="next-button"
                disabled={doDisabledCheck()}
                onClick={updateCarHandler}
              >
                <Typography className="next-button-text">
                  {t("mypage.actions.updateCar")}
                </Typography>
              </Button>
            ) : (
              <Button
                className="next-button"
                disabled={doDisabledCheck()}
                onClick={insertCarHandler}
              >
                <Typography className="next-button-text">
                  {t("mypage.actions.createCar")}
                </Typography>
              </Button>
            )}
          </Stack>
        </Stack>
      </div>

      <Panorama360Modal
        open={show360Modal}
        onClose={() => setShow360Modal(false)}
        images={insertCarData?.car360Images || []}
      />
    </div>
  );
};

AddNewCar.defaultProps = {
  initialValues: {
    carTitle: "",
    carPrice: 0,
    carType: undefined,
    carLocation: undefined,
    carAddress: "",
    carTradeIn: false,
    carLease: false,
    carSeats: 0,
    carYear: 0,
    carMileage: 0,
    carDesc: "",
    carImages: [],
    car360Images: [],
    carVideos: [],
    carPngImage: "",
    carBackgroundImage: "",
    manufacturedAt: undefined,
  },
};

export default AddNewCar;
