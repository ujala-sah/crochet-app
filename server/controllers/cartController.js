import { CartItem } from '../models/CartItem.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cartTotals, money } from '../utils/money.js';

async function populateCart(userId) {
  const items = await CartItem.find({ user: userId }).populate('product').sort({ createdAt: -1 });
  const lines = items
    .filter((item) => item.product)
    .map((item) => {
      const price = money(item.product.price);
      const quantity = item.quantity;
      return {
        id: item._id,
        quantity,
        product: item.product,
        unitPrice: price,
        lineTotal: money(price * quantity),
      };
    });
  const subtotal = money(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  return { items: lines, totals: cartTotals(subtotal), itemCount: lines.reduce((sum, line) => sum + line.quantity, 0) };
}

export const getCart = asyncHandler(async (req, res) => {
  res.json(await populateCart(req.user._id));
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const qty = Math.max(1, Number(quantity) || 1);
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found.');
  if (product.availability === 'sold-out') throw new ApiError(400, 'This item is sold out.');

  const existing = await CartItem.findOne({ user: req.user._id, product: productId });
  if (existing) {
    existing.quantity += qty;
    await existing.save();
  } else {
    await CartItem.create({ user: req.user._id, product: productId, quantity: qty });
  }
  res.status(201).json({ message: 'Added to cart.', ...(await populateCart(req.user._id)) });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const quantity = Math.max(0, Number(req.body.quantity) || 0);
  const item = await CartItem.findOne({ _id: req.params.id, user: req.user._id });
  if (!item) throw new ApiError(404, 'Cart item not found.');
  if (quantity < 1) {
    await item.deleteOne();
  } else {
    item.quantity = quantity;
    await item.save();
  }
  res.json({ message: 'Cart updated.', ...(await populateCart(req.user._id)) });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const item = await CartItem.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!item) throw new ApiError(404, 'Cart item not found.');
  res.json({ message: 'Removed from cart.', ...(await populateCart(req.user._id)) });
});
