# Diagramas do LinkFit — perfil Personal Trainer

Diagramas do projeto **LinkFit** feitos em **draw.io** (diagrams.net), seguindo o modelo do
trabalho: um **diagrama de caso de uso** (seção 2) e os **diagramas de atividades**, um para
cada tela (seção 5.1.3).

O escopo desta documentação é o **perfil Personal Trainer**. As telas exclusivas do aluno
(Buscar Personal, Minha Agenda, Minha Evolução e o painel do aluno) não fazem parte destes
diagramas.

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
| Figura 1 | `01-diagrama-de-caso-de-uso.drawio` | Ator Personal Trainer e seus casos de uso, com as relações «include» (verificar disponibilidade do horário) e «extend» (consultar treinos e evolução do aluno) |

## 5.1.3 Diagramas de atividades

| Seção | Arquivo | Tela |
|---|---|---|
| 5.1.3.1 | `02-atividades-tela-de-login.drawio` | Tela de Login / Criar conta como personal trainer |
| 5.1.3.2 | `03-atividades-tela-inicial-personal.drawio` | Tela Inicial do Personal (aceitar ou recusar solicitação de contratação) |
| 5.1.3.3 | `04-atividades-tela-meus-alunos-cadastro.drawio` | Tela Meus Alunos — cadastro |
| 5.1.3.4 | `05-atividades-tela-meus-alunos-consulta.drawio` | Tela Meus Alunos — consulta de perfil, treinos e evolução |
| 5.1.3.5 | `06-atividades-tela-agenda-agendar-treino.drawio` | Tela Agenda — agendar treino |
| 5.1.3.6 | `07-atividades-tela-treinos-cadastro.drawio` | Tela Treinos — cadastro |
| 5.1.3.7 | `08-atividades-tela-treinos-edicao-exclusao.drawio` | Tela Treinos — edição e exclusão |
| 5.1.3.8 | `09-atividades-tela-mensagens.drawio` | Tela de Mensagens (chat com o aluno) |
| 5.1.3.9 | `10-atividades-tela-configuracoes.drawio` | Tela de Configurações (perfil e preferências do personal) |
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
| Tela Inicial do Personal | `src/pages/PersonalDashboard.jsx` |
| Meus Alunos | `src/pages/MeusAlunos.jsx` |
| Agenda | `src/pages/AlunoAgenda.jsx` (modo personal) |
| Treinos | `src/pages/Treinos.jsx` |
| Evolução do aluno | `src/pages/AlunoEvolucao.jsx` |
| Mensagens | `src/pages/ChatView.jsx` |
| Configurações | `src/pages/Configuracoes.jsx` |
