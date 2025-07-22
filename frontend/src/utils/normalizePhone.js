// Normalize phone number

export const normalizeNumber = (number) => {
  let normalized = number.replace(/\s+/g, ""); // Remove spaces
  if (number.startsWith("6")) {
    normalized = `+237${number}`;
  } else if (number.startsWith("2376")) {
    normalized = `+${number}`;
  } else if (number.startsWith("+237 6")) {
    normalized = number.replace("+237 ", "+237");
  }
  return normalized;
};
