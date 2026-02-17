import { Handle, Position } from 'reactflow';
import { Link2 } from 'lucide-react';

export default function ConnectorNode() {
  return (
    <div className="node-connector" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 60 }}>
      <Handle type="target" position={Position.Left} />
      <div className="node-connector-inner" style={{ width: 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Link2 size={20} />
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
