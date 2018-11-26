const hexRadius = 6;
const canvasRenderer = document.getElementById("grid");

const grid = new Grid(
    Math.floor((canvasRenderer.width - hexRadius * 0.5) / (hexRadius * 1.5)),
    Math.floor((canvasRenderer.height - Math.sqrt(3) * hexRadius * 0.5) / (Math.sqrt(3) * hexRadius)),
    12);
const simulation = new Simulation(grid);
const gridRenderer = new GridRenderer(canvasRenderer, grid, hexRadius);
const gui = new Gui(simulation);

const updateGraphics = () => {
    gridRenderer.render();
    gui.update();
};

simulation.onStep = updateGraphics;

for (let i = 0; i < 1500; ++i)
    grid.get(
        Math.floor(Math.random() * grid.getWidth()),
        Math.floor(Math.random() * grid.getHeight())).agent = new Plant();

/*
for (let i = 0; i < 130; ++i)
    grid.set(
        Math.floor(Math.random() * grid.getWidth()),
        Math.floor(Math.random() * grid.getHeight()),
        new Rabbit());
        */

updateGraphics();
setInterval(() => {
    if (gui.isRunning())
        simulation.step();
}, 50);