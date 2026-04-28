import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import App from "./App.jsx";
import PainelAdmin from "./PainelAdmin.jsx";
import LoginAdmin from "./LoginAdmin.jsx";

// 🔒 SEGURANÇA: Chaves via variáveis de ambiente
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function AdminRoute() {
  const [sessao, setSessao] = useState(undefined); // undefined = carregando
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // 🔒 Verifica sessão real no Supabase ao carregar
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session);
      if (data.session?.user) setUsuario(data.session.user);
    });

    // 🔒 Escuta mudanças de sessão (logout em outra aba, token expirado etc.)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessao(session);
      setUsuario(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Aguarda verificação da sessão antes de renderizar qualquer coisa
  if (sessao === undefined) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "#0f0d0a", color: "#8a8070",
        fontFamily: "sans-serif", fontSize: 14
      }}>
        Verificando acesso...
      </div>
    );
  }

  // 🔒 Sem sessão válida → vai para login
  if (!sessao) {
    return <LoginAdmin onLogin={(u) => setUsuario(u)} />;
  }

  // 🔒 Sessão válida → acesso liberado ao painel
  return (
    <PainelAdmin
      usuario={usuario}
      onLogout={async () => {
        await supabase.auth.signOut(); // 🔒 Encerra sessão no servidor também
        setSessao(null);
        setUsuario(null);
      }}
    />
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminRoute />} />
        {/* 🔒 Qualquer rota inválida redireciona para home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
