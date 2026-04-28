# 🔒 Guia de Segurança — Beto Pizzaria

## O que foi corrigido

| Problema | Status |
|----------|--------|
| Chave Supabase hardcoded no código | ✅ Corrigido → usa `.env` |
| Senha admin `1234` no localStorage | ✅ Corrigido → Supabase Auth |
| Import Supabase via CDN | ✅ Corrigido → pacote npm |
| Rota /admin sem proteção real | ✅ Corrigido → verifica sessão |
| `.env` no git | ✅ Corrigido → `.gitignore` |

---

## ⚡ O que você precisa fazer no Supabase

### 1. Criar o usuário admin
No painel do Supabase → **Authentication → Users → Add User**
- E-mail: `admin@betopizzaria.com` (ou o e-mail que quiser)
- Senha: crie uma senha forte (mínimo 12 caracteres, letras + números + símbolos)

### 2. Configurar Rate Limiting (proteção contra força bruta)
No painel do Supabase → **Authentication → Rate Limits**
- Já vem ativado por padrão ✅

### 3. Verificar as variáveis de ambiente

No arquivo `.env` (que NÃO vai para o git):
```
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_AQUI
```

Para pegar suas chaves: Supabase → **Project Settings → API**

### 4. Na Vercel (deploy)
Em vez do `.env`, configure as variáveis em:
**Vercel → Seu projeto → Settings → Environment Variables**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 🛡️ Segurança no Supabase (Row Level Security)

Certifique-se de que suas tabelas têm RLS ativado:

```sql
-- Ativar RLS nas tabelas
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- Leitura pública (cardápio visível para clientes)
CREATE POLICY "produtos_leitura_publica" ON produtos
  FOR SELECT USING (ativo = true);

-- Escrita apenas para usuários autenticados (admin)
CREATE POLICY "produtos_admin_total" ON produtos
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "pedidos_insercao_publica" ON pedidos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "pedidos_admin_gerenciar" ON pedidos
  FOR ALL USING (auth.role() = 'authenticated');
```

---

## 🚀 Como rodar o projeto

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

---

## ⚠️ NUNCA faça isso

- ❌ Colocar chaves de API direto no código
- ❌ Commitar o arquivo `.env`
- ❌ Usar senha `1234` ou qualquer senha fraca
- ❌ Armazenar senhas no localStorage
