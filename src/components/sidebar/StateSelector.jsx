import states from "../../data/translations/states";
import hindiTranslations from "../../data/translations";
import CustomSelect from "./CustomSelect";

const stateOptions =
  Object.keys(states).filter((state) =>
    state !== "India"
  );

const StateSelector = ({
  language,
  selectedState,
  setSelectedState,
  setSelectedDistrict,
  setSelectedBlock,
  setSelectedVillage,
}) => {

  const handleChange = (value) => {

    setSelectedState(value);
    setSelectedDistrict("");
    setSelectedBlock("");
    setSelectedVillage("");
  };

  return (
    <CustomSelect
      value={selectedState}
      placeholder={
        language === "hi"
          ? "राज्य चुनें"
          : "Select State"
      }
      options={stateOptions.map((state) => ({
        value: state,
        label: language === "hi"
          ? hindiTranslations[state] || state
          : state,
      }))}
      onChange={handleChange}
    />
  );
};

export default StateSelector;
