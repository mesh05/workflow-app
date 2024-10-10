import { atom } from "recoil";
import { Node } from "@xyflow/react";

export const workflowState = atom({
  key: "workflowState",
  default: null as any,
});

export const flowState = atom({ key: "flowState", default: [] });

export const selectedNodeState = atom({
  key: "selectedNodeState",
  default: null as Node | null,
});
