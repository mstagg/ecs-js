import { Entity } from '.';
import { AnyComponent, ComponentType } from '../Component';

export type EntityTree<T extends AnyComponent> = Map<ComponentType<T>, T>
export type EntityId = number
export type AnyEntity = Entity<AnyComponent>