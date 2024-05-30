import { themes } from "prism-react-renderer";
import { CodeBlock } from "react-code-block";

const CodePreview = ({ children }: { children: string }) => {
	return (
		<CodeBlock code={children} language="ts" theme={themes.oceanicNext}>
			<CodeBlock.Code className="w-full p-6 bg-black shadow-lg rounded-xl">
				<CodeBlock.LineContent>
					<CodeBlock.Token />
				</CodeBlock.LineContent>
			</CodeBlock.Code>
		</CodeBlock>
	);
};

export default CodePreview;
