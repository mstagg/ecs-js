export abstract class IndeterminateComponent {}
export abstract class DeterminateComponent<T extends string> { readonly __TYPE_ID__: T; }

export type AnyComponent = DeterminateComponent<string>;
export type ComponentType<T extends AnyComponent> = new (...args: any[]) => T;