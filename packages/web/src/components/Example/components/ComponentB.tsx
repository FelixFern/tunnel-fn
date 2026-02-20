import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useTunnel, useTunnelFunction } from "../tunnel";

const ComponentB = () => {
	const [counter, setCounter] = useState(0);
	const { call } = useTunnel();

	useTunnelFunction("funcB", (number: number) => {
		setCounter(counter + 1);
		toast.success(`Called FuncB with parameter number: ${number}`);
	});

	return (
		<div className="flex flex-col items-start gap-2 md:items-center xl:flex-row ">
			<div className="flex flex-row gap-2">
				<Button onClick={() => call("funcB", 1)}>Call FuncB</Button>
				<Button onClick={() => call("funcA")}>Call FuncA</Button>
			</div>
			<p>Counter: {counter}</p>
		</div>
	);
};

export default ComponentB;
