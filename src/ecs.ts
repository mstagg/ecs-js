import { Component } from "./component";
import { Entity } from "./entity";
import { System } from "./system";

export class ECS {
    private systems: System[] = []
    private entities: Map<Entity, Component> = new Map()

    constructor() {
        console.log("Building ECS...");
    }
}