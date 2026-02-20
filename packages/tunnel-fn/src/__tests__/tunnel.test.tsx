/* eslint-disable @typescript-eslint/no-unused-vars */
import { act, render, renderHook, screen } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTunnel } from "../tunnel";

type TestMap = {
  greet: (name: string) => string;
  notify: (msg: string, level: number) => void;
  fetchData: () => Promise<string>;
};

function createTestTunnel() {
  return createTunnel<TestMap>();
}

describe("createTunnel", () => {
  it("returns TunnelProvider, useTunnel, useTunnelFunction", () => {
    const result = createTunnel<{ foo: () => void }>();
    expect(result).toHaveProperty("TunnelProvider");
    expect(result).toHaveProperty("useTunnel");
    expect(result).toHaveProperty("useTunnelFunction");
    expect(typeof result.TunnelProvider).toBe("function");
    expect(typeof result.useTunnel).toBe("function");
    expect(typeof result.useTunnelFunction).toBe("function");
  });
});

describe("TunnelProvider", () => {
  it("renders children without error", () => {
    const { TunnelProvider } = createTestTunnel();
    render(
      <TunnelProvider>
        <div data-testid="child">hello</div>
      </TunnelProvider>,
    );
    expect(screen.getByTestId("child").textContent).toBe("hello");
  });
});

describe("useTunnel / useTunnelFunction basic flow", () => {
  it("registers a function and call invokes it with correct args", () => {
    const { TunnelProvider, useTunnel, useTunnelFunction } = createTestTunnel();
    const greetFn = vi.fn((name: string) => `Hello, ${name}`);

    function Provider() {
      useTunnelFunction("greet", greetFn);
      return null;
    }

    function Consumer() {
      const { call } = useTunnel();
      useEffect(() => {
        call("greet", "World");
      }, [call]);
      return null;
    }

    render(
      <TunnelProvider>
        <Provider />
        <Consumer />
      </TunnelProvider>,
    );

    expect(greetFn).toHaveBeenCalledWith("World");
    expect(greetFn).toHaveReturnedWith("Hello, World");
  });

  it("call returns undefined when no function registered", () => {
    const { TunnelProvider, useTunnel } = createTestTunnel();
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

    let result: string | undefined;
    function Consumer() {
      const { call } = useTunnel();
      useEffect(() => {
        result = call("greet", "Nobody");
      }, [call]);
      return null;
    }

    render(
      <TunnelProvider>
        <Consumer />
      </TunnelProvider>,
    );

    expect(result).toBeUndefined();
    spy.mockRestore();
  });

  it("has returns true for registered keys, false for unregistered", () => {
    const { TunnelProvider, useTunnel, useTunnelFunction } = createTestTunnel();

    let hasGreet = false;
    let hasNotify = false;

    function Provider() {
      useTunnelFunction("greet", (name: string) => `Hi ${name}`);
      return null;
    }

    function Consumer() {
      const { has } = useTunnel();
      useEffect(() => {
        hasGreet = has("greet");
        hasNotify = has("notify");
      }, [has]);
      return null;
    }

    render(
      <TunnelProvider>
        <Provider />
        <Consumer />
      </TunnelProvider>,
    );

    expect(hasGreet).toBe(true);
    expect(hasNotify).toBe(false);
  });

  it("auto-unregisters on unmount", () => {
    const { TunnelProvider, useTunnel, useTunnelFunction } = createTestTunnel();
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

    let callResult: string | undefined;
    let hasResult = true;

    function Provider() {
      useTunnelFunction("greet", (name: string) => `Hi ${name}`);
      return null;
    }

    function Consumer({ check }: { check: boolean }) {
      const { call, has } = useTunnel();
      useEffect(() => {
        if (check) {
          callResult = call("greet", "Test");
          hasResult = has("greet");
        }
      }, [call, has, check]);
      return null;
    }

    function App() {
      const [showProvider, setShowProvider] = useState(true);
      const [check, setCheck] = useState(false);
      return (
        <TunnelProvider>
          {showProvider && <Provider />}
          <Consumer check={check} />
          <button
            data-testid="unmount"
            onClick={() => {
              setShowProvider(false);
              setCheck(true);
            }}
          />
        </TunnelProvider>
      );
    }

    render(<App />);

    act(() => {
      screen.getByTestId("unmount").click();
    });

    expect(callResult).toBeUndefined();
    expect(hasResult).toBe(false);
    spy.mockRestore();
  });
});

