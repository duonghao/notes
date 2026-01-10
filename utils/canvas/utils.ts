export const normalizePointerEvent = (e: PointerEvent) => {
  if (!(e.target instanceof HTMLElement)) return;

  const element = e.target;
  const rect = element.getBoundingClientRect();

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
