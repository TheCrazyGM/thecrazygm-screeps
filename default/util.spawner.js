/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */
var spawner = {
    transporter: function () {
        var newName = 'Transport' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE], newName, { memory: { role: 'harvester' } })
    },
    bigBuilder: function () {
        var newName = 'BigBuilder' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], newName, { memory: { role: 'builder' } })
    },
    workTruck: function () {
        var newName = 'WorkTruck' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName, { memory: { role: 'builder' } })
    },
    bigUpgrader: function () {
        var newName = 'BigUpgrader' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE], newName, { memory: { role: 'upgrader' } })
    },
    upgrader: function () {
        var newName = 'Upgrader' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'upgrader' } })
    },
    builder: function () {
        var newName = 'Builder' + Game.time;
        Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'builder' } })
    },
};
modules.export = spawner;