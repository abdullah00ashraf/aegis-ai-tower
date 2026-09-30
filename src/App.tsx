import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './pages/Home';
import Vision from './pages/Vision';
import Architecture from './pages/Architecture';
import AgenticAI from './pages/AgenticAI';
import Robotics from './pages/Robotics';
import Simulations from './pages/Simulations';
import SpatialTwin from './pages/SpatialTwin';
import AegisKernel from './pages/AegisKernel';
import NexusLaunch from './pages/NexusLaunch';
import { ToastContainer } from './components/Toast';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/kernel" element={<AegisKernel />} />
        <Route path="/nexus" element={<NexusLaunch />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="vision" element={<Vision />} />
          <Route path="architecture" element={<Architecture />} />
          <Route path="agentic-ai" element={<AgenticAI />} />
          <Route path="robotics" element={<Robotics />} />
          <Route path="simulations" element={<Simulations />} />
          <Route path="spatial-twin" element={<SpatialTwin />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
