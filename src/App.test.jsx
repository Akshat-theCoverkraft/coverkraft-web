import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { describe, expect, test, vi } from "vitest";
import Login from "./LoginModule/Login";
import NotFound from "./component/NotFound";
import store from "./store";

vi.mock("./fcm", () => ({
  registerFirebaseSW: vi.fn(),
  requestFCMPermission: vi.fn(),
  setupOnMessageListener: vi.fn(),
}));

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

const renderWithProviders = (ui) =>
  render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );

describe("core UI", () => {
  test("renders the 404 fallback and home navigation", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /go back home/i })).toHaveAttribute(
      "href",
      "/"
    );
  });

  test("validates login phone number before requesting OTP", () => {
    renderWithProviders(<Login />);

    const phoneInput = screen.getByPlaceholderText(/enter your number/i);
    fireEvent.change(phoneInput, { target: { value: "abc123" } });

    expect(phoneInput).toHaveValue("123");
    expect(
      screen.getByText(/please enter a valid 10-digit mobile number/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
  });
});
