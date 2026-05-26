// ✅ INDIA MAP
import indiaStates from "./geojson/india/indiaStates.json";

// ✅ BIHAR DISTRICTS
import biharDistrictsGeo from "./geojson/bihar/biharDistricts.json";

// ✅ BIHAR BLOCKS
import samastipurBlocksRaw from
  "./geojson/blocks/samastipurBlocks.geojson?raw";

import patnaBlocks from
  "./bihar/patnaBlocks.js";

// ✅ BIHAR VILLAGES
import ujiarpurVillagesRaw from
  "./geojson/villages/ujiarpurVillages.geojson?raw";

import pusaVillages from
  "./bihar/pusaVillages.js";

const samastipurBlocks =
  JSON.parse(samastipurBlocksRaw);

const ujiarpurVillages =
  JSON.parse(ujiarpurVillagesRaw);

const mapLayers = {

  // ✅ INDIA
  india: indiaStates,

  // ✅ STATE → DISTRICTS
    Bihar: biharDistrictsGeo,

  // ✅ DISTRICT → BLOCKS
  Samastipur:
    samastipurBlocks,

  Patna:
    patnaBlocks,

  // ✅ BLOCK → VILLAGES
  Ujiarpur:
    ujiarpurVillages,

  Pusa:
    pusaVillages,
};

export default mapLayers;
