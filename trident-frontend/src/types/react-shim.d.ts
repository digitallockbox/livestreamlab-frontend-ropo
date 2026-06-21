declare module "react" {
    export type ReactNode = unknown;

    export type MutableRefObject<T> = {
        current: T;
    };

    export type Context<T> = {
        Provider: (props: { value: T; children?: JSX.Element | JSX.Element[] }) => JSX.Element;
    };

    export function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void];
    export function useRef<T>(initial: T): MutableRefObject<T>;
    export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
    export function useMemo<T>(factory: () => T, deps?: unknown[]): T;
    export function useContext<T>(ctx: Context<T>): T;
    export function createContext<T>(defaultValue: T): Context<T>;

    export class Component<P = Record<string, unknown>, S = Record<string, unknown>> {
        constructor(props: P);
        props: P;
        state: S;
        setState(state: Partial<S>): void;
        render(): JSX.Element | null;
    }
}
