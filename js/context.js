const Context = function(neighbors, access, fertilizer) {
    this.neighbors = neighbors;
    this.access = access;
    this.fertilizer = fertilizer;
};

Context.prototype.getAccess = function() {
    const access = [];

    for (let direction = 0; direction < 6; ++direction) if (this.access[direction])
        access.push(direction);

    return access;
};