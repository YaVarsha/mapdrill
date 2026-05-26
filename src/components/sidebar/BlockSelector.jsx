import CustomSelect from "./CustomSelect";

const BlockSelector = ({
  language,
  selectedDistrict,
  selectedBlock,
  setSelectedBlock,
  blockOptions,
  setSelectedVillage,
  hindiTranslations,
}) => {

  const handleChange = (value) => {

    setSelectedBlock(value);
    setSelectedVillage("");
  };

  const getBlockLabel = (blockName) => {

    const translatedName =
      language === "hi"
        ? hindiTranslations[blockName] || blockName
        : blockName;

    if (blockName === selectedDistrict) {

      return language === "hi"
        ? `${translatedName} ब्लॉक`
        : `${translatedName} Block`;
    }

    return translatedName;
  };

  return (
    <CustomSelect
      value={selectedBlock}
      placeholder={
        language === "hi"
          ? "ब्लॉक चुनें"
          : "Select Block"
      }
      disabled={!selectedDistrict}
      options={(blockOptions || []).map((block) => ({
        value: block.name,
        label: getBlockLabel(block.name),
      }))}
      onChange={handleChange}
    />
  );
};

export default BlockSelector;
