export interface SimTemplate {
    id: string;
    name: string;
    description: string;
    setup: (Matter: any, engine: any) => void;
}

export const PHYSICS_TEMPLATES: SimTemplate[] = [
    {
        id: 'acceleration-gravity',
        name: 'Gravitational Acceleration',
        description: 'Different masses fall at the same rate in a vacuum.',
        setup: (Matter: any, engine: any) => {
            const { World, Bodies } = Matter;
            World.clear(engine.world, false);

            const ground = Bodies.rectangle(400, 580, 810, 60, { isStatic: true });

            const ballA = Bodies.circle(300, 100, 20, { restitution: 0.5, render: { fillStyle: '#83C167' } });
            const ballB = Bodies.circle(500, 100, 40, { restitution: 0.5, render: { fillStyle: '#FC6255' } });

            World.add(engine.world, [ground, ballA, ballB]);
        }
    },
    {
        id: 'chaos-divergence',
        name: 'Chaos Theory: Butterfly Effect',
        description: '30 double pendulums starting with 0.001° difference. Watch them diverge rapidly.',
        setup: (Matter: any, engine: any) => {
            const { World, Bodies, Constraint, Composite } = Matter;
            World.clear(engine.world, false);

            const centerX = 400;
            const centerY = 150;
            const pin = Bodies.circle(centerX, centerY, 5, { isStatic: true, render: { fillStyle: '#FFFFFF' } });
            World.add(engine.world, pin);

            const count = 30;
            for (let i = 0; i < count; i++) {
                // Extremely tiny offset (0.001 degrees)
                const offset = i * 0.00001;
                const angle1 = Math.PI / 2 + offset;
                const color = `hsla(${(i / count) * 360}, 70%, 60%, 0.8)`;

                const arm1 = Bodies.rectangle(centerX + 75, centerY, 150, 4, {
                    frictionAir: 0,
                    friction: 0,
                    angle: angle1,
                    collisionFilter: { group: -1 - i }, // Don't collide with each other
                    render: { fillStyle: color, strokeStyle: color, lineWidth: 1 },
                    plugin: { showTrail: false } // Only trail the endpoint (arm2)
                });

                const arm2 = Bodies.rectangle(centerX + 225, centerY, 150, 4, {
                    frictionAir: 0,
                    friction: 0,
                    angle: angle1,
                    collisionFilter: { group: -1 - i },
                    render: { fillStyle: color, strokeStyle: color, lineWidth: 1 }
                });

                const constraint1 = Constraint.create({
                    bodyA: pin,
                    bodyB: arm1,
                    pointA: { x: 0, y: 0 },
                    pointB: { x: -75, y: 0 },
                    stiffness: 1,
                    length: 0,
                    render: { visible: false }
                });

                const constraint2 = Constraint.create({
                    bodyA: arm1,
                    bodyB: arm2,
                    pointA: { x: 75, y: 0 },
                    pointB: { x: -75, y: 0 },
                    stiffness: 1,
                    length: 0,
                    render: { visible: false }
                });

                World.add(engine.world, [arm1, arm2, constraint1, constraint2]);
            }
        }
    },
    {
        id: 'function-slope',
        name: 'Calculus: Slopes',
        description: 'A ball rolling on a terrain defined by y = cos(x/100) * 50.',
        setup: (Matter: any, engine: any) => {
            const { World, Bodies } = Matter;
            World.clear(engine.world, false);

            // Create curved terrain using many small rectangles
            const terrain = [];
            for (let x = 0; x < 800; x += 40) {
                const y = Math.cos(x / 100) * 100 + 400;
                terrain.push(Bodies.rectangle(x, y, 41, 20, {
                    isStatic: true,
                    angle: Math.atan(-Math.sin(x / 100)),
                    render: { fillStyle: '#3D3D3D' }
                }));
            }

            const ball = Bodies.circle(100, 200, 20, {
                restitution: 0.5,
                friction: 0,
                render: { fillStyle: '#83C167' }
            });

            World.add(engine.world, [...terrain, ball]);
        }
    }
];
