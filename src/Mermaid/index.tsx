import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import CodeEditor from '../CodeEditor';
import './index.less';

interface MermaidProps {
  /** Mermaid 图表语法字符串 */
  chart: string;
  /** 主题：default | dark | forest | neutral @default 'default' */
  theme?: 'default' | 'dark' | 'forest' | 'neutral';
  /** 是否启用缩放/拖拽交互（大图建议开启）@default false */
  zoomable?: boolean;
  /** 是否启用实时编辑模式 @default false */
  editable?: boolean;
  /** 本地缓存 key（editable 模式下使用） */
  cacheKey?: string;
}

let mermaidInitialized = false;

/**
 * 将当前渲染好的 SVG 字符串导出为高清 PNG 并触发下载。
 * pixelRatio=2 即 2× 分辨率，适合 Retina 屏幕；可调高至 3 获得更大尺寸。
 *
 * 注意：SVG 中引用的系统字体（如 -apple-system）在 canvas 里会回退为默认字体，
 * 这是浏览器安全限制，属于已知限制。
 */
function exportSvgAsPng(svg: string, pixelRatio = 2) {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svg, 'image/svg+xml');
  const svgEl = svgDoc.querySelector('svg');
  if (!svgEl) return;

  // 优先读取 width/height 属性，缺失时回退到 viewBox
  let w = parseFloat(svgEl.getAttribute('width') || '0');
  let h = parseFloat(svgEl.getAttribute('height') || '0');
  if (!w || !h) {
    const vb = svgEl.getAttribute('viewBox')?.split(/[\s,]+/);
    if (vb && vb.length === 4) {
      w = parseFloat(vb[2]);
      h = parseFloat(vb[3]);
    }
  }
  if (!w || !h) return;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * pixelRatio);
  canvas.height = Math.round(h * pixelRatio);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 填充白色背景（SVG 默认透明）
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(pixelRatio, pixelRatio);

  // blob: URL 会让 canvas 被标记为 tainted（跨域），导致 toDataURL 报 SecurityError。
  // 改用 base64 data: URI，浏览器将其视为同源，绕过该限制。
  // btoa 不支持多字节字符；用 TextEncoder 将 UTF-8 字节数组转为 latin1 字符串再编码。
  const bytes = new TextEncoder().encode(svg);
  const base64 = btoa(Array.from(bytes, (b) => String.fromCodePoint(b)).join(''));
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, w, h);
    const a = document.createElement('a');
    a.download = `mermaid-${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };
  img.src = `data:image/svg+xml;base64,${base64}`;
}

// 纯渲染组件（不含 editable 逻辑）
const MermaidChart: React.FC<{
  chart: string;
  zoomable?: boolean;
  /** SVG 渲染完成后回调，参数为导出函数；可供父组件将导出按钮放到外部工具栏 */
  onExportReady?: (exportFn: () => void) => void;
}> = ({ chart, zoomable = false, onExportReady }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lastTouchDist = useRef<number>(0);

  useEffect(() => {
    const renderChart = async () => {
      if (!chart) return;
      const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      try {
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());
        setSvg(renderedSvg);
        setError('');
      } catch {
        // mermaid 渲染失败时会把错误节点注入 body，需要手动清理
        document.getElementById(id)?.remove();
        document.getElementById(`d${id}`)?.remove();
        setError('图表语法错误，请检查 Mermaid 语法');
        setSvg('');
      }
    };
    renderChart();
  }, [chart]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!zoomable) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((s) => Math.min(Math.max(0.3, s + delta), 3));
    },
    [zoomable],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!zoomable) return;
      setDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [zoomable, position],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    },
    [dragging, dragStart],
  );

  const handlePointerUp = useCallback(() => setDragging(false), []);

  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((v) => !v);
    if (!isFullscreen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isFullscreen]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!zoomable || e.touches.length < 2) return;
      e.preventDefault();
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      if (lastTouchDist.current > 0) {
        const delta = (dist - lastTouchDist.current) * 0.005;
        setScale((s) => Math.min(Math.max(0.3, s + delta), 3));
      }
      lastTouchDist.current = dist;
    },
    [zoomable],
  );

  const handleTouchEnd = useCallback(() => {
    lastTouchDist.current = 0;
  }, []);

  const handleExport = useCallback(() => exportSvgAsPng(svg), [svg]);

  // svg 就绪或更新时，把最新的导出函数通知父组件
  useEffect(() => {
    if (svg && onExportReady) onExportReady(handleExport);
  }, [svg, handleExport, onExportReady]);

  if (error) {
    return (
      <div className="mermaid-container mermaid-error">
        <p>图表语法错误，请检查 Mermaid 语法</p>
      </div>
    );
  }

  // 非缩放模式：直接渲染图表
  if (!zoomable) {
    return <div className="mermaid-container" dangerouslySetInnerHTML={{ __html: svg }} />;
  }

  return (
    <div className={`mermaid-zoomable-wrapper ${isFullscreen ? 'mermaid-fullscreen' : ''}`}>
      <div className="mermaid-toolbar">
        <button onClick={() => setScale((s) => Math.min(s + 0.2, 3))} title="放大">
          +
        </button>
        <span className="mermaid-scale-label">{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale((s) => Math.max(s - 0.2, 0.3))} title="缩小">
          -
        </button>
        <button onClick={handleReset} title="重置">
          ↺
        </button>
        <button onClick={toggleFullscreen} title={isFullscreen ? '退出全屏' : '全屏'}>
          {isFullscreen ? '✕' : '⛶'}
        </button>
        {/* 导出按钮放在 toolbar 末尾，与其他操作同组 */}
        {svg && (
          <button onClick={handleExport} title="导出高清 PNG（2×）">
            <svg
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7.25 1a.75.75 0 0 1 1.5 0v7.44l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5A.75.75 0 0 1 6.03 6.22l2.22 2.22V1z" />
              <path d="M2.75 11a.75.75 0 0 1 .75.75v1.5h9v-1.5a.75.75 0 0 1 1.5 0v1.5A1.5 1.5 0 0 1 12.5 15h-9A1.5 1.5 0 0 1 2 13.25v-1.5A.75.75 0 0 1 2.75 11z" />
            </svg>
          </button>
        )}
      </div>
      <div
        className="mermaid-viewport"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="mermaid-canvas"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: dragging ? 'grabbing' : 'grab',
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  );
};

const Mermaid: React.FC<MermaidProps> = ({
  chart,
  theme = 'default',
  zoomable = false,
  editable = false,
  cacheKey,
}) => {
  // editable 模式下，MermaidChart 渲染完成后会把导出函数传到这里，
  // 再通过 extraActions 注入到 CodeEditor 的工具栏。
  const [exportFn, setExportFn] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme,
        securityLevel: 'loose',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      });
      mermaidInitialized = true;
    }
  }, []);

  if (editable) {
    const exportBtn = exportFn ? (
      <button className="code-editor-btn" onClick={exportFn} title="导出高清 PNG（2×）">
        {/* 下载图标 */}
        <svg
          width="13"
          height="13"
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7.25 1a.75.75 0 0 1 1.5 0v7.44l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5A.75.75 0 0 1 6.03 6.22l2.22 2.22V1z" />
          <path d="M2.75 11a.75.75 0 0 1 .75.75v1.5h9v-1.5a.75.75 0 0 1 1.5 0v1.5A1.5 1.5 0 0 1 12.5 15h-9A1.5 1.5 0 0 1 2 13.25v-1.5A.75.75 0 0 1 2.75 11z" />
        </svg>
      </button>
    ) : null;

    return (
      <CodeEditor
        lang="mermaid"
        code={chart}
        cacheKey={cacheKey}
        extraActions={exportBtn}
        renderer={(code) => (
          <MermaidChart
            chart={code}
            zoomable={zoomable}
            onExportReady={(fn) => setExportFn(() => fn)}
          />
        )}
      />
    );
  }

  return <MermaidChart chart={chart} zoomable={zoomable} />;
};

export default Mermaid;
