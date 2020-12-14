import ADManager from "../TJ/Admanager";
import { Admin, Click } from "./Lwg";
export module _AdsHint {
    export class AdsHint extends Admin._SceneBase {
        adAction: any;
        setCallBack(_adAction): void {
            this.adAction = _adAction;
        }
        lwgOnEnable(): void {
            this.Owner['BtnClose'].visible = false;
            Laya.timer.frameOnce(120, this, () => {
                this.Owner['BtnClose'].visible = true;
            })
        }
        lwgOpenAni(): number {
            return 10;
        }
        lwgBtnClick(): void {
            Click._on(Click._Type.largen, this.Owner['BtnClose'], this, null, null, () => {
                this.lwgCloseScene();
            });
            Click._on(Click._Type.largen, this.Owner['BtnConfirm'], this, null, null, () => {
                ADManager.ShowReward(this.adAction, null);
                this.lwgCloseScene();
            });
        }

    }
}
export default _AdsHint.AdsHint;

