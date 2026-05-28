import samastipurBlocksRaw from
  "./geojson/blocks/samastipurBlocks.geojson?raw";

import patnaBlocks from
  "./bihar/patnaBlocks.js";

import ujiarpurVillagesRaw from
  "./geojson/villages/ujiarpurVillages.geojson?raw";

import pusaVillages from
  "./bihar/pusaVillages.js";

const samastipurBlocks =
  JSON.parse(samastipurBlocksRaw);

const ujiarpurVillages =
  JSON.parse(ujiarpurVillagesRaw);

const fetchGeoJson = async (url) => {

  const response =
    await fetch(url);

  if (!response.ok) {

    throw new Error(`Unable to load map layer: ${url}`);
  }

  return response.json();
};

const layerLoaders = {
  india: () => fetchGeoJson("/data/geojson/india/indiaStates.json"),
  Bihar: () => fetchGeoJson("/data/geojson/bihar/biharDistricts.json"),
  Samastipur: () => Promise.resolve(samastipurBlocks),
  Patna: () => Promise.resolve(patnaBlocks),
  Ujiarpur: () => Promise.resolve(ujiarpurVillages),
  Pusa: () => Promise.resolve(pusaVillages),
};

const layerCache = {};

export const hasMapLayer = (name) =>
  Boolean(layerLoaders[name]);

export const getMapLayer = async (name) => {

  if (!hasMapLayer(name)) {

    return null;
  }

  if (!layerCache[name]) {

    layerCache[name] =
      layerLoaders[name]();
  }

  return layerCache[name];
};
