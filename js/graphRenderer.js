const GraphRenderer = function(canvas, grid, graphs) {
    const _frames = [canvas.cloneNode(), canvas.cloneNode()];

    let _totalMass = 0;
    let _front = 0;

    const flip = () => _front = 1 - _front;

    const renderBiomass = context => {
        const x = canvas.width - 0.5;
        let y = canvas.height;

        context.strokeStyle = GraphRenderer.COLOR_BIOMASS;
        context.beginPath();
        context.moveTo(x, y);

        y -= (grid.getFertilizer() / _totalMass) * canvas.height;

        context.lineTo(x, y);
        context.stroke();

        for (const graph of graphs) {
            context.strokeStyle = graph.color;
            context.beginPath();
            context.moveTo(x, y);

            y -= (grid.getHistogram()[graph.type] / _totalMass) * canvas.height;

            context.lineTo(x, y);
            context.stroke();
        }
    };

    const renderHistory = context => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(_frames[1 - _front], -1, 0);
    };

    const renderGraph = context => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(_frames[_front], 0, 0);
    };

    this.gauge = () => {
        _totalMass = grid.getMass();

        console.log("Total mass = " + _totalMass);
    };

    this.render = () => {
        flip();
        renderHistory(_frames[_front].getContext("2d"));
        renderBiomass(_frames[_front].getContext("2d"));

        renderGraph(canvas.getContext("2d"));
    };
};

GraphRenderer.COLOR_BIOMASS = "rgb(222, 222, 222)";