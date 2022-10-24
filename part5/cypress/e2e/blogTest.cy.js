import chaiColors from "chai-colors";
chai.use(chaiColors);
let testname = "jacktsai";
describe("Blog app", () => {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    const user = {
      name: "jt",
      username: testname,
      password: "password",
    };
    cy.request("POST", "http://localhost:3001/api/users/", user);
    cy.visit("http://localhost:3000");
  });
  it("Login form is shown", () => {
    cy.contains("login");
    cy.contains("login").click();
  });

  describe("Login", () => {
    it("succeeds with correct credentials", () => {
      cy.contains("login").click();
      cy.get("#username").type(testname);
      cy.get("#password").type("password");
      cy.get("#login-button").click();

      cy.contains("jacktsai logged in");
    });

    it("fails with wrong credentials", () => {
      cy.contains("login").click();
      cy.get("#username").type("test");
      cy.get("#password").type("test");
      cy.get("#login-button").click();
      cy.get(".error").contains("Wrong username or password");
      cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
    });
  });
});
