# Beto Pizzaria · Site

Site de cardápio, pedidos e reservas da Beto Pizzaria – Garopaba, SC.

## Estrutura do projeto

```
beto-pizzaria/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx          ← entry point
    └── App.jsx           ← componente principal (beto-pizzaria.jsx renomeado)
```

## Como rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Gerar build de produção
npm run build

# Preview da build
npm run preview
```

## Deploy (Vercel)

```bash
npm i -g vercel
vercel --prod
```

Ou conecte o repositório no painel da Vercel — ela detecta o Vite automaticamente.

## Logo

No arquivo `src/App.jsx`, substitua o valor da constante `LOGO_B64` pela string base64
da imagem da logo da pizzaria (sem o prefixo `data:image/jpeg;base64,`):

```js
const LOGO_B64 = "sua_string_base64_aqui";
```

Para gerar o base64 de uma imagem:
```bash
# Linux/Mac
base64 -w 0 logo.jpg

# PowerShell (Windows)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("logo.jpg"))
```
