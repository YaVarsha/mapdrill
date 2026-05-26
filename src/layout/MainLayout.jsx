import { useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MapView from "../components/MapView";
import hindiTranslations from "../data/translations";
import biharDistricts from "../data/bihar/biharDistricts";
import samastipurBlocks from "../data/bihar/samastipurBlocks";
import patnaBlocks from "../data/bihar/patnaBlocks";
import ujiarpurVillages from "../data/bihar/ujiarpurVillages";
import pusaVillages from "../data/bihar/pusaVillages";

import "./MainLayout.css";

const toSelectOptions = (items = {}) =>
  Object.keys(items).map((name) => ({
    name,
  }));

const districtOptionsByState = {
  Bihar: toSelectOptions(biharDistricts),
};

const blockOptionsByDistrict = {
  Samastipur: toSelectOptions(samastipurBlocks),
  Patna: toSelectOptions(patnaBlocks),
};

const villageOptionsByBlock = {
  Ujiarpur: toSelectOptions(ujiarpurVillages),
  Pusa: toSelectOptions(pusaVillages),
};

const searchItems = [
  {
    name: "Bihar",
    type: "state",
    state: "Bihar",
  },
  ...Object.keys(biharDistricts).map((district) => ({
    name: district,
    type: "district",
    state: "Bihar",
    district,
  })),
  ...Object.entries(blockOptionsByDistrict).flatMap(([district, blocks]) =>
    blocks.map((block) => ({
      name: block.name,
      type: "block",
      state: "Bihar",
      district,
      block: block.name,
    }))
  ),
  ...Object.entries(villageOptionsByBlock).flatMap(([block, villages]) =>
    villages.map((village) => ({
      name: village.name,
      type: "village",
      state: "Bihar",
      district: "Samastipur",
      block,
      village: village.name,
    }))
  ),
];

const MainLayout = ({
  language,
  setLanguage,
  darkMode,
  setDarkMode,
}) => {

  // ✅ Selected State
  const [selectedState, setSelectedState] = useState("");

   // ✅ Selected District
    const [selectedDistrict, setSelectedDistrict] = useState("");

     // ✅ Selected Block
const [selectedBlock, setSelectedBlock] = useState("");

 // ✅ Selected Village
const [selectedVillage, setSelectedVillage] = useState("");

const [searchQuery, setSearchQuery] = useState("");

 

    // ✅ Reset Map
const [resetMap, setResetMap] = useState(false);

const districtOptions =
  districtOptionsByState[selectedState] || [];

const blockOptions =
  blockOptionsByDistrict[selectedDistrict] || [];

const villageOptions =
  villageOptionsByBlock[selectedBlock] || [];

const getLocationLabel = (name, type) => {

  if (!name) return "";

  const translatedName =
    language === "hi"
      ? hindiTranslations[name] || name
      : name;

  if (
    type === "block" &&
    name === selectedDistrict
  ) {

    return language === "hi"
      ? `${translatedName} ब्लॉक`
      : `${translatedName} Block`;
  }

  return translatedName;
};

const searchOptions =
  searchItems.map((item) => ({
    ...item,
    label: getLocationLabel(item.name, item.type),
  }));

const handleSearchSelect = (item) => {

  if (!item) return;

  setSelectedState(item.state || "");
  setSelectedDistrict(item.district || "");
  setSelectedBlock(item.block || "");
  setSelectedVillage(item.village || "");
  setSearchQuery(item.label || item.name || "");
};

  return (

    <div className={`app-container ${darkMode ? "dark-theme" : ""}`}>

      {/* ✅ Navbar */}
      <Navbar
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchOptions={searchOptions}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSelect={handleSearchSelect}
      />

      {/* ✅ Main Layout */}
      <div className="content-layout">

        {/* ✅ Sidebar */}
        <aside className="sidebar-section">

<Sidebar
  language={language}

  selectedState={selectedState}
  setSelectedState={setSelectedState}

  selectedDistrict={selectedDistrict}
  setSelectedDistrict={setSelectedDistrict}

  selectedBlock={selectedBlock}
  setSelectedBlock={setSelectedBlock}

  selectedVillage={selectedVillage}
  setSelectedVillage={setSelectedVillage}

  districtOptions={districtOptions}
  blockOptions={blockOptions}
  villageOptions={villageOptions}
  hindiTranslations={hindiTranslations}
/>

        </aside>

        {/* ✅ Right Side */}
        <div className="map-wrapper">

          {/* ✅ Top Breadcrumb Bar */}
          <div className="map-topbar">

            <div className="breadcrumb-section">

              <div className="breadcrumb-home">
                🏠
              </div>

              <span className="breadcrumb-item">
                {language === "hi"
  ? hindiTranslations.India
  : "India"}
              </span>

              {selectedState && (
                <>
                  <span className="breadcrumb-arrow">
                    ›
                  </span>

                  <span className="breadcrumb-item">
                    {getLocationLabel(selectedState, "state")}
                  </span>
                </>
              )}

              {selectedDistrict && selectedDistrict !== selectedState && (
                <>
                  <span className="breadcrumb-arrow">
                    ›
                  </span>

                  <span className="active-breadcrumb">
                    {getLocationLabel(selectedDistrict, "district")}
                  </span>
                </>
              )}

              {selectedBlock && (
                <>
                  <span className="breadcrumb-arrow">
                    ›
                  </span>

                  <span className={selectedVillage ? "breadcrumb-item" : "active-breadcrumb"}>
                    {getLocationLabel(selectedBlock, "block")}
                  </span>
                </>
              )}

              {selectedVillage && (
                <>
                  <span className="breadcrumb-arrow">
                    ›
                  </span>

                  <span className="active-breadcrumb">
                    {getLocationLabel(selectedVillage, "village")}
                  </span>
                </>
              )}

            </div>

            {/* ✅ Reset */}
            

            <button
  className="reset-map-btn"
  onClick={() => {

    setSelectedState("");
setSelectedDistrict("");
setSelectedBlock("");
setSelectedVillage("");
setSearchQuery("");

    setResetMap(prev => !prev);

  }}
>
  ↻ {language === "hi"
  ? hindiTranslations.ResetMap
  : "Reset Map"}
</button>

          </div>

          {/* ✅ Map */}
          <main className="map-section">

            <MapView
  language={language}

  selectedState={selectedState}
  selectedDistrict={selectedDistrict}
  selectedBlock={selectedBlock}
  selectedVillage={selectedVillage}

  setSelectedState={setSelectedState}
  setSelectedDistrict={setSelectedDistrict}

  setSelectedBlock={setSelectedBlock}
  setSelectedVillage={setSelectedVillage}

  resetMap={resetMap}
/>

          </main>

        </div>

      </div>

    </div>
  );
};

export default MainLayout;
