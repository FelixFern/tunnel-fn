import { useState } from "react";
import { BlockCopyButton } from "./block-copy";

const packageManagers = [
	{ name: "npm", command: "npm install @felixfern/tunnel-fn" },
	{ name: "yarn", command: "yarn add @felixfern/tunnel-fn" },
	{ name: "pnpm", command: "pnpm add @felixfern/tunnel-fn" },
	{ name: "bun", command: "bun add @felixfern/tunnel-fn" },
];

const InstallBlock = () => {
	const [active, setActive] = useState(0);
	const { command } = packageManagers[active];
	const parts = command.split(" ");

	return (
		<div className="w-full overflow-hidden rounded-md border-[1px] bg-black text-white">
			<div className="flex items-center gap-1 border-b border-white/10 px-3 py-1.5">
				{packageManagers.map((pm, i) => (
					<button
						key={pm.name}
						onClick={() => setActive(i)}
						className={`rounded px-2 py-0.5 font-mono text-xs transition-colors ${
							active === i
								? "bg-white/15 text-white"
								: "text-white/50 hover:text-white/80"
						}`}
					>
						{pm.name}
					</button>
				))}
			</div>
			<div className="flex items-center justify-between px-4 py-2 font-mono">
				<div className="flex gap-2">
					<p className="font-medium">{parts[0]}</p>
					<p className="text-slate-300">
						{parts.slice(1).join(" ")}
					</p>
				</div>
				<BlockCopyButton code={command} />
			</div>
		</div>
	);
};

export default InstallBlock;
