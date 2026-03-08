import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DoorOpen,
  Mic,
  UserPlus,
  AlertTriangle,
  Plus,
  X,
  Car,
  ShieldAlert,
  Radio,
} from "lucide-react";
import { toast } from "sonner";

interface FABMenuProps {
  onOpenVisitor: () => void;
  onOpenIncident: () => void;
  onOpenDevicePanel: (filterType?: string, title?: string) => void;
}

const actions = [
  { id: "gate-main", label: "Abrir Portão Principal", icon: DoorOpen, color: "bg-primary" },
  { id: "gate-vehicle", label: "Abrir Portão Veículos", icon: Car, color: "bg-status-info" },
  { id: "audio", label: "Intercomunicação", icon: Mic, color: "bg-accent" },
  { id: "devices", label: "Todos os Dispositivos", icon: Radio, color: "bg-secondary" },
  { id: "visitor", label: "Novo Visitante", icon: UserPlus, color: "bg-primary" },
  { id: "alert", label: "Alerta de Segurança", icon: ShieldAlert, color: "bg-destructive" },
  { id: "incident", label: "Registrar Incidente", icon: AlertTriangle, color: "bg-status-warning" },
];

export default function FABMenu({ onOpenVisitor, onOpenIncident, onOpenDevicePanel }: FABMenuProps) {
  const [open, setOpen] = useState(false);

  const handleAction = (id: string) => {
    setOpen(false);
    if (id === "visitor") {
      onOpenVisitor();
      return;
    }
    if (id === "incident") {
      onOpenIncident();
      return;
    }
    if (id === "gate-main") {
      onOpenDevicePanel("gate", "Portões");
      return;
    }
    if (id === "gate-vehicle") {
      onOpenDevicePanel("gate", "Portões de Veículos");
      return;
    }
    if (id === "audio") {
      onOpenDevicePanel("intercom", "Intercomunicação");
      return;
    }
    if (id === "devices") {
      onOpenDevicePanel(undefined, "Todos os Dispositivos");
      return;
    }
    if (id === "alert") {
      toast.error("🚨 Alerta de segurança acionado!");
      return;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col-reverse items-end gap-3">
      {/* Main FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className={`fab-button w-14 h-14 flex items-center justify-center ${
          open ? "bg-destructive" : "bg-primary"
        } text-primary-foreground transition-colors`}
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </motion.div>
      </motion.button>

      {/* Action buttons */}
      <AnimatePresence>
        {open &&
          actions.map((action, i) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              transition={{ duration: 0.15, delay: i * 0.04 }}
              className="flex items-center gap-2"
            >
              <span className="glass-panel px-3 py-1.5 text-xs font-medium text-foreground whitespace-nowrap">
                {action.label}
              </span>
              <button
                onClick={() => handleAction(action.id)}
                className={`fab-button w-11 h-11 flex items-center justify-center ${action.color} text-primary-foreground`}
              >
                <action.icon className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
