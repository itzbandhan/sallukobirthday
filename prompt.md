# Build: “Sallu 18th Invitation” — Mobile-First Animated Letter → Card (Supabase + Admin Editor)

## Goal
Create a mobile-first invitation card web app where the homepage shows ONLY a levitating envelope/letter with a “Tap to Open” CTA. Tapping opens the mail with smooth animation, reveals a cute invitation card, triggers confetti, and shows a cute emoji animation overlay that fades out after ~2 seconds. The card is personalized by URL slug (recipient name), supports couple invites, a default no-slug invite, and one special surprise invite for the birthday girl from her boyfriend. Admin can edit all content and manage recipients via a dashboard.

---

## Tech Stack (Must)
- React + Vite
- Tailwind CSS
- Supabase (DB + Auth for admin)
- Mobile-first responsiveness is the #1 priority
- Deployed on a domain like: `invitation.itzbandhan.tech/:slug`

---

## Pages / Routes (Must)
1. `/` (Home)
   - NO navigation bar.
   - ONLY the animated letter/envelope scene and “Tap to Open” button.
   - If user stays idle, envelope continuously levitates in a loop animation.
   - If slug is absent, render the non-personalized invitation variant after open.

2. `/:slug`
   - Same as home but personalized for the given slug.
   - Slug examples:
     - `invitation.itzbandhan.tech/bandhan`
     - `invitation.itzbandhan.tech/ram-sita` (couple)
     - `invitation.itzbandhan.tech/sallu-surprise` (special surprise page)

3. `/admin`
   - Admin login (Supabase Auth).
   - Admin dashboard to edit invitation content, theme bits, date/venue, emoji/confetti settings, and manage recipients.
   - Important: Admin navigation should NOT appear on public pages.

---

## Core UX / Animation Requirements (Must)
### Envelope / Letter Scene
- Full screen (mobile-first), centered envelope.
- Envelope continuously levitates (loop): slight up-down + tiny rotation + soft shadow breathing.
- Background: cute clean pastel gradient with subtle grain/noise (light), tiny floating abstract shapes (optional but subtle).
- “Tap to Open” button:
  - Large, thumb-friendly, cute, clean.
  - Micro-interactions: press scale, ripple, gentle bounce.
  - After tap: disable repeated taps, trigger opening sequence.

### Opening Sequence (Must)
- Envelope flap opens smoothly (spring-ish).
- Card slides out from inside the envelope with a delightful easing (GSAP recommended).
- Confetti burst when envelope opens (single burst + a few lingering pieces).
- A cute emoji (like 🥳🎉✨ or a custom animated sticker) floats across screen and fades after ~2 seconds.
  - Should not block reading.
  - Should be responsive and performance-friendly.

### Invitation Card UI (Must)
- Card looks like a premium cute invitation:
  - Rounded corners, soft shadows, subtle border, tiny sparkles/abstract shapes.
  - Use cute abstract decorations so it never looks empty.
  - Maintain clean typography hierarchy.
- Card headline:
  - “You’re invited to Sallu’s 18th Birthday”
  - Use a cute display font for heading + clean body font for details (Google Fonts).
- Below headline show:
  - Date (editable)
  - Venue (editable)
  - Optional small line: “Save the date” / “Come celebrate with us” (editable)
- Must include subtle animated accents:
  - tiny twinkle or floating blob(s) near corners (low motion)
  - keep motion minimal so it feels premium, not distracting

### Personalization Behavior (Must)
- If `/:slug` exists:
  - Fetch recipient by slug from Supabase.
  - If recipient is a couple invite: show both names (“Ram & Sita” or separate fields).
  - If normal single: show “Dear {Name}” (or “Hey {Name}!”) at top of card.
- If `/` (no slug):
  - Show slightly different version: no personal greeting, generic invite copy.

### Special Surprise Invite (Must)
- One special personalized slug page intended for the birthday girl, with custom copy editable by admin:
  - Default copy:
    “Hi Sallu, wondering what this card is doing with an invitation for you?
     Let me make it clear, more than you, your boyfriend is excited for the birthday,
     so you deserve an invitation as well.”
  - Add “and some more content” area (editable) for a longer romantic message.
- This page should feel extra special:
  - Slightly richer animation (still tasteful)
  - Maybe a heart sparkle overlay on open (optional + editable toggle)

---

