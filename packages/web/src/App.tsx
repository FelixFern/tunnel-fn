import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import "./App.css";
import { Example } from "./components/Example";
import ExamplePreview from "./components/Example/ExamplePreview";
import { Alert, AlertTitle } from "./components/ui/alert";
import { Badge } from "./components/ui/badge";
import InstallBlock from "./components/ui/install-block";
import { Toaster } from "./components/ui/sonner";

import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <div className="relative w-screen min-w-0 min-h-screen">
      <Analytics />
      <Toaster />
      <div className="dotted"></div>
      <div className="flex flex-col w-screen min-h-screen gap-4 p-4 ustify-center md:gap-16 md:p-16 md:flex-row">
        <div className="flex flex-col w-full gap-4 md:justify-center md:w-4/5 text-balance">
          <div>
            <Alert variant={"destructive"} className="mb-6">
              <ExclamationTriangleIcon className="w-4 h-4" />
              <AlertTitle>
                Not battle-tested in production, please be careful.
              </AlertTitle>
            </Alert>
            <h1 className="flex items-center justify-center gap-2 font-mono text-4xl font-bold md:justify-start">
              <img src="./tunnel-fn.svg" className="w-16 h-16"></img>
              <div className="flex flex-col">
                tunnel-fn <Badge className="w-fit">v1.0.0</Badge>
              </div>
            </h1>
          </div>
          <p className="w-full text-center md:w-3/4 md:text-left">
            Type-safe function tunneling across React components via context. No
            more prop drilling callbacks.
          </p>
          <InstallBlock />
          <ExamplePreview />
        </div>
        <div className="items-center justify-center flex-grow w-full overflow-auto md:flex">
          <Example />
        </div>
      </div>
    </div>
  );
}

export default App;
