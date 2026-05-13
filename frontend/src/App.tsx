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
} from "lucide-react";
import { RegistroModal } from "./RegistroModal";
//import "./App.css";

// Interface agora alinhada ao modelo RegistroResiduo do backend
interface RegistroResiduo {
  id?: string;
  municipio: string;
  estado: string;
  quantidadeGerada: number; // toneladas
  taxaReciclagem: number; // percentual
  ano: number;
  unidades: number;
  nomeUnidade: string;
  tipoUnidade: string;
  operadorUnidade: string ;
}

const API_URL = "http://localhost:8080/api/residuos";

function App() {
  const [registros, setRegistros] = useState<RegistroResiduo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // --- Estados da Paginação ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10); // Novo estado para controlar o limite de exibição

  // Carrega os dados do backend ao iniciar
  useEffect(() => {
    carregarRegistros();
  }, []);

  // Reseta para a página 1 sempre que o usuário pesquisar algo novo ou alterar o limite
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itensPorPagina]);

  const carregarRegistros = async () => {
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
  };

  const handleCriarRegistro = async (data: Omit<RegistroResiduo, "id">) => {
    setErro(null);
    try {
      const resposta = await axios.post<RegistroResiduo>(API_URL, data);
      setRegistros([resposta.data, ...registros]);
      setIsModalOpen(false);
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
      
      // Ajuste: Se deletar o último item da página e ela não for a primeira, volta uma página
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

  // --- Lógica de Paginação ---
  const totalPages = Math.ceil(registrosFiltrados.length / itensPorPagina);
  const startIndex = (currentPage - 1) * itensPorPagina;
  // Fatiar a lista filtrada para exibir APENAS os itens da página atual
  const registrosPaginados = registrosFiltrados.slice(startIndex, startIndex + itensPorPagina);

  const gerarPaginas = () => {
    const maxVisiveis = 6;
    const paginas: (number | string)[] = [];

    if (totalPages <= maxVisiveis + 1) {
      for (let i = 1; i <= totalPages; i++) paginas.push(i);
    } else {
      let inicio = currentPage;
      let fim = currentPage + maxVisiveis - 1;

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
      {/* Sidebar */}
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
            <button onClick={() => setErro(null)}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Modal de Cadastro */}
        {isModalOpen && (
          <RegistroModal
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCriarRegistro}
          />
        )}

        {/* Listagem */}
        <section className="data-section">
          {/* Nova estrutura envolvendo a busca e o seletor de limite */}
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

            {/* Componente de seleção de itens por página */}
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
              <p
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "var(--text-muted)",
                }}
              >
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
                    {/* Alteração crucial: Mapeando apenas a lista paginada */}
                    {registrosPaginados.map((reg) => (
                      <tr key={reg.id}>
                        <td>
                          <strong>{reg.municipio}</strong>
                        </td>
                        <td>
                          <span className="badge-unit">{reg.estado}</span>
                        </td>
                        <td>
                          {(reg.quantidadeGerada ?? 0).toLocaleString("pt-BR")}
                        </td>
                        <td>{(reg.taxaReciclagem ?? 0).toFixed(1)}%</td>
                        <td>{reg.ano}</td>
                        <td className="text-center">
                          <button
                            className="btn-delete"
                            onClick={() => deleteRegistro(reg.id)}
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

                {/* Controles de Paginação inseridos logo após a tabela */}
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
                          className={`btn-page-number ${
                            currentPage === pagina ? "active" : ""
                          } ${pagina === "..." ? "dots" : ""}`}
                          onClick={() =>
                            typeof pagina === "number" && setCurrentPage(pagina)
                          }
                          disabled={pagina === "..."}
                        >
                          {pagina}
                        </button>
                      ))}
                    </div>

                    <button
                      className="btn-page-arrow"
                       style={{ padding: '8px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
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