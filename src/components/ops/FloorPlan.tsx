import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import floorPlanImg from "@/assets/floor-plan.png";

type SensorStatus = "online" | "warning" | "danger" | "offline";
type SensorType = "reader" | "camera" | "gate" | "sensor";

interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  status: SensorStatus;
  x: number; // percentage
  y: number;
  lastEvent?: string;
}

const MOCK_SENSORS: Sensor[] = [
  { id: "s1", name: "Leitor Portaria", type: "reader", status: "online", x: 15, y: 45, lastEvent: "Acesso autorizado 12:34" },
  { id: "s2", name: "Câmera LPR-01", type: "camera", status: "online", x: 8, y: 72, lastEvent: "Placa ABC-1234 detectada" },
  { id: "s3", name: "Portão Veículos", type: "gate", status: "warning", x: 5, y: 65, lastEvent: "Manutenção pendente" },
  { id: "s4", name: "Leitor Lobby", type: "reader", status: "online", x: 42, y: 35, lastEvent: "Acesso autorizado 12:31" },
  { id: "s5", name: "Sensor Hall B", type: "sensor", status: "danger", x: 65, y: 50, lastEvent: "Porta forçada detectada!" },
  { id: "s6", name: "Leitor Elevador", type: "reader", status: "online", x: 55, y: 28, lastEvent: "Acesso autorizado 12:30" },
  { id: "s7", name: "Câmera Estac.", type: "camera", status: "offline", x: 85, y: 80, lastEvent: "Offline há 5min" },
  { id: "s8", name: "Portão Social", type: "gate", status: "online", x: 30, y: 12, lastEvent: "Operação normal" },
];

const typeIcons: Record<SensorType, string> = {
  reader: "🔐",
  camera: "📷",
  gate: "🚧",
  sensor: "📡",
};

export default function FloorPlan() {
  const [hoveredSensor, setHoveredSensor] = useState<string | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);

  const selected = MOCK_SENSORS.find((s) => s.id === selectedSensor);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {/* Floor plan image */}
      <img
        src={floorPlanImg}
        alt="Planta baixa"
        className="w-full h-full object-cover opacity-60"
      />

      {/* Overlay grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40" />

      {/* Sensors */}
      {MOCK_SENSORS.map((sensor) => (
        <div
          key={sensor.id}
          className="absolute group"
          style={{ left: `${sensor.x}%`, top: `${sensor.y}%`, transform: "translate(-50%, -50%)" }}
          onMouseEnter={() => setHoveredSensor(sensor.id)}
          onMouseLeave={() => setHoveredSensor(null)}
          onClick={() => setSelectedSensor(selectedSensor === sensor.id ? null : sensor.id)}
        >
          {/* Pulse ring for danger */}
          {sensor.status === "danger" && (
            <div className="absolute inset-0 -m-3 rounded-full bg-destructive/20 animate-ping" />
          )}

          <div className={`sensor-marker ${sensor.status} cursor-pointer w-5 h-5 flex items-center justify-center text-[10px] z-10 relative`}>
            {typeIcons[sensor.type]}
          </div>

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredSensor === sensor.id && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 glass-panel px-3 py-2 min-w-[180px] z-20"
              >
                <p className="text-xs font-semibold text-foreground">{sensor.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{sensor.lastEvent}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className={`w-2 h-2 rounded-full ${sensor.status === "online" ? "bg-status-online" : sensor.status === "warning" ? "bg-status-warning" : sensor.status === "danger" ? "bg-status-danger" : "bg-status-offline"}`} />
                  <span className="text-[10px] text-muted-foreground capitalize">{sensor.status}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Bottom status bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-4 px-3 py-2 bg-card/80 backdrop-blur-sm border-t border-border">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-status-online" />
          <span className="text-[10px] text-muted-foreground">{MOCK_SENSORS.filter(s => s.status === "online").length} Online</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-status-warning" />
          <span className="text-[10px] text-muted-foreground">{MOCK_SENSORS.filter(s => s.status === "warning").length} Alerta</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-status-danger" />
          <span className="text-[10px] text-muted-foreground">{MOCK_SENSORS.filter(s => s.status === "danger").length} Crítico</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-status-offline" />
          <span className="text-[10px] text-muted-foreground">{MOCK_SENSORS.filter(s => s.status === "offline").length} Offline</span>
        </div>
      </div>
    </div>
  );
}
