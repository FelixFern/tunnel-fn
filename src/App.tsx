import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import "./App.css";
import { Example } from "./components/Example";
import ExamplePreview from "./components/Example/ExamplePreview";
import { Alert, AlertTitle } from "./components/ui/alert";
import { Badge } from "./components/ui/badge";
import BlockChunk from "./components/ui/block-chunk";
import { Toaster } from "./components/ui/sonner";

function App() {
	return (
		<div className="relative w-screen h-screen">
			<Toaster />
			<div className="dotted"></div>
			<div className="flex flex-col items-center w-screen h-screen gap-4 p-4 md:gap-16 md:p-16 md:flex-row">
				<div className="flex flex-col justify-start w-full gap-4 md:w-2/5 text-balance">
					<div>
						<Alert variant={"destructive"} className="mb-6">
							<ExclamationTriangleIcon className="w-4 h-4" />
							<AlertTitle>
								Not battle-tested in production, please be
								careful.
							</AlertTitle>
						</Alert>
						<h1 className="flex items-center justify-center gap-2 font-mono text-4xl font-bold md:justify-start">
							<img
								src="./tunnel-fn.svg"
								className="w-16 h-16"
							></img>
							<div className="flex flex-col">
								Tunnel-fn{" "}
								<Badge className="w-fit">v0.1.2</Badge>
							</div>
						</h1>
					</div>
					<p className="w-full text-center md:w-3/4 md:text-left">
						a simple and lightweight npm package to deal with
						passing function across component like maniac in React.
					</p>
					<BlockChunk code="npm install tunnel-fn@latest"></BlockChunk>
					<ExamplePreview />
				</div>
				<div className="flex-grow">
					<Example />
				</div>
			</div>
		</div>
	);
}

export default App;
