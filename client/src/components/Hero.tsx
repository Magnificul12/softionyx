import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const rendererRef = useRef<any>(null);
  const materialRef = useRef<any>(null);
  const geometryRef = useRef<any>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const meshRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Intersection Observer to pause animation when not visible
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      visibilityObserver.observe(sectionRef.current);
    }

    return () => {
      visibilityObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    let isMounted = true;
    let scriptCleanup: (() => void) | null = null;
    let isAnimating = false;

    // Check if Three.js is already loaded
    const loadThreeJS = () => {
      if ((window as any).THREE) {
        initializeThree();
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.head.querySelector('script[src*="three.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', initializeThree);
        return;
      }

      // Load Three.js dynamically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.async = true;
      
      script.onload = initializeThree;
      script.onerror = () => {
        console.error('Failed to load Three.js');
      };
      
      document.head.appendChild(script);
    };

    const initializeThree = () => {
      if (!isMounted || !canvasRef.current) return;

      const THREE = (window as any).THREE;
      if (!THREE) {
        console.error('Three.js not available');
        return;
      }

      // WebGL Aurora Background
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const maxPixelRatio = prefersReducedMotion ? 1 : 1.5;
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current, 
        alpha: true,
        powerPreference: 'high-performance',
        antialias: false // Disable antialiasing for better performance
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio)); // Limit pixel ratio

      const material = new THREE.ShaderMaterial({
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: `
          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float iTime;
          uniform vec2 iResolution;

          #define NUM_OCTAVES 3

          float rand(vec2 n) { 
            return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
          }

          float noise(vec2 p){
            vec2 ip = floor(p);
            vec2 u = fract(p);
            u = u*u*(3.0-2.0*u);
            
            float res = mix(
              mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
              mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
            return res*res;
          }

          float fbm(vec2 x) {
            float v = 0.0;
            float a = 0.3;
            vec2 shift = vec2(100);    
            mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
            for (int i = 0; i < NUM_OCTAVES; ++i) {
              v += a * noise(x);
              x = rot * x * 2.0 + shift;
              a *= 0.4;
            }
            return v;
          }

          void main() {
            vec2 shake = vec2(sin(iTime * 1.2) * 0.005, cos(iTime * 2.1) * 0.005);
            
            vec2 p = ((gl_FragCoord.xy + shake * iResolution.xy) - iResolution.xy * 0.5) / iResolution.y * mat2(6.0, -4.0, 4.0, 6.0);
            vec2 v;
            vec4 o = vec4(0.0);
            
            float f = 2.0 + fbm(p + vec2(iTime * 5.0, 0.0)) * 0.5; 
            
            for(float i = 0.0; i++ < 35.0;)
            {
              v = p + cos(i * i + (iTime + p.x * 0.08) * 0.025 + i * vec2(13.0, 11.0)) * 3.5 + vec2(sin(iTime * 3.0 + i) * 0.003, cos(iTime * 3.5 - i) * 0.003);
              
              float tailNoise = fbm(v + vec2(iTime * 0.5, i)) * 0.3 * (1.0 - (i / 35.0)); 
              
              vec4 auroraColors = vec4(
                0.1 + 0.3 * sin(i * 0.2 + iTime * 0.4),
                0.3 + 0.5 * cos(i * 0.3 + iTime * 0.5),
                0.7 + 0.3 * sin(i * 0.4 + iTime * 0.3),
                1.0
              );
              
              vec4 currentContribution = auroraColors * exp(sin(i * i + iTime * 0.8)) / length(max(v, vec2(v.x * f * 0.015, v.y * 1.5)));
              
              float thinnessFactor = smoothstep(0.0, 1.0, i / 35.0) * 0.6; 
              o += currentContribution * (1.0 + tailNoise * 0.8) * thinnessFactor;
            }
            
            o = tanh(pow(o / 100.0, vec4(1.6)));
            gl_FragColor = o * 1.5;
          }
        `
      });

      const geometry = new THREE.PlaneGeometry(2, 2);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Store refs for cleanup
      rendererRef.current = renderer;
      materialRef.current = material;
      geometryRef.current = geometry;
      sceneRef.current = scene;
      cameraRef.current = camera;
      meshRef.current = mesh;

      let lastTime = 0;
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
        return;
      }

      const targetFPS = 45; // Reduced for better stability and lower GPU usage
      const frameInterval = 1000 / targetFPS;
      isAnimating = true;

      function animate(currentTime: number) {
        if (!isAnimating || !isMounted || !canvasRef.current) {
          return;
        }

        // Check visibility before rendering
        if (isVisible && renderer && material && scene && camera) {
          try {
            const elapsed = currentTime - lastTime;
            
            if (elapsed >= frameInterval) {
              if (material.uniforms && material.uniforms.iTime) {
                material.uniforms.iTime.value += 0.016;
              }
              renderer.render(scene, camera);
              lastTime = currentTime - (elapsed % frameInterval);
            }
          } catch (error) {
            console.warn('Error in animation loop:', error);
            isAnimating = false;
            return;
          }
        }

        // Continue animation loop only if still animating
        if (isAnimating && isMounted) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      }

      // Start animation
      animationFrameRef.current = requestAnimationFrame(animate);

      // Debounced resize handler
      let resizeTimeout: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (renderer && material) {
            renderer.setSize(window.innerWidth, window.innerHeight);
            material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
          }
        }, 150);
      };

      window.addEventListener('resize', handleResize);

      // Store cleanup function
      scriptCleanup = () => {
        isAnimating = false;
        clearTimeout(resizeTimeout);
        window.removeEventListener('resize', handleResize);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        if (rendererRef.current) {
          try {
            rendererRef.current.dispose();
          } catch (e) {
            console.warn('Error disposing renderer:', e);
          }
          rendererRef.current = null;
        }
        if (materialRef.current) {
          try {
            materialRef.current.dispose();
          } catch (e) {
            console.warn('Error disposing material:', e);
          }
          materialRef.current = null;
        }
        if (geometryRef.current) {
          try {
            geometryRef.current.dispose();
          } catch (e) {
            console.warn('Error disposing geometry:', e);
          }
          geometryRef.current = null;
        }
      };
    };

    // Start loading Three.js
    loadThreeJS();

    return () => {
      isMounted = false;
      isAnimating = false;
      
      // Run script cleanup if it exists
      if (scriptCleanup) {
        scriptCleanup();
      }
    };
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden min-h-[100svh] flex flex-col justify-center">
      {/* Spline Background - Lazy loaded */}
      {isVisible && (
        <div className="spline-container absolute top-0 left-0 w-full h-full -z-10 hidden sm:block">
          <iframe
            src="https://my.spline.design/aidatamodelinteraction-mdTL3FktFVHgDvFr5TKtnYDV"
            frameBorder="0"
            width="100%"
            height="100%"
            id="aura-spline"
            style={{ border: 'none' }}
            loading="lazy"
          ></iframe>
        </div>
      )}

      {/* Aurora WebGL Background */}
      <canvas 
        ref={canvasRef}
        id="aurora-canvas"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: -10,
          pointerEvents: 'none'
        }}
        className="hidden sm:block"
      ></canvas>
      
      {/* Enhanced Animated Background Blobs - Reduced to 2 for better performance */}
      <div className="absolute top-0 w-full h-full left-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[20%] w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] bg-indigo-600/20 sm:bg-indigo-600/25 rounded-full blur-[100px] sm:blur-[120px] animate-blob mix-blend-screen will-change-transform"></div>
        <div className="absolute top-[20%] right-[10%] sm:right-[20%] w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] bg-purple-600/20 sm:bg-purple-600/25 rounded-full blur-[100px] sm:blur-[120px] animate-blob-reverse animation-delay-2000 mix-blend-screen will-change-transform"></div>
      </div>
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] sm:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:28px_28px] sm:bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10 animate-grid"></div>
      
      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 via-transparent to-transparent -z-10"></div>

      {/* Bottom fill to avoid black gap on tall screens */}
      <div className="absolute inset-x-0 bottom-0 h-[35vh] bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/90 -z-10"></div>

      {/* Mobile-only soft gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-indigo-900/20 to-slate-950/60 -z-10 sm:hidden"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div className="animate-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-medium text-indigo-300 mb-8 hover:bg-indigo-500/20 hover:border-indigo-500/40 transition-all cursor-default backdrop-blur-md shadow-lg shadow-indigo-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {t('hero.badge')}
          </div>
        </div>
        
        <h1 className="animate-in delay-100 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium text-white tracking-tight mb-6 sm:mb-8 max-w-5xl mx-auto leading-[1.15]">
          {t('hero.titleLine1')} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white via-purple-200 to-indigo-300 animate-text-gradient relative inline-block overflow-hidden">
            {t('hero.titleHighlight')}
            <span className="absolute inset-0 pointer-events-none mix-blend-screen">
              <span className="absolute inset-y-0 left-[-60%] w-[50%] bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.15),rgba(255,255,255,0.55),rgba(255,255,255,0.15),transparent)] blur-sm skew-x-[-12deg] animate-sheen-diag"></span>
            </span>
          </span>
        </h1>
        
        <p className="animate-in delay-200 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed font-light">
          {t('hero.subtitle')}
        </p>
        
        <div className="animate-in delay-300 flex flex-col md:flex-row items-center justify-center gap-4">
          <Link
            to="/request-help"
            className="group relative w-full md:w-auto px-8 py-3.5 bg-white text-slate-950 rounded-lg font-semibold text-sm hover:bg-slate-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.6)] flex items-center justify-center gap-2 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
            <span className="relative z-10">{t('hero.ctaPrimary')}</span>
            <span className="iconify group-hover:translate-x-1 transition-transform relative z-10" data-icon="lucide:arrow-right" data-width="16"></span>
          </Link>
          <Link
            to="/services"
            className="group w-full md:w-auto px-8 py-3.5 glass border border-white/20 hover:border-indigo-500/40 hover:bg-white/10 text-white rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md hover:shadow-lg hover:shadow-indigo-500/20"
          >
            <span className="iconify group-hover:rotate-12 transition-transform" data-icon="lucide:layers" data-width="18"></span>
            {t('hero.ctaSecondary')}
          </Link>
        </div>
      </div>
    </section>
  );
}
