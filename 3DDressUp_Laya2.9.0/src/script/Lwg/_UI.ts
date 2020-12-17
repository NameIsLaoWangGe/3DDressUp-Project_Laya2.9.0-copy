import { Animation2D, AudioAdmin, Click, Effects, TimerAdmin, Tools } from "./Lwg";
import { _Res } from "./_PreLoad";

export class _UI {
    constructor(_Scene: Laya.Scene) {
        if (!_Scene) {
            return;
        }
        this.Scene = _Scene;
        this.Operation = _Scene['Operation'];

        this.BtnAgain = Tools._Node.createPrefab(_Res._list.prefab2D.BtnAgain.prefab, _Scene, [200, 79]) as Laya.Image;
        Click._on(Click._Use.value, this.BtnAgain, this, null, null, () => {
            this.btnAgainClick && this.btnAgainClick();
        })

        this.BtnComplete = _Scene['BtnComplete'];
        Click._on(Click._Use.value, this.BtnComplete, this, null, null, () => {
            this.btnCompleteClick && this.btnCompleteClick();
        })

        this.BtnBack = Tools._Node.createPrefab(_Res._list.prefab2D.BtnBack.prefab, _Scene, [77, 79]) as Laya.Image;
        Click._on(Click._Use.value, this.BtnBack, this, null, null, () => {
            _Scene[_Scene.name]._openScene('Start', true, true);
        })

        this.BtnRollback = Tools._Node.createPrefab(_Res._list.prefab2D.BtnRollback.prefab, _Scene, [200, 79]) as Laya.Image;
        Click._on(Click._Use.value, this.BtnRollback, this, null, null, () => {
            this.btnRollbackClick && this.btnRollbackClick();
        })

        this.Operation.pos(Laya.stage.width + 500, 20);
        this.BtnComplete.scale(0, 0);
        this.BtnBack.scale(0, 0);
        this.BtnAgain.scale(0, 0);
        this.BtnRollback.scale(0, 0);

        this.BtnRollback.zOrder = this.BtnAgain.zOrder = this.BtnBack.zOrder = this.BtnComplete.zOrder = this.Operation.zOrder = 200;

        this.moveTargetX = Laya.stage.width - this.Operation.width + 50;
    }
    moveTargetX: number;

    btnAgainClick: Function;
    btnCompleteClick: Function;
    btnRollbackClick: Function;

    Scene: Laya.Scene;
    Operation: Laya.Image;
    BtnRollback: Laya.Image;
    BtnAgain: Laya.Image;
    BtnBack: Laya.Image;
    BtnComplete: Laya.Image;

    time: number = 100;
    delay: number = 100;
    scale: number = 1.4;
    btnRollbackAppear(func?: Function, delay?: number): void {
        Animation2D.bombs_Appear(this.BtnRollback, 0, 1, this.scale, 0, this.time * 2, () => {
            func && func();
        }, delay ? delay : 0);
    };
    btnRollbackVinish(func?: Function, delay?: number): void {
        Animation2D.bombs_Vanish(this.BtnRollback, 0, 0, 0, this.time * 4, () => {
            func && func();
        }, delay ? delay : 0);
    };
    btnAgainAppear(func?: Function, delay?: number): void {
        Animation2D.bombs_Appear(this.BtnAgain, 0, 1, this.scale, 0, this.time * 2, () => {
            func && func();
        }, delay ? delay : 0);
    };
    btnAgainVinish(func?: Function, delay?: number): void {
        Animation2D.bombs_Vanish(this.BtnAgain, 0, 0, 0, this.time * 4, () => {
            func && func();
        }, delay ? delay : 0);
    };
    btnBackAppear(func?: Function, delay?: number): void {
        Animation2D.bombs_Appear(this.BtnBack, 0, 1, this.scale, 0, this.time * 2, () => {
            func && func();
        }, delay ? delay : 0);
    };
    btnBackVinish(func?: Function, delay?: number): void {
        Animation2D.bombs_Vanish(this.BtnBack, 0, 0, 0, this.time * 4, () => {
            func && func();
        }, delay ? delay : 0);
    };
    btnCompleteAppear(func?: Function, delay?: number): void {
        this.effect(this.Operation, new Laya.Point(this.BtnComplete.x, this.BtnComplete.y), delay);
        Animation2D.bombs_Appear(this.BtnComplete, 0, 1, this.scale, 0, this.time * 2, () => {
            func && func();
        }, delay ? delay : 0);
    }
    btnCompleteVinish(func?: Function, delay?: number): void {
        Animation2D.bombs_Vanish(this.BtnComplete, 0, 0, 0, this.time * 4, () => {
            func && func();
        }, delay ? delay : 0);
    };

