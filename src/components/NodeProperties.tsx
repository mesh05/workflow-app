import { Node, Edge } from "@xyflow/react";
import SplitData from "./nodes/SplitDataNode";
import Input from "./nodes/InputNode";
import { useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { useRecoilState } from "recoil";
import { flowState, selectedNodeState } from "../recoil/atoms";

// type Data = { file: { name: string; size: number }; data: number[][] } | null;

export default function NodeProperties({
  updateNodeData,
}: {
  edges: Edge[];
  updateNodeData: (
    id: string,
    dataUpdate:
      | Partial<Record<string, unknown>>
      | ((node: Node) => Partial<Record<string, unknown>>),
    options?: { replace: boolean } | undefined,
  ) => void;
}) {
  // const [data, setData] = useState<Data>(null);
  const [nodeSelected, setNodeSelected] = useRecoilState(selectedNodeState);
  const [flowData, setFlowData] = useRecoilState(flowState);
  const [connections, setConnections] = useState([]);
  console.log(flowData);
  if (!nodeSelected) {
    return;
  }
  if (nodeSelected.type === "input")
    return <Input node={nodeSelected} updateNodeData={updateNodeData} />;
  if (nodeSelected.type === "split_data")
    return (
      <SplitData
        node={nodeSelected}
        connections={connections}
        setConnections={setConnections}
      />
    );
  if (nodeSelected.type === "model learner")
    return <ModelLearner node={nodeSelected} />;
  if (nodeSelected.type === "model predictor")
    return <ModelPredictor node={nodeSelected} />;
  if (nodeSelected.type === "output") return <Output node={nodeSelected} />;
}

function ModelLearner({ node }: { node: Node }) {
  return (
    <div>
      <h2>Model Learner Node</h2>
      <p>{JSON.stringify(node)}</p>
    </div>
  );
}

function ModelPredictor({ node }: { node: Node }) {
  return (
    <div>
      <h2>Model Learner Node</h2>
      <p>{JSON.stringify(node)}</p>
    </div>
  );
}

function Output({ node }: { node: Node }) {
  return (
    <div>
      <h2>Output Node</h2>
      <p>{JSON.stringify(node)}</p>
    </div>
  );
}
