import { Id, IEditor, PointerContext, Tool } from "./types";
import { InteractionContext } from "./types/context";

export class ToolManager {
  active: Tool | undefined;
  private tools: Map<Id, Tool> = new Map();

  constructor(
    private editor: IEditor,
    private interactionContext: InteractionContext
  ) {}

  register(tool: Tool) {
    if (this.tools.has(tool.id))
      throw new Error("Tool with id already registered.");

    tool.initialise(this.editor, this.interactionContext);
    this.tools.set(tool.id, tool);
  }

  setActiveTool(id: Id) {
    const tool = this.tools.get(id);

    if (!tool) throw new Error("No tool with registered id.");

    this.active = tool;
  }

  handlePointerDown(ctx: PointerContext) {
    this.active?.onPointerDown(ctx);
  }
  handlePointerMove(ctx: PointerContext) {
    this.active?.onPointerMove(ctx);
  }
  handlePointerUp(ctx: PointerContext) {
    this.active?.onPointerUp(ctx);
  }
}
