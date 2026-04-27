import { useState, useEffect } from "react";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://unuirrizwupomshsvjfu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVudWlycml6d3Vwb21zaHN2amZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTU1MDYsImV4cCI6MjA5Mjg5MTUwNn0.cyad9rpj2QHacKgNUOQLitBpJPfuN54u5rjG39heGhE"
);

const CATEGORIAS = ["Pizza", "Bebida", "Sobremesa", "Entrada", "Promoção"];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f0d0a;
    --surface: #1a1713;
    --surface2: #242019;
    --border: #2e2a24;
    --accent: #e8622a;
    --accent2: #f5a623;
    --text: #f0ebe3;
    --muted: #8a8070;
    --success: #4caf7d;
    --danger: #e84242;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

  .app { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: 240px; background: var(--surface); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; padding: 28px 0; position: fixed; height: 100vh; z-index: 10;
  }
  .logo {
    padding: 0 24px 32px; border-bottom: 1px solid var(--border);
  }
  .logo h1 { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--accent); line-height: 1.1; }
  .logo span { font-size: 11px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; }

  .nav { padding: 20px 12px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
  .nav-item {
    display: flex; align-items: center; gap: 12px; padding: 10px 14px;
    border-radius: 10px; cursor: pointer; transition: all 0.2s; color: var(--muted);
    font-size: 14px; font-weight: 500; border: none; background: none; width: 100%; text-align: left;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: var(--accent); color: #fff; }
  .nav-item .icon { font-size: 18px; width: 20px; text-align: center; }

  .sidebar-footer { padding: 20px 24px; border-top: 1px solid var(--border); }
  .badge-status { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--success); }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--success); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }

  /* MAIN */
  .main { margin-left: 240px; flex: 1; padding: 32px; min-height: 100vh; }

  .page-header { margin-bottom: 32px; }
  .page-header h2 { font-family: 'Playfair Display', serif; font-size: 32px; color: var(--text); }
  .page-header p { color: var(--muted); font-size: 14px; margin-top: 4px; }

  /* STATS */
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
    padding: 20px 24px; position: relative; overflow: hidden;
  }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
  }
  .stat-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
  .stat-value { font-family: 'Playfair Display', serif; font-size: 28px; color: var(--text); margin-top: 6px; }
  .stat-icon { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); font-size: 32px; opacity: 0.15; }

  /* PRODUTOS PAGE */
  .toolbar { display: flex; gap: 12px; margin-bottom: 24px; align-items: center; flex-wrap: wrap; }
  .search-box {
    flex: 1; min-width: 200px; background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 16px; color: var(--text); font-size: 14px; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color 0.2s;
  }
  .search-box:focus { border-color: var(--accent); }
  .search-box::placeholder { color: var(--muted); }

  .filter-btn {
    padding: 10px 16px; border-radius: 10px; border: 1px solid var(--border);
    background: var(--surface); color: var(--muted); font-size: 13px; cursor: pointer;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif; font-weight: 500;
  }
  .filter-btn:hover, .filter-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }

  .btn-primary {
    padding: 10px 20px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, var(--accent), #d4501f); color: #fff;
    font-size: 14px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600;
    transition: opacity 0.2s; white-space: nowrap;
  }
  .btn-primary:hover { opacity: 0.85; }

  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }

  .product-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
    overflow: hidden; transition: transform 0.2s, border-color 0.2s;
  }
  .product-card:hover { transform: translateY(-2px); border-color: var(--accent); }

  .product-img {
    width: 100%; height: 160px; object-fit: cover; background: var(--surface2);
    display: flex; align-items: center; justify-content: center; font-size: 48px;
  }
  .product-img img { width: 100%; height: 100%; object-fit: cover; }

  .product-info { padding: 16px; }
  .product-cat { font-size: 11px; color: var(--accent2); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
  .product-name { font-family: 'Playfair Display', serif; font-size: 18px; margin: 4px 0 6px; }
  .product-desc { font-size: 12px; color: var(--muted); line-height: 1.5; margin-bottom: 12px; }
  .product-footer { display: flex; align-items: center; justify-content: space-between; }
  .product-price { font-size: 20px; font-weight: 700; color: var(--accent); }

  .product-actions { display: flex; gap: 6px; }
  .action-btn {
    width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--surface2); cursor: pointer; display: flex; align-items: center;
    justify-content: center; font-size: 14px; transition: all 0.2s;
  }
  .action-btn:hover { border-color: var(--accent); background: var(--accent); }
  .action-btn.danger:hover { border-color: var(--danger); background: var(--danger); }

  .status-badge {
    display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px;
    border-radius: 20px; font-size: 11px; font-weight: 600;
  }
  .status-badge.ativo { background: rgba(76,175,125,0.15); color: var(--success); }
  .status-badge.inativo { background: rgba(232,66,66,0.15); color: var(--danger); }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 100;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    backdrop-filter: blur(4px);
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border); border-radius: 20px;
    padding: 32px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto;
    animation: slideUp 0.25s ease;
  }
  @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  .modal-title { font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 24px; }
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; display: block; }
  .form-input, .form-select, .form-textarea {
    width: 100%; background: var(--surface2); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 14px; color: var(--text); font-size: 14px;
    font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--accent); }
  .form-select option { background: var(--surface2); }
  .form-textarea { resize: vertical; min-height: 80px; }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-actions { display: flex; gap: 10px; margin-top: 24px; }
  .btn-cancel {
    flex: 1; padding: 12px; border-radius: 10px; border: 1px solid var(--border);
    background: transparent; color: var(--muted); font-family: 'DM Sans', sans-serif;
    font-size: 14px; cursor: pointer; transition: all 0.2s;
  }
  .btn-cancel:hover { border-color: var(--text); color: var(--text); }
  .btn-save { flex: 2; }

  .empty-state { text-align: center; padding: 80px 20px; color: var(--muted); }
  .empty-state .emoji { font-size: 64px; margin-bottom: 16px; }
  .empty-state h3 { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--text); margin-bottom: 8px; }

  .toast {
    position: fixed; bottom: 24px; right: 24px; background: var(--success);
    color: #fff; padding: 12px 20px; border-radius: 12px; font-size: 14px; font-weight: 500;
    z-index: 200; animation: slideUp 0.3s ease;
  }

  @media (max-width: 768px) {
    .sidebar { width: 60px; }
    .sidebar .logo h1, .sidebar .logo span, .nav-item span, .sidebar-footer { display: none; }
    .main { margin-left: 60px; padding: 20px 16px; }
    .stats { grid-template-columns: repeat(2,1fr); }
    .form-row { grid-template-columns: 1fr; }
  }
