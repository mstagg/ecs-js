import { DeterminateComponent } from './dist/Component';
import { ECS } from './dist/ECS';
import { SystemProcess } from './dist/System/types';

class Edible extends DeterminateComponent<'Edible'> { }
class Poisonous extends DeterminateComponent<'Poisonous'> { }
class Fruit extends DeterminateComponent<'Fruit'> {
    name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }
}
class Vegetable extends DeterminateComponent<'Vegetable'> {
    name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }
}
class Price extends DeterminateComponent<'Price'> {
    price: number;
    constructor(price: number) {
        super();
        this.price = price;
    }
}

const state = {
    eatCount: 0,
    cost: 0
};
const ecs = new ECS(state);

const eatFruits: SystemProcess<typeof state, Edible | Fruit> = (ecs, entities) => { 
    console.log('Eating fruit!');
    entities.forEach(entity => { 
        const fruit = entity.getComponent(Fruit) as Fruit;
        console.log(`\tEating ${fruit.name}`); 
        ecs.resources.eatCount++; 
    }); 
};
const eatVeggies: SystemProcess<typeof state, Edible | Vegetable> = (ecs, entities) => { 
    console.log('Eating vegetables!');
    entities.forEach(entity => { 
        const veg = entity.getComponent(Vegetable) as Vegetable;
        console.log(`\tEating ${veg.name}`); 
        ecs.resources.eatCount++; 
    }); 
};
const buyGroceries: SystemProcess<typeof state, Price> = (ecs, entities) => {
    console.log('Buying groceries!');
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    entities.forEach(entity => {
        const price = entity.getComponent(Price) as Price;
        console.log(`\tBuying item for ${formatter.format(price.price)}`);
        ecs.resources.cost += price.price;
    });
};
const disposeOfPoison: SystemProcess<typeof state, Poisonous> = (ecs, entities) => {
    console.log('Disposing of poison!');
    entities.forEach(entity => {
        ecs.removeEntity(entity.id);
    });
};

ecs.addSystem(disposeOfPoison, [Poisonous]);
ecs.addSystem(eatFruits, [Edible, Fruit]);
ecs.addSystem(eatVeggies, [Edible, Vegetable]);
ecs.addSystem(buyGroceries, [Price]);

ecs.addEntity(new Edible(), new Fruit('Apple'), new Price(1));
ecs.addEntity(new Edible(), new Fruit('Orange'), new Price(1.5));
ecs.addEntity(new Edible(), new Fruit('Pear'), new Price(1));
ecs.addEntity(new Edible(), new Fruit('Watermelon'), new Price(5));
ecs.addEntity(new Fruit('Holly Berry'), new Price(.2));

ecs.addEntity(new Edible(), new Vegetable('Corn'), new Price(1));
ecs.addEntity(new Edible(), new Vegetable('Lettuce'), new Price(.5));

ecs.addEntity(new Poisonous(), new Fruit('Poison Apple'), new Edible());

ecs.runSystems();
console.log(`You ate ${ecs.resources.eatCount} items and spent ${ecs.resources.cost}`);
