// Utility to remove emojis from a string
export function removeEmojis(str) {
  // This regex covers most emoji ranges
  return str.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83D[\uDE00-\uDE4F])/gu,
    ""
  );
}
