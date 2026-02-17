
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';

export default function ServerNode({ data }: NodeProps) {
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
      <Handle type="target" position={Position.Top} />
      <div className="node-server" style={{minWidth:180,padding:'12px 18px',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div className="node-server-label">{data?.label || 'Server'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
