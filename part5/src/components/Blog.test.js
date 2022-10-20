import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  const blog = {
    title: "Title",
    author: "Author",
    url: "https://www.test.com/",
    likes: 0,
    user: {
      username: "username",
      name: "name",
    },
  };
  const testUser = {
    username: "username",
    name: "name",
  };
  let component;
  const mockHandler = jest.fn();
  beforeEach(() => {
    component = render(
      <Blog blog={blog} user={testUser} updateLikes={mockHandler} />
    );
  });

  test("renders title by default", () => {
    const element = screen.getByText("Title");
    expect(element).toBeDefined();
  });
  test("renders blog details when view button is clicked", async () => {
    const button = component.container.querySelector("button");
    fireEvent.click(button);
    expect(
      component.container.querySelector(".blog-details")
    ).toBeInTheDocument();
    expect(component.container.querySelector(".blog-url")).toBeInTheDocument();
    expect(component.container.querySelector(".likes")).toBeInTheDocument();
  });
  test("test click twice like", async () => {
    const button = component.container.querySelector("button");
    fireEvent.click(button);
    const blogDetail = component.container.querySelector(".blog-details");
    const likesButton = blogDetail.querySelector("button");
    fireEvent.click(likesButton);
    fireEvent.click(likesButton);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
  test("test for new blog form", async () => {});
});
