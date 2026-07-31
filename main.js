
// Го внесуваме заедничкиот state од state.js.
import { state } from "./state.js";

// Ги внесуваме функциите што ги читаат податоците од MockAPI.
import {
  getUsers,
  getServices,
  createService,
  updateService,
  deleteService,
} from "./api.js";

// Ја внесуваме главната функција што ја прикажува страницата.
import { render } from "./render.js";

// Функција за менување страници во главната апликација.
import {
  navigateTo,
  handleRoute,
} from "./router.js";

import {
  loginUser,
  logoutUser,
  registerUser,
  restoreSession,
  showAppScreen,
  showAuthScreen,
  showLandingScreen,
  showLoginForm,
  showRegisterForm,
} from "./auth.js";

import { showToast } from "./toast.js";

//////////////                 ELEMENT GRAB DOM                ////////////////

//  loading и error пораки.
const messageEl = document.getElementById("message");

// Auth tab buttons.
const showLoginBtn = document.getElementById("show-login");
const showRegisterBtn = document.getElementById("show-register");

// Register формата и нејзините полиња.
const registerFormEl = document.getElementById("register-form");
const registerNameEl = document.getElementById("register-name");
const registerEmailEl = document.getElementById("register-email");
const registerPasswordEl = document.getElementById("register-password");
const registerErrorEl = document.getElementById("register-error");

// Го земаме submit копчет што се наоѓа во Register формата.
const registerSubmitBtn = registerFormEl.querySelector( 'button[type="submit"]'
  );

// Login формата и нејзините полиња.

const loginFormEl = document.getElementById("login-form");
const loginEmailEl = document.getElementById("login-email");
const loginPasswordEl = document.getElementById("login-password");
const loginErrorEl = document.getElementById("login-error");

// Овде ќе го покажеме името на најавениот корисник.
const userNameEl = document.getElementById("current-name");
// Овде ќе ја покажеме првата буква  од името на најавениот корисник.
const userAvatarEl = document.getElementById("current-avatar");

// Back to home копчето.
const authBackBtn = document.getElementById("auth-back");

// Logout копчето.
const logoutBtn =  document.getElementById("logout-btn");

// Копчиња во navigation лентата.

const browseNavBtn =  document.getElementById("nav-browse");
const bookingsNavBtn =  document.getElementById("nav-bookings");
const servicesNavBtn =  document.getElementById("nav-services");

const offerBtn = document.getElementById("offer-btn");
const offerBtn2 = document.getElementById("offer-btn-2");

const serviceModal =  document.getElementById("service-modal");

// Формата за додавање нов service.
const serviceForm =  document.getElementById("service-form");
// Поле за насловот на service-от.
const serviceTitleEl =  document.getElementById("svc-title");
// Поле за цената.
const servicePriceEl =  document.getElementById("svc-price");

// Поле за максимален број на bookings.
const serviceMaxBookingsEl = document.getElementById("svc-max-bookings");

// Поле за времетраењето.
const serviceDurationEl =  document.getElementById("svc-duration");
// Поле за категоријата.
const serviceCategoryEl =  document.getElementById("svc-category");
// Поле за URL од сликата.
const serviceImageEl =  document.getElementById("svc-image");
// Поле за описот.
const serviceDescriptionEl =  document.getElementById("svc-description");
// Место за error порака.
const serviceErrorEl =  document.getElementById("svc-error");
// Publish service копчето.
const serviceSubmitBtn =  document.getElementById("form-submit");

// Насловот во service modal-от.
const serviceModalTitle = document.getElementById("form-title");

// Листата на My Bookings страницата.
const bookingsListEl =
  document.getElementById("bookings-list");

// Содржината на Service Details страницата.
const detailContentEl =
  document.getElementById("detail-content");


////// EDIT - DELETE ///////
// Го памети id-то на услугата што моментално ја уредуваме.
// null значи: не уредуваме стара услуга, туку додаваме нова услуга.
let editingServiceId = null;


//////////////////////   loadData()   ///////////////////////////////

// Оваа функција ги вчитува сите почетни податоци.
// 1. покажува Loading...
// 2. ги зема users
// 3. ги зема services
// 4. ги зачувува во state
// 5. ја чисти пораката
// 6. прикажува грешка ако нешто не работи


