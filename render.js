// render.js ќе ги чита податоците од state
// и ќе ги прикажува на страницата.


import { state } from "./state.js";

///////////////////////////////////  ELEMENT GRAB  ////////////////////////////////////////

// сите service cards.
const serviceListEl = document.getElementById("service-list");

// Целата Details страница. Ова го користиме само за show/hide.
const detailsViewEl =
  document.getElementById("view-detail");

  const detailContentEl =
  document.getElementById("detail-content");

// бројачот над картичките.
const countEl = document.getElementById("count");

// Елемент во кој ќе ги прикажуваме статистиките за Browse.
const browseStatsEl =
  document.getElementById("browse-stats");

// Главните страници во апликацијата.
const browseViewEl =  document.getElementById("view-browse");
const bookingsViewEl =  document.getElementById("view-bookings");
const servicesViewEl =  document.getElementById("view-services");

// Овде ќе ги прикажуваме услугитена најавениот корисник.
const myServicesListEl =  document.getElementById("services-list"); 

// Овде ќе ги прикажуваме резервациите на најавениот корисник.
const bookingsListEl = document.getElementById("bookings-list");

// Search полето во Browse.
const searchInput = document.getElementById("search");

// Category dropdown.
const categorySelect = document.getElementById("category-filter");

// Sort dropdown.
const sortSelect = document.getElementById("sort");


/// clear btn BONUS ////

// Создаваме Clear filters копче.
const clearFiltersBtn =
  document.createElement("button");

  // На почеток копчето е скриено.
clearFiltersBtn.hidden = true;

// Му поставуваме type.
clearFiltersBtn.type = "button";

// Го поставуваме текстот.
clearFiltersBtn.textContent =
  "Clear filters";

// Bootstrap стилови.
clearFiltersBtn.className =  "btn btn-outline-secondary btn-sm mt-2 w-100";

// Го наоѓаме постоечкиот Bootstrap row во кој се Search, Category и Sort.
const toolbarRow =  document.querySelector(
    ".browse-toolbar .row"
  );

// Создаваме нов ред.
const clearButtonRow =  document.createElement("div");

// Bootstrap row класи. mt-2 додава простор над новиот ред.
clearButtonRow.className =  "row mt-2";

// Создаваме нов ред под Search, Category и Sort.
const priceFilterRow =
  document.createElement("div");

// Сите елементи во редот ќе стојат десно и ќе бидат еден до друг.
priceFilterRow.className =
  "d-flex justify-content-end align-items-center gap-2 mt-2";

// Создаваме поле за минимална цена.
const minPriceInput =  document.createElement("input");

minPriceInput.type = "number";
minPriceInput.min = "0";
minPriceInput.placeholder = "Min €";
minPriceInput.className = "form-control form-control-sm";
minPriceInput.style.width = "100px";

// Ако веќе има внесена минимална цена, прикажи ја во полето.
minPriceInput.value = state.filters.minPrice;

// Создаваме поле за максимална цена.
const maxPriceInput =  document.createElement("input");

maxPriceInput.type = "number";
maxPriceInput.min = "0";
maxPriceInput.placeholder = "Max €";
maxPriceInput.className = "form-control form-control-sm";
maxPriceInput.style.width = "100px";

// Ако веќе има внесена максимална цена, прикажи ја во полето.
maxPriceInput.value = state.filters.maxPrice;

// Го менуваме стилот на Clear filters, за да не ја зема целата ширина.
clearFiltersBtn.className =
  "btn btn-outline-secondary btn-sm";

// Прво го ставаме Min полето.
priceFilterRow.appendChild(
  minPriceInput
);

// Потоа го ставаме Max полето.
priceFilterRow.appendChild(
  maxPriceInput
);

// На крај го ставаме Clear filters копчето.
priceFilterRow.appendChild(
  clearFiltersBtn
);

// Го додаваме новиот ред под Search, Category и Sort.
toolbarRow.insertAdjacentElement(
  "afterend",
  priceFilterRow
);

// Проверува дали има активен филтер.
function updateClearButton() {

  // Проверуваме дали има барем еден активен филтер.
  const hasFilters =
    state.filters.search !== "" ||
    state.filters.category !== "all" ||
    state.filters.sort !== "none" ||
      state.filters.minPrice !== "" ||
  state.filters.maxPrice !== "" ||
    state.filters.providerId !== null;

  // Ако има активен филтер, го покажуваме копчето.
  if (hasFilters) {
  minPriceInput.hidden = false;
  maxPriceInput.hidden = false;
    clearFiltersBtn.hidden = false;
  } else {
    // Ако нема активни филтри, го криеме копчето.
  minPriceInput.hidden = true;
  maxPriceInput.hidden = true;
  clearFiltersBtn.hidden = true;
  }
}

///////////////                            functions                               //////////////////


// наоѓа корисникот кој ја нуди услугата. Ги претвораме во String за сигурна споредба,
// затоа што README бара ids да ги споредуваме како strings.
function getProvider(providerId) {
  return state.users.find(function (user) {
    return String(user.id) === String(providerId);
  });
}

//  Bootstrap icon class
function getCategoryIcon(category) {
  if (category === "Beauty") {
    return "bi-scissors";
  }

  if (category === "Lessons") {
    return "bi-mortarboard";
  }

  if (category === "Photography") {
    return "bi-camera";
  }

  if (category === "Pets") {
    return "bi-heart-fill";
  }

  if (category === "Home") {
    return "bi-house-door";
  }

  if (category === "Fitness") {
    return "bi-activity";
  }

  if (category === "Repairs") {
    return "bi-tools";
  }

  return "bi-calendar-check";
}

/////   MY SERVICES //////

// Проверува дали услугата е од најавениот корисник.
function isMyService(service) {

  // Ако нема најавен корисник, услугата не може да биде наша.
  if (!state.currentUser) {
    return false;
  }

  // Го споредуваме providerId од услугата со id-то на најавениот корисник.
  return String(service.providerId) ===
    String(state.currentUser.id);
}


// бројач за confirmed bookings за една услуга.
function getConfirmedBookingsCount(service) {

  // Некои стари услуги можеби немаат bookings array. Затоа прво проверуваме дали bookings постои.
  const bookings = service.bookings || [];

  // Ги задржуваме само confirmed bookings.
const confirmedBookings =
  (service.bookings || []).filter(function (booking) {
    return booking.status === "confirmed";
  });

  // Го враќаме бројот.
  return confirmedBookings.length;
}


