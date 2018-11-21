const Grid = function(width, height) {
    const _grids = [
        new Array(width * height).fill(null),
        new Array(width * height).fill(null)];

    let _front = 0;

    const coordsToIndex = (x, y) => {
        return x + width * y;
    };

    const flip = () => _front = 1 - _front;
    const getFront = () => _grids[_front];

    this.get = (x, y) => getFront()[coordsToIndex(x, y)];
    this.set = (x, y, object) => getFront()[coordsToIndex(x, y)] = object;
    this.getWidth = () => width;
    this.getHeight = () => height;
    this.step = () => {

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