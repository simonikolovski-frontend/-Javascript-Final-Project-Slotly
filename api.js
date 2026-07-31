// API URL — главната адреса на нашиот MockAPI проект.

export const API_URL = "https://6a5d20350ad09982aef6e9fd.mockapi.io/";

//  ги зема сите корисници од MockAPI.

export async function getUsers() {
  // Испраќаме GET request до /users.
  const response = await fetch(API_URL + "/users");

  // Проверуваме дали request-от бил успешен.
  if (!response.ok) {
    throw new Error("Could not load users.");
  }

  // Го претвораме JSON одговорот во JavaScript податоци.
  const users = await response.json();

  // Ги враќаме корисниците назад.
  return users;
}

// Оваа функција ги зема сите услуги од MockAPI.

export async function getServices() {
  // Испраќаме GET request до /services.
  const response = await fetch(API_URL + "services");

  // Ако серверот врати грешка, ја прекинуваме функцијата.
  if (!response.ok) {
    throw new Error("Could not load services.");
  }

  // Го претвораме JSON одговорот во JavaScript податоци.
  const services = await response.json();

  // Ги враќаме услугите назад.
  return services;
}
// Додава нова услуга на MockAPI.
export async function createService(service) {

  // Испраќаме POST request до /services.
  const response = await fetch(
    API_URL + "/services",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(service),
    }
  );


  // Ако серверот врати грешка, ја прекинуваме функцијата.
  if (!response.ok) {
    throw new Error("Could not create service.");
  }

  // Го претвораме одговорот во JavaScript object.
  const newService = await response.json();

  // Ја враќаме новата услуга.
  return newService;
}


////// book this service /////

// Ја ажурира една услуга на серверот.
export async function updateService(service) {

  // Го испраќаме барањето до точната услуга
  // според нејзиното id.

  const response = await fetch(
    API_URL + "services/" + service.id,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(service),
    }
  );


  // Ако серверот врати грешка,
  // ја прекинуваме функцијата.

  if (!response.ok) {
    throw new Error("Could not update service.");
  }


  // Го претвораме одговорот во JavaScript object.

  const updatedService = await response.json();


  // Ја враќаме ажурираната услуга.

  return updatedService;
}

//// delete service /////

// Брише една услуга според нејзиното id.
export async function deleteService(id) {

  // Го испраќаме DELETE request-от  до точната услуга.
  const response = await fetch(
    API_URL + "services/" + id,
    {
      method: "DELETE",
    }
  );

  // Ако серверот врати грешка,
  // ја прекинуваме функцијата.
  if (!response.ok) {
    throw new Error("Could not delete service.");
  }
}