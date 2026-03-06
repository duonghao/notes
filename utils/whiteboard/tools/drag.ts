import { Id, IEditor, Point, PointerContext, Tool } from "../types/";
import { InteractionContext } from "../types/context";

interface DragState {
  shapeId: string;
  startPointer: Point;
  startShapePosition: Point;
}

export class DragTool implements Tool {
  id: Id;
  private dragState: DragState | null = null;

  private interactionContext!: InteractionContext;
  private editor!: IEditor;

  constructor(id: Id) {
    this.id = id;
  }

  initialise(editor: IEditor, interactionContext: InteractionContext) {
    this.editor = editor;
    this.interactionContext = interactionContext;
  }

  onPointerDown(ctx: PointerContext) {
    const id = this.interactionContext.hitTest(ctx.viewportPoint);

    if (!id) return;

    const shape = this.editor.getShape(id)!;

    this.dragState = {
      shapeId: id,
      startPointer: ctx.localPoint,
      startShapePosition: {
        x: shape.x,
        y: shape.y,
      },
    };
  }

  onPointerMove(ctx: PointerContext) {
    if (!this.dragState) return;

    const dx = ctx.localPoint.x - this.dragState.startPointer.x;
    const dy = ctx.localPoint.y - this.dragState.startPointer.y;

    this.editor.updateShape(this.dragState.shapeId, {
      x: this.dragState.startShapePosition.x + dx,
      y: this.dragState.startShapePosition.y + dy,
    });
  }

  onPointerUp(ctx: PointerContext) {
    if (!this.dragState) return;

    // const current = getPoint(e);
    // const dx = current.x - this.dragState.startPointer.x;
    // const dy = current.y - this.dragState.startPointer.y;

    // ctx.editor.moveShape(this.dragState.id, { dx, dy });

    this.dragState = null;
  }
}
