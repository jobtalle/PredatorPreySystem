const Fox = function(direction) {
    let _direction = direction || Math.floor(Math.random() * 6);

    this.getType = () => Types.TYPE_FOX;
    this.copy = () => new Fox((direction + 3) % 3);
    this.getMinMass = () => Fox.MASS_MIN;

    this.step = context => {
        if (this.getMass() > Fox.COPY_THRESHOLD) {
            const possibleAccess = context.getAccess();

            if (possibleAccess.length)
                return new Action(
                    Action.TYPE_COPY,
                    possibleAccess[Math.floor(Math.random() * possibleAccess.length)]);
        }

        const facing = context.neighbors[_direction];

        if (facing && facing.getType() === Types.TYPE_PLANT)
            return new Action(Action.TYPE_EAT_AGENT, _direction);

        if (Math.random() < Fox.TURN_CHANCE)
            _direction = Math.floor(Math.random() * 6);

        if (this.getMass() < Fox.IDLE_THRESHOLD && Math.random() < Fox.IDLE_CHANCE)
            return new Action(Action.TYPE_IDLE);

        return new Action(Action.TYPE_MOVE, _direction);
    };
};

Fox.prototype = Object.create(Agent.prototype);

Fox.MASS_MIN = 70;
Fox.IDLE_CHANCE = 0.7;
Fox.IDLE_THRESHOLD = 200;
Fox.COPY_THRESHOLD = 1500;
Fox.TURN_CHANCE = 0.5;