/////////// service card  HTML CARD /////////////   САМО ЗА ЕДНА КАРТИЧКА 


// Таа добива една услуга и враќа HTML string.
function createServiceCard(service) {

  // Го наоѓаме provider-от на услугата.
  const provider = getProvider(service.providerId);


  // Го земаме името на provider-от.
  // Ако provider не е најден, користиме празен string за да не се скрши апликацијата.
  const providerName = provider ? provider.name : "";

  // Ги земаме само confirmed резервациите што припаѓаат на услугата што моментално ја гледаме.
  // Ја земаме првата буква од името.
  // Ana → A
  // Marko → M

  const providerInitial = providerName
    ? providerName.charAt(0).toUpperCase()
    : "?";


  // Ја земаме иконата за категоријата.
  const categoryIcon = getCategoryIcon(service.category);

  // Го броиме бројот на confirmed bookings.
  const bookedCount = getConfirmedBookingsCount(service);

  // Го земаме максималниот број bookings што provider-от го поставил за услугата.
// Ако ова е стара услуга која нема maxBookings, користиме 0.
const maxBookings =
  Number(service.maxBookings || 0);

// Проверуваме дали услугата е полна.//
// Услугата е полна само ако:
// 1. има поставен лимит поголем од 0
// 2. bookedCount го достигнал лимитот
const isFull =
  maxBookings > 0 &&
  bookedCount >= maxBookings;

  // Ако услугата има слика, создаваме img element.
  // onerror="this.remove()" значи:
  // ако сликата е расипана, browser-от ја отстранува.
  // Под неа останува category fallback tile.

  const imageHTML = service.image
    ? `
      <img
        src="${service.image}"
        alt="${service.title}"
        onerror="this.remove()"
      >
    `
    : "";


  // Ако има барем една confirmed booking,
  // ја покажуваме booked информацијата.
  // Ако нема bookings, враќаме празен string.

// Ако услугата е полна,
// прикажуваме црвен FULL badge.
const fullHTML = isFull
  ? `
      <span class="badge bg-danger">
        FULL
      </span>
    `
  : "";

  // Го прикажуваме бројот на резервирани места и максималниот booking limit.
const bookedHTML =
  maxBookings > 0
    ? `
      <span class="meta">
        <i class="bi bi-people"></i>
        ${bookedCount} / ${maxBookings} booked
      </span>
    `
    : "";
    

   // Проверуваме дали услугата е од најавениот корисник.
const ownerButtonsHTML = isMyService(service)
  ? `
    <div class="d-flex gap-2 mt-2">
      <button
        class="btn btn-outline-secondary btn-sm edit-service-btn"
        data-id="${service.id}"
      >
        Edit
      </button>

      <button
        class="btn btn-outline-danger btn-sm delete-service-btn"
        data-id="${service.id}"
      >
        Delete
      </button>
    </div>
  `
  : "";

  // Го враќаме целиот HTML за една картичка.

  return `
    <div class="col">
      <article
        class="card service-card h-100"
        data-id="${service.id}"
      >
        <a
          class="poster"
          data-category="${service.category}"
          href="#/service/${service.id}"
        >
          <span class="poster-fallback">
            <i class="bi ${categoryIcon}"></i>
          </span>

          ${imageHTML}

          <span class="cat-badge">
            ${service.category}
          </span>
          ${fullHTML}
        </a>

        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-start gap-2">
            <h3 class="card-title h6 mb-0">
              ${service.title}
            </h3>

            <span class="price">
              €${service.price}
            </span>
          </div>

          <p class="seller">
         <span class="avatar">
        ${providerInitial}
       </span>

<a
  href="#"
  class="provider-link"
  data-provider-id="${service.providerId}"
>
  ${providerName}
</a>

</p>

          <div class="meta-row">
            <span class="meta">
              <i class="bi bi-clock"></i>
              ${service.duration} min
            </span>

            ${bookedHTML}
          </div>

${isFull
  ? `
      <a
        class="btn btn-secondary btn-sm mt-auto"
        href="#/service/${service.id}"
      >
        View details · Fully booked
      </a>
    `
  : `
       <a
        class="btn btn-primary btn-sm mt-auto"
        href="#/service/${service.id}"
      >
        ${isMyService(service) ? "Manage" : "View &amp; book"}
      </a>
    `
}
          ${ownerButtonsHTML}
        </div>
      </article>
    </div>
  `;
}

////       FILTERI        /////

// Ги зема услугите што треба да се прикажат во Browse.
function getVisibleServices() {

  // Правиме копија од state.services. Така не ја менуваме оригиналната листа.
  let visibleServices = [
    ...state.services,
  ];

  const searchText = state.filters.search
    .trim()
    .toLowerCase();

// SEARCH FILTER
  // Ако има внесен search текст, ги задржуваме само услугите чиј title го содржи тој текст.
  if (searchText !== "") {
    visibleServices =
      visibleServices.filter(function (service) {

        return service.title
          .toLowerCase()
          .includes(searchText);
      });
  }

// CATEGORY FILTER
  // Ако е избрана category, ги задржуваме само услугите
  // од таа category. Ако НЕ е избрано "All categories", филтрираме по категорија.
if (state.filters.category !== "all") {

  visibleServices =
    visibleServices.filter(function (service) {

      return service.category ===
        state.filters.category;
    });
}

////// PRICE RANGE FILTER //////

// Ако корисникот внел минимална цена.
if (state.filters.minPrice !== "") {

  visibleServices =
    visibleServices.filter(function (service) {

      return Number(service.price) >=
        Number(state.filters.minPrice);

    });

}


// Ако корисникот внел максимална цена.
if (state.filters.maxPrice !== "") {

  visibleServices =
    visibleServices.filter(function (service) {

      return Number(service.price) <=
        Number(state.filters.maxPrice);

    });

}

// PROVIDER FILTER — НОВО
// Ако е кликнат provider, ги задржуваме само неговите услуги.
if (state.filters.providerId !== null) {
  visibleServices =  visibleServices.filter(function (service) {
      return String(service.providerId) ===
        String(state.filters.providerId);
    });
}

// SORT
// Цена: од најниска кон највисока.
if (state.filters.sort === "price-asc") {

  visibleServices.sort(function (a, b) {
    return Number(a.price) - Number(b.price);
  });
}


// Цена: од највисока кон најниска.
if (state.filters.sort === "price-desc") {

  visibleServices.sort(function (a, b) {
    return Number(b.price) - Number(a.price);
  });
}


// Наслов: A → Z.
if (state.filters.sort === "title") {

  visibleServices.sort(function (a, b) {
    return a.title.localeCompare(b.title);
  });
}


  // Ја враќаме готовата листа.
  return visibleServices;
}

