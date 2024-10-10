import { Node, Handle, Position, useHandleConnections } from "@xyflow/react";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { flowState } from "../../recoil/atoms";

export default function SplitData({
  node,
  connections,
  setConnections,
}: {
  node: Node;
  connections: any;
  setConnections: any;
}) {
  // The solution implemented here is bad, need to find a better way to handle connections
  setConnections(useHandleConnections({ type: "target", nodeId: node.id }));
  const [flowData, setFlowData] = useRecoilState<any>(flowState);
  const inputData: any = flowData.find((tnode: any) => {
    return tnode.nodeId === connections[0]?.source;
  });
  const data_80 = inputData?.data.filter(
    (_: number[], i: number) => i % 5 !== 0,
  );
  const data_20 = inputData?.data.filter(
    (_: number[], i: number) => i % 5 === 0,
  );
  const newFlowData = flowData.filter((tnode: any) => {
    return tnode.nodeId !== node.id;
  });
  useEffect(() => {
    setFlowData([
      ...newFlowData,
      {
        nodeId: node.id,
        type: "split_data",
        data: {
          data_80,
          data_20,
        },
      },
    ]);
  }, []);

  if (connections.length === 0) {
    return (
      <div>
        <h2>Split Data Node</h2>
        Connect the node to an input node
      </div>
    );
  }
  if (!inputData?.data) {
    return (
      <div>
        <h2>Split Data Node</h2>
        Provide Data to input node
      </div>
    );
  }

  return (
    <div>
      <h2>Split Data Node</h2>
      <p>
        The provided dataset will be split into training and testing datasets
      </p>
      <p>{JSON.stringify(inputData.file)}</p>
      <p>{JSON.stringify(data_80)}</p>
    </div>
  );
}

export function SplitDataType({
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
      <Handle type="target" position={Position.Top} />
      <label>{data.label}</label>

      <Handle
        style={{ left: "30px", width: "10px", height: "10px" }}
        id={`${id}_80`}
        type="source"
        position={Position.Bottom}
      />
      <Handle
        style={{ left: "110px" }}
        id={`${id}_20`}
        type="source"
        position={Position.Bottom}
      />
    </div>
  );
}
