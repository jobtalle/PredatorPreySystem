const Plant = function() {
    this.getType = () => Types.TYPE_PLANT;
    this.copy = () => new Plant();
    this.getMinMass = () => 5;

    this.step = context => {
        if (this.getMass() > Plant.COPY_THRESHOLD) {
            const possibleAccess = context.getAccess();

            if (possibleAccess.length)
                return new Action(
                    Action.TYPE_COPY,
                    possibleAccess[Math.floor(Math.random() * possibleAccess.length)]);
        }
        else {
            const quantity = Math.min(Plant.GROW_SPEED, context.fertilizer);

            if (quantity !== 0)
                return new Action(Action.TYPE_EAT_FERTILIZER, quantity);
        }

        return new Action(Action.TYPE_IDLE);
    };
};

Plant.prototype = Object.create(Agent.prototype);

Plant.GROW_SPEED = 5;
Plant.COPY_THRESHOLD = 120;