////// BROWSE STATS //////

// Оваа функција ги пресметува и прикажува:
// 1. најевтината услуга
// 2. најрезервираната услуга
function renderBrowseStats(visibleServices) {

  // Ако нема видливи услуги,
  // нема што да пресметуваме.
  if (visibleServices.length === 0) {

    browseStatsEl.textContent =
      "Cheapest: — · Most booked: —";

    return;
  }


  ////// CHEAPEST SERVICE //////

  // Претпоставуваме дека првата услуга е најевтината.
  let cheapestService = visibleServices[0];

  // Ги проверуваме сите видливи услуги.
  visibleServices.forEach(function (service) {

    // Ако моменталната услуга е поевтина,
    // таа станува новата најевтина услуга.
    if (
      Number(service.price) <
      Number(cheapestService.price)
    ) {
      cheapestService = service;
    }

  });


  ////// MOST BOOKED SERVICE //////

  // Засега првата услуга ја поставуваме како најрезервирана.
  let mostBookedService = visibleServices[0];

  // Нејзиниот број на резервации.
  let mostBookingsCount = 0;


  // Ја проверуваме секоја видлива услуга.
  visibleServices.forEach(function (service) {

// Ги земаме резервациите што се наоѓаат во оваа услуга.
const serviceBookings =
  (service.bookings || []).filter(function (booking) {

    // Броиме само потврдени резервации.
    return booking.status === "confirmed";

  });


    // Број на активни резервации за оваа услуга.
    const bookingsCount =
      serviceBookings.length;


    // Ако има повеќе резервации од досегашниот најголем број...
    if (bookingsCount > mostBookingsCount) {

      mostBookingsCount = bookingsCount;
      mostBookedService = service;

    }

  });


  ////// SHOW STATS //////

  // Ако нема ниту една резервација.
if (mostBookingsCount === 0) {

  browseStatsEl.textContent =
    "Cheapest €" +
    Number(cheapestService.price).toFixed(0) +
    " · Most booked: —";

  return;
}

// Ги прикажуваме статистиките.
browseStatsEl.textContent =
  "Cheapest €" +
  Number(cheapestService.price).toFixed(0) +
  " · Most booked " +
  mostBookedService.title +
  " (" +
  mostBookingsCount +
  " bookings)";
}

////////////  ЗА СИТЕ КАРТИЧКИ ////////////

// Оваа функција го прикажува Browse catalog-от.
// 1. ги чита услугите од state
// 2. создава една картичка за секоја услуга
// 3. ги става картичките во #service-list
// 4. го ажурира бројачот

function renderBrowse() {
  // За секоја услуга ја повикуваме createServiceCard(service).


// Ги земаме услугите после search, category и sort.
const visibleServices =
  getVisibleServices();


// Од секоја видлива услуга правиме HTML картичка.
const cardsHTML = visibleServices
  .map(function (service) {

    // createServiceCard() враќа HTML за една картичка.
    return createServiceCard(service);
  })
  .join("");


  // Ги прикажуваме сите картички.
// Ако нема резултати после search и category filter...
if (visibleServices.length === 0) {

  // Покажуваме порака наместо празна страница.
  serviceListEl.innerHTML = `
    <div class="col-12">
      <p class="text-muted text-center py-4">
        No services found.
      </p>
    </div>
  `;

} else {

  // Ако има резултати, ги прикажуваме картичките.
  serviceListEl.innerHTML = cardsHTML;
}


  // Го земаме бројот на услуги.
const serviceCount =
  visibleServices.length;


  // Ако има само една услуга: Бројач
if (serviceCount === 1) {
  countEl.textContent = "1 service";
} else {
  countEl.textContent = serviceCount + " services";
}

// Ги прикажуваме статистиките за моментално видливите услуги.
renderBrowseStats(
  visibleServices
);

// Проверуваме дали треба да се покаже или сокрие Clear filters копчето.
updateClearButton();
}

//////////      HIDE ALL VIEWS     /////////////

// Ги крие сите странициvvво главната апликација.
function hideAllViews() {
  browseViewEl.classList.add("d-none");
  bookingsViewEl.classList.add("d-none");
  servicesViewEl.classList.add("d-none");
  detailsViewEl.classList.add("d-none");}

  // Проверува што пишува во state.route и ја покажува точната страница.
function renderRoute() {

  // Прво ги криеме сите views.
  hideAllViews();

  // Ако route е "bookings",ја покажуваме My Bookings страницата.
  if (state.route.view === "bookings") {
    bookingsViewEl.classList.remove("d-none");

    return;
  }

  // Ако route е "services", ја покажуваме My Services страницата.
  if (state.route.view === "services") {
    servicesViewEl.classList.remove("d-none");

    return;
  }

  // Ако route е "details", ја покажуваме Service Details страницата.
  if (state.route.view === "details") {
    detailsViewEl.classList.remove("d-none");

    return;
  }

  // Ако ништо од горните услови не е точно, по default ја покажуваме Browse страницата.
  browseViewEl.classList.remove("d-none");
}

////////    MY SERVICES    /////////

