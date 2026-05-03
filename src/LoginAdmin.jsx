import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #F9F6F1;
    --surface: #FFFFFF;
    --surface2: #EAE4DA;
    --border: #DDD5C8;
    --accent: #C8181A;
    --accent2: #9E1214;
    --text: #1C1208;
    --muted: #6B6050;
    --danger: #C8181A;
  }

  body { background: var(--bg); font-family: 'DM Sans', sans-serif; }

  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    position: relative;
    overflow: hidden;
  }

  .login-page::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(200,24,26,0.07) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .login-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 48px 40px;
    width: 100%;
    max-width: 420px;
    position: relative;
    animation: fadeIn 0.4s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .login-box::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 24px 24px 0 0;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
  }

  .login-logo {
    text-align: center;
    margin-bottom: 36px;
  }

  .login-logo .emoji {
    font-size: 48px;
    display: block;
    margin-bottom: 12px;
  }

  .login-logo h1 {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    color: var(--accent);
    line-height: 1.1;
  }

  .login-logo span {
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 2px;
    text-transform: uppercase;
    display: block;
    margin-top: 6px;
  }

  .form-group {
    margin-bottom: 18px;
  }

  .form-label {
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
    display: block;
    font-weight: 600;
  }

  .form-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px 16px;
    color: var(--text);
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(232,98,42,0.12);
  }

  .form-input::placeholder { color: var(--muted); }

  .error-msg {
    background: rgba(232,66,66,0.1);
    border: 1px solid rgba(232,66,66,0.3);
    border-radius: 10px;
    color: var(--danger);
    font-size: 13px;
    padding: 10px 14px;
    margin-bottom: 18px;
    text-align: center;
  }

  .btn-login {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #C8181A, #9E1214);
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
    letter-spacing: 0.5px;
    margin-top: 8px;
  }

  .btn-login:hover { opacity: 0.88; }
  .btn-login:active { transform: scale(0.98); }
  .btn-login:disabled { opacity: 0.5; cursor: not-allowed; }

  .login-footer {
    text-align: center;
    margin-top: 24px;
    font-size: 12px;
    color: var(--muted);
  }
`;

// Credenciais padrão — lidas do localStorage (editáveis pelo admin)
function getCredenciais() {
  try {
    const stored = localStorage.getItem("admin_credenciais");
    if (stored) return JSON.parse(stored);
  } catch {}
  return { usuario: "admin", senha: "1234" };
}

export default function LoginAdmin({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setErro("");
    setLoading(true);

    setTimeout(() => {
      const creds = getCredenciais();
      if (usuario === creds.usuario && senha === creds.senha) {
        onLogin({ usuario });
      } else {
        setErro("Usuário ou senha incorretos.");
      }
      setLoading(false);
    }, 500);
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
            <label className="form-label">Usuário</label>
            <input
              className="form-input"
              placeholder="Digite seu usuário"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              className="form-input"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            className="btn-login"
            onClick={handleLogin}
            disabled={loading || !usuario || !senha}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="login-footer">
            Acesso restrito · Beto Pizzaria © 2025
          </div>
        </div>
      </div>
    </>
  );
}
