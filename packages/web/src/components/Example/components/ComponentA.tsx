import { useCallback } from "react";
import { useTunnel, useTunnelFunction } from "../tunnel";
import type { LogEntry } from "../ExamplePreview";

interface Props {
  onLog: (entry: LogEntry) => void;
}

const ComponentA = ({ onLog }: Props) => {
  const { call } = useTunnel();

  useTunnelFunction(
    "greet",
    useCallback(
      (message: string) => {
        onLog({ component: "A", fn: "greet", args: `"${message}"` });
      },
      [onLog],
    ),
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
        <span className="text-sm font-medium text-zinc-300">Component A</span>
      </div>
      <p className="text-xs text-zinc-500">
        Registers <code className="text-emerald-400">greet</code> &middot;
        Calls <code className="text-blue-400">increment</code>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => call("increment", 1)}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-500"
        >
          call("increment", 1)
        </button>
        <button
          onClick={() => call("greet", "Hello!")}
          className="rounded-md bg-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-600"
        >
          call("greet", "Hello!")
        </button>
      </div>
    </div>
  );
};

export default ComponentA;
