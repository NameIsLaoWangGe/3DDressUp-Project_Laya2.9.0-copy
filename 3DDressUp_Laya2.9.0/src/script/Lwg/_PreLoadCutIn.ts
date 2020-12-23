import { Admin, EventAdmin, SceneAnimation, TimerAdmin, Tools, _LwgInit, _LwgPreLoad, _SceneName } from "./Lwg";
import { _3D } from "./_3D";
import { _DressingRoom } from "./_DressingRoom";
import { _MakePattern } from "./_MakePattern";
import { _MakeTailor } from "./_MakeTailor";
import { _Res } from "./_PreLoad";
import { _Ranking } from "./_Ranking";
export module _CutInRes {
}
export module _PreLoadCutIn {
    export enum _Event {
        animation1 = '_PreLoadCutIn_animation1',
        preLoad = '_PreLoadCutIn_preLoad',
        animation2 = '_PreLoadCutIn_animation2',
        fromBtnBack = '_PreLoadCutIn_fromBtnBack',
    }
    export let _fromBack: boolean = false;
    export function _init(): void {
        EventAdmin._register(_Event.fromBtnBack, _PreLoadCutIn, () => {
            _fromBack = true;
        })
    }
    export class PreLoadCutIn extends _LwgPreLoad._PreLoadScene {
        lwgOnStart(): void {
            TimerAdmin._frameOnce(50, this, () => {
                EventAdmin._notify(_Event.animation1);
            })
        }
        lwgEvent(): void {
            this._evReg(_Event.animation1, () => {
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
                            if (Admin._PreLoadCutIn.closeName === 'MakePattern' && !_fromBack) {
                                this.iconPhoto();
                            } else {
                                _3D._Scene._ins().intoStart();
                            }
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
        lwgStepComplete(): void {
        }
        lwgAllComplete(): number {
            this._LabelVar('Schedule').text = `100%`;
            return 500;
        }
        lwgOnDisable(): void {
            _fromBack = false;
        }

        /**服装iconicon截图*/
        iconPhoto(): void {
            _3D._Scene._ins().photoBg();
            _3D.DIYCloth._ins().hanger.active = false;
            _3D.DIYCloth._ins().Present.transform.localRotationEulerY = 180;
            const sp = new Laya.Sprite;
            this._Owner.addChild(sp)['size'](126, 146);
            Tools._Draw.cameraToSprite(_3D._Scene._ins()._MainCamara, sp);
            // 少许延迟防止绘制失败
            TimerAdmin._frameOnce(5, this, () => {
                const base64Icon = Tools._Draw.screenshot(sp, 0.5);
                _MakeTailor._DIYClothes._ins()._setPitchProperty(_MakeTailor._DIYClothes._ins()._otherPro.icon, base64Icon);
                _DressingRoom._Clothes._ins().changeAfterMaking();
                _3D._Scene._ins().intoStart();
            })
        }
    }
};
export default _PreLoadCutIn.PreLoadCutIn;



