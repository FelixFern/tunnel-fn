import { createTunnel } from "@felixfern/tunnel-fn";

type ExampleTunnelMap = {
	funcA: () => void;
	funcB: (number: number) => void;
};

export const { TunnelProvider, useTunnel, useTunnelFunction } =
	createTunnel<ExampleTunnelMap>();
