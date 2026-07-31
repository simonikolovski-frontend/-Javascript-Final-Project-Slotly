// кој дел од апликацијата треба да се прикаже 

// Во state.route чуваме
// кој екран треба да се прикаже.

import { state } from "./state.js";


// Ја менува тековната страница во апликацијата.
// view може да биде:
// "browse"
// "bookings"
// "services"
// "details"

export function navigateTo(
  view,
  serviceId = null,
  previousView = null
) {

      // Ако отвораме details страница,паметиме од која страница доаѓаме.
  if (
    view === "details" &&
    previousView !== null
  ) {
    state.route.previousView = previousView;
  }

  // Го зачувуваме името на новиот екран.
  state.route.view = view;


  // Ако отвораме service details, тука го чуваме id-то на услугата.
  // Ако не отвораме details, вредноста ќе биде null.
  state.route.serviceId = serviceId;
}

//////    ### SL-9 · Handle a missing service   ///////

// Го чита hash-от од URL-то.
export function handleRoute() {
  const hash = window.location.hash;

  // Ако URL-то почнува со #/service/, тоа значи дека отвораме details.

  if (hash.startsWith("#/service/")) {
    // Пример: "#/service/5"
    // станува: ["#", "service", "5"]

    const parts = hash.split("/");

    // Третиот дел е service id.
    const serviceId = parts[2];

    // Ако не сме веќе на Details, запомни од која страница доаѓаме.
if (state.route.view !== "details") {
  state.route.previousView = state.route.view;
}

    // Го зачувуваме route-от.
    state.route.view = "details";
    state.route.serviceId = serviceId;

    return;
  }


  if (hash === "#/bookings") {
    state.route.view = "bookings";
    state.route.serviceId = null;
    return;
  }


  if (hash === "#/services") {
    state.route.view = "services";
    state.route.serviceId = null;
    return;
  }


  // Default е Browse.
  state.route.view = "browse";
  state.route.serviceId = null;
}