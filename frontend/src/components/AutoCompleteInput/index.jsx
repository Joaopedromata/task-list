import { useState } from "react";
import Input from "../Input";
import "./styles.css";

const AutocompleteInput = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestedOptions, setSuggestedOptions] = useState([]);

  const handleInputChange = async (value) => {
    setInputValue(value);

    if (value === "") {
      setSuggestedOptions([]);
      return;
    }

    const newSuggestedOptions = await props.getAutocompleteOptions(value);

    setSuggestedOptions(newSuggestedOptions);
  };

  const handleItemClick = (item, value) => {
    setInputValue(item);

    props.onChange(item, value);

    setSuggestedOptions([]);
  };

  return (
    <div className="auto-complete-input">
      <Input
        onChange={(e) => handleInputChange(e.target.value)}
        value={inputValue}
        placeholder={props.placeholder}
      />
      {suggestedOptions?.length > 0 && (
        <ul className="auto-complete-input__options">
          {suggestedOptions.map(({ item, value }) => (
            <li
              key={value}
              className="auto-complete-input__options___items"
              onClick={() => handleItemClick(item, value)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
