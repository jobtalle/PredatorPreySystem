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
            const quantity = Math.min(Plant.GROW_SPEED, context.fertilizer);

            if (quantity !== 0)
                return new Action(Action.TYPE_EAT_FERTILIZER, quantity);
        }

        return new Action(Action.TYPE_IDLE);
    };
};

Plant.prototype = Object.create(Agent.prototype);

Plant.GROW_SPEED = 6;
Plant.COPY_THRESHOLD = 50;
Plant.COLOR = "rgb(110, 180, 100)";