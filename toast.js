// Прикажува мала toast порака.
export function showToast(message) {

  // Го земаме toast контејнерот.
  const toastHost =
    document.getElementById("toast-host");

  // Креираме нов toast.
  const toast =
    document.createElement("div");

  // Bootstrap стилови.
  toast.className =
    "alert alert-success shadow mb-2";

  // Текстот.
  toast.textContent = message;

  // Го додаваме во toast host.
  toastHost.appendChild(toast);

  // После 3 секунди исчезнува.
  setTimeout(function () {

    toast.remove();

  }, 3000);

}