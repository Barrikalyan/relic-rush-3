
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Repeat } from 'lucide-react';

export default function LoopNode({ data }: NodeProps) {
  const category = (data?.category as string) || '';
  const label = (data?.label as string) || 'Loop';
  const cls = category ? `cat-${category.replace(/\s+/g, '-').toLowerCase()}` : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Handle type="target" position={Position.Top} />
      <div className={`node-loop-visual node-with-icon ${cls}`} style={{ minWidth: 160, padding: '16px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div className="node-icon-wrapper">
          <Repeat size={24} className="node-icon" />
        </div>
        <div className="node-loop-label" style={{ fontSize: 13 }}>{label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
