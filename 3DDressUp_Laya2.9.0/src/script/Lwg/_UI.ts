import { Animation2D, AudioAdmin, Click, Effects, TimerAdmin, Tools } from "./Lwg";
import { _3D } from "./_3D";
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
            _3D._Scene._ins()._Owner.active && _3D._Scene._ins().cameraToSprite(this.Scene);
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
        this.BtnTurnFace = this.Scene['BtnTurnFace'];
        this.BtnTurnFace && this.BtnTurnFace.scale(0, 0);

        this.BtnRollback.zOrder = this.BtnAgain.zOrder = this.BtnBack.zOrder = this.BtnComplete.zOrder = this.Operation.zOrder = 200;

        this.moveTargetX = Laya.stage.width - this.Operation.width + 50;
    }

    btnAgainClick: Function;
    btnCompleteClick: Function;
    btnRollbackClick: Function;

    Scene: Laya.Scene;
    Operation: Laya.Image;
    BtnRollback: Laya.Image;
    BtnAgain: Laya.Image;
    BtnBack: Laya.Image;
    BtnComplete: Laya.Image;
    BtnTurnFace: Laya.Image;

    time: number = 100;
    delay: number = 100;
    scale: number = 1.4;
    moveTargetX: number;

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

    btnTurnFaceAppear(func?: Function, delay?: number): void {
        if (this.BtnTurnFace) {
            this.effect(this.Operation, new Laya.Point(this.BtnTurnFace.x, this.BtnTurnFace.y), delay);
            Animation2D.bombs_Appear(this.BtnTurnFace, 0, 1, this.scale, 0, this.time * 2, () => {
                func && func();
            });
        }
    }

    btnTurnFaceVinish(func?: Function, delay?: number): void {
        if (this.BtnTurnFace) {
            Animation2D.bombs_Vanish(this.BtnTurnFace, 0, 0, 0, this.time * 4, () => {
                func && func();
            }, delay ? delay : 0);
        }
    }

    operationAppear(func?: Function, delay?: number): void {
        if (this.Scene.name === 'MakeTailor') {
            Animation2D.fadeOut(this.Scene['BG2'], this.Scene['BG2'].alpha, 1, 500);
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
    }
}

class UI {
    constructor(name: string) {
        this.name = name;
    }
    name: string
    scene: Laya.Scene;
    operation: Laya.Image;

    btnAgainClick: Function;
    btnRollbackClick: Function;
    btnBackClick: Function;
    btnCompleteClick: Function;
    btnTurnFaceClick: Function;

    btnAgain: Laya.Image;
    btnRollback: Laya.Image;
    btnBack: Laya.Image;
    btnComplete: Laya.Image;
    btnTurnFace: Laya.Image;

    time: number = 100;
    delay: number = 100;
    scale: number = 1.4;
    moveTargetX: number;
}

abstract class UICreater {
    abstract setScene(scene: Laya.Scene): UICreater;

    abstract setBtnAgain(btnAgain: Laya.Image): UICreater;
    abstract buildBtnAgainClick(func: Function): UICreater;

    abstract setBtnRollback(btnRollback: Laya.Image): UICreater;
    abstract buildBtnRollbackClick(func: Function): UICreater;

    abstract setBtnComplete(btnRollback: Laya.Image): UICreater;
    abstract buildBtnCompleteClick(func: Function): UICreater;

    abstract setBtnBack(btnBack: Laya.Image): UICreater;
    abstract buildBtnBackClick(func: Function): UICreater;

    abstract setBtnTurnFace(btnTurnFace: Laya.Image): UICreater;
    abstract buildBtnTurnFaceClick(func: Function): UICreater;

    abstract createUI(): UI;
}

class MaketailorUI extends UICreater {
    private ui = new UI('MaketailorUI');
    setScene(scene: Laya.Scene): UICreater {
        this.ui.scene = scene;
        return this;
    }

    setBtnAgain(btnAgain?: Laya.Image): UICreater {
        this.ui.btnAgain = btnAgain;
        return this;
    }
    buildBtnAgainClick(func?: Function): UICreater {
        this.ui.btnAgainClick = func;
        return this;
    }

    setBtnRollback(btnRollback?: Laya.Image): UICreater {
        this.ui.btnRollback = btnRollback;
        return this;
    }
    buildBtnRollbackClick(func?: Function): UICreater {
        this.ui.btnRollbackClick = func;
        return this;
    }

    setBtnComplete(btnComplete?: Laya.Image): UICreater {
        this.ui.btnComplete = btnComplete;
        return this;
    }
    buildBtnCompleteClick(func: Function): UICreater {
        this.ui.btnRollbackClick = func;
        return this;
    }

