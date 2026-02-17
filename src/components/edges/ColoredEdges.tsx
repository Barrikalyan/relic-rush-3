import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
} from 'reactflow';

/**
 * Green glowing edge for correct connections
 */
export function CorrectEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: '#10b981',
          strokeWidth: 3,
          filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))',
          animation: 'edgeGlow 1.5s ease-in-out infinite',
        }}
      />
    </>
  );
}

/**
 * Red shaking edge for incorrect connections
 */
export function WrongEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: '#ef4444',
          strokeWidth: 3,
          filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))',
          animation: 'edgeShake 0.4s ease-in-out infinite',
        }}
      />
    </>
  );
}

/**
 * Default edge type (for comparison in messages)
 */
export function DefaultEdgeType({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
      style={{
        stroke: '#000',
        strokeWidth: 2,
      }}
    />
  );
}

export const customEdgeTypes = {
  correct: CorrectEdge,
  wrong: WrongEdge,
  default: DefaultEdgeType,
};
