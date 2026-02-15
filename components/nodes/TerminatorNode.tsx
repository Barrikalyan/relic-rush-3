import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Play, Square } from 'lucide-react';

export default function TerminatorNode({ data }: NodeProps) {
  const category = (data?.category as string) || '';
  const label = (data?.label as string) || 'Start';
  const cls = category ? `cat-${category.replace(/\s+/g, '-').toLowerCase()}` : '';
  const isStart = label.toLowerCase() === 'start';
  const IconComponent = isStart ? Play : Square;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Handle type="target" position={Position.Top} />
      <div className={`node-terminator-visual node-with-icon ${cls}`} style={{ padding: '14px 22px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexDirection: 'column' }}>
        <div className="node-icon-wrapper">
          <IconComponent size={24} className="node-icon" />
        </div>
        <div className="node-terminator-label" style={{ fontSize: 13 }}>{label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
