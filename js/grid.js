const Grid = function(width, height) {
    const _grids = [
        new Array(width * height + 1).fill(null),
        new Array(width * height + 1).fill(null)];

    let _front = 0;

    const coordsToIndex = (x, y) => {
        if (x < 0 || y < 0 || x >= width || y >= height)
            return width * height;

        return x + width * y;
    };

    const isFree = (x, y) => {
        const index = coordsToIndex(x, y);

        if (index === width * height)
            return false;

        return !getFront()[index] && !getBack()[index];
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
            neighbors[direction] = getBack()[coordsToIndex(x + deltas[direction].x, y + deltas[direction].y)];
            access[direction] = isFree(x + deltas[direction].x, y + deltas[direction].y);
        }

        return new Context(neighbors, access);
    };

    const flip = () => _front = 1 - _front;
    const getFront = () => _grids[_front];
    const getBack = () => _grids[1 - _front];

    this.get = (x, y) => getFront()[coordsToIndex(x, y)];
    this.set = (x, y, object) => getFront()[coordsToIndex(x, y)] = object;
    this.getWidth = () => width;
    this.getHeight = () => height;
    this.step = () => {
        flip();

        for (let y = 0; y < height; ++y) for (let x = 0; x < width; ++x) {
            const agent = getBack()[coordsToIndex(x, y)];

            if (!agent)
                continue;

            const context = makeContext(x, y);
            const action = agent.step(context);

            switch (action.type) {
                case Action.TYPE_COPY:
                    if (context.access[action.direction])
                        getFront()[coordsToIndex(x, y)] = agent.copy();

                case Action.TYPE_MOVE:
                    if (context.access[action.direction]) {
                        const deltas = getDeltas(x);
                        const index = coordsToIndex(x + deltas[action.direction].x, y + deltas[action.direction].y);

                        getFront()[index] = agent;
                        getBack()[index] = null;
                    }
                    else
                        getFront()[coordsToIndex(x, y)] = agent;

                    break;
                case Action.TYPE_EAT:
                    if (context.neighbors[action.direction]) {
                        const deltas = getDeltas(x);
                        const index = coordsToIndex(x + deltas[action.direction].x, y + deltas[action.direction].y);

                        getFront()[index] = agent;
                        getBack()[index] = null;
                    }
                    else
                        getFront()[coordsToIndex(x, y)] = agent;

                    break;
                case Action.TYPE_IDLE:
                    getFront()[coordsToIndex(x, y)] = agent;

                    break;
            }
        }

        getBack().fill(null);
    };
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