// Ги прикажува само услугите што ги создал најавениот корисник.
function renderMyServices() {

  // Ако нема најавен корисник, нема што да прикажуваме.
  if (!state.currentUser) {
    myServicesListEl.innerHTML = "";
    return;
  }


  // Ги земаме само услугите каде providerId е ист со id-то на најавениот корисник.
  const myServices = state.services.filter(
    function (service) {

      return (
        String(service.providerId) ===
        String(state.currentUser.id)
      );
    }
  );


  // Го броиме вкупниот број на confirmed bookings од сите наши услуги.
  let totalBookings = 0;


  // Поминуваме низ сите наши услуги.
  myServices.forEach(function (service) {

    // За секоја услуга го земаме бројот на confirmed bookings.
    const bookingCount =
      getConfirmedBookingsCount(service);

    // Го додаваме бројот во вкупниот бројач.
    totalBookings =
      totalBookings + bookingCount;
  });


  // Го правиме текстот за бројот на услуги.
  let servicesText = "";

  if (myServices.length === 1) {
    servicesText = "1 service";
  } else {
    servicesText =
      myServices.length + " services";
  }


  // Го правиме текстот за вкупниот број bookings.
  let bookingsText = "";

  if (totalBookings === 1) {
    bookingsText = "1 booking total";
  } else {
    bookingsText =
      totalBookings + " bookings total";
  }


  // Ако корисникот нема услуги, покажуваме empty message.
  if (myServices.length === 0) {

    myServicesListEl.innerHTML = `
      <p class="text-muted mb-3">
        ${servicesText}
        ·
        ${bookingsText}
      </p>

      <div class="empty-state">

        <div class="empty-ico">
          <i class="bi bi-calendar-plus"></i>
        </div>

        <p class="mb-0">
          You have not created any services yet.
        </p>

      </div>
    `;

    return;
  }


  // Од секоја наша услуга правиме еден хоризонтален ред.
  const servicesHTML = myServices
    .map(function (service) {

      // Ја земаме иконата според категоријата.
      const categoryIcon =
        getCategoryIcon(service.category);


      // Го земаме бројот на confirmed bookings за оваа услуга.
      const bookedCount =
        getConfirmedBookingsCount(service);

      // Ако услугата има слика, ја прикажуваме.
      // Ако сликата не работи, browser-от ќе ја отстрани и ќе остане fallback иконата.
      const imageHTML = service.image
        ? `
          <img
            src="${service.image}"
            alt="${service.title}"
            onerror="this.remove()"
          >
        `
        : "";


      // Го правиме текстот за bookings badge.
      let bookingBadgeText = "";

      if (bookedCount === 1) {
        bookingBadgeText = "1 booking";
      } else {
        bookingBadgeText =
          bookedCount + " bookings";
      }


      // Враќаме HTML за една service-row картичка.
      return `
        <article
          class="card service-row mb-3"
          data-id="${service.id}"
        >

          <div
            class="card-body
                   d-flex
                   align-items-center"
          >

            <!-- ЛЕВО: СЛИКА ИЛИ ИКОНА -->
            <a
              class="row-thumb poster"
              data-category="${service.category}"
              href="#/service/${service.id}"
            >

              <span class="poster-fallback">
                <i class="bi ${categoryIcon}"></i>
              </span>

              ${imageHTML}

            </a>


            <!-- СРЕДИНА: НАСЛОВ И ДЕТАЛИ -->
            <div class="flex-grow-1">

              <h3>

                <a href="#/service/${service.id}">
                  ${service.title}
                </a>

              </h3>


              <p class="row-meta">

                €${service.price}

                ·

                ${service.duration} min

                ·

                ${service.category}

              </p>

            </div>


            <!-- БРОЈ НА BOOKINGS -->
            <span class="status-pill count">
              ${bookingBadgeText}
            </span>


            <!-- EDIT КОПЧЕ -->
            <button
              class="btn
                     btn-outline-secondary
                     btn-sm
                     edit-service-btn"
              type="button"
              data-id="${service.id}"
            >
              <i class="bi bi-pencil"></i>
              Edit
            </button>


            <!-- DELETE КОПЧЕ -->
            <button
              class="btn
                     btn-outline-danger
                     btn-sm
                     delete-service-btn"
              type="button"
              data-id="${service.id}"
            >
              <i class="bi bi-trash"></i>
              Delete
            </button>

          </div>

        </article>
      `;
    })
    .join("");


  // Го прикажуваме бројачот и сите наши услуги.
  myServicesListEl.innerHTML = `
    <p class="text-muted mb-3">

      ${servicesText}

      ·

      ${bookingsText}

    </p>

    ${servicesHTML}
  `;
}



////////// MY BOOKINGS //////////

// Го претвора датумот:
// "2026-08-19"
// во:
// "19 Aug"
function formatBookingDate(dateString) {

  // Создаваме Date object./
  // Додаваме T00:00:00 за browser-от правилно да го прочита датумот.
  const date = new Date(
    dateString + "T00:00:00"
  );


  // Го враќаме датумот во краток и убав формат.
  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
    }
  );
}


