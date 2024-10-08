import { Node, Edge, useHandleConnections, useNodes } from "@xyflow/react";
import { useEffect, useState } from "react";
import * as d3 from "d3";
import * as tf from "@tensorflow/tfjs";
import { useRecoilState, useRecoilValue } from "recoil";
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
    return (
      <Input
        node={nodeSelected}
        flowData={flowData}
        setFlowData={setFlowData}
        updateNodeData={updateNodeData}
      />
    );
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

function Input({
  node,
  flowData,
  setFlowData,
  updateNodeData,
}: {
  node: Node;
  flowData: any;
  setFlowData: any;
  updateNodeData: (
    id: string,
    dataUpdate:
      | Partial<Record<string, unknown>>
      | ((node: Node) => Partial<Record<string, unknown>>),
    options?: { replace: boolean } | undefined,
  ) => void;
}) {
  const nodes: Node[] = useNodes();
  console.log(nodes);
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
              setFlowData([
                ...flowData,
                {
                  nodeId: node.id,
                  type: "input",
                  file: { name: file.name, size: file.size },
                  data: result,
                },
              ]);
            }
          };
          reader.readAsText(file);
        }}
      />
      {/* TODO: remove the double search */}
      {flowData.find((tnode) => {
        return tnode.nodeId === node.id;
      }) !== undefined ? (
        <p>
          {JSON.stringify(
            flowData.find((tnode) => {
              return tnode.nodeId === node.id;
            }).file,
          )}
        </p>
      ) : (
        <div>Upload file</div>
      )}
      {/* <p>{JSON.stringify(nodes)}</p> */}
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
  // The solution implemented here is bad, need to find a better way to handle connections
  setConnections(useHandleConnections({ type: "target", nodeId: node.id }));
  const [flowData, setFlowData] = useRecoilState(flowState);
  const inputData: any = flowData.find((tnode: any) => {
    return tnode.nodeId === connections[0]?.source;
  });
  const data_80 = inputData?.data.filter((_: number, i: number) => i % 5 !== 0);
  const data_20 = inputData?.data.filter((_: number, i: number) => i % 5 === 0);
  console.log(data_20);
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
