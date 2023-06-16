import {ApiError, ClientError, IpregistryClient} from '@ipregistry/client';


// IP address is used to find customers currency code

export async function lookupIP(key: string) {
  const client = new IpregistryClient(key);
  try {
      const response = await client.originLookup();
      const countryCode = response.data.location.continent.code;
      const countryName = response.data.location.continent.name;
      const currencyCode = response.data.currency.code;
      const locationData: locationData = {countryCode, countryName, currencyCode}
      return locationData;
  } catch (error) {
      if (error instanceof ApiError) {
          console.error('API error', error);
      } else if (error instanceof ClientError) {
          console.error('Client error', error);
      } else {
          console.error('Unexpected error', error);
      }
      return error
  }
}
