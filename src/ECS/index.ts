import { AnyEntity, EntityId } from '../entity/types';
import { ECSResources } from './types';

export class ECS<T extends ECSResources> {
    resources: T;
    entities: Map<EntityId, AnyEntity> = new Map();
    private _nextEntityId: EntityId = 0;

    constructor(resources: T) {
        this.resources = resources;
    }

    private getNextEntityId = () => this._nextEntityId++;

    addEntity = (entity: AnyEntity): EntityId => {
        const entityId = this.getNextEntityId();
        this.entities.set(entityId, entity);
        return entityId;
    };

    removeEntity = (entityId: EntityId) => {
        this.entities.delete(entityId);
    };

    getEntity = (entityId: EntityId) => {
        return this.entities.get(entityId);
    };
}