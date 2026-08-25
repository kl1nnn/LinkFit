/**
 * Gera o documento acadêmico (.docx) do estudo de caso da distribuidora Entrega Expressa,
 * formatado segundo as normas ABNT (NBR 14724, NBR 6024, NBR 6027, NBR 6023 e NBR 6028).
 *
 * Uso:  npm install docx && node gerar_documento_docx.cjs
 * Saída: ../Entrega-Expressa-Estudo-de-Caso.docx
 */
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak,
  Table, TableRow, TableCell, WidthType, ShadingType, ImageRun, TableOfContents,
  PageOrientation, Header, PageNumber, BorderStyle, VerticalAlign,
} = require("docx");

const BASE = path.join(__dirname, "..");
const IMG = (n) => fs.readFileSync(path.join(BASE, "img", n));
const CM = 566.93;                 // 1 cm em DXA
const PX = 37.795;                 // 1 cm em pixels (96 dpi)
const LARGURA_TEXTO = 16 * CM;     // A4 com margens ABNT (3 cm esq., 2 cm dir.)
const RECUO = 1.25 * CM;           // recuo de primeira linha (ABNT)
const AUTORES = ["GABRIEL VINICIUS", "PEDRO ÁVILA"];
const INSTITUICAO = "UNIVERSIDADE DE MOGI DAS CRUZES";
const CURSO = "SISTEMAS DE INFORMAÇÃO";
const DISCIPLINA = "Engenharia de Software";
const ORIENTACAO = "Prof.ª Vanessa e Prof.ª Elisabete";
const CIDADE = "MOGI DAS CRUZES - SP";
const ANO = "2026";

/* ------------------------------------------------------------------ helpers */
/** Parágrafo de texto corrido: Arial 12, justificado, entrelinhas 1,5, recuo 1,25 cm. */
const p = (texto, o = {}) =>
  new Paragraph({
    alignment: o.align || AlignmentType.JUSTIFIED,
    spacing: { line: o.line === undefined ? 360 : o.line, after: o.after === undefined ? 0 : o.after,
               before: o.before || 0 },
    indent: o.recuo === false ? undefined : { firstLine: RECUO },
    children: [new TextRun({ text: texto, bold: !!o.bold, italics: !!o.italics, size: o.size || 24 })],
  });

/** Seção primária: indicativo numérico + título em CAIXA ALTA e negrito (NBR 6024). */
const secao = (texto) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.LEFT,
    spacing: { before: 0, after: 360, line: 360 },
    children: [new TextRun({ text: texto, bold: true, size: 24, allCaps: true })],
  });

/** Seção secundária: indicativo + título apenas com inicial maiúscula, em negrito. */
const subsecao = (texto) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.LEFT,
    spacing: { before: 360, after: 240, line: 360 },
    children: [new TextRun({ text: texto, bold: true, size: 24 })],
  });

/** Título de elemento pré-textual/pós-textual, centralizado e sem indicativo numérico. */
const tituloSemNumero = (texto) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 360, line: 360 },
    children: [new TextRun({ text: texto, bold: true, size: 24, allCaps: true })],
  });

const centro = (texto, o = {}) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { line: o.line || 360, after: o.after === undefined ? 0 : o.after },
    children: [new TextRun({ text: texto, bold: !!o.bold, size: o.size || 24 })],
  });

const vazio = (n = 1) => Array(n).fill(0).map(() => centro(""));
const quebra = () => new Paragraph({ children: [new PageBreak()] });

const celula = (texto, { bold = false, largura, fundo, align = AlignmentType.LEFT } = {}) =>
  new TableCell({
    width: { size: largura, type: WidthType.DXA },
    shading: fundo ? { type: ShadingType.CLEAR, fill: fundo, color: "auto" } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: [new Paragraph({
      alignment: align,
      spacing: { line: 240, after: 0 },
      children: [new TextRun({ text: texto, bold, size: 20 })],
    })],
  });

function tabela(cabecalhoLinha, linhas, pesos) {
  const total = pesos.reduce((a, b) => a + b, 0);
  const larguras = pesos.map((w) => Math.round((w / total) * LARGURA_TEXTO));
  larguras[larguras.length - 1] = LARGURA_TEXTO - larguras.slice(0, -1).reduce((a, b) => a + b, 0);
  const borda = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
  return new Table({
    columnWidths: larguras,
    width: { size: LARGURA_TEXTO, type: WidthType.DXA },
    borders: { top: borda, bottom: borda, left: borda, right: borda, insideHorizontal: borda, insideVertical: borda },
    rows: [
      new TableRow({
        tableHeader: true,
        children: cabecalhoLinha.map((t, i) => celula(t, { bold: true, largura: larguras[i], fundo: "E6E6E6" })),
      }),
      ...linhas.map((linha) =>
        new TableRow({ children: linha.map((t, i) => celula(String(t), { largura: larguras[i] })) })
      ),
    ],
  });
}

/** Legenda da ilustração (acima) - "Quadro 1 - Título" / "Figura 1 - Título". */
const legendaTopo = (texto) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 60, line: 240 },
    children: [new TextRun({ text: texto, size: 20 })],
  });

/** Indicação da fonte (abaixo da ilustração), fonte 10 e espaçamento simples. */
const fonteIlustracao = (texto = "Fonte: Elaborado pelos autores (2026).") =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 240, line: 240 },
    children: [new TextRun({ text: texto, size: 20 })],
  });

/** Imagem centralizada, ajustada à área útil informada (em cm). */
function figura(arquivo, ratio, maxLargCm, maxAltCm) {
  let larg = maxLargCm;
  let alt = larg / ratio;
  if (alt > maxAltCm) { alt = maxAltCm; larg = alt * ratio; }
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 0 },
    children: [new ImageRun({
      type: "png",
      data: IMG(arquivo),
      transformation: { width: Math.round(larg * PX), height: Math.round(alt * PX) },
    })],
  });
}

