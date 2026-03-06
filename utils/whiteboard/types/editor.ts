import { ToolManager } from "../tool-manager";
import { Id, Listener } from "./base";
import { Shape } from "./shape";
import { Tool } from "./tool";
import { Viewport } from "./viewport";

export type EditorEvent =
  | { type: "shape:added"; shape: Shape }
  | { type: "shape:updated"; id: Id; shape: Partial<Omit<Shape, "id">> }
  | { type: "shape:removed"; id: Id }
  | { type: "viewport:changed"; viewport: Partial<Viewport> }
  | { type: "selection:changed"; ids: Id[] };

export interface EditorState {
  shapes: Record<Id, Shape>;
}

export type ViewportState = Viewport;

export type ToolState = {
  current: Tool | undefined;
};

export type SelectionState = {
  selected: Set<Id>;
};

export interface IEditor {
  toolManager: ToolManager;

  // Read
  getEditorState(): Readonly<EditorState>;
  getViewportState(): Readonly<ViewportState>;
  getShapes(): Readonly<EditorState["shapes"]>;
  getShape(id: Id): Readonly<Shape> | undefined;

  // Mutations
  addShape(shape: Shape): void;
  updateShape(id: Id, shape: Partial<Omit<Shape, "Id">>): void;
  deleteShape(id: Id): void;
  updateViewport(viewport: Partial<Viewport>): void;
  updateSelect(id: Id): void;

  // Listeners
  on(listener: Listener): () => void;
  off(listener: Listener): void;
  emit(event: EditorEvent): void;
}