async function loadData() {
  // Пред request-ите покажуваме loading порака.
  messageEl.textContent = "Loading...";

  try {
    // Ги земаме корисниците од MockAPI.
    const users = await getUsers();

    // Ги земаме услугите од MockAPI.
    const services = await getServices();

    // Ги зачувуваме корисниците во заедничкиот state.
    state.users = users;

// Секоја услуга привремено добива id
// според нејзината позиција во низата.

state.services = services;

    // Податоците се успешно вчитани,
    // па ја тргаме loading пораката.
    messageEl.textContent = "";

 // Проверуваме дали има зачувана session.
const savedUser = restoreSession();

if (savedUser) {
  showCurrentUser(savedUser);
  showAppScreen();

} else {
  showLandingScreen();
}
// Го читаме URL-то
// за да знаеме која страница
// треба да се отвори.
handleRoute();
// Го прикажуваме UI.
render();

  } catch (error) {

    // Ако fetch не успее, прикажуваме јасна порака.
    messageEl.textContent = "Could not load data. Please try again.";
  }
}

//////////   USER INFO  /////////////   

// Го прикажува името и avatar-от  на најавениот корисник.

function showCurrentUser(user) {
  // Го покажуваме името.

  userNameEl.textContent = user.name;


  // Ја покажуваме првата буква од името.

  userAvatarEl.textContent =
    user.name.charAt(0).toUpperCase();
}

/////    CANCEL  BOOKING   //////

// Откажува еден booking.
async function cancelBooking(serviceId, bookingId) {

  // Го прашуваме корисникот дали е сигурен.
  const shouldCancel = confirm(
    "Cancel this booking?"
  );

  // Ако корисникот избрал Cancel,
  // ја запираме функцијата.
  if (!shouldCancel) {
    return false;
  }

  // Ја бараме услугата во state.
  const service = state.services.find(
    function (service) {

      return (
        String(service.id) ===
        String(serviceId)
      );
    }
  );

  // Ако услугата не постои, прекинуваме.
  if (!service) {
    alert("Service could not be found.");
    return false;
  }

  // Создаваме нова низа со bookings.
  const updatedBookings =
    (service.bookings || []).map(
      function (booking) {

        // Го наоѓаме booking-от што треба да се откаже.
        if (
          String(booking.id) ===
          String(bookingId)
        ) {

          // Го менуваме само status.
          return {
            ...booking,
            status: "cancelled",
          };
        }

        // Другите bookings остануваат исти.
        return booking;
      }
    );

  // Создаваме ажурирана услуга.
  const updatedService = {
    ...service,
    bookings: updatedBookings,
  };

  // Ја испраќаме промената до серверот.
  await updateService(updatedService);

  // Повторно ги земаме услугите од серверот.
  const newestServices =
    await getServices();

  // State се менува во main.js, а не во render.js.
  state.services = newestServices;

  // Го обновуваме интерфејсот.
  render();

  // Покажуваме порака.
  showToast("Booking cancelled ✓");

  return true;
}

/////////  CANCEL MY BOOKING  ///////////

// Cancel booking од My Bookings.
bookingsListEl.addEventListener(
  "click",
  async function (event) {

    // Проверуваме дали е кликнато
    // Cancel копчето.
    const cancelButton =
      event.target.closest(
        ".cancel-booking-btn"
      );

    // Ако не е тоа копче, прекинуваме.
    if (!cancelButton) {
      return;
    }

    // Ги земаме id вредностите од data атрибутите.
    const serviceId =
      cancelButton.dataset.serviceId;

    const bookingId =
      cancelButton.dataset.bookingId;

    // Го исклучуваме копчето додека трае request-от.
    cancelButton.disabled = true;

    try {

      const cancelled =
        await cancelBooking(
          serviceId,
          bookingId
        );

      // Ако корисникот не потврдил, повторно го вклучуваме копчето.
      if (!cancelled) {
        cancelButton.disabled = false;
      }

    } catch (error) {

      console.error(
        "Cancel booking error:",
        error
      );

      alert(
        "Booking could not be cancelled. Please try again."
      );

      cancelButton.disabled = false;
    }
  }
);

//////////  CANCEL FROM  SERVICE DETAILS ///////////

