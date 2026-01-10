import { useSyncExternalStore } from "react";
import { Canvas } from "./types";

export default function useActiveTool(canvas: Canvas | null) {
  return useSyncExternalStore(
    (cb) => {
      return canvas?.subscribe(cb) ?? (() => {});
    },
    () => canvas?.getActiveTool(),
    () => null
  );
}
