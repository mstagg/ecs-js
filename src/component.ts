export abstract class IndeterminateComponent {}
export abstract class DeterminateComponent<T extends string> { readonly __TYPE_ID__: T };