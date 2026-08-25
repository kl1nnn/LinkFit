# -*- coding: utf-8 -*-
"""Gera o Diagrama de Casos de Uso (UML) do sistema da distribuidora Entrega Expressa.

Uso: python3 gerar_casos_de_uso.py  ->  ../img/00-casos-de-uso.svg
"""
import math, os

W, H = 1900, 1340
BX0, BY0, BX1, BY1 = 300, 60, 1600, 1275
RX, RY = 115, 38
FONT = "Segoe UI, Arial, Helvetica, sans-serif"

COLUNAS = [440, 740, 1040, 1340]          # centro de cada coluna de casos de uso
CORREDOR = [590, 890, 1190]               # faixas livres entre as colunas
CANAL_ESQ, CANAL_DIR = 250, 1660          # canais verticais fora da fronteira

# id: (x, y, [linhas do rótulo])
UC = {
    "UC05": (440, 140, ["UC05 - Receber Pedido", "da Plataforma"]),
    "UC06": (440, 235, ["UC06 - Registrar", "Pedido"]),
    "UC07": (440, 330, ["UC07 - Notificar", "Setor de Estoque"]),
    "UC01": (440, 450, ["UC01 - Efetuar", "Login"]),
    "UC03": (440, 545, ["UC03 - Validar", "Credenciais"]),
    "UC02": (440, 640, ["UC02 - Recuperar", "Senha"]),
    "UC04": (440, 750, ["UC04 - Gerenciar", "Usuários e Perfis"]),
    "UC08": (740, 140, ["UC08 - Verificar Dispo-", "nibilidade de Estoque"]),
    "UC09": (740, 235, ["UC09 - Consultar", "Saldo de Estoque"]),
    "UC10": (740, 330, ["UC10 - Marcar Pedido", "como Pendente"]),
    "UC11": (740, 450, ["UC11 - Separar", "Produtos"]),
    "UC14": (740, 545, ["UC14 - Registrar Diver-", "gência de Separação"]),
    "UC12": (740, 660, ["UC12 - Atualizar", "Estoque"]),
    "UC13": (740, 755, ["UC13 - Registrar Movi-", "mentação no Histórico"]),
    "UC26": (740, 850, ["UC26 - Gerar Alerta", "de Estoque Mínimo"]),
    "UC15": (1040, 140, ["UC15 - Embalar", "Pedido"]),
    "UC16": (1040, 235, ["UC16 - Gerar Etiqueta", "de Transporte"]),
    "UC17": (1040, 330, ["UC17 - Informar", "Transportadora"]),
    "UC18": (1040, 450, ["UC18 - Despachar", "Pedido"]),
    "UC23": (1040, 900, ["UC23 - Registrar Repo-", "sição de Estoque"]),
    "UC24": (1040, 995, ["UC24 - Liberar", "Pedidos Pendentes"]),
    "UC25": (1040, 1090, ["UC25 - Emitir", "Pedido de Compra"]),
    "UC20": (1340, 545, ["UC20 - Notificar", "Cliente sobre Status"]),
    "UC21": (1340, 655, ["UC21 - Confirmar", "Entrega"]),
    "UC22": (1340, 750, ["UC22 - Registrar Ocor-", "rência de Entrega"]),
    "UC27": (1340, 900, ["UC27 - Gerar Relató-", "rios Gerenciais"]),
    "UC28": (1340, 995, ["UC28 - Exportar", "Relatório"]),
    "UC29": (1340, 1090, ["UC29 - Consultar Histó-", "rico de Movimentações"]),
    "UC19": (1340, 1200, ["UC19 - Consultar Ras-", "treamento do Pedido"]),
}

# id: (x, y, [linhas], lado)
ATORES = {
    "PLA": (140, 150, ["Plataforma de", "E-commerce"], "L"),
    "USR": (140, 300, ["Usuário do Sistema"], "L"),
    "ADM": (140, 430, ["Administrador", "do Sistema"], "L"),
    "EST": (140, 560, ["Funcionário", "do Estoque"], "L"),
    "SEP": (140, 690, ["Operador de", "Separação"], "L"),
    "EXP": (140, 820, ["Operador de", "Expedição"], "L"),
    "COM": (140, 950, ["Comprador"], "L"),
    "GER": (140, 1080, ["Gerente de", "Operações"], "L"),
    "CLI": (140, 1210, ["Cliente"], "L"),
    "TRA": (1760, 560, ["Transportadora"], "R"),
    "FOR": (1760, 950, ["Fornecedor"], "R"),
}

ASSOC = [
    ("PLA", "UC05"), ("USR", "UC01"), ("ADM", "UC04"), ("EST", "UC08"),
    ("EST", "UC23"), ("SEP", "UC11"), ("EXP", "UC15"), ("EXP", "UC16"),
    ("EXP", "UC18"), ("COM", "UC25"), ("GER", "UC27"), ("GER", "UC29"),
    ("CLI", "UC19"), ("TRA", "UC18"), ("TRA", "UC21"), ("FOR", "UC23"),
]

