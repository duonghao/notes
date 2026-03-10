import { DOMRenderer } from './DOMRenderer'
import { ToolManager } from './tool-manager'
import type {
  EditorEvent,
  EditorState,
  Id,
  IEditor,
  Listener,
  SelectionState,
  Shape,
} from './types'
import { InteractionContext } from './types/context'
import { View } from './view'

export class Editor implements IEditor {
  isMounted: boolean = false

  // State
  editorState: EditorState = {
    shapes: {},
  }
  selectionState: SelectionState = {
    selected: new Set<Id>(),
  }
  toolManager: ToolManager

  constructor(interactionContext: InteractionContext) {
    this.toolManager = new ToolManager(this, interactionContext)
  }

  // Read
  getEditorState(): Readonly<EditorState> {
    return this.editorState
  }
  getShapes(): Readonly<EditorState['shapes']> {
    return this.editorState['shapes']
  }
  getShape(id: Id): Readonly<Shape> | undefined {
    return this.editorState.shapes[id]
  }

  // Mutations
  addShape(shape: Shape): void {
    if (this.editorState.shapes[shape.id])
      throw new Error('InvalidOperation', { cause: 'Shape already exists.' })

    this.editorState.shapes[shape.id] = shape

    this.emit({
      type: 'shape:added',
      shape: shape,
    })
  }
  updateShape(id: Id, patch: Partial<Omit<Shape, 'id'>>): void {
    const currentShape = this.editorState.shapes[id]

    if (!currentShape)
      throw new Error('InvalidOperation', { cause: 'Shape does not exist.' })

    const newShape = {
      ...currentShape,
      ...patch,
    }

    this.editorState.shapes[id] = newShape

    this.emit({
      type: 'shape:updated',
      id: id,
      shape: newShape,
    })
  }
  deleteShape(id: Id): void {
    const shapeToDelete = this.editorState.shapes[id]

    if (!shapeToDelete)
      throw new Error('InvalidOperation', { cause: 'Shape does not exist.' })

    delete this.editorState.shapes[id]

    this.emit({
      type: 'shape:deleted',
      id: id,
    })
  }
  updateSelect(id: Id) {
    const prev = new Set(this.selectionState.selected)

    this.selectionState.selected.clear()
    this.selectionState.selected.add(id)

    const next = new Set([id])

    const added = [...next].filter((id) => !prev.has(id))
    const removed = [...prev].filter((id) => !next.has(id))

    this.emit({
      type: 'selection:changed',
      added,
      removed,
    })
  }

  // Listeners
  private listeners = new Set<Listener>()

  on(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.off(listener)
  }

  off(listener: Listener) {
    this.listeners.delete(listener)
  }

  emit(event: EditorEvent) {
    for (const listener of this.listeners) {
      listener(event)
    }
  }
}

export function createEditor({ container }: { container: HTMLElement }) {
  const renderer = new DOMRenderer()

  const editor = new Editor(renderer) // 👈 pass interaction here

  const view = new View(editor, renderer, container)

  return {
    addShape: editor.addShape.bind(editor),
    registerTool: editor.toolManager.register.bind(editor.toolManager),
    setActiveTool: editor.toolManager.setActiveTool.bind(editor.toolManager),
    mount: view.mount.bind(view),
    unmount: view.unmount.bind(view),
  }
}
