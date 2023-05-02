interface ProductVariant {
  color: string,
  colorCode: string,
  images: string[]
  price: string,
  size: string,
  stripePriceId?: string,
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