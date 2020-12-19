import { Admin, Animation2D, Color, StorageAdmin, TimerAdmin } from "./Lwg";
import { _Ranking } from "./_Ranking";

export module _PersonalInfo {

    export let _name = {
        get value(): string {
            return StorageAdmin._str('playerName', null, 'You').value;
        },
        set value(str: string) {
            StorageAdmin._str('playerName').value = str;
        }
    }
    export class PersonalInfo extends Admin._SceneBase {
        lwgOnAwake(): void {
            this._TextInputVar('NameValue').text = _name.value;
            const obj = _Ranking._Data._ins()._getPitchObj();
            this._LabelVar('RankValue').text = obj[_Ranking._Data._ins()._otherPro.rankNum];
            this._LabelVar('FansValue').text = obj[_Ranking._Data._ins()._otherPro.fansNum];


        }

        lwgOpenAni(): number {
            this._ImgVar('Background').alpha = 0;
            this._ImgVar('Content').alpha = 0;
            Animation2D.fadeOut(this._ImgVar('Background'), 0, 1, 350, 0, () => {
                TimerAdmin._frameLoop(240, this, () => {
                    this._AniVar('ani1').play(0, false);
                    this._AniVar('ani1').on(Laya.Event.LABEL, this, (e: string) => {
                        if (e === 'comp') {
                            Color._changeOnce(this._ImgVar('Head'), [50, 10, 10, 1], 40);
                        }
                    })
                }, true)
            });
            Animation2D.fadeOut(this._ImgVar('Content'), 0, 1, 200);
            return 200;
        }
        lwgButton(): void {
            this._btnUp(this._ImgVar('BtnClose'), () => {
                this._closeScene();
            })

            this._btnFour(this._ImgVar('NameValue'),
                () => {
                    this._ImgVar('BtnWrite').scale(0.85, 0.85);
                }, () => {
                    this._ImgVar('BtnWrite').scale(0.85, 0.85);
                }, () => {
                    this._ImgVar('BtnWrite').scale(1, 1);
                }, () => {
                    this._ImgVar('BtnWrite').scale(1, 1);
                })

            this._TextInputVar('NameValue').on(Laya.Event.FOCUS, this, () => {
            });
            this._TextInputVar('NameValue').on(Laya.Event.INPUT, this, () => {
            });
            this._TextInputVar('NameValue').on(Laya.Event.BLUR, this, () => {
                if (this._TextInputVar('NameValue').text.length <= 5) {
                    this._TextInputVar('NameValue').fontSize = 30;
                } else if (this._TextInputVar('NameValue').text.length === 6) {
                    this._TextInputVar('NameValue').fontSize = 27;
                } else {
                    this._TextInputVar('NameValue').fontSize = 24;
                }
                _name.value = this._TextInputVar('NameValue').text;
            });
        }

        lwgCloseAni(): number {
            Animation2D.fadeOut(this._ImgVar('Background'), 1, 0, 200);
            Animation2D.fadeOut(this._ImgVar('Content'), 1, 0, 300);
            return 300;
        }
    }
}