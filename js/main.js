const hexRadius = 7;
const canvasGrid = document.getElementById("grid");
const legendGrid = document.getElementById("grid-legend");
const canvasGraph = document.getElementById("graph");
const legendGraph = document.getElementById("graph-legend");

const grid = new Grid(
    Math.floor((canvasGrid.width - hexRadius * 0.5) / (hexRadius * 1.5)),
    Math.floor((canvasGrid.height - 0.5 * Math.ceil(Math.sqrt(3) * hexRadius)) / Math.ceil(Math.sqrt(3) * hexRadius)),
    290);
const simulation = new Simulation(grid);
const gridRenderer = new GridRenderer(canvasGrid, legendGrid, grid, hexRadius);
const graphRenderer = new GraphRenderer(canvasGraph, legendGraph, grid, [
    new Graph(Types.TYPE_PLANT, ColorsLow[Types.TYPE_PLANT], "Plant"),
    new Graph(Types.TYPE_RABBIT, ColorsLow[Types.TYPE_RABBIT], "Rabbit 1"),
    new Graph(Types.TYPE_FOX, ColorsLow[Types.TYPE_FOX], "Rabbit 2")]);
const gui = new Gui(simulation);

const updateGraphics = () => {
    gridRenderer.render();
    graphRenderer.render();
    gui.update();
};

simulation.onStep = updateGraphics;

for (let i = 0; i < 1500; ++i) {
    const plant = new Plant();

    plant.setMass(Math.ceil(Math.random() * 72));
    grid.get(
        Math.floor(Math.random() * grid.getWidth()),
        Math.floor(Math.random() * grid.getHeight())).agent = plant;
}

for (let i = 0; i < 75; ++i) {
    const rabbit = new Rabbit();

    rabbit.setMass(Math.ceil(Math.random() * 500));
    grid.get(
        Math.floor(Math.random() * grid.getWidth()),
        Math.floor(Math.random() * grid.getHeight())).agent = rabbit;
}

for (let i = 0; i < 75; ++i) {
    const fox = new Fox();

    fox.setMass(Math.ceil(Math.random() * 500));
    grid.get(
        Math.floor(Math.random() * grid.getWidth()),
        Math.floor(Math.random() * grid.getHeight())).agent = fox;
}

gridRenderer.gauge();
graphRenderer.gauge();

updateGraphics();
updateGraphics();

setInterval(() => {
    if (gui.isRunning())
        simulation.step();
}, 50);