GENERAL = ["ADM", "EST", "SEP", "EXP", "COM", "GER", "CLI"]

REL = [
    ("UC01", "UC03", "include"), ("UC02", "UC01", "extend"),
    ("UC05", "UC06", "include"), ("UC05", "UC07", "include"),
    ("UC08", "UC09", "include"), ("UC10", "UC08", "extend"),
    ("UC11", "UC12", "include"), ("UC11", "UC13", "include"),
    ("UC14", "UC11", "extend"), ("UC12", "UC13", "include"),
    ("UC26", "UC12", "extend"), ("UC16", "UC17", "include"),
    ("UC18", "UC13", "include"), ("UC20", "UC18", "extend"),
    ("UC21", "UC13", "include"), ("UC22", "UC21", "extend"),
    ("UC23", "UC12", "include"), ("UC23", "UC13", "include"),
    ("UC24", "UC23", "extend"), ("UC25", "UC26", "extend"),
    ("UC27", "UC29", "include"), ("UC28", "UC27", "extend"),
]


def coluna_do(ucid):
    return COLUNAS.index(UC[ucid][0])


def borda_elipse(cx, cy, tx, ty):
    dx, dy = tx - cx, ty - cy
    if dx == 0 and dy == 0:
        return cx, cy
    t = 1.0 / math.sqrt((dx / RX) ** 2 + (dy / RY) ** 2)
    return cx + dx * t, cy + dy * t


def livre(y, col_ini, col_fim):
    """Verdadeiro se a faixa horizontal y não corta elipses das colunas indicadas."""
    for cx, cy, _ in UC.values():
        j = COLUNAS.index(cx)
        if col_ini <= j <= col_fim and abs(cy - y) < RY + 10:
            return False
    return True


def faixa_livre(y, col_ini, col_fim):
    if livre(y, col_ini, col_fim):
        return y
    for passo in range(6, 260, 6):
        for cand in (y - passo, y + passo):
            if BY0 + 20 < cand < BY1 - 20 and livre(cand, col_ini, col_fim):
                return cand
    return y


def rota_associacao(aid, ucid):
    """Devolve a lista de pontos da associação ator -> caso de uso."""
    ax, ay, _, lado = ATORES[aid]
    cx, cy, _ = UC[ucid]
    j = coluna_do(ucid)
    px = ax + 40 if lado == "L" else ax - 40

    if lado == "L":
        if j == 0:                                   # coluna vizinha: reta direta
            ex, ey = borda_elipse(cx, cy, px, ay)
            return [(px, ay), (ex, ey)]
        y_run = faixa_livre(ay, 0, j - 1)
        corr = CORREDOR[j - 1]
        pts = [(px, ay)]
        if abs(y_run - ay) > 1:
            pts += [(CANAL_ESQ, ay), (CANAL_ESQ, y_run)]
        pts += [(corr, y_run), (corr, cy), (cx - RX, cy)]
        return pts

    if j == len(COLUNAS) - 1:                        # coluna vizinha à direita
        ex, ey = borda_elipse(cx, cy, px, ay)
        return [(px, ay), (ex, ey)]
    y_run = faixa_livre(ay, j + 1, len(COLUNAS) - 1)
    corr = CORREDOR[j]
    pts = [(px, ay)]
    if abs(y_run - ay) > 1:
        pts += [(CANAL_DIR, ay), (CANAL_DIR, y_run)]
    pts += [(corr, y_run), (corr, cy), (cx + RX, cy)]
    return pts


svg = [
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
    f'viewBox="0 0 {W} {H}" font-family="{FONT}">',
    """
<defs>
  <marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9"
          markerHeight="9" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10" fill="none" stroke="#334155" stroke-width="1.6"/>
  </marker>
  <marker id="triangulo" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="13"
          markerHeight="13" orient="auto-start-reverse">
    <path d="M 0 0 L 12 6 L 0 12 z" fill="#ffffff" stroke="#334155" stroke-width="1.4"/>
  </marker>
</defs>
""",
    f'<rect width="{W}" height="{H}" fill="#ffffff"/>',
    f'<text x="{W/2}" y="36" text-anchor="middle" font-size="25" font-weight="700" '
    f'fill="#0f172a">Diagrama de Casos de Uso - Sistema de Gestão da Distribuidora '
    f'Entrega Expressa</text>',
    f'<rect x="{BX0}" y="{BY0}" width="{BX1-BX0}" height="{BY1-BY0}" rx="10" '
    f'fill="#f8fafc" stroke="#334155" stroke-width="2"/>',
    f'<text x="{(BX0+BX1)/2}" y="{BY0+26}" text-anchor="middle" font-size="17" '
    f'font-weight="600" fill="#334155">Sistema de Gestão do Centro de Distribuição</text>',
]

# generalização dos atores
espinha = 48
usr_x, usr_y = ATORES["USR"][0], ATORES["USR"][1]
for aid in GENERAL:
    ax, ay = ATORES[aid][0], ATORES[aid][1]
    svg.append(
        f'<path d="M {ax-40} {ay} L {espinha} {ay} L {espinha} {usr_y+26}" fill="none" '
        f'stroke="#334155" stroke-width="1.3"/>'
    )
