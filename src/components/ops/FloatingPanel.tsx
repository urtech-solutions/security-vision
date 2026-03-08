import { motion } from "framer-motion";
import { X, Minimize2, Maximize2 } from "lucide-react";
import { useState, useRef, useCallback, ReactNode } from "react";

interface FloatingPanelProps {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  onClose: () => void;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
}

export default function FloatingPanel({
  title,
  icon,
  children,
  onClose,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 420, height: 480 },
}: FloatingPanelProps) {
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      setPosition({
        x: Math.max(0, ev.clientX - dragOffset.current.x),
        y: Math.max(0, ev.clientY - dragOffset.current.y),
      });
    };

    const handleMouseUp = () => {
      setDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [position]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.2 }}
      className="fixed z-50 glass-panel panel-glow"
      style={{
        left: position.x,
        top: position.y,
        width: defaultSize.width,
        height: minimized ? "auto" : defaultSize.height,
        cursor: dragging ? "grabbing" : "auto",
      }}
    >
      {/* Header - draggable */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between px-3 py-2 border-b border-border bg-card/80 rounded-t-lg cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="h-6 w-6 flex items-center justify-center rounded hover:bg-muted transition-colors"
          >
            {minimized ? <Maximize2 className="w-3 h-3 text-muted-foreground" /> : <Minimize2 className="w-3 h-3 text-muted-foreground" />}
          </button>
          <button
            onClick={onClose}
            className="h-6 w-6 flex items-center justify-center rounded hover:bg-destructive/20 transition-colors"
          >
            <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!minimized && (
        <div className="overflow-y-auto" style={{ height: defaultSize.height - 44 }}>
          {children}
        </div>
      )}
    </motion.div>
  );
}
