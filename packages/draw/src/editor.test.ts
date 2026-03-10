import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Editor } from './editor'
import type { EditorEvent, Shape } from './types'
import type { InteractionContext } from './types/context'

const mockContext: InteractionContext = {
  hitTest: vi.fn(() => null),
}

const makeRect = (id: string, overrides?: Partial<Shape>): Shape => ({
  id,
  type: 'rectangle',
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  isSelectable: true,
  ...overrides,
})

describe('Editor', () => {
  let editor: Editor

  beforeEach(() => {
    editor = new Editor(mockContext)
  })

  describe('addShape', () => {
    it('stores the shape in editorState', () => {
      const shape = makeRect('a')
      editor.addShape(shape)
      expect(editor.getShape('a')).toEqual(shape)
    })

    it('is reflected in getShapes()', () => {
      const a = makeRect('a')
      const b = makeRect('b', { x: 50 })
      editor.addShape(a)
      editor.addShape(b)
      expect(editor.getShapes()).toEqual({ a, b })
    })

    it('emits a shape:added event with the shape', () => {
      const shape = makeRect('a')
      const listener = vi.fn()
      editor.on(listener)

      editor.addShape(shape)

      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith<[EditorEvent]>({
        type: 'shape:added',
        shape,
      })
    })

    it('throws when a shape with the same id already exists', () => {
      editor.addShape(makeRect('a'))
      expect(() => editor.addShape(makeRect('a'))).toThrow()
    })

    it('does not emit an event when it throws', () => {
      const listener = vi.fn()
      editor.on(listener)
      editor.addShape(makeRect('a'))
      listener.mockClear()

      expect(() => editor.addShape(makeRect('a'))).toThrow()
      expect(listener).not.toHaveBeenCalled()
    })
  })

  describe('updateShape', () => {
    it('updates the shape in editorState', () => {
      editor.addShape(makeRect('a'))
      editor.updateShape('a', { x: 99, y: 42 })
      expect(editor.getShape('a')).toMatchObject({ x: 99, y: 42 })
    })

    it('preserves fields not included in the patch', () => {
      editor.addShape(makeRect('a', { width: 200 }))
      editor.updateShape('a', { x: 10 })
      expect(editor.getShape('a')).toMatchObject({ width: 200, x: 10 })
    })

    it('emits a shape:updated event with the id and merged shape', () => {
      const shape = makeRect('a')
      editor.addShape(shape)
      const listener = vi.fn()
      editor.on(listener)

      editor.updateShape('a', { x: 50 })

      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith<[EditorEvent]>({
        type: 'shape:updated',
        id: 'a',
        shape: { ...shape, x: 50 },
      })
    })

    it('throws when the shape does not exist', () => {
      expect(() => editor.updateShape('nonexistent', { x: 1 })).toThrow()
    })
  })

  describe('deleteShape', () => {
    it('removes the shape from editorState', () => {
      editor.addShape(makeRect('a'))
      editor.deleteShape('a')
      expect(editor.getShape('a')).toBeUndefined()
    })

    it('does not affect other shapes', () => {
      const b = makeRect('b')
      editor.addShape(makeRect('a'))
      editor.addShape(b)
      editor.deleteShape('a')
      expect(editor.getShape('b')).toEqual(b)
    })

    it('emits a shape:removed event with the id', () => {
      editor.addShape(makeRect('a'))
      const listener = vi.fn()
      editor.on(listener)

      editor.deleteShape('a')

      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith<[EditorEvent]>({
        type: 'shape:removed',
        id: 'a',
      })
    })

    it('throws when the shape does not exist', () => {
      expect(() => editor.deleteShape('nonexistent')).toThrow()
    })
  })

  describe('updateSelect', () => {
    it('sets the selected id in selectionState', () => {
      editor.addShape(makeRect('a'))
      editor.updateSelect('a')
      expect(editor.selectionState.selected).toEqual(new Set(['a']))
    })

    it('replaces a previous selection', () => {
      editor.addShape(makeRect('a'))
      editor.addShape(makeRect('b'))
      editor.updateSelect('a')
      editor.updateSelect('b')
      expect(editor.selectionState.selected).toEqual(new Set(['b']))
    })

    it('emits a selection:changed event with added and removed arrays', () => {
      editor.addShape(makeRect('a'))
      editor.addShape(makeRect('b'))
      editor.updateSelect('a')

      const listener = vi.fn()
      editor.on(listener)
      editor.updateSelect('b')

      expect(listener).toHaveBeenCalledOnce()
      expect(listener).toHaveBeenCalledWith<[EditorEvent]>({
        type: 'selection:changed',
        added: ['b'],
        removed: ['a'],
      })
    })

    it('emits empty removed array when nothing was previously selected', () => {
      const listener = vi.fn()
      editor.on(listener)
      editor.updateSelect('a')

      expect(listener).toHaveBeenCalledWith<[EditorEvent]>({
        type: 'selection:changed',
        added: ['a'],
        removed: [],
      })
    })
  })

  describe('on / off', () => {
    it('calls registered listeners when an event is emitted', () => {
      const listener = vi.fn()
      editor.on(listener)
      editor.addShape(makeRect('a'))
      expect(listener).toHaveBeenCalledOnce()
    })

    it('stops calling a listener after off()', () => {
      const listener = vi.fn()
      editor.on(listener)
      editor.off(listener)
      editor.addShape(makeRect('a'))
      expect(listener).not.toHaveBeenCalled()
    })

    it('returns an unsubscribe function from on()', () => {
      const listener = vi.fn()
      const unsubscribe = editor.on(listener)
      unsubscribe()
      editor.addShape(makeRect('a'))
      expect(listener).not.toHaveBeenCalled()
    })

    it('does not call a listener registered after the event', () => {
      editor.addShape(makeRect('a'))
      const listener = vi.fn()
      editor.on(listener)
      expect(listener).not.toHaveBeenCalled()
    })
  })
})
