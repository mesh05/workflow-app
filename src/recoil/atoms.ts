import { atom } from "recoil";
import { Node } from "@xyflow/react";

export const workflowState = atom({
  key: "workflowState",
  default: [] as any[],
});

export const currentFlowState = atom({
  key: "currentFlowState",
  default: [] as any,
});

export const flowState = atom({ key: "flowState", default: [] });

export const selectedNodeState = atom({
  key: "selectedNodeState",
  default: null as Node | null,
});

export const tensorState = atom({
  key: "tensorState",
  default: null as any,
});
