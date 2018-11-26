const Plant = function() {
    this.mass = Plant.MASS_MIN + Math.floor((Plant.MASS_MAX - Plant.MASS_MIN + 1) * Math.random());

    this.getColor = () => Plant.COLOR;
    this.getType = () => Types.TYPE_PLANT;
    this.copy = () => new Plant();

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

            this.setMass(this.getMass() + quantity);

            return new Action(Action.TYPE_EAT, -1, quantity);
        }

        return new Action(Action.TYPE_IDLE);
    };
};

Plant.prototype = Object.create(Agent.prototype);

Plant.MASS_MIN = 8;
Plant.MASS_MAX = 12;
Plant.EAT_SPEED = 1;
Plant.COPY_THRESHOLD = 20;
Plant.COPY_CHANCE = 0.7;
Plant.COLOR = "rgb(130, 200, 120)";