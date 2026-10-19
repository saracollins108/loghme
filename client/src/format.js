const faFmt = new Intl.NumberFormat('fa-IR');
const faDateFmt = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'long' });

export const formatPrice = (n) => faFmt.format(Math.round(Number(n) || 0));
export const faDigits = (n) => faFmt.format(Number(n) || 0);
export const faDate = (iso) => faDateFmt.format(new Date(iso));