// Ги прикажува сите confirmed bookings направени од најавениот корисник.
function renderMyBookings() {

  // Ако нема најавен корисник, ја празниме страницата.
  if (!state.currentUser) {
    bookingsListEl.innerHTML = "";
    return;
  }


  // Во овие две листи ќе ги поделиме сите confirmed bookings.
const upcomingBookings = [];
const pastBookings = [];


  // Поминуваме низ сите услуги.
  state.services.forEach(function (service) {

    // Ако услугата нема bookings, користиме празна листа.
    const bookings = service.bookings || [];


    // Поминуваме низ сите bookings од оваа услуга.
    bookings.forEach(function (booking) {

      // Проверуваме:
      // 1. booking-от е од најавениот корисник
      // 2. status е confirmed
      if (
        String(booking.clientId) ===
          String(state.currentUser.id) &&
        booking.status === "confirmed"
      ) {

     // Денешниот датум.
const today = new Date();

// Го споредуваме само датумот, без часовите.
today.setHours(0, 0, 0, 0);

// Датумот од booking-от.
const bookingDate =
  new Date(booking.date + "T00:00:00");

// Објектот што ќе го чуваме.
const bookingItem = {
  booking: booking,
  service: service,
};


// Ако датумот е денес или во иднина...
if (bookingDate >= today) {

  upcomingBookings.push(
    bookingItem
  );

} else {

  // Ако датумот е поминат...
  pastBookings.push(
    bookingItem
  );

}
      }
    });
  });


// Ако нема ниту upcoming, ниту past bookings.
if (
  upcomingBookings.length === 0 &&
  pastBookings.length === 0
) {

  bookingsListEl.innerHTML = `
    <p class="text-muted">
      You have no bookings yet.
    </p>
  `;

  return;
}

// Текст за бројот на upcoming bookings.
let upcomingCountText = "";

if (upcomingBookings.length === 1) {
  upcomingCountText = "1 upcoming booking";
} else {
  upcomingCountText =
    upcomingBookings.length +
    " upcoming bookings";
}


// Текст за бројот на past bookings.
let pastCountText = "";

if (pastBookings.length === 1) {
  pastCountText = "1 past booking";
} else {
  pastCountText =
    pastBookings.length +
    " past bookings";
}


 // Од секоја резервација правиме еден хоризонтален ред.
const upcomingHTML = upcomingBookings
  .map(function (item) {

    // Ја земаме резервацијата.
    const booking = item.booking;

    // Ја земаме услугата.
    const service = item.service;


    // Го наоѓаме provider-от/ кој ја создал услугата.
    const provider = getProvider(
      service.providerId
    );


    // Ако provider постои, го земаме неговото име.
    const providerName = provider
      ? provider.name
      : "Unknown provider";


    // Ја земаме иконата според категоријата.
    const categoryIcon =
      getCategoryIcon(service.category);


    // Ако услугата има слика, ја прикажуваме сликата.
    // Ако сликата не работи, browser-от ќе ја отстрани и ќе остане иконата под неа.
    const imageHTML = service.image
      ? `
        <img
          src="${service.image}"
          alt="${service.title}"
          onerror="this.remove()"
        >
      `
      : "";


    // Враќаме HTML за една booking картичка.
    return `
      <article class="card booking-row mb-3">

        <div
          class="card-body
                 d-flex
                 align-items-center"
        >

          <!-- ЛЕВО: СЛИКА ИЛИ ИКОНА -->
          <div
            class="row-thumb poster"
            data-category="${service.category}"
          >

            <span class="poster-fallback">
              <i class="bi ${categoryIcon}"></i>
            </span>

            ${imageHTML}

          </div>


          <!-- СРЕДИНА: НАСЛОВ И ДЕТАЛИ -->
          <div class="flex-grow-1">

            <h3>

              <a href="#/service/${service.id}">
                ${service.title}
              </a>

            </h3>


            <p class="row-meta">

              <i class="bi bi-calendar"></i>

              ${booking.date}

              ·

              ${booking.time}

              ·

              with ${providerName}

            </p>

          </div>


          <!-- ДЕСНО: CONFIRMED -->
          <span class="status-pill confirmed">

            <i class="bi bi-check-circle-fill"></i>

            Confirmed

          </span>


          <!-- CANCEL КОПЧЕ -->
          <button
            class="btn
                   btn-outline-danger
                   btn-sm
                   cancel-booking-btn"
            type="button"
            data-service-id="${service.id}"
            data-booking-id="${booking.id}"
          >
            Cancel
          </button>

        </div>

      </article>
    `;
  })
  .join("");

  // Од секоја past резервација правиме HTML картичка.
const pastHTML = pastBookings
  .map(function (item) {

    // Ја земаме резервацијата.
    const booking = item.booking;

    // Ја земаме услугата.
    const service = item.service;


    // Го наоѓаме provider-от.
    const provider = getProvider(
      service.providerId
    );


    // Го земаме името на provider-от.
    const providerName = provider
      ? provider.name
      : "Unknown provider";


    // Ја земаме category иконата.
    const categoryIcon =
      getCategoryIcon(service.category);


    // Ако услугата има слика, ја прикажуваме.
    const imageHTML = service.image
      ? `
        <img
          src="${service.image}"
          alt="${service.title}"
          onerror="this.remove()"
        >
      `
      : "";


    // Враќаме HTML за една past booking картичка.
    return `
      <article class="card booking-row mb-3">

        <div
          class="card-body
                 d-flex
                 align-items-center"
        >

          <div
            class="row-thumb poster"
            data-category="${service.category}"
          >

            <span class="poster-fallback">
              <i class="bi ${categoryIcon}"></i>
            </span>

            ${imageHTML}

          </div>


          <div class="flex-grow-1">

            <h3>
              <a href="#/service/${service.id}">
                ${service.title}
              </a>
            </h3>


            <p class="row-meta">

              <i class="bi bi-calendar"></i>

              ${booking.date}

              ·

              ${booking.time}

              ·

              with ${providerName}

            </p>

          </div>


          <span class="status-pill">
            Past
          </span>

        </div>

      </article>
    `;

  })
  .join("");


  // Го прикажуваме бројачот и сите booking редови.
 bookingsListEl.innerHTML = `

  <!-- UPCOMING BOOKINGS -->
  <h4 class="mb-3">
    ${upcomingCountText}
  </h4>

  ${
    upcomingBookings.length === 0
      ? `
        <p class="text-muted mb-4">
          No upcoming bookings.
        </p>
      `
      : upcomingHTML
  }


  <!-- PAST BOOKINGS -->
  <h4 class="mt-5 mb-3">
    ${pastCountText}
  </h4>

  ${
    pastBookings.length === 0
      ? `
        <p class="text-muted">
          No past bookings.
        </p>
      `
      : pastHTML
  }

`;
}

/////////       RENDER SERVICE DETAILS     //////////

// Ја прикажува избраната услуга во Service Details страницата.

