import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import "./App.css";
import { Alert, AlertTitle } from "./components/ui/alert";
import { Badge } from "./components/ui/badge";
import BlockChunk from "./components/ui/block-chunk";
import { Toaster } from "./components/ui/sonner";

function App() {
	return (
		<div className="relative w-screen h-screen overflow-hidden">
			<Toaster />
			<div className="dotted"></div>
			<div className="flex items-center w-screen h-screen gap-6 p-16">
				<div className="flex flex-col justify-start w-2/5 gap-4 text-balance">
					<div>
						<Alert variant={"destructive"} className="mb-6">
							<ExclamationTriangleIcon className="w-4 h-4" />
							<AlertTitle>
								Not tested in production, please be careful.
							</AlertTitle>
						</Alert>
						<h1 className="flex items-center gap-2 font-mono text-4xl font-bold">
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
					<p className="w-3/4">
						a simple and lightweight npm package to deal with
						passing function across component like maniac in React.
					</p>

					<BlockChunk code="npm install tunnel-fn@latest"></BlockChunk>
				</div>
				<div></div>
			</div>
		</div>
	);
}

export default App;
