import { EditorEvent, Id, IRenderer, Point, Shape, Viewport } from "./types/";
import { InteractionContext } from "./types/context";

export class DOMRenderer implements IRenderer, InteractionContext {
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

      case "selection:changed":
        this.updateSelectionOverlay(event.ids);
    }
  }

  unmount(): void {
    this.container.innerHTML = "";
    this.elements.clear();
  }

  hitTest(viewportPoint: Point): string | null {
    const doc = this.container.ownerDocument;

    const el = doc.elementFromPoint(viewportPoint.x, viewportPoint.y);
    if (!el || !this.container.contains(el)) return null;

    return el.closest("[data-shape-id]")?.getAttribute("data-shape-id") ?? null;
  }

  private createElement(shape: Shape) {
    if (shape.type === "rectangle") {
      const containerEl = document.createElement("div");
      containerEl.style.position = "absolute";
      containerEl.style.left = `calc(${shape.x}px - 1rem)`;
      containerEl.style.top = `calc(${shape.y}px - 1rem)`;
      containerEl.style.padding = "1rem";

      const shapeEl = document.createElement("div");
      // Attributes
      shapeEl.dataset.shapeId = shape.id;
      // Size
      shapeEl.style.width = `${shape.width}px`;
      shapeEl.style.height = `${shape.height}px`;
      // Color
      shapeEl.style.background = "black";
      containerEl.appendChild(shapeEl);

      this.container.appendChild(containerEl);
      this.elements.set(shape.id, containerEl);
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

  private updateSelectionOverlay(ids: Id[]) {
    for (const id of ids) {
      const selected = this.elements.get(id);

      if (!selected) return;

      selected.style.border = "1px dashed black";
    }
  }
}
