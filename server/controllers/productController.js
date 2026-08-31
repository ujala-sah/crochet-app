import { Product } from '../models/Product.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function parseImages(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value)
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function productPayload(body) {
  return {
    name: body.name,
    description: body.description,
    shortDescription: body.shortDescription || body.description.slice(0, 140),
    category: body.category,
    productType: body.productType || 'Handmade Piece',
    price: body.price === '' || body.price === undefined ? 0 : Number(body.price),
    availability: body.availability || 'in-stock',
    image: body.image,
    additionalImages: parseImages(body.additionalImages),
    featured: Boolean(body.featured),
  };
}

function buildQuery(req) {
  const query = {};
  const { name, category, productType, availability, featured, q } = req.query;
  const search = name || q;
  if (search) query.name = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  if (productType) query.productType = productType;
  if (availability) query.availability = availability;
  if (featured === 'true') query.featured = true;
  return query;
}

export const listProducts = asyncHandler(async (req, res) => {
  const products = await Product.find(buildQuery(req)).sort({ createdAt: -1 });
  res.json({ products });
});

export const searchProducts = asyncHandler(async (req, res) => {
  const name = req.query.name || '';
  const products = await Product.find({ name: { $regex: name, $options: 'i' } }).sort({ createdAt: -1 });
  res.json({ products });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found.');
  res.json({ product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(productPayload(req.body));
  res.status(201).json({ message: 'Product created.', product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, productPayload(req.body), {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, 'Product not found.');
  res.json({ message: 'Product updated.', product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found.');
  res.json({ message: 'Product deleted.', id: product._id });
});
