import { EditorEvent } from "./editor";

export type Id = string;

export type Point = {
  x: number;
  y: number;
};

export type Listener = (event: EditorEvent) => void;
