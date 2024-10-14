import { Edge } from "@xyflow/react";
import { useEffect, useState } from "react";
import { Node } from "@xyflow/react";
import { useRecoilState } from "recoil";
import { flowState, tensorState } from "../../recoil/atoms";
import * as tf from "@tensorflow/tfjs";

export default function ModelLearner({
  node,
  edges,
}: {
  node: Node;
  edges: Edge[];
}) {
  const [connections, setConnections] = useState(
    edges.filter((edge: Edge) => edge.target === node.id),
  );

  const [flowData, setFlowData] = useRecoilState<any>(flowState);
  const [tensorData, setTensorData] = useRecoilState(tensorState);
  const [progress, setProgress] = useState("Click to train model");

  useEffect(() => {
    setConnections(edges.filter((edge: Edge) => edge.target === node.id));
  }, [edges]);

  const data = flowData.filter((node) => {
    return node.nodeId === connections[0].source;
  });

  const trainingData = data[0]?.data.data_80;
  if (!tensorData && trainingData)
    setTensorData({
      x: tf.tensor2d(trainingData.map((row: number[]) => [row[0]])),
      y: tf.tensor2d(trainingData.map((row: number[]) => [row[1]])),
    });
  if (tensorData === null) {
    return (
      <div>
        <h2>Model Learner Node</h2>
        <p>Waiting for data...</p>
      </div>
    );
  }
  return (
    <div>
      <h2>Model Learner Node</h2>
      <p>Using Linear Regression Model</p>
      <button
        onClick={() => {
          setProgress("Training model...");
          getModel(tensorData).then((model) => {
            const newInput = tf.tensor2d([[77]]);
            const prediction = model?.predict(normalize(newInput)) as tf.Tensor;
            prediction.print();
            setFlowData((data) => {
              return [
                ...data,
                {
                  nodeId: node.id,
                  type: "model_learner",
                  data: {
                    model: model,
                  },
                },
              ];
            });
            setProgress("Model trained");
          });
        }}
      >
        Train Model
      </button>
      <p>{progress}</p>
    </div>
  );
}

async function getModel(tensorData: { x: tf.Tensor; y: tf.Tensor }) {
  if (tensorData) {
    const model = linearRegression(tensorData);
    const data_x = normalize(tensorData.x);
    await model.fit(data_x, tensorData.y, {
      epochs: 300, // Number of training iterations
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch: ${epoch}, Loss: ${logs?.loss}`);
        },
      },
    });
    console.log("Model trained");
    return model;
  }
}

function linearRegression(tensorData: { x: tf.Tensor; y: tf.Tensor }) {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({
        units: tensorData.x.shape[1] || 1,
        inputShape: [tensorData.x.shape[1] || 1],
      }),
    ],
  });
  model.compile({
    optimizer: tf.train.sgd(0.01), // Or 'adam' for better performance
    loss: tf.losses.meanSquaredError,
  });

  return model;
}

const normalize = (tensor: tf.Tensor) => {
  const max = 99;
  const min = 0;
  return tf.div(tf.sub(tensor, min), tf.sub(max, min));
};
