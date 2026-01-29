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
    },
    {
        id: 'newtons-cradle',
        name: 'Newton\'s Cradle',
        description: 'Conservation of momentum and energy transfer.',
        setup: (Matter: any, engine: any) => {
            const { World, Bodies, Constraint } = Matter;
            World.clear(engine.world, false);

            const cradle = (xx: number, yy: number, number: number, size: number, length: number) => {
                const newtonsCradle = Matter.Composite.create({ label: 'Newtons Cradle' });

                for (let i = 0; i < number; i++) {
                    const separation = 1.9;
                    const circle = Bodies.circle(
                        xx + i * (size * separation),
                        yy + length,
                        size,
                        {
                            inertia: Infinity,
                            restitution: 1,
                            friction: 0,
                            frictionAir: 0,
                            slop: 1,
                            render: { fillStyle: '#f0f0f0' }
                        }
                    );

                    const constraint = Constraint.create({
                        pointA: { x: xx + i * (size * separation), y: yy },
                        bodyB: circle,
                        render: { strokeStyle: '#909090' }
                    });

                    Matter.Composite.add(newtonsCradle, [circle, constraint]);
                }

                return newtonsCradle;
            };

            World.add(engine.world, cradle(280, 100, 5, 30, 200));
            // Pull back the first ball
            const firstBall = engine.world.composites[0].bodies[0];
            Matter.Body.setPosition(firstBall, { x: 100, y: 200 });
        }
    },
    {
        id: 'cloth',
        name: 'Cloth Simulation',
        description: 'A grid of particles connected by constraints.',
        setup: (Matter: any, engine: any) => {
            const { World, Bodies, Composites, Constraint } = Matter;
            World.clear(engine.world, false);

            const group = Matter.Body.nextGroup(true);
            const particleOptions = { friction: 0.00001, collisionFilter: { group: group }, render: { visible: false } };
            const constraintOptions = { stiffness: 0.06, render: { type: 'line', anchors: false } };

            const cloth = Composites.softBody(200, 200, 20, 12, 5, 5, false, 8, particleOptions, constraintOptions);

            for (let i = 0; i < 20; i++) {
                cloth.bodies[i].isStatic = true;
            }

            World.add(engine.world, [
                cloth,
                Bodies.circle(300, 500, 80, { isStatic: true, render: { fillStyle: '#444' } }),
                Bodies.rectangle(500, 480, 80, 80, { isStatic: true, render: { fillStyle: '#444' } })
            ]);
        }
    },
    {
        id: 'bridge',
        name: 'Bridge Builder',
        description: 'Test structural integrity with a bridge spanning a gap.',
        setup: (Matter: any, engine: any) => {
            const { World, Bodies, Composites, Constraint } = Matter;
            World.clear(engine.world, false);

            const group = Matter.Body.nextGroup(true);

            const bridge = Composites.stack(160, 290, 15, 1, 0, 0, (x: number, y: number) => {
                return Bodies.rectangle(x - 20, y, 53, 20, {
                    collisionFilter: { group: group },
                    chamfer: 5,
                    density: 0.005,
                    frictionAir: 0.05,
                    render: { fillStyle: '#8F5C38' }
                });
            });

            Composites.chain(bridge, 0.3, 0, -0.3, 0, {
                stiffness: 0.99,
                length: 0.0001,
                render: { visible: false }
            });

            World.add(engine.world, [
                bridge,
                Bodies.rectangle(80, 440, 200, 280, { isStatic: true, render: { fillStyle: '#333' } }),
                Bodies.rectangle(720, 440, 200, 280, { isStatic: true, render: { fillStyle: '#333' } }),
                Constraint.create({
                    pointA: { x: 140, y: 300 },
                    bodyB: bridge.bodies[0],
                    pointB: { x: -25, y: 0 },
                    length: 2,
                    stiffness: 0.9
                }),
                Constraint.create({
                    pointA: { x: 660, y: 300 },
                    bodyB: bridge.bodies[bridge.bodies.length - 1],
                    pointB: { x: 25, y: 0 },
                    length: 2,
                    stiffness: 0.9
                })
            ]);
        }
    }
];
