import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VolumeCalculator } from "@/components/calculator/VolumeCalculator";
import { ContactForm } from "@/components/forms/ContactForm";
import { CountUp } from "@/components/ui/CountUp";

describe("<VolumeCalculator>", () => {
  it("shows 12.00 kg for 50 × 40 × 30 cm", async () => {
    const user = userEvent.setup();
    render(<VolumeCalculator />);
    await user.type(screen.getByLabelText("Length (cm)"), "50");
    await user.type(screen.getByLabelText("Width (cm)"), "40");
    await user.type(screen.getByLabelText("Height (cm)"), "30");
    await user.click(screen.getByRole("button", { name: "Calculate" }));
    expect(await screen.findByText("12.00 kg")).toBeInTheDocument();
  });

  it("explains invalid input instead of calculating", async () => {
    const user = userEvent.setup();
    render(<VolumeCalculator />);
    await user.type(screen.getByLabelText("Length (cm)"), "abc");
    await user.click(screen.getByRole("button", { name: "Calculate" }));
    expect(await screen.findByText("Use numbers only, e.g. 42.5")).toBeInTheDocument();
    expect(screen.getByLabelText("Length (cm)")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getAllByText("Enter the width.")).toHaveLength(1);
    expect(screen.queryByText(/kg$/)).not.toBeInTheDocument();
  });
});

describe("<ContactForm>", () => {
  it("shows accessible errors and does not submit when fields are empty", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByText("Please enter your first name.")).toBeInTheDocument();
    const name = screen.getByLabelText(/first name/i);
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Please enter your first name.");
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("prefills the subject and tells the visitor honestly when delivery isn't configured", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ ok: false, code: "DELIVERY_NOT_CONFIGURED", message: "x" }, { status: 503 }),
    );
    const user = userEvent.setup();
    render(<ContactForm endpoint="/api/quote" subject="Quote: Personal Gifts" />);
    expect(screen.getByLabelText(/subject/i)).toHaveValue("Quote: Personal Gifts");
    await user.type(screen.getByLabelText(/first name/i), "Asha");
    await user.type(screen.getByLabelText(/email/i), "asha@example.com");
    await user.type(screen.getByLabelText(/phone/i), "+91 6238399011");
    await user.type(screen.getByLabelText(/message/i), "Two boxes to London");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Not sent — online delivery isn't set up yet.")).toBeInTheDocument();
    expect(screen.queryByText(/has been sent/)).not.toBeInTheDocument();
    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe("/api/quote");
    expect(JSON.parse(init!.body as string)).toMatchObject({ subject: "Quote: Personal Gifts", form_botcheck: "" });
    fetchSpy.mockRestore();
  });
});

describe("<CountUp>", () => {
  it("counts up on entry, stays put while visible, and replays after leaving and returning", () => {
    let notify: (visible: boolean) => void = () => {};
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    vi.stubGlobal("IntersectionObserver", class {
      constructor(cb: IntersectionObserverCallback) {
        notify = (visible) => cb([{ isIntersecting: visible } as IntersectionObserverEntry], {} as IntersectionObserver);
      }
      observe() {}
      disconnect() {}
    });
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => frames.push(cb));
    vi.stubGlobal("cancelAnimationFrame", () => frames.splice(0));
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ top: 5000 } as DOMRect);
    const { container } = render(<CountUp value="1000+" duration={100} delay={0} />);
    const shown = container.querySelector("[aria-hidden]")!;
    expect(shown).toHaveTextContent("1000+");

    const countUp = () => {
      notify(true);
      frames.shift()!(performance.now());
      expect(shown.textContent).toBe("0+");
      frames.shift()!(performance.now() + 1000);
      expect(shown).toHaveTextContent("1000+");
      expect(frames).toHaveLength(0);
    };
    countUp();
    notify(true); // still visible: no restart
    expect(frames).toHaveLength(0);
    notify(false);
    expect(shown.textContent).toBe("0+");
    countUp();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
});
