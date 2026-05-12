import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Search, PlusCircle, Recycle, X, BarChart3 } from 'lucide-react';
import './App.css';

// Interface alinhada ao modelo RegistroResiduo do seu Backend
interface RegistroResiduo {
  id?: number;
  tipoResiduo: string;
  quantidade: number;
  unidade: string;
  dataColeta: string;
}

const API_URL = "http://localhost:8080/api/residuos";

function App() {
  const [registros, setRegistros] = useState<RegistroResiduo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<RegistroResiduo>({
    tipoResiduo: '',
    quantidade: 1,
    unidade: 'kg',
    dataColeta: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const novoRegistro = { ...formData, id: Date.now() };
    setRegistros([novoRegistro, ...registros]);
    
    setIsModalOpen(false);
    setFormData({
      tipoResiduo: '',
      quantidade: 0,
      unidade: 'kg',
      dataColeta: new Date().toISOString().split('T')[0]
    });
  };

  const deleteRegistro = (id?: number) => {
    setRegistros(registros.filter(r => r.id !== id));
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Simplificada */}
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
            <p>Monitore e registre a coleta de materiais recicláveis.</p>
          </div>
          <button className="btn-new" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={20} /> Novo Cadastro
          </button>
        </header>

        {/* Modal de Cadastro */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
  <h2>Registrar Coleta</h2>
  <button className="btn-close" onClick={() => setIsModalOpen(false)}>
    <X size={20} />
  </button>
</div>
              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="form-field">
                  <label>Tipo de Material</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Plástico PET, Alumínio..." 
                    value={formData.tipoResiduo}
                    onChange={(e) => setFormData({...formData, tipoResiduo: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-row">
                  <div className="form-field">
  <label>Quantidade</label>
  <input 
    type="number" 
    step="1"        // Define o passo como 1 (bloqueia setas para decimais)
    pattern="[0-9]*" // Sugestão para teclados móveis aceitarem apenas números
    min="1"          // Impede números negativos ou zero, se desejar
    value={formData.quantidade}
    onKeyDown={(e) => {
      // Bloqueia as teclas de vírgula e ponto diretamente
      if (e.key === ',' || e.key === '.') {
        e.preventDefault();
      }
    }}
    onChange={(e) => {
      // Converte para inteiro e remove qualquer resquício de decimais
      const val = parseInt(e.target.value, 10);
      setFormData({...formData, quantidade: isNaN(val) ? 0 : val});
    }}
    required 
  />
</div>
                  <div className="form-field">
                    <label>Unidade</label>
                    <select 
                      value={formData.unidade}
                      onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                    >
                      <option value="kg">Kg</option>
                      <option value="ton">Ton</option>     
                    </select>
                  </div>
                </div>
                <div className="form-field">
                  <label>Data da Coleta</label>
                  <input 
                    type="date" 
                    value={formData.dataColeta}
                    onChange={(e) => setFormData({...formData, dataColeta: e.target.value})}
                    required 
                  />
                </div>
                <div className="modal-actions">
                 <button 
                   type="button" 
                   className="btn-cancel" 
                  onClick={() => setIsModalOpen(false)}
                  >
                  Cancelar
                  </button>
                   <button 
                    type="submit" 
                    className="btn-save"
                   >    
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
              placeholder="Pesquisar por material..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Quantidade</th>
                  <th>Unidade</th>
                  <th>Data</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {registros.filter(r => r.tipoResiduo.toLowerCase().includes(searchTerm.toLowerCase())).map((reg) => (
                  <tr key={reg.id}>
                    <td><strong>{reg.tipoResiduo}</strong></td>
                    <td>{reg.quantidade}</td>
                    <td><span className="badge-unit">{reg.unidade}</span></td>
                    <td>{new Date(reg.dataColeta).toLocaleDateString('pt-BR')}</td>
                    <td className="text-center">
                      <button className="btn-delete" onClick={() => deleteRegistro(reg.id)}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
               {registros.length === 0 && (
                   <tr>
                     <td colSpan={5} className="empty-state-cell">
                          Nenhum registro encontrado.
                     </td>
                  </tr>
                 )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;