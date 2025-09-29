import { clsx, type ClassValue } from "clsx";
import { DateTime } from "luxon";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const relativeTime = (date: string) => {
  const datetime = DateTime.fromISO(date);
  return datetime.toRelative();
};
