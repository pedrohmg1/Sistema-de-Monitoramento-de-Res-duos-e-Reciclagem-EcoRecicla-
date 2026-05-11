import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Search, PlusCircle, Leaf, Recycle, MapPin } from 'lucide-react';
import './App.css';

interface RegistroResiduo {
  id?: string;
  municipio: string;
  estado: string;
  quantidadeGerada: number;
  taxaReciclagem: number;
  ano: number;
}

const API_URL = "http://localhost:8080/api/residuos";

function App() {
  const [residuos, setResiduos] = useState<RegistroResiduo[]>([]);
  const [filtroUf, setFiltroUf] = useState("");
  const [novo, setNovo] = useState<RegistroResiduo>({
    municipio: '', estado: '', quantidadeGerada: 0, taxaReciclagem: 0, ano: 2026
  });

  useEffect(() => {
    fetchResiduos();
  }, []);

  const fetchResiduos = async () => {
    try {
      const res = await axios.get(API_URL);
      setResiduos(res.data);
    } catch (err) {
      console.error("Erro ao buscar dados", err);
    }
  };

  const handleFiltro = async () => {
    if (!filtroUf) return fetchResiduos();
    try {
      const res = await axios.get(`${API_URL}/estado/${filtroUf}`);
      setResiduos(res.data);
    } catch (err) {
      console.error("Erro ao filtrar", err);
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, novo);
      setNovo({ municipio: '', estado: '', quantidadeGerada: 0, taxaReciclagem: 0, ano: 2026 });
      fetchResiduos();
    } catch (err) {
      alert("Erro ao salvar registro");
    }
  };

  const handleDeletar = async (id: string) => {
    if (confirm("Deseja realmente excluir este registro?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchResiduos();
      } catch (err) {
        console.error("Erro ao deletar", err);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <header className="top-header">
        <div className="logo-area">
          <Leaf className="logo-icon" size={32} />
          <h1>Eco<span>Recicla</span></h1>
        </div>
        <p>Monitoramento Nacional de Resíduos</p>
      </header>

      <main className="main-content">
        {/* Painel Esquerdo: Formulário */}
        <section className="form-section panel-card">
          <div className="panel-header">
            <PlusCircle size={24} className="text-primary" />
            <h2>Novo Lançamento</h2>
          </div>
          <form onSubmit={handleSalvar} className="elegant-form">
            <div className="input-group">
              <label>Município</label>
              <input placeholder="Ex: São Paulo" value={novo.municipio} onChange={e => setNovo({...novo, municipio: e.target.value})} required />
            </div>
            
            <div className="form-row">
              <div className="input-group">
                <label>UF</label>
                <input placeholder="SP" maxLength={2} value={novo.estado} onChange={e => setNovo({...novo, estado: e.target.value.toUpperCase()})} required />
              </div>
              <div className="input-group">
                <label>Ano</label>
                <input type="number" value={novo.ano} onChange={e => setNovo({...novo, ano: Number(e.target.value)})} required />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Geração (t)</label>
                <input type="number" step="0.1" placeholder="Toneladas" value={novo.quantidadeGerada || ''} onChange={e => setNovo({...novo, quantidadeGerada: Number(e.target.value)})} required />
              </div>
              <div className="input-group">
                <label>Reciclagem (%)</label>
                <input type="number" step="0.1" placeholder="Taxa %" value={novo.taxaReciclagem || ''} onChange={e => setNovo({...novo, taxaReciclagem: Number(e.target.value)})} required />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Cadastrar Dados <Recycle size={18} />
            </button>
          </form>
        </section>

        {/* Painel Direito: Dashboard e Tabela */}
        <section className="data-section">
          
          <div className="search-widget panel-card">
            <Search className="text-muted" size={20} />
            <input 
              placeholder="Buscar histórico por estado (Ex: SP)..." 
              value={filtroUf} 
              onChange={e => setFiltroUf(e.target.value.toUpperCase())}
              onKeyUp={handleFiltro}
            />
          </div>

          <div className="table-widget panel-card">
            <div className="panel-header">
              <MapPin size={24} className="text-primary" />
              <h2>Dados Regionais</h2>
            </div>
            
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Localidade</th>
                    <th>Volume Gerado</th>
                    <th>Taxa de Reciclagem</th>
                    <th>Ano</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {residuos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="empty-state">Nenhum dado encontrado para o filtro atual.</td>
                    </tr>
                  ) : (
                    residuos.map(r => (
                      <tr key={r.id}>
                        <td className="fw-bold">{r.municipio} - <span className="badge-uf">{r.estado}</span></td>
                        <td>{r.quantidadeGerada} t</td>
                        <td>
                          <div className="progress-container">
                            <div className="progress-bar" style={{width: `${Math.min(r.taxaReciclagem, 100)}%`}}></div>
                            <span>{r.taxaReciclagem}%</span>
                          </div>
                        </td>
                        <td>{r.ano}</td>
                        <td>
                          <button onClick={() => handleDeletar(r.id!)} className="btn-icon" title="Excluir">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
