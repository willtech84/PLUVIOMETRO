# 🌧️ Pluviômetro Digital

PWA para registro e monitoramento de chuvas com backup automático no Google Drive.

## 📲 Como instalar no celular

Acesse a URL do GitHub Pages do projeto e toque em **"Adicionar à tela inicial"** (Android) ou **"Compartilhar → Adicionar à Tela de Início"** (iPhone).

## 🗂️ Estrutura do repositório

```
├── index.html              ← App principal
├── manifest.json           ← Configuração PWA
├── sw.js                   ← Service Worker (offline)
├── icons/                  ← Ícones do app
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-384.png
│   └── icon-512.png
├── backup_script.gs        ← Script Google Apps Script (backup nuvem)
└── .github/
    └── workflows/
        └── deploy.yml      ← Deploy automático GitHub Pages
```

## ⚙️ Como ativar o GitHub Pages (primeira vez)

1. Vá em **Settings → Pages** no seu repositório
2. Em **Source**, selecione **GitHub Actions**
3. Faça um push ou clique em **Actions → Deploy → Run workflow**
4. Após alguns segundos, o app estará disponível em:
   `https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO`

## ☁️ Backup automático no Google Drive

1. Acesse [script.google.com](https://script.google.com) e crie um novo projeto
2. Cole o conteúdo de `backup_script.gs`
3. **Implantar → Nova implantação → App da Web**
   - Executar como: **Eu**
   - Acesso: **Qualquer pessoa**
4. Copie a URL gerada
5. No app, vá em **Ferramentas → Backup → cole a URL**

## 🚀 Funcionalidades

- ✅ Registro de chuva, temperatura e fenômenos
- ✅ Importação e exportação CSV
- ✅ Relatório para impressão / PDF
- ✅ Backup automático no Google Drive + Google Sheets
- ✅ Dados climáticos reais via Open-Meteo API
- ✅ Funciona offline (PWA)
- ✅ Instalável no celular sem app store

## 🛠️ Tecnologias

- React 18 (via CDN)
- Tailwind CSS
- Service Worker / PWA
- Google Apps Script (backup)
- Open-Meteo API (clima)
- ViaCEP API (localização)
