/** Native dialog backdrop clicks target the dialog itself.
 * Also check pointer coordinates so a click on the dialog padding is safe. */
export function clickedOutsideDialog(
  targetIsDialog: boolean,
  x: number,
  y: number,
  rect: Pick<DOMRect, "left" | "right" | "top" | "bottom">
): boolean {
  return targetIsDialog && (
    x < rect.left || x > rect.right || y < rect.top || y > rect.bottom
  );
}
