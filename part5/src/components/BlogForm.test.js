import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm />  test for the new blog form", async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  const component = render(<BlogForm createBlog={createBlog} />);

  const title = component.container.querySelector("input[name='title']");
  const url = component.container.querySelector("input[name='author']");
  const author = component.container.querySelector("input[name='url']");
  const submitButton = screen.getByText("create");
  await user.type(title, "test title");
  await user.type(url, "test url");
  await user.type(author, "test author");
  await user.click(submitButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toBe("test title");
  expect(createBlog.mock.calls[0][1]).toBe("test url");
  expect(createBlog.mock.calls[0][2]).toBe("test author");
});
