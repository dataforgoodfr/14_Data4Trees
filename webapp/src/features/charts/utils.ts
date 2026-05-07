import React, { type ReactNode } from "react";

import type { MarkedComponent } from "./components/chart-component";

// Check if node or one of its children has been marked as Chart Component
export const isChartElement = (node: ReactNode): boolean => {
  if (!React.isValidElement(node)) {
    return false;
  }

  const element = node as React.ReactElement<{ children?: ReactNode }>;
  const type = element.type as MarkedComponent;

  if (type.isChartComponent) {
    return true;
  }

  const children = element.props.children;
  if (!children) {
    return false;
  }

  return React.Children.toArray(children).some(isChartElement);
};

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