## Data Model (Supabase) (Must)
Use Supabase tables:

### 1) `invitation_settings` (single row)
Fields:
- `id` (uuid)
- `title` (text) -> default: "You're invited to Sallu's 18th Birthday"
- `date_text` (text) -> e.g., "March 04, 2026 (Saturday)"
- `venue_text` (text) -> e.g., "Galyang, Syangja — Venue Name"
- `subtitle` (text) -> optional
- `theme_variant` (text) -> "cute-pastel" etc
- `emoji` (text) -> "🥳"
- `confetti_enabled` (bool)
- `emoji_overlay_enabled` (bool)
- `open_button_text` (text) -> "Tap to Open"
- `generic_message` (text) -> generic no-slug message
- `updated_at`

### 2) `recipients`
Fields:
- `id` (uuid)
- `slug` (text, unique)
- `invite_type` (text enum: "single" | "couple" | "special")
- `name_single` (text) -> for single invites
- `name_partner1` (text) -> for couple
- `name_partner2` (text) -> for couple
- `custom_message` (text) -> optional per recipient
- `is_active` (bool)
- `created_at`

Rules:
- If `invite_type="couple"`, render both names.
- If `invite_type="special"`, show special surprise layout + message.

---

## Admin Requirements (Must)
- Admin login via Supabase Auth (email+password).
- After login:
  - Tab 1: “Invitation Settings” editor
    - edit title/date/venue/subtitle/button text/emoji/toggles
    - save to `invitation_settings`
  - Tab 2: “Recipients”
    - CRUD recipients
    - automatically generate slug from name (editable)
    - select invite type: single/couple/special
    - preview link button copies full URL
- Admin UI: clean, minimal, still cute but professional.
- Public pages must not show admin nav or admin links.

---

## UI/Design Direction (Must)
- “Best possible UI” = clean + cute + premium.
- Use:
  - soft pastel palette
  - rounded cards
  - gentle shadows
  - micro-animations (scale, float, twinkle)
- Strict mobile-first:
  - max-width layout for card (like 360–420px)
  - large tap targets
  - avoid heavy effects that lag on phones
- Use animations that are GPU-friendly (transform/opacity).
- Provide “Reduce Motion” support:
  - if prefers-reduced-motion, minimize animation, disable confetti/emoji overlay.

---

## Implementation Details (Must)
- Use GSAP for envelope/card animation timeline.
- Confetti library acceptable (canvas-confetti recommended) with performance controls.
- Emoji overlay animation:
  - fixed positioned, center/top; float + scale + fade; remove after 2 seconds.
- Loading states:
  - If fetching slug/setting: show tiny cute loading shimmer/skeleton on card area (NOT a full page loader that breaks vibe).
- Error states:
  - If slug not found or inactive:
    - show friendly “Invitation not found” with the envelope still visible and a cute hint.
- SEO/meta:
  - Add proper OpenGraph meta for share preview (title + cute preview image placeholder).
- Deploy-ready.

---

## Supabase Config (Use exactly these, yes exposed for now)
Supabase URL:
https://wzsqctnryxflmxndxfku.supabase.co
Anon key:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6c3FjdG5yeXhmbG14bmR4Zmt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMDQ2OTgsImV4cCI6MjA4NDU4MDY5OH0.A5GLFYd00NM2d3hKNdCGC6l_Xxaf5pqpq8ZAr0B0yGU

---

## Deliverables (Must)
- Complete Vite + React + Tailwind project code
- Supabase schema SQL (tables + constraints) and setup notes
- Clean folder structure
- Public invitation pages working:
  - `/` generic
  - `/:slug` personalized
  - special surprise slug layout
- Admin dashboard working at `/admin`
- Smooth envelope open animation + confetti + emoji overlay
- Mobile-first responsive UI and performance optimized

---

## Acceptance Checklist (Must Pass)
- Home page has ONLY envelope + tap to open, no nav.
- Envelope levitates in loop when idle.
- Opening animation is smooth, card slides out.
- Confetti triggers on open.
- Cute emoji animation overlay appears and fades within ~2 seconds.
- Card shows title + cute abstracts + date + venue.
- Personalization works by slug, including couple format and generic no-slug.
- Special surprise slug shows the provided custom message and is editable.
- Admin can edit settings and recipients and content updates reflect instantly.
- Works perfectly on mobile screens.
