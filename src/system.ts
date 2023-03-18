// import { ComponentFilter } from "./component";
// import { Entity, EntityTree } from "./entity";

// type SystemProcess<T> = (entities: T[]) => void;

// export abstract class System<T extends Partial<ComponentFilter>> {
//   private _components: T;
//   private _entities: Map<Entity, EntityTree<T>>
//   private _process: SystemProcess<T>;

//   constructor(c: T, process: SystemProcess<T>) {
//     this._components = c;
//   }

//   run(): void {
//     this._process(this._entities);
//   };
// }