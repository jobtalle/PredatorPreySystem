const Plant = function() {
    this.getType = () => Types.TYPE_PLANT;
    this.copy = () => new Plant();
    this.getMinMass = () => Plant.MASS_MIN;

    this.step = context => {
        if (this.getMass() > Plant.COPY_THRESHOLD_MAX ||
            (this.getMass() > Plant.COPY_THRESHOLD && Math.random() < Plant.COPY_CHANCE)) {
            const possibleAccess = context.getAccess();

            if (possibleAccess.length)
                return new Action(
                    Action.TYPE_COPY,
                    possibleAccess[Math.floor(Math.random() * possibleAccess.length)]);
        }
        else
            return new Action(Action.TYPE_EAT_FERTILIZER, Plant.EAT_SPEED);

        return new Action(Action.TYPE_IDLE);
    };
};

Plant.prototype = Object.create(Agent.prototype);

Plant.EAT_SPEED = 5;
Plant.MASS_MIN = 5;
Plant.COPY_THRESHOLD = 160;
Plant.COPY_THRESHOLD_MAX = 180;
Plant.COPY_CHANCE = 0.3;