import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Search, PlusCircle, Recycle, X, BarChart3 } from 'lucide-react';
import './App.css';

// Interface agora alinhada ao modelo RegistroResiduo do backend
interface RegistroResiduo {
  id?: string;
  municipio: string;
  estado: string;
  quantidadeGerada: number; // toneladas
  taxaReciclagem: number;   // percentual
  ano: number;
}

const API_URL = "http://localhost:8080/api/residuos";

const formInicial: Omit<RegistroResiduo, 'id'> = {
  municipio: '',
  estado: '',
  quantidadeGerada: 0,
  taxaReciclagem: 0,
  ano: new Date().getFullYear(),
};

function App() {
  const [registros, setRegistros] = useState<RegistroResiduo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<RegistroResiduo, 'id'>>(formInicial);

  // Carrega os dados do backend ao iniciar
  useEffect(() => {
    carregarRegistros();
  }, []);

  const carregarRegistros = async () => {
    setLoading(true);
    setErro(null);
    try {
      const resposta = await axios.get<RegistroResiduo[]>(API_URL);
      setRegistros(resposta.data);
    } catch {
      setErro('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    try {
      const resposta = await axios.post<RegistroResiduo>(API_URL, formData);
      setRegistros([resposta.data, ...registros]);
      setIsModalOpen(false);
      setFormData(formInicial);
    } catch {
      setErro('Erro ao salvar o registro. Tente novamente.');
    }
  };

  const deleteRegistro = async (id?: string) => {
    if (!id) return;
    setErro(null);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setRegistros(registros.filter(r => r.id !== id));
    } catch {
      setErro('Erro ao deletar o registro.');
    }
  };

  const registrosFiltrados = registros.filter(r =>
    (r.municipio ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.estado ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Recycle size={28} className="logo-icon" />
          <span>EcoRecicla</span>
        </div>
        <nav className="sidebar-menu">
          <a href="#" className="menu-item active"><BarChart3 size={20} /> Dashboard</a>
        </nav>
      </aside>

      {/* Área Principal */}
      <main className="main-content">
        <header className="content-header">
          <div className="header-title">
            <h1>Gestão de Resíduos</h1>
            <p>Monitore e registre dados de reciclagem por município.</p>
          </div>
          <button className="btn-new" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={20} /> Novo Cadastro
          </button>
        </header>

        {/* Mensagem de erro */}
        {erro && (
          <div className="alert-erro">
            {erro}
            <button onClick={() => setErro(null)}><X size={16} /></button>
          </div>
        )}

        {/* Modal de Cadastro */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>Registrar Dados</h2>
                <button className="btn-close" onClick={() => setIsModalOpen(false)}>
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
                      onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Estado (UF)</label>
                    <input
                      type="text"
                      placeholder="Ex: SP"
                      maxLength={2}
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value.toUpperCase() })}
                      required
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
                      onChange={(e) => setFormData({ ...formData, quantidadeGerada: parseFloat(e.target.value) || 0 })}
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
                      onChange={(e) => setFormData({ ...formData, taxaReciclagem: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label>Ano</label>
                  <input
                    type="number"
                    min="2000"
                    max={new Date().getFullYear()}
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value, 10) || new Date().getFullYear() })}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-save">
                    Salvar Registro
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Listagem */}
        <section className="data-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Pesquisar por município ou estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-container">
            {loading ? (
              <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Carregando dados...</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Município</th>
                    <th>Estado</th>
                    <th>Qtd. Gerada (ton)</th>
                    <th>Taxa Reciclagem (%)</th>
                    <th>Ano</th>
                    <th className="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {registrosFiltrados.map((reg) => (
                    <tr key={reg.id}>
                      <td><strong>{reg.municipio}</strong></td>
                      <td><span className="badge-unit">{reg.estado}</span></td>
                      <td>{(reg.quantidadeGerada ?? 0).toLocaleString('pt-BR')}</td>
                      <td>{(reg.taxaReciclagem ?? 0).toFixed(1)}%</td>
                      <td>{reg.ano}</td>
                      <td className="text-center">
                        <button className="btn-delete" onClick={() => deleteRegistro(reg.id)}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {registrosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan={6} className="empty-state-cell">
                        Nenhum registro encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;