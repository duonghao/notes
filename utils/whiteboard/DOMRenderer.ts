import { EditorEvent, Id, Renderer, Shape, Viewport } from "./types";

export class DOMRenderer implements Renderer {
  private container!: HTMLElement;
  private elements = new Map<Id, HTMLElement>();

  mount(container: HTMLElement): void {
    this.container = container;
    this.container.style.position = "relative";
  }

  handle(event: EditorEvent): void {
    switch (event.type) {
      case "shape:added":
        this.createElement(event.shape);
        break;

      case "shape:updated":
        this.updateElement(event.id, event.shape);
        break;

      case "shape:removed":
        this.removeElement(event.id);
        break;

      case "viewport:changed":
        this.updateViewport(event.viewport);
        break;
    }
  }

  unmount(): void {
    this.container.innerHTML = "";
    this.elements.clear();
  }

  private createElement(shape: Shape) {
    if (shape.type === "rectangle") {
      const el = document.createElement("div");

      el.style.position = "absolute";
      el.style.left = `${shape.x}px`;
      el.style.top = `${shape.y}px`;
      el.style.width = `${shape.width}px`;
      el.style.height = `${shape.height}px`;
      el.style.background = "black";

      this.container.appendChild(el);
      this.elements.set(shape.id, el);
    }
  }

  private updateElement(id: Id, patch: Partial<Shape>) {
    const el = this.elements.get(id);
    if (!el) return;

    if ("x" in patch) el.style.left = `${patch.x}px`;
    if ("y" in patch) el.style.top = `${patch.y}px`;
    if ("width" in patch) el.style.width = `${patch.width}px`;
    if ("height" in patch) el.style.height = `${patch.height}px`;
  }

  private removeElement(id: Id) {
    const el = this.elements.get(id);
    if (!el) return;

    el.remove();
    this.elements.delete(id);
  }

  private updateViewport(viewport: Partial<Viewport>) {}
}
