// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
let localStorageItemBlog = "loggedBlogappUser";
Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "http://localhost:3001/api/login", {
    username,
    password,
  }).then(({ body }) => {
    localStorage.setItem(localStorageItemBlog, JSON.stringify(body));
    cy.visit("http://localhost:3000");
  });
});

Cypress.Commands.add("createBlog", ({ author, title, url }) => {
  cy.request({
    url: "http://localhost:3001/api/blogs",
    method: "POST",
    body: { author, title, url },
    headers: {
      Authorization: `bearer ${
        JSON.parse(localStorage.getItem(localStorageItemBlog)).token
      }`,
    },
  });

  cy.visit("http://localhost:3000");
});
Cypress.Commands.add("logout", () => {
  window.localStorage.removeItem("loggedBlogappUser");
});

Cypress.Commands.add("ClickLikes", (blogTitle, clickTimes) => {
  cy.contains(blogTitle).parent().find("button").as("viewHideBtn");
  cy.get("@viewHideBtn").click();
  cy.contains(blogTitle).parent().find(".likes").find("button").as("likesBtn");

  for (let i = 1; i <= clickTimes; i++) {
    cy.get("@likesBtn").click();
    cy.contains(`likes:${i}`);
  }
});
