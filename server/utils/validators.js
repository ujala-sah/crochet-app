import { body, param, query } from 'express-validator';

export const registerRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Full name must be 2–80 characters.'),
  body('email')
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false })
    .withMessage('Please enter a valid email address.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/)
    .withMessage('Password must include an uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Password must include a lowercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must include a number.'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match.');
    return true;
  }),
];

export const otpRules = [
  body('email')
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false })
    .withMessage('Please enter a valid email address.'),
  body('code').trim().isLength({ min: 6, max: 6 }).withMessage('Enter the 6-digit code.'),
];

export const emailOnlyRules = [
  body('email')
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false })
    .withMessage('Please enter a valid email address.'),
];

export const loginRules = [
  body('email')
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false })
    .withMessage('Please enter a valid email address.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

const imageRule = body('image')
  .trim()
  .custom((value) => {
    if (/^https?:\/\//i.test(value) || value.startsWith('/')) return true;
    throw new Error('A valid image URL or site path is required.');
  });

export const productRules = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Product name is required.'),
  body('description').trim().isLength({ min: 10, max: 4000 }).withMessage('Description must be at least 10 characters.'),
  body('category').trim().notEmpty().withMessage('Category is required.'),
  imageRule,
  body('price').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Price must be 0 or greater.'),
  body('availability')
    .optional()
    .isIn(['in-stock', 'made-to-order', 'sold-out'])
    .withMessage('Invalid availability value.'),
];

export const patternRules = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('Pattern name is required.'),
  body('description').trim().isLength({ min: 10, max: 6000 }).withMessage('Description must be at least 10 characters.'),
  body('category').trim().notEmpty().withMessage('Category is required.'),
  body('difficulty')
    .isIn(['Beginner', 'Easy', 'Intermediate', 'Advanced'])
    .withMessage('Select a valid difficulty level.'),
  body('materials').trim().notEmpty().withMessage('Materials are required.'),
  imageRule,
];

export const searchRules = [
  query('name').optional().trim().isLength({ max: 120 }).withMessage('Search query is too long.'),
];

export const idParam = [param('id').isMongoId().withMessage('Invalid id.')];
