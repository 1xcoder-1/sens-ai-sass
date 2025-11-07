"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { Move, Zap, Play, Pause, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function RoadmapVisualizer({ nodes, connections, progress = {}, onStepToggle }) {
  const [isClient, setIsClient] = useState(false);
  // Declare all hooks at the top level to follow React Hooks rules
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Convert our nodes to React Flow format with enhanced styling and better positioning
  // These useMemo hooks must be called unconditionally to follow React Hooks rules
  const initialNodes = useMemo(() => 
    isClient ? (nodes || []).map((node, index) => {
      // Ensure we're using the correct ID format for lookup
      const nodeId = node.id.toString();
      const isCompleted = progress[nodeId] || false;
      return {
        id: nodeId,
        type: 'default',
        position: { x: node.x || 100 + (index % 2) * 400, y: node.y || 100 + Math.floor(index / 2) * 300 },
        data: { 
          label: (
            <motion.div 
              className={`p-6 rounded-xl shadow-xl border w-80 ${
                isCompleted 
                  ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
                  : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
              }`}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 25px 30px -10px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-500' 
                        : 'bg-blue-500'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : (
                        <span className="text-white font-bold">{index + 1}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-xl text-gray-800">{node.title}</h3>
                  </div>
                  <p className="text-base text-gray-600 mt-4">{node.description}</p>
                  <div className="flex items-center justify-between mt-5">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {node.duration}
                    </span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="p-2 h-auto"
                        onClick={() => onStepToggle && onStepToggle(nodeId)}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <Play className="h-5 w-5 text-green-600" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        },
        style: {
          width: 350,
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '0',
          boxShadow: 'none',
        }
      }
    }) : [],
    [nodes, progress, onStepToggle, isClient]
  );

  // Convert our connections to React Flow edges with enhanced styling
  const initialEdges = useMemo(() =>
    isClient ? (connections || []).map((conn, index) => ({
      id: `edge-${index}`,
      source: conn.from.toString(),
      target: conn.to.toString(),
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 25,
        height: 25,
        color: '#3b82f6',
      },
      style: {
        strokeWidth: 4,
        stroke: '#3b82f6',
      },
      animated: true,
      label: (
        <motion.div 
          className="px-4 py-2 rounded-full text-sm font-bold bg-blue-500 text-white shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          NEXT STEP
        </motion.div>
      ),
      labelStyle: {
        fill: 'white',
        fontWeight: 700,
      },
      labelShowBg: false,
    })) : [],
    [connections, isClient]
  );

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState([]);
  const [reactFlowEdges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Update nodes and edges when initial data changes
  useEffect(() => {
    if (isClient) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges, setNodes, setEdges, isClient]);
  
  // Declare callback hooks at the top level to follow React Hooks rules
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  
  const onInit = useCallback(
    (instance) => setReactFlowInstance(instance),
    [setReactFlowInstance]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only render ReactFlow on the client side to prevent hydration errors
  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading roadmap visualization...</p>
        </div>
      </div>
    );
  }

  // Create a key based on the number of nodes to force re-render when nodes change
  const flowKey = `flow-${(initialNodes || []).length}-${(initialEdges || []).length}`;

  return (
    <div className="w-full h-full">
      <ReactFlow
        key={flowKey}
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        fitView
        attributionPosition="bottom-left"
        className="rounded-lg"
        snapToGrid={true}
        snapGrid={[20, 20]}
      >
        <Controls className="bg-white shadow-lg border border-gray-200 rounded-lg" />
        <MiniMap 
          className="bg-white shadow-lg border border-gray-200 rounded-lg" 
          maskColor="rgba(240, 240, 240, 0.6)"
          nodeColor={(n) => {
            // Use string ID to match the nodes array
            const nodeId = n.id;
            const node = (nodes || []).find(node => node.id.toString() === nodeId);
            // Use the progress object directly with string keys
            return progress[nodeId] ? '#10b981' : '#3b82f6';
          }}
          nodeBorderRadius={8}
          nodeStrokeWidth={2}
        />
        <Background 
          variant="dots" 
          gap={25} 
          size={1.5} 
          color="#cbd5e1"
        />
      </ReactFlow>
    </div>
  );
}