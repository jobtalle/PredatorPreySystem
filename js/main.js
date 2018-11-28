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
    new Graph(Types.TYPE_PLANT, ColorsLow[Types.TYPE_PLANT], "Plant"),
    new Graph(Types.TYPE_RABBIT, ColorsLow[Types.TYPE_RABBIT], "Rabbit"),
    new Graph(Types.TYPE_FOX, ColorsLow[Types.TYPE_FOX], "Fox")]);
const gui = new Gui(simulation);

const updateGraphics = () => {
    gridRenderer.render();
    graphRenderer.render();
    gui.update();
};

const scatter = (object, ratio) => {
    for (let i = 0; i < grid.getWidth() * grid.getHeight() * ratio; ++i) {
        const agent = new object;

        agent.setMass(Math.floor(Math.random() * agent.getMinMass() * 6));
        grid.get(
            Math.floor(Math.random() * grid.getWidth()),
            Math.floor(Math.random() * grid.getHeight())).agent = agent;
    }
};

simulation.onStep = updateGraphics;

scatter(Plant, 0.5);
scatter(Rabbit, 0.02);
scatter(Fox, 0.02);

gridRenderer.gauge();
graphRenderer.gauge();

updateGraphics();
updateGraphics();

setInterval(() => {
    if (gui.isRunning())
        simulation.step();
}, 50);