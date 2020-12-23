import ADManager, { TaT } from "../TJ/Admanager";
import { Admin, Animation2D, TimerAdmin, _SceneName, Tools, } from "./Lwg";
import { _3D } from "./_3D";
import { _Game } from "./_Game";
import { _MakeTailor } from "./_MakeTailor";
import { _Res } from "./_PreLoad";
import { _Ranking } from "./_Ranking";
import { _UI } from "./_UI";

export module _Start {
    export enum _Event {
        updateRanking = '_Start_updateRanking',
    }
    export function _init(): void {
    }
    export class Start extends Admin._SceneBase {
        lwgOnAwake(): void {
            Tools._Node.childrenVisible2D(this._ImgVar('BtnParent'), false);
            _3D._Scene._ins().openStartAni(() => {
                this._ImgVar('BtnTop').pos(_3D._Scene._ins().btnTopPos.x, _3D._Scene._ins().btnTopPos.y);
                this._ImgVar('BtnDress').pos(_3D._Scene._ins().btnDressPos.x, _3D._Scene._ins().btnDressPos.y);
                this._ImgVar('BtnBottoms').pos(_3D._Scene._ins().btnBottomsPos.x, _3D._Scene._ins().btnBottomsPos.y);
                this._ImgVar('BtnDressingRoom').pos(_3D._Scene._ins().btnDressingRoomPos.x, _3D._Scene._ins().btnDressingRoomPos.y);

                for (let index = 0; index < this._ImgVar('BtnParent').numChildren; index++) {
                    const element = this._ImgVar('BtnParent').getChildAt(index) as Laya.Image;
                    element.visible = true;
                    const delay = 200 * index;
                    Animation2D.bombs_Appear(element, 0, 1, 1.2, 0, 200, null, delay);
                    const UI = new _UI(null);
                    UI.effect(this._Owner, new Laya.Point(element.x, element.y), delay);
                }
            });

            if (_Ranking._whereFrom === 'MakePattern') {
                TimerAdmin._frameOnce(60, this, () => {
                    this._openScene('Ranking', false);
                })
            }
        }

        lwgOnStart(): void {
            this._evNotify(_Event.updateRanking);
        }

        lwgEvent(): void {
            this._evReg(_Event.updateRanking, () => {
                let obj = _Ranking._Data._ins()._getPitchObj();
                this._LabelVar('RankNum').text = `${obj[_Ranking._Data._ins()._otherPro.rankNum]}/50`;
            })
        }

        lwgButton(): void {
            const Clothes = _MakeTailor._DIYClothes._ins();
            this._btnUp(this._ImgVar('BtnTop'), () => {
                _3D._Scene._ins().cameraToSprite(this._Owner);
                Clothes._pitchClassify = Clothes._classify.Top;
                this._openScene('MakeTailor', true, true);
            })
            this._btnUp(this._ImgVar('BtnDress'), () => {
                _3D._Scene._ins().cameraToSprite(this._Owner);
                Clothes._pitchClassify = Clothes._classify.Dress;
                this._openScene('MakeTailor', true, true);
            })
            this._btnUp(this._ImgVar('BtnBottoms'), () => {
                _3D._Scene._ins().cameraToSprite(this._Owner);
                Clothes._pitchClassify = Clothes._classify.Bottoms;
                this._openScene('MakeTailor', true, true);
            })

            this._btnUp(this._ImgVar('BtnPersonalInfo'), () => {
                this._openScene('PersonalInfo', false);
            })
            this._btnUp(this._ImgVar('BtnRanking'), () => {
                _Ranking._whereFrom = 'Start';
                this._openScene('Ranking', false);
            })
            this._btnUp(this._ImgVar('BtnDressingRoom'), () => {
                _3D._Scene._ins().cameraToSprite(this._Owner);
                this._openScene('DressingRoom', true, true);
            })
        }
    }

}
export default _Start.Start;


