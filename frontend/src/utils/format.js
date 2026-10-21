const formatter = new Intl.NumberFormat('fa-IR');

export function faNum(value) {
  return formatter.format(value);
}

export function formatPrice(value) {
  return `${formatter.format(value)} تومان`;
}
