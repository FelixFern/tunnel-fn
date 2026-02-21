import { CodeBlock } from "@/components/CodeBlock";
import { InlineCode } from "@/components/InlineCode";
import { code } from "../data";

export function GettingStarted() {
  return (
    <section id="getting-started" className="scroll-mt-24">
      <h2 className="text-2xl font-bold">Getting Started</h2>
      <p className="mt-3 text-zinc-400">
        Type-safe function tunneling across React components via context. Call
        functions registered in distant components without prop drilling.
      </p>
      <p className="mt-2 text-sm text-zinc-500">
        Requires React &gt;= 16.8.0 as a peer dependency.
      </p>

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">1. Define your tunnel</h3>
        <CodeBlock title="tunnel.ts" code={code.defineTunnel} lang="tsx" />

        <h3 className="text-lg font-semibold">2. Wrap with Provider</h3>
        <CodeBlock title="App.tsx" code={code.wrapProvider} lang="tsx" />

        <h3 className="text-lg font-semibold">3. Register functions</h3>
        <CodeBlock
          title="ComponentA.tsx"
          code={code.registerFn}
          lang="tsx"
        />

        <h3 className="text-lg font-semibold">
          4. Call from anywhere in the tree
        </h3>
        <CodeBlock title="ComponentB.tsx" code={code.callFn} lang="tsx" />

        <p className="text-sm text-zinc-400">
          Everything is fully typed —{" "}
          <InlineCode>call("showAlert", 123)</InlineCode> is a type error
          because <InlineCode>showAlert</InlineCode> expects a{" "}
          <InlineCode>string</InlineCode>.
        </p>
      </div>
    </section>
  );
}
