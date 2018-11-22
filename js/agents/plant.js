const Plant = function() {
    this.getColor = () => Plant.COLOR;
    this.getType = () => Types.TYPE_PLANT;

    this.step = context => {
        return new Action(Action.TYPE_MOVE, 3);
    };
};

Plant.COLOR = "rgb(130, 200, 120)";