export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// "1 post", "3 posty", "5 postów"
export function pluralize(
  count: number,
  one: string,
  few: string,
  many: string,
) {
  if (count === 1) return one;
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14))
    return few;
  return many;
}
