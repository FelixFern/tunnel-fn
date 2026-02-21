import { InlineCode } from "@/components/InlineCode";
import { devWarnings } from "../data";

export function DevWarnings() {
  return (
    <section
      id="dev-warnings"
      className="scroll-mt-24 border-t border-zinc-800 pt-12"
    >
      <h2 className="text-2xl font-bold">Dev Warnings</h2>
      <p className="mt-3 mb-6 text-zinc-400">
        In development (<InlineCode>NODE_ENV !== "production"</InlineCode>),
        tunnel-fn logs warnings to help catch common mistakes.
      </p>
      <div className="overflow-x-auto border rounded-xl border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900">
              <th className="px-4 py-3 font-medium text-left text-zinc-400">
                Warning
              </th>
              <th className="px-4 py-3 font-medium text-left text-zinc-400">
                Cause
              </th>
              <th className="px-4 py-3 font-medium text-left text-zinc-400">
                Fix
              </th>
            </tr>
          </thead>
          <tbody>
            {devWarnings.map((row) => (
              <tr
                key={row.warning}
                className="border-b border-zinc-800 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                  {row.warning}
                </td>
                <td className="px-4 py-3 text-zinc-400">{row.cause}</td>
                <td className="px-4 py-3 text-zinc-400">{row.fix}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
