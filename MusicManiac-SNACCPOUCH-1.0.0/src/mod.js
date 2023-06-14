"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = __importStar(require("../config.json"));
class Mod {
    postAkiLoad(container) {
        this.container = container;
    }
    postDBLoad(container) {
        const logger = container.resolve("WinstonLogger");
        logger.info("Adding: SNACC to Jaeger");
        const jsonUtil = container.resolve("JsonUtil");
        const databaseServer = container.resolve("DatabaseServer");
        const tables = databaseServer.getTables();
        const handbook = tables.templates.handbook;
        const locales = Object.values(tables.locales.global);
        const item = jsonUtil.clone(tables.templates.items["5d235bb686f77443f4331278"]);
        const itemId = "MA_SNACCPACK", itemCategory = "5795f317245977243854e041", itemName = "Nutrition SICC", itemShortName = "SNACC", itemPrefabPath = "snaccPack/snaccPack.bundle", itemDescription = "This SICC pouch is designated for food supplies. In other words, It's a certified SNACC pack!", itemTraderPrice = config.money_price, itemFleaPrice = config.money_price;
        item._id = itemId;
        item._props.Prefab.path = itemPrefabPath;
        item._props.Grids = this.createGrid(container, itemId, config.columns);
        tables.templates.items[itemId] = item;
        for (const locale of locales) {
            locale[`${itemId} Name`] = itemName;
            locale[`${itemId} ShortName`] = itemShortName;
            locale[`${itemId} Description`] = itemDescription;
        }
        handbook.Items.push({
            "Id": itemId,
            "ParentId": itemCategory,
            "Price": itemFleaPrice
        });
        const trader = tables.traders["5c0647fdd443bc2504c2d371"]; // Jaeger
        trader.assort.items.push({
            "_id": "MA_SNACC1",
            "_tpl": itemId,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd": {
                "StackObjectsCount": 420,
                "BuyRestrictionMax": 1,
                "BuyRestrictionCurrent": 0
            }
        });
        trader.assort.barter_scheme["MA_SNACC1"] = [
            [
                {
                    "count": config.barter_purewater,
                    "_tpl": "5d1b33a686f7742523398398"
                },
                {
                    "count": config.barter_vodka,
                    "_tpl": "5d40407c86f774318526545a"
                },
                {
                    "count": config.barter_moonshine,
                    "_tpl": "5d1b376e86f774252519444e"
                },
                {
                    "count": config.barter_ratcola,
                    "_tpl": "60b0f93284c20f0feb453da7"
                },
                {
                    "count": config.barter_kvass,
                    "_tpl": "5e8f3423fd7471236e6e3b64"
                },
                {
                    "count": config.barter_aquamari,
                    "_tpl": "5c0fa877d174af02a012e1cf"
                },
                {
                    "count": config.barter_whiskey,
                    "_tpl": "5d403f9186f7743cac3f229b"
                },
                {
                    "count": config.barter_waterration,
                    "_tpl": "60098b1705871270cd5352a1"
                }
            ]
        ];
        trader.assort.loyal_level_items["MA_SNACC1"] = config.barter_loyalty_level;
        trader.assort.items.push({
            "_id": "MA_SNACC2",
            "_tpl": itemId,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd": {
                "StackObjectsCount": 420,
                "BuyRestrictionMax": 1,
                "BuyRestrictionCurrent": 0
            }
        });
        trader.assort.barter_scheme["MA_SNACC2"] = [
            [
                {
                    "count": config.money_price,
                    "_tpl": "5449016a4bdc2d6f028b456f"
                }
            ]
        ];
        trader.assort.loyal_level_items["MA_SNACC2"] = config.money_loyalty_level;
        this.allowInSecureContainers(itemId, tables.templates.items);
        logger.info("Added: SNACC to Jaeger");
    }
    allowInSecureContainers(itemId, items) {
        const secureContainers = {
            "kappa": "5c093ca986f7740a1867ab12",
            "gamma": "5857a8bc2459772bad15db29",
            "epsilon": "59db794186f77448bc595262",
            "beta": "5857a8b324597729ab0a0e7d",
            "alpha": "544a11ac4bdc2d470e8b456a",
            "waistPouch": "5732ee6a24597719ae0c0281"
        };
        for (const secureCase in secureContainers) {
            items[secureContainers[secureCase]]
                ._props
                .Grids[0]
                ._props
                .filters[0]
                ?.Filter
                ?.push(itemId);
        }
    }
    createGrid(container, itemId, columns) {
        const grids = [];
        for (const [key, val] of Object.entries(columns)) {
            grids.push(this.generateColumn(container, itemId, `column_${key}`, val.cellH, val.cellV));
        }
        return grids;
    }
    generateColumn(container, itemId, name, cellH, cellV) {
        const hashUtil = container.resolve("HashUtil");
        const FOOD_CASE = "5c093db286f7740a1b2617e3";
        const COFFEE = "5af0484c86f7740f02001f7f";
        const LUPO = "5e54f6af86f7742199090bf3";
        const TEA = "5bc9be8fd4351e00334cae6e";
        const FOOD = "543be6674bdc2df1348b4569";
        const GRECHKA = "6389c6463485cf0eeb260715";
        return {
            "_name": name,
            "_id": hashUtil.generate(),
            "_parent": itemId,
            "_props": {
                "filters": [
                    {
                        "Filter": [FOOD_CASE, COFFEE, LUPO, TEA, FOOD, GRECHKA],
                        "ExcludedFilter": []
                    }
                ],
                "cellsH": cellH,
                "cellsV": cellV,
                "minCount": 0,
                "maxCount": 0,
                "maxWeight": 0,
                "isSortingTable": false
            },
            "_proto": "55d329c24bdc2d892f8b4567"
        };
    }
}
module.exports = { mod: new Mod() };
