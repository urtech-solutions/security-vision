import { motion } from "framer-motion";
import { DoorOpen, Users, AlertTriangle, ShieldCheck } from "lucide-react";

const stats = [
  { label: "Acessos Hoje", value: "247", icon: DoorOpen, trend: "+12%", color: "text-primary" },
  { label: "Visitantes Ativos", value: "3", icon: Users, trend: "", color: "text-status-info" },
  { label: "Alertas", value: "2", icon: AlertTriangle, trend: "", color: "text-status-warning" },
  { label: "Dispositivos OK", value: "7/8", icon: ShieldCheck, trend: "", color: "text-primary" },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-panel p-3 flex items-center gap-3"
        >
          <div className={`w-9 h-9 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
            <stat.icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground leading-tight">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
          {stat.trend && (
            <span className="text-[10px] text-primary font-semibold ml-auto">{stat.trend}</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
