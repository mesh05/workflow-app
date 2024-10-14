import { Edge, Handle, Position } from "@xyflow/react";
import { useEffect, useState } from "react";
import { Node } from "@xyflow/react";

export default function ModelPredictor({
  node,
  edges,
}: {
  node: Node;
  edges: Edge[];
}) {
  const [connections, setConnections] = useState(
    edges.filter((edge: any) => edge.target === node.id),
  );

  useEffect(() => {
    setConnections(edges.filter((edge: any) => edge.target === node.id));
  }, [edges]);
  return (
    <div>
      <h2>Model Predictor Node</h2>
      <p>{JSON.stringify(connections)}</p>
    </div>
  );
}

export function ModelPredictorType({
  id,
  data,
  type,
}: {
  id: string;
  data: any;
  type: string;
}) {
  return (
    <div style={{ padding: "10px", border: "1px solid" }}>
      <Handle
        style={{ left: "25%", width: "10px", height: "10px" }}
        id={`${id}_model`}
        type="target"
        position={Position.Top}
      />
      <Handle
        style={{ left: "75%" }}
        id={`${id}_20`}
        type="target"
        position={Position.Top}
      />
      <label>{data.label}</label>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