// Cancel booking од Service Details.
detailContentEl.addEventListener(
  "click",
  async function (event) {

    // Проверуваме дали е кликнато
    // Details Cancel копчето.
    const cancelButton =
      event.target.closest(
        ".cancel-detail-booking-btn"
      );

    // Ако не е тоа копче, прекинуваме.
    if (!cancelButton) {
      return;
    }

    // Ги земаме id вредностите.
    const serviceId =
      cancelButton.dataset.serviceId;

    const bookingId =
      cancelButton.dataset.bookingId;

    // Го исклучуваме копчето.
    cancelButton.disabled = true;

    try {

      const cancelled =
        await cancelBooking(
          serviceId,
          bookingId
        );

      // Ако confirm бил одбиен, повторно го вклучуваме копчето.
      if (!cancelled) {
        cancelButton.disabled = false;
      }

    } catch (error) {

      console.error(
        "Cancel booking error:",
        error
      );

      alert(
        "Booking could not be cancelled."
      );

      cancelButton.disabled = false;
    }
  }
);

////// REQUEST BOOKING / SAVE BOOKING CHANGES //////

// Service Details содржината се менува со render().
// Затоа го слушаме кликот на detailContentEl, а не директно на confirmBookingBtn.
detailContentEl.addEventListener(
  "click",
  async function (event) {

    // Проверуваме дали е кликнато
    // Request booking / Save changes копчето.
    const confirmBookingBtn =
      event.target.closest(
        "#confirmBookingBtn"
      );

    // Ако не е тоа копче, прекинуваме.
    if (!confirmBookingBtn) {
      return;
    }

    // Го исклучуваме копчето за да нема двоен submit.
    confirmBookingBtn.disabled = true;

    // Ги земаме booking полињата од моментално прикажаната Details страница.
    const bookingDateInput =
      document.getElementById(
        "bookingDate"
      );

    const bookingTimeInput =
      document.getElementById(
        "bookingTime"
      );

    const bookingMessage =
      document.getElementById(
        "bookingMessage"
      );

    // Сигурносна проверка.
    if (
      !bookingDateInput ||
      !bookingTimeInput ||
      !bookingMessage
    ) {
      confirmBookingBtn.disabled = false;
      return;
    }

    // Ако копчето има editingBookingId, уредуваме стар booking.
    const editingBookingId =
      confirmBookingBtn.dataset
        .editingBookingId;

    // Ја чистиме старата порака.
    bookingMessage.textContent = "";

    // Ги читаме датумот и времето.
    const selectedDate =
      bookingDateInput.value;

    const selectedTime =
      bookingTimeInput.value;

    // Двете полиња се задолжителни.
    if (!selectedDate || !selectedTime) {
      bookingMessage.textContent =
        "Please choose both date and time.";

      confirmBookingBtn.disabled = false;
      return;
    }

    // Го претвораме терминот во JavaScript Date вредност.
    const selectedDateTime =
      new Date(
        selectedDate +
        "T" +
        selectedTime
      );

    const now = new Date();

    // Не дозволуваме термин во минатото.
    if (selectedDateTime < now) {
      bookingMessage.textContent =
        "Please choose a future date and time.";

      confirmBookingBtn.disabled = false;
      return;
    }

    // Корисникот мора да биде најавен.
    if (!state.currentUser) {
      bookingMessage.textContent =
        "Please log in before booking a service.";

      confirmBookingBtn.disabled = false;
      return;
    }

    // Го земаме id-то на услугата што моментално е отворена.
    const serviceId =
      state.route.serviceId;

    // Ако нема service id, прекинуваме.
    if (!serviceId) {
      bookingMessage.textContent =
        "Service could not be found.";

      confirmBookingBtn.disabled = false;
      return;
    }

    // Податоци за нов booking.
    const bookingData = {
      id: String(Date.now()),
      clientId: String(
        state.currentUser.id
      ),
      date: selectedDate,
      time: selectedTime,
      status: "confirmed",
    };

    try {

      // Земаме свежи услуги од серверот пред да направиме booking.
      const freshServices =
        await getServices();

      // Ја бараме отворената услуга во свежите server податоци.
      const freshService =
        freshServices.find(
          function (service) {

            return (
              String(service.id) ===
              String(serviceId)
            );
          }
        );

      // Можно е услугата во меѓувреме да била избришана.
      if (!freshService) {
        bookingMessage.textContent =
          "This service no longer exists.";

        return;
      }

      // Најновите bookings од серверот.
      const freshBookings =
        freshService.bookings || [];

      // Максимален број bookings.
      const freshMaxBookings =
        Number(
          freshService.maxBookings || 0
        );

      // Ги броиме само confirmed bookings.
      const freshConfirmedBookings =
        freshBookings.filter(
          function (booking) {

            return (
              booking.status ===
              "confirmed"
            );
          }
        );

      // Проверуваме дали услугата е полна.
      const serviceIsNowFull =
        freshMaxBookings > 0 &&
        freshConfirmedBookings.length >=
          freshMaxBookings;

      // FULL блокира само нов booking.
      // Edit на постоечки booking е дозволен.
      if (
        serviceIsNowFull &&
        !editingBookingId
      ) {
        bookingMessage.textContent =
          "This service is now fully booked.";

        return;
      }

      // Проверуваме дали терминот веќе го користи друг booking.
      const timeIsTaken =
        freshBookings.some(
          function (booking) {

            const isBookingBeingEdited =
              editingBookingId &&
              String(booking.id) ===
                String(editingBookingId);

            return (
              booking.status ===
                "confirmed" &&
              booking.date ===
                selectedDate &&
              booking.time ===
                selectedTime &&
              !isBookingBeingEdited
            );
          }
        );

      // Не дозволуваме два bookings во истиот термин.
      if (timeIsTaken) {
        bookingMessage.textContent =
          "This time was just booked. Please choose another time.";

        return;
      }

      let updatedBookings;

      // EDIT BOOKING
      if (editingBookingId) {

        updatedBookings =
          freshBookings.map(
            function (booking) {

              if (
                String(booking.id) ===
                String(editingBookingId)
              ) {
                return {
                  ...booking,
                  date: selectedDate,
                  time: selectedTime,
                };
              }

              return booking;
            }
          );

      } else {

        // NEW BOOKING
        updatedBookings = [
          ...freshBookings,
          bookingData,
        ];
      }

      // Создаваме ажурирана услуга.
      const updatedService = {
        ...freshService,
        bookings: updatedBookings,
      };

      // Ја зачувуваме на серверот.
      await updateService(
        updatedService
      );

      // После успешниот write,
      // повторно читаме од серверот.
      const newestServices =
        await getServices();

      // State се менува во main.js.
      state.services =
        newestServices;

      // Покажуваме точна success порака.
      if (editingBookingId) {
        showToast(
          "Booking updated ✓"
        );
      } else {
        showToast("Booked ✓");
      }

      // Излегуваме од Edit mode.
      delete confirmBookingBtn.dataset
        .editingBookingId;

      // Го враќаме нормалниот текст.
      confirmBookingBtn.textContent =
        "Request booking";

      // Ги празниме полињата.
      bookingDateInput.value = "";
      bookingTimeInput.value = "";

      // Остануваме на Details страницата.
      state.route.view = "details";

      state.route.serviceId =
        String(updatedService.id);

      // Го прикажуваме свежиот state.
      render();

    } catch (error) {

      console.error(
        "Booking error:",
        error
      );

      alert(
        "Booking could not be saved. Please try again."
      );

    } finally {

      // Секогаш повторно го активираме копчето.
      // По успешен render старото копче веќе е заменето со ново, но ова е безбедно и за error случај.
      confirmBookingBtn.disabled = false;
    }
  }
);

