import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Plus,
  X,
  DoorOpen,
  Car,
  Mic,
  Lock,
  Unlock,
  GripVertical,
  Settings,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface QuickAction {
  id: string;
  label: string;
  icon: "door" | "car" | "mic" | "lock" | "unlock";
  color: string;
  deviceName: string;
  portName: string;
}

const iconMap = {
  door: DoorOpen,
  car: Car,
  mic: Mic,
  lock: Lock,
  unlock: Unlock,
};

const defaultActions: QuickAction[] = [
  { id: "qa1", label: "Portão Principal", icon: "door", color: "bg-primary", deviceName: "Leitor Biométrico", portName: "Porta 1" },
  { id: "qa2", label: "Cancela Garagem", icon: "car", color: "bg-status-info", deviceName: "Câmera LPR", portName: "Cancela Entrada" },
  { id: "qa3", label: "Portão Veículos", icon: "door", color: "bg-accent", deviceName: "Portão Veículos", portName: "Motor Principal" },
];

const availableActions: Omit<QuickAction, "id">[] = [
  { label: "Porta Hall Bloco A", icon: "door", color: "bg-primary", deviceName: "ControlID iDFlex", portName: "Porta Principal" },
  { label: "Cancela Saída", icon: "car", color: "bg-status-info", deviceName: "Câmera LPR", portName: "Cancela Saída" },
  { label: "Intercom Guarita", icon: "mic", color: "bg-accent", deviceName: "Intercomunicador", portName: "Canal Áudio 1" },
  { label: "Porta Bloco B", icon: "lock", color: "bg-secondary", deviceName: "Leitor Facial", portName: "Porta Hall" },
];

export default function QuickActions() {
  const [actions, setActions] = useState<QuickAction[]>(defaultActions);
  const [editing, setEditing] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const triggerAction = (action: QuickAction) => {
    if (editing) return;
    toast.success(`⚡ ${action.deviceName} → ${action.portName}: Comando enviado`);
  };

  const removeAction = (id: string) => {
    setActions((prev) => prev.filter((a) => a.id !== id));
  };

  const addAction = (action: Omit<QuickAction, "id">) => {
    setActions((prev) => [
      ...prev,
      { ...action, id: crypto.randomUUID() },
    ]);
    setShowAdd(false);
    toast.success(`Atalho "${action.label}" adicionado`);
  };

  return (
    <div className="fixed bottom-6 left-20 z-40">
      {/* Toggle bar */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setExpanded(!expanded)}
        className="fab-button h-10 px-4 flex items-center gap-2 bg-secondary text-secondary-foreground mb-2"
      >
        <Zap className="w-4 h-4 text-accent" />
        <span className="text-xs font-semibold">Ações Rápidas</span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          className="text-muted-foreground"
        >
          ▲
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass-panel p-2 min-w-[200px]"
          >
            {/* Header with edit toggle */}
            <div className="flex items-center justify-between px-2 pb-2 border-b border-border mb-2">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Atalhos Personalizados
              </span>
              <button
                onClick={() => { setEditing(!editing); setShowAdd(false); }}
                className={`p-1 rounded transition-colors ${
                  editing ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Settings className="w-3 h-3" />
              </button>
            </div>

            {/* Action buttons */}
            <div className="space-y-1">
              {actions.map((action) => {
                const Icon = iconMap[action.icon];
                return (
                  <motion.div
                    key={action.id}
                    layout
                    className="flex items-center gap-1"
                  >
                    {editing && (
                      <GripVertical className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    )}
                    <button
                      onClick={() => triggerAction(action)}
                      className={`flex-1 flex items-center gap-2 px-2.5 py-2 rounded-md text-left transition-all ${
                        editing
                          ? "bg-muted/50 cursor-default"
                          : "hover:bg-muted active:scale-[0.98]"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${action.color} text-primary-foreground flex-shrink-0`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{action.label}</p>
                        <p className="text-[9px] text-muted-foreground truncate">
                          {action.deviceName}
                        </p>
                      </div>
                    </button>
                    {editing && (
                      <button
                        onClick={() => removeAction(action.id)}
                        className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Add button */}
            {editing && (
              <div className="mt-2 pt-2 border-t border-border">
                {!showAdd ? (
                  <button
                    onClick={() => setShowAdd(true)}
                    className="w-full flex items-center justify-center gap-1 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Adicionar atalho
                  </button>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] text-muted-foreground">Selecione uma ação</span>
                      <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    {availableActions
                      .filter((a) => !actions.find((existing) => existing.label === a.label))
                      .map((action, i) => {
                        const Icon = iconMap[action.icon];
                        return (
                          <button
                            key={i}
                            onClick={() => addAction(action)}
                            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-muted transition-colors text-left"
                          >
                            <div className={`w-5 h-5 rounded flex items-center justify-center ${action.color} text-primary-foreground`}>
                              <Icon className="w-3 h-3" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-foreground truncate">{action.label}</p>
                              <p className="text-[9px] text-muted-foreground">{action.deviceName}</p>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
