import ADManager, { TaT } from "../TJ/Admanager";
import RecordManager from "../TJ/RecordManager";
import lwg, { Admin, Click, Tools, Dialogue, _SceneName, EventAdmin, DateAdmin, Effects } from "./Lwg";
import OldEffects from "./OldEffects";
import { _Game } from "./_Game";
import { _Share } from "./_Share";
import { _Special } from "./_Special";
export module _Victory {
    export enum _Event {
        _Settle_CloseScene = '_Settle_CloseScene',
    }
    export function _init(): void {
       
    }
    export class Victory extends Admin._SceneBase {
        lwgOnAwake(): void {
            ADManager.TAPoint(TaT.PageShow, 'endpage');
            ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_end');
            ADManager.TAPoint(TaT.BtnShow, 'close_end');
        }
        lwgOpenAniAfter(): void {
        }
        lwgOnDisable(): void {
            ADManager.TAPoint(TaT.PageLeave, 'endpage');
        }
    }
}
export default _Victory.Victory;


