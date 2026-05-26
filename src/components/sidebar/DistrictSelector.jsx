import CustomSelect from "./CustomSelect";

const DistrictSelector = ({
  language,
  selectedState,
  selectedDistrict,
  setSelectedDistrict,
  districtOptions,
  setSelectedBlock,
  setSelectedVillage,
  hindiTranslations,
}) => {

  const handleChange = (value) => {

    setSelectedDistrict(value);
    setSelectedBlock("");
    setSelectedVillage("");
  };

  return (
    <CustomSelect
      value={selectedDistrict}
      placeholder={
        language === "hi"
          ? "जिला चुनें"
          : "Select District"
      }
      disabled={!selectedState}
      options={(districtOptions || []).map((district) => ({
        value: district.name,
        label: language === "hi"
          ? hindiTranslations[district.name] || district.name
          : district.name,
      }))}
      onChange={handleChange}
    />
  );
};

export default DistrictSelector;
