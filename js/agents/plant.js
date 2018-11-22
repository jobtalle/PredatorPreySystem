const Plant = function() {
    let _life = Plant.LIFE_MIN + Math.floor((Plant.LIFE_MAX - Plant.LIFE_MIN + 1) * Math.random());

    this.getColor = () => Plant.COLOR;
    this.getType = () => Types.TYPE_PLANT;
    this.copy = () => new Plant();

    this.step = context => {
        if (--_life === 0) {
            if (Math.random() < Plant.COPY_CHANCE){
                const possibleAccess = context.getAccess();

                _life = Plant.LIFE_MIN + Math.floor((Plant.LIFE_MAX - Plant.LIFE_MIN + 1) * Math.random());

                if (possibleAccess.length)
                    return new Action(
                        Action.TYPE_COPY,
                        possibleAccess[Math.floor(Math.random() * possibleAccess.length)]);
            }
            else
                return new Action(Action.TYPE_DIE);
        }

        return new Action(Action.TYPE_IDLE);
    };
};

Plant.LIFE_MIN = 8;
Plant.LIFE_MAX = 12;
Plant.COPY_CHANCE = 0.7;
Plant.COLOR = "rgb(130, 200, 120)";