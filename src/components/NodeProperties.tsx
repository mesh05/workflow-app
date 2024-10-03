import { Node, useHandleConnections, useNodesData } from "@xyflow/react";
import { useState } from "react";
import * as d3 from "d3";
import * as tf from "@tensorflow/tfjs";

//(BUG) The data is not being updated in the node data properly

type Data = { file: { name: string; size: number }; data: number[][] } | null;

export default function NodeProperties({
  nodes,
  nodeSelected,
  updateNodeData,
}: {
  nodes: Node[];
  nodeSelected: Node | null;
  updateNodeData: (
    id: string,
    dataUpdate:
      | Partial<Record<string, unknown>>
      | ((node: Node) => Partial<Record<string, unknown>>),
    options?: { replace: boolean } | undefined,
  ) => void;
}) {
  const [data, setData] = useState<Data>(null);
  const [connections, setConnections] = useState([]);
  if (!nodeSelected) {
    return;
  }
  if (nodeSelected.type === "input")
    return (
      <Input
        nodes={nodes}
        node={nodeSelected}
        data={data}
        setData={setData}
        updateNodeData={updateNodeData}
      />
    );
  if (nodeSelected.type === "split data")
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

function Input({
  node,
  nodes,
  data,
  setData,
  updateNodeData,
}: {
  node: Node;
  nodes: Node[];
  data: Data;
  setData: (data: Data) => void;
  updateNodeData: (
    id: string,
    dataUpdate:
      | Partial<Record<string, unknown>>
      | ((node: Node) => Partial<Record<string, unknown>>),
    options?: { replace: boolean } | undefined,
  ) => void;
}) {
  return (
    <div>
      <h2> File Input Node</h2>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (e) => {
            const res = e.target.result;
            if (res && typeof res === "string") {
              // Read the CSV data from the uploaded file
              const csvData = d3.csvParse(res);

              //keys of the csv data's first row
              const keys = Object.keys(csvData[0]);

              // converting to 2D array for the tensor
              const result = csvData.map((item) => {
                return keys.map((key) => Number(item[key]));
              });

              setData({
                file: { name: file.name, size: file.size },
                data: result,
              });
              updateNodeData(node.id, {
                file: { name: file.name, size: file.size },
                data: result,
              });
            }
          };
          reader.readAsText(file);
        }}
      />
      {data ? <p>{JSON.stringify(data.file)}</p> : <div>Upload file</div>}
      <p>{JSON.stringify(nodes)}</p>
    </div>
  );
}

function SplitData({
  node,
  connections,
  setConnections,
}: {
  node: Node;
  connections: any;
  setConnections: any;
}) {
  setConnections(useHandleConnections({ type: "target", nodeId: node.id }));
  const inputData = useNodesData(connections[0]?.source);
  if (connections.length === 0) {
    return (
      <div>
        <h2>Split Data Node</h2>
        Connect the node to an input node
      </div>
    );
  }
  if (!inputData?.data.data) {
    return (
      <div>
        <h2>Split Data Node</h2>
        Provide Data to input node
      </div>
    );
  }
  tf.tensor2d(inputData.data.data as number[][]);
  return (
    <div>
      <h2>Split Data Node</h2>
      <p>{JSON.stringify(inputData.data.data as number[][])}</p>
    </div>
  );
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
