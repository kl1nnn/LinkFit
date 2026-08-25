/**
 * Gera o documento acadêmico (.docx) do estudo de caso da distribuidora Entrega Expressa.
 *
 * Uso:  npm install docx && node gerar_documento_docx.cjs
 * Saída: ../Entrega-Expressa-Estudo-de-Caso.docx
 */
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak,
  Table, TableRow, TableCell, WidthType, ShadingType, ImageRun, TableOfContents,
  PageOrientation, Footer, PageNumber, BorderStyle, VerticalAlign,
} = require("docx");

const BASE = path.join(__dirname, "..");
const IMG = (n) => fs.readFileSync(path.join(BASE, "img", n));
const CM = 566.93;                 // 1 cm em DXA
const PX = 37.795;                 // 1 cm em pixels (96 dpi)
const LARGURA_TEXTO = 16 * CM;     // A4 retrato com margens ABNT (3/2/3/2 cm)

/* ------------------------------------------------------------------ helpers */
const p = (texto, o = {}) =>
  new Paragraph({
    alignment: o.align || AlignmentType.JUSTIFIED,
    spacing: { line: o.line || 360, after: o.after === undefined ? 120 : o.after },
    indent: o.indent === false ? undefined : { firstLine: o.firstLine || 0 },
    children: [new TextRun({ text: texto, bold: !!o.bold, italics: !!o.italics, size: o.size || 24 })],
  });

const h1 = (texto) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 240, line: 360 },
    children: [new TextRun({ text: texto, bold: true, size: 26 })],
  });

const h2 = (texto) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 160, line: 360 },
    children: [new TextRun({ text: texto, bold: true, size: 24 })],
  });

const celula = (texto, { bold = false, largura, fundo, align = AlignmentType.LEFT } = {}) =>
  new TableCell({
    width: { size: largura, type: WidthType.DXA },
    shading: fundo ? { type: ShadingType.CLEAR, fill: fundo, color: "auto" } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 90, right: 90 },
    children: [
      new Paragraph({
        alignment: align,
        spacing: { line: 240, after: 0 },
        children: [new TextRun({ text: texto, bold, size: 20 })],
      }),
    ],
  });

function tabela(cabecalho, linhas, pesos) {
  const total = pesos.reduce((a, b) => a + b, 0);
  const larguras = pesos.map((w) => Math.round((w / total) * LARGURA_TEXTO));
  larguras[larguras.length - 1] = LARGURA_TEXTO - larguras.slice(0, -1).reduce((a, b) => a + b, 0);
  const borda = { style: BorderStyle.SINGLE, size: 4, color: "8896A6" };
  return new Table({
    columnWidths: larguras,
    width: { size: LARGURA_TEXTO, type: WidthType.DXA },
    borders: { top: borda, bottom: borda, left: borda, right: borda, insideHorizontal: borda, insideVertical: borda },
    rows: [
      new TableRow({
        tableHeader: true,
        children: cabecalho.map((t, i) => celula(t, { bold: true, largura: larguras[i], fundo: "DDE5F0" })),
      }),
      ...linhas.map((linha) =>
        new TableRow({ children: linha.map((t, i) => celula(String(t), { largura: larguras[i] })) })
      ),
    ],
  });
}

/** Imagem centralizada, ajustada à área útil informada (em cm). */
function figura(arquivo, ratio, maxLargCm, maxAltCm) {
  let larg = maxLargCm;
  let alt = larg / ratio;
  if (alt > maxAltCm) { alt = maxAltCm; larg = alt * ratio; }
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 120 },
    children: [new ImageRun({
      type: "png",
      data: IMG(arquivo),
      transformation: { width: Math.round(larg * PX), height: Math.round(alt * PX) },
    })],
  });
}

const legenda = (texto) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({ text: texto, size: 20, italics: true })],
  });

const quebra = () => new Paragraph({ children: [new PageBreak()] });

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

