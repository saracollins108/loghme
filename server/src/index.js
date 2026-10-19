import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {
  categories,
  products,
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
} from './data/products.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const ORDERS_DIR = path.join(DATA_DIR, 'orders');
const MESSAGES_DIR = path.join(DATA_DIR, 'messages');
for (const dir of [ORDERS_DIR, MESSAGES_DIR]) fs.mkdirSync(dir, { recursive: true });

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '200kb' }));

const priceOf = (p) => p.discountPrice ?? p.price;
const normalize = (s) => String(s).toLowerCase().replace(/[\u200c\u200f]/g, '');
const categoryName = (id) => categories.find((c) => c.id === id)?.name || '';

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/categories', (_req, res) => res.json(categories));

app.get('/api/products', (req, res) => {
  const { q, category, sort, daily, featured, available } = req.query;
  let list = [...products];
  if (category) list = list.filter((p) => p.category === category);
  if (daily === '1') list = list.filter((p) => p.daily);
  if (featured === '1') list = list.filter((p) => p.featured);
  if (available === '1') list = list.filter((p) => p.available);
  if (q) {
    const needle = normalize(q);
    list = list.filter((p) =>
      normalize(
        `${p.name} ${p.description} ${p.longDescription || ''} ${categoryName(p.category)}`
      ).includes(needle)
    );
  }
  switch (sort) {
    case 'price-asc':
      list.sort((a, b) => priceOf(a) - priceOf(b));
      break;
    case 'price-desc':
      list.sort((a, b) => priceOf(b) - priceOf(a));
      break;
    case 'newest':
      list.sort((a, b) => b.createdAt - a.createdAt);
      break;
    default:
      list.sort((a, b) => b.featured - a.featured || b.createdAt - a.createdAt);
  }
  res.json(list);
});

app.get('/api/products/:slug', (req, res) => {
  const product = products.find((p) => p.slug === req.params.slug);
  if (!product) return res.status(404).json({ error: 'این غذا در منو پیدا نشد.' });
  res.json(product);
});

const PHONE_RE = /^09\d{9}$/;

app.post('/api/orders', (req, res) => {
  const { customer = {}, items = [], note = '' } = req.body || {};
  const errors = {};
  const name = String(customer.name || '').trim();
  const phone = String(customer.phone || '').replace(/\u0660-\u0669/g, (d) =>
    String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))
  );
  const address = String(customer.address || '').trim();

  if (name.length < 2) errors.name = 'نام و نام خانوادگی را وارد کنید.';
  if (!PHONE_RE.test(phone))
    errors.phone = 'شماره موبایل معتبر وارد کنید (مثلاً ۰۹۱۲۳۴۵۶۷۸۹).';
  if (address.length < 10) errors.address = 'آدرس کامل را وارد کنید (حداقل ۱۰ کاراکتر).';

  const orderItems = [];
  if (!Array.isArray(items) || items.length === 0) {
    errors.items = 'سبد خرید خالی است.';
  } else {
    for (const it of items) {
      const p = products.find((x) => x.id === it.productId);
      const qty = Number(it.qty);
      if (!p) {
        errors.items = 'یکی از غذاها در منو پیدا نشد.';
        break;
      }
      if (!p.available) {
        errors.items = `«${p.name}» در حال حاضر ناموجود است.`;
        break;
      }
      if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
        errors.items = `تعداد «${p.name}» باید بین ۱ تا ۲۰ پرس باشد.`;
        break;
      }
      orderItems.push({
        productId: p.id,
        slug: p.slug,
        name: p.name,
        image: p.image,
        unitPrice: priceOf(p),
        qty,
        lineTotal: priceOf(p) * qty,
      });
    }
  }

  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const subtotal = orderItems.reduce((s, it) => s + it.lineTotal, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const code = 'LQ-' + crypto.randomBytes(3).toString('hex').toUpperCase();

  const order = {
    code,
    createdAt: new Date().toISOString(),
    status: 'ثبت شده',
    customer: { name, phone, address, note: String(note || '').trim() },
    items: orderItems,
    subtotal,
    deliveryFee,
    total,
  };
  fs.writeFileSync(path.join(ORDERS_DIR, `${code}.json`), JSON.stringify(order, null, 2));
  res.status(201).json(order);
});

app.get('/api/orders/:code', (req, res) => {
  const code = String(req.params.code).toUpperCase();
  if (!/^LQ-[A-F0-9]{6}$/.test(code)) return res.status(404).json({ error: 'سفارش پیدا نشد.' });
  try {
    const order = JSON.parse(fs.readFileSync(path.join(ORDERS_DIR, `${code}.json`), 'utf8'));
    res.json(order);
  } catch {
    res.status(404).json({ error: 'سفارش پیدا نشد.' });
  }
});

app.post('/api/messages', (req, res) => {
  const { name = '', phone = '', message = '' } = req.body || {};
  const errors = {};
  if (String(name).trim().length < 2) errors.name = 'نام خود را وارد کنید.';
  if (!PHONE_RE.test(String(phone).trim()))
    errors.phone = 'شماره موبایل معتبر وارد کنید (مثلاً ۰۹۱۲۳۴۵۶۷۸۹).';
  if (String(message).trim().length < 10) errors.message = 'پیام خود را کامل‌تر بنویسید.';
  if (Object.keys(errors).length) return res.status(400).json({ errors });

  const id = 'MSG-' + crypto.randomBytes(3).toString('hex').toUpperCase();
  fs.writeFileSync(
    path.join(MESSAGES_DIR, `${id}.json`),
    JSON.stringify({ id, createdAt: new Date().toISOString(), name: String(name).trim(), phone: String(phone).trim(), message: String(message).trim() }, null, 2)
  );
  res.status(201).json({ id, message: 'پیام شما ثبت شد. به‌زودی با شما تماس می‌گیریم.' });
});

const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, '0.0.0.0', () => console.log(`Loghmeh API listening on :${PORT}`));
