import { Id, IEditor, PointerContext, Tool } from "../types";
import { InteractionContext } from "../types/context";

export class AddTool implements Tool {
  id: string;
  private editor!: IEditor;
  private interactionContext!: InteractionContext;

  constructor(id: Id) {
    this.id = id;
  }

  initialise(editor: IEditor, interactionContext: InteractionContext): void {
    this.editor = editor;
    this.interactionContext = interactionContext;
  }

  onPointerDown(ctx: PointerContext): void {
    this.editor.addShape({
      id: crypto.randomUUID(),
      type: "rectangle",
      width: 100,
      height: 100,
      x: ctx.localPoint.x,
      y: ctx.localPoint.y,
      isSelectable: true,
    });

    return;
  }
  onPointerMove(ctx: PointerContext): void {
    return;
  }
  onPointerUp(ctx: PointerContext): void {
    return;
  }
}
