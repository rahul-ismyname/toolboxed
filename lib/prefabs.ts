import { LogicRule } from '../components/tools/utility/physics-sim/logic/LogicSystem';

export interface Prefab {
    id: string;
    name: string;
    description: string;
    icon: string; // Lucide icon name or emoji
    color: string;
    category: 'Vehicles' | 'Machines' | 'Experiments' | 'Basic';
    tags?: string[];
    author?: string;
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
        category: 'Machines',
        tags: ['logic', 'collision', 'automated'],
        author: 'Community',
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
        category: 'Experiments',
        tags: ['gravity', 'pendulum', 'physics'],
        author: 'Community',
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
        category: 'Basic',
        tags: ['structure', 'wood', 'base'],
        author: 'Community',
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
        name: "Newton's Cradle",
        description: 'Five heavy balls in a momentum transfer chain.',
        icon: 'BoxSelect',
        color: '#94A3B8',
        category: 'Experiments',
        tags: ['momentum', 'energy', 'classic'],
        author: 'Community',
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
        category: 'Vehicles',
        tags: ['automated', 'flight', 'logic'],
        author: 'Community',
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
    },
    {
        id: 'chaos-pendulum',
        name: 'Chaos Pendulum',
        description: 'Five double pendulums with 0.001° difference. Watch them diverge.',
        icon: 'Activity',
        color: '#A855F7',
        category: 'Experiments',
        tags: ['chaos', 'pendulum', 'math'],
        author: 'Community',
        spawn: (x, y) => {
            const bodies: any[] = [];
            const constraints: any[] = [];

            const count = 5;
            for (let i = 0; i < count; i++) {
                const offset = i * 0.0001;
                const angle1 = Math.PI / 2 + offset;
                const color = `hsla(${(i / count) * 360}, 70%, 60%, 0.8)`;
                const group = -1 - Math.floor(Math.random() * 10000);

                const id1 = Math.floor(Math.random() * 1000000) + (i * 10);
                const id2 = id1 + 1;

                bodies.push({
                    x: x + 75 * Math.sin(angle1),
                    y: y + 75 * Math.cos(angle1),
                    type: 'box',
                    size: 30,
                    options: {
                        id: id1,
                        width: 150,
                        height: 6,
                        angle: angle1,
                        collisionFilter: { group },
                        render: { fillStyle: color, strokeStyle: color, lineWidth: 1 },
                        frictionAir: 0,
                        friction: 0
                    }
                });

                bodies.push({
                    x: x + 150 * Math.sin(angle1) + 75 * Math.sin(angle1),
                    y: y + 150 * Math.cos(angle1) + 75 * Math.cos(angle1),
                    type: 'box',
                    size: 30,
                    options: {
                        id: id2,
                        width: 150,
                        height: 6,
                        angle: angle1,
                        collisionFilter: { group },
                        render: { fillStyle: color, strokeStyle: color, lineWidth: 1 },
                        frictionAir: 0,
                        friction: 0
                    }
                });

                constraints.push({
                    pointA: { x, y },
                    bodyBId: id1,
                    pointB: { x: -75, y: 0 },
                    stiffness: 1,
                    length: 0
                });

                constraints.push({
                    bodyAId: id1,
                    bodyBId: id2,
                    pointA: { x: 75, y: 0 },
                    pointB: { x: -75, y: 0 },
                    stiffness: 1,
                    length: 0
                });
            }

            return { bodies, constraints };
        }
    },
    {
        id: 'mini-car',
        name: 'Mini Car',
        description: 'A basic vehicle with motorized wheels and active suspension.',
        icon: 'Car',
        color: '#EF4444',
        category: 'Vehicles',
        tags: ['car', 'motorized', 'transport'],
        author: 'Community',
        spawn: (x, y) => {
            const chassisId = Math.floor(Math.random() * 1000000);
            const wheel1Id = chassisId + 1;
            const wheel2Id = chassisId + 2;

            return {
                bodies: [
                    {
                        x, y, type: 'box', size: 30,
                        options: {
                            id: chassisId, width: 80, height: 20,
                            render: { fillStyle: '#EF4444' }
                        }
                    },
                    {
                        x: x - 30, y: y + 20, type: 'circle', size: 15,
                        options: {
                            id: wheel1Id, friction: 0.8,
                            render: { fillStyle: '#333' }
                        }
                    },
                    {
                        x: x + 30, y: y + 20, type: 'circle', size: 15,
                        options: {
                            id: wheel2Id, friction: 0.8,
                            render: { fillStyle: '#333' }
                        }
                    }
                ],
                constraints: [
                    {
                        bodyAId: chassisId, bodyBId: wheel1Id,
                        pointA: { x: -30, y: 15 }, pointB: { x: 0, y: 0 },
                        stiffness: 0.5, length: 0, type: 'axle'
                    },
                    {
                        bodyAId: chassisId, bodyBId: wheel2Id,
                        pointA: { x: 30, y: 15 }, pointB: { x: 0, y: 0 },
                        stiffness: 0.5, length: 0, type: 'axle'
                    }
                ],
                rules: [
                    {
                        id: `drive-${chassisId}`,
                        targetBodyId: wheel1Id,
                        trigger: 'continuous',
                        enabled: true,
                        condition: { property: 'position.y', operator: '>', value: 0, mode: 'pulse' },
                        actions: [{ type: 'maintain_angular_velocity', value: 0.2 }]
                    },
                    {
                        id: `drive2-${chassisId}`,
                        targetBodyId: wheel2Id,
                        trigger: 'continuous',
                        enabled: true,
                        condition: { property: 'position.y', operator: '>', value: 0, mode: 'pulse' },
                        actions: [{ type: 'maintain_angular_velocity', value: 0.2 }]
                    }
                ]
            };
        }
    },
    {
        id: 'propeller-plane',
        name: 'Propeller Plane',
        description: 'A lightweight flyer with a rotating propeller and lift physics.',
        icon: 'Plane',
        color: '#0EA5E9',
        category: 'Vehicles',
        tags: ['plane', 'flight', 'motorized'],
        author: 'Community',
        spawn: (x, y) => {
            const bodyId = Math.floor(Math.random() * 1000000);
            const propId = bodyId + 1;

            return {
                bodies: [
                    {
                        x, y, type: 'box', size: 30,
                        options: {
                            id: bodyId, width: 100, height: 15,
                            render: { fillStyle: '#0EA5E9' }
                        }
                    },
                    {
                        x: x + 60, y, type: 'box', size: 10,
                        options: {
                            id: propId, width: 10, height: 60,
                            render: { fillStyle: '#CBD5E1' }
                        }
                    }
                ],
                constraints: [
                    {
                        bodyAId: bodyId, bodyBId: propId,
                        pointA: { x: 50, y: 0 }, pointB: { x: 0, y: 0 },
                        stiffness: 1, length: 0, type: 'axle'
                    }
                ],
                rules: [
                    {
                        id: `prop-spin-${propId}`,
                        targetBodyId: propId,
                        trigger: 'continuous',
                        enabled: true,
                        condition: { property: 'position.x', operator: '>', value: 0, mode: 'pulse' },
                        actions: [{ type: 'add_angular_velocity', value: 0.1 }]
                    },
                    {
                        id: `thrust-${bodyId}`,
                        targetBodyId: bodyId,
                        trigger: 'continuous',
                        enabled: true,
                        condition: { property: 'position.x', operator: '>', value: 0, mode: 'pulse' },
                        actions: [{ type: 'apply_local_force', value: 0.005 }]
                    },
                    {
                        id: `lift-${bodyId}`,
                        targetBodyId: bodyId,
                        trigger: 'continuous',
                        enabled: true,
                        condition: { property: 'velocity.x', operator: '>', value: 2, mode: 'pulse' },
                        actions: [{ type: 'set_acceleration_y', value: -0.015 }]
                    }
                ]
            };
        }
    }
];
