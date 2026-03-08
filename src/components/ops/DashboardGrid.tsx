import { useState, useCallback, useMemo } from "react";
import { Responsive, WidthProvider, Layout, Layouts } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Check,
  Plus,
  GripVertical,
  X,
  RotateCcw,
  Maximize2,
  Minimize2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  minW?: number;
  minH?: number;
}

interface DashboardGridProps {
  widgets: DashboardWidget[];
  renderWidget: (widget: DashboardWidget, editMode: boolean) => React.ReactNode;
  availableWidgets: DashboardWidget[];
  onAddWidget: (widget: DashboardWidget) => void;
  onRemoveWidget: (id: string) => void;
}

const STORAGE_KEY = "ops-dashboard-layouts";

const DEFAULT_LAYOUTS: Record<string, Layout[]> = {
  lg: [
    { i: "stats", x: 0, y: 0, w: 12, h: 3, minW: 6, minH: 2 },
    { i: "floorplan", x: 0, y: 3, w: 7, h: 10, minW: 4, minH: 5 },
    { i: "logs", x: 7, y: 3, w: 5, h: 10, minW: 3, minH: 4 },
  ],
};

function loadLayouts(): Layouts | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveLayouts(layouts: Layouts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
}

export default function DashboardGrid({
  widgets,
  renderWidget,
  availableWidgets,
  onAddWidget,
  onRemoveWidget,
}: DashboardGridProps) {
  const [editMode, setEditMode] = useState(false);
  const [layouts, setLayouts] = useState<Layouts>(
    () => loadLayouts() || DEFAULT_LAYOUTS
  );
  const [showWidgetPicker, setShowWidgetPicker] = useState(false);

  const handleLayoutChange = useCallback(
    (_layout: Layout[], allLayouts: Layouts) => {
      setLayouts(allLayouts);
      saveLayouts(allLayouts);
    },
    []
  );

  const handleReset = useCallback(() => {
    setLayouts(DEFAULT_LAYOUTS);
    saveLayouts(DEFAULT_LAYOUTS);
    toast.success("Layout restaurado ao padrão");
  }, []);

  const handleToggleEdit = useCallback(() => {
    if (editMode) {
      toast.success("Layout salvo com sucesso");
    }
    setEditMode((prev) => !prev);
    setShowWidgetPicker(false);
  }, [editMode]);

  // Build layout items ensuring all widgets have a layout entry
  const currentLayout = useMemo(() => {
    const lgLayout = layouts.lg || [];
    const mapped: Layout[] = widgets.map((w) => {
      const existing = lgLayout.find((l) => l.i === w.id);
      if (existing) return existing;
      // New widget gets placed at bottom
      const maxY = lgLayout.reduce((max, l) => Math.max(max, l.y + l.h), 0);
      return {
        i: w.id,
        x: 0,
        y: maxY,
        w: 6,
        h: 5,
        minW: w.minW || 3,
        minH: w.minH || 3,
      };
    });
    return { lg: mapped };
  }, [layouts, widgets]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-card/60 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2">
          {editMode && (
            <>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setShowWidgetPicker(!showWidgetPicker)}
                className="h-7 px-2.5 flex items-center gap-1.5 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Widget
              </motion.button>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleReset}
                className="h-7 px-2.5 flex items-center gap-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restaurar
              </motion.button>
            </>
          )}
        </div>

        <button
          onClick={handleToggleEdit}
          className={`h-7 px-3 flex items-center gap-1.5 rounded-md text-xs font-semibold transition-all ${
            editMode
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          {editMode ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Salvar Layout
            </>
          ) : (
            <>
              <Pencil className="w-3.5 h-3.5" />
              Editar Layout
            </>
          )}
        </button>
      </div>

      {/* Widget Picker Dropdown */}
      <AnimatePresence>
        {showWidgetPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-11 left-3 z-50 glass-panel p-3 min-w-[260px]"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-foreground">
                Adicionar Widget
              </span>
              <button
                onClick={() => setShowWidgetPicker(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              {availableWidgets
                .filter((aw) => !widgets.find((w) => w.id === aw.id))
                .map((aw) => (
                  <button
                    key={aw.id}
                    onClick={() => {
                      onAddWidget(aw);
                      setShowWidgetPicker(false);
                      toast.success(`Widget "${aw.title}" adicionado`);
                    }}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted transition-colors text-left"
                  >
                    <Plus className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs text-foreground">{aw.title}</span>
                  </button>
                ))}
              {availableWidgets.filter(
                (aw) => !widgets.find((w) => w.id === aw.id)
              ).length === 0 && (
                <p className="text-xs text-muted-foreground py-2 text-center">
                  Todos os widgets já estão no dashboard
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <div className={`flex-1 overflow-auto p-2 ${editMode ? "dashboard-edit-mode" : ""}`}>
        <ResponsiveGridLayout
          className="layout"
          layouts={currentLayout}
          breakpoints={{ lg: 900, md: 600, sm: 0 }}
          cols={{ lg: 12, md: 8, sm: 4 }}
          rowHeight={36}
          isDraggable={editMode}
          isResizable={editMode}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".widget-drag-handle"
          compactType="vertical"
          margin={[10, 10]}
          containerPadding={[0, 0]}
        >
          {widgets.map((widget) => (
            <div key={widget.id} className="relative group">
              {/* Widget wrapper */}
              <div
                className={`h-full w-full rounded-lg overflow-hidden transition-all ${
                  editMode
                    ? "ring-1 ring-primary/30 ring-dashed"
                    : ""
                }`}
              >
                {/* Widget header in edit mode */}
                {editMode && (
                  <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-2 py-1 bg-card/90 backdrop-blur-sm border-b border-primary/20 rounded-t-lg">
                    <div className="flex items-center gap-1.5 widget-drag-handle cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-3.5 h-3.5 text-primary/60" />
                      <span className="text-[10px] font-semibold text-primary/80 uppercase tracking-wider">
                        {widget.title}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveWidget(widget.id)}
                      className="p-0.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className={`h-full ${editMode ? "pt-7" : ""}`}>
                  {renderWidget(widget, editMode)}
                </div>
              </div>
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
}
