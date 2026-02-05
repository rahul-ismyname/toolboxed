export type ComparisonOperator = '>' | '<' | '>=' | '<=' | '==';
export type LogicProperty = 'position.x' | 'position.y' | 'velocity.x' | 'velocity.y' | 'variable';
export type LogicActionType = 'set_color' | 'random_color' | 'cycle_colors' | 'set_gravity' | 'apply_force' | 'set_velocity' | 'set_velocity_x' | 'set_velocity_y' | 'add_velocity' | 'add_velocity_x' | 'add_velocity_y' | 'multiply_velocity' | 'multiply_velocity_x' | 'multiply_velocity_y' | 'flip_velocity_x' | 'flip_velocity_y' | 'maintain_speed_x' | 'maintain_speed_y' | 'set_acceleration' | 'set_acceleration_x' | 'set_acceleration_y' | 'set_variable' | 'add_variable' | 'multiply_variable' | 'destroy_object' | 'spawn_object';

export type LogicTrigger = 'continuous' | 'collision_start' | 'collision_horizontal' | 'collision_vertical' | 'key_hold';

export interface LogicRule {
    id: string;
    targetBodyId?: number; // If null, global rule (like gravity)
    trigger: LogicTrigger;
    key?: string; // For key_hold trigger
    collisionTargetId?: number; // For collision triggers: which body to collide with? (null = any)
    condition: {
        property: LogicProperty;
        variableName?: string; // For 'variable' property
        operator: ComparisonOperator;
        value: number;
        mode?: 'continuous' | 'pulse'; // continuous = every frame, pulse = once when meeting condition
    };
    actions: {
        type: LogicActionType;
        value: any;
        variableName?: string; // For variable actions OR for reading values from
        useVariableValue?: boolean; // If true, value is ignored and variableName's value is used
    }[];
    elseActions?: {
        type: LogicActionType;
        value: any;
        variableName?: string;
    }[];
    lastConditionMet?: boolean; // For pulse mode
    enabled: boolean;
}

export class LogicEngine {
    private rules: LogicRule[] = [];

    private migrateRule(rule: any): LogicRule {
        // Handle migration from single 'action' to 'actions' array
        if (rule.action && !rule.actions) {
            rule.actions = [rule.action];
            delete rule.action;
        }
        if (rule.elseAction && !rule.elseActions) {
            rule.elseActions = [rule.elseAction];
            delete rule.elseAction;
        }
        // Ensure actions is always an array
        if (!rule.actions) {
            rule.actions = [];
        }
        return rule as LogicRule;
    }

    addRule(rule: LogicRule) {
        this.rules.push(this.migrateRule(rule));
    }

    removeRule(id: string) {
        this.rules = this.rules.filter(r => r.id !== id);
    }

    clearRules(targetBodyId?: number) {
        if (targetBodyId === undefined) {
            this.rules = [];
        } else {
            this.rules = this.rules.filter(r => r.targetBodyId !== targetBodyId);
        }
    }

    updateRule(id: string, updates: Partial<LogicRule>) {
        this.rules = this.rules.map(r => r.id === id ? { ...r, ...updates } : r);
    }

    getRules(): LogicRule[] {
        return this.rules.map(r => this.migrateRule(r));
    }

