import { parse, format, isValid } from "date-fns";

/**
 * Try multiple date formats to parse the input reliably.
 */
const tryParseDate = (input, formats) => {
  for (const fmt of formats) {
    const parsed = parse(input, fmt, new Date());
    if (isValid(parsed)) return parsed;
  }
  return null;
};

export const formatDate = (inputDate) => {
  if (!inputDate || typeof inputDate !== "string") return "";

  const supportedFormats = [
    "dd/MM/yyyy HH:mm:ss",
    "dd/MM/yyyy",
    "yyyy-MM-dd",
    "yyyy-MM-dd HH:mm:ss",
  ];

  const parsedDate = tryParseDate(inputDate.trim(), supportedFormats);

  if (!parsedDate) {
    console.warn("Invalid date input:", inputDate);
    return "";
  }

  return format(parsedDate, "dd/MM/yyyy");
};
