import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const CATALOG_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function appendJson(file, entry) {
  const list = await readJson(file, []);
  list.push(entry);
  await fs.writeFile(file, JSON.stringify(list, null, 2));
}

const toEnglishDigits = (value = '') =>
  String(value)
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/products', async (_req, res) => {
  const catalog = await readJson(CATALOG_FILE, { products: [], categories: [], deliveryFee: 0 });
  res.json(catalog);
});

app.post('/api/orders', async (req, res) => {
  const { items, customer = {}, note = '' } = req.body ?? {};
  const catalog = await readJson(CATALOG_FILE, { products: [], categories: [], deliveryFee: 0 });
  const products = catalog.products ?? [];

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ ok: false, message: 'سبد خرید خالی است.' });
  }
  const name = String(customer.name ?? '').trim();
  const phone = toEnglishDigits(String(customer.phone ?? '')).replace(/[\s-]/g, '');
  const address = String(customer.address ?? '').trim();
  if (name.length < 3) {
    return res.status(400).json({ ok: false, message: 'نام و نام خانوادگی را کامل وارد کنید.' });
  }
  if (!/^09\d{9}$/.test(phone)) {
    return res.status(400).json({ ok: false, message: 'شماره موبایل معتبر نیست.' });
  }
  if (address.length < 10) {
    return res.status(400).json({ ok: false, message: 'آدرس دقیق را وارد کنید.' });
  }

  const orderItems = [];
  for (const raw of items) {
    const product = products.find((p) => p.id === raw?.id);
    if (!product) {
      return res.status(400).json({ ok: false, message: 'یکی از غذاهای سبد خرید در منو پیدا نشد.' });
    }
    if (!product.available) {
      return res.status(400).json({ ok: false, message: `«${product.name}» فعلاً موجود نیست.` });
    }
    const qty = Math.floor(Number(raw.qty));
    if (!Number.isFinite(qty) || qty < 1 || qty > 20) {
      return res.status(400).json({ ok: false, message: 'تعداد پرس‌ها باید بین ۱ تا ۲۰ باشد.' });
    }
    orderItems.push({ id: product.id, name: product.name, price: product.price, qty });
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = catalog.deliveryFee ?? 0;
  const order = {
    id: crypto.randomUUID(),
    code: 'LQM-' + Math.floor(10000 + Math.random() * 90000),
    createdAt: new Date().toISOString(),
    items: orderItems,
    customer: { name, phone, address },
    note: String(note).slice(0, 500),
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
  };
  await appendJson(ORDERS_FILE, order);
  res.json({
    ok: true,
    order: {
      code: order.code,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      itemsCount: orderItems.reduce((sum, item) => sum + item.qty, 0),
    },
  });
});

app.post('/api/contact', async (req, res) => {
  const { name = '', phone = '', message = '' } = req.body ?? {};
  const cleanName = String(name).trim();
  const cleanPhone = toEnglishDigits(String(phone)).replace(/[\s-]/g, '');
  const cleanMessage = String(message).trim();
  if (cleanName.length < 3) {
    return res.status(400).json({ ok: false, message: 'نام را کامل وارد کنید.' });
  }
  if (!/^09\d{9}$/.test(cleanPhone)) {
    return res.status(400).json({ ok: false, message: 'شماره موبایل معتبر نیست.' });
  }
  if (cleanMessage.length < 10) {
    return res.status(400).json({ ok: false, message: 'متن پیام کوتاه است؛ کمی بیشتر بنویسید.' });
  }
  await appendJson(MESSAGES_FILE, {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: cleanName,
    phone: cleanPhone,
    message: cleanMessage.slice(0, 1000),
  });
  res.json({ ok: true, message: 'پیام شما ثبت شد. به‌زودی با شما تماس می‌گیریم.' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ ok: false, message: 'خطایی رخ داد. لطفاً دوباره تلاش کنید.' });
});

app.listen(4000, '0.0.0.0', () => console.log('loghmeh api listening on :4000'));
