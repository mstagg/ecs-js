import { Entity } from '.';
import { AnyComponent, ComponentTypeId } from '../Component';

export type EntityTree<T> = Map<ComponentTypeId, T>
export type EntityId = number
export type AnyEntity = Entity<AnyComponent>