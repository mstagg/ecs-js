import { DeterminateComponent, IndeterminateComponent } from "./src/component";
import { Entity } from "./src/entity";

class ComponentA extends DeterminateComponent<"ComponentA"> { }
class ComponentB extends DeterminateComponent<"ComponentB"> { }
class ComponentC extends DeterminateComponent<"ComponentC"> { }

const e1 = new Entity<ComponentA | ComponentB>();
e1.addComponent(new ComponentA());
e1.addComponent(new ComponentB());
// e1.addComponent(new ComponentC());

console.log(e1.hasComponent(ComponentA));
console.log(e1.hasComponent(ComponentB));
// console.log(e1.hasComponent(ComponentC));
console.log(e1.componentsLength())
console.log(e1.serializeComponent());

