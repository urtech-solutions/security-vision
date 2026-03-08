import {
  LayoutDashboard,
  Users,
  Shield,
  HardDrive,
  Map,
  Bell,
  Settings,
  LogOut,
  Wifi,
  WifiOff,
  Radio,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "access", icon: Shield, label: "Acessos" },
  { id: "visitors", icon: Users, label: "Visitantes" },
  { id: "devices", icon: HardDrive, label: "Dispositivos" },
  { id: "floorplan", icon: Map, label: "Planta" },
  { id: "alerts", icon: Bell, label: "Alertas", badge: 3 },
];

interface OpsSidebarProps {
  active: string;
  onNavigate: (id: string) => void;
}

export default function OpsSidebar({ active, onNavigate }: OpsSidebarProps) {
  const [connected] = useState(true);

  return (
    <div className="w-16 h-full bg-sidebar border-r border-sidebar-border flex flex-col items-center py-3 gap-1">
      {/* Logo */}
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        <Radio className="w-5 h-5 text-primary" />
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col items-center gap-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors group ${
              active === item.id
                ? "bg-sidebar-accent text-sidebar-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
            title={item.label}
          >
            <item.icon className="w-5 h-5" />
            {item.badge && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {item.badge}
              </span>
            )}
            {/* Tooltip */}
            <span className="absolute left-full ml-2 px-2 py-1 rounded-md bg-popover text-popover-foreground text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg border border-border">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${connected ? "bg-status-online status-pulse" : "bg-status-danger"}`} title={connected ? "Central conectada" : "Modo local"} />
        <button className="w-10 h-10 rounded-lg flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-accent transition-colors" title="Configurações">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
