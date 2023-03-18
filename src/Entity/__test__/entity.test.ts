import { DeterminateComponent } from "../../Component";
import { Entity } from "..";

class ComponentA extends DeterminateComponent<"ComponentA"> {}
class ComponentB extends DeterminateComponent<"ComponentB"> {}
class ComponentC extends DeterminateComponent<"ComponentC"> {}

describe('Entity', () => {
    describe('componentsLength', () => {
        it('should return length equal to unique components in entity', () => {
            const component1 = new ComponentA();
            const component2 = new ComponentB();
            const component3 = new ComponentC();
            const entity = new Entity<ComponentA | ComponentB | ComponentC>();

            entity.addComponent(component1);
            entity.addComponent(component2);
            entity.addComponent(component3);
            expect(entity.componentsLength()).toBe(3);
        })
    })

    describe('addComponent', () => {
        it('should add a component', () => {
            const component = new ComponentA();
            const entity = new Entity<ComponentA>();
            entity.addComponent(component);
            expect(entity.componentsLength()).toBe(1);
            expect(entity.getComponent(ComponentA)).toBe(component);
        })

        it('should override components', () => {
            const component1 = new ComponentA();
            const component2 = new ComponentA();
            const component3 = new ComponentA();
            const entity = new Entity<ComponentA>();
            entity.addComponent(component1);
            entity.addComponent(component2);
            entity.addComponent(component3);
            expect(entity.componentsLength()).toBe(1);
            expect(entity.getComponent(ComponentA)).toBe(component3);
        })
    })

    describe('getComponent', () => {
        it('should get a component when it exists', () => {
            const component = new ComponentA();
            const entity = new Entity<ComponentA>();
            entity.addComponent(component);
            expect(entity.getComponent(ComponentA)).toBe(component);
        })

        it('should return undefined when it does not exist', () => {
            const entity = new Entity<ComponentA>();
            expect(entity.getComponent(ComponentA)).toBe(undefined);
        })
    })

    describe('removeComponent', () => {
        it('should remove a component when it exists', () => {
            const component = new ComponentA();
            const entity = new Entity<ComponentA>();
            entity.addComponent(component);
            entity.removeComponent(ComponentA);
            expect(entity.componentsLength()).toBe(0);
            expect(entity.hasComponent(ComponentA)).toBe(false);
        })

        it('should do nothing when it does not exist', () => {
            const entity = new Entity<ComponentA>();
            entity.removeComponent(ComponentA);
            expect(entity.componentsLength()).toBe(0);
            expect(entity.hasComponent(ComponentA)).toBe(false);
        })
    })

    describe('hasComponent', () => {
        it('should return true when it exists', () => {
            const component = new ComponentA();
            const entity = new Entity<ComponentA>();
            entity.addComponent(component);
            expect(entity.hasComponent(ComponentA)).toBe(true);
        })

        it('should return false when it does not exist', () => {
            const entity = new Entity<ComponentA>();
            expect(entity.hasComponent(ComponentA)).toBe(false);
        })
    })

    describe('serializeComponent', () => {
        it('should return an object with all components', () => {
            const component1 = new ComponentA();
            const component2 = new ComponentB();
            const component3 = new ComponentC();
            const entity = new Entity<ComponentA | ComponentB | ComponentC>();
            entity.addComponent(component1);
            entity.addComponent(component2);
            entity.addComponent(component3);
            expect(entity.serializeComponent()).toEqual({
                ComponentA: component1,
                ComponentB: component2,
                ComponentC: component3,
            })
        })
    })
})