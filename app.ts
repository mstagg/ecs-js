type Entity = number;

abstract class Component {}

class ECS {
  nextEntity: number = 0;
  entities = new Map<Function, Map<Entity, Component>>();

  insertEntity(...components: Component[]) {
    const entity = this.nextEntity++;
    components.forEach((component) => {
      let map = this.entities.get(component.constructor);
      if(!map) {
        map = new Map<Entity, Component>();
        this.entities.set(component.constructor, map);
      }
      map.set(entity, component);
    });
  }

  queryEntities(...components: Component[]) {
    const [head, ...tail] = components;
    let valids: number[] = [];
    (this.entities.get(head.constructor) ?? []).forEach((value, key) => {
      const all = tail.every(x => {
        const map = this.entities.get(x.constructor);
        if(map) {
          return map.has(key);
        }
        return false;
      })
      if(all) {
        valids.push(key);
      }
    })

    return valids;
  }
}

class Edible extends Component {
  constructor() { super(); }
}
class Fruit extends Component {
  constructor() { super(); }
}
class Vegetable extends Component {
  constructor() { super(); }
}
class Fungi extends Component {
  constructor() { super(); }
}
class Price extends Component {
  price: number;
  constructor(p: number) { super(); this.price = p; }
}

const myEcs = new ECS();

myEcs.insertEntity(new Edible(), new Fruit(), new Price(2.5));
myEcs.insertEntity(new Edible(), new Fruit(), new Price(2.5));
myEcs.insertEntity(new Edible(), new Fruit());
myEcs.insertEntity(new Edible(), new Vegetable(), new Price(4.0));
myEcs.insertEntity(new Edible(), new Vegetable());
myEcs.insertEntity(new Edible(), new Fungi());
myEcs.insertEntity(new Fungi());

console.log(myEcs.entities)
console.log(myEcs.queryEntities(new Edible()));
console.log(myEcs.queryEntities(new Edible(), new Vegetable()));
//@ts-ignore
console.log(myEcs.queryEntities(new Edible(), new Vegetable(), new Price()));