/////////////////////////                        EVENT  LISTENERS                    /////////////////////////////////////

// Клик на Log in табот.
showLoginBtn.addEventListener("click", function () {
  showLoginForm();
});


// Клик на Sign up табот.
showRegisterBtn.addEventListener("click", function () {
  showRegisterForm();
});

//////////  authActionEls   /////////

// Ги земаме сите елементи што имаат data-auth.
const authActionEls = document.querySelectorAll("[data-auth]");

// На секој таков елемент му додаваме click listener.
authActionEls.forEach(function (element) {
  element.addEventListener("click", function (event) {
    // Спречуваме link со href="#" да ја помести страницата.
    event.preventDefault();

    // Ја читаме вредноста:
    // login или register.

    const mode = element.dataset.auth;

    // Го отвораме Auth екранот на точната форма.
    showAuthScreen(mode);
  });
});



// Назад кон Landing страницата
authBackBtn.addEventListener("click", function (event) {
  event.preventDefault();

  showLandingScreen();
});

///////  REGSITER SUBMIT BTN   ///////

// Кога корисникот ја испраќа Register формата.
registerFormEl.addEventListener("submit", async function (event) {

  // Спречуваме browser-от да ја освежи страницата.

  event.preventDefault();


  // Ја чистиме старата error порака.
  registerErrorEl.textContent = "";


  // Ги читаме вредностите од полињата.
  const name = registerNameEl.value.trim();
  const email = registerEmailEl.value.trim();
  const password = registerPasswordEl.value;


  // Дополнителна проверка за празно име.

  if (!name) {
    registerErrorEl.textContent = "Please enter your name.";
    return;
  }

      // Го исклучуваме копчето
    // пред да започне request-от. Така корисникот не може да кликне повеќепати.
    registerSubmitBtn.disabled = true;

  try {
    // Се обидуваме да го создадеме корисникот.
    await registerUser(name, email, password);

    // Покажуваме успешна порака со името.
    showToast("User, " + name + "! Account created ✓");

    // Ако регистрацијата успеала, ја чистиме целата форма.
    registerFormEl.reset();

    // Го префрламе корисникот на Login формата.
    showLoginForm();
  } catch (error) {

    // Ако email постои или серверот не работи,
    // ја покажуваме пораката под формата.
    registerErrorEl.textContent = error.message;
  } finally {

      // Овој дел се извршува секогаш:/
      // - кога регистрацијата успева
      // - кога регистрацијата не успева
      // Повторно го вклучуваме копчето.
      registerSubmitBtn.disabled = false;
    }
  }
);

