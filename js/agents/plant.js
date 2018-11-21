const Plant = function() {
    this.getColor = () => Plant.COLOR;

    this.step = context => {
        if (context.access[3])
            return new Action(Action.TYPE_MOVE, 3);

        return new Action(Action.TYPE_IDLE);
    };
};

Plant.COLOR = "rgb(130, 200, 120)";