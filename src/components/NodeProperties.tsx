import { Node, Edge } from "@xyflow/react";
import SplitData from "./nodes/SplitDataNode";
import Input from "./nodes/InputNode";
import ModelLearner from "./nodes/ModelLearnerNode";
import ModelPredictor from "./nodes/ModelPredictorNode";
import { useRecoilValue } from "recoil";
import { flowState, selectedNodeState } from "../recoil/atoms";
import Output from "./nodes/OutputNode";

// type Data = { file: { name: string; size: number }; data: number[][] } | null;

export default function NodeProperties({
  edges,
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
  const nodeSelected = useRecoilValue(selectedNodeState);
  const flowData = useRecoilValue(flowState);
  console.log(flowData);
  if (!nodeSelected) {
    return;
  }
  if (nodeSelected.type === "input")
    return <Input node={nodeSelected} updateNodeData={updateNodeData} />;
  if (nodeSelected.type === "split_data")
    return <SplitData node={nodeSelected} edges={edges} />;
  if (nodeSelected.type === "model_learner")
    return <ModelLearner node={nodeSelected} edges={edges} />;
  if (nodeSelected.type === "model_predictor")
    return <ModelPredictor node={nodeSelected} edges={edges} />;
  if (nodeSelected.type === "output") return <Output node={nodeSelected} />;
}