    operationAppear(func?: Function, delay?: number): void {
        if (this.Scene.name === 'MakeTailor') {
            Animation2D.fadeOut(this.Scene['BG2'], this.Scene['BG2'].alpha, 1, 500);
            // const BG1 = this.Scene['BG1'] as Laya.Image;
            // const BG2 = this.Scene['BG2'] as Laya.Image;
            // BG1.pivot(0, Laya.stage.height);
            // BG1.x = 0;
            // BG1.y = Laya.stage.height;
            // BG2.pivot(Laya.stage.width, Laya.stage.height);
            // BG2.x = Laya.stage.width;
            // BG2.y = Laya.stage.height;
            // BG1.rotation = BG2.rotation = 0;
            // BG1.zOrder = 1;
            // BG2.zOrder = 0;
            // Animation2D.move_rotate(BG1, -30, new Laya.Point(0, -Laya.stage.height), this.time * 6);
        }
        Animation2D.move(this.Operation, this.moveTargetX - 40, this.Operation.y, this.time * 4, () => {
            Animation2D.move(this.Operation, this.moveTargetX, this.Operation.y, this.time, () => {
                func && func();
            })
        }, delay ? delay : 0)
    };
    operationVinish(func?: Function, delay?: number): void {
        if (this.Scene.name === 'MakeTailor') {
            Animation2D.fadeOut(this.Scene['BG2'], this.Scene['BG2'].alpha, 0, 500);
            // const BG1 = this.Scene['BG1'] as Laya.Image;
            // const BG2 = this.Scene['BG2'] as Laya.Image;
            // BG1.pivot(0, Laya.stage.height);
            // BG1.x = 0;
            // BG1.y = Laya.stage.height;
            // BG2.pivot(Laya.stage.width, Laya.stage.height);
            // BG2.x = Laya.stage.width;
            // BG2.y = Laya.stage.height;
            // BG1.rotation = BG2.rotation = 0;
            // BG1.zOrder = 0;
            // BG2.zOrder = 1;
            // Animation2D.move_rotate(BG2, 30, new Laya.Point(Laya.stage.width, -Laya.stage.height), this.time * 6);
        }
        Animation2D.bombs_Vanish(this.BtnComplete, 0, 0, 0, this.time * 4, () => {
            Animation2D.move(this.Operation, this.moveTargetX - 40, this.Operation.y, this.time, () => {
                Animation2D.move(this.Operation, Laya.stage.width + 500, this.Operation.y, this.time * 4, () => {
                    func && func();

                });
            });
        }, delay ? delay : 0)
    }

    effect(Parent: Laya.Sprite, p: Laya.Point, delay?: number): void {
        TimerAdmin._once(delay ? delay : 0, this, () => {
            const count = 40;
            const time = 5;
            const dis = Tools._Number.randomOneInt(30, 30);
            for (let index = 0; index < count; index++) {
                Effects._Particle._sprayRound(Parent, p, null, [20, 40], null, [Effects._SkinUrl.星星8], null, [dis, dis], [time, time], null, null, 5);
            }
            AudioAdmin._playSound();
        })
        // for (let index = 0; index < count * 2; index++) {
        //     Effects._Particle._sprayRound(this.Operation, p, null, [20, 40], null, [Effects._SkinUrl.花4], null, [50, dis - 20], [time, time], null, null, 5);
        // }
    }
}