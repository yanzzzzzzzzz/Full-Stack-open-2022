import chaiColors from "chai-colors";
chai.use(chaiColors);

let user1 = {
  name: "jt",
  username: "jacktsai",
  password: "password",
};
let user2 = {
  name: "yt",
  username: "ytsai",
  password: "password",
};
let newBlogData = {
  url: "AAwww.gogole.com",
  author: "CCaabasd",
  title: "asdasthis is a goodog",
};

let mostLikeBlogData = {
  url: "https://github.com/facebook/react",
  author: "facebook",
  title:
    "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
};
let fewLikeBlogData = {
  url: "https://github.com/yanzzzzzzzzz/cs131_fall2020",
  author: "yanzzzzzzzzz",
  title: "cs131_fall2020",
};
describe("Blog app", () => {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");

    cy.request("POST", "http://localhost:3001/api/users/", user1);
    cy.request("POST", "http://localhost:3001/api/users/", user2);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", () => {
    cy.contains("login");
    cy.contains("login").click();
  });

  describe("Login", () => {
    it("succeeds with correct credentials", () => {
      cy.contains("login").click();
      cy.get("#username").type(user1.username);
      cy.get("#password").type(user1.password);
      cy.get("#login-button").click();

      cy.contains(`${user1.username} logged in`);
    });

    it("fails with wrong credentials", () => {
      cy.contains("login").click();
      cy.get("#username").type("test");
      cy.get("#password").type("test");
      cy.get("#login-button").click();
      cy.get(".error")
        .should("contain", "Wrong username or password")
        .and("have.css", "color", "rgb(255, 0, 0)");

      cy.get("html").should("not.contain", "test logged in");
    });
  });

  describe("when logged in", () => {
    beforeEach(() => {
      // log in user here
      cy.login({ username: user1.username, password: user1.password });
      cy.createBlog(newBlogData);
    });

    it("Check user can like a blog", () => {
      cy.contains(newBlogData.title).parent().find("button").as("viewHideBtn");
      cy.get("@viewHideBtn").click();
      cy.get("@viewHideBtn").should("contain", "hide");
      cy.contains("likes").parent().find("button").as("likesBtn");
      cy.get("@likesBtn").click();
      cy.contains("likes:1");
    });

    it("A blog can be deleted by right user", () => {
      //cy.createBlog(newBlogData);
      cy.contains(newBlogData.title).parent().find("button").as("viewHideBtn");
      cy.get("@viewHideBtn").click();
      cy.contains("remove").click();
      cy.get("html").should("not.contain", newBlogData.title);
    });

    it("A blog can't be deleted by other user", () => {
      // logout
      cy.logout();
      // loggin other user
      cy.login({ username: user2.username, password: user2.password });
      // try delete
      cy.contains(newBlogData.title).parent().find("button").as("viewHideBtn");
      cy.get("@viewHideBtn").click();
      cy.contains(newBlogData.title).parent().should("not.contain", "remove");
    });
    it("checks that the blogs are ordered according to likes with the blog", () => {
      cy.createBlog(mostLikeBlogData);
      cy.ClickLikes(mostLikeBlogData.title, 10);

      cy.createBlog(fewLikeBlogData);
      cy.ClickLikes(fewLikeBlogData.title, 5);
      cy.get(".blog").eq(0).should("contain", mostLikeBlogData.title);
      cy.get(".blog").eq(1).should("contain", fewLikeBlogData.title);
    });
  });
});
