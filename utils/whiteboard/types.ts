export type Id = string;

export interface BaseShape {
  id: Id;
  type: string;
  x: number;
  y: number;
}

export interface RectangleShape extends BaseShape {
  type: "rectangle";
  width: number;
  height: number;
}

export type Shape = RectangleShape; // extend later

export interface Viewport {
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export interface Renderer {
  mount(container: HTMLElement): void;
  handle(event: EditorEvent): void;
  unmount(): void;
}

export interface Tool {
  onPointerDown(e: PointerEvent, editor: IEditor): void;
  onPointerMove(e: PointerEvent, editor: IEditor): void;
  onPointerUp(e: PointerEvent, editor: IEditor): void;
}

export type EditorEvent =
  | { type: "shape:added"; shape: Shape }
  | { type: "shape:updated"; id: Id; shape: Partial<Omit<Shape, "id">> }
  | { type: "shape:removed"; id: Id }
  | { type: "viewport:changed"; viewport: Partial<Viewport> };

export interface EditorState {
  shapes: Record<Id, Shape>;
}

export type ViewportState = Viewport;

export type ToolState = {
  current: Tool | undefined;
};

export interface IEditor {
  // Lifecycle
  mount(element: HTMLElement): void;
  unmount(): void;
  destroy(): void;

  // Read
  getEditorState(): Readonly<EditorState>;
  getViewportState(): Readonly<ViewportState>;
  getShapes(): Readonly<EditorState["shapes"]>;
  getShape(id: Id): Readonly<Shape> | undefined;
  getCurrentTool(): Tool | undefined;

  // Mutations
  addShape(shape: Shape): void;
  updateShape(id: Id, shape: Partial<Omit<Shape, "Id">>): void;
  deleteShape(id: Id): void;
  updateViewport(viewport: Partial<Viewport>): void;
  setCurrentTool(tool: Tool): void;

  // Listeners
  on(listener: Listener): () => void;
  off(listener: Listener): void;
  emit(event: EditorEvent): void;
}

export type Listener = (event: EditorEvent) => void;
