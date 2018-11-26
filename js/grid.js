const Grid = function(width, height, defaultFertilization) {
    const _grids = [
        new Array(width * height + 1),
        new Array(width * height + 1)];

    let _front = 0;

    const flip = () => _front = 1 - _front;
    const getFront = () => _grids[_front];
    const getBack = () => _grids[1 - _front];

    const initializeGrids = () => {
        for (const grid of _grids) for (let i = 0; i < grid.length; ++i)
            grid[i] = new GridPoint(null, defaultFertilization);
    };

    const coordsToIndex = (x, y) => {
        if (x < 0 || y < 0 || x >= width || y >= height)
            return width * height;

        return x + width * y;
    };

    const isFree = (x, y) => {
        const index = coordsToIndex(x, y);

        if (index === width * height)
            return false;

        return !getFront()[index].agent && !getBack()[index].agent;
    };

    const getDeltas = x => {
        if (x & 1)
            return Grid.DELTAS_B;

        return Grid.DELTAS_A;
    };

    const makeContext = (x, y) => {
        const deltas = getDeltas(x);
        const neighbors = new Array(6);
        const access = new Array(6);

        for (let direction = 0; direction < 6; ++direction) {
            neighbors[direction] = getBack()[coordsToIndex(x + deltas[direction].x, y + deltas[direction].y)].agent;
            access[direction] = isFree(x + deltas[direction].x, y + deltas[direction].y);
        }

        return new Context(neighbors, access, deltas, getBack()[coordsToIndex(x, y)].fertilizer);
    };

    const actionCopy = (x, y, agent, context, direction) => {
        if (!context.access[direction])
            return;

        const totalMass = agent.getMass();
        const newAgent = agent.copy();

        newAgent.setMass(totalMass * 0.5);
        agent.setMass(totalMass * 0.5);

        getFront()[coordsToIndex(x, y)].agent = agent;
        getFront()[coordsToIndex(x + context.deltas[direction].x, y + context.deltas[direction].y)].agent = newAgent;
    };

    const actionIdle = (x, y, agent) => {
        getFront()[coordsToIndex(x, y)].agent = agent;
    };

    const actionEat = (x, y, agent, context, direction, quantity) => {
        const cell = getFront()[coordsToIndex(x, y)];

        cell.agent = agent;

        if (context.fertilizer >= quantity)
            cell.fertilizer = context.fertilizer - quantity;
    };

    this.get = (x, y) => getFront()[coordsToIndex(x, y)];
    this.getWidth = () => width;
    this.getHeight = () => height;
    this.step = (costMove, costIdle, costSplit) => {
        flip();

        for (let y = 0; y < height; ++y) for (let x = 0; x < width; ++x) {
            const cell = getBack()[coordsToIndex(x, y)];

            // Carry over fertilizer by default
            getFront()[coordsToIndex(x, y)].fertilizer = cell.fertilizer;

            if (!cell.agent)
                continue;

            const context = makeContext(x, y);
            const action = cell.agent.step(context);

            switch (action.type) {
                case Action.TYPE_COPY:
                    actionCopy(x, y, cell.agent, context, action.arg0);

                    break;
                case Action.TYPE_EAT:
                    actionEat(x, y, cell.agent, context, action.arg0, action.arg1);

                    break;
                case Action.TYPE_IDLE:
                    actionIdle(x, y, cell.agent);

                    break;
            }

            cell.agent = null;
            cell.fertilizer = 0;
        }
    };

    initializeGrids();
};

Grid.DELTAS_A = [
    new Vector(1, -1),
    new Vector(1, 0),
    new Vector(0, 1),
    new Vector(-1, 0),
    new Vector(-1, -1),
    new Vector(0, -1)];
Grid.DELTAS_B = [
    new Vector(1, 0),
    new Vector(1, 1),
    new Vector(0, 1),
    new Vector(-1, 1),
    new Vector(-1, 0),
    new Vector(0, -1)];