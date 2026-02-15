import type { Node, Edge } from 'reactflow';

/**
 * Validation Answer Structure
 *
 * IMPORTANT: Validation is performed against the sidebar labels stored in
 * `node.data.label` (human-readable labels), NOT `node.type` (visual shape).
 *
 * - `requiredNodes` should list exact sidebar labels (strings) in the order
 *   and multiplicity you expect them to appear. Duplicates are allowed by
 *   repeating the same label.
 * - `requiredEdges` is an array of `[sourceLabel, targetLabel]` pairs. The
 *   validator matches edges by the source/target `data.label` values.
 * - `forbiddenEdges` is an optional array of `[sourceLabel, targetLabel]`
 *   pairs that are explicitly disallowed.
 */
export type ValidationAnswer = {
  requiredNodes: string[];
  requiredEdges: [string, string][];
  forbiddenEdges?: [string, string][];
  description?: string;
};

/**
 * CORRECT ANSWERS FOR EACH CATEGORY
 */
export const CORRECT_ANSWERS: Record<string, ValidationAnswer> = {
  // Programming (Even/Odd checker)
  // Path (types): terminator -> io -> decision -> io -> io -> terminator
  // Branches:
  //  - Start(terminator) -> Input(io) -> Decision(decision) -> PrintEven(io) -> End(terminator)
  //  - Start(terminator) -> Input(io) -> Decision(decision) -> PrintOdd(io)  -> End(terminator)
  // Notes: two `decision -> io` edges and two `io -> terminator` edges represent
  // the two separate output branches (even/odd). Place two distinct IO nodes
  // for outputs or two IO nodes of the same type to satisfy duplicate requirements.
  Programming: {
    requiredNodes: [
      'Start',
      'Input/Output',
      'Decision',
      'Input/Output',
      'Input/Output',
      'End',
    ],
    requiredEdges: [
      ['Start', 'Input/Output'],
      ['Input/Output', 'Decision'],
      ['Decision', 'Input/Output'],
      ['Decision', 'Input/Output'],
      ['Input/Output', 'End'],
      ['Input/Output', 'End'],
    ],
    forbiddenEdges: [['Input/Output', 'Input/Output']],
    description: 'Even/Odd checker: Start → Input → Decision → Output → End',
  },

  'Operating Systems': {
    // Operating Systems (Process lifecycle)
    // Required flow: Process → Ready State → Running State → Waiting State → I/O Request → Ready State (loop) and Running State → Terminated
    requiredNodes: [
      'Process',
      'Ready State',
      'Running State',
      'Waiting State',
      'I/O Request',
      'Terminated',
    ],
    requiredEdges: [
      ['Process', 'Ready State'],
      ['Ready State', 'Running State'],
      ['Running State', 'Waiting State'],
      ['Waiting State', 'I/O Request'],
      ['I/O Request', 'Ready State'],
      ['Running State', 'Terminated'],
    ],
    description:
      'Process lifecycle: Process → Ready → Running → Waiting → I/O → Ready (loop) / Terminated',
  },

  DBMS: {
    // DBMS (Database transaction/validation flow)
    // Path (types): terminator -> io -> process -> database -> io -> terminator
    // Human: Start -> Input -> Validate -> Database -> Output -> End
    requiredNodes: [
      'Start',
      'User Input',
      'Validate Query',
      'Database',
      'Commit',
      'Rollback',
      'End',
    ],
    requiredEdges: [
      ['Start', 'User Input'],
      ['User Input', 'Validate Query'],
      ['Validate Query', 'Database'],
      ['Database', 'Commit'],
      ['Database', 'Rollback'],
      ['Rollback', 'End'],
    ],
    description: 'DBMS flow: Start → Input → Validate → Database → Commit/Rollback → End',
  },

  Cybersecurity: {
    // Cybersecurity (Authentication flow)
    // Path (types): terminator -> io -> process -> decision -> io -> io -> terminator
    // Branches:
    //  - Start -> Input -> Verify -> Decision -> Grant(io) -> End
    //  - Start -> Input -> Verify -> Decision -> Deny(io)  -> End
    // Notes: two `decision -> io` edges and two `io -> terminator` edges represent
    // the grant/deny outputs. Forbidden edges prevent invalid connections like
    // a decision directly to terminator.
    requiredNodes: [
      'User',
      'Authentication',
      'Authorization',
      'Encrypt',
      'Firewall',
      'Decrypt',
      'Access Granted',
      'Access Denied',
    ],
    requiredEdges: [
      ['User', 'Authentication'],
      ['Authentication', 'Authorization'],
      ['Authorization', 'Encrypt'],
      ['Encrypt', 'Firewall'],
      ['Firewall', 'Decrypt'],
      ['Decrypt', 'Access Granted'],
      ['Authorization', 'Access Denied'],
    ],
    forbiddenEdges: [
      ['User', 'Access Granted'],
      ['Authentication', 'Access Granted'],
      ['Authorization', 'Access Granted'],
    ],
    description:
      'Authentication flow: User → Authentication → Authorization → Encrypt → Firewall → Decrypt → Access Granted / Access Denied',
  },
};

/**
 * VALIDATION FUNCTION
 */
