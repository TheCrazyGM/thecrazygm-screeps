Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE], 'Transport', { memory: { role: 'harvester' } } );
Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], 'BuilderBig', { memory: { role: 'builder' } } );
Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], 'WorkTruck', { memory: { role: 'builder' } } );
Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE], 'UpgraderBig', { memory: { role: 'upgrader' } } );



Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], "Upgrader-2", {memory: {role: 'upgrader'}});

Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], "Builder-2", {memory: {role: 'builder'}});

yellow color is (250, 240, 85)