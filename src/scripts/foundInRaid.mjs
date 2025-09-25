import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRootDir = path.join(__dirname, '../../');

// 包含混合物品任务
const includedMixedItemsTasks = [
    '59ca29fb86f77445ab465c87', // 惩罚者 - 5
];

// PVE

// 藏身处与任务
const pveTasksFileData = fs.readFileSync(path.join(projectRootDir, 'public/tarkov/data/pve/tasks.json'), 'utf-8');
const pveTasks = JSON.parse(pveTasksFileData).data.tasks;
const pveHideoutStationsFileData = fs.readFileSync(path.join(projectRootDir, 'public/tarkov/data/pve/hideoutStations.json'), 'utf-8');
const pveHideoutStations = JSON.parse(pveHideoutStationsFileData).data.hideoutStations;

// 物品
const taskItems = [];
const barterItems = [];
const mixedItemsTasks = [];

function addTaskItem(taskItem, taskObjective, task) {
    let item = taskItems.find(i => i.id === taskItem.id);
    if (!item) {
        item = {
            id: taskItem.id,
            name: taskItem.name,
            normalizedName: taskItem.normalizedName,
            types: taskItem.types,
            iconLink: handleImage(taskItem.iconLink),
            wikiLink: taskItem.wikiLink,
            tasks: [],
        };
        taskItems.push(item);
    }

    item.tasks.push({
        id: task.id,
        name: task.name,
        trader: task.trader.name,
        traderImageLink: handleImage(task.trader.imageLink),
        kappaRequired: task.kappaRequired,
        count: taskObjective.count,
        mixedItemsTask: taskObjective.items.length > 1,
    });
}

function addBarterTaskItem(taskItem, taskObjective, task) {
    let item = barterItems.find(i => i.id === taskItem.id);
    if (!item) {
        item = {
            id: taskItem.id,
            name: taskItem.name,
            normalizedName: taskItem.normalizedName,
            types: taskItem.types,
            iconLink: handleImage(taskItem.iconLink),
            wikiLink: taskItem.wikiLink,
            tasks: [],
            hideoutStations: [],
        }
        barterItems.push(item);
    }

    item.tasks.push({
        id: task.id,
        name: task.name,
        trader: task.trader.name,
        traderImageLink: handleImage(task.trader.imageLink),
        kappaRequired: task.kappaRequired,
        count: taskObjective.count,
        mixedItemsTask: taskObjective.items.length > 1,
    });
}

function addBarterHideoutItem(hideoutReq, station, level) {
    let item = barterItems.find(i => i.id === hideoutReq.item.id);
    if (!item) {
        item = {
            id: hideoutReq.item.id,
            name: hideoutReq.item.name,
            normalizedName: hideoutReq.item.normalizedName,
            types: hideoutReq.item.types,
            iconLink: handleImage(hideoutReq.item.iconLink),
            wikiLink: hideoutReq.item.wikiLink,
            tasks: [],
            hideoutStations: [],
        }
        barterItems.push(item);
    }

    item.hideoutStations.push({
        id: level.id,
        stationId: station.id,
        name: station.name,
        normalizedName: station.normalizedName,
        imageLink: handleImage(station.imageLink),
        level: level.level,
        count: hideoutReq.quantity,
    });
}

function handleImage(link) {
    if (link.startsWith('https://assets.tarkov.dev/')) {
        return link.replace('https://assets.tarkov.dev/', '');
    } else {
        console.log('未知图片链接:', link);
    }
    return link;
}

// 任务物品
pveTasks.forEach(task => {
    if (task.factionName !== 'BEAR' && task.objectives) {
        // 阵营任务会重复 仅取USEC和Any
        const mixedItemsObjectives = [];
        task.objectives.forEach(objective => {
            if (objective.__typename === 'TaskObjectiveItem' && objective.type === 'giveItem' && objective.foundInRaid) {
                if (objective.items.length === 1 || includedMixedItemsTasks.indexOf(task.id) > -1) {
                    const taskItem = objective.items[0];
                    if (taskItem.types.includes('barter')) {
                        // 交换用物品
                        addBarterTaskItem(taskItem, objective, task);
                    } else {
                        // 其他任务物品
                        addTaskItem(taskItem, objective, task);
                    }
                } else {
                    mixedItemsObjectives.push(objective);
                }
            }
        });
        if (mixedItemsObjectives.length > 0) {
            mixedItemsTasks.push({
                ...task,
                objectives: mixedItemsObjectives,
            });
        }
        
    }
});

// 藏身处建造物品
pveHideoutStations.forEach(station => {
    station.levels.forEach(level => {
        if (level.itemRequirements) {
            level.itemRequirements.forEach(req => {
                const foundInRaid = req.attributes.findIndex(attr => attr.name === 'foundInRaid' && attr.value === 'true') > -1;
                if (foundInRaid) {
                    addBarterHideoutItem(req, station, level);
                }
            });
        }
    });
});

// 保存结果
fs.writeFileSync(
    path.join(projectRootDir, 'public/tarkov/data/pve/foundInRaidBarterItems.json'),
    JSON.stringify(barterItems, null, 4),
    'utf-8' 
);
fs.writeFileSync(
    path.join(projectRootDir, 'public/tarkov/data/pve/foundInRaidTaskItems.json'),
    JSON.stringify(taskItems, null, 4),
    'utf-8'
);
fs.writeFileSync(
    path.join(projectRootDir, 'public/tarkov/data/pve/mixedItemsTasks.json'),
    JSON.stringify(mixedItemsTasks, null, 4),
    'utf-8'
);
