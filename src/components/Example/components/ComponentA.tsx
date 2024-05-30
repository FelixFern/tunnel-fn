import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTunnel, useTunnelFunction } from "tunnel-fn";

const ComponentA = () => {
	const { callTunnel } = useTunnel();

	const funcA = useTunnelFunction("funcA", () => {
		toast.success("Called FuncA");
	});

	return (
		<div className="flex gap-2">
			<Button onClick={() => funcA()}>Call FuncA</Button>
			<Button
				onClick={() => {
					callTunnel("funcB", 1);
				}}
			>
				Call FuncB
			</Button>
		</div>
	);
};

export default ComponentA;
