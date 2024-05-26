export function getImageURL(path: string): string {
  return new URL(`/assets/${path}`, import.meta.url).href;
}

export function convertYearToBcOrNot(year: number): string {
  if (String(year)[0] === "-") return String(year).slice(1) + "BC";
  else return String(year);
}