export const ExampleSetupCode = `
import { createTunnel } from "@felixfern/tunnel-fn";

type MyTunnelMap = {
  funcA: () => void;
  funcB: (number: number) => void;
};

export const { TunnelProvider, useTunnel, useTunnelFunction } =
  createTunnel<MyTunnelMap>();
`;

export const ExampleAppCode = `
import { TunnelProvider } from "./tunnel";
import ComponentA from "./components/ComponentA";
import ComponentB from "./components/ComponentB";

function App() {
  return (
    <TunnelProvider>
      <ComponentA />
      <ComponentB />
    </TunnelProvider>
  );
}

export default App;
`;

export const ExampleComponentA = `
import { useTunnel, useTunnelFunction } from "./tunnel";

const ComponentA = () => {
  const { call } = useTunnel();

  useTunnelFunction("funcA", () => {
    toast.success("Called FuncA");
  });

  return (
    <div>
      <Button onClick={() => call("funcA")}>Call FuncA</Button>
      <Button onClick={() => call("funcB", 1)}>
        Call FuncB
      </Button>
    </div>
  );
};

export default ComponentA;
`;

export const ExampleComponentB = `
import { useTunnel, useTunnelFunction } from "./tunnel";

const ComponentB = () => {
  const [counter, setCounter] = useState(0);
  const { call } = useTunnel();

  useTunnelFunction("funcB", (number: number) => {
    setCounter(counter + 1);
    toast.success(\`Called FuncB with parameter: \${number}\`);
  });

  return (
    <div>
      <Button onClick={() => call("funcB", 1)}>Call FuncB</Button>
      <Button onClick={() => call("funcA")}>Call FuncA</Button>
      <p>Counter: {counter}</p>
    </div>
  );
};

export default ComponentB;
`;
