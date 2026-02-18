export function generateOrderNumber() {
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `OR-${random}`;
}
