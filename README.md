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

////// Summary of Sprint 1   //////
✅ Сите услуги се прикажани
✅ ProviderId е поврзан со вистинскиот корисник
✅ Сликите се прикажуваат
✅ Broken/empty image има fallback
✅ Confirmed bookings се бројат
✅ Counter покажува 8 services
✅ HTML strings се само во render.js
✅ render() само чита state

## Sprint 2 — Accounts

*After this sprint the app is for members only. A logged-out visitor sees the **landing page**
first (with Log in / Sign up). The app is hidden until someone logs in.*

### SL-4 · Register
- [ ] The Register form creates a user in mockapi. After it works, the user goes to the
      **login screen** — not straight into the app — and logs in from there.
- [ ] An email that already exists is refused, with a message under the form. No duplicate
      accounts.
- [ ] The register form clears after a successful register.

///   summary /////
✅ Landing → Sign up
✅ Login/Register tab switching
✅ Register form submit
✅ POST /users
✅ Duplicate email check
✅ Email споредба без разлика на големи букви
✅ Form reset по успешна регистрација
✅ После регистрација се отвора Login
✅ Корисникот не се најавува автоматски

### SL-5 · Log in
- [ ] Correct email + password (try `ana@test.com` / `ana123`) → the app, with the name in the
      top bar.
- [ ] A wrong email or password shows a message under the login form. You stay on the auth
      screen.
- [ ] **The gate:** when you open the site logged out, you see the **landing page**. The app is
      never visible until someone logs in.
- [ ] Logging in on a fresh browser shows a **full** app — the services are already on screen,
      not an empty grid.

// summary \\ 
✅ Login form submit
✅ Email и password проверка
✅ Email не зависи од големи/мали букви
✅ Погрешни податоци покажуваат error
✅ Точни податоци го поставуваат currentUser
✅ App екранот се отвора
✅ Името на корисникот се покажува
✅ Login формата се чисти

### SL-6 · Stay logged in, log out
- [ ] Refresh while logged in → still in the app, still logged in.
- [ ] The session is saved in localStorage and holds **only** id and name — never the password
      (check the Application tab).
- [ ] Log out → back to the **landing page**. Refresh → still logged out.
- [ ] **Log out clears everything.** Log in as Ana, log out, log in as Marko. Nothing from Ana
      is left: not the user, not the loaded data, not a half-finished edit, not the last route.
      Check with the second account.

// summary  \\\ 
✅ Login session се чува во localStorage
✅ Password не се чува во session
✅ Login преживува refresh
✅ Името и avatar-от се враќаат
✅ Logout ја брише session
✅ После logout refresh не го враќа корисникот

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

//// summary  \\\\
✅ Route се чува во state
✅ Browse navigation
✅ My Bookings navigation
✅ My Services navigation
✅ Само еден view е видлив
✅ После login се отвора Browse
✅ После logout route се ресетира

### SL-8 · The service detail page
- [ ] Clicking a service (its card, photo, or title) opens its **own page**: the detail view
      shows that service from `state` — photo, title, provider, `€` price, duration, category,
      description — matching the detail mock.
- [ ] A **Back** link returns to Browse.
- [ ] Someone else's service shows a booking box. Your own service shows Edit / Delete instead
      — never a booking box on your own service.

/// summary \\\
✅ Го најдовме HTML container-от за My Services     
✅ Направивме renderMyServices() во render.js
✅ Ги филтриравме услугите според:  service.providerId  и   state.currentUser.id
✅ Користевме String(...) за сигурна споредба на id вредностите
✅ Ако корисникот нема услуги, покажуваме порака
✅ Ако има услуги, повторно ја користиме:  createServiceCard(service)
✅ Ја повикавме renderMyServices() во главната render() функција
✅ Тестиравме со различни корисници
✅ My Services сега покажува само услуги од најавениот корисник

### SL-9 · Handle a missing service
- [ ] Opening a service that doesn't exist (for example one that was just deleted) shows a
      friendly *service not found* with a link back. No crash, no `undefined`.
