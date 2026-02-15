import TerminatorNode from './nodes/TerminatorNode';
import ProcessNode from './nodes/ProcessNode';
import DecisionNode from './nodes/DecisionNode';
import IoNode from './nodes/IoNode';
import LoopNode from './nodes/LoopNode';
import DatabaseNode from './nodes/DatabaseNode';
import ConnectorNode from './nodes/ConnectorNode';

// Export nodeTypes and edgeTypes from a dedicated module so the object
// reference remains stable across renders and HMR updates.
export const nodeTypes = {
  terminator: TerminatorNode,
  process: ProcessNode,
  decision: DecisionNode,
  io: IoNode,
  loop: LoopNode,
  database: DatabaseNode,
  connector: ConnectorNode,
} as const;

export const edgeTypes = {} as any;

export default nodeTypes;
