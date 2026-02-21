import { createTunnel } from "@felixfern/tunnel-fn";

type DemoTunnelMap = {
	greet: (message: string) => void;
	increment: (amount: number) => void;
};

export const { TunnelProvider, useTunnel, useTunnelFunction } =
	createTunnel<DemoTunnelMap>();
