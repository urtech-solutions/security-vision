import { useState } from "react";
import { motion } from "framer-motion";
import {
  DoorOpen,
  Mic,
  MicOff,
  Volume2,
  Camera,
  Lock,
  Unlock,
  Power,
  Signal,
  SignalZero,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

type DeviceType = "reader" | "camera" | "gate" | "intercom";

interface Device {
  id: string;
  name: string;
  type: DeviceType;
  location: string;
  status: "online" | "offline" | "warning";
  ports: { id: string; name: string; state: "locked" | "unlocked" }[];
}

const mockDevices: Device[] = [
  {
    id: "d1",
    name: "Leitor Biométrico - Entrada Principal",
    type: "reader",
    location: "Portaria Principal",
    status: "online",
    ports: [
      { id: "p1", name: "Porta 1 - Entrada", state: "locked" },
      { id: "p2", name: "Porta 2 - Saída", state: "locked" },
    ],
  },
  {
    id: "d2",
    name: "ControlID iDFlex",
    type: "reader",
    location: "Bloco A - Térreo",
    status: "online",
    ports: [
      { id: "p3", name: "Porta Principal", state: "locked" },
    ],
  },
  {
    id: "d3",
    name: "Câmera LPR - Garagem",
    type: "camera",
    location: "Estacionamento",
    status: "online",
    ports: [
      { id: "p4", name: "Cancela Entrada", state: "locked" },
      { id: "p5", name: "Cancela Saída", state: "locked" },
    ],
  },
  {
    id: "d4",
    name: "Portão Veículos",
    type: "gate",
    location: "Entrada Veículos",
    status: "online",
    ports: [
      { id: "p6", name: "Motor Principal", state: "locked" },
    ],
  },
  {
    id: "d5",
    name: "Intercomunicador - Guarita",
    type: "intercom",
    location: "Guarita Principal",
    status: "online",
    ports: [
      { id: "p7", name: "Canal Áudio 1", state: "locked" },
      { id: "p8", name: "Canal Áudio 2", state: "locked" },
    ],
  },
  {
    id: "d6",
    name: "Leitor Facial - Bloco B",
    type: "reader",
    location: "Bloco B - Hall",
    status: "offline",
    ports: [
      { id: "p9", name: "Porta Hall", state: "locked" },
    ],
  },
];

const typeIcons: Record<DeviceType, typeof DoorOpen> = {
  reader: Lock,
  camera: Camera,
  gate: DoorOpen,
  intercom: Mic,
};

const typeLabels: Record<DeviceType, string> = {
  reader: "Leitor",
  camera: "Câmera",
  gate: "Portão",
  intercom: "Intercom",
};

interface DeviceControlPanelProps {
  filterType?: DeviceType;
  title?: string;
}

export default function DeviceControlPanel({ filterType, title }: DeviceControlPanelProps) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [portStates, setPortStates] = useState<Record<string, "locked" | "unlocked">>({});
  const [audioActive, setAudioActive] = useState<string | null>(null);

  const devices = filterType
    ? mockDevices.filter((d) => d.type === filterType)
    : mockDevices;

  const getPortState = (portId: string, defaultState: "locked" | "unlocked") =>
    portStates[portId] ?? defaultState;

  const togglePort = (device: Device, port: Device["ports"][0]) => {
    const current = getPortState(port.id, port.state);
    const next = current === "locked" ? "unlocked" : "locked";
    setPortStates((prev) => ({ ...prev, [port.id]: next }));
    toast.success(
      `${device.name} → ${port.name}: ${next === "unlocked" ? "🔓 Aberta" : "🔒 Fechada"}`
    );
  };

  const toggleAudio = (deviceId: string, deviceName: string) => {
    if (audioActive === deviceId) {
      setAudioActive(null);
      toast.info(`Áudio encerrado: ${deviceName}`);
    } else {
      setAudioActive(deviceId);
      toast.success(`🎙️ Intercomunicação ativa: ${deviceName}`);
    }
  };

  if (selectedDevice) {
    return (
      <div className="p-3 space-y-3">
        <button
          onClick={() => setSelectedDevice(null)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Voltar aos dispositivos
        </button>

        <div className="flex items-center gap-2">
          {(() => {
            const Icon = typeIcons[selectedDevice.type];
            return <Icon className="w-4 h-4 text-primary" />;
          })()}
          <span className="text-sm font-semibold text-foreground">{selectedDevice.name}</span>
          <span
            className={`ml-auto w-2 h-2 rounded-full ${
              selectedDevice.status === "online"
                ? "bg-primary"
                : selectedDevice.status === "warning"
                ? "bg-accent"
                : "bg-muted-foreground"
            }`}
          />
        </div>

        <p className="text-xs text-muted-foreground">{selectedDevice.location}</p>

        {/* Audio controls for intercoms and readers */}
        {(selectedDevice.type === "intercom" || selectedDevice.type === "reader") && (
          <div className="glass-panel p-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Intercomunicação
            </p>
            <button
              onClick={() => toggleAudio(selectedDevice.id, selectedDevice.name)}
              className={`w-full h-10 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                audioActive === selectedDevice.id
                  ? "bg-destructive text-destructive-foreground animate-pulse"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {audioActive === selectedDevice.id ? (
                <>
                  <MicOff className="w-4 h-4" />
                  Encerrar Áudio
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Iniciar Áudio
                </>
              )}
            </button>
            {audioActive === selectedDevice.id && (
              <div className="flex items-center gap-2 px-2">
                <Volume2 className="w-3 h-3 text-primary animate-pulse" />
                <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{ width: ["20%", "80%", "40%", "90%", "30%"] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ports / relay controls */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Portas / Relés
          </p>
          {selectedDevice.ports.map((port) => {
            const state = getPortState(port.id, port.state);
            return (
              <div
                key={port.id}
                className="flex items-center justify-between glass-panel px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  {state === "unlocked" ? (
                    <Unlock className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                  <span className="text-xs text-foreground">{port.name}</span>
                </div>
                <button
                  onClick={() => togglePort(selectedDevice, port)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    state === "unlocked"
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {state === "unlocked" ? "Fechar" : "Abrir"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Device info */}
        <div className="glass-panel p-3 space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Informações
          </p>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Tipo</span>
            <span className="text-foreground">{typeLabels[selectedDevice.type]}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Status</span>
            <span
              className={
                selectedDevice.status === "online"
                  ? "text-primary"
                  : selectedDevice.status === "warning"
                  ? "text-accent"
                  : "text-muted-foreground"
              }
            >
              {selectedDevice.status === "online"
                ? "Online"
                : selectedDevice.status === "warning"
                ? "Alerta"
                : "Offline"}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Local</span>
            <span className="text-foreground">{selectedDevice.location}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      {title && (
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {title}
        </p>
      )}
      {devices.map((device) => {
        const Icon = typeIcons[device.type];
        return (
          <button
            key={device.id}
            onClick={() =>
              device.status !== "offline"
                ? setSelectedDevice(device)
                : toast.error(`${device.name} está offline`)
            }
            className={`w-full flex items-center gap-3 glass-panel px-3 py-2.5 text-left transition-all hover:border-primary/30 ${
              device.status === "offline" ? "opacity-50" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-md flex items-center justify-center ${
                device.status === "online"
                  ? "bg-primary/15 text-primary"
                  : device.status === "warning"
                  ? "bg-accent/15 text-accent"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{device.name}</p>
              <p className="text-[10px] text-muted-foreground">{device.location}</p>
            </div>
            <div className="flex items-center gap-2">
              {device.status === "online" ? (
                <Signal className="w-3 h-3 text-primary" />
              ) : device.status === "offline" ? (
                <SignalZero className="w-3 h-3 text-muted-foreground" />
              ) : (
                <Power className="w-3 h-3 text-accent" />
              )}
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
