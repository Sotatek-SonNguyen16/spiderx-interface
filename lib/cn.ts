/**
 * Class name utility for combining Tailwind classes
 * Filters out falsy values and joins remaining classes with spaces
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
