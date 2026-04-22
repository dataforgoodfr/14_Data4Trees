import { lineBreakLabel } from "../utils";

export const renderPolarAngleTick = ({ payload, x, y, textAnchor }: any) => {
  const label = String(payload?.value ?? "");
  const lines = lineBreakLabel(label);

  return (
    <text
      fill="#9c9798"
      fontSize={12}
      textAnchor={textAnchor}
      x={x}
      y={y}
    >
      {lines.map((line, index) => (
        <tspan
          dy={index === 0 ? 0 : 16}
          // biome-ignore lint/suspicious/noArrayIndexKey: <don't want to enforce id>
          key={index}
          x={x}
        >
          {line}
        </tspan>
      ))}
    </text>
  );
};