function renderServiceDetails() {


  // Оваа функција треба да работи само кога сме на details страницата.

  if (state.route.view !== "details") {
    return;
  }

  // Го земаме id-то на услугата на која корисникот кликнал.

  const serviceId = state.route.serviceId;

  // Ја бараме услугата со истото id во листата state.services.
  const service = state.services.find(function (service) {
    return String(service.id) === String(serviceId);
  });

  // Проверуваме дали услугата навистина постои.
// find() враќа undefined ако не најде услуга со тој id.
// Ако услугата не постои,покажуваме порака во detail-content.
if (!service) {
  detailContentEl.innerHTML = `
    <div class="container py-5">

      <h2>Service not found</h2>

      <p class="text-muted">
        This service does not exist
        or may have been deleted.
      </p>

      <button
        id="backToServicesBtn"
        class="btn btn-primary"
        type="button"
      >
        Back to services
      </button>

    </div>
  `;

  backToServicesBtn.addEventListener(
    "click",
    function () {

      state.route.view =
        state.route.previousView || "browse";

      state.route.serviceId = null;

      render();
    }
  );

  return;
}


  // Го наоѓаме корисникот што ја нуди услугата.
const provider = getProvider(service.providerId);


// Ако provider постои, го земаме неговото име. Ако не постои, покажуваме "Unknown provider".

const providerName = provider
  ? provider.name
  : "Unknown provider";


const confirmedBookings =
  (service.bookings || []).filter(function (booking) {
    return booking.status === "confirmed";
  });


// Додади го ОВДЕ
const myBookings =
  confirmedBookings.filter(function (booking) {

    return (
      state.currentUser &&
      String(booking.clientId) ===
      String(state.currentUser.id)
    );

  });


// Потоа останува ова
const maxBookings =
  Number(service.maxBookings || 0);

// Проверуваме дали услугата е полна.
const isFull =
  maxBookings > 0 &&
  confirmedBookings.length >= maxBookings;

  // HTML што го прикажува booking бројачот. Ќе го користиме и кај owner и кај client.
const bookingsCounterHTML =
  maxBookings > 0
    ? `
      <div class="text-muted mb-3">

        <i class="bi bi-people"></i>

        ${confirmedBookings.length}
        /
        ${maxBookings}
        booked

      </div>
    `
    : "";

    // HTML што ги прикажува моите резервации за оваа услуга.
// HTML за booking-ите што ги направил најавениот корисник за оваа услуга.
const myBookingsHTML =
  myBookings.length === 0
    ? `
      <p class="text-muted small mt-3 mb-0">
        You don't have any bookings yet.
      </p>
    `
    : `
      <div class="mt-3">

        <h6>
          Your booked appointments
        </h6>

        ${myBookings
          .map(function (booking) {

            return `
              <div
  class="border rounded p-3 mb-2
         d-flex
         justify-content-between
         align-items-center
          flex-wrap
         gap-3"
>

  <!-- ЛЕВО: датум и време -->
  <div>

    <i class="bi bi-calendar-check"></i>

    <strong>
      ${booking.date}
    </strong>

    ·

    <strong>
      ${booking.time}
    </strong>

  </div>


  <!-- ДЕСНО: Edit и Cancel -->
  <div class="d-flex gap-2">

    <button
      class="btn btn-outline-secondary btn-sm edit-detail-booking-btn"
      type="button"
      data-booking-id="${booking.id}"
      data-service-id="${service.id}"
    >
      <i class="bi bi-pencil"></i>
      Edit
    </button>


    <button
      class="btn btn-outline-danger btn-sm cancel-detail-booking-btn"
      type="button"
      data-booking-id="${booking.id}"
      data-service-id="${service.id}"
    >
      <i class="bi bi-x-circle"></i>
      Cancel
    </button>

  </div>

</div>
            `;

          })
          .join("")}

      </div>
    `;

// Правиме HTML само ако услугата е наша. Ако услугата не е наша, враќаме празен string.

const confirmedBookingsHTML =
  isMyService(service)
    ? `
      <div class="mt-5">

        <h4>
          Confirmed bookings
          (${confirmedBookings.length})
        </h4>

        ${
          confirmedBookings.length === 0
            ? `
              <p class="text-muted">
                No confirmed bookings yet.
              </p>
            `
            : confirmedBookings
                .map(function (booking) {

                  // Го бараме клиентот преку clientId.
                  const client =
                    state.users.find(function (user) {

                      return (
                        String(user.id) ===
                        String(booking.clientId)
                      );
                    });

                  // Ако клиентот постои, го земаме неговото име.
                  const clientName = client
                    ? client.name
                    : "Unknown client";

                  // Враќаме HTML за една резервација.
                  return `
                    <div class="border rounded p-3 mt-3">

                      <p class="mb-1">
                        <strong>Client:</strong>
                        ${clientName}
                      </p>

                      <p class="mb-1">
                        <strong>Date:</strong>
                        ${booking.date}
                      </p>

                      <p class="mb-0">
                        <strong>Time:</strong>
                        ${booking.time}
                      </p>

                    </div>
                  `;
                })
                .join("")
        }

      </div>
    `
    : "";


// Ја земаме првата буква
// од името на provider-от.
// Ana → A
// Sime → S
const providerInitial = providerName
  ? providerName.charAt(0).toUpperCase()
  : "?";


// Ја земаме иконата според категоријата.
const categoryIcon =
  getCategoryIcon(service.category);


// Ако услугата има image URL,
// ја прикажуваме сликата.
// Ако нема слика, останува fallback иконата.
const detailImageHTML = service.image
  ? `
    <img
      src="${service.image}"
      alt="${service.title}"
      onerror="this.remove()"
    >
  `
  : "";


// Ја прикажуваме целата Details страница.
// Левата страна секогаш е иста.
// Десната страна:
// - booking форма за туѓ сервис
// - owner panel за свој сервис
detailContentEl.innerHTML = `
  <div
    class="detail-panel"
    data-id="${service.id}"
  >

    <div class="detail-grid">

      <!-- ЛЕВА СТРАНА -->
      <div class="detail-main">

        <div
          class="detail-poster"
          data-category="${service.category}"
        >

          <span class="poster-fallback">
            <i class="bi ${categoryIcon}"></i>
          </span>

          ${detailImageHTML}

        </div>


        <div class="detail-body">

          <span class="cat-chip">
            ${service.category}
          </span>


          <h2>
            ${service.title}
          </h2>


          <p class="seller">

            <span class="avatar avatar-lg">
              ${providerInitial}
            </span>

            by

            <strong>
              ${providerName}
            </strong>

          </p>


          <div class="detail-chips">

            <span class="time-badge">

              <i class="bi bi-clock"></i>

              ${service.duration} min

            </span>

          </div>


          <p class="detail-section-label">
            About this service
          </p>


          <p class="lead-desc">
            ${service.description || "No description provided."}
          </p>

        </div>

      </div>


      <!-- ДЕСНА страна -->
      <aside class="detail-aside">

        ${
          isMyService(service)
            ? `
              <div class="owner-panel">

                <div class="book-price">

                  <span class="price price-lg">
                    €${service.price}
                  </span>

                  <span class="per">
                    / session
                  </span>

                </div>
               
${bookingsCounterHTML}
                <div class="owner-actions">

                  <button
                    class="btn btn-outline-secondary btn-sm edit-service-btn"
                    type="button"
                    data-id="${service.id}"
                  >
                    <i class="bi bi-pencil"></i>
                    Edit
                  </button>


                  <button
                    class="btn btn-outline-danger btn-sm delete-service-btn"
                    type="button"
                    data-id="${service.id}"
                  >
                    <i class="bi bi-trash"></i>
                    Delete
                  </button>

                </div>


                <h3>
                  Bookings (${confirmedBookings.length})
                </h3>


                ${
                  confirmedBookings.length === 0
                    ? `
                      <p class="text-muted mb-0">
                        No bookings yet.
                      </p>
                    `
                    : `
                      <ul class="booking-list">

                        ${confirmedBookings
                          .map(function (booking) {

                            const client =
                              state.users.find(function (user) {
                                return (
                                  String(user.id) ===
                                  String(booking.clientId)
                                );
                              });


                            const clientName = client
                              ? client.name
                              : "Unknown client";


                            const clientInitial = clientName
                              ? clientName
                                  .charAt(0)
                                  .toUpperCase()
                              : "?";


                            return `
                              <li>

                                <span class="avatar">
                                  ${clientInitial}
                                </span>

                                <strong>
                                  ${clientName}
                                </strong>

                                <span class="when">
                                  ${booking.date}
                                  ·
                                  ${booking.time}
                                </span>

                              </li>
                            `;
                          })
                          .join("")}

                      </ul>
                    `
                }

              </div>
            `
         : isFull
  ? `
      <div class="book-box text-center">

        <div class="book-price">

          <span class="price price-lg">
            €${service.price}
          </span>

          <span class="per">
            / session
          </span>

        </div>
      

        <span class="badge bg-danger mb-3">
          FULL
        </span>

         <h3>
          ${confirmedBookings.length}/${maxBookings}
          fully booked
        </h3>

        <p class="text-muted mb-0">
          This service has reached its booking limit.
        </p>

         ${myBookingsHTML}

      </div>
    `
  : `
      <div class="book-box">

                <div class="book-price">

                  <span class="price price-lg">
                    €${service.price}
                  </span>

                  <span class="per">
                    / session
                  </span>

                </div>

                  ${bookingsCounterHTML}

                <h3>
                  Book this service
                </h3>


                <label
                  class="form-label"
                  for="bookingDate"
                >
                  Date
                </label>


                <input
                  id="bookingDate"
                  class="form-control mb-2"
                  type="date"
                >


                <label
                  class="form-label"
                  for="bookingTime"
                >
                  Time
                </label>


                <input
                  id="bookingTime"
                  class="form-control"
                  type="time"
                >


                <button
                  id="confirmBookingBtn"
                  class="btn btn-primary"
                  type="button"
                >
                  Request booking
                </button>


                <p
                  id="bookingMessage"
                  class="text-danger small mt-2 mb-0"
                ></p>


                <p class="book-note">

                  <i class="bi bi-shield-check"></i>

                  You won't be charged yet
                

                </p>

                  ${myBookingsHTML}

              </div>
            `
        }

      </aside>

    </div>

  </div>
`;

///////// BACK BUTTON ///////

// Го бараме Back линкот, но само внатре во Details страницата.
// Така нема по грешка да го земеме Browse линкот од главната навигација.
const backToServicesLink =
  detailsViewEl.querySelector(
    'a[href="#/browse"]'
  );


// Проверуваме дали Back линкот постои.
if (backToServicesLink) {

  // Го менуваме текстот во "Back".
  backToServicesLink.innerHTML = `
    <i class="bi bi-arrow-left"></i>
    Back
  `;


  // Поставуваме што да се случи кога корисникот ќе кликне Back.
  backToServicesLink.onclick = function (event) {

    // Го спречуваме href="#/browse" секогаш да нè носи на Browse.
    event.preventDefault();


    // Го запираме кликот да продолжи до други click listeners.
    event.stopPropagation();


    // Се враќаме на страницата од која ја отворивме услугата.
    state.route.view =
      state.route.previousView || "browse";


    // Повеќе не ни треба id-то на отворената услуга.
    state.route.serviceId = null;


    // Го обновуваме интерфејсот.
    render();
  };
}


}// end of renderServicesDetails()



