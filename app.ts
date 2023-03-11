function default_hash<T>(x: T): any {
  return x;
}

 /**
  * Takes an array of arrays and optionnally a hash function,
  * and returns the elements that are present in all the arrays.
  * When intersecting arrays of objects, you should use a custom
  * hash function that returns identical values when given objects
  * that should be considered equal in your application.
  * The default hash function is the identity function.
  * When performance is not critical, a handy hash function can be `JSON.stringify`.
  */
export default function intersect<T>(arrays: ReadonlyArray<T>[], hash=default_hash): T[] {
  if (arrays.length === 0) return [];

  // Put the smallest array in the beginning
  for (let i=1; i<arrays.length; i++) {
    if(arrays[i].length < arrays[0].length) {
      let tmp = arrays[0];
      arrays[0] = arrays[i];
      arrays[i] = tmp;
    }
  }

  // Create a map associating each element to its current count
  const set = new Map();
  for(const elem of arrays[0]) {
    set.set(hash(elem), 1);
  }
  for (let i=1; i<arrays.length; i++) {
    let found = 0;
    for(const elem of arrays[i]) {
      const hashed = hash(elem);
      const count = set.get(hashed)
      if (count === i) {
        set.set(hashed,  count + 1);
        found++;
      }
    }
    // Stop early if an array has no element in common with the smallest
    if (found === 0) return []; 
  }

  // Output only the elements that have been seen as many times as there are arrays
  return arrays[0].filter(e => {
    const hashed = hash(e);
    const count = set.get(hashed);
    if (count !== undefined) set.set(hashed, 0);
    return count === arrays.length
  });
}


type EntityId = number;
type ComponentType = Function;
type ComponentAttributeName = string;

type ComponentEntityAttributes = Map<ComponentAttributeName, any>
type EntityTree = Map<EntityId, ComponentEntityAttributes>;
type ComponentTree = Map<ComponentType, EntityTree>;

const buildComponentEntityAttributes = (component: Object) => {
  const componentEntityAttributes = new Map<ComponentAttributeName, any>();
  const descriptors = Object.getOwnPropertyDescriptors(component);
  Object.entries(descriptors).forEach(([key, value]) => {
    componentEntityAttributes.set(key, value.value);
  })
  return componentEntityAttributes;
}

class ECS {
  nextEntityId: number = 0;
  componentTree: ComponentTree = new Map();

  insertEntity(...components: Object[]) {
    const entityId = this.nextEntityId++;
    components.forEach((component) => {
      let entityTree = this.componentTree.get(component.constructor);
      if(!entityTree) {
        entityTree = new Map();
        this.componentTree.set(component.constructor, entityTree);
      }
      entityTree.set(entityId, buildComponentEntityAttributes(component));
    });
  }

  getPrettyEntity(entityId: EntityId, components: Object[]) {
    const entity = {id: entityId};
    components.forEach((component) => {
      const componentTree = this.componentTree.get(component.constructor);
      if(componentTree) {
        const componentEntityAttributes = componentTree.get(entityId);
        if(componentEntityAttributes) {
          const record = {};
          componentEntityAttributes.forEach((value, key) => {
            //@ts-ignore
            record[key] = value;
          })
          //@ts-ignore
          entity[component.constructor.name] = record;
        }
      }
    })
    return entity;
  }

  queryEntitiesForSingleComponent(component: Object) {
    let results: EntityTree = new Map();
    const componentTree = this.componentTree.get(component.constructor);
    const componentDescriptors = Object.entries(Object.getOwnPropertyDescriptors(component)).filter(([_, value]) => !!value.value);
    if(componentTree) {
      componentTree.forEach((entityComponent, entityId) => {
        const attributes = componentDescriptors.every(([key, value]) => {
          return entityComponent.get(key) === value.value;
        });
        if(attributes) {
          results.set(entityId, entityComponent);
        }
      })
    }

    return results;
  }

