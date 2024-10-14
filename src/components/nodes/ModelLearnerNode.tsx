import { Edge } from "@xyflow/react";
import { useEffect, useState } from "react";
import { Node } from "@xyflow/react";

export default function ModelLearner({
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
      <h2>Model Learner Node</h2>
      <p>{JSON.stringify(connections)}</p>
    </div>
  );
}
