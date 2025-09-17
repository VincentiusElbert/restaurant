export function formatCurrency(
  amount: number,
  locale = "id-ID",
  currency = "IDR",
) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    amount,
  );
}
