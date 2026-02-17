
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Database } from 'lucide-react';

export default function DatabaseNode({ data }: NodeProps) {
  const category = (data?.category as string) || '';
  const label = (data?.label as string) || 'Database';
  const cls = category ? `cat-${category.replace(/\s+/g, '-').toLowerCase()}` : '';

  return (
    <div className={`node-database ${cls}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Handle type="target" position={Position.Top} />
      <div className="node-with-icon" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px' }}>
        <div className="node-icon-wrapper">
          <Database size={32} className="node-icon" />
        </div>
        <div className="node-database-label" style={{ fontSize: 13 }}>{label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