const ATORES = [
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
   "01-login.png", 0.744, "Figura 2 - Diagrama de Atividades: Processo de Login"],
  ["7.2 Recebimento de Pedido",
   "A plataforma de e-commerce envia o pedido por API. O sistema valida os dados recebidos e, em caso de erro, registra a falha de integração e notifica o suporte. Pedidos duplicados são descartados com registro em log. Sendo o pedido válido e inédito, o sistema gera o número interno, grava o pedido com status Recebido, vincula cliente, itens e endereço, notifica automaticamente o setor de estoque, registra a movimentação no histórico e disponibiliza o pedido na fila de separação. Implementa UC05, UC06 e UC07 (RF01, RF02 e RF03).",
   "02-recebimento-pedido.png", 0.517, "Figura 3 - Diagrama de Atividades: Recebimento de Pedido"],
  ["7.3 Separação de Produtos",
   "O funcionário do estoque seleciona o pedido na fila e consulta a disponibilidade dos produtos. Não havendo saldo suficiente, o pedido passa para o status Pendente, é gerado alerta de reposição para o setor de compras e a movimentação é registrada. Havendo saldo, os itens são reservados, a ordem de separação é emitida com os endereços de armazenagem e os produtos são separados e conferidos por leitor de código de barras. Divergências são registradas e, quando não resolvidas, devolvem o pedido à condição de pendente. Concluída a conferência, o sistema dá baixa no estoque, altera o status para Separado, registra o histórico e encaminha o pedido para a embalagem. Implementa UC08, UC10, UC11, UC12 e UC14 (RF04, RF05, RF07, RF08 e RF09).",
   "03-separacao-produtos.png", 0.296, "Figura 4 - Diagrama de Atividades: Separação de Produtos"],
  ["7.4 Embalagem e Expedição",
   "Recebido o pedido separado, o operador confere os itens, seleciona a embalagem adequada, embala os produtos, pesa e mede os volumes e registra essas informações no sistema, que altera o status para Embalado. Em seguida a transportadora é definida conforme região, peso e prazo, a etiqueta de transporte é gerada com o código de rastreio e impressa; falhas de impressão levam à reemissão. Os volumes são agrupados por transportadora em romaneio, a carga é entregue e a coleta confirmada, o status passa a Enviado, o cliente é notificado com o código de rastreio e a movimentação é registrada. Implementa UC15, UC16, UC17, UC18 e UC20 (RF10, RF11, RF12, RF13 e RF15).",
   "04-embalagem-expedicao.png", 0.24, "Figura 5 - Diagrama de Atividades: Embalagem e Expedição"],
  ["7.5 Atualização de Estoque",
   "Este fluxo é comum a todos os tipos de movimentação. Nas entradas, o sistema confere a nota fiscal e soma as quantidades ao saldo; nas saídas, valida o saldo reservado e bloqueia a operação quando não há disponibilidade; nos ajustes de inventário, exige justificativa e recalcula o saldo. Em qualquer caso a movimentação é gravada com usuário, data e hora, o saldo disponível é atualizado e, se o produto ficar abaixo do estoque mínimo, é gerado alerta de reposição. Por fim, os pedidos pendentes daquele produto são verificados e liberados para separação quando passam a ser atendíveis. Implementa UC12, UC13, UC24 e UC26 (RF06, RF09, RF17, RF18 e RF19).",
   "05-atualizacao-estoque.png", 0.489, "Figura 6 - Diagrama de Atividades: Atualização de Estoque"],
  ["7.6 Consulta de Rastreamento pelo Cliente",
   "O cliente acessa a área de acompanhamento e informa o número do pedido junto com o CPF ou e-mail. Não localizado o pedido, o sistema exibe mensagem e permite nova tentativa. Localizado, consulta o status interno: pedidos ainda não despachados exibem a etapa atual do centro de distribuição; pedidos já despachados têm seus eventos consultados na API da transportadora, com exibição do último status conhecido quando a integração está indisponível. O sistema apresenta a linha do tempo com a previsão de entrega, permite cadastrar a preferência de notificação por e-mail e registra a consulta. Implementa UC19 e UC20 (RF14 e RF15).",
   "06-rastreamento-cliente.png", 0.48, "Figura 7 - Diagrama de Atividades: Consulta de Rastreamento pelo Cliente"],
  ["7.7 Geração de Relatórios Gerenciais",
   "O gerente acessa o módulo de relatórios, tendo o perfil verificado — acessos não autorizados são recusados e registrados. Autorizado, seleciona o tipo de relatório e define os filtros de período, setor, produto e transportadora. O sistema critica os filtros, consulta a base e o histórico de movimentações e, havendo registros, consolida os indicadores e exibe o relatório em tela com tabelas e gráficos. O gerente pode exportar o resultado em PDF ou Excel, e a geração é registrada no histórico. Implementa UC27, UC28 e UC29 (RF17, RF22 e RF23).",
   "07-relatorios-gerenciais.png", 0.474, "Figura 8 - Diagrama de Atividades: Geração de Relatórios Gerenciais"],
  ["7.8 Reposição de Estoque",
   "A partir do alerta de estoque mínimo ou de um pedido pendente, o comprador analisa a necessidade de compra. Aprovada a reposição, o pedido de compra é emitido ao fornecedor, que confirma o prazo e envia a mercadoria. No recebimento, a nota fiscal é conferida com os itens; havendo divergência, a ocorrência é registrada e comunicada ao fornecedor, podendo resultar em recebimento parcial ou devolução. Os produtos aceitos são endereçados no armazém, o saldo é atualizado, a movimentação é registrada e os pedidos pendentes daqueles produtos são verificados e liberados para separação. Implementa UC23, UC24, UC25 e UC26 (RF06, RF19, RF20 e RF21).",
   "08-reposicao-estoque.png", 0.365, "Figura 9 - Diagrama de Atividades: Reposição de Estoque"],
];

