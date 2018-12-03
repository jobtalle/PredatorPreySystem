const Grid = function(width, height, maxFertilization) {
    const _histogram = new Array(Types.TYPE_COUNT).fill(0);
    const _grids = [
        new Array(width * height + 1),
        new Array(width * height + 1)];

    let _front = 0;
    let _fertilizer = 0;

    const flip = () => _front = 1 - _front;
    const getFront = () => _grids[_front];
    const getBack = () => _grids[1 - _front];

    const initializeGrids = () => {
        for (const grid of _grids) {
            for (let y = 0; y < height; ++y) for (let x = 0; x < width; ++x) {
                const index = coordsToIndex(x, y);
                const fertilization = Math.ceil(
                    maxFertilization *
                    (-Math.cos(Math.PI * x * 2 / width) + 1) * 0.5 *
                    (-Math.cos(Math.PI * y * 2 / height) + 1) * 0.5);

                grid[index] = new GridPoint(null, fertilization);
            }

            grid[width * height] = new GridPoint(null, 0);
        }
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
        const neighbors = new Array(6);
        const access = new Array(6);
        const deltas = getDeltas(x);

        for (let direction = 0; direction < 6; ++direction) {
            const cell = getBack()[coordsToIndex(x + deltas[direction].x, y + deltas[direction].y)];

            neighbors[direction] = cell.agent;
            access[direction] = isFree(x + deltas[direction].x, y + deltas[direction].y);
        }

        return new Context(neighbors, access, getBack()[coordsToIndex(x, y)].fertilizer);
    };

    const spreadFertilizer = (x, y, front, context, amount) => {
        const portion = Math.ceil(amount * Grid.SPREAD_FRACTION);

        while (amount > 0) {
            const direction = Math.floor(Math.random() * 7);

            if (direction === 6 || context.access[direction] || context.neighbors[direction]) {
                const currentPortion = Math.min(portion, amount);
                const deltas = getDeltas(x);

                getFront()[coordsToIndex(
                    x + deltas[direction].x,
                    y + deltas[direction].y)].fertilizer += currentPortion;

                amount -= currentPortion;
            }
        }
    };

    const actionIdle = (x, y, back, front, context, cost) => {
        front.agent = back.agent;

        spreadFertilizer(x, y, front, context, front.agent.consumeMass(cost));
    };

    const actionDie = (x, y, context, back, front) => {
        spreadFertilizer(x, y, front, context, back.agent.getMass());

        back.agent = null;
    };

    const actionCopy = (x, y, back, front, context, direction, cost) => {
        if (!context.access[direction])
            return false;

        spreadFertilizer(x, y, front, context, back.agent.consumeMass(cost));

        const newAgent = back.agent.copy();
        const deltas = getDeltas(x);
        const index = coordsToIndex(
            x + deltas[direction].x,
            y + deltas[direction].y);

        newAgent.setMass(Math.ceil(back.agent.getMass() * 0.5));
        back.agent.setMass(back.agent.getMass() - newAgent.getMass());

        front.agent = back.agent;
        getFront()[index].agent = newAgent;
        getBack()[index].agent = null;

        return true;
    };

    const actionEatFertilizer = (x, y, back, front, context, quantity) => {
        if (context.fertilizer < quantity)
            return false;

        front.agent = back.agent;
        front.agent.addMass(quantity);

        if (quantity > 1) {
            const access = context.getAccess();

            if (access.length) {
                const accessQuantity = Math.ceil(quantity * Grid.EAT_FERTILIZER_SPREAD);
                const direction = access[Math.floor(Math.random() * access.length)];
                const deltas = getDeltas(x);
                const index = coordsToIndex(
                    x + deltas[direction].x,
                    y + deltas[direction].y);

                if (getFront()[index].fertilizer >= accessQuantity) {
                    quantity -= accessQuantity;
                    getFront()[index].fertilizer -= accessQuantity;
                }
            }
        }

        front.fertilizer -= quantity;

        return true;
    };

    const actionEatAgent = (x, y, back, front, context, direction) => {
        if (context.access[direction] || !context.neighbors[direction])
            return false;

        if (context.neighbors[direction].getMass() > back.agent.getMass() * 0.5)
            return false;

        const deltas = getDeltas(x);
        const index = coordsToIndex(
            x + deltas[direction].x,
            y + deltas[direction].y);

        back.agent.addMass(context.neighbors[direction].getMass());

        getFront()[index].agent = back.agent;
        getBack()[index].agent = null;
        back.agent = null;

        return true;
    };

    const actionMove = (x, y, back, front, context, direction, cost) => {
        if (!context.access[direction])
            return false;

        spreadFertilizer(x, y, front, context, back.agent.consumeMass(cost));

        const deltas = getDeltas(x);

        getFront()[coordsToIndex(
            x + deltas[direction].x,
            y + deltas[direction].y)].agent = back.agent;

        back.agent = null;

        return true;
    };

    this.get = (x, y) => getFront()[coordsToIndex(x, y)];
    this.getWidth = () => width;
    this.getHeight = () => height;
    this.getHistogram = () => _histogram;
    this.getFertilizer = () => _fertilizer;
    this.step = (costMove, costIdle, costCopy) => {
        flip();

        for (let y = 0; y < height; ++y) for (let x = 0; x < width; ++x) {
            const index = coordsToIndex(x, y);
            const cellBack = getBack()[index];
            const cellFront = getFront()[index];

            if (!cellBack.agent)
                continue;

            const context = makeContext(x, y);

            if (cellBack.agent.getMass() < cellBack.agent.getMinMass()) {
                actionDie(x, y, context, cellBack, cellFront);

                continue;
            }

            const action = cellBack.agent.step(context);

            switch (action.type) {
                case Action.TYPE_IDLE:
                    actionIdle(x, y, cellBack, cellFront, context, costIdle);

                    break;
                case Action.TYPE_DIE:
                    actionDie(x, y, context, cellBack, cellFront);

                    break;
                case Action.TYPE_COPY:
                    if (!actionCopy(x, y, cellBack, cellFront, context, action.arg0, costCopy))
                        actionIdle(x, y, cellBack, cellFront, context, costIdle);

                    break;
                case Action.TYPE_EAT_FERTILIZER:
                    if (!actionEatFertilizer(x, y, cellBack, cellFront, context, action.arg0))
                        actionIdle(x, y, cellBack, cellFront, context, costIdle);

                    break;
                case Action.TYPE_EAT_AGENT:
                    if (!actionEatAgent(x, y, cellBack, cellFront, context, action.arg0))
                        actionIdle(x, y, cellBack, cellFront, context, costIdle);

                    break;
                case Action.TYPE_MOVE:
                    if (!actionMove(x, y, cellBack, cellFront, context, action.arg0, costMove))
                        actionIdle(x, y, cellBack, cellFront, context, costIdle);

                    break;
            }
        }

        _histogram.fill(0);
        _fertilizer = 0;

        for (let i = 0; i < width * height; ++i) {
            const back = getBack()[i];
            const front = getFront()[i];

            if (front.agent)
                _histogram[front.agent.getType()] += front.agent.getMass();

            _fertilizer += front.fertilizer;

            back.agent = null;
            back.fertilizer = front.fertilizer;
        }
    };

    this.getMass = () => {
        let mass = 0;

        for (let i = 0; i < width * height; ++i) {
            const cell = getFront()[i];

            mass += cell.fertilizer;

            if (cell.agent)
                mass += cell.agent.getMass();
        }

        return mass;
    };

    this.clear = () => {
        initializeGrids();
    };

    this.scatter = (object, ratio) => {
        for (let i = 0; i < this.getWidth() * this.getHeight() * ratio; ++i) {
            const agent = new object;

            agent.setMass(Math.floor(Math.random() * agent.getMinMass() * Grid.SCATTER_INITIAL_MASS_FACTOR));
            this.get(
                Math.floor(Math.random() * this.getWidth()),
                Math.floor(Math.random() * this.getHeight())).agent = agent;
        }
    };

    this.getWidth = () => width;
    this.getHeight = () => height;

    initializeGrids();
};

Grid.EAT_FERTILIZER_SPREAD = 0.1;
Grid.SPREAD_FRACTION = 0.4;
Grid.SCATTER_INITIAL_MASS_FACTOR = 6;
Grid.DELTAS_A = [
    new Vector(1, -1),
    new Vector(1, 0),
    new Vector(0, 1),
    new Vector(-1, 0),
    new Vector(-1, -1),
    new Vector(0, -1),
    new Vector(0, 0)];
Grid.DELTAS_B = [
    new Vector(1, 0),
    new Vector(1, 1),
    new Vector(0, 1),
    new Vector(-1, 1),
    new Vector(-1, 0),
    new Vector(0, -1),
    new Vector(0, 0)];