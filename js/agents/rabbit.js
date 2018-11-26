const Rabbit = function() {
    let _direction = Math.floor(Math.random() * 6);
    let _color = Rabbit.COLOR;

    this.getColor = () => _color;
    this.getType = () => Types.TYPE_RABBIT;
    this.copy = () => new Rabbit();
    this.getMinMass = () => 5;

    this.step = context => {
        if (this.getMass() > Rabbit.COPY_THRESHOLD) {
            const possibleAccess = context.getAccess();

            if (possibleAccess.length)
                return new Action(
                    Action.TYPE_COPY,
                    possibleAccess[Math.floor(Math.random() * possibleAccess.length)]);
        }

        const facing = context.neighbors[_direction];

        if (facing && facing.getType() === Types.TYPE_PLANT) {
            _color = Rabbit.COLOR_EAT;

            return new Action(Action.TYPE_EAT_AGENT, _direction);
        }

        if (Math.random() < Rabbit.TURN_CHANCE)
            _direction = Math.floor(Math.random() * 6);

        return new Action(Action.TYPE_MOVE, _direction);
    };
};

Rabbit.prototype = Object.create(Agent.prototype);

Rabbit.COPY_THRESHOLD = 20;
Rabbit.TURN_CHANCE = 0.35;
Rabbit.COLOR = "rgb(40, 150, 220)";
Rabbit.COLOR_EAT = "rgb(200, 20, 20)";