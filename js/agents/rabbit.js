const Rabbit = function() {
    this.getColor = () => Rabbit.COLOR;
    this.getType = () => Types.TYPE_RABBIT;

    this.step = context => {
        return new Action(Action.TYPE_IDLE);
    };
};

Rabbit.COLOR = "rgb(40, 150, 220)";