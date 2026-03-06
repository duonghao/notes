import { Id, Point } from "./base";
import { InteractionContext } from "./context";
import { IEditor } from "./editor";
import { IRenderer } from "./renderer";

export interface ToolContext {
  editor: IEditor;
  renderer: IRenderer;
}

export interface PointerContext {
  localPoint: Point;
  viewportPoint: Point;
  pointerEvent: PointerEvent;
}

export interface Tool {
  id: Id;
  initialise(editor: IEditor, interactionContext: InteractionContext): void;
  onPointerDown(ctx: PointerContext): void;
  onPointerMove(ctx: PointerContext): void;
  onPointerUp(ctx: PointerContext): void;
}
