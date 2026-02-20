import { TunnelProvider } from "./tunnel";
import ComponentA from "./components/ComponentA";
import ComponentB from "./components/ComponentB";

const ExamplePreview = () => {
	return (
		<div className="flex flex-col gap-2 mt-4">
			<h2 className="text-xl font-bold">Example</h2>
			<div className="border-slate-300 border-[1px] p-4 rounded-md flex flex-col gap-4 font-mono">
				App
				<TunnelProvider>
					<div className="p-4 border-slate-300 border-[1px] rounded-md flex flex-col gap-2">
						<p>Component A</p>
						<ComponentA />
					</div>
					<div className="p-4 border-slate-300 border-[1px] rounded-md flex flex-col gap-2">
						<p>Component B</p>
						<ComponentB />
					</div>
				</TunnelProvider>
			</div>
		</div>
	);
};

export default ExamplePreview;
