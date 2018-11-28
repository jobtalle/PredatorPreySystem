const Rabbit = function(direction) {
    let _direction = direction || Math.floor(Math.random() * 6);

    this.getType = () => Types.TYPE_RABBIT;
    this.copy = () => new Rabbit((direction + 3) % 3);
    this.getMinMass = () => Rabbit.MASS_MIN;

    this.step = context => {
        if (this.getMass() > Rabbit.COPY_THRESHOLD) {
            const possibleAccess = context.getAccess();

            if (possibleAccess.length)
                return new Action(
                    Action.TYPE_COPY,
                    possibleAccess[Math.floor(Math.random() * possibleAccess.length)]);
        }

        const facing = context.neighbors[_direction];

        if (facing && facing.getType() === Types.TYPE_PLANT)
            return new Action(Action.TYPE_EAT_AGENT, _direction);

        if (Math.random() < Rabbit.TURN_CHANCE)
            _direction = Math.floor(Math.random() * 6);

        if (this.getMass() < Rabbit.IDLE_THRESHOLD && Math.random() < Rabbit.IDLE_CHANCE)
            return new Action(Action.TYPE_IDLE);

        return new Action(Action.TYPE_MOVE, _direction);
    };
};

Rabbit.prototype = Object.create(Agent.prototype);

Rabbit.MASS_MIN = 70;
Rabbit.IDLE_CHANCE = 0.7;
Rabbit.IDLE_THRESHOLD = 200;
Rabbit.COPY_THRESHOLD = 1500;
Rabbit.TURN_CHANCE = 0.5;