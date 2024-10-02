import { Node } from "@xyflow/react";
import { useState } from "react";
import * as d3 from "d3";

export default function NodeProperties({
  nodes,
  nodeSelected,
}: {
  nodes: Node[];
  nodeSelected: Node | null;
}) {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [data, setData] = useState<string[][] | null>(null);
  if (!nodeSelected) {
    return;
  }
  if (nodeSelected.type === "input")
    return (
      <Input
        node={nodeSelected}
        fileContent={fileContent}
        setFileContent={setFileContent}
        data={data}
        setData={setData}
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
  fileContent,
  setFileContent,
  data,
  setData,
}: {
  node: Node;
  fileContent: string | null;
  setFileContent: (data: string) => void;
  data: string[][] | null;
  setData: (data: string[][] | null) => void;
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
            const data = e.target.result;
            setFileContent(data as string);
          };
          reader.readAsText(file);
          if (fileContent) {
            // Read the CSV data from the uploaded file
            const csvData = d3.csvParse(fileContent);

            //keys of the csv data's first row
            const keys = Object.keys(csvData[0]);

            // converting to 2D array for the tensor
            const result = csvData.map((item) => {
              return keys.map((key) => item[key]);
            });

            setData(result);
          }
        }}
      />
      <p>{JSON.stringify(node)}</p>
      <p>{JSON.stringify(data)}</p>
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