`;

export default function PainelAdmin() {
  const [page, setPage] = useState("dashboard");
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ nome: "", descricao: "", preco: "", categoria: "Pizza", imagem_url: "", ativo: true });

  useEffect(() => { fetchProdutos(); }, []);

  async function fetchProdutos() {
    setLoading(true);
    const { data } = await supabase.from("produtos").select("*").order("created_at", { ascending: false });
    setProdutos(data || []);
    setLoading(false);
  }

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  function abrirModal(produto = null) {
    if (produto) { setEditando(produto); setForm({ nome: produto.nome, descricao: produto.descricao || "", preco: produto.preco, categoria: produto.categoria, imagem_url: produto.imagem_url || "", ativo: produto.ativo }); }
    else { setEditando(null); setForm({ nome: "", descricao: "", preco: "", categoria: "Pizza", imagem_url: "", ativo: true }); }
    setModalOpen(true);
  }

  async function salvar() {
    if (!form.nome || !form.preco) return;
    const dados = { ...form, preco: parseFloat(form.preco) };
    if (editando) {
      await supabase.from("produtos").update(dados).eq("id", editando.id);
      showToast("Produto atualizado! ✓");
    } else {
      await supabase.from("produtos").insert([dados]);
      showToast("Produto cadastrado! ✓");
    }
    setModalOpen(false);
    fetchProdutos();
  }

  async function toggleAtivo(p) {
    await supabase.from("produtos").update({ ativo: !p.ativo }).eq("id", p.id);
    fetchProdutos();
  }

  async function excluir(id) {
    if (!confirm("Excluir produto?")) return;
    await supabase.from("produtos").delete().eq("id", id);
    showToast("Produto excluído");
    fetchProdutos();
  }

  const produtosFiltrados = produtos.filter(p => {
    const matchCat = filtro === "Todos" || p.categoria === filtro;
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    return matchCat && matchBusca;
  });

  const ativos = produtos.filter(p => p.ativo).length;
  const categorias = [...new Set(produtos.map(p => p.categoria))].length;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="logo">
            <h1>🍕 Beto<br/>Pizzaria</h1>
            <span>Painel Admin</span>
          </div>
          <nav className="nav">
            {[
              { id: "dashboard", icon: "📊", label: "Dashboard" },
              { id: "produtos", icon: "🍕", label: "Produtos" },
              { id: "pedidos", icon: "📋", label: "Pedidos" },
              { id: "promocoes", icon: "🔥", label: "Promoções" },
            ].map(item => (
              <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)}>
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="badge-status"><div className="dot" /><span>Sistema ativo</span></div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* DASHBOARD */}
          {page === "dashboard" && (
            <>
              <div className="page-header">
                <h2>Boa noite, Beto! 👋</h2>
                <p>Aqui está o resumo do seu negócio</p>
              </div>
              <div className="stats">
                <div className="stat-card"><div className="stat-label">Total Produtos</div><div className="stat-value">{produtos.length}</div><div className="stat-icon">🍕</div></div>
                <div className="stat-card"><div className="stat-label">Ativos</div><div className="stat-value">{ativos}</div><div className="stat-icon">✅</div></div>
                <div className="stat-card"><div className="stat-label">Categorias</div><div className="stat-value">{categorias}</div><div className="stat-icon">📂</div></div>
                <div className="stat-card"><div className="stat-label">Inativos</div><div className="stat-value">{produtos.length - ativos}</div><div className="stat-icon">⏸️</div></div>
              </div>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: 28 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 16, fontSize: 20 }}>Produtos Recentes</h3>
                {produtos.slice(0, 5).map(p => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{p.nome}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.categoria}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontWeight: 700, color: "var(--accent)" }}>R$ {Number(p.preco).toFixed(2)}</span>
                      <span className={`status-badge ${p.ativo ? "ativo" : "inativo"}`}>{p.ativo ? "● Ativo" : "● Inativo"}</span>
                    </div>
                  </div>
                ))}
                {produtos.length === 0 && <p style={{ color: "var(--muted)", textAlign: "center", padding: 20 }}>Nenhum produto ainda</p>}
              </div>
            </>
          )}

          {/* PRODUTOS */}
          {page === "produtos" && (
            <>
              <div className="page-header">
                <h2>Cardápio</h2>
                <p>Gerencie todos os seus produtos</p>
              </div>
              <div className="toolbar">
                <input className="search-box" placeholder="🔍 Buscar produto..." value={busca} onChange={e => setBusca(e.target.value)} />
                {["Todos", ...CATEGORIAS].map(c => (
                  <button key={c} className={`filter-btn ${filtro === c ? "active" : ""}`} onClick={() => setFiltro(c)}>{c}</button>
                ))}
                <button className="btn-primary" onClick={() => abrirModal()}>+ Novo Produto</button>
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: 60, color: "var(--muted)" }}>Carregando...</div>
              ) : produtosFiltrados.length === 0 ? (
                <div className="empty-state">
                  <div className="emoji">🍕</div>
                  <h3>Nenhum produto encontrado</h3>
                  <p>Adicione seu primeiro produto ao cardápio</p>
                </div>
              ) : (
                <div className="products-grid">
                  {produtosFiltrados.map(p => (
                    <div key={p.id} className="product-card">
                      <div className="product-img">
                        {p.imagem_url ? <img src={p.imagem_url} alt={p.nome} onError={e => { e.target.style.display = "none"; }} /> : "🍕"}
                      </div>
                      <div className="product-info">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                          <span className="product-cat">{p.categoria}</span>
                          <span className={`status-badge ${p.ativo ? "ativo" : "inativo"}`}>{p.ativo ? "Ativo" : "Inativo"}</span>
                        </div>
                        <div className="product-name">{p.nome}</div>
                        <div className="product-desc">{p.descricao || "Sem descrição"}</div>
                        <div className="product-footer">
                          <span className="product-price">R$ {Number(p.preco).toFixed(2)}</span>
                          <div className="product-actions">
                            <button className="action-btn" title="Editar" onClick={() => abrirModal(p)}>✏️</button>
                            <button className="action-btn" title={p.ativo ? "Desativar" : "Ativar"} onClick={() => toggleAtivo(p)}>{p.ativo ? "⏸️" : "▶️"}</button>
                            <button className="action-btn danger" title="Excluir" onClick={() => excluir(p.id)}>🗑️</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* PEDIDOS - em breve */}
          {page === "pedidos" && (
            <div className="empty-state" style={{ marginTop: 60 }}>
              <div className="emoji">📋</div>
              <h3>Gestão de Pedidos</h3>
              <p style={{ marginTop: 8 }}>Em desenvolvimento — próxima fase</p>
            </div>
          )}

          {/* PROMOÇÕES - em breve */}
          {page === "promocoes" && (
            <div className="empty-state" style={{ marginTop: 60 }}>
              <div className="emoji">🔥</div>
              <h3>Promoções</h3>
              <p style={{ marginTop: 8 }}>Em desenvolvimento — próxima fase</p>
            </div>
          )}
        </main>

        {/* MODAL */}
        {modalOpen && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalOpen(false)}>
            <div className="modal">
              <div className="modal-title">{editando ? "Editar Produto" : "Novo Produto"}</div>
              <div className="form-group">
                <label className="form-label">Nome do Produto *</label>
                <input className="form-input" placeholder="Ex: Pizza Margherita" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Preço (R$) *</label>
                  <input className="form-input" type="number" step="0.01" placeholder="0,00" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select className="form-select" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                    {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea className="form-textarea" placeholder="Ingredientes, tamanho..." value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">URL da Imagem</label>
                <input className="form-input" placeholder="https://..." value={form.imagem_url} onChange={e => setForm({ ...form, imagem_url: e.target.value })} />
              </div>
              <div className="form-group">
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={form.ativo} onChange={e => setForm({ ...form, ativo: e.target.checked })} />
                  <span style={{ fontSize: 14 }}>Produto ativo (visível no cardápio)</span>
                </label>
              </div>
              <div className="form-actions">
                <button className="btn-cancel" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button className="btn-primary btn-save" onClick={salvar}>{editando ? "Salvar Alterações" : "Cadastrar Produto"}</button>
              </div>
            </div>
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
