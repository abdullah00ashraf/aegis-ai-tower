const fs = require('fs');
const path = require('path');

// Configuration
const IGNORE_DIRS = ['node_modules', 'dist', '.git', '.vercel'];
const OUTPUT_FILE = path.join(__dirname, 'presentation.html');

// Helper to recursively find all .md files
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        findMarkdownFiles(filePath, fileList);
      }
    } else if (file.endsWith('.md')) {
      fileList.push({
        path: filePath,
        relativePath: path.relative(__dirname, filePath).replace(/\\/g, '/'),
        name: file.replace(/\.md$/, '').replace(/_/g, ' ')
      });
    }
  }
  return fileList;
}

// Generate the HTML presentation
function generatePresentation() {
  console.log('Initiating Aegis Knowledge Base Compiler...');
  const mdFiles = findMarkdownFiles(__dirname);
  
  // Sort files to put README or main reports first
  mdFiles.sort((a, b) => {
    if (a.name.toLowerCase().includes('readme') || a.name.toLowerCase().includes('project report')) return -1;
    if (b.name.toLowerCase().includes('readme') || b.name.toLowerCase().includes('project report')) return 1;
    return a.name.localeCompare(b.name);
  });

  console.log(`Compiled ${mdFiles.length} intelligence documents.`);

  let slidesHtml = '';

  for (const fileObj of mdFiles) {
    const content = fs.readFileSync(fileObj.path, 'utf-8');
    
    // Escape textarea closing tags inside markdown
    const safeContent = content.replace(/<\/textarea>/g, '&lt;/textarea&gt;');

    slidesHtml += `
      <!-- File: ${fileObj.relativePath} -->
      <section>
        <section class="file-intro-slide">
          <div class="glass-panel">
            <div class="file-badge">DOCUMENT NODE</div>
            <h2 class="cyber-title">${fileObj.name}</h2>
            <p class="file-path"><code>PATH: ${fileObj.relativePath}</code></p>
            <p class="scroll-instruction">Scroll Down to explore this document matrix ↓</p>
          </div>
        </section>
        <section data-markdown data-separator="^\\r?\\n---\\r?\\n$" data-separator-vertical="^\\r?\\n## " data-separator-notes="^Note:">
          <textarea data-template>
${safeContent}
          </textarea>
        </section>
      </section>
    `;
  }

  const htmlTemplate = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>AEGIS OS // Master Presentation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Space+Grotesk:wght@400;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/reset.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/reveal.min.css">
    
    <!-- Code syntax highlighting -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/plugin/highlight/monokai.min.css">
    
    <style>
      :root {
        --aegis-primary: #00f0ff;
        --aegis-dark: #0a0e17;
        --aegis-surface: rgba(16, 24, 40, 0.7);
        --text-glow: 0 0 10px rgba(0, 240, 255, 0.5);
      }
      
      body {
        background-color: var(--aegis-dark);
        font-family: 'Inter', sans-serif;
        color: #e2e8f0;
      }
      
      /* Grid Background Animation */
      .bg-grid {
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background-image: 
          linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px);
        background-size: 40px 40px;
        z-index: -1;
        transform: perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px);
        animation: gridMove 20s linear infinite;
        opacity: 0.5;
      }
      
      @keyframes gridMove {
        0% { transform: perspective(500px) rotateX(60deg) translateY(0) translateZ(-200px); }
        100% { transform: perspective(500px) rotateX(60deg) translateY(40px) translateZ(-200px); }
      }

      /* Aegis HUD Overlay */
      .hud-overlay {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        pointer-events: none;
        z-index: 1000;
        border: 1px solid rgba(0, 240, 255, 0.1);
        box-sizing: border-box;
      }
      
      .hud-header {
        position: absolute; top: 20px; left: 20px; right: 20px;
        display: flex; justify-content: space-between;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 12px; letter-spacing: 2px; color: var(--aegis-primary);
        text-shadow: var(--text-glow);
      }
      
      .hud-footer {
        position: absolute; bottom: 20px; left: 20px; right: 20px;
        display: flex; justify-content: space-between;
        font-family: 'Space Grotesk', sans-serif;
        font-size: 12px; letter-spacing: 2px; color: rgba(255,255,255,0.4);
      }

      .status-dot {
        display: inline-block; width: 8px; height: 8px;
        background-color: var(--aegis-primary); border-radius: 50%;
        margin-right: 8px; box-shadow: var(--text-glow);
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.8); }
      }

      /* Custom Reveal CSS Overrides */
      .reveal .slides { text-align: left; }
      .reveal h1, .reveal h2, .reveal h3, .reveal h4 {
        font-family: 'Space Grotesk', sans-serif;
        text-transform: none;
        font-weight: 700;
        color: #fff;
        margin-bottom: 20px;
      }
      .reveal h1 { color: var(--aegis-primary); text-shadow: var(--text-glow); font-size: 3em; }
      .reveal h2 { color: #f8fafc; font-size: 2.2em; border-bottom: 1px solid rgba(0, 240, 255, 0.2); padding-bottom: 10px; }
      .reveal p, .reveal li { font-size: 32px; line-height: 1.6; color: #cbd5e1; }
      .reveal a { color: var(--aegis-primary); }
      .reveal section img { background: none; border: none; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border-radius: 8px; max-height: 50vh; display: block; margin: 30px auto; }
      .reveal pre { background: rgba(0,0,0,0.8); border: 1px solid rgba(0,240,255,0.2); border-radius: 8px; box-shadow: 0 15px 35px rgba(0,0,0,0.4); width: 100%; }
      .reveal code { font-family: 'Fira Code', monospace; }
      .reveal blockquote { border-left: 4px solid var(--aegis-primary); background: rgba(0, 240, 255, 0.05); padding: 20px; box-shadow: none; width: 100%; text-align: left; font-style: italic;}
      
      .reveal table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 0.8em; }
      .reveal th { background: rgba(0,240,255,0.1); color: var(--aegis-primary); padding: 15px; border-bottom: 2px solid rgba(0,240,255,0.3); text-align: left;}
      .reveal td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); }

      /* Glassmorphism Panels */
      .glass-panel {
        background: var(--aegis-surface);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(0, 240, 255, 0.15);
        border-radius: 12px;
        padding: 60px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        position: relative;
        overflow: hidden;
      }
      
      .glass-panel::before {
        content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px;
        background: linear-gradient(90deg, transparent, var(--aegis-primary), transparent);
      }

      .cyber-title { margin-top: 0 !important; border: none !important; }
      
      .expertise-grid {
        display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; margin-top: 40px;
      }
      .expertise-card {
        background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); padding: 25px; border-radius: 8px;
        transition: transform 0.3s ease, border-color 0.3s ease;
      }
      .expertise-card:hover { transform: translateY(-5px); border-color: var(--aegis-primary); }
      .expertise-card h4 { color: var(--aegis-primary); font-size: 1.2em; margin-bottom: 10px; border: none;}
      .expertise-card p { font-size: 0.8em; margin: 0; }

      .file-intro-slide { text-align: center !important; }
      .file-badge { display: inline-block; padding: 5px 15px; background: rgba(0,240,255,0.1); border: 1px solid var(--aegis-primary); border-radius: 50px; font-size: 14px; font-family: 'Space Grotesk'; color: var(--aegis-primary); margin-bottom: 20px; }
      .file-path code { background: rgba(0,0,0,0.5); padding: 10px 20px; border-radius: 4px; font-size: 18px; color: #a1a1aa;}
      .scroll-instruction { margin-top: 40px !important; font-size: 18px !important; color: rgba(255,255,255,0.5) !important; animation: bounce 2s infinite; }
      
      @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
    </style>
  </head>
  <body>
    <div class="bg-grid"></div>
    
    <div class="hud-overlay">
      <div class="hud-header">
        <div><span class="status-dot"></span>AEGIS OS // CLASSIFIED RUNTIME</div>
        <div id="live-time">SYS.TIME: 00:00:00</div>
      </div>
      <div class="hud-footer">
        <div>CONFIDENTIAL PROPRIETARY DATA</div>
        <div>MATRIX COMPILATION</div>
      </div>
    </div>

    <div class="reveal">
      <div class="slides">
        
        <!-- Opening Slide -->
        <section>
          <div class="glass-panel" style="text-align: center;">
            <div style="font-family: 'Space Grotesk'; font-size: 24px; letter-spacing: 10px; color: var(--aegis-primary); margin-bottom: 20px;">AEGIS TOWER</div>
            <h1 style="font-size: 4em; border:none;">Autonomous Infrastructure</h1>
            <p style="color: #94a3b8; font-size: 24px;">The World's First Deterministic Neural Operating System for the Built Environment.</p>
            <p style="margin-top: 40px; font-size: 18px; color: rgba(0,240,255,0.5);">PRESS [SPACE] TO INITIALIZE</p>
          </div>
        </section>

        <!-- Expertise Justification Slide -->
        <section>
          <div class="glass-panel">
            <h2>Justification of Expertise</h2>
            <p style="font-size: 24px; margin-bottom: 30px;">We do not build "Smart Cities." We engineer deterministic, self-healing physical operating systems. Our authority derives from a vertical integration of deep learning and mechanical robotics.</p>
            
            <div class="expertise-grid">
              <div class="expertise-card">
                <h4>1. Deterministic AI (PINN)</h4>
                <p>We eliminated "AI Hallucinations" in the physical world by anchoring our Bi-LSTM anomaly detection networks strictly to the immutable laws of thermodynamics and structural mechanics.</p>
              </div>
              <div class="expertise-card">
                <h4>2. Agentic Robotics</h4>
                <p>Telemetry without action is obsolete. We deploy KUKA KR IONTEC robotic sub-agents and micro-drone swarms that execute sub-50ms dispatch commands without human latency.</p>
              </div>
              <div class="expertise-card">
                <h4>3. Sensory Integration</h4>
                <p>Our foundation rests on military-grade diagnostics: distributed fiber-optic acoustic sensing (DAS) mapping structural stress at kHz resolution, and pre-ignition thermal arrays.</p>
              </div>
              <div class="expertise-card">
                <h4>4. Power Sovereignty</h4>
                <p>Expertise in decentralized Tri-Generation Microgrids ensures 100% AI operational continuity, completely insulating our infrastructure from municipal grid failures.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- System Architecture Slide -->
        <section>
          <div class="glass-panel">
            <h2>The Technical Superiority Matrix</h2>
            <table style="width:100%; text-align:left;">
              <tr>
                <th>Operational Metric</th>
                <th>Traditional PropTech</th>
                <th>Aegis OS Engineering</th>
              </tr>
              <tr>
                <td><strong>Reaction Latency</strong></td>
                <td>3+ Hours (Human-in-the-loop)</td>
                <td><strong>< 50 Milliseconds</strong></td>
              </tr>
              <tr>
                <td><strong>Anomaly Detection</strong></td>
                <td>Reactive (Sensors detect smoke)</td>
                <td><strong>Predictive (Thermal arrays detect heat before ignition)</strong></td>
              </tr>
              <tr>
                <td><strong>Data Verification</strong></td>
                <td>Rule-based alerts</td>
                <td><strong>Physics-Informed Neural Networks</strong></td>
              </tr>
              <tr>
                <td><strong>Cost Paradigm</strong></td>
                <td>Depreciating Asset + Rising OpEx</td>
                <td><strong>Appreciating SaaS Hardware Node</strong></td>
              </tr>
            </table>
          </div>
        </section>
        
        <!-- Transition Slide -->
        <section>
          <div class="glass-panel" style="text-align: center;">
            <div class="status-dot" style="width: 20px; height: 20px;"></div>
            <h2 style="border:none; margin-top: 20px;">KNOWLEDGE BASE DECRYPTED</h2>
            <p>Accessing complete markdown document matrix...</p>
          </div>
        </section>

        ${slidesHtml}
      </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/reveal.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/plugin/markdown/markdown.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/plugin/highlight/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.6.1/plugin/notes/notes.min.js"></script>

    <script>
      // Live Clock in HUD
      setInterval(() => {
        const d = new Date();
        document.getElementById('live-time').innerText = 'SYS.TIME: ' + 
          d.getHours().toString().padStart(2, '0') + ':' + 
          d.getMinutes().toString().padStart(2, '0') + ':' + 
          d.getSeconds().toString().padStart(2, '0');
      }, 1000);

      Reveal.initialize({
        hash: true,
        slideNumber: 'c/t',
        transition: 'convex',
        backgroundTransition: 'fade',
        controlsLayout: 'edges',
        plugins: [ RevealMarkdown, RevealHighlight, RevealNotes ],
        markdown: {
          smartypants: true
        }
      });
      
      // Auto-trigger Mermaid if there are any mermaid blocks (naive render)
      Reveal.on('ready', event => {
        const m = document.querySelectorAll('.language-mermaid');
        if(m.length > 0 && typeof mermaid === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js';
          script.onload = () => { mermaid.initialize({startOnLoad:true, theme:'dark'}); mermaid.init(undefined, m); };
          document.head.appendChild(script);
        }
      });
    </script>
  </body>
</html>`;

  fs.writeFileSync(OUTPUT_FILE, htmlTemplate, 'utf-8');
  console.log(`Presentation generated successfully at: ${OUTPUT_FILE}`);
}

generatePresentation();
