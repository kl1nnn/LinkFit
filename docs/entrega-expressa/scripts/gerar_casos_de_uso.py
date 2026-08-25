# -*- coding: utf-8 -*-
"""Gera o Diagrama de Casos de Uso (UML) do sistema da distribuidora Entrega Expressa.

Uso: python3 gerar_casos_de_uso.py  ->  ../img/00-casos-de-uso.svg
"""
import math, os

W, H = 1960, 1420
FX0, FY0, FX1, FY1 = 30, 30, W - 30, H - 30       # moldura do diagrama
BX0, BY0, BX1, BY1 = 330, 130, 1630, 1330         # fronteira do sistema
RX, RY = 115, 38
FONT = "Arial, Helvetica, sans-serif"
AMARELO, TRACO, TRACEJADO = "#FFFFCC", "#000000", "#8C8C8C"

COLUNAS = [470, 770, 1070, 1370]          # centro de cada coluna de casos de uso
CORREDOR = [620, 920, 1220]               # faixas livres entre as colunas
CANAL_ESQ, CANAL_DIR = 265, 1700          # canais verticais fora da fronteira

# id: (x, y, [linhas do rótulo])
UC = {
    "UC05": (470, 230, ["UC05 - Receber Pedido", "da Plataforma"]),
    "UC06": (470, 325, ["UC06 - Registrar", "Pedido"]),
    "UC07": (470, 420, ["UC07 - Notificar", "Setor de Estoque"]),
    "UC01": (470, 540, ["UC01 - Efetuar", "Login"]),
    "UC03": (470, 635, ["UC03 - Validar", "Credenciais"]),
    "UC02": (470, 730, ["UC02 - Recuperar", "Senha"]),
    "UC04": (470, 840, ["UC04 - Gerenciar", "Usuários e Perfis"]),
    "UC08": (770, 230, ["UC08 - Verificar Dispo-", "nibilidade de Estoque"]),
    "UC09": (770, 325, ["UC09 - Consultar", "Saldo de Estoque"]),
    "UC10": (770, 420, ["UC10 - Marcar Pedido", "como Pendente"]),
    "UC11": (770, 540, ["UC11 - Separar", "Produtos"]),
    "UC14": (770, 635, ["UC14 - Registrar Diver-", "gência de Separação"]),
    "UC12": (770, 750, ["UC12 - Atualizar", "Estoque"]),
    "UC13": (770, 845, ["UC13 - Registrar Movi-", "mentação no Histórico"]),
    "UC26": (770, 940, ["UC26 - Gerar Alerta", "de Estoque Mínimo"]),
    "UC15": (1070, 230, ["UC15 - Embalar", "Pedido"]),
    "UC16": (1070, 325, ["UC16 - Gerar Etiqueta", "de Transporte"]),
    "UC17": (1070, 420, ["UC17 - Informar", "Transportadora"]),
    "UC18": (1070, 540, ["UC18 - Despachar", "Pedido"]),
    "UC23": (1070, 990, ["UC23 - Registrar Repo-", "sição de Estoque"]),
    "UC24": (1070, 1085, ["UC24 - Liberar", "Pedidos Pendentes"]),
    "UC25": (1070, 1180, ["UC25 - Emitir", "Pedido de Compra"]),
    "UC20": (1370, 635, ["UC20 - Notificar", "Cliente sobre Status"]),
    "UC21": (1370, 745, ["UC21 - Confirmar", "Entrega"]),
    "UC22": (1370, 840, ["UC22 - Registrar Ocor-", "rência de Entrega"]),
    "UC27": (1370, 990, ["UC27 - Gerar Relató-", "rios Gerenciais"]),
    "UC28": (1370, 1085, ["UC28 - Exportar", "Relatório"]),
    "UC29": (1370, 1180, ["UC29 - Consultar Histó-", "rico de Movimentações"]),
    "UC19": (1370, 1290, ["UC19 - Consultar Ras-", "treamento do Pedido"]),
}

