// import { Component } from "./component";
// import { Entity, EntityTree } from "./entity";
// import { System } from "./system";

// export class ECS {
//     private nextEntity: Entity = 0
//     private systems: System<any>[] = []
//     private components: Set<Component> = new Set()
//     private entities: Map<Entity, EntityTree<Component>> = new Map()

//     constructor() {
//         console.log("Building ECS...");
//     }

//     registerComponent(component: typeof Component) {
//         this.components.add(component.constructor)
//     }

//     addEntity(...components: typeof Component[]) {
//         const entity = this.nextEntity++
//         const entityTree: EntityTree<Component> = new Map()

//         components.forEach(component => {
//             entityTree.set(component.constructor, component)
//         })

//         this.entities.set(entity, entityTree)
//     }

//     registerSystem(system: System<any>) {
//         this.systems.push(system)
//     }

//     run() {
//         this.systems.forEach(system => system.run())
//     }
// }