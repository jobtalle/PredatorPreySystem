const GraphRenderer = function(canvas, legend, grid, types) {
    const _frames = [canvas.cloneNode(), canvas.cloneNode()];

    let _totalMass = 0;
    let _front = 0;
    let _history = 0;

    const flip = () => _front = 1 - _front;

    const createLegendEntry = type => {
        const element = document.createElement("div");

        element.className = "legend-entry";
        element.appendChild(document.createTextNode(Names[type]));
        element.style.backgroundColor = ColorsLow[type];

        return element;
    };

    const createLegend = () => {
        const element = document.createElement("div");

        element.className = "legend";

        for (const type of types)
            element.appendChild(createLegendEntry(type));

        while (legend.firstChild)
            legend.removeChild(legend.firstChild);

        legend.appendChild(element);
    };

    const renderBiomass = context => {
        const x = canvas.width - 0.5;
        let y = canvas.height;

        context.strokeStyle = GraphRenderer.COLOR_BIOMASS;
        context.beginPath();
        context.moveTo(x, y);

        y -= (grid.getFertilizer() / _totalMass) * canvas.height;

        context.lineTo(x, y);
        context.stroke();

        for (const type of types) {
            context.strokeStyle = ColorsLow[type];
            context.beginPath();
            context.moveTo(x, y);

            y -= (grid.getHistogram()[type] / _totalMass) * canvas.height;

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
        context.drawImage(_frames[_front], Math.min(0, -canvas.width + _history), 0);
    };

    this.gauge = () => {
        _totalMass = grid.getMass();
    };

    this.render = () => {
        flip();
        renderHistory(_frames[_front].getContext("2d"));
        renderBiomass(_frames[_front].getContext("2d"));

        renderGraph(canvas.getContext("2d"));

        ++_history;
    };

    createLegend();
};

GraphRenderer.COLOR_BIOMASS = "rgb(222, 222, 222)";