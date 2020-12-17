import ADManager, { TaT } from "../TJ/Admanager";
import { Admin, Animation2D, AudioAdmin, Color, Effects, EventAdmin, TimerAdmin, Tools, _LwgPreLoad, _SceneName } from "./Lwg";
import { _DressingRoom } from "./_DressingRoom";
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
        prefab3D: {
            Level1: {
                url: `_Lwg3D/_Prefab/LayaScene_MakeClothes/Conventional/MakeClothes.ls`,
                Prefab: null as Laya.Sprite3D,
            }
        },
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

            diy_bottom_002_final: {
                url: 'Prefab/diy_bottom_002_final.json',
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
            diy_dress_005_final: {
                url: 'Prefab/diy_dress_005_final.json',
                prefab: new Laya.Prefab,
            },
            diy_dress_006_final: {
                url: 'Prefab/diy_dress_006_final.json',
                prefab: new Laya.Prefab,
            },
            diy_dress_007_final: {
                url: 'Prefab/diy_dress_007_final.json',
                prefab: new Laya.Prefab,
            },
            diy_dress_008_final: {
                url: 'Prefab/diy_dress_008_final.json',
                prefab: new Laya.Prefab,
            },

            diy_top_003_final: {
                url: 'Prefab/diy_top_003_final.json',
                prefab: new Laya.Prefab,
            },
            diy_top_004_final: {
                url: 'Prefab/diy_top_004_final.json',
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
            diy_top_008_final: {
                url: 'Prefab/diy_top_008_final.json',
                prefab: new Laya.Prefab,
            },

        },
        texture: {
            // glasses: {
            //     url: `/_Lwg3D/_Scene/LayaScene_MakeUp/Conventional/Assets/Reference/Texture2D/common_s.png`,
            //     texture: null as Laya.Texture,
            // },
        },
        /**图片需要设置成不打包*/
        texture2D: {
            bgStart: {
                url: `Game/Background/bgStart.jpg`,
                texture2D: null as Laya.Texture2D,
            },
            bgDressingRoom: {
                url: `Game/Background/bgDressingRoom.jpg`,
                texture2D: null as Laya.Texture2D,
            },
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

        count = 0;
        lwgOnStart(): void {
            const scale = 1.2;
            const time = 100;
            const delay = 100;
            this._ImgVar('LoGo').scale(0, 0);
            this._ImgVar('Progress').scale(0, 0);
            this._ImgVar('Anti').alpha = 0;
            TimerAdmin._once(delay * 4, this, () => {
                this.effect();
            })
            TimerAdmin._once(delay * 4, this, () => {
                Color._changeOnce(this._ImgVar('BG'), [100, 50, 0, 1], time / 3);
            })

            TimerAdmin._frameLoop(time / 2 * 2, this, () => {
                TimerAdmin._once(delay * 6, this, () => {
                    Color._changeOnce(this._ImgVar('LoGo'), [5, 40, 10, 1], time / 2);
                })
            })

            Animation2D.bombs_Appear(this._ImgVar('LoGo'), 0, 1, scale, 0, time * 5, () => {

                // 星星闪烁动画左边
                TimerAdmin._frameRandomLoop(30, 50, this, () => {
                    Effects._Glitter._blinkStar(this._Owner, new Laya.Point(this._ImgVar('LoGo').x - 350, this._ImgVar('LoGo').y), [150, 100], [Effects._SkinUrl.星星1], null, [80, 80]);
                }, true)
                // 星星闪烁动画右边
                TimerAdmin._frameRandomLoop(30, 50, this, () => {
                    Effects._Glitter._blinkStar(this._Owner, new Laya.Point(this._ImgVar('LoGo').x + 350, this._ImgVar('LoGo').y), [150, 100], [Effects._SkinUrl.星星1], null, [80, 80]);
                }, true)

                Animation2D.bombs_Appear(this._ImgVar('Progress'), 0, 1, scale, 0, time * 1.5, () => {
                    TimerAdmin._frameNumLoop(2, 50, this, () => {
                        this.count++;
                        this.progressDisplay();
                    }, () => {
                        this._evNotify(_LwgPreLoad._Event.importList, [_Res._list]);
                    }, true)
                    Animation2D.fadeOut(this._ImgVar('Anti'), 0, 1, time * 2)
                }, delay * 4);
                TimerAdmin._once(delay * 4, this, () => {
                    AudioAdmin._playSound(AudioAdmin._voiceUrl.btn);
                })
            }, delay * 4);
        }

        effect(): void {
            const count = 90;
            const time = 35;
            const dis = Tools._Number.randomOneInt(500, 500);
            const p = new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2);
            for (let index = 0; index < count; index++) {
                Effects._Particle._sprayRound(this._Owner, p, null, [20, 40], null, [Effects._SkinUrl.花4], null, [dis, dis], [time, time], null, null, 5);
            }
            for (let index = 0; index < count * 2; index++) {
                Effects._Particle._sprayRound(this._Owner, p, null, [20, 40], null, [Effects._SkinUrl.花4], null, [100, dis - 20], [time, time], null, null, 5);
            }
        }

        progressDisplay(): void {
            this._ImgVar('ProgressBar').mask.x = - this._ImgVar('ProgressBar').width + this._ImgVar('ProgressBar').width / 100 * this.count;
        }
        lwgOpenAni(): number { return 1; }
        lwgStepComplete(): void {
            this._ImgVar('ProgressBar').mask.x += 5;
        }
        lwgAllComplete(): number {
            this._ImgVar('ProgressBar').mask.x = 0;
            _DressingRoom._Clothes._ins().changeClothStart();
            return 1000;
        }
        lwgOnDisable(): void {
            // ADManager.TAPoint(TaT.PageLeave, 'loadpage');
        }
    }

}
export default _PreLoad.PreLoad;


