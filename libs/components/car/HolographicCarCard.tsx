// HolographicCarCard.tsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Heart,
  Eye,
  Calendar,
  Users,
  Gauge,
  X,
  Filter,
  Move,
} from "lucide-react";
import { Car } from "../../types/car/car";
import { CarsInquiry } from "../../types/car/car.input";
import { REACT_APP_API_URL, topCarRank } from "../../config";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import { CarLocation, CarType } from "../../enums/car.enum";

interface HolographicCarCardProps {
  cars: Car[];
  loading: boolean;
  error: any;
  likeCarHandler: (user: any, id: string) => Promise<void>;
  searchFilter: CarsInquiry;
  setSearchFilter: (filter: CarsInquiry) => void;
  t: (key: string) => string;
}

const HolographicCarCard: React.FC<HolographicCarCardProps> = ({
  cars,
  loading,
  error,
  likeCarHandler,
  searchFilter,
  setSearchFilter,
  t,
}) => {
  const user = useReactiveVar(userVar);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [draggedCard, setDraggedCard] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [cardPositions, setCardPositions] = useState<any[]>([]);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const locations = Object.values(CarLocation);
  const types = Object.values(CarType);

  // Generate random positions for chaotic layout
  useEffect(() => {
    const positions = cars.map((_, index) => ({
      x: Math.random() * 70 - 5,
      y: Math.random() * 60 + 10,
      rotation: Math.random() * 30 - 15,
      scale: 0.85 + Math.random() * 0.3,
      delay: index * 0.1,
    }));
    setCardPositions(positions);
  }, [cars.length]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const hasActiveFilters = useMemo(() => {
    return !!(
      searchFilter?.search?.locationList?.length ||
      searchFilter?.search?.typeList?.length ||
      searchFilter?.search?.seatsList?.length ||
      searchFilter?.search?.yearsList?.length
    );
  }, [searchFilter]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    if (hasActiveFilters) return;

    setDraggedCard(index);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      cardX: cardPositions[index]?.x || 0,
      cardY: cardPositions[index]?.y || 0,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggedCard === null || hasActiveFilters) return;

    const deltaX =
      ((e.clientX - dragStartPos.current.x) / window.innerWidth) * 100;
    const deltaY =
      ((e.clientY - dragStartPos.current.y) / window.innerHeight) * 100;

    const newPositions = [...cardPositions];
    newPositions[draggedCard] = {
      ...newPositions[draggedCard],
      x: dragStartPos.current.cardX + deltaX,
      y: dragStartPos.current.cardY + deltaY,
    };
    setCardPositions(newPositions);
  };

  const handleMouseUp = () => {
    setDraggedCard(null);
  };

  useEffect(() => {
    if (draggedCard !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [draggedCard, cardPositions]);

  const toggleFilter = (key: string, value: any) => {
    const filterKey = key as keyof typeof searchFilter.search;
    const currentList = (searchFilter.search?.[filterKey] as any[]) || [];

    const newList = currentList.includes(value)
      ? currentList.filter((item: any) => item !== value)
      : [...currentList, value];

    setSearchFilter({
      ...searchFilter,
      search: {
        ...searchFilter.search,
        [filterKey]: newList.length > 0 ? newList : undefined,
      },
    });
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          width: "100%",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <img src="/img/icons/icoAlert.svg" alt="" />
        <p>{t("common.errorLoading")}</p>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <img src="/img/icons/icoAlert.svg" alt="" />
        <p>{t("car.noResults")}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        perspective: "1200px",
        cursor: draggedCard !== null ? "grabbing" : "default",
        zIndex: 1,
      }}
    >
      <style>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 60px rgba(0, 245, 255, 0.5); }
          50% { text-shadow: 0 0 80px rgba(0, 245, 255, 0.8), 0 0 40px rgba(0, 128, 255, 0.6); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        @keyframes hologramFloat {
          0%, 100% { transform: translateY(0px) rotateX(15deg); }
          50% { transform: translateY(-15px) rotateX(18deg); }
        }
      `}</style>

      {/* Background Image */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(0.3)",
          zIndex: 0,
        }}
      />

      {/* Animated Grid Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
          linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
        `,
          backgroundSize: "50px 50px",
          animation: "gridMove 20s linear infinite",
          opacity: 0.4,
          zIndex: 1,
        }}
      />

      {/* Floating Particles */}
      {[...Array(40)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: Math.random() * 4 + 2 + "px",
            height: Math.random() * 4 + 2 + "px",
            background: `rgba(${Math.random() * 100 + 155}, ${
              Math.random() * 100 + 155
            }, 255, ${Math.random() * 0.6 + 0.2})`,
            borderRadius: "50%",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            boxShadow: `0 0 ${
              Math.random() * 20 + 10
            }px rgba(100, 200, 255, 0.5)`,
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Header */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "40px 20px 20px",
        }}
      >
        <h1
          style={{
            fontSize: "56px",
            fontWeight: "900",
            background:
              "linear-gradient(135deg, #00f5ff 0%, #0080ff 50%, #8000ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "12px",
            textShadow: "0 0 60px rgba(0, 245, 255, 0.5)",
            letterSpacing: "2px",
            animation: "glow 2s ease-in-out infinite alternate",
          }}
        >
          HOLOGRAPHIC FLEET
        </h1>
        <p
          style={{
            color: "rgba(0, 245, 255, 0.8)",
            fontSize: "16px",
            fontWeight: "500",
            letterSpacing: "3px",
            textTransform: "uppercase",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          {draggedCard !== null
            ? "🎯 Dragging..."
            : "Drag to Reposition • Click to View"}
        </p>
      </div>

      {/* Floating Filter Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        style={{
          position: "fixed",
          top: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "2px solid rgba(0, 245, 255, 0.5)",
          background: "rgba(0, 20, 40, 0.9)",
          backdropFilter: "blur(10px)",
          color: "#00f5ff",
          cursor: "pointer",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 30px rgba(0, 245, 255, 0.4)",
          transition: "all 0.3s ease",
          transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        {showFilters ? <X size={28} /> : <Filter size={28} />}
      </button>

      {/* Filter Panel */}
      {showFilters && (
        <div
          style={{
            position: "fixed",
            top: "100px",
            right: "30px",
            width: "350px",
            maxHeight: "70vh",
            overflowY: "auto",
            background: "rgba(5, 8, 16, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0, 245, 255, 0.3)",
            borderRadius: "20px",
            padding: "30px",
            zIndex: 999,
            boxShadow: "0 10px 50px rgba(0, 245, 255, 0.3)",
            animation: "slideIn 0.3s ease",
          }}
        >
          <h3
            style={{
              color: "#00f5ff",
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "20px",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            Filter Matrix
          </h3>

          {/* Location Filter */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "rgba(0, 245, 255, 0.7)",
                fontSize: "11px",
                marginBottom: "8px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              Location
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => toggleFilter("locationList", loc)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: (searchFilter.search?.locationList || []).includes(
                      loc as CarLocation
                    )
                      ? "2px solid #00f5ff"
                      : "1px solid rgba(0, 245, 255, 0.3)",
                    background: (
                      searchFilter.search?.locationList || []
                    ).includes(loc as CarLocation)
                      ? "rgba(0, 245, 255, 0.2)"
                      : "transparent",
                    color: "#00f5ff",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "rgba(0, 245, 255, 0.7)",
                fontSize: "11px",
                marginBottom: "8px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              Type
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleFilter("typeList", type)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: (searchFilter.search?.typeList || []).includes(
                      type as CarType
                    )
                      ? "2px solid #00f5ff"
                      : "1px solid rgba(0, 245, 255, 0.3)",
                    background: (searchFilter.search?.typeList || []).includes(
                      type as CarType
                    )
                      ? "rgba(0, 245, 255, 0.2)"
                      : "transparent",
                    color: "#00f5ff",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Holographic Cards Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "calc(100vh - 200px)",
          padding: "20px",
          zIndex: 3,
        }}
      >
        {cars.map((car, index) => {
          const position = cardPositions[index] || {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            delay: 0,
          };
          const isDragging = draggedCard === index;
          const imagePath = car?.carImages?.[0]
            ? `${REACT_APP_API_URL}/${car.carImages[0]}`
            : "/img/banner/header1.svg";
          const isTopCar = car?.carRank && car.carRank > topCarRank;
          const isLiked = car?.meLiked?.[0]?.myFavorite ?? false;

          return (
            <Link
              key={car._id}
              href={{
                pathname: "/car/detail",
                query: { id: car._id },
              }}
              style={{ textDecoration: "none" }}
            >
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleMouseDown(e, index);
                }}
                onMouseEnter={() => !isDragging && setHoveredCard(car._id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: hasActiveFilters ? "relative" : "absolute",
                  left: hasActiveFilters ? "auto" : `${position.x}%`,
                  top: hasActiveFilters ? "auto" : `${position.y}%`,
                  transform: hasActiveFilters
                    ? "translate(0, 0) rotate(0deg) scale(1) rotateX(0deg)"
                    : `translate(-50%, -50%) rotate(${
                        position.rotation
                      }deg) scale(${
                        hoveredCard === car._id
                          ? position.scale * 1.1
                          : position.scale
                      }) rotateX(${hoveredCard === car._id ? 5 : 15}deg)`,
                  width: "340px",
                  borderRadius: "20px",
                  overflow: "hidden",
                  background: "rgba(10, 15, 30, 0.75)",
                  backdropFilter: "blur(12px)",
                  border:
                    hoveredCard === car._id
                      ? "2px solid rgba(0, 245, 255, 0.8)"
                      : "1px solid rgba(0, 245, 255, 0.25)",
                  transition: isDragging
                    ? "none"
                    : "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow:
                    hoveredCard === car._id || isDragging
                      ? "0 30px 80px rgba(0, 245, 255, 0.6), 0 0 60px rgba(0, 128, 255, 0.5)"
                      : "0 20px 60px rgba(0, 0, 0, 0.8)",
                  cursor: isDragging
                    ? "grabbing"
                    : hasActiveFilters
                    ? "pointer"
                    : "grab",
                  zIndex: isDragging
                    ? 1000
                    : hoveredCard === car._id
                    ? 100
                    : index + 10,
                  display: hasActiveFilters ? "inline-block" : "block",
                  margin: hasActiveFilters ? "15px" : "0",
                  animation:
                    !hasActiveFilters && !isDragging
                      ? `hologramFloat ${5 + index * 0.5}s ease-in-out infinite`
                      : "none",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                }}
              >
                {/* Drag Indicator */}
                {!hasActiveFilters && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: isDragging
                        ? "rgba(0, 245, 255, 0.4)"
                        : "rgba(0, 245, 255, 0.2)",
                      backdropFilter: "blur(5px)",
                      border: "1px solid rgba(0, 245, 255, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 25,
                      opacity: hoveredCard === car._id || isDragging ? 1 : 0.5,
                      transition: "all 0.3s ease",
                      cursor: "grab",
                      transform: isDragging ? "scale(1.2)" : "scale(1)",
                    }}
                  >
                    <Move size={16} color="rgba(0, 245, 255, 0.8)" />
                  </div>
                )}

                {/* Scanline Effect */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "repeating-linear-gradient(0deg, rgba(0, 245, 255, 0.03) 0px, transparent 2px, transparent 4px)",
                    pointerEvents: "none",
                    zIndex: 10,
                    opacity: hoveredCard === car._id ? 1 : 0.6,
                    animation: "scanline 3s linear infinite",
                  }}
                />

                {/* Holographic Shimmer */}
                {(hoveredCard === car._id || isDragging) && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-100%",
                      left: "-100%",
                      right: "-100%",
                      bottom: "-100%",
                      background:
                        "linear-gradient(45deg, transparent 30%, rgba(0, 245, 255, 0.3) 50%, transparent 70%)",
                      animation: "shimmer 1.5s ease-in-out infinite",
                      zIndex: 5,
                      pointerEvents: "none",
                    }}
                  />
                )}

                {/* TOP Badge */}
                {isTopCar && (
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      background:
                        "linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)",
                      color: "#000",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: "900",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      zIndex: 20,
                      boxShadow: "0 0 25px rgba(255, 0, 255, 0.6)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    ⚡ ELITE
                  </div>
                )}

                {/* Image */}
                <div
                  style={{
                    position: "relative",
                    height: "200px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={imagePath}
                    alt={car.carTitle}
                    draggable={false}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transform:
                        hoveredCard === car._id || isDragging
                          ? "scale(1.15)"
                          : "scale(1)",
                      transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                      filter:
                        hoveredCard === car._id || isDragging
                          ? "brightness(1.2) saturate(1.3)"
                          : "brightness(0.9) saturate(1)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Holographic Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        hoveredCard === car._id || isDragging
                          ? "linear-gradient(135deg, rgba(0, 245, 255, 0.2) 0%, rgba(128, 0, 255, 0.2) 100%)"
                          : "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%)",
                      transition: "all 0.3s ease",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Price Badge */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "12px",
                      background: "rgba(0, 0, 0, 0.85)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(0, 245, 255, 0.5)",
                      color: "#00f5ff",
                      padding: "8px 14px",
                      borderRadius: "10px",
                      fontSize: "18px",
                      fontWeight: "800",
                      zIndex: 15,
                      boxShadow: "0 0 20px rgba(0, 245, 255, 0.4)",
                      pointerEvents: "none",
                    }}
                  >
                    {formatPrice(car.carPrice)}
                  </div>
                </div>

                {/* Content */}
                <div
                  style={{
                    padding: "20px",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  {/* Title */}
                  <h3
                    style={{
                      color: "#00f5ff",
                      fontSize: "18px",
                      fontWeight: "700",
                      marginBottom: "6px",
                      textShadow:
                        hoveredCard === car._id || isDragging
                          ? "0 0 15px rgba(0, 245, 255, 0.8)"
                          : "none",
                      transition: "text-shadow 0.3s ease",
                    }}
                  >
                    {car.carTitle}
                  </h3>

                  {/* Location */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "14px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        color: "rgba(0, 245, 255, 0.7)",
                        fontSize: "12px",
                        background: "rgba(0, 245, 255, 0.1)",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: "1px solid rgba(0, 245, 255, 0.2)",
                        fontWeight: "600",
                      }}
                    >
                      📍 {car.carLocation}
                    </span>
                    <span
                      style={{
                        color: "rgba(128, 0, 255, 0.9)",
                        fontSize: "12px",
                        background: "rgba(128, 0, 255, 0.15)",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: "1px solid rgba(128, 0, 255, 0.3)",
                        fontWeight: "600",
                      }}
                    >
                      {car.carType}
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                      marginBottom: "14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: "12px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "600",
                          color: "rgba(0, 245, 255, 0.8)",
                        }}
                      >
                        ⚡
                      </span>
                      <span style={{ fontWeight: "500" }}>
                        {car.carFuelType || "Electric"}
                      </span>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "12px",
                      borderTop: "1px solid rgba(0, 245, 255, 0.15)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "14px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "rgba(255, 255, 255, 0.6)",
                          fontSize: "12px",
                        }}
                      >
                        <Eye size={14} color="rgba(0, 245, 255, 0.5)" />
                        <span style={{ fontWeight: "500" }}>
                          {car.carViews}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          color: "rgba(255, 255, 255, 0.6)",
                          fontSize: "12px",
                        }}
                      >
                        <Heart
                          size={14}
                          color={isLiked ? "#ff0080" : "rgba(0, 245, 255, 0.5)"}
                          fill={isLiked ? "#ff0080" : "none"}
                        />
                        <span style={{ fontWeight: "500" }}>
                          {car.carLikes}
                        </span>
                      </div>
                    </div>

                    {/* Like Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (user?._id) {
                          likeCarHandler(user, car._id);
                        }
                      }}
                      style={{
                        background: isLiked
                          ? "linear-gradient(135deg, #ff0080 0%, #ff00ff 100%)"
                          : "rgba(0, 245, 255, 0.1)",
                        border: isLiked
                          ? "1px solid rgba(255, 0, 128, 0.5)"
                          : "1px solid rgba(0, 245, 255, 0.3)",
                        color: isLiked ? "#fff" : "#00f5ff",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <Heart size={12} fill={isLiked ? "#fff" : "none"} />
                      {isLiked ? "Liked" : "Like"}
                    </button>
                  </div>

                  {/* Availability Tags */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "12px",
                    }}
                  >
                    {car.carTradeIn && (
                      <span
                        style={{
                          fontSize: "10px",
                          padding: "4px 8px",
                          borderRadius: "5px",
                          background: "rgba(0, 255, 128, 0.15)",
                          border: "1px solid rgba(0, 255, 128, 0.3)",
                          color: "rgba(0, 255, 128, 0.9)",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        For Sale
                      </span>
                    )}
                    {car.carLease && (
                      <span
                        style={{
                          fontSize: "10px",
                          padding: "4px 8px",
                          borderRadius: "5px",
                          background: "rgba(255, 200, 0, 0.15)",
                          border: "1px solid rgba(255, 200, 0, 0.3)",
                          color: "rgba(255, 200, 0, 0.9)",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        For Lease
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HolographicCarCard;
