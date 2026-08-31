export const TAX_RATE = 0.1;
export const SHIPPING_FLAT = 4.99;
export const FREE_SHIPPING_AT = 75;

export function money(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

export function cartTotals(subtotalInput) {
  const subtotal = money(subtotalInput);
  const tax = money(subtotal * TAX_RATE);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FLAT;
  const total = money(subtotal + tax + shipping);
  return { subtotal, tax, shipping, total, taxRate: TAX_RATE, freeShippingAt: FREE_SHIPPING_AT };
}
