const GridRenderer = function(canvas, legend, grid, radius) {
    const _cellWidth = radius * 2;
    const _cellHeight = Math.ceil(Math.sqrt(3) * radius);
    const _tileRenderers = [];

    const getX = x => _cellWidth * (x * 0.75);
    const getY = (x, y) => _cellHeight * (y + (x & 1) * 0.5);

    const createLegendLine = text => {
        const element = document.createElement("div");

        element.className = "line";
        element.appendChild(document.createTextNode(text));

        return element;
    };

    const createLegend = () => {
        const element = document.createElement("div");

        element.className = "legend";
        element.appendChild(createLegendLine("System mass: " + grid.getMass()));
        element.appendChild(createLegendLine("Dimensions: " + grid.getWidth() + "x" + grid.getHeight()));

        while (legend.firstChild)
            legend.remove(legend.firstChild);

        legend.appendChild(element);
    };

    const makeRenderers = () => {
        _tileRenderers.push(new TileRenderer(_cellWidth, _cellHeight, radius, "#eee", "#8c8170"));

        for (let type = 0; type < Types.TYPE_COUNT; ++type)
            _tileRenderers.push(new TileRenderer(
                _cellWidth,
                _cellHeight,
                radius,
                ColorsLow[type],
                ColorsHigh[type]
            ));
    };

    const renderAgents = context => {
        for (let y = 0; y < grid.getHeight(); ++y) for (let x = 0; x < grid.getWidth(); ++x) {
            const cell = grid.get(x, y);

            if (cell.agent)
                _tileRenderers[1 + cell.agent.getType()].render(
                    context,
                    getX(x),
                    getY(x, y),
                    cell.agent.getMass());
            else
                _tileRenderers[0].render(
                    context,
                    getX(x),
                    getY(x, y),
                    cell.fertilizer);
        }
    };

    this.gauge = () => {
        createLegend();
    };

    this.render = () => {
        const context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);

        renderAgents(context);
    };

    makeRenderers();
};