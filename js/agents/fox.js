const Fox = function() {
    let _direction = Math.floor(Math.random() * 6);

    this.getType = () => Types.TYPE_FOX;
    this.copy = () => new Fox();
    this.getMinMass = () => Fox.MASS_MIN;

    this.step = context => {
        if (this.getMass() > Fox.COPY_THRESHOLD) {
            const possibleAccess = context.getAccess();

            if (possibleAccess.length)
                return new Action(
                    Action.TYPE_COPY,
                    possibleAccess[Math.floor(Math.random() * possibleAccess.length)]);
        }

        const plants = [];
        const rabbits = [];

        for (let direction = 0; direction < 6; ++direction) {
            if (!context.neighbors[direction])
                continue;

            const neighbor = context.neighbors[direction];

            if (neighbor.getType() === Types.TYPE_RABBIT)
                rabbits.push(direction);
            else if (neighbor.getType() === Types.TYPE_PLANT && this.getMass() < Fox.HERBIVORE_THRESHOLD)
                plants.push(direction);
        }

        if (rabbits.length)
            return new Action(Action.TYPE_EAT_AGENT, rabbits[Math.floor(Math.random() * rabbits.length)]);
        else if (plants.length && Math.random() < Fox.HERBIVORE_CHANCE)
            return new Action(Action.TYPE_EAT_AGENT, plants[Math.floor(Math.random() * plants.length)]);

        if (this.getMass() > Fox.MOVE_THRESHOLD && Math.random() < Fox.MOVE_CHANCE) {
            if (context.access[_direction])
                return new Action(Action.TYPE_MOVE, _direction);
            else
                _direction = Math.floor(Math.random() * 6);
        }

        return new Action(Action.TYPE_IDLE);
    };
};

Fox.prototype = Object.create(Agent.prototype);

Fox.MASS_MIN = 2000;
Fox.MOVE_CHANCE = 0.1;
Fox.HERBIVORE_THRESHOLD = 3500;
Fox.HERBIVORE_CHANCE = 0.8;
Fox.MOVE_THRESHOLD = 2500;
Fox.COPY_THRESHOLD = 5000;
