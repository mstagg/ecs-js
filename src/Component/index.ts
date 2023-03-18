export abstract class IndeterminateComponent {}
export abstract class DeterminateComponent<T extends string> { readonly __TYPE_ID__: T; }

export type AnyComponent = DeterminateComponent<string>;
// eslint-disable-next-line @typescript-eslint/ban-types
export type ComponentTypeId = Function;