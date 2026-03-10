import { ToolManager } from '../tool-manager'
import { Id, Listener } from './base'
import { Shape } from './shape'
import { Tool } from './tool'

export type EditorEvent =
  | { type: 'shape:added'; shape: Shape }
  | { type: 'shape:updated'; id: Id; shape: Partial<Omit<Shape, 'id'>> }
  | { type: 'shape:deleted'; id: Id }
  | { type: 'selection:changed'; added: Id[]; removed: Id[] }

export interface EditorState {
  shapes: Record<Id, Shape>
}

export type ToolState = {
  current: Tool | undefined
}

export type SelectionState = {
  selected: Set<Id>
}

export interface IEditor {
  toolManager: ToolManager

  // Read
  getEditorState(): Readonly<EditorState>
  getShapes(): Readonly<EditorState['shapes']>
  getShape(id: Id): Readonly<Shape> | undefined

  // Mutations
  addShape(shape: Shape): void
  updateShape(id: Id, shape: Partial<Omit<Shape, 'Id'>>): void
  deleteShape(id: Id): void
  updateSelect(id: Id): void

  // Listeners
  on(listener: Listener): () => void
  off(listener: Listener): void
  emit(event: EditorEvent): void
}
