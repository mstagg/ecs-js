import {  ComponentType, DeterminateComponent } from '../Component';
import { EntityId, EntityTree } from './types';

export class Entity <T extends DeterminateComponent<string>>{
    id: EntityId;
    private _components: EntityTree<T> = new Map();

    constructor(id: EntityId) {
        this.id = id;
    }
    
    private extractComponentType = (component: ComponentType<T> | T): ComponentType<T> => {
        return component instanceof DeterminateComponent ? component.constructor as ComponentType<T> : component;
    };

    componentsLength = (): number => {
        return this._components.size;
    };

    addComponent = (component: T): void => {
        this._components.set(this.extractComponentType(component), component);
    };

    removeComponent = (component: ComponentType<T>): void => {
        this._components.delete(this.extractComponentType(component));
    };
    
    getComponent = (component: ComponentType<T>): T => {
        return this._components.get(this.extractComponentType(component));
    };
    
    hasComponent = (component: ComponentType<T>): boolean => {
        return this._components.has(this.extractComponentType(component));
    };

    serializeComponent = (): Record<string, T> => {
        return [...this._components.values()].reduce<Record<string, T>>((acc, instance) => {
            acc[instance.constructor.name] = instance;
            return acc;
        }, {});
    };
}