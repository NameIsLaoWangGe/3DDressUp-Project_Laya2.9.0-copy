/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import LwgInit from "./script/Lwg/LwgInit"
import PromoOpen from "./../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/PromoOpen"
import ButtonScale from "./../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/ButtonScale"
import PromoItem from "./../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/PromoItem"
import P201 from "./../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P201"
import P202 from "./../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P202"
import P103 from "./../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P103"
import P204 from "./../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P204"
import P205 from "./../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P205"
import P106 from "./../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P106"
import P302 from "./../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P302"
import P305 from "./../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P305"
import PromoItem from "./script/TJ/Promo/script/PromoItem"
import ButtonScale from "./script/TJ/Promo/script/ButtonScale"
import P402 from "./script/TJ/Promo/script/P402"
import P405 from "./../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P405"
import demo from "./../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/demo"
import GameUI from "./script/GameUI"
/*
* 游戏初始化配置;
*/
export default class GameConfig{
    static width:number=1280;
    static height:number=720;
    static scaleMode:string="fixedheight";
    static screenMode:string="horizontal";
    static alignV:string="top";
    static alignH:string="left";
    static startScene:any="Scene/LwgInit.scene";
    static sceneRoot:string="";
    static debug:boolean=false;
    static stat:boolean=false;
    static physicsDebug:boolean=false;
    static exportSceneToJson:boolean=true;
    constructor(){}
    static init(){
        var reg: Function = Laya.ClassUtils.regClass;
        reg("script/Lwg/LwgInit.ts",LwgInit);
        reg("../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/PromoOpen.ts",PromoOpen);
        reg("../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/ButtonScale.ts",ButtonScale);
        reg("../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/PromoItem.ts",PromoItem);
        reg("../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P201.ts",P201);
        reg("../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P202.ts",P202);
        reg("../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P103.ts",P103);
        reg("../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P204.ts",P204);
        reg("../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P205.ts",P205);
        reg("../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P106.ts",P106);
        reg("../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P302.ts",P302);
        reg("../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P305.ts",P305);
        reg("script/TJ/Promo/script/PromoItem.ts",PromoItem);
        reg("script/TJ/Promo/script/ButtonScale.ts",ButtonScale);
        reg("script/TJ/Promo/script/P402.ts",P402);
        reg("../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/Promo/script/P405.ts",P405);
        reg("../../../../../../../软件/Laya2.9.0/resources/app/out/vs/layaEditor/src/TJ/demo.ts",demo);
        reg("script/GameUI.ts",GameUI);
    }
}
GameConfig.init();