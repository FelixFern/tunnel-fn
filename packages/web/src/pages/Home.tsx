import { useState } from "react";
import { CodeBlock, CopyButton } from "../components/CodeBlock";
import ExamplePreview from "../components/Example/ExamplePreview";
import { setupCode, usageCode } from "../example";

const installCommands = [
  { label: "npm", cmd: "npm install @felixfern/tunnel-fn" },
  { label: "pnpm", cmd: "pnpm add @felixfern/tunnel-fn" },
  { label: "yarn", cmd: "yarn add @felixfern/tunnel-fn" },
  { label: "bun", cmd: "bun add @felixfern/tunnel-fn" },
];

function Home() {
  const [pm, setPm] = useState(0);

  return (
    <div className="max-w-4xl px-6 mx-auto">
      <section className="py-16 md:py-24">
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          Type-safe function tunneling
          <br />
          <span className="text-zinc-500">across React components.</span>
        </h1>
        <p className="max-w-xl mt-4 text-base text-zinc-400 md:text-lg">
          Call functions registered in distant components without prop drilling.
          Fully typed, zero re-renders, scoped via context.
        </p>

        <div className="mt-8 overflow-hidden bg-black border rounded-xl border-zinc-800">
          <div className="flex items-center gap-1 border-b border-zinc-800 px-3 py-1.5">
            {installCommands.map((item, i) => (
              <button
                key={item.label}
                onClick={() => setPm(i)}
                className={`rounded px-2 py-0.5 font-mono text-xs transition-colors ${
                  pm === i
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-600 hover:text-zinc-400"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-2.5">
            <code className="font-mono text-sm text-zinc-300">
              {installCommands[pm].cmd}
            </code>
            <CopyButton text={installCommands[pm].cmd} />
          </div>
        </div>
      </section>

      <section className="pb-16">
        <h2 className="mb-1 text-lg font-semibold">Try it</h2>
        <p className="mb-6 text-sm text-zinc-500">
          Two sibling components communicating through a tunnel — no shared
          state, no prop drilling.
        </p>
        <ExamplePreview />
      </section>

      <section className="pb-16">
        <h2 className="mb-1 text-lg font-semibold">How it works</h2>
        <p className="mb-6 text-sm text-zinc-500">
          Create a tunnel, register functions, call them from anywhere in the
          tree.
        </p>
        <div className="flex flex-col gap-4">
          <CodeBlock title="tunnel.ts" code={setupCode} lang="ts" />
          <CodeBlock title="components.tsx" code={usageCode} lang="tsx" />
        </div>
      </section>

      <section className="pb-16">
        <h2 className="mb-6 text-lg font-semibold">Why tunnel-fn</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Type-safe",
              desc: "Full TypeScript inference — keys, arguments, and return types are all checked at compile time.",
            },
            {
              title: "Zero re-renders",
              desc: "Ref-based internals. Registering or calling functions never triggers a React re-render.",
            },
            {
              title: "Scoped",
              desc: "Each TunnelProvider creates an isolated scope. Multiple tunnels coexist without interference.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-5 border rounded-xl border-zinc-800 bg-zinc-900/30"
            >
              <h3 className="font-medium">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
