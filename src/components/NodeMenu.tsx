import { useDnD } from "./DnDContext";

export default function NodeMenu() {
  const [, setType] = useDnD();
  const nodeTypeList = [
    "input",
    "split_data",
    "model_learner",
    "model_predictor",
    "output",
  ];

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    if (setType) {
      setType(nodeType);
      event.dataTransfer.effectAllowed = "move";
    }
  };

  return (
    <div>
      <h2>Node Menu</h2>
      {nodeTypeList.map((node) => (
        <div
          style={{ margin: "20px", padding: "10px", border: "1px solid black" }}
          key={node}
          onDragStart={(event) => onDragStart(event, node)}
          draggable
        >
          {node}
        </div>
      ))}
    </div>
  );
}