/* --------------------------------------------------------------- documento */
const margensRetrato = { top: 3 * CM, right: 2 * CM, bottom: 2 * CM, left: 3 * CM };
const rodape = new Footer({
  children: [new Paragraph({
    alignment: AlignmentType.RIGHT,
    children: [new TextRun({ children: [PageNumber.CURRENT], size: 20 })],
  })],
});

/* --- capa e folha de rosto --- */
const preTextual = [
  p("UMC - UNIVERSIDADE DE MOGI DAS CRUZES", { align: AlignmentType.CENTER, bold: true, after: 0 }),
  ...Array(6).fill(0).map(() => p("", { after: 0 })),
  p("[Nome do aluno]", { align: AlignmentType.CENTER, after: 0 }),
  p("[Nome do aluno]", { align: AlignmentType.CENTER, after: 0 }),
  ...Array(6).fill(0).map(() => p("", { after: 0 })),
  p("ENTREGA EXPRESSA", { align: AlignmentType.CENTER, bold: true, size: 32, after: 0 }),
  p("Sistema de Gestão de uma Distribuidora de E-commerce", { align: AlignmentType.CENTER, size: 26 }),
  ...Array(9).fill(0).map(() => p("", { after: 0 })),
  p("MOGI DAS CRUZES - SP", { align: AlignmentType.CENTER, after: 0 }),
  p("2026", { align: AlignmentType.CENTER }),
  quebra(),

  p("UMC - UNIVERSIDADE DE MOGI DAS CRUZES", { align: AlignmentType.CENTER, bold: true, after: 0 }),
  ...Array(5).fill(0).map(() => p("", { after: 0 })),
  p("[Nome do aluno]", { align: AlignmentType.CENTER, after: 0 }),
  p("[Nome do aluno]", { align: AlignmentType.CENTER, after: 0 }),
  ...Array(4).fill(0).map(() => p("", { after: 0 })),
  p("ENTREGA EXPRESSA", { align: AlignmentType.CENTER, bold: true, size: 32, after: 0 }),
  p("Sistema de Gestão de uma Distribuidora de E-commerce", { align: AlignmentType.CENTER, size: 26 }),
  ...Array(3).fill(0).map(() => p("", { after: 0 })),
  new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: 8 * CM },
    spacing: { line: 240, after: 120 },
    children: [new TextRun({
      size: 22,
      text: "Trabalho apresentado à Universidade de Mogi das Cruzes como requisito para avaliação da disciplina de [Disciplina], do curso de Sistemas de Informação, sob orientação do(a) Prof.(a) [Nome do(a) professor(a)].",
    })],
  }),
  ...Array(6).fill(0).map(() => p("", { after: 0 })),
  p("MOGI DAS CRUZES - SP", { align: AlignmentType.CENTER, after: 0 }),
  p("2026", { align: AlignmentType.CENTER }),
  quebra(),

  p("SUMÁRIO", { align: AlignmentType.CENTER, bold: true, size: 26 }),
  new TableOfContents("Sumário", { hyperlink: true, headingStyleRange: "1-2" }),
];

