interface ProductVariant {
  catalogId: string,
  color: string,
  colorCode: string,
  images: string[]
  price: string,
  size: string,
  stripePriceId: string,
  variantId: string,
  variantName: string,
}

interface Product {
  id: string,
  name: string,
  image: string,
  price: string,
  variants: ProductVariant[]
}

interface CartItem {
  catalogId: string,
  variantId: string,
  price: string,
  stripePriceId: string,
  quantity: number,
  image: string,
  name: string
}

type Cart = CartItem[];

type CountryList = Country[]

interface Country {
  code: string;
  name: string;
  region: string;
  states: null | [{ code: string; name: string }];
}

interface ShippingAddress {
  name?: string,
  address1: string,
  address2?: string,
  city: string,
  country_code: string,
  state_code: string,
  zip: number
}

interface ShippingItems {
  quantity: number,
  variant_id: number
}

interface ShippingData {
  recipient: ShippingAddress,
  items: ShippingItems[]
}

interface ShippingRegions {
  africa: number,
  americas: number,
  antarctic: number,
  asia: number,
  europe: number,
  oceania: number
}

interface RemoveFromCartResponse {
  success: boolean,
  lineItems: CartItem[];
  message: string;
}
