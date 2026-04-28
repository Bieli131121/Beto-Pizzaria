import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App.jsx";
import PainelAdmin from "./PainelAdmin.jsx";
import LoginAdmin from "./LoginAdmin.jsx";

function AdminRoute() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  if (!usuarioLogado) {
    return <LoginAdmin onLogin={(u) => setUsuarioLogado(u)} />;
  }

  return (
    <PainelAdmin
      usuario={usuarioLogado}
      onLogout={() => setUsuarioLogado(null)}
    />
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminRoute />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
