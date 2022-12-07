import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form } from "./Form";

const mockLogin = jest.fn((email, password) => {
  return Promise.resolve({ email, password });
});

describe("Form", () => {
  beforeEach(() => {
    render(<Form login={mockLogin} />);
  });
  const user = userEvent.setup();

  it("should display required error when value is invalid", async () => {
    await user.click(screen.getByRole("button"));

    expect(await screen.findAllByRole("alert")).toHaveLength(2);
    expect(mockLogin).not.toBeCalled();
  });

  it("should display matching error when email is invalid", async () => {
    await user.type(screen.getByRole("textbox", { name: /email/i }), "test");
    await user.type(screen.getByLabelText("password"), "password");

    await user.click(screen.getByRole("button"));
    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(screen.getByLabelText("password").value).toBe("password");
    expect(mockLogin).not.toBeCalled();
    expect(screen.getByRole("textbox", { name: /email/i }).value).toBe("test");
  });

  it("should display min length error when password is invalid", async () => {
    await user.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@mail.com"
    );
    await user.type(screen.getByLabelText("password"), "pass");

    await user.click(screen.getByRole("button"));

    expect(await screen.findAllByRole("alert")).toHaveLength(1);
    expect(mockLogin).not.toBeCalled();
    expect(screen.getByRole("textbox", { name: /email/i }).value).toBe(
      "test@mail.com"
    );
    expect(screen.getByLabelText("password").value).toBe("pass");
  });

  it("should not display error when value is valid", async () => {
    await user.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@mail.com"
    );
    await user.type(screen.getByLabelText("password"), "password");
    await user.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.queryAllByRole("alert")).toHaveLength(0);
      expect(mockLogin).toBeCalledWith("test@mail.com", "password");
      expect(screen.getByRole("textbox", { name: /email/i }).value).toBe("");
      expect(screen.getByLabelText("password").value).toBe("");
    });
  });
});