- [ ] Reading `state.currentUser` or the current service never crashes — not for a bad id, not
      when logged out. (Check the value exists before you use it.)

//// summary \\\\\
✅ Routing до Details страницата
✅ Приказ на податоци за услугата
✅ Back копче
✅ Book this service копче
✅ Booking форма
✅ Валидација на полињата
✅ Проверка за минат датум
✅ Проверка дали корисникот е најавен
✅ Креирање booking object
✅ Ги задржуваме старите bookings
✅ Креираме ажурирана услуга
✅ Зачувување на сервер со PUT
✅ Ажурирање на state.services
✅ Success порака
✅ Чистење на формата
✅ Криење на формата
✅ Заштита од двојно кликање
✅ try...catch...finally за грешки
✅ Service not found за погрешен или избришан ID
✅ Безбедно читање на вредностите


## Sprint 4 — Offer a service

### SL-10 · Offer a service
- [ ] **Offer a service** opens the modal. Submitting creates a service in mockapi with **my**
      `providerId`, `price` and `duration` as **numbers**, and `bookings` as an empty array
      `[]`.
- [ ] The new service shows on Browse and My services with no manual refresh. The counter goes
      up by one. The modal closes and opens clean next time.

/// summary  \\\
✅ Ги земавме сите DOM елементи од Offer Service формата
✅ Направивме отворање на modal-от со Offer a Service копчињата
✅ Направивме затворање на modal-от со ✕ копчето
✅ Додадовме затворање на modal-от со клик на темната позадина
✅ Направивме submit listener за serviceForm
✅ Користевме event.preventDefault() за да спречиме refresh на страницата
✅ Ги прочитавме сите вредности од формата (title, price, duration, category, image, description)
✅ Ги претворивме price и duration во броеви со Number()
✅ Направивме validation за задолжителните полиња
✅ Прикажуваме error порака ако некоја проверка не помине
✅ Го креиравме newService object со сите потребни податоци
✅ Го поставивме providerId на најавениот корисник (state.currentUser.id)
✅ Додадовме празно bookings поле (bookings: [])
✅ Направивме createService() функција во api.js со POST request
✅ Ја export-иравме и import-иравме createService() функцијата
✅ Го зачувуваме новиот service со await createService(newService)
✅ По успешно зачувување повторно ги вчитуваме податоците со await loadData()
✅ Ја ресетираме формата со serviceForm.reset()
✅ Ја чистиме error пораката
✅ Го затвораме Offer Service modal-от
✅ Додадовме try...catch за правилно справување со серверски грешки
✅ Додадовме finally за повторно да се активира Publish Service копчето
✅ Го оневозможивме двојното кликнување (double submit)
✅ Тестиравме успешно додавање на нов service и негово веднаш прикажување на страницата

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

/// summary \\\
✅ Edit service
✔ Се прикажува Edit копче само на моите услуги.
✔ Со клик се отвора истиот modal.
✔ Полињата се пополнуваат со старите податоци.
✔ Насловот се менува во "Edit your service".
✔ Копчето се менува во "Save changes".
✔ Се повикува updateService().
✔ Се зачувуваат промените на MockAPI.
✔ По refresh промените остануваат.

✅ Delete service
✔ Се прикажува Delete копче само на моите услуги.
✔ Се појавува confirm().
✔ Cancel → не брише ништо.
✔ OK → повикува deleteService().
✔ Се брише од MockAPI.
✔ Се прави loadData().
✔ По refresh услугата повеќе не постои.

## Sprint 5 — Booking & browsing

### SL-12 · Book a service
- [ ] On someone else's detail page, pick a date and time and click **Book**. This adds a
      booking to that service's `bookings` array (an object with its own `id`, my `clientId`,
      the date, the time, `status: "confirmed"`), then PUTs the **whole** service and reloads.
- [ ] Empty date or time is refused with a message. Nothing is sent.
- [ ] After booking, the detail page and My bookings both show it — no manual refresh.
- [ ] You cannot book your own service (there is no booking box there).

