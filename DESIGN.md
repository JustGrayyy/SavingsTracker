# Design System

Reference Website

https://impeccable.style/

The visual language of this project should closely follow the design principles of this reference while remaining an original implementation.

---

# Overall Style

Premium SaaS.

Editorial.

Minimal.

Luxury through restraint.

Large whitespace.

Confident typography.

Very little visual decoration.

No unnecessary effects.

---

# Layout

Wide layouts.

Large gutters.

Generous padding.

Consistent spacing scale.

12-column responsive grid.

Maximum content width around 1280–1440px.

Never allow cramped layouts.

Whitespace should separate sections instead of borders.

---

# Spacing

Spacing is the primary design tool.

Prefer:

8
16
24
32
48
64
96
128

Avoid arbitrary spacing values.

Increase whitespace before increasing decoration.

---

# Typography

Typography is the strongest visual hierarchy.

## Font roles (3 only)

Keep the set small. Roles map 1:1 to tokens in `src/theme.css`.

| Role | Token | Face | Use on |
|------|-------|------|--------|
| UI | `--font-ui` | Plus Jakarta Sans | body, forms, nav links, buttons, meta |
| Display | `--font-display` | Outfit | h1–h3, logo, big page titles |
| Mono | `--font-mono` | JetBrains Mono | times, codes, numeric emphasis |

Fallbacks: Inter / system-ui for UI; Plus Jakarta Sans for display; SF Mono / Consolas for mono.

Headings:

- Outfit
- large
- bold
- tight tracking
- high contrast

Body:

- Plus Jakarta Sans
- comfortable reading width
- generous line-height
- medium weight

Avoid:

- tiny fonts
- excessive font weights
- decorative / script fonts
- more than these 3 faces
- inconsistent sizing

---

# Color Tokens

## Background

Avoid pure black.

Use:

Background:
#0A0A0A

Surface:
#111111

Card:
#151515

Elevated:
#1A1A1A

Border:
#242424

This creates depth without relying on shadows.

---

# Text Colors

Primary Text:
#F5F5F5

Secondary Text:
#A1A1AA

Muted Text:
#71717A

Disabled:
#52525B

Text should always maintain high readability.

---

# Accent Colors

Primary Accent:

#F5C518

or

#EAB308

Use for:

- active states
- links
- highlights
- buttons
- important actions

Accent color should be rare.

Too much yellow reduces impact.

---


# Text Visibility Rules

Text readability is more important than branding.

Never reduce text contrast to match aesthetics.

Text must remain readable under:

- light mode
- dark mode
- hover
- active
- disabled
- colored backgrounds

---

# Contrast Rules

Minimum:

WCAG AA

Preferred:

WCAG AAA

Examples:

✓ Good:

White text
on dark gray background

✓ Good:

Yellow accent
used sparingly

✗ Bad:

Yellow paragraph text

✗ Bad:

Gray text on dark gray

✗ Bad:

Low opacity text

✗ Bad:

Text over gradients

---

# Text on Colored Backgrounds

If using accent backgrounds:

Dark text on yellow

Example:

Background:
#F5C518

Text:
#111111

Never use:

Yellow text on white

Yellow text on gray

Yellow text on light backgrounds

---

# Command Styling

Commands should resemble terminal UI.

Example:

Background:
#111111

Border:
#2A2A2A

Font:
JetBrains Mono

Text:
#F5F5F5

Accent:
#F5C518

Example:

/impeccable polish

---

# Color Usage Ratio

70%

Backgrounds
Neutrals

20%

Text

10%

Accent

Accent colors should never dominate the interface.

---

# Cards

Flat.

Minimal.

Thin borders.

Soft shadow.

Medium radius.

Lots of padding.

Cards should breathe.

Never stack cards inside cards.

---

# Buttons

Simple.

Confident.

Medium radius.

Clear typography.

No excessive shadows.

No glossy effects.

Hover state should be subtle.

Buttons should feel tactile without looking inflated.

---

# Inputs

Large click targets.

Comfortable padding.

Simple borders.

Minimal focus ring.

Consistent height.

No unnecessary icons.

---

# Navigation

Simple.

Predictable.

Minimal.

Generous spacing.

High readability.

No excessive nesting.

Navigation should disappear visually until needed.

---

# Icons

Minimal.

Consistent stroke width.

Simple shapes.

Never oversized.

Never decorative.

Icons support content.

They do not become content.

---

# Borders

Mostly 1px.

Subtle.

Used sparingly.

Prefer spacing before borders.

---

# Radius

Small to medium.

Approximately:

8px

12px

16px

Avoid oversized rounded corners.

---

# Shadows

Soft.

Diffuse.

Low opacity.

Used only where needed.

Never dramatic.

Never floating everywhere.

---

# Motion

Motion communicates state.

Animations should feel effortless.

Duration:

150–250ms

Timing:

ease-out

Hover:

slight elevation

slight opacity change

small translateY

Page transitions:

fade

translate

No bouncing.

No elastic animations.

No flashy transitions.

---

# Responsiveness

Desktop-first quality.

Perfect tablet adaptation.

Excellent mobile refinement.

Spacing scales naturally.

Typography scales naturally.

Never simply shrink desktop.

Redesign layouts where necessary.

---

# Visual Hierarchy

Whitespace first.

Typography second.

Color third.

Effects last.

The eye should naturally know where to look.

---

# Accessibility

Maintain WCAG AA contrast.

Keyboard accessible.

Visible focus states.

Readable typography.

Touch-friendly controls.

---

# Things To Avoid

Material UI defaults

Bootstrap appearance

Tailwind demo layouts

Generic SaaS templates

Large colorful gradients

Glassmorphism

Neumorphism

Heavy drop shadows

Card inside card layouts

Rounded pills everywhere

Oversized icons

Too many accent colors

Dense dashboards

Unbalanced spacing

Inconsistent typography

AI-generated aesthetics

---

# Impeccable Rules

Before completing any UI:

Ask:

Does this feel handcrafted?

Could this appear on impeccable.style?

Is there unnecessary visual noise?

Can spacing solve this instead of borders?

Can typography solve this instead of color?

Can simplicity improve this?

If the answer is no, redesign it.

Never stop polishing until the interface feels intentional.