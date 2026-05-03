import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CATEGORIAS = ["Pizza", "Bebida", "Sobremesa", "Entrada", "Promoção"];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F9F6F1; --surface: #FFFFFF; --surface2: #EAE4DA;
    --border: #DDD5C8; --accent: #C8181A; --accent2: #9E1214;
    --text: #1C1208; --muted: #6B6050; --success: #1A6B2E; --danger: #C8181A;
    --blue: #1A6B2E; --purple: #9E1214;
  }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  .app { display: flex; min-height: 100vh; }
  .sidebar { width: 240px; background: #1C1208; border-right: 1px solid #2e2218; display: flex; flex-direction: column; padding: 28px 0; position: fixed; height: 100vh; z-index: 10; overflow-y: auto; }
  .logo { padding: 0 24px 28px; border-bottom: 1px solid var(--border); }
  .logo h1 { font-family: 'Playfair Display', serif; font-size: 22px; color: #C8181A; line-height: 1.1; }
  .logo span { font-size: 11px; color: #8a7060; letter-spacing: 2px; text-transform: uppercase; }
  .nav { padding: 16px 12px; flex: 1; display: flex; flex-direction: column; gap: 2px; }
  .nav-section { font-size: 10px; color: #8a7060; letter-spacing: 1.5px; text-transform: uppercase; padding: 12px 14px 4px; }
  .nav-item { display: flex; align-items: center; gap: 12px; padding: 9px 14px; border-radius: 10px; cursor: pointer; transition: all 0.2s; color: #a09080; font-size: 13px; font-weight: 500; border: none; background: none; width: 100%; text-align: left; position: relative; }
  .nav-item:hover { background: #2e2218; color: #F9F6F1; }
  .nav-item.active { background: var(--accent); color: #fff; }
  .nav-item .icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
  .nav-badge { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: var(--danger); color: #fff; border-radius: 20px; font-size: 10px; font-weight: 700; padding: 2px 6px; min-width: 18px; text-align: center; }
  .sidebar-footer { padding: 16px 24px; border-top: 1px solid #2e2218; }
  .badge-status { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #4caf7d; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--success); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
  .main { margin-left: 240px; flex: 1; padding: 32px; min-height: 100vh; }
  .page-header { margin-bottom: 28px; }
  .page-header h2 { font-family: 'Playfair Display', serif; font-size: 30px; color: var(--text); }
  .page-header p { color: var(--muted); font-size: 14px; margin-top: 4px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 18px 22px; position: relative; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #C8181A, #9E1214); }
  .stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
  .stat-value { font-family: 'Playfair Display', serif; font-size: 26px; color: var(--text); margin-top: 6px; }
  .stat-sub { font-size: 11px; color: var(--muted); margin-top: 4px; }
  .stat-icon { position: absolute; right: 18px; top: 50%; transform: translateY(-50%); font-size: 28px; opacity: 0.15; }
  .toolbar { display: flex; gap: 10px; margin-bottom: 20px; align-items: center; flex-wrap: wrap; }
  .search-box { flex: 1; min-width: 180px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 9px 14px; color: var(--text); font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; }
  .search-box:focus { border-color: var(--accent); }
  .search-box::placeholder { color: var(--muted); }
  .filter-btn { padding: 9px 14px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); color: var(--muted); font-size: 13px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; font-weight: 500; }
  .filter-btn:hover, .filter-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }
  .btn-primary { padding: 9px 18px; border-radius: 10px; border: none; background: linear-gradient(135deg, #C8181A, #9E1214); color: #fff; font-size: 13px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; transition: opacity 0.2s; white-space: nowrap; }
  .btn-primary:hover { opacity: 0.85; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 14px; }
  .product-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: transform 0.2s, border-color 0.2s; }
  .product-card:hover { transform: translateY(-2px); border-color: var(--accent); }
  .product-img { width: 100%; height: 150px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 44px; }
  .product-img img { width: 100%; height: 100%; object-fit: cover; }
  .product-info { padding: 14px; }
  .product-cat { font-size: 11px; color: var(--accent2); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
  .product-name { font-family: 'Playfair Display', serif; font-size: 17px; margin: 4px 0 5px; }
  .product-desc { font-size: 12px; color: var(--muted); line-height: 1.5; margin-bottom: 10px; }
  .product-footer { display: flex; align-items: center; justify-content: space-between; }
  .product-price { font-size: 19px; font-weight: 700; color: var(--accent); }
  .product-actions { display: flex; gap: 5px; }
  .action-btn { width: 30px; height: 30px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface2); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 13px; transition: all 0.2s; }
  .action-btn:hover { border-color: var(--accent); background: var(--accent); }
  .action-btn.danger:hover { border-color: var(--danger); background: var(--danger); }
  .status-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .status-badge.ativo { background: rgba(76,175,125,0.15); color: var(--success); }
  .status-badge.inativo { background: rgba(232,66,66,0.15); color: var(--danger); }
  .stock-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }
  .stock-badge.ok { background: rgba(76,175,125,0.15); color: var(--success); }
  .stock-badge.low { background: rgba(245,166,35,0.15); color: var(--accent2); }
  .stock-badge.out { background: rgba(232,66,66,0.15); color: var(--danger); }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
  .modal { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 28px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; animation: slideUp 0.25s ease; }
  .modal-sm { max-width: 380px; text-align: center; }
  @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 22px; margin-bottom: 20px; }
  .form-group { margin-bottom: 14px; }
  .form-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; display: block; }
  .form-input, .form-select, .form-textarea { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 9px 13px; color: var(--text); font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--accent); }
  .form-input.error { border-color: var(--danger); }
  .form-select option { background: var(--surface); color: var(--text); }
  .form-textarea { resize: vertical; min-height: 72px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .form-actions { display: flex; gap: 10px; margin-top: 20px; }
  .btn-cancel { flex: 1; padding: 11px; border-radius: 10px; border: 1px solid var(--border); background: transparent; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s; }
  .btn-cancel:hover { border-color: var(--text); color: var(--text); }
  .btn-save { flex: 2; }
  .btn-danger-solid { padding: 11px; border-radius: 10px; border: none; background: var(--danger); color: #fff; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; font-weight: 600; flex: 1; transition: opacity 0.2s; }
  .btn-danger-solid:hover { opacity: 0.85; }
  .field-error { font-size: 11px; color: var(--danger); margin-top: 4px; }
  .fin-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 24px; }
  .fin-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 20px 22px; position: relative; overflow: hidden; }
  .fin-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; }
  .fin-card.green::before { background: linear-gradient(90deg,#4caf7d,#81c784); }
  .fin-card.orange::before { background: linear-gradient(90deg,#C8181A,#9E1214); }
  .fin-card.blue::before { background: linear-gradient(90deg,#1A6B2E,#2E8B57); }
  .fin-card.red::before { background: linear-gradient(90deg,#e84242,#f06292); }
  .fin-card.purple::before { background: linear-gradient(90deg,#9E1214,#C8181A); }
  .fin-card.gray::before { background: linear-gradient(90deg,#8a8070,#a09080); }
  .fin-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
  .fin-value { font-family: 'Playfair Display', serif; font-size: 24px; color: var(--text); }
  .fin-sub { font-size: 11px; color: var(--muted); margin-top: 4px; }
  .fin-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 26px; opacity: 0.12; }
  .periodo-tabs { display: flex; gap: 6px; }
  .periodo-tab { padding: 7px 14px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); color: var(--muted); font-size: 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 500; transition: all 0.2s; }
  .periodo-tab.active { background: var(--accent); border-color: var(--accent); color: #fff; }
  .metodo-bar { display: flex; flex-direction: column; gap: 10px; }
  .metodo-row { display: flex; align-items: center; gap: 12px; }
  .metodo-label { font-size: 12px; color: var(--text); width: 110px; flex-shrink: 0; }
  .metodo-track { flex: 1; height: 7px; background: var(--surface2); border-radius: 4px; overflow: hidden; }
  .metodo-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, #C8181A, #9E1214); transition: width 0.5s; }
  .metodo-val { font-size: 12px; color: var(--muted); width: 72px; text-align: right; flex-shrink: 0; }
  .table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  .table-head { display: grid; padding: 11px 18px; border-bottom: 1px solid var(--border); font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
  .table-row { display: grid; padding: 13px 18px; border-bottom: 1px solid var(--border); font-size: 13px; align-items: center; transition: background 0.15s; }
  .table-row:last-child { border-bottom: none; }
  .table-row:hover { background: var(--surface2); }
  .status-timeline { display: flex; align-items: center; margin: 12px 0; }
  .st-step { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
  .st-circle { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; border: 2px solid var(--border); background: var(--surface2); color: var(--muted); transition: all 0.3s; }
  .st-circle.done { background: var(--success); border-color: var(--success); color: #fff; }
  .st-circle.active { background: var(--accent); border-color: var(--accent); color: #fff; }
  .st-circle.cancelled { background: var(--danger); border-color: var(--danger); color: #fff; }
  .st-label { font-size: 10px; color: var(--muted); text-align: center; white-space: nowrap; }
  .st-label.active { color: var(--accent); font-weight: 600; }
  .st-label.done { color: var(--success); }
  .st-line { flex: 1; height: 2px; background: var(--border); margin-bottom: 14px; transition: background 0.3s; }
  .st-line.done { background: var(--success); }
  .empty-state { text-align: center; padding: 70px 20px; color: var(--muted); }
  .empty-state .emoji { font-size: 56px; margin-bottom: 14px; }
  .empty-state h3 { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--text); margin-bottom: 8px; }
  .toast { position: fixed; bottom: 24px; right: 24px; padding: 11px 18px; border-radius: 12px; font-size: 13px; font-weight: 500; z-index: 300; animation: slideUp 0.3s ease; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 28px rgba(0,0,0,0.4); max-width: 320px; }
  .toast.success { background: #1A6B2E; color: #fff; }
  .toast.error { background: #C8181A; color: #fff; }
  .toast.info { background: #C8181A; color: #fff; }
  .sync-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--success); margin-right: 5px; vertical-align: middle; }
  .promo-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 18px 22px; transition: border-color 0.2s; }
  .promo-card:hover { border-color: var(--accent); }
  .promo-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .promo-badge.ativo { background: rgba(76,175,125,0.15); color: var(--success); }
  .promo-badge.expirado { background: rgba(138,128,112,0.15); color: var(--muted); }
  .promo-badge.inativo { background: rgba(232,66,66,0.15); color: var(--danger); }
  .config-section { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 22px; margin-bottom: 18px; }
  .config-title { font-family: 'Playfair Display', serif; font-size: 19px; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
  .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 13px 0; border-bottom: 1px solid var(--border); gap: 20px; }
  .toggle-row:last-child { border-bottom: none; }
  .toggle { position: relative; width: 44px; height: 24px; flex-shrink: 0; }
  .toggle input { opacity: 0; width: 0; height: 0; }
  .toggle-slider { position: absolute; inset: 0; background: var(--surface2); border-radius: 24px; transition: 0.3s; cursor: pointer; border: 1px solid var(--border); }
  .toggle-slider:before { content: ''; position: absolute; height: 18px; width: 18px; left: 2px; bottom: 2px; background: var(--muted); border-radius: 50%; transition: 0.3s; }
  .toggle input:checked + .toggle-slider { background: var(--accent); border-color: var(--accent); }
  .toggle input:checked + .toggle-slider:before { transform: translateX(20px); background: #fff; }
  .toggle input:disabled + .toggle-slider { opacity: 0.5; cursor: not-allowed; }
  .mesa-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 16px; transition: all 0.2s; text-align: center; }
  .mesa-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .mesa-numero { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; line-height: 1; }
  .kds-card { background: var(--surface); border: 2px solid var(--border); border-radius: 16px; padding: 18px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .kds-card.urgente { border-color: var(--danger); }
  .kds-timer { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; }
  .kds-timer.urgente { color: var(--danger); }
  .kds-timer.aviso { color: var(--accent2); }
  .kds-timer.ok { color: var(--success); }
  .progress-bar { height: 8px; background: var(--surface2); border-radius: 4px; overflow: hidden; margin-top: 6px; }
  .progress-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
  .cliente-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 16px 20px; transition: border-color 0.2s; }
  .cliente-card:hover { border-color: var(--accent); }
  .log-row { display: flex; gap: 14px; padding: 10px 0; border-bottom: 1px solid var(--border); align-items: flex-start; font-size: 13px; }
  .log-row:last-child { border-bottom: none; }
  .log-time { font-size: 11px; color: var(--muted); white-space: nowrap; flex-shrink: 0; width: 110px; }
  .log-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.3} }
  @media (max-width: 900px) { .stats { grid-template-columns: repeat(2,1fr); } .fin-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 768px) {
    .sidebar { width: 56px; }
    .sidebar .logo h1, .sidebar .logo span, .nav-item span, .sidebar-footer, .nav-section { display: none; }
    .main { margin-left: 56px; padding: 16px 12px; }
    .stats { grid-template-columns: 1fr 1fr; }
    .fin-grid { grid-template-columns: 1fr 1fr; }
    .form-row { grid-template-columns: 1fr; }
  }
`;

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const statusCfg = {
  aguardando_pagamento: { label:"Aguard. Pgto", color:"#f5a623", bg:"rgba(245,166,35,0.12)", icon:"⏳", step:0 },
  pago:       { label:"Pago",        color:"#4caf7d", bg:"rgba(76,175,125,0.12)",  icon:"✅", step:1 },
  em_preparo: { label:"Em Preparo",  color:"#42a5f5", bg:"rgba(66,165,245,0.12)",  icon:"👨‍🍳", step:2 },
  entregue:   { label:"Entregue",    color:"#8a8070", bg:"rgba(138,128,112,0.12)", icon:"🛵", step:3 },
  cancelado:  { label:"Cancelado",   color:"#e84242", bg:"rgba(232,66,66,0.12)",   icon:"✕",  step:-1 },
};
// Fluxo normal (pix/cartão): aguardando_pagamento → pago → em_preparo → entregue
// Fluxo dinheiro (cash):       aguardando_pagamento → em_preparo → entregue (paga na retirada)
function getProximoStatus(status, metodo_pagamento) {
  const isDinheiro = metodo_pagamento === "cash";
  if (isDinheiro) {
    if (status === "aguardando_pagamento") return "em_preparo";
    if (status === "em_preparo") return "entregue";
    return null;
  }
  if (status === "aguardando_pagamento") return "pago";
  if (status === "pago") return "em_preparo";
  if (status === "em_preparo") return "entregue";
  return null;
}
const metodoLabel = { debit:"Débito", credit1x:"Créd. à Vista", credit:"Créd. Parcelado", pix:"PIX", cash:"Dinheiro" };

// ─── SUPABASE REALTIME HOOK ───────────────────────────────────────────────────
// Substitui polling por WebSocket via Supabase channel.
// Sem race condition, sem memory leak — channel é removido no cleanup.
function useRealtime(tabela) {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const { data } = await supabase.from(tabela).select("*").order("created_at", { ascending: false });
    setDados(data || []);
    setLoading(false);
  }, [tabela]);

  useEffect(() => {
    fetch();
    const ch = supabase
      .channel(`rt_${tabela}_${Math.random()}`)
      .on("postgres_changes", { event: "*", schema: "public", table: tabela }, () => fetch())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetch]);

  return { dados, loading, refresh: fetch };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Toast({ msg, type = "success" }) {
  if (!msg) return null;
  return <div className={`toast ${type}`}>{msg}</div>;
}

function useToast() {
  const [t, setT] = useState(null);
  const show = (msg, type = "success") => { setT({ msg, type }); setTimeout(() => setT(null), 3000); };
  return [t, show];
}

function ConfirmModal({ mensagem, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="modal modal-sm">
        <div style={{ fontSize:38, marginBottom:12 }}>⚠️</div>
        <div className="modal-title" style={{ fontSize:18, marginBottom:8 }}>{mensagem}</div>
        <p style={{ color:"var(--muted)", fontSize:13, marginBottom:20 }}>Esta ação não pode ser desfeita.</p>
        <div className="form-actions" style={{ justifyContent:"center" }}>
          <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
          <button className="btn-danger-solid" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}

function StatusTimeline({ status }) {
  const steps = ["aguardando_pagamento","pago","em_preparo","entregue"];
  const cancelled = status === "cancelado";
  const cur = cancelled ? -1 : (statusCfg[status]?.step ?? 0);
  return (
    <div className="status-timeline">
      {steps.map((s, i) => {
        const done = !cancelled && cur > i, active = !cancelled && cur === i;
        return (
          <div key={s} style={{ display:"flex", alignItems:"center", flex: i < steps.length-1 ? "1" : "0" }}>
            <div className="st-step">
              <div className={`st-circle ${cancelled&&i===0?"cancelled":done?"done":active?"active":""}`}>
                {cancelled&&i===0?"✕":done?"✓":statusCfg[s].icon}
              </div>
              <span className={`st-label ${done?"done":active?"active":""}`}>{statusCfg[s].label}</span>
            </div>
            {i < steps.length-1 && <div className={`st-line ${done?"done":""}`}/>}
          </div>
        );
      })}
    </div>
  );
}

async function registrarLog(acao, detalhe, usuario_email) {
  try {
    await supabase.from("logs_admin").insert([{
      acao, detalhe, usuario: usuario_email || "admin",
      created_at: new Date().toISOString()
    }]);
  } catch {}
}

// ─── PEDIDOS PAGE ─────────────────────────────────────────────────────────────
function PedidosPage({ usuarioEmail }) {
  const { dados: pedidos, loading, refresh } = useRealtime("pedidos");
  const [expandido, setExpandido] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [busca, setBusca] = useState("");
  const [ordemValor, setOrdemValor] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [confirm, setConfirm] = useState(null);
  const [obs, setObs] = useState({});
  const [ultimaAtu, setUltimaAtu] = useState(null);
  const [toast, showToast] = useToast();
  const prevCountRef = useRef(0);
  const POR_PAGINA = 20;

  useEffect(() => { setUltimaAtu(new Date()); }, [pedidos]);

  // Notificação ao receber pedido novo
  useEffect(() => {
    if (prevCountRef.current > 0 && pedidos.length > prevCountRef.current) {
      showToast("🔔 Novo pedido recebido!", "info");
      const orig = document.title; let b = 0;
      const iv = setInterval(() => {
        document.title = b++ % 2 === 0 ? "🔔 NOVO PEDIDO!" : orig;
        if (b > 6) { clearInterval(iv); document.title = orig; }
      }, 600);
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(); osc.stop(ctx.currentTime + 0.4);
      } catch {}
    }
    prevCountRef.current = pedidos.length;
  }, [pedidos.length]);

  async function atualizarStatus(id, novoStatus, pedido) {
    const { error } = await supabase.from("pedidos").update({
      status: novoStatus,
      [`ts_${novoStatus}`]: new Date().toISOString()
    }).eq("id", id);
    if (error) { showToast("Erro ao atualizar ✗", "error"); return; }
    showToast(`${statusCfg[novoStatus]?.icon} → ${statusCfg[novoStatus]?.label}`);
    registrarLog("status_pedido", `#${id?.slice(0,8)} → ${novoStatus}`, usuarioEmail);
    // Bug fix: decrementa estoque ao entregar
    if (novoStatus === "entregue" && pedido?.itens) {
      const itens = Array.isArray(pedido.itens) ? pedido.itens : [];
      for (const item of itens) {
        if (item.produto_id) {
          const { data: prod } = await supabase.from("produtos").select("estoque").eq("id", item.produto_id).single();
          if (prod?.estoque != null) {
            await supabase.from("produtos").update({ estoque: Math.max(0, prod.estoque - 1) }).eq("id", item.produto_id);
          }
        }
      }
    }
    refresh();
  }

  async function salvarObservacao(id) {
    const { error } = await supabase.from("pedidos").update({ observacao: obs[id] || "" }).eq("id", id);
    if (error) { showToast("Erro ✗", "error"); return; }
    showToast("Observação salva ✓");
  }

  function imprimirPedido(pedido) {
    const itens = Array.isArray(pedido.itens) ? pedido.itens : [];
    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) return;
    const min = Math.round((new Date() - new Date(pedido.created_at)) / 60000);
    win.document.write(`<html><head><title>Pedido</title><style>body{font-family:monospace;padding:20px;font-size:13px}hr{border:1px dashed #ccc}.total{font-size:17px;font-weight:bold}</style></head><body>
      <h2>🍕 Beto Pizzaria</h2><hr/>
      <p><b>Pedido:</b> #${(pedido.id||"").slice(0,8)}</p>
      <p><b>Cliente:</b> ${pedido.nome_cliente||"-"}</p>
      <p><b>Mesa:</b> ${pedido.mesa||"-"} | <b>Pgto:</b> ${metodoLabel[pedido.metodo_pagamento]||"-"}</p>
      <p><b>Status:</b> ${statusCfg[pedido.status]?.label||pedido.status} | <b>Tempo:</b> ${min}min</p>
      <hr/><b>Itens:</b><br/>
      ${itens.map(i=>`<p>${i.name} — R$ ${Number(i.price).toFixed(2)}</p>`).join("")}
      <hr/><p class="total">Total: R$ ${Number(pedido.total).toFixed(2).replace(".",",")}</p>
      ${pedido.observacao?`<p style="margin-top:8px"><b>Obs:</b> ${pedido.observacao}</p>`:""}
      <p style="font-size:10px;color:#999;margin-top:12px">${new Date(pedido.created_at).toLocaleString("pt-BR")}</p>
      </body></html>`);
    win.document.close(); win.print();
  }

  const totais = Object.keys(statusCfg).reduce((a, s) => { a[s] = pedidos.filter(p => p.status === s).length; return a; }, {});
  // Bug fix: faturamento inclui todos os status não-cancelados (pago + em_preparo + entregue)
  const totalHoje = pedidos
    .filter(p => p.status !== "cancelado" && new Date(p.created_at).toDateString() === new Date().toDateString())
    .reduce((s, p) => s + Number(p.total), 0);

  let filtrados = pedidos.filter(p => {
    const ms = filtroStatus === "todos" || p.status === filtroStatus;
    const mb = !busca || (p.nome_cliente||"").toLowerCase().includes(busca.toLowerCase()) || String(p.mesa||"").includes(busca);
    return ms && mb;
  });
  if (ordemValor) filtrados = [...filtrados].sort((a,b) => Number(b.total)-Number(a.total));
  const totalPags = Math.ceil(filtrados.length / POR_PAGINA);
  const paginados = filtrados.slice((pagina-1)*POR_PAGINA, pagina*POR_PAGINA);

  return (
    <>
      <div className="page-header">
        <h2>Pedidos</h2>
        <p>
          Realtime ativo
          {ultimaAtu && <span><span className="sync-dot"/>{ultimaAtu.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</span>}
        </p>
      </div>

      {/* Resumo por status */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10, marginBottom:20 }}>
        <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:13, padding:"14px 16px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,var(--accent),var(--accent2))" }}/>
          <div style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1 }}>Faturamento Hoje</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginTop:4, color:"var(--accent)" }}>R$ {totalHoje.toFixed(2).replace(".",",")}</div>
        </div>
        {Object.entries(statusCfg).map(([s,cfg]) => (
          <div key={s} onClick={() => { setFiltroStatus(filtroStatus===s?"todos":s); setPagina(1); }}
            style={{ background:"var(--surface)", border:`1px solid ${filtroStatus===s?cfg.color:"var(--border)"}`, borderRadius:13, padding:"14px 16px", cursor:"pointer", transition:"all 0.2s" }}>
            <div style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, marginBottom:3 }}>{cfg.icon} {cfg.label}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:cfg.color }}>{totais[s]||0}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <input style={{ flex:1, minWidth:160, background:"var(--surface)", border:"1px solid var(--border)", borderRadius:9, padding:"8px 13px", color:"var(--text)", fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none" }}
          placeholder="🔍 Cliente ou mesa..." value={busca} onChange={e=>{setBusca(e.target.value);setPagina(1);}}/>
        <button onClick={()=>{setFiltroStatus("todos");setPagina(1);}} style={{ padding:"8px 12px", borderRadius:9, border:"1px solid var(--border)", background:filtroStatus==="todos"?"var(--accent)":"var(--surface)", color:filtroStatus==="todos"?"#fff":"var(--muted)", cursor:"pointer", fontSize:12 }}>
          Todos ({pedidos.length})
        </button>
        <button onClick={()=>setOrdemValor(v=>!v)} style={{ padding:"8px 12px", borderRadius:9, border:`1px solid ${ordemValor?"var(--accent)":"var(--border)"}`, background:ordemValor?"var(--accent)":"var(--surface)", color:ordemValor?"#fff":"var(--muted)", cursor:"pointer", fontSize:12 }}>
          {ordemValor?"💰 Maior valor":"⏰ Mais recente"}
        </button>
        <button onClick={refresh} style={{ padding:"8px 10px", borderRadius:9, border:"1px solid var(--border)", background:"var(--surface)", color:"var(--muted)", cursor:"pointer", fontSize:13 }}>🔄</button>
      </div>

      {/* Lista */}
      {loading && pedidos.length===0 ? (
        <div style={{ textAlign:"center", padding:60, color:"var(--muted)" }}>Carregando…</div>
      ) : paginados.length===0 ? (
        <div style={{ textAlign:"center", padding:60, color:"var(--muted)" }}>
          <div style={{ fontSize:48, marginBottom:10 }}>📋</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:"var(--text)" }}>Nenhum pedido encontrado</div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {paginados.map(pedido => {
            const cfg = statusCfg[pedido.status]||statusCfg.aguardando_pagamento;
            const prox = getProximoStatus(pedido.status, pedido.metodo_pagamento);
            const itens = Array.isArray(pedido.itens)?pedido.itens:[];
            const isOpen = expandido===pedido.id;
            const dt = new Date(pedido.created_at);
            const minutos = Math.round((new Date()-dt)/60000);
            return (
              <div key={pedido.id} style={{ background:"var(--surface)", border:`1px solid ${isOpen?cfg.color:"var(--border)"}`, borderRadius:14, overflow:"hidden", transition:"border-color 0.2s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 18px", cursor:"pointer" }} onClick={()=>setExpandido(isOpen?null:pedido.id)}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3, flexWrap:"wrap" }}>
                      <span style={{ fontWeight:700, fontSize:14 }}>{pedido.nome_cliente||"Cliente"}</span>
                      <span style={{ fontSize:12, color:"var(--muted)" }}>· Mesa {pedido.mesa||"-"}</span>
                      <span style={{ fontSize:11, padding:"2px 9px", borderRadius:20, background:cfg.bg, color:cfg.color, fontWeight:600 }}>{cfg.icon} {cfg.label}</span>
                      {pedido.metodo_pagamento === "cash" && pedido.status !== "entregue" && pedido.status !== "cancelado" && (
                        <span style={{ fontSize:11, padding:"2px 9px", borderRadius:20, background:"rgba(22,163,74,0.12)", color:"var(--success)", fontWeight:600 }}>💵 Pagar na retirada</span>
                      )}
                      {minutos < 90 && <span style={{ fontSize:11, color:minutos>30?"var(--danger)":minutos>15?"var(--accent2)":"var(--muted)" }}>⏱ {minutos}min</span>}
                    </div>
                    <div style={{ display:"flex", gap:12, fontSize:12, color:"var(--muted)", flexWrap:"wrap" }}>
                      <span>🕐 {dt.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</span>
                      <span>🛒 {itens.length} {itens.length===1?"item":"itens"}</span>
                      <span>💳 {metodoLabel[pedido.metodo_pagamento]||"-"}</span>
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:18, fontWeight:800, color:"var(--accent)", fontFamily:"'Playfair Display',serif" }}>R$ {Number(pedido.total).toFixed(2).replace(".",",")}</div>
                    <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>{isOpen?"▲ fechar":"▼ detalhes"}</div>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ borderTop:"1px solid var(--border)", padding:"14px 18px" }}>
                    <StatusTimeline status={pedido.status}/>
                    <div style={{ marginBottom:12, marginTop:8 }}>
                      <div style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, marginBottom:7 }}>Itens</div>
                      {itens.map((item,i) => (
                        <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid var(--border)", fontSize:13 }}>
                          <div><div style={{ fontWeight:600 }}>{item.name}</div>{item.detail&&<div style={{ fontSize:11, color:"var(--muted)", marginTop:1 }}>{item.detail}</div>}</div>
                          <div style={{ fontWeight:700, color:"var(--accent)", whiteSpace:"nowrap", marginLeft:10 }}>R$ {Number(item.price).toFixed(2).replace(".",",")}</div>
                        </div>
                      ))}
                      <div style={{ display:"flex", justifyContent:"space-between", padding:"9px 0 0", fontWeight:700, fontSize:14 }}>
                        <span>Total</span><span style={{ color:"var(--accent)" }}>R$ {Number(pedido.total).toFixed(2).replace(".",",")}</span>
                      </div>
                    </div>
                    {/* Observação interna */}
                    <div style={{ marginBottom:12 }}>
                      <div style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>📝 Observação interna</div>
                      <div style={{ display:"flex", gap:7 }}>
                        <input style={{ flex:1, background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:8, padding:"7px 11px", color:"var(--text)", fontSize:12, fontFamily:"'DM Sans',sans-serif", outline:"none" }}
                          placeholder="Anotação para a equipe..."
                          value={obs[pedido.id]!==undefined?obs[pedido.id]:(pedido.observacao||"")}
                          onChange={e=>setObs(o=>({...o,[pedido.id]:e.target.value}))}/>
                        <button onClick={()=>salvarObservacao(pedido.id)} style={{ padding:"7px 12px", borderRadius:8, border:"none", background:"var(--accent)", color:"#fff", cursor:"pointer", fontSize:12, fontWeight:600 }}>Salvar</button>
                      </div>
                    </div>
                    {/* Ações */}
                    <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                      {prox&&<button onClick={()=>atualizarStatus(pedido.id,prox,pedido)} style={{ padding:"8px 16px", borderRadius:9, border:"none", background:"var(--accent)", color:"#fff", cursor:"pointer", fontSize:12, fontWeight:600 }}>
                        {statusCfg[prox]?.icon} {
                          pedido.metodo_pagamento === "cash" && prox === "em_preparo" ? "Enviar para preparo" :
                          pedido.metodo_pagamento === "cash" && prox === "entregue"   ? "Confirmar retirada e cobrança" :
                          `→ ${statusCfg[prox]?.label}`
                        }
                      </button>}
                      <button onClick={()=>imprimirPedido(pedido)} style={{ padding:"8px 14px", borderRadius:9, border:"1px solid var(--border)", background:"transparent", color:"var(--muted)", cursor:"pointer", fontSize:12 }}>🖨️ Imprimir</button>
                      {pedido.status!=="cancelado"&&pedido.status!=="entregue"&&(
                        <button onClick={()=>setConfirm({msg:"Cancelar este pedido?",fn:()=>{atualizarStatus(pedido.id,"cancelado",pedido);setConfirm(null);}})} style={{ padding:"8px 14px", borderRadius:9, border:"1px solid var(--danger)", background:"transparent", color:"var(--danger)", cursor:"pointer", fontSize:12, fontWeight:600 }}>✕ Cancelar</button>
                      )}
                      <button onClick={()=>setConfirm({msg:"Excluir pedido permanentemente?",fn:async()=>{setConfirm(null);const{error}=await supabase.from("pedidos").delete().eq("id",pedido.id);if(error){showToast("Erro ✗","error");return;}showToast("Excluído ✓");registrarLog("excluir_pedido",`#${pedido.id?.slice(0,8)}`,usuarioEmail);refresh();}})}
                        style={{ marginLeft:"auto", padding:"8px 12px", borderRadius:9, border:"1px solid var(--border)", background:"transparent", color:"var(--muted)", cursor:"pointer", fontSize:12 }}>🗑️</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Paginação */}
      {totalPags > 1 && (
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:20 }}>
          <button onClick={()=>setPagina(p=>Math.max(1,p-1))} disabled={pagina===1} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid var(--border)", background:"var(--surface)", color:"var(--muted)", cursor:pagina===1?"not-allowed":"pointer", fontSize:13 }}>←</button>
          <span style={{ padding:"7px 14px", fontSize:13, color:"var(--muted)" }}>{pagina} / {totalPags}</span>
          <button onClick={()=>setPagina(p=>Math.min(totalPags,p+1))} disabled={pagina===totalPags} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid var(--border)", background:"var(--surface)", color:"var(--muted)", cursor:pagina===totalPags?"not-allowed":"pointer", fontSize:13 }}>→</button>
        </div>
      )}

      {confirm&&<ConfirmModal mensagem={confirm.msg} onConfirm={confirm.fn} onCancel={()=>setConfirm(null)}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </>
  );
}

// ─── KDS — DISPLAY DE COZINHA ─────────────────────────────────────────────────
function KDSPage() {
  const { dados: pedidos } = useRealtime("pedidos");
  const [agora, setAgora] = useState(new Date());
  const [toast, showToast] = useToast();

  useEffect(() => { const iv = setInterval(() => setAgora(new Date()), 10000); return () => clearInterval(iv); }, []);

  const fila = pedidos.filter(p => p.status === "em_preparo" || p.status === "pago");

  async function marcarPronto(id) {
    await supabase.from("pedidos").update({ status: "entregue", ts_entregue: new Date().toISOString() }).eq("id", id);
    showToast("✅ Pedido entregue!");
  }

  return (
    <>
      <div className="page-header">
        <h2>🍳 Cozinha — KDS</h2>
        <p>{fila.length} pedido{fila.length!==1?"s":""} na fila · {agora.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</p>
      </div>
      {fila.length===0 ? (
        <div className="empty-state"><div className="emoji">✅</div><h3>Tudo em dia!</h3><p>Nenhum pedido aguardando preparo.</p></div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
          {fila.map(pedido => {
            const dt = new Date(pedido.created_at);
            const min = Math.round((agora-dt)/60000);
            const urgente = min>30, aviso = min>15;
            const itens = Array.isArray(pedido.itens)?pedido.itens:[];
            return (
              <div key={pedido.id} className={`kds-card ${urgente?"urgente":""}`} style={{ animation:urgente?"blink 2s infinite":"none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700 }}>{pedido.nome_cliente||"Cliente"}</div>
                    <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>Mesa {pedido.mesa||"-"} · #{(pedido.id||"").slice(0,6)}</div>
                  </div>
                  <div className={`kds-timer ${urgente?"urgente":aviso?"aviso":"ok"}`}>{min}<span style={{ fontSize:12, fontFamily:"'DM Sans',sans-serif", fontWeight:400 }}>min</span></div>
                </div>
                <div style={{ marginBottom:14 }}>
                  {itens.map((item,i) => (
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid var(--border)", fontSize:13 }}>
                      <span style={{ fontWeight:600 }}>{item.name}</span>
                      {item.detail&&<span style={{ fontSize:11, color:"var(--muted)" }}>{item.detail}</span>}
                    </div>
                  ))}
                </div>
                {pedido.observacao&&(
                  <div style={{ background:"rgba(232,98,42,0.1)", border:"1px solid rgba(232,98,42,0.3)", borderRadius:8, padding:"7px 10px", fontSize:12, marginBottom:12 }}>
                    📝 {pedido.observacao}
                  </div>
                )}
                <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ flex:1, fontSize:11, padding:"4px 10px", borderRadius:20, background:statusCfg[pedido.status]?.bg, color:statusCfg[pedido.status]?.color, fontWeight:600, textAlign:"center" }}>
                    {statusCfg[pedido.status]?.icon} {statusCfg[pedido.status]?.label}
                  </span>
                  {pedido.metodo_pagamento === "cash" && (
                    <span style={{ fontSize:11, padding:"4px 10px", borderRadius:20, background:"rgba(22,163,74,0.12)", color:"var(--success)", fontWeight:600 }}>💵 Pagar na retirada</span>
                  )}
                  <button onClick={()=>marcarPronto(pedido.id)} style={{ padding:"7px 16px", borderRadius:9, border:"none", background:"var(--success)", color:"#fff", cursor:"pointer", fontSize:12, fontWeight:700 }}>
                    {pedido.metodo_pagamento === "cash" ? "✓ Retirado" : "✓ Pronto"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </>
  );
}

// ─── MESAS PAGE ───────────────────────────────────────────────────────────────
function MesasPage({ usuarioEmail }) {
  const { dados: mesas, loading, refresh } = useRealtime("mesas");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ numero:"", capacidade:"4", status:"livre" });
  const [confirm, setConfirm] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, showToast] = useToast();

  function abrirModal(mesa=null) {
    setErrors({});
    if (mesa) { setEditando(mesa); setForm({ numero:mesa.numero, capacidade:mesa.capacidade, status:mesa.status }); }
    else { setEditando(null); setForm({ numero:"", capacidade:"4", status:"livre" }); }
    setModalOpen(true);
  }

  async function salvar() {
    const e={}; if (!form.numero) e.numero="Obrigatório"; setErrors(e); if (Object.keys(e).length) return;
    const dados = { numero:String(form.numero), capacidade:parseInt(form.capacidade), status:form.status };
    const {error} = editando ? await supabase.from("mesas").update(dados).eq("id",editando.id) : await supabase.from("mesas").insert([dados]);
    if (error) { showToast("Erro ✗","error"); return; }
    showToast(editando?"Mesa atualizada ✓":"Mesa criada ✓");
    registrarLog("mesa",`${editando?"Editou":"Criou"} mesa ${form.numero}`,usuarioEmail);
    setModalOpen(false); refresh();
  }

  const statusMesa = {
    livre:    { label:"Livre",     color:"var(--success)", bg:"rgba(76,175,125,0.15)" },
    ocupada:  { label:"Ocupada",   color:"var(--danger)",  bg:"rgba(232,66,66,0.15)" },
    reservada:{ label:"Reservada", color:"var(--accent2)", bg:"rgba(245,166,35,0.15)" },
    fechada:  { label:"Fechada",   color:"var(--muted)",   bg:"rgba(138,128,112,0.15)" },
  };

  const livres = mesas.filter(m=>m.status==="livre").length;
  const ocupadas = mesas.filter(m=>m.status==="ocupada").length;
  const reservadas = mesas.filter(m=>m.status==="reservada").length;

  return (
    <>
      <div className="page-header">
        <h2>Mesas 🪑</h2>
        <p>{livres} livres · {ocupadas} ocupadas · {reservadas} reservadas · {mesas.length} total</p>
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:20 }}>
        <button className="btn-primary" onClick={()=>abrirModal()}>+ Nova Mesa</button>
      </div>
      {loading ? <div style={{ textAlign:"center", padding:60, color:"var(--muted)" }}>Carregando…</div> : mesas.length===0 ? (
        <div className="empty-state"><div className="emoji">🪑</div><h3>Nenhuma mesa cadastrada</h3><p>Cadastre as mesas do restaurante.</p></div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12 }}>
          {[...mesas].sort((a,b)=>String(a.numero).localeCompare(String(b.numero),undefined,{numeric:true})).map(mesa => {
            const cfg = statusMesa[mesa.status]||statusMesa.livre;
            return (
              <div key={mesa.id} className="mesa-card" style={{ border:`1px solid ${cfg.color}33` }}>
                <div className="mesa-numero" style={{ color:cfg.color }}>{mesa.numero}</div>
                <div style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:1, color:cfg.color, marginTop:3 }}>{cfg.label}</div>
                <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>👥 {mesa.capacidade} pessoas</div>
                <div style={{ display:"flex", gap:4, marginTop:10, flexWrap:"wrap", justifyContent:"center" }}>
                  {Object.entries(statusMesa).filter(([s])=>s!==mesa.status).map(([s,c])=>(
                    <button key={s} onClick={async()=>{await supabase.from("mesas").update({status:s}).eq("id",mesa.id);showToast(`Mesa ${mesa.numero} → ${c.label}`);refresh();}}
                      style={{ flex:1, minWidth:48, padding:"3px 5px", borderRadius:6, border:`1px solid ${c.color}`, background:"transparent", color:c.color, cursor:"pointer", fontSize:10, fontWeight:600 }}>{c.label}</button>
                  ))}
                </div>
                <div style={{ display:"flex", gap:4, marginTop:6, justifyContent:"center" }}>
                  <button className="action-btn" onClick={()=>abrirModal(mesa)}>✏️</button>
                  <button className="action-btn danger" onClick={()=>setConfirm({msg:`Excluir mesa ${mesa.numero}?`,fn:async()=>{setConfirm(null);await supabase.from("mesas").delete().eq("id",mesa.id);showToast("Excluída ✓");refresh();}})}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {modalOpen&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModalOpen(false)}>
          <div className="modal">
            <div className="modal-title">{editando?"Editar Mesa":"Nova Mesa"}</div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Número *</label>
                <input className={`form-input ${errors.numero?"error":""}`} placeholder="Ex: 1 ou A1" value={form.numero} onChange={e=>setForm({...form,numero:e.target.value})}/>
                {errors.numero&&<div className="field-error">{errors.numero}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Capacidade</label>
                <input className="form-input" type="number" min="1" max="20" value={form.capacidade} onChange={e=>setForm({...form,capacidade:e.target.value})}/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                <option value="livre">Livre</option>
                <option value="ocupada">Ocupada</option>
                <option value="reservada">Reservada</option>
                <option value="fechada">Fechada</option>
              </select>
            </div>
            <div className="form-actions">
              <button className="btn-cancel" onClick={()=>setModalOpen(false)}>Cancelar</button>
              <button className="btn-primary btn-save" onClick={salvar}>{editando?"Salvar":"Criar Mesa"}</button>
            </div>
          </div>
        </div>
      )}
      {confirm&&<ConfirmModal mensagem={confirm.msg} onConfirm={confirm.fn} onCancel={()=>setConfirm(null)}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </>
  );
}

// ─── CLIENTES PAGE ────────────────────────────────────────────────────────────
function ClientesPage() {
  const { dados: pedidos, loading } = useRealtime("pedidos");
  const [busca, setBusca] = useState("");

  const clientesMap = {};
  pedidos.forEach(p => {
    const key = (p.nome_cliente||"Cliente").trim() + "|" + (p.telefone||"");
    if (!clientesMap[key]) clientesMap[key] = { nome:p.nome_cliente||"Cliente", telefone:p.telefone||"-", pedidos:[], total:0, ultimo:p.created_at };
    clientesMap[key].pedidos.push(p);
    clientesMap[key].total += Number(p.total);
    if (p.created_at > clientesMap[key].ultimo) clientesMap[key].ultimo = p.created_at;
  });

  let clientes = Object.values(clientesMap).sort((a,b)=>b.total-a.total);
  if (busca) clientes = clientes.filter(c=>c.nome.toLowerCase().includes(busca.toLowerCase())||c.telefone.includes(busca));

  if (loading) return <div style={{ textAlign:"center", padding:60, color:"var(--muted)" }}>Carregando…</div>;

  return (
    <>
      <div className="page-header"><h2>Clientes 👥</h2><p>{clientes.length} clientes identificados</p></div>
      <div style={{ marginBottom:20 }}>
        <input className="search-box" placeholder="🔍 Nome ou telefone..." value={busca} onChange={e=>setBusca(e.target.value)} style={{ maxWidth:360 }}/>
      </div>
      {clientes.length===0 ? (
        <div className="empty-state"><div className="emoji">👥</div><h3>Nenhum cliente encontrado</h3></div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {clientes.map((c,i) => {
            const cancelados = c.pedidos.filter(p=>p.status==="cancelado").length;
            const ticket = c.total / c.pedidos.length;
            const prods = {}; c.pedidos.forEach(p=>{(Array.isArray(p.itens)?p.itens:[]).forEach(item=>{prods[item.name]=(prods[item.name]||0)+1;});});
            const fav = Object.entries(prods).sort((a,b)=>b[1]-a[1])[0]?.[0];
            return (
              <div key={i} className="cliente-card">
                <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                  <div style={{ width:42, height:42, borderRadius:"50%", background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Playfair Display',serif", fontSize:18, color:"#fff", flexShrink:0 }}>
                    {c.nome.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8 }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:15 }}>{c.nome}</div>
                        <div style={{ fontSize:12, color:"var(--muted)", marginTop:1 }}>📞 {c.telefone}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:"var(--accent)" }}>R$ {c.total.toFixed(2).replace(".",",")}</div>
                        <div style={{ fontSize:11, color:"var(--muted)" }}>total gasto</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:16, marginTop:10, flexWrap:"wrap" }}>
                      <div style={{ textAlign:"center" }}><div style={{ fontFamily:"'Playfair Display',serif", fontSize:18 }}>{c.pedidos.length}</div><div style={{ fontSize:11, color:"var(--muted)" }}>pedidos</div></div>
                      <div style={{ textAlign:"center" }}><div style={{ fontFamily:"'Playfair Display',serif", fontSize:18 }}>R$ {ticket.toFixed(0)}</div><div style={{ fontSize:11, color:"var(--muted)" }}>ticket médio</div></div>
                      <div style={{ textAlign:"center" }}><div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, color:cancelados>0?"var(--danger)":"var(--text)" }}>{cancelados}</div><div style={{ fontSize:11, color:"var(--muted)" }}>cancelados</div></div>
                      {fav&&<div><div style={{ fontSize:12, fontWeight:600, color:"var(--accent2)" }}>❤️ {fav}</div><div style={{ fontSize:11, color:"var(--muted)" }}>favorito</div></div>}
                    </div>
                    <div style={{ fontSize:11, color:"var(--muted)", marginTop:8 }}>Último pedido: {new Date(c.ultimo).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"})}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── LOG DE ATIVIDADES ────────────────────────────────────────────────────────
function LogPage() {
  const { dados: logs, loading } = useRealtime("logs_admin");
  const [busca, setBusca] = useState("");
  const acaoCfg = {
    status_pedido:  { icon:"🔄", color:"var(--blue)" },
    excluir_pedido: { icon:"🗑️", color:"var(--danger)" },
    produto:        { icon:"🍕", color:"var(--accent)" },
    mesa:           { icon:"🪑", color:"var(--accent2)" },
    promocao:       { icon:"🔥", color:"var(--success)" },
  };
  const filtrados = busca ? logs.filter(l=>(l.acao||"").includes(busca)||(l.detalhe||"").toLowerCase().includes(busca.toLowerCase())) : logs;
  return (
    <>
      <div className="page-header"><h2>Log de Atividades 📋</h2><p>{logs.length} registros</p></div>
      <div style={{ marginBottom:20 }}>
        <input className="search-box" placeholder="🔍 Filtrar..." value={busca} onChange={e=>setBusca(e.target.value)} style={{ maxWidth:360 }}/>
      </div>
      <div className="table-wrap">
        {loading?<div style={{ textAlign:"center", padding:40, color:"var(--muted)" }}>Carregando…</div>:filtrados.length===0?(
          <div style={{ textAlign:"center", padding:40, color:"var(--muted)", fontSize:13 }}>Nenhum registro</div>
        ):filtrados.map((log,i) => {
          const cfg = acaoCfg[log.acao]||{ icon:"📝", color:"var(--muted)" };
          return (
            <div key={i} className="log-row" style={{ padding:"12px 18px" }}>
              <div className="log-icon" style={{ background:cfg.color+"20" }}>{cfg.icon}</div>
              <div className="log-time">{new Date(log.created_at).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</div>
              <div>
                <div style={{ fontWeight:600 }}>{log.detalhe||log.acao}</div>
                <div style={{ fontSize:11, color:"var(--accent)", marginTop:1 }}>{log.usuario}</div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ─── FINANCEIRO PAGE ──────────────────────────────────────────────────────────
function FinanceiroPage() {
  const { dados: pedidos, loading } = useRealtime("pedidos");
  const [periodo, setPeriodo] = useState("hoje");
  const [metaDiaria, setMetaDiaria] = useState(() => { try { return Number(localStorage.getItem("metaDiaria"))||1000; } catch { return 1000; } });
  const [editandoMeta, setEditandoMeta] = useState(false);
  const [novaMetaInput, setNovaMetaInput] = useState("");

  function filtrarPorPeriodo(lista) {
    const agora = new Date();
    return lista.filter(p => {
      const dt = new Date(p.created_at);
      if (periodo==="hoje") return dt.toDateString()===agora.toDateString();
      if (periodo==="semana") return (agora-dt)/(1000*60*60*24)<=7;
      if (periodo==="mes") return dt.getMonth()===agora.getMonth()&&dt.getFullYear()===agora.getFullYear();
      return true;
    });
  }

  function exportarCSV() {
    const filtrados = filtrarPorPeriodo(pedidos).filter(p=>p.status!=="cancelado");
    const header = "ID,Cliente,Mesa,Pagamento,Total,Status,Data";
    const rows = filtrados.map(p=>`${(p.id||"").slice(0,8)},${p.nome_cliente||""},${p.mesa||""},${metodoLabel[p.metodo_pagamento]||p.metodo_pagamento||""},${Number(p.total).toFixed(2)},${statusCfg[p.status]?.label||p.status},${new Date(p.created_at).toLocaleString("pt-BR")}`);
    const csv = [header,...rows].join("\n");
    const blob = new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download=`financeiro_${periodo}_${Date.now()}.csv`; a.click();
  }

  const filtrados = filtrarPorPeriodo(pedidos);
  const pagos = filtrados.filter(p=>p.status!=="cancelado");
  const cancelados = filtrados.filter(p=>p.status==="cancelado");
  const faturamento = pagos.reduce((s,p)=>s+Number(p.total),0);
  const ticketMedio = pagos.length>0?faturamento/pagos.length:0;
  const totalCancelado = cancelados.reduce((s,p)=>s+Number(p.total),0);

  const hoje = new Date().toDateString();
  const fatHoje = pedidos.filter(p=>p.status!=="cancelado"&&new Date(p.created_at).toDateString()===hoje).reduce((s,p)=>s+Number(p.total),0);
  const metaPct = Math.min(100,(fatHoje/metaDiaria)*100);

  const porMetodo = {}; pagos.forEach(p=>{const m=metodoLabel[p.metodo_pagamento]||p.metodo_pagamento||"Outros"; porMetodo[m]=(porMetodo[m]||0)+Number(p.total);});
  const maxMetodo = Math.max(...Object.values(porMetodo),1);

  const topProdutos = {}; pagos.forEach(p=>{(Array.isArray(p.itens)?p.itens:[]).forEach(item=>{if(!topProdutos[item.name])topProdutos[item.name]={qtd:0,total:0};topProdutos[item.name].qtd+=1;topProdutos[item.name].total+=Number(item.price);});});
  const topList = Object.entries(topProdutos).sort((a,b)=>b[1].qtd-a[1].qtd).slice(0,8);

  const porHora = Array(24).fill(0);
  pedidos.filter(p=>new Date(p.created_at).toDateString()===hoje).forEach(p=>{porHora[new Date(p.created_at).getHours()]++;});
  const horaMax = Math.max(...porHora,1);
  const horaPico = porHora.indexOf(Math.max(...porHora));

  // Gráfico 14 dias
  const ultDias = [];
  for (let i=13;i>=0;i--) { const d=new Date(); d.setDate(d.getDate()-i); ultDias.push({date:d,fat:0,label:d.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})}); }
  pedidos.filter(p=>p.status!=="cancelado").forEach(p=>{
    const ds=new Date(p.created_at).toDateString();
    const idx=ultDias.findIndex(d=>d.date.toDateString()===ds);
    if(idx>=0) ultDias[idx].fat+=Number(p.total);
  });
  const maxDia = Math.max(...ultDias.map(d=>d.fat),1);

  if (loading) return <div style={{ textAlign:"center", padding:60, color:"var(--muted)" }}>Carregando…</div>;

  return (
    <>
      <div className="page-header"><h2>Financeiro 💰</h2><p>Análise de receita, pedidos e desempenho — Realtime <span className="sync-dot"/></p></div>

      {/* Meta diária */}
      <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:"18px 22px", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:10 }}>
          <div>
            <div style={{ fontSize:12, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1 }}>Meta Diária</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, marginTop:2 }}>
              <span style={{ color:"var(--accent)" }}>R$ {fatHoje.toFixed(2).replace(".",",")}</span>
              <span style={{ color:"var(--muted)", fontSize:14 }}> / R$ {metaDiaria.toLocaleString("pt-BR")}</span>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:20, fontWeight:700, color:metaPct>=100?"var(--success)":metaPct>=70?"var(--accent2)":"var(--accent)" }}>{metaPct.toFixed(0)}%</span>
            {editandoMeta ? (
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <input style={{ background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:8, padding:"6px 10px", color:"var(--text)", fontSize:13, width:100, fontFamily:"'DM Sans',sans-serif", outline:"none" }}
                  type="number" value={novaMetaInput} onChange={e=>setNovaMetaInput(e.target.value)} placeholder={metaDiaria}/>
                <button onClick={()=>{const v=Number(novaMetaInput);if(v>0){setMetaDiaria(v);localStorage.setItem("metaDiaria",v);}setEditandoMeta(false);}} style={{ padding:"6px 12px", borderRadius:8, border:"none", background:"var(--accent)", color:"#fff", cursor:"pointer", fontSize:12 }}>OK</button>
                <button onClick={()=>setEditandoMeta(false)} style={{ padding:"6px 10px", borderRadius:8, border:"1px solid var(--border)", background:"transparent", color:"var(--muted)", cursor:"pointer", fontSize:12 }}>×</button>
              </div>
            ) : (
              <button onClick={()=>{setNovaMetaInput(String(metaDiaria));setEditandoMeta(true);}} style={{ padding:"5px 10px", borderRadius:8, border:"1px solid var(--border)", background:"transparent", color:"var(--muted)", cursor:"pointer", fontSize:11 }}>✏️ Editar meta</button>
            )}
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width:`${metaPct}%`, background:metaPct>=100?"var(--success)":metaPct>=70?"var(--accent2)":"var(--accent)" }}/>
        </div>
        {metaPct>=100&&<div style={{ fontSize:12, color:"var(--success)", marginTop:6 }}>🎉 Meta do dia atingida!</div>}
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div className="periodo-tabs">
          {[["hoje","Hoje"],["semana","7 dias"],["mes","Este mês"],["total","Tudo"]].map(([v,l])=>(
            <button key={v} className={`periodo-tab ${periodo===v?"active":""}`} onClick={()=>setPeriodo(v)}>{l}</button>
          ))}
        </div>
        <button className="btn-primary" onClick={exportarCSV} style={{ fontSize:12, padding:"8px 16px" }}>📥 Exportar CSV</button>
      </div>

      <div className="fin-grid">
        <div className="fin-card green"><div className="fin-label">Faturamento</div><div className="fin-value">R$ {faturamento.toFixed(2).replace(".",",")}</div><div className="fin-sub">{pagos.length} pedidos</div><div className="fin-icon">💰</div></div>
        <div className="fin-card orange"><div className="fin-label">Ticket Médio</div><div className="fin-value">R$ {ticketMedio.toFixed(2).replace(".",",")}</div><div className="fin-sub">por pedido pago</div><div className="fin-icon">🎯</div></div>
        <div className="fin-card blue"><div className="fin-label">Total Pedidos</div><div className="fin-value">{filtrados.length}</div><div className="fin-sub">{pagos.length} pagos · {cancelados.length} cancel.</div><div className="fin-icon">📋</div></div>
        <div className="fin-card red"><div className="fin-label">Cancelamentos</div><div className="fin-value">R$ {totalCancelado.toFixed(2).replace(".",",")}</div><div className="fin-sub">{cancelados.length} pedidos</div><div className="fin-icon">❌</div></div>
        <div className="fin-card purple"><div className="fin-label">Hora de Pico</div><div className="fin-value">{horaPico.toString().padStart(2,"0")}h</div><div className="fin-sub">{porHora[horaPico]} pedidos hoje</div><div className="fin-icon">🕐</div></div>
        <div className="fin-card gray"><div className="fin-label">Tx Cancelamento</div><div className="fin-value">{filtrados.length>0?((cancelados.length/filtrados.length)*100).toFixed(1):"0"}%</div><div className="fin-sub">do total</div><div className="fin-icon">📊</div></div>
      </div>

      {/* Gráfico 14 dias */}
      <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:20, marginBottom:18 }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, marginBottom:14 }}>📈 Receita — Últimos 14 Dias</h3>
        <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:90 }}>
          {ultDias.map((d,i)=>{
            const h=Math.max((d.fat/maxDia)*82,d.fat>0?4:0);
            const eHoje=d.date.toDateString()===hoje;
            return <div key={i} style={{ flex:1, cursor:"default" }} title={`${d.label}: R$ ${d.fat.toFixed(2)}`}><div style={{ width:"100%", height:`${h}px`, borderRadius:"3px 3px 0 0", background:eHoje?"var(--accent)":"rgba(232,98,42,0.35)", transition:"height 0.3s" }}/></div>;
          })}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:5, fontSize:10, color:"var(--muted)" }}>
          <span>{ultDias[0].label}</span><span>{ultDias[6].label}</span><span>{ultDias[13].label}</span>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18 }}>
        <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:20 }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, marginBottom:16 }}>💳 Por Pagamento</h3>
          {Object.keys(porMetodo).length===0?<div style={{ color:"var(--muted)", fontSize:13, textAlign:"center", padding:16 }}>Sem dados</div>:(
            <div className="metodo-bar">{Object.entries(porMetodo).sort((a,b)=>b[1]-a[1]).map(([m,v])=>(
              <div key={m} className="metodo-row">
                <span className="metodo-label">{m}</span>
                <div className="metodo-track"><div className="metodo-fill" style={{ width:`${(v/maxMetodo)*100}%` }}/></div>
                <span className="metodo-val">R$ {v.toFixed(0)}</span>
              </div>
            ))}</div>
          )}
        </div>
        <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:20 }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17, marginBottom:16 }}>🕐 Pedidos por Hora</h3>
          <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:75 }}>
            {porHora.map((v,h)=><div key={h} style={{ flex:1 }}><div style={{ width:"100%", borderRadius:"3px 3px 0 0", height:`${Math.max((v/horaMax)*68,v>0?4:0)}px`, background:h===horaPico&&v>0?"var(--accent)":"rgba(232,98,42,0.3)", transition:"height 0.3s" }}/></div>)}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4, fontSize:10, color:"var(--muted)" }}>
            <span>00h</span><span>06h</span><span>12h</span><span>18h</span><span>23h</span>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <div style={{ padding:"16px 18px", borderBottom:"1px solid var(--border)" }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:17 }}>🍕 Produtos Mais Vendidos</h3>
        </div>
        <div className="table-head" style={{ gridTemplateColumns:"2fr 1fr 1fr 1fr" }}><span>Produto</span><span>Vendas</span><span>Receita</span><span>Média</span></div>
        {topList.length===0?<div style={{ padding:20, textAlign:"center", color:"var(--muted)", fontSize:13 }}>Sem dados</div>:topList.map(([nome,d],i)=>(
          <div key={nome} className="table-row" style={{ gridTemplateColumns:"2fr 1fr 1fr 1fr" }}>
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <span style={{ width:20, height:20, borderRadius:5, background:i<3?"var(--accent)":"var(--surface2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:i<3?"#fff":"var(--muted)", flexShrink:0 }}>{i+1}</span>
              <span style={{ fontWeight:500 }}>{nome}</span>
            </div>
            <span style={{ color:"var(--success)", fontWeight:600 }}>{d.qtd}x</span>
            <span style={{ color:"var(--accent)", fontWeight:600 }}>R$ {d.total.toFixed(2)}</span>
            <span style={{ color:"var(--muted)" }}>R$ {(d.total/d.qtd).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── PROMOÇÕES PAGE ────────────────────────────────────────────────────────────
function PromocoesPage({ usuarioEmail }) {
  const { dados: promocoes, loading, refresh } = useRealtime("promocoes");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [toast, showToast] = useToast();
  const [confirm, setConfirm] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ nome:"", descricao:"", tipo:"percentual", valor:"", codigo:"", validade:"", ativo:true });

  function abrirModal(p=null) {
    setErrors({});
    if (p) { setEditando(p); setForm({ nome:p.nome, descricao:p.descricao||"", tipo:p.tipo, valor:p.valor, codigo:p.codigo||"", validade:p.validade?p.validade.slice(0,10):"", ativo:p.ativo }); }
    else { setEditando(null); setForm({ nome:"", descricao:"", tipo:"percentual", valor:"", codigo:"", validade:"", ativo:true }); }
    setModalOpen(true);
  }

  function validar() {
    const e={};
    if (!form.nome.trim()) e.nome="Obrigatório";
    if (!form.valor||isNaN(form.valor)||Number(form.valor)<=0) e.valor="Inválido";
    if (form.tipo==="percentual"&&Number(form.valor)>100) e.valor="Máx. 100%";
    setErrors(e); return Object.keys(e).length===0;
  }

  async function salvar() {
    if (!validar()) return;
    const dados={...form,valor:parseFloat(form.valor)};
    if (!dados.validade) delete dados.validade;
    const {error} = editando ? await supabase.from("promocoes").update(dados).eq("id",editando.id) : await supabase.from("promocoes").insert([dados]);
    if (error) { showToast("Erro ✗","error"); return; }
    showToast(editando?"Atualizada ✓":"Criada ✓");
    registrarLog("promocao",`${editando?"Editou":"Criou"} promoção ${form.nome}`,usuarioEmail);
    setModalOpen(false); refresh();
  }

  function getStatus(p) {
    if (!p.ativo) return "inativo";
    if (p.validade&&new Date(p.validade)<new Date()) return "expirado";
    return "ativo";
  }

  return (
    <>
      <div className="page-header"><h2>Promoções 🔥</h2><p>Cupons e descontos do cardápio</p></div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:20 }}>
        <button className="btn-primary" onClick={()=>abrirModal()}>+ Nova Promoção</button>
      </div>
      {loading?<div style={{ textAlign:"center", padding:60, color:"var(--muted)" }}>Carregando…</div>:promocoes.length===0?(
        <div className="empty-state"><div className="emoji">🔥</div><h3>Nenhuma promoção</h3><p>Crie cupons para atrair mais clientes.</p></div>
      ):(
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
          {promocoes.map(p=>{
            const st=getStatus(p);
            return (
              <div key={p.id} className="promo-card">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div><div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, marginBottom:3 }}>{p.nome}</div>{p.descricao&&<div style={{ fontSize:12, color:"var(--muted)" }}>{p.descricao}</div>}</div>
                  <span className={`promo-badge ${st}`}>{st==="ativo"?"● Ativo":st==="expirado"?"⏰ Expirado":"○ Inativo"}</span>
                </div>
                <div style={{ display:"flex", gap:9, marginBottom:12, flexWrap:"wrap" }}>
                  <div style={{ background:"var(--surface2)", borderRadius:8, padding:"7px 12px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:"var(--muted)", marginBottom:2 }}>Desconto</div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:19, color:"var(--accent)" }}>{p.tipo==="percentual"?`${p.valor}%`:`R$ ${Number(p.valor).toFixed(2)}`}</div>
                  </div>
                  {p.codigo&&<div style={{ background:"var(--surface2)", borderRadius:8, padding:"7px 12px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:"var(--muted)", marginBottom:2 }}>Cupom</div>
                    <div style={{ fontSize:13, fontWeight:700, letterSpacing:2, color:"var(--accent2)" }}>{p.codigo}</div>
                  </div>}
                  {p.validade&&<div style={{ background:"var(--surface2)", borderRadius:8, padding:"7px 12px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:"var(--muted)", marginBottom:2 }}>Validade</div>
                    <div style={{ fontSize:12, fontWeight:600 }}>{new Date(p.validade).toLocaleDateString("pt-BR")}</div>
                  </div>}
                </div>
                <div style={{ display:"flex", gap:5 }}>
                  <button className="action-btn" onClick={()=>abrirModal(p)}>✏️</button>
                  <button className="action-btn" onClick={async()=>{await supabase.from("promocoes").update({ativo:!p.ativo}).eq("id",p.id);refresh();}}>{p.ativo?"⏸️":"▶️"}</button>
                  <button className="action-btn danger" onClick={()=>setConfirm({msg:"Excluir promoção?",fn:async()=>{setConfirm(null);await supabase.from("promocoes").delete().eq("id",p.id);showToast("Excluída ✓");refresh();}})}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {modalOpen&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModalOpen(false)}>
          <div className="modal">
            <div className="modal-title">{editando?"Editar Promoção":"Nova Promoção"}</div>
            <div className="form-group"><label className="form-label">Nome *</label><input className={`form-input ${errors.nome?"error":""}`} placeholder="Ex: 20% toda segunda" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})}/>{errors.nome&&<div className="field-error">{errors.nome}</div>}</div>
            <div className="form-group"><label className="form-label">Descrição</label><textarea className="form-textarea" placeholder="Detalhes..." value={form.descricao} onChange={e=>setForm({...form,descricao:e.target.value})}/></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Tipo</label><select className="form-select" value={form.tipo} onChange={e=>setForm({...form,tipo:e.target.value})}><option value="percentual">Percentual (%)</option><option value="fixo">Valor Fixo (R$)</option></select></div>
              <div className="form-group"><label className="form-label">Valor *</label><input className={`form-input ${errors.valor?"error":""}`} type="number" step="0.01" value={form.valor} onChange={e=>setForm({...form,valor:e.target.value})}/>{errors.valor&&<div className="field-error">{errors.valor}</div>}</div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Código Cupom</label><input className="form-input" placeholder="PIZZA10" value={form.codigo} onChange={e=>setForm({...form,codigo:e.target.value.toUpperCase()})}/></div>
              <div className="form-group"><label className="form-label">Validade</label><input className="form-input" type="date" value={form.validade} onChange={e=>setForm({...form,validade:e.target.value})}/></div>
            </div>
            <div className="form-group"><label style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer" }}><input type="checkbox" checked={form.ativo} onChange={e=>setForm({...form,ativo:e.target.checked})}/><span style={{ fontSize:13 }}>Ativa</span></label></div>
            <div className="form-actions"><button className="btn-cancel" onClick={()=>setModalOpen(false)}>Cancelar</button><button className="btn-primary btn-save" onClick={salvar}>{editando?"Salvar":"Criar"}</button></div>
          </div>
        </div>
      )}
      {confirm&&<ConfirmModal mensagem={confirm.msg} onConfirm={confirm.fn} onCancel={()=>setConfirm(null)}/>}
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </>
  );
}

// ─── CONFIGURAÇÕES PAGE ────────────────────────────────────────────────────────
function ConfiguracoesPage({ usuario }) {
  const [config, setConfig] = useState({ notificacao_aba:true, som_novos_pedidos:true });
  const [toast, showToast] = useToast();

  useEffect(() => { try { const s=JSON.parse(localStorage.getItem("painelAdminConfig")||"{}"); setConfig(c=>({...c,...s})); } catch {} }, []);

  function salvar(key, value) {
    const n={...config,[key]:value}; setConfig(n);
    localStorage.setItem("painelAdminConfig",JSON.stringify(n));
    showToast("Salvo ✓");
  }

  return (
    <>
      <div className="page-header"><h2>Configurações ⚙️</h2><p>Preferências do painel</p></div>
      <div className="config-section">
        <div className="config-title">👤 Conta</div>
        <div style={{ padding:"12px 0", borderBottom:"1px solid var(--border)" }}><div style={{ fontSize:11, color:"var(--muted)", marginBottom:3 }}>E-mail</div><div style={{ fontSize:14 }}>{usuario?.email||"—"}</div></div>
        <div style={{ padding:"12px 0" }}><div style={{ fontSize:11, color:"var(--muted)", marginBottom:3 }}>Perfil</div><div style={{ fontSize:14 }}>Administrador</div></div>
      </div>
      <div className="config-section">
        <div className="config-title">🔔 Notificações</div>
        <div className="toggle-row">
          <div><div style={{ fontSize:13, fontWeight:500 }}>Piscar título da aba</div><div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>Pisca "🔔 NOVO PEDIDO!" ao receber pedido</div></div>
          <label className="toggle"><input type="checkbox" checked={config.notificacao_aba} onChange={e=>salvar("notificacao_aba",e.target.checked)}/><span className="toggle-slider"/></label>
        </div>
        <div className="toggle-row">
          <div><div style={{ fontSize:13, fontWeight:500 }}>Som de notificação</div><div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>Bip sonoro ao receber novo pedido</div></div>
          <label className="toggle"><input type="checkbox" checked={config.som_novos_pedidos} onChange={e=>salvar("som_novos_pedidos",e.target.checked)}/><span className="toggle-slider"/></label>
        </div>
      </div>
      <div className="config-section">
        <div className="config-title">🔄 Sincronização</div>
        <div className="toggle-row">
          <div><div style={{ fontSize:13, fontWeight:500 }}>Supabase Realtime (WebSocket)</div><div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>Atualização instantânea — sem polling, sem piscar</div></div>
          <label className="toggle"><input type="checkbox" checked disabled/><span className="toggle-slider"/></label>
        </div>
      </div>
      <div className="config-section">
        <div className="config-title">🗄️ Tabelas necessárias no Supabase</div>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:4 }}>
          {[
            ["pedidos","id, itens, total, metodo_pagamento, nome_cliente, mesa, telefone, status, observacao, created_at, ts_pago, ts_em_preparo, ts_entregue"],
            ["produtos","id, nome, descricao, preco, categoria, imagem_url, ativo, estoque, estoque_minimo, created_at"],
            ["mesas","id, numero, capacidade, status, created_at"],
            ["promocoes","id, nome, descricao, tipo, valor, codigo, validade, ativo, created_at"],
            ["reservas","id, nome, telefone, data, horario, pessoas, observacao, status, created_at"],
            ["logs_admin","id, acao, detalhe, usuario, created_at"],
          ].map(([t,cols])=>(
            <div key={t} style={{ background:"var(--surface2)", borderRadius:8, padding:"10px 14px" }}>
              <div style={{ fontWeight:600, color:"var(--accent)", fontSize:13 }}>{t}</div>
              <div style={{ fontSize:11, color:"var(--muted)", marginTop:3 }}>{cols}</div>
            </div>
          ))}
        </div>
      </div>
      {toast&&<Toast msg={toast.msg} type={toast.type}/>}
    </>
  );
}


// ─── RESERVAS PAGE ────────────────────────────────────────────────────────────
function ReservasPage({ usuarioEmail }) {
  const { dados: reservas, loading, refresh } = useRealtime("reservas");
  const [filtro, setFiltro] = useState("todos");
  const [busca, setBusca] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [modalDetalhe, setModalDetalhe] = useState(null);
  const [toast, showToast] = useToast();

  const statusCfgRes = {
    pendente:   { label:"Pendente",   color:"#f5a623", bg:"rgba(245,166,35,0.12)",  icon:"⏳" },
    confirmada: { label:"Confirmada", color:"#16a34a", bg:"rgba(22,163,74,0.12)",   icon:"✅" },
    cancelada:  { label:"Cancelada",  color:"#dc2626", bg:"rgba(220,38,38,0.12)",   icon:"✕"  },
    concluida:  { label:"Concluída",  color:"#6b7280", bg:"rgba(107,114,128,0.12)", icon:"🏁" },
  };

  async function atualizarStatus(id, novoStatus) {
    const { error } = await supabase.from("reservas").update({ status: novoStatus }).eq("id", id);
    if (error) { showToast("Erro ao atualizar ✗", "error"); return; }
    showToast(`${statusCfgRes[novoStatus]?.icon} Reserva → ${statusCfgRes[novoStatus]?.label}`);
    registrarLog("reserva", `#${id?.slice(0,8)} → ${novoStatus}`, usuarioEmail);
    setModalDetalhe(null);
    refresh();
  }

  async function excluir(id) {
    const { error } = await supabase.from("reservas").delete().eq("id", id);
    if (error) { showToast("Erro ao excluir ✗", "error"); return; }
    showToast("Reserva excluída ✓");
    setConfirm(null); setModalDetalhe(null); refresh();
  }

  const hoje = new Date().toDateString();
  const hojeISO = new Date().toISOString().slice(0, 10);

  const totais = Object.keys(statusCfgRes).reduce((a, s) => { a[s] = reservas.filter(r => r.status === s).length; return a; }, {});
  const hojeCount = reservas.filter(r => r.data === hojeISO).length;

  let filtradas = reservas.filter(r => {
    const ms = filtro === "todos" || r.status === filtro;
    const mb = !busca || (r.nome||"").toLowerCase().includes(busca.toLowerCase()) || (r.telefone||"").includes(busca) || (r.data||"").includes(busca);
    return ms && mb;
  }).sort((a, b) => {
    // Sort by date+time ascending
    const da = (a.data||"") + (a.horario||"");
    const db = (b.data||"") + (b.horario||"");
    return da.localeCompare(db);
  });

  return (
    <>
      <div className="page-header">
        <h2>Reservas 🍽️</h2>
        <p>Gerencie as reservas de mesas — Realtime <span className="sync-dot"/></p>
      </div>

      {/* Resumo */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10, marginBottom:20 }}>
        <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:13, padding:"14px 16px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,var(--accent),var(--accent2))" }}/>
          <div style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1 }}>Reservas Hoje</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, marginTop:4, color:"var(--accent)" }}>{hojeCount}</div>
        </div>
        {Object.entries(statusCfgRes).map(([s, cfg]) => (
          <div key={s} onClick={() => setFiltro(filtro === s ? "todos" : s)}
            style={{ background:"var(--surface)", border:`1px solid ${filtro===s?cfg.color:"var(--border)"}`, borderRadius:13, padding:"14px 16px", cursor:"pointer", transition:"all 0.2s" }}>
            <div style={{ fontSize:11, color:"var(--muted)", textTransform:"uppercase", letterSpacing:1, marginBottom:3 }}>{cfg.icon} {cfg.label}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:cfg.color }}>{totais[s]||0}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <input style={{ flex:1, minWidth:180, background:"var(--surface)", border:"1px solid var(--border)", borderRadius:9, padding:"8px 13px", color:"var(--text)", fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none" }}
          placeholder="🔍 Nome, telefone ou data (AAAA-MM-DD)..." value={busca} onChange={e => setBusca(e.target.value)}/>
        <button onClick={() => setFiltro("todos")} style={{ padding:"8px 12px", borderRadius:9, border:"1px solid var(--border)", background:filtro==="todos"?"var(--accent)":"var(--surface)", color:filtro==="todos"?"#fff":"var(--muted)", cursor:"pointer", fontSize:12 }}>
          Todas ({reservas.length})
        </button>
        <button onClick={refresh} style={{ padding:"8px 10px", borderRadius:9, border:"1px solid var(--border)", background:"var(--surface)", color:"var(--muted)", cursor:"pointer", fontSize:13 }}>🔄</button>
      </div>

      {/* Lista */}
      {loading ? (
        <div style={{ textAlign:"center", padding:60, color:"var(--muted)" }}>Carregando…</div>
      ) : filtradas.length === 0 ? (
        <div className="empty-state">
          <div className="emoji">🍽️</div>
          <h3>Nenhuma reserva encontrada</h3>
          <p>As reservas feitas pelos clientes aparecem aqui em tempo real.</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {filtradas.map(res => {
            const cfg = statusCfgRes[res.status] || statusCfgRes.pendente;
            const dtData = res.data ? res.data.split("-").reverse().join("/") : "-";
            const isHoje = res.data === hojeISO;
            const isFutura = res.data > hojeISO;
            return (
              <div key={res.id} onClick={() => setModalDetalhe(res)}
                style={{ background:"var(--surface)", border:`1px solid ${isHoje?"var(--accent)":isFutura&&res.status==="confirmada"?"var(--success)":"var(--border)"}`, borderRadius:14, padding:"14px 18px", cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                    <span style={{ fontWeight:700, fontSize:15 }}>{res.nome || "—"}</span>
                    <span style={{ fontSize:11, padding:"2px 9px", borderRadius:20, background:cfg.bg, color:cfg.color, fontWeight:600 }}>{cfg.icon} {cfg.label}</span>
                    {isHoje && <span style={{ fontSize:11, padding:"2px 9px", borderRadius:20, background:"rgba(232,98,42,0.12)", color:"var(--accent)", fontWeight:600 }}>📅 Hoje</span>}
                  </div>
                  <div style={{ display:"flex", gap:14, fontSize:12, color:"var(--muted)", flexWrap:"wrap" }}>
                    <span>📅 {dtData} às {res.horario||"-"}</span>
                    <span>👥 {res.pessoas} {res.pessoas==="1"?"pessoa":"pessoas"}</span>
                    <span>📞 {res.telefone||"-"}</span>
                  </div>
                  {res.observacao && <div style={{ fontSize:12, color:"var(--muted)", marginTop:4, fontStyle:"italic" }}>📝 {res.observacao}</div>}
                </div>
                <div style={{ fontSize:12, color:"var(--muted)" }}>
                  {new Date(res.created_at).toLocaleString("pt-BR", {day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}
                  <div style={{ fontSize:11, marginTop:2 }}>▶ detalhes</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal detalhe / ações */}
      {modalDetalhe && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalDetalhe(null)}>
          <div className="modal">
            <div className="modal-title">Reserva — {modalDetalhe.nome}</div>
            {(() => {
              const cfg = statusCfgRes[modalDetalhe.status] || statusCfgRes.pendente;
              const dtData = modalDetalhe.data ? modalDetalhe.data.split("-").reverse().join("/") : "-";
              return (
                <>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                    {[
                      ["👤 Cliente", modalDetalhe.nome||"-"],
                      ["📞 Telefone", modalDetalhe.telefone||"-"],
                      ["📅 Data", dtData],
                      ["🕐 Horário", modalDetalhe.horario||"-"],
                      ["👥 Pessoas", modalDetalhe.pessoas||"-"],
                      ["📊 Status", `${cfg.icon} ${cfg.label}`],
                    ].map(([l, v]) => (
                      <div key={l} style={{ background:"var(--surface2)", borderRadius:9, padding:"10px 14px" }}>
                        <div style={{ fontSize:11, color:"var(--muted)", marginBottom:3 }}>{l}</div>
                        <div style={{ fontSize:14, fontWeight:600 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  {modalDetalhe.observacao && (
                    <div style={{ background:"rgba(232,98,42,0.08)", border:"1px solid rgba(232,98,42,0.2)", borderRadius:9, padding:"10px 14px", marginBottom:20 }}>
                      <div style={{ fontSize:11, color:"var(--muted)", marginBottom:3 }}>📝 Observação</div>
                      <div style={{ fontSize:14 }}>{modalDetalhe.observacao}</div>
                    </div>
                  )}
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {modalDetalhe.status === "pendente" && (
                      <button onClick={() => atualizarStatus(modalDetalhe.id, "confirmada")}
                        style={{ flex:1, padding:"9px 16px", borderRadius:9, border:"none", background:"var(--success)", color:"#fff", cursor:"pointer", fontSize:13, fontWeight:600 }}>
                        ✅ Confirmar
                      </button>
                    )}
                    {(modalDetalhe.status === "pendente" || modalDetalhe.status === "confirmada") && (
                      <button onClick={() => atualizarStatus(modalDetalhe.id, "cancelada")}
                        style={{ flex:1, padding:"9px 16px", borderRadius:9, border:"1px solid var(--danger)", background:"transparent", color:"var(--danger)", cursor:"pointer", fontSize:13, fontWeight:600 }}>
                        ✕ Cancelar
                      </button>
                    )}
                    {modalDetalhe.status === "confirmada" && (
                      <button onClick={() => atualizarStatus(modalDetalhe.id, "concluida")}
                        style={{ flex:1, padding:"9px 16px", borderRadius:9, border:"1px solid var(--muted)", background:"transparent", color:"var(--muted)", cursor:"pointer", fontSize:13, fontWeight:600 }}>
                        🏁 Concluída
                      </button>
                    )}
                    <button onClick={() => setConfirm({ msg:"Excluir esta reserva?", fn:() => excluir(modalDetalhe.id) })}
                      style={{ padding:"9px 14px", borderRadius:9, border:"1px solid var(--border)", background:"transparent", color:"var(--muted)", cursor:"pointer", fontSize:13 }}>
                      🗑️
                    </button>
                  </div>
                  <button onClick={() => setModalDetalhe(null)}
                    style={{ width:"100%", marginTop:12, padding:"9px", borderRadius:9, border:"1px solid var(--border)", background:"transparent", color:"var(--muted)", cursor:"pointer", fontSize:13 }}>
                    Fechar
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {confirm && <ConfirmModal mensagem={confirm.msg} onConfirm={confirm.fn} onCancel={() => setConfirm(null)}/>}
      {toast && <Toast msg={toast.msg} type={toast.type}/>}
    </>
  );
}

// ─── PAINEL ADMIN PRINCIPAL ────────────────────────────────────────────────────
export default function PainelAdmin({ usuario, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [produtos, setProdutos] = useState([]);
  const [loadingProd, setLoadingProd] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [filtro, setFiltro] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState({ nome:"", descricao:"", preco:"", categoria:"Pizza", imagem_url:"", ativo:true, estoque:"", estoque_minimo:"5" });
  const [confirmProduto, setConfirmProduto] = useState(null);
  const [toast, showToast] = useToast();

  const { dados: pedidosTodos } = useRealtime("pedidos");
  const hoje = new Date().toDateString();
  const pedidosHoje = pedidosTodos.filter(p => new Date(p.created_at).toDateString() === hoje);
  const faturamentoHoje = pedidosHoje.filter(p => p.status !== "cancelado").reduce((s,p) => s+Number(p.total), 0);
  const pedidosPendentes = pedidosTodos.filter(p => ["aguardando_pagamento","em_preparo","pago"].includes(p.status)).length;
  const emPreparo = pedidosTodos.filter(p => p.status === "em_preparo" || p.status === "pago").length;
  const estoqueBaixo = produtos.filter(p => p.estoque != null && p.estoque <= (p.estoque_minimo||5)).length;
  const { dados: reservasTodos } = useRealtime("reservas");
  const reservasPendentes = reservasTodos.filter(r => r.status === "pendente").length;

  useEffect(() => { fetchProdutos(); }, []);

  async function fetchProdutos() {
    setLoadingProd(true);
    const { data, error } = await supabase.from("produtos").select("*").order("created_at", { ascending:false });
    if (error) { showToast("Erro ao carregar produtos ✗","error"); setLoadingProd(false); return; }
    setProdutos(data||[]); setLoadingProd(false);
  }

  function abrirModal(p=null) {
    setFormErrors({});
    if (p) { setEditando(p); setForm({ nome:p.nome, descricao:p.descricao||"", preco:p.preco, categoria:p.categoria, imagem_url:p.imagem_url||"", ativo:p.ativo, estoque:p.estoque??"", estoque_minimo:p.estoque_minimo??"5" }); }
    else { setEditando(null); setForm({ nome:"", descricao:"", preco:"", categoria:"Pizza", imagem_url:"", ativo:true, estoque:"", estoque_minimo:"5" }); }
    setModalOpen(true);
  }

  function validarProduto() {
    const e={};
    if (!form.nome.trim()) e.nome="Obrigatório";
    if (!form.preco||isNaN(form.preco)||Number(form.preco)<0) e.preco="Inválido";
    if (form.estoque!==""&&(isNaN(form.estoque)||Number(form.estoque)<0)) e.estoque="Inválido";
    setFormErrors(e); return Object.keys(e).length===0;
  }

  async function salvar() {
    if (!validarProduto()) return;
    setSalvando(true);
    const dados = { ...form, preco:parseFloat(form.preco), estoque:form.estoque!==""?parseInt(form.estoque):null, estoque_minimo:form.estoque_minimo!==""?parseInt(form.estoque_minimo):5 };
    const {error} = editando ? await supabase.from("produtos").update(dados).eq("id",editando.id) : await supabase.from("produtos").insert([dados]);
    setSalvando(false);
    if (error) { showToast("Erro ✗","error"); return; }
    showToast(editando?"Atualizado ✓":"Cadastrado ✓");
    registrarLog("produto",`${editando?"Editou":"Criou"} ${form.nome}`,usuario?.email);
    setModalOpen(false); fetchProdutos();
  }

  async function toggleAtivo(p) {
    await supabase.from("produtos").update({ ativo:!p.ativo }).eq("id",p.id);
    fetchProdutos();
  }

  function getStockInfo(p) {
    if (p.estoque==null) return null;
    const min=p.estoque_minimo||5;
    if (p.estoque===0) return {class:"out",label:"Sem estoque"};
    if (p.estoque<=min) return {class:"low",label:`${p.estoque} restantes`};
    return {class:"ok",label:`${p.estoque} em estoque`};
  }

  const prodFiltrados = produtos.filter(p => (filtro==="Todos"||p.categoria===filtro) && p.nome.toLowerCase().includes(busca.toLowerCase()));

  const navItems = [
    { group:"Operações" },
    { id:"dashboard",     icon:"📊", label:"Dashboard" },
    { id:"pedidos",       icon:"📋", label:"Pedidos",      badge:pedidosPendentes>0?pedidosPendentes:null },
    { id:"kds",           icon:"🍳", label:"Cozinha KDS",  badge:emPreparo>0?emPreparo:null },
    { id:"mesas",         icon:"🪑", label:"Mesas" },
    { id:"reservas",      icon:"🍽️", label:"Reservas",     badge:reservasPendentes>0?reservasPendentes:null },
    { group:"Negócio" },
    { id:"financeiro",    icon:"💰", label:"Financeiro" },
    { id:"clientes",      icon:"👥", label:"Clientes" },
    { id:"produtos",      icon:"🍕", label:"Cardápio",     badge:estoqueBaixo>0?`${estoqueBaixo}⚠️`:null },
    { id:"promocoes",     icon:"🔥", label:"Promoções" },
    { group:"Sistema" },
    { id:"log",           icon:"📋", label:"Atividades" },
    { id:"configuracoes", icon:"⚙️", label:"Configurações" },
  ];

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
            {navItems.map((item, i) => item.group ? (
              <div key={i} className="nav-section">{item.group}</div>
            ) : (
              <button key={item.id} className={`nav-item ${page===item.id?"active":""}`} onClick={()=>setPage(item.id)}>
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge&&<span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="badge-status"><div className="dot"/><span>Realtime ativo</span></div>
            {onLogout&&(
              <button onClick={onLogout} style={{ marginTop:10, width:"100%", padding:"7px 10px", borderRadius:8, border:"1px solid var(--border)", background:"transparent", color:"var(--muted)", cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif", display:"flex", alignItems:"center", gap:6 }}>
                🚪 <span>Sair</span>
              </button>
            )}
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">

          {/* DASHBOARD */}
          {page==="dashboard"&&(
            <>
              <div className="page-header">
                <h2>Olá, {usuario?.email?.split("@")[0]||"Beto"}! 👋</h2>
                <p>Resumo do negócio hoje <span className="sync-dot"/> Realtime ativo</p>
              </div>
              <div className="stats">
                <div className="stat-card">
                  <div className="stat-label">Faturamento Hoje</div>
                  <div className="stat-value" style={{ fontSize:20, color:"var(--success)" }}>R$ {faturamentoHoje.toFixed(2).replace(".",",")}</div>
                  <div className="stat-sub">{pedidosHoje.length} pedidos hoje</div>
                  <div className="stat-icon">💰</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Pedidos Ativos</div>
                  <div className="stat-value" style={{ color:pedidosPendentes>0?"var(--accent)":"var(--text)" }}>{pedidosPendentes}</div>
                  <div className="stat-sub">aguardando ação</div>
                  <div className="stat-icon">🔥</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Produtos Ativos</div>
                  <div className="stat-value">{produtos.filter(p=>p.ativo).length}</div>
                  <div className="stat-sub">de {produtos.length} no cardápio</div>
                  <div className="stat-icon">🍕</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Estoque Baixo</div>
                  <div className="stat-value" style={{ color:estoqueBaixo>0?"var(--danger)":"var(--text)" }}>{estoqueBaixo}</div>
                  <div className="stat-sub">{estoqueBaixo>0?"precisam de reposição":"OK"}</div>
                  <div className="stat-icon">📦</div>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:20 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18 }}>Pedidos Recentes</h3>
                    <button onClick={()=>setPage("pedidos")} style={{ fontSize:12, color:"var(--accent)", background:"none", border:"none", cursor:"pointer" }}>Ver todos →</button>
                  </div>
                  {pedidosTodos.slice(0,6).map(p => {
                    const cfg=statusCfg[p.status]||statusCfg.aguardando_pagamento;
                    return (
                      <div key={p.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
                        <div>
                          <div style={{ fontWeight:600, fontSize:13 }}>{p.nome_cliente||"Cliente"} · Mesa {p.mesa||"-"}</div>
                          <div style={{ fontSize:11, color:"var(--muted)", marginTop:1 }}>{new Date(p.created_at).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}</div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <span style={{ fontWeight:700, color:"var(--accent)", fontSize:13 }}>R$ {Number(p.total).toFixed(2).replace(".",",")}</span>
                          <span style={{ fontSize:11, padding:"2px 8px", borderRadius:20, background:cfg.bg, color:cfg.color, fontWeight:600 }}>{cfg.icon} {cfg.label}</span>
                        </div>
                      </div>
                    );
                  })}
                  {pedidosTodos.length===0&&<p style={{ color:"var(--muted)", textAlign:"center", padding:16, fontSize:13 }}>Nenhum pedido ainda</p>}
                </div>

                <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:14, padding:20 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18 }}>Cardápio</h3>
                    <button onClick={()=>setPage("produtos")} style={{ fontSize:12, color:"var(--accent)", background:"none", border:"none", cursor:"pointer" }}>Gerenciar →</button>
                  </div>
                  {produtos.slice(0,6).map(p => {
                    const si=getStockInfo(p);
                    return (
                      <div key={p.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
                        <div>
                          <div style={{ fontWeight:600, fontSize:13 }}>{p.nome}</div>
                          <div style={{ fontSize:11, color:"var(--muted)", marginTop:1 }}>{p.categoria}</div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          {si&&<span className={`stock-badge ${si.class}`}>{si.label}</span>}
                          <span style={{ fontWeight:700, color:"var(--accent)", fontSize:13 }}>R$ {Number(p.preco).toFixed(2)}</span>
                          <span className={`status-badge ${p.ativo?"ativo":"inativo"}`}>{p.ativo?"●":"●"}</span>
                        </div>
                      </div>
                    );
                  })}
                  {produtos.length===0&&<p style={{ color:"var(--muted)", textAlign:"center", padding:16, fontSize:13 }}>Nenhum produto ainda</p>}
                </div>
              </div>
            </>
          )}

          {page==="pedidos"&&<PedidosPage usuarioEmail={usuario?.email}/>}
          {page==="kds"&&<KDSPage/>}
          {page==="mesas"&&<MesasPage usuarioEmail={usuario?.email}/>}
          {page==="reservas"&&<ReservasPage usuarioEmail={usuario?.email}/>}
          {page==="financeiro"&&<FinanceiroPage/>}
          {page==="clientes"&&<ClientesPage/>}
          {page==="log"&&<LogPage/>}
          {page==="promocoes"&&<PromocoesPage usuarioEmail={usuario?.email}/>}
          {page==="configuracoes"&&<ConfiguracoesPage usuario={usuario}/>}

          {/* PRODUTOS */}
          {page==="produtos"&&(
            <>
              <div className="page-header"><h2>Cardápio</h2><p>Gerencie todos os produtos</p></div>
              <div className="toolbar">
                <input className="search-box" placeholder="🔍 Buscar produto..." value={busca} onChange={e=>setBusca(e.target.value)}/>
                {["Todos",...CATEGORIAS].map(c=><button key={c} className={`filter-btn ${filtro===c?"active":""}`} onClick={()=>setFiltro(c)}>{c}</button>)}
                <button className="btn-primary" onClick={()=>abrirModal()}>+ Novo Produto</button>
              </div>
              {loadingProd?<div style={{ textAlign:"center", padding:60, color:"var(--muted)" }}>Carregando...</div>:prodFiltrados.length===0?(
                <div className="empty-state"><div className="emoji">🍕</div><h3>Nenhum produto</h3><p>Adicione seu primeiro produto.</p></div>
              ):(
                <div className="products-grid">
                  {prodFiltrados.map(p=>{
                    const si=getStockInfo(p);
                    return (
                      <div key={p.id} className="product-card">
                        <div className="product-img">{p.imagem_url?<img src={p.imagem_url} alt={p.nome} onError={e=>{e.target.style.display="none"}}/>:"🍕"}</div>
                        <div className="product-info">
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:3 }}>
                            <span className="product-cat">{p.categoria}</span>
                            <span className={`status-badge ${p.ativo?"ativo":"inativo"}`}>{p.ativo?"Ativo":"Inativo"}</span>
                          </div>
                          <div className="product-name">{p.nome}</div>
                          <div className="product-desc">{p.descricao||"Sem descrição"}</div>
                          {si&&<div style={{ marginBottom:8 }}><span className={`stock-badge ${si.class}`}>📦 {si.label}</span></div>}
                          <div className="product-footer">
                            <span className="product-price">R$ {Number(p.preco).toFixed(2)}</span>
                            <div className="product-actions">
                              <button className="action-btn" onClick={()=>abrirModal(p)}>✏️</button>
                              <button className="action-btn" onClick={()=>toggleAtivo(p)}>{p.ativo?"⏸️":"▶️"}</button>
                              <button className="action-btn danger" onClick={()=>setConfirmProduto({msg:"Excluir produto do cardápio?",fn:async()=>{
                                setConfirmProduto(null);
                                const{error}=await supabase.from("produtos").delete().eq("id",p.id);
                                if(error){showToast("Erro ✗","error");return;}
                                showToast("Excluído ✓");
                                registrarLog("produto",`Excluiu ${p.nome}`,usuario?.email);
                                fetchProdutos();
                              }})}>🗑️</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

        </main>

        {/* MODAL PRODUTO */}
        {modalOpen&&(
          <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModalOpen(false)}>
            <div className="modal">
              <div className="modal-title">{editando?"Editar Produto":"Novo Produto"}</div>
              <div className="form-group">
                <label className="form-label">Nome *</label>
                <input className={`form-input ${formErrors.nome?"error":""}`} placeholder="Ex: Pizza Margherita" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})}/>
                {formErrors.nome&&<div className="field-error">{formErrors.nome}</div>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Preço (R$) *</label>
                  <input className={`form-input ${formErrors.preco?"error":""}`} type="number" step="0.01" placeholder="0,00" value={form.preco} onChange={e=>setForm({...form,preco:e.target.value})}/>
                  {formErrors.preco&&<div className="field-error">{formErrors.preco}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Categoria</label>
                  <select className="form-select" value={form.categoria} onChange={e=>setForm({...form,categoria:e.target.value})}>
                    {CATEGORIAS.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea className="form-textarea" placeholder="Ingredientes, tamanho..." value={form.descricao} onChange={e=>setForm({...form,descricao:e.target.value})}/>
              </div>
              <div className="form-group">
                <label className="form-label">URL da Imagem</label>
                <input className="form-input" placeholder="https://..." value={form.imagem_url} onChange={e=>setForm({...form,imagem_url:e.target.value})}/>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Estoque atual</label>
                  <input className={`form-input ${formErrors.estoque?"error":""}`} type="number" placeholder="Vazio = sem controle" value={form.estoque} onChange={e=>setForm({...form,estoque:e.target.value})}/>
                  {formErrors.estoque&&<div className="field-error">{formErrors.estoque}</div>}
                </div>
                <div className="form-group">
                  <label className="form-label">Alerta mínimo</label>
                  <input className="form-input" type="number" placeholder="5" value={form.estoque_minimo} onChange={e=>setForm({...form,estoque_minimo:e.target.value})}/>
                </div>
              </div>
              <div className="form-group">
                <label style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer" }}>
                  <input type="checkbox" checked={form.ativo} onChange={e=>setForm({...form,ativo:e.target.checked})}/>
                  <span style={{ fontSize:13 }}>Produto ativo (visível no cardápio)</span>
                </label>
              </div>
              <div className="form-actions">
                <button className="btn-cancel" onClick={()=>setModalOpen(false)}>Cancelar</button>
                <button className="btn-primary btn-save" onClick={salvar} disabled={salvando}>
                  {salvando?"Salvando...":editando?"Salvar Alterações":"Cadastrar Produto"}
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmProduto&&<ConfirmModal mensagem={confirmProduto.msg} onConfirm={confirmProduto.fn} onCancel={()=>setConfirmProduto(null)}/>}
        {toast&&<Toast msg={toast.msg} type={toast.type}/>}
      </div>
    </>
  );
}
