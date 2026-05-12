import { useState } from "react";
import { X } from "lucide-react";
import { SelectEstado } from "./SelectEstado";

interface RegistroResiduo {
  id?: string;
  municipio: string;
  estado: string;
  quantidadeGerada: number;
  taxaReciclagem: number;
  ano: number;
}

type FormData = Omit<RegistroResiduo, "id">;

interface RegistroModalProps {
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}

// Calculado UMA vez, fora do componente — não recria a cada render
const ANO_ATUAL = new Date().getFullYear();

const formInicial: FormData = {
  municipio: "",
  estado: "",
  quantidadeGerada: 0,
  taxaReciclagem: 0,
  ano: ANO_ATUAL,
};

export function RegistroModal({ onClose, onSubmit }: RegistroModalProps) {
  // ✅ Estado local: mudanças aqui só re-renderizam ESTE componente
  const [formData, setFormData] = useState<FormData>(formInicial);
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await onSubmit(formData);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Registrar Dados</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label>Município</label>
              <input
                type="text"
                placeholder="Ex: São Paulo"
                value={formData.municipio}
                onChange={(e) =>
                  setFormData({ ...formData, municipio: e.target.value })
                }
                required
              />
            </div>
            <div className="form-field">
              <label>Estado (UF)</label>
              <SelectEstado
                value={formData.estado}
                onChange={(valor) =>
                  setFormData({ ...formData, estado: valor })
                }
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Quantidade Gerada (ton)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.quantidadeGerada}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantidadeGerada: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
            <div className="form-field">
              <label>Taxa de Reciclagem (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.taxaReciclagem}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    taxaReciclagem: parseFloat(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
          </div>
          <div className="form-field">
            <label>Ano</label>
            <input
              type="number"
              min="2000"
              max={ANO_ATUAL} // ✅ Constante, não recria Date a cada render
              value={formData.ano}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ano: parseInt(e.target.value, 10) || ANO_ATUAL,
                })
              }
              required
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={salvando}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar Registro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}