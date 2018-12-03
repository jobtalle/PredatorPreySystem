const Instance = function(
    hexRadius,
    gridCanvas,
    gridLegend,
    graphCanvas,
    graphLegend,
    agentTypes,
    agentRatios,
    divFrameNumber,
    buttonStop,
    buttonPlay,
    buttonStep,
    buttonReset,
    fertilizerDensity) {
    const grid = new Grid(
        Math.floor((gridCanvas.width - hexRadius * 0.5) / (hexRadius * 1.5)),
        Math.floor((gridCanvas.height - 0.5 * Math.ceil(Math.sqrt(3) * hexRadius)) / Math.ceil(Math.sqrt(3) * hexRadius)),
        fertilizerDensity);
    const simulation = new Simulation(grid);
    const gridRenderer = new GridRenderer(gridCanvas, gridLegend, grid, hexRadius);
    const graphRenderer = new GraphRenderer(graphCanvas, graphLegend, grid, agentTypes);
    const gui = new Gui(
        simulation,
        divFrameNumber,
        buttonStop,
        buttonPlay,
        buttonStep,
        buttonReset);

    const updateGraphics = () => {
        gridRenderer.render();
        graphRenderer.render();
        gui.update();
    };

    simulation.onStep = updateGraphics;
    simulation.onReset = () => {
        grid.clear();

        for (let i = 0; i < agentTypes.length; ++i)
            grid.scatter(AgentObjects[agentTypes[i]], agentRatios[i]);

        gridRenderer.gauge();
        graphRenderer.gauge();

        updateGraphics();
        updateGraphics();
    };

    simulation.onReset();

    setInterval(() => {
        if (gui.isRunning())
            simulation.step();
    }, 50);
};