/** Referência bibliográfica: espaçamento simples, alinhada à esquerda, separadas por linha em branco. */
const referencia = (partes) =>
  new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 240, line: 240 },
    children: partes.map((t) => new TextRun({ text: t.texto, bold: !!t.bold, italics: !!t.italico, size: 24 })),
  });

/* ------------------------------------------------------------------- dados */
const REGRAS = [
  ["RN01", "Um pedido só entra em separação quando todos os itens tiverem saldo disponível; caso contrário fica com status Pendente."],
  ["RN02", "A verificação de disponibilidade reserva os itens do pedido, tornando-os indisponíveis para outros pedidos."],
  ["RN03", "A baixa definitiva do estoque ocorre na conclusão da separação, e não na reserva."],
  ["RN04", "Pedidos pendentes são liberados automaticamente, por ordem de data de recebimento, assim que houver reposição."],
  ["RN05", "Nenhuma operação pode deixar o saldo de um produto negativo."],
  ["RN06", "Todo pedido segue os status: Recebido, Pendente (opcional), Em separação, Separado, Embalado, Enviado e Entregue."],
  ["RN07", "A etiqueta de transporte só é gerada após o registro dos volumes (peso e dimensões)."],
  ["RN08", "A transportadora é definida por regra de região de entrega, peso/volume e prazo contratado."],
  ["RN09", "Toda alteração de status ou de saldo gera um registro no histórico com usuário, data e hora."],
  ["RN10", "O cliente consulta apenas os pedidos vinculados ao seu CPF/e-mail."],
  ["RN11", "Produtos com saldo igual ou inferior ao estoque mínimo geram alerta automático de reposição."],
  ["RN12", "Divergências de separação ou de recebimento devem ser registradas antes de qualquer ajuste de saldo."],
];

const RF = [
  ["RF01", "Integrar-se às plataformas de venda", "Receber os pedidos de Mercado Livre, Shopee e lojas parceiras por API/webhook, sem digitação manual.", "Plataforma de E-commerce", "Alta"],
  ["RF02", "Registrar pedido", "Gravar número interno, cliente, itens, quantidades, endereço de entrega, prazo e plataforma de origem.", "Sistema", "Alta"],
  ["RF03", "Notificar o setor de estoque", "Avisar automaticamente o estoque a cada novo pedido e exibi-lo na fila de separação.", "Sistema", "Alta"],
  ["RF04", "Verificar disponibilidade de produtos", "Conferir o saldo de cada item do pedido e reservar as quantidades disponíveis.", "Funcionário do Estoque", "Alta"],
  ["RF05", "Tratar pedido sem estoque", "Classificar o pedido como Pendente e gerar alerta de reposição quando faltar saldo.", "Sistema", "Alta"],
  ["RF06", "Liberar pedidos pendentes", "Reprocessar automaticamente os pedidos pendentes após a entrada de mercadoria.", "Sistema", "Alta"],
  ["RF07", "Gerar ordem de separação", "Emitir a lista de picking com produto, quantidade e endereço de armazenagem.", "Funcionário do Estoque", "Alta"],
  ["RF08", "Conferir a separação", "Registrar a leitura dos itens por código de barras e apontar divergências.", "Operador de Separação", "Alta"],
  ["RF09", "Dar baixa no estoque", "Descontar as quantidades separadas do saldo, de forma transacional.", "Sistema", "Alta"],
  ["RF10", "Registrar a embalagem", "Informar quantidade de volumes, peso e dimensões de cada volume do pedido.", "Operador de Expedição", "Alta"],
  ["RF11", "Gerar etiqueta de transporte", "Emitir a etiqueta com código de rastreio, dados do destinatário e da transportadora.", "Operador de Expedição", "Alta"],
  ["RF12", "Definir a transportadora", "Sugerir/selecionar a transportadora conforme região, peso e prazo, permitindo troca manual justificada.", "Operador de Expedição", "Média"],
  ["RF13", "Registrar o despacho", "Confirmar a coleta pela transportadora e gerar o romaneio de carga.", "Operador de Expedição", "Alta"],
  ["RF14", "Consultar rastreamento", "Permitir ao cliente consultar status e eventos de transporte pelo número do pedido.", "Cliente", "Alta"],
  ["RF15", "Notificar o cliente", "Enviar e-mail a cada mudança de status do pedido, incluindo o código de rastreio.", "Sistema", "Média"],
  ["RF16", "Confirmar entrega", "Permitir que a transportadora informe a conclusão da entrega e registre ocorrências.", "Transportadora", "Alta"],
  ["RF17", "Manter histórico de movimentações", "Registrar toda operação (usuário, data, hora, ação, pedido/produto) de forma consultável.", "Sistema", "Alta"],
  ["RF18", "Controlar o estoque", "Manter entradas, saídas, ajustes, saldo atual, saldo reservado e estoque mínimo por produto.", "Funcionário do Estoque", "Alta"],
  ["RF19", "Emitir alerta de estoque mínimo", "Avisar o setor de compras quando o saldo atingir o ponto de reposição.", "Sistema", "Média"],
  ["RF20", "Registrar entrada de mercadoria", "Conferir a nota fiscal do fornecedor, registrar a entrada e endereçar os produtos.", "Funcionário do Estoque", "Alta"],
  ["RF21", "Emitir pedido de compra", "Gerar e enviar o pedido de reposição ao fornecedor a partir do alerta de estoque mínimo.", "Comprador", "Média"],
  ["RF22", "Gerar relatórios gerenciais", "Emitir relatórios de pedidos, produtividade, pendências, giro de estoque e desempenho das transportadoras.", "Gerente de Operações", "Média"],
  ["RF23", "Exportar relatórios", "Exportar os relatórios gerados em PDF e Excel.", "Gerente de Operações", "Baixa"],
  ["RF24", "Autenticar usuários", "Controlar o acesso por login e senha, com recuperação de senha e bloqueio após tentativas inválidas.", "Usuário do Sistema", "Alta"],
  ["RF25", "Gerenciar usuários, perfis e cadastros", "Manter usuários, perfis de acesso, produtos, fornecedores e transportadoras.", "Administrador do Sistema", "Alta"],
];

