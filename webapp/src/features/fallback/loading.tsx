import { ClipLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <ClipLoader
        cssOverride={{
          // see https://github.com/davidhu2000/react-spinners/blob/main/src/ClipLoader.tsx
          borderLeftColor: "var(--accent)",
          borderRightColor: "var(--accent)",
          borderTopColor: "var(--accent)",
        }}
        loading={true}
        size={50}
      />
    </div>
  );
}
