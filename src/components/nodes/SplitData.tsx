import { Handle, Position } from "@xyflow/react";

export default function SplitDataType({ data, type }) {
  return (
    <div>
      <Handle type="target" position={Position.Top} />
      <label>{data.label}</label>

      <Handle id="a" type="source" position={Position.Bottom} />
      <Handle id="b" type="source" position={Position.Bottom} />
    </div>
  );
}
