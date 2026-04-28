import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 🔒 SEGURANÇA: Chaves lidas de variáveis de ambiente (.env)
// Nunca coloque chaves diretamente no código!
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const LOGO_B64 = "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";

const C = {
  red: "#C8181A",
  redDark: "#9E1214",
  green: "#1A6B2E",
  white: "#FFFFFF",
  offWhite: "#F9F6F1",
  dark: "#1C1208",
  gray: "#6B6050",
  lightGray: "#EAE4DA",
  border: "#DDD5C8",
};

const MENU = {
  Tradicionais: {
    prices: { P: 60, M: 70, G: 100 },
    items: [
      { name: "Calabresa", desc: "Mussarela, Calabresa e Cebola" },
      { name: "Frango c/ Requeijão", desc: "Mussarela, Frango e Requeijão" },
      { name: "Bacon", desc: "Mussarela e Bacon" },
      { name: "Bacon c/ Milho", desc: "Mussarela, Bacon e Milho" },
      { name: "Canadense", desc: "Mussarela, Lombo, Champignon e Requeijão" },
      { name: "Catuperu", desc: "Mussarela, Peito de Peru e Requeijão" },
      { name: "4 Queijos", desc: "Mussarela, Parmesão, Provolone e Gorgonzola" },
      { name: "Napolitana", desc: "Mussarela, Tomate e Alho" },
      { name: "Marguerita", desc: "Mussarela, Tomate e Manjericão" },
      { name: "Alho e Óleo", desc: "Mussarela, Alho, Alecrim e Óleo" },
      { name: "Portuguesa", desc: "Mussarela, Presunto, Cebola, Ovos, Pimentão e Azeitonas" },
      { name: "Americana", desc: "Mussarela, Presunto, Bacon e Ovos" },
      { name: "Brócolis", desc: "Mussarela, Brócolis, Tomate e Requeijão" },
      { name: "Abobrinha", desc: "Mussarela, Abobrinha e Parmesão" },
      { name: "Milho", desc: "Mussarela e Milho" },
      { name: "Palmito", desc: "Mussarela, Palmito e Cebola" },
      { name: "Cebola da Manteiga", desc: "Mussarela e Cebola na Manteiga" },
      { name: "Siciliana", desc: "Mussarela, Champignon e Bacon" },
      { name: "Champignon", desc: "Mussarela, Champignon, Tomate e Alho" },
      { name: "Escarola", desc: "Mussarela, Chicória Refogada e Bacon" },
    ],
  },
  Especiais: {
    prices: { P: 80, M: 90, G: 120 },
    items: [
      { name: "Baiana", desc: "Mussarela, Calabresa Picada, Cebola, Ovos e Pimenta" },
      { name: "Calabria", desc: "Calabresa picada, Cebola, Requeijão e Parmesão" },
      { name: "Mineira", desc: "Mussarela, Lombo, Calabresa, Ovos e Parmesão" },
      { name: "Veneza", desc: "Mussarela, Calabresa, Tomate, Ovos e Provolone" },
      { name: "Escarola c/ Alcaparras", desc: "Mussarela, Chicória Refogada, Lombo e Alcaparras" },
      { name: "Rúcula", desc: "Mussarela, Rúcula Fresca e Tomate Seco" },
      { name: "Tomate Seco", desc: "Mussarela, Manjericão e Tomate Seco" },
      { name: "Vegetariana", desc: "Mussarela, Escarola, Palmito, Cebola, Milho, Tomate e Champignon" },
      { name: "Coração", desc: "Mussarela e Coração de Frango Grelhado" },
      { name: "Pepperoni", desc: "Mussarela e Pepperoni" },
      { name: "Caprichosa", desc: "Mussarela, Calabresa, Bacon, Palmito e Parmesão" },
      { name: "Dom Possi", desc: "Mussarela, Lombo, Tomate, Manjericão, Alho, Ovos e Pimentão" },
      { name: "Paes Vieira", desc: "Mussarela, Pepperoni, Ovos, Cebola, Pimentão e Azeitonas" },
      { name: "Tarantela", desc: "Mussarela, Lombo, Tomate Seco e Azeitonas" },
    ],
  },
  Carnes: {
    prices: { P: 90, M: 100, G: 130 },
    items: [
      { name: "Picanha", desc: "Mussarela e Tiras de Picanha" },
      { name: "Gaúcha", desc: "Mussarela, Filé de Carne e Cheddar" },
      { name: "Costela", desc: "Mussarela e Costela" },
      { name: "Strogonoff de Carne", desc: "Mussarela, Strogonoff de Carne e Batata Palha" },
      { name: "Cupim", desc: "Mussarela, Cupim e Barbecue" },
      { name: "Filé ao Alho", desc: "Mussarela, Filé, Alho e Óleo" },
      { name: "Costela Crocante", desc: "Mussarela, Costela, Requeijão e Doritos Triturados" },
    ],
  },
  "Frutos do Mar": {
    prices: { P: 100, M: 110, G: 150 },
    items: [
      { name: "Camarão", desc: "Mussarela, Camarão e Azeitonas" },
      { name: "Siri", desc: "Mussarela e Molho de Siri" },
      { name: "Polvo", desc: "Mussarela e Molho de Polvo" },
      { name: "Atum", desc: "Mussarela, Atum e Cebola" },
      { name: "Atum c/ Milho", desc: "Mussarela, Atum e Milho" },
      { name: "Aliche", desc: "Mussarela, Tomate e Aliche" },
      { name: "Marisco", desc: "Mussarela e Marisco" },
      { name: "Salmão", desc: "Mussarela, Salmão e Alcaparras" },
      { name: "Lula", desc: "Mussarela e Lula ao Molho" },
    ],
  },
  Doces: {
    prices: { P: 80, M: 90, G: 120 },
    items: [
      { name: "Abacaxi c/ Branco", desc: "Mussarela, Abacaxi e Chocolate Branco" },
      { name: "Banana c/ Canela", desc: "Mussarela, Banana, Açúcar e Canela" },
      { name: "Banana c/ Gemada", desc: "Mussarela, Banana e Gemada" },
      { name: "Califórnia", desc: "Mussarela, Figo, Abacaxi, Figo em Calda e Morangos" },
      { name: "Maracujá", desc: "Chocolate Branco, Maracujá e Leite Condensado" },
      { name: "Morango", desc: "Chocolate ao Leite e Morangos" },
      { name: "Morango Branco", desc: "Chocolate Branco e Morangos" },
      { name: "Charge", desc: "Chocolate ao Leite, Amendoim Triturado e Leite Condensado" },
      { name: "Prestígio", desc: "Chocolate ao Leite, Côco Ralado e Leite Condensado" },
      { name: "Confeti", desc: "Chocolate ao Leite e Confetis" },
      { name: "Confeti Branco", desc: "Chocolate Branco e Confetis" },
      { name: "Chocolate", desc: "Chocolate ao Leite" },
      { name: "Chocolate Branco", desc: "Chocolate Branco" },
      { name: "Valsa", desc: "Chocolate ao Leite e Bombom Triturado" },
      { name: "Ouro Branco", desc: "Chocolate Branco e Bombom Triturado" },
    ],
  },
};

