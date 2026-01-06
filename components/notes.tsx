"use client";
import { useState, useRef, useCallback, useEffect } from "react";

type ElementType = "textbox" | "image" | "sticker";

interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  rotation?: number;
  fontSize?: number;
  color?: string;
}

const STICKERS = ["⭐", "❤️", "🎯", "💡", "🔥", "✨", "📌", "🎨", "📝", "🌟"];

export default function Notes() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [resizing, setResizing] = useState<{
    id: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);
  const [tool, setTool] = useState<"select" | "textbox" | "sticker">("select");
  const [selectedSticker, setSelectedSticker] = useState(STICKERS[0]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addTextbox = useCallback(
    (x: number, y: number) => {
      const newElement: CanvasElement = {
        id: generateId(),
        type: "textbox",
        x,
        y,
        width: 200,
        height: 100,
        content: "",
        fontSize: 16,
        color: "#2d2d2d",
      };
      setElements((prev) => [...prev, newElement]);
      setSelectedId(newElement.id);
      setTool("select");
    },
    [setElements, setSelectedId, setTool]
  );

  const addSticker = useCallback(
    (x: number, y: number) => {
      const newElement: CanvasElement = {
        id: generateId(),
        type: "sticker",
        x,
        y,
        width: 60,
        height: 60,
        content: selectedSticker,
        rotation: Math.random() * 20 - 10,
      };
      setElements((prev) => [...prev, newElement]);
      setSelectedId(newElement.id);
    },
    [selectedSticker]
  );

  const addImage = useCallback((file: File, x: number, y: number) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 300;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;

        const newElement: CanvasElement = {
          id: generateId(),
          type: "image",
          x,
          y,
          width,
          height,
          content: e.target?.result as string,
          rotation: Math.random() * 6 - 3,
        };
        setElements((prev) => [...prev, newElement]);
        setSelectedId(newElement.id);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === "textbox") {
      addTextbox(x, y);
    } else if (tool === "sticker") {
      addSticker(x, y);
    } else {
      setSelectedId(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, element: CanvasElement) => {
    e.stopPropagation();
    setSelectedId(element.id);

    const rect = canvasRef.current!.getBoundingClientRect();
    setDragging({
      id: element.id,
      offsetX: e.clientX - rect.left - element.x,
      offsetY: e.clientY - rect.top - element.y,
    });
  };

  const handleResizeStart = (e: React.MouseEvent, element: CanvasElement) => {
    e.stopPropagation();
    setResizing({
      id: element.id,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: element.width,
      startHeight: element.height,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragging) {
        const rect = canvasRef.current!.getBoundingClientRect();
        const newX = Math.max(0, e.clientX - rect.left - dragging.offsetX);
        const newY = Math.max(0, e.clientY - rect.top - dragging.offsetY);

        setElements((prev) =>
          prev.map((el) =>
            el.id === dragging.id ? { ...el, x: newX, y: newY } : el
          )
        );
      }

      if (resizing) {
        const deltaX = e.clientX - resizing.startX;
        const deltaY = e.clientY - resizing.startY;

        setElements((prev) =>
          prev.map((el) =>
            el.id === resizing.id
              ? {
                  ...el,
                  width: Math.min(50, resizing.startWidth + deltaX),
                  height: Math.min(50, resizing.startHeight + deltaY),
                }
              : el
          )
        );
      }
    },
    [dragging, resizing]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
    setResizing(null);
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const updateElementContent = (id: string, content: string) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, content } : el))
    );
  };

  const deleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedId(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((f) => f.type.startsWith("image/"));
    if (imageFile) {
      addImage(imageFile, x, y);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const rect = canvasRef.current!.getBoundingClientRect();
      addImage(file, rect.width / 2 - 100, rect.height / 2 - 100);
    }
    e.target.value = "";
  };

  return (
    <section className="h-full flex flex-col items-center">
      <h1>Notes</h1>

      {/* Toolbar */}
      <div className="toolbar">
        <button onClick={() => setTool("select")} title="Select & Move">
          Select
        </button>
        <button onClick={() => setTool("textbox")} title="Add Textbox">
          Textbox
        </button>
        <button onClick={() => fileInputRef.current?.click()} title="Add Image">
          Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div>
          {STICKERS.map((sticker) => (
            <button
              key={sticker}
              className={`sticker-btn ${
                tool === "sticker" && selectedSticker === sticker
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setTool("sticker");
                setSelectedSticker(sticker);
              }}
            >
              {sticker}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-90vw sm:w-[640px] aspect-square relative overflow-hidden cursor-crosshair border"
        role="application"
        aria-label="Canvas area - click to place elements"
        onClick={handleCanvasClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex gap-4 align-center">
          <label htmlFor="to">To</label>
          <input type="text" id="to" name="to" />
        </div>
        {/* Instructions - pointer-events-none so clicks pass through */}
        {elements.length === 0 && (
          <div
            className="pointer-events-none"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "#b8a070",
              fontSize: "1.1rem",
              opacity: 0.8,
            }}
          >
            <p>Click to add textboxes or stickers</p>
            <p>Drag & drop images onto the canvas</p>
          </div>
        )}

        {elements.map((element) => (
          <div
            key={element.id}
            style={{
              containerType: "size",
              position: "absolute",
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              transform: `rotate(${element.rotation || 0}deg)`,
              cursor: "move",
              userSelect: "none",
              zIndex: selectedId === element.id ? 100 : 1,
              ...(element.type === "textbox" && {
                background: "white",
                border:
                  selectedId === element.id
                    ? "2px solid #4ecdc4"
                    : "2px dashed #999",
                borderRadius: "4px",
                boxShadow:
                  selectedId === element.id
                    ? "0 0 0 3px rgba(78, 205, 196, 0.5)"
                    : "3px 3px 0 rgba(139, 109, 56, 0.15)",
              }),
              ...(element.type === "image" && {
                padding: "8px",
                background: "white",
                border: "2px solid #3d3d3d",
                borderRadius: "4px",
                boxShadow: "4px 4px 0 rgba(0, 0, 0, 0.15)",
              }),
              ...(element.type === "sticker" && {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                filter:
                  selectedId === element.id
                    ? "drop-shadow(0 0 8px rgba(78, 205, 196, 0.5))"
                    : "drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.2))",
              }),
            }}
            onMouseDown={(e) => handleMouseDown(e, element)}
            onClick={(e) => e.stopPropagation()}
          >
            {element.type === "textbox" && (
              <textarea
                value={element.content}
                onChange={(e) =>
                  updateElementContent(element.id, e.target.value)
                }
                placeholder="Type here..."
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "12px",
                  border: "none",
                  background: "transparent",
                  resize: "none",
                  fontSize: element.fontSize,
                  color: element.color,
                  outline: "none",
                  fontFamily: "inherit",
                }}
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {element.type === "image" && (
              <img
                src={element.content}
                alt="Canvas element"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "2px",
                  pointerEvents: "none",
                }}
                draggable={false}
              />
            )}

            {element.type === "sticker" && (
              <div
                style={{
                  fontSize: "min(80cqw, 80cqh)",
                  lineHeight: 1,
                  pointerEvents: "none",
                }}
              >
                {element.content}
              </div>
            )}

            {selectedId === element.id && (
              <>
                {/* Delete button */}
                <button
                  style={{
                    position: "absolute",
                    right: "-10px",
                    top: "-10px",
                    width: "20px",
                    height: "20px",
                    background: "#ff6b6b",
                    border: "2px solid white",
                    borderRadius: "50%",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "white",
                    lineHeight: 1,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteElement(element.id);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  title="Delete"
                >
                  ×
                </button>
                {/* Resize handle */}
                <div
                  style={{
                    position: "absolute",
                    right: "-8px",
                    bottom: "-8px",
                    width: "16px",
                    height: "16px",
                    background: "#4ecdc4",
                    border: "2px solid white",
                    borderRadius: "50%",
                    cursor: "se-resize",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                  onMouseDown={(e) => handleResizeStart(e, element)}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
