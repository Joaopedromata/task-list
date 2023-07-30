import { useState } from "react";
import Input from "../Input";
import "./styles.css";

// Exemplo de implementação da função getAutocompleteOptions
const getAutocompleteOptions = (searchTerm) => {
  // Aqui você pode fazer uma chamada à API ou filtrar uma lista de opções disponíveis.
  // Neste exemplo, estamos usando uma lista de opções estática para fins ilustrativos.
  const availableOptions = [
    "apple",
    "banana",
    "orange",
    "pear",
    "pineapple",
    "grape",
    "watermelon",
  ];

  return availableOptions.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

const AutocompleteInput = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestedOptions, setSuggestedOptions] = useState([]);

  const handleInputChange = async (value) => {
    setInputValue(value);

    if (value === "") return;

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
      />
      {suggestedOptions.length > 0 && (
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
