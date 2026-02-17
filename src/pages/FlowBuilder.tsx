import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  MarkerType,
} from 'reactflow';
import type { Connection, Edge, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import '../index.css';
import '../components/styles/confetti.css';
import Sidebar from '../components/Sidebar';
import { nodeTypes, edgeTypes } from '../components/nodeTypes';
import { customEdgeTypes } from '../components/edges/ColoredEdges';
import ResultModal from '../components/ResultModal';
import { validateByCategory } from '../utils/validation';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function FlowBuilderContent() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [category, setCategory] = useState<string>('Programming');
  const [timer, setTimer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Competition state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  const onConnect = useCallback((params: Edge | Connection) => {
    if (isLocked) return; // Prevent connections if locked

    if (params.source === params.target) return;
    setEdges((eds) => {
      if (eds.some((e) => e.source === params.source && e.target === params.target)) return eds;
      return addEdge(params, eds);
    });
  }, [setEdges, isLocked]);

  const onDrop = useCallback((event: any) => {
    if (isLocked) return; // Prevent drops if locked

    event.preventDefault();
    const raw = event.dataTransfer.getData('application/reactflow') || '';
    let payload: { type: string; label?: string; category?: string } = { type: 'process' };
    try {
      payload = JSON.parse(raw);
    } catch (e) {
      payload.type = raw || 'process';
    }

    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    const position = bounds
      ? { x: event.clientX - bounds.left - 80, y: event.clientY - bounds.top - 28 }
      : { x: event.clientX - 80, y: event.clientY - 28 };
    const newNode: Node = {
      id: `${Date.now()}`,
      type: payload.type || 'process',
      position,
      data: { label: payload.label || `${payload.type} node`, category: payload.category || category },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes, category, isLocked]);

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = isLocked ? 'none' : 'move';
  }, [isLocked]);

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setTimer(window.setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000));
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const handleSubmit = () => {
    // Run validation
    const result = validateByCategory(category, nodes, edges);
    setValidationResult(result);

    // Highlight edges with colors and animations
    const highlightedEdges = edges.map((edge) => ({
      ...edge,
      type: result.correctEdgeIds.includes(edge.id)
        ? 'correct'
        : result.wrongEdgeIds.includes(edge.id)
        ? 'wrong'
        : 'default',
      animated: true,
      style: {
        strokeWidth: 3,
        ...(result.correctEdgeIds.includes(edge.id) && {
          stroke: '#10b981',
          filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))',
        }),
        ...(result.wrongEdgeIds.includes(edge.id) && {
          stroke: '#ef4444',
          filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))',
        }),
      },
    }));

    setEdges(highlightedEdges);

    // Lock editing
    setIsSubmitted(true);
    setIsLocked(true);

    // Show result modal
    setShowResultModal(true);
  };

  const handleRetry = () => {
    // Reset edges to default style
    const resetEdges = edges.map((edge) => ({
      ...edge,
      type: 'default',
      style: { stroke: '#000', strokeWidth: 2 },
    }));
    setEdges(resetEdges);

    // Unlock editing
    setIsSubmitted(false);
    setIsLocked(false);

    // Close modal
    setShowResultModal(false);
    setValidationResult(null);
  };

  const handleCloseModal = () => {
    setShowResultModal(false);
  };

  // Merge custom edge types with default
  const allEdgeTypes = { ...edgeTypes, ...customEdgeTypes };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid rgba(15,23,42,0.04)',
          background: 'linear-gradient(180deg,#ffffff,#fbfdff)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 16 }}>Event Round — {category}</h2>
            <div style={{ color: '#6b7280', fontSize: 12 }}>
              {isLocked ? '🔒 Submission locked • Review your flowchart' : 'Build the flowchart for this challenge'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ fontSize: 14, color: '#111827', marginRight: 8 }}>
            {timeLeft > 0
              ? `Time: ${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`
              : 'Timer stopped'}
          </div>
          {!timer ? (
            <button className="btn" onClick={() => startTimer(600)}>
              Start 10m
            </button>
          ) : (
            <button className="btn" onClick={stopTimer}>
              Stop
            </button>
          )}
          <button className="btn" onClick={isSubmitted ? handleRetry : handleSubmit}>
            {isSubmitted ? '🔄 Retry' : 'Submit Flowchart'}
          </button>
        </div>
      </header>

      {/* Result Modal */}
      {validationResult && (
        <ResultModal
          isVisible={showResultModal}
          valid={validationResult.valid}
          score={validationResult.score}
          totalRequired={validationResult.totalRequired}
          percentage={validationResult.percentage}
          onClose={handleCloseModal}
          onRetry={handleRetry}
          isPerfect={validationResult.isPerfect}
        />
      )}

      <div className="app-shell">
        <Sidebar onCategoryChange={setCategory} />

        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={allEdgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDoubleClick={(_event, node) => {
              if (!isLocked) setSelectedNode(node);
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
            connectionLineStyle={{ stroke: '#000', strokeWidth: 2 }}
            defaultEdgeOptions={{
              animated: true,
              markerEnd: { type: MarkerType.Arrow },
              style: { stroke: '#000', strokeWidth: 2 },
            }}
          >
            <MiniMap />
            <Controls showInteractive />
            <Background gap={24} size={1} />
          </ReactFlow>

          {selectedNode && !isLocked && (
            <div className="floating-editor">
              <div style={{ marginBottom: 8, fontWeight: 700 }}>
                {selectedNode.data?.label}
              </div>
              <input
                autoFocus
                defaultValue={selectedNode.data?.label}
                onBlur={(e) => {
                  const newLabel = e.currentTarget.value;
                  setNodes((nds) =>
                    nds.map((n) =>
                      n.id === selectedNode.id
                        ? { ...n, data: { ...n.data, label: newLabel } }
                        : n
                    )
                  );
                  setSelectedNode(null);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FlowBuilder() {
  return (
    <ReactFlowProvider>
      <FlowBuilderContent />
    </ReactFlowProvider>
  );
}
