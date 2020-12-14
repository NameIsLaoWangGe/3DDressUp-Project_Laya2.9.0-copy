import lwg, { Admin, Animation2D, Click } from "./lwg";

export module _Execution {
    /**当前剩余行动力的数量*/
    export let _execution = {
        get value(): number {
            if (!this['_Execution_executionNum']) {
                return Laya.LocalStorage.getItem('_Execution_executionNum') ? Number(Laya.LocalStorage.getItem('_Execution_executionNum')) : 15;
            }
            return this['_Execution_executionNum'];
        },
        set value(val: number) {
            console.log(val);
            this['_Execution_executionNum'] = val;
            Laya.LocalStorage.setItem('_Execution_executionNum', val.toString());
        }
    };
    export let _addExDate = {
        get value(): number {
            if (!this['_Execution_addExDate']) {
                return Laya.LocalStorage.getItem('_Execution_addExDate') ? Number(Laya.LocalStorage.getItem('_Execution_addExDate')) : (new Date()).getDay();
            }
            return this['_Execution_addExDate'];
        },
        set value(val: number) {
            this['_Execution_addExDate'] = val;
            Laya.LocalStorage.setItem('_Execution_addExDate', val.toString());
        }
    }
    export let _addExHours = {
        get value(): number {
            if (!this['_Execution_addExHours']) {
                return Laya.LocalStorage.getItem('_Execution_addExHours') ? Number(Laya.LocalStorage.getItem('_Execution_addExHours')) : (new Date()).getHours();
            }
            return this['_Execution_addExHours'];
        },
        set value(val: number) {
            this['_Execution_addExHours'] = val;
            Laya.LocalStorage.setItem('_Execution_addExHours', val.toString());
        }
    };
    export let _addMinutes = {
        get value(): number {
            if (!this['_Execution_addMinutes']) {
                return Laya.LocalStorage.getItem('_Execution_addMinutes') ? Number(Laya.LocalStorage.getItem('_Execution_addMinutes')) : (new Date()).getMinutes();
            }
            return this['_Execution_addMinutes'];
        },
        set value(val: number) {
            this['_Execution_addMinutes'] = val;
            Laya.LocalStorage.setItem('_Execution_addMinutes', val.toString());
        }
    };
    /**指代当前剩余体力节点*/
    export let _ExecutionNode: Laya.Sprite;
    /**
     * 创建通用剩余体力数量prefab
     * @param parent 父节点
     */
    export function _createExecutionNode(parent): void {
        let sp: Laya.Sprite;
        Laya.loader.load('prefab/ExecutionNum.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
            let _prefab = new Laya.Prefab();
            _prefab.json = prefab;
            sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
            parent.addChild(sp);
            let num = sp.getChildByName('Num') as Laya.FontClip;
            num.value = _execution.value.toString();
            sp.pos(297, 90);
            sp.zOrder = 50;
            _ExecutionNode = sp;
            _ExecutionNode.name = '_ExecutionNode';
        }));
    }

    /**
     * 创建体力增加的prefab
     * @param x x位置
     * @param y y位置
     * @param func 回调函数
    */
    export function _createAddExecution(x: number, y: number, func: Function): void {
        let sp: Laya.Sprite;
        Laya.loader.load('prefab/execution.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
            let _prefab = new Laya.Prefab();
            _prefab.json = prefab;
            sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
            Laya.stage.addChild(sp);
            sp.x = Laya.stage.width / 2;
            sp.y = Laya.stage.height / 2;
            sp.zOrder = 50;
            if (_ExecutionNode) {
                Animation2D.move_Simple(sp, sp.x, sp.y, _ExecutionNode.x, _ExecutionNode.y, 800, 100, f => {
                    Animation2D.fadeOut(sp, 1, 0, 200, 0, f => {
                        Animation2D.upDwon_Shake(_ExecutionNode, 10, 80, 0, null);
                        if (func) {
                            func();
                        }
                    });
                });
            }
        }));
    }
    /**
     * 创建体力消耗动画
     * @param  subEx 消耗多少体力值
     */
    export function createConsumeEx(subEx): void {
        let label = Laya.Pool.getItemByClass('label', Laya.Label) as Laya.Label;
        label.name = 'label';//标识符和名称一样
        Laya.stage.addChild(label);
        label.text = '-2';
        label.fontSize = 40;
        label.bold = true;
        label.color = '#59245c';
        label.x = _ExecutionNode.x + 100;
        label.y = _ExecutionNode.y - label.height / 2 + 4;
        label.zOrder = 100;
        Animation2D.fadeOut(label, 0, 1, 200, 150, f => {
            Animation2D.leftRight_Shake(_ExecutionNode, 15, 60, 0, null);
            Animation2D.fadeOut(label, 1, 0, 600, 400, f => {
            });
        });
    }
}
export  class Execution extends Admin._ObjectBase {
    Num: Laya.FontClip;
    CountDown: Laya.Label;
    CountDown_board: Laya.Label;

    lwgInit(): void {
        this.Num = this._Owner.getChildByName('Num') as Laya.FontClip;
        this.CountDown = this._Owner.getChildByName('CountDown') as Laya.Label;
        this.CountDown_board = this._Owner.getChildByName('CountDown_board') as Laya.Label;
        this.countNum = 59;
        this.CountDown.text = '00:' + this.countNum;
        this.CountDown_board.text = this.CountDown.text;

        // 获取上次的体力
        let d = new Date;
        if (d.getDate() !== _Execution._addExDate.value) {
            _Execution._execution.value = 15;
        } else {
            if (d.getHours() == _Execution._addExHours.value) {
                console.log(d.getMinutes(), _Execution._addMinutes.value);
                _Execution._execution.value += (d.getMinutes() - _Execution._addMinutes.value);
                if (_Execution._execution.value > 15) {
                    _Execution._execution.value = 15;
                }
            } else {
                _Execution._execution.value = 15;
            }
        }
        this.Num.value = _Execution._execution.value.toString();
        _Execution._addExDate.value = d.getDate();
        _Execution._addExHours.value = d.getHours();
        _Execution._addMinutes.value = d.getMinutes();

    }

    /**计时器*/
    time: number = 0;
    /**时钟当前秒数*/
    countNum: number = 59;
    /**倒计时，一分钟一点体力*/
    countDownAddEx(): void {
        this.time++;
        if (this.time % 60 == 0) {
            this.countNum--;
            if (this.countNum < 0) {
                this.countNum = 59;
                _Execution._execution.value += 1;
                this.Num.value = _Execution._execution.value.toString();
                let d = new Date;
                _Execution._addExHours.value = d.getHours();
                _Execution._addMinutes.value = d.getMinutes();
            }
            if (this.countNum >= 10 && this.countNum <= 59) {
                this.CountDown.text = '00:' + this.countNum;
                this.CountDown_board.text = this.CountDown.text;

            } else if (this.countNum >= 0 && this.countNum < 10) {
                this.CountDown.text = '00:0' + this.countNum;
                this.CountDown_board.text = this.CountDown.text;
            }
        }
    }

    timeSwitch: boolean = true;
    lwgOnUpdate(): void {
        if (Number(this.Num.value) >= 15) {
            if (this.timeSwitch) {
                _Execution._execution.value = 15;
                this.Num.value = _Execution._execution.value.toString();
                this.CountDown.text = '00:00';
                this.CountDown_board.text = this.CountDown.text;
                this.countNum = 60;
                this.timeSwitch = false;
            }
        } else {
            this.timeSwitch = true;
            this.countDownAddEx();
        }
    }
    
}