const RNF = [
  ["RNF01", "Usabilidade", "Interface web responsiva, em português (pt-BR), utilizável em desktop e coletores de dados do armazém."],
  ["RNF02", "Desempenho", "Consultas de pedido e de saldo devem responder em até 3 segundos em condições normais de uso."],
  ["RNF03", "Desempenho", "Pedidos recebidos das plataformas devem ser registrados em até 1 minuto após o envio."],
  ["RNF04", "Disponibilidade", "Disponibilidade mínima de 99,5% ao mês, com manutenções programadas fora do horário de pico."],
  ["RNF05", "Escalabilidade", "Suportar 200 usuários simultâneos e o processamento de até 10.000 pedidos por dia."],
  ["RNF06", "Segurança", "Comunicação obrigatoriamente em HTTPS/TLS e senhas armazenadas com hash e salt."],
  ["RNF07", "Segurança", "Acesso controlado por perfil (estoque, separação, expedição, compras, gerência, administrador e cliente)."],
  ["RNF08", "Auditoria", "O histórico de movimentações não pode ser alterado ou excluído e deve ser retido por, no mínimo, 5 anos."],
  ["RNF09", "Confiabilidade", "As atualizações de saldo devem ser transacionais e à prova de concorrência, impedindo saldo negativo."],
  ["RNF10", "Backup", "Backup automático diário, com RPO de 1 hora e RTO de 4 horas."],
  ["RNF11", "Integração", "Integração via API REST/JSON com plataformas de venda e transportadoras, com reprocessamento em caso de falha."],
  ["RNF12", "Compatibilidade", "Etiquetas no padrão 10x15 cm compatíveis com impressoras térmicas (ZPL) e leitura por código de barras."],
  ["RNF13", "Legal", "Tratamento de dados pessoais dos clientes em conformidade com a LGPD (Lei 13.709/2018)."],
  ["RNF14", "Manutenibilidade", "Arquitetura em camadas, código versionado em Git e documentação técnica atualizada a cada release."],
  ["RNF15", "Portabilidade", "Executar nos navegadores Chrome, Edge e Firefox em suas duas últimas versões, sem instalação local."],
];

const ATORES_UC = [
  ["Usuário do Sistema", "Ator generalizado", "Ator abstrato que representa todo usuário autenticado; concentra o caso de uso de login."],
  ["Plataforma de E-commerce", "Externo (sistema)", "Envia os pedidos de venda (Mercado Livre, Shopee, lojas parceiras)."],
  ["Cliente", "Primário", "Acompanha o status e o rastreamento do seu pedido."],
  ["Funcionário do Estoque", "Primário", "Verifica disponibilidade, controla saldos e registra a entrada de mercadorias."],
  ["Operador de Separação", "Primário", "Executa e confere a separação (picking) dos produtos do pedido."],
  ["Operador de Expedição", "Primário", "Embala, gera etiqueta, define transportadora e despacha os pedidos."],
  ["Comprador", "Primário", "Analisa os alertas de estoque mínimo e emite os pedidos de compra."],
  ["Gerente de Operações", "Primário", "Acompanha indicadores, gera relatórios gerenciais e consulta o histórico."],
  ["Administrador do Sistema", "Primário", "Gerencia usuários, perfis de acesso e cadastros básicos."],
  ["Transportadora", "Externo", "Recebe a carga, informa eventos de transporte e confirma a entrega."],
  ["Fornecedor", "Externo", "Atende aos pedidos de compra e entrega a mercadoria no centro de distribuição."],
];

const CASOS = [
  ["UC01", "Efetuar Login", "Usuário do Sistema", "RF24"],
  ["UC02", "Recuperar Senha", "Usuário do Sistema", "RF24"],
  ["UC03", "Validar Credenciais", "— (interno)", "RF24"],
  ["UC04", "Gerenciar Usuários e Perfis", "Administrador do Sistema", "RF25"],
  ["UC05", "Receber Pedido da Plataforma", "Plataforma de E-commerce", "RF01"],
  ["UC06", "Registrar Pedido", "— (interno)", "RF02"],
  ["UC07", "Notificar Setor de Estoque", "— (interno)", "RF03"],
  ["UC08", "Verificar Disponibilidade de Estoque", "Funcionário do Estoque", "RF04"],
  ["UC09", "Consultar Saldo de Estoque", "— (interno)", "RF18"],
  ["UC10", "Marcar Pedido como Pendente", "— (interno)", "RF05"],
  ["UC11", "Separar Produtos", "Operador de Separação", "RF07, RF08"],
  ["UC12", "Atualizar Estoque", "— (interno)", "RF09, RF18"],
  ["UC13", "Registrar Movimentação no Histórico", "— (interno)", "RF17"],
  ["UC14", "Registrar Divergência de Separação", "Operador de Separação", "RF08"],
  ["UC15", "Embalar Pedido", "Operador de Expedição", "RF10"],
  ["UC16", "Gerar Etiqueta de Transporte", "Operador de Expedição", "RF11"],
  ["UC17", "Informar Transportadora", "— (interno)", "RF12"],
  ["UC18", "Despachar Pedido", "Operador de Expedição / Transportadora", "RF13"],
  ["UC19", "Consultar Rastreamento do Pedido", "Cliente", "RF14"],
  ["UC20", "Notificar Cliente sobre Status", "— (interno)", "RF15"],
  ["UC21", "Confirmar Entrega", "Transportadora", "RF16"],
  ["UC22", "Registrar Ocorrência de Entrega", "Transportadora", "RF16"],
  ["UC23", "Registrar Reposição de Estoque", "Funcionário do Estoque / Fornecedor", "RF20"],
  ["UC24", "Liberar Pedidos Pendentes", "— (interno)", "RF06"],
  ["UC25", "Emitir Pedido de Compra", "Comprador", "RF21"],
  ["UC26", "Gerar Alerta de Estoque Mínimo", "— (interno)", "RF19"],
  ["UC27", "Gerar Relatórios Gerenciais", "Gerente de Operações", "RF22"],
  ["UC28", "Exportar Relatório", "Gerente de Operações", "RF23"],
  ["UC29", "Consultar Histórico de Movimentações", "Gerente de Operações", "RF17"],
];

