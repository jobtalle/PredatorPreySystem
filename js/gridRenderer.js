const GridRenderer = function(canvas, grid, radius) {
    const _cellWidth = radius * 2;
    const _cellHeight = Math.sqrt(3) * radius;
    const _overlay = canvas.cloneNode();

    const getX = x => _cellWidth * (0.5 + x * 0.75);
    const getY = (x, y) => _cellHeight * (0.5 + y + (x & 1) * 0.5);

    const makeOverlay = () => {
        _overlay.width = canvas.width;
        _overlay.height = canvas.height;

        const context = _overlay.getContext("2d");

        renderGrid(context);
    };

    const makeFertilizerColor = fertilizer => {
        const factor = Math.max(0, 1 - fertilizer * 0.1) * 0.2 + 0.8;

        return "rgb(" + factor * 255 + ", " + factor * 244 + ", " + factor * 222 + ")";
    };

    const fillCell = (context, x, y, color) => {
        context.fillStyle = color;

        context.beginPath();
        context.moveTo(x + _cellWidth * 0.5, y);
        context.lineTo(x + _cellWidth * 0.25, y - _cellHeight * 0.5);
        context.lineTo(x - _cellWidth * 0.25, y - _cellHeight * 0.5);
        context.lineTo(x - _cellWidth * 0.5, y);
        context.lineTo(x - _cellWidth * 0.25, y + _cellHeight * 0.5);
        context.lineTo(x + _cellWidth * 0.25, y + _cellHeight * 0.5);
        context.fill();
    };


    const renderCell = (context, x, y) => {
        context.moveTo(x + _cellWidth * 0.5, y);
        context.lineTo(x + _cellWidth * 0.25, y - _cellHeight * 0.5);
        context.lineTo(x - _cellWidth * 0.25, y - _cellHeight * 0.5);
        context.lineTo(x - _cellWidth * 0.5, y);
    };

    const renderGrid = context => {
        context.strokeStyle = GridRenderer.COLOR_EDGES;
        context.beginPath();

        for (let y = -1; y <= grid.getHeight() + 1; ++y) for (let x = -1; x <= grid.getWidth(); ++x) {
            renderCell(context, getX(x), getY(x, y));
        }

        context.stroke();
    };

    const renderOverlay = context => {
        context.drawImage(_overlay, 0, 0);
    };

    const renderAgents = context => {
        for (let y = 0; y < grid.getHeight(); ++y) for (let x = 0; x < grid.getWidth(); ++x) {
            const cell = grid.get(x, y);

            if (cell.agent)
                fillCell(context, getX(x), getY(x, y), cell.agent.getColor());
            else
                fillCell(context, getX(x), getY(x, y), makeFertilizerColor(cell.fertilizer));
        }
    };

    this.render = () => {
        const context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);

        renderAgents(context);
        renderOverlay(context);
    };

    makeOverlay();
};

GridRenderer.COLOR_EDGES = "rgb(190, 190, 190)";