const Gui = function(simulation) {
    const _fieldFrame = document.getElementById("controls-frame");
    const _buttonStop = document.getElementById("controls-stop");
    const _buttonStart = document.getElementById("controls-start");
    const _buttonStep = document.getElementById("controls-step");

    let _running = false;

    const connect = () => {
        _buttonStop.onclick = () => _running = false;
        _buttonStart.onclick = () => _running = true;
        _buttonStep.onclick = () => simulation.step();
    };

    this.update = () => _fieldFrame.value = simulation.getFrame();
    this.isRunning = () => _running;

    connect();
};