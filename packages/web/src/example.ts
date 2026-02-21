export const setupCode = `import { createTunnel } from "@felixfern/tunnel-fn";

type DemoTunnelMap = {
  greet: (message: string) => void;
  increment: (amount: number) => void;
};

export const { TunnelProvider, useTunnel, useTunnelFunction } =
  createTunnel<DemoTunnelMap>();`;

export const usageCode = `// ComponentA — registers "greet", calls "increment"
function ComponentA() {
  const { call } = useTunnel();

  useTunnelFunction("greet", (message) => {
    console.log("ComponentA received:", message);
  });

  return (
    <button onClick={() => call("increment", 1)}>
      call("increment", 1)
    </button>
  );
}

// ComponentB — registers "increment", calls "greet"
function ComponentB() {
  const [counter, setCounter] = useState(0);
  const { call } = useTunnel();

  useTunnelFunction("increment", (amount) => {
    setCounter((c) => c + amount);
  });

  return (
    <>
      <p>Counter: {counter}</p>
      <button onClick={() => call("greet", "Hi from B!")}>
        call("greet", "Hi from B!")
      </button>
    </>
  );
}`;
