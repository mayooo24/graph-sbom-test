import React, { useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  Edge,
  ConnectionMode, ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import data from './mock.json';
import './App.css'

function App() {
  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState([]);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const realEdges: Edge[] = [];

    // Set flow nodes with dynamic positioning
    const nodes = data.results.map((node, index) => ({
      id: node.displayName,
      data: { label: node.displayName },
      position: { x: (index % 5) * 200, y: Math.floor(index / 5) * 200 },
      style: {
        color: node.vulnerabilities?.length > 0 ? 'red' : 'black'
      }
    }));
    setFlowNodes(nodes);

    // Process each node's routes to create edges
    data.results.forEach((node) => {
      const routes = node?.introduceThrough?.routes;

      if (routes) {
        routes.forEach((route) => {
          for (let i = 0; i < route.length - 1; i++) {
            realEdges.push({
              id: `edge-${route[i]}-${route[i + 1]}`,
              source: route[i],
              target: route[i + 1],
            });
          }
        });
      }
    });

    setFlowEdges(realEdges);

  }, [setFlowNodes, setFlowEdges]);

  return (
      <ReactFlowProvider>
        <div style={{ height: '100%', width: '100%' }}>
          <ReactFlow
              nodes={flowNodes}
              edges={flowEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              connectionLineType={ConnectionLineType.SmoothStep}
              connectionMode={ConnectionMode.Loose}
              fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
  );
}

export default App;
