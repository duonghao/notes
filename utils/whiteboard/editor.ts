import type {
  EditorEvent,
  EditorState,
  Id,
  IEditor,
  Listener,
  Renderer,
  Shape,
  Tool,
  ToolState,
  Viewport,
  ViewportState,
} from "./types";

export class Editor implements IEditor {
  renderer: Renderer;
  isMounted: boolean = false;

  // State
  editorState: EditorState = {
    shapes: {},
  };
  viewportState: ViewportState = {
    zoom: 0,
    offsetX: 0,
    offsetY: 0,
  };
  toolState: ToolState = {
    current: undefined,
  };

  constructor({ renderer }: EditorOptions) {
    this.renderer = renderer;

    this.on(this.renderer.handle.bind(this.renderer));
  }

  // Lifecycle

  mount(container: HTMLElement) {
    if (this.isMounted) return;

    this.renderer.mount(container);

    this.isMounted = true;
  }

  unmount() {
    if (!this.isMounted) return;

    this.renderer.unmount();
    this.isMounted = false;
  }

  destroy(): void {
    this.unmount();

    // Clean up event handlers, etc.
    this.listeners.clear();
  }

  // Read

  getEditorState(): Readonly<EditorState> {
    return this.editorState;
  }
  getViewportState(): Readonly<ViewportState> {
    return this.viewportState;
  }
  getShapes(): Readonly<EditorState["shapes"]> {
    return this.editorState["shapes"];
  }
  getShape(id: Id): Readonly<Shape> | undefined {
    return this.editorState.shapes[id];
  }
  getCurrentTool(): Tool | undefined {
    return this.toolState.current;
  }

  // Mutations
  addShape(shape: Shape): void {
    if (this.editorState.shapes[shape.id])
      throw new Error("InvalidOperation", { cause: "Shape already exists." });

    this.editorState.shapes[shape.id] = shape;

    this.emit({
      type: "shape:added",
      shape: shape,
    });
  }
  updateShape(id: Id, patch: Partial<Omit<Shape, "Id">>): void {
    const currentShape = this.editorState.shapes["abc"];

    if (!currentShape)
      throw new Error("InvalidOperation", { cause: "Shape does not exist." });

    this.editorState.shapes[id] = {
      ...currentShape,
      ...patch,
    };
  }
  deleteShape(id: Id): void {
    const shapeToDelete = this.editorState.shapes[id];

    if (!shapeToDelete)
      throw new Error("InvalidOperation", { cause: "Shape does not exist." });

    delete this.editorState.shapes[id];
  }
  setCurrentTool(tool: Tool): void {
    this.toolState.current = tool;
  }
  updateViewport(viewport: Partial<Viewport>): void {
    this.viewportState = {
      ...this.viewportState,
      ...viewport,
    };
  }

  // Listeners
  private listeners = new Set<Listener>();

  on(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.off(listener);
  }

  off(listener: Listener) {
    this.listeners.delete(listener);
  }

  emit(event: EditorEvent) {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}

interface EditorOptions {
  renderer: Renderer;
}

export function createEditor(options: EditorOptions) {
  return new Editor(options);
}
