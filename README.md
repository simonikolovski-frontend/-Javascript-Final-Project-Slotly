# 🗓️ Slotly — book local services

This is your final project. You get a finished design, a list of tickets, and acceptance
criteria. Your job is to write the JavaScript for each ticket. It goes in your portfolio, so
keep it clean.

## What the app does

Slotly is a small app for booking local services. A user can:

- browse all services,
- open a service to see the details and **book a time**,
- add their **own** services,
- see the bookings they made and the bookings they received.

Everyone is both a provider and a client. From one account you can offer a guitar lesson and
book a haircut.

The app is not just one list. When you open a service, it gets its **own page** — a detail
view. You move between views inside the app (Browse, a service's page, My bookings, My
services) by changing `state` and re-rendering. That is the main new part of the project.

The app also has a **landing page**. A logged-out visitor sees it first and logs in or
registers from there. So there are **three screens**: landing → auth → app. You switch
between them yourself.

## Rules (you must follow these)

- Vanilla JS, **ES modules**, Live Server, no build tools. One `<script type="module">`.
- The design is **done**. Bootstrap 5 and `style.css` are already in `index.html`. You write
  **only JavaScript**. Don't change the CSS or the layout.
- Only Bootstrap **CSS** is loaded — there is no Bootstrap JavaScript. You build all the
  behaviour yourself in vanilla JS (the overlay, the tabs, showing and hiding screens). A
  screen or the overlay is just an element you show with `classList.remove("d-none")` and hide
  with `classList.add("d-none")`.
- **Three screens:** `#landing-view` (logged out), `#auth-view` (log in / sign up),
  `#app-view` (logged in). Show one at a time. The landing buttons have
  `data-auth="login|register"` — use it to open the right tab.
- All shared data lives in **one `state` object**. It is the single source of truth.
- **UI = f(state).** To change the page: change `state`, then call `render()`. Never change
  the page by hand.
- `render()` only **reads** state and redraws. It never changes state.
- `api.js` does all the **services & bookings** requests. After every successful write, it
  **loads again from the server** and re-renders. (`auth.js` is the exception: it reads and
  creates **users** for login and register.)
- Compare ids **as strings**. A PUT sends the **whole service object** — every field,
  including `providerId` and the `bookings` array. If you drop the array, you delete all the
  bookings.

## Files — six files, six jobs

| File | Job | Must NOT |
|---|---|---|
| `state.js` | the one shared object | no logic, no DOM, no fetch |
| `api.js` | services & bookings requests + reload after write | no rendering |
| `auth.js` | register, login, logout, session, screen switching | no service/booking logic |
| `router.js` | switch which view shows — set `state.route`, `navigate()` | no fetch, no rendering |
| `render.js` | turn `state` into the page — **all views** | never change state, never fetch |
| `main.js` | the file the HTML loads — wires events, starts the app | no HTML strings |

`render.js`, `router.js` and `main.js` grow with almost every ticket. The others you mostly
write once. Every fixed element is already in `index.html` — read it and find the ids. The
parts made from data (a service card, the detail panel, a booking row) you build in JS,
following the **design mocks** in the comments in `index.html`.

Your `state` should hold at least: `users`, `services`, `currentUser`, the current **route**
(which view, and which service id on a detail page), and the id of the service being
**edited**. You design the exact shape.

## Data — two resources (mockapi free plan)

**`users`** — `name` (string) · `email` (string) · `password` (string)

**`services`** — `title` (string) · `price` (number) · `duration` (number, minutes) ·
`category` (string) · `description` (string) · `image` (string, optional) ·
`providerId` (string) · **`bookings`** (array)

The cards show **photos**: the `image` fills the top of the card. If there is no image (or the
link is broken), the design shows a **category tile** with an icon instead, so the card still
looks good. Seed the eight services with the photo URLs below.

The `bookings` array is **inside each service**. That is your one-to-many (one service has
many bookings) without a third resource. Each booking is an object:

```
{ "id": "b1", "clientId": "2", "date": "2026-08-12", "time": "14:00", "status": "confirmed" }
```

`status` is `"confirmed"` or `"cancelled"`. A new booking needs its own `id` (a string — a
timestamp works).

### Seed data