//////// LOGIN SUBMIT ////////

// Кога корисникот ја испраќа Login формата.

loginFormEl.addEventListener("submit", function (event) {

  // Го спречуваме refresh-от на страницата.
  event.preventDefault();

  // Ја чистиме старата error порака.
  loginErrorEl.textContent = "";

  // Ги читаме вредностите од полињата.
  const email = loginEmailEl.value.trim();
  const password = loginPasswordEl.value;

  try {
    // Проверуваме дали email и password му припаѓаат на постоечки корисник.
    const loggedInUser = loginUser(email, password);

    // Покажи ги податоците за корисникот.
    showCurrentUser(loggedInUser);

    // Ја чистиме Login формата.
    loginFormEl.reset();


    // Ја покажуваме главната апликација.
    showAppScreen();

    // После login секогаш почнуваме од Browse страницата.
   navigateTo("browse");

    // Ги прикажуваме податоците од state.
    render();
    
    showToast("Welcome back, " + loggedInUser.name + "!");

  } catch (error) {

    // Ако email или password се погрешни,
    // ја покажуваме грешката под формата.

    loginErrorEl.textContent = error.message;
  }
});

////////////////////   LOG OUt BTN  /////////////////////

// Logout копче.
logoutBtn.addEventListener("click", function () {
  // Го бришеме корисникот од state и од localStorage.

  logoutUser();

   // Ја враќаме почетната route.
  navigateTo("browse");

  // Го чистиме името од header-от.
  userNameEl.textContent = "";

  // Го чистиме avatar-от.
  userAvatarEl.textContent = "";

  // Ја покажуваме Landing страницата.
  showLandingScreen();

  // Покажуваме успешна порака.
  showToast("Goodbye! ");

});


////////    BROWSE  BTN     /////////
// Кога корисникот ќе кликне Browse.
browseNavBtn.addEventListener("click", function () {

  // Ја менуваме route состојбата.
  navigateTo("browse");

  // Повторно го прикажуваме UIспоред новиот state.
  render();
});

////////     Bookings BTN    ////////
// Кога корисникот ќе кликне My Bookings.
bookingsNavBtn.addEventListener("click", function () {

  // Ја менуваме страницата.
  navigateTo("bookings");

  // Го обновуваме UI.
  render();
});

///////     SERVICES BTN    ////////
// Кога корисникот ќе кликне My Services.
servicesNavBtn.addEventListener("click", function () {

  // Ја менуваме страницата.
  navigateTo("services");

  // Го обновуваме UI.
  render();
});


