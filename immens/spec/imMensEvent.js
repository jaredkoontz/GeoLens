var ImMensEvent = Backbone.Model.extend({

    setParam: function (type, source, value) {
        this.set({
            "type": type,
            "source": source,
            "value": value
        });
    },

    getType: function () {
        return this.get("type");
    },

    getSource: function () {
        return this.get("source");
    },

    getValue: function () {
        return this.get("value");
    }

}, {
    evtTypes: {
        brush: 0,
        rangeSelect: 1,
        clear: 2,
        pan: 3
    }
});