const INCLUDES = [
  ["UC01 Efetuar Login", "UC03 Validar Credenciais", "Não existe login sem a validação das credenciais."],
  ["UC05 Receber Pedido da Plataforma", "UC06 Registrar Pedido", "Todo pedido recebido é obrigatoriamente gravado."],
  ["UC05 Receber Pedido da Plataforma", "UC07 Notificar Setor de Estoque", "O estoque é sempre avisado do novo pedido."],
  ["UC08 Verificar Disponibilidade", "UC09 Consultar Saldo de Estoque", "A verificação sempre consulta o saldo dos produtos."],
  ["UC11 Separar Produtos", "UC12 Atualizar Estoque", "A separação sempre gera a baixa das quantidades."],
  ["UC11 Separar Produtos", "UC13 Registrar Movimentação", "Toda separação é gravada no histórico."],
  ["UC12 Atualizar Estoque", "UC13 Registrar Movimentação", "Toda alteração de saldo é registrada."],
  ["UC16 Gerar Etiqueta de Transporte", "UC17 Informar Transportadora", "A etiqueta só existe vinculada a uma transportadora."],
  ["UC18 Despachar Pedido", "UC13 Registrar Movimentação", "O despacho sempre alimenta o histórico."],
  ["UC21 Confirmar Entrega", "UC13 Registrar Movimentação", "A conclusão da entrega sempre é registrada."],
  ["UC23 Registrar Reposição de Estoque", "UC12 Atualizar Estoque", "A entrada de mercadoria sempre soma saldo."],
  ["UC23 Registrar Reposição de Estoque", "UC13 Registrar Movimentação", "A entrada sempre é gravada no histórico."],
  ["UC27 Gerar Relatórios Gerenciais", "UC29 Consultar Histórico", "Os relatórios são construídos a partir do histórico."],
];

const EXTENDS = [
  ["UC01 Efetuar Login", "UC02 Recuperar Senha", "Somente quando o usuário esquece a senha ou é bloqueado."],
  ["UC08 Verificar Disponibilidade", "UC10 Marcar Pedido como Pendente", "Somente quando falta saldo para algum item."],
  ["UC11 Separar Produtos", "UC14 Registrar Divergência", "Somente quando a conferência aponta diferença."],
  ["UC12 Atualizar Estoque", "UC26 Gerar Alerta de Estoque Mínimo", "Somente quando o saldo fica igual/abaixo do mínimo."],
  ["UC18 Despachar Pedido", "UC20 Notificar Cliente sobre Status", "Somente quando o cliente possui contato válido cadastrado."],
  ["UC21 Confirmar Entrega", "UC22 Registrar Ocorrência de Entrega", "Somente quando há insucesso, avaria ou recusa."],
  ["UC23 Registrar Reposição", "UC24 Liberar Pedidos Pendentes", "Somente quando existem pedidos pendentes daquele produto."],
  ["UC26 Gerar Alerta de Estoque Mínimo", "UC25 Emitir Pedido de Compra", "Somente quando o comprador aprova a reposição."],
  ["UC27 Gerar Relatórios Gerenciais", "UC28 Exportar Relatório", "Somente quando o gerente opta por exportar o resultado."],
];

const RASTREABILIDADE = [
  ["RF01, RF02, RF03", "UC05, UC06, UC07", "7.2 Recebimento de Pedido"],
  ["RF04, RF05", "UC08, UC09, UC10", "7.3 Separação de Produtos"],
  ["RF06", "UC24", "7.5 Atualização de Estoque / 7.8 Reposição de Estoque"],
  ["RF07, RF08", "UC11, UC14", "7.3 Separação de Produtos"],
  ["RF09, RF18", "UC12", "7.3 Separação de Produtos / 7.5 Atualização de Estoque"],
  ["RF10, RF11, RF12, RF13", "UC15, UC16, UC17, UC18", "7.4 Embalagem e Expedição"],
  ["RF14", "UC19", "7.6 Consulta de Rastreamento"],
  ["RF15", "UC20", "7.4 Embalagem e Expedição / 7.6 Consulta de Rastreamento"],
  ["RF16", "UC21, UC22", "7.4 Embalagem e Expedição"],
  ["RF17", "UC13, UC29", "Todos os diagramas (registro no histórico)"],
  ["RF19", "UC26", "7.5 Atualização de Estoque / 7.8 Reposição de Estoque"],
  ["RF20, RF21", "UC23, UC25", "7.8 Reposição de Estoque"],
  ["RF22, RF23", "UC27, UC28", "7.7 Geração de Relatórios Gerenciais"],
  ["RF24", "UC01, UC02, UC03", "7.1 Processo de Login"],
  ["RF25", "UC04", "— (manutenção de cadastros)"],
];

