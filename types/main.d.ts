interface ProductVariant {
  catalogId: string,
  color: string,
  colorCode: string,
  images: string[]
  price: string,
  priceIds?: PriceId,
  size: string,
  stripePriceId: string,
  variantId: string,
  variantName: string,
}

interface Product {
  currencies?: string[],
  id: string,
  image: string,
  name: string,
  price: string,
  variants: ProductVariant[]
}

interface PriceId {
  [currencyCode: string]: string
}

interface PriceData {
  [id: string]: PriceId | undefined
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

interface PrintfulRecipient {
  name: string,
  address1: string,
  address2?: string,
  city: string,
  state_code: string,
  country_code: string,
  zip: string
}

interface PrintfulItem {
  sync_variant_id: number,
  quantity: number
}

interface PrintfulOrder {
  recipient: PrintfulRecipient,
  items: PrintfulItem[]
}

interface EmailItem {
  variantName: string,
  image: string,
  price: number,
  quantity: number
}

interface locationData {
  countryCode: string | null,
  countryName: string | null,
  currencyCode: string | null,
}