svg.append(
    f'<path d="M {espinha} {usr_y+26} L {usr_x-30} {usr_y+26}" fill="none" '
    f'stroke="#334155" stroke-width="1.3" marker-end="url(#triangulo)"/>'
)
svg.append(
    f'<text x="{espinha+9}" y="{usr_y+230}" font-size="13" fill="#64748b" '
    f'transform="rotate(-90 {espinha+9} {usr_y+230})">generalização de atores</text>'
)

# associações
for aid, ucid in ASSOC:
    pts = rota_associacao(aid, ucid)
    d = " ".join(f"{'M' if i == 0 else 'L'} {x:.0f} {y:.0f}" for i, (x, y) in enumerate(pts))
    svg.append(f'<path d="{d}" fill="none" stroke="#334155" stroke-width="1.3"/>')

# «include» / «extend»
for orig, dest, tipo in REL:
    ox, oy, _ = UC[orig]
    dx_, dy_, _ = UC[dest]
    x1, y1 = borda_elipse(ox, oy, dx_, dy_)
    x2, y2 = borda_elipse(dx_, dy_, ox, oy)
    cor = "#1d4ed8" if tipo == "include" else "#b45309"
    svg.append(
        f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="{cor}" '
        f'stroke-width="1.5" stroke-dasharray="7 5" marker-end="url(#seta)"/>'
    )
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    if abs(x2 - x1) < abs(y2 - y1):          # linha vertical: rótulo ao lado
        mx += 58
    else:                                     # linha horizontal: rótulo acima
        my -= 11
    texto = "«include»" if tipo == "include" else "«extend»"
    larg = 76 if tipo == "include" else 72
    svg.append(
        f'<g transform="translate({mx:.0f},{my:.0f})">'
        f'<rect x="{-larg/2}" y="-11" width="{larg}" height="19" rx="4" fill="#ffffff"/>'
        f'<text x="0" y="4" text-anchor="middle" font-size="13" font-weight="600" '
        f'fill="{cor}">{texto}</text></g>'
    )

# casos de uso
for ucid, (cx, cy, linhas) in UC.items():
    svg.append(
        f'<ellipse cx="{cx}" cy="{cy}" rx="{RX}" ry="{RY}" fill="#ffffff" '
        f'stroke="#1e293b" stroke-width="1.6"/>'
    )
    y0 = cy - (len(linhas) - 1) * 8
    for i, linha in enumerate(linhas):
        svg.append(
            f'<text x="{cx}" y="{y0 + i*16 + 5}" text-anchor="middle" font-size="13.5" '
            f'fill="#0f172a">{linha}</text>'
        )

# atores
for aid, (ax, ay, linhas, lado) in ATORES.items():
    svg.append('<g stroke="#1e293b" stroke-width="2" fill="none">')
    svg.append(f'<circle cx="{ax}" cy="{ay-42}" r="13" fill="#e0e7ff"/>')
    svg.append(f'<line x1="{ax}" y1="{ay-29}" x2="{ax}" y2="{ay+6}"/>')
    svg.append(f'<line x1="{ax-24}" y1="{ay-14}" x2="{ax+24}" y2="{ay-14}"/>')
    svg.append(f'<line x1="{ax}" y1="{ay+6}" x2="{ax-20}" y2="{ay+38}"/>')
    svg.append(f'<line x1="{ax}" y1="{ay+6}" x2="{ax+20}" y2="{ay+38}"/>')
    svg.append("</g>")
    for i, linha in enumerate(linhas):
        svg.append(
            f'<text x="{ax}" y="{ay+58 + i*17}" text-anchor="middle" font-size="14.5" '
            f'font-weight="600" fill="#0f172a">{linha}</text>'
        )

# legenda
lx, ly = 330, 1130
svg.append(f'<rect x="{lx}" y="{ly}" width="345" height="72" rx="8" fill="#ffffff" stroke="#cbd5e1"/>')
svg.append(f'<line x1="{lx+18}" y1="{ly+24}" x2="{lx+70}" y2="{ly+24}" stroke="#1d4ed8" stroke-width="1.5" stroke-dasharray="7 5" marker-end="url(#seta)"/>')
svg.append(f'<text x="{lx+82}" y="{ly+28}" font-size="13.5" fill="#0f172a">«include» - execução obrigatória</text>')
svg.append(f'<line x1="{lx+18}" y1="{ly+52}" x2="{lx+70}" y2="{ly+52}" stroke="#b45309" stroke-width="1.5" stroke-dasharray="7 5" marker-end="url(#seta)"/>')
svg.append(f'<text x="{lx+82}" y="{ly+56}" font-size="13.5" fill="#0f172a">«extend» - execução condicional</text>')
svg.append("</svg>")

destino = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "img", "00-casos-de-uso.svg")
)
with open(destino, "w", encoding="utf-8") as fh:
    fh.write("\n".join(svg))
print("gerado:", destino)