    update(Matter: any, engine: any, bodies: any[], activeKeys?: Set<string>, spawnBody?: Function) {
        this.rules.forEach(rule => {
            if (!rule.enabled) return;
            // if (rule.trigger !== 'continuous') return; // Only process continuous rules here

            // Check Trigger Type
            if (rule.trigger === 'collision_start') return; // Handled separately

            // KEY HOLD TRIGGER
            if (rule.trigger === 'key_hold') {
                if (!activeKeys || !rule.key) return; // No inputs
                if (!activeKeys.has(rule.key.toLowerCase())) return; // Key not pressed
            }

            // CONTINUOUS TRIGGER (default path if 'continuous')
            // If it made it here, trigger is valid (either continuous or key held)

            let checkPassed = false;
            let targetBodies = rule.targetBodyId
                ? [bodies.find(b => b.id === rule.targetBodyId)].filter(b => b)
                : bodies;
            if (!rule.enabled || (rule.trigger !== 'continuous' && rule.trigger !== 'key_hold')) return;

            bodies.forEach(body => {
                if (rule.targetBodyId !== undefined && body.id !== rule.targetBodyId) return;

                // 1. Evaluate Condition
                let checkPassed = false;
                let propValue = 0;

                if (rule.condition.property === 'variable') {
                    // Initialize variables if missing
                    if (!body.vars) body.vars = {};
                    const varName = rule.condition.variableName || 'var1';
                    propValue = body.vars[varName] || 0;
                } else if (rule.condition.property.startsWith('position')) {
                    propValue = rule.condition.property === 'position.x' ? body.position.x : body.position.y;
                } else if (rule.condition.property.startsWith('velocity')) {
                    propValue = rule.condition.property === 'velocity.x' ? body.velocity.x : body.velocity.y;
                }

                checkPassed = this.evaluateCondition(propValue, rule.condition.operator, rule.condition.value);

                // 2. Execute Action
                const isPulse = rule.condition.mode === 'pulse';
                const wasMet = !!rule.lastConditionMet;

                if (checkPassed) {
                    if (!isPulse || !wasMet) {
                        rule.actions.forEach(action => this.executeAction(Matter, engine, body, action, spawnBody));
                    }
                } else if (rule.elseActions && rule.elseActions.length > 0) {
                    if (!isPulse || wasMet) {
                        rule.elseActions.forEach(action => this.executeAction(Matter, engine, body, action, spawnBody));
                    }
                }

                rule.lastConditionMet = checkPassed;
            });
        });
    }

