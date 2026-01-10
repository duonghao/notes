import { useLayoutEffect, useRef, useState } from "react";
import createCanvas from "./canvas";
import { Tool } from "./types";

export default function useCanvas(tools: Tool[] = []) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [canvas, setCanvas] = useState<ReturnType<typeof createCanvas> | null>(
    null
  );

  useLayoutEffect(() => {
    if (!ref.current) return;

    const _canvas = createCanvas({
      root: ref.current,
      tools,
    });

    setCanvas(_canvas);

    return () => _canvas.destroy();
  }, [tools]);

  return {
    ref,
    canvas,
  };
}