/// summary \\\\
1. на туѓа услуга можеш да избереш датум и време;
2. со Confirm booking се додава нов booking;
3. booking-от се додава во bookings array;
4. се прави PUT на целата услуга;
5. после тоа повторно ги земаш услугите со getServices();
6. празен датум или време се одбива со порака;
7. минат датум и време се одбива;
8. booking-от се појавува во My bookings;
9. на сопствена услуга не се прикажува booking форма;
10. ( БОНУС )Back правилно враќа во Browse или My Services.

### SL-13 · My bookings, and cancel
- [ ] `#/bookings` shows every service where **I** am in the `bookings` array with
      `status: "confirmed"`: the title (links to the detail page), the date, the time, and the
      **provider's** name from users — matching the booking-row mock.
- [ ] A line above the list shows the count — e.g. `2 upcoming bookings`.
- [ ] **Cancel asks first.** If you say no, nothing happens. If you say yes, the booking's
      `status` becomes `cancelled` (PUT the whole service), the row disappears, and a refresh
      confirms it.
- [ ] An empty bookings view shows a message, not a blank page.

/// summary  \\\\
✅ #/bookings прикажува само confirmed bookings.
✅ Се прикажуваат title, date, time и provider.
✅ Насловот води до Service Details.
✅ Прикажан е бројач (1 upcoming booking, 2 upcoming bookings...).
✅ Cancel прво прашува со confirm().
✅ Ако се избере No → ништо не се менува.
✅ Ако се избере Yes → status станува "cancelled".
✅ Се прави PUT на целата услуга.
✅ Booking-от исчезнува веднаш.
✅ По refresh останува откажан.
✅ Ако нема bookings, се прикажува порака наместо празна страница.

### SL-16 · Search, filter, sort
- [ ] On Browse, typing in the search box filters by title as you type (not case-sensitive).
- [ ] The category dropdown shows one category. The sort dropdown sorts by price low→high,
      price high→low, or title A–Z.
- [ ] Search + category + sort **work together**, and the counter matches the result.
- [ ] None of this calls the server. No results shows a message, not a blank grid.
- [ ] It only changes Browse. The other views stay the same.

**This is the mandatory part — a working app with routing and booking, ready for your
portfolio.** Stop here until every box above is checked. Everything below is optional.

///  summary \\\
- Search by title
- Category filter
- Sort:
Price ↑
Price ↓
Title A–Z
- Clear Filters button (BONUS)
- Clear button created entirely with JavaScript
- Hidden until a filter is active
- Returns all services after clearing

---

# 🎁 Bonus — do these if you finish early

## Provider view

### SL-15 · Who booked me
- [ ] On my own service's detail page, I see its `confirmed` bookings: each client's name
      (from users), the date, the time, and a count — matching the mock.
- [ ] My services shows a summary from state — e.g. `3 services · 4 bookings total`.
- [ ] Adding a service, or any booking or cancel, updates these numbers in the same render.
      They are never stored, only calculated.

/// summary \\\
✅ 4. Owner ги гледа своите клиенти
- Во Service Details за сопствен сервис се прикажува:
      име на клиентот
      датум
      време
- сè земени од:
users
bookings
✅ 5. Booking counter
Се прикажува бројот на bookings.
4 bookings
✅ 6. My Services summary
3 services · 4 bookings total
✅ 7. Summary е динамички Не се зачувува никаде.
Секој render() повторно пресметува:
колку услуги има
колку bookings има
✅ 8. Summary автоматски се обновува
Се менува веднаш после:
додавање сервис
booking
cancel booking
без refresh.


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

///// summary \\\\
✅ 1. Проверка пред booking
- Пред да се резервира термин, апликацијата:
   повторно ја вчитува услугата од MockAPI
   проверува дали услугата сè уште постои
   проверува дали истиот датум и време се веќе резервирани
- Ако терминот е зафатен:
   booking не се прави
   се прикажува порака
