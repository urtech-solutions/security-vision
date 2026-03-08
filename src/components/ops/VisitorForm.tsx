import { useState } from "react";
import { UserPlus, Camera, Car, Clock, Building, Check } from "lucide-react";
import { toast } from "sonner";

export default function VisitorForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    document: "",
    phone: "",
    plate: "",
    destination: "",
    host: "",
    reason: "",
    photoTaken: false,
  });

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    toast.success(`Visitante ${form.name} cadastrado com sucesso!`);
    setForm({ name: "", document: "", phone: "", plate: "", destination: "", host: "", reason: "", photoTaken: false });
    setStep(1);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Steps indicator */}
      <div className="flex items-center gap-1 px-4 pt-3 pb-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {step > s ? <Check className="w-3 h-3" /> : s}
            </div>
            {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {step === 1 && (
          <>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Dados do Visitante</p>
            <div className="space-y-2">
              <input
                placeholder="Nome completo *"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full h-9 px-3 text-sm bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex gap-2">
                <input
                  placeholder="CPF / RG *"
                  value={form.document}
                  onChange={(e) => update("document", e.target.value)}
                  className="flex-1 h-9 px-3 text-sm bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <input
                  placeholder="Telefone"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="flex-1 h-9 px-3 text-sm bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                onClick={() => update("photoTaken", true)}
                className={`w-full h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 transition-colors ${
                  form.photoTaken
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <Camera className="w-5 h-5" />
                <span className="text-xs">{form.photoTaken ? "Foto capturada ✓" : "Capturar foto"}</span>
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Destino e Veículo</p>
            <div className="space-y-2">
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  placeholder="Unidade / Destino *"
                  value={form.destination}
                  onChange={(e) => update("destination", e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-sm bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <input
                placeholder="Nome do morador / responsável *"
                value={form.host}
                onChange={(e) => update("host", e.target.value)}
                className="w-full h-9 px-3 text-sm bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  placeholder="Placa do veículo (opcional)"
                  value={form.plate}
                  onChange={(e) => update("plate", e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-sm bg-muted border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <select
                value={form.reason}
                onChange={(e) => update("reason", e.target.value)}
                className="w-full h-9 px-3 text-sm bg-muted border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Motivo da visita</option>
                <option value="visita">Visita pessoal</option>
                <option value="entrega">Entrega</option>
                <option value="servico">Prestação de serviço</option>
                <option value="obra">Obra / Manutenção</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Confirmação</p>
            <div className="space-y-2 bg-muted/50 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nome</span>
                <span className="text-foreground font-medium">{form.name || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Documento</span>
                <span className="text-foreground font-medium">{form.document || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Destino</span>
                <span className="text-foreground font-medium">{form.destination || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Responsável</span>
                <span className="text-foreground font-medium">{form.host || "—"}</span>
              </div>
              {form.plate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Placa</span>
                  <span className="text-foreground font-medium">{form.plate}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Foto</span>
                <span className={`font-medium ${form.photoTaken ? "text-primary" : "text-status-warning"}`}>
                  {form.photoTaken ? "Capturada ✓" : "Não capturada"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex-1 h-9 text-sm font-medium rounded-md border border-border bg-muted text-foreground hover:bg-secondary transition-colors"
          >
            Voltar
          </button>
        )}
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex-1 h-9 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Próximo
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex-1 h-9 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Registrar Visitante
          </button>
        )}
      </div>
    </div>
  );
}
