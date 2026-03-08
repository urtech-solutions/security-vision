import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { UserPlus, AlertTriangle } from "lucide-react";
import OpsSidebar from "@/components/ops/OpsSidebar";
import StatusBar from "@/components/ops/StatusBar";
import StatsCards from "@/components/ops/StatsCards";
import LiveLogs from "@/components/ops/LiveLogs";
import FloorPlan from "@/components/ops/FloorPlan";
import FABMenu from "@/components/ops/FABMenu";
import FloatingPanel from "@/components/ops/FloatingPanel";
import VisitorForm from "@/components/ops/VisitorForm";

interface PanelState {
  id: string;
  type: string;
  position: { x: number; y: number };
}

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [panels, setPanels] = useState<PanelState[]>([]);

  const openPanel = (type: string) => {
    if (panels.find((p) => p.type === type)) return; // already open
    setPanels((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        position: { x: 200 + prev.length * 30, y: 120 + prev.length * 30 },
      },
    ]);
  };

  const closePanel = (id: string) => {
    setPanels((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <OpsSidebar active={activeSection} onNavigate={setActiveSection} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <StatusBar />

        <div className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
          {/* Stats row */}
          <StatsCards />

          {/* Main content: FloorPlan + Logs */}
          <div className="flex-1 flex gap-3 min-h-0">
            {/* Floor Plan */}
            <div className="flex-1 glass-panel overflow-hidden min-w-0">
              <FloorPlan />
            </div>

            {/* Live Logs */}
            <div className="w-[440px] glass-panel overflow-hidden flex flex-col shrink-0">
              <LiveLogs />
            </div>
          </div>
        </div>
      </div>

      {/* FAB Menu */}
      <FABMenu
        onOpenVisitor={() => openPanel("visitor")}
        onOpenIncident={() => openPanel("incident")}
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
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Novo Incidente</p>
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
          return null;
        })}
      </AnimatePresence>
    </div>
  );
};

export default Index;
