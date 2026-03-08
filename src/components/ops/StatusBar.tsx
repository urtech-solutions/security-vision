import { Wifi, Clock, Shield, Users, HardDrive } from "lucide-react";
import { useEffect, useState } from "react";

export default function StatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 bg-card/80 border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3 h-3 text-status-online" />
          <span className="text-[10px] text-muted-foreground font-mono">CENTRAL CONECTADA</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-primary" />
          <span className="text-[10px] text-muted-foreground font-mono">TENANT: CONDOMÍNIO ALPHA</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <HardDrive className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground font-mono">8 DISPOSITIVOS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground font-mono">3 VISITANTES ATIVOS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] text-foreground font-mono font-semibold">
            {time.toLocaleTimeString("pt-BR")}
          </span>
        </div>
      </div>
    </div>
  );
}
