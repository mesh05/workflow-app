import { atom } from "recoil";
import { Node } from "@xyflow/react";

export const flowState = atom({ key: "flowState", default: [] });

export const selectedNodeState = atom({
  key: "selectedNodeState",
  default: null as Node | null,
});
