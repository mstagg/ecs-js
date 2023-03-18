import { DeterminateComponent } from "../component"
import { EntityTree } from "./types"

export class Entity <T extends DeterminateComponent<string>>{
    private _components: EntityTree<T> = new Map()
    
    private extractComponentKey(component: (new () => T) | T): Function {
        return component instanceof DeterminateComponent ? component.constructor : component
    }

    componentsLength(): number {
        return this._components.size
    }

    addComponent(component: T) {
        this._components.set(this.extractComponentKey(component), component)
    }

    removeComponent(component: new () => T) {
        this._components.delete(this.extractComponentKey(component))
    }
    
    getComponent(component: new () => T) {
        return this._components.get(this.extractComponentKey(component))
    }
    
    hasComponent(component: new () => T): boolean {
        return this._components.has(this.extractComponentKey(component))
    }

    serializeComponent() {
        return [...this._components.values()].reduce<Record<string, T>>((acc, instance) => {
            acc[instance.constructor.name] = instance
            return acc
        }, {})
    }
}