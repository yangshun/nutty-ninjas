var CollisionManager = (function() {
    var callback_table = {};

    var collisionKey = function(objA, objB) {
        var typeA = objA._type;
        var typeB = objB._type;

        var key = typeA + ':' + typeB;
        if (typeA > typeB) {
            key = typeB + ':' + typeA;
        }
        return key;
    }

    var registerCallback = function(classA, classB, callback) {
        var key = collisionKey(new classA(), new classB());

        if (key in callback_table) {
            callback_table[key].push(callback);
        }

        else {
            callback_table[key] = [callback];
        }
    }

    var collision = function(objA, objB) {
        objA.collide(objB);
        objB.collide(objA);

        var key = collisionKey(objA, objB);
        if (key in callback_table) {
            for (var i=0;i<callback_table[key].length;i++) {
                callback_table[key][i](objA, objB);
            }
        }
    };

    return {collision: collision, registerCallback: registerCallback};
    
})();
