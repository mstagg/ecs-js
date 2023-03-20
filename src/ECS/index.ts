import { AnyComponent, ComponentType } from '../Component';
import { Entity } from '../entity';
import { AnyEntity, EntityId } from '../entity/types';
import { System } from '../System';
import { SystemProcess } from '../System/types';
import { ECSResources } from './types';

export class ECS<T extends ECSResources> {
    resources: T;
    entities: Map<EntityId, AnyEntity> = new Map();
    private _systems: System<T, AnyComponent>[] = [];
    private _nextEntityId: EntityId = 0;

    constructor(resources: T) {
        this.resources = resources;
    }

    private getNextEntityId = () => this._nextEntityId++;

    private addEntityToSystems = (entity: AnyEntity): void => {
        this._systems.forEach(system => {
            if(system.isEntityAllowed(entity)) {
                system.addEntity(entity);
            }
        });
    };

    private removeEntityFromSystems = (entityId: EntityId): void => {
        this._systems.forEach(system => {
            system.removeEntity(entityId);
        });
    };

    addSystem = <K extends AnyComponent>(systemProcess: SystemProcess<T, K>, allowedComponents: ComponentType<K>[]): void => {
        const system = new System(systemProcess, allowedComponents);
        this._systems.push(system);
    };

    runSystems = (): void => {
        this._systems.forEach(system => system.run(this));
    };

    addEntity = (...components: AnyComponent[]): AnyEntity => {
        const entityId = this.getNextEntityId();
        const entity = new Entity(entityId);
        components.forEach(component => entity.addComponent(component));

        this.entities.set(entityId, entity);
        this.addEntityToSystems(entity);

        return entity;
    };

    removeEntity = (entityId: EntityId): void => {
        this.entities.delete(entityId);
        this.removeEntityFromSystems(entityId);
    };

    getEntity = (entityId: EntityId): AnyEntity => {
        return this.entities.get(entityId);
    };
}