const SIDES = [
  { name: "Batata Frita", price: 25 },
  { name: "Polenta Frita", price: 30 },
  { name: "Frango Frito", price: 40 },
];

const DRINKS = [
  { name: "Refrigerante Lata 350ml", price: 8 },
  { name: "Refrigerante 600ml", price: 10 },
  { name: "Água c/ ou s/ Gás 500ml", price: 5 },
  { name: "Suco Del Valle Lata 290ml", price: 10 },
  { name: "Suco Laranja INTEGRAL 300ml", price: 10 },
  { name: "Suco Laranja INTEGRAL 1 Litro", price: 23 },
  { name: "H2O 500ml", price: 10 },
  { name: "Cerveja Long Neck 330ml", price: 15 },
  { name: "Cerveja 600ml", price: 20 },
  { name: "Chopp Vantap Pilsen 300ml", price: 15 },
  { name: "Chopp Vantap Pilsen 500ml", price: 20 },
  { name: "Chopp Torre 1,0 Litro", price: 40 },
  { name: "Chopp Torre 2,5 Litros", price: 80 },
  { name: "Caipira Vodka Orloff Limão", price: 29 },
  { name: "Caipira Vodka Absolut Limão", price: 38 },
  { name: "Caipira Vinho", price: 29 },
  { name: "Caipira Cachaça Limão", price: 29 },
  { name: "Caipira Rum Limão", price: 29 },
  { name: "Caipira Vodka Orloff Morango", price: 29 },
  { name: "Caipira Vodka Absolut Morango", price: 38 },
  { name: "Whisky Red Label", price: 25 },
  { name: "Whisky Black Label", price: 30 },
  { name: "Vodka Absolut (dose)", price: 25 },
  { name: "Vodka Orloff (dose)", price: 10 },
  { name: "Rum (dose)", price: 10 },
  { name: "Cachaça (dose)", price: 10 },
];

