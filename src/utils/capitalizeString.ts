export function capitalizeString(field: string | null | undefined): string {
  if (!field || typeof field !== "string") return "";

  return field
    .trim()
    .split(/\s+/)
    .map(
      (palabra: string) =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    )
    .join(" ");
}
