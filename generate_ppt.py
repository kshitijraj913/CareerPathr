#!/usr/bin/env python3
"""
Generate CareerPathr PBL Presentation (8 Slides)
Clean WHITE THEME with BLACK TEXT — Professional College PBL Style
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# ── Color Palette (White Theme) ─────────────────────────────
WHITE       = RGBColor(0xFF, 0xFF, 0xFF)
BLACK       = RGBColor(0x1A, 0x1A, 0x1A)
DARK_GRAY   = RGBColor(0x33, 0x33, 0x33)
MID_GRAY    = RGBColor(0x66, 0x66, 0x66)
LIGHT_GRAY  = RGBColor(0x99, 0x99, 0x99)
BORDER_GRAY = RGBColor(0xDD, 0xDD, 0xDD)
BG_LIGHT    = RGBColor(0xF7, 0xF7, 0xF8)  # very subtle off-white for cards
# Accent colors (minimal use only)
ACCENT_BLUE   = RGBColor(0x00, 0x6B, 0xA6)
ACCENT_GREEN  = RGBColor(0x0F, 0x7B, 0x5E)
ACCENT_PURPLE = RGBColor(0x6B, 0x3F, 0xA0)
ACCENT_ORANGE = RGBColor(0xD4, 0x6A, 0x00)
ACCENT_RED    = RGBColor(0xC0, 0x39, 0x2B)
ACCENT_TEAL   = RGBColor(0x00, 0x89, 0x8A)
TERMINAL_BG   = RGBColor(0xF0, 0xF0, 0xF0)  # light gray terminal background
TERMINAL_FG   = RGBColor(0x1A, 0x1A, 0x1A)  # black terminal text
TERMINAL_BORDER = RGBColor(0xBB, 0xBB, 0xBB)

prs = Presentation()
prs.slide_width  = Inches(13.333)
prs.slide_height = Inches(7.5)
W = prs.slide_width
H = prs.slide_height


# ── Helpers ────────────────────────────────────────────────────
def set_slide_bg(slide, color):
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_textbox(slide, left, top, width, height, text, font_size=18,
                color=BLACK, bold=False, alignment=PP_ALIGN.LEFT,
                font_name="Calibri"):
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.color.rgb = color
    p.font.bold = bold
    p.font.name = font_name
    p.alignment = alignment
    p.space_after = Pt(0)
    return tf


def add_rich_textbox(slide, left, top, width, height):
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    return tf


def add_para(tf, text, size=16, color=BLACK, bold=False, alignment=PP_ALIGN.LEFT,
             space_before=0, space_after=4, font_name="Calibri"):
    if len(tf.paragraphs) == 1 and tf.paragraphs[0].text == "":
        p = tf.paragraphs[0]
    else:
        p = tf.add_paragraph()
    p.text = text
    p.font.size = Pt(size)
    p.font.color.rgb = color
    p.font.bold = bold
    p.font.name = font_name
    p.alignment = alignment
    p.space_before = Pt(space_before)
    p.space_after = Pt(space_after)
    return p


def add_bullet(tf, text, size=14, color=DARK_GRAY, indent=0, bullet_char="\u2022",
               bold=False, space_after=3):
    p = tf.add_paragraph()
    p.text = f"    {bullet_char}   {text}"
    p.font.size = Pt(size)
    p.font.color.rgb = color
    p.font.bold = bold
    p.font.name = "Calibri"
    p.space_after = Pt(space_after)
    p.level = indent
    return p


def add_card(slide, left, top, width, height, fill_color=WHITE, border_color=BORDER_GRAY):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    shape.line.color.rgb = border_color
    shape.line.width = Pt(1)
    shape.shadow.inherit = False
    return shape


def add_line(slide, left, top, width, color=ACCENT_BLUE, thickness=2):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, Pt(thickness))
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()
    return shape


def add_arrow_down(slide, cx, top, color=ACCENT_BLUE, size=18):
    shape = slide.shapes.add_shape(
        MSO_SHAPE.DOWN_ARROW,
        cx - Pt(size // 2), top, Pt(size), Pt(size)
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()
    return shape


def add_circle(slide, left, top, size, fill_color):
    shape = slide.shapes.add_shape(MSO_SHAPE.OVAL, left, top, size, size)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    shape.line.fill.background()
    return shape


def add_slide_number(slide, num, total=8):
    add_textbox(slide, Inches(12.0), Inches(7.05), Inches(1.2), Inches(0.35),
                f"{num} / {total}", font_size=10, color=LIGHT_GRAY,
                alignment=PP_ALIGN.RIGHT)


def add_footer_bar(slide):
    add_line(slide, Inches(0), Inches(7.2), W, color=ACCENT_BLUE, thickness=2)


def add_header(slide, title, slide_num):
    add_textbox(slide, Inches(0.7), Inches(0.4), Inches(11), Inches(0.6),
                title, font_size=28, color=BLACK, bold=True)
    add_line(slide, Inches(0.7), Inches(1.05), Inches(3.2), ACCENT_BLUE, 3)
    add_footer_bar(slide)
    add_slide_number(slide, slide_num)


# ══════════════════════════════════════════════════════════════
# SLIDE 1 — TITLE
# ══════════════════════════════════════════════════════════════
s1 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(s1, WHITE)

# Top accent line
add_line(s1, Inches(0), Inches(0), W, ACCENT_BLUE, 4)

# Subtitle label
add_textbox(s1, Inches(0), Inches(1.0), W, Inches(0.4),
            "PYTHON PROGRAMMING  |  PBL PROJECT", font_size=12, color=MID_GRAY,
            bold=True, alignment=PP_ALIGN.CENTER, font_name="Calibri")

# Thin separator
add_line(s1, Inches(5.5), Inches(1.6), Inches(2.3), ACCENT_BLUE, 2)

# Main title
add_textbox(s1, Inches(1), Inches(2.0), Inches(11.3), Inches(1.0),
            "CareerPathr", font_size=48, color=BLACK, bold=True,
            alignment=PP_ALIGN.CENTER)

add_textbox(s1, Inches(1), Inches(2.9), Inches(11.3), Inches(0.6),
            "Goal Oriented Planner", font_size=26, color=ACCENT_BLUE,
            bold=False, alignment=PP_ALIGN.CENTER)

# Team card
card = add_card(s1, Inches(3.8), Inches(3.9), Inches(5.7), Inches(2.8),
                fill_color=WHITE, border_color=BORDER_GRAY)

tf = add_rich_textbox(s1, Inches(4.0), Inches(4.05), Inches(5.3), Inches(2.5))
add_para(tf, "Group D1", size=14, color=ACCENT_BLUE, bold=True,
         alignment=PP_ALIGN.CENTER, space_after=8)
add_para(tf, "Team Members", size=11, color=LIGHT_GRAY,
         alignment=PP_ALIGN.CENTER, space_after=4)
add_para(tf, "Waghmare Kiran   |   Haibate Kshithij", size=13, color=BLACK,
         alignment=PP_ALIGN.CENTER, space_after=3)
add_para(tf, "Varaganti Sai Ram Yadav   |   Gudikandula Sravan", size=13, color=BLACK,
         alignment=PP_ALIGN.CENTER, space_after=12)
add_para(tf, "Guide:  Mr. Paindla Thirupathi", size=13, color=DARK_GRAY, bold=True,
         alignment=PP_ALIGN.CENTER)

add_footer_bar(s1)
add_slide_number(s1, 1)


# ══════════════════════════════════════════════════════════════
# SLIDE 2 — PROBLEM STATEMENT & OBJECTIVES
# ══════════════════════════════════════════════════════════════
s2 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(s2, WHITE)
add_header(s2, "Problem Statement & Objectives", 2)

# Left card — Problem
add_card(s2, Inches(0.5), Inches(1.4), Inches(5.9), Inches(5.4),
         fill_color=WHITE, border_color=BORDER_GRAY)
# Left accent strip
add_line(s2, Inches(0.5), Inches(1.4), Pt(4), ACCENT_RED, Inches(5.4))

tf_prob = add_rich_textbox(s2, Inches(0.9), Inches(1.6), Inches(5.2), Inches(5.0))
add_para(tf_prob, "THE PROBLEM", size=16, color=ACCENT_RED, bold=True, space_after=10)
add_para(tf_prob, "Students struggle to manage long-term career", size=13, color=DARK_GRAY, space_after=2)
add_para(tf_prob, "and academic goals in a structured way.", size=13, color=DARK_GRAY, space_after=14)
add_bullet(tf_prob, "Goals are difficult to organize", size=13, color=DARK_GRAY, space_after=7)
add_bullet(tf_prob, "Large goals hard to break into smaller tasks", size=13, color=DARK_GRAY, space_after=7)
add_bullet(tf_prob, "Deadlines are frequently missed", size=13, color=DARK_GRAY, space_after=7)
add_bullet(tf_prob, "Progress is hard to track over time", size=13, color=DARK_GRAY, space_after=7)
add_bullet(tf_prob, "Planning info scattered across notes/apps", size=13, color=DARK_GRAY, space_after=7)
add_bullet(tf_prob, "No unified system for career planning", size=13, color=DARK_GRAY)

# Right card — Objectives
add_card(s2, Inches(6.9), Inches(1.4), Inches(5.9), Inches(5.4),
         fill_color=WHITE, border_color=BORDER_GRAY)
add_line(s2, Inches(6.9), Inches(1.4), Pt(4), ACCENT_GREEN, Inches(5.4))

tf_obj = add_rich_textbox(s2, Inches(7.3), Inches(1.6), Inches(5.2), Inches(5.0))
add_para(tf_obj, "OUR OBJECTIVES", size=16, color=ACCENT_GREEN, bold=True, space_after=10)
add_para(tf_obj, "Build a terminal-based Python tool that helps", size=13, color=DARK_GRAY, space_after=2)
add_para(tf_obj, "students plan and track career goals.", size=13, color=DARK_GRAY, space_after=14)
add_bullet(tf_obj, "Create and manage career goals", size=13, color=DARK_GRAY, space_after=7)
add_bullet(tf_obj, "Break goals into milestones", size=13, color=DARK_GRAY, space_after=7)
add_bullet(tf_obj, "Create actionable tasks with deadlines", size=13, color=DARK_GRAY, space_after=7)
add_bullet(tf_obj, "Track task and goal completion", size=13, color=DARK_GRAY, space_after=7)
add_bullet(tf_obj, "Manage reminders and deadlines", size=13, color=DARK_GRAY, space_after=7)
add_bullet(tf_obj, "Provide progress analytics", size=13, color=DARK_GRAY)


# ══════════════════════════════════════════════════════════════
# SLIDE 3 — PROPOSED SYSTEM
# ══════════════════════════════════════════════════════════════
s3 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(s3, WHITE)
add_header(s3, "Proposed System — CareerPathr", 3)

add_textbox(s3, Inches(0.7), Inches(1.3), Inches(12), Inches(0.7),
            "CareerPathr is a terminal-based Python application that helps students organize\n"
            "career goals into milestones and actionable tasks, with progress tracking and deadline management.",
            font_size=13, color=MID_GRAY, alignment=PP_ALIGN.LEFT)

# Left panel — features
add_card(s3, Inches(0.5), Inches(2.2), Inches(3.8), Inches(4.7),
         fill_color=WHITE, border_color=BORDER_GRAY)

tf_feat = add_rich_textbox(s3, Inches(0.8), Inches(2.4), Inches(3.2), Inches(4.3))
add_para(tf_feat, "KEY FEATURES", size=14, color=ACCENT_BLUE, bold=True, space_after=14)
add_bullet(tf_feat, "Centralized goal planning", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_feat, "Milestone-based goal breakdown", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_feat, "Task creation with priorities", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_feat, "Progress tracking per goal", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_feat, "Deadline & reminder management", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_feat, "Analytics & statistics view", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_feat, "Simple terminal interaction", size=12, color=DARK_GRAY)

# Center — workflow diagram
workflow_items = [
    ("Career Goal", ACCENT_BLUE),
    ("Milestones", ACCENT_PURPLE),
    ("Tasks", ACCENT_GREEN),
    ("Completion", ACCENT_ORANGE),
    ("Progress", ACCENT_TEAL),
    ("Analytics", ACCENT_RED),
]

box_w = Inches(3.0)
box_h = Inches(0.55)
start_x = Inches(5.1)
start_y = Inches(2.2)
gap = Inches(0.68)

for i, (label, color) in enumerate(workflow_items):
    y = start_y + i * gap
    add_card(s3, start_x, y, box_w, box_h, fill_color=WHITE, border_color=color)
    add_textbox(s3, start_x + Inches(0.15), y + Inches(0.06), box_w - Inches(0.3), box_h,
                label, font_size=13, color=color, bold=True, alignment=PP_ALIGN.CENTER)
    if i < len(workflow_items) - 1:
        arr_y = y + box_h - Inches(0.02)
        add_arrow_down(s3, start_x + box_w // 2, arr_y + Inches(0.02), color=ACCENT_BLUE, size=16)

# Right panel — benefits
add_card(s3, Inches(9.0), Inches(2.2), Inches(3.8), Inches(4.7),
         fill_color=WHITE, border_color=BORDER_GRAY)

tf_ben = add_rich_textbox(s3, Inches(9.3), Inches(2.4), Inches(3.2), Inches(4.3))
add_para(tf_ben, "BENEFITS", size=14, color=ACCENT_GREEN, bold=True, space_after=14)
add_bullet(tf_ben, "No internet required", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_ben, "Lightweight and fast", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_ben, "Works on any OS with Python", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_ben, "Structured career hierarchy", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_ben, "Easy to learn and use", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_ben, "Single-user local storage", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_ben, "Focused on student needs", size=12, color=DARK_GRAY)


# ══════════════════════════════════════════════════════════════
# SLIDE 4 — SYSTEM ARCHITECTURE & TECHNOLOGY
# ══════════════════════════════════════════════════════════════
s4 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(s4, WHITE)
add_header(s4, "System Architecture & Technology", 4)

# Architecture diagram — center-left
arch_boxes = [
    ("USER", Inches(5.3), Inches(1.5), Inches(2.7), ACCENT_BLUE),
    ("TERMINAL / CLI", Inches(5.0), Inches(2.5), Inches(3.3), ACCENT_TEAL),
    ("PYTHON APPLICATION", Inches(4.5), Inches(3.5), Inches(4.3), ACCENT_GREEN),
]

for label, x, y, w, color in arch_boxes:
    add_card(s4, x, y, w, Inches(0.6), fill_color=WHITE, border_color=color)
    add_textbox(s4, x, y + Inches(0.08), w, Inches(0.45),
                label, font_size=12, color=color, bold=True,
                alignment=PP_ALIGN.CENTER, font_name="Calibri")

# Arrows between main boxes
for y_pos in [Inches(2.15), Inches(3.15)]:
    add_arrow_down(s4, Inches(6.65), y_pos, ACCENT_BLUE, 16)

# Three sub-columns
col_labels = ["GOALS", "TASKS", "REMINDERS"]
col_x = [Inches(3.0), Inches(5.4), Inches(7.8)]
col_y = Inches(4.4)
col_colors = [ACCENT_BLUE, ACCENT_GREEN, ACCENT_ORANGE]
sub_labels = ["MILESTONES", "PROGRESS", "DEADLINES"]

# Horizontal connector line
add_line(s4, Inches(3.5), Inches(4.15), Inches(6.2), ACCENT_BLUE, 1)

for i, (label, x, color) in enumerate(zip(col_labels, col_x, col_colors)):
    add_card(s4, x, col_y, Inches(2.0), Inches(0.5), fill_color=WHITE, border_color=color)
    add_textbox(s4, x, col_y + Inches(0.06), Inches(2.0), Inches(0.4),
                label, font_size=11, color=color, bold=True,
                alignment=PP_ALIGN.CENTER, font_name="Calibri")
    add_arrow_down(s4, x + Inches(1.0), col_y + Inches(0.5), ACCENT_BLUE, 14)
    add_card(s4, x, Inches(5.05), Inches(2.0), Inches(0.5), fill_color=WHITE, border_color=BORDER_GRAY)
    add_textbox(s4, x, Inches(5.11), Inches(2.0), Inches(0.4),
                sub_labels[i], font_size=10, color=MID_GRAY, bold=True,
                alignment=PP_ALIGN.CENTER, font_name="Calibri")

# Vertical connectors from sub to storage
for x in col_x:
    add_line(s4, x + Inches(1.0), Inches(5.6), Pt(2), ACCENT_BLUE)

# Storage bar
add_card(s4, Inches(3.0), Inches(5.85), Inches(6.2), Inches(0.5),
         fill_color=WHITE, border_color=ACCENT_ORANGE)
add_textbox(s4, Inches(3.0), Inches(5.91), Inches(6.2), Inches(0.4),
            "DATA STORAGE  (JSON / File-based)", font_size=11, color=ACCENT_ORANGE,
            bold=True, alignment=PP_ALIGN.CENTER, font_name="Calibri")

# Right panel — Technologies
add_card(s4, Inches(0.5), Inches(1.4), Inches(2.6), Inches(5.4),
         fill_color=WHITE, border_color=BORDER_GRAY)

tf_tech = add_rich_textbox(s4, Inches(0.8), Inches(1.55), Inches(2.0), Inches(5.1))
add_para(tf_tech, "TECHNOLOGIES", size=13, color=ACCENT_BLUE, bold=True, space_after=12)

techs = [
    ("Python 3", ACCENT_GREEN),
    ("Modular Design", ACCENT_TEAL),
    ("OOP Concepts", ACCENT_PURPLE),
    ("File Handling", ACCENT_ORANGE),
    ("JSON Storage", ACCENT_BLUE),
    ("CLI Interface", ACCENT_RED),
]
for name, clr in techs:
    add_bullet(tf_tech, name, size=12, color=clr, space_after=10)


# ══════════════════════════════════════════════════════════════
# SLIDE 5 — MAIN MODULES
# ══════════════════════════════════════════════════════════════
s5 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(s5, WHITE)
add_header(s5, "Main Modules", 5)

modules = [
    ("User / Profile", "Register, login, and manage\nuser profile information", ACCENT_BLUE),
    ("Goal Management", "Create, edit, delete, and\ncomplete career goals", ACCENT_GREEN),
    ("Milestone", "Break goals into smaller\ntrackable stages", ACCENT_PURPLE),
    ("Task Management", "Create, assign, and track\nactionable tasks", ACCENT_ORANGE),
    ("Reminders", "Auto-generate deadline\nand progress reminders", ACCENT_TEAL),
    ("Analytics", "View statistics, progress,\nand category breakdown", ACCENT_RED),
]

cols = 3
card_w = Inches(3.8)
card_h = Inches(2.3)
gap_x = Inches(0.35)
gap_y = Inches(0.35)
start_x = Inches(0.5)
start_y = Inches(1.4)

for idx, (title, desc, color) in enumerate(modules):
    row = idx // cols
    col = idx % cols
    x = start_x + col * (card_w + gap_x)
    y = start_y + row * (card_h + gap_y)

    add_card(s5, x, y, card_w, card_h, fill_color=WHITE, border_color=color)
    # Color accent strip at top of card
    add_line(s5, x, y, card_w, color, 3)

    # Title
    add_textbox(s5, x + Inches(0.3), y + Inches(0.35), Inches(3.2), Inches(0.4),
                title, font_size=16, color=BLACK, bold=True)

    # Description
    add_textbox(s5, x + Inches(0.3), y + Inches(1.0), Inches(3.2), Inches(1.1),
                desc, font_size=12, color=MID_GRAY)


# ══════════════════════════════════════════════════════════════
# SLIDE 6 — WORKING & SAMPLE TERMINAL FLOW
# ══════════════════════════════════════════════════════════════
s6 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(s6, WHITE)
add_header(s6, "Working & Sample Terminal Flow", 6)

# Left — workflow steps
add_card(s6, Inches(0.5), Inches(1.4), Inches(4.3), Inches(5.4),
         fill_color=WHITE, border_color=BORDER_GRAY)

flow_steps = [
    ("START", ACCENT_GREEN),
    ("Login / User Access", BLACK),
    ("Main Menu", BLACK),
    ("Create Career Goal", BLACK),
    ("Add Milestones", BLACK),
    ("Add Tasks", BLACK),
    ("Complete Tasks", BLACK),
    ("Track Progress", BLACK),
    ("View Analytics", BLACK),
    ("EXIT", ACCENT_RED),
]

tf_flow = add_rich_textbox(s6, Inches(0.8), Inches(1.55), Inches(3.8), Inches(5.1))
add_para(tf_flow, "WORKFLOW", size=14, color=ACCENT_BLUE, bold=True, space_after=10)
for i, (label, clr) in enumerate(flow_steps):
    prefix = "▶  " if i == 0 else "    " if i < len(flow_steps) - 1 else "■  "
    add_para(tf_flow, f"{prefix}{label}", size=12, color=clr, space_after=4,
             font_name="Consolas")
    # Small arrow between steps
    if 0 < i < len(flow_steps) - 1:
        pass  # keep clean without arrows between every line

# Right — terminal mockup (light theme on white slide)
add_card(s6, Inches(5.3), Inches(1.4), Inches(7.5), Inches(5.4),
         fill_color=TERMINAL_BG, border_color=TERMINAL_BORDER)

# Terminal title bar
add_line(s6, Inches(5.3), Inches(1.4), Inches(7.5), ACCENT_BLUE, 2)
add_textbox(s6, Inches(5.5), Inches(1.5), Inches(6), Inches(0.35),
            "Terminal \u2014 CareerPathr", font_size=10, color=MID_GRAY,
            font_name="Consolas")

tf_term = add_rich_textbox(s6, Inches(5.7), Inches(1.95), Inches(6.8), Inches(4.7))
add_para(tf_term, "========================================", size=11, color=TERMINAL_FG,
         font_name="Consolas", space_after=1)
add_para(tf_term, "       CAREERPATHR", size=13, color=BLACK, bold=True,
         font_name="Consolas", space_after=1)
add_para(tf_term, "    GOAL ORIENTED PLANNER", size=11, color=TERMINAL_FG,
         font_name="Consolas", space_after=1)
add_para(tf_term, "========================================", size=11, color=TERMINAL_FG,
         font_name="Consolas", space_after=10)
add_para(tf_term, "  1. Goals", size=11, color=DARK_GRAY, font_name="Consolas", space_after=4)
add_para(tf_term, "  2. Milestones", size=11, color=DARK_GRAY, font_name="Consolas", space_after=4)
add_para(tf_term, "  3. Tasks", size=11, color=DARK_GRAY, font_name="Consolas", space_after=4)
add_para(tf_term, "  4. Reminders", size=11, color=DARK_GRAY, font_name="Consolas", space_after=4)
add_para(tf_term, "  5. Analytics", size=11, color=DARK_GRAY, font_name="Consolas", space_after=4)
add_para(tf_term, "  6. Profile", size=11, color=DARK_GRAY, font_name="Consolas", space_after=4)
add_para(tf_term, "  7. Settings", size=11, color=DARK_GRAY, font_name="Consolas", space_after=4)
add_para(tf_term, "  8. Exit", size=11, color=DARK_GRAY, font_name="Consolas", space_after=10)
add_para(tf_term, "Enter choice: _", size=11, color=BLACK, bold=True,
         font_name="Consolas", space_after=4)


# ══════════════════════════════════════════════════════════════
# SLIDE 7 — TESTING & RESULTS
# ══════════════════════════════════════════════════════════════
s7 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(s7, WHITE)
add_header(s7, "Testing & Results", 7)

# Table
table_x = Inches(0.7)
table_y = Inches(1.5)
col1_w = Inches(4.8)
col2_w = Inches(2.2)
row_h = Inches(0.5)

# Header row
add_card(s7, table_x, table_y, col1_w + col2_w, row_h,
         fill_color=ACCENT_BLUE, border_color=ACCENT_BLUE)
add_textbox(s7, table_x + Inches(0.3), table_y + Inches(0.07), col1_w, row_h,
            "Feature", font_size=13, color=WHITE, bold=True)
add_textbox(s7, table_x + col1_w + Inches(0.2), table_y + Inches(0.07), col2_w, row_h,
            "Status", font_size=13, color=WHITE, bold=True)

test_rows = [
    ("User Registration & Login", "PASS"),
    ("Goal CRUD Operations", "PASS"),
    ("Milestone Management", "PASS"),
    ("Task Management", "PASS"),
    ("Progress Tracking", "PASS"),
    ("Reminder Generation", "PASS"),
    ("Analytics / Statistics", "PASS"),
    ("Input Validation", "PASS"),
    ("Error Handling", "PASS"),
    ("Application Restart", "PASS"),
]

for i, (feature, status) in enumerate(test_rows):
    y = table_y + row_h + i * row_h
    bg = WHITE if i % 2 == 0 else BG_LIGHT
    add_card(s7, table_x, y, col1_w + col2_w, row_h, fill_color=bg, border_color=BORDER_GRAY)
    add_textbox(s7, table_x + Inches(0.3), y + Inches(0.07), col1_w, row_h,
                feature, font_size=12, color=DARK_GRAY)
    add_textbox(s7, table_x + col1_w + Inches(0.2), y + Inches(0.07), col2_w, row_h,
                f"  {status}", font_size=12, color=ACCENT_GREEN, bold=True)

# Right — testing notes
add_card(s7, Inches(8.2), Inches(1.5), Inches(4.6), Inches(5.2),
         fill_color=WHITE, border_color=BORDER_GRAY)

tf_notes = add_rich_textbox(s7, Inches(8.5), Inches(1.65), Inches(4.0), Inches(5.0))
add_para(tf_notes, "TESTING APPROACH", size=14, color=ACCENT_BLUE, bold=True, space_after=12)
add_bullet(tf_notes, "CRUD testing for all modules", size=12, color=DARK_GRAY, space_after=7)
add_bullet(tf_notes, "Progress calculation verification", size=12, color=DARK_GRAY, space_after=7)
add_bullet(tf_notes, "Invalid input handling tested", size=12, color=DARK_GRAY, space_after=7)
add_bullet(tf_notes, "Empty data edge cases checked", size=12, color=DARK_GRAY, space_after=7)
add_bullet(tf_notes, "Reminder auto-generation verified", size=12, color=DARK_GRAY, space_after=7)
add_bullet(tf_notes, "Application restart persistence", size=12, color=DARK_GRAY, space_after=7)
add_bullet(tf_notes, "Error messages validated", size=12, color=DARK_GRAY, space_after=7)
add_bullet(tf_notes, "Boundary value testing performed", size=12, color=DARK_GRAY)


# ══════════════════════════════════════════════════════════════
# SLIDE 8 — CONCLUSION & FUTURE SCOPE
# ══════════════════════════════════════════════════════════════
s8 = prs.slides.add_slide(prs.slide_layouts[6])
set_slide_bg(s8, WHITE)
add_header(s8, "Conclusion & Future Scope", 8)

# Left — Conclusion
add_card(s8, Inches(0.5), Inches(1.4), Inches(6.0), Inches(5.4),
         fill_color=WHITE, border_color=ACCENT_GREEN)
add_line(s8, Inches(0.5), Inches(1.4), Pt(4), ACCENT_GREEN, Inches(5.4))

tf_conc = add_rich_textbox(s8, Inches(0.9), Inches(1.6), Inches(5.3), Inches(5.0))
add_para(tf_conc, "CONCLUSION", size=18, color=ACCENT_GREEN, bold=True, space_after=14)
add_para(tf_conc, "CareerPathr provides a structured way to manage", size=13, color=DARK_GRAY, space_after=2)
add_para(tf_conc, "long-term career goals by dividing them into", size=13, color=DARK_GRAY, space_after=2)
add_para(tf_conc, "milestones and actionable tasks.", size=13, color=DARK_GRAY, space_after=16)
add_para(tf_conc, "Key achievements:", size=13, color=ACCENT_BLUE, bold=True, space_after=8)
add_bullet(tf_conc, "Goal -> Milestone -> Task hierarchy", size=12, color=DARK_GRAY, space_after=6)
add_bullet(tf_conc, "Progress tracking and analytics", size=12, color=DARK_GRAY, space_after=6)
add_bullet(tf_conc, "Deadline and reminder management", size=12, color=DARK_GRAY, space_after=6)
add_bullet(tf_conc, "Simple Python terminal interface", size=12, color=DARK_GRAY, space_after=6)
add_bullet(tf_conc, "Lightweight, no external dependencies", size=12, color=DARK_GRAY)

# Right — Future Scope
add_card(s8, Inches(6.9), Inches(1.4), Inches(6.0), Inches(5.4),
         fill_color=WHITE, border_color=ACCENT_PURPLE)
add_line(s8, Inches(6.9), Inches(1.4), Pt(4), ACCENT_PURPLE, Inches(5.4))

tf_future = add_rich_textbox(s8, Inches(7.3), Inches(1.6), Inches(5.3), Inches(5.0))
add_para(tf_future, "FUTURE SCOPE", size=18, color=ACCENT_PURPLE, bold=True, space_after=14)
add_para(tf_future, "Potential improvements for later versions:", size=13, color=DARK_GRAY, space_after=12)
add_bullet(tf_future, "GUI version (Tkinter / PyQt)", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_future, "Mobile application", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_future, "Cloud synchronization", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_future, "Advanced notifications", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_future, "Personalized career recommendations", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_future, "Advanced analytics and reports", size=12, color=DARK_GRAY, space_after=8)
add_bullet(tf_future, "Multi-device support", size=12, color=DARK_GRAY)


# ── Save ───────────────────────────────────────────────────────
output_path = "CareerPathr_PBL_8_Slides_Final.pptx"
prs.save(output_path)
print(f"Presentation saved: {output_path}")
print(f"Slides: {len(prs.slides)}")
