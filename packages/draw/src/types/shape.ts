import { type Id } from "./base";

export interface BaseShape {
  id: Id;
  type: string;
  x: number;
  y: number;
  isSelectable: boolean;
}

export interface RectangleShape extends BaseShape {
  type: "rectangle";
  width: number;
  height: number;
}

export type Shape = RectangleShape; // extend later
