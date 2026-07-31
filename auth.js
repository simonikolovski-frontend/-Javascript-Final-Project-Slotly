// Го внесуваме заедничкиот state.
// Ни треба за да провериме дали
// некој email веќе постои.

import { state } from "./state.js";

// Ја внесуваме главната MockAPI адреса.
import { API_URL } from "./api.js";

// Името под кое ќе ја чуваме session во localStorage.
const SESSION_KEY = "slotly-session";

// Трите главни екрани на апликацијата.
const landingViewEl = document.getElementById("landing-view");
const authViewEl = document.getElementById("auth-view");
const appViewEl = document.getElementById("app-view");

// Login и Register формите.
const loginFormEl = document.getElementById("login-form");
const registerFormEl = document.getElementById("register-form");


// Копчињата за менување помеѓу формите.
const showLoginBtn = document.getElementById("show-login");
const showRegisterBtn = document.getElementById("show-register");



////////////////////////                   FUNCTIONS                         ////////////////////



/////////     LOG-IN  form     //////////

export function showLoginForm() {
  // Ја покажуваме Login формата.
  loginFormEl.classList.remove("d-none");

  // Ја криеме Register формата.
  registerFormEl.classList.add("d-none");

  // Login копчето станува активно.
  showLoginBtn.classList.add("active");

  // Register копчето повеќе не е активно.
  showRegisterBtn.classList.remove("active");
}

///////  REGISTER  form  /////////

// Ја покажува Register формата,
// а ја крие Login формата.

export function showRegisterForm() {
  // Ја криеме Login формата.
  loginFormEl.classList.add("d-none");

  // Ја покажуваме Register формата.
  registerFormEl.classList.remove("d-none");

  // Register копчето станува активно.
  showRegisterBtn.classList.add("active");

  // Login копчето повеќе не е активно.
  showLoginBtn.classList.remove("active");
}

///////   AUTH  form   ////////

// Го покажува Auth екранот. mode може да биде:  "login" или "register"

export function showAuthScreen(mode) {
  // Ја криеме Landing страницата.
  landingViewEl.classList.add("d-none");

  // Го покажуваме Auth екранот.
  authViewEl.classList.remove("d-none");

  // Ја криеме главната апликација.
  appViewEl.classList.add("d-none");

  // Одлучуваме која форма треба да се покаже.

  if (mode === "register") {
    showRegisterForm();
  } else {
    showLoginForm();
  }
}

///// LANDING PAGE  //////

// Ја покажува Landing страницата.

export function showLandingScreen() {
  // Ја покажуваме Landing страницата.
  landingViewEl.classList.remove("d-none");

  // Го криеме Auth екранот.
  authViewEl.classList.add("d-none");

  // Ја криеме главната апликација.
  appViewEl.classList.add("d-none");
}

// Ја покажува главната апликација кога корисникот е најавен.

export function showAppScreen() {
  // Ја криеме Landing страницата.
  landingViewEl.classList.add("d-none");

  // Го криеме Auth екранот.
  authViewEl.classList.add("d-none");

  // Ја покажуваме главната апликација.
  appViewEl.classList.remove("d-none");
}

///////   NEW USER REGISTRATION   ///////

// Создава нов корисник во MockAPI.
// Функцијата добива: name  email  password

export async function registerUser(name, email, password) {
  // Го чистиме email-от и го претвораме
  // во мали букви за сигурна споредба.
  // На пример:
  // " Ana@Test.com " → "ana@test.com"

  const cleanEmail = email.trim().toLowerCase();

  // Проверуваме дали email веќе постои
  // во корисниците што ги имаме во state.

  const emailExists = state.users.some(function (user) {
    return user.email.toLowerCase() === cleanEmail;
  });


  // Ако email веќе постои,
  // фрламе грешка и не испраќаме POST request.

  if (emailExists) {
    throw new Error("An account with this email already exists.");
  }

  // Го подготвуваме новиот корисник.

  const newUser = {
    name: name.trim(),
    email: cleanEmail,
    password: password,
  };


  // Испраќаме POST request до /users.

  const response = await fetch(API_URL + "/users", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(newUser),
  });


  // Ако серверот врати грешка,
  // ја прекинуваме функцијата.

  if (!response.ok) {
    throw new Error("Could not create account. Please try again.");
  }


  // MockAPI го враќа создадениот корисник
  // заедно со новото id.

  const createdUser = await response.json();


  // Го додаваме и во state.users.
  // Така новиот email веднаш ќе биде познат
  // без да мора да ја освежуваме страницата.

  state.users.push(createdUser);

  // Го враќаме создадениот корисник.

  return createdUser;
}


/////////  НАЈАВЕН КОРИСНИК  ///////////

// Проверува дали email и password одговараат на некој корисник.
// Ако корисникот е најден:- го зачувуваме во state.currentUser- го враќаме корисникот Ако не е најден: - фрламе грешка

export function loginUser(email, password) {
  // Го чистиме email-от.
  // " ANA@TEST.COM " станува:
  // "ana@test.com"

  const cleanEmail = email.trim().toLowerCase();


  // Бараме корисник кај кој:
  // 1. email е ист
  // 2. password е ист

  const foundUser = state.users.find(function (user) {
    const sameEmail =
      user.email.toLowerCase() === cleanEmail;

    const samePassword =
      user.password === password;

    return sameEmail && samePassword;
  });


  // Ако не најдовме корисник,
  // foundUser ќе биде undefined.

  if (!foundUser) {
    throw new Error("Incorrect email or password.");
  }

    // Создаваме session object без password.

  const sessionUser = {
    id: foundUser.id,
    name: foundUser.name,
    email: foundUser.email,
  };

  // Го чуваме во state.
  state.currentUser = sessionUser;

  // Го чуваме во localStorage.
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(sessionUser)
  );


  // Го враќаме најавениот корисник.
  return sessionUser;
}

///////////       RESTORE SESION       /////////

// Ја враќа зачуваната session  кога страницата повторно ќе се отвори.

export function restoreSession() {
  // Го читаме зачуваниот текст
  // од localStorage.

  const savedSession =
    localStorage.getItem(SESSION_KEY);


  // Ако нема зачувана session, нема што да враќаме.

  if (!savedSession) {
    return null;
  }


  try {
    // JSON.parse го претвора текстот  назад во JavaScript object.

    const sessionUser =
      JSON.parse(savedSession);


    // Го враќаме корисникот во state.

    state.currentUser = sessionUser;


    // Го враќаме и како резултат.

    return sessionUser;
  } catch (error) {
    // Ако localStorage содржи расипан JSON, ја бришеме лошата session.

    localStorage.removeItem(SESSION_KEY);

    state.currentUser = null;

    return null;
  }
}

///////////   LOG OUT   ///////////////

// Го одјавува корисникот.
export function logoutUser() {
  // Го бришеме корисникот од state.

  state.currentUser = null;

  // Ја бришеме session од localStorage.
  localStorage.removeItem(SESSION_KEY);
}