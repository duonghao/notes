import { Point } from "./base";

export interface InteractionContext {
  hitTest(viewportPoint: Point): string | null;
}
