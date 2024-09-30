import { useDnD } from "./DnDContext";

export default function NodeMenu() {
  const [_, setType] = useDnD();
  const nodeTypeList = ["input", "model", "output"];

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div>
      <h2>Node Menu</h2>
      {nodeTypeList.map((node) => (
        <div
          key={node}
          style={{ margin: "20px" }}
          onDragStart={(event) => onDragStart(event, node)}
          draggable
        >
          {node}
        </div>
      ))}
    </div>
  );
}
