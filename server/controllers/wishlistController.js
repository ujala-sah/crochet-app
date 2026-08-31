import { WishlistItem } from '../models/WishlistItem.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

async function listForUser(userId) {
  const items = await WishlistItem.find({ user: userId }).populate('product').sort({ createdAt: -1 });
  return items.filter((item) => item.product);
}

export const getWishlist = asyncHandler(async (req, res) => {
  const items = await listForUser(req.user._id);
  res.json({ items, itemCount: items.length });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found.');
  await WishlistItem.updateOne(
    { user: req.user._id, product: productId },
    { $setOnInsert: { user: req.user._id, product: productId } },
    { upsert: true }
  );
  const items = await listForUser(req.user._id);
  res.status(201).json({ message: 'Saved to wishlist.', items, itemCount: items.length });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const item = await WishlistItem.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!item) throw new ApiError(404, 'Wishlist item not found.');
  const items = await listForUser(req.user._id);
  res.json({ message: 'Removed from wishlist.', items, itemCount: items.length });
});

export const removeWishlistByProduct = asyncHandler(async (req, res) => {
  await WishlistItem.findOneAndDelete({ user: req.user._id, product: req.params.productId });
  const items = await listForUser(req.user._id);
  res.json({ message: 'Removed from wishlist.', items, itemCount: items.length });
});
