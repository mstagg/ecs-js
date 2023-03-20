import { AnyComponent } from '../Component';
import { ECS } from '../ECS';
import { ECSResources } from '../ECS/types';
import { Entity } from '../entity';

export type SystemProcess<T extends ECSResources, K extends AnyComponent> = (ecs: ECS<T>, entities: Entity<K>[]) => void