describe("call argument passing and return values", () => {
  it("passes all arguments through and returns the value", () => {
    const { TunnelProvider, useTunnel, useTunnelFunction } = createTestTunnel();
    const notifyFn = vi.fn((_msg: string, _level: number) => {});

    let greetResult: string | undefined;

    function Registrar() {
      useTunnelFunction("greet", (name: string) => `Hey ${name}!`);
      useTunnelFunction("notify", notifyFn);
      return null;
    }

    function Caller() {
      const { call } = useTunnel();
      useEffect(() => {
        greetResult = call("greet", "Alice");
        call("notify", "alert", 5);
      }, [call]);
      return null;
    }

    render(
      <TunnelProvider>
        <Registrar />
        <Caller />
      </TunnelProvider>,
    );

    expect(greetResult).toBe("Hey Alice!");
    expect(notifyFn).toHaveBeenCalledWith("alert", 5);
  });
});

describe("Provider isolation", () => {
  it("two separate TunnelProviders do NOT share state", () => {
    const { TunnelProvider, useTunnel, useTunnelFunction } = createTestTunnel();
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

    let resultFromB: string | undefined;

    function Registrar() {
      useTunnelFunction("greet", (_name: string) => "from A");
      return null;
    }

    function CallerInB() {
      const { call } = useTunnel();
      useEffect(() => {
        resultFromB = call("greet", "test");
      }, [call]);
      return null;
    }

    render(
      <>
        <TunnelProvider>
          <Registrar />
        </TunnelProvider>
        <TunnelProvider>
          <CallerInB />
        </TunnelProvider>
      </>,
    );

    expect(resultFromB).toBeUndefined();
    spy.mockRestore();
  });
});

describe("Error handling", () => {
  it("useTunnel throws outside TunnelProvider", () => {
    const { useTunnel } = createTestTunnel();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTunnel());
    }).toThrow("[tunnel-fn]");

    spy.mockRestore();
  });

  it("useTunnelFunction throws outside TunnelProvider", () => {
    const { useTunnelFunction } = createTestTunnel();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTunnelFunction("greet", (_name: string) => "hi"));
    }).toThrow("[tunnel-fn]");

    spy.mockRestore();
  });
});

describe("callAsync", () => {
  it("resolves with return value when function is already registered (sync fn)", async () => {
    const { TunnelProvider, useTunnel, useTunnelFunction } = createTestTunnel();

    let asyncResult: string | undefined;

    function Registrar() {
      useTunnelFunction("greet", (name: string) => `Hi ${name}`);
      return null;
    }

    function Caller() {
      const { callAsync } = useTunnel();
      useEffect(() => {
        callAsync("greet", "Sync").then((val) => {
          asyncResult = val;
        });
      }, [callAsync]);
      return null;
    }

    render(
      <TunnelProvider>
        <Registrar />
        <Caller />
      </TunnelProvider>,
    );

    await vi.waitFor(() => {
      expect(asyncResult).toBe("Hi Sync");
    });
  });

  it("resolves with awaited value when function is async", async () => {
    const { TunnelProvider, useTunnel, useTunnelFunction } = createTestTunnel();

    let asyncResult: string | undefined;

    function Registrar() {
      useTunnelFunction("fetchData", async () => "fetched-data");
      return null;
    }

    function Caller() {
      const { callAsync } = useTunnel();
      useEffect(() => {
        callAsync("fetchData").then((val) => {
          asyncResult = val;
        });
      }, [callAsync]);
      return null;
    }

    render(
      <TunnelProvider>
        <Registrar />
        <Caller />
      </TunnelProvider>,
    );

    await vi.waitFor(() => {
      expect(asyncResult).toBe("fetched-data");
    });
  });

  it("waits for registration then calls the function", async () => {
    const { TunnelProvider, useTunnel, useTunnelFunction } = createTestTunnel();
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

    let asyncResult: string | undefined;

    function DelayedRegistrar() {
      const [ready, setReady] = useState(false);
      useEffect(() => {
        const timer = setTimeout(() => setReady(true), 50);
        return () => clearTimeout(timer);
      }, []);
      if (!ready) return null;
      return <Inner />;
    }

    function Inner() {
      useTunnelFunction("greet", (name: string) => `Deferred ${name}`);
      return null;
    }

    function Caller() {
      const { callAsync } = useTunnel();
      useEffect(() => {
        callAsync("greet", "Late").then((val) => {
          asyncResult = val;
        });
      }, [callAsync]);
      return null;
    }

    render(
      <TunnelProvider>
        <Caller />
        <DelayedRegistrar />
      </TunnelProvider>,
    );

    await vi.waitFor(
      () => {
        expect(asyncResult).toBe("Deferred Late");
      },
      { timeout: 3000 },
    );

    spy.mockRestore();
  });
});

