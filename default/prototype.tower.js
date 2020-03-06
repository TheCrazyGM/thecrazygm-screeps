// create a new function for StructureTower
StructureTower.prototype.defend =
    function () {
        // find closes hostile creep
        var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        // if one is found...
        if (target != undefined) {
            // ...FIRE!
            this.attack(target);
        }
        else {
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }
    };
