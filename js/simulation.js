const Simulation = function(grid) {
    let _step = 0;

    this.getStep = () => _step;
    this.step = () => {
        grid.step();

        ++_step;
    };
};