const Action = function(type, arg0, arg1) {
    this.type = type;
    this.arg0 = arg0;
    this.arg1 = arg1;
};

Action.TYPE_IDLE = 0;
Action.TYPE_MOVE = 1;
Action.TYPE_COPY = 2;
Action.TYPE_DIE = 3;
Action.TYPE_EAT = 4;