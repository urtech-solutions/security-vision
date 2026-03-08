import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Filter, Pause, Play, Search } from "lucide-react";

type LogLevel = "event" | "warning" | "error" | "info";

interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  source: string;
  message: string;
}

const MOCK_SOURCES = ["Portão Principal", "Leitor Lobby", "Câmera LPR-01", "Leitor Garage", "Sensor Hall B", "Ctrl Elevador"];
const MOCK_MESSAGES: Record<LogLevel, string[]> = {
  event: ["Acesso autorizado - João Silva (CPF ***123)", "Veículo ABC-1234 reconhecido", "Portão aberto via comando remoto", "Visitante cadastrado - Maria Santos"],
  warning: ["Tentativa de acesso fora do horário", "Dispositivo com latência alta (>500ms)", "Bateria do leitor abaixo de 20%"],
  error: ["Acesso negado - credencial inválida", "Falha na comunicação com leitor", "Timeout na sincronização"],
  info: ["Sincronização concluída com central", "Novo dispositivo detectado na rede", "Backup local realizado"],
};

function generateLog(): LogEntry {
  const levels: LogLevel[] = ["event", "event", "event", "info", "info", "warning", "error"];
  const level = levels[Math.floor(Math.random() * levels.length)];
  const msgs = MOCK_MESSAGES[level];
  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    level,
    source: MOCK_SOURCES[Math.floor(Math.random() * MOCK_SOURCES.length)],
    message: msgs[Math.floor(Math.random() * msgs.length)],
  };
}

const levelColors: Record<LogLevel, string> = {
  event: "text-log-event",
  warning: "text-log-warning",
  error: "text-log-error",
  info: "text-log-info",
};

const levelBadge: Record<LogLevel, string> = {
  event: "bg-log-event/15 text-log-event",
  warning: "bg-log-warning/15 text-log-warning",
  error: "bg-log-error/15 text-log-error",
  info: "bg-log-info/15 text-log-info",
};

export default function LiveLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState<LogLevel | "all">("all");
  const [search, setSearch] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    // Initial batch
    const initial = Array.from({ length: 15 }, generateLog);
    setLogs(initial);

    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLog = generateLog();
        const updated = [...prev, newLog];
        return updated.slice(-200);
      });
    }, 1500 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [paused]);

  useEffect(() => {
    if (scrollRef.current && !paused) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, paused]);

  const filtered = logs.filter((l) => {
    if (filter !== "all" && l.level !== filter) return false;
    if (search && !l.message.toLowerCase().includes(search.toLowerCase()) && !l.source.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card/50">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Logs em Tempo Real</span>
          <span className="text-xs text-muted-foreground font-mono">({filtered.length})</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="h-7 w-32 pl-7 pr-2 text-xs bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as LogLevel | "all")}
            className="h-7 px-2 text-xs bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Todos</option>
            <option value="event">Eventos</option>
            <option value="warning">Alertas</option>
            <option value="error">Erros</option>
            <option value="info">Info</option>
          </select>
          <button
            onClick={() => setPaused(!paused)}
            className="h-7 w-7 flex items-center justify-center rounded-md bg-muted border border-border hover:bg-secondary transition-colors"
          >
            {paused ? <Play className="w-3 h-3 text-primary" /> : <Pause className="w-3 h-3 text-muted-foreground" />}
          </button>
        </div>
      </div>

      {/* Log entries */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
        <AnimatePresence initial={false}>
          {filtered.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="log-line flex items-start gap-2 border-b border-border/30 hover:bg-muted/30"
            >
              <span className="text-log-timestamp whitespace-nowrap shrink-0">
                {log.timestamp.toLocaleTimeString("pt-BR")}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase shrink-0 ${levelBadge[log.level]}`}>
                {log.level === "event" ? "EVT" : log.level === "warning" ? "WRN" : log.level === "error" ? "ERR" : "INF"}
              </span>
              <span className="text-muted-foreground shrink-0 w-28 truncate">{log.source}</span>
              <span className={`${levelColors[log.level]} truncate`}>{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