Paste the data straight into mockapi — no typing row by row. Do **users first**, so their ids
come out 1, 2, 3 (the services point to them with `providerId`; mockapi sets each `id` for
you).

1. In mockapi, open the **users** resource → **Data** tab → paste the users array below → save.
2. Open the **services** resource → **Data** tab → paste the services array below → save.

**users**

```json
[
  { "name": "Ana",   "email": "ana@test.com",   "password": "ana123" },
  { "name": "Marko", "email": "marko@test.com", "password": "marko123" },
  { "name": "Iva",   "email": "iva@test.com",   "password": "iva123" }
]
```

**services** — the photos and bookings are already inside

```json
[
  { "title": "Haircut & style", "price": 20, "duration": 30, "category": "Beauty", "description": "A wash, cut and style in a relaxed home studio. Suits all hair types.", "image": "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=70", "providerId": "1", "bookings": [{ "id": "b1", "clientId": "2", "date": "2026-08-12", "time": "14:00", "status": "confirmed" }] },
  { "title": "Beginner guitar lesson", "price": 18, "duration": 60, "category": "Lessons", "description": "One hour for total beginners: first chords, tuning, and an easy song to take home.", "image": "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=70", "providerId": "2", "bookings": [{ "id": "b3", "clientId": "3", "date": "2026-08-20", "time": "17:00", "status": "confirmed" }] },
  { "title": "Portrait photo session", "price": 80, "duration": 90, "category": "Photography", "description": "A relaxed 90-minute portrait shoot outdoors, plus 10 edited photos.", "image": "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=70", "providerId": "3", "bookings": [{ "id": "b2", "clientId": "1", "date": "2026-08-15", "time": "10:30", "status": "confirmed" }] },
  { "title": "Dog walking", "price": 10, "duration": 45, "category": "Pets", "description": "A 45-minute walk for your dog around the neighbourhood, rain or shine.", "image": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=70", "providerId": "1", "bookings": [] },
  { "title": "Math tutoring (high school)", "price": 15, "duration": 60, "category": "Lessons", "description": "Algebra and geometry help for high-schoolers, at your own pace.", "image": "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=70", "providerId": "2", "bookings": [] },
  { "title": "Deep-clean apartment", "price": 50, "duration": 120, "category": "Home", "description": "Top-to-bottom clean of a one- or two-room apartment. Products included.", "image": "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=70", "providerId": "3", "bookings": [] },
  { "title": "Personal training session", "price": 25, "duration": 60, "category": "Fitness", "description": "A one-on-one workout tailored to your level, indoor or in the park.", "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=70", "providerId": "1", "bookings": [] },
  { "title": "Bike repair & tune-up", "price": 12, "duration": 30, "category": "Repairs", "description": "Brakes, gears and a full safety check to get your bike road-ready.", "image": "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=70", "providerId": "2", "bookings": [] }
]
```

(An empty `image` is fine — the card shows the category tile instead. You build that fallback
in SL-3.)

## How to work

Do the tickets **in order** — each sprint builds on the one before. A ticket is **done** when:

1. Every acceptance criterion works in the browser.
2. The console has **zero errors** and **no leftover `console.log`s**.
3. The rules above still hold.
4. The app still works everywhere: a **fresh browser**, a **second account**, a
   **logged-out refresh**, and **after** a save, a booking, or a logout.

Run the app after every ticket. When a ticket doesn't say how to build something, pick a good
way and be ready to explain it.

## What is mandatory

**Sprints 1–5 (SL-1 … SL-13, SL-16) are mandatory.** This is the two-week goal: a working app
with routing and booking, ready for your portfolio. Finish all of it first.

The rest is optional, for when you finish early: a **🎁 Bonus** section and one
**🏅 Extra bonus** ticket (SL-14). They are at the bottom.

---

## Sprint 1 — On the screen

### SL-1 · Set up the project
Set up the backend and make the app run.
- [ ] A mockapi project with the two resources, filled with **all** the seed data (users
      first, in order; services with `providerId`, the three bookings, and the photos).
- [ ] The six files exist. `index.html` loads **only** `main.js`, as a module. (`index.html`
      already has the landing page, the auth screen, and the app — read it, find the ids, and
      choose which screen to show.)
- [ ] Live Server opens the page with zero console errors. One `console.log` in `main.js`
      proves it runs (delete it after you see it).

