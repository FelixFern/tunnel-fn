import { createContext, useCallback, useContext, useEffect } from "react";

type Tunnel = {
	[key: string]: Function;
};

const TunnelContext = createContext<Tunnel>({});

export const useTunnel = () => {
	const tunnel = useContext(TunnelContext);

	const callTunnel = useCallback(
		(key: string, param?: unknown) => {
			if (tunnel[key]) {
				tunnel[key](param);
			}
		},
		[tunnel]
	);
	return {
		callTunnel,
	};
};

export const useTunnelFunction = (key: string, fn: Function) => {
	const tunnel = useContext(TunnelContext);

	useEffect(() => {
		tunnel[key] = fn;

		return () => {
			delete tunnel[key];
		};
	}, [fn, key, tunnel]);

	return fn;
};
