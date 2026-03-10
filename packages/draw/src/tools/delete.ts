import { Id, IEditor } from "../types";
import { InteractionContext } from "../types/context";
import { PointerContext, Tool } from "../types/tool";

export class DeleteTool implements Tool {
  id: Id;
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
    const id = this.interactionContext.hitTest(ctx.viewportPoint);

    if (!id) return;

    this.editor.deleteShape(id);
  }
  onPointerMove(ctx: PointerContext): void {
    return;
  }
  onPointerUp(ctx: PointerContext): void {
    return;
  }
}