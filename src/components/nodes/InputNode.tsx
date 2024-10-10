import { Node, useNodes } from "@xyflow/react";
import { useRecoilState } from "recoil";
import { flowState } from "../../recoil/atoms";
import * as d3 from "d3";

export default function Input({
  node,
  updateNodeData,
}: {
  node: Node;
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
  const [flowData, setFlowData] = useRecoilState<any>(flowState);
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
      {/* TODO: remove one loop search */}
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