describe("onReady", () => {
  it("fires callback immediately if function is already registered", () => {
    const { TunnelProvider, useTunnel, useTunnelFunction } = createTestTunnel();
    const readyCb = vi.fn();

    function Registrar() {
      useTunnelFunction("greet", (name: string) => `Hi ${name}`);
      return null;
    }

    function Listener() {
      const { onReady } = useTunnel();
      useEffect(() => {
        return onReady("greet", readyCb);
      }, [onReady]);
      return null;
    }

    render(
      <TunnelProvider>
        <Registrar />
        <Listener />
      </TunnelProvider>,
    );

    expect(readyCb).toHaveBeenCalledTimes(1);
    expect(typeof readyCb.mock.calls[0][0]).toBe("function");
  });

  it("fires callback when function is registered later", async () => {
    const { TunnelProvider, useTunnel, useTunnelFunction } = createTestTunnel();
    const readyCb = vi.fn();

    function DelayedRegistrar() {
      const [ready, setReady] = useState(false);
      useEffect(() => {
        const timer = setTimeout(() => setReady(true), 50);
        return () => clearTimeout(timer);
      }, []);
      if (!ready) return null;
      return <Inner />;
    }

    function Inner() {
      useTunnelFunction("greet", (name: string) => `Delayed ${name}`);
      return null;
    }

    function Listener() {
      const { onReady } = useTunnel();
      useEffect(() => {
        return onReady("greet", readyCb);
      }, [onReady]);
      return null;
    }

    render(
      <TunnelProvider>
        <Listener />
        <DelayedRegistrar />
      </TunnelProvider>,
    );

    expect(readyCb).not.toHaveBeenCalled();

    await vi.waitFor(
      () => {
        expect(readyCb).toHaveBeenCalledTimes(1);
      },
      { timeout: 3000 },
    );
  });

  it("unsubscribe prevents callback from firing", async () => {
    const { TunnelProvider, useTunnel, useTunnelFunction } = createTestTunnel();
    const readyCb = vi.fn();

    function DelayedRegistrar() {
      const [ready, setReady] = useState(false);
      useEffect(() => {
        const timer = setTimeout(() => setReady(true), 100);
        return () => clearTimeout(timer);
      }, []);
      if (!ready) return null;
      return <Inner />;
    }

    function Inner() {
      useTunnelFunction("greet", (name: string) => `Late ${name}`);
      return null;
    }

    function Listener() {
      const { onReady } = useTunnel();
      useEffect(() => {
        const unsub = onReady("greet", readyCb);
        unsub();
      }, [onReady]);
      return null;
    }

    render(
      <TunnelProvider>
        <Listener />
        <DelayedRegistrar />
      </TunnelProvider>,
    );

    await new Promise((r) => setTimeout(r, 200));
    expect(readyCb).not.toHaveBeenCalled();
  });
});

describe("Dev warnings", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it("warns on duplicate key registration", () => {
    const { TunnelProvider, useTunnelFunction } = createTestTunnel();

    function A() {
      useTunnelFunction("greet", (_name: string) => "from A");
      return null;
    }

    function B() {
      useTunnelFunction("greet", (_name: string) => "from B");
      return null;
    }

    render(
      <TunnelProvider>
        <A />
        <B />
      </TunnelProvider>,
    );

    const dupWarning = warnSpy.mock.calls.find(
      (args: unknown[]) =>
        typeof args[0] === "string" &&
        args[0].includes("Duplicate registration"),
    );
    expect(dupWarning).toBeDefined();
  });

  it("warns when call() invoked with no function registered", () => {
    const { TunnelProvider, useTunnel } = createTestTunnel();

    function Consumer() {
      const { call } = useTunnel();
      useEffect(() => {
        call("greet", "Nobody");
      }, [call]);
      return null;
    }

    render(
      <TunnelProvider>
        <Consumer />
      </TunnelProvider>,
    );

    const noFnWarning = warnSpy.mock.calls.find(
      (args: unknown[]) =>
        typeof args[0] === "string" &&
        args[0].includes("No function registered"),
    );
    expect(noFnWarning).toBeDefined();
  });

  it("does NOT warn when function is registered and called normally", () => {
    const { TunnelProvider, useTunnel, useTunnelFunction } = createTestTunnel();

    function Registrar() {
      useTunnelFunction("greet", (name: string) => `Hi ${name}`);
      return null;
    }

    function Consumer() {
      const { call } = useTunnel();
      useEffect(() => {
        call("greet", "Friend");
      }, [call]);
      return null;
    }

    render(
      <TunnelProvider>
        <Registrar />
        <Consumer />
      </TunnelProvider>,
    );

    const tunnelWarnings = warnSpy.mock.calls.filter(
      (args: unknown[]) =>
        typeof args[0] === "string" && args[0].includes("[tunnel-fn]"),
    );
    expect(tunnelWarnings).toHaveLength(0);
  });
});
