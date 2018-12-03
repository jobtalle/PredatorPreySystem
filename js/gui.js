const Gui = function(simulation, frameNumber, stop, play, step, reset) {
    let _running = false;

    const connect = () => {
        stop.onclick = () => _running = false;
        play.onclick = () => _running = true;
        step.onclick = () => simulation.step();
        reset.onclick = () => simulation.reset();
    };

    this.update = () => frameNumber.value = simulation.getFrame();
    this.isRunning = () => _running;

    connect();
};