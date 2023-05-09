import { useState, useContext } from "react";
import { CartContext } from "../../context/CartContext";
import CountryDropdown from "./CountryDropdown";
import StateDropdown from "./stateDropdown";
import styles from "../../styles/Cart.module.css";

interface ShippingProps {
  countryList: CountryList;
}

export default function ShippingElement({ countryList }: ShippingProps) {
  const [countryValue, setCountryValue] = useState("US");
  const [stateValue, setStateValue] = useState("");
  const { setShippingAddress, getShippingCost } = useContext(CartContext);

  function handleSubmit(event: any) {
    event.preventDefault();

    const { name, country, address1, address2, city, state, postalCode } =
      event.target;

    const countryCode = country.value.split("-")[0];

    const recipient = {
      address1: address1.value,
      city: city.value,
      country_code: countryCode,
      state_code: state.value,
      zip: postalCode.value,
    };

    getShippingCost(recipient);

    const shippingAddress = {
      ...recipient,
      name: name.value,
      address2: address2.value,
    };

    setShippingAddress(shippingAddress);
  }

  return (
    <>
      <h2>Shipping Information</h2>
      <form className={styles.shippingForm} onSubmit={handleSubmit}>
        <label htmlFor="name">Full Name</label>
        <input id="name" placeholder="First and last name" required></input>
        <div className={styles.dropdownContainer}>
          <label htmlFor="country">Country or region</label>
          <CountryDropdown
            countryValue={countryValue}
            setCountryValue={setCountryValue}
            countryList={countryList}
          />
        </div>
        <label htmlFor="address1">Address line 1</label>
        <input id="address1" placeholder="Street address" required></input>
        <label htmlFor="address2">Address line 2</label>
        <input
          id="address2"
          placeholder="Apt., unit number, etc. (optional)"
        ></input>
        <label htmlFor="city">City</label>
        <input id="city" required></input>
        <div className={styles.grid}>
          <div className={styles.dropdownContainer}>
            <label htmlFor="state">State</label>
            <StateDropdown
              countryValue={countryValue}
              stateValue={stateValue}
              countryList={countryList}
              setStateValue={setStateValue}
            />
          </div>
          <div>
            <label htmlFor="postalCode">Postal Code</label>
            <input id="postalCode" required></input>
          </div>
        </div>
        <button type="submit" className={styles.calculateShippingButton}>
          Calculate Shipping
        </button>
      </form>
    </>
  );
}
