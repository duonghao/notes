// Shared
export type Id = string;
export type Identifiable = {
  id: Id;
};

// Nodes
export type Node = {
  position: { x: number; y: number };
  content: string;
};

// Tools
export type PointerInfo = {
  x: number;
  y: number;
};
export type ToolContext = {
  canvas: Canvas;
};
export type Tool = Identifiable & {
  onClick?(e: PointerInfo, ctx: ToolContext): void;
};
export type BoundTool = Identifiable & {
  onClick?: (e: PointerInfo) => void;
};
export type State = {
  nodes: {
    map: Map<Id, Node>;
    selection: Id | null;
  };
  tools: {
    map: Map<Id, BoundTool>;
    selection: Id | null;
  };
  listeners: Set<Listener>;
};

// Subscriptions
export type Listener = () => void;

// Canvas
export type Canvas = {
  // Nodes
  addNode: (x: number, y: number, content: string) => void;
  // Tools
  addTool: (tool: Tool) => void;
  getActiveTool: () => Id | null;
  setActiveTool: (toolId: Id) => void;
  // Subscriptions
  subscribe: (listener: Listener) => () => void;
  // Destruction
  destroy: () => void;
};
