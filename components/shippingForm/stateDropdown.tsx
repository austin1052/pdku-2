import styles from "../../styles/Cart.module.css";

interface StateDropdownProps {
  countryValue: string | "US-americas";
  stateValue: string | undefined;
  countryList: CountryList;
  setStateValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function StateDropdown({
  countryValue,
  stateValue,
  countryList,
  setStateValue,
}: StateDropdownProps) {
  const countryData = countryList.filter(
    (country) => country.code === countryValue
  );

  const stateList = countryData[0]?.states;

  function handleSelectChange(event: any) {
    setStateValue(event.target.value);
  }

  return (
    <select
      id="state"
      value={stateValue}
      onChange={handleSelectChange}
      name="state"
      className={styles.dropdown}
      required={(stateList && stateList.length > 0) || false}
    >
      {stateList && stateList.length > 0 && (
        <option key="0" value="">
          Select State
        </option>
      )}
      {stateList &&
        stateList.map((state, i) => {
          const { code, name } = state;
          return (
            <option key={code} value={code}>
              {name}
            </option>
          );
        })}
    </select>
  );
}

// selected={code === stateValue}
