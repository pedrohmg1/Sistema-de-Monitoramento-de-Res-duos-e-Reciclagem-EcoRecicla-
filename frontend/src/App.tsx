import { useState, useEffect } from "react";
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

interface RegistroResiduo {
  id?: string;
  municipio: string;
  estado: string;
  residuos_total: number;
  residuos_domiciliares_e_publicos: number;
  ano: number;
}

const API_URL = "http://localhost:8080/api/residuos";

function App() {
  const [registros, setRegistros] = useState<RegistroResiduo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [selectedEstado, setSelectedEstado] = useState(""); 
  const [registroEditando, setRegistroEditando] = useState<RegistroResiduo | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Carrega os dados do backend
  const carregarRegistros = async () => {
    setLoading(true);
    setErro(null);
    try {
      const resposta = await axios.get(
        `${API_URL}?termo=${searchTerm}&estado=${selectedEstado}&page=${currentPage - 1}&size=${itensPorPagina}`
      );
      setRegistros(resposta.data.content);
      setTotalPages(resposta.data.totalPages);
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  // Refaz a busca sempre que esses valores mudarem
  useEffect(() => {
    carregarRegistros();
  }, [currentPage, itensPorPagina, searchTerm, selectedEstado]);

  // Volta para a página 1 sempre que um filtro mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itensPorPagina, selectedEstado]);

  const abrirModalNovo = () => {
    setRegistroEditando(null);
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setRegistroEditando(null);
  };

  const abrirModalEdicao = (registro: RegistroResiduo) => {
    setRegistroEditando(registro);
    setIsModalOpen(true);
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
      carregarRegistros(); 
    } catch {
      setErro("Erro ao deletar o registro.");
    }
  };

  const gerarPaginas = () => {
    const maxVisiveis = 5; // Quantidade de páginas que aparecem no bloco central
    const paginas: (number | string)[] = [];

    // Se tiver poucas páginas, mostra todas
    if (totalPages <= maxVisiveis + 2) {
      for (let i = 1; i <= totalPages; i++) paginas.push(i);
    } else {
      // Define o início e fim da "janela" que acompanha a página atual
      let inicio = Math.max(1, currentPage - 2);
      let fim = Math.min(totalPages, currentPage + 2);

      // Ajustes para quando estiver muito no começo ou muito no final
      if (currentPage <= 3) {
        fim = maxVisiveis;
      } else if (currentPage >= totalPages - 2) {
        inicio = totalPages - maxVisiveis + 1;
      }

      // 1. LÓGICA NOVA: Adiciona a página 1 e reticências se o bloco central estiver longe do início
      if (inicio > 1) {
        paginas.push(1);
        if (inicio > 2) {
          paginas.push('...');
        }
      }

      // 2. Adiciona as páginas do meio
      for (let i = inicio; i <= fim; i++) {
        paginas.push(i);
      }

      // 3. Adiciona as reticências e a última página se o bloco central estiver longe do fim
      if (fim < totalPages) {
        if (fim < totalPages - 1) {
          paginas.push('...');
        }
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
            <p className="italic-faded">Fonte dos dados desse banco (SNIS): <a href="https://app4.cidades.gov.br/serieHistorica/">https://app4.cidades.gov.br/serieHistorica/</a></p>
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
            
            <div style={{ display: 'flex', gap: '1rem', flex: '1 1 300px' }}>
              <div className="search-bar" style={{ margin: 0, flex: 1 }}>
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Pesquisar por município...."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Novo Filtro de Estado */}
              <select
                value={selectedEstado}
                onChange={(e) => setSelectedEstado(e.target.value)}
                style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', outline: 'none', cursor: 'pointer', backgroundColor: 'white' }}
              >
                <option value="">Todos os Estados</option>
                <option value="AC">Acre (AC)</option>
                <option value="AL">Alagoas (AL)</option>
                <option value="AP">Amapá (AP)</option>
                <option value="AM">Amazonas (AM)</option>
                <option value="BA">Bahia (BA)</option>
                <option value="CE">Ceará (CE)</option>
                <option value="DF">Distrito Federal (DF)</option>
                <option value="ES">Espírito Santo (ES)</option>
                <option value="GO">Goiás (GO)</option>
                <option value="MA">Maranhão (MA)</option>
                <option value="MT">Mato Grosso (MT)</option>
                <option value="MS">Mato Grosso do Sul (MS)</option>
                <option value="MG">Minas Gerais (MG)</option>
                <option value="PA">Pará (PA)</option>
                <option value="PB">Paraíba (PB)</option>
                <option value="PR">Paraná (PR)</option>
                <option value="PE">Pernambuco (PE)</option>
                <option value="PI">Piauí (PI)</option>
                <option value="RJ">Rio de Janeiro (RJ)</option>
                <option value="RN">Rio Grande do Norte (RN)</option>
                <option value="RS">Rio Grande do Sul (RS)</option>
                <option value="RO">Rondônia (RO)</option>
                <option value="RR">Roraima (RR)</option>
                <option value="SC">Santa Catarina (SC)</option>
                <option value="SP">São Paulo (SP)</option>
                <option value="SE">Sergipe (SE)</option>
                <option value="TO">Tocantins (TO)</option>
              </select>
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
                {/* Adicione style={{ width: '100%', tableLayout: 'fixed' }} na tabela */}
                <table className="data-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                  <thead>
                    <tr>
                      {/* Defina a porcentagem de espaço que cada coluna vai ocupar */}
                      <th style={{ width: '25%' }}>Município</th>
                      <th style={{ width: '10%' }}>Estado</th>
                      <th style={{ width: '20%' }}>Qtd. Gerada Total(ton)</th>
                      <th style={{ width: '25%' }}>Residuos domiciliares e publicos</th>
                      <th style={{ width: '10%' }}>Ano</th>
                      <th className="text-center" style={{ width: '10%' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registros.map((reg) => (
                      <tr key={reg.id}>
                        <td><strong>{reg.municipio}</strong></td>
                        <td><span className="badge-unit">{reg.estado}</span></td>
                        <td>{reg.residuos_total}</td>
                        <td>{reg.residuos_domiciliares_e_publicos}</td>
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
                    {registros.length === 0 && (
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