/* --- seções 1 a 6 (retrato) --- */
const corpoA = [
  h1("1. INTRODUÇÃO"),
  p("A Entrega Expressa é uma distribuidora responsável pelo armazenamento e pela distribuição de produtos vendidos em plataformas de comércio eletrônico como Mercado Livre, Shopee e lojas virtuais parceiras. Atualmente boa parte da operação é conduzida manualmente: os pedidos chegam por planilhas e e-mails, a conferência de estoque depende da experiência dos funcionários e o acompanhamento do pedido é feito por telefone. O resultado são atrasos, erros na separação, rupturas de estoque percebidas tarde demais e retrabalho na expedição.", { firstLine: 708 }),
  p("O presente trabalho apresenta a análise e a modelagem de um sistema integrado para gerenciar todas as operações do centro de distribuição, cobrindo o ciclo completo do pedido: recebimento automático a partir das plataformas de venda, verificação e reserva de estoque, separação, embalagem, expedição, transporte e confirmação da entrega, mantendo o histórico de todas as movimentações realizadas.", { firstLine: 708 }),
  p("O documento está organizado da seguinte forma: as regras de negócio que orientam a solução; o levantamento dos requisitos funcionais e não funcionais; o diagrama de casos de uso em UML, com a identificação dos atores e o uso dos relacionamentos «include» e «extend»; e os diagramas de atividades dos oito processos essenciais do sistema. Encerra-se com a matriz de rastreabilidade entre requisitos, casos de uso e diagramas.", { firstLine: 708 }),
  p("Os objetivos do sistema são eliminar o registro manual de pedidos, garantir um controle de saldo confiável com reserva de itens, padronizar a separação e a expedição, dar visibilidade do status do pedido ao cliente e à gerência e manter um histórico auditável das movimentações. Permanecem fora do escopo a emissão de nota fiscal, o faturamento e a gestão financeira, que continuam no ERP atual.", { firstLine: 708 }),

  h1("2. REGRAS DE NEGÓCIO"),
  p("As regras a seguir orientam o comportamento esperado do sistema e são referenciadas pelos requisitos e pelos diagramas apresentados nas seções seguintes."),
  tabela(["Código", "Regra de negócio"], REGRAS, [1.3, 8.7]),

  quebra(),
  h1("3. REQUISITOS FUNCIONAIS"),
  p("Os requisitos funcionais descrevem o que o sistema deve fazer para atender à operação do centro de distribuição."),
  tabela(["Código", "Requisito", "Descrição", "Ator principal", "Prioridade"], RF, [0.9, 2.3, 4.6, 2.0, 1.1]),

  quebra(),
  h1("4. REQUISITOS NÃO FUNCIONAIS"),
  p("Os requisitos não funcionais estabelecem as restrições de qualidade, desempenho, segurança e operação do sistema."),
  tabela(["Código", "Categoria", "Requisito"], RNF, [1.0, 1.8, 7.2]),

  quebra(),
  h1("5. ATORES DO SISTEMA"),
  p("Foram identificados onze atores, entre usuários internos do centro de distribuição, o cliente final e os sistemas externos que trocam informações com a solução."),
  tabela(["Ator", "Tipo", "Responsabilidade no sistema"], ATORES, [2.6, 1.8, 5.6]),

  quebra(),
  h1("6. DIAGRAMA DE CASOS DE USO"),
  p("O diagrama a seguir apresenta os onze atores e os vinte e nove casos de uso do sistema, delimitados pela fronteira do centro de distribuição. Os relacionamentos «include» (linhas azuis) indicam funcionalidades de execução obrigatória, reaproveitadas por vários casos de uso; os relacionamentos «extend» (linhas laranja) indicam comportamentos que só ocorrem sob determinada condição. Os perfis de usuário são especializações do ator Usuário do Sistema, o que permite associar o caso de uso de login uma única vez."),
];

const paginaCasoDeUso = [
  figura("00-casos-de-uso.png", 1.418, 24.0, 15.2),
  legenda("Figura 1 - Diagrama de Casos de Uso do sistema da distribuidora Entrega Expressa"),
];

