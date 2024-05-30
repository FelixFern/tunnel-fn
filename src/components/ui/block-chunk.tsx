import { BlockCopyButton } from "./block-copy";

const BlockChunk = ({ code }: { code: string }) => {
	return (
		<div className="font-mono w-full flex justify-between px-4 py-2 border-[1px] rounded-md items-center bg-black text-white">
			<div className="flex gap-2">
				<p className="font-medium">{code.split(" ")[0]}</p>
				<p className="text-slate-300">
					{code
						.split(" ")
						.filter((_, index) => index !== 0)
						.map((val) => ` ${val}`)}
				</p>
			</div>
			<BlockCopyButton code={code} />
		</div>
	);
};

export default BlockChunk;
