const Agent = {};

Agent.prototype = {
    mass: 0,

    getMass: function() {
        return this.mass;
    },

    setMass: function(mass) {
        this.mass = mass;
    },

    consumeMass: function(factor) {
        const consumed = this.mass * factor;

        this.mass -= consumed;

        return consumed;
    },

    addMass: function(quantity) {
        this.mass += quantity;
    }
};