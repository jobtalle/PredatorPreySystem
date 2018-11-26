const Rabbit = function() {
    let _direction = Math.floor(Math.random() * 6);
    let _life = Rabbit.LIFE_INITIAL;

    this.getColor = () => Rabbit.COLOR;
    this.getType = () => Types.TYPE_RABBIT;
    this.copy = () => new Rabbit();
    this.getMinMass = () => 5;

    this.step = context => {
        if (--_life === 0)
            return new Action(Action.TYPE_DIE);
        else if (_life >= Rabbit.COPY_THRESHOLD) {
            const possibleAccess = context.getAccess();

            if (possibleAccess.length) {
                _life -= Rabbit.COPY_COST;

                return new Action(
                    Action.TYPE_COPY,
                    possibleAccess[Math.floor(Math.random() * possibleAccess.length)]);
            }
        }

        const inFront = context.neighbors[_direction];

        if (inFront && inFront.getType() === Types.TYPE_PLANT) {
            _life += Rabbit.LIFE_INCREMENT;

            return new Action(Action.TYPE_EAT, _direction);
        }

        if (Math.random() < Rabbit.TURN_CHANCE)
            _direction = Math.floor(Math.random() * 6);

        return new Action(Action.TYPE_MOVE, _direction);
    };
};

Rabbit.prototype = Object.create(Agent.prototype);

Rabbit.LIFE_INITIAL = 5;
Rabbit.LIFE_INCREMENT = 8;
Rabbit.COPY_THRESHOLD = 20;
Rabbit.COPY_COST = 10;
Rabbit.TURN_CHANCE = 0.35;
Rabbit.COLOR = "rgb(40, 150, 220)";