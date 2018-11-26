const Rabbit = function(direction) {
    let _direction = direction || Math.floor(Math.random() * 6);

    this.getColor = () => Rabbit.COLOR;
    this.getType = () => Types.TYPE_RABBIT;
    this.copy = () => new Rabbit((direction + 3) % 3);
    this.getMinMass = () => 70;

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

        return new Action(Action.TYPE_MOVE, _direction);
    };
};

Rabbit.prototype = Object.create(Agent.prototype);

Rabbit.COPY_THRESHOLD = 500;
Rabbit.TURN_CHANCE = 0.35;
Rabbit.COLOR = "rgb(200, 50, 40)";