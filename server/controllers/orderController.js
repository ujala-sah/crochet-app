import { Order } from '../models/Order.js';
import { CartItem } from '../models/CartItem.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cartTotals, money } from '../utils/money.js';

export const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  const spent = money(orders.reduce((sum, order) => sum + order.total, 0));
  res.json({ orders, spent, orderCount: orders.length });
});

export const listAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(100);
  res.json({ orders });
});

export const checkout = asyncHandler(async (req, res) => {
  const { billing } = req.body;
  const required = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode', 'country'];
  for (const field of required) {
    if (!String(billing?.[field] || '').trim()) {
      throw new ApiError(400, 'Please complete every billing field.');
    }
  }

  const cart = await CartItem.find({ user: req.user._id }).populate('product');
  const available = cart.filter((item) => item.product);
  if (!available.length) throw new ApiError(400, 'Your cart is empty.');

  const items = available.map((item) => {
    const price = money(item.product.price);
    const quantity = item.quantity;
    return {
      product: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price,
      quantity,
      lineTotal: money(price * quantity),
    };
  });
  const subtotal = money(items.reduce((sum, item) => sum + item.lineTotal, 0));
  const totals = cartTotals(subtotal);

  const order = await Order.create({
    user: req.user._id,
    items,
    billing: {
      fullName: billing.fullName.trim(),
      email: billing.email.trim(),
      phone: billing.phone.trim(),
      address: billing.address.trim(),
      city: billing.city.trim(),
      postalCode: billing.postalCode.trim(),
      country: billing.country.trim(),
    },
    ...totals,
    status: 'paid',
  });

  await CartItem.deleteMany({ user: req.user._id });
  res.status(201).json({
    message: `Thank you, ${billing.fullName.trim()}. Your order is confirmed.`,
    order,
  });
});