////////////////////           RENDER()                ///////////////////////
// Ова е главната render функција.
// Секогаш кога state ќе се промени,ќе ја повикуваме оваа функција.


export function render() {

  // Го прикажува точниот екран.
  renderRoute();

  // Ги прикажува услугите во Browse страницата.
  renderBrowse();

    // Ги прикажува услугите на најавениот корисник.
  renderMyServices();

  //  my booking 
  renderMyBookings();

   // Ја прикажува избраната услуга или Service not found.
  renderServiceDetails();
}


///////////                                  event listeners                                      ///////////



////// EDIT BOOKING FROM SERVICE DETAILS //////

detailContentEl.addEventListener(
  "click",
  function (event) {

    // Проверуваме дали корисникот кликнал на Edit booking копчето.
    const editButton =
      event.target.closest(
        ".edit-detail-booking-btn"
      );

    // Ако не е кликнато Edit, ја запираме функцијата.
    if (!editButton) {
      return;
    }

    // Го земаме id-то на услугата од Edit копчето.
    const serviceId =
      editButton.dataset.serviceId;

    // Го земаме id-то на booking-от од Edit копчето.
    const bookingId =
      editButton.dataset.bookingId;

    // Ја наоѓаме услугата во state.services.
    const service =
      state.services.find(function (service) {

        return (
          String(service.id) ===
          String(serviceId)
        );

      });

    // Ако услугата не постои, ја запираме функцијата.
    if (!service) {
      alert("Service could not be found.");
      return;
    }

    // Го наоѓаме booking-от што сакаме да го измениме.
    const booking =
      (service.bookings || []).find(
        function (booking) {

          return (
            String(booking.id) ===
            String(bookingId)
          );

        }
      );

    // Ако booking-от не постои, ја запираме функцијата.
    if (!booking) {
      alert("Booking could not be found.");
      return;
    }

    // Ги наоѓаме Date и Time полињата.
    const bookingDateInput =
      document.getElementById(
        "bookingDate"
      );

    const bookingTimeInput =
      document.getElementById(
        "bookingTime"
      );

    // Го наоѓаме главното booking копче.
    const confirmBookingBtn =
      document.getElementById(
        "confirmBookingBtn"
      );

    // Кај FULL услуга booking формата моментално не постои.
    if (
      !bookingDateInput ||
      !bookingTimeInput ||
      !confirmBookingBtn
    ) {

      alert(
        "The edit form is not available while the service is full."
      );

      return;
    }

    // Го ставаме стариот датум во Date полето.
    bookingDateInput.value =
      booking.date;

    // Го ставаме старото време во Time полето.
    bookingTimeInput.value =
      booking.time;

    // Го менуваме текстот од Request booking во Save changes.
    confirmBookingBtn.textContent =
      "Save changes";

    // На копчето го запомнуваме id-то на booking-от што го изменуваме.
    confirmBookingBtn.dataset.editingBookingId =
      booking.id;

    // Го носиме корисникот до booking формата.
    bookingDateInput.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

  }
);