### SL-2 · Load the data
On start, the users and services come from your mockapi into `state`.
- [ ] While loading, `#message` shows `Loading...`. It clears when done.
- [ ] After start, `state.users` and `state.services` hold the seed data (check with one log,
      then delete it).
- [ ] Break the URL on purpose: a clear message shows — no blank page, no crash. Fix the URL
      after.
- [ ] The Network tab shows exactly one request per resource on start.

### SL-3 · Show the catalog
The visitor sees every service on the Browse view, built from `state`.
- [ ] Every service is a card that **matches the design mock** in `index.html`: the **photo**
      (or the **category tile** when there is no `image`), the category chip, title, `€` price,
      duration, and the provider's real name (with an avatar initial), joined from the users.
      "Unknown" never shows for seed data.
- [ ] The counter shows `8 services` and always matches the cards.
- [ ] Change a service in mockapi, refresh, and the card changes — this proves the page comes
      from data.
- [ ] Cards are read-only for now: the **View & book** link works, nothing else. No owner
      buttons, no booking box yet.

## Sprint 2 — Accounts

*After this sprint the app is for members only. A logged-out visitor sees the **landing page**
first (with Log in / Sign up). The app is hidden until someone logs in.*

### SL-4 · Register
- [ ] The Register form creates a user in mockapi. After it works, the user goes to the
      **login screen** — not straight into the app — and logs in from there.
- [ ] An email that already exists is refused, with a message under the form. No duplicate
      accounts.
- [ ] The register form clears after a successful register.

### SL-5 · Log in
- [ ] Correct email + password (try `ana@test.com` / `ana123`) → the app, with the name in the
      top bar.
- [ ] A wrong email or password shows a message under the login form. You stay on the auth
      screen.
- [ ] **The gate:** when you open the site logged out, you see the **landing page**. The app is
      never visible until someone logs in.
- [ ] Logging in on a fresh browser shows a **full** app — the services are already on screen,
      not an empty grid.

### SL-6 · Stay logged in, log out
- [ ] Refresh while logged in → still in the app, still logged in.
- [ ] The session is saved in localStorage and holds **only** id and name — never the password
      (check the Application tab).
- [ ] Log out → back to the **landing page**. Refresh → still logged out.
- [ ] **Log out clears everything.** Log in as Ana, log out, log in as Marko. Nothing from Ana
      is left: not the user, not the loaded data, not a half-finished edit, not the last route.
      Check with the second account.

## Sprint 3 — Views & the detail page

*The new part. `index.html` already has the four views (Browse, a service's detail, My
bookings, My services). Only one shows at a time, and `state` decides which.*

### SL-7 · Switch views from state
Every link in the app points at a view with a `#/...` href — `#/browse`, `#/bookings`,
`#/services`, `#/service/3`. You do **not** use the real URL. One click handler reads where a
link points, updates the view in `state`, and re-renders.
- [ ] `state` holds the current **view** (and, on a detail page, which **service id**).
- [ ] Clicking Browse / My bookings / My services shows that one view and hides the others.
      The active link is highlighted.
- [ ] `render()` draws the view that `state` points at.
- [ ] Switching views only changes state and re-renders — no server requests (Network stays
      quiet), and the address bar does not change.

### SL-8 · The service detail page
- [ ] Clicking a service (its card, photo, or title) opens its **own page**: the detail view
      shows that service from `state` — photo, title, provider, `€` price, duration, category,
      description — matching the detail mock.
- [ ] A **Back** link returns to Browse.
- [ ] Someone else's service shows a booking box. Your own service shows Edit / Delete instead
      — never a booking box on your own service.

### SL-9 · Handle a missing service
- [ ] Opening a service that doesn't exist (for example one that was just deleted) shows a
      friendly *service not found* with a link back. No crash, no `undefined`.
- [ ] Reading `state.currentUser` or the current service never crashes — not for a bad id, not
      when logged out. (Check the value exists before you use it.)

## Sprint 4 — Offer a service

### SL-10 · Offer a service
- [ ] **Offer a service** opens the modal. Submitting creates a service in mockapi with **my**
      `providerId`, `price` and `duration` as **numbers**, and `bookings` as an empty array
      `[]`.
