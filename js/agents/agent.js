const Agent = {};

Agent.prototype = {
    mass: 0,

    getMass: function() {
        return this.mass;
    },

    setMass: function(mass) {
        this.mass = mass;
    }
};