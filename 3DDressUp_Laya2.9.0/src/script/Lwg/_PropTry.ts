import ADManager, { TaT } from "../TJ/Admanager";
import ZJADMgr from "../TJ/ZJADMgr";
import { Admin, Click, EventAdmin, Tools, _SceneName } from "./Lwg";
import { _Game } from "./_Game";
import { _SelectLevel } from "./_SelectLevel";

export module _PropTry {
    export let _beforeTry: any;
    export let _presentTry: boolean = false;
    export let _comeFrom: string = _SceneName.SelectLevel;
    export function _init(): void { }
    export enum _Event {
        _PropTryClose = '_PropTryClose',
    }
    export class PropTryBase extends Admin._SceneBase {
        moduleOnAwake(): void {
            ADManager.TAPoint(TaT.PageShow, 'skintrypage');
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_skintry');
            if (_comeFrom == _SceneName.SelectLevel) {
                _Game._GeneralPencils._pitchName = _Game._GeneralPencils._data[0][_Game._GeneralPencils._property.name];
                _Game._ColoursPencils._switch = false;
            }
        }
    }
    export class PropTry extends PropTryBase {
        lwgOnAwake(): void {
            if (Admin._platform.name == Admin._platform.tpye.Research || Admin._platform.name == Admin._platform.tpye.WebTest) {
                Tools.Node.showExcludedChild2D(this.ImgVar('Platform'), [Admin._platform.tpye.Bytedance], true);
                Tools.Node.showExcludedChild2D(this.ImgVar(Admin._platform.tpye.Bytedance), ['High'], true);
            } else {
                Tools.Node.showExcludedChild2D(this.ImgVar('Platform'), [Admin._platform.name], true);
                if (Admin._platform.name == Admin._platform.tpye.Bytedance) {
                    Tools.Node.showExcludedChild2D(this.ImgVar(Admin._platform.tpye.Bytedance), [ZJADMgr.ins.shieldLevel], true);
                }
            }
        }

        lwgOnEnable(): void {
            this.ImgVar('BtnClose').visible = false;
            Laya.timer.once(2000, this, () => {
                this.ImgVar('BtnClose').visible = true;
            })
        }
        lwgEventRegister(): void {
            EventAdmin._registerOnce(_Event._PropTryClose, this, () => {
                if (_comeFrom == _SceneName.SelectLevel) {
                    let levelName = _SceneName.Game + '_' + _SelectLevel._Data._pich.customs;
                    this.lwgOpenScene(levelName, true, () => {
                        if (!Admin._sceneControl[levelName].getComponent(_Game.Game)) {
                            Admin._sceneControl[levelName].addComponent(_Game.Game);
                        }
                    });
                    EventAdmin._notify(_SelectLevel._Event._SelectLevel_Close);
                } else {
                    this.lwgCloseScene();
                }
            })
        }

        lwgBtnClick(): void {

            Click._on(Click._Type.noEffect, this.ImgVar('Bytedance_Low_Select'), this, null, null, this.bytedanceSelectUp);
            Click._on(Click._Type.largen, this.ImgVar('Bytedance_Low_BtnGet'), this, null, null, this.bytedanceGetUp);

            Click._on(Click._Type.noEffect, this.ImgVar('Bytedance_Mid_Select'), this, null, null, this.bytedanceSelectUp);
            Click._on(Click._Type.largen, this.ImgVar('Bytedance_Mid_BtnGet'), this, null, null, this.bytedanceGetUp);

            Click._on(Click._Type.noEffect, this.ImgVar('ClickBg'), this, null, null, this.clickBgtUp);
            Click._on(Click._Type.largen, this.ImgVar('Bytedance_High_BtnGet'), this, null, null, this.bytedanceGetUp);

            Click._on(Click._Type.largen, this.ImgVar('Bytedance_High_BtnNo'), this, null, null, (e: Laya.Event) => {
                e.stopPropagation()
                EventAdmin._notify(_Event._PropTryClose);
            });
            Click._on(Click._Type.largen, this.ImgVar('OPPO_BtnNo'), this, null, null, (e: Laya.Event) => {
                e.stopPropagation()
                EventAdmin._notify(_Event._PropTryClose);
            });
            Click._on(Click._Type.largen, this.ImgVar('OPPO_BtnGet'), this, null, null, (e: Laya.Event) => {
                e.stopPropagation()
                this.advFunc();
            });
            Click._on(Click._Type.largen, this.ImgVar('BtnClose'), this, null, null, (e: Laya.Event) => {
                e.stopPropagation()
                EventAdmin._notify(_Event._PropTryClose);
            });
        }
        clickBgtUp(e: Laya.Event): void {
            e.stopPropagation();
            if (Admin._platform.name !== Admin._platform.tpye.Bytedance) {
                return;
            }
            let Dot: Laya.Image;
            if (this.ImgVar('Low').visible) {
                Dot = this.ImgVar('Bytedance_Low_Dot');
            } else if (this.ImgVar('Mid').visible) {
                Dot = this.ImgVar('Bytedance_Mid_Dot');
            }
            if (!Dot) {
                return;
            }
            if (Dot.visible) {
                this.advFunc();
            } else {
                EventAdmin._notify(_Event._PropTryClose);
            }
        }

        bytedanceGetUp(e: Laya.Event): void {
            e.stopPropagation();
            this.advFunc();
        }

        bytedanceSelectUp(e: Laya.Event): void {
            e.stopPropagation();
            if (this.ImgVar('Low').visible) {
                if (!this.ImgVar('Low')['count']) {
                    this.ImgVar('Low')['count'] = 0;
                }
                this.ImgVar('Low')['count']++;
                if (this.ImgVar('Low')['count'] >= 4) {
                    if (this.ImgVar('Bytedance_Low_Dot').visible) {
                        this.ImgVar('Bytedance_Low_Dot').visible = false;
                    } else {
                        this.ImgVar('Bytedance_Low_Dot').visible = true;
                    }
                }
                if (ZJADMgr.ins.CheckPlayVideo()) {
                    ADManager.ShowReward(null);
                }
            } else if (this.ImgVar('Mid').visible) {
                if (!this.ImgVar('Mid')['count']) {
                    this.ImgVar('Mid')['count'] = 0;
                }
                this.ImgVar('Mid')['count']++;
                if (this.ImgVar('Mid')['count'] >= 4) {
                    if (this.ImgVar('Bytedance_Mid_Dot').visible) {
                        this.ImgVar('Bytedance_Mid_Dot').visible = false;
                    } else {
                        this.ImgVar('Bytedance_Mid_Dot').visible = true;
                    }
                }
            }
        }
        advFunc(): void {
            ADManager.ShowReward(() => {
                ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_skintry');
                _Game._GeneralPencils._pitchName = _Game._GeneralPencils._effectType.colours;
                _Game._ColoursPencils._switch = true;
                _Game._ColoursPencils._clickNum = 2;
                EventAdmin._notify(_Event._PropTryClose);
            })
        }

        onDisable(): void {
            _Game._activate = true;
            ADManager.TAPoint(TaT.PageLeave, 'skintrypage');
        }
    }
}
export default _PropTry.PropTry;
