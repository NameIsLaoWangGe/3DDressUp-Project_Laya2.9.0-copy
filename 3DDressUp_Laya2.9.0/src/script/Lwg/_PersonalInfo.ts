import { Admin } from "./Lwg";

export module _PersonalInfo {
    export class PersonalInfo extends Admin._SceneBase {
        lwgButton(): void {
            this._btnUp(this._ImgVar('BtnClose'), () => {
                this._closeScene();
            })
        }
    }
}