  queryEntities(...components: Object[]) {
    const results = components.map((component) => this.queryEntitiesForSingleComponent(component));
    const resultKeys = results.map((result) => Array.from(result.keys()));
    const intersection = intersect(resultKeys);
    return intersection.map((entityId) => this.getPrettyEntity(entityId, components));
  }
}

class Edible {}
class Fruit {}
class Vegetable {}
class Fungi {}
class Price {
  constructor(public price: number) {}
}

console.log('Loading ECS with entities...')
console.time('insert');
const myEcs = new ECS();
let count = 0;
let list: any[] = [];
for(let i = 0; i < 1000000; i++) {
  myEcs.insertEntity(new Edible(), new Fruit(),new Price(2.5));
  list.push({edible: true, fruit: true, price: 2.5})
  count ++;
  if(i % 2 === 0) {
    myEcs.insertEntity(new Edible(), new Vegetable(), new Price(5.0));
    list.push({edible: true, vegetable: true, price: 5.0})
    count ++;
  }
  if(i % 3 === 0) {
    myEcs.insertEntity(new Fungi());
    list.push({fungi: true})
    count ++;
  }
  if(i % 20 === 0) {
    myEcs.insertEntity(new Edible(), new Vegetable(), new Price(20.0));
    list.push({edible: true, vegetable: true, price: 20.0})
    count ++;
  }
  if(i % 100 === 0) {
    myEcs.insertEntity(new Fungi(), new Edible(), new Price(100.0));
    list.push({fungi: true, edible: true, price: 100.0})
    count ++;
  }
}
console.timeEnd('insert');
console.log(`\t${count} entities inserted\n`);

console.time('test1_ecs');
const test1_ecs = myEcs.queryEntities(new Fungi());
console.timeEnd('test1_ecs');
console.time('test1_array');
const test1_array = list.filter(x => x.fungi);
console.timeEnd('test1_array');
console.log(`\t${test1_ecs.length} fungi found`);

console.time('test2_ecs');
const test2_ecs = myEcs.queryEntities(new Edible(), new Vegetable());
console.timeEnd('test2_ecs');
console.time('test2_array');
const test2_array = list.filter(x => x.edible && x.vegetable);
console.timeEnd('test2_array');
console.log(`\t${test2_ecs.length} edible vegetables found`);

console.time('test3_ecs');
const test3_ecs = myEcs.queryEntities(new Edible(), new Vegetable(), new Price(20.0));
console.timeEnd('test3_ecs');
console.time('test3_array');
const test3_array = list.filter(x => x.edible && x.vegetable && x.price === 20.0);
console.timeEnd('test3_array');
console.log(`\t${test3_ecs.length} edible vegetables costing $4 found`);

console.time('test4_ecs');
const test4_ecs = myEcs.queryEntities(new Price(100.0));
console.timeEnd('test4_ecs');
console.time('test4_array');
const test4_array = list.filter(x => x.price === 100.0);
console.timeEnd('test4_array');
console.log(`\t${test4_ecs.length} things costing $100 found`);

console.time('test5_ecs');
const test5_ecs = myEcs.queryEntities(new Edible());
console.timeEnd('test5_ecs');
console.time('test5_array');
const test5_array = list.filter(x => x.edible);
console.timeEnd('test5_array');
console.log(`\t${test5_ecs.length} edible items found`);

console.time('test6_ecs');
//@ts-ignore
const test6_ecs = myEcs.queryEntities(new Price());
console.timeEnd('test6_ecs');
console.time('test6_array');
const test6_array = list.filter(x => x.price);
console.timeEnd('test6_array');
console.log(`\t${test6_ecs.length} priced items found`);

console.time('test7_ecs');
//@ts-ignore
const test7_ecs = myEcs.queryEntities(new Edible(), new Price());
console.timeEnd('test7_ecs');
console.time('test7_array');
const test7_array = list.filter(x => x.edible && x.price);
console.timeEnd('test7_array');
console.log(`\t${test7_ecs.length} edible priced items found`);