import ADManager, { TaT } from "../TJ/Admanager";
import RecordManager from "../TJ/RecordManager";
import { Admin, Animation2D, Click, Color, EventAdmin, TimerAdmin, Tools, Gold, _SceneName } from "./Lwg";
import { _PropTry } from "./_PropTry";
import { _Share } from "./_Share";
/**游戏场景模块*/
export module _Game {
    export enum _Event {
        start = '_Game_start',
        showStepBtn = '_Game_showStepBtn',
        lastStep = '_Game_lastStep',
        nextStep = '_Game_nextStep',
        compelet = '_Game_compelet',
        playAni1 = '_Game_playAni1',
        playAni2 = '_Game_playAni2',
        restoreZOder = '_Game_restoreZoder',
        colseScene = '_Game_colseScene',
        victory = '_Game_victory',
        Photo = '_Game_Photo',
        turnRight = '_Game_turnRight',
        turnLeft = '_Game_turnLeft',
        generalRefresh = '_Game_generalRefresh',
    }
    /**动画名称*/
    export enum _Animation {
        action1 = 'action1',
        action2 = 'action2',
    }
    export function _init(): void {
    }
    export class Game extends Admin._SceneBase {
    }
}
export default _Game.Game;

