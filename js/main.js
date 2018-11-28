const hexRadius = 8;
const canvasRenderer = document.getElementById("grid");
const canvasGraph = document.getElementById("graph");

const grid = new Grid(
    Math.floor((canvasRenderer.width - hexRadius * 0.5) / (hexRadius * 1.5)),
    Math.floor((canvasRenderer.height - Math.sqrt(3) * hexRadius * 0.5) / (Math.sqrt(3) * hexRadius)),
    250);
const simulation = new Simulation(grid);
const gridRenderer = new GridRenderer(canvasRenderer, grid, hexRadius);
const graphRenderer = new GraphRenderer(canvasGraph, grid, [
    new Graph(Types.TYPE_PLANT, ColorsLow[Types.TYPE_PLANT]),
    new Graph(Types.TYPE_RABBIT, ColorsLow[Types.TYPE_RABBIT])]);
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

for (let i = 0; i < 150; ++i) {
    const rabbit = new Rabbit();

    rabbit.setMass(Math.ceil(Math.random() * 500));
    grid.get(
        Math.floor(Math.random() * grid.getWidth()),
        Math.floor(Math.random() * grid.getHeight())).agent = rabbit;
}

graphRenderer.gauge();

updateGraphics();
updateGraphics();

setInterval(() => {
    if (gui.isRunning())
        simulation.step();
}, 50);