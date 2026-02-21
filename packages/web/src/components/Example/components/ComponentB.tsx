import { useCallback, useState } from "react";
import { useTunnel, useTunnelFunction } from "../tunnel";
import type { LogEntry } from "../ExamplePreview";

interface Props {
  onLog: (entry: LogEntry) => void;
}

const ComponentB = ({ onLog }: Props) => {
  const [counter, setCounter] = useState(0);
  const { call } = useTunnel();

  useTunnelFunction(
    "increment",
    useCallback(
      (amount: number) => {
        setCounter((c) => c + amount);
        onLog({ component: "B", fn: "increment", args: String(amount) });
      },
      [onLog],
    ),
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
        <span className="text-sm font-medium text-zinc-300">Component B</span>
      </div>
      <p className="text-xs text-zinc-500">
        Registers <code className="text-blue-400">increment</code> &middot;
        Calls <code className="text-emerald-400">greet</code>
      </p>
      <p className="font-mono text-lg text-white">
        Counter: <span className="text-blue-400">{counter}</span>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => call("greet", "Hi from B!")}
          className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
        >
          call("greet", "Hi from B!")
        </button>
        <button
          onClick={() => call("increment", 5)}
          className="rounded-md bg-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-600"
        >
          call("increment", 5)
        </button>
      </div>
    </div>
  );
};

export default ComponentB;
