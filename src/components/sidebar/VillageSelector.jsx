import CustomSelect from "./CustomSelect";

const VillageSelector = ({
  language,
  selectedBlock,
  selectedVillage,
  setSelectedVillage,
  villageOptions,
  hindiTranslations,
}) => {

  return (
    <CustomSelect
      value={selectedVillage}
      placeholder={
        language === "hi"
          ? "गाँव चुनें"
          : "Select Village"
      }
      disabled={!selectedBlock}
      options={(villageOptions || []).map((village) => ({
        value: village.name,
        label: language === "hi"
          ? hindiTranslations[village.name] || village.name
          : village.name,
      }))}
      onChange={setSelectedVillage}
    />
  );
};

export default VillageSelector;
