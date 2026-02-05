import { LogicRule } from '../components/tools/utility/physics-sim/logic/LogicSystem';

export interface Prefab {
    id: string;
    name: string;
    description: string;
    icon: string; // Lucide icon name or emoji
    color: string;
    spawn: (x: number, y: number) => {
        bodies: any[];
        constraints?: any[];
        rules?: LogicRule[];
    };
}

export const PREFABS: Prefab[] = [
    {
        id: 'logic-bouncer',
        name: 'Logic Bouncer',
        description: 'A smart box that reverses velocity and changes color on collision.',
        icon: 'Zap',
        color: '#83C167',
        spawn: (x, y) => {
            const bodyId = Math.floor(Math.random() * 1000000);
            return {
                bodies: [{
                    x, y,
                    type: 'box',
                    size: 40,
                    options: {
                        id: bodyId,
                        render: { fillStyle: '#83C167' }
                    }
                }],
                rules: [
                    {
                        id: `bouncer-flip-${bodyId}`,
                        targetBodyId: bodyId,
                        trigger: 'collision_start',
                        enabled: true,
                        condition: { property: 'position.x', operator: '>', value: 0, mode: 'pulse' },
                        actions: [
                            { type: 'multiply_velocity', value: -1.2 },
                            { type: 'random_color', value: '' }
                        ]
                    }
                ]
            };
        }
    },
    {
        id: 'newton-ball',
        name: 'Newton Ball',
        description: 'A heavy ball with a fixed pivot constraint.',
        icon: 'Link',
        color: '#3B82F6',
        spawn: (x, y) => {
            const bodyId = Math.floor(Math.random() * 1000000);
            return {
                bodies: [
                    { x, y: y + 150, type: 'circle', size: 30, options: { id: bodyId, density: 0.05, restitution: 1, friction: 0 } }
                ],
                constraints: [
                    { pointA: { x, y }, bodyBId: bodyId, stiffness: 1, length: 150 }
                ]
            };
        }
    },
    {
        id: 'bridge-segment',
        name: 'Bridge Segment',
        description: 'A floating plank with support struts.',
        icon: 'GripHorizontal',
        color: '#8F5C38',
        spawn: (x, y) => {
            const id1 = Math.floor(Math.random() * 1000000);
            return {
                bodies: [
                    { x, y, type: 'box', size: 30, options: { id: id1, width: 100, height: 20, render: { fillStyle: '#8F5C38' } } }
                ]
            };
        }
    },
    {
        id: 'newton-cradle',
        name: 'Newton\'s Cradle',
        description: 'Five heavy balls in a momentum transfer chain.',
        icon: 'BoxSelect',
        color: '#94A3B8',
        spawn: (x, y) => {
            const bodies = [];
            const constraints = [];
            const size = 25;
            const number = 5;
            const length = 150;

            for (let i = 0; i < number; i++) {
                const bId = Math.floor(Math.random() * 1000000) + i;
                const xx = x - (number * size) + i * (size * 2 + 1);
                bodies.push({
                    x: xx, y: y + length, type: 'circle', size: size,
                    options: { id: bId, density: 0.05, restitution: 1, friction: 0, frictionAir: 0, slop: 1 }
                });
                constraints.push({ pointA: { x: xx, y }, bodyBId: bId, stiffness: 1, length: length });
            }

            return { bodies, constraints };
        }
    },
    {
        id: 'logic-drone',
        name: 'Logic Drone',
        description: 'An automated drone that hovers and patrols.',
        icon: 'Zap',
        color: '#F59E0B',
        spawn: (x, y) => {
            const bId = Math.floor(Math.random() * 1000000);
            return {
                bodies: [{
                    x, y, type: 'box', size: 30,
                    options: { id: bId, render: { fillStyle: '#F59E0B' } }
                }],
                rules: [
                    {
                        id: `hover-${bId}`,
                        targetBodyId: bId,
                        trigger: 'continuous',
                        enabled: true,
                        condition: { property: 'position.y', operator: '>', value: y + 50, mode: 'pulse' },
                        actions: [{ type: 'set_acceleration_y', value: -0.1 }]
                    },
                    {
                        id: `fall-${bId}`,
                        targetBodyId: bId,
                        trigger: 'continuous',
                        enabled: true,
                        condition: { property: 'position.y', operator: '<', value: y - 50, mode: 'pulse' },
                        actions: [{ type: 'set_acceleration_y', value: 0.1 }]
                    },
                    {
                        id: `patrol-r-${bId}`,
                        targetBodyId: bId,
                        trigger: 'continuous',
                        enabled: true,
                        condition: { property: 'position.x', operator: '<', value: x - 100, mode: 'pulse' },
                        actions: [{ type: 'set_acceleration_x', value: 0.05 }]
                    },
                    {
                        id: `patrol-l-${bId}`,
                        targetBodyId: bId,
                        trigger: 'continuous',
                        enabled: true,
                        condition: { property: 'position.x', operator: '>', value: x + 100, mode: 'pulse' },
                        actions: [{ type: 'set_acceleration_x', value: -0.05 }]
                    }
                ]
            };
        }
    }
];
