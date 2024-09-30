import React, { useRef, useCallback } from "react";
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
} from "@xyflow/react";
import "./index.css";
import "@xyflow/react/dist/style.css";

type CustomNode = Node;

import { DnDProvider, useDnD } from "./DnDContext";
import NodeMenu from "./NodeMenu";
import NodeProperties from "./NodeProperties";

const initialNodes: CustomNode[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Input node" },
    position: { x: 250, y: 5 },
  },
  {
    id: "2",
    type: "model",
    data: { label: "Model" },
    position: { x: 250, y: 100 },
  },
  {
    id: "3",
    type: "output",
    data: { label: "Output" },
    position: { x: 250, y: 200 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
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
      const newNode: CustomNode = {
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
        <NodeProperties nodes={nodes} />
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
