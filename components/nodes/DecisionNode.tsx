
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { HelpCircle } from 'lucide-react';

export default function DecisionNode({ data }: NodeProps) {
  const category = (data?.category as string) || '';
  const label = (data?.label as string) || 'Decision';
  const cls = category ? `cat-${category.replace(/\s+/g, '-').toLowerCase()}` : '';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Input handle - from top */}
      <Handle type="target" position={Position.Top} />
      
      {/* Decision node - normal rectangular shape like other nodes */}
      <div className={`node-decision-visual node-with-icon ${cls}`} style={{ width: 140, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <div className="node-icon-wrapper">
            <HelpCircle size={24} className="node-icon" />
          </div>
          <div className="node-decision-label" style={{ fontSize: 12 }}>{label}</div>
        </div>
      </div>
      
      {/* Output handles - left for True/Yes, right for False/No */}
      <Handle type="source" position={Position.Left} id="true" style={{ top: '50%' }} />
      <Handle type="source" position={Position.Right} id="false" style={{ top: '50%' }} />
      <Handle type="source" position={Position.Bottom} id="default" />
    </div>
  );
}
