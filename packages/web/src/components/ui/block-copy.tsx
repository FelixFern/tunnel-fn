"use client";

import { CheckIcon, ClipboardIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button, ButtonProps } from "./button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./tooltip";

export function BlockCopyButton({
	code,
	...props
}: {
	code: string;
} & ButtonProps) {
	const [hasCopied, setHasCopied] = React.useState(false);

	React.useEffect(() => {
		setTimeout(() => {
			setHasCopied(false);
		}, 2000);
	}, [hasCopied]);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						size="icon"
						variant="ghost"
						className="h-7 w-7 rounded-[6px] [&_svg]:size-3.5"
						onClick={() => {
							navigator.clipboard.writeText(code);
							toast.success("Copied to clipboard");

							setHasCopied(true);
						}}
						{...props}
					>
						<span className="sr-only">Copy</span>
						{hasCopied ? <CheckIcon /> : <ClipboardIcon />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>Copy code</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
