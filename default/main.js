// import modules
require('prototype.creep');
require('prototype.tower');
require('prototype.spawn');

module.exports.loop = function () {
    // check for memory entries of died creeps by iterating over Memory.creeps
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
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


    // for each creeps
    for (let name in Game.creeps) {
        // run creep logic
        Game.creeps[name].runRole();
    }

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

    // for each spawn
    for (let spawnName in Game.spawns) {
        // run spawn logic
        Game.spawns[spawnName].spawnCreepsIfNecessary();
    }
};