////////   OFFER A SERVICE //////// 

offerBtn.addEventListener("click", function () {

    // клик на првото offer сервис копче
  // Не уредуваме стара услуга. Ќе креираме нова услуга.
  editingServiceId = null;

  // Ја празниме формата.
  serviceForm.reset();

  // Ја чистиме старата error порака.
  serviceErrorEl.textContent = "";

  // Го враќаме нормалниот наслов.
  serviceModalTitle.textContent =
    "Offer a service";

  // Го враќаме текстот на копчето.
  serviceSubmitBtn.textContent =
    "Publish service";

  // Го отвораме modal-от.
  serviceModal.classList.remove("d-none");
});

// Клик на второто Offer a service копче.
offerBtn2.addEventListener("click", function () {

  // Не уредуваме стара услуга.
  editingServiceId = null;

  // Ја празниме формата.
  serviceForm.reset();

  // Ја чистиме error пораката.
  serviceErrorEl.textContent = "";

  // Го враќаме modal-от во Add mode.
  serviceModalTitle.textContent =
    "Offer a service";

  serviceSubmitBtn.textContent =
    "Publish service";

  // Го отвораме modal-от.
  serviceModal.classList.remove("d-none");
});

/////  modal close /////// 

// Ги земаме сите копчиња што имаат класа modal-close.
const modalCloseButtons =  document.querySelectorAll(".modal-close");

// Го проверуваме секое close копче.
modalCloseButtons.forEach(function (button) {

  // Кога ќе се кликне копчето...
  button.addEventListener("click", function () {

    // Го криеме modal-от.
    serviceModal.classList.add("d-none");
  });
});

// Кога ќе кликнеме на темната позадина околу белата modal кутија.

serviceModal.addEventListener("click", function (event) {

  // Проверуваме дали е кликнат баш serviceModal, а не некое поле или копче внатре во него.
  if (event.target === serviceModal) {

    // Го криеме modal-от.
    serviceModal.classList.add("d-none");
  }
});

/////////  MODAL FORM EVENT LISTENER ////////

// Кога ја испраќаме формата за нов service.
serviceForm.addEventListener("submit", async function (event) {

  // Го спречуваме refresh-от на страницата.
  event.preventDefault();

  // Ја чистиме старата error порака.
  serviceErrorEl.textContent = "";

  // Ги читаме вредностите од полињата.
  const title = serviceTitleEl.value.trim();
  const price = Number(servicePriceEl.value);
  const duration = Number(serviceDurationEl.value);
  const maxBookings = Number(serviceMaxBookingsEl.value);
  const category = serviceCategoryEl.value;
  const image = serviceImageEl.value.trim();
  const description = serviceDescriptionEl.value.trim();

  // Проверуваме дали title е празен.
if (!title) {
  serviceErrorEl.textContent =
    "Please enter a service title.";
  return;
}
// проверуваме дали боокинг е празен.
if (maxBookings <= 0) {
  serviceErrorEl.textContent =
    "Maximum bookings must be greater than 0.";
  return;
}

// Проверуваме дали price е поголема од 0.
if (price <= 0) {
  serviceErrorEl.textContent =
    "Price must be greater than 0.";
  return;
}

// Проверуваме дали duration е поголемо од 0.
if (duration <= 0) {
  serviceErrorEl.textContent =
    "Duration must be greater than 0.";
  return;
}

// Проверуваме дали description е празен.
if (!description) {
  serviceErrorEl.textContent =
    "Please enter a description.";
  return;
}

// Го креираме новиот service object.
const newService = {
  title: title,
  price: price,
  duration: duration,
  maxBookings: maxBookings,
  category: category,
  image: image,
  description: description,

  // Најавениот корисник станува provider.
  providerId: state.currentUser.id,

  // Нов service нема bookings.
  bookings: [],
};

// Го исклучуваме копчето додека се зачувува.
serviceSubmitBtn.disabled = true;


const isEditing =  editingServiceId !== null;
// Се обидуваме да ја зачуваме услугата.
try {

// Ако editingServiceId е null, додаваме сосема нов service.
if (editingServiceId === null) {

  await createService(newService);

} else {

  // Ја наоѓаме старата услуга што моментално ја уредуваме.
  const oldService = state.services.find(function (service) {
    return String(service.id) ===
      String(editingServiceId);
  });

  // Ако не ја најдеме услугата, ја прекинуваме операцијата со грешка.
  if (!oldService) {
    throw new Error("Service not found.");
  }

  // Ја создаваме ажурираната услуга.
  const updatedService = {
    ...oldService,

    title: title,
    price: price,
    duration: duration,
    maxBookings: maxBookings,
    category: category,
    image: image,
    description: description,
  };

  // Ја испраќаме целата услуга со PUT.
  await updateService(updatedService);
}

  // Повторно ги вчитуваме податоците.
  await loadData();

if (isEditing) {

  showToast("Changes saved ✓");

} else {

  showToast("Service published ✓");

}

  // Повеќе не уредуваме стара услуга.
 editingServiceId = null;

  // Ја празниме формата.
  serviceForm.reset();

  // Ја чистиме error пораката.
  serviceErrorEl.textContent = "";

  // Го затвораме modal-от.
  serviceModal.classList.add("d-none");

} catch (error) {

  // Ако серверот има проблем,
if (isEditing) {
  serviceErrorEl.textContent =
    "Could not save changes. Please try again.";
} else {
  serviceErrorEl.textContent =
    "Could not publish service. Please try again.";
}

  // Ја покажуваме вистинската грешка во Console.
  console.error(error);

}finally {

  // Повторно го вклучуваме копчето.
  serviceSubmitBtn.disabled = false;
}

});

