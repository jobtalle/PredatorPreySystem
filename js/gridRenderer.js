const GridRenderer = function(canvas, grid, radius) {
    const _cellWidth = radius * 2;
    const _cellHeight = Math.ceil(Math.sqrt(3) * radius);
    const _tileRenderers = [];

    const getX = x => _cellWidth * (0.5 + x * 0.75);
    const getY = (x, y) => _cellHeight * (0.5 + y + (x & 1) * 0.5);

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

    this.render = () => {
        const context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);

        renderAgents(context);
    };

    makeRenderers();
};