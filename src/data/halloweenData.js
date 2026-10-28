export const SWORD_TO_PUMPKIN = 4;
export const EVENT_DAYS = 5;
export const DEFAULT_TARGET = 4002;
export const TARGET_OPTIONS = [4002, 3500, 3000, 2500, 2000];

const REWARDS = [
  [6, 1],
  [6, 1],
  [13, 1],
  [4, 1],
  [11, 1],
  [22, 1],
  [8, 1],
  [20, 1],
  [33, 1],
  [60, 1],
  [7, 1],
  [14, 2],
  [28, 2],
  [47, 2],
  [93, 3],
  [233, 5],
];

const STAGE_DEFS = [
  {
    id: 1,
    name: 'Glory Badges',
    descs: [
      'Login 1 day',
      'Kill 5 monsters',
      'Kill 15 monsters',
      'Gather 100k res in wild',
      'Gather 500k res in wild',
      'Gather 1.5M res in wild',
      'Use 10 normal recruit',
      'Use 70 normal recruit',
      'Use 150 normal recruit',
      'Use 250 normal recruit',
      'Spend 2k Glory Badges',
      'Spend 6k Glory Badges',
      'Spend 15k Glory Badges',
      'Spend 30k Glory Badges',
      'Spend 45k Glory Badges',
      'Spend 60k Glory Badges',
    ],
  },
  {
    id: 2,
    name: 'Troop Training',
    descs: [
      'Claim all daily quest chests',
      'Claim online reward 10x',
      'Claim online reward 30x',
      'Alliance donate 20x',
      'Alliance donate 50x',
      'Alliance donate 100x',
      'Spend 200 stamina',
      'Spend 500 stamina',
      'Spend 1,000 stamina',
      'Spend 1,500 stamina',
      'Train T7+ troops 540k pts',
      'Train T7+ troops 1.5M pts',
      'Train T7+ troops 3M pts',
      'Train T7+ troops 6M pts',
      'Train T7+ troops 10M pts',
      'Train T7+ troops 18M pts',
    ],
  },
  {
    id: 3,
    name: 'Gold Spend',
    descs: [
      'Claim 5 alliance gift packs',
      'Assist allies 300k res',
      'Assist allies 1M res',
      'Use 1,000m speedups',
      'Use 5,000m speedups',
      'Use 10,000m speedups',
      'Spend 100 energy',
      'Spend 200 energy',
      'Spend 500 energy',
      'Spend 1,000 energy',
      'Spend 1,000 Gold',
      'Spend 10,000 Gold',
      'Spend 40,000 Gold',
      'Spend 80,000 Gold',
      'Spend 130,000 Gold',
      'Spend 200,000 Gold',
    ],
  },
  {
    id: 4,
    name: 'Lion Skill I',
    descs: [
      'Answer patrol question 1x',
      'Gather 500k res in wild',
      'Gather 1.5M res in wild',
      'Kill 5 monsters',
      'Kill 15 monsters',
      'Kill 30 monsters',
      'Wish 20 times',
      'Wish 50 times',
      'Wish 100 times',
      'Wish 200 times',
      'Obtain 50 Lion Shards',
      'Obtain 150 Lion Shards',
      'Obtain 300 Lion Shards',
      'Obtain 550 Lion Shards',
      'Obtain 800 Lion Shards',
      'Obtain 1,200 Lion Shards',
    ],
  },
  {
    id: 5,
    name: 'Adv Recruit',
    descs: [
      'Buy 50% discount item 3x',
      'Claim online reward 5x',
      'Claim online reward 15x',
      'Gather 1M res on map',
      'Gather 4.5M res on map',
      'Gather 10M res on map',
      'Spend 100 energy',
      'Spend 200 energy',
      'Spend 500 energy',
      'Spend 1,000 energy',
      'Use 5 Adv Recruit cards',
      'Use 25 Adv Recruit cards',
      'Use 50 Adv Recruit cards',
      'Use 100 Adv Recruit cards',
      'Use 200 Adv Recruit cards',
      'Use 300 Adv Recruit cards',
    ],
  },
];

export const stages = STAGE_DEFS.map(stage => ({
  id: stage.id,
  name: stage.name,
  tasks: stage.descs.map((desc, i) => ({
    id: `s${stage.id}_t${i + 1}`,
    index: i + 1,
    desc,
    category: i < 10 ? 'Activity' : 'Milestone',
    pumpkins: REWARDS[i][0],
    swords: REWARDS[i][1],
  })),
}));

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

const pickIds = (stageIds, taskIds) =>
  stages
    .filter(s => stageIds.includes(s.id))
    .flatMap(s => s.tasks.filter(t => taskIds.includes(t.index)).map(t => t.id));

const ALL_TASK_IDS = stages.flatMap(s => s.tasks.map(t => t.id));
const BASIC_TASK_IDS = pickIds([1, 2, 3, 4, 5], range(1, 10));

const presetList = [
  {
    key: 'stamina_grind',
    label: 'Stamina Grind',
    ids: [
      ...pickIds([1, 2, 3], range(1, 16)),
      ...pickIds([4], range(1, 11)),
      ...pickIds([5], range(1, 10)),
    ],
  },
  {
    key: 'stamina_save_gold5',
    label: 'Gold Card 5-Tier',
    ids: [
      ...pickIds([1, 2, 3], range(1, 16)),
      ...pickIds([4], range(1, 11)),
      ...pickIds([5], range(1, 15)),
    ],
  },
  {
    key: 'f2p_only',
    label: 'F2P Only',
    ids: BASIC_TASK_IDS,
  },
  {
    key: 'select_all',
    label: 'Select All',
    ids: ALL_TASK_IDS,
  },
  {
    key: 'clear_all',
    label: 'Clear All',
    ids: [],
  },
];

export const PRESETS = presetList.reduce((acc, p) => {
  acc[p.key] = p;
  return acc;
}, {});

export const presetOptions = presetList;
