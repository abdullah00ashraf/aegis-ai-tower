import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hls from 'hls.js';

const HOME_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4";
const VISION_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";
const ROBOTICS_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4";
const ARCHITECTURE_HLS = "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";

export default function GlobalBackground() {
  const location = useLocation();
  const architectureVideoRef = useRef<HTMLVideoElement>(null);
  
  const path = location.pathname;
  const isHome = path === '/';
  const isVision = path === '/vision';
  const isRobotics = path === '/robotics';
  const isArchitecture = path === '/architecture';

  // Initialize HLS for Architecture exactly once to persist the stream
  useEffect(() => {
    if (architectureVideoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: false });
        hls.loadSource(ARCHITECTURE_HLS);
        hls.attachMedia(architectureVideoRef.current);
      } else if (architectureVideoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        architectureVideoRef.current.src = ARCHITECTURE_HLS;
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[0] pointer-events-none bg-black">
      {/* Home Video */}
      <motion.video
        src={HOME_VIDEO}
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ opacity: isHome ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />
      
      {/* Vision Video */}
      <motion.video
        src={VISION_VIDEO}
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ opacity: isVision ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />
      
      {/* Robotics Video */}
      <motion.video
        src={ROBOTICS_VIDEO}
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ opacity: isRobotics ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />
      
      {/* Architecture HLS Video (Opacity 60% as originally styled) */}
      <motion.video
        ref={architectureVideoRef}
        autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ opacity: isArchitecture ? 0.6 : 0 }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
}
