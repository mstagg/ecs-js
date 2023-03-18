import { ComponentTypeId as ComponentType, DeterminateComponent } from '../Component';
import { EntityTree } from './types';

export class Entity <T extends DeterminateComponent<string>>{
    private _components: EntityTree<T> = new Map();
    
    private extractComponentType = (component: (new () => T) | T): ComponentType => {
        return component instanceof DeterminateComponent ? component.constructor : component;
    };

    componentsLength = (): number => {
        return this._components.size;
    };

    addComponent = (component: T) => {
        this._components.set(this.extractComponentType(component), component);
    };

    removeComponent = (component: new () => T) => {
        this._components.delete(this.extractComponentType(component));
    };
    
    getComponent = (component: new () => T) => {
        return this._components.get(this.extractComponentType(component));
    };
    
    hasComponent = (component: new () => T): boolean => {
        return this._components.has(this.extractComponentType(component));
    };

    serializeComponent = () => {
        return [...this._components.values()].reduce<Record<string, T>>((acc, instance) => {
            acc[instance.constructor.name] = instance;
            return acc;
        }, {});
    };
}