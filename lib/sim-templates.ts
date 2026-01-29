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
        id: 'double-pendulum',
        name: 'Chaos Theory',
        description: 'A double pendulum exhibits chaotic behavior. Sensitive to initial conditions.',
        setup: (Matter: any, engine: any) => {
            const { World, Bodies, Constraint } = Matter;
            World.clear(engine.world, false);

            const pin = Bodies.circle(400, 150, 5, { isStatic: true, render: { fillStyle: '#FFFF00' } });

            // Arms with zero air friction to main energy
            const arm1 = Bodies.rectangle(400, 225, 10, 150, {
                frictionAir: 0,
                friction: 0,
                render: { fillStyle: '#58C4DD' }
            });
            const arm2 = Bodies.rectangle(400, 375, 10, 150, {
                frictionAir: 0,
                friction: 0,
                render: { fillStyle: '#FC6255' }
            });

            const constraint1 = Constraint.create({
                bodyA: pin,
                pointB: { x: 0, y: -75 },
                bodyB: arm1,
                stiffness: 1,
                length: 0
            });

            const constraint2 = Constraint.create({
                bodyA: arm1,
                pointA: { x: 0, y: 75 },
                bodyB: arm2,
                pointB: { x: 0, y: -75 },
                stiffness: 1,
                length: 0
            });

            World.add(engine.world, [pin, arm1, arm2, constraint1, constraint2]);
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
