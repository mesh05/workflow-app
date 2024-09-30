import { Node } from "@xyflow/react";

const transformSelector = (state) => state.transform;

export default function NodeProperties({ nodes }: { nodes: Node[] }) {
  return (
    <div>
      <h2>Node Properties</h2>
      {nodes.map((node) => {
        return (
          <div key={node.id}>
            <h3>{node.id}</h3>
            <p>{node.type}</p>
          </div>
        );
      })}
    </div>
  );
}
