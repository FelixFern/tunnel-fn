import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import "./App.css";
import { Alert, AlertTitle } from "./components/ui/alert";
import { Badge } from "./components/ui/badge";
import BlockChunk from "./components/ui/block-chunk";
import { Toaster } from "./components/ui/sonner";

function App() {
	return (
		<div className="w-screen h-screen relative overflow-hidden">
			<Toaster />
			<div className="dotted"></div>
			<div className="flex items-center h-screen p-16 gap-6 w-screen">
				<div className="flex flex-col text-balance gap-4 justify-start w-2/5">
					<div>
						<Alert variant={"destructive"} className="mb-6">
							<ExclamationTriangleIcon className="h-4 w-4" />
							<AlertTitle>
								Not tested in production, please be careful.
							</AlertTitle>
						</Alert>
						<h1 className="text-4xl font-bold font-mono">
							Tunnel-fn{" "}
						</h1>
						<Badge>v0.1.2</Badge>
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