- [ ] The new service shows on Browse and My services with no manual refresh. The counter goes
      up by one. The modal closes and opens clean next time.

### SL-11 · Edit / delete my service
- [ ] On **my** service (detail view and My services) I see Edit and Delete. On other people's
      services I don't (check with two accounts).
- [ ] Edit opens the **same** modal, filled in, with *Edit your service* / *Save changes*.
- [ ] Saving PUTs the **whole** service — `providerId` and the `bookings` array stay the same
      (check mockapi: the bookings are still there).
- [ ] **Delete asks first.** If you say no, nothing happens (no request, the service stays). If
      you say yes, it is removed from mockapi and the page; a refresh confirms it is gone.
- [ ] Adding a new service after an edit creates a **new** service. It never overwrites the
      edited one.

## Sprint 5 — Booking & browsing

### SL-12 · Book a service
- [ ] On someone else's detail page, pick a date and time and click **Book**. This adds a
      booking to that service's `bookings` array (an object with its own `id`, my `clientId`,
      the date, the time, `status: "confirmed"`), then PUTs the **whole** service and reloads.
- [ ] Empty date or time is refused with a message. Nothing is sent.
- [ ] After booking, the detail page and My bookings both show it — no manual refresh.
- [ ] You cannot book your own service (there is no booking box there).

### SL-13 · My bookings, and cancel
- [ ] `#/bookings` shows every service where **I** am in the `bookings` array with
      `status: "confirmed"`: the title (links to the detail page), the date, the time, and the
      **provider's** name from users — matching the booking-row mock.
- [ ] A line above the list shows the count — e.g. `2 upcoming bookings`.
- [ ] **Cancel asks first.** If you say no, nothing happens. If you say yes, the booking's
      `status` becomes `cancelled` (PUT the whole service), the row disappears, and a refresh
      confirms it.
- [ ] An empty bookings view shows a message, not a blank page.

### SL-16 · Search, filter, sort
- [ ] On Browse, typing in the search box filters by title as you type (not case-sensitive).
- [ ] The category dropdown shows one category. The sort dropdown sorts by price low→high,
      price high→low, or title A–Z.
- [ ] Search + category + sort **work together**, and the counter matches the result.
- [ ] None of this calls the server. No results shows a message, not a blank grid.
- [ ] It only changes Browse. The other views stay the same.

**This is the mandatory part — a working app with routing and booking, ready for your
portfolio.** Stop here until every box above is checked. Everything below is optional.

---

# 🎁 Bonus — do these if you finish early

## Provider view

### SL-15 · Who booked me
- [ ] On my own service's detail page, I see its `confirmed` bookings: each client's name
      (from users), the date, the time, and a count — matching the mock.
- [ ] My services shows a summary from state — e.g. `3 services · 4 bookings total`.
- [ ] Adding a service, or any booking or cancel, updates these numbers in the same render.
      They are never stored, only calculated.

## Polish backlog

Any order. These have no acceptance criteria — **you write your own.**

- Stop double submits on *Publish service*, *Save changes* and *Create account*: disable the
  button while the request runs, then turn it back on after it finishes (success or error).
- Small toast messages (*Service published ✓*, *Booked ✓*) instead of nothing. (There is a
  toast area in `index.html`.)
- A provider page: click a provider's name to see only their services.
- Booking limit: a service can set a max number of bookings and show when it is full.
- Different empty messages per view, and a **Clear filters** button on Browse when filters
  give no results.
- A price or duration range filter on Browse.
- Split My bookings into **upcoming** and **past** by date.
- Stats on Browse: number of services, cheapest, most booked.

---

# 🏅 Extra bonus

Optional, harder challenges. Do them only after everything above is done.

### SL-14 · Check before you book
Two users might try to book the same time. A real booking app must handle this.
- [ ] Before booking, **load that service again from the server** and check it still exists and
      has no other `confirmed` booking for the same date **and** time. If the time was taken in
      the meantime, refuse with a message — no double bookings on the server.
- [ ] Fast double-clicks on **Book** create **only one** booking (check in mockapi).

### Photo preview in the offer form
- [ ] As you type or paste an image URL in the offer/edit form, show a small live preview.
- [ ] Keep the category-tile fallback for an empty or broken URL.
