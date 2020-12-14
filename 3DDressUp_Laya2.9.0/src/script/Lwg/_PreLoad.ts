import ADManager, { TaT } from "../TJ/Admanager";
import { Admin, EventAdmin, _LwgPreLoad, _SceneName } from "./Lwg";
export module _Res {
    export let _list = {
        scene3D: {
            MakeClothes: {
                url: `_Lwg3D/_Scene/LayaScene_MakeClothes/Conventional/MakeClothes.ls`,
                Scene: null as Laya.Scene3D,
            },
            // MakeUp: {
            //     url: `_Lwg3D/_Scene/LayaScene_MakeUp/Conventional/MakeUp.ls`,
            //     Scene: null as Laya.Scene3D,
            // }
        },
        // prefab3D: {
        //     Level1: {
        //         url: '_Lwg3D/_Prefab/LayaScene_GameMain/Conventional/CardContainer.lh',
        //         Prefab: null as Laya.Sprite3D,
        //     }
        // },
        pic2D: {
            Effects: "res/atlas/lwg/Effects.png",
            MakeClothes: `res/atlas/Game/UI/MakeClothes.png`,
        },
        // mesh3D: {},
        // material: {},
        prefab2D: {
            BtnAgain: {
                url: 'Prefab/BtnaGain.json',
                prefab: new Laya.Prefab,
            },
            BtnBack: {
                url: 'Prefab/BtnBack3.json',
                prefab: new Laya.Prefab,
            },
            BtnRollback: {
                url: 'Prefab/BtnRollback.json',
                prefab: new Laya.Prefab,
            },


            diy_bottom_003_final: {
                url: 'Prefab/diy_bottom_003_final.json',
                prefab: new Laya.Prefab,
            },
            diy_bottom_004_final: {
                url: 'Prefab/diy_bottom_004_final.json',
                prefab: new Laya.Prefab,
            },
            diy_bottom_005_final: {
                url: 'Prefab/diy_bottom_005_final.json',
                prefab: new Laya.Prefab,
            },
            diy_bottom_006_final: {
                url: 'Prefab/diy_bottom_006_final.json',
                prefab: new Laya.Prefab,
            },

            diy_dress_001_final: {
                url: 'Prefab/diy_dress_001_final.json',
                prefab: new Laya.Prefab,
            },
            diy_dress_002_final: {
                url: 'Prefab/diy_dress_002_final.json',
                prefab: new Laya.Prefab,
            },
            diy_dress_003_final: {
                url: 'Prefab/diy_dress_003_final.json',
                prefab: new Laya.Prefab,
            },
            diy_dress_004_final: {
                url: 'Prefab/diy_dress_004_final.json',
                prefab: new Laya.Prefab,
            },
            diy_dress_006_final: {
                url: 'Prefab/diy_dress_006_final.json',
                prefab: new Laya.Prefab,
            },
            diy_dress_008_final: {
                url: 'Prefab/diy_dress_008_final.json',
                prefab: new Laya.Prefab,
            },

            diy_top_005_final: {
                url: 'Prefab/diy_top_005_final.json',
                prefab: new Laya.Prefab,
            },
            diy_top_006_final: {
                url: 'Prefab/diy_top_006_final.json',
                prefab: new Laya.Prefab,
            },
            diy_top_007_final: {
                url: 'Prefab/diy_top_007_final.json',
                prefab: new Laya.Prefab,
            },
        },
        texture: {
            // glasses: {
            //     url: `/_Lwg3D/_Scene/LayaScene_MakeUp/Conventional/Assets/Reference/Texture2D/common_s.png`,
            //     texture: null as Laya.Texture,
            // },
        },
        texture2D: {
            Figure1: {
                url: `_Lwg3D/_Scene/LayaScene_MakeClothes/Conventional/Assets/13213/qunzi1.jpg`,
                texture2D: null as Laya.Texture2D,
            },
            // Figure2: {
            //     url: `_Lwg3D/_Scene/LayaScene_MakeUp/Conventional/Assets/Reference/Sprite/repeat_pattern_04 _9681.jpg`,
            //     texture2D: null as Laya.Texture2D,
            // },
            // Figure3: {
            //     url: 'Game/UI/MakeClothes/figure_03.png',
            //     texture2D: null as Laya.Texture2D,
            // },
        },
        /**通过直接获取场景的显示和打开，和scene关联，实现，先加载，然后直接切换*/
        scene2D: {
            Start: `Scene/${_SceneName.Start}.json`,
            Guide: `Scene/${_SceneName.Guide}.json`,
            PreLoadStep: `Scene/${_SceneName.PreLoadCutIn}.json`,
            MakePattern: `Scene/${'MakePattern'}.json`,
            // AdsHint: `Scene/${_SceneName.AdsHint}.json`, 
            // Special: `Scene/${_SceneName.Special}.json`,
            // Victory: `Scene/${_SceneName.Victory}.json`,
            // SelectLevel: `Scene/${_SceneName.SelectLevel}.json`,
            // Settle: `Scene/${_SceneName.Settle}.json`,
            // PropTry: `Scene/${_SceneName.PropTry}.json`,
            // Share: `Scene/${_SceneName.Share}.json`,
        },

        json: {
            GeneralClothes: {
                url: `_LwgData/_DressingRoom/GeneralClothes.json`,
                dataArr: new Array,
            },
            DIYClothes: {
                url: `_LwgData/_DressingRoom/DIYClothes.json`,
                dataArr: new Array,
            },
            MakePattern: {
                url: `_LwgData/_MakePattern/MakePattern.json`,
                dataArr: new Array,
            },
            Ranking: {
                url: `_LwgData/_Ranking/Ranking.json`,
                dataArr: new Array,
            }
        },
        // skeleton: {
        //     test: {
        //         url: 'Game/Skeleton/test.sk',
        //         templet: new Laya.Templet,
        //     },
        // }
    }
}

export module _PreLoad {
    export class PreLoad extends _LwgPreLoad._PreLoadScene {
        lwgOnStart(): void {
            this._evNotify(_LwgPreLoad._Event.importList, [_Res._list]);
            // ADManager.TAPoint(TaT.PageShow, 'loadpage');
            // this._AniVar('ani1').play(0, false);
            // this._AniVar('ani1').on(Laya.Event.LABEL, this, () => {
            //     EventAdmin._notify(_LwgPreLoad._Event.importList, (_PreloadUrl._list));
            // })
        }
        lwgOpenAni(): number { return 1; }
        lwgStepComplete(): void {
        }
        lwgAllComplete(): number {
            return 1000;
        }
        lwgOnDisable(): void {
            // ADManager.TAPoint(TaT.PageLeave, 'loadpage');
        }
    }

}
export default _PreLoad.PreLoad;


