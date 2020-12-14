import ADManager, { TaT } from "../TJ/Admanager";
import RecordManager from "../TJ/RecordManager";
import { Admin, Click, Tools, Dialogue, _SceneName, EventAdmin } from "./Lwg";
import { _Game } from "./_Game";
export module _Share {
    export class _Data {
        static _photo = {
            _base64: null as string,
            _width: 400,
            _height: 400,
        };
    }
    export enum _Event {
    }
    export function _init(): void {
    }
    /**可以手动挂在脚本中的类，全脚本唯一的默认导出，也可动态添加，动态添加写在模块内更方便*/
    export class Share extends Admin._SceneBase {
        lwgOnAwake(): void {
        }
        lwgBtnClick(): void {
        }
        lwgOnDisable(): void {
            ADManager.TAPoint(TaT.PageLeave, 'sharepage');
        }
    }
}
export default _Share.Share;


