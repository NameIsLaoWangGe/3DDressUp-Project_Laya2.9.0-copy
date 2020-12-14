import { Admin, Animation2D, EventAdmin, TimerAdmin, Tools, _SceneName } from "./Lwg";
/**测试模块,每个模块分开，默认导出一个类，这个类是默认挂载的脚本类，如果有多个脚本，
 * 那么在这个默认类中进行添加，或者在其他地方动态添加*/
export module _Guide {

    /**是否完成了新手引导*/
    export let _complete = {
        get bool(): number | any {
            if (Laya.LocalStorage.getItem('_Guide_complete')) {
                if (Number(Laya.LocalStorage.getItem('_Guide_complete')) == 0) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        },
        set bool(bol: number | any) {
            if (bol == true) {
                bol = 1;
            }
            Laya.LocalStorage.setItem('_Guide_complete', bol.toString());
        }
    }
    /**分布式新手引导，记录进行到哪一步了*/
    export let _whichStep = {
        get num(): number {
            return Laya.LocalStorage.getItem('_Guide_whichStep') ? Number(Laya.LocalStorage.getItem('_Guide_whichStep')) : 1;
        },
        set num(num0: number) {
            Laya.LocalStorage.setItem('_Guide_whichStep', num0.toString());
        }
    };
    /**新手引导进行到哪一步了*/
    export let _whichStepNum: number = 1;

    /**事件类型，必须枚举,因为有可能在全局使用,命名必须使用模块名称+事件名称*/
    export enum _Event {
        /**进行当前引导步骤*/
        onStep = '_Guide_onStep',
        /**完成某一步*/
        stepComplete = '_Guide_stepComplete',
        /**出现*/
        appear = '_Guide_appear',
        /**开始引导*/
        start = '_Guide_start',
        /**完成并关闭引导界面*/
        complete = '_Guide_complete',
    }
    /**初始化*/
    export function _init(): void {
        // if (_Guide._complete.bool) {
        // } else {
        //     Backpack._haveCardArray.arr = [];
        //     DrawCard._drawCount.num = 0;
        //     DrawCard._residueDraw.num = 2;
        // console.log('开始进行新手引导！');
        // Admin._openScene(_SceneName.Start, null, () => {
        //     console.log('新手引导完成！')
        // });
        //     Admin._openScene(Admin._SceneName.UIDrawCard, this.calssName, () => {
        //         let caller = {};
        //         TimerAdmin._frameLoop(1, caller, () => {
        //             if (Laya.stage.getChildByName('UIDrawCard')) {
        //                 Laya.timer.clearAll(caller);
        //                 Admin._openScene(Admin._SceneName.UIGuide);
        //             }
        //         })
        //     });
        // }
    }
    export class Guide extends Admin._SceneBase {
        lwgOnEnable(): void {
            // this._Owner['Background'].alpha = 0;
            // this._Owner['Hand'].alpha = 0;
            // EventAdmin._notify(_Guide._Event.onStep);

            // this._Owner["Draw"].on(Laya.Event.LABEL, this, (labal) => {
            //     if (labal === 'start') {
            //         let DrawCanvas = this._Owner['Hand'].getChildByName('DrawCanvas');
            //         if (!DrawCanvas) {
            //             let DrawCanvas = new Laya.Sprite();
            //             DrawCanvas.name = 'DrawCanvas';
            //             this._Owner['Hand'].addChild(DrawCanvas);
            //             this._Owner['Handpic'].pos(0, 0);
            //             this._Owner['Handpic'].pivotX = 0;
            //             this._Owner['Handpic'].pivotY = 0;
            //             this['drawLinePos'] = new Laya.Point(this._Owner['Handpic'].x, this._Owner['Handpic'].y);
            //         }
            //     } else if (labal === 'end') {
            //         let DrawCanvas = this._Owner['Hand'].getChildByName('DrawCanvas');
            //         if (this._Owner['Hand'].getChildByName('DrawCanvas')) {
            //             this['drawLinePos'] == false;
            //             DrawCanvas.removeSelf();
            //         }
            //     }
            // });

            // TimerAdmin._frameLoop(1, this, () => {
            //     let DrawCanvas = this._Owner['Hand'].getChildByName('DrawCanvas');
            //     if (DrawCanvas) {
            //         if (this['drawLinePos']) {
            //             DrawCanvas.graphics.drawLine(this['drawLinePos'].x, this['drawLinePos'].y, this._Owner['Handpic'].x, this._Owner['Handpic'].y, "#000000", 8);
            //             DrawCanvas.graphics.drawCircle(this._Owner['Handpic'].x, this._Owner['Handpic'].y, 4, "#000000");
            //             this['drawLinePos'] = new Laya.Point(this._Owner['Handpic'].x, this._Owner['Handpic'].y);
            //         }
            //     }
            // })
        }
        lwgOnStart(): void {
            console.log('新手引导完成！')
            this._openScene(_SceneName.Start);
            console.log(Laya.stage['_children'])
        }
        lwgOpenAni(): number {
            return 1;
        }
        lwgEventRegister(): void {
            /**第一次十连抽*/
            // var step1 = () => {
            //     this._Owner["Draw"].play(0, true);
            //     EventAdmin._notify(_Guide._Event.appear);
            //     this._Owner['Hand'].pos(198, 523);
            //     Tools.Draw.reverseRoundMask(this._Owner['Background'], 360, 598, 350, true);
            // }
            // /**第一次收取卡牌*/
            // var step2 = () => {
            //     EventAdmin._notify(_Guide._Event.appear);
            //     this._Owner['Hand'].pos(360, 1161);
            //     this._Owner["Click"].play(0, true);
            //     Tools.Draw.reverseRoundrectMask(this._Owner['Background'], 360, 1161, 320, 150, 40, true);
            // }
            // /**第二次十连抽*/
            // var step3 = () => {
            //     step1();
            // }
            // /**第二次收取卡牌*/
            // var step4 = () => {
            //     step2();
            // }
            // /**关闭抽卡场景*/
            // var step5 = () => {
            //     EventAdmin._notify(_Guide._Event.appear);
            //     this._Owner['Hand'].pos(75, 102);
            //     this._Owner["Click"].play(0, true);
            //     Tools.Draw.reverseRoundMask(this._Owner['Background'], 72, 105, 60);
            // }
            // // 点击卡牌展示界面
            // var step6 = () => {
            //     EventAdmin._notify(_Guide._Event.appear);
            //     this._Owner['Hand'].pos(630, 790);
            //     this._Owner["Click"].play(0, true);
            //     Tools.Draw.reverseRoundrectMask(this._Owner['Background'], 653, 758, 130, 150, 20, true);
            // }
            // // 关闭卡牌界面
            // var step7 = () => {
            //     step5();
            // }
            // // 点击开始游戏按钮
            // var step8 = () => {
            //     EventAdmin._notify(_Guide._Event.appear);
            //     this._Owner['Hand'].pos(360, Laya.stage.height * 0.779);
            //     this._Owner["Click"].play(0, true);
            //     Tools.Draw.reverseRoundrectMask(this._Owner['Background'], 360, Laya.stage.height * 0.779, 450, 180, 20, true);
            // }
            // // 执行
            // EventAdmin._register(_Guide._Event.onStep, this, () => {
            //     Laya.timer.once(500, this, () => {
            //         console.log('新手引导到了第：', _Guide._whichStepNum + '步了');
            //         switch (_Guide._whichStepNum) {
            //             case 1:
            //                 step1();
            //                 break;
            //             case 2:
            //                 step2()
            //                 break;
            //             case 3:
            //                 step3();
            //                 break;
            //             case 4:
            //                 step4();
            //                 break;
            //             case 5:
            //                 step5();
            //                 break;
            //             case 6:
            //                 step6();
            //                 break;
            //             case 7:
            //                 step7();
            //                 break;
            //             case 8:
            //                 step8();
            //                 break;
            //             default:
            //                 break;
            //         }
            //     })
            // })
            // EventAdmin._register(_Guide._Event.appear, this, (func) => {
            //     Animation2D.fadeOut(this._Owner['Hand'], 0, 1, 150);
            //     Animation2D.fadeOut(this._Owner['Background'], 0, 0.5, 300);
            // })
            // EventAdmin._register(_Guide._Event.stepComplete, this, () => {
            //     _Guide._whichStepNum++;
            //     let DrawCanvas = this._Owner['Hand'].getChildByName('DrawCanvas');
            //     if (this._Owner['Hand'].getChildByName('DrawCanvas')) {
            //         this['drawLinePos'] == false;
            //         DrawCanvas.removeSelf();
            //     }
            //     Animation2D.fadeOut(this._Owner['Hand'], 1, 0, 150);
            //     Animation2D.fadeOut(this._Owner['Background'], 0.5, 0, 300, 0, () => {
            //         (this._Owner["Draw"] as Laya.Animation).stop();
            //         (this._Owner["Click"] as Laya.Animation).stop();
            //     });
            // })
            // EventAdmin._register(_Guide._Event.complete, this, () => {
            //     Animation2D.fadeOut(this._Owner['Hand'], 1, 0, 150);
            //     Animation2D.fadeOut(this._Owner['Background'], 0.5, 0, 300, 0, () => {
            //         _Guide._complete.bool = true;
            //         Admin._closeScene(this._Owner.name);
            //     });
            // })
        }
    }
}
export default _Guide.Guide;


