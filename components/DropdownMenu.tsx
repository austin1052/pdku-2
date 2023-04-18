import React, { useState } from "react";

export default function DropdownMenu(variants: any) {
  const [selectedOption, setSelectedOption] = useState("option1");
  const variantArray = variants.productVariantData;

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div>
      <label htmlFor="dropdown-menu">Select an option:</label>
      <select
        id="dropdown-menu"
        value={selectedOption}
        onChange={handleOptionChange}
      >
        {variantArray.map((variant: any) => {
          const color = variant.details[0];
          return (
            <option value={color} key={variant.id}>
              {color}
            </option>
          );
        })}
      </select>
    </div>
  );
}
