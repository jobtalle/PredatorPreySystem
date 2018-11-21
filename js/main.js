const hexRadius = 8;
const canvasRenderer = document.getElementById("grid");
const canvasPlotAgents = document.getElementById("plot-agents");

const grid = new Grid(
    Math.floor((canvasRenderer.width - hexRadius * 0.5) / (hexRadius * 1.5)),
    Math.floor((canvasRenderer.height - Math.sqrt(3) * hexRadius * 0.5) / (Math.sqrt(3) * hexRadius)));
const simulation = new Simulation(grid);
const gridRenderer = new GridRenderer(canvasRenderer, grid, hexRadius);

const step = () => {
    simulation.step();
    gridRenderer.render();
};

for (let i = 0; i < 100; ++i)
    grid.set(
        Math.floor(Math.random() * grid.getWidth()),
        Math.floor(Math.random() * grid.getHeight()),
        new Plant());

gridRenderer.render();

document.getElementById("controls-step").onclick = step;