# id: (x, y, [linhas], lado)
ATORES = {
    "PLA": (170, 240, ["Plataforma de", "E-commerce"], "L"),
    "USR": (170, 390, ["Usuário do Sistema"], "L"),
    "ADM": (170, 520, ["Administrador", "do Sistema"], "L"),
    "EST": (170, 650, ["Funcionário", "do Estoque"], "L"),
    "SEP": (170, 780, ["Operador de", "Separação"], "L"),
    "EXP": (170, 910, ["Operador de", "Expedição"], "L"),
    "COM": (170, 1040, ["Comprador"], "L"),
    "GER": (170, 1170, ["Gerente de", "Operações"], "L"),
    "CLI": (170, 1300, ["Cliente"], "L"),
    "TRA": (1790, 650, ["Transportadora"], "R"),
    "FOR": (1790, 1040, ["Fornecedor"], "R"),
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
  <marker id="seta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10"
          markerHeight="10" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10" fill="none" stroke="#8C8C8C" stroke-width="1.4"/>
  </marker>
  <marker id="triangulo" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="13"
          markerHeight="13" orient="auto-start-reverse">
    <path d="M 0 0 L 12 6 L 0 12 z" fill="#ffffff" stroke="#000000" stroke-width="1.2"/>
  </marker>
</defs>
""",
    f'<rect width="{W}" height="{H}" fill="#ffffff"/>',
]

# ---- moldura do diagrama, com a aba de identificação (padrão UML)
svg.append(
    f'<rect x="{FX0}" y="{FY0}" width="{FX1-FX0}" height="{FY1-FY0}" fill="none" '
    f'stroke="{TRACO}" stroke-width="1.2"/>'
)
svg.append(
    f'<path d="M {FX0} {FY0} L {FX0+330} {FY0} L {FX0+330} {FY0+26} '
    f'L {FX0+310} {FY0+46} L {FX0} {FY0+46} Z" fill="#ffffff" stroke="{TRACO}" '
    f'stroke-width="1.2"/>'
)
svg.append(
    f'<text x="{FX0+14}" y="{FY0+31}" font-size="17" font-weight="700" fill="{TRACO}">uc'
    f'<tspan font-weight="400" dx="8">Diagrama de Casos de Uso</tspan></text>'
)

# ---- fronteira do sistema
svg.append(
    f'<rect x="{BX0}" y="{BY0}" width="{BX1-BX0}" height="{BY1-BY0}" fill="none" '
    f'stroke="{TRACO}" stroke-width="1.2"/>'
)
svg.append(
    f'<text x="{(BX0+BX1)/2}" y="{BY0+30}" text-anchor="middle" font-size="16" '
    f'font-weight="700" fill="{TRACO}">Sistema de Gestão do Centro de Distribuição</text>'
)

# ---- generalização dos atores
espinha = 78
usr_x, usr_y = ATORES["USR"][0], ATORES["USR"][1]
for aid in GENERAL:
    ax, ay = ATORES[aid][0], ATORES[aid][1]
    svg.append(
        f'<path d="M {ax-40} {ay} L {espinha} {ay} L {espinha} {usr_y+26}" fill="none" '
        f'stroke="{TRACO}" stroke-width="1"/>'
    )
svg.append(
    f'<path d="M {espinha} {usr_y+26} L {usr_x-30} {usr_y+26}" fill="none" '
    f'stroke="{TRACO}" stroke-width="1" marker-end="url(#triangulo)"/>'
)
svg.append(
    f'<text x="{espinha+9}" y="{usr_y+240}" font-size="12" fill="#5A5A5A" '
    f'transform="rotate(-90 {espinha+9} {usr_y+240})">generalização de atores</text>'
)

# ---- associações ator x caso de uso
for aid, ucid in ASSOC:
    pts = rota_associacao(aid, ucid)
    d = " ".join(f"{'M' if i == 0 else 'L'} {x:.0f} {y:.0f}" for i, (x, y) in enumerate(pts))
    svg.append(f'<path d="{d}" fill="none" stroke="{TRACO}" stroke-width="1"/>')

# ---- relacionamentos <<include>> e <<extend>>
for orig, dest, tipo in REL:
    ox, oy, _ = UC[orig]
    dx_, dy_, _ = UC[dest]
    x1, y1 = borda_elipse(ox, oy, dx_, dy_)
    x2, y2 = borda_elipse(dx_, dy_, ox, oy)
    svg.append(
        f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="{TRACEJADO}" '
        f'stroke-width="1.2" stroke-dasharray="6 5" marker-end="url(#seta)"/>'
    )
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    if abs(x2 - x1) < abs(y2 - y1):
        mx += 60
    else:
        my -= 10
    texto = "&lt;&lt;include&gt;&gt;" if tipo == "include" else "&lt;&lt;extend&gt;&gt;"
    larg = 82 if tipo == "include" else 78
    svg.append(
        f'<g transform="translate({mx:.0f},{my:.0f})">'
        f'<rect x="{-larg/2}" y="-11" width="{larg}" height="18" fill="#ffffff"/>'
        f'<text x="0" y="3" text-anchor="middle" font-size="13" fill="{TRACO}">{texto}</text></g>'
    )

# ---- casos de uso
for ucid, (cx, cy, linhas) in UC.items():
    svg.append(
        f'<ellipse cx="{cx}" cy="{cy}" rx="{RX}" ry="{RY}" fill="{AMARELO}" '
        f'stroke="{TRACO}" stroke-width="1.1"/>'
    )
    y0 = cy - (len(linhas) - 1) * 8
    for i, linha in enumerate(linhas):
        svg.append(
            f'<text x="{cx}" y="{y0 + i*16 + 5}" text-anchor="middle" font-size="13" '
            f'fill="{TRACO}">{linha}</text>'
        )

# ---- atores
for aid, (ax, ay, linhas, lado) in ATORES.items():
    svg.append(f'<g stroke="{TRACO}" stroke-width="1.6" fill="none">')
    svg.append(f'<circle cx="{ax}" cy="{ay-42}" r="13" fill="#ffffff"/>')
    svg.append(f'<line x1="{ax}" y1="{ay-29}" x2="{ax}" y2="{ay+6}"/>')
    svg.append(f'<line x1="{ax-24}" y1="{ay-14}" x2="{ax+24}" y2="{ay-14}"/>')
    svg.append(f'<line x1="{ax}" y1="{ay+6}" x2="{ax-20}" y2="{ay+38}"/>')
    svg.append(f'<line x1="{ax}" y1="{ay+6}" x2="{ax+20}" y2="{ay+38}"/>')
    svg.append("</g>")
    for i, linha in enumerate(linhas):
        svg.append(
            f'<text x="{ax}" y="{ay+58 + i*17}" text-anchor="middle" font-size="13.5" '
            f'fill="{TRACO}">{linha}</text>'
        )

# ---- legenda
lx, ly = BX0 + 30, BY1 - 105
svg.append(f'<rect x="{lx}" y="{ly}" width="360" height="76" fill="#ffffff" stroke="{TRACO}" stroke-width="1"/>')
svg.append(f'<line x1="{lx+18}" y1="{ly+26}" x2="{lx+78}" y2="{ly+26}" stroke="{TRACEJADO}" stroke-width="1.2" stroke-dasharray="6 5" marker-end="url(#seta)"/>')
svg.append(f'<text x="{lx+92}" y="{ly+30}" font-size="13" fill="{TRACO}">&lt;&lt;include&gt;&gt; - sempre acontece</text>')
svg.append(f'<line x1="{lx+18}" y1="{ly+56}" x2="{lx+78}" y2="{ly+56}" stroke="{TRACEJADO}" stroke-width="1.2" stroke-dasharray="6 5" marker-end="url(#seta)"/>')
svg.append(f'<text x="{lx+92}" y="{ly+60}" font-size="13" fill="{TRACO}">&lt;&lt;extend&gt;&gt; - acontece sob condição</text>')
svg.append("</svg>")

destino = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "img", "00-casos-de-uso.svg")
)
with open(destino, "w", encoding="utf-8") as fh:
    fh.write("\n".join(svg))
print("gerado:", destino)
