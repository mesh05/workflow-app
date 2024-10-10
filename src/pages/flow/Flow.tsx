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
  Connection,
} from "@xyflow/react";
import "./index.css";
import "@xyflow/react/dist/style.css";

import { DnDProvider, useDnD } from "../../components/DnDContext";
import NodeMenu from "../../components/NodeMenu";
import NodeProperties from "../../components/NodeProperties";
import { useRecoilState } from "recoil";
import { selectedNodeState } from "../../recoil/atoms";
import { SplitDataType } from "../../components/nodes/SplitDataNode";
import { flowState } from "../../recoil/atoms";

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
    type: "split_data",
    data: { label: "split data (80/20)" },
    position: { x: 250, y: 105 },
  },
  {
    id: "3",
    type: "model_learner",
    data: { label: "Model Learner" },
    position: { x: 250, y: 205 },
  },
  {
    id: "4",
    type: "model_predictor",
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
  const [nodeSelected, setNodeSelected] = useRecoilState(selectedNodeState);
  const [flowData, setFlowData] = useRecoilState(flowState);
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
    console.log("onNodeClick", nodeSelected);
  };

  // (BUG) On drop is returning type as null
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
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

  const onNodeDelete = useCallback(
    (node) => {
      const newFlowData = flowData.filter((tnode) => {
        return tnode.nodeId !== node[0].id;
      });
      console.log("delete ", node[0]);
      setFlowData(newFlowData);
    },
    [flowData],
  );

  return (
    <div className="dndflow">
      <div style={{ width: "15vw" }}>
        <NodeMenu />
        <NodeProperties edges={edges} updateNodeData={updateNodeData} />
      </div>
      <div
        className="reactflow-wrapper"
        style={{ height: "94vh", width: "85vw" }}
        ref={reactFlowWrapper}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{
            split_data: SplitDataType,
          }}
          onNodeClick={onNodeClick}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodesDelete={onNodeDelete}
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
