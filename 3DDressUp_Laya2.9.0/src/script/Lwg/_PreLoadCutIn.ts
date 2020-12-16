import { Admin, EventAdmin, SceneAnimation, TimerAdmin, _LwgPreLoad, _SceneName } from "./Lwg";
import { _MakePattern } from "./_MakePattern";
import { _MakeTailor } from "./_MakeTailor";
import { _Res } from "./_PreLoad";
export module _CutInRes {
    export let MakePattern = {
        scene3D: {
            MakeScene: {
                url: `_Lwg3D/_Scene/LayaScene_MakeScene/Conventional/MakeClothes.ls`,
                Scene: null as Laya.Scene3D,
            },
        },
    }
    // export let MakeUp = {
    //     MakeUp: {
    //         url: `_Lwg3D/_Scene/LayaScene_MakeUp/Conventional/MakeUp.ls`,
    //         Scene: null as Laya.Scene3D,
    //     },
    // }
}
export module _PreLoadCutIn {
    export enum _Event {
        animation1 = '_PreLoadCutIn_animation1',
        preLoad = '_PreLoadCutIn_preLoad',
        animation2 = '_PreLoadCutIn_animation2',
    }
    /**可以手动挂在脚本中的类，全脚本唯一的默认导出，也可动态添加，动态添加写在模块内更方便*/
    export class PreLoadCutIn extends _LwgPreLoad._PreLoadScene {
        lwgOnStart(): void {
            TimerAdmin._frameOnce(50, this, () => {
                EventAdmin._notify(_Event.animation1);
            })
        }
        lwgEvent(): void {
            EventAdmin._register(_Event.animation1, this, () => {
                let time = 0;
                TimerAdmin._frameNumLoop(1, 30, this, () => {
                    time++;
                    this._LabelVar('Schedule').text = `${time}`;
                }, () => {
                    switch (Admin._PreLoadCutIn.openName) {
                        case 'MakePattern':
                            this.intoMakePattern();
                            break;
                        case 'MakeTailor':
                            _MakeTailor._DIYClothes._ins().ClothesArr = null;
                            _MakeTailor._DIYClothes._ins().getClothesArr();
                            break;

                        case 'DressingRoom':
                            // this.intoMakePattern();
                            break;
                        case 'Start':
                            this.backStart();
                            break;
                        default:
                            break;
                    }
                    TimerAdmin._frameOnce(20, this, () => {
                        EventAdmin._notify(_LwgPreLoad._Event.importList, [{}]);
                    })
                })
            })
        }
        backStart(): void {
            if (Admin._PreLoadCutIn.closeName == 'DressingRoom') {
                // _Res._list.scene3D.MakeClothes.Scene.removeSelf();
            } else if (Admin._PreLoadCutIn.closeName == 'MakeTailor') {
                // SceneAnimation._closeSwitch = true;
            }
            else if (Admin._PreLoadCutIn.closeName == 'MakePattern') {
                _Res._list.scene3D.MakeClothes.Scene.removeSelf();
            }
        }

        intoMakePattern(): void {
            _MakePattern._Scene3D = _Res._list.scene3D.MakeClothes.Scene;
            Laya.stage.addChildAt(_Res._list.scene3D.MakeClothes.Scene, 0);
            if (!_MakePattern._Scene3D.getComponent(_MakePattern.MakeClothes3D)) {
                _MakePattern._Scene3D.addComponent(_MakePattern.MakeClothes3D);
            }
            EventAdmin._notify(_MakePattern._Event.remake);
        }

        lwgStepComplete(): void {
        }
        lwgAllComplete(): number {
            this._LabelVar('Schedule').text = `100`;
            return 500;
        }
    }
};
export default _PreLoadCutIn.PreLoadCutIn;



