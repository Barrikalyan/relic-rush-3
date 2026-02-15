
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { getIconForLabel } from '../../utils/iconMap';

export default function ProcessNode({ data }: NodeProps) {
  const category = (data?.category as string) || '';
  const label = (data?.label as string) || 'Process';
  const cls = category ? `cat-${category.replace(/\s+/g, '-').toLowerCase()}` : '';
  const IconComponent = getIconForLabel(label);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Handle type="target" position={Position.Top} />
      <div className={`node-computer node-with-icon ${cls}`} style={{ minWidth: 160, padding: '16px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div className="node-icon-wrapper">
          <IconComponent size={28} className="node-icon" />
        </div>
        <div className="node-computer-label" style={{ fontSize: 13, marginTop: 4 }}>{label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
