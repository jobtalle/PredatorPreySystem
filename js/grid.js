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

    const actionIdle = (x, y, back, front, cost) => {
        front.agent = back.agent;
        front.fertilizer += front.agent.consumeMass(cost);
    };

    const actionDie = (x, y, back, front) => {
        front.fertilizer += back.agent.getMass();
    };

    const actionCopy = (x, y, back, front, context, direction, cost) => {
        if (!context.access[direction])
            return false;

        front.fertilizer += back.agent.consumeMass(cost);

        const totalMass = back.agent.getMass();
        const newAgent = back.agent.copy();

        newAgent.setMass(totalMass * 0.5);
        back.agent.setMass(totalMass * 0.5);

        front.agent = back.agent;
        getFront()[coordsToIndex(
            x + context.deltas[direction].x,
            y + context.deltas[direction].y)].agent = newAgent;

        return true;
    };

    const actionEatFertilizer = (x, y, back, front, context, quantity) => {
        if (back.fertilizer < quantity)
            return false;

        front.agent = back.agent;
        front.agent.addMass(quantity);
        front.fertilizer = back.fertilizer - quantity;

        return true;
    };

    const actionEatAgent = (x, y, back, front, context, direction) => {

    };

    const actionMove = (x, y, back, front, context, direction, cost) => {
        if (!context.access[direction])
            return false;

        front.fertilizer += back.agent.consumeMass(cost);

        getFront()[coordsToIndex(
            x + context.deltas[direction].x,
            y + context.deltas[direction].y)].agent = back.agent;

        return true;
    };

    this.get = (x, y) => getFront()[coordsToIndex(x, y)];
    this.getWidth = () => width;
    this.getHeight = () => height;
    this.step = (costMove, costIdle, costCopy) => {
        flip();

        for (let y = 0; y < height; ++y) for (let x = 0; x < width; ++x) {
            const index = coordsToIndex(x, y);
            const cellBack = getBack()[index];
            const cellFront = getFront()[index];

            cellFront.fertilizer = cellBack.fertilizer;

            if (!cellBack.agent)
                continue;

            if (cellBack.agent.getMass() < cellBack.agent.getMinMass())
                actionDie(x, y, cellBack, cellFront);

            const context = makeContext(x, y);
            const action = cellBack.agent.step(context);

            switch (action.type) {
                case Action.TYPE_IDLE:
                    actionIdle(x, y, cellBack, cellFront, costIdle);

                    break;
                case Action.TYPE_DIE:
                    actionDie(x, y, cellBack, cellFront);

                    break;
                case Action.TYPE_COPY:
                    if (!actionCopy(x, y, cellBack, cellFront, context, action.arg0, costCopy))
                        actionIdle(x, y, cellBack, cellFront, costIdle);

                    break;
                case Action.TYPE_EAT_FERTILIZER:
                    if (!actionEatFertilizer(x, y, cellBack, cellFront, context, action.arg0))
                        actionIdle(x, y, cellBack, cellFront, costIdle);

                    break;
                case Action.TYPE_EAT_AGENT:
                    if (!actionEatAgent(x, y, cellBack, cellFront, context, action.arg0))
                        actionIdle(x, y, cellBack, cellFront, costIdle);

                    break;
                case Action.TYPE_MOVE:
                    if (!actionMove(x, y, cellBack, cellFront, context, action.arg0, costMove))
                        actionIdle(x, y, cellBack, cellFront, costIdle);

                    break;
            }

            cellBack.agent = null;
            cellBack.fertilizer = 0;
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