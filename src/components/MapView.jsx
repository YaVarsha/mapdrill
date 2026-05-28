
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import {
  FiInfo,
  FiMapPin,
  FiMaximize2,
  FiUsers,
  FiX,
} from "react-icons/fi";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import {
  getMapLayer,
  hasMapLayer,
} from "../data/mapLayers";
import hindiTranslations from "../data/translations";
import villageStats from "../data/villageStats";

import "./MapView.css";

// ✅ Fix marker issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ✅ Auto zoom helper
const ZoomToBounds = ({
  bounds,
}) => {

  const map = useMap();

  useEffect(() => {

    if (bounds) {

      map.fitBounds(bounds, {
        padding: [40, 40],
      });
    }

  }, [bounds, map]);

  return null;
};

// ✅ Reset helper
const ResetMapView = ({
  resetMap,
}) => {

  const map = useMap();

  useEffect(() => {

    map.setView(
      [22.9734, 78.6569],
      5.4
    );

  }, [resetMap, map]);

  return null;
};

const MapView = ({
  language,

  selectedState,
  selectedDistrict,
  selectedBlock,
  selectedVillage,

  setSelectedState,
  setSelectedDistrict,
  setSelectedBlock,
  setSelectedVillage,

  resetMap,
}) => {

  // ✅ MAP LEVEL
  const [mapLevel, setMapLevel] =
    useState("states");

  // ✅ ZOOM BOUNDS
  const [selectedBounds, setSelectedBounds] =
    useState(null);

  // ✅ GEOJSON REF
  const geoJsonRef =
    useRef(null);

  // ✅ RESET
  useEffect(() => {

    const frameId = window.requestAnimationFrame(() => {

      setMapLevel("states");

      setSelectedBounds(null);
    });

    return () => {

      window.cancelAnimationFrame(frameId);
    };

  }, [resetMap]);

  useEffect(() => {

    const frameId = window.requestAnimationFrame(() => {

      if (
        selectedBlock &&
        selectedBlock !== selectedDistrict &&
        hasMapLayer(selectedBlock)
      ) {

        setMapLevel("villages");
      }

      else if (
        selectedDistrict &&
        hasMapLayer(selectedDistrict)
      ) {

        setMapLevel("blocks");
      }

      else if (
        selectedState &&
        hasMapLayer(selectedState)
      ) {

        setMapLevel("districts");
      }

      else {

        setMapLevel("states");
      }
    });

    return () => {

      window.cancelAnimationFrame(frameId);
    };

  }, [
    selectedState,
    selectedDistrict,
    selectedBlock,
  ]);

  // ✅ GET AREA NAME SAFELY
  const getAreaName = useCallback((
    feature
  ) => {

    const properties =
      feature?.properties || {};

    const readProperty = (keys) => {

      for (const key of keys) {

        if (
          properties[key] !== undefined &&
          properties[key] !== null &&
          properties[key] !== ""
        ) {

          return properties[key];
        }
      }

      const lowerCaseKeys =
        keys.map((key) => key.toLowerCase());

      return Object.entries(properties)
        .find(([key, value]) =>
          lowerCaseKeys.includes(key.toLowerCase()) &&
          value !== undefined &&
          value !== null &&
          value !== ""
        )?.[1];
    };

    const fallbackName =
      Object.entries(properties)
        .find(([key, value]) => {

          const normalizedKey =
            key.toLowerCase();

          return (
            typeof value === "string" &&
            value.trim() &&
            ![
              "country",
              "state",
              "state_name",
              "state_code",
              "district",
              "dist_code",
              "remarks_2",
            ].includes(normalizedKey)
          );
        })?.[1];

    if (mapLevel === "states") {

      return (
        readProperty([
          "NAME_1",
          "NAME",
          "name",
          "STATE",
          "State_Name",
        ]) ||
        fallbackName ||
        "Unknown"
      );
    }

    if (mapLevel === "districts") {

      return (
        readProperty([
          "NAME_2",
          "DISTRICT",
          "Dist_Name",
          "district",
          "dtname",
          "name",
        ]) ||
        fallbackName ||
        "Unknown"
      );
    }

    if (mapLevel === "blocks") {

      return (
        readProperty([
          "BLOCK",
          "Block_Name",
          "block",
          "name",
        ]) ||
        fallbackName ||
        "Unknown"
      );
    }

    if (mapLevel === "villages") {

      return (
        readProperty([
          "VILLAGE",
          "Village_Name",
          "village",
          "name",
        ]) ||
        fallbackName ||
        "Unknown"
      );
    }

    return (
      feature?.properties?.NAME_3 ||
      feature?.properties?.NAME_2 ||
      feature?.properties?.NAME_1 ||
      feature?.properties?.NAME ||
      feature?.properties?.name ||
      feature?.properties?.STATE ||
      feature?.properties?.DISTRICT ||
      feature?.properties?.BLOCK ||
      feature?.properties?.VILLAGE ||
      feature?.properties?.dtname ||
      feature?.properties?.district ||
      feature?.properties?.block ||
      feature?.properties?.village ||
      feature?.properties?.Shape_Name ||
      feature?.properties?.shapeName ||
      feature?.properties?.Dist_Name ||
      feature?.properties?.State_Name ||
      feature?.properties?.Block_Name ||
      feature?.properties?.Village_Name ||
      "Unknown"
    );
  }, [mapLevel]);

  // ✅ DISPLAY NAME
  const getDisplayName = (
    name
  ) => {

    if (!name) return "";

    const translatedName =
      language === "hi"
      ? (
          hindiTranslations[name] ||
          name
        )
      : name;

    if (
      mapLevel === "blocks" &&
      name === selectedDistrict
    ) {

      return language === "hi"
        ? `${translatedName} ब्लॉक`
        : `${translatedName} Block`;
    }

    return translatedName;
  };

  // ✅ CURRENT LAYER
  const currentLayerKey = useMemo(() => {

    if (mapLevel === "districts") {

      return hasMapLayer(selectedState)
        ? selectedState
        : "india";
    }

    if (mapLevel === "blocks") {

      return hasMapLayer(selectedDistrict)
        ? selectedDistrict
        : selectedState;
    }

    if (mapLevel === "villages") {

      if (
        selectedBlock !== selectedDistrict &&
        hasMapLayer(selectedBlock)
      ) {

        return selectedBlock;
      }

      return hasMapLayer(selectedDistrict)
        ? selectedDistrict
        : null;
    }

    return "india";
  }, [
    mapLevel,
    selectedState,
    selectedDistrict,
    selectedBlock,
  ]);

  const [currentLayer, setCurrentLayer] =
    useState(null);

  useEffect(() => {

    let isActive =
      true;

    if (!currentLayerKey) {

      Promise.resolve().then(() => {

        if (isActive) {

          setCurrentLayer(null);
        }
      });

      return () => {

        isActive = false;
      };
    }

    getMapLayer(currentLayerKey)
      .then((layer) => {

        if (isActive) {

          setCurrentLayer(layer);
        }
      })
      .catch(() => {

        if (isActive) {

          setCurrentLayer(null);
        }
      });

    return () => {

      isActive = false;
    };
  }, [currentLayerKey]);

  // ✅ MAP STYLE
  useEffect(() => {

    if (
      !currentLayer?.features ||
      !(
        selectedState ||
        selectedDistrict ||
        selectedBlock ||
        selectedVillage
      )
    ) {

      return;
    }

    const selectedFeatureName =
      selectedVillage ||
      (
        mapLevel === "blocks"
          ? selectedBlock
          : ""
      ) ||
      (
        mapLevel === "districts"
          ? selectedDistrict
          : ""
      );

    const selectedFeature =
      selectedFeatureName
        ? currentLayer.features.find((feature) =>
            getAreaName(feature) === selectedFeatureName
          )
        : null;

    const bounds =
      L.geoJSON(
        selectedFeature || currentLayer
      ).getBounds();

    let frameId = null;

    if (bounds.isValid()) {

      frameId = window.requestAnimationFrame(() => {

        setSelectedBounds(bounds);
      });
    }

    return () => {

      if (frameId) {

        window.cancelAnimationFrame(frameId);
      }
    };

  }, [
    currentLayer,
    getAreaName,
    mapLevel,
    selectedState,
    selectedDistrict,
    selectedBlock,
    selectedVillage,
  ]);

  const selectedVillageStats =
    selectedVillage
      ? villageStats[selectedVillage]
      : null;

  const formatNumber = (value) => {

    if (
      value === undefined ||
      value === null
    ) {

      return "Not available";
    }

    return new Intl.NumberFormat("en-IN").format(value);
  };

  const formatArea = (value) => {

    if (
      value === undefined ||
      value === null
    ) {

      return "Not available";
    }

    return `${value} km²`;
  };

  const geoStyle = (
    feature
  ) => {

    const name =
      getAreaName(feature);

    const activeSelection =
      selectedVillage ||
      selectedBlock ||
      selectedDistrict ||
      selectedState;

    const isSelected =
      name === activeSelection;

    return {

      color: isSelected
        ? "#4338CA"
        : "#6366F1",

      weight: isSelected
        ? 3
        : 1.5,

      fillColor: isSelected
        ? "#6366F1"
        : "#C7D2FE",

      fillOpacity: isSelected
        ? 0.6
        : 0.25,
    };
  };

  // ✅ FEATURE EVENTS
  const onEachFeature = (
    feature,
    layer
  ) => {

    const areaName =
      getAreaName(feature);

    const tooltipName =
      getDisplayName(areaName);

    // ✅ TOOLTIP
    layer.bindTooltip(
      tooltipName,
      {
        sticky: true,
        direction: "top",
        opacity: 1,
        className: "map-feature-tooltip",
        permanent: false,
      }
    );

    // ✅ EVENTS
    layer.on({

      mouseover: (e) => {

        const current =
          e.target;

        current.setStyle({

          weight: 3,

          fillOpacity: 0.6,

          color: "#4338CA",
        });

        if (
          !L.Browser.ie &&
          !L.Browser.opera &&
          !L.Browser.edge
        ) {

          current.bringToFront();
        }
      },

      mouseout: (e) => {

        if (
          geoJsonRef.current
        ) {

          geoJsonRef.current.resetStyle(
            e.target
          );
        }
      },

      click: () => {

        const bounds =
          layer.getBounds();

        // ✅ OPEN TOOLTIP
        layer.openTooltip();

        // ✅ SAVE BOUNDS
        setSelectedBounds(bounds);

        // ✅ STATE CLICK
        if (
          mapLevel === "states"
        ) {

          setSelectedState(areaName);

          setSelectedDistrict("");
          setSelectedBlock("");
          setSelectedVillage("");

          setTimeout(() => {

            if (
              hasMapLayer(areaName)
            ) {

              setMapLevel(
                "districts"
              );
            }

          }, 300);
        }

        // ✅ DISTRICT CLICK
        else if (
          mapLevel === "districts"
        ) {

          setSelectedDistrict(
            areaName
          );

          setSelectedBlock("");
          setSelectedVillage("");

          setTimeout(() => {

            if (
              hasMapLayer(areaName)
            ) {

              setMapLevel(
                "blocks"
              );
            }

          }, 300);
        }

        // ✅ BLOCK CLICK
        else if (
          mapLevel === "blocks"
        ) {

          setSelectedBlock(
            areaName
          );

          setSelectedVillage("");

          setTimeout(() => {

            if (
              hasMapLayer(areaName)
            ) {

              setMapLevel(
                "villages"
              );
            }

          }, 300);
        }

        // ✅ VILLAGE CLICK
        else if (
          mapLevel === "villages"
        ) {

          setSelectedVillage(
            areaName
          );
        }
      },
    });
  };

  return (

    <div className="map-view-shell">

    <MapContainer
      center={[
        22.9734,
        78.6569,
      ]}
      zoom={5.4}
      minZoom={5}
      maxZoom={14}
      maxBounds={[
        [7, 68],
        [37, 97],
      ]}
      maxBoundsViscosity={
        1.0
      }
      style={{
        height: "100%",
        width: "100%",
      }}
      className="leaflet-map"
    >

      {/* ✅ TILE */}
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {/* ✅ GEOJSON */}
      {
        currentLayer &&
        currentLayer.type &&
        currentLayer.features && (

          <GeoJSON
            ref={geoJsonRef}
            key={`${mapLevel}-${language}-${selectedState}-${selectedDistrict}-${selectedBlock}-${selectedVillage}`}
            data={currentLayer}
            style={geoStyle}
            onEachFeature={
              onEachFeature
            }
          />
        )
      }

      {/* ✅ ZOOM */}
      <ZoomToBounds
        bounds={
          selectedBounds
        }
      />

      {/* ✅ RESET */}
      <ResetMapView
        resetMap={resetMap}
      />

    </MapContainer>

      {
        selectedVillage && (

          <div className="village-stats-card">

            <div className="village-stats-header">

              <div className="village-title-row">
                <span className="village-pin-icon">
                  <FiMapPin />
                </span>

                <div>
                  <h3>
                    {getDisplayName(selectedVillage)}
                  </h3>

                  <p>
                    {selectedBlock
                      ? `${getDisplayName(selectedBlock)}, ${getDisplayName(selectedDistrict)}`
                      : getDisplayName(selectedDistrict)}
                  </p>
                </div>
              </div>

              <button
                className="village-card-close"
                type="button"
                aria-label="Close village details"
                onClick={() => {

                  setSelectedVillage("");
                }}
              >
                <FiX />
              </button>

            </div>

            <div className="village-stats-list">

              <div className="village-stat-row">
                <span>
                  <FiUsers />
                  Population
                </span>

                <strong>
                  {formatNumber(selectedVillageStats?.population)}
                </strong>
              </div>

              <div className="village-stat-row">
                <span>
                  <FiMaximize2 />
                  Area
                </span>

                <strong>
                  {formatArea(selectedVillageStats?.area)}
                </strong>
              </div>

              <div className="village-stat-row">
                <span>
                  <FiMapPin />
                  Density
                </span>

                <strong>
                  {selectedVillageStats?.density
                    ? `${formatNumber(selectedVillageStats.density)} / km²`
                    : "Not available"}
                </strong>
              </div>

            </div>

            <button
              className="village-details-button"
              type="button"
            >
              <FiInfo />
              View More Details
            </button>

          </div>
        )
      }

    </div>
  );
};

export default MapView;
