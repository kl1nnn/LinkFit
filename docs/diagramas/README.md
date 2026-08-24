# Diagramas do LinkFit

Documentação visual do projeto **LinkFit**, feita em **draw.io** (diagrams.net).
Todos os arquivos estão no formato `.drawio` (XML não compactado), podem ser abertos,
editados e exportados livremente.

## Como abrir

1. Acesse [app.diagrams.net](https://app.diagrams.net) (ou use o app draw.io Desktop / a extensão do VS Code).
2. Escolha **File → Open From → Device** e selecione o arquivo desejado.
3. Para ver todos os diagramas de uma vez, abra `linkfit-todos-os-diagramas.drawio`:
   cada diagrama fica em uma aba na parte inferior da tela.

Para exportar uma imagem para o relatório: **File → Export as → PNG** (marque *Transparent Background*
desmarcado e *Zoom 200%* para melhor qualidade) ou **PDF**.

## Diagramas

| # | Arquivo | Diagrama | O que mostra |
|---|---|---|---|
| 01 | `01-casos-de-uso.drawio` | Casos de uso (UML) | Atores Aluno e Personal Trainer, casos de uso de cada perfil, casos comuns herdados do ator Usuário e as relações «include» / «extend». |
| 02 | `02-diagrama-de-classes.drawio` | Classes (UML) | Modelo de domínio: Usuario, Aluno, PersonalTrainer, Evolucao, Medida, SolicitacaoContratacao, Agendamento, Treino, Exercicio, Conversa, Mensagem, Preferencias e o utilitário de armazenamento local. |
| 03 | `03-modelo-entidade-relacionamento.drawio` | Entidade-Relacionamento (MER/DER) | Modelo relacional proposto para a evolução do protótipo, com chaves primárias, estrangeiras e cardinalidades em pé-de-galinha. |
| 04 | `04-arquitetura-componentes.drawio` | Componentes / Arquitetura | Como a SPA está organizada: `main.jsx`, `App.jsx`, páginas por perfil, componentes reutilizáveis, hooks, utilitários e as APIs do navegador usadas (localStorage, FileReader, MediaRecorder, Canvas, Intl). |
| 05 | `05-diagrama-de-pacotes.drawio` | Pacotes | Estrutura de diretórios do repositório e as dependências «import» entre `pages`, `components`, `hooks`, `utils`, `data` e `constants`. |
| 06 | `06-sequencia-contratacao-personal.drawio` | Sequência | Solicitação de contratação enviada pelo aluno e a resposta (aceitar/recusar) do personal, com o fragmento `alt`. |
| 07 | `07-sequencia-envio-mensagem.drawio` | Sequência | Envio de mensagem no chat nos três formatos: texto, imagem (FileReader) e áudio (MediaRecorder). |
| 08 | `08-atividades-agendar-treino.drawio` | Atividades | Fluxo de agendamento de treino com raias (Personal / Sistema / Persistência) e a verificação de conflito de horário. |
| 09 | `09-maquina-de-estados.drawio` | Máquina de estados | Ciclo de vida da solicitação de contratação, da sessão do usuário e da sessão de treino. |
| 10 | `10-fluxo-de-navegacao.drawio` | Navegação de telas | Mapa das telas por perfil, controlado pelos estados `screen`, `role` e `view`. |
| 11 | `11-diagrama-de-implantacao.drawio` | Implantação | Da máquina do desenvolvedor ao GitHub Pages, incluindo `npm run build`, `npm run deploy` e o navegador do usuário. |
| — | `linkfit-todos-os-diagramas.drawio` | Todos | Arquivo único com os 11 diagramas em abas separadas. |

## Correspondência com o código

| Diagrama | Arquivos de referência |
|---|---|
| Casos de uso / Navegação | `src/App.jsx`, `src/components/Sidebar.jsx`, `src/pages/Landing.jsx` |
| Classes / MER | `src/data/students.js`, `src/data/trainers.js`, `src/data/agenda.js`, `src/data/workouts.js`, `src/data/conversations.js` |
| Arquitetura / Pacotes | `src/main.jsx`, `src/App.jsx`, `src/hooks/usePersistedState.js`, `src/utils/readAvatarFile.js` |
| Sequência (contratação) | `src/pages/BuscarPersonal.jsx`, `src/pages/PersonalDashboard.jsx` |
| Sequência (chat) | `src/pages/ChatView.jsx` |
| Atividades | `src/pages/AlunoAgenda.jsx` |
| Estados | `src/pages/BuscarPersonal.jsx`, `src/pages/PersonalDashboard.jsx`, `src/App.jsx` |
| Implantação | `vite.config.js`, `package.json`, `iniciar-linkfit.bat` |

## Convenções usadas

- **Laranja** (`#E07040`): elementos centrais do LinkFit (App, domínio principal).
- **Azul**: perfil do aluno. **Verde**: perfil do personal trainer.
- **Amarelo**: dados, persistência e pontos de decisão. **Roxo**: evolução física e componentes visuais.
- **Cinza**: elementos de infraestrutura e APIs do navegador.
- Linhas tracejadas representam dependências («import», «usa», «persiste») e retornos de mensagem.

> Observação: o protótipo não possui backend. Onde os diagramas citam banco de dados
> (principalmente o MER), trata-se do modelo proposto para a próxima etapa do projeto;
> hoje os dados são mantidos em JSON no `localStorage` do navegador.
