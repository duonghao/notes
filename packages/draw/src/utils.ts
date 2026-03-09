import { Point } from "./types";

export function getViewportPoint(e: PointerEvent): Point {
  return {
    x: e.clientX,
    y: e.clientY,
  };
}

export const getLocalPoint = (e: PointerEvent, container: HTMLElement) => {
  if (!(e.target instanceof HTMLElement))
    throw new Error("Cannot normalise point");

  const element = e.target;
  const rect = container.getBoundingClientRect();

  const styles = window.getComputedStyle(element);
  const borderLeft = parseFloat(styles.borderLeftWidth);
  const borderTop = parseFloat(styles.borderTopWidth);

  const paddingLeft = parseFloat(styles.paddingLeft);
  const paddingTop = parseFloat(styles.paddingTop);

  return {
    x: e.clientX - rect.left - borderLeft - paddingLeft,
    y: e.clientY - rect.top - borderTop - paddingTop,
  };
};
