import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { SelectEstado } from "./SelectEstado";

interface RegistroResiduo {
  id?: string;
  municipio: string;
  estado: string;
  residuos_total: string;
  residuos_domiciliares_e_publicos: string;
  ano: number;
}

type FormData = Omit<RegistroResiduo, "id">;

interface RegistroModalProps {
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  registroEditando?: RegistroResiduo | null; // Adicionado para suportar edição
}

const ANO_ATUAL = new Date().getFullYear();

const formInicial: FormData = {
  municipio: "",
  estado: "",
  residuos_total: "",
  residuos_domiciliares_e_publicos: "",
  ano: ANO_ATUAL,
};

export function RegistroModal({ onClose, onSubmit, registroEditando }: RegistroModalProps) {
  const [formData, setFormData] = useState<FormData>(formInicial);
  const [salvando, setSalvando] = useState(false);

  // Efeito para carregar os dados no formulário quando for edição
  useEffect(() => {
    if (registroEditando) {
      setFormData({
        municipio: registroEditando.municipio,
        estado: registroEditando.estado,
        residuos_total: registroEditando.residuos_total,
        residuos_domiciliares_e_publicos: registroEditando.residuos_domiciliares_e_publicos,
        ano: registroEditando.ano,
      });
    } else {
      setFormData(formInicial);
    }
  }, [registroEditando]);

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
          <h2>{registroEditando ? "Editar Registro" : "Registrar Dados"}</h2>
          <h5>{registroEditando && ("ID: " + registroEditando.id)}</h5>
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
              <label>Quantidade Gerada Total (ton)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.residuos_total}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    residuos_total:(e.target.value)
                  })
                }
                required
              />
            </div>
            <div className="form-field">
              <label>Residuos Domiciliares e Publicos</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.residuos_domiciliares_e_publicos}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    residuos_domiciliares_e_publicos:(e.target.value)
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
              max={ANO_ATUAL}
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