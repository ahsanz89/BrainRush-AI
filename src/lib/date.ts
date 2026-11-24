export const todayISO = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const dailySeed = (d = new Date()) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
export const lastDays = (n: number, from = new Date()) => Array.from({ length: n }, (_, i) => { const x = new Date(from); x.setDate(x.getDate() - (n - 1 - i)); return todayISO(x); });
export const shortDay = (iso: string) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(iso + 'T12:00:00').getDay()];
