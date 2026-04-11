export const lineBreakLabel = (label: string, maxChars = 14) => {
  const words = label.split(" ");
  const lines: string[] = [];
  const nbLines = Math.ceil(label.length / maxChars);
  const avgLineLength = label.length / nbLines;
  let currentLine = "";

  for (const word of words) {
    const next = currentLine ? `${currentLine} ${word}` : word;
    if (next.length < avgLineLength || lines.length === nbLines - 1) {
      currentLine = next;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
};
