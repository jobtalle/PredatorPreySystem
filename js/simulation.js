const Simulation = function(grid) {
    let _frame = 0;

    this.onStep = null;
    this.onReset = null;
    this.getFrame = () => _frame;
    this.step = () => {
        grid.step(
            Simulation.COST_MOVE,
            Simulation.COST_IDLE,
            Simulation.COST_COPY);

        if (this.onStep)
            this.onStep();

        ++_frame;
    };

    this.reset = () => {
        _frame = 0;

        if (this.onReset)
            this.onReset();
    };
};

Simulation.COST_MOVE = 0.15;
Simulation.COST_IDLE = 0.01;
Simulation.COST_COPY = 0.1;