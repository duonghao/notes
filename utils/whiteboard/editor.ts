import { ToolManager } from "./tool-manager";
import type {
  EditorEvent,
  EditorState,
  Id,
  IEditor,
  Listener,
  SelectionState,
  Shape,
  Viewport,
  ViewportState,
} from "./types/";
import { InteractionContext } from "./types/context";

export class Editor implements IEditor {
  isMounted: boolean = false;

  // State
  editorState: EditorState = {
    shapes: {},
  };
  selectionState: SelectionState = {
    selected: new Set<Id>(),
  };

  viewportState: ViewportState = {
    zoom: 0,
    offsetX: 0,
    offsetY: 0,
  };
  toolManager: ToolManager;

  constructor(interactionContext: InteractionContext) {
    this.toolManager = new ToolManager(this, interactionContext);
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
    const currentShape = this.editorState.shapes[id];

    if (!currentShape)
      throw new Error("InvalidOperation", { cause: "Shape does not exist." });

    const newShape = {
      ...currentShape,
      ...patch,
    };

    this.editorState.shapes[id] = newShape;

    this.emit({
      type: "shape:updated",
      id: id,
      shape: newShape,
    });
  }
  deleteShape(id: Id): void {
    const shapeToDelete = this.editorState.shapes[id];

    if (!shapeToDelete)
      throw new Error("InvalidOperation", { cause: "Shape does not exist." });

    delete this.editorState.shapes[id];
  }
  updateViewport(viewport: Partial<Viewport>): void {
    this.viewportState = {
      ...this.viewportState,
      ...viewport,
    };
  }
  updateSelect(id: Id) {
    this.selectionState.selected.clear();
    this.selectionState.selected.add(id);

    this.emit({
      type: "selection:changed",
      ids: Array.from(this.selectionState.selected),
    });
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
