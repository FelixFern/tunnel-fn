import { CodeBlock } from "@/components/CodeBlock";
import { InlineCode } from "@/components/InlineCode";
import { code } from "../data";

export function TunnelProvider() {
  return (
    <section
      id="tunnel-provider"
      className="scroll-mt-24 border-t border-zinc-800 pt-12"
    >
      <h2 className="text-2xl font-bold">
        <InlineCode>TunnelProvider</InlineCode>
      </h2>
      <p className="mt-3 text-zinc-400">
        React component that scopes the tunnel. All{" "}
        <InlineCode>useTunnel</InlineCode> and{" "}
        <InlineCode>useTunnelFunction</InlineCode> calls must be within a
        Provider.
      </p>
      <p className="mt-2 text-sm text-zinc-500">
        Multiple Providers create independent scopes — functions registered
        under one Provider are not visible to another.
      </p>
      <div className="mt-4">
        <CodeBlock
          title="Scoped providers"
          code={code.providerScoping}
          lang="tsx"
        />
      </div>
    </section>
  );
}
