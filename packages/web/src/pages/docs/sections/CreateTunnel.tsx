import { CodeBlock } from "@/components/CodeBlock";
import { InlineCode } from "@/components/InlineCode";
import { code } from "../data";

export function CreateTunnel() {
  return (
    <section
      id="create-tunnel"
      className="scroll-mt-24 border-t border-zinc-800 pt-12"
    >
      <h2 className="text-2xl font-bold">
        <InlineCode>{"createTunnel<T>()"}</InlineCode>
      </h2>
      <p className="mt-3 text-zinc-400">
        Creates a scoped tunnel instance. <InlineCode>T</InlineCode> is a
        record mapping function names to their signatures.
      </p>
      <div className="mt-4">
        <CodeBlock
          title="createTunnel"
          code={code.createTunnelTyped}
          lang="tsx"
        />
      </div>
      <p className="mt-4 text-sm text-zinc-400">
        Returns{" "}
        <InlineCode>
          {"{ TunnelProvider, useTunnel, useTunnelFunction }"}
        </InlineCode>
        .
      </p>
    </section>
  );
}
