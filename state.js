// STATE — заедничката меморија на апликацијата.
// - нема fetch
// - нема DOM
// - нема функции
// - само чува податоци

export const state = {
  // Сите корисници што ќе ги добиеме од MockAPI.
  users: [],

    // Сите услуги што ќе ги добиеме од MockAPI.
  services: [],

   // Најавениот корисник.
  // null значи дека никој не е најавен.
  currentUser: null,

 // Browse search, category и sort.
 filters: {
  search: "",
  category: "all",
  sort: "none",

    // Празен string значи:
  // корисникот нема внесено минимална цена.
  minPrice: "",

  // Празен string значи:
  // корисникот нема внесено максимална цена.
  maxPrice: "",

   // null значи: не гледаме посебен provider.
  providerId: null,
},

    // Route кажува кој дел од апликацијата е отворен.
  route: {
    view: "browse",
    serviceId: null,
     previousView: "browse",
  },

    // Тука ќе го чуваме id-то на услугата што ја уредуваме.
  // null значи дека моментално не уредуваме услуга.
  editingServiceId: null,
};