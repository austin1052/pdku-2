// import CountryDropdown from "./shippingForm/CountryDropdown";
import styles from "../styles/Cart.module.css";

export default function ShippingElement() {
  return (
    <>
      <h2>Shipping Information</h2>
      <form className={styles.shippingForm}>
        {/* <div className={styles.loaderContainer}><Loader /></div> */}
        <label htmlFor="name">Full Name</label>
        <input id="name" placeholder="First and last name"></input>
        <label htmlFor="country">Country or region</label>
        {/* <input id="country" placeholder="Country or region"></input> */}
        {/* <CountryDropdown /> */}
        <label htmlFor="address-line-1">Address line 1</label>
        <input id="address-line-1" placeholder="Street address"></input>
        <label htmlFor="address-line-2">Address line 2</label>
        <input
          id="address-line-2"
          placeholder="Apt., unit number, etc. (optional)"
        ></input>
        <label htmlFor="city">City</label>
        <input id="city"></input>
        <div>
          <div className={styles.state}>
            <label htmlFor="state">State</label>
            <input id="state"></input>
          </div>
          <div>
            <label htmlFor="postal-code">Postal Code</label>
            <input id="postal-code"></input>
          </div>
        </div>
      </form>
    </>
  );
}

// export default function ShippingElement() {
//   const [customerAddress, setCustomerAddress] = useState();

// const options = {
//   // Fully customizable with appearance API.
//   appearance: {
//     /*...*/
//   },
// };

//   // console.log(customerAddress);

//   // function handleShippingForm(event: any) {
//   //   if (event.complete) {
//   //     setCustomerAddress(event.value);
//   //   }
//   // }

//   return (
// <Elements stripe={stripe} options={options}>
//   <ShippingForm />
// </Elements>
//   );
// }

// function ShippingForm() {
//   const elements = useElements();

//   // const handleShippingForm = async () => {
//   //   const addressElement = elements?.getElement("address");

//   //   if (addressElement != null) {
//   //     const { complete, value } = await addressElement.getValue();

//   //     if (complete) {

//   //     }
//   //   }
//   // };

//   return (
//     <form className={styles.shippingForm}>
//       <h2>Shipping Information</h2>
//       <div className={styles.loaderContainer}>{/* <Loader /> */}</div>
// <AddressElement
//   options={{ mode: "shipping" }}
//   // onChange={handleShippingForm}
// />
//     </form>
//   );
// }
