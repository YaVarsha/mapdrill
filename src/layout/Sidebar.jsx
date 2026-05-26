// Sidebar.jsx

import "./Sidebar.css";

import {
  FiGlobe,
  FiMap,
  FiMapPin,
  FiHome,
} from "react-icons/fi";

import DrillNode from "../components/sidebar/DrillNode";

import CountrySelector from "../components/sidebar/CountrySelector";
import StateSelector from "../components/sidebar/StateSelector";
import DistrictSelector from "../components/sidebar/DistrictSelector";
import BlockSelector from "../components/sidebar/BlockSelector";
import VillageSelector from "../components/sidebar/VillageSelector";

const Sidebar = ({
  language,

  selectedState,
  setSelectedState,

  selectedDistrict,
  setSelectedDistrict,

  selectedBlock,
  setSelectedBlock,

  selectedVillage,
  setSelectedVillage,

  districtOptions,
  blockOptions,
  villageOptions,

  hindiTranslations,
}) => {

  return (
    <div className="sidebar">

      <div className="drill-tree-wrapper">

        {/* COUNTRY */}

        <DrillNode
          icon={<FiGlobe />}
          title={
            language === "hi"
              ? "देश"
              : "Country"
          }
          subtitle={
            language === "hi"
              ? "देश चुनें"
              : "Select Country"
          }
          active={true}
        >

          <CountrySelector
            language={language}
          />

        </DrillNode>

        {/* STATE */}

        <DrillNode
          icon={<FiMap />}
          title={
            language === "hi"
              ? "राज्य"
              : "State"
          }
          subtitle={
            language === "hi"
              ? "राज्य चुनें"
              : "Select State"
          }
          active={selectedState}
          showLine={true}
        >

          <StateSelector
            language={language}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            setSelectedDistrict={setSelectedDistrict}
            setSelectedBlock={setSelectedBlock}
            setSelectedVillage={setSelectedVillage}
          />

        </DrillNode>

        {/* DISTRICT */}

        <DrillNode
          icon={<FiMapPin />}
          title={
            language === "hi"
              ? "जिला"
              : "District"
          }
          subtitle={
            language === "hi"
              ? "जिला चुनें"
              : "Select District"
          }
          active={selectedDistrict}
          showLine={true}
        >

          <DistrictSelector
            language={language}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            districtOptions={districtOptions}
            setSelectedBlock={setSelectedBlock}
            setSelectedVillage={setSelectedVillage}
            hindiTranslations={hindiTranslations}
          />

        </DrillNode>

        {/* BLOCK */}

        <DrillNode
          icon={<FiHome />}
          title={
            language === "hi"
              ? "ब्लॉक"
              : "Block"
          }
          subtitle={
            language === "hi"
              ? "ब्लॉक चुनें"
              : "Select Block"
          }
          active={selectedBlock}
          showLine={true}
        >

          <BlockSelector
            language={language}
            selectedDistrict={selectedDistrict}
            selectedBlock={selectedBlock}
            setSelectedBlock={setSelectedBlock}
            blockOptions={blockOptions}
            setSelectedVillage={setSelectedVillage}
            hindiTranslations={hindiTranslations}
          />

        </DrillNode>

        {/* VILLAGE */}

        <DrillNode
          icon={<FiMapPin />}
          title={
            language === "hi"
              ? "गाँव"
              : "Village"
          }
          subtitle={
            language === "hi"
              ? "गाँव चुनें"
              : "Select Village"
          }
          active={selectedVillage}
          showLine={true}
        >

          <VillageSelector
            language={language}
            selectedBlock={selectedBlock}
            selectedVillage={selectedVillage}
            setSelectedVillage={setSelectedVillage}
            villageOptions={villageOptions}
            hindiTranslations={hindiTranslations}
          />

        </DrillNode>

      </div>

    </div>
  );
};

export default Sidebar;