const ATIVIDADES = [
  ["7.1 Processo de Login",
   "O fluxo inicia quando o usuário acessa a tela de login e informa suas credenciais. O sistema valida os dados; se forem inválidos, exibe a mensagem de erro e permite nova tentativa, bloqueando a conta e enviando o link de recuperação de senha na terceira tentativa consecutiva. Sendo válidas, o sistema verifica se o usuário está ativo, identifica o perfil de acesso, carrega o menu correspondente, registra o acesso no histórico de auditoria e exibe a tela inicial. Implementa UC01, UC02 e UC03 (RF24).",
   "01-login.png", 0.744, "Figura 2 - Diagrama de atividades do processo de login"],
  ["7.2 Recebimento de Pedido",
   "A plataforma de e-commerce envia o pedido por API. O sistema valida os dados recebidos e, em caso de erro, registra a falha de integração e notifica o suporte. Pedidos duplicados são descartados com registro em log. Sendo o pedido válido e inédito, o sistema gera o número interno, grava o pedido com status Recebido, vincula cliente, itens e endereço, notifica automaticamente o setor de estoque, registra a movimentação no histórico e disponibiliza o pedido na fila de separação. Implementa UC05, UC06 e UC07 (RF01, RF02 e RF03).",
   "02-recebimento-pedido.png", 0.517, "Figura 3 - Diagrama de atividades do recebimento de pedido"],
  ["7.3 Separação de Produtos",
   "O funcionário do estoque seleciona o pedido na fila e consulta a disponibilidade dos produtos. Não havendo saldo suficiente, o pedido passa para o status Pendente, é gerado alerta de reposição para o setor de compras e a movimentação é registrada. Havendo saldo, os itens são reservados, a ordem de separação é emitida com os endereços de armazenagem e os produtos são separados e conferidos por leitor de código de barras. Divergências são registradas e, quando não resolvidas, devolvem o pedido à condição de pendente. Concluída a conferência, o sistema dá baixa no estoque, altera o status para Separado, registra o histórico e encaminha o pedido para a embalagem. Implementa UC08, UC10, UC11, UC12 e UC14 (RF04, RF05, RF07, RF08 e RF09).",
   "03-separacao-produtos.png", 0.296, "Figura 4 - Diagrama de atividades da separação de produtos"],
  ["7.4 Embalagem e Expedição",
   "Recebido o pedido separado, o operador confere os itens, seleciona a embalagem adequada, embala os produtos, pesa e mede os volumes e registra essas informações no sistema, que altera o status para Embalado. Em seguida a transportadora é definida conforme região, peso e prazo, a etiqueta de transporte é gerada com o código de rastreio e impressa; falhas de impressão levam à reemissão. Os volumes são agrupados por transportadora em romaneio, a carga é entregue e a coleta confirmada, o status passa a Enviado, o cliente é notificado com o código de rastreio e a movimentação é registrada. Implementa UC15, UC16, UC17, UC18 e UC20 (RF10, RF11, RF12, RF13 e RF15).",
   "04-embalagem-expedicao.png", 0.24, "Figura 5 - Diagrama de atividades da embalagem e expedição"],
  ["7.5 Atualização de Estoque",
   "Este fluxo é comum a todos os tipos de movimentação. Nas entradas, o sistema confere a nota fiscal e soma as quantidades ao saldo; nas saídas, valida o saldo reservado e bloqueia a operação quando não há disponibilidade; nos ajustes de inventário, exige justificativa e recalcula o saldo. Em qualquer caso a movimentação é gravada com usuário, data e hora, o saldo disponível é atualizado e, se o produto ficar abaixo do estoque mínimo, é gerado alerta de reposição. Por fim, os pedidos pendentes daquele produto são verificados e liberados para separação quando passam a ser atendíveis. Implementa UC12, UC13, UC24 e UC26 (RF06, RF09, RF17, RF18 e RF19).",
   "05-atualizacao-estoque.png", 0.489, "Figura 6 - Diagrama de atividades da atualização de estoque"],
  ["7.6 Consulta de Rastreamento pelo Cliente",
   "O cliente acessa a área de acompanhamento e informa o número do pedido junto com o CPF ou e-mail. Não localizado o pedido, o sistema exibe mensagem e permite nova tentativa. Localizado, consulta o status interno: pedidos ainda não despachados exibem a etapa atual do centro de distribuição; pedidos já despachados têm seus eventos consultados na API da transportadora, com exibição do último status conhecido quando a integração está indisponível. O sistema apresenta a linha do tempo com a previsão de entrega, permite cadastrar a preferência de notificação por e-mail e registra a consulta. Implementa UC19 e UC20 (RF14 e RF15).",
   "06-rastreamento-cliente.png", 0.48, "Figura 7 - Diagrama de atividades da consulta de rastreamento pelo cliente"],
  ["7.7 Geração de Relatórios Gerenciais",
   "O gerente acessa o módulo de relatórios, tendo o perfil verificado — acessos não autorizados são recusados e registrados. Autorizado, seleciona o tipo de relatório e define os filtros de período, setor, produto e transportadora. O sistema critica os filtros, consulta a base e o histórico de movimentações e, havendo registros, consolida os indicadores e exibe o relatório em tela com tabelas e gráficos. O gerente pode exportar o resultado em PDF ou Excel, e a geração é registrada no histórico. Implementa UC27, UC28 e UC29 (RF17, RF22 e RF23).",
   "07-relatorios-gerenciais.png", 0.474, "Figura 8 - Diagrama de atividades da geração de relatórios gerenciais"],
  ["7.8 Reposição de Estoque",
   "A partir do alerta de estoque mínimo ou de um pedido pendente, o comprador analisa a necessidade de compra. Aprovada a reposição, o pedido de compra é emitido ao fornecedor, que confirma o prazo e envia a mercadoria. No recebimento, a nota fiscal é conferida com os itens; havendo divergência, a ocorrência é registrada e comunicada ao fornecedor, podendo resultar em recebimento parcial ou devolução. Os produtos aceitos são endereçados no armazém, o saldo é atualizado, a movimentação é registrada e os pedidos pendentes daqueles produtos são verificados e liberados para separação. Implementa UC23, UC24, UC25 e UC26 (RF06, RF19, RF20 e RF21).",
   "08-reposicao-estoque.png", 0.365, "Figura 9 - Diagrama de atividades da reposição de estoque"],
];


/* --------------------------------------------------------------- documento */
const margens = { top: 3 * CM, right: 2 * CM, bottom: 2 * CM, left: 3 * CM };

/** Paginação ABNT: algarismos arábicos no canto superior direito. */
const cabecalhoPagina = new Header({
  children: [new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 0, line: 240 },
    children: [new TextRun({ children: [PageNumber.CURRENT], size: 20 })],
  })],
});

