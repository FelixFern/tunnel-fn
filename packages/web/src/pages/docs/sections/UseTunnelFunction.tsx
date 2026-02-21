import { CodeBlock } from "@/components/CodeBlock";
import { InlineCode } from "@/components/InlineCode";
import { code } from "../data";

export function UseTunnelFunction() {
  return (
    <section
      id="use-tunnel-function"
      className="scroll-mt-24 border-t border-zinc-800 pt-12"
    >
      <h2 className="text-2xl font-bold">
        <InlineCode>useTunnelFunction(key, fn)</InlineCode>
      </h2>
      <p className="mt-3 text-zinc-400">
        Hook that registers a function in the tunnel. Automatically
        unregisters on unmount. Returns the same function passed in,
        preserving its type.
      </p>
      <div className="mt-4">
        <CodeBlock
          title="Register a function"
          code={code.useTunnelFunction}
          lang="tsx"
        />
      </div>
    </section>
  );
}
