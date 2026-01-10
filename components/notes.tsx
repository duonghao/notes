"use client";

import useCanvas from "@/utils/canvas/useCanvas";
import { Tool } from "@/utils/canvas/types";
import { cn } from "@/utils/components";
import useActiveTool from "@/utils/canvas/useActiveTool";

const tools: Tool[] = [
  {
    id: "image",
    onClick: (p, { canvas }) => {
      canvas.addNode(p.x, p.y, "🖼️");
    },
  },
  {
    id: "text",
    onClick: (p, { canvas }) => {
      canvas.addNode(p.x, p.y, "hello");
    },
  },
];

export default function Notes() {
  const { ref, canvas } = useCanvas(tools);
  const activeTool = useActiveTool(canvas);

  return (
    <section className="w-full h-full">
      <div className="flex gap-2">
        <button
          onClick={() => {
            canvas?.setActiveTool("image");
            console.log(canvas?.getActiveTool());
          }}
          className={cn(activeTool === "image" && "bg-red-500!", "w-12 h-12")}
        >
          🖼️
        </button>
        <button
          onClick={() => {
            canvas?.setActiveTool("text");
            console.log(canvas?.getActiveTool());
          }}
          className={cn(activeTool === "text" && "bg-red-500!", "w-12 h-12")}
        >
          T
        </button>
      </div>
      <div ref={ref} className="w-full h-full relative border" />
    </section>
  );
}