✅ 2. Нема double booking
   Двајца корисници повеќе не можат да резервираат:
3. Double-click protection
  во MockAPI се снима само една резервација.




////   sesion changes     23,07,26   \\\\

✅ Направени подобрувања: 12
-Нови функционалности
-Toast систем
-Login toast
-Register toast
-Logout toast
-Booking toast
-Cancel booking toast

-Поправени багови
-Edit → Save не враќа на Browse
-Отстранет непотребен navigateTo("browse")
-Отстранет дупли render()

🎯 Резултат
✔ Нема browser alert() за успешни акции.
✔ Корисникот добива убави toast пораки.
✔ Навигацијата работи правилно.
✔ Кодот е почист и полесен за одржување.

🎨 UI редизајн
✅ My Bookings

Целосно го променивме изгледот на Booking картичките.
Додадовме:

✅ поголема и почиста картичка
✅ подобар распоред (layout)
✅ поголема слика
✅ подобро порамнет текст
✅ Booked date
✅ Booked time
✅ Provider
✅ Category
✅ Price
✅ Duration
✅ Service description
✅ Cancel Booking копче
✅ подобар spacing и Bootstrap стил

✅ My Services
Целосно го редизајниравме и My Services.
Додадовме:

✅ нов изглед на service cards
✅ поголема слика
✅ подобри badge-ови
✅ подобро порамнети информации
✅ Edit копче
✅ Delete копче
✅ Summary:   3 services · 4 bookings total
✅ Booking counter на секој сервис

✅ Service Details (Owner View)
Кога сопственикот ќе отвори свој сервис:

се прикажува:

✅ сите confirmed bookings
✅ име на клиент
✅ датум
✅ време
✅ вкупен број bookings


✅ Bug fixes
✅ останува на My Services после Save
✅ loadData() cleanup
✅ отстранет navigateTo("browse")
✅ отстранет дупли render()
✅ нема double booking
✅ нема double-click booking



////   sesion changes    24.07.2026  \\\\

