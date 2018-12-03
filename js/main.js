const hexRadius = 8;
const canvasGrid = document.getElementById("grid");
const legendGrid = document.getElementById("grid-legend");
const canvasGraph = document.getElementById("graph");
const legendGraph = document.getElementById("graph-legend");

const grid = new Grid(
    Math.floor((canvasGrid.width - hexRadius * 0.5) / (hexRadius * 1.5)),
    Math.floor((canvasGrid.height - 0.5 * Math.ceil(Math.sqrt(3) * hexRadius)) / Math.ceil(Math.sqrt(3) * hexRadius)),
    500);
const simulation = new Simulation(grid);
const gridRenderer = new GridRenderer(canvasGrid, legendGrid, grid, hexRadius);
const graphRenderer = new GraphRenderer(canvasGraph, legendGraph, grid, [
    Types.TYPE_PLANT,
    Types.TYPE_RABBIT]);
const gui = new Gui(
    simulation,
    document.getElementById("controls-frame"),
    document.getElementById("controls-stop"),
    document.getElementById("controls-play"),
    document.getElementById("controls-step"),
    document.getElementById("controls-reset"));

const updateGraphics = () => {
    gridRenderer.render();
    graphRenderer.render();
    gui.update();
};

simulation.onStep = updateGraphics;
simulation.onReset = () => {
    grid.clear();
    grid.scatter(Plant, 0.5);
    grid.scatter(Rabbit, 0.02);

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