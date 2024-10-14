import { Edge, Handle, Position } from "@xyflow/react";
import { ChangeEvent, useEffect, useState } from "react";
import { Node } from "@xyflow/react";
import { useRecoilValue } from "recoil";
import { flowState } from "../../recoil/atoms";
import * as tf from "@tensorflow/tfjs";

export default function ModelPredictor({
  node,
  edges,
}: {
  node: Node;
  edges: Edge[];
}) {
  const [connections, setConnections] = useState(
    edges.filter((edge: Edge) => edge.target === node.id),
  );
  const flowData = useRecoilValue<any>(flowState);
  const [input, setInput] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);

  useEffect(() => {
    setConnections(edges.filter((edge: Edge) => edge.target === node.id));
  }, [edges]);
  const learnerNode = flowData.filter(
    (n) => n.nodeId === connections[0]?.source,
  );
  const model = learnerNode[0]?.data.model;
  if (!model)
    return (
      <div>
        <h2>Model Predictor Node</h2>
        <p>Connect to a model learner node and train the model</p>
      </div>
    );
  return (
    <div>
      <h2>Model Predictor Node</h2>
      <input
        type="number"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInput(Number(e.target.value))
        }
      />
      <button
        onClick={() => {
          if (input != null) {
            const pred = model.predict(normalize(tf.tensor([[input]])));
            setPrediction(pred.dataSync()[0]);
          }
        }}
      >
        Predict
      </button>
      <p>Prediction: {JSON.stringify(prediction)}</p>
      {/* <p>{JSON.stringify(node)}</p> */}
    </div>
  );
}

export function ModelPredictorType({
  id,
  data,
  type,
}: {
  id: string;
  data: { label: string; data: { model: tf.Sequential } };
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

const normalize = (tensor: tf.Tensor) => {
  const max = 99;
  const min = 0;
  return tf.div(tf.sub(tensor, min), tf.sub(max, min));
};
