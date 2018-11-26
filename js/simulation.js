const Simulation = function(grid) {
    let _frame = 0;

    this.onStep = null;
    this.getFrame = () => _frame;
    this.step = () => {
        grid.step(
            Simulation.COST_MOVE,
            Simulation.COST_IDLE,
            Simulation.COST_SPLIT);

        if (this.onStep)
            this.onStep();

        ++_frame;
    };
};

Simulation.COST_MOVE = 0.05;
Simulation.COST_IDLE = 0.01;
Simulation.COST_SPLIT = 0.1;