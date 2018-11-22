const Simulation = function(grid) {
    let _frame = 0;

    this.onStep = null;
    this.getFrame = () => _frame;
    this.step = () => {
        grid.step();

        if (this.onStep)
            this.onStep();

        ++_frame;
    };
};