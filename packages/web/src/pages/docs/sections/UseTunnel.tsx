import { CodeBlock } from "@/components/CodeBlock";
import { InlineCode } from "@/components/InlineCode";
import { code } from "../data";

export function UseTunnel() {
  return (
    <section
      id="use-tunnel"
      className="scroll-mt-24 border-t border-zinc-800 pt-12"
    >
      <h2 className="text-2xl font-bold">
        <InlineCode>useTunnel()</InlineCode>
      </h2>
      <p className="mt-3 text-zinc-400">
        Hook that returns{" "}
        <InlineCode>{"{ call, callAsync, has, onReady }"}</InlineCode> for
        invoking tunneled functions. All methods are fully typed — keys are
        autocompleted and arguments are type-checked.
      </p>

      <div className="mt-4">
        <CodeBlock
          title="Basic usage"
          code={code.useTunnelBasic}
          lang="tsx"
        />
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h3 className="text-lg font-semibold">
            <InlineCode>call(key, ...args)</InlineCode>
          </h3>
          <p className="mt-2 text-sm text-zinc-400">
            Calls the registered function synchronously. Returns{" "}
            <InlineCode>undefined</InlineCode> if no function is registered
            for that key. In development, logs a warning.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">
            <InlineCode>callAsync(key, ...args)</InlineCode>
          </h3>
          <p className="mt-2 text-sm text-zinc-400">
            Like <InlineCode>call</InlineCode>, but returns a{" "}
            <InlineCode>Promise</InlineCode>. If the function isn't
            registered yet, waits until it is, then calls it. Useful when
            mount order is uncertain.
          </p>
          <div className="mt-3">
            <CodeBlock
              title="callAsync examples"
              code={code.callAsync}
              lang="tsx"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">
            <InlineCode>has(key)</InlineCode>
          </h3>
          <p className="mt-2 text-sm text-zinc-400">
            Returns <InlineCode>true</InlineCode> if a function is
            registered for that key. Useful for conditional rendering or
            guarding calls.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">
            <InlineCode>onReady(key, callback)</InlineCode>
          </h3>
          <p className="mt-2 text-sm text-zinc-400">
            Calls <InlineCode>callback</InlineCode> with the registered
            function immediately if available, or when it becomes available.
            Returns an unsubscribe function.
          </p>
          <div className="mt-3">
            <CodeBlock
              title="onReady with cleanup"
              code={code.onReady}
              lang="tsx"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
