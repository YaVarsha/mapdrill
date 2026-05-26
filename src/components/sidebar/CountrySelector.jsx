import CustomSelect from "./CustomSelect";

const CountrySelector = ({ language }) => {

  return (
    <CustomSelect
      value="India"
      options={[
        {
          value: "India",
          label: language === "hi"
            ? "भारत"
            : "India",
        },
      ]}
    />
  );
};

export default CountrySelector;