//////  MY SERVICES   //////

// Слушаме клик и во My Services листата.
myServicesListEl.addEventListener("click", function (event) {

  // Проверуваме дали е кликнат линкот View & book.
  const serviceLink = event.target.closest(
    'a[href^="#/service/"]'
  );

  // Ако не е кликнат service линк,ја запираме функцијата.
  if (!serviceLink) {
    return;
  }

  // Го земаме href. Пример: #/service/3
  const serviceHref = serviceLink.getAttribute("href");

  // Го делиме href кај "/".
  const hrefParts = serviceHref.split("/");

  // Третиот дел е id-то на услугата.
  const serviceId = hrefParts[2];

  // Услугата е отворена од My Services.
   state.route.previousView = "services";
  // Ја отвораме Details страницата.
  state.route.view = "details";

  // Го зачувуваме id-то на кликнатата услуга.
  state.route.serviceId = serviceId;

  // Повторно го прикажуваме интерфејсот.
  render();
});

////// MY BOOKINGS SERVICE LINK //////

// Слушаме клик во My Bookings листата.
bookingsListEl.addEventListener("click", function (event) {

  // Проверуваме дали е кликнат насловот на услугата.
  const serviceLink = event.target.closest(
    'a[href^="#/service/"]'
  );

  // Ако не е кликнат service линк, ја запираме функцијата.
  if (!serviceLink) {
    return;
  }

  // Го земаме href од линкот. Пример: #/service/3
  const serviceHref =
    serviceLink.getAttribute("href");

  // Го делиме текстот кај "/".
  const hrefParts = serviceHref.split("/");

  // Третиот дел е id-то на услугата.
  const serviceId = hrefParts[2];

  // Паметиме дека услугата е отворена од My Bookings.
  state.route.previousView = "bookings";

  // Ја отвораме Details страницата.
  state.route.view = "details";

  // Го зачувуваме id-то на избраната услуга.
  state.route.serviceId = serviceId;

  // Повторно го прикажуваме интерфејсот.
  render();
});


///////      FILTRI     ///////

////// BROWSE SEARCH //////

// Проверуваме дали search полето постои.
if (searchInput) {
  searchInput.addEventListener("input", function () {

    // Го чуваме текстот од search полето.
    state.filters.search = searchInput.value;

    // Го обновуваме само Browse.
    renderBrowse();
    updateClearButton();
  });
}

////// CATEGORY FILTER //////

// Проверуваме дали category dropdown постои.
if (categorySelect) {
  categorySelect.addEventListener(
    "change",
    function () {

      // Ја чуваме избраната категорија.
      state.filters.category =
        categorySelect.value;

      // Го обновуваме само Browse.
      renderBrowse();
      updateClearButton();
    }
  );
}

////// SORT SERVICES //////

// Проверуваме дали sort dropdown постои.
if (sortSelect) {
  sortSelect.addEventListener(
    "change",
    function () {

      // Ја чуваме sort вредноста.
      state.filters.sort =
        sortSelect.value;

      // Го обновуваме само Browse.
      renderBrowse();
      updateClearButton();
    }
  );
}

////// MINIMUM PRICE FILTER //////

// Кога корисникот пишува во Min € полето.
minPriceInput.addEventListener(
  "input",
  function () {

    // Ја зачувуваме внесената минимална цена.
    state.filters.minPrice =
      minPriceInput.value;

    // Повторно ги прикажуваме услугите.
    renderBrowse();

    // Проверуваме дали треба да се гледа
    // редот со филтрите.
    updateClearButton();
  }
);


////// MAXIMUM PRICE FILTER //////

// Кога корисникот пишува во Max € полето.
maxPriceInput.addEventListener(
  "input",
  function () {

    // Ја зачувуваме внесената максимална цена.
    state.filters.maxPrice =
      maxPriceInput.value;

    // Повторно ги прикажуваме услугите.
    renderBrowse();

    // Проверуваме дали треба да се гледа
    // редот со филтрите.
    updateClearButton();
  }
);


////// CLEAR FILTERS  BONUS  //////

clearFiltersBtn.addEventListener(
  "click",
  function () {

    // Ги враќаме filter вредностите во нивната почетна состојба.
    state.filters.search = "";
    state.filters.category = "all";
    state.filters.sort = "none";

    // Ги бришеме внесените цени.
state.filters.minPrice = "";
state.filters.maxPrice = "";

     // Го чистиме избраниот provider.
  state.filters.providerId = null;

    // Го празниме Search полето што корисникот го гледа.
    searchInput.value = "";

    // Го враќаме category dropdown на All categories.
    categorySelect.value = "all";

    // Го враќаме sort dropdown на Sort: featured.
    sortSelect.value = "none";

        // Ги празниме полињата на екранот.
minPriceInput.value = "";
maxPriceInput.value = "";


    // Повторно ги прикажуваме сите услуги во Browse.
    renderBrowse();
    updateClearButton();
  }
);

////// PROVIDER FILTER //////

// Кога корисникот ќе кликне на provider име.
serviceListEl.addEventListener(
  "click",
  function (event) {

    // Проверуваме дали е кликнат provider линк.
    const providerLink =
      event.target.closest(".provider-link");

    // Ако не е, ја прекинуваме функцијата.
    if (!providerLink) {
      return;
    }

    // Да не отвори "#" во URL.
    event.preventDefault();

    // Го земаме provider id.
    state.filters.providerId =
      providerLink.dataset.providerId;

    // Повторно го прикажуваме Browse.
    renderBrowse();

    // Го освежуваме Clear filters.
    updateClearButton();
  }
);