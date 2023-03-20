import { ComponentType, DeterminateComponent } from '../Component';
import { ECS } from '../ECS';
import { ECSResources } from '../ECS/types';
import { Entity } from '../entity';
import { EntityId } from '../Entity/types';
import { SystemProcess } from './types';

export class System<T extends ECSResources, K extends DeterminateComponent<string>> {
    private _entities: Map<EntityId, Entity<K>> = new Map();
    private _allowedComponents: ComponentType<K>[];
    private _process: SystemProcess<T, K>;

    constructor(process: SystemProcess<T, K>, allowedComponents: ComponentType<K>[]) {
        this._allowedComponents = allowedComponents;
        this._process = process;
    }

    isEntityAllowed = (entity: Entity<K>): boolean => {
        return this._allowedComponents.every(component => entity.hasComponent(component));
    };

    addEntity = (entity: Entity<K>) => {
        this._entities.set(entity.id, entity);
    };

    removeEntity = (entityId: EntityId) => {
        this._entities.delete(entityId);
    };

    run = (ecs: ECS<T>) => {
        this._process(ecs, [...this._entities.values()]);
    };
}