    handleCollisions(Matter: any, engine: any, pairs: any[], spawnBody?: Function) {
        // Filter for collision rules
        const collisionRules = this.rules.filter(r => r.enabled && (r.trigger === 'collision_start' || r.trigger === 'collision_horizontal' || r.trigger === 'collision_vertical'));

        pairs.forEach(pair => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;

            // Get collision normal to determine direction
            const collision = pair.collision || pair;
            const normal = collision.normal || { x: 0, y: 1 };
            const isHorizontal = Math.abs(normal.x) > Math.abs(normal.y);
            const isVertical = !isHorizontal;

            collisionRules.forEach(rule => {
                // Check if this rule applies to either body in the collision
                let actorBody = null;
                let hitBody = null;

                if (rule.targetBodyId === bodyA.id) { actorBody = bodyA; hitBody = bodyB; }
                else if (rule.targetBodyId === bodyB.id) { actorBody = bodyB; hitBody = bodyA; }

                if (!actorBody) return; // This collision doesn't involve the rule's owner

                // Check if we hit the correct target (if specified)
                if (rule.collisionTargetId && hitBody.id !== rule.collisionTargetId) return;

                // Check directional trigger
                if (rule.trigger === 'collision_horizontal' && !isHorizontal) return;
                if (rule.trigger === 'collision_vertical' && !isVertical) return;

                // Collision confirmed -> Execute Actions
                rule.actions.forEach(action => this.executeAction(Matter, engine, actorBody, action, spawnBody));
            });
        });
    }

    private evaluateCondition(propValue: number, operator: ComparisonOperator, value: number): boolean {
        switch (operator) {
            case '>': return propValue > value;
            case '<': return propValue < value;
            case '>=': return propValue >= value;
            case '<=': return propValue <= value;
            case '==': return Math.abs(propValue - value) < 0.1;
            default: return false;
        }
    }

    private executeAction(Matter: any, engine: any, body: any, action: { type: LogicActionType, value: any, variableName?: string, useVariableValue?: boolean }, spawnBody?: Function) {
        const resolveValue = (act: typeof action, b: any) => {
            if (act.useVariableValue && act.variableName && b.vars) {
                return b.vars[act.variableName] ?? 0;
            }
            return act.value;
        };

        if (action.type === 'set_color') {
            body.render.fillStyle = resolveValue(action, body);
        }
        if (action.type === 'random_color') {
            const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];
            body.render.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        }
        if (action.type === 'cycle_colors') {
            const colors = (action.value as string).split(',').map(c => c.trim()).filter(c => c);
            if (colors.length > 0) {
                if (!body.vars) body.vars = {};
                // Use a stable key for the color index based on the colors themselves to avoid needing a rule ID
                const cycleKey = `_clrIdx_${action.value.slice(0, 10)}`;
                const idx = (body.vars[cycleKey] || 0) % colors.length;
                body.render.fillStyle = colors[idx];
                body.vars[cycleKey] = (idx + 1) % colors.length;
            }
        }
        if (action.type === 'set_velocity') {
            const current = body.velocity;
            let targetX = current.x;
            let targetY = current.y;

            const resolvedForceValue = resolveValue(action, body);

            if (typeof resolvedForceValue === 'string') {
                const cleaned = resolvedForceValue.replace(/[()]/g, '');
                if (cleaned.includes(',')) {
                    const parts = cleaned.split(',');
                    targetX = parseFloat(parts[0]);
                    targetY = parseFloat(parts[1]);
                } else {
                    targetX = parseFloat(cleaned);
                }
            } else if (typeof resolvedForceValue === 'number') {
                targetX = resolvedForceValue;
            } else if (typeof resolvedForceValue === 'object' && resolvedForceValue !== null) {
                targetX = resolvedForceValue.x !== undefined ? resolvedForceValue.x : current.x;
                targetY = resolvedForceValue.y !== undefined ? resolvedForceValue.y : current.y;
            }

            if (!isNaN(targetX) || !isNaN(targetY)) {
                Matter.Body.setVelocity(body, {
                    x: isNaN(targetX) ? current.x : targetX,
                    y: isNaN(targetY) ? current.y : targetY
                });
            }
        }
        if (action.type === 'set_velocity_x') {
            const val = parseFloat(resolveValue(action, body));
            if (!isNaN(val)) Matter.Body.setVelocity(body, { x: val, y: body.velocity.y });
        }
        if (action.type === 'set_velocity_y') {
            const val = parseFloat(resolveValue(action, body));
            if (!isNaN(val)) Matter.Body.setVelocity(body, { x: body.velocity.x, y: val });
        }
        if (action.type === 'multiply_velocity') {
            const factor = parseFloat(resolveValue(action, body));
            if (!isNaN(factor)) {
                Matter.Body.setVelocity(body, {
                    x: body.velocity.x * factor,
                    y: body.velocity.y * factor
                });
            }
        }
        if (action.type === 'multiply_velocity_x') {
            const factor = parseFloat(resolveValue(action, body));
            if (!isNaN(factor)) {
                Matter.Body.setVelocity(body, {
                    x: body.velocity.x * factor,
                    y: body.velocity.y
                });
            }
        }
        if (action.type === 'multiply_velocity_y') {
            const factor = parseFloat(resolveValue(action, body));
            if (!isNaN(factor)) {
                Matter.Body.setVelocity(body, {
                    x: body.velocity.x,
                    y: body.velocity.y * factor
                });
            }
        }
        if (action.type === 'flip_velocity_x') {
            Matter.Body.setVelocity(body, { x: -body.velocity.x, y: body.velocity.y });
        }
        if (action.type === 'flip_velocity_y') {
            Matter.Body.setVelocity(body, { x: body.velocity.x, y: -body.velocity.y });
        }
        if (action.type === 'maintain_speed_x') {
            const speed = Math.abs(parseFloat(resolveValue(action, body)));
            if (!isNaN(speed)) {
                // If nearly stopped, pick positive direction to start
                const sign = Math.abs(body.velocity.x) < 0.1 ? 1 : (body.velocity.x >= 0 ? 1 : -1);
                Matter.Body.setVelocity(body, { x: sign * speed, y: body.velocity.y });
            }
        }
        if (action.type === 'maintain_speed_y') {
            const speed = Math.abs(parseFloat(resolveValue(action, body)));
            if (!isNaN(speed)) {
                // If nearly stopped, pick positive direction to start
                const sign = Math.abs(body.velocity.y) < 0.1 ? 1 : (body.velocity.y >= 0 ? 1 : -1);
                Matter.Body.setVelocity(body, { x: body.velocity.x, y: sign * speed });
            }
        }
        if (action.type === 'add_velocity') {
            const current = body.velocity;
            let addX = 0;
            let addY = 0;

            if (typeof action.value === 'string') {
                const cleaned = action.value.replace(/[()]/g, '');
                if (cleaned.includes(',')) {
                    const parts = cleaned.split(',');
                    addX = parseFloat(parts[0]) || 0;
                    addY = parseFloat(parts[1]) || 0;
                } else {
                    addX = parseFloat(cleaned) || 0;
                }
            } else if (typeof action.value === 'number') {
                addX = action.value;
            } else if (typeof action.value === 'object' && action.value !== null) {
                addX = action.value.x || 0;
                addY = action.value.y || 0;
            }

            Matter.Body.setVelocity(body, {
                x: current.x + addX,
                y: current.y + addY
            });
        }
        if (action.type === 'add_velocity_x') {
            const val = parseFloat(action.value);
            if (!isNaN(val)) Matter.Body.setVelocity(body, { x: body.velocity.x + val, y: body.velocity.y });
        }
        if (action.type === 'add_velocity_y') {
            const val = parseFloat(action.value);
            if (!isNaN(val)) Matter.Body.setVelocity(body, { x: body.velocity.x, y: body.velocity.y + val });
        }
        if (action.type === 'set_acceleration') {
            if (!body.plugin) body.plugin = {};

            let accX = 0;
            let accY = 0;

            if (typeof action.value === 'string') {
                const cleaned = action.value.replace(/[()]/g, '');
                if (cleaned.includes(',')) {
                    const parts = cleaned.split(',');
                    accX = parseFloat(parts[0]) || 0;
                    accY = parseFloat(parts[1]) || 0;
                } else {
                    accX = parseFloat(cleaned) || 0;
                }
            } else if (typeof action.value === 'number') {
                accX = action.value;
            } else if (typeof action.value === 'object' && action.value !== null) {
                accX = action.value.x || 0;
                accY = action.value.y || 0;
            }

            body.plugin.acceleration = { x: accX, y: accY };
        }
        if (action.type === 'set_acceleration_x') {
            if (!body.plugin) body.plugin = {};
            if (!body.plugin.acceleration) body.plugin.acceleration = { x: 0, y: 0 };
            const val = parseFloat(action.value);
            if (!isNaN(val)) body.plugin.acceleration.x = val;
        }
        if (action.type === 'set_acceleration_y') {
            if (!body.plugin) body.plugin = {};
            if (!body.plugin.acceleration) body.plugin.acceleration = { x: 0, y: 0 };
            const val = parseFloat(action.value);
            if (!isNaN(val)) body.plugin.acceleration.y = val;
        }
        if (action.type === 'apply_force') {
            Matter.Body.applyForce(body, body.position, action.value);
        }
        if (action.type === 'set_gravity') {
            engine.gravity.x = action.value.x;
            engine.gravity.y = action.value.y;
        }

        // Variable Actions
        if (action.type === 'set_variable' || action.type === 'add_variable' || action.type === 'multiply_variable') {
            if (!body.vars) body.vars = {};
            const varName = action.variableName || 'var1';
            const currentVal = body.vars[varName] || 0;
            const value = typeof action.value === 'number' ? action.value : parseFloat(action.value);

            if (isNaN(value)) return;

            if (action.type === 'set_variable') {
                body.vars[varName] = value;
            } else if (action.type === 'add_variable') {
                body.vars[varName] = currentVal + value;
            } else if (action.type === 'multiply_variable') {
                body.vars[varName] = currentVal * value;
            }
        }

        // Game Actions
        if (action.type === 'destroy_object') {
            Matter.Composite.remove(engine.world, body);
        }

        if (action.type === 'spawn_object') {
            const { type, x, y, options } = action.value;
            if (spawnBody) {
                spawnBody(type, { x, y, ...options });
            }
        }
    }
}
