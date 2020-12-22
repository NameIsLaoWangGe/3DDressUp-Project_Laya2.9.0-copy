import { Admin, EventAdmin, SceneAnimation, TimerAdmin, _LwgPreLoad, _SceneName } from "./Lwg";
import { _3D } from "./_3D";
import { _MakePattern } from "./_MakePattern";
import { _MakeTailor } from "./_MakeTailor";
import { _Res } from "./_PreLoad";
export module _CutInRes {
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
                    this._LabelVar('Schedule').text = `${time}%`;
                }, () => {
                    switch (Admin._PreLoadCutIn.openName) {
                        case 'MakePattern':
                            _3D._Scene._ins().intoMakePattern();
                            break;
                        case 'MakeTailor':
                            _3D._Scene._ins().intoMakeTailor();
                            _MakeTailor._DIYClothes._ins().ClothesArr = null;
                            _MakeTailor._DIYClothes._ins().getClothesArr();
                            break;
                        case 'Start':
                            _3D._Scene._ins().intoStart();
                            break;
                        case 'DressingRoom':
                            _3D._Scene._ins().intogeDressingRoom();
                        default:
                            break;
                    }
                    TimerAdmin._frameOnce(20, this, () => {
                        EventAdmin._notify(_LwgPreLoad._Event.importList, [{}]);
                    })
                })
            })
        }
        intoMakePattern(): void {
            // Laya.stage.addChildAt(_Res._list.scene3D.MakeClothes.Scene, 0);
            EventAdmin._notify(_MakePattern._Event.remake);
        }

        lwgStepComplete(): void {
        }
        lwgAllComplete(): number {
            this._LabelVar('Schedule').text = `100%`;
            return 500;
        }
        // lwgCloseAni(): number {
        //     return 100;
        // }
    }
};
export default _PreLoadCutIn.PreLoadCutIn;



