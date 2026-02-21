export const sections = [
  { id: "getting-started", label: "Getting Started" },
  { id: "create-tunnel", label: "createTunnel" },
  { id: "tunnel-provider", label: "TunnelProvider" },
  { id: "use-tunnel", label: "useTunnel" },
  { id: "use-tunnel-function", label: "useTunnelFunction" },
  { id: "multiple-tunnels", label: "Multiple Tunnels" },
  { id: "when-to-use", label: "When to Use" },
  { id: "dev-warnings", label: "Dev Warnings" },
];

export const code = {
  defineTunnel: `import { createTunnel } from "@felixfern/tunnel-fn";

const { TunnelProvider, useTunnel, useTunnelFunction } = createTunnel<{
  showAlert: (message: string) => void;
  getCount: () => number;
}>();

export { TunnelProvider, useTunnel, useTunnelFunction };`,

  wrapProvider: `import { TunnelProvider } from "./tunnel";

function App() {
  return (
    <TunnelProvider>
      <ComponentA />
      <ComponentB />
    </TunnelProvider>
  );
}`,

  registerFn: `import { useTunnelFunction } from "./tunnel";

function ComponentA() {
  useTunnelFunction("showAlert", (message: string) => {
    alert(message);
  });

  return <div>Component A</div>;
}`,

  callFn: `import { useTunnel } from "./tunnel";

function ComponentB() {
  const { call } = useTunnel();

  return (
    <button onClick={() => call("showAlert", "Hello from B!")}>
      Trigger Alert
    </button>
  );
}`,

  createTunnelTyped: `const { TunnelProvider, useTunnel, useTunnelFunction } = createTunnel<{
  onSave: (data: FormData) => void;
  onCancel: () => void;
  validate: (field: string) => boolean;
}>();`,

  providerScoping: `// Each Provider creates an independent scope
<TunnelProvider>
  {/* Functions here are isolated */}
  <SidebarA />
  <ContentA />
</TunnelProvider>

<TunnelProvider>
  {/* Separate scope — no interference */}
  <SidebarB />
  <ContentB />
</TunnelProvider>`,

  useTunnelBasic: `const { call, callAsync, has, onReady } = useTunnel();

// Check before calling
if (has("onSave")) {
  call("onSave", formData);
}`,

  callAsync: `// Await an async tunnel function
const data = await callAsync("fetchData", userId);

// Or call a function that hasn't mounted yet — it waits
useEffect(() => {
  callAsync("initialize", config).then(() => {
    console.log("initialized");
  });
}, [callAsync]);`,

  onReady: `useEffect(() => {
  const unsubscribe = onReady("initialize", (fn) => {
    fn(config);
  });
  return unsubscribe;
}, [onReady]);`,

  useTunnelFunction: `useTunnelFunction("onSave", (data: FormData) => {
  console.log(data);
});`,

  multipleTunnels: `const formTunnel = createTunnel<{
  submit: () => void;
  reset: () => void;
}>();

const navTunnel = createTunnel<{
  navigate: (path: string) => void;
}>();

// Each tunnel has its own Provider and hooks
<formTunnel.TunnelProvider>
  <navTunnel.TunnelProvider>
    {children}
  </navTunnel.TunnelProvider>
</formTunnel.TunnelProvider>`,
};

export const goodFit = [
  {
    title: "Sibling communication",
    desc: "Two components under the same Provider need to talk without lifting state to a common parent.",
  },
  {
    title: "Scoped imperative actions",
    desc: "showToast(), openModal(), scrollToTop() — fire-and-forget commands scoped to a subtree.",
  },
  {
    title: "Decoupled feature modules",
    desc: "A toolbar triggers actions defined in a content panel, without either knowing about the other's internals.",
  },
  {
    title: "Plugin-style architectures",
    desc: "A host component defines the tunnel type, and dynamically-loaded children register implementations.",
  },
];

export const notFit = [
  {
    title: "Parent → child communication",
    desc: "Use props. Tunnels are for sideways/upward communication.",
  },
  {
    title: "Global cross-tree state",
    desc: "If you need shared state across the entire app, use Zustand, Jotai, or Redux. Tunnels scope to a Provider subtree.",
  },
  {
    title: "Replacing state management",
    desc: "Tunnels pass functions, not data. If you need reactive state, use state management.",
  },
  {
    title: "High-frequency calls",
    desc: "Tunnels are ref-based (no re-renders), but rapid polling or animation-frame calls are better served by direct refs or pub/sub.",
  },
];

export const devWarnings = [
  {
    warning: "No function registered",
    cause: 'call("key") when no component has registered that key',
    fix: "Ensure the registering component is mounted before calling",
  },
  {
    warning: "Duplicate registration",
    cause: "Two components register the same key under one Provider",
    fix: "Use separate keys or separate tunnels",
  },
  {
    warning: "Call during render",
    cause: "call() invoked directly in the component body",
    fix: "Move to an event handler, useEffect, or callback",
  },
  {
    warning: "Registration churn",
    cause: "A function is re-registered rapidly (>3×/sec)",
    fix: "Wrap the function in useCallback() before passing to useTunnelFunction",
  },
];
