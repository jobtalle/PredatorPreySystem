const Action = function(type, direction) {
    this.type = type;
    this.direction = direction;
};

Action.TYPE_IDLE = 0;
Action.TYPE_MOVE = 1;
Action.TYPE_COPY = 2;
Action.TYPE_DIE = 3;
Action.TYPE_EAT = 4;