import { useState, useEffect, createContext } from "react";
import { v4 as uuid } from "uuid";
import {
  setLocationInFirebase,
  getLocationFromFirebase,
} from "../utils/firebase";

// export const IPContext = createContext<string | undefined>(undefined);

export const IPContext = createContext<locationData | undefined>(
  {} as locationData
);

export function IPContextProvider({ children }: { children: React.ReactNode }) {
  const [IPData, setIPData] = useState<locationData | undefined>(undefined);
  console.log(IPData);

  // check session storage for ip token

  // if no ip token
  // create new token with uuid
  // get ip data
  // setIPData
  // set collection in firestore with token as id and ip data as fields

  // if ip token
  // get ip data from firestore
  // setIPData

  async function getIPData() {
    let token = sessionStorage.getItem("currencyToken");
    token = token && JSON.parse(token);
    let locationData;

    if (token) {
      locationData = await getLocationFromFirebase(token);
    }

    if (!token) {
      token = uuid();
      sessionStorage.setItem("currencyToken", JSON.stringify(token));
      const response = await fetch("/api/lookup-IP");
      locationData = await response.json();
      await setLocationInFirebase(token, locationData);
    }
    setIPData(locationData);
  }

  useEffect(() => {
    getIPData();
  }, []);

  return <IPContext.Provider value={IPData}>{children}</IPContext.Provider>;
}