/* --- elementos pré-textuais: capa, folha de rosto, resumo e sumário --- */
const preTextual = [
  centro(INSTITUICAO, { bold: true }),
  centro("CURSO DE " + CURSO),
  ...vazio(5),
  ...AUTORES.map((a) => centro(a)),
  ...vazio(6),
  centro("ENTREGA EXPRESSA", { bold: true, size: 28 }),
  centro("SISTEMA DE GESTÃO DE UMA DISTRIBUIDORA DE E-COMMERCE", { size: 24 }),
  ...vazio(9),
  centro(CIDADE),
  centro(ANO),
  quebra(),

  ...AUTORES.map((a) => centro(a)),
  ...vazio(6),
  centro("ENTREGA EXPRESSA", { bold: true, size: 28 }),
  centro("SISTEMA DE GESTÃO DE UMA DISTRIBUIDORA DE E-COMMERCE", { size: 24 }),
  ...vazio(4),
  new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: 8 * CM },
    spacing: { line: 240, after: 0 },
    children: [new TextRun({
      size: 24,
      text: "Trabalho acadêmico apresentado à " + "Universidade de Mogi das Cruzes como requisito parcial " +
            "para avaliação da disciplina de " + DISCIPLINA + ", do curso de Sistemas de Informação, sob " +
            "orientação de " + ORIENTACAO + ".",
    })],
  }),
  ...vazio(6),
  centro(CIDADE),
  centro(ANO),
  quebra(),

  tituloSemNumero("Resumo"),
  new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 240, after: 240 },
    children: [new TextRun({
      size: 24,
      text: "Este trabalho apresenta a análise e a modelagem de um sistema de informação para a gestão do " +
            "centro de distribuição da empresa Entrega Expressa, distribuidora responsável pelo armazenamento e " +
            "pela distribuição de produtos vendidos em plataformas de comércio eletrônico. O estudo parte da " +
            "descrição do negócio, na qual grande parte dos processos é executada manualmente, situação que " +
            "gera atrasos, erros na separação dos pedidos e dificuldades no controle de estoque. Como método, " +
            "foi realizado o levantamento de requisitos funcionais e não funcionais, seguido da modelagem em " +
            "Linguagem de Modelagem Unificada (UML), com a elaboração do diagrama de casos de uso, empregando " +
            "os relacionamentos de inclusão e extensão, e de oito diagramas de atividades correspondentes aos " +
            "processos essenciais da operação. Como resultado, obteve-se um conjunto de doze regras de negócio, " +
            "vinte e cinco requisitos funcionais, quinze requisitos não funcionais, onze atores e vinte e nove " +
            "casos de uso, articulados por uma matriz de rastreabilidade que relaciona cada requisito aos casos " +
            "de uso e aos diagramas que o detalham. Conclui-se que a modelagem cobre integralmente o ciclo do " +
            "pedido, do recebimento automático à confirmação da entrega, e trata de forma explícita as duas " +
            "situações críticas relatadas pela empresa: a indisponibilidade de estoque e a ausência de " +
            "rastreabilidade das movimentações.",
    })],
  }),
  new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 240, after: 0 },
    children: [
      new TextRun({ text: "Palavras-chave: ", size: 24, bold: true }),
      new TextRun({ text: "engenharia de software; UML; levantamento de requisitos; centro de distribuição; comércio eletrônico.", size: 24 }),
    ],
  }),
  quebra(),

  tituloSemNumero("Sumário"),
  new TableOfContents("Sumário", { hyperlink: true, headingStyleRange: "1-2" }),
];

