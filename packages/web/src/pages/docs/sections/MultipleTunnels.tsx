import { CodeBlock } from "@/components/CodeBlock";
import { code } from "../data";

export function MultipleTunnels() {
  return (
    <section
      id="multiple-tunnels"
      className="scroll-mt-24 border-t border-zinc-800 pt-12"
    >
      <h2 className="text-2xl font-bold">Multiple Tunnels</h2>
      <p className="mt-3 text-zinc-400">
        Create separate tunnels for different concerns. Each tunnel has its
        own Provider and hooks — they don't interfere.
      </p>
      <div className="mt-4">
        <CodeBlock
          title="Separate tunnels"
          code={code.multipleTunnels}
          lang="tsx"
        />
      </div>
    </section>
  );
}
