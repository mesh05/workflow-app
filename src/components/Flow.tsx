import React, { useRef, useCallback, useState } from "react";
import {
  Node,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  Connection,
} from "@xyflow/react";
import "./index.css";
import "@xyflow/react/dist/style.css";

import { DnDProvider, useDnD } from "./DnDContext";
import NodeMenu from "./NodeMenu";
import NodeProperties from "./NodeProperties";

//Create custom types of nodes

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "File Input Node" },
    position: { x: 250, y: 5 },
  },
  {
    id: "2",
    type: "split data",
    data: { label: "split data (80/20)" },
    position: { x: 250, y: 105 },
  },
  {
    id: "3",
    type: "model learner",
    data: { label: "Model Learner" },
    position: { x: 250, y: 205 },
  },
  {
    id: "4",
    type: "model predictor",
    data: { label: "Model Predictor" },
    position: { x: 250, y: 305 },
  },
  {
    id: "5",
    type: "output",
    data: { label: "Output" },
    position: { x: 250, y: 405 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition, updateNodeData } = useReactFlow();
  const [nodeSelected, setNodeSelected] = useState<Node | null>(null);
  const [type] = useDnD();

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((prevEdge) => addEdge(connection, prevEdge)),
    [],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    setNodeSelected(node);
    console.log("onNodeClick", node);
  };

  // (BUG) On drop is returning type as null
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      console.log("onDrop", type);
      // check if the dropped element is valid
      if (!type || typeof type !== "string") {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type],
  );

  return (
    <div className="dndflow">
      <div style={{ width: "15vw" }}>
        <NodeMenu />
        <NodeProperties
          nodes={nodes}
          nodeSelected={nodeSelected}
          updateNodeData={updateNodeData}
        />
      </div>
      <div
        className="reactflow-wrapper"
        style={{ height: "100vh", width: "85vw" }}
        ref={reactFlowWrapper}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          colorMode="dark"
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

function Flow() {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <DnDFlow />
      </DnDProvider>
    </ReactFlowProvider>
  );
}

export default Flow;
