var TimedEvent = function(time, callback) {
    this.time = time;
    this.callback = callback; 
}

var TimedEventManager = (function() {
    var time = (new Date).getTime();
    var eventList = [];

    var addEvent = function(duration, callback) {
        var timedEvent = new TimedEvent(time + duration, callback);
        eventList.push(timedEvent);
    }

    var tick = function() {
        // This is probably an inefficient way to determine the ticks,
        // but oh well.
        time = (new Date).getTime();
        clearList();
    }

    var clearList = function() {
        // Definitely need to optimize this part. Currently
        // cycling the list to get those event that has
        // timed out
        var newEvent = [];
        for (var i=0;i<eventList.length;i++) {
            timedEvent = eventList[i];
            if (time > timedEvent.time) {
                timedEvent.callback();
            }
            else {
                newEvent.push(timedEvent);
            }
        }

        eventList = newEvent;
    }

    return {addEvent: addEvent, tick: tick};

})();
