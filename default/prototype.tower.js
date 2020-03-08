// create a new function for StructureTower
StructureTower.prototype.defend =
    function () {
        // find closes hostile creep
        var target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        var closestDamagedStructure = this.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
    
        // if one is found...
        if (target != undefined) {
            // ...FIRE!
            this.attack(target);
        }
        else {
            if (closestDamagedStructure) {
                //this.repair(closestDamagedStructure);
                this.build(constructionSite)
            }
        }
    };
