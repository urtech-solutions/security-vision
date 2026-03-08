import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { UserPlus, AlertTriangle, Radio } from "lucide-react";
import OpsSidebar from "@/components/ops/OpsSidebar";
import StatusBar from "@/components/ops/StatusBar";
import StatsCards from "@/components/ops/StatsCards";
import LiveLogs from "@/components/ops/LiveLogs";
import FloorPlan from "@/components/ops/FloorPlan";
import FABMenu from "@/components/ops/FABMenu";
import FloatingPanel from "@/components/ops/FloatingPanel";
import VisitorForm from "@/components/ops/VisitorForm";
import DeviceControlPanel from "@/components/ops/DeviceControlPanel";
import QuickActions from "@/components/ops/QuickActions";
import DashboardGrid, {
  DashboardWidget,
} from "@/components/ops/DashboardGrid";

interface PanelState {
  id: string;
  type: string;
  position: { x: number; y: number };
  meta?: Record<string, any>;
}

const ALL_WIDGETS: DashboardWidget[] = [
  { id: "stats", type: "stats", title: "Indicadores", minW: 6, minH: 2 },
  { id: "floorplan", type: "floorplan", title: "Planta Baixa", minW: 4, minH: 5 },
  { id: "logs", type: "logs", title: "Logs em Tempo Real", minW: 3, minH: 4 },
  { id: "quickactions", type: "quickactions", title: "Ações Rápidas", minW: 2, minH: 3 },
  { id: "devices", type: "devices", title: "Dispositivos", minW: 3, minH: 4 },
];

const INITIAL_WIDGET_IDS = ["stats", "floorplan", "logs"];

const STORAGE_KEY_WIDGETS = "ops-dashboard-widgets";

function loadWidgets(): DashboardWidget[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_WIDGETS);
    if (saved) {
      const ids: string[] = JSON.parse(saved);
      return ids
        .map((id) => ALL_WIDGETS.find((w) => w.id === id))
        .filter(Boolean) as DashboardWidget[];
    }
  } catch {}
  return INITIAL_WIDGET_IDS.map(
    (id) => ALL_WIDGETS.find((w) => w.id === id)!
  );
}

function saveWidgets(widgets: DashboardWidget[]) {
  localStorage.setItem(
    STORAGE_KEY_WIDGETS,
    JSON.stringify(widgets.map((w) => w.id))
  );
}

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [panels, setPanels] = useState<PanelState[]>([]);
  const [widgets, setWidgets] = useState<DashboardWidget[]>(loadWidgets);

  const openPanel = (type: string, meta?: Record<string, any>) => {
    if (type === "device") {
      const existing = panels.find(
        (p) => p.type === "device" && p.meta?.filterType === meta?.filterType
      );
      if (existing) return;
    } else {
      if (panels.find((p) => p.type === type)) return;
    }
    setPanels((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        position: { x: 200 + prev.length * 30, y: 120 + prev.length * 30 },
        meta,
      },
    ]);
  };

  const closePanel = (id: string) => {
    setPanels((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddWidget = useCallback((widget: DashboardWidget) => {
    setWidgets((prev) => {
      const next = [...prev, widget];
      saveWidgets(next);
      return next;
    });
  }, []);

  const handleRemoveWidget = useCallback((id: string) => {
    setWidgets((prev) => {
      const next = prev.filter((w) => w.id !== id);
      saveWidgets(next);
      return next;
    });
  }, []);

  const renderWidget = useCallback(
    (widget: DashboardWidget, editMode: boolean) => {
      switch (widget.type) {
        case "stats":
          return (
            <div className="h-full overflow-auto p-2">
              <StatsCards />
            </div>
          );
        case "floorplan":
          return (
            <div className="h-full glass-panel overflow-hidden">
              <FloorPlan />
            </div>
          );
        case "logs":
          return (
            <div className="h-full glass-panel overflow-hidden flex flex-col">
              <LiveLogs />
            </div>
          );
        case "quickactions":
          return (
            <div className="h-full glass-panel overflow-auto p-3">
              <QuickActions embedded />
            </div>
          );
        case "devices":
          return (
            <div className="h-full glass-panel overflow-auto">
              <DeviceControlPanel />
            </div>
          );
        default:
          return (
            <div className="h-full glass-panel flex items-center justify-center text-muted-foreground text-xs">
              Widget: {widget.title}
            </div>
          );
      }
    },
    []
  );

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      <OpsSidebar active={activeSection} onNavigate={setActiveSection} />

      <div className="flex-1 flex flex-col min-w-0">
        <StatusBar />

        <DashboardGrid
          widgets={widgets}
          renderWidget={renderWidget}
          availableWidgets={ALL_WIDGETS}
          onAddWidget={handleAddWidget}
          onRemoveWidget={handleRemoveWidget}
        />
      </div>

      {/* FAB Menu */}
      <FABMenu
        onOpenVisitor={() => openPanel("visitor")}
        onOpenIncident={() => openPanel("incident")}
        onOpenDevicePanel={(filterType, title) =>
          openPanel("device", { filterType, title })
        }
      />

      {/* Floating panels */}
      <AnimatePresence>
        {panels.map((panel) => {
          if (panel.type === "visitor") {
            return (
              <FloatingPanel
                key={panel.id}
                id={panel.id}
                title="Cadastro Rápido de Visitante"
                icon={<UserPlus className="w-4 h-4" />}
                onClose={() => closePanel(panel.id)}
                defaultPosition={panel.position}
                defaultSize={{ width: 400, height: 460 }}
              >
                <VisitorForm />
              </FloatingPanel>
            );
          }
          if (panel.type === "incident") {
            return (
              <FloatingPanel
                key={panel.id}
                id={panel.id}
                title="Registrar Incidente"
                icon={<AlertTriangle className="w-4 h-4" />}
                onClose={() => closePanel(panel.id)}
                defaultPosition={panel.position}
                defaultSize={{ width: 400, height: 380 }}
              >
                <div className="p-4 space-y-3">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Novo Incidente
                  </p>
                  <select className="w-full h-9 px-3 text-sm bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="">Tipo de incidente</option>
                    <option value="invasao">Tentativa de invasão</option>
                    <option value="vandalismo">Vandalismo</option>
                    <option value="emergencia">Emergência médica</option>
                    <option value="incendio">Incêndio</option>
                    <option value="outro">Outro</option>
                  </select>
                  <input
                    placeholder="Local do incidente"
                    className="w-full h-9 px-3 text-sm bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <textarea
                    placeholder="Descrição detalhada..."
                    rows={4}
                    className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                  <button className="w-full h-9 text-sm font-medium rounded-md bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity">
                    Registrar Incidente
                  </button>
                </div>
              </FloatingPanel>
            );
          }
          if (panel.type === "device") {
            return (
              <FloatingPanel
                key={panel.id}
                id={panel.id}
                title={panel.meta?.title || "Controle de Dispositivos"}
                icon={<Radio className="w-4 h-4" />}
                onClose={() => closePanel(panel.id)}
                defaultPosition={panel.position}
                defaultSize={{ width: 380, height: 480 }}
              >
                <DeviceControlPanel
                  filterType={panel.meta?.filterType}
                  title={panel.meta?.title}
                />
              </FloatingPanel>
            );
          }
          return null;
        })}
      </AnimatePresence>
    </div>
  );
};

export default Index;
