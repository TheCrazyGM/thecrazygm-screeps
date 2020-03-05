// import modules
require('prototype.creep');
require('prototype.tower');
require('prototype.spawn');

module.exports.loop = function () {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for (var name in Game.rooms) {
        percent = (Game.rooms[name].controller.progress / Game.rooms[name].controller.progressTotal) * 100;
        Game.rooms[name].visual.text(
            '⚡' + Game.rooms[name].controller.progress + '/' + Game.rooms[name].controller.progressTotal,
            Game.rooms[name].controller.pos.x + 1,
            Game.rooms[name].controller.pos.y, {
            color: 'rgb(255,255,255)',
            align: 'left',
            opacity: 0.8
        });
        console.log(Game.rooms[name].controller.progress, Game.rooms[name].controller.progressTotal, percent);
    }
    /*
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        console.log('Harvesters: ' + harvesters.length);
    
        if (harvesters.length < 2) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
                { memory: { role: 'harvester' } });
        }
    
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        console.log('Builders: ' + builders.length);
    
        if (builders.length < 2) {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE], newName,
                { memory: { role: 'builder' } });
        }
    
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        console.log('Upgraders: ' + upgraders.length);
    
        if (upgraders.length < 2) {
            var newName = 'Upgraders' + Game.time;
            console.log('Spawning new upgraders: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE], newName,
                { memory: { role: 'upgrader' } });
        }
    */
    // find all towers
    var towers = _.filter(Game.structures, s => s.structureType == STRUCTURE_TOWER);
    // for each tower
    for (let tower of towers) {
        // run tower logic
        tower.defend();
    }
    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            { align: 'left', opacity: 0.8 });
    }
    else
        for (var name in Game.rooms) {
            Game.spawns['Spawn1'].room.visual.text(
                '⚡' + Game.rooms[name].energyAvailable,
                Game.spawns['Spawn1'].pos.x + 1, Game.spawns['Spawn1'].pos.y,
                { align: 'left', opacity: 0.8 });
        }
    // for each creeps
    for (let name in Game.creeps) {
        // run creep logic
        Game.creeps[name].runRole();
    }
}