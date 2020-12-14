import ADManager, { TaT } from "../TJ/Admanager";
import RecordManager from "../TJ/RecordManager";
import { Admin, Click, Tools, Dialogue, _SceneName, EventAdmin } from "./Lwg";
import { _Game } from "./_Game";

export module _Settle {
    export class _data {
    }
    export enum _Event {
    }
    export function _init(): void {
    }
    /**通用类，进行通用初始化，这里有两个作用，第一个是不同游戏通用，另一个是同一个游戏中拥有相同部分的基类*/
    export class SettleBase extends Admin._SceneBase {
        moduleOnAwake(): void {
            ADManager.TAPoint(TaT.PageShow, 'ACTpage');
            ADManager.TAPoint(TaT.BtnShow, 'share_ACT');
            ADManager.TAPoint(TaT.BtnShow, 'act_ACT');
        }
    }
    /**可以手动挂在脚本中的类，全脚本唯一的默认导出，也可动态添加，动态添加写在模块内更方便*/
    export class Settle extends _Settle.SettleBase {
        lwgOnAwake(): void {
            EventAdmin._notify(_Game._Event.playAni1, [true]);
            // 消除颜色
            // let Sp: Laya.Sprite = new Laya.Sprite;
            // Laya.stage.addChild(Sp);
            // Sp.graphics.drawTexture(_PreloadUrl._list.texture.bishua1.texture, 0, 0, 100, 100, null, 0, null, null);
        }
        lwgBtnClick(): void {
        }

        lwgOnDisable(): void {
            RecordManager.stopAutoRecord();
            ADManager.TAPoint(TaT.PageLeave, 'ACTpage');
        }
    }
}
export default _Settle.Settle;


