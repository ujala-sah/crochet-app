import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Pattern } from '../models/Pattern.js';
import { Order } from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { money } from '../utils/money.js';

function prettyLabel(key, raw) {
  const label = String(raw || 'Unspecified');
  if (key === 'availability') {
    return label.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }
  return label;
}

function tally(items, key) {
  const map = new Map();
  items.forEach((item) => {
    const label = prettyLabel(key, item[key]);
    map.set(label, (map.get(label) || 0) + 1);
  });
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function localDayKey(date) {
  const day = new Date(date);
  const year = day.getFullYear();
  const month = String(day.getMonth() + 1).padStart(2, '0');
  const dateNum = String(day.getDate()).padStart(2, '0');
  return `${year}-${month}-${dateNum}`;
}

function buildDailySales(orders, days = 30) {
  const dayMap = new Map();
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const key = localDayKey(day);
    dayMap.set(key, {
      label: day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      revenue: 0,
      orders: 0,
    });
  }
  orders.forEach((order) => {
    const key = localDayKey(order.createdAt);
    if (!dayMap.has(key)) return;
    const row = dayMap.get(key);
    row.revenue = money(row.revenue + order.total);
    row.orders += 1;
  });
  return [...dayMap.values()];
}

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ users: users.map((user) => user.toSafeJSON()) });
});

export const getStats = asyncHandler(async (req, res) => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [totalUsers, totalProducts, totalPatterns, recentProducts, recentPatterns, orders, products, patterns, newUsers, admins] =
    await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Pattern.countDocuments(),
      Product.find().sort({ createdAt: -1 }).limit(5),
      Pattern.find().sort({ createdAt: -1 }).limit(5),
      Order.find().sort({ createdAt: -1 }),
      Product.find().select('productType category availability featured name'),
      Pattern.find().select('category difficulty featured'),
      User.countDocuments({ createdAt: { $gte: weekAgo } }),
      User.countDocuments({ role: 'admin' }),
    ]);

  const totalRevenue = money(orders.reduce((sum, order) => sum + order.total, 0));
  const totalOrders = orders.length;
  const averageOrder = totalOrders ? money(totalRevenue / totalOrders) : 0;
  const itemsSold = orders.reduce(
    (sum, order) => sum + order.items.reduce((count, item) => count + item.quantity, 0),
    0
  );

  const salesByDay = buildDailySales(orders, 30);
  const last7 = salesByDay.slice(-7);
  const revenue7d = money(last7.reduce((sum, row) => sum + row.revenue, 0));
  const orders7d = last7.reduce((sum, row) => sum + row.orders, 0);
  const revenue30d = money(salesByDay.reduce((sum, row) => sum + row.revenue, 0));
  const orders30d = salesByDay.reduce((sum, row) => sum + row.orders, 0);

  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  const newUsers30d = await User.countDocuments({ createdAt: { $gte: monthAgo } });

  const productSales = new Map();
  orders.forEach((order) => {
    order.items.forEach((item) => {
      const current = productSales.get(item.name) || { name: item.name, quantity: 0, revenue: 0 };
      current.quantity += item.quantity;
      current.revenue = money(current.revenue + item.lineTotal);
      productSales.set(item.name, current);
    });
  });
  const topProducts = [...productSales.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  res.json({
    stats: {
      totalUsers,
      totalProducts,
      totalPatterns,
      totalOrders,
      totalRevenue,
      averageOrder,
      newUsers,
      admins,
      members: totalUsers - admins,
      featuredProducts: products.filter((item) => item.featured).length,
      featuredPatterns: patterns.filter((item) => item.featured).length,
      soldOut: products.filter((item) => item.availability === 'sold-out').length,
      inStock: products.filter((item) => item.availability === 'in-stock').length,
      madeToOrder: products.filter((item) => item.availability === 'made-to-order').length,
      itemsSold,
      revenue7d,
      orders7d,
      revenue30d,
      orders30d,
      newUsers30d,
    },
    salesByDay,
    topProducts,
    productsByType: tally(products, 'productType'),
    productsByCategory: tally(products, 'category'),
    availability: tally(products, 'availability'),
    patternsByCategory: tally(patterns, 'category'),
    patternsByDifficulty: tally(patterns, 'difficulty'),
    ordersByStatus: tally(orders, 'status'),
    soldOutProducts: products.filter((item) => item.availability === 'sold-out').map((item) => item.name),
    recentProducts,
    recentPatterns,
    recentOrders: orders.slice(0, 8),
  });
});
