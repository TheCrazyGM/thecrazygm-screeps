var listOfRoles = ['harvester', 'lorry', 'claimer', 'upgrader', 'repairer', 'builder', 'wallRepairer'];

// to be called manually to set the values for minCreeps and other needed memories or to reset
StructureSpawn.prototype.initialize =
    function () {
        /** @type {Room} */
        let room = this.room
        console.log("Intializing..." + room.name)
        for (let role of listOfRoles) {
            this.memory.minCreeps[role] = "0";
        }
        this.memory.minLongHaul[room.name] = "0"
        this.memory.claimRoom = undefined
    }

// Have all the creeps drink the koolaid
StructureSpawn.prototype.koolaid =
    function () {
        /** @type {Room} */
        let room = this.room;

        // find all creeps in room
        /** @type {Array.<Creep>} */
        let creepsInRoom = room.find(FIND_MY_CREEPS);
        for (var name of creepsInRoom) {
            name.suicide()
        }
    }

// create a new function for StructureSpawn
StructureSpawn.prototype.spawnCreepsIfNecessary =
    function () {
        /** @type {Room} */
        let room = this.room;

        // find all creeps in room
        /** @type {Array.<Creep>} */
        let creepsInRoom = room.find(FIND_MY_CREEPS);

        // count the number of creeps alive for each role in this room
        // _.sum will count the number of properties in Game.creeps filtered by the
        //  arrow function, which checks for the creep being a specific role
        /** @type {Object.<string, number>} */
        let numberOfCreeps = {};
        for (let role of listOfRoles) {
            numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
        }
        let maxEnergy = room.energyCapacityAvailable;
        let status = false;

        // if no harvesters are left AND either no miners or no lorries are left
        //  create a backup creep
        if (numberOfCreeps['harvester'] == 0 && numberOfCreeps['lorry'] == 0) {
            // if there are still miners or enough energy in Storage left
            if (numberOfCreeps['miner'] > 0 ||
                (room.storage != undefined && room.storage.store[RESOURCE_ENERGY] >= 150 + 550)) {
                // create a lorry
                status = setStatus(this.createLorry(150));
            }
            // if there is no miner and not enough energy in Storage left
            else {
                // create a harvester because it can work on its own
                status = setStatus(this.createCustomCreep(room.energyAvailable, 'harvester'));
            }
        }
        // if no backup creep is required
        else {
            // check if all sources have miners
            let sources = this.room.find(FIND_SOURCES);
            // iterate over all sources
            for (let source of sources) {
                // if the source has no miner
                if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == source.id)) {
                    // check whether or not the source has a container
                    /** @type {Array.StructureContainer} */
                    let containers = source.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: (i) => i.structureType == STRUCTURE_CONTAINER
                    });
                    // if there is a container next to the source
                    if (containers.length > 0) {
                        // spawn a miner
                        status = setStatus(this.createMiner(source.id));
                        break;
                    }
                }
            }
        }

        // if none of the above caused a spawn command check for other roles
        if (!status) {
            for (let role of listOfRoles) {
                // check for claim order
                if (role == 'claimer' && this.memory.claimRoom != undefined) {
                    // try to spawn a claimer
                    status = setStatus(this.createClaimer(this.memory.claimRoom));
                    // if that worked
                    if (status) {
                        // delete the claim order
                        delete this.memory.claimRoom;
                    }
                }
                // if no claim order was found, check other roles
                else if (numberOfCreeps[role] < this.memory.minCreeps[role]) {
                    if (role == 'lorry') {
                        status = setStatus(this.createLorry(maxEnergy));
                    }
                    else {
                        status = setStatus(this.createCustomCreep(maxEnergy, role));
                    }
                    break;
                }
            }
        }

        // if none of the above caused a spawn command check for LongDistanceHarvesters
        /** @type {Object.<string, number>} */
        let numberOfLongHaul = {};
        if (!status) {
            // count the number of long distance harvesters globally
            for (let roomName in this.memory.minLongHaul) {
                numberOfLongHaul[roomName] = _.sum(Game.creeps, (c) =>
                    c.memory.role == 'longHaul' && c.memory.target == roomName)

                if (numberOfLongHaul[roomName] < this.memory.minLongHaul[roomName]) {
                    status = setStatus(this.createLongHaul(maxEnergy, 2, room.name, roomName, 0));
                }
            }
        }

        // print status to console if spawning was a success
        if (status) {
            console.log(this.name + " spawned new creep: ");
            for (let role of listOfRoles) {
                console.log(role + ": " + numberOfCreeps[role]);
            }
            for (let roomName in numberOfLongHaul) {
                console.log("Longhaul" + roomName + ": " + numberOfLongHaul[roomName]);
            }
        }
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createCustomCreep =
    function (energy, roleName) {
        // create a balanced body as big as possible with the given energy
        var numberOfParts = Math.floor(energy / 200);
        // make sure the creep is not too big (more than 50 parts)
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        var body = [];
        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }

        // create creep with the created body and the given role
        return this.spawnCreep(body, roleName + '_' + Game.time, { memory: { role: roleName, working: false } });
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createLongHaul =
    function (energy, numberOfWorkParts, home, target, sourceIndex) {
        // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
        var body = [];
        for (let i = 0; i < numberOfWorkParts; i++) {
            body.push(WORK);
        }

        // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
        energy -= 150 * numberOfWorkParts;

        var numberOfParts = Math.floor(energy / 100);
        // make sure the creep is not too big (more than 50 parts)
        numberOfParts = Math.min(numberOfParts, Math.floor((50 - numberOfWorkParts * 2) / 2));
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
            body.push(MOVE);
        }

        // create creep with the created body
        return this.spawnCreep(body, "longHaul" + '_' + Game.time, {
            memory: {
                role: 'longHaul',
                home: home,
                target: target,
                sourceIndex: sourceIndex,
                working: false
            }
        });
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createClaimer =
    function (target) {
        return this.spawnCreep([CLAIM, MOVE], 'claimer_' + Game.time, { memory: { role: 'claimer', target: target } });
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createMiner =
    function (sourceId) {
        //return this.spawnCreep([CLAIM, MOVE], 'claimer_' + Game.time, {memory: { role: 'claimer', target: target }});
        return this.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE], 'miner_' + Game.time,
            { memory: { role: 'miner', sourceId: sourceId } });
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createLorry =
    function (energy) {
        // create a body with twice as many CARRY as MOVE parts
        var numberOfParts = Math.floor(energy / 150);
        // make sure the creep is not too big (more than 50 parts)
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        var body = [];
        for (let i = 0; i < numberOfParts * 2; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }

        // create creep with the created body and the role 'lorry'
        return this.spawnCreep(body, 'lorry_' + Game.time, { memory: { role: 'lorry', working: false } });
    };
function setStatus(didSpawn) {
    if (didSpawn == 0) {
        status = true
    }
    else {
        status = false
    }
    return status;
}

