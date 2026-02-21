import { useCallback, useRef, useState } from "react";
import ComponentA from "./components/ComponentA";
import ComponentB from "./components/ComponentB";
import { TunnelProvider } from "./tunnel";

export interface LogEntry {
  component: "A" | "B";
  fn: string;
  args: string;
}

interface TimestampedLog extends LogEntry {
  time: string;
}

const ExamplePreview = () => {
  const [logs, setLogs] = useState<TimestampedLog[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((entry: LogEntry) => {
    const now = new Date();
    const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");
    setLogs((prev) => [...prev, { ...entry, time }]);
    setTimeout(() => {
      const el = logContainerRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, 0);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="p-5 border rounded-xl border-zinc-800 bg-zinc-900/50">
        <TunnelProvider>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg border-zinc-800 bg-zinc-900">
              <ComponentA onLog={addLog} />
            </div>
            <div className="p-4 border rounded-lg border-zinc-800 bg-zinc-900">
              <ComponentB onLog={addLog} />
            </div>
          </div>
        </TunnelProvider>
      </div>
      <div className="p-4 border rounded-xl border-zinc-800 bg-black/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-zinc-500">Event Log</span>
          {logs.length > 0 && (
            <button
              onClick={() => setLogs([])}
              className="text-xs transition-colors text-zinc-600 hover:text-zinc-400"
            >
              Clear
            </button>
          )}
        </div>
        <div
          ref={logContainerRef}
          className="overflow-y-auto font-mono text-xs h-28"
        >
          {logs.length === 0 ? (
            <p className="text-zinc-600">
              Click a button above to see tunnel calls...
            </p>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                className="flex items-baseline gap-1.5 py-1 border-b border-zinc-900"
              >
                <span className="text-zinc-700 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-zinc-600 shrink-0">{log.time}</span>
                <span
                  className={`shrink-0 ${log.component === "A" ? "text-emerald-400" : "text-blue-400"}`}
                >
                  Component{log.component}
                </span>
                <span className="text-zinc-600 shrink-0">&rarr;</span>
                <span className="text-amber-400 shrink-0">{log.fn}</span>
                <span className="text-zinc-600">(</span>
                <span className="truncate text-violet-400">{log.args}</span>
                <span className="text-zinc-600">)</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamplePreview;
