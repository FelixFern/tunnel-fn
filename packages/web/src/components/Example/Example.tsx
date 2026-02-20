import {
	ExampleAppCode,
	ExampleComponentA,
	ExampleComponentB,
	ExampleSetupCode,
} from "@/example";
import CodePreview from "../CodePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const Example = () => {
	return (
		<div className="flex flex-col w-full gap-2">
			<Tabs defaultValue="tunnel">
				<TabsList>
					<TabsTrigger value="tunnel">tunnel.ts</TabsTrigger>
					<TabsTrigger value="app">App.tsx</TabsTrigger>
					<TabsTrigger value="componentA">ComponentA.tsx</TabsTrigger>
					<TabsTrigger value="componentB">ComponentB.tsx</TabsTrigger>
				</TabsList>
				<TabsContent value="tunnel">
					<CodePreview>{ExampleSetupCode}</CodePreview>
				</TabsContent>
				<TabsContent value="app">
					<CodePreview>{ExampleAppCode}</CodePreview>
				</TabsContent>
				<TabsContent value="componentA">
					<CodePreview>{ExampleComponentA}</CodePreview>
				</TabsContent>
				<TabsContent value="componentB">
					<CodePreview>{ExampleComponentB}</CodePreview>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Example;