export function validateFlowchart(
  nodes: Node[],
  edges: Edge[],
  answer: ValidationAnswer
): {
  valid: boolean;
  message: string;
  score: number;
  totalRequired: number;
  correctEdgeIds: string[];
  wrongEdgeIds: string[];
  percentage: number;
  isPerfect: boolean;
} {
  // -------- 1️⃣ CHECK NODE COUNT --------
  // Build a map of node labels to node IDs so we can verify counts.
  // Validation uses `node.data.label` (sidebar labels). If a node lacks
  // `data.label`, we fall back to `node.type` to preserve backward-compat.
  const labelMap: Record<string, string[]> = {};

  nodes.forEach((node) => {
    const label = (node.data && (node.data as any).label) || node.type || 'process';
    if (!labelMap[label]) labelMap[label] = [];
    labelMap[label].push(node.id);
  });

  // Count how many of each label are required (supports duplicates)
  const requiredLabelCounts: Record<string, number> = {};
  answer.requiredNodes.forEach((label) => {
    requiredLabelCounts[label] = (requiredLabelCounts[label] || 0) + 1;
  });

  // Fail early if a required label doesn't have enough instances placed.
  for (const [label, count] of Object.entries(requiredLabelCounts)) {
    const available = labelMap[label]?.length || 0;
    if (available < count) {
      return {
        valid: false,
        message: `Missing ${count - available} "${label}" node(s).`,
        score: 0,
        totalRequired: answer.requiredEdges.length,
        correctEdgeIds: [],
        wrongEdgeIds: edges.map((e) => e.id),
        percentage: 0,
        isPerfect: false,
      };
    }
  }

  // -------- 2️⃣ MAP EDGE TYPES --------
  // Map each edge id to its source/target labels for matching
  const edgeLabelMap = new Map<string, [string, string]>();

  edges.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);

    const sourceLabel = (sourceNode?.data && (sourceNode!.data as any).label) || sourceNode?.type || 'process';
    const targetLabel = (targetNode?.data && (targetNode!.data as any).label) || targetNode?.type || 'process';

    edgeLabelMap.set(edge.id, [sourceLabel, targetLabel]);
  });

  const correctEdgeIds: string[] = [];
  const wrongEdgeIds: string[] = [];

  const remainingRequired = [...answer.requiredEdges];

  // -------- 3️⃣ CLASSIFY EDGES --------
  edges.forEach((edge) => {
    const [sourceLabel, targetLabel] =
      edgeLabelMap.get(edge.id) || ['process', 'process'];

    // Forbidden check (by label) — these are definite wrong edges
    if (answer.forbiddenEdges) {
      const isForbidden = answer.forbiddenEdges.some(
        (fe) => fe[0] === sourceLabel && fe[1] === targetLabel
      );
      if (isForbidden) {
        wrongEdgeIds.push(edge.id);
        return;
      }
    }

    // Required match (label-based, duplicate-safe):
    // Find a matching required pair in `remainingRequired`. If found,
    // mark the edge as correct and remove that required pair.
    const matchIndex = remainingRequired.findIndex(
      (re) => re[0] === sourceLabel && re[1] === targetLabel
    );

    if (matchIndex !== -1) {
      correctEdgeIds.push(edge.id);
      remainingRequired.splice(matchIndex, 1);
    }
    // NOTE: Extra edges (that aren't required and aren't forbidden) are simply ignored.
    // We don't mark them as wrong — we only care that all required edges are satisfied.
  });

  // -------- 4️⃣ FINAL SCORE --------
  const score = correctEdgeIds.length;
  const totalRequired = answer.requiredEdges.length;
  const percentage = Math.round((score / totalRequired) * 100);

  const allRequiredSatisfied = remainingRequired.length === 0;
  const hasForbiddenEdges = wrongEdgeIds.length > 0;

  // VALID = All required edges present AND no forbidden edges
  const valid = allRequiredSatisfied && !hasForbiddenEdges;
  const isPerfect = valid && score === totalRequired;

  // DEBUG: Log validation state
  console.log('[Validation] Correct edges:', correctEdgeIds.length, correctEdgeIds);
  console.log('[Validation] Wrong edges:', wrongEdgeIds.length, wrongEdgeIds);
  console.log('[Validation] All edges from map:', Array.from(edgeLabelMap.entries()).map(([, [s, t]]) => `${s}→${t}`));
  console.log('[Validation] Required edges:', answer.requiredEdges);
  console.log('[Validation] Remaining required:', remainingRequired);
  console.log('[Validation] Valid:', valid, 'isPerfect:', isPerfect);

  return {
    valid,
    message: valid
      ? '✓ Correct Flowchart! Perfect!'
      : `Score: ${score}/${totalRequired} (${percentage}%)`,
    score,
    totalRequired,
    correctEdgeIds,
    wrongEdgeIds,
    percentage,
    isPerfect,
  };
}

/**
 * VALIDATE BY CATEGORY
 */
export function validateByCategory(
  category: string,
  nodes: Node[],
  edges: Edge[]
) {
  const answer = CORRECT_ANSWERS[category];

  if (!answer) {
    return {
      valid: false,
      message: `Unknown category: ${category}`,
      score: 0,
      totalRequired: 0,
      correctEdgeIds: [],
      wrongEdgeIds: edges.map((e) => e.id),
      percentage: 0,
      isPerfect: false,
    };
  }

  return validateFlowchart(nodes, edges, answer);
}