//////////  EDIT  - DELETE  //////////

// Слушаме клик на целата страница.
document.addEventListener("click", async function (event) {

    // Проверуваме дали е кликнато Delete копче.
const deleteButton = event.target.closest(".delete-service-btn");

// Ако е кликнато Delete копче...
if (deleteButton) {
  // Го земаме id-то на услугата.
  const serviceId =
    deleteButton.dataset.id;

  // Го прашуваме корисникот дали е сигурен.
  const confirmed =
    confirm("Delete this service?");

  // Ако кликне Cancel, ја запираме функцијата.
  if (!confirmed) {
    return;
  }

  //// delete from mokapi  /////
try {
  // Ја бришеме услугата од MockAPI.
  await deleteService(serviceId);

  // Повторно ги вчитуваме податоците.
  await loadData();

} catch (error) {
  // Ако бришењето не успее, ја покажуваме грешката во Console.
  console.error(error);
}

return;
}

  // Проверуваме дали е кликнато Edit копче.
  const editButton =  event.target.closest(".edit-service-btn");

  // Ако не е кликнато Edit копче,
  // ја запираме функцијата.
  if (!editButton) {
    return;
  }

  // Го земаме id-то од кликнатото копче.
  const serviceId = editButton.dataset.id;
// Ја бараме услугата со истото id.
const serviceToEdit = state.services.find(function (service) {
  return String(service.id) === String(serviceId);
});

// Ако услугата не е пронајдена, ја запираме функцијата.
if (!serviceToEdit) {
  return;
}

// Го паметиме id-то на услугаташто моментално ја уредуваме.
editingServiceId = serviceToEdit.id;

// Го менуваме modal-от во Edit mode.
serviceModalTitle.textContent =
  "Edit your service";

serviceSubmitBtn.textContent =
  "Save changes";

// Ги ставаме старите вредности во полињата од формата.
serviceTitleEl.value = serviceToEdit.title;
servicePriceEl.value = serviceToEdit.price;
serviceDurationEl.value = serviceToEdit.duration;
// Го покажуваме стариот booking limit.
serviceMaxBookingsEl.value =  serviceToEdit.maxBookings;
serviceCategoryEl.value = serviceToEdit.category;
serviceImageEl.value = serviceToEdit.image || "";
serviceDescriptionEl.value = serviceToEdit.description;

// Го отвораме modal-от.
serviceModal.classList.remove("d-none");


});

/////////////   END OF THE CODE ///////////////

// Ја стартуваме апликацијата со вчитување на податоците.
loadData();

render();

// Кога ќе се смени URL hash, повторно прочитај ја route и освежи го интерфејсот.
window.addEventListener("hashchange", function () {

  handleRoute();

  render();

});