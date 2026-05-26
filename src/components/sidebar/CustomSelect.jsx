import {
  useEffect,
  useRef,
  useState,
} from "react";

import { FiChevronDown } from "react-icons/fi";

const CustomSelect = ({
  value,
  placeholder,
  options = [],
  disabled = false,
  onChange,
}) => {

  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption =
    options.find((option) =>
      option.value === value
    );

  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        selectRef.current &&
        !selectRef.current.contains(event.target)
      ) {

        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {

      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSelect = (optionValue) => {

    onChange?.(optionValue);
    setOpen(false);
  };

  return (
    <div
      className={`custom-select ${open ? "open" : ""} ${disabled ? "disabled" : ""}`}
      ref={selectRef}
    >
      <button
        className="custom-select-trigger"
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {

          if (!disabled) {

            setOpen((currentOpen) => !currentOpen);
          }
        }}
      >
        <span className={selectedOption ? "" : "custom-select-placeholder"}>
          {selectedOption?.label || placeholder}
        </span>

        <FiChevronDown className="custom-select-arrow" />
      </button>

      {open && (
        <div
          className="custom-select-menu"
          role="listbox"
        >
          {options.map((option) => (
            <button
              className={`custom-select-option ${option.value === value ? "selected" : ""}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              key={option.value || option.label}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
