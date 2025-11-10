import React, { useCallback, useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Checkbox,
  Button,
  OutlinedInput,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  Chip,
  Box,
  Slider,
  styled,
} from "@mui/material";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { CarLocation, CarType } from "../../enums/car.enum";
import { CarsInquiry } from "../../types/car/car.input";
import { useRouter } from "next/router";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { carMileage } from "../../config";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTranslation } from "react-i18next";
import TuneIcon from "@mui/icons-material/Tune";
import SpeedIcon from "@mui/icons-material/Speed";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: "200px",
      background: "var(--bg-paper)",
      border: "1px solid rgba(229, 9, 20, 0.3)",
    },
  },
};

// Styled components for futuristic look
const DashboardPanel = styled(Box)(({ theme }) => ({
  background:
    "linear-gradient(135deg, rgba(229, 9, 20, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(229, 9, 20, 0.2)",
  borderRadius: "16px",
  padding: "24px 32px",
  boxShadow:
    "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(229, 9, 20, 0.1)",
  position: "relative",
  overflow: "hidden",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, transparent, #E50914, transparent)",
    animation: "scan 3s linear infinite",
  },

  "@keyframes scan": {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(100%)" },
  },
}));

const FilterSection = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  minWidth: "140px",
});

const SectionLabel = styled(Typography)({
  color: "rgba(229, 9, 20, 0.9)",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  marginBottom: "4px",

  "& .MuiSvgIcon-root": {
    fontSize: "14px",
  },
});

const StyledButton = styled(Button)({
  minWidth: "60px",
  height: "36px",
  borderRadius: "8px",
  border: "1px solid rgba(229, 9, 20, 0.3)",
  background: "rgba(0, 0, 0, 0.3)",
  color: "var(--text-primary)",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "none",
  transition: "all 0.3s ease",

  "&:hover": {
    background: "rgba(229, 9, 20, 0.15)",
    border: "1px solid rgba(229, 9, 20, 0.6)",
    boxShadow: "0 0 20px rgba(229, 9, 20, 0.3)",
  },

  "&.active": {
    background:
      "linear-gradient(135deg, rgba(229, 9, 20, 0.4) 0%, rgba(229, 9, 20, 0.2) 100%)",
    border: "1px solid #E50914",
    boxShadow:
      "0 0 15px rgba(229, 9, 20, 0.5), inset 0 0 10px rgba(229, 9, 20, 0.2)",
  },
});

const StyledSelect = styled(Select)({
  height: "36px",
  borderRadius: "8px",
  background: "rgba(0, 0, 0, 0.4)",
  color: "var(--text-primary)",
  fontSize: "13px",

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(229, 9, 20, 0.3)",
  },

  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(229, 9, 20, 0.6)",
  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#E50914",
    boxShadow: "0 0 15px rgba(229, 9, 20, 0.4)",
  },
});

const StyledInput = styled(OutlinedInput)({
  height: "36px",
  borderRadius: "8px",
  background: "rgba(0, 0, 0, 0.4)",
  color: "var(--text-primary)",
  fontSize: "13px",

  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(229, 9, 20, 0.3)",
  },

  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(229, 9, 20, 0.6)",
  },

  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#E50914",
    boxShadow: "0 0 15px rgba(229, 9, 20, 0.4)",
  },
});

const StyledSlider = styled(Slider)({
  color: "#E50914",
  height: 4,

  "& .MuiSlider-track": {
    border: "none",
    background: "linear-gradient(90deg, #E50914, #ff4444)",
  },

  "& .MuiSlider-thumb": {
    height: 16,
    width: 16,
    backgroundColor: "#E50914",
    border: "2px solid currentColor",
    boxShadow: "0 0 10px rgba(229, 9, 20, 0.8)",

    "&:hover, &.Mui-focusVisible": {
      boxShadow: "0 0 20px rgba(229, 9, 20, 1)",
    },
  },
});

interface FilterType {
  searchFilter: CarsInquiry;
  setSearchFilter: any;
  initialInput: CarsInquiry;
}

