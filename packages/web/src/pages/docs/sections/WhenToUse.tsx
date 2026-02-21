import { goodFit, notFit } from "../data";

export function WhenToUse() {
  return (
    <section
      id="when-to-use"
      className="scroll-mt-24 border-t border-zinc-800 pt-12"
    >
      <h2 className="text-2xl font-bold">When to Use</h2>

      <h3 className="mt-6 mb-3 text-lg font-semibold text-emerald-400">
        Good fit
      </h3>
      <div className="space-y-3">
        {goodFit.map((item) => (
          <div
            key={item.title}
            className="p-4 border rounded-lg border-zinc-800 bg-zinc-900/30"
          >
            <h4 className="text-sm font-medium">{item.title}</h4>
            <p className="mt-1 text-sm text-zinc-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <h3 className="mt-8 mb-3 text-lg font-semibold text-red-400">
        Not a good fit
      </h3>
      <div className="space-y-3">
        {notFit.map((item) => (
          <div
            key={item.title}
            className="p-4 border rounded-lg border-zinc-800 bg-zinc-900/30"
          >
            <h4 className="text-sm font-medium">{item.title}</h4>
            <p className="mt-1 text-sm text-zinc-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
