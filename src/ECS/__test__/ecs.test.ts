import { ECS } from '..';
import { DeterminateComponent } from '../../Component';
import { Entity } from '../../entity';

class ComponentA extends DeterminateComponent<'ComponentA'> {}

describe('ECS', () => {
    describe('constructor', () => {
        it('should set resources', () => {
            const resources = { foo: 'bar' };
            const ecs = new ECS(resources);
            expect(ecs.resources).toStrictEqual(resources);
        });
    });

    describe('addEntity', () => {
        it('should add an entity', () => {
            const ecs = new ECS({});
            const entity = new Entity<ComponentA>();
            const component = new ComponentA();

            entity.addComponent(component);
            ecs.addEntity(entity);

            expect(ecs.entities.size).toBe(1);
        });

        it('should return an entity id', () => {
            const ecs = new ECS({});
            const entity = new Entity<ComponentA>();
            const component = new ComponentA();

            entity.addComponent(component);
            const entityId = ecs.addEntity(entity);

            expect(entityId).toBe(0);
        });
    });

    describe('removeEntity', () => {
        it('should remove an entity', () => {
            const ecs = new ECS({});
            const entity = new Entity<ComponentA>();
            const component = new ComponentA();

            entity.addComponent(component);
            const entityId = ecs.addEntity(entity);
            ecs.removeEntity(entityId);

            expect(ecs.entities.size).toBe(0);
        });
    });

    describe('getEntity', () => {
        it('should get an entity', () => {
            const ecs = new ECS({});
            const entity = new Entity<ComponentA>();
            const component = new ComponentA();

            entity.addComponent(component);
            const entityId = ecs.addEntity(entity);
            const retrievedEntity = ecs.getEntity(entityId);

            expect(retrievedEntity).toStrictEqual(entity);
        });
    });
});