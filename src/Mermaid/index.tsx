import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import './index.less';

interface MermaidProps {
  /**
   * Mermaid 图表语法字符串
   */
  chart: string;
  /**
   * 主题：default | dark | forest | neutral
   * @default 'default'
   */
  theme?: 'default' | 'dark' | 'forest' | 'neutral';
  /**
   * 是否启用缩放/拖拽交互（大图建议开启）
   * @default false
   */
  zoomable?: boolean;
}

let mermaidInitialized = false;

const Mermaid: React.FC<MermaidProps> = ({ chart, theme = 'default', zoomable = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  useEffect(() => {
    const renderChart = async () => {
      if (!chart || !containerRef.current) return;

      try {
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());
        setSvg(renderedSvg);
        setError('');
      } catch (err: any) {
        setError(err?.message || '图表渲染失败');
        setSvg('');
      }
    };

    renderChart();
  }, [chart]);

  // 缩放
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!zoomable) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale((s) => Math.min(Math.max(0.3, s + delta), 3));
    },
    [zoomable],
  );

  // 拖拽开始
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!zoomable) return;
      setDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [zoomable, position],
  );

  // 拖拽移动
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    },
    [dragging, dragStart],
  );

  // 拖拽结束
  const handlePointerUp = useCallback(() => {
    setDragging(false);
  }, []);

  // 重置视图
  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // 全屏切换
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((v) => !v);
    // 进入全屏时重置位置
    if (!isFullscreen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isFullscreen]);

  // 触摸缩放（双指 pinch）
  const lastTouchDist = useRef<number>(0);
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!zoomable || e.touches.length < 2) return;
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);

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
        <p>图表渲染错误：{error}</p>
        <pre>{chart}</pre>
      </div>
    );
  }

  // 普通模式（不可缩放）
  if (!zoomable) {
    return (
      <div
        className="mermaid-container"
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  // 可缩放模式
  return (
    <div className={`mermaid-zoomable-wrapper ${isFullscreen ? 'mermaid-fullscreen' : ''}`}>
      {/* 工具栏 */}
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

      {/* 可视区域 */}
      <div
        className="mermaid-viewport"
        ref={viewportRef}
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
          ref={containerRef}
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

export default Mermaid;