const corpoB = [
  h2("6.1 Descrição dos casos de uso"),
  tabela(["Código", "Caso de uso", "Ator", "Requisitos"], CASOS, [1.0, 4.0, 3.3, 1.7]),

  quebra(),
  h2("6.2 Relacionamentos «include» - execução obrigatória"),
  p("O relacionamento «include» é utilizado quando um caso de uso precisa obrigatoriamente executar outro para concluir sua função, evitando a repetição de funcionalidades comuns no diagrama."),
  tabela(["Caso de uso base", "«include»", "Por que é obrigatório"], INCLUDES, [3.2, 3.0, 3.8]),

  h2("6.3 Relacionamentos «extend» - execução condicional"),
  p("O relacionamento «extend» é utilizado quando uma funcionalidade complementa outra e ocorre apenas em situações específicas, isto é, quando a condição de extensão é satisfeita."),
  tabela(["Caso de uso estendido", "«extend»", "Condição"], EXTENDS, [3.2, 3.0, 3.8]),

  h2("6.4 Generalização de atores"),
  p("Cliente, Funcionário do Estoque, Operador de Separação, Operador de Expedição, Comprador, Gerente de Operações e Administrador do Sistema são especializações do ator Usuário do Sistema. Dessa forma, o caso de uso UC01 - Efetuar Login é associado uma única vez ao ator generalizado, em vez de ser repetido para cada perfil."),

  quebra(),
  h1("7. DIAGRAMAS DE ATIVIDADES"),
  p("Os diagramas desta seção utilizam a notação UML de atividades: nó inicial (círculo preenchido), ações (retângulos arredondados), nós de decisão (losangos) com as condições de guarda indicadas nos fluxos de saída e nó final (círculo com anel). São apresentados os oito processos essenciais do sistema."),
];

ATIVIDADES.forEach(([titulo, texto, arquivo, ratio, cap]) => {
  corpoB.push(quebra(), h2(titulo), p(texto), figura(arquivo, ratio, 15.0, 19.5), legenda(cap));
});

corpoB.push(
  quebra(),
  h1("8. MATRIZ DE RASTREABILIDADE"),
  p("A matriz relaciona cada requisito funcional aos casos de uso que o realizam e aos diagramas de atividades que detalham o seu fluxo, permitindo verificar a cobertura do levantamento."),
  tabela(["Requisitos", "Casos de uso", "Diagrama de atividades"], RASTREABILIDADE, [2.6, 3.2, 4.2]),

  h1("9. CONSIDERAÇÕES FINAIS"),
  p("A modelagem apresentada cobre todo o ciclo operacional descrito pela Entrega Expressa, do recebimento automático do pedido até a confirmação da entrega pela transportadora, tratando explicitamente as duas situações críticas relatadas pela empresa: a falta de estoque, que passa a colocar o pedido em condição pendente com alerta de reposição e liberação automática posterior, e a ausência de rastreabilidade, resolvida pelo registro obrigatório de todas as movimentações.", { firstLine: 708 }),
  p("Os relacionamentos «include» e «extend» foram empregados conforme sua finalidade: o primeiro para funcionalidades obrigatórias e reaproveitadas, como a validação de credenciais, a atualização de estoque e o registro no histórico; o segundo para comportamentos condicionais, como a marcação de pedido pendente, o registro de divergências e a exportação de relatórios.", { firstLine: 708 }),
  p("Como evolução, recomenda-se a integração com o ERP para emissão de nota fiscal, a adoção de coletores móveis na separação e a construção de um painel de indicadores em tempo real para a gerência de operações.", { firstLine: 708 }),
);

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 24, color: "000000" }, paragraph: { spacing: { line: 360 } } },
      heading1: { run: { font: "Arial", size: 26, bold: true, color: "000000" } },
      heading2: { run: { font: "Arial", size: 24, bold: true, color: "000000" } },
    },
  },
  features: { updateFields: true },
  sections: [
    { properties: { page: { margin: margensRetrato } }, children: preTextual },
    { properties: { page: { margin: margensRetrato } }, footers: { default: rodape }, children: corpoA },
    {
      properties: {
        page: {
          margin: { top: 2 * CM, right: 2 * CM, bottom: 2 * CM, left: 2 * CM },
          size: { orientation: PageOrientation.LANDSCAPE },
        },
      },
      footers: { default: rodape },
      children: paginaCasoDeUso,
    },
    { properties: { page: { margin: margensRetrato } }, footers: { default: rodape }, children: corpoB },
  ],
});

const saida = path.join(BASE, "Entrega-Expressa-Estudo-de-Caso.docx");
Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(saida, buf);
  console.log("gerado:", saida);
});
