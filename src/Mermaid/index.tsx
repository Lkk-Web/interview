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

// 纯渲染组件（不含 editable 逻辑）
const MermaidChart: React.FC<{ chart: string; zoomable?: boolean }> = ({
  chart,
  zoomable = false,
}) => {
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
      try {
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());
        setSvg(renderedSvg);
        setError('');
      } catch {
        // 清理 mermaid 注入到 body 的错误节点（炸弹图标）
        setTimeout(() => {
          document.querySelectorAll('[id^="mermaid-"]').forEach((el) => {
            if (el.parentElement === document.body) el.remove();
          });
        }, 50);
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

  if (error) {
    return (
      <div className="mermaid-container mermaid-error">
        <p>图表语法错误，请检查 Mermaid 语法</p>
      </div>
    );
  }

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
    return (
      <CodeEditor
        lang="mermaid"
        code={chart}
        cacheKey={cacheKey}
        renderer={(code) => <MermaidChart chart={code} zoomable={zoomable} />}
      />
    );
  }

  return <MermaidChart chart={chart} zoomable={zoomable} />;
};

export default Mermaid;
