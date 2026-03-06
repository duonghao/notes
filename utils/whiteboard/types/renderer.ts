import { Id } from "./base";
import { EditorEvent } from "./editor";

export interface IRenderer {
  mount(container: HTMLElement): void;
  handle(event: EditorEvent): void;
  unmount(): void;
  hitTest(point: PointerEvent): Id | null;
}