1. Го подобривме router-от со hashchange
Додадовме window.addEventListener("hashchange", ...) во main.js, така што апликацијата сега автоматски реагира кога се менува URL hash (#/browse, #/service/5, #/bookings итн.). Ова овозможи навигацијата да работи како вистинска Single Page Application (SPA), без рачно менување на state.route.
2. Го поправивме отворањето на Service Details од Browse
Го откривме проблемот дека при клик на картичка URL-то се менувало, но апликацијата не ја отворала Details страницата. Со додавање на hashchange listener, сега секоја Browse картичка правилно ја отвора избраната услуга.
3. Овозможивме FULL услугите да можат да се отворат
Наместо disabled копче "Fully booked", поставивме линк кој ја отвора Details страницата. На тој начин корисникот повеќе не е блокиран и може да ги види сите информации за услугата иако таа е целосно резервирана.
4. Им овозможивме на корисниците да ги видат своите резервирани термини кај FULL услуги
Со отворањето на FULL услугите, корисникот сега може да ја види секцијата "Your booked appointments", каде што се прикажуваат неговите резервирани датуми и часови, иако услугата повеќе не прима нови резервации.
5. Го тестиравме новиот routing систем
Проверивме дека навигацијата функционира правилно при отворање на услуги од Browse, како и при отворање на FULL услуги. Потврдивме дека URL-то и прикажаната страница остануваат синхронизирани.
6. Го подобривме корисничкото искуство
Со овие промени, корисниците повеќе не добиваат впечаток дека FULL услугите се „заклучени“. Наместо тоа, можат да ги разгледаат деталите, да го проверат статусот на услугата и да ги видат сопствените резервации.
7. Финално тестирање
Го тестиравме целиот процес и потврдивме дека:
Browse картичките повторно се отвораат правилно.
FULL картичките се отвораат без проблем.
Корисникот може да ги види своите резервирани термини кај FULL услуги.
Router-от правилно реагира на промена на URL hash и ја прикажува соодветната страница.

Price Range Filter — Кратко резиме
1. Додадовме нови филтри во state.js
minPrice: "",
maxPrice: "",
2. Креиравме нов ред во Browse
Под првиот ред со:
Search
Category
Sort
додадовме втор ред со:
Min €
Max €
Clear filters
Редот е порамнет десно.
3. Ги поврзавме input полињата со state
Направивме input listeners.
Кога корисникот внесува цена:
се зачувува во state.filters
повторно се повикува renderBrowse()
се освежува листата на услуги.
4. Додадовме Price Filter во getVisibleServices()
По Category filter додадовме:
Minimum Price filter
Maximum Price filter
Филтерот ги задржува само услугите чија цена е:
поголема или еднаква на Min
помала или еднаква на Max
5. Го поправивме visibleServices
services  во visibleServices
6. Го поврзавме со Clear Filters
При клик на Clear filters:
се бришат minPrice и maxPrice од state
се празнат двете input полиња
повторно се прикажуваат сите услуги.
7. updateClearButton()
Го проширивме hasFilters да проверува и:
state.filters.minPrice
state.filters.maxPrice
Така редот со:
Min €
Max €
Clear filters
се појавува само кога има активен барем еден филтер.



////   sesion changes    25.07.2026  \\\\
работевме на routing и проверка на проектот.

✅ Што направивме
Разговаравме за архитектурата:
render.js → не треба да менува state и да прави fetch.
main.js → треба да ги поврзува event-ите (wires events).
Решивме да не го рефакторираме проектот бидејќи моментално работи стабилно.

Го најдовме и поправивме багот со Back копчето:
Од Browse → View & Book → Back сега правилно се враќа на Browse.
Од My Bookings → Details → Back се враќа на My Bookings.
Од My Services → Details → Back се враќа на My Services.
Поправката ја направивме во handleRoute(), каде што автоматски се зачувува previousView пред отворање на Details.

✅ Проектот моментално е стабилен и Back навигацијата работи како што треба.


///// sesion changes  26.07.26  \\\\\\\\

 Главна цел
Да ја подобриме архитектурата на проектот според README, така што:

render.js да биде задолжен само за прикажување (render).
main.js да ги обработува настаните (event listeners) и да го менува state.
api.js да ги извршува API повиците.

1. Cancel Booking
Го преместивме од render.js во main.js.
Преместено:
cancelBooking()
Cancel listener од My Bookings
Cancel listener од Service Details

Резултат:
render.js повеќе не прави updateService().
render.js повеќе не прави getServices().
main.js го ажурира state и повикува render().

2. Request Booking / Save Booking Changes
Целата booking submit логика ја преместивме од render.js во main.js.
Преместено:
читање на Date и Time
сите валидации
проверка дали услугата е полна
проверка за зафатен термин
додавање нов booking
измена на постоечки booking
updateService()
повторно вчитување со getServices()
state.services = newestServices
render()
toast пораки

3. Чистење на render.js
Отстранивме непотребни imports:
updateService
getServices
showToast
Со тоа render.js повеќе не зависи од API логиката.


✅ Тестирање
По секоја миграција успешно тестиравме:

✔ Request booking
✔ Edit booking
✔ Cancel booking
✔ Refresh после промените
✔ Toast пораки
✔ Console без грешки

Сè работи правилно.






📌 Што останува за следната сесија

Следниот пат ќе направиме целосна анализа на проектот според README.

План:

Да ги пронајдеме сите функции.
Да ги групираме по фајлови.
Да означиме кои се:
Rendering
Event listeners
API
Router
Auth
State management
Да провериме дали секоја функција се наоѓа во соодветниот фајл.
Да видиме дали останува уште нешто за подобрување.



Следно што би го направил

Има уште неколку мали polish работи, а најкорисна е:

⭐ Disable зафатените термини (Booked Slots)

Во моментов корисникот:

избира датум
избира време
притиска Book
дури тогаш добива: