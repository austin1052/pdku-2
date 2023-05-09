// import { useState } from "react";
import styles from "../../styles/Cart.module.css";

interface CountryDropwdownProps {
  countryList: CountryList;
  countryValue: string;
  setCountryValue: React.Dispatch<React.SetStateAction<any>>;
  // valueType?: string;
}

export default function CountryDropdown({
  countryValue,
  setCountryValue,
  countryList,
}: // valueType,
CountryDropwdownProps) {
  function handleSelectChange(event: any) {
    setCountryValue(event.target.value);
  }

  return (
    <select
      id="country"
      value={countryValue}
      onChange={handleSelectChange}
      name="country"
      className={styles.dropdown}
      required
    >
      {countryList &&
        countryList.map((country, i) => {
          const { code, name, region } = country;
          return (
            <option key={code} value={`${code}-${region}`}>
              {name}
            </option>
          );
        })}
    </select>
  );
}

// selected={code === countryValue}
