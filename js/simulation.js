const Simulation = function(grid) {
    let _step = 0;

    this.step = () => {
        grid.step();

        ++_step;
    };
};