const Filter = (props: FilterType) => {
  const { searchFilter, setSearchFilter, initialInput } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const { t } = useTranslation("common");
  const [carLocation, setCarLocation] = useState<CarLocation[]>(
    Object.values(CarLocation)
  );
  const [carType, setCarType] = useState<CarType[]>(Object.values(CarType));
  const [searchText, setSearchText] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([
    searchFilter?.search?.pricesRange?.start ?? 0,
    searchFilter?.search?.pricesRange?.end ?? 200000,
  ]);
  const [mileageRange, setMileageRange] = useState<number[]>([
    searchFilter?.search?.mileageRange?.start ?? 0,
    searchFilter?.search?.mileageRange?.end ?? 500,
  ]);

  useEffect(() => {
    const keysToCheck = [
      "locationList",
      "typeList",
      "seatsList",
      "options",
      "yearsList",
    ] as const;
    let updated = false;
    const newSearchFilter = {
      ...searchFilter,
      search: { ...searchFilter.search },
    };
    keysToCheck.forEach((key) => {
      const arr = (newSearchFilter.search as Record<typeof key, unknown>)[key];
      if (Array.isArray(arr) && arr.length === 0) {
        delete (newSearchFilter.search as Record<typeof key, unknown>)[key];
        updated = true;
      }
    });
    if (updated) {
      router
        .push(
          `/car?input=${JSON.stringify(newSearchFilter)}`,
          `/car?input=${JSON.stringify(newSearchFilter)}`,
          { scroll: false }
        )
        .then();
    }
  }, [searchFilter]);

  const handleLocationToggle = useCallback(
    async (location: string) => {
      const currentList = searchFilter?.search?.locationList || [];
      const newList = currentList.includes(location as CarLocation)
        ? currentList.filter((l: string) => l !== location)
        : [...currentList, location];

      await router.push(
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            locationList: newList.length ? newList : undefined,
          },
        })}`,
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            locationList: newList.length ? newList : undefined,
          },
        })}`,
        { scroll: false }
      );
    },
    [searchFilter, router]
  );

  const handleTypeToggle = useCallback(
    async (type: string) => {
      const currentList = searchFilter?.search?.typeList || [];
      const newList = currentList.includes(type as CarType)
        ? currentList.filter((t: string) => t !== type)
        : [...currentList, type];

      await router.push(
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            typeList: newList.length ? newList : undefined,
          },
        })}`,
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            typeList: newList.length ? newList : undefined,
          },
        })}`,
        { scroll: false }
      );
    },
    [searchFilter, router]
  );

  const handleSeatsToggle = useCallback(
    async (seats: number) => {
      const currentList = searchFilter?.search?.seatsList || [];
      const newList = currentList.includes(seats)
        ? currentList.filter((s: number) => s !== seats)
        : [...currentList, seats];

      await router.push(
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            seatsList: newList.length ? newList : undefined,
          },
        })}`,
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            seatsList: newList.length ? newList : undefined,
          },
        })}`,
        { scroll: false }
      );
    },
    [searchFilter, router]
  );

  const handleYearToggle = useCallback(
    async (year: number) => {
      const currentList = searchFilter?.search?.yearsList || [];
      const newList = currentList.includes(year)
        ? currentList.filter((y: number) => y !== year)
        : [...currentList, year];

      await router.push(
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            yearsList: newList.length ? newList : undefined,
          },
        })}`,
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            yearsList: newList.length ? newList : undefined,
          },
        })}`,
        { scroll: false }
      );
    },
    [searchFilter, router]
  );

  const handlePriceChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      setPriceRange(newValue as number[]);
    },
    []
  );

  const handlePriceCommit = useCallback(
    async (event: any, newValue: number | number[]) => {
      const [start, end] = newValue as number[];
      await router.push(
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            pricesRange: { start, end },
          },
        })}`,
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            pricesRange: { start, end },
          },
        })}`,
        { scroll: false }
      );
    },
    [searchFilter, router]
  );

  const handleMileageChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      setMileageRange(newValue as number[]);
    },
    []
  );

  const handleMileageCommit = useCallback(
    async (event: any, newValue: number | number[]) => {
      const [start, end] = newValue as number[];
      await router.push(
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            mileageRange: { start, end },
          },
        })}`,
        `/car?input=${JSON.stringify({
          ...searchFilter,
          search: {
            ...searchFilter.search,
            mileageRange: { start, end },
          },
        })}`,
        { scroll: false }
      );
    },
    [searchFilter, router]
  );

  const refreshHandler = useCallback(async () => {
    try {
      setSearchText("");
      setPriceRange([0, 200000]);
      setMileageRange([0, 500]);
      await router.push(
        `/car?input=${JSON.stringify(initialInput)}`,
        `/car?input=${JSON.stringify(initialInput)}`,
        { scroll: false }
      );
    } catch (err: any) {
      console.error("ERROR, refreshHandler:", err);
    }
  }, [router, initialInput]);

  if (device === "mobile") {
    return <div>CARS FILTER</div>;
  }

  return (
    <DashboardPanel className="futuristic-filter">
      <Stack
        direction="row"
        spacing={3}
        alignItems="flex-start"
        flexWrap="wrap"
      >
        {/* Search Section */}
        <FilterSection sx={{ minWidth: "240px", flex: 1 }}>
          <SectionLabel>
            <TuneIcon /> {t("filter.search")}
          </SectionLabel>
          <StyledInput
            value={searchText}
            type="text"
            placeholder={t("filter.placeholder")}
            onChange={(e: any) => setSearchText(e.target.value)}
            onKeyDown={(event: any) => {
              if (event.key === "Enter") {
                setSearchFilter({
                  ...searchFilter,
                  search: { ...searchFilter.search, text: searchText },
                });
              }
            }}
            endAdornment={
              <IconButton size="small" onClick={() => setSearchText("")}>
                <CancelRoundedIcon
                  sx={{ fontSize: "18px", color: "#E50914" }}
                />
              </IconButton>
            }
          />
        </FilterSection>

        {/* Location Section */}
        <FilterSection>
          <SectionLabel>
            <LocationOnIcon /> {t("filter.location")}
          </SectionLabel>
          <Stack direction="row" gap={0.5} flexWrap="wrap">
            {carLocation.slice(0, 4).map((location: string) => (
              <StyledButton
                key={location}
                size="small"
                className={
                  (searchFilter?.search?.locationList || []).includes(
                    location as CarLocation
                  )
                    ? "active"
                    : ""
                }
                onClick={() => handleLocationToggle(location)}
              >
                {location}
              </StyledButton>
            ))}
          </Stack>
        </FilterSection>

        {/* Car Type Section */}
        <FilterSection>
          <SectionLabel>
            <DirectionsCarIcon /> {t("filter.carType")}
          </SectionLabel>
          <Stack direction="row" gap={0.5} flexWrap="wrap">
            {carType.slice(0, 4).map((type: string) => (
              <StyledButton
                key={type}
                size="small"
                className={
                  (searchFilter?.search?.typeList || []).includes(
                    type as CarType
                  )
                    ? "active"
                    : ""
                }
                onClick={() => handleTypeToggle(type)}
              >
                {type}
              </StyledButton>
            ))}
          </Stack>
        </FilterSection>

        {/* Seats Section */}
        <FilterSection>
          <SectionLabel>
            <EventSeatIcon /> {t("car.seats")}
          </SectionLabel>
          <Stack direction="row" gap={0.5}>
            {[2, 4, 5, 7].map((seats) => (
              <StyledButton
                key={seats}
                size="small"
                className={
                  (searchFilter?.search?.seatsList || []).includes(seats)
                    ? "active"
                    : ""
                }
                onClick={() => handleSeatsToggle(seats)}
              >
                {seats}+
              </StyledButton>
            ))}
          </Stack>
        </FilterSection>

        {/* Year Section */}
        <FilterSection>
          <SectionLabel>
            <CalendarTodayIcon /> {t("filter.yearRange")}
          </SectionLabel>
          <Stack direction="row" gap={0.5}>
            {[1, 2, 3, 5].map((year) => (
              <StyledButton
                key={year}
                size="small"
                className={
                  (searchFilter?.search?.yearsList || []).includes(year)
                    ? "active"
                    : ""
                }
                onClick={() => handleYearToggle(year)}
              >
                {year}y
              </StyledButton>
            ))}
          </Stack>
        </FilterSection>

        {/* Price Range Section */}
        <FilterSection sx={{ minWidth: "200px" }}>
          <SectionLabel>
            <AttachMoneyIcon /> {t("filter.priceRange")}
          </SectionLabel>
          <Box sx={{ px: 1 }}>
            <StyledSlider
              value={priceRange}
              onChange={handlePriceChange}
              onChangeCommitted={handlePriceCommit}
              valueLabelDisplay="auto"
              min={0}
              max={200000}
              step={5000}
              valueLabelFormat={(value) => `$${value.toLocaleString()}`}
            />
            <Stack direction="row" justifyContent="space-between" mt={0.5}>
              <Typography
                sx={{ fontSize: "10px", color: "rgba(229, 9, 20, 0.7)" }}
              >
                ${priceRange[0].toLocaleString()}
              </Typography>
              <Typography
                sx={{ fontSize: "10px", color: "rgba(229, 9, 20, 0.7)" }}
              >
                ${priceRange[1].toLocaleString()}
              </Typography>
            </Stack>
          </Box>
        </FilterSection>

        {/* Mileage Range Section */}
        <FilterSection sx={{ minWidth: "200px" }}>
          <SectionLabel>
            <SpeedIcon /> {t("filter.mileage")}
          </SectionLabel>
          <Box sx={{ px: 1 }}>
            <StyledSlider
              value={mileageRange}
              onChange={handleMileageChange}
              onChangeCommitted={handleMileageCommit}
              valueLabelDisplay="auto"
              min={0}
              max={500}
              step={10}
              valueLabelFormat={(value) => `${value}k km`}
            />
            <Stack direction="row" justifyContent="space-between" mt={0.5}>
              <Typography
                sx={{ fontSize: "10px", color: "rgba(229, 9, 20, 0.7)" }}
              >
                {mileageRange[0]}k km
              </Typography>
              <Typography
                sx={{ fontSize: "10px", color: "rgba(229, 9, 20, 0.7)" }}
              >
                {mileageRange[1]}k km
              </Typography>
            </Stack>
          </Box>
        </FilterSection>

        {/* Reset Button */}
        <FilterSection sx={{ minWidth: "auto", justifyContent: "flex-end" }}>
          <Tooltip title={t("filter.reset")}>
            <IconButton
              onClick={refreshHandler}
              sx={{
                color: "#E50914",
                border: "1px solid rgba(229, 9, 20, 0.3)",
                borderRadius: "8px",
                mt: "20px",
                "&:hover": {
                  background: "rgba(229, 9, 20, 0.15)",
                  boxShadow: "0 0 20px rgba(229, 9, 20, 0.3)",
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </FilterSection>
      </Stack>
    </DashboardPanel>
  );
};

export default Filter;
