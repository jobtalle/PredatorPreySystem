const Plant = function() {
    this.getColor = () => Plant.COLOR;
    this.getType = () => Types.TYPE_PLANT;
    this.copy = () => new Plant();
    this.getMinMass = () => 3;

    this.step = context => {
        if (this.getMass() > Plant.COPY_THRESHOLD) {
            const possibleAccess = context.getAccess();

            if (possibleAccess.length)
                return new Action(
                    Action.TYPE_COPY,
                    possibleAccess[Math.floor(Math.random() * possibleAccess.length)]);
        }
        else {
            const quantity = Math.min(Plant.EAT_SPEED, context.fertilizer);

            return new Action(Action.TYPE_EAT_FERTILIZER, quantity);
        }

        return new Action(Action.TYPE_IDLE);
    };
};

Plant.prototype = Object.create(Agent.prototype);

Plant.MASS_MIN = 8;
Plant.MASS_MAX = 12;
Plant.EAT_SPEED = 0.5;
Plant.COPY_THRESHOLD = 11;
Plant.COPY_CHANCE = 0.7;
Plant.COLOR = "rgb(130, 200, 120)";