    setBtnBack(btnBack: Laya.Image): UICreater {
        this.ui.btnBack = btnBack;
        return this;
    }
    buildBtnBackClick(func: Function): UICreater {
        this.ui.btnBackClick = func;
        return this;
    }

    setBtnTurnFace(btnTurnFace: Laya.Image): UICreater {
        throw new Error("Method not implemented.");
    }

    buildBtnTurnFaceClick(func: Function): UICreater {
        throw new Error("Method not implemented.");
    }

    createUI(): UI {
        return this.ui;
    }
}

class UIDirector {
    // 顺序1，包含三道工序
    static constructMaketailorUI(builder: UICreater, scene: Laya.Scene): UI {
        return builder
            .setScene(scene)
            .createUI();
    }
}

// let maketailorUI = UIDirector.constructMaketailorUI(new MaketailorUI(), new Laya.Scene);


class Hamburg {
    name: string;
    // 可选参数也可以使用 set，但是 ts 中直接在这里声明更方便, 当然如果是 private，需要使用 set 来封装
    meatType?: string;
    vegetableType?: string;
    private breadNum?: number;

    constructor(name: string) { // 如果我们不用建造者模式，那么产品类的 constructor 这里将要传入所有参数
        this.name = name; // 必选参数可以放在这里，步骤具体实现可变的就抽出来
    }
    // 利用 ts 的 set 当然也是 okay 的，比如 set num(num){ this.breadNum = num; }
    setBreadNum(num: number) {
        this.breadNum = num;
    }
}

// 原本放在产品类的构建步骤被转移到了建造者类，由具体的建造者实现
abstract class HamburgBuilder {
    abstract buildBread(breadNum: number): HamburgBuilder;
    abstract buildMeat(meatType: string): HamburgBuilder;
    abstract buildVegetable(vegetableTYpe: string): HamburgBuilder;
    abstract createHamburg(): Hamburg;
}

class BeefHamburgBuilder extends HamburgBuilder {
    // 这里如果可以确定 name，就不需要用户再传入了
    private hamburg: Hamburg = new Hamburg('牛肉汉堡');

    buildBread(breadNum: number): HamburgBuilder {
        console.log(`制作牛肉汉堡需要的 ${breadNum} 片面包`);
        this.hamburg.setBreadNum(breadNum);
        return this;
    }

    buildMeat(meatType: string): HamburgBuilder {
        console.log(`制作牛肉汉堡需要的 ${meatType}`);
        this.hamburg.meatType = meatType;
        return this;
    }

    buildVegetable(vegetableType: string): HamburgBuilder {
        console.log(`制作牛肉汉堡需要的 ${vegetableType}`);
        this.hamburg.vegetableType = vegetableType;
        return this;
    }
    createHamburg(): Hamburg {
        return this.hamburg;
    }
}

class PorkHamburgBuilder extends HamburgBuilder {
    private hamburg: Hamburg = new Hamburg('猪肉汉堡');

    buildBread(breadNum: number): HamburgBuilder {
        console.log(`制作猪肉汉堡需要的 ${breadNum} 片面包`);
        this.hamburg.setBreadNum(breadNum);
        return this;
    }

    buildMeat(meatType: string): HamburgBuilder {
        console.log(`制作猪肉汉堡需要的 ${meatType}`);
        this.hamburg.meatType = meatType;
        return this;
    }

    buildVegetable(vegetableType: string): HamburgBuilder {
        console.log(`制作猪肉汉堡需要的 ${vegetableType}`);
        this.hamburg.vegetableType = vegetableType;
        return this;
    }

    createHamburg(): Hamburg {
        return this.hamburg;
    }
}

// 我们用 director 来封装顺序，如果要改变工序，只要新增一个 director 或者新增一个 construct 即可
class HamburgDirector {
    // 顺序1，包含三道工序
    static construct1(builder: HamburgBuilder, breadNum: number, meatType: string, vegetableType: string): Hamburg {
        return builder.buildBread(breadNum)
            .buildMeat(meatType)
            .buildVegetable(vegetableType)
            .createHamburg();
    }

    // 顺序2，包含两道工序
    static construct2(builder: HamburgBuilder, breadNum: number, meatType: string): Hamburg {
        return builder.buildMeat(meatType)
            .buildBread(breadNum)
            .createHamburg();
    }
}

const beefHamburgBuilder = new BeefHamburgBuilder();
const porkHamburgBuilder = new PorkHamburgBuilder();

HamburgDirector.construct1(beefHamburgBuilder, 2, 'beef', 'carrot');
HamburgDirector.construct2(porkHamburgBuilder, 3, 'pork');

type shoe = {
    btnAgain: string,
    btnBack: string,
}

class Btn implements shoe {
    btnAgain: string;
    btnBack: string;
}

