import { useState, useContext, useEffect } from "react";
import { CartContext } from "../../context/CartContext";
import LineItem from "../../components/LineItem";
import CountryDropdown from "../../components/shippingForm/CountryDropdown";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import { getShippingRegionsFromFirebase } from "../../utils/firebase/cart";
import styles from "../../styles/Cart.module.css";
import { getCartFromFirebase } from "../../utils/firebase/cart";

interface CartProps {
  countryList: CountryList;
  shippingRegions: ShippingRegions;
}

export default function Cart({ countryList, shippingRegions }: CartProps) {
  const [countryValue, setCountryValue] = useState("US-americas");
  const [regionValue, setRegionValue] = useState<string>("americas");
  const shippingCost: number =
    shippingRegions[regionValue as keyof ShippingRegions];
  const { lineItems, setLineItems, isLoading, setIsLoading } =
    useContext(CartContext);

  const subtotal: number | undefined = lineItems?.reduce(
    (acc: number, item: CartItem) => {
      let timesToAdd = item.quantity;
      while (timesToAdd > 0) {
        acc += Number(item.price);
        timesToAdd--;
      }
      return acc;
    },
    0
  );

  useEffect(() => {
    // get cart from firebase
    async function getCart() {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const token = localStorage.getItem("token");
      if (token !== null) {
        const cart = await getCartFromFirebase(token);
        setLineItems(cart);
      }
      setIsLoading(false);
    }
    getCart();
  }, [setIsLoading, setLineItems]);

  const total = (subtotal || 0) + shippingCost;
  const formattedSubtotal = subtotal?.toFixed(2);
  const formattedTotal = total.toFixed(2);

  console.log(formattedSubtotal);

  useEffect(() => {
    const region = countryValue.split("-")[1];
    setRegionValue(region);
  }, [countryValue]);

  function createCheckoutSession() {}

  const country = countryValue.split("-")[0];
  const region = countryValue.split("-")[1];

  return (
    <>
      <div className={styles.cartContainer}>
        <div className={styles.cartHeader}>
          <h1>Cart</h1>
        </div>
        <div className={styles.detailsContainer}>
          <div className={styles.lineItemContainer}>
            <div className={styles.lineItemHeaders}>
              <h3>Product</h3>
              <h3>Total</h3>
            </div>
            {isLoading ? (
              <div className={styles.loaderContainer}>
                <Loader />
              </div>
            ) : lineItems ? (
              lineItems.map((item) => {
                return <LineItem key={item.variantId} item={item} />;
              })
            ) : (
              <div>nothing in cart</div>
            )}
          </div>

          <div className={styles.shippingFormContainer}>
            <h2>Cart Total</h2>
            <div className={styles.orderSummary}>
              <div>
                <h3>Subtotal</h3>
                {isLoading ? (
                  <Loader size="small" />
                ) : (
                  <div className={styles.cartCost}>${formattedSubtotal}</div>
                )}
              </div>
              <div>
                <div>
                  <h3 className={styles.shippingTitle}>Shipping</h3>
                  {/* <div className={styles.enterShipping}>Flat Rate</div> */}
                  <div className={styles.dropdownContainer}>
                    <form>
                      <label htmlFor="country">
                        Select country to calculate shipping
                      </label>
                      <CountryDropdown
                        countryValue={countryValue}
                        setCountryValue={setCountryValue}
                        countryList={countryList}
                      />
                      {/* <button
                        type="submit"
                        className={styles.calculateShippingButton}
                      >
                        calculate shipping
                      </button> */}
                    </form>
                  </div>
                </div>
                <div className={styles.cartCost}>${shippingCost}</div>
              </div>
              <div>
                <h3>Total</h3>
                {isLoading ? (
                  <Loader size="small" />
                ) : (
                  <div className={`${styles.cartCost} ${styles.totalCost}`}>
                    ${formattedTotal}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.checkoutButtonContainer}>
              <Button text="checkout" onClick={createCheckoutSession} />
            </div>
            {/* <ShippingForm countryList={countryList} /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const response = await fetch("https://api.printful.com/countries");
  const data = await response.json();
  data.result.sort(function (a: any, b: any) {
    var textA = a.name.toUpperCase();
    var textB = b.name.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  const countries = data.result;
  const USIndex = countries.findIndex((country: any) => country.code === "US");
  const US = countries[USIndex];
  const before = countries.splice(0, USIndex);
  const after = countries.splice(USIndex + 1);
  const USFirstList = [US, ...before, ...after];

  const shippingRegions = await getShippingRegionsFromFirebase();

  return {
    props: { countryList: USFirstList, shippingRegions },
  };
}
