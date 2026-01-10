import type {
  Node,
  Id,
  State,
  Tool,
  Canvas,
  PointerInfo,
  BoundTool,
  Listener,
} from "./types";
import { normalizePointerEvent } from "./utils";

const createRenderer = (rootEl: HTMLElement) => {
  return {
    add: (node: Node) => {
      const nodeEl = document.createElement("div");

      nodeEl.style.position = "absolute";
      nodeEl.style.top = node.position.y.toString() + "px";
      nodeEl.style.left = node.position.x.toString() + "px";
      nodeEl.textContent = node.content;

      rootEl.appendChild(nodeEl);
    },
  };
};

export default function createCanvas({
  root,
  tools,
}: {
  root: HTMLElement;
  tools: Tool[];
}): Canvas {
  const controller = new AbortController();

  const state: State = {
    nodes: {
      map: new Map(),
      selection: null,
    },
    tools: {
      map: new Map(),
      selection: null,
    },
    listeners: new Set(),
  };
  const renderer = createRenderer(root);
  const canvas: Canvas = {
    // Nodes
    addNode: (x: number, y: number, content: string) => {
      const node: Node = {
        position: { x, y },
        content,
      };
      state.nodes.map.set(crypto.randomUUID(), node);

      renderer.add(node);
    },

    // Tools
    addTool: (tool: Tool) => {
      if (state.tools.map.has(tool.id)) {
        throw new Error(`Tool ${tool.id} already exists`);
      }

      const _tool: BoundTool = {
        id: tool.id,
        onClick: (p: PointerInfo) => {
          tool.onClick?.(p, { canvas });
        },
      };

      state.tools.map.set(tool.id, _tool);
    },
    getActiveTool: () => {
      return state.tools.selection;
    },
    setActiveTool: (toolId: Id) => {
      state.tools.selection = toolId;
      state.listeners.forEach((listener) => listener());
    },

    // Subscriptions
    subscribe: (listener: Listener) => {
      state.listeners.add(listener);
      return () => {
        state.listeners.delete(listener);
      };
    },

    // Destruction
    destroy: () => {
      controller.abort();
    },
  };

  // Init
  tools.forEach((tool) => {
    canvas.addTool(tool);
  });

  // Event listeners
  const handleClick = (e: PointerEvent) => {
    if (!state.tools.selection) return;
    const tool = state.tools.map.get(state.tools.selection);
    if (!tool) return;
    const p = normalizePointerEvent(e);
    if (!p) return;
    tool.onClick?.(p);
  };
  root.addEventListener("click", handleClick, { signal: controller.signal });

  return canvas;
}
