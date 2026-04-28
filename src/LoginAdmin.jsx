import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 🔒 SEGURANÇA: Chaves via variáveis de ambiente
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0f0d0a; --surface: #1a1713; --surface2: #242019;
    --border: #2e2a24; --accent: #e8622a; --accent2: #f5a623;
    --text: #f0ebe3; --muted: #8a8070; --danger: #e84242;
  }
  body { background: var(--bg); font-family: 'DM Sans', sans-serif; }
  .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); position: relative; overflow: hidden; }
  .login-page::before { content: ''; position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(232,98,42,0.08) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; }
  .login-box { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 48px 40px; width: 100%; max-width: 420px; position: relative; animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  .login-box::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 24px 24px 0 0; background: linear-gradient(90deg, var(--accent), var(--accent2)); }
  .login-logo { text-align: center; margin-bottom: 36px; }
  .login-logo .emoji { font-size: 48px; display: block; margin-bottom: 12px; }
  .login-logo h1 { font-family: 'Playfair Display', serif; font-size: 28px; color: var(--accent); line-height: 1.1; }
  .login-logo span { font-size: 12px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; display: block; margin-top: 6px; }
  .form-group { margin-bottom: 18px; }
  .form-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; display: block; font-weight: 600; }
  .form-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 12px 16px; color: var(--text); font-size: 15px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(232,98,42,0.12); }
  .form-input::placeholder { color: var(--muted); }
  .error-msg { background: rgba(232,66,66,0.1); border: 1px solid rgba(232,66,66,0.3); border-radius: 10px; color: var(--danger); font-size: 13px; padding: 10px 14px; margin-bottom: 18px; text-align: center; }
  .btn-login { width: 100%; padding: 14px; border-radius: 12px; border: none; background: linear-gradient(135deg, var(--accent), #d4501f); color: #fff; font-size: 15px; font-weight: 700; font-family: 'DM Sans', sans-serif; cursor: pointer; transition: opacity 0.2s, transform 0.1s; letter-spacing: 0.5px; margin-top: 8px; }
  .btn-login:hover { opacity: 0.88; }
  .btn-login:active { transform: scale(0.98); }
  .btn-login:disabled { opacity: 0.5; cursor: not-allowed; }
  .login-footer { text-align: center; margin-top: 24px; font-size: 12px; color: var(--muted); }
  .security-badge { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 16px; font-size: 11px; color: var(--muted); opacity: 0.7; }
`;

// 🔒 Rate limiting no lado cliente (Supabase já tem no servidor também)
const tentativas = { count: 0, bloqueadoAte: null };

function verificarRateLimit() {
  if (tentativas.bloqueadoAte && new Date() < tentativas.bloqueadoAte) {
    const segundos = Math.ceil((tentativas.bloqueadoAte - new Date()) / 1000);
    return `Muitas tentativas. Aguarde ${segundos}s.`;
  }
  return null;
}

function registrarTentativaFalha() {
  tentativas.count += 1;
  if (tentativas.count >= 5) {
    tentativas.bloqueadoAte = new Date(Date.now() + 2 * 60 * 1000);
    tentativas.count = 0;
  }
}

export default function LoginAdmin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setErro("");

    const bloqueio = verificarRateLimit();
    if (bloqueio) { setErro(bloqueio); return; }

    if (!email || !senha) { setErro("Preencha e-mail e senha."); return; }

    setLoading(true);
    try {
      // 🔒 Autenticação real via Supabase Auth — senha verificada no servidor
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: senha,
      });

      if (error || !data.user) {
        registrarTentativaFalha();
        // 🔒 Mensagem genérica — não revela se e-mail existe ou não
        setErro("E-mail ou senha incorretos.");
        return;
      }

      tentativas.count = 0;
      tentativas.bloqueadoAte = null;
      onLogin({ email: data.user.email, id: data.user.id });
    } catch (e) {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <>
      <style>{styles}</style>
      <div className="login-page">
        <div className="login-box">
          <div className="login-logo">
            <span className="emoji">🍕</span>
            <h1>Beto Pizzaria</h1>
            <span>Área Administrativa</span>
          </div>

          {erro && <div className="error-msg">⚠️ {erro}</div>}

          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              className="form-input"
              type="email"
              placeholder="admin@betopizzaria.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
          </div>

          <button
            className="btn-login"
            onClick={handleLogin}
            disabled={loading || !email || !senha}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>

          <div className="security-badge">🔒 Login seguro via Supabase Auth</div>

          <div className="login-footer">
            Acesso restrito · Beto Pizzaria © 2025
          </div>
        </div>
      </div>
    </>
  );
}
