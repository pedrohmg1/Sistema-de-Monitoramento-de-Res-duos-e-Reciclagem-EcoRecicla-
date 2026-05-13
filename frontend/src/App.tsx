import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Trash2,
  Search,
  PlusCircle,
  Recycle,
  X,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Edit2,
} from "lucide-react";
import { RegistroModal } from "./RegistroModal";

// CORREÇÃO: Campos novos marcados com '?' (opcionais) para evitar erro de tipagem no Modal
interface RegistroResiduo {
  id?: string;
  municipio: string;
  estado: string;
  quantidadeGerada: number;
  taxaReciclagem: number;
  ano: number;
  unidades?: number;        // Opcional
  nomeUnidade?: string;     // Opcional
  tipoUnidade?: string;     // Opcional
  operadorUnidade?: string; // Opcional
}

const API_URL = "http://localhost:8080/api/residuos";

function App() {
  const [registros, setRegistros] = useState<RegistroResiduo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [registroEditando, setRegistroEditando] = useState<RegistroResiduo | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);

  // CORREÇÃO: Função carregarRegistros definida antes de ser usada nos Effects
  async function carregarRegistros() {
    setLoading(true);
    setErro(null);
    try {
      const resposta = await axios.get<RegistroResiduo[]>(API_URL);
      setRegistros(resposta.data);
    } catch {
      setErro(
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarRegistros();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itensPorPagina]);

  const abrirModalNovo = () => {
    setRegistroEditando(null);
    setIsModalOpen(true);
  };

  const abrirModalEdicao = (registro: RegistroResiduo) => {
    setRegistroEditando(registro);
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setRegistroEditando(null);
  };

  const handleSalvarRegistro = async (data: Omit<RegistroResiduo, "id">) => {
    setErro(null);
    try {
      if (registroEditando && registroEditando.id) {
        // ATUALIZAR (PUT)
        const resposta = await axios.put<RegistroResiduo>(`${API_URL}/${registroEditando.id}`, data);
        setRegistros(registros.map((r) => r.id === registroEditando.id ? resposta.data : r));
      } else {
        // CRIAR (POST)
        const resposta = await axios.post<RegistroResiduo>(API_URL, data);
        setRegistros([resposta.data, ...registros]);
      }
      fecharModal();
    } catch (error) {
      setErro("Erro ao salvar o registro. Tente novamente.");
      throw error;
    }
  };

  const deleteRegistro = async (id?: string) => {
    if (!id) return;
    setErro(null);
    try {
      await axios.delete(`${API_URL}/${id}`);
      setRegistros(registros.filter((r) => r.id !== id));
      
      if (registrosPaginados.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch {
      setErro("Erro ao deletar o registro.");
    }
  };

  const registrosFiltrados = useMemo(() => {
    return registros.filter(r =>
      (r.municipio ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.estado ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [registros, searchTerm]);

  const totalPages = Math.ceil(registrosFiltrados.length / itensPorPagina);
  const startIndex = (currentPage - 1) * itensPorPagina;
  const registrosPaginados = registrosFiltrados.slice(startIndex, startIndex + itensPorPagina);

  const gerarPaginas = () => {
    const maxVisiveis = 6;
    const paginas: (number | string)[] = [];

    if (totalPages <= maxVisiveis + 1) {
      for (let i = 1; i <= totalPages; i++) paginas.push(i);
    } else {
      let inicio = currentPage;
      const fim = currentPage + maxVisiveis - 1;

      if (fim >= totalPages - 1) {
        inicio = totalPages - maxVisiveis;
        for (let i = inicio; i <= totalPages; i++) paginas.push(i);
      } else {
        for (let i = inicio; i <= fim; i++) paginas.push(i);
        paginas.push('...');
        paginas.push(totalPages);
      }
    }
    return paginas;
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Recycle size={28} className="logo-icon" />
          <span>EcoRecicla</span>
        </div>
        <nav className="sidebar-menu">
          <a href="#" className="menu-item active">
            <BarChart3 size={20} /> Dashboard
          </a>
        </nav>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <div className="header-title">
            <h1>Gestão de Resíduos</h1>
            <p>Monitore e registre dados de reciclagem por município.</p>
          </div>
          <button className="btn-new" onClick={abrirModalNovo}>
            <PlusCircle size={20} /> Novo Cadastro
          </button>
        </header>

        {erro && (
          <div className="alert-erro">
            {erro}
            <button onClick={() => setErro(null)}>
              <X size={16} />
            </button>
          </div>
        )}

        {isModalOpen && (
          <RegistroModal
            onClose={fecharModal}
            onSubmit={handleSalvarRegistro}
            registroEditando={registroEditando}
          />
        )}

        <section className="data-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="search-bar" style={{ margin: 0, flex: '1 1 300px' }}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Pesquisar por município ou estado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label htmlFor="limitePagina" style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
                Registros por página:
              </label>
              <select
                id="limitePagina"
                value={itensPorPagina}
                onChange={(e) => setItensPorPagina(Number(e.target.value))}
                style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: 'white', outline: 'none', cursor: 'pointer' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                Carregando dados...
              </p>
            ) : (
              <>
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
                    {registrosPaginados.map((reg) => (
                      <tr key={reg.id}>
                        <td><strong>{reg.municipio}</strong></td>
                        <td><span className="badge-unit">{reg.estado}</span></td>
                        <td>{(reg.quantidadeGerada ?? 0).toLocaleString("pt-BR")}</td>
                        <td>{(reg.taxaReciclagem ?? 0).toFixed(1)}%</td>
                        <td>{reg.ano}</td>
                        <td className="text-center">
                          <button
                            className="btn-edit"
                            onClick={() => abrirModalEdicao(reg)}
                            style={{ marginRight: '8px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => deleteRegistro(reg.id)}
                            title="Excluir"
                          >
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

                {totalPages > 1 && (
                  <div className="pagination-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1.5rem 0', marginTop: '1rem' }}>
                    <button
                      className="btn-page-arrow"
                      style={{ padding: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className="pagination-numbers" style={{ display: 'flex', gap: '0.25rem' }}>
                      {gerarPaginas().map((pagina, index) => (
                        <button
                          key={index}
                          style={{
                            minWidth: '36px', height: '36px', border: pagina === '...' ? 'none' : '1px solid #cbd5e1',
                            backgroundColor: currentPage === pagina ? '#10b981' : (pagina === '...' ? 'transparent' : 'white'),
                            color: currentPage === pagina ? 'white' : '#334155', borderRadius: '6px', cursor: pagina === '...' ? 'default' : 'pointer'
                          }}
                          onClick={() => typeof pagina === "number" && setCurrentPage(pagina)}
                          disabled={pagina === "..."}
                        >
                          {pagina}
                        </button>
                      ))}
                    </div>

                    <button
                      className="btn-page-arrow"
                      style={{ padding: '8px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;