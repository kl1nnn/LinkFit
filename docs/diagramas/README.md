# Diagramas do LinkFit

Diagramas do projeto **LinkFit** feitos em **draw.io** (diagrams.net), seguindo o modelo do
trabalho: um **diagrama de caso de uso** (seção 2) e os **diagramas de atividades**, um para
cada tela do sistema (seção 5.1.3).

Todos os arquivos estão em `.drawio` (XML não compactado) e podem ser abertos, editados e
exportados livremente.

## Como abrir e exportar

1. Acesse [app.diagrams.net](https://app.diagrams.net) (ou use o draw.io Desktop / a extensão do VS Code).
2. **File → Open From → Device** e escolha o arquivo.
3. Para ver tudo de uma vez, abra `linkfit-diagramas.drawio`: cada diagrama fica em uma aba na parte inferior.
4. Para colocar no documento: **File → Export as → PNG** (Zoom 200% para melhor qualidade) ou **PDF**.

## 2 Diagrama de caso de uso

| Figura | Arquivo | Conteúdo |
|---|---|---|
| Figura 1 | `01-diagrama-de-caso-de-uso.drawio` | Atores Aluno e Personal Trainer, o ator Usuário (generalização) com os casos de uso comuns, e as relações «include» e «extend» |

## 5.1.3 Diagramas de atividades

| Seção | Arquivo | Tela |
|---|---|---|
| 5.1.3.1 | `02-atividades-tela-de-login.drawio` | Tela de Login / Criar conta (escolha do perfil) |
| 5.1.3.2 | `03-atividades-tela-inicial-aluno.drawio` | Tela Inicial do Aluno |
| 5.1.3.3 | `04-atividades-tela-buscar-personal.drawio` | Tela Buscar Personal (busca, perfil e solicitação de contratação) |
| 5.1.3.4 | `05-atividades-tela-minha-agenda.drawio` | Tela Minha Agenda (aluno) |
| 5.1.3.5 | `06-atividades-tela-minha-evolucao.drawio` | Tela Minha Evolução |
| 5.1.3.6 | `07-atividades-tela-mensagens.drawio` | Tela de Mensagens (chat) |
| 5.1.3.7 | `08-atividades-tela-configuracoes.drawio` | Tela de Configurações (perfil e preferências) |
| 5.1.3.8 | `09-atividades-tela-inicial-personal.drawio` | Tela Inicial do Personal (aceitar/recusar solicitação) |
| 5.1.3.9 | `10-atividades-tela-meus-alunos-cadastro.drawio` | Tela Meus Alunos — cadastro |
| 5.1.3.10 | `11-atividades-tela-meus-alunos-consulta.drawio` | Tela Meus Alunos — consulta de treinos e evolução |
| 5.1.3.11 | `12-atividades-tela-agenda-agendar-treino.drawio` | Tela Agenda — agendar treino |
| 5.1.3.12 | `13-atividades-tela-treinos-cadastro.drawio` | Tela Treinos — cadastro |
| 5.1.3.13 | `14-atividades-tela-treinos-edicao-exclusao.drawio` | Tela Treinos — edição e exclusão |
| — | `linkfit-diagramas.drawio` | Todos os diagramas acima em abas de um único arquivo |

## Legenda dos símbolos

| Símbolo | Significado |
|---|---|
| Círculo preto | Início da atividade |
| Círculo com anel | Fim da atividade |
| Retângulo arredondado laranja | Tela do sistema |
| Retângulo arredondado branco | Ação do usuário ou do sistema |
| Losango amarelo | Decisão, com as saídas **Sim** e **Não** |
| Retângulo vermelho | Aviso de erro, com retorno ao passo anterior |
| Retângulo verde | Resultado final da atividade |

## Telas de referência no código

| Tela | Arquivo do projeto |
|---|---|
| Login / Criar conta | `src/pages/Landing.jsx` |
| Tela Inicial do Aluno | `src/pages/AlunoDashboard.jsx` |
| Buscar Personal | `src/pages/BuscarPersonal.jsx` |
| Minha Agenda / Agenda | `src/pages/AlunoAgenda.jsx` |
| Minha Evolução / Evolução do aluno | `src/pages/AlunoEvolucao.jsx` |
| Mensagens | `src/pages/ChatView.jsx` |
| Configurações | `src/pages/Configuracoes.jsx` |
| Tela Inicial do Personal | `src/pages/PersonalDashboard.jsx` |
| Meus Alunos | `src/pages/MeusAlunos.jsx` |
| Treinos | `src/pages/Treinos.jsx` |
