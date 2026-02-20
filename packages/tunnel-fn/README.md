# tunnel-fn

[![npm](https://img.shields.io/npm/v/tunnel-fn)](https://www.npmjs.com/package/tunnel-fn)

Type-safe function tunneling across React components via context. Call functions registered in distant components without prop drilling.

## Install

```bash
npm install tunnel-fn
```

```bash
pnpm add tunnel-fn
```

```bash
yarn add tunnel-fn
```

Requires React >= 16.8.0 as a peer dependency.

## Quick Start

### 1. Define your tunnel

```tsx
// tunnel.ts
import { createTunnel } from "tunnel-fn";

const { TunnelProvider, useTunnel, useTunnelFunction } = createTunnel<{
  showAlert: (message: string) => void;
  getCount: () => number;
}>();

export { TunnelProvider, useTunnel, useTunnelFunction };
```

### 2. Wrap with Provider

```tsx
// App.tsx
import { TunnelProvider } from "./tunnel";

function App() {
  return (
    <TunnelProvider>
      <ComponentA />
      <ComponentB />
    </TunnelProvider>
  );
}
```

### 3. Register functions

```tsx
// ComponentA.tsx
import { useTunnelFunction } from "./tunnel";

function ComponentA() {
  useTunnelFunction("showAlert", (message: string) => {
    alert(message);
  });

  return <div>Component A</div>;
}
```

### 4. Call from anywhere

```tsx
// ComponentB.tsx
import { useTunnel } from "./tunnel";

function ComponentB() {
  const { call } = useTunnel();

  return (
    <button onClick={() => call("showAlert", "Hello from B!")}>
      Trigger Alert
    </button>
  );
}
```

Everything is fully typed — `call("showAlert", 123)` is a type error because `showAlert` expects a `string`.

## API

### `createTunnel<T>()`

Creates a scoped tunnel instance. `T` is a record mapping function names to their signatures.

```tsx
const { TunnelProvider, useTunnel, useTunnelFunction } = createTunnel<{
  onSave: (data: FormData) => void;
  onCancel: () => void;
  validate: (field: string) => boolean;
}>();
```

Returns `{ TunnelProvider, useTunnel, useTunnelFunction }`.

### `TunnelProvider`

React component that scopes the tunnel. All `useTunnel` and `useTunnelFunction` calls must be within a Provider.

```tsx
<TunnelProvider>
  {children}
</TunnelProvider>
```

Multiple Providers create independent scopes — functions registered under one Provider are not visible to another.

### `useTunnel()`

Hook that returns `{ call, callAsync, has, onReady }` for invoking tunneled functions.

```tsx
const { call, callAsync, has, onReady } = useTunnel();

if (has("onSave")) {
  call("onSave", formData);
}
```

- `call(key, ...args)` — Calls the registered function. Returns `undefined` if no function is registered for that key. In development, logs a warning.
- `callAsync(key, ...args)` — Like `call`, but returns a `Promise`. If the function isn't registered yet, waits until it is, then calls it. Useful when mount order is uncertain.
- `has(key)` — Returns `true` if a function is registered for that key.
- `onReady(key, callback)` — Calls `callback` with the registered function immediately if available, or when it becomes available. Returns an unsubscribe function.

All methods are fully typed — keys are autocompleted and arguments are type-checked.

#### `callAsync` — handling async functions and deferred calls

```tsx
// Call an async tunnel function and await the result
const data = await callAsync("fetchData", userId);

// Or call a function that hasn't been registered yet — it will wait
useEffect(() => {
  callAsync("initialize", config).then(() => {
    console.log("initialized");
  });
}, [callAsync]);
```

#### `onReady` — react to function availability

```tsx
useEffect(() => {
  const unsubscribe = onReady("initialize", (fn) => {
    // fn is the registered function, fully typed
    fn(config);
  });
  return unsubscribe;
}, [onReady]);
```

### `useTunnelFunction(key, fn)`

Hook that registers a function in the tunnel. Automatically unregisters on unmount.

```tsx
useTunnelFunction("onSave", (data: FormData) => {
  console.log(data);
});
```

Returns the same function passed in, preserving its type.

## Multiple Tunnels

Create separate tunnels for different concerns:

```tsx
const formTunnel = createTunnel<{
  submit: () => void;
  reset: () => void;
}>();

const navTunnel = createTunnel<{
  navigate: (path: string) => void;
}>();
```

Each tunnel has its own Provider and hooks — they don't interfere.

## When to Use tunnel-fn

**Good fit:**

- **Sibling communication** — Two components under the same Provider need to talk without lifting state to a common parent.
- **Scoped imperative actions** — `showToast()`, `openModal()`, `scrollToTop()` — fire-and-forget commands scoped to a subtree.
- **Decoupled feature modules** — A toolbar triggers actions defined in a content panel, without either knowing about the other's internals.
- **Plugin-style architectures** — A host component defines the tunnel type, and dynamically-loaded children register implementations.

**Not a good fit:**

- **Parent → child communication** — Use props. Tunnels are for sideways/upward communication.
- **Global cross-tree state** — If you need shared state across the entire app, use Zustand, Jotai, or Redux. Tunnels scope to a Provider subtree.
- **Replacing state management** — Tunnels pass *functions*, not *data*. If you need reactive state, use state management.
- **High-frequency calls** — Tunnels are ref-based (no re-renders), but rapid polling or animation-frame calls are better served by direct refs or pub/sub.

## Dev Warnings

In development (`NODE_ENV !== "production"`), tunnel-fn logs warnings to help catch common mistakes:

| Warning | Cause | Fix |
|---------|-------|-----|
| **No function registered** | `call("key")` when no component has registered that key | Ensure the registering component is mounted before calling |
| **Duplicate registration** | Two components register the same key under one Provider | Use separate keys or separate tunnels |
| **Call during render** | `call()` invoked directly in the component body | Move to an event handler, `useEffect`, or callback |
| **Registration churn** | A function is re-registered rapidly (>3×/sec) | Wrap the function in `useCallback()` before passing to `useTunnelFunction` |

## Migration from v0.x

v1.0 is a full rewrite with breaking changes.

| v0.x | v1.0 |
|------|------|
| `useTunnel()` returns `{ callTunnel }` | `useTunnel()` returns `{ call, has }` |
| `callTunnel(key, param)` (single param) | `call(key, ...args)` (variadic, typed) |
| `useTunnelFunction(key, fn)` (untyped) | `useTunnelFunction(key, fn)` (fully typed) |
| No Provider needed | `TunnelProvider` required |
| Global shared context | Scoped per Provider |
| `Function` type (no safety) | Full generic type safety |

### Before (v0.x)

```tsx
import { useTunnel, useTunnelFunction } from "tunnel-fn";

const { callTunnel } = useTunnel();
callTunnel("myFunc", someParam);

useTunnelFunction("myFunc", (param) => { ... });
```

### After (v1.0)

```tsx
import { createTunnel } from "tunnel-fn";

const { TunnelProvider, useTunnel, useTunnelFunction } = createTunnel<{
  myFunc: (param: string) => void;
}>();

// Wrap tree with <TunnelProvider>
const { call } = useTunnel();
call("myFunc", someParam);

useTunnelFunction("myFunc", (param) => { ... });
```

## License

ISC - [Felix Fernando](https://github.com/FelixFern)
