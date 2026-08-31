export function formatMoney(value) {
  return `$${(Number(value) || 0).toFixed(2)}`;
}

export function spendByDay(orders, days = 7) {
  const map = new Map();
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date();
    day.setHours(0, 0, 0, 0);
    day.setDate(day.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    map.set(key, {
      label: day.toLocaleDateString(undefined, { weekday: 'short' }),
      value: 0,
    });
  }
  (orders || []).forEach((order) => {
    const key = new Date(order.createdAt).toISOString().slice(0, 10);
    if (map.has(key)) {
      const row = map.get(key);
      row.value = Math.round((row.value + Number(order.total || 0)) * 100) / 100;
    }
  });
  return [...map.values()];
}
