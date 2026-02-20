import * as React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useLayoutEffect,
	useRef,
	type ReactNode,
} from "react";

type TunnelFunctionMap = Record<string, (...args: never[]) => unknown>;

type Awaited<T> = T extends Promise<infer U> ? U : T;

type TunnelStore<T extends TunnelFunctionMap> = {
	register<K extends keyof T>(key: K, fn: T[K]): void;
	unregister<K extends keyof T>(key: K): void;
	call<K extends keyof T>(
		key: K,
		...args: Parameters<T[K]>
	): ReturnType<T[K]> | undefined;
	callAsync<K extends keyof T>(
		key: K,
		...args: Parameters<T[K]>
	): Promise<Awaited<ReturnType<T[K]>> | undefined>;
	has<K extends keyof T>(key: K): boolean;
	onReady<K extends keyof T>(key: K, callback: (fn: T[K]) => void): () => void;
};

/**
 * Creates a type-safe tunnel for passing functions across components via context.
 *
 * @example
 * ```tsx
 * const { TunnelProvider, useTunnel, useTunnelFunction } = createTunnel<{
 *   onSave: (data: string) => void;
 *   getCount: () => number;
 * }>();
 * ```
 */
export function createTunnel<T extends TunnelFunctionMap>() {
	const TunnelContext = createContext<TunnelStore<T> | null>(null);

	function TunnelProvider({ children }: { children: ReactNode }) {
		const storeRef = useRef<Map<keyof T, T[keyof T]>>(new Map());
		const listenersRef = useRef<Map<keyof T, Set<(fn: T[keyof T]) => void>>>(new Map());

		const isRenderPhaseRef = useRef(false);
		const registrationCountRef = useRef<Map<keyof T, number[]>>(new Map());
		const churnWarnedRef = useRef<Set<keyof T>>(new Set());

		// Track render phase: set true synchronously during render, false in effect
		if (process.env.NODE_ENV !== "production") {
			isRenderPhaseRef.current = true;
		}

		useLayoutEffect(() => {
			isRenderPhaseRef.current = false;
		});

		const store = useRef<TunnelStore<T>>({
			register<K extends keyof T>(key: K, fn: T[K]) {
				if (process.env.NODE_ENV !== "production") {
					// Warn: duplicate key registration
					if (storeRef.current.has(key)) {
						console.warn(
							`[tunnel-fn] Duplicate registration for key "${String(key)}". ` +
								`Another component already registered this key. ` +
								`Only the last registration will be active — this is likely a bug.`
						);
					}

					// Track: registration churn (unstable fn reference)
					const now = Date.now();
					const timestamps = registrationCountRef.current.get(key) ?? [];
					timestamps.push(now);
					// Keep only timestamps from the last second
					const recent = timestamps.filter((t) => now - t < 1000);
					registrationCountRef.current.set(key, recent);

					if (recent.length > 3 && !churnWarnedRef.current.has(key)) {
						churnWarnedRef.current.add(key);
						console.warn(
							`[tunnel-fn] Function for key "${String(key)}" is being re-registered rapidly ` +
								`(${recent.length} times in <1s). This usually means the function passed to ` +
								`useTunnelFunction is recreated every render. Wrap it in useCallback() to fix this:\n\n` +
								`  const handler = useCallback((...) => { ... }, [deps]);\n` +
								`  useTunnelFunction("${String(key)}", handler);`
						);
					}
				}

				storeRef.current.set(key, fn);

				const listeners = listenersRef.current.get(key);
				if (listeners) {
					listeners.forEach((cb) => cb(fn as T[keyof T]));
					listenersRef.current.delete(key);
				}
			},
			unregister<K extends keyof T>(key: K) {
				storeRef.current.delete(key);
			},
			call<K extends keyof T>(key: K, ...args: Parameters<T[K]>) {
				if (process.env.NODE_ENV !== "production") {
					// Warn: call() during render phase
					if (isRenderPhaseRef.current) {
						console.warn(
							`[tunnel-fn] call("${String(key)}") was invoked during the render phase. ` +
								`Tunnel functions should only be called from event handlers, useEffect, or callbacks — ` +
								`never directly during render. This can cause unpredictable behavior.`
						);
					}
				}

				const fn = storeRef.current.get(key);
				if (!fn) {
					if (process.env.NODE_ENV !== "production") {
						console.warn(
							`[tunnel-fn] No function registered for key "${String(key)}". ` +
								`Make sure a component with useTunnelFunction("${String(key)}", ...) is mounted.`
						);
					}
					return undefined as ReturnType<T[K]> | undefined;
				}
				return (fn as T[K])(...args) as ReturnType<T[K]>;
			},
			has<K extends keyof T>(key: K) {
				return storeRef.current.has(key);
			},
			callAsync<K extends keyof T>(key: K, ...args: Parameters<T[K]>) {
				const fn = storeRef.current.get(key);
				if (fn) {
					return Promise.resolve((fn as T[K])(...args)).then(
						(v) => v as Awaited<ReturnType<T[K]>>
					);
				}
				return new Promise<Awaited<ReturnType<T[K]>> | undefined>((resolve) => {
					const listener = (registeredFn: T[keyof T]) => {
						resolve(
							Promise.resolve((registeredFn as T[K])(...args)).then(
								(v) => v as Awaited<ReturnType<T[K]>>
							) as unknown as Awaited<ReturnType<T[K]>>
						);
					};
					let set = listenersRef.current.get(key);
					if (!set) {
						set = new Set();
						listenersRef.current.set(key, set);
					}
					set.add(listener);
				});
			},
			onReady<K extends keyof T>(key: K, callback: (fn: T[K]) => void) {
				const existing = storeRef.current.get(key);
				if (existing) {
					callback(existing as T[K]);
					return () => {};
				}
				const listener = (fn: T[keyof T]) => callback(fn as T[K]);
				let set = listenersRef.current.get(key);
				if (!set) {
					set = new Set();
					listenersRef.current.set(key, set);
				}
				set.add(listener);
				return () => {
					set!.delete(listener);
				};
			},
		}).current;

		return (
			<TunnelContext.Provider value={store}>
				{children}
			</TunnelContext.Provider>
		);
	}

	function useTunnelStore(): TunnelStore<T> {
		const store = useContext(TunnelContext);
		if (!store) {
			throw new Error(
				"[tunnel-fn] useTunnel/useTunnelFunction must be used within a <TunnelProvider>. " +
					"Wrap your component tree with the TunnelProvider from createTunnel()."
			);
		}
		return store;
	}

	function useTunnel() {
		const store = useTunnelStore();

		const call = useCallback(
			<K extends keyof T>(key: K, ...args: Parameters<T[K]>): ReturnType<T[K]> | undefined => {
				return store.call(key, ...args);
			},
			[store]
		);

		const callAsync = useCallback(
			<K extends keyof T>(key: K, ...args: Parameters<T[K]>): Promise<Awaited<ReturnType<T[K]>> | undefined> => {
				return store.callAsync(key, ...args);
			},
			[store]
		);

		const has = useCallback(
			<K extends keyof T>(key: K): boolean => {
				return store.has(key);
			},
			[store]
		);

		const onReady = useCallback(
			<K extends keyof T>(key: K, callback: (fn: T[K]) => void): (() => void) => {
				return store.onReady(key, callback);
			},
			[store]
		);

		return { call, callAsync, has, onReady } as const;
	}

	function useTunnelFunction<K extends keyof T>(key: K, fn: T[K]): T[K] {
		const store = useTunnelStore();

		useEffect(() => {
			store.register(key, fn);
			return () => {
				store.unregister(key);
			};
		}, [store, key, fn]);

		return fn;
	}

	return { TunnelProvider, useTunnel, useTunnelFunction } as const;
}
