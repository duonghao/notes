import { Id, IEditor, PointerContext, Tool } from "../types";
import { InteractionContext } from "../types/context";

export class SelectTool implements Tool {
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

    this.editor.updateSelect(id);

    return;
  }

  onPointerMove(ctx: PointerContext): void {}

  onPointerUp(ctx: PointerContext): void {}
}
