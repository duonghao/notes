import { DOMRenderer } from "./DOMRenderer";
import { Editor } from "./editor";
import { View } from "./view";

export function createEditor({ container }: { container: HTMLElement }) {
  const renderer = new DOMRenderer();

  const editor = new Editor(renderer); // 👈 pass interaction here

  const view = new View(editor, renderer, container);

  return {
    addShape: editor.addShape.bind(editor),
    registerTool: editor.toolManager.register.bind(editor.toolManager),
    setActiveTool: editor.toolManager.setActiveTool.bind(editor.toolManager),
    mount: view.mount.bind(view),
    unmount: view.unmount.bind(view),
  };
}