// ─── STONE PAYMENT ────────────────────────────────────────────────────────────
// Fluxo: identify → method → [awaiting_machine] → [pix_qr / cash_confirm] → success
// O pedido só é gravado no banco com status "pago" APÓS confirmação real do pagamento.
// Para dinheiro: confirmação imediata pelo operador.
// Para débito/crédito/pix: o operador clica "Aprovado na maquininha" para confirmar.
function StoneModal({ cart, total, onClose, onSuccess }) {
  const [step, setStep] = useState("identify"); // identify | method | awaiting_machine | pix_qr | cash_confirm | saving | success | error
  const [nomeCliente, setNomeCliente] = useState("");
  const [mesa, setMesa] = useState("");
  const [method, setMethod] = useState(null);
  const [installments, setInstallments] = useState(1);
  const [saveError, setSaveError] = useState("");
  const [nsu] = useState(() => String(Math.floor(Math.random()*9e6)+1e6));
  const [pixCode] = useState(() => {
    // Simula código EMV PIX (na integração real viria da API Stone)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({length:32}, ()=>chars[Math.floor(Math.random()*chars.length)]).join("");
  });

  const methods = [
    { id: "debit",   label: "Débito",            icon: "💳", desc: "Cartão de débito na maquininha" },
    { id: "credit1x",label: "Crédito à Vista",   icon: "💳", desc: "Crédito sem parcelamento" },
    { id: "credit",  label: "Crédito Parcelado",  icon: "💳", desc: "Parcelamento disponível" },
    { id: "pix",     label: "PIX",                icon: "⚡", desc: "QR Code na maquininha Stone" },
    { id: "cash",    label: "Dinheiro",           icon: "💵", desc: "Pagamento em espécie" },
  ];

  const fee = method === "credit" ? 0.0299 : 0;
  const finalTotal = total * (1 + fee);
  const installmentVal = method === "credit" ? finalTotal / installments : finalTotal;
  const selMethod = methods.find(m => m.id === method);

  // Redireciona para a tela correta de acordo com o método
  function irParaMaquininha() {
    if (method === "pix") setStep("pix_qr");
    else if (method === "cash") setStep("cash_confirm");
    else setStep("awaiting_machine"); // débito ou crédito
  }

  // Salva o pedido no Supabase como "pago" — chamado SOMENTE após confirmação real
  async function salvarPedidoPago() {
    setStep("saving");
    setSaveError("");
    const { error } = await supabase.from("pedidos").insert([{
      itens: cart,
      total: finalTotal,
      metodo_pagamento: method,
      parcelas: method === "credit" ? installments : null,
      nome_cliente: nomeCliente.trim() || "Cliente",
      mesa: mesa.trim() || "-",
      status: "pago",
      nsu,
    }]);
    if (error) {
      console.error("Erro ao salvar pedido:", error);
      setSaveError("Erro ao registrar pedido no sistema. Tente novamente.");
      setStep("error");
      return;
    }
    setStep("success");
  }

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
      <div style={{ background:"#fff",borderRadius:20,width:"100%",maxWidth:420,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.3)",maxHeight:"95vh",display:"flex",flexDirection:"column" }}>

        {/* Header Stone */}
        <div style={{ background:"#00A868",padding:"16px 22px",display:"flex",alignItems:"center",gap:10,flexShrink:0 }}>
          <span style={{ background:"rgba(255,255,255,0.25)",borderRadius:8,padding:"4px 12px",fontFamily:"sans-serif",fontWeight:900,fontSize:17,color:"#fff",letterSpacing:-0.5 }}>stone</span>
          <span style={{ color:"rgba(255,255,255,0.85)",fontSize:13,fontFamily:"sans-serif" }}>Terminal de Pagamento</span>
          {(step==="identify"||step==="method"||step==="error") && (
            <button onClick={onClose} style={{ marginLeft:"auto",background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer",lineHeight:1 }}>×</button>
          )}
        </div>

        <div style={{ padding:"22px 22px 26px",fontFamily:"sans-serif",overflowY:"auto",flex:1 }}>

          {/* ── STEP: IDENTIFY ────────────────────────────────── */}
          {step === "identify" && (
            <div>
              <p style={{ fontWeight:700,fontSize:16,color:C.dark,margin:"0 0 4px",fontFamily:"Georgia,serif" }}>Identificação do Pedido</p>
              <p style={{ fontSize:12,color:C.gray,margin:"0 0 18px" }}>Preencha antes de prosseguir com o pagamento</p>

              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:11,fontWeight:700,color:C.gray,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:1 }}>Nome do Cliente *</label>
                <input
                  placeholder="Ex: João Silva"
                  value={nomeCliente}
                  onChange={e => setNomeCliente(e.target.value)}
                  autoFocus
                  style={{ width:"100%",padding:"10px 13px",border:`1.5px solid ${nomeCliente?"#00A868":"#DDD"}`,borderRadius:9,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"sans-serif",transition:"border-color 0.2s" }}
                />
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11,fontWeight:700,color:C.gray,display:"block",marginBottom:5,textTransform:"uppercase",letterSpacing:1 }}>Mesa / Identificação *</label>
                <input
                  placeholder="Ex: Mesa 5, Balcão, Delivery…"
                  value={mesa}
                  onChange={e => setMesa(e.target.value)}
                  style={{ width:"100%",padding:"10px 13px",border:`1.5px solid ${mesa?"#00A868":"#DDD"}`,borderRadius:9,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"sans-serif",transition:"border-color 0.2s" }}
                />
              </div>

              {/* Resumo dos itens */}
              <div style={{ background:"#F9F6F1",borderRadius:10,padding:"12px 14px",marginBottom:20,maxHeight:160,overflowY:"auto" }}>
                <p style={{ fontSize:11,color:C.gray,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:1 }}>Itens do pedido</p>
                {cart.map((item,i) => (
                  <div key={i} style={{ display:"flex",justifyContent:"space-between",fontSize:13,padding:"3px 0",borderBottom:"1px solid #EAE4DA" }}>
                    <span style={{ color:C.dark }}>{item.name}</span>
                    <span style={{ color:C.red,fontWeight:700,whiteSpace:"nowrap",marginLeft:8 }}>R$ {Number(item.price).toFixed(2).replace(".",",")}</span>
                  </div>
                ))}
                <div style={{ display:"flex",justifyContent:"space-between",marginTop:8,fontSize:15,fontWeight:800 }}>
                  <span style={{ color:C.dark }}>Total</span>
                  <span style={{ color:C.red }}>R$ {total.toFixed(2).replace(".",",")}</span>
                </div>
              </div>

              <button
                onClick={() => setStep("method")}
                disabled={!nomeCliente.trim() || !mesa.trim()}
                style={{ width:"100%",padding:13,background:nomeCliente.trim()&&mesa.trim()?C.red:"#CCC",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:700,cursor:nomeCliente.trim()&&mesa.trim()?"pointer":"not-allowed",transition:"background 0.2s" }}>
                Continuar para Pagamento →
              </button>
            </div>
          )}

          {/* ── STEP: METHOD ──────────────────────────────────── */}
          {step === "method" && (
            <>
              <div style={{ display:"flex",alignItems:"center",marginBottom:18,gap:10 }}>
                <button onClick={()=>setStep("identify")} style={{ background:"none",border:"1px solid #DDD",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,color:C.gray }}>← Voltar</button>
                <div>
                  <p style={{ margin:0,fontWeight:700,color:C.dark,fontSize:14 }}>{nomeCliente} · {mesa}</p>
                  <p style={{ margin:0,fontSize:22,fontWeight:800,color:"#00A868" }}>R$ {total.toFixed(2).replace(".",",")}</p>
                </div>
              </div>

              <p style={{ fontSize:11,fontWeight:700,color:C.gray,textTransform:"uppercase",letterSpacing:1,margin:"0 0 10px" }}>Forma de pagamento</p>
              <div style={{ display:"flex",flexDirection:"column",gap:7,marginBottom:14 }}>
                {methods.map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:10,border:`2px solid ${method===m.id?"#00A868":"#E5E5E5"}`,background:method===m.id?"#F0FBF5":"#fff",cursor:"pointer",textAlign:"left",transition:"all 0.15s" }}>
                    <span style={{ fontSize:20 }}>{m.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700,color:C.dark,fontSize:14 }}>{m.label}</div>
                      <div style={{ fontSize:11,color:C.gray,marginTop:1 }}>{m.desc}</div>
                    </div>
                    <span style={{ width:20,height:20,borderRadius:"50%",border:`2px solid ${method===m.id?"#00A868":"#DDD"}`,background:method===m.id?"#00A868":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                      {method===m.id && <span style={{ color:"#fff",fontSize:12,lineHeight:1 }}>✓</span>}
                    </span>
                  </button>
                ))}
              </div>

              {method === "credit" && (
                <div style={{ background:"#F8F8F8",borderRadius:10,padding:"12px 14px",marginBottom:14 }}>
                  <p style={{ fontSize:12,fontWeight:700,color:C.gray,margin:"0 0 8px" }}>Parcelas (taxa 2,99% a.m.)</p>
                  <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                    {[1,2,3,4,6,10,12].map(n => (
                      <button key={n} onClick={() => setInstallments(n)}
                        style={{ padding:"6px 12px",borderRadius:7,border:`1.5px solid ${installments===n?"#00A868":"#DDD"}`,background:installments===n?"#F0FBF5":"#fff",cursor:"pointer",fontSize:12,fontWeight:700,color:installments===n?"#00A868":C.dark }}>
                        {n}x
                      </button>
                    ))}
                  </div>
                  <p style={{ margin:"8px 0 0",fontSize:12,color:C.gray }}>
                    {installments}x de <strong style={{ color:C.dark }}>R$ {installmentVal.toFixed(2).replace(".",",")}</strong>
                    {installments>1 && <span style={{ color:C.gray }}> · Total: R$ {finalTotal.toFixed(2).replace(".",",")}</span>}
                  </p>
                </div>
              )}

              {method === "pix" && (
                <div style={{ background:"#F0FBF5",border:"1px solid #B0EED2",borderRadius:10,padding:"12px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:12 }}>
                  <span style={{ fontSize:28 }}>⚡</span>
                  <div>
                    <p style={{ margin:0,fontWeight:700,fontSize:13,color:"#007A4D" }}>Pagamento via PIX</p>
                    <p style={{ margin:0,fontSize:12,color:C.gray }}>QR Code gerado na maquininha Stone. Cliente escaneia e paga.</p>
                  </div>
                </div>
              )}

              {method === "cash" && (
                <div style={{ background:"#FFFBF0",border:"1px solid #F5E6B0",borderRadius:10,padding:"12px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:12 }}>
                  <span style={{ fontSize:28 }}>💵</span>
                  <div>
                    <p style={{ margin:0,fontWeight:700,fontSize:13,color:"#7A6000" }}>Pagamento em Dinheiro</p>
                    <p style={{ margin:0,fontSize:12,color:C.gray }}>Operador confirma recebimento e libera o pedido.</p>
                  </div>
                </div>
              )}

              <button onClick={irParaMaquininha} disabled={!method}
                style={{ width:"100%",padding:14,background:method?"#00A868":"#CCC",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:700,cursor:method?"pointer":"not-allowed",transition:"background 0.2s" }}>
                {!method ? "Selecione uma forma de pagamento" :
                 method==="pix" ? "⚡ Gerar QR Code PIX" :
                 method==="cash" ? "💵 Confirmar Dinheiro" :
                 "💳 Apresentar na Maquininha"}
              </button>
            </>
          )}

          {/* ── STEP: AWAITING MACHINE (débito/crédito) ────────── */}
          {step === "awaiting_machine" && (
            <div style={{ textAlign:"center",padding:"8px 0" }}>
              <div style={{ fontSize:60,marginBottom:12,animation:"spin 2s linear infinite" }}>💳</div>
              <style>{`@keyframes spin{0%{transform:rotate(-10deg)}50%{transform:rotate(10deg)}100%{transform:rotate(-10deg)}}`}</style>
              <p style={{ fontSize:20,fontWeight:800,color:C.dark,margin:"0 0 8px",fontFamily:"Georgia,serif" }}>Aguardando Maquininha</p>
              <p style={{ fontSize:13,color:C.gray,margin:"0 0 20px",lineHeight:1.7 }}>
                Passe o cartão na maquininha Stone.<br/>
                Após a <strong style={{color:C.dark}}>aprovação</strong> aparecer no visor,<br/>confirme abaixo para liberar o pedido.
              </p>

              <div style={{ background:"#F9F6F1",borderRadius:12,padding:"14px 16px",marginBottom:20,textAlign:"left" }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                  <span style={{ fontSize:12,color:C.gray }}>Cliente</span>
                  <span style={{ fontSize:13,fontWeight:700,color:C.dark }}>{nomeCliente}</span>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                  <span style={{ fontSize:12,color:C.gray }}>Mesa/Local</span>
                  <span style={{ fontSize:13,fontWeight:700,color:C.dark }}>{mesa}</span>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                  <span style={{ fontSize:12,color:C.gray }}>Forma</span>
                  <span style={{ fontSize:13,fontWeight:700,color:C.dark }}>{selMethod?.label}</span>
                </div>
                {method==="credit"&&installments>1 && (
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                    <span style={{ fontSize:12,color:C.gray }}>Parcelas</span>
                    <span style={{ fontSize:13,fontWeight:700,color:C.dark }}>{installments}x de R$ {installmentVal.toFixed(2).replace(".",",")}</span>
                  </div>
                )}
                <div style={{ display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid #EAE4DA" }}>
                  <span style={{ fontSize:13,fontWeight:700,color:C.dark }}>Total cobrado</span>
                  <span style={{ fontSize:17,fontWeight:800,color:"#00A868" }}>R$ {finalTotal.toFixed(2).replace(".",",")}</span>
                </div>
              </div>

              <button onClick={salvarPedidoPago}
                style={{ width:"100%",padding:15,background:"#00A868",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:10,boxShadow:"0 4px 16px rgba(0,168,104,0.35)" }}>
                ✅ Aprovado na maquininha — Liberar pedido
              </button>
              <button onClick={()=>setStep("method")}
                style={{ width:"100%",padding:10,background:"none",border:"1px solid #DDD",borderRadius:9,fontSize:13,color:C.gray,cursor:"pointer" }}>
                ← Voltar (pagamento não realizado)
              </button>
            </div>
          )}

          {/* ── STEP: PIX QR ──────────────────────────────────── */}
          {step === "pix_qr" && (
            <div style={{ textAlign:"center",padding:"8px 0" }}>
              <p style={{ fontSize:19,fontWeight:800,color:C.dark,margin:"0 0 4px",fontFamily:"Georgia,serif" }}>PIX — QR Code</p>
              <p style={{ fontSize:12,color:C.gray,margin:"0 0 18px" }}>Mostre o QR Code da maquininha Stone para o cliente escanear</p>

              {/* QR Code simulado — na integração real viria do SDK Stone */}
              <div style={{ background:"#F0FBF5",border:"2px dashed #00A868",borderRadius:14,padding:20,marginBottom:16,display:"inline-block" }}>
                <div style={{ width:140,height:140,background:"#fff",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",margin:"0 auto",boxShadow:"0 2px 8px rgba(0,0,0,0.1)" }}>
                  <span style={{ fontSize:60 }}>⚡</span>
                  <span style={{ fontSize:9,color:C.gray,fontFamily:"monospace",marginTop:4,wordBreak:"break-all",padding:"0 4px",lineHeight:1.3 }}>{pixCode.slice(0,16)}</span>
                </div>
                <p style={{ fontSize:11,color:"#007A4D",margin:"10px 0 0",fontWeight:700 }}>Escaneie na maquininha Stone</p>
              </div>

              <div style={{ background:"#F9F6F1",borderRadius:10,padding:"10px 14px",marginBottom:16,textAlign:"left" }}>
                <div style={{ display:"flex",justifyContent:"space-between" }}>
                  <span style={{ fontSize:12,color:C.gray }}>Valor PIX</span>
                  <span style={{ fontSize:16,fontWeight:800,color:"#00A868" }}>R$ {total.toFixed(2).replace(".",",")}</span>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",marginTop:4 }}>
                  <span style={{ fontSize:12,color:C.gray }}>Para</span>
                  <span style={{ fontSize:12,fontWeight:700,color:C.dark }}>{nomeCliente} · {mesa}</span>
                </div>
              </div>

              <p style={{ fontSize:12,color:C.gray,margin:"0 0 14px",lineHeight:1.6 }}>
                Após o cliente efetuar o pagamento e a <strong style={{color:C.dark}}>confirmação</strong> aparecer na maquininha, clique abaixo para liberar o pedido.
              </p>

              <button onClick={salvarPedidoPago}
                style={{ width:"100%",padding:15,background:"#00A868",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:10,boxShadow:"0 4px 16px rgba(0,168,104,0.35)" }}>
                ✅ PIX recebido — Liberar pedido
              </button>
              <button onClick={()=>setStep("method")}
                style={{ width:"100%",padding:10,background:"none",border:"1px solid #DDD",borderRadius:9,fontSize:13,color:C.gray,cursor:"pointer" }}>
                ← Voltar (pagamento não realizado)
              </button>
            </div>
          )}

          {/* ── STEP: CASH CONFIRM ────────────────────────────── */}
          {step === "cash_confirm" && (
            <div style={{ textAlign:"center",padding:"8px 0" }}>
              <div style={{ fontSize:56,marginBottom:12 }}>💵</div>
              <p style={{ fontSize:19,fontWeight:800,color:C.dark,margin:"0 0 8px",fontFamily:"Georgia,serif" }}>Pagamento em Dinheiro</p>
              <p style={{ fontSize:13,color:C.gray,margin:"0 0 20px",lineHeight:1.6 }}>Confirme o recebimento do valor abaixo para liberar o pedido no sistema.</p>

              <div style={{ background:"#FFFBF0",border:"1.5px solid #F5E6B0",borderRadius:12,padding:"18px 16px",marginBottom:20 }}>
                <div style={{ fontSize:12,color:"#7A6000",marginBottom:4 }}>Valor a receber</div>
                <div style={{ fontSize:34,fontWeight:800,color:"#7A4500" }}>R$ {total.toFixed(2).replace(".",",")}</div>
                <div style={{ fontSize:12,color:C.gray,marginTop:6 }}>{nomeCliente} · {mesa}</div>
              </div>

              <button onClick={salvarPedidoPago}
                style={{ width:"100%",padding:15,background:"#00A868",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:10,boxShadow:"0 4px 16px rgba(0,168,104,0.35)" }}>
                ✅ Dinheiro recebido — Liberar pedido
              </button>
              <button onClick={()=>setStep("method")}
                style={{ width:"100%",padding:10,background:"none",border:"1px solid #DDD",borderRadius:9,fontSize:13,color:C.gray,cursor:"pointer" }}>
                ← Voltar
              </button>
            </div>
          )}

          {/* ── STEP: SAVING ──────────────────────────────────── */}
          {step === "saving" && (
            <div style={{ textAlign:"center",padding:"32px 0" }}>
              <div style={{ fontSize:44,marginBottom:16 }}>⏳</div>
              <p style={{ fontSize:16,fontWeight:700,color:C.dark,margin:"0 0 6px" }}>Registrando pedido…</p>
              <p style={{ fontSize:13,color:C.gray }}>Salvando no sistema, aguarde</p>
            </div>
          )}

          {/* ── STEP: SUCCESS ─────────────────────────────────── */}
          {step === "success" && (
            <div style={{ textAlign:"center",padding:"8px 0" }}>
              <div style={{ width:72,height:72,borderRadius:"50%",background:"#00A868",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 16px" }}>✅</div>
              <p style={{ fontSize:21,fontWeight:800,color:"#00A868",margin:"0 0 4px",fontFamily:"Georgia,serif" }}>Pedido confirmado!</p>
              <p style={{ fontSize:14,color:C.gray,margin:"0 0 20px" }}>Pagamento aprovado · {selMethod?.label}</p>

              <div style={{ background:"#F0FBF5",borderRadius:12,padding:"14px 16px",marginBottom:20,textAlign:"left" }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                  <span style={{ fontSize:12,color:C.gray }}>Cliente</span>
                  <span style={{ fontSize:13,fontWeight:700,color:C.dark }}>{nomeCliente}</span>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                  <span style={{ fontSize:12,color:C.gray }}>Mesa/Local</span>
                  <span style={{ fontSize:13,fontWeight:700,color:C.dark }}>{mesa}</span>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                  <span style={{ fontSize:12,color:C.gray }}>Valor pago</span>
                  <span style={{ fontSize:15,fontWeight:800,color:"#00A868" }}>R$ {finalTotal.toFixed(2).replace(".",",")}</span>
                </div>
                {method==="credit"&&installments>1 && (
                  <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
                    <span style={{ fontSize:12,color:C.gray }}>Parcelas</span>
                    <span style={{ fontSize:12,fontWeight:700,color:C.dark }}>{installments}x de R$ {installmentVal.toFixed(2).replace(".",",")}</span>
                  </div>
                )}
                <div style={{ display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid #B0EED2" }}>
                  <span style={{ fontSize:11,color:C.gray }}>NSU</span>
                  <span style={{ fontSize:11,fontFamily:"monospace",color:C.gray }}>{nsu}</span>
                </div>
              </div>

              <button onClick={onSuccess} style={{ width:"100%",padding:13,background:C.red,color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer" }}>
                🍕 Novo pedido
              </button>
            </div>
          )}

          {/* ── STEP: ERROR ───────────────────────────────────── */}
          {step === "error" && (
            <div style={{ textAlign:"center",padding:"16px 0" }}>
              <div style={{ fontSize:52,marginBottom:12 }}>⚠️</div>
              <p style={{ fontSize:18,fontWeight:800,color:"#C8181A",margin:"0 0 8px" }}>Erro ao registrar pedido</p>
              <p style={{ fontSize:13,color:C.gray,margin:"0 0 20px" }}>{saveError}</p>
              <p style={{ fontSize:12,color:C.gray,background:"#FFF0F0",borderRadius:9,padding:12,marginBottom:20 }}>
                O pagamento foi realizado mas houve falha ao salvar. Anote o NSU <strong>{nsu}</strong> e registre manualmente se necessário.
              </p>
              <button onClick={salvarPedidoPago}
                style={{ width:"100%",padding:13,background:"#00A868",color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:8 }}>
                🔄 Tentar novamente
              </button>
              <button onClick={onClose}
                style={{ width:"100%",padding:10,background:"none",border:"1px solid #DDD",borderRadius:9,fontSize:13,color:C.gray,cursor:"pointer" }}>
                Fechar
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── RESERVATION MODAL ────────────────────────────────────────────────────────
function ReservationModal({ onClose }) {
  const [f, setF] = useState({ name:"",phone:"",date:"",time:"",guests:"2",obs:"" });
  const [sent, setSent] = useState(false);
  const times = ["18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30"];
  const ok = f.name && f.phone && f.date && f.time;

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16 }}>
      <div style={{ background:"#fff",borderRadius:20,width:"100%",maxWidth:420,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ background:C.red,padding:"18px 22px",display:"flex",alignItems:"center",gap:10,borderRadius:"20px 20px 0 0" }}>
          <span style={{ fontSize:20 }}>🍽️</span>
          <span style={{ color:"#fff",fontFamily:"Georgia,serif",fontSize:17,fontWeight:"bold" }}>Reservar Mesa</span>
          <button onClick={onClose} style={{ marginLeft:"auto",background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer" }}>×</button>
        </div>
        <div style={{ padding:"20px 22px 24px",fontFamily:"sans-serif" }}>
          {!sent ? (<>
            {[{l:"Seu nome",k:"name",t:"text",p:"Nome completo"},{l:"WhatsApp",k:"phone",t:"tel",p:"(48) 9 9999-9999"}].map(({l,k,t,p})=>(
              <div key={k} style={{ marginBottom:14 }}>
                <label style={{ fontSize:12,fontWeight:700,color:C.gray,display:"block",marginBottom:5 }}>{l}</label>
                <input type={t} placeholder={p} value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}
                  style={{ width:"100%",padding:"9px 12px",border:`1.5px solid #DDD`,borderRadius:9,fontSize:14,outline:"none",boxSizing:"border-box" }} />
              </div>
            ))}
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14 }}>
              <div>
                <label style={{ fontSize:12,fontWeight:700,color:C.gray,display:"block",marginBottom:5 }}>Data</label>
                <input type="date" value={f.date} onChange={e=>setF({...f,date:e.target.value})}
                  style={{ width:"100%",padding:"9px 12px",border:"1.5px solid #DDD",borderRadius:9,fontSize:14,outline:"none",boxSizing:"border-box" }} />
              </div>
              <div>
                <label style={{ fontSize:12,fontWeight:700,color:C.gray,display:"block",marginBottom:5 }}>Horário</label>
                <select value={f.time} onChange={e=>setF({...f,time:e.target.value})}
                  style={{ width:"100%",padding:"9px 12px",border:"1.5px solid #DDD",borderRadius:9,fontSize:14,background:"#fff",outline:"none",boxSizing:"border-box" }}>
                  <option value="">Selecione</option>
                  {times.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12,fontWeight:700,color:C.gray,display:"block",marginBottom:5 }}>Pessoas</label>
              <div style={{ display:"flex",gap:6 }}>
                {["1","2","3","4","5","6","7","8+"].map(n=>(
                  <button key={n} onClick={()=>setF({...f,guests:n})}
                    style={{ flex:1,padding:"7px 2px",borderRadius:7,border:`1.5px solid ${f.guests===n?C.red:"#DDD"}`,background:f.guests===n?"#FFF0F0":"#fff",cursor:"pointer",fontSize:12,fontWeight:700,color:f.guests===n?C.red:C.dark }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:12,fontWeight:700,color:C.gray,display:"block",marginBottom:5 }}>Observações (opcional)</label>
              <textarea value={f.obs} onChange={e=>setF({...f,obs:e.target.value})} placeholder="Aniversário, alergias…" rows={3}
                style={{ width:"100%",padding:"9px 12px",border:"1.5px solid #DDD",borderRadius:9,fontSize:14,outline:"none",resize:"none",boxSizing:"border-box" }} />
            </div>
            <button onClick={()=>ok&&setSent(true)} disabled={!ok}
              style={{ width:"100%",padding:13,background:ok?C.red:"#CCC",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:700,cursor:ok?"pointer":"not-allowed" }}>
              Confirmar Reserva
            </button>
          </>) : (
            <div style={{ textAlign:"center",padding:"16px 0" }}>
              <div style={{ fontSize:52,marginBottom:12 }}>🎉</div>
              <p style={{ fontSize:20,fontWeight:800,color:C.red,margin:"0 0 8px",fontFamily:"Georgia,serif" }}>Reserva confirmada!</p>
              <p style={{ fontSize:14,color:C.gray,margin:"0 0 18px" }}>{f.name}, mesa para {f.guests} {f.guests==="1"?"pessoa":"pessoas"} em {f.date.split("-").reverse().join("/")} às {f.time}.</p>
              <div style={{ background:"#FFF5F5",borderRadius:10,padding:14,marginBottom:18 }}>
                <p style={{ fontSize:12,color:C.gray,margin:0 }}>Confirmação via WhatsApp em breve. Dúvidas: @betopizzariagaropaba</p>
              </div>
              <button onClick={onClose} style={{ width:"100%",padding:12,background:C.red,color:"#fff",border:"none",borderRadius:10,fontSize:14,fontWeight:700,cursor:"pointer" }}>Fechar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CART SIDEBAR ─────────────────────────────────────────────────────────────
function CartSidebar({ cart, onRemove, onClear, onCheckout, onClose }) {
  const total = cart.reduce((s,i)=>s+i.price,0);
  return (
    <div style={{ position:"fixed",inset:0,zIndex:998,display:"flex",justifyContent:"flex-end" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.4)" }} />
      <div style={{ position:"relative",width:"100%",maxWidth:370,background:"#fff",display:"flex",flexDirection:"column",boxShadow:"-6px 0 30px rgba(0,0,0,0.15)" }}>
        <div style={{ background:C.red,padding:"18px 20px",display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ fontSize:20 }}>🛒</span>
          <span style={{ color:"#fff",fontFamily:"Georgia,serif",fontSize:17,fontWeight:"bold" }}>Seu Pedido</span>
          <button onClick={onClose} style={{ marginLeft:"auto",background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer" }}>×</button>
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:16 }}>
          {cart.length===0 ? (
            <div style={{ textAlign:"center",padding:"40px 20px",color:C.gray }}>
              <div style={{ fontSize:44,marginBottom:10 }}>🍕</div>
              <p style={{ fontSize:14,margin:0,fontFamily:"sans-serif" }}>Seu carrinho está vazio</p>
            </div>
          ) : cart.map((item,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:10,padding:"11px 0",borderBottom:`1px solid ${C.lightGray}` }}>
              <div style={{ flex:1 }}>
                <p style={{ margin:"0 0 2px",fontWeight:600,fontSize:14,color:C.dark,fontFamily:"sans-serif" }}>{item.name}</p>
                <p style={{ margin:0,fontSize:11,color:C.gray,fontFamily:"sans-serif" }}>{item.detail}</p>
              </div>
              <span style={{ fontWeight:700,fontSize:13,color:C.red,fontFamily:"sans-serif",whiteSpace:"nowrap" }}>R$ {item.price.toFixed(2).replace(".",",")}</span>
              <button onClick={()=>onRemove(i)} style={{ background:"none",border:"none",color:C.gray,cursor:"pointer",fontSize:18,lineHeight:1,padding:0 }}>×</button>
            </div>
          ))}
        </div>
        {cart.length>0&&(
          <div style={{ padding:"14px 18px 22px",borderTop:`2px solid ${C.lightGray}` }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:14,fontFamily:"sans-serif" }}>
              <span style={{ fontSize:16,fontWeight:700,color:C.dark }}>Total</span>
              <span style={{ fontSize:22,fontWeight:800,color:C.red }}>R$ {total.toFixed(2).replace(".",",")}</span>
            </div>
            <button onClick={onCheckout} style={{ width:"100%",padding:13,background:"#00A868",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
              <span>💳</span> Pagar com Stone
            </button>
            <button onClick={onClear} style={{ width:"100%",marginTop:7,padding:9,background:"none",border:`1px solid #DDD`,borderRadius:8,fontSize:12,color:C.gray,cursor:"pointer",fontFamily:"sans-serif" }}>
              Limpar carrinho
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState("inicio");
  const [cat, setCat] = useState("Tradicionais");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [showRes, setShowRes] = useState(false);
  const [flash, setFlash] = useState(null);
  const [sizes, setSizes] = useState({});

  const navItems = [
    { id:"inicio", label:"Início" },
    { id:"cardapio", label:"Cardápio" },
    { id:"bebidas", label:"Bebidas" },
    { id:"contato", label:"Contato" },
  ];

  function addToCart(item) {
    setCart(p=>[...p,item]);
    setFlash(item.name);
    setTimeout(()=>setFlash(null), 1400);
  }

  function addPizza(category, pizza) {
    const sz = sizes[pizza.name] || "M";
    addToCart({ name:`${pizza.name} (${sz})`, detail:pizza.desc, price:MENU[category].prices[sz] });
  }

  const totalItems = cart.length;
  const totalPrice = cart.reduce((s,i)=>s+i.price, 0);

  return (
    <div style={{ fontFamily:"Georgia,serif",background:C.offWhite,minHeight:"100vh",color:C.dark }}>

      {/* NAV */}
      <nav style={{ position:"sticky",top:0,zIndex:100,background:"#fff",borderBottom:`2px solid ${C.lightGray}`,boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",gap:8,height:66 }}>
          <img src={`data:image/jpeg;base64,${LOGO_B64}`} alt="Beto Pizzaria" style={{ height:50,width:50,objectFit:"contain",borderRadius:6 }} />
          <div style={{ marginLeft:4 }}>
            <div style={{ fontFamily:"Georgia,serif",fontWeight:"bold",fontSize:17,color:C.red,letterSpacing:0.5 }}>BETO PIZZARIA</div>
            <div style={{ fontSize:10,color:C.gray,letterSpacing:2,textTransform:"uppercase",fontFamily:"sans-serif" }}>Garopaba · SC</div>
          </div>
          <div style={{ display:"flex",gap:2,marginLeft:"auto",alignItems:"center" }}>
            {navItems.map(n=>(
              <button key={n.id} onClick={()=>setSection(n.id)}
                style={{ padding:"7px 14px",background:section===n.id?C.red:"transparent",color:section===n.id?"#fff":C.dark,border:section===n.id?"none":`1px solid transparent`,borderRadius:8,cursor:"pointer",fontSize:13,fontFamily:"sans-serif",fontWeight:section===n.id?700:400,transition:"all 0.15s" }}>
                {n.label}
              </button>
            ))}
            <button onClick={()=>setShowRes(true)}
              style={{ padding:"7px 14px",background:C.green,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontFamily:"sans-serif",fontWeight:600,marginLeft:4 }}>
              🍽️ Reservar
            </button>
          </div>
          <button onClick={()=>setShowCart(true)} style={{ marginLeft:10,position:"relative",background:totalItems>0?C.red:"#F5F0EB",border:`1.5px solid ${totalItems>0?C.red:C.border}`,borderRadius:9,padding:"7px 13px",cursor:"pointer",color:totalItems>0?"#fff":C.gray,display:"flex",alignItems:"center",gap:6,transition:"all 0.2s" }}>
            <span style={{ fontSize:16 }}>🛒</span>
            {totalItems>0&&<span style={{ fontSize:13,fontFamily:"sans-serif",fontWeight:700 }}>R$ {totalPrice.toFixed(0)}</span>}
            {totalItems>0&&<span style={{ position:"absolute",top:-7,right:-7,background:C.green,color:"#fff",borderRadius:"50%",width:19,height:19,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,fontFamily:"sans-serif" }}>{totalItems}</span>}
          </button>
        </div>
      </nav>

      {/* FLASH */}
      {flash&&(
        <div style={{ position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:C.green,color:"#fff",padding:"11px 22px",borderRadius:40,fontFamily:"sans-serif",fontSize:13,fontWeight:700,zIndex:500,whiteSpace:"nowrap",boxShadow:"0 4px 16px rgba(0,0,0,0.15)" }}>
          ✓ {flash} adicionado!
        </div>
      )}

      {/* HERO */}
      {section==="inicio"&&(
        <>
          <section style={{ background:"#fff",padding:"60px 20px 50px",textAlign:"center",borderBottom:`1px solid ${C.lightGray}` }}>
            <img src={`data:image/jpeg;base64,${LOGO_B64}`} alt="Beto Pizzaria" style={{ width:140,height:140,objectFit:"contain",borderRadius:12,marginBottom:24 }} />
            <h1 style={{ fontFamily:"Georgia,serif",fontSize:42,color:C.red,margin:"0 0 8px",letterSpacing:-0.5 }}>Beto Pizzaria</h1>
            <p style={{ fontSize:16,color:C.gray,margin:"0 0 6px",fontFamily:"sans-serif" }}>Garopaba · SC</p>
            <p style={{ fontSize:14,color:C.gray,margin:"0 0 36px",fontFamily:"sans-serif" }}>Rodízio e À La Carte · Seg a Dom das 19h às 23h</p>
            <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap" }}>
              <button onClick={()=>setSection("cardapio")}
                style={{ padding:"13px 28px",background:C.red,color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif" }}>
                🍕 Ver Cardápio
              </button>
              <button onClick={()=>setShowRes(true)}
                style={{ padding:"13px 28px",background:"#fff",color:C.green,border:`2px solid ${C.green}`,borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif" }}>
                🍽️ Reservar Mesa
              </button>
            </div>
          </section>

          <section style={{ maxWidth:900,margin:"0 auto",padding:"40px 20px" }}>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16 }}>
              {[
                { icon:"🍕",title:"70+ sabores",sub:"Tradicionais, Especiais, Carnes, Mar e Doces" },
                { icon:"🏠",title:"Ambiente familiar",sub:"Espaço aconchegante em Garopaba" },
                { icon:"💳",title:"Stone Pagamentos",sub:"Débito, crédito, parcelado e PIX" },
                { icon:"📍",title:"Rod. SC-434",sub:"Garopaba, Santa Catarina" },
              ].map(({icon,title,sub})=>(
                <div key={title} style={{ background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:"20px 18px",textAlign:"center" }}>
                  <div style={{ fontSize:32,marginBottom:10 }}>{icon}</div>
                  <p style={{ margin:"0 0 4px",fontWeight:700,fontSize:15,fontFamily:"Georgia,serif",color:C.dark }}>{title}</p>
                  <p style={{ margin:0,fontSize:12,color:C.gray,fontFamily:"sans-serif",lineHeight:1.5 }}>{sub}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Preview cards */}
          <section style={{ maxWidth:1100,margin:"0 auto",padding:"0 20px 60px" }}>
            <h2 style={{ fontFamily:"Georgia,serif",fontSize:28,color:C.dark,margin:"0 0 24px",textAlign:"center" }}>
              <span style={{ color:C.red }}>Destaques</span> do Cardápio
            </h2>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14 }}>
              {[
                { cat:"Carnes",name:"Picanha",desc:"Mussarela e Tiras de Picanha",price:"A partir de R$ 90" },
                { cat:"Frutos do Mar",name:"Camarão",desc:"Mussarela, Camarão e Azeitonas",price:"A partir de R$ 100" },
                { cat:"Especiais",name:"Pepperoni",desc:"Mussarela e Pepperoni",price:"A partir de R$ 80" },
                { cat:"Doces",name:"Morango",desc:"Chocolate ao Leite e Morangos",price:"A partir de R$ 80" },
              ].map(item=>(
                <div key={item.name} style={{ background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:14,padding:"18px",display:"flex",flexDirection:"column",gap:8 }}>
                  <span style={{ fontSize:11,fontWeight:700,color:C.red,textTransform:"uppercase",letterSpacing:1,fontFamily:"sans-serif" }}>{item.cat}</span>
                  <p style={{ margin:0,fontWeight:700,fontSize:16,fontFamily:"Georgia,serif" }}>{item.name}</p>
                  <p style={{ margin:0,fontSize:12,color:C.gray,fontFamily:"sans-serif",flex:1 }}>{item.desc}</p>
                  <p style={{ margin:0,fontWeight:700,fontSize:14,color:C.green,fontFamily:"sans-serif" }}>{item.price}</p>
                  <button onClick={()=>{ setSection("cardapio"); setCat(item.cat); }}
                    style={{ padding:"8px",background:C.red,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"sans-serif",fontSize:13,fontWeight:600 }}>
                    Ver no cardápio
                  </button>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* CARDÁPIO */}
      {section==="cardapio"&&(
        <section style={{ maxWidth:1100,margin:"0 auto",padding:"40px 20px" }}>
          <h2 style={{ fontFamily:"Georgia,serif",fontSize:34,color:C.red,margin:"0 0 6px" }}>Cardápio</h2>
          <p style={{ fontFamily:"sans-serif",color:C.gray,margin:"0 0 28px",fontSize:13 }}>
            Borda recheada: +R$ 20 · P = Pequena (25cm, 1 sabor) · M = Média (30cm, 2 sabores) · G = Grande (35cm, 3 sabores)
          </p>

          {/* Category tabs */}
          <div style={{ display:"flex",gap:8,marginBottom:26,flexWrap:"wrap" }}>
            {Object.keys(MENU).map(c=>(
              <button key={c} onClick={()=>setCat(c)}
                style={{ padding:"8px 18px",background:cat===c?C.red:"#fff",color:cat===c?"#fff":C.dark,border:`1.5px solid ${cat===c?C.red:C.border}`,borderRadius:22,cursor:"pointer",fontFamily:"sans-serif",fontSize:13,fontWeight:cat===c?700:400,transition:"all 0.15s" }}>
                {c}
              </button>
            ))}
          </div>

          {/* Prices */}
          <div style={{ display:"flex",gap:10,marginBottom:22,flexWrap:"wrap" }}>
            {Object.entries(MENU[cat].prices).map(([sz,price])=>(
              <div key={sz} style={{ background:C.red,color:"#fff",borderRadius:9,padding:"7px 16px",fontFamily:"sans-serif" }}>
                <span style={{ fontSize:11,opacity:0.8 }}>{sz} · </span>
                <strong style={{ fontSize:15 }}>R$ {price}</strong>
                <span style={{ fontSize:10,opacity:0.7,display:"block" }}>{sz==="P"?"25cm · 1 sabor":sz==="M"?"30cm · 2 sabores":"35cm · 3 sabores"}</span>
              </div>
            ))}
          </div>

          {/* Pizza grid */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(272px,1fr))",gap:14 }}>
            {MENU[cat].items.map(pizza=>{
              const sz = sizes[pizza.name]||"M";
              const price = MENU[cat].prices[sz];
              return (
                <div key={pizza.name} style={{ background:"#fff",borderRadius:14,border:`1.5px solid ${C.border}`,padding:"16px 16px 13px",display:"flex",flexDirection:"column",gap:7 }}>
                  <div>
                    <p style={{ margin:"0 0 3px",fontWeight:700,fontSize:15,fontFamily:"Georgia,serif",color:C.dark }}>{pizza.name}</p>
                    <p style={{ margin:0,fontSize:11,color:C.gray,fontFamily:"sans-serif",lineHeight:1.5 }}>{pizza.desc}</p>
                  </div>
                  <div style={{ display:"flex",gap:5,marginTop:2 }}>
                    {Object.keys(MENU[cat].prices).map(s=>(
                      <button key={s} onClick={()=>setSizes({...sizes,[pizza.name]:s})}
                        style={{ flex:1,padding:"5px",border:`1.5px solid ${sz===s?C.red:"#DDD"}`,borderRadius:6,background:sz===s?"#FFF0F0":"#fff",cursor:"pointer",fontSize:11,fontWeight:700,color:sz===s?C.red:C.gray,fontFamily:"sans-serif" }}>
                        {s}·R${MENU[cat].prices[s]}
                      </button>
                    ))}
                  </div>
                  <button onClick={()=>addPizza(cat,pizza)}
                    style={{ padding:"9px",background:C.red,color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontFamily:"sans-serif",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5 }}>
                    + Adicionar · R$ {price}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Sides */}
          <h3 style={{ fontFamily:"Georgia,serif",fontSize:24,color:C.dark,margin:"44px 0 14px" }}>Porções</h3>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:10 }}>
            {SIDES.map(item=>(
              <div key={item.name} style={{ background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"14px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10 }}>
                <div>
                  <p style={{ margin:0,fontWeight:700,fontSize:14,fontFamily:"Georgia,serif" }}>{item.name}</p>
                  <p style={{ margin:0,fontSize:15,fontWeight:800,color:C.red,fontFamily:"sans-serif" }}>R$ {item.price}</p>
                </div>
                <button onClick={()=>addToCart({name:item.name,detail:"Porção",price:item.price})}
                  style={{ background:C.red,color:"#fff",border:"none",borderRadius:7,width:32,height:32,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>+</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BEBIDAS */}
      {section==="bebidas"&&(
        <section style={{ maxWidth:1100,margin:"0 auto",padding:"40px 20px" }}>
          <h2 style={{ fontFamily:"Georgia,serif",fontSize:34,color:C.red,margin:"0 0 28px" }}>Bebidas</h2>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:10 }}>
            {DRINKS.map(item=>(
              <div key={item.name} style={{ background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"14px",display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ fontSize:24 }}>🥤</span>
                <div style={{ flex:1 }}>
                  <p style={{ margin:"0 0 1px",fontWeight:600,fontSize:13,fontFamily:"sans-serif",color:C.dark }}>{item.name}</p>
                  <p style={{ margin:0,fontSize:15,fontWeight:800,color:C.red,fontFamily:"sans-serif" }}>R$ {item.price}</p>
                </div>
                <button onClick={()=>addToCart({name:item.name,detail:"Bebida",price:item.price})}
                  style={{ background:C.red,color:"#fff",border:"none",borderRadius:7,width:32,height:32,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTATO */}
      {section==="contato"&&(
        <section style={{ maxWidth:680,margin:"0 auto",padding:"40px 20px" }}>
          <h2 style={{ fontFamily:"Georgia,serif",fontSize:34,color:C.red,margin:"0 0 28px" }}>Contato</h2>
          <div style={{ display:"grid",gap:14 }}>
            {[
              { icon:"📍",label:"Endereço",value:"Rod. SC-434, Garopaba — SC" },
              { icon:"⏰",label:"Horário",value:"Segunda a Domingo · 19h às 23h" },
              { icon:"📱",label:"Instagram",value:"@betopizzariagaropaba" },
              { icon:"💳",label:"Pagamentos",value:"Stone · Débito · Crédito · PIX · Dinheiro" },
            ].map(({icon,label,value})=>(
              <div key={label} style={{ background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"16px 18px",display:"flex",alignItems:"center",gap:14 }}>
                <span style={{ fontSize:26 }}>{icon}</span>
                <div>
                  <p style={{ margin:"0 0 2px",fontSize:11,color:C.gray,fontFamily:"sans-serif",textTransform:"uppercase",letterSpacing:1 }}>{label}</p>
                  <p style={{ margin:0,fontWeight:600,fontSize:14,fontFamily:"sans-serif",color:C.dark }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:"#F0FBF5",border:"1.5px solid #B0EED2",borderRadius:12,padding:"18px 22px",marginTop:22,display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ background:"#00A868",borderRadius:8,padding:"6px 14px",fontWeight:900,fontSize:18,color:"#fff",letterSpacing:-0.5,flexShrink:0 }}>stone</div>
            <div>
              <p style={{ margin:"0 0 2px",fontWeight:700,fontSize:14,fontFamily:"sans-serif",color:"#007A4D" }}>Parceiro Stone</p>
              <p style={{ margin:0,fontSize:12,color:C.gray,fontFamily:"sans-serif" }}>Pagamentos seguros com maquininha Stone. Débito, crédito à vista ou parcelado.</p>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ background:C.dark,padding:"28px 20px",textAlign:"center",marginTop:40 }}>
        <img src={`data:image/jpeg;base64,${LOGO_B64}`} alt="Beto Pizzaria" style={{ width:52,height:52,objectFit:"contain",borderRadius:6,marginBottom:10 }} />
        <p style={{ color:"rgba(255,255,255,0.6)",fontFamily:"sans-serif",fontSize:12,margin:"0 0 3px" }}>© 2026 Beto Pizzaria · Garopaba, SC</p>
        <p style={{ color:"rgba(255,255,255,0.4)",fontFamily:"sans-serif",fontSize:11,margin:"0 0 10px" }}>@betopizzariagaropaba · Rod. SC-434</p>
        <p style={{ color:"rgba(255,255,255,0.25)",fontFamily:"sans-serif",fontSize:10,margin:0,letterSpacing:0.5 }}>
          Desenvolvido por <a href="https://tecchti.vercel.app" target="_blank" rel="noopener noreferrer" style={{ color:"rgba(255,255,255,0.45)",textDecoration:"none",fontWeight:600 }}>TecchTI</a>
        </p>
      </footer>

      {showCart&&<CartSidebar cart={cart} onRemove={i=>setCart(c=>c.filter((_,idx)=>idx!==i))} onClear={()=>setCart([])} onCheckout={()=>{setShowCart(false);setShowPay(true);}} onClose={()=>setShowCart(false)} />}
      {showPay&&<StoneModal cart={cart} total={cart.reduce((s,i)=>s+i.price,0)} onClose={()=>setShowPay(false)} onSuccess={()=>{setShowPay(false);setCart([]);}} />}
      {showRes&&<ReservationModal onClose={()=>setShowRes(false)} />}
    </div>
  );
}
