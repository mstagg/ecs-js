import { ECS } from '..';
import { DeterminateComponent } from '../../Component';

class ComponentA extends DeterminateComponent<'ComponentA'> {}
class ComponentB extends DeterminateComponent<'ComponentB'> {}
class ComponentC extends DeterminateComponent<'ComponentC'> {}

describe('ECS', () => {
    describe('constructor', () => {
        it('should set resources', () => {
            const resources = { foo: 'bar' };
            const ecs = new ECS(resources);
            expect(ecs.resources).toStrictEqual(resources);
        });
    });

    describe('addEntity', () => {
        it('should add an entity with zero components', () => {
            const ecs = new ECS({});
            const entity = ecs.addEntity();

            expect(entity.id).toBe(0);
            expect(entity.componentsLength()).toBe(0);
            expect(ecs.entities.get(0)).toBe(entity);
        });

        it('should add an entity with single component', () => {
            const ecs = new ECS({});
            const component = new ComponentA();
            const entity = ecs.addEntity(component);

            expect(entity.id).toBe(0);
            expect(entity.componentsLength()).toBe(1);
            expect(ecs.entities.get(0)).toBe(entity);
        });

        it('should add an entity with multiple components', () => {
            const ecs = new ECS({});
            const componentA = new ComponentA();
            const componentB = new ComponentB();
            const componentC = new ComponentC();
            const entity = ecs.addEntity(componentA, componentB, componentC);

            expect(entity.id).toBe(0);
            expect(entity.componentsLength()).toBe(3);
            expect(ecs.entities.get(0)).toBe(entity);
        });
    });

    describe('removeEntity', () => {
        it('should remove an entity', () => {
            const ecs = new ECS({});
            const component = new ComponentA();

            const entity = ecs.addEntity(component);
            ecs.removeEntity(entity.id);

            expect(ecs.entities.size).toBe(0);
            expect(ecs.entities.get(0)).toBeUndefined();
        });
    });

    describe('getEntity', () => {
        it('should get an entity', () => {
            const ecs = new ECS({});
            const component = new ComponentA();

            const entity = ecs.addEntity(component);
            const retrievedEntity = ecs.getEntity(entity.id);

            expect(retrievedEntity).toStrictEqual(entity);
        });
    });
});