/* --- seções 1 a 6 (retrato) --- */
const corpoA = [
  secao("1 INTRODUÇÃO"),
  p("A Entrega Expressa é uma distribuidora responsável pelo armazenamento e pela distribuição de produtos vendidos em plataformas de comércio eletrônico, como Mercado Livre, Shopee e lojas virtuais parceiras. Atualmente, grande parte da operação é conduzida manualmente: os pedidos chegam por planilhas e mensagens de correio eletrônico, a conferência do estoque depende da experiência dos funcionários e o acompanhamento do pedido é feito por telefone. Esse cenário produz atrasos nas entregas, erros na separação dos produtos e dificuldades no controle de estoque."),
  p("A engenharia de requisitos é a etapa do processo de desenvolvimento em que se estabelecem os serviços que o cliente requer de um sistema e as restrições sob as quais ele deve operar (SOMMERVILLE, 2019). A partir desse levantamento, a modelagem em Linguagem de Modelagem Unificada (UML) permite representar graficamente o comportamento esperado do software antes de sua construção, reduzindo ambiguidades entre os envolvidos (GUEDES, 2018)."),
  p("O presente trabalho apresenta a análise e a modelagem de um sistema integrado para gerenciar as operações do centro de distribuição, cobrindo o ciclo completo do pedido: recebimento automático a partir das plataformas de venda, verificação e reserva de estoque, separação, embalagem, expedição, transporte e confirmação da entrega, mantendo o histórico de todas as movimentações realizadas."),
  p("O documento está organizado da seguinte forma: a seção 2 apresenta as regras de negócio que orientam a solução; as seções 3 e 4 apresentam, respectivamente, os requisitos funcionais e não funcionais; a seção 5 identifica os atores; a seção 6 apresenta o diagrama de casos de uso, com o emprego dos relacionamentos «include» e «extend»; a seção 7 apresenta os oito diagramas de atividades; e a seção 8 apresenta a matriz de rastreabilidade entre requisitos, casos de uso e diagramas. A seção 9 traz as considerações finais."),
  p("Os objetivos do sistema são eliminar o registro manual de pedidos, garantir controle de saldo confiável com reserva de itens, padronizar a separação e a expedição, dar visibilidade do status do pedido ao cliente e à gerência e manter histórico auditável das movimentações. Permanecem fora do escopo a emissão de nota fiscal, o faturamento e a gestão financeira, que continuam sob responsabilidade do sistema de gestão empresarial já utilizado."),

  quebra(),
  secao("2 REGRAS DE NEGÓCIO"),
  p("As regras de negócio expressam as políticas e as restrições da organização que o sistema deve respeitar. As regras a seguir orientam o comportamento esperado do software e são referenciadas pelos requisitos e pelos diagramas apresentados nas seções seguintes."),
  legendaTopo("Quadro 1 - Regras de negócio da distribuidora Entrega Expressa"),
  tabela(["Código", "Regra de negócio"], REGRAS, [1.3, 8.7]),
  fonteIlustracao(),

  quebra(),
  secao("3 REQUISITOS FUNCIONAIS"),
  p("Os requisitos funcionais descrevem os serviços que o sistema deve oferecer, isto é, como ele deve reagir a entradas específicas e como deve se comportar em determinadas situações (SOMMERVILLE, 2019). O Quadro 2 relaciona os vinte e cinco requisitos funcionais levantados, com o ator principal responsável e a prioridade atribuída."),
  legendaTopo("Quadro 2 - Requisitos funcionais do sistema"),
  tabela(["Código", "Requisito", "Descrição", "Ator principal", "Prioridade"], RF, [0.9, 2.3, 4.6, 2.0, 1.1]),
  fonteIlustracao(),

  quebra(),
  secao("4 REQUISITOS NÃO FUNCIONAIS"),
  p("Os requisitos não funcionais expressam restrições sobre os serviços oferecidos e sobre o processo de desenvolvimento, aplicando-se ao sistema como um todo (SOMMERVILLE, 2019). O Quadro 3 apresenta os requisitos de qualidade, desempenho, segurança e operação estabelecidos para a solução."),
  legendaTopo("Quadro 3 - Requisitos não funcionais do sistema"),
  tabela(["Código", "Categoria", "Requisito"], RNF, [1.0, 1.8, 7.2]),
  fonteIlustracao(),

  quebra(),
  secao("5 ATORES DO SISTEMA"),
  p("Ator é o papel desempenhado por um usuário ou por outro sistema que interage com o software modelado, não correspondendo necessariamente a uma pessoa específica (GUEDES, 2018). Foram identificados onze atores, entre usuários internos do centro de distribuição, o cliente final e os sistemas externos que trocam informações com a solução, conforme o Quadro 4."),
  legendaTopo("Quadro 4 - Atores identificados"),
  tabela(["Ator", "Tipo", "Responsabilidade no sistema"], ATORES_UC, [2.6, 1.8, 5.6]),
  fonteIlustracao(),

  quebra(),
  secao("6 DIAGRAMA DE CASOS DE USO"),
  p("O diagrama de casos de uso apresenta uma visão externa do sistema, descrevendo suas funcionalidades a partir da perspectiva dos usuários, sem detalhar como elas são implementadas (BOOCH; RUMBAUGH; JACOBSON, 2006). A Figura 1 apresenta os onze atores e os vinte e nove casos de uso do sistema, delimitados pela fronteira do centro de distribuição."),
  p("O relacionamento «include» é utilizado quando um caso de uso precisa obrigatoriamente executar outro para concluir sua função, servindo para reaproveitar funcionalidades comuns e evitar repetições no diagrama. Já o relacionamento «extend» é utilizado quando uma funcionalidade complementa outra e ocorre apenas em situações específicas ou opcionais, isto é, quando a condição de extensão é satisfeita (FOWLER, 2005). No diagrama, ambos são representados por setas tracejadas, identificadas pelos respectivos estereótipos."),
];

const paginaCasoDeUso = [
  legendaTopo("Figura 1 - Diagrama de casos de uso do sistema da distribuidora Entrega Expressa"),
  figura("00-casos-de-uso.png", 1.38, 24.0, 14.6),
  fonteIlustracao(),
];

const corpoB = [
  subsecao("6.1 Descrição dos casos de uso"),
  p("O Quadro 5 relaciona cada caso de uso ao ator que o executa e aos requisitos funcionais que ele atende. Os casos de uso identificados como internos são acionados pelo próprio sistema, a partir de outro caso de uso."),
  legendaTopo("Quadro 5 - Casos de uso e requisitos atendidos"),
  tabela(["Código", "Caso de uso", "Ator", "Requisitos"], CASOS, [1.0, 4.0, 3.3, 1.7]),
  fonteIlustracao(),

  quebra(),
  subsecao("6.2 Relacionamentos «include»"),
  p("O relacionamento de inclusão indica execução obrigatória: sempre que o caso de uso base é executado, o caso de uso incluído também é. O Quadro 6 apresenta as treze inclusões do modelo e a justificativa de cada uma."),
  legendaTopo("Quadro 6 - Relacionamentos «include» do modelo"),
  tabela(["Caso de uso base", "Caso de uso incluído", "Por que é obrigatório"], INCLUDES, [3.2, 3.0, 3.8]),
  fonteIlustracao(),

  quebra(),
  subsecao("6.3 Relacionamentos «extend»"),
  p("O relacionamento de extensão indica execução condicional: o caso de uso estendido só é executado quando a condição indicada ocorre. O Quadro 7 apresenta as nove extensões do modelo e as respectivas condições."),
  legendaTopo("Quadro 7 - Relacionamentos «extend» do modelo"),
  tabela(["Caso de uso estendido", "Extensão", "Condição de extensão"], EXTENDS, [3.2, 3.0, 3.8]),
  fonteIlustracao(),

  subsecao("6.4 Generalização de atores"),
  p("Cliente, Funcionário do Estoque, Operador de Separação, Operador de Expedição, Comprador, Gerente de Operações e Administrador do Sistema são especializações do ator Usuário do Sistema. Dessa forma, o caso de uso UC01 - Efetuar Login é associado uma única vez ao ator generalizado, em vez de ser repetido para cada perfil, o que simplifica o diagrama sem perda de informação."),

  quebra(),
  secao("7 DIAGRAMAS DE ATIVIDADES"),
  p("O diagrama de atividades descreve o fluxo de controle de um processo, evidenciando a sequência das ações, as decisões tomadas e os caminhos alternativos (GUEDES, 2018). Os diagramas desta seção utilizam a notação da UML 2.5.1 (OMG, 2017): nó inicial representado por um círculo preenchido, ações representadas por retângulos arredondados, nós de decisão representados por losangos, com as condições de guarda indicadas nos fluxos de saída, e nó final representado por um círculo com anel. São apresentados os oito processos essenciais do sistema."),
];

ATIVIDADES.forEach(([titulo, texto, arquivo, ratio, cap], i) => {
  corpoB.push(quebra(), subsecao(titulo), p(texto), legendaTopo(cap), figura(arquivo, ratio, 15.0, 18.6), fonteIlustracao());
});

corpoB.push(
  quebra(),
  secao("8 MATRIZ DE RASTREABILIDADE"),
  p("A rastreabilidade permite verificar se todo requisito levantado foi contemplado pelo modelo e localizar rapidamente onde cada funcionalidade é detalhada. O Quadro 8 relaciona cada requisito funcional aos casos de uso que o realizam e aos diagramas de atividades que descrevem o seu fluxo."),
  legendaTopo("Quadro 8 - Matriz de rastreabilidade entre requisitos, casos de uso e diagramas"),
  tabela(["Requisitos", "Casos de uso", "Diagrama de atividades"], RASTREABILIDADE, [2.6, 3.2, 4.2]),
  fonteIlustracao(),

  quebra(),
  secao("9 CONSIDERAÇÕES FINAIS"),
  p("A modelagem apresentada cobre todo o ciclo operacional descrito pela Entrega Expressa, do recebimento automático do pedido enviado pelas plataformas de venda até a confirmação da entrega pela transportadora, tratando explicitamente as duas situações críticas relatadas pela empresa: a falta de estoque, que passa a colocar o pedido em condição pendente, com alerta de reposição e liberação automática posterior, e a ausência de rastreabilidade, resolvida pelo registro obrigatório de todas as movimentações."),
  p("Os relacionamentos «include» e «extend» foram empregados conforme sua finalidade: o primeiro para funcionalidades obrigatórias e reaproveitadas, como a validação de credenciais, a atualização de estoque e o registro no histórico; o segundo para comportamentos condicionais, como a marcação de pedido pendente, o registro de divergências e a exportação de relatórios. A matriz de rastreabilidade demonstra que os vinte e cinco requisitos funcionais estão cobertos pelos casos de uso e detalhados pelos diagramas de atividades."),
  p("Como evolução do trabalho, recomenda-se a integração com o sistema de gestão empresarial para emissão de nota fiscal, a adoção de coletores móveis na separação dos produtos e a construção de um painel de indicadores em tempo real para a gerência de operações. Recomenda-se, ainda, a elaboração dos diagramas de classes e de sequência, de modo a avançar da análise para o projeto do sistema."),

  quebra(),
  tituloSemNumero("Referências"),
  referencia([
    { texto: "BOOCH, Grady; RUMBAUGH, James; JACOBSON, Ivar. " },
    { texto: "UML: guia do usuário", italico: true },
    { texto: ". 2. ed. Rio de Janeiro: Elsevier, 2006." },
  ]),
  referencia([
    { texto: "FOWLER, Martin. " },
    { texto: "UML essencial: um breve guia para a linguagem-padrão de modelagem de objetos", italico: true },
    { texto: ". 3. ed. Porto Alegre: Bookman, 2005." },
  ]),
  referencia([
    { texto: "GUEDES, Gilleanes T. A. " },
    { texto: "UML 2: uma abordagem prática", italico: true },
    { texto: ". 3. ed. São Paulo: Novatec, 2018." },
  ]),
  referencia([
    { texto: "OBJECT MANAGEMENT GROUP. " },
    { texto: "OMG Unified Modeling Language (OMG UML): version 2.5.1", italico: true },
    { texto: ". Needham: OMG, 2017. Disponível em: https://www.omg.org/spec/UML/2.5.1. Acesso em: 25 ago. 2026." },
  ]),
  referencia([
    { texto: "PRESSMAN, Roger S.; MAXIM, Bruce R. " },
    { texto: "Engenharia de software: uma abordagem profissional", italico: true },
    { texto: ". 8. ed. Porto Alegre: AMGH, 2016." },
  ]),
  referencia([
    { texto: "SOMMERVILLE, Ian. " },
    { texto: "Engenharia de software", italico: true },
    { texto: ". 10. ed. São Paulo: Pearson, 2019." },
  ]),
);

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 24, color: "000000" }, paragraph: { spacing: { line: 360 } } },
      heading1: { run: { font: "Arial", size: 24, bold: true, color: "000000" } },
      heading2: { run: { font: "Arial", size: 24, bold: true, color: "000000" } },
    },
  },
  features: { updateFields: true },
  sections: [
    // elementos pré-textuais: contados, porém sem numeração impressa (NBR 14724)
    { properties: { page: { margin: margens } }, children: preTextual },
    // elementos textuais: numeração impressa a partir da introdução
    {
      properties: { page: { margin: margens, pageNumbers: { start: 5 } } },
      headers: { default: cabecalhoPagina },
      children: corpoA,
    },
    {
      properties: {
        page: {
          margin: { top: 2 * CM, right: 2 * CM, bottom: 2 * CM, left: 3 * CM },
          size: { orientation: PageOrientation.LANDSCAPE },
        },
      },
      headers: { default: cabecalhoPagina },
      children: paginaCasoDeUso,
    },
    {
      properties: { page: { margin: margens } },
      headers: { default: cabecalhoPagina },
      children: corpoB,
    },
  ],
});

const saida = path.join(BASE, "Entrega-Expressa-Estudo-de-Caso.docx");
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(saida, buf);
  console.log("gerado:", saida);
});
