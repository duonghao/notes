import { IEditor, IRenderer, Point } from "./types";
import { IView } from "./types/view";

export class View implements IView {
  editor: IEditor;
  private isMounted: boolean = false;

  constructor(
    editor: IEditor,
    private renderer: IRenderer,
    private container: HTMLElement
  ) {
    this.editor = editor;
  }

  mount() {
    if (this.isMounted) return;

    this.renderer.mount(this.container);

    this.container.addEventListener(
      "pointerdown",
      this.handlePointerDownEvent.bind(this)
    );
    this.container.addEventListener(
      "pointermove",
      this.handlePointerMoveEvent.bind(this)
    );
    this.container.addEventListener(
      "pointerup",
      this.handlePointerUpEvent.bind(this)
    );

    this.editor.on(this.renderer.handle.bind(this.renderer));

    this.isMounted = true;
  }

  unmount() {
    if (!this.isMounted) return;

    this.container.removeEventListener(
      "pointerdown",
      this.handlePointerDownEvent
    );
    this.container.removeEventListener(
      "pointermove",
      this.handlePointerMoveEvent
    );
    this.container.removeEventListener("pointerup", this.handlePointerUpEvent);

    this.editor.off(this.renderer.handle);

    this.renderer.unmount();

    this.isMounted = false;
  }

  private handlePointerDownEvent = (e: PointerEvent) => {
    const localPoint = this.getLocalPoint(e);

    this.editor.toolManager.handlePointerDown({
      localPoint,
      viewportPoint: { x: e.clientX, y: e.clientY },
      pointerEvent: e,
    });
  };

  private handlePointerMoveEvent(e: PointerEvent) {
    const localPoint = this.getLocalPoint(e);

    this.editor.toolManager.handlePointerMove({
      localPoint,
      viewportPoint: { x: e.clientX, y: e.clientY },
      pointerEvent: e,
    });
  }

  private handlePointerUpEvent(e: PointerEvent) {
    const localPoint = this.getLocalPoint(e);

    this.editor.toolManager.handlePointerUp({
      localPoint,
      viewportPoint: { x: e.clientX, y: e.clientY },
      pointerEvent: e,
    });
  }

  private getLocalPoint(e: PointerEvent): Point {
    const rect = this.container.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }
}
