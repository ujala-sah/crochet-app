import { Pattern } from '../models/Pattern.js';
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

function patternPayload(body) {
  return {
    name: body.name,
    description: body.description,
    shortDescription: body.shortDescription || body.description.slice(0, 140),
    category: body.category,
    difficulty: body.difficulty,
    materials: body.materials,
    estimatedSkill: body.estimatedSkill || '',
    additionalInfo: body.additionalInfo || '',
    hookSize: body.hookSize || '',
    yarnWeight: body.yarnWeight || '',
    image: body.image,
    additionalImages: parseImages(body.additionalImages),
    featured: Boolean(body.featured),
  };
}

function buildQuery(req) {
  const query = {};
  const { name, category, difficulty, featured, q } = req.query;
  const search = name || q;
  if (search) query.name = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (featured === 'true') query.featured = true;
  return query;
}

export const listPatterns = asyncHandler(async (req, res) => {
  const patterns = await Pattern.find(buildQuery(req)).sort({ createdAt: -1 });
  res.json({ patterns });
});

export const searchPatterns = asyncHandler(async (req, res) => {
  const name = req.query.name || '';
  const patterns = await Pattern.find({ name: { $regex: name, $options: 'i' } }).sort({ createdAt: -1 });
  res.json({ patterns });
});

export const getPattern = asyncHandler(async (req, res) => {
  const pattern = await Pattern.findById(req.params.id);
  if (!pattern) throw new ApiError(404, 'Pattern not found.');
  res.json({ pattern });
});

export const createPattern = asyncHandler(async (req, res) => {
  const pattern = await Pattern.create(patternPayload(req.body));
  res.status(201).json({ message: 'Pattern created.', pattern });
});

export const updatePattern = asyncHandler(async (req, res) => {
  const pattern = await Pattern.findByIdAndUpdate(req.params.id, patternPayload(req.body), {
    new: true,
    runValidators: true,
  });
  if (!pattern) throw new ApiError(404, 'Pattern not found.');
  res.json({ message: 'Pattern updated.', pattern });
});

export const deletePattern = asyncHandler(async (req, res) => {
  const pattern = await Pattern.findByIdAndDelete(req.params.id);
  if (!pattern) throw new ApiError(404, 'Pattern not found.');
  res.json({ message: 'Pattern deleted.', id: pattern._id });
});
