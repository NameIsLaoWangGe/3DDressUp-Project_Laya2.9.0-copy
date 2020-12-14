import { Admin, Animation2D, StorageAdmin } from "./Lwg";
import { _Ranking } from "./_Ranking";

export module _PersonalInfo {

    export let _name = {
        get value(): string {
            return StorageAdmin._str('playerNsame').value;
        },
        set value(str: string) {
            StorageAdmin._str('playerNsame').value = str;
        }
    }

    export class PersonalInfo extends Admin._SceneBase {

        lwgOnAwake(): void {
            const obj = _Ranking._Data._ins()._getPitchObj();
            this._LabelVar('RankValue').text = obj[_Ranking._Data._ins()._otherPro.rankNum];
            this._LabelVar('FansValue').text = obj[_Ranking._Data._ins()._otherPro.fansNum];
        }

        lwgOpenAni(): number {
            this._ImgVar('Background').alpha = 0;
            this._ImgVar('Content').alpha = 0;
            Animation2D.fadeOut(this._ImgVar('Background'), 0, 1, 350);
            Animation2D.fadeOut(this._ImgVar('Content'), 0, 1, 200);
            return 200;
        }
        lwgButton(): void {
            this._btnUp(this._ImgVar('BtnClose'), () => {
                this._closeScene();
            })

            this._btnUp(this._ImgVar('BtnWrite'), () => {

            })
        }
    }
}