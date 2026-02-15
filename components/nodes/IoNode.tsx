
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { ArrowRight } from 'lucide-react';

export default function IoNode({ data }: NodeProps) {
  const category = (data?.category as string) || '';
  const label = (data?.label as string) || 'I/O';
  const cls = category ? `cat-${category.replace(/\s+/g, '-').toLowerCase()}` : '';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Handle type="target" position={Position.Top} />
      <div className={`parallelogram node-io node-with-icon ${cls}`}>
        <div className="content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <div className="node-icon-wrapper">
            <ArrowRight size={24} className="node-icon" />
          </div>
          <div className="node-label" style={{ fontSize: 13 }}>{label}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
