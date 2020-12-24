/**综合模板*/
export module lwg {
    /**提示模块*/
    export module Dialogue {
        enum Skin {
            blackBord = 'Frame/UI/ui_orthogon_black.png'
        }
        /**
         * 动态创建，第一次创建比较卡，如果第一次绘制这张合图，可以不合图
         * @param describe 类型，也就是提示文字类型
         */
        export function createHint_Middle(describe: string): void {
            let Hint_M = Laya.Pool.getItemByClass('Hint_M', Laya.Sprite);
            Hint_M.name = 'Hint_M';//标识符和名称一样

            Laya.stage.addChild(Hint_M);
            Hint_M.width = Laya.stage.width;
            Hint_M.height = 100;
            Hint_M.pivotY = Hint_M.height / 2;
            Hint_M.pivotX = Laya.stage.width / 2;
            Hint_M.x = Laya.stage.width / 2;
            Hint_M.y = Laya.stage.height / 2;
            Hint_M.zOrder = 100;

            // 底图
            let Pic = new Laya.Image();
            Hint_M.addChild(Pic);
            Pic.skin = Skin.blackBord;
            Pic.width = Laya.stage.width;
            Pic.pivotX = Laya.stage.width / 2;
            Pic.height = 100;
            Pic.pivotY = Pic.height / 2;
            Pic.y = Hint_M.height / 2;
            Pic.x = Laya.stage.width / 2;
            Pic.alpha = 0.6;

            // 提示语
            let Dec = new Laya.Label();
            Hint_M.addChild(Dec);
            Dec.width = Laya.stage.width
            Dec.text = describe;
            Dec.pivotX = Laya.stage.width / 2;
            Dec.x = Laya.stage.width / 2;
            Dec.height = 100;
            Dec.pivotY = 50;
            Dec.y = Hint_M.height / 2;
            Dec.bold = true;
            Dec.fontSize = 35;
            Dec.color = '#ffffff';
            Dec.align = 'center';
            Dec.valign = 'middle';

            // 动画
            Dec.alpha = 0;
            Animation2D.scale_Alpha(Hint_M, 0, 1, 0, 1, 1, 1, 200, 0, f => {
                Animation2D.fadeOut(Dec, 0, 1, 150, 0, f => {
                    Animation2D.fadeOut(Dec, 1, 0, 200, 800, f => {
                        Animation2D.scale_Alpha(Hint_M, 1, 1, 1, 1, 0, 0, 200, 0, f => {
                            Hint_M.removeSelf();
                        });
                    });
                });
            });
        }
        /**获取对话框内容，内容必须已经预加载*/
        export let _dialogContent = {
            get Array(): Array<any> {
                return Laya.loader.getRes("GameData/Dialogue/Dialogue.json")['RECORDS'] !== null ? Laya.loader.getRes("GameData/Dialogue/Dialogue.json")['RECORDS'] : [];
            },
        };

        /**
         * 获取对单个话框中指定的内容条目数组，通过适用场景和序号获取
         * @param useWhere 适用场景
         * @param name 对话的名称
         * */
        export function getDialogContent(useWhere: string, name: number): Array<string> {
            let dia;
            for (let index = 0; index < _dialogContent.Array.length; index++) {
                const element = _dialogContent.Array[index];
                if (element['useWhere'] == useWhere && element['name'] == name) {
                    dia = element;
                    break;
                }
            }
            let arr = [];
            for (const key in dia) {
                if (dia.hasOwnProperty(key)) {
                    const value = dia[key];
                    if (key.substring(0, 7) == 'content' || value !== -1) {
                        arr.push(value);
                    }
                }
            }
            return arr;
        }

        /**
          * 随机从列表中获取一个内容数组
          * @param useWhere 适用场景
          * */
        export function getDialogContent_Random(useWhere: string): Array<string> {
            let contentArr = [];
            let whereArr = getUseWhere(useWhere);
            let index = Math.floor(Math.random() * whereArr.length);
            for (const key in whereArr[index]) {
                if (whereArr[index].hasOwnProperty(key)) {
                    const value = whereArr[index][key];
                    if (key.substring(0, 7) == 'content' && value !== "-1") {
                        contentArr.push(value);
                    }
                }
            }
            return contentArr;
        }

        /**根据适用场景取出所有该场景下的数组*/
        export function getUseWhere(useWhere: string): Array<any> {
            let arr = [];
            for (let index = 0; index < _dialogContent.Array.length; index++) {
                const element = _dialogContent.Array[index];
                if (element['useWhere'] == useWhere) {
                    arr.push(element);
                }
            }
            return arr;
        }

        /**对话框中应用的场景类型*/
        export enum UseWhere {
            scene1 = 'scene1',
            scene2 = 'scene2',
            scene3 = 'scene3',
        }

        /**对话框中的属性*/
        export enum DialogProperty {
            /**名称，必须有*/
            name = 'name',
            /**试用场景*/
            useWhere = 'useWhere',
            /**内容条数，内容条数是content+数字，contentMax为最大条数*/
            content = 'content',
            /**语句的最大条目数，配合content属性查找*/
            max = 'max',
        }

        export enum PlayMode {
            /**自动播放，随即消失*/
            voluntarily = 'voluntarily',
            /**不点击屏幕则不会消失*/
            manual = 'manual',
            /**点击变换内容*/
            clickContent = 'clickContent',
        }

        export let DialogueNode: Laya.Sprite;
        /**
         * 动态创建一个自动播放的对话框
         * @param x x位置
         * @param y y位置
         * @param useWhere 适用场景
         * @param parent 父节点
         * @param content 内容
         * @param startDelayed 起始延时时间
         * @param delayed 每段文字延迟时间，默认为2秒
         */
        export function createVoluntarilyDialogue(x: number, y: number, useWhere: string, startDelayed?: number, delayed?: number, parent?: Laya.Sprite, content?: Array<string>): void {
            if (startDelayed == undefined) {
                startDelayed = 0;
            }
            Laya.timer.once(startDelayed, this, () => {
                let Pre_Dialogue;
                Laya.loader.load('Prefab/Dialogue_Common.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    Pre_Dialogue = Laya.Pool.getItemByCreateFun('Pre_Dialogue', _prefab.create, _prefab);
                    if (parent) {
                        parent.addChild(Pre_Dialogue);
                    } else {
                        Laya.stage.addChild(Pre_Dialogue);
                    }
                    Pre_Dialogue.x = x;
                    Pre_Dialogue.y = y;
                    let ContentLabel = Pre_Dialogue.getChildByName('Content') as Laya.Label;
                    let contentArr;
                    if (content !== undefined) {
                        ContentLabel.text = content[0];
                    } else {
                        contentArr = getDialogContent_Random(useWhere);
                        ContentLabel.text = contentArr[0];
                    }
                    Pre_Dialogue.zOrder = 100;

                    if (delayed == undefined) {
                        delayed = 1000;
                    }
                    Animation2D.scale_Alpha(Pre_Dialogue, 0, 0, 0, 1, 1, 1, 150, 1000, () => {
                        for (let index = 0; index < contentArr.length; index++) {

                            Laya.timer.once(index * delayed, this, () => {
                                ContentLabel.text = contentArr[index];

                                if (index == contentArr.length - 1) {
                                    Laya.timer.once(delayed, this, () => {
                                        Animation2D.scale_Alpha(Pre_Dialogue, 1, 1, 1, 0, 0, 0, 150, 1000, () => {
                                            Pre_Dialogue.removeSelf();
                                        })
                                    })
                                }
                            })
                        }
                    });
                    DialogueNode = Pre_Dialogue;
                }));
            })
        }

        /**
         * 创建一个普通的对话框
         * @param parent 父节点
         * @param x x位置
         * @param y y位置
         * @param content 
         */
        export function createCommonDialog(parent, x, y, content: string): void {
            let Dialogue_Common;
            Laya.loader.load('Prefab/Dialogue_Common.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                Dialogue_Common = Laya.Pool.getItemByCreateFun('Dialogue_Common', _prefab.create, _prefab);
                parent.addChild(Dialogue_Common);
                Dialogue_Common.pos(x, y);
                let Content = Dialogue_Common.getChildByName('Dialogue_Common') as Laya.Label;
                Content.text = content;
            }))
        }
    }

    /**金币模块*/
    export module Gold {
        /**金币数量*/
        export let _num = {
            get value(): number {
                return Laya.LocalStorage.getItem('GoldNum') ? Number(Laya.LocalStorage.getItem('GoldNum')) : 0;
            },
            set value(val: number) {
                Laya.LocalStorage.setItem('GoldNum', val.toString());
            }
        };
        /**指代当前全局的的金币资源节点*/
        export let GoldNode: Laya.Sprite;
        /**
         * 创建通用剩余金币资源数量prefab
         * @param x x位置
         * @param y y位置
         * @param parent 父节点，不传则是舞台
         */
        export function _createGoldNode(x: number, y: number, parent?: Laya.Sprite): void {
            if (!parent) {
                parent = Laya.stage;
            }
            if (GoldNode) {
                GoldNode.removeSelf();
            }
            let sp: Laya.Sprite;
            Laya.loader.load('Prefab/LwgGold.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                let _prefab = new Laya.Prefab();
                _prefab.json = prefab;
                sp = Laya.Pool.getItemByCreateFun('gold', _prefab.create, _prefab);
                let Num = sp.getChildByName('Num') as Laya.Label;
                Num.text = Tools._Format.formatNumber(_num.value);
                parent.addChild(sp);
                sp.pos(x, y);
                sp.zOrder = 100;
                GoldNode = sp;
            }));
        }

        /**增加金币以并且在节点上也表现出来*/
        export function _add(number: number) {
            _num.value += Number(number);
            let Num = GoldNode.getChildByName('Num') as Laya.Text;
            Num.text = Tools._Format.formatNumber(_num.value);
        }
        /**增加金币节点上的表现动画，并不会增加金币*/
        export function _addDisPlay(number: number) {
            let Num = GoldNode.getChildByName('Num') as Laya.FontClip;
            Num.value = (Number(Num.value) + Number(number)).toString();
        }
        /**增加金币，但是不表现出来*/
        export function _addNoDisPlay(number: number) {
            _num.value += Number(number);
        }
        /**
         * GoldNode出现动画
         * @param delayed 延时时间
         * @param x 允许改变一次X轴位置
         * @param y 允许改变一次Y轴位置
        */
        export function _nodeAppear(delayed?: number, x?: number, y?: number): void {
            if (!GoldNode) {
                return;
            }
            if (delayed) {
                Animation2D.scale_Alpha(GoldNode, 0, 1, 1, 1, 1, 1, delayed, 0, f => {
                    GoldNode.visible = true;
                });
            } else {
                GoldNode.visible = true;
            }

            if (x) {
                GoldNode.x = x;
            }

            if (y) {
                GoldNode.y = y;
            }
        }

        /**
         * GoldNode消失动画
         * @param delayed 延时时间
        */
        export function _nodeVinish(delayed?: number): void {
            if (!GoldNode) {
                return;
            }
            if (delayed) {
                Animation2D.scale_Alpha(GoldNode, 1, 1, 1, 1, 1, 0, delayed, 0, f => {
                    GoldNode.visible = false;
                });
            } else {
                GoldNode.visible = false;
            }
        }

        /**框架中的地址*/
        enum SkinUrl {
            "Frame/Effects/iconGold.png"
        }

        /**创建单个金币*/
        export function _createOne(width: number, height: number, url: string): Laya.Image {
            let Gold = Laya.Pool.getItemByClass('addGold', Laya.Image) as Laya.Image;
            Gold.name = 'addGold';//标识符和名称一样
            let num = Math.floor(Math.random() * 12);
            Gold.alpha = 1;
            Gold.zOrder = 60;
            Gold.width = width;
            Gold.height = height;
            Gold.pivotX = width / 2;
            Gold.pivotY = height / 2;
            if (!url) {
                Gold.skin = SkinUrl[0];
            } else {
                Gold.skin = url;
            }
            if (GoldNode) {
                Gold.zOrder = GoldNode.zOrder + 10;
            }
            return Gold;
        }

        /**
        *  金币表现动画，陆续生成单个金币
        * @param parent 父节点
        * @param number 产生金币的数量
        * @param width 金币的宽度
        * @param height 金币的宽度
        * @param url 金币皮肤地址
        * @param firstPoint 初始位置
        * @param targetPoint 目标位置
        * @param func1 每一个金币移动完成后执行的回调
        * @param func2 金币全部创建完成后的回调
        */
        export function _getAni_Single(parent: Laya.Sprite, number: number, width: number, height: number, url: string, firstPoint: Laya.Point, targetPoint: Laya.Point, func1?: Function, func2?: Function): void {

            for (let index = 0; index < number; index++) {
                Laya.timer.once(index * 30, this, () => {

                    let Gold = _createOne(width, height, url);

                    parent.addChild(Gold);

                    Animation2D.move_Scale(Gold, 1, firstPoint.x, firstPoint.y, targetPoint.x, targetPoint.y, 1, 350, 0, null, () => {
                        AudioAdmin._playSound(AudioAdmin._voiceUrl.huodejinbi);
                        if (index === number - 1) {

                            Laya.timer.once(200, this, () => {
                                if (func2) {
                                    func2();
                                }
                            })

                        } else {
                            if (func1) {
                                func1();
                            }
                        }
                        Gold.removeSelf();
                    })
                })
            }
        }

        /**
         * 金币表现动画，生成一堆金币，然后分别移动到目标位置
         * @param parent 父节点
         * @param number 产生金币的数量
         * @param width 金币的宽度
         * @param height 金币的宽度
         * @param url 金币皮肤地址
         * @param firstPoint 初始位置
         * @param targetPoint 目标位置
         * @param func1 每一个金币移动完成后执行的回调
         * @param func2 金币全部创建完成后的回调
         */
        export function _getAni_Heap(parent?: Laya.Sprite, number?: number, width?: number, height?: number, url?: string, firstPoint?: Laya.Point, targetPoint?: Laya.Point, func1?: Function, func2?: Function): void {
            for (let index = 0; index < number; index++) {
                let Gold = _createOne(width ? width : 100, height ? height : 100, url ? url : SkinUrl[0]);
                parent = parent ? parent : Laya.stage;
                parent.addChild(Gold);
                firstPoint = firstPoint ? firstPoint : new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2);
                targetPoint = targetPoint ? targetPoint : new Laya.Point(GoldNode.x, GoldNode.y);
                let x = Math.floor(Math.random() * 2) == 1 ? firstPoint.x + Math.random() * 100 : firstPoint.x - Math.random() * 100;
                let y = Math.floor(Math.random() * 2) == 1 ? firstPoint.y + Math.random() * 100 : firstPoint.y - Math.random() * 100;
                // Gold.rotation = Math.random() * 360;
                Animation2D.move_Scale(Gold, 0.5, firstPoint.x, firstPoint.y, x, y, 1, 300, Math.random() * 100 + 100, Laya.Ease.expoIn, () => {
                    Animation2D.move_Scale(Gold, 1, Gold.x, Gold.y, targetPoint.x, targetPoint.y, 1, 400, Math.random() * 200 + 100, Laya.Ease.cubicOut, () => {
                        AudioAdmin._playSound(AudioAdmin._voiceUrl.huodejinbi);
                        if (index === number - 1) {

                            Laya.timer.once(200, this, () => {
                                if (func2) {
                                    func2();
                                }
                            })

                        } else {
                            if (func1) {
                                func1();
                            }
                        }
                        Gold.removeSelf();
                    })
                });
            }
        }
    }

    /**事件模块*/
    export module EventAdmin {
        /**以节点为单位，在节点内注册事件，节点移除或者关闭后，关闭事件监听；如果需要在节点外注册事件，this为EventAdmin，不要写在节点脚本中，否则每次打开一次就会注册一次*/
        export let dispatcher: Laya.EventDispatcher = new Laya.EventDispatcher();
        /**
         * 事件注册,总控制事件注册在当前类，每个游戏独有的事件不要注册在这里，防止每关重复注册
         * @param type 事件类型或者名称
         * @param caller 事件的执行域
         * @param listener 响应事件的回调函数,以下写法可以传递参数进来:()=>{}
         */
        export function _register(type: any, caller: any, listener: Function) {
            if (!caller) {
                console.error("事件的执行域必须存在!");
            }
            dispatcher.on(type.toString(), caller, listener);
        }
        /**
        * 注册一次事件，相应一次就消失
        * @param type 事件类型或者名称
        * @param caller 事件的执行域
        * @param listener 响应事件的回调函数,以下写法可以传递参数进来:()=>{}
        */
        export function _registerOnce(type: any, caller: any, listener: Function) {
            if (!caller) {
                console.error("事件的执行域必须存在!");
            }
            dispatcher.once(type.toString(), caller, listener);
        }
        /**
         * 通知事件
         * @param type 事件类型或者名称
         * @param args 注册事件中的回调函数中的参数
         */
        export function _notify(type: any, args?: Array<any>) {
            dispatcher.event(type.toString(), args);
        }
        /**
         * 关闭某个事件
         * @param type 事件类型或者名称
         * @param caller 事件的执行域
         * @param listener 关闭后的回调函数
         * */
        export function _off(type: any, caller: any, listener: Function) {
            dispatcher.off(type.toString(), caller, listener);
        }
        /**
         * 关闭所有执行域中的事件
         * @param type 事件类型或者名称
        */
        export function _offAll(type: any) {
            dispatcher.offAll(type.toString());
        }

        /**
         * 移除某个caller上的所有事件
         * @param caller 执行域
        */
        export function _offCaller(caller: any) {
            dispatcher.offAllCaller(caller);
        }
    }

    /**日期管理*/
    export module DateAdmin {
        export let _date = {
            /**年*/
            get year(): number {
                return (new Date()).getFullYear();
            },
            /**月*/
            get month(): number {
                return (new Date()).getMonth();
            },
            /**日*/
            get date(): number {
                return (new Date()).getDate();
            },
            /**周几*/
            get day(): number {
                return (new Date()).getDay();
            },
            /**小时*/
            get hours(): number {
                return (new Date()).getHours();
            },
            /**分钟*/
            get minutes(): number {
                return (new Date()).getMinutes();
            },
            /**秒*/
            get seconds(): number {
                return (new Date()).getSeconds();
            },
            /**毫秒*/
            get milliseconds(): number {
                return (new Date()).getMilliseconds();
            },
            /**全日期*/
            get toLocaleDateString(): string {
                return (new Date()).toLocaleDateString();
            },
            /**当前时间*/
            get toLocaleTimeString(): string {
                return (new Date()).toLocaleTimeString();
            }
        }
        export function _init(): void {
            let d = new Date;
            _loginInfo = StorageAdmin._arrayArr('DateAdmin._loginInfo');
            _loginInfo.value.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()])
            let arr: Array<Array<any>> = [];
            if (_loginInfo.value.length > 0) {
                for (let index = 0; index < _loginInfo.value.length; index++) {
                    arr.push(_loginInfo.value[index]);
                }
            }
            arr.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()]);
            _loginInfo.value = arr;
            DateAdmin._loginCount = StorageAdmin._mum('DateAdmin._loginCount');
            DateAdmin._loginCount.value++;
            DateAdmin._loginToday.num++;
        }
        /**玩家登陆游戏的总次数信息,包括其中的年月日,星期几*/
        export let _loginInfo: StorageAdmin._ArrayArrVariable;
        /**玩家登录的总次数*/
        export let _loginCount: StorageAdmin._NumVariable;
        /**今天登陆了几次*/
        export let _loginToday = {
            get num(): number {
                return Laya.LocalStorage.getItem('DateAdmin._loginToday') ? Number(Laya.LocalStorage.getItem('DateAdmin._loginToday')) : 0;
            },
            set num(val: number) {
                if (_date.date == _loginInfo.value[_loginInfo.value.length - 1][2]) {
                    Laya.LocalStorage.setItem('DateAdmin._loginToday', val.toString());
                }
            }
        }
        /**前一天登陆是哪一天*/
        export let _last = {
            get date(): number {
                if (_loginInfo.value.length > 1) {
                    return _loginInfo.value[_loginInfo.value.length - 2][2];
                } else {
                    return _loginInfo.value[_loginInfo.value.length - 1][2];
                }
            },
        }
        /**前一天登陆是哪一天*/
        export let _front = {
            get date(): number {
                return _loginInfo.value[_loginInfo.value.length - 1][2];
            },
        }
    }

    /**
     * 时间管理
     * 计时器的封装
    */
    export module TimerAdmin {
        /**总控制开关,默认为打开*/
        export let _switch: boolean = true;

        /**
         * 普通无限循环，基于帧
         * @param delay 间隔帧数
         * @param caller 执行域
         * @param method 方法回调
         * @param immediately 是否立即执行一次，默认为false
         * @param args 回调参数[]
         * @param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
         */
        export function _frameLoop(delay: number, caller: any, method: Function, immediately?: boolean, args?: any[], coverBefore?: boolean): void {
            if (immediately) {
                if (_switch) {
                    method();
                }
            }
            Laya.timer.frameLoop(delay, caller, () => {
                if (_switch) {
                    method();
                }
            }, args, coverBefore);
        }

        /**
         * 在两个时间区间内中随机时间点触发的无限循环，基于帧
         * @param delay1 间隔帧数区间1
         * @param delay2 间隔帧数区间2
         * @param caller 执行域
         * @param method 方法回调
         * @param args 回调参数[]
         * @param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
         */
        export function _frameRandomLoop(delay1: number, delay2: number, caller: any, method: Function, immediately?: boolean, args?: any[], coverBefore?: boolean): void {
            if (immediately) {
                if (_switch) {
                    method();
                }
            }
            var func = () => {
                let delay = Tools._Number.randomOneInt(delay1, delay2);
                Laya.timer.frameOnce(delay, caller, () => {
                    if (_switch) {
                        method();
                        func()
                    }
                }, args, coverBefore)
            }
            func();
        }

        /**
         * 有一定次数的循环，基于帧
         * @param delay 时间间隔
         * @param num 次数
         * @param caller 执行域
         * @param method 回调函数
         * @param compeletMethod 全部完成后的回调函数 
         * @param immediately 是否立即执行一次，默认为false
         * @param args 回调参数[]
         * @param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
         */
        export function _frameNumLoop(delay: number, num: number, caller: any, method: Function, compeletMethod?: Function, immediately?: boolean, args?: any[], coverBefore?: boolean): void {
            if (immediately) {
                if (_switch) {
                    method();
                }
            }
            let num0 = 0;
            var func = () => {
                if (_switch) {
                    num0++;
                    if (num0 >= num) {
                        method();
                        if (compeletMethod) {
                            compeletMethod();
                        }
                        Laya.timer.clear(caller, func);
                    } else {
                        method();
                    }
                }
            }
            Laya.timer.frameLoop(delay, caller, func, args, coverBefore);
        }

        /**
         * 有一定次数的循环，并且在随机时间区间内，基于帧
         * @param delay 时间间隔
         * @param num 次数
         * @param method 回调函数
         * @param compeletMethod 全部完成后的回调函数 
         * @param immediately 是否立即执行一次，默认为false
         * @param args 回调参数[]
         * @param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
         */
        export function _numRandomLoop(delay1: number, delay2: number, num: number, caller: any, method: Function, compeletMethod?: Function, immediately?: boolean, args?: any[], coverBefore?: boolean): void {
            immediately && _switch && method();
            let num0 = 0;
            var func = () => {
                let delay = Tools._Number.randomOneInt(delay1, delay2);
                Laya.timer.frameOnce(delay, caller, () => {
                    if (_switch) {
                        num0++;
                        if (num0 >= num) {
                            method();
                            compeletMethod();
                        } else {
                            method();
                            func()
                        }
                    }
                }, args, coverBefore)
            }
            func();
        }

        /**
         * 有一定次数的循环，并且在随机时间区间内，基于帧
         * @param delay 时间间隔
         * @param num 次数
         * @param method 回调函数
         * @param compeletMethod 全部完成后的回调函数 
         * @param immediately 是否立即执行一次，默认为false
         * @param args 回调参数[]
         * @param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
         */
        export function _frameNumRandomLoop(delay1: number, delay2: number, num: number, caller: any, method: Function, compeletMethod?: Function, immediately?: boolean, args?: any[], coverBefore?: boolean): void {
            immediately && _switch && method();
            let num0 = 0;
            var func = () => {
                let delay = Tools._Number.randomOneInt(delay1, delay2);
                Laya.timer.frameOnce(delay, caller, () => {
                    if (_switch) {
                        num0++;
                        if (num0 >= num) {
                            method();
                            compeletMethod && compeletMethod();
                        } else {
                            method();
                            func()
                        }
                    }
                }, args, coverBefore)
            }
            func();
        }

        /**
         * 执行一次的计时器，基于帧
         * @param delay 延时
         * @param afterMethod 结束回调函数
         * @param beforeMethod 开始之前的函数
         * @param args 回调参数[]
         * @param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
         */
        export function _frameOnce(delay: number, caller, afterMethod: Function, beforeMethod?: Function, args?: any[], coverBefore?: boolean): void {
            beforeMethod && beforeMethod();
            Laya.timer.frameOnce(delay, caller, () => {
                afterMethod();
            }, args, coverBefore)
        }
        /**
         * 同时执行很多次的单次的计时器，基于帧，用于一些类似于爆炸特效等
         * @param delay 延时
         * @param num 个数
         * @param afterMethod 结束回调函数
         * @param beforeMethod 开始之前的函数
         * @param args 回调参数[]
         * @param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
         */
        export function _frameNumOnce(delay: number, num: number, caller: any, afterMethod: Function, beforeMethod?: Function, args?: any[], coverBefore?: boolean): void {
            for (let index = 0; index < num; index++) {
                if (beforeMethod) {
                    beforeMethod();
                }
                Laya.timer.frameOnce(delay, caller, () => {
                    afterMethod();
                }, args, coverBefore)
            }
        }

        /**
         * 普通无限循环，基于时间
         * @param delay 时间
         * @param caller 执行域
         * @param method 方法回调
         * @param immediately 是否立即执行一次，默认为false
         * @param args 回调参数[]
         * @param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
         */
        export function _loop(delay: number, caller: any, method: Function, immediately?: boolean, args?: any[], coverBefore?: boolean): void {
            if (immediately) {
                if (_switch) {
                    method();
                }
            }
            Laya.timer.loop(delay, caller, () => {
                if (_switch) {
                    method();
                }
            }, args, coverBefore);
        }

        /**
         * 在两个时间区间内中随机时间点触发的无限循环，基于时间
         * @param delay1 时间区间1
         * @param delay2 时间区间2
         * @param caller 执行域
         * @param method 方法回调
         * @param immediately 是否立即执行一次，默认为false
         * @param args 回调参数[]
         * @param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
         */
        export function _randomLoop(delay1: number, delay2: number, caller: any, method: Function, immediately?: boolean, args?: any[], coverBefore?: boolean): void {
            if (immediately) {
                if (_switch) {
                    method();
                }
            }
            var func = () => {
                let delay = Tools._Number.randomOneInt(delay1, delay2);
                Laya.timer.once(delay, caller, () => {
                    if (_switch) {
                        method();
                        func()
                    }
                }, args, coverBefore);
            }
            func();
        }

        /**
         * 有一定次数的循环，基于时间
         * @param delay 时间
         * @param num 次数
         * @param method 回调函数
         * @param immediately 是否立即执行一次，默认为false
         * @param args 回调参数[]
         * @param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
         */
        export function _numLoop(delay: number, num: number, caller: any, method: Function, compeletMethod?: Function, immediately?: boolean, args?: any[], coverBefore?: boolean): void {
            if (immediately) {
                method();
            }
            let num0 = 0;
            var func = () => {
                if (_switch) {
                    num0++;
                    if (num0 > num) {
                        method();
                        if (compeletMethod) {
                            compeletMethod();
                        }
                        Laya.timer.clear(caller, func);
                    } else {
                        method();
                    }
                }
            }
            Laya.timer.loop(delay, caller, func, args, coverBefore);
        }

        /**
        * 执行一次的计时器，基于时间
        * @param delay 延时
        * @param afterMethod 结束回调函数
        * @param caller 执行域
        * @param beforeMethod 开始之前的函数
        * @param args 回调参数[]
        * @param coverBefore 是否覆盖之前的延迟执行，默认为 true 。
        */
        export function _once(delay: number, caller: any, afterMethod: Function, beforeMethod?: Function, args?: any[], coverBefore?: boolean): void {
            if (beforeMethod) {
                beforeMethod();
            }
            Laya.timer.once(delay, caller, () => {
                afterMethod();
            }, args, coverBefore)
        }

        /**
         * @export 清理对象上的所有计时器
         * @param {Array<any>} arr 清理的数组
         */
        export function _clearAll(arr: Array<any>): void {
            for (let index = 0; index < arr.length; index++) {
                Laya.timer.clearAll(arr[index]);
            }
        }
        /**
         * @export 清理对象上的所有计时器上的函数
         * @param {Array<any>} arr 清理的数组
         */
        export function _clear(arr: Array<[any, Function]>): void {
            for (let index = 0; index < arr.length; index++) {
                Laya.timer.clear(arr[index][0], arr[index][1]);
            }
        }
    }

    /**适配设置*/
    export module Adaptive {
        export let _Use = {
            get value(): [number, number] {
                return this['Adaptive_value'] ? this['Adaptive_value'] : null;
            },
            /**
             * 设计分辨率
             *@param val [_designWidth，_desigheight]
             */
            set value(val: [number, number]) {
                this['Adaptive_value'] = val;
            }
        }
        /**
         * @export 根据舞台按场景内节点位置比例适配X轴
         * @param {Array<Laya.Sprite>} arr 节点数组
         */
        export function _stageWidth(arr: Array<Laya.Sprite>): void {
            for (let index = 0; index < arr.length; index++) {
                const element = arr[index] as Laya.Sprite;
                if (element.pivotX == 0 && element.width) {
                    element.x = element.x / _Use.value[0] * Laya.stage.width + element.width / 2;
                } else {
                    element.x = element.x / _Use.value[0] * Laya.stage.width;
                }
            }
        }
        /**
         * @export 根据舞台按场景内节点位置比例适配Y轴
         * @param {Array<Laya.Sprite>} arr 节点数组
         */
        export function _stageHeight(arr: Array<Laya.Sprite>): void {
            for (let index = 0; index < arr.length; index++) {
                const element = arr[index] as Laya.Sprite;
                if (element.pivotY == 0 && element.height) {
                    element.y = element.y / _Use.value[1] * element.scaleX * Laya.stage.height + element.height / 2;
                } else {
                    element.y = element.y / _Use.value[1] * element.scaleX * Laya.stage.height;
                }
            }
        }
        /**
         * @export 根据宽高居中
         * @param {Array<Laya.Sprite>} arr 节点数组
         * @param {Laya.Sprite} target 依据什么居中舞台或者父节点
         */
        export function _center(arr: Array<Laya.Sprite>, target: Laya.Sprite): void {
            for (let index = 0; index < arr.length; index++) {
                const element = arr[index] as Laya.Sprite;
                if (element.width > 0) {
                    element.x = target.width / 2 - (element.width / 2 - element.pivotX) * element.scaleX;
                } else {
                    element.x = target.width / 2;
                }
                if (element.height > 0) {
                    element.y = target.height / 2 - (element.height / 2 - element.pivotY) * element.scaleY;
                } else {
                    element.y = target.height / 2;
                }
            }
        }
    }
    /**平台*/
    export module Platform {
        /**渠道类型*/
        export let _Tpye = {
            Bytedance: 'Bytedance',
            WeChat: 'WeChat',
            OPPO: 'OPPO',
            OPPOTest: 'OPPOTest',
            VIVO: 'VIVO',
            /**通用*/
            General: 'General',
            /**web包*/
            Web: 'Web',
            /**web测试包,会清除本地数据*/
            WebTest: 'WebTest',
            /**研发中*/
            Research: 'Research',
        };
        export let _Ues = {
            get value(): string {
                return this['_platform_name'] ? this['_platform_name'] : null;
            },
            set value(val: string) {
                this['_platform_name'] = val;
                switch (val) {
                    case _Tpye.WebTest:
                        Laya.LocalStorage.clear();
                        Gold._num.value = 5000;
                        break;
                    case _Tpye.Research:
                        Gold._num.value = 50000000000000;
                        break;

                    default:
                        break;
                }
            }
        }
    }

    export module SceneAnimation {
        export let _Type = {
            /**渐隐渐出*/
            fadeOut: 'fadeOut',
            /**用于竖屏,类似于用手拿着一角放入，对节点摆放有需求，需要整理节点，通过大块父节点将琐碎的scene中的直接子节点减少，并且锚点要在最左或者最右，否则达不到最佳效果*/
            stickIn: {
                randomstickIn: 'randomstickIn',
                upLeftDownLeft: 'upLeftDownRight',
                upRightDownLeft: 'upRightDownLeft',
            },
            shutters: {
                crosswise: 'crosswise',
                vertical: 'vertical',
                lSideling: 'lSideling',
                rSideling: 'rSideling',
                intersection1: 'intersection1',
                intersection2: 'intersection2',
                randomshutters: 'randomshutters',
            },
            leftMove: 'leftMove',
            rightMove: 'rightMove',
            centerRotate: 'centerRotate',
            drawUp: 'drawUp',
        }
        /**通常情况下，开场动画和关闭动画只有一种，否则可能会有空白时间*/
        export let _openSwitch = true;
        /**通常情况下，开场动画和关闭动画只有一种，否则可能会有空白时间*/
        export let _closeSwitch = false;
        export let _Use = {
            get value(): string {
                return this['SceneAnimation_name'] ? this['SceneAnimation_name'] : null;
            },
            set value(val: string) {
                this['SceneAnimation_name'] = val;
            }
        };

        /**通用场景进场动画*/
        export function _commonOpenAni(Scene: Laya.Scene): number {
            let sumDelay: number = 0;//总延迟
            var afterAni = () => {
                Click._switch = true;
                if (Scene[Scene.name]) {
                    Scene[Scene.name].lwgOpenAniAfter();
                    Scene[Scene.name].lwgButton();
                    Admin._SceneChange._close();
                }
            }
            if (!_openSwitch) {
                afterAni();
                return 0;
            }
            switch (_Use.value) {
                case _Type.fadeOut:
                    sumDelay = _fadeOut_Open(Scene);
                    break;
                case _Type.stickIn.randomstickIn:
                    sumDelay = _stickIn(Scene, _Type.stickIn.randomstickIn)
                    break;
                case _Type.stickIn.upLeftDownLeft:
                    sumDelay = _stickIn(Scene, _Type.stickIn.upLeftDownLeft)
                    break;
                case _Type.stickIn.upRightDownLeft:
                    sumDelay = _stickIn(Scene, _Type.stickIn.upRightDownLeft);
                case _Type.stickIn.randomstickIn:
                    sumDelay = _stickIn(Scene, _Type.stickIn.randomstickIn);

                case _Type.shutters.lSideling:
                    sumDelay = _shutters_Open(Scene, _Type.shutters.lSideling);
                default:
                    sumDelay = _fadeOut_Open(Scene);
                    break;
            }
            Laya.timer.once(sumDelay, this, () => {
                afterAni();
            })
            return sumDelay;
        }

        /**通用场景消失动画*/
        export function _commonCloseAni(CloseScene: Laya.Scene, closeFunc: Function) {
            CloseScene[CloseScene.name].lwgBeforeCloseAni();
            let sumDelay: number = 0;//总延迟
            switch (_Use.value) {
                case _Type.fadeOut:
                    sumDelay = _fadeOut_Close(CloseScene);
                    break;
                case _Type.stickIn.upLeftDownLeft:

                    break;
                case _Type.stickIn.upRightDownLeft:

                    break;
                case _Type.stickIn.randomstickIn:

                    break;
                case _Type.shutters.vertical:
                    sumDelay = _shutters_Close(CloseScene, _Type.shutters.vertical);
                    break;
                case _Type.shutters.crosswise:
                    sumDelay = _shutters_Close(CloseScene, _Type.shutters.crosswise);
                    break;
                case _Type.shutters.lSideling:
                    sumDelay = _shutters_Close(CloseScene, _Type.shutters.lSideling);
                    break;
                case _Type.shutters.rSideling:
                    sumDelay = _shutters_Close(CloseScene, _Type.shutters.rSideling);
                    break;
                case _Type.shutters.intersection1:
                    sumDelay = _shutters_Close(CloseScene, _Type.shutters.intersection1);
                    break;
                case _Type.shutters.intersection2:
                    sumDelay = _shutters_Close(CloseScene, _Type.shutters.intersection2);
                    break;
                case _Type.shutters.randomshutters:
                    sumDelay = _shutters_Close(CloseScene, _Type.shutters.randomshutters);
                    break;

                default:
                    sumDelay = _fadeOut_Close(CloseScene);
                    break;
            }
            Laya.timer.once(sumDelay, this, () => {
                closeFunc();
            })
        }

        function _fadeOut_Open(Scene: Laya.Scene): number {
            let time = 400;
            let delay = 300;
            if (Scene['Background']) {
                Animation2D.fadeOut(Scene, 0, 1, time / 2, delay);
            }
            Animation2D.fadeOut(Scene, 0, 1, time, 0);
            return time + delay;
        }

        function _fadeOut_Close(Scene: Laya.Scene): number {
            let time = 150;
            let delay = 50;
            if (Scene['Background']) {
                Animation2D.fadeOut(Scene, 1, 0, time / 2);
            }
            Animation2D.fadeOut(Scene, 1, 0, time, delay)
            return time + delay;
        }

        function _shutters_Open(Scene: Laya.Scene, type?: string): number {
            let num = 12;
            let time = 500;
            let delaye = 100
            let caller = {};
            Scene.scale(1, 0);
            // 延迟执行是为了场景渲染完毕，截图更加全面
            Laya.timer.once(delaye, caller, () => {
                Scene.scale(1, 1);
                const tex = Scene.drawToTexture(Laya.stage.width, Laya.stage.height, 0, 0) as Laya.Texture;
                Scene.scale(1, 0);
                for (let index = 0; index < num; index++) {
                    let Sp = new Laya.Sprite;
                    Laya.stage.addChild(Sp);
                    Sp.width = Laya.stage.width;
                    Sp.height = Laya.stage.height;
                    Sp.pos(0, 0);
                    Sp.zOrder = 100;
                    Sp.name = 'shutters';
                    Sp.texture = tex;
                    let Mask = new Laya.Image;
                    Mask.width = Sp.width;
                    Mask.height = Laya.stage.height / num;
                    Mask.pos(0, Laya.stage.height / num * index);
                    Mask.skin = `Lwg/UI/ui_orthogon_cycn.png`;
                    Sp.mask = Mask;
                    Tools._Node.changePivot(Sp, Sp.width / 2, index * Sp.height / num + Sp.height / num / 2);
                    Sp.scale(1, 0);
                    Animation2D.scale(Sp, 1, 0, 1, 1, time, 0, () => {
                        Scene.scale(1, 1);
                        tex.destroy();
                        Sp.destroy();
                    });
                }
            })
            return time + delaye + 100;
        }

        // let _base64: string;
        function _shutters_Close(Scene: Laya.Scene, type?: string): number {
            let num = 10;
            let time = 600;
            let delaye = 100;
            let caller = {};
            let ran = Tools._Array.randomGetOne([0, 1, 2, 3, 4, 5])
            // 延迟执行是为了场景渲染完毕，截图更加全面
            Laya.timer.once(delaye, caller, () => {
                const tex = Scene.drawToTexture(Laya.stage.width, Laya.stage.height, 0, 0) as Laya.Texture;
                Scene.scale(1, 0);
                for (let index = 0; index < num; index++) {
                    let sp = new Laya.Sprite;
                    Laya.stage.addChild(sp);
                    sp.width = Laya.stage.width;
                    sp.height = Laya.stage.height;
                    sp.pos(0, 0);
                    sp.zOrder = 100;
                    sp.name = 'shutters';
                    sp.texture = tex;
                    let Mask = new Laya.Image;
                    Mask.skin = `Lwg/UI/ui_orthogon_cycn.png`;
                    Mask.sizeGrid = '12,12,12,12';
                    sp.mask = Mask;
                    var func1 = () => {
                        // 遮罩必须的坐标和长宽必须为整数，否则可能有半个像素无法被遮罩
                        Mask.width = Laya.stage.width;
                        Mask.height = Math.round(Laya.stage.height / num);
                        Mask.pos(0, Math.round(Laya.stage.height / num * index));
                        Tools._Node.changePivot(sp, sp.width / 2, index * sp.height / num + sp.height / num / 2);
                        Animation2D.scale(sp, 1, 1, 1, 0, time, 0, () => {
                            tex.destroy();
                            sp.destroy();
                        });
                    }
                    var func2 = () => {
                        Mask.width = Math.round(Laya.stage.width / num);
                        Mask.height = Laya.stage.height;
                        Mask.pos(Math.round(Laya.stage.width / num * index), 0);
                        Tools._Node.changePivot(sp, index * sp.width / num + sp.width / num / 2, sp.height / 2);
                        Animation2D.scale(sp, 1, 1, 0, 1, time, 0, () => {
                            tex.destroy();
                            sp.destroy();
                        });
                    }

                    var func6 = () => {
                        Mask.width = Laya.stage.width;
                        Mask.height = Math.round(Laya.stage.height / num);
                        Mask.pos(0, Math.round(Laya.stage.height / num * index));
                        Tools._Node.changePivot(sp, sp.width / 2, index * sp.height / num + sp.height / num / 2);
                        Animation2D.scale(sp, 1, 1, 1, 0, time, 0, () => {
                            tex.destroy();
                            sp.destroy();
                        });

                        if (index % 2 == 0) {
                            let sp1 = new Laya.Sprite;
                            Laya.stage.addChild(sp1);
                            sp1.width = Laya.stage.width;
                            sp1.height = Laya.stage.height;
                            sp1.pos(0, 0);
                            sp1.zOrder = 100;
                            sp1.name = 'shutters';
                            sp1.texture = tex;
                            let Mask1 = new Laya.Image;
                            Mask1.skin = `Lwg/UI/ui_orthogon_cycn.png`;
                            Mask1.sizeGrid = '12,12,12,12';
                            sp1.mask = Mask1;
                            Mask1.width = Math.round(Laya.stage.width / num);
                            Mask1.height = Laya.stage.height;
                            Mask1.pos(Math.round(Laya.stage.width / num * index), 0);
                            Tools._Node.changePivot(sp1, Math.round(index * sp1.width / num + sp1.width / num / 2), Math.round(sp1.height / 2));
                            Animation2D.scale(sp1, 1, 1, 0, 1, time, 0, () => {
                                tex.destroy();
                                sp1.destroy();
                            });
                        }
                    }

                    var func3 = () => {
                        Mask.width = Math.round(Laya.stage.width / num);
                        Mask.height = Laya.stage.height + 1000;
                        Mask.pos(Math.round(Laya.stage.width / num * index), -1000 / 2);
                        Tools._Node.changePivot(Mask, Math.round(Mask.width / 2), Math.round(Mask.height / 2));
                        Tools._Node.changePivot(sp, index * sp.width / num + sp.width / num / 2, sp.height / 2);
                        Mask.rotation = 10;
                        Animation2D.scale(sp, 1, 1, 0, 1, time, 0, () => {
                            tex.destroy();
                            sp.destroy();
                        });
                    }
                    let addLen = 1000;
                    var func4 = () => {
                        Mask.width = Math.round(Laya.stage.width / num);
                        Mask.height = Laya.stage.height + addLen;
                        Mask.pos(Math.round(Laya.stage.width / num * index), Math.round(-addLen / 2));
                        Tools._Node.changePivot(Mask, Math.round(Mask.width / 2), Math.round(Mask.height / 2));
                        Tools._Node.changePivot(sp, index * sp.width / num + sp.width / num / 2, sp.height / 2);
                        Mask.rotation = -10;
                        Animation2D.scale(sp, 1, 1, 0, 1, time, 0, () => {
                            tex.destroy();
                            sp.destroy();
                        });
                    }
                    var func5 = () => {
                        Mask.width = Laya.stage.width / num;
                        Mask.height = Laya.stage.height + addLen;
                        Mask.pos(Laya.stage.width / num * index, -addLen / 2);
                        Tools._Node.changePivot(Mask, Mask.width / 2, Mask.height / 2);
                        Tools._Node.changePivot(sp, index * sp.width / num + sp.width / num / 2, sp.height / 2);
                        Mask.rotation = -15;
                        Animation2D.scale(sp, 1, 1, 0, 1, time, 0, () => {
                            tex.destroy();
                            sp.destroy();
                        });

                        let sp2 = new Laya.Sprite;
                        Laya.stage.addChild(sp2);
                        sp2.width = Laya.stage.width;
                        sp2.height = Laya.stage.height;
                        sp2.pos(0, 0);
                        sp2.zOrder = 100;
                        sp2.name = 'shutters';
                        sp2.texture = tex;
                        let Mask2 = new Laya.Image;
                        Mask2.skin = `Lwg/UI/ui_orthogon_cycn.png`;
                        Mask2.sizeGrid = '12,12,12,12';
                        sp2.mask = Mask2;
                        Mask2.width = Laya.stage.width / num;
                        Mask2.height = Laya.stage.height + addLen;
                        Mask2.pos(Laya.stage.width / num * index, -addLen / 2);
                        Tools._Node.changePivot(Mask2, Mask2.width / 2, Mask2.height / 2);
                        Tools._Node.changePivot(sp2, index * sp2.width / num + sp2.width / num / 2, sp2.height / 2);
                        Mask2.rotation = 15;
                        Animation2D.scale(sp2, 1, 1, 0, 1, time, 0, () => {
                            tex.destroy();
                            sp2.destroy();
                        });
                    }
                    let arr = [func1, func2, func3, func4, func5, func6];
                    switch (type) {
                        case _Type.shutters.crosswise:
                            func1();
                            break;
                        case _Type.shutters.vertical:
                            func2();
                            break;
                        case _Type.shutters.lSideling:
                            func3();
                            break;
                        case _Type.shutters.rSideling:
                            func4();
                            break;
                        case _Type.shutters.intersection1:
                            func5();
                            break;
                        case _Type.shutters.intersection2:
                            func6();
                        case _Type.shutters.randomshutters:
                            arr[ran]();
                            break;
                        default:
                            break;
                    }

                }
            })
            return time + delaye;
        }

        function _stickIn(Scene: Laya.Scene, type: string): number {
            let sumDelay: number = 0;
            let time: number = 700;
            let delay: number = 100;
            if (Scene.getChildByName('Background')) {
                Animation2D.fadeOut(Scene.getChildByName('Background') as Laya.Sprite, 0, 1, time);
            }
            let stickInLeftArr = Tools._Node.zOrderByY(Scene, false);
            for (let index = 0; index < stickInLeftArr.length; index++) {
                const element = stickInLeftArr[index] as Laya.Image;
                if (element.name !== 'Background' && element.name.substr(0, 5) !== 'NoAni') {
                    let originalPovitX = element.pivotX;
                    let originalPovitY = element.pivotY;
                    switch (type) {
                        case _Type.stickIn.upLeftDownLeft:
                            element.rotation = element.y > Laya.stage.height / 2 ? -180 : 180;
                            Tools._Node.changePivot(element, 0, 0);

                            break;
                        case _Type.stickIn.upRightDownLeft:
                            element.rotation = element.y > Laya.stage.height / 2 ? -180 : 180;
                            Tools._Node.changePivot(element, element.rotation == 180 ? element.width : 0, 0);

                            break;
                        case _Type.stickIn.randomstickIn:
                            element.rotation = Tools._Number.randomOneHalf() == 1 ? 180 : -180;
                            Tools._Node.changePivot(element, Tools._Number.randomOneHalf() == 1 ? 0 : element.width, Tools._Number.randomOneHalf() == 1 ? 0 : element.height);
                            break;
                        default:
                            break;
                    }
                    let originalX = element.x;
                    let originalY = element.y;
                    element.x = element.pivotX > element.width / 2 ? 800 + element.width : -800 - element.width;
                    element.y = element.rotation > 0 ? element.y + 200 : element.y - 200;
                    Animation2D.rotate(element, 0, time, delay * index);
                    Animation2D.move(element, originalX, originalY, time, () => {
                        Tools._Node.changePivot(element, originalPovitX, originalPovitY);
                    }, delay * index);
                }
            }
            sumDelay = Scene.numChildren * delay + time + 200;
            return sumDelay;
        }
    }

    /**游戏整体控制*/
    export module Admin {
        /**等级*/
        export let _game = {
            /**游戏控制开关*/
            switch: true,
            /**实际关卡*/
            get level(): number {
                return Laya.LocalStorage.getItem('_gameLevel') ? Number(Laya.LocalStorage.getItem('_gameLevel')) : 1;
            },
            set level(val) {
                let diff = val - this.level;
                if (diff > 0) {
                    this.maxLevel += diff;
                }
                if (val > this.loopLevel && this.loopLevel != -1) {
                    Laya.LocalStorage.setItem('_gameLevel', (1).toString());
                } else {
                    Laya.LocalStorage.setItem('_gameLevel', (val).toString());
                }
            },
            /**最大关卡数*/
            get maxLevel(): number {
                return Laya.LocalStorage.getItem('_game_maxLevel') ? Number(Laya.LocalStorage.getItem('_game_maxLevel')) : this.level;
            },
            set maxLevel(val) {
                Laya.LocalStorage.setItem('_game_maxLevel', val.toString());
            },
            /**从第几关开始循环*/
            get loopLevel(): number {
                return this['_gameloopLevel'] ? this['_gameloopLevel'] : -1;
            },
            set loopLevel(lev: number) {
                this['_gameloopLevel'] = lev;
            },
            /**等级的显示节点*/
            LevelNode: new Laya.Sprite,
            _createLevel(parent: Laya.Sprite, x: number, y: number): void {
                let sp: Laya.Sprite;
                Laya.loader.load('prefab/LevelNode.json', Laya.Handler.create(this, function (prefab: Laya.Prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(x, y);
                    sp.zOrder = 0;
                    let level = sp.getChildByName('level') as Laya.Label;
                    _game.LevelNode = sp;
                }));
            },
            /***/
            pause: {
                get switch(): boolean {
                    return _game.switch;
                },
                set switch(bool: boolean) {
                    this.bool = bool;
                    if (bool) {
                        _game.switch = false;
                        TimerAdmin._switch = false;
                        Click._switch = true
                    } else {
                        _game.switch = true;
                        TimerAdmin._switch = true;
                        Click._switch = false
                    }
                }
            }
        }
        /**可替代上述等级对象*/
        export class _Game {

        }
        /**引导控制*/
        export let _GuideControl = {
            switch: false,
        }
        /**场景控制,访问特定场景用_sceneControl[name]访问*/
        export let _SceneControl: any = {};
        /**和场景名称一样的脚本,这个脚本唯一，不可随意调用*/
        export let _sceneScript: any = {};
        /**场景模块*/
        export let _Moudel: any = {};

        /**常用场景的名称，和脚本默认导出类名保持一致*/
        export enum _SceneName {
            PreLoad = 'PreLoad',
            PreLoadCutIn = 'PreLoadCutIn',
            Guide = 'Guide',
            Start = 'Start',
            Shop = 'Shop',
            Task = 'Task',
            Set = 'Set',
            Skin = 'Skin',
            Puase = 'Puase',
            Share = 'Share',
            Game3D = 'Game3D',
            Victory = 'Victory',
            Defeated = 'Defeated',
            PassHint = 'PassHint',
            SkinTry = 'SkinTry',
            Redeem = 'Redeem',
            Turntable = 'Turntable',
            CaidanPifu = 'CaidanPifu',
            Operation = 'Operation',
            VictoryBox = 'VictoryBox',
            CheckIn = 'CheckIn',
            Resurgence = 'Resurgence',
            AdsHint = 'AdsHint',
            LwgInit = 'LwgInit',
            Game = 'Game',
            SmallHint = 'SmallHint',
            DrawCard = 'DrawCard',
            PropTry = 'PropTry',
            Card = 'Card',
            ExecutionHint = 'ExecutionHint',
            SkinQualified = 'SkinQualified',
            Eastereggister = 'Eastereggister',
            SelectLevel = 'SelectLevel',
            Settle = 'Settle',
            Special = 'Special',
            Compound = 'Compound',
        }
        /**预加载完毕后，需要打开的场景信息*/
        export let _PreLoadCutIn = {
            openName: null as string,
            closeName: null as string,
            func: null as Function,
            zOrder: null as number,
        }
        /**
         *预加载后打开场景，预加载内容将在预加载界面按照界面名称执行
         * @param {string} openName 需要打开的场景名称
         * @param {string} [closeName] 需要关闭的场景，默认为null
         * @param {Function} [func] 完成回调，默认为null
         * @param {number} [zOrder] 指定层级，默认为最上层
         */
        export function _preLoadOpenScene(openName: string, closeName: string, func?: Function, zOrder?: number) {
            _openScene(_SceneName.PreLoadCutIn, closeName, func);
            _PreLoadCutIn.openName = openName;
            _PreLoadCutIn.closeName = closeName;
            _PreLoadCutIn.func = func;
            _PreLoadCutIn.zOrder = zOrder;
        }

        export class _SceneChange {
            static _openScene: Laya.Scene = null;
            static _openZOder: number = 1;
            static _openFunc: Function = null;
            static _closeScene: Array<Laya.Scene> = [];
            static _closeZOder: number = 0;
            //场景数量，和层级有关
            static _sceneNum: number = 1;
            /**当前打开场景放在最上面*/
            static _openZOderUp(): void {
                if (SceneAnimation._closeSwitch) {
                    let num = 0;
                    for (const key in _SceneControl) {
                        if (Object.prototype.hasOwnProperty.call(_SceneControl, key)) {
                            const Scene = _SceneControl[key] as Laya.Scene;
                            if (Scene.parent) {
                                num++;
                            }
                        }
                    }
                    if (this._openScene) {
                        this._openScene.zOrder = num;
                        for (let index = 0; index < this._closeScene.length; index++) {
                            const element = this._closeScene[index] as Laya.Scene;
                            if (element) {
                                element.zOrder = --num;
                            } else {
                                this._closeScene.splice(index, 1);
                                index--;
                            }
                        }
                    }
                }
            };
            /**当前打开场景放在最上面,如果使用了关闭动画，必然关闭场景在上面*/
            static _closeZOderUP(CloseScene: Laya.Scene): void {
                if (SceneAnimation._closeSwitch) {
                    let num = 0;
                    for (const key in _SceneControl) {
                        if (Object.prototype.hasOwnProperty.call(_SceneControl, key)) {
                            const Scene = _SceneControl[key] as Laya.Scene;
                            if (Scene.parent) {
                                num++;
                            }
                        }
                    }
                    if (CloseScene) {
                        CloseScene.zOrder = num;
                        if (this._openScene) {
                            this._openScene.zOrder = num - 1;
                        }
                    }
                }
            };
            static _open(): void {
                if (this._openScene) {
                    if (this._openZOder) {
                        Laya.stage.addChildAt(this._openScene, this._openZOder)
                    } else {
                        Laya.stage.addChild(this._openScene)
                    }
                    if (_Moudel[`_${this._openScene.name}`]) {
                        if (_Moudel[`_${this._openScene.name}`][this._openScene.name]) {
                            if (!this._openScene.getComponent(_Moudel[`_${this._openScene.name}`][this._openScene.name])) {
                                this._openScene.addComponent(_Moudel[`_${this._openScene.name}`][this._openScene.name]);
                            }
                        }
                    } else {
                        console.log(`${this._openScene.name}场景没有同名脚本！,需在LwgInit脚本中导入该模块！`);
                    }
                    this._openZOderUp();
                    this._openFunc();
                }
            };
            static _close(): void {
                if (this._closeScene.length > 0) {
                    for (let index = 0; index < this._closeScene.length; index++) {
                        let scene = this._closeScene[index] as Laya.Scene;
                        if (scene) {
                            _closeScene(scene.name);
                            this._closeScene.splice(index, 1)
                            index--;
                        }
                    }
                }
                this._remake();
            }
            static _remake(): void {
                this._openScene = null;
                this._openZOder = 1;
                this._openFunc = null;
                this._closeZOder = 0;
            }
        }

        /**
          * 打开场景
          * @param openName 需要打开的场景名称
          * @param closeName 需要关闭的场景，默认为null
          * @param func 完成回调，默认为null
          * @param zOrder 指定层级
         */
        export function _openScene(openName: string, closeName?: string, func?: Function, zOrder?: number): void {
            Click._switch = false;
            Laya.Scene.load('Scene/' + openName + '.json', Laya.Handler.create(this, function (scene: Laya.Scene) {
                if (Tools._Node.checkChildren(Laya.stage, openName)) {
                    console.log(openName, '场景重复出现！请检查代码');
                } else {
                    _SceneChange._openScene = _SceneControl[scene.name = openName] = scene;
                    _SceneChange._closeScene.push(_SceneControl[closeName]);
                    _SceneChange._closeZOder = closeName ? _SceneControl[closeName].zOrder : 0;
                    _SceneChange._openZOder = zOrder ? zOrder : null;
                    _SceneChange._openFunc = func ? func : () => { };
                    _SceneChange._open();
                }
            }))
        }

        /**
         * 关闭场景，使用此方法会先播放场景消失动画，但是必须是通过_openScene（）方法打开的场景且继承自Admin.Scene，场景消失动画和出场动画是统一的，无需设置
         * @param closeName 需要关闭的场景名称
         * @param func 关闭后的回调函数
         * */
        export function _closeScene(closeName?: string, func?: Function): void {
            if (!_SceneControl[closeName]) {
                console.log('场景', closeName, '关闭失败！可能是名称不对！');
                return;
            }
            /**传入的回调函数*/
            var closef = () => {
                func && func();
                Click._switch = true;
                _SceneControl[closeName].close();
            }
            // 如果关闭了场景消失动画，则不会执行任何动画
            if (!SceneAnimation._closeSwitch) {
                closef();
                return;
            }
            _SceneChange._closeZOderUP(Admin._SceneControl[closeName]);
            //如果内部场景消失动画被重写了，则执行内部场景消失动画，而不执行通用动画
            let script = _SceneControl[closeName][_SceneControl[closeName].name];
            if (script) {
                if (script) {
                    Click._switch = false;
                    script.lwgBeforeCloseAni();
                    let time0 = script.lwgCloseAni();
                    if (time0 !== null) {
                        Laya.timer.once(time0, this, () => {
                            closef();
                            Click._switch = true;
                        })
                    } else {
                        SceneAnimation._commonCloseAni(_SceneControl[closeName], closef);
                    }
                }
            }
        }

        /**
         * 脚本通用类
         * */
        export class _ScriptBase extends Laya.Script {

            private getFind(name: string, type: string): any {
                if (!this[`_Scene${type}${name}`]) {
                    let Node = Tools._Node.findChild2D(this.owner.scene, name);
                    if (Node) {
                        return this[`_Scene${type}${name}`] = Node;
                    } else {
                        console.log(`场景内不存在节点${name}`);
                    }
                } else {
                    return this[`_Scene${type}${name}`];
                }
            }

            /**全局查找*/
            _FindImg(name: string,): Laya.Image {
                return this.getFind(name, '_FindImg');
            }
            /**全局查找*/
            _FindSp(name: string,): Laya.Image {
                return this.getFind(name, '_FindSp');
            }
            /**场景内查找*/
            _FindBox(name: string,): Laya.Image {
                return this.getFind(name, '_FindBox');
            }
            /**场景内查找*/
            _FindTap(name: string,): Laya.Image {
                return this.getFind(name, '_FindTap');
            }
            /**场景内查找*/
            _FindLabel(name: string,): Laya.Image {
                return this.getFind(name, '_FindLabel');
            }
            /**场景内查找*/
            _FindList(name: string,): Laya.Image {
                return this.getFind(name, '_FindList');
            }

            _storeNum(name: string, _func?: Function, initial?: number): StorageAdmin._NumVariable {
                return StorageAdmin._mum(`${this.owner.name}/${name}`, _func, initial);
            }
            _storeStr(name: string, _func?: Function, initial?: string): StorageAdmin._StrVariable {
                return StorageAdmin._str(`${this.owner.name}/${name}`, _func, initial);
            }
            _storeBool(name: string, _func?: Function, initial?: boolean): StorageAdmin._BoolVariable {
                return StorageAdmin._bool(`${this.owner.name}/${name}`, _func, initial);
            }
            _storeArray(name: string, _func?: Function, initial?: Array<any>): StorageAdmin._ArrayVariable {
                return StorageAdmin._array(`${this.owner.name}/${name}`, _func, initial);
            }
            /**游戏开始前执行一次，重写覆盖*/
            lwgOnAwake(): void { };
            /**适配位置*/
            lwgAdaptive(): void { };
            /**场景中的一些事件，在lwgOnEnable中注册,lwgOnStart以后可以发送这些事件*/
            lwgEvent(): void { };
            _evReg(name: string, func: Function): void {
                EventAdmin._register(name, this, func);
            }
            _evRegOne(name: string, func: Function): void {
                EventAdmin._registerOnce(name, this, func);
            }
            _evNotify(name: string, args?: Array<any>): void {
                EventAdmin._notify(name, args);
            }
            /**初始化，在onEnable中执行，重写即可覆盖*/
            lwgOnEnable(): void { }
            /**初始化完毕后，onUpdate前执行一次，重写覆盖*/
            lwgOnStart(): void { }
            /**按钮点击事件注册，在开场动画执行之后注册，在onEnable中完成*/
            lwgButton(): void { };
            /**
             * 按下触发的点击事件注册,可以用(e)=>{}简写传递的函数参数
             * @param target 节点
             * @param caller 执行域
             * @param down 按下回调
             * @param effect 效果类型输入'null'则没有效果
            */
            _btnDown(target: Laya.Node, down?: Function, effect?: string): void {
                Click._on(effect == undefined ? Click._Use.value : effect, target, this, (e: Laya.Event) => {
                    Click._switch && down && down(e)
                }, null, null, null);
            }
            /**
              * 抬起触发点击事件注册,可以用(e)=>{}简写传递的函数参数
              * @param target 节点
              * @param move 移动回调
              * @param effect 效果类型输入'null'则没有效果
             */
            _btnMove(target: Laya.Node, move: Function, effect?: string): void {
                Click._on(effect == undefined ? Click._Use.value : effect, target, this, null, (e: Laya.Event) => {
                    Click._switch && move && move(e)
                }, null, null);
            }

            /**
             * 抬起触发点击事件注册,可以用(e)=>{}简写传递的函数参数
             * @param target 节点
             * @param up 抬起回调
             * @param effect 效果类型输入'null'则没有效果
           */
            _btnUp(target: Laya.Node, up: Function, effect?: string): void {
                Click._on(effect == undefined ? Click._Use.value : effect, target, this, null, null, (e: Laya.Event) => {
                    Click._switch && up && up(e);
                }, null);
            }
            /**
              * 抬起触发点击事件注册,可以用(e)=>{}简写传递的函数参数
              * @param target 节点
              * @param out 移出回调
              * @param effect 效果类型输入'null'则没有效果
             */
            _btnOut(target: Laya.Node, out: Function, effect?: string): void {
                Click._on(effect == undefined ? Click._Use.value : effect, target, this, null, null, null, (e: Laya.Event) => { Click._switch && out && out(e) });
            }
            /**
              * 通用事件注册,可以用(e)=>{}简写传递的函数参数
              * @param effect 效果类型输入null则没有效果
              * @param target 节点
              * @param down 按下回调
              * @param move 移动回调
              * @param up 抬起回调
              * @param out 移出回调
             */
            _btnFour(target: Laya.Node, down?: Function, move?: Function, up?: Function, out?: Function, effect?: string): void {
                Click._on(effect == null ? effect : Click._Use.value, target, this,
                    (e: Laya.Event) => { Click._switch && down && down(e) },
                    (e: Laya.Event) => { Click._switch && move && move(e) },
                    (e: Laya.Event) => { Click._switch && up && up(e) },
                    (e: Laya.Event) => { Click._switch && out && out(e) });
            }
            ownerSceneName: string = '';
            /**
              * 打开场景
              * @param openName 需要打开的场景名称
              * @param closeSelf 是否关闭当前场景,默认为true
              * @param preLoadCutIn 是否进入预加载页面，进入后需要在PreLoadCutIn界面进行操作，默认为false；
              * @param func 完成回调，默认为null
              * @param zOrder 指定层级
             */
            _openScene(openName: string, closeSelf?: boolean, preLoadCutIn?: boolean, func?: Function, zOrder?: number): void {
                let closeName: string;
                if (closeSelf == undefined || closeSelf == true) {
                    closeName = this.ownerSceneName;
                }
                if (!preLoadCutIn) {
                    Admin._openScene(openName, closeName, func, zOrder);
                } else {
                    Admin._preLoadOpenScene(openName, closeName, func, zOrder);
                }
            }
            /**
             * 关闭场景
             * @param sceneName 默认为当前场景
             * @param func 关闭后的回调函数
             * */
            _closeScene(sceneName?: string, func?: Function): void {
                Admin._closeScene(sceneName ? sceneName : this.ownerSceneName, func);
            }
            /**每帧执行，不要执行onUpdate，只执行lwgOnUpdate*/
            lwgOnUpdate(): void { };
            /**离开时执行不要执行onDisable，只执行lwgDisable*/
            lwgOnDisable(): void { };
            onStageMouseDown(e: Laya.Event): void { Click._switch && this.lwgOnStageDown(e) };
            onStageMouseMove(e: Laya.Event): void { Click._switch && this.lwgOnStageMove(e) };
            onStageMouseUp(e: Laya.Event): void { Click._switch && this.lwgOnStageUp(e) };
            lwgOnStageDown(e: Laya.Event): void { };
            lwgOnStageMove(e: Laya.Event): void { };
            lwgOnStageUp(e: Laya.Event): void { };
        }

        /**2D场景通用父类*/
        export class _SceneBase extends _ScriptBase {

            /**类名*/
            private _calssName: string = _SceneName.PreLoad;
            constructor() {
                super();
            }
            /**挂载当前脚本的节点*/
            get _Owner(): Laya.Scene {
                return this.owner as Laya.Scene;
            }
            private getVar(name: string, type: string): any {
                if (!this[`_Scene${type}${name}`]) {
                    if (this._Owner[name]) {
                        return this[`_Scene${type}${name}`] = this._Owner[name];
                    } else {
                        console.log('场景内不存在var节点：', name);
                        return undefined;
                    }
                } else {
                    return this[`_Scene${type}${name}`];
                }
            }
            // 常用节点获取
            _SpriteVar(name: string): Laya.Sprite {
                return this.getVar(name, '_SpriteVar');
            }
            /**常用动画组件获取*/
            _AniVar(name: string): Laya.Animation {
                return this.getVar(name, '_AniVar');
            }
            _BtnVar(name: string): Laya.Button {
                return this.getVar(name, '_BtnVar');
            }
            _ImgVar(name: string): Laya.Image {
                return this.getVar(name, '_ImgVar');
            }
            _LabelVar(name: string): Laya.Label {
                return this.getVar(name, '_LabelVar');
            }
            _ListVar(name: string): Laya.List {
                return this.getVar(name, '_ListVar');
            }
            _TapVar(name: string): Laya.Tab {
                return this.getVar(name, '_TapVar');
            }
            _TextVar(name: string): Laya.Text {
                return this.getVar(name, '_TextVar');
            }
            _TextInputVar(name: string): Laya.TextInput {
                return this.getVar(name, '_TextInputVar');
            }
            _FontClipVar(name: string): Laya.FontClip {
                return this.getVar(name, '_FontClipVar');
            }
            _FontBox(name: string): Laya.Box {
                return this.getVar(name, '_FontBox');
            }
            _FontTextInput(name: string): Laya.TextInput {
                return this.getVar(name, '_FontInput');
            }
            onAwake(): void {
                // 自适应铺满
                this._Owner.width = Laya.stage.width;
                this._Owner.height = Laya.stage.height;
                if (this._Owner.getChildByName('Background')) {
                    this._Owner.getChildByName('Background')['width'] = Laya.stage.width;
                    this._Owner.getChildByName('Background')['height'] = Laya.stage.height;
                }
                // 类名
                if (this._Owner.name == null) {
                    console.log('场景名称失效，脚本赋值失败');
                } else {
                    // 组件变为的self属性
                    this.ownerSceneName = this._calssName = this._Owner.name;
                    this._Owner[this._calssName] = this;
                }
                this.moduleOnAwake();
                this.lwgOnAwake();
                this.lwgAdaptive();
            }
            /**每个模块优先执行的页面开始前执行的函数，比lwgOnAwake更早执行*/
            moduleOnAwake(): void { }
            onEnable() {
                this.moduleEvent();
                this.lwgEvent();
                this.moduleOnEnable();
                this.lwgOnEnable();
            }
            /**每个模块优先执行的初始化函数，比lwgOnEnable早执行*/
            moduleOnEnable(): void { };
            /**模块中的事件*/
            moduleEvent(): void { };
            onStart(): void {
                this.btnAndOpenAni();
                this.moduleOnStart();
                this.lwgOnStart();
            }
            moduleOnStart(): void { }
            /**通过openAni返回的时间来延时开启点击事件*/
            private btnAndOpenAni(): void {
                let time = this.lwgOpenAni();
                if (time !== null) {
                    Laya.timer.once(time, this, () => {
                        Click._switch = true;
                        this.lwgOpenAniAfter();
                        this.lwgButton();
                        _SceneChange._close();
                    });
                } else {
                    SceneAnimation._commonOpenAni(this._Owner);
                }
            }
            /**开场动画,返回的数字为时间倒计时，倒计时结束后开启点击事件,也可以用来屏蔽通用动画，只需返回一个数字即可,如果场景内节点是以prefab添加进去的，那么必须卸载lwgOpenAni之前*/
            lwgOpenAni(): number { return null };
            /**开场动画之后执行*/
            lwgOpenAniAfter(): void { };
            /**按照当前Y轴坐标的高度的比例适配，适配整个舞台*/
            _adaHeight(arr: Array<Laya.Sprite>): void {
                Adaptive._stageHeight(arr);
            };
            /**按照当前X轴的高度的比例适配*/
            _adaWidth(arr: Array<Laya.Sprite>): void {
                Adaptive._stageWidth(arr);
            };
            /**按照当前X轴的高度的比例适配*/
            _adaptiveCenter(arr: Array<Laya.Sprite>): void {
                Adaptive._center(arr, Laya.stage);
            };
            onUpdate(): void { this.lwgOnUpdate() };
            /**离场动画前执行*/
            lwgBeforeCloseAni(): void { }
            /**离场动画,也可以用来屏蔽通用动画，只需返回一个数字即可*/
            lwgCloseAni(): number { return null };
            onDisable(): void {
                Animation2D.fadeOut(this._Owner, 1, 0, 2000, 1);
                this.lwgOnDisable();
                Laya.timer.clearAll(this);
                Laya.Tween.clearAll(this);
                EventAdmin._offCaller(this);
            }
        }

        /**2D角色、物件通用父类*/
        export class _ObjectBase extends _ScriptBase {
            constructor() {
                super();
            }
            /**挂载当前脚本的节点*/
            get _Owner(): Laya.Image | Laya.Sprite {
                return this.owner as Laya.Image | Laya.Sprite;
            }
            /**初始位置*/
            _fPoint: Laya.Point;
            /**初始角度*/
            _fRotation: number;
            /**获取坐标*/
            get _point(): Laya.Point {
                return new Laya.Point(this._Owner.x, this._Owner.y);
            }
            /**所属场景*/
            get _Scene(): Laya.Scene {
                return this.owner.scene as Laya.Scene;
            }
            /**父节点*/
            get _Parent(): Laya.Image | Laya.Sprite {
                if (this._Owner.parent) {
                    return this.owner.parent as Laya.Image | Laya.Sprite;
                }
            }
            get _gPoint(): Laya.Point {
                return this._Parent.localToGlobal(new Laya.Point(this._Owner.x, this._Owner.y));
            }
            /**物理组件*/
            get _RigidBody(): Laya.RigidBody {
                if (!this._Owner['_OwnerRigidBody']) {
                    this._Owner['_OwnerRigidBody'] = this._Owner.getComponent(Laya.RigidBody);
                }
                return this._Owner['_OwnerRigidBody'];
            }
            /**矩形碰撞组件*/
            get _BoxCollier(): Laya.BoxCollider {
                if (!this._Owner['_OwnerBoxCollier']) {
                    this._Owner['_OwnerBoxCollier'] = this._Owner.getComponent(Laya.BoxCollider);
                }
                return this._Owner['_OwnerBoxCollier'];
            }
            /**圆形碰撞组件*/
            get _CilrcleCollier(): Laya.BoxCollider {
                if (!this._Owner['_OwnerCilrcleCollier']) {
                    return this._Owner['_OwnerCilrcleCollier'] = this._Owner.getComponent(Laya.BoxCollider);
                }
                return this._Owner['_OwnerCilrcleCollier'];
            }
            /**自定义碰撞组件*/
            get _PolygonCollier(): Laya.BoxCollider {
                if (!this._Owner['_OwnerPolygonCollier']) {
                    return this._Owner['_OwnerPolygonCollier'] = this._Owner.getComponent(Laya.BoxCollider);
                }
                return this._Owner['_OwnerPolygonCollier'];
            }
            private getSceneVar(name: string, type: string): any {
                if (!this[`_Scene${type}${name}`]) {
                    if (this._Scene[name]) {
                        return this[`_Scene${type}${name}`] = this._Scene[name];
                    } else {
                        console.log(`场景内不存在var节点${name}`);
                    }
                } else {
                    return this[`_Scene${type}${name}`];
                }
            }
            _SceneSprite(name: string): Laya.Sprite {
                return this.getSceneVar(name, '_SceneSprite');
            }
            _SceneAni(name: string): Laya.Animation {
                return this.getSceneVar(name, '_SceneAni');
            }
            _SceneImg(name: string): Laya.Image {
                return this.getSceneVar(name, '_SceneImg');
            }
            _SceneLabel(name: string): Laya.Label {
                return this.getSceneVar(name, '_SceneLabel');
            }
            _SceneList(name: string): Laya.List {
                return this.getSceneVar(name, '_SceneList');
            }
            _SceneTap(name: string): Laya.Tab {
                return this.getSceneVar(name, '_SceneTap');
            }
            _SceneText(name: string): Laya.Text {
                return this.getSceneVar(name, '_SceneText');
            }
            _SceneFontClip(name: string): Laya.FontClip {
                return this.getSceneVar(name, '_SceneFontClip');
            }
            _SceneBox(name: string): Laya.Box {
                return this.getSceneVar(name, '_SceneBox');
            }
            getChild(name: string, type: string): any {
                if (!this[`${type}${name}`]) {
                    if (this._Owner.getChildByName(name)) {
                        return this[`${type}${name}`] = this._Owner.getChildByName(name);
                    } else {
                        console.log('场景内不存在子节点：', name);
                        return null;
                    }
                } else {
                    return this[`${type}${name}`];
                }
            }
            _ImgChild(name: string): Laya.Image {
                return this.getChild(name, '_ImgChild');
            }
            _SpriteChild(name: string): Laya.Sprite {
                return this.getChild(name, '_SpriteChild');
            }
            _LableChild(name: string): Laya.Label {
                return this.getChild(name, '_LableChild');
            }
            _ListChild(name: string): Laya.List {
                return this.getChild(name, '_ListChild');
            }
            _TapChild(name: string): Laya.Tab {
                return this.getChild(name, '_TapChild');
            }
            _TapBox(name: string): Laya.Box {
                return this.getChild(name, '_TapBox');
            }
            _TapFontClip(name: string): Laya.FontClip {
                return this.getChild(name, '_TapFontClip');
            }
            onAwake(): void {
                // 组件变为的self属性
                this._Owner[this['__proto__']['constructor'].name] = this;
                this.ownerSceneName = this._Scene.name;
                /**初始位置*/
                this._fPoint = new Laya.Point(this._Owner.x, this._Owner.y);
                /**初始角度*/
                this._fRotation = this._Owner.rotation;
                this.lwgOnAwake();
                this.lwgAdaptive();
            }
            onEnable(): void {
                this.lwgButton();
                this.lwgEvent();
                this.lwgOnEnable();
            }
            onStart(): void {
                this.lwgOnStart();
            }
            onUpdate(): void {
                this.lwgOnUpdate();
            }
            onDisable(): void {
                this.lwgOnDisable();
                Laya.timer.clearAll(this);
                EventAdmin._offCaller(this);
            }
        }
    }




    export module StorageAdmin {
        class admin {
            removeSelf(): void { }
            /**监听函数，每次值变化的时候会执行一次,不可以改变值，但是可以获取值*/
            func(): void { }
        }
        export class _NumVariable extends admin {
            get value(): number { return };
            set value(val: number) { }
        }
        export class _StrVariable extends admin {
            get value(): string { return }
            set value(val: string) { }
        }
        export class _BoolVariable extends admin {
            get value(): boolean { return }
            set value(val: boolean) { }
        }
        export class _ArrayVariable extends admin {
            get value(): Array<any> { return }
            set value(val: Array<any>) { }
        }
        export class _ArrayArrVariable extends admin {
            get value(): Array<Array<any>> { return }
            set value(val: Array<Array<any>>) { }
        }
        /**
        * @param name 名称
        * @param initial 初始值，如果有值了则无效,默认为0
        * */
        export function _mum(name: string, _func?: Function, initial?: number): _NumVariable {
            if (!this[`_mum${name}`]) {
                this[`_mum${name}`] = {
                    get value(): number {
                        if (Laya.LocalStorage.getItem(name)) {
                            return Number(Laya.LocalStorage.getItem(name));
                        } else {
                            initial = initial ? initial : 0;
                            Laya.LocalStorage.setItem(name, initial.toString());
                            return initial;
                        }
                    },
                    set value(data: number) {
                        Laya.LocalStorage.setItem(name, data.toString());
                        this['func']();
                    },
                    removeSelf(): void {
                        Laya.LocalStorage.removeItem(name);
                    },
                    func(): void {
                        this['_func'] && this['_func']();
                    }
                }
            }
            if (_func) {
                this[`_mum${name}`]['_func'] = _func;
            }
            return this[`_mum${name}`];
        }
        /**
         * @param name 名称
         * @param initial 初始值，如果有值了则无效，默认为null
         * */
        export function _str(name: string, _func?: Function, initial?: string): _StrVariable {
            if (!this[`_str${name}`]) {
                this[`_str${name}`] = {
                    get value(): string {
                        if (Laya.LocalStorage.getItem(name)) {
                            return Laya.LocalStorage.getItem(name);
                        } else {
                            initial = initial ? initial : null;
                            Laya.LocalStorage.setItem(name, initial.toString());
                            return initial;
                        }
                    },
                    set value(data: string) {
                        Laya.LocalStorage.setItem(name, data.toString());
                        this['func']();
                    },
                    removeSelf(): void {
                        Laya.LocalStorage.removeItem(name);
                    },
                    func(): void {
                        _func && _func();
                    }
                }
            }
            if (_func) {
                this[`_str${name}`]['_func'] = _func;
            }
            return this[`_str${name}`];
        }
        /**
         * @param name 名称
         * @param initial 初始值，如果有值了则无效，默认为false
         * */
        export function _bool(name: string, _func?: Function, initial?: boolean): _BoolVariable {
            if (!this[`_bool${name}`]) {
                this[`_bool${name}`] = {
                    get value(): any {
                        if (Laya.LocalStorage.getItem(name)) {
                            if (Laya.LocalStorage.getItem(name) == "false") {
                                return false;
                            } else if (Laya.LocalStorage.getItem(name) == "true") {
                                return true;
                            }
                        } else {
                            if (initial) {
                                Laya.LocalStorage.setItem(name, "true");
                            } else {
                                Laya.LocalStorage.setItem(name, "false");
                            }
                            this['func']();
                            return initial;
                        }
                    },
                    set value(bool: any) {
                        bool = bool ? "true" : "false";
                        Laya.LocalStorage.setItem(name, bool.toString());
                    },
                    removeSelf(): void {
                        Laya.LocalStorage.removeItem(name);
                    },
                    func(): void {
                        _func && _func();
                    }
                }
            }
            if (_func) {
                this[`_bool${name}`]['_func'] = _func;
            }
            return this[`_bool${name}`];
        }
        /**
        * @param name 名称
        * @param initial 初始值，如果有值了则无效，默认为[]
        * */
        export function _array(name: string, _func?: Function, initial?: Array<any>): _ArrayVariable {
            if (!this[`_array${name}`]) {
                this[`_array${name}`] = {
                    get value(): Array<any> {
                        try {
                            let data = Laya.LocalStorage.getJSON(name)
                            if (data) {
                                return JSON.parse(data);;
                            } else {
                                initial = initial ? initial : [];
                                Laya.LocalStorage.setItem(name, initial.toString());
                                this['func']();
                                return initial;
                            }
                        } catch (error) {
                            return [];
                        }
                    },
                    set value(array: Array<any>) {
                        Laya.LocalStorage.setJSON(name, JSON.stringify(array));
                    },
                    removeSelf(): void {
                        Laya.LocalStorage.removeItem(name);
                    },
                    func(): void {
                        _func && _func();
                    }
                }
            }
            if (_func) {
                this[`_array${name}`]['_func'] = _func;
            }
            return this[`_array${name}`];
        }

        /**
         * @param name 名称
         * @param initial 初始值，如果有值了则无效，默认为[]
         * */
        export function _arrayArr(name: string, _func?: Function, initial?: Array<Array<any>>): _ArrayArrVariable {
            if (!this[`_arrayArr${name}`]) {

                this[`_arrayArr${name}`] = {
                    get value(): Array<Array<any>> {
                        try {
                            let data = Laya.LocalStorage.getJSON(name)
                            if (data) {
                                return JSON.parse(data);;
                            } else {
                                initial = initial ? initial : [];
                                Laya.LocalStorage.setItem(name, initial.toString());
                                return initial;
                            }
                        } catch (error) {
                            return [];
                        }
                    },
                    set value(array: Array<Array<any>>) {
                        Laya.LocalStorage.setJSON(name, JSON.stringify(array));
                        this['func']();
                    },
                    removeSelf(): void {
                        Laya.LocalStorage.removeItem(name);
                    },
                    func(): void {
                        _func && _func();
                    }
                }
            }
            if (_func) {
                this[`_arrayArr${name}`]['_func'] = _func;
            }
            return this[`_arrayArr${name}`];
        }
    }
    /**数据管理*/
    export module DataAdmin {
        /**new出一个通用数据表管理对象，如果属性不能通用，则继承使用*/
        export class _Table {
            /**一些通用的属性名称枚举，可重写*/
            _property = {
                /**名称是必须有的属性，可以是数字,不可以重名*/
                name: 'name',
                /**用于排序或者是某些资源的关联*/
                index: 'index',
                /**通过某个属性值进行排序*/
                sort: 'sort',
                /**有时候会有个中文名*/
                chName: 'chName',
                /**分类*/
                classify: 'classify',
                /**解锁方式*/
                unlockWay: 'unlockWay',
                /**条件值*/
                conditionNum: 'conditionNum',
                /**完成值*/
                degreeNum: 'degreeNum',
                /**达到，取得，完成,解锁*/
                compelet: 'compelet',
                /**有奖励而没有领取*/
                getAward: 'getAward',
                /**是否被选中*/
                pitch: 'pitch',
            };
            /**其他属性枚举重写添加*/
            _otherPro: any;
            /**一般解锁方式枚举*/
            _unlockWay = {
                ads: 'ads',
                gold: 'gold',
                customs: 'free',
                diamond: 'diamond',
                free: 'free',
            }
            /**其他解锁方式枚举*/
            _otherunlockWay: any;
            /**种类*/
            _classify: any;
            /**数据表名称*/
            _tableName: string = '';
            get _arr(): Array<any> {
                return this[`_${this._tableName}arr`];
            }
            set _arr(arr: Array<any>) {
                this[`_${this._tableName}arr`] = arr;
            }
            /**上个版本的表格*/
            _lastArr: Array<any> = [];
            /**是否启用本地存储*/
            _localStorage: boolean = false;
            /**设置表格中的List,会有一些默认设置,页面关闭时最好清空*/
            get _List(): Laya.List {
                return this[`${this._tableName}_List`];
            }
            /**表格中的List,会有一些默认设置*/
            set _List(list: Laya.List) {
                this[`${this._tableName}_List`] = list;
                list.array = this._arr;
                list.selectEnable = false;
                list.vScrollBarSkin = "";
                list.renderHandler = new Laya.Handler(this, (Cell: Laya.Box, index: number) => {
                    this._listRender && this._listRender(Cell, index);
                });
                list.selectHandler = new Laya.Handler(this, (index: number) => {
                    this._listSelect && this._listSelect(index);
                });
            }
            /**渲染函数*/
            _listRender: Function;
            /**选中触发*/
            _listSelect: Function;
            /**表格中的Tap*/
            _Tap: Laya.List;
            /**
             * @param {string} tableName 在本地存储的名称
             * @param {Array<any>} tableArr 数据表数组
             * @param localStorage 是否存储在本地
             * @param lastVtableName 如果表格发生改变，对比上个版本的数据表将一些成果继承赋值
             */
            constructor(tableName?: string, _tableArr?: Array<any>, localStorage?: boolean, lastVtableName?: string) {
                if (tableName) {
                    this._tableName = tableName;
                    if (localStorage) {
                        this._localStorage = localStorage;
                        this._arr = addCompare(_tableArr, tableName, this._property.name);
                        if (lastVtableName) {
                            this._compareLastInfor(lastVtableName);
                        }
                    } else {
                        this._arr = _tableArr;
                    }
                }
            }

            /**设置存储*/
            _refreshAndStorage(): void {
                if (this._localStorage) {
                    Laya.LocalStorage.setJSON(this._tableName, JSON.stringify(this._arr));
                }
                if (this._List) {
                    this._List.refresh();
                }
            }

            /**
             * 导入上个版本的完成数据
             * @param {string} lastVtableName 上个存储名
             */
            _compareLastInfor(lastVtableName: string): void {
                this._lastArr = this._getlastVersion(lastVtableName);
                if (this._lastArr.length > 0) {
                    for (let i = 0; i < this._lastArr.length; i++) {
                        const _lastelement = this._lastArr[i];
                        for (let j = 0; j < this._arr.length; j++) {
                            const element = this._arr[j];
                            if (_lastelement[this._property.compelet]) {
                                element[this._property.compelet] = true;
                            }
                            if (_lastelement[this._property.getAward]) {
                                element[this._property.getAward] = true;
                            }
                            if (_lastelement[this._property.degreeNum] > element[this._property.degreeNum]) {
                                element[this._property.getAward] = _lastelement[this._property.degreeNum];
                            }
                        }
                    }
                }
            }

            /**
              * 查询以前版本的表格
              * @param lastVtableName 以前版本名称
              */
            _getlastVersion(lastVtableName: string): Array<any> {
                let dataArr: any = [];
                try {
                    if (Laya.LocalStorage.getJSON(lastVtableName)) {
                        dataArr = JSON.parse(Laya.LocalStorage.getJSON(lastVtableName));
                    }
                } catch (error) {
                    console.log(lastVtableName + '前版本不存在！')
                }
                return dataArr;
            }

            /**
             *通过名称获取属性值
             * @param {string} name 名称
             * @param {string} pro 属性值
             */
            _getProperty(name: string, pro: string): any {
                let value: any;
                for (const key in this._arr) {
                    if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                        const element = this._arr[key];
                        if (element[this._property.name] == name) {
                            value = element[pro];
                            break;
                        }
                    }
                }
                return value;
            };

            /**
             * 返回被选中的对象在数组中的位置
             * */
            _getPitchIndexArr(): number {
                for (let index = 0; index < this._arr.length; index++) {
                    const element = this._arr[index];
                    if (element[this._property.name] === this._pitchName) {
                        return index;
                    }
                }
            }

            /**
              * 返回被选中的对象在List.array中的位置，有时候List.array并不是_arr
              * */
            _getPitchIndexByList(): number {
                if (this._List) {
                    for (let index = 0; index < this._List.array.length; index++) {
                        const element = this._List.array[index];
                        if (element[this._property.name] === this._pitchName) {
                            return index;
                        }
                    }
                }
            }

            /**
             * 将选中的对象移动到第一位
             * @param time 所需时间
             * @param func 结束回调
             * */
            _listTweenToPitch(time: number, func?: Function): void {
                const index = this._getPitchIndexByList();
                index && this._List.tweenTo(index, time, Laya.Handler.create(this, () => {
                    func && func();
                }));
            }

            /**
             * 将选中的对象移动到第几位,本身index的差值
             * @param time 所需时间
             * @param func 结束回调
             * */
            _listTweenToPitchChoose(diffIndex: number, time: number, func?: Function): void {
                const index = this._getPitchIndexByList();
                index && this._List.tweenTo(index + diffIndex, time, Laya.Handler.create(this, () => {
                    func && func();
                }));
            }

            /**
             * 将list中的最后一个移动到第一位
             * */
            _listScrollToLast(): void {
                const index = this._List.array.length - 1;
                index && this._List.scrollTo(index);
            }

            /**
             *通过名称设置属性值
             * @param {string} name 名称
             * @param {string} pro 属性名
             * @param {any} value 属性值
            */
            _setProperty(name: string, pro: string, value: any): any {
                for (const key in this._arr) {
                    if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                        const element = this._arr[key];
                        if (element[this._property.name] == name) {
                            element[pro] = value;
                            this._refreshAndStorage();
                            break;
                        }
                    }
                }
                return value;
            };

            /**通过名称获取对象*/
            _getObjByName(name: string): any {
                let obj = null;
                for (const key in this._arr) {
                    if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                        const element = this._arr[key];
                        if (element[this._property.name] == name) {
                            obj = element;
                            break;
                        }
                    }
                }
                return obj;
            }

            /**
             *设置当前品类中某个值唯一,这个值必须是boolean
             * @param {string} name 对象名字
             * @param {string} pro 属性值
             * @param {boolean} value 属性值是true或者flase
             * @memberof _Table
             */
            _setProSoleByClassify(name: string, pro: string, value: boolean): void {
                const obj = this._getObjByName(name);
                const objArr = this._getArrByClassify(obj[this._property.classify]);
                for (const key in objArr) {
                    if (Object.prototype.hasOwnProperty.call(objArr, key)) {
                        const element = objArr[key];
                        if (element[this._property.name] == name) {
                            element[pro] = value;
                        } else {
                            element[pro] = !value;
                        }
                    }
                }
                this._refreshAndStorage();
            }

            /**为所有对象设置一个属性值*/
            _setAllProPerty(pro: string, value: any): void {
                for (let index = 0; index < this._arr.length; index++) {
                    const element = this._arr[index];
                    element[pro] = value;
                }
                this._refreshAndStorage();
            }

            /**
             * 将所有对象的所有属性值递增一个值
             * @param pro 属性名
             * @param valueFunc 值，是一个可以返回值得func
            */
            _addAllProPerty(pro: string, valueFunc: Function): void {
                for (let index = 0; index < this._arr.length; index++) {
                    const element = this._arr[index];
                    element[pro] += valueFunc();
                }
                this._refreshAndStorage();
            }

            /**
             * 设置当前被选中的某个属性的值
             * @param {string} name 名称
             * @param {string} pro 属性名
             * @param {any} value 属性值
            */
            _setPitchProperty(pro: string, value: any): any {
                const obj = this._getPitchObj();
                obj[pro] = value;
                this._refreshAndStorage();
                return value;
            };

            /**
             * 获取当前被选中的某个属性的值
             * @param {string} name 名称
             * @param {string} pro 属性名
            */
            _getPitchProperty(pro: string): any {
                const obj = this._getPitchObj();
                return obj[pro];
            };

            /**
             * 通过一个属性和值随机出一个对象,用于从某个品类中随机获取一个对象
             * @param {string} [pro] 属性名如果不输入则从表中有此属性的对象中盲选一个。
             * @param {*} [value] 属性值默认为null
             * @memberof _DataTable
             */
            _randomOneObj(proName: string, value?: any): any {
                let arr = [];
                for (const key in this._arr) {
                    if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                        const element = this._arr[key];
                        if (value) {
                            if (element[proName] && element[proName] == value) {
                                arr.push(element);
                            }
                        } else {
                            if (element[proName]) {
                                arr.push(element);
                            }
                        }
                    }
                }
                if (arr.length == 0) {
                    return null;
                } else {
                    let any = Tools._Array.randomGetOne(arr);
                    return any;
                }
            }

            /**
             * 获取某种品类中所有的对象，不可以保存变量，可以在外部保存，因为可能会在此品类中增加对象
             * @param {string} classify
             * @memberof _Table
             */
            _getArrByClassify(classify: string): Array<any> {
                let arr = [];
                for (const key in this._arr) {
                    if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                        const element = this._arr[key];
                        if (element[this._property.classify] == classify) {
                            arr.push(element);
                        }
                    }
                }
                return arr;
            }

            /**
              * 获取某种品类中所有的对象
              * @param {string} classify
              * @memberof _Table
              */
            _getArrByPitchClassify(): Array<any> {
                let arr = [];
                for (const key in this._arr) {
                    if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                        const element = this._arr[key];
                        if (element[this._property.classify] == this._pitchClassify) {
                            arr.push(element);
                        }
                    }
                }
                return arr;
            }

            /**
             * 通过某个属性名称和值获取所有复合条件的对象数组，可以查找出已获得或者未获得
             * @param {string} proName 属性名
             * @param {*} value 值
             * @memberof _DataTable
             */
            _getArrByProperty(proName: string, value: any): Array<any> {
                let arr = [];
                for (const key in this._arr) {
                    if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                        const element = this._arr[key];
                        if (element[proName] && element[proName] == value) {
                            arr.push(element);
                        }
                    }
                }
                return arr;
            }

            /**
             * 获取被选中对象的品类名称
             * @param {string} name
             * @return {*}  {string}
             * @memberof _Table
             */
            _getPitchClassfiyName(): string {
                const obj = this._getObjByName(this._pitchName);
                return obj[this._property.classify];
            }


            /**
            * 通过某个属性名称和值获取所有不复合当前值的属性，可以反向查找出已获得或者未获得
            * @param {string} proName 属性名
            * @param {*} value 值
            * @memberof _DataTable
            */
            _getArrByNoProperty(proName: string, value: any): Array<any> {
                let arr = [];
                for (const key in this._arr) {
                    if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                        const element = this._arr[key];
                        if (element[proName] && element[proName] !== value) {
                            arr.push(element);
                        }
                    }
                }
                return arr;
            }
            /**
             * 通过某个属性名称设置全部属性值,用于设置所有对象某些属性值初始化或者全部达标。
             * @param {string} proName 属性名
             * @param {*} value 值
             * @return {*}  {Array<any>}
             * @memberof _DataTable
             */
            _setArrByProperty(proName: string, value: any): Array<any> {
                let arr = [];
                for (const key in this._arr) {
                    if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                        const element = this._arr[key];
                        if (element[proName]) {
                            element[proName] == value;
                            arr.push(element);
                        }
                    }
                }
                this._refreshAndStorage();
                return arr;
            }

            /**
              * 在单个对象上degreeNum>=conditionNum为完成，通过degreeNum/conditionNum,设置degreeNum++，设置后返回false表示没有完成，true刚好完成，-1已经拥有或者是没有该对象
              * @param classify 商品种类
              * @param name 商品名称
              * @param number 完成几次，不传则默认为1次
              * @param func 回调函数，可以在条件完成数次后执行某个步骤
             */
            _checkCondition(name: string, number?: number, func?: Function): any {
                let chek: any = null;
                number = number == undefined ? 1 : number;
                let degreeNum = this._getProperty(name, this._property.degreeNum);
                let condition = this._getProperty(name, this._property.conditionNum);
                let compelet = this._getProperty(name, this._property.compelet);
                if (!compelet) {
                    if (condition <= degreeNum + number) {
                        this._setProperty(name, this._property.degreeNum, condition);
                        this._setProperty(name, this._property.compelet, true);
                        chek = true;
                    } else {
                        this._setProperty(name, this._property.degreeNum, degreeNum + number);
                        chek = false;
                    }
                } else {
                    chek = -1;
                }
                if (func) {
                    func();
                }
                return chek;
            }
            /**检测所有对象的degreeNum/conditionNum是否都完成了*/
            _checkAllCompelet(): boolean {
                let bool: boolean = true;
                for (let index = 0; index < this._arr.length; index++) {
                    const element = this._arr[index];
                    if (!element[this._property.compelet]) {
                        bool = false;
                        return bool;
                    }
                }
                return bool;
            }
            /**设置选中类别*/
            get _pitchClassify(): string {
                if (!this[`${this._tableName}/pitchClassify`]) {
                    if (this._localStorage) {
                        return Laya.LocalStorage.getItem(`${this._tableName}/pitchClassify`) ? Laya.LocalStorage.getItem(`${this._tableName}/pitchClassify`) : null;
                    } else {
                        return this[`${this._tableName}/pitchClassify`] = null;
                    }
                } else {
                    return this[`${this._tableName}/pitchClassify`];
                }
            };
            set _pitchClassify(str: string) {
                this._lastPitchClassify = this[`${this._tableName}/pitchClassify`] ? this[`${this._tableName}/pitchClassify`] : null;
                this[`${this._tableName}/pitchClassify`] = str;
                if (this._localStorage) {
                    Laya.LocalStorage.setItem(`${this._tableName}/pitchClassify`, str.toString());
                }
                this._refreshAndStorage();
            };
            /**设置选中名称*/
            get _pitchName(): string {
                if (!this[`${this._tableName}/_pitchName`]) {
                    if (this._localStorage) {
                        return Laya.LocalStorage.getItem(`${this._tableName}/_pitchName`) ? Laya.LocalStorage.getItem(`${this._tableName}/_pitchName`) : null;
                    } else {
                        return this[`${this._tableName}/_pitchName`] = null;
                    }
                } else {
                    return this[`${this._tableName}/_pitchName`];
                }
            };
            set _pitchName(str: string) {
                this._lastPitchName = this[`${this._tableName}/_pitchName`];
                this[`${this._tableName}/_pitchName`] = str;
                if (this._localStorage) {
                    Laya.LocalStorage.setItem(`${this._tableName}/_pitchName`, str.toString());
                }
                this._refreshAndStorage();
            };

            /**上一次选中类别*/
            get _lastPitchClassify(): string {
                if (!this[`${this._tableName}/_lastPitchClassify`]) {
                    if (this._localStorage) {
                        return Laya.LocalStorage.getItem(`${this._tableName}/_lastPitchClassify`) ? Laya.LocalStorage.getItem(`${this._tableName}/_lastPitchClassify`) : null;
                    } else {
                        return this[`${this._tableName}/_lastPitchClassify`] = null;
                    }
                } else {
                    return this[`${this._tableName}/_lastPitchClassify`];
                }
            };
            set _lastPitchClassify(str: string) {
                this[`${this._tableName}/_lastPitchClassify`] = str;
                if (this._localStorage && str) {
                    Laya.LocalStorage.setItem(`${this._tableName}/_lastPitchClassify`, str.toString());
                }
            };

            /**上一次选中的名称*/
            get _lastPitchName(): string {
                if (!this[`${this._tableName}/_lastPitchName`]) {
                    if (this._localStorage) {
                        return Laya.LocalStorage.getItem(`${this._tableName}/_lastPitchName`) ? Laya.LocalStorage.getItem(`${this._tableName}/_lastPitchName`) : null;
                    } else {
                        return this[`${this._tableName}/_lastPitchName`] = null;
                    }
                } else {
                    return this[`${this._tableName}/_lastPitchName`];
                }
            }
            set _lastPitchName(str: string) {
                this[`${this._tableName}/_lastPitchName`] = str;
                if (this._localStorage && str) {
                    Laya.LocalStorage.setItem(`${this._tableName}/_lastPitchName`, str.toString());
                }
            };

            /**
             * 设置选中名称，自动更新选中类别
             * */
            _setPitch(name: string): void {
                let _calssify: string;
                for (let index = 0; index < this._arr.length; index++) {
                    const element = this._arr[index];
                    if (element[this._property.name] == name) {
                        element[this._property.pitch] = true;
                        _calssify = element[this._property.classify]
                    } else {
                        element[this._property.pitch] = false;
                    }
                }
                this._pitchClassify = _calssify;
                this._pitchName = name;
                this._refreshAndStorage();
            }

            /**
             * 获取选中对象
             * @memberof _Table
             */
            _getPitchObj(): any {
                for (const key in this._arr) {
                    if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                        const element = this._arr[key];
                        if (element[this._property.name] === this._pitchName) {
                            return element;
                        }
                    }
                }
            }

            /**
             * 在表格中临时增加一个对象,会更新本地存储,需谨慎使用
             * @param obj 增加的对象
             * */
            _addObject(obj: any): void {
                // 必须拷贝
                let _obj = Tools._ObjArray.objCopy(obj);
                for (let index = 0; index < this._arr.length; index++) {
                    const element = this._arr[index];
                    if (element[this._property.name] === _obj[this._property.name]) {
                        this._arr[index] == _obj;
                    }
                }
                this._refreshAndStorage();
            }

            /**
             * 在表格中临时增加一组对象,会更新本地存储,需谨慎使用
             * @param objArr 增加的对象数组
             * */
            _addObjectArr(objArr: Array<any>): void {
                const _objArr = Tools._ObjArray.arrCopy(objArr);
                for (let i = 0; i < _objArr.length; i++) {
                    const obj = _objArr[i];
                    // 将原来和当前数组中名称相同的对象冲掉，防止重名
                    for (let j = 0; j < this._arr.length; j++) {
                        const element = this._arr[j];
                        if (obj[this._property.name] === element[this._property.name]) {
                            this._arr[j] = obj;
                            _objArr.splice(i, 1);
                            i--;
                            continue;
                        }//不重名的也不可以直接push，否则可能导致遍历索引位错乱
                    }
                }
                // 再将剩余的
                for (let k = 0; k < _objArr.length; k++) {
                    const element = _objArr[k];
                    this._arr.push(element);
                }
                this._refreshAndStorage();
            }

            /**
             * 根据某个值进行排序,并且直给予一个sort属性记录，会更新本地存储
             * @param  pro 需要进行排序的属性
             * @param  indexPro 记录排序的数组
             * @param  largest  是否是以最大在前，默认为true
             * */
            _sortByProperty(pro: string, indexPro?: string, inverted?: boolean): void {
                Tools._ObjArray.sortByProperty(this._arr, pro);
                if (inverted == undefined || inverted) {
                    for (let index = this._arr.length - 1; index >= 0; index--) {
                        const element = this._arr[index];
                        element[indexPro] = this._arr.length - index;
                    }
                    this._arr.reverse();
                } else {
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        element[indexPro] = index + 1;
                    }
                }

                this._refreshAndStorage();
            }
        }

        /**
         *获取本地存储数组和文件中数据表对比，本地没有的数据添加到本地
         * @param url 本地数据表地址
         * @param storageName 本地存储中的json名称
         * @param propertyName 数组中每个对象中同一个属性名，通过这个名称进行对比
         */
        function addCompare(tableArr: Array<any>, storageName: string, propertyName: string): Array<any> {
            // 第一步，先尝试从本地缓存获取数据，
            // 第二步，如果本地缓存有，把本地没有的新增对象复制进去
            // 第三步，如果本地缓存没有，那么直接从数据表获取

            // 部分平台在没有上传的情况下获取可能会报错，所以报错后直接上传
            try {
                Laya.LocalStorage.getJSON(storageName);
            } catch (error) {
                Laya.LocalStorage.setJSON(storageName, JSON.stringify(tableArr));
                return tableArr;
            }
            let storeArr: any;
            if (Laya.LocalStorage.getJSON(storageName)) {
                storeArr = JSON.parse(Laya.LocalStorage.getJSON(storageName));
                let diffArray = Tools._ObjArray.diffProByTwo(tableArr, storeArr, propertyName);
                console.log(`${storageName}新添加对象`, diffArray);
                Tools._Array.addToarray(storeArr, diffArray);
            } else {
                storeArr = tableArr;
            }
            Laya.LocalStorage.setJSON(storageName, JSON.stringify(storeArr));
            return storeArr;
        }

        /**
          * 获取本地存储数据并且和文件中数据表对比,对比后会上传,此方法必须本地数据表不小于本地存储，属于保守型
          * @param url 本地数据表地址
          * @param storageName 本地存储中的json名称
          * @param propertyName 数组中每个对象中同一个属性名，通过这个名称进行对比
          */
        function _jsonCompare(url: string, storageName: string, propertyName: string): Array<any> {
            // 第一步，先尝试从本地缓存获取数据，
            // 第二步，如果本地缓存有，那么需要和数据表中的数据进行对比，把缓存没有的新增对象复制进去
            // 第三步，如果本地缓存没有，那么直接从数据表获取
            let dataArr: any;
            try {
                Laya.LocalStorage.getJSON(storageName);
                // console.log(Laya.LocalStorage.getJSON(storageName));
            } catch (error) {
                dataArr = Laya.loader.getRes(url)['RECORDS'];
                Laya.LocalStorage.setJSON(storageName, JSON.stringify(dataArr));
                return dataArr;
            }
            if (Laya.LocalStorage.getJSON(storageName)) {
                dataArr = JSON.parse(Laya.LocalStorage.getJSON(storageName));
                console.log(storageName + '从本地缓存中获取到数据,将和文件夹的json文件进行对比');
                try {
                    let dataArr_0: Array<any> = Laya.loader.getRes(url)['RECORDS'];
                    // 如果本地数据条数大于json条数，说明json减东西了，不会对比，json只能增加不能删减
                    if (dataArr_0.length >= dataArr.length) {
                        let diffArray = Tools._ObjArray.diffProByTwo(dataArr_0, dataArr, propertyName);
                        console.log('两个数据的差值为：', diffArray);
                        Tools._Array.addToarray(dataArr, diffArray);
                    } else {
                        console.log(storageName + '数据表填写有误，长度不能小于之前的长度');
                    }
                } catch (error) {
                    console.log(storageName, '数据赋值失败！请检查数据表或者手动赋值！')
                }
            } else {
                try {
                    dataArr = Laya.loader.getRes(url)['RECORDS'];
                } catch (error) {
                    console.log(storageName + '数据赋值失败！请检查数据表或者手动赋值！')
                }
            }
            Laya.LocalStorage.setJSON(storageName, JSON.stringify(dataArr));
            return dataArr;
        }
    }

    /**滤镜模块,主要是为节点和场景等进行颜色变化设置*/
    export module Color {
        /**
         * RGB三个颜色值转换成16进制的字符串‘#xxxxxx’；
         * @param r 
         * @param g
         * @param b
          */
        export function RGBToHexString(r, g, b) {
            return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
        }
        /**
        * RGB三个颜色值转换成16进制的字符串‘#xxxxxx’；
        * @param r 
        * @param g
        * @param b
         */
        export function HexStringToRGB(str: string): Array<number> {
            let arr = [];
            // let r, g, b;
            // r = (0xff << 16 & str) >> 16
            // g = (0xff << 8 & str) >> 8
            // b = 0xff & str
            return arr
        }

        /**
         * 给一张图片染色,包括其子节点,也可以设置一个消失时间
         * @param node 节点
         * @param RGBA [R,G,B,A],默认为随机颜色
         * @param vanishtime 默认不会消失，一旦设置后，将会在这个时间延时后消失
         */
        export function _colour(node: Laya.Sprite, RGBA?: Array<number>, vanishtime?: number): Laya.ColorFilter {
            let cf = new Laya.ColorFilter();
            node.blendMode = 'null';
            if (!RGBA) {
                cf.color(Tools._Number.randomOneBySection(255, 100, true), Tools._Number.randomOneBySection(255, 100, true), Tools._Number.randomOneBySection(255, 100, true), 1)
            } else {
                cf.color(RGBA[0], RGBA[1], RGBA[2], RGBA[3])
            }
            node.filters = [cf];
            if (vanishtime) {
                Laya.timer.once(vanishtime, this, () => {
                    for (let index = 0; index < node.filters.length; index++) {
                        if (node.filters[index] == cf) {
                            node.filters = [];
                            break;
                        }
                    }
                })
            }
            return cf;
        }

        /**
         * 颜色变化生命周期，在时间内改进行一次颜色渐变，之后回到原来的颜色，RGB颜色为匀速增加,基于帧率
         * @param node 节点
         * @param RGBA  [R,G,B,A],A必须输入
         * @param time time为时间， time*2为一个周期，基于帧
         */
        export function _changeOnce(node, RGBA: Array<number>, time: number, func?: Function): void {
            if (!node) {
                return;
            }
            let cf = new Laya.ColorFilter();
            cf.color(0, 0, 0, 0);
            let speedR = RGBA[0] / time;
            let speedG = RGBA[1] / time;
            let speedB = RGBA[2] / time;
            let speedA = 0;
            if (RGBA[3]) {
                speedA = RGBA[3] / time;
            }
            let caller = {
                add: true,
            };
            let R = 0, G = 0, B = 0, A = 0;
            TimerAdmin._frameLoop(1, caller, () => {
                if (R < RGBA[0] && caller.add) {
                    R += speedR;
                    G += speedG;
                    B += speedB;
                    if (speedA !== 0) A += speedA;
                    if (R >= RGBA[0]) {
                        caller.add = false;
                    }
                } else {
                    R -= speedR;
                    G -= speedG;
                    B -= speedB;
                    if (speedA !== 0) A -= speedA;
                    if (R <= 0) {
                        if (func) {
                            func();
                        }
                        Laya.timer.clearAll(caller);
                    }
                }
                cf.color(R, G, B, A);
                node.filters = [cf];
            })
        }

        /**
         * 颜色变化后不会消失，除非手动清除颜色，可以循环变化，平滑过渡
         * @param node 节点
         * @param RGBA1 颜色区间1值[];
         * @param RGBA2 颜色区间2值[];
         * @param frameTime 每次变化的时间，基于帧
         */
        export function _changeConstant(node: Laya.Sprite, RGBA1: Array<number>, RGBA2: Array<number>, frameTime: number): void {
            let cf: Laya.ColorFilter;
            let RGBA0 = [];
            if (!node.filters) {
                cf = new Laya.ColorFilter();
                cf.color(RGBA1[0], RGBA1[1], RGBA1[2], RGBA1[3] ? RGBA1[3] : 1);
                RGBA0 = [RGBA1[0], RGBA1[1], RGBA1[2], RGBA1[3] ? RGBA1[3] : 1];
                node.filters = [cf];
            } else {
                cf = node.filters[0];
                RGBA0 = [node.filters[0]['_alpha'][0], node.filters[0]['_alpha'][1], node.filters[0]['_alpha'][2], node.filters[0]['_alpha'][3] ? node.filters[0]['_alpha'][3] : 1];
            }
            // 随机出一条颜色值
            let RGBA = [Tools._Number.randomCountBySection(RGBA1[0], RGBA2[0])[0], Tools._Number.randomCountBySection(RGBA1[1], RGBA2[1])[0], Tools._Number.randomCountBySection(RGBA1[2], RGBA2[2])[0], Tools._Number.randomCountBySection(RGBA1[3] ? RGBA1[3] : 1, RGBA2[3] ? RGBA2[3] : 1)[0]];
            let speedR = (RGBA[0] - RGBA0[0]) / frameTime;
            let speedG = (RGBA[1] - RGBA0[1]) / frameTime;
            let speedB = (RGBA[2] - RGBA0[2]) / frameTime;
            let speedA = 0;
            if (RGBA[3]) {
                speedA = (RGBA[3] - RGBA0[3]) / frameTime;
            }
            // 如果之前有则取消
            if (node['changeCaller']) {
                Laya.timer.clearAll(node['changeCaller']);
            }
            let changeCaller = {};
            node['changeCaller'] = changeCaller;
            let _time = 0;
            TimerAdmin._frameLoop(1, changeCaller, () => {
                _time++;
                if (_time <= frameTime) {
                    RGBA0[0] += speedR;
                    RGBA0[1] += speedG;
                    RGBA0[2] += speedB;
                } else {
                    Laya.timer.clearAll(changeCaller);
                }
                cf.color(RGBA0[0], RGBA0[1], RGBA0[2], RGBA0[3]);
                node.filters = [cf];
            })
        }
    }


    /**2D特效模块*/
    export module Effects3D {
        export let _tex2D = {
            爱心2: {
                url: 'Lwg/Effects/3D/aixin2.png',
                tex: null as Laya.Texture2D,
            }
        }
        export module _Particle {
            /**
             * @export 粒子系统基础单元,计量单位为1
             * @param {Laya.Scene3D} parent 父节点
             * @param {Laya.Vector3} position 位置，世界坐标默认为[0,0,0];
             * @param {[[number, number, number], [number, number, number]]} sectionSize 大小区间默认
             * @param {[[number, number, number], [number, number, number]]} sectionRotation
             * @param {Laya.Texture2D[]} texArr
             * @param {[[number, number, number, number], [number, number, number, number]]} colorRGBA 色彩区间
             * @param {number} multiple 放大倍数，默认为1，可根据模型的具体大小放大倍数
             * @return {*}  {Laya.MeshSprite3D}
             */
            export function _createBox(parent: Laya.Scene3D, position: Laya.Vector3, sectionSize: [[number, number, number], [number, number, number]], sectionRotation: [[number, number, number], [number, number, number]], texArr: Laya.Texture2D[], colorRGBA: [[number, number, number, number], [number, number, number, number]], multiple?: number): Laya.MeshSprite3D {

                const _scaleX = sectionSize ? Tools._Number.randomOneBySection(sectionSize[0][0], sectionSize[1][0]) : Tools._Number.randomOneBySection(0.01, 0.03);
                const _scaleY = sectionSize ? Tools._Number.randomOneBySection(sectionSize[0][1], sectionSize[1][1]) : Tools._Number.randomOneBySection(0.01, 0.03);
                const _scaleZ = sectionSize ? Tools._Number.randomOneBySection(sectionSize[0][2], sectionSize[1][2]) : Tools._Number.randomOneBySection(0.01, 0.03);

                const box = parent.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(_scaleX, _scaleY, _scaleZ))) as Laya.MeshSprite3D;

                if (position) {
                    box.transform.position.setValue(position.x, position.y, position.z);
                } else {
                    box.transform.position.setValue(0, 0, 0);
                }

                box.transform.localRotationEulerX = sectionRotation ? Tools._Number.randomOneBySection(sectionRotation[0][0], sectionRotation[1][0]) : Tools._Number.randomOneBySection(0, 360);
                box.transform.localRotationEulerX = sectionRotation ? Tools._Number.randomOneBySection(sectionRotation[0][1], sectionRotation[1][1]) : Tools._Number.randomOneBySection(0, 360);
                box.transform.localRotationEulerX = sectionRotation ? Tools._Number.randomOneBySection(sectionRotation[0][2], sectionRotation[1][2]) : Tools._Number.randomOneBySection(0, 360);

                const mat = box.meshRenderer.material = new Laya.UnlitMaterial;
                mat.albedoTexture = texArr ? Tools._Array.randomGetOne(texArr) : _tex2D.爱心2.tex;

                mat.renderMode = 2;//忽略透明度

                mat.albedoColorR = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : Tools._Number.randomOneBySection(180, 255);
                mat.albedoColorG = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : Tools._Number.randomOneBySection(10, 180);
                mat.albedoColorB = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : Tools._Number.randomOneBySection(10, 180);
                mat.albedoColorA = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : Tools._Number.randomOneBySection(1, 1);

                return box;
            }

            //
            export function _spiral(parent?: Laya.Scene3D, position?: Laya.Vector3, sectionSize?: [[number, number, number], [number, number, number]], sectionRotation?: [[number, number, number], [number, number, number]], texArr?: Laya.Texture2D[], colorRGBA?: [[number, number, number, number], [number, number, number, number]], liveTime?: [number, number]): Laya.MeshSprite3D {
                const box = _createBox(parent, position, sectionSize, sectionRotation, texArr, colorRGBA);
                const mat = box.meshRenderer.material as Laya.UnlitMaterial;
                const _liveTime = liveTime ? Tools._Number.randomOneBySection(liveTime[0], liveTime[1]) : Tools._Number.randomOneBySection(100, 200);

                let moveCaller = {
                    time: 0,
                    alpha: true,
                    move: false,
                    vinish: false,
                };
                box['moveCaller'] = moveCaller;
                mat.albedoColorA = 0;
                TimerAdmin._frameLoop(1, moveCaller, () => {
                    moveCaller.time++;
                    if (moveCaller.alpha) {
                        mat.albedoColorA += 0.15;
                        box.transform.localPositionY += 0.002;
                        if (mat.albedoColorA >= 1) {
                            moveCaller.alpha = false;
                            moveCaller.move = true;
                        }
                    }
                    if (moveCaller.move) {
                        box.transform.localPositionY += 0.005;
                        if (moveCaller.time > _liveTime) {
                            moveCaller.move = false;
                            moveCaller.vinish = true;
                        }
                    }
                    if (moveCaller.vinish) {
                        mat.albedoColorA -= 0.15;
                        box.transform.localPositionY += 0.002;
                        if (mat.albedoColorA <= 0) {
                            box.removeSelf();
                        }
                    }
                })
                return box;
            }

            // export class _ParticleImgBase extends Laya.MeshSprite3D {
            //     constructor() {
            //         var box = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(0.75, 0.5, 0.5))) as Laya.MeshSprite3D
            //     }

            // }
        }

    }
    /**2D特效模块*/
    export module Effects2D {
        /**特效元素的图片地址，所有项目都可用*/
        export enum _SkinUrl {
            爱心1 = 'Lwg/Effects/aixin1.png',
            爱心2 = "Lwg/Effects/aixin2.png",
            爱心3 = "Lwg/Effects/aixin3.png",
            花1 = "Lwg/Effects/hua1.png",
            花2 = "Lwg/Effects/hua2.png",
            花3 = "Lwg/Effects/hua3.png",
            花4 = "Lwg/Effects/hua4.png",
            星星1 = "Lwg/Effects/star1.png",
            星星2 = "Lwg/Effects/star2.png",
            星星3 = "Lwg/Effects/star3.png",
            星星4 = "Lwg/Effects/star4.png",
            星星5 = "Lwg/Effects/star5.png",
            星星6 = "Lwg/Effects/star6.png",
            星星7 = "Lwg/Effects/star7.png",
            星星8 = "Lwg/Effects/star8.png",
            菱形1 = "Lwg/Effects/rhombus1.png",
            菱形2 = "Lwg/Effects/rhombus1.png",
            菱形3 = "Lwg/Effects/rhombus1.png",
            矩形1 = "Lwg/Effects/rectangle1.png",
            矩形2 = "Lwg/Effects/rectangle2.png",
            矩形3 = "Lwg/Effects/rectangle3.png",
            雪花1 = "Lwg/Effects/xuehua1.png",
            叶子1 = "Lwg/Effects/yezi1.png",
            圆形发光1 = "Lwg/Effects/yuanfaguang.png",
            圆形1 = "Lwg/Effects/yuan1.png",
            光圈1 = "Lwg/Effects/guangquan1.png",
            光圈2 = "Lwg/Effects/guangquan2.png",
            三角形1 = "Lwg/Effects/triangle1.png",
            三角形2 = "Lwg/Effects/triangle2.png",
        }

        /**
         * 光圈模块
         * */
        export module _Aperture {

            /**光圈模块的图片基类*/
            export class _ApertureImage extends Laya.Image {
                constructor(parent: Laya.Sprite, centerPoint: Laya.Point, width: number, height: number, rotation: Array<number>, urlArr: Array<string>, colorRGBA: Array<Array<number>>, zOrder: number) {
                    super();
                    if (!parent.parent) {
                        return;
                    }
                    parent.addChild(this);
                    centerPoint ? this.pos(centerPoint.x, centerPoint.y) : this.pos(0, 0);
                    this.width = width ? width : 100;
                    this.height = height ? height : 100;
                    this.pivotX = this.width / 2;
                    this.pivotY = this.height / 2;
                    this.rotation = rotation ? Tools._Number.randomOneBySection(rotation[0], rotation[1]) : Tools._Number.randomOneBySection(360);
                    this.skin = urlArr ? Tools._Array.randomGetOne(urlArr) : _SkinUrl.花3;
                    this.zOrder = zOrder ? zOrder : 0;
                    this.alpha = 0;
                    let RGBA = [];
                    RGBA[0] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : Tools._Number.randomOneBySection(0, 255);
                    RGBA[1] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : Tools._Number.randomOneBySection(0, 255);
                    RGBA[2] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : Tools._Number.randomOneBySection(0, 255);
                    RGBA[3] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : Tools._Number.randomOneBySection(0, 255);
                    Color._colour(this, RGBA);
                }
            }

            /**
             * 从中心点发出一个光圈，类似波浪，根据光圈不同的样式和节奏,通过控制宽高来控制放大多少
             * @param parent 父节点
             * @param centerPoint 发出位置
             * @param width 宽度，默认100
             * @param height 高度，默认100
             * @param rotation 角度区间[a,b],默认为随机
             * @param urlArr 图片数组，默认为框架中的图片
             * @param colorRGBA 颜色区间[[][]]
             * @param scale 最大放大区间[a,b]
             * @param zOrder 层级，默认为0
             * @param speed 速度区间[a,b]，默认0.025，也表示了消失位置，和波浪的大小
             * @param accelerated 加速度,默认为0.0005
             */
            export function _continuous(parent: Laya.Sprite, centerPoint?: Laya.Point, width?: number, height?: number, rotation?: Array<number>, urlArr?: Array<string>, colorRGBA?: Array<Array<number>>, zOrder?: number, scale?: Array<number>, speed?: Array<number>, accelerated?: Array<number>): void {
                let Img = new _ApertureImage(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, zOrder);
                let _speed = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : 0.025;
                let _accelerated = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : 0.0005;
                let _scale = scale ? Tools._Number.randomOneBySection(scale[0], scale[1]) : 2;
                let moveCaller = {
                    alpha: true,
                    scale: false,
                    vanish: false
                };
                Img['moveCaller'] = moveCaller;
                let acc = 0;
                TimerAdmin._frameLoop(1, moveCaller, () => {
                    if (moveCaller.alpha) {
                        Img.alpha += 0.05;
                        acc = 0;
                        if (Img.alpha >= 1) {
                            moveCaller.alpha = false;
                            moveCaller.scale = true;
                        }
                    } else if (moveCaller.scale) {
                        acc += _accelerated;
                        if (Img.scaleX > _scale) {
                            moveCaller.scale = false;
                            moveCaller.vanish = true;
                        }
                    } else if (moveCaller.vanish) {
                        acc -= _accelerated;
                        if (acc < 0) {
                            Img.alpha -= 0.015;
                            if (Img.alpha <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                    }
                    Img.scaleX = Img.scaleY += (_speed + acc);
                })
            }
        }

        /**粒子模块*/
        export module _Particle {
            export class _ParticleImgBase extends Laya.Image {
                /**
                 * 图片初始值设置
                 * Creates an instance of ImgBase.
                 * @param parent 父节点
                 * @param centerPoint 中心点
                 * @param sectionWH 以中心点为中心的矩形生成范围[w,h]
                 * @param distance 移动距离，区间[a,b]，随机移动一定的距离后消失;
                 * @param width 粒子的宽度区间[a,b]
                 * @param height 粒子的高度区间[a,b],如果为空，这高度和宽度一样
                 * @param rotation 角度区间[a,b]
                 * @param urlArr 图片地址集合，默认为框架中随机的样式
                 * @param colorRGBA 上色色值区间[[R,G,B,A],[R,G,B,A]]
                 * @param zOrder 层级，默认为1000
                 */
                constructor(parent: Laya.Sprite, centerPoint: Laya.Point, sectionWH: [number, number], width: [number, number], height: [number, number], rotation: [number, number], urlArr: Array<string>, colorRGBA: [[number, number, number, number], [number, number, number, number]], zOrder: number) {
                    super();
                    parent.addChild(this);
                    let sectionWidth = sectionWH ? Tools._Number.randomOneBySection(sectionWH[0]) : Tools._Number.randomOneBySection(200);
                    let sectionHeight = sectionWH ? Tools._Number.randomOneBySection(sectionWH[1]) : Tools._Number.randomOneBySection(50);
                    sectionWidth = Tools._Number.randomOneHalf() == 0 ? sectionWidth : -sectionWidth;
                    sectionHeight = Tools._Number.randomOneHalf() == 0 ? sectionHeight : -sectionHeight;
                    this.x = centerPoint ? centerPoint.x + sectionWidth : sectionWidth;
                    this.y = centerPoint ? centerPoint.y + sectionHeight : sectionHeight;
                    this.width = width ? Tools._Number.randomOneBySection(width[0], width[1]) : Tools._Number.randomOneBySection(20, 50);
                    this.height = height ? Tools._Number.randomOneBySection(height[0], height[1]) : this.width;
                    this.pivotX = this.width / 2;
                    this.pivotY = this.height / 2;
                    this.skin = urlArr ? Tools._Array.randomGetOne(urlArr) : _SkinUrl.圆形1;
                    this.rotation = rotation ? Tools._Number.randomOneBySection(rotation[0], rotation[1]) : 0;
                    this.alpha = 0;
                    this.zOrder = zOrder ? zOrder : 1000;
                    let RGBA = [];
                    RGBA[0] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : Tools._Number.randomOneBySection(180, 255);
                    RGBA[1] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : Tools._Number.randomOneBySection(10, 180);
                    RGBA[2] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : Tools._Number.randomOneBySection(10, 180);
                    RGBA[3] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : Tools._Number.randomOneBySection(1, 1);
                    Color._colour(this, RGBA);
                }
            }


            /**
             * 雪花,风雪
             * @param {Laya.Sprite} parent 父节点
             * @param {Laya.Point} [centerPoint] 父节点内坐标
             * @param sectionWH 以中心点为中心的矩形生成范围[w,h]
             * @param {Array<number>} [width] 宽区间[a,b]
             * @param {Array<number>} [height] 高区间[a,b]
             * @param {Array<number>} [rotation] 角度区间[a,b]
             * @param {Array<string>} [urlArr] 角度区间[a,b]
             * @param {Array<Array<number>>} [colorRGBA] 角度区间[a,b]
             * @param {number} [zOrder] 层级
             * @param {Array<number>} [distance] 下落距离区间[a,b]
             * @param {[number, number]} [rotationSpeed] 旋转区间[a,b]
             * @param {Array<number>} [speed] 速度区间[a,b]
             * @param {[number, number]} [windX] 风力（X轴偏移速度）区间[a,b]
             */
            export function _snow(parent: Laya.Sprite, centerPoint?: Laya.Point, sectionWH?: [number, number], width?: [number, number], height?: [number, number], rotation?: [number, number], urlArr?: Array<string>, colorRGBA?: [[number, number, number, number], [number, number, number, number]], zOrder?: number, distance?: [number, number], rotationSpeed?: [number, number], speed?: [number, number], windX?: [number, number]): Laya.Image {
                let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                let _rotationSpeed = rotationSpeed ? Tools._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : Tools._Number.randomOneBySection(0, 1);
                _rotationSpeed = Tools._Number.randomOneHalf() == 0 ? _rotationSpeed : -_rotationSpeed;
                let speed0 = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : Tools._Number.randomOneBySection(1, 2.5);
                let _windX = windX ? Tools._Number.randomOneBySection(windX[0], windX[1]) : 0;
                let moveCaller = {
                    alpha: true,
                    move: false,
                    vinish: false,
                };
                Img['moveCaller'] = moveCaller;
                let distance0 = 0;
                let distance1 = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(100, 300);
                TimerAdmin._frameLoop(1, moveCaller, () => {
                    Img.x += _windX;
                    Img.rotation += _rotationSpeed;
                    if (Img.alpha < 1 && moveCaller.alpha) {
                        Img.alpha += 0.05;
                        distance0 = Img.y++;
                        if (Img.alpha >= 1) {
                            moveCaller.alpha = false;
                            moveCaller.move = true;
                        }
                    }
                    if (distance0 < distance1 && moveCaller.move) {
                        distance0 = Img.y += speed0;
                        if (distance0 >= distance1) {
                            moveCaller.move = false;
                            moveCaller.vinish = true;
                        }
                    }
                    if (moveCaller.vinish) {
                        Img.alpha -= 0.03;
                        Img.y += speed0;
                        if (Img.alpha <= 0 || speed0 <= 0) {
                            Img.removeSelf();
                            Laya.timer.clearAll(moveCaller);
                        }
                    }
                })
                return Img;
            }

            /**
              * 旋转缓慢下落，类似落叶飘落，无X轴偏移
              * @param {Laya.Sprite} parent 父节点
              * @param {Laya.Point} [centerPoint] 父节点内坐标
              * @param {Array<number>} sectionWH 以中心点为中心的矩形生成范围[w,h]
              * @param {Array<number>} [width] 宽区间[a,b]
              * @param {Array<number>} [height] 高区间[a,b]
              * @param {Array<string>} [urlArr] 图片地址[a,b]
              * @param {Array<Array<number>>} [colorRGBA] 颜色区间[a,b]
              * @param {Array<number>} [distance] 下落距离区间[a,b],默认[100, 300]
              * @param {Array<number>} [moveSpeed] 速度区间[a,b],默认[1, 2.5]
              * @param {[number, number]} [scaleSpeed] 随机一个XY轴向旋转速度区间[a,b]，默认[0,0.25]；
              * @param {[number, number]} [skewSpeed] 随机一个XY斜方向旋转速度区间[a,b]，默认1~10；范围不小于1
              * @param {[number, number]} [rotationSpeed] 旋转区间[a,b]
              * @param {number} [zOrder] 层级
              */
            export function _fallingRotate(parent: Laya.Sprite, centerPoint?: Laya.Point, sectionWH?: [number, number], width?: [number, number], height?: [number, number], urlArr?: Array<string>, colorRGBA?: [[number, number, number, number], [number, number, number, number]], distance?: [number, number], moveSpeed?: [number, number], scaleSpeed?: [number, number], skewSpeed?: [number, number], rotationSpeed?: [number, number], zOrder?: number): Laya.Image {
                const Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, null, urlArr, colorRGBA, zOrder);
                let _rotationSpeed = rotationSpeed ? Tools._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : Tools._Number.randomOneBySection(0, 1);
                _rotationSpeed = Tools._Number.randomOneHalf() == 0 ? _rotationSpeed : -_rotationSpeed;

                const _moveSpeed = moveSpeed ? Tools._Number.randomOneBySection(moveSpeed[0], moveSpeed[1]) : Tools._Number.randomOneBySection(1, 2.5);

                const _scaleSpeed = scaleSpeed ? Tools._Number.randomOneBySection(scaleSpeed[0], scaleSpeed[1]) : Tools._Number.randomOneBySection(0, 0.25);
                const _scaleDir = Tools._Number.randomOneHalf();

                let _skewSpeed = skewSpeed ? Tools._Number.randomOneBySection(skewSpeed[0], skewSpeed[1]) : Tools._Number.randomOneBySection(1, 10);
                _skewSpeed = Tools._Number.randomOneHalf() === 1 ? _skewSpeed : -_skewSpeed;
                const _skewDir = Tools._Number.randomOneHalf();

                const _scaleOrSkew = Tools._Number.randomOneHalf();

                let _distance0 = 0;
                const _distance = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(100, 300);
                const moveCaller = {
                    appear: true,
                    move: false,
                    vinish: false,
                    scaleSub: true,
                    scaleAdd: false,
                };
                Img['moveCaller'] = moveCaller;
                TimerAdmin._frameLoop(1, moveCaller, () => {
                    Img.rotation += _rotationSpeed;
                    if (_scaleOrSkew === 1) {
                        if (_skewDir === 1) {
                            Img.skewX += _skewSpeed;
                        } else {
                            Img.skewY += _skewSpeed;
                        }
                    } else {
                        if (_scaleDir === 1) {
                            if (moveCaller.scaleSub) {
                                Img.scaleX -= _scaleSpeed;
                                if (Img.scaleX <= 0) {
                                    moveCaller.scaleSub = false;
                                }
                            } else {
                                Img.scaleX += _scaleSpeed;
                                if (Img.scaleX >= 1) {
                                    moveCaller.scaleSub = true;
                                }
                            }
                        } else {
                            if (moveCaller.scaleSub) {
                                Img.scaleY -= _scaleSpeed;
                                if (Img.scaleY <= 0) {
                                    moveCaller.scaleSub = false;
                                }
                            } else {
                                Img.scaleY += _scaleSpeed;
                                if (Img.scaleY >= 1) {
                                    moveCaller.scaleSub = true;
                                }
                            }
                        }
                    }

                    if (moveCaller.appear) {
                        Img.alpha += 0.05;
                        Img.y += _moveSpeed / 2;
                        if (Img.alpha >= 1) {
                            moveCaller.appear = false;
                            moveCaller.move = true;
                        }
                    }
                    if (moveCaller.move) {
                        Img.y += _moveSpeed;
                        _distance0 += _moveSpeed;
                        if (_distance0 >= _distance) {
                            moveCaller.move = false;
                            moveCaller.vinish = true;
                        }
                    }
                    if (moveCaller.vinish) {
                        Img.alpha -= 0.01;
                        Img.y += _moveSpeed;
                        if (Img.alpha <= 0) {
                            Img.removeSelf();
                            Laya.timer.clearAll(moveCaller);
                        }
                    }
                })
                return Img;
            }

            /**
              * 发射一个垂直向下的粒子，类似于火星下落熄灭，水滴下落，不是下雨状态
              * @param parent 父节点
              * @param centerPoint 中心点
              * @param sectionWH 以中心点为中心的矩形生成范围[w,h]
              * @param width 粒子的宽度区间[a,b]
              * @param height 粒子的高度区间[a,b],如果为空，这高度和宽度一样
              * @param rotation 角度旋转[a,b]
              * @param urlArr 图片地址集合，默认为框架中随机的样式
              * @param colorRGBA 上色色值区间[[R,G,B,A],[R,G,B,A]]
              * @param zOrder 层级，默认为0
              * @param distance 移动距离，区间[a,b]，在其中随机移动一定的距离后消失,默认[100,300]
              * @param speed 速度区间[a,b],默认[4,8]
              * @param accelerated 加速度区间[a,b],默认[0.25, 0.45];
              */
            export function _fallingVertical(parent: Laya.Sprite, centerPoint?: Laya.Point, sectionWH?: [number, number], width?: [number, number], height?: [number, number], rotation?: [number, number], urlArr?: Array<string>, colorRGBA?: [[number, number, number, number], [number, number, number, number]], zOrder?: number, distance?: [number, number], speed?: [number, number], accelerated?: [number, number]): Laya.Image {
                let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                let speed0 = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : Tools._Number.randomOneBySection(4, 8);
                let accelerated0 = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : Tools._Number.randomOneBySection(0.25, 0.45);
                let acc = 0;
                let moveCaller = {
                    alpha: true,
                    move: false,
                    vinish: false,
                };
                Img['moveCaller'] = moveCaller;
                let distance1 = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(100, 300);
                let fY = Img.y;
                TimerAdmin._frameLoop(1, moveCaller, () => {
                    if (Img.alpha < 1 && moveCaller.alpha) {
                        Img.alpha += 0.04;
                        if (Img.alpha >= 1) {
                            moveCaller.alpha = false;
                            moveCaller.move = true;
                        }
                    }
                    if (!moveCaller.alpha) {
                        acc += accelerated0;
                        Img.y += (speed0 + acc);
                    }
                    if (!moveCaller.alpha && moveCaller.move) {
                        if (Img.y - fY >= distance1) {
                            moveCaller.move = false;
                            moveCaller.vinish = true;
                        }
                    }
                    if (moveCaller.vinish) {
                        Img.alpha -= 0.03;
                        if (Img.alpha <= 0) {
                            Laya.timer.clearAll(moveCaller);
                            Img.removeSelf();
                        }
                    }
                })
                return Img;
            }
            /**
              * 发射一个垂直向上的粒子和 _fallingVertical相反
              * @param parent 父节点
              * @param centerPoint 中心点
              * @param sectionWH 以中心点为中心的矩形生成范围[w,h]
              * @param width 粒子的宽度区间[a,b]
              * @param height 粒子的高度区间[a,b],如果为空，这高度和宽度一样
              * @param rotation 角度旋转[a,b]
              * @param urlArr 图片地址集合，默认为框架中随机的样式
              * @param colorRGBA 上色色值区间[[R,G,B,A],[R,G,B,A]]
              * @param zOrder 层级，默认为0
              * @param distance 移动距离，区间[a,b]，在其中随机移动一定的距离后消失,默认[100,300]
              * @param speed 速度区间[a,b],默认[4,8]
              * @param accelerated 加速度区间[a,b],默认[0.25, 0.45];
              */
            export function _fallingVertical_Reverse(parent: Laya.Sprite, centerPoint?: Laya.Point, sectionWH?: [number, number], width?: [number, number], height?: [number, number], rotation?: [number, number], urlArr?: Array<string>, colorRGBA?: [[number, number, number, number], [number, number, number, number]], zOrder?: number, distance?: [number, number], speed?: [number, number], accelerated?: [number, number]): Laya.Image {
                let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                let speed0 = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : Tools._Number.randomOneBySection(4, 8);
                let accelerated0 = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : Tools._Number.randomOneBySection(0.25, 0.45);
                let acc = 0;
                let moveCaller = {
                    alpha: true,
                    move: false,
                    vinish: false,
                };
                Img['moveCaller'] = moveCaller;
                let distance1 = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(100, 300);
                let fY = Img.y;
                TimerAdmin._frameLoop(1, moveCaller, () => {
                    if (Img.alpha < 1 && moveCaller.alpha) {
                        Img.alpha += 0.04;
                        if (Img.alpha >= 1) {
                            moveCaller.alpha = false;
                            moveCaller.move = true;
                        }
                    }
                    if (!moveCaller.alpha) {
                        acc += accelerated0;
                        Img.y += (speed0 + acc);
                    }
                    if (!moveCaller.alpha && moveCaller.move) {
                        if (Img.y - fY <= distance1) {
                            moveCaller.move = false;
                            moveCaller.vinish = true;
                        }
                    }
                    if (moveCaller.vinish) {
                        Img.alpha -= 0.03;
                        if (Img.alpha <= 0) {
                            Laya.timer.clearAll(moveCaller);
                            Img.removeSelf();
                        }
                    }
                })
                return Img;
            }
            /**
             * 发射一个徐徐向上的粒子，类似于蒸汽上升，烟雾上升，光点上升，气球上升
             * @param parent 父节点
             * @param caller 执行域
             * @param centerPoint 中心点
             * @param sectionWH 以中心点为中心的矩形生成范围[w,h]
             * @param rotation 角度区间，默认为360
             * @param width 粒子的宽度区间[a,b]
             * @param height 粒子的高度区间[a,b],如果为空，这高度和宽度一样
             * @param urlArr 图片地址集合，默认为框架中随机的样式
             * @param colorRGBA 上色色值区间[[R,G,B,A],[R,G,B,A]]
             * @param speed  速度区间[a,b]
             * @param accelerated 加速度区间[a,b]
             * @param zOrder 层级，默认为0
             */
            export function _slowlyUp(parent: Laya.Sprite, centerPoint?: Laya.Point, sectionWH?: [number, number], width?: [number, number], height?: [number, number], rotation?: [number, number], urlArr?: Array<string>, colorRGBA?: [[number, number, number, number], [number, number, number, number]], zOrder?: number, distance?: [number, number], speed?: [number, number], accelerated?: [number, number]): Laya.Image {
                let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                let speed0 = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : Tools._Number.randomOneBySection(1.5, 2);
                let accelerated0 = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : Tools._Number.randomOneBySection(0.001, 0.005);
                let acc = 0;
                let moveCaller = {
                    alpha: true,
                    move: false,
                    vinish: false,
                };
                Img['moveCaller'] = moveCaller;
                let fy = Img.y;
                let distance0 = 0;
                let distance1 = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(-250, -600);
                TimerAdmin._frameLoop(1, moveCaller, () => {
                    if (Img.alpha < 1 && moveCaller.alpha) {
                        Img.alpha += 0.03;
                        if (Img.alpha >= 1) {
                            moveCaller.alpha = false;
                            moveCaller.move = true;
                        }
                    }
                    if (distance0 > distance1 && moveCaller.move) {

                    } else {
                        moveCaller.move = false;
                        moveCaller.vinish = true;
                    }
                    if (moveCaller.vinish) {
                        Img.alpha -= 0.02;
                        Img.scaleX -= 0.005;
                        Img.scaleY -= 0.005;
                        if (Img.alpha <= 0) {
                            Img.removeSelf();
                            Laya.timer.clearAll(moveCaller);
                        }
                    }
                    acc += accelerated0;
                    Img.y -= (speed0 + acc);
                    distance0 = fy - Img.y;
                })
                return Img;
            }


            /**
              * 从圆点出发，整个生命周期为速度和距离有关，速度越快，距离越长，如果是多个，四周，喷射，花型烟花爆炸
              * @param parent 父节点
              * @param centerPoint 发射点默认(0,0);
              * @param width 粒子的宽度区间[a,b]
              * @param height 粒子的高度区间[a,b],如果为空，这高度和宽度一样
              * @param rotation 初始角度默认[0,360]
              * @param moveAngle 移动方向角度区间，默认为[0，360]
              * @param urlArr 图片地址集合，默认为框架中随机的样式
              * @param colorRGBA 上色色值区间[[R,G,B,A],[R,G,B,A]]
              * @param distance 移动距离区间[a,b]，默认为[100, 200]
              * @param time 生命周期,时间[a,b]为帧数
              * @param rotationSpeed 旋转速度，默认为[0, 20]
              * @param zOrder 层级，默认为1000,在最上层
              */
            export function _sprayRound(parent: Laya.Sprite, centerPoint?: Laya.Point, width?: [number, number], height?: [number, number], rotation?: [number, number], urlArr?: Array<string>, colorRGBA?: [[number, number, number, number], [number, number, number, number]], distance?: [number, number], time?: [number, number], moveAngle?: [number, number], rotationSpeed?: [number, number], zOrder?: number): Laya.Image {
                let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);

                let radius = 0;

                const _time = time ? Tools._Number.randomOneBySection(time[0], time[1]) : Tools._Number.randomOneBySection(30, 50);

                const _distance = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(100, 200);

                const _speed = _distance / _time;

                const _angle = moveAngle ? Tools._Number.randomOneBySection(moveAngle[0], moveAngle[1]) : Tools._Number.randomOneBySection(0, 360);

                let rotationSpeed0 = rotationSpeed ? Tools._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : Tools._Number.randomOneBySection(0, 20);
                rotationSpeed0 = Tools._Number.randomOneHalf() == 0 ? rotationSpeed0 : -rotationSpeed0;

                const vinishTime = Tools._Number.randomOneInt(60);
                const subAlpha = 1 / vinishTime;

                let moveCaller = {
                    alpha: true,
                    move: false,
                    vinish: false,
                };
                Img['moveCaller'] = moveCaller;
                TimerAdmin._frameLoop(1, moveCaller, () => {
                    Img.rotation += rotationSpeed0;
                    if (Img.alpha < 1 && moveCaller.alpha) {
                        Img.alpha += 0.5;
                        if (Img.alpha >= 1) {
                            moveCaller.alpha = false;
                            moveCaller.move = true;
                        }
                    } else {
                        if (!moveCaller.vinish) {
                            radius += _speed;
                            let point = Tools._Point.getRoundPos(_angle, radius, centerPoint0);
                            Img.pos(point.x, point.y);
                            if (radius > _distance) {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                        } else {
                            Img.alpha -= subAlpha;
                            if (Img.alpha <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                            radius += _speed / 2;
                            let point = Tools._Point.getRoundPos(_angle, radius, centerPoint0);
                            Img.pos(point.x, point.y);
                        }
                    }
                })
                return Img;
            }


            /**
               * 单个，四周，喷射，旋转爆炸
               * @param parent 父节点
               * @param centerPoint 发射点默认(0,0);
               * @param width 粒子的宽度区间[a,b]
               * @param height 粒子的高度区间[a,b],如果为空，这高度和宽度一样
               * @param rotation 初始角度默认[0,360]
               * @param urlArr 图片地址集合，默认为框架中随机的样式
               * @param colorRGBA 上色色值区间[[R,G,B,A],[R,G,B,A]]
               * @param distance 移动距离区间[a,b]，默认为[100, 200]
               * @param moveAngle 移动方向角度区间，默认为[0，360]
               * @param rotationSpeed 旋转速度，默认为[0, 20]
               * @param speed  速度区间[a,b]，默认为[3, 10]
               * @param accelerated 加速度区间[a,b]，默认为[0.25, 0.45]
               * @param zOrder 层级，默认为1000,在最上层
               */
            export function _spray(parent: Laya.Sprite, centerPoint?: Laya.Point, width?: [number, number], height?: [number, number], rotation?: [number, number], urlArr?: Array<string>, colorRGBA?: [[number, number, number, number], [number, number, number, number]], distance?: [number, number], moveAngle?: [number, number], rotationSpeed?: [number, number], speed?: [number, number], accelerated?: [number, number], zOrder?: number): Laya.Image {
                let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
                let speed0 = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : Tools._Number.randomOneBySection(3, 10);
                let accelerated0 = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : Tools._Number.randomOneBySection(0.25, 0.45);
                let acc = 0;
                let moveCaller = {
                    alpha: true,
                    move: false,
                    vinish: false,
                };
                Img['moveCaller'] = moveCaller;
                let radius = 0;
                let distance1 = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(100, 200);
                let angle0 = moveAngle ? Tools._Number.randomOneBySection(moveAngle[0], moveAngle[1]) : Tools._Number.randomOneBySection(0, 360);
                let rotationSpeed0 = rotationSpeed ? Tools._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : Tools._Number.randomOneBySection(0, 20);
                rotationSpeed0 = Tools._Number.randomOneHalf() == 0 ? rotationSpeed0 : -rotationSpeed0;
                TimerAdmin._frameLoop(1, moveCaller, () => {
                    Img.rotation += rotationSpeed0;
                    if (Img.alpha < 1 && moveCaller.alpha) {
                        Img.alpha += 0.5;
                        if (Img.alpha >= 1) {
                            moveCaller.alpha = false;
                            moveCaller.move = true;
                        }
                    } else {
                        if (radius < distance1 && moveCaller.move) {

                        } else {
                            moveCaller.move = false;
                            moveCaller.vinish = true;
                        }
                        if (moveCaller.vinish) {
                            Img.alpha -= 0.05;
                            if (Img.alpha <= 0.3) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                        acc += accelerated0;
                        radius += speed0 + acc;
                        let point = Tools._Point.getRoundPos(angle0, radius, centerPoint0);
                        Img.pos(point.x, point.y);
                    }
                })
                return Img;
            }

            /**
               * 从一个盒子的周围发射不同方向的粒子
               * @param parent 父节点
               * @param centerPoint 中心点
               * @param sectionWH 以中心点为中心的矩形生成范围[w,h]
               * @param width 粒子的位置宽度范围区间[a,b]
               * @param height 粒子的高度区间[a,b],如果为空，这高度和宽度一样
               * @param rotation 角度区间[a,b]，默认为360
               * @param urlArr 图片地址集合，默认为框架中的样式
               * @param colorRGBA 上色色值区间[[R,G,B,A],[R,G,B,A]]
               * @param zOrder 层级，默认为0
               * @param curtailAngle 角度缩减0~90，填写90则是垂直于每个边
               * @param distance 移动距离区间[a,b]
               * @param rotateSpeed 旋转速度
               * @param speed  速度区间[a,b]
               * @param accelerated 加速度区间[a,b]
               */
            export function _outsideBox(parent: Laya.Sprite, centerPoint?: Laya.Point, sectionWH?: [number, number], width?: [number, number], height?: [number, number], rotation?: [number, number], urlArr?: Array<string>, colorRGBA?: [[number, number, number, number], [number, number, number, number]], zOrder?: number, curtailAngle?: number, distance?: [number, number], rotateSpeed?: [number, number], speed?: [number, number], accelerated?: [number, number]): Laya.Image {
                let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                let _angle: number = 0;
                sectionWH = sectionWH ? sectionWH : [100, 100];
                let fixedXY = Tools._Number.randomOneHalf() == 0 ? 'x' : 'y';
                curtailAngle = curtailAngle ? curtailAngle : 60;
                if (fixedXY == 'x') {
                    if (Tools._Number.randomOneHalf() == 0) {
                        Img.x += sectionWH[0];
                        _angle = Tools._Number.randomOneHalf() == 0 ? Tools._Number.randomOneBySection(0, 90 - curtailAngle) : Tools._Number.randomOneBySection(0, -90 + curtailAngle);

                    } else {
                        Img.x -= sectionWH[0];
                        _angle = Tools._Number.randomOneBySection(90 + curtailAngle, 270 - curtailAngle);
                    }
                    Img.y += Tools._Number.randomOneBySection(-sectionWH[1], sectionWH[1]);
                } else {
                    if (Tools._Number.randomOneHalf() == 0) {
                        Img.y -= sectionWH[1];
                        _angle = Tools._Number.randomOneBySection(180 + curtailAngle, 360 - curtailAngle);
                    } else {
                        Img.y += sectionWH[1];
                        _angle = Tools._Number.randomOneBySection(0 + curtailAngle, 180 - curtailAngle);
                    }
                    Img.x += Tools._Number.randomOneBySection(-sectionWH[0], sectionWH[0]);
                }
                let p = Tools._Point.angleByPoint(_angle);
                let _distance = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(20, 50);
                let speed0 = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : Tools._Number.randomOneBySection(0.5, 1);
                let accelerated0 = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : Tools._Number.randomOneBySection(0.25, 0.45);
                let acc = 0;
                let rotationSpeed0 = rotateSpeed ? Tools._Number.randomOneBySection(rotateSpeed[0], rotateSpeed[1]) : Tools._Number.randomOneBySection(0, 20);
                let firstP = new Laya.Point(Img.x, Img.y);
                let moveCaller = {
                    alpha: true,
                    move: false,
                    vinish: false,
                };
                Img['moveCaller'] = moveCaller;
                TimerAdmin._frameLoop(1, moveCaller, () => {
                    Img.rotation += rotationSpeed0;
                    if (moveCaller.alpha) {
                        Img.alpha += 0.5;
                        if (Img.alpha >= 1) {
                            moveCaller.alpha = false;
                            moveCaller.move = true;
                        }
                    } else if (moveCaller.move) {
                        if (firstP.distance(Img.x, Img.y) >= _distance) {
                            moveCaller.move = false;
                            moveCaller.vinish = true;
                        }
                    } else if (moveCaller.vinish) {
                        Img.alpha -= 0.05;
                        if (Img.alpha <= 0.3) {
                            Img.removeSelf();
                            Laya.timer.clearAll(moveCaller);
                        }
                    }
                    if (!moveCaller.alpha) {
                        acc += accelerated0;
                        Img.x += p.x * (speed0 + acc);
                        Img.y += p.y * (speed0 + acc);
                    }
                })
                return Img;
            }

            /**
             * 单个，移动到目标位置，停止，然后再次移动一点，然后消失
             * @param parent 父节点
             * @param caller 执行域
             * @param centerPoint 中心点
             * @param width 粒子的宽度区间[a,b]
             * @param height 粒子的高度区间[a,b],如果为空，这高度和宽度一样
             * @param rotation 旋转角度
             * @param angle 角度区间，默认为360
             * @param urlArr 图片地址集合，默认为框架中随机的样式
             * @param colorRGBA 上色色值区间[[R,G,B,A],[R,G,B,A]]
             * @param distance 移动距离区间[a,b]
             * @param rotationSpeed 旋转速度
             * @param speed  速度区间[a,b]
             * @param accelerated 加速度区间[a,b]
             * @param zOrder 层级，默认为0
             */
            export function _moveToTargetToMove(parent: Laya.Sprite, centerPoint?: Laya.Point, width?: [number, number], height?: [number, number], rotation?: [number, number], angle?: [number, number], urlArr?: Array<string>, colorRGBA?: [[number, number, number, number], [number, number, number, number]], zOrder?: number, distance1?: [number, number], distance2?: [number, number], rotationSpeed?: [number, number], speed?: [number, number], accelerated?: [number, number]): Laya.Image {
                let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
                let speed0 = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : Tools._Number.randomOneBySection(5, 6);
                let accelerated0 = accelerated ? Tools._Number.randomOneBySection(accelerated[0], accelerated[1]) : Tools._Number.randomOneBySection(0.25, 0.45);
                let acc = 0;
                let moveCaller = {
                    alpha: true,
                    move1: false,
                    stop: false,
                    move2: false,
                    vinish: false,
                };
                Img['moveCaller'] = moveCaller;
                let radius = 0;
                let dis1 = distance1 ? Tools._Number.randomOneBySection(distance1[0], distance1[1]) : Tools._Number.randomOneBySection(100, 200);
                let dis2 = distance2 ? Tools._Number.randomOneBySection(distance2[0], distance2[1]) : Tools._Number.randomOneBySection(100, 200);

                let angle0 = angle ? Tools._Number.randomOneBySection(angle[0], angle[1]) : Tools._Number.randomOneBySection(0, 360);
                Img.rotation = angle0 - 90;
                let rotationSpeed0 = rotationSpeed ? Tools._Number.randomOneBySection(rotationSpeed[0], rotationSpeed[1]) : Tools._Number.randomOneBySection(0, 20);
                TimerAdmin._frameLoop(1, moveCaller, () => {
                    if (moveCaller.alpha) {
                        acc += accelerated0;
                        radius += speed0 + acc;
                        Img.alpha += 0.5;
                        if (Img.alpha >= 1) {
                            moveCaller.alpha = false;
                            moveCaller.move1 = true;
                        }
                    } else if (moveCaller.move1) {
                        acc += accelerated0;
                        radius += speed0 + acc;
                        if (radius >= dis1) {
                            moveCaller.move1 = false;
                            moveCaller.stop = true;
                        }
                    } else if (moveCaller.stop) {
                        acc -= 0.3;
                        radius += 0.1;
                        if (acc <= 0) {
                            moveCaller.stop = false;
                            moveCaller.move2 = true;
                        }
                    } else if (moveCaller.move2) {
                        acc += accelerated0 / 2;
                        radius += speed0 + acc;
                        if (radius >= dis1 + dis2) {
                            moveCaller.move2 = false;
                            moveCaller.vinish = true;
                        }
                    } else if (moveCaller.vinish) {
                        radius += 0.5;
                        Img.alpha -= 0.05;
                        if (Img.alpha <= 0) {
                            Img.removeSelf();
                            Laya.timer.clearAll(moveCaller);
                        }
                    }
                    let point = Tools._Point.getRoundPos(angle0, radius, centerPoint0);
                    Img.pos(point.x, point.y);
                })
                return Img;
            }

            /**
             * 以同一个中心点，随机半径的圆形中，发射一个粒子，运动到中心点后消失
             * @param parent 父节点
             * @param caller 执行域
             * @param centerPoint 中心点
             * @param radius 半径区间[a,b]
             * @param rotation 角度区间，默认为360
             * @param width 粒子的宽度区间[a,b]
             * @param height 粒子的高度区间[a,b],如果为空，这高度和宽度一样
             * @param urlArr 图片地址集合，默认为框架中随机的样式
             * @param speed 吸入速度区间[a,b]
             * @param accelerated 加速度区间[a,b]
             * @param zOrder 层级，默认为0
             */
            export function _AnnularInhalation(parent, centerPoint: Laya.Point, radius: Array<number>, rotation?: Array<number>, width?: Array<number>, height?: Array<number>, urlArr?: Array<string>, speed?: Array<number>, accelerated?: number, zOrder?: number): Laya.Image {
                let Img = new Laya.Image();
                parent.addChild(Img);
                width = width ? width : [25, 50];
                Img.width = Tools._Number.randomCountBySection(width[0], width[1])[0];
                Img.height = height ? Tools._Number.randomCountBySection(height[0], height[1])[0] : Img.width;
                Img.pivotX = Img.width / 2;
                Img.pivotY = Img.height / 2;
                Img.skin = urlArr ? Tools._Array.randomGetOut(urlArr)[0] : _SkinUrl[Tools._Number.randomCountBySection(0, 12)[0]];
                let radius0 = Tools._Number.randomCountBySection(radius[0], radius[1])[0];
                Img.alpha = 0;
                let speed0 = speed ? Tools._Number.randomCountBySection(speed[0], speed[1])[0] : Tools._Number.randomCountBySection(5, 10)[0];
                let angle = rotation ? Tools._Number.randomCountBySection(rotation[0], rotation[1])[0] : Tools._Number.randomCountBySection(0, 360)[0];
                let caller = {};
                let acc = 0;
                accelerated = accelerated ? accelerated : 0.35;
                TimerAdmin._frameLoop(1, caller, () => {
                    if (Img.alpha < 1) {
                        Img.alpha += 0.05;
                        acc += (accelerated / 5);
                        radius0 -= (speed0 / 2 + acc);
                    } else {
                        acc += accelerated;
                        radius0 -= (speed0 + acc);
                    }
                    let point = Tools._Point.getRoundPos(angle, radius0, centerPoint);
                    Img.pos(point.x, point.y);
                    if (point.distance(centerPoint.x, centerPoint.y) <= 20 || point.distance(centerPoint.x, centerPoint.y) >= 1000) {
                        Img.removeSelf();
                        Laya.timer.clearAll(caller);
                    }
                })
                return Img;
            }
        }

        /**闪烁*/
        export module _Glitter {
            export class _GlitterImage extends Laya.Image {
                constructor(parent: Laya.Sprite, centerPos: Laya.Point, radiusXY: Array<number>, urlArr: Array<string>, colorRGBA: Array<Array<number>>, width: Array<number>, height: Array<number>, zOder: number) {
                    super();
                    if (!parent.parent) {
                        return;
                    }
                    parent.addChild(this);
                    this.skin = urlArr ? Tools._Array.randomGetOne(urlArr) : _SkinUrl.星星1;
                    this.width = width ? Tools._Number.randomOneBySection(width[0], width[1]) : 80;
                    this.height = height ? Tools._Number.randomOneBySection(height[0], height[1]) : this.width;
                    this.pivotX = this.width / 2;
                    this.pivotY = this.height / 2;
                    let p = radiusXY ? Tools._Point.randomPointByCenter(centerPos, radiusXY[0], radiusXY[1], 1) : Tools._Point.randomPointByCenter(centerPos, 100, 100, 1);
                    this.pos(p[0].x, p[0].y);
                    let RGBA = [];
                    RGBA[0] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : Tools._Number.randomOneBySection(10, 255);
                    RGBA[1] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : Tools._Number.randomOneBySection(200, 255);
                    RGBA[2] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : Tools._Number.randomOneBySection(10, 255);
                    RGBA[3] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : Tools._Number.randomOneBySection(1, 1);
                    Color._colour(this, RGBA);
                    this.alpha = 0;
                    this.zOrder = zOder ? zOder : 1000;
                }
            }


            /**
             * 在一个点内的随机范围内，创建一个星星，闪烁后消失
             * @param parent 父节点
             * @param centerPos 中心点
             * @param radiusXY X,Y轴半径，默认问100
             * @param urlArr 图片地址[]，默认为星星图片
             * @param colorRGBA 上色区间[[][]]
             * @param width [a,b];
             * @param height [a,b]如果为null则为width;
             * @param scale  放大到区间 [a,b]
             * @param speed  闪烁速度区间[a,b],默认[0.01,0.02]
             * @param rotateSpeed 旋转速率区间[a,b],默认为正负5度
             */
            export function _blinkStar(parent: Laya.Sprite, centerPos?: Laya.Point, radiusXY?: Array<number>, urlArr?: Array<string>, colorRGBA?: Array<Array<number>>, width?: Array<number>, height?: Array<number>, scale?: Array<number>, speed?: Array<number>, rotateSpeed?: Array<number>, zOder?: number): Laya.Image {
                let Img = new _GlitterImage(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, zOder);
                // 最大放大大小
                Img.scaleX = 0;
                Img.scaleY = 0;
                let _scale = scale ? Tools._Number.randomOneBySection(scale[0], scale[1]) : Tools._Number.randomOneBySection(0.8, 1.2);
                let _speed = speed ? Tools._Number.randomOneBySection(speed[0], speed[1]) : Tools._Number.randomOneBySection(0.01, 0.02);
                let _rotateSpeed = rotateSpeed ? Tools._Number.randomOneInt(rotateSpeed[0], rotateSpeed[1]) : Tools._Number.randomOneInt(0, 5);
                _rotateSpeed = Tools._Number.randomOneHalf() == 0 ? -_rotateSpeed : _rotateSpeed;
                let moveCaller = {
                    appear: true,
                    scale: false,
                    vanish: false,
                };
                Img['moveCaller'] = moveCaller;
                var ani = () => {
                    if (moveCaller.appear) {
                        Img.alpha += 0.1;
                        Img.rotation += _rotateSpeed;
                        Img.scaleX = Img.scaleY += _speed;
                        if (Img.alpha >= 1) {
                            moveCaller.appear = false;
                            moveCaller.scale = true;
                        }
                    } else if (moveCaller.scale) {
                        Img.rotation += _rotateSpeed;
                        Img.scaleX = Img.scaleY += _speed;
                        if (Img.scaleX > _scale) {
                            moveCaller.scale = false;
                            moveCaller.vanish = true;
                        }
                    } else if (moveCaller.vanish) {
                        Img.rotation -= _rotateSpeed;
                        Img.alpha -= 0.015;
                        Img.scaleX -= 0.01;
                        Img.scaleY -= 0.01;
                        if (Img.scaleX <= 0) {
                            Img.removeSelf();
                            Laya.timer.clearAll(moveCaller);
                        }
                    }
                }
                Laya.timer.frameLoop(1, moveCaller, ani);
                return Img;
            }

            /**
           * 渐隐渐出循环闪光
           * @param parent 父节点
           * @param x x位置
           * @param y y位置
           * @param width 宽
           * @param height 高
           * @param zOrder 层级
           * @param url 图片地址
           * @param speed 闪烁速度默认 0.01
           */
            export function _simpleInfinite(parent: Laya.Sprite, x: number, y: number, width: number, height: number, zOrder: number, url?: string, speed?: number): Laya.Image {
                let Img = new Laya.Image();
                parent.addChild(Img);
                Img.width = width;
                Img.height = height;
                // Img.pivotX = width / 2;
                // Img.pivotY = height / 2;
                Img.pos(x, y);
                Img.skin = url ? url : _SkinUrl.光圈1;
                Img.alpha = 0;
                Img.zOrder = zOrder ? zOrder : 0;
                let add = true;
                let caller = {};
                let func = () => {
                    if (!add) {
                        Img.alpha -= speed ? speed : 0.01;
                        if (Img.alpha <= 0) {
                            if (caller['end']) {
                                Laya.timer.clearAll(caller);
                                Img.removeSelf();
                            } else {
                                add = true;
                            }
                        }
                    } else {
                        Img.alpha += speed ? speed * 2 : 0.01 * 2;
                        if (Img.alpha >= 1) {
                            add = false;
                            caller['end'] = true;
                        }
                    }
                    // console.log(Img.alpha, Img.width, Img.height, Img.x, Img.y);
                }
                Laya.timer.frameLoop(1, caller, func);
                return Img;
            }
        }

        /**循环模块*/
        export module _circulation {
            /**循环模块图片基类*/
            export class _circulationImage extends Laya.Image {
                constructor(parent: Laya.Sprite, urlArr: Array<string>, colorRGBA: Array<Array<number>>, width: Array<number>, height: Array<number>, zOrder: number) {
                    super();
                    parent.addChild(this);
                    this.skin = urlArr ? Tools._Array.randomGetOne(urlArr) : _SkinUrl.圆形发光1;
                    this.width = width ? Tools._Number.randomOneBySection(width[0], width[1]) : 80;
                    this.height = height ? Tools._Number.randomOneBySection(height[0], height[1]) : this.width;
                    this.pivotX = this.width / 2;
                    this.pivotY = this.height / 2;
                    let RGBA = [];
                    RGBA[0] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : Tools._Number.randomOneBySection(0, 255);
                    RGBA[1] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : Tools._Number.randomOneBySection(0, 255);
                    RGBA[2] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : Tools._Number.randomOneBySection(0, 255);
                    RGBA[3] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : Tools._Number.randomOneBySection(0, 255);
                    Color._colour(this, RGBA);
                    this.zOrder = zOrder ? zOrder : 0;
                    this.alpha = 0;
                    this.scaleX = 0;
                    this.scaleY = 0;
                }
            }

            /**
             * 多点循环，在一组点中，以第一个点为起点，最后一个点为终点无限循环
             * @param {Laya.Sprite} parent 父节点
             * @param {Array<Array<number>>} [posArray] 坐标点集合[[x,y]]
             * @param parallel 粒子是平行于当前的移动路径
             * @param {Array<string>} [urlArr] 皮肤结合
             * @param {Array<Array<number>>} [colorRGBA] 颜色区间[[ ][ ]]               
             * @param {Array<number>} [width] 宽度区间[a,b]
             * @param {Array<number>} [height] 高度区间[a,b]
             * @param {number} [zOrder] 层级
             * @param {number} [speed] 速度
             */
            export function _corner(parent: Laya.Sprite, posArray: Array<Array<number>>, urlArr?: Array<string>, colorRGBA?: Array<Array<number>>, width?: Array<number>, height?: Array<number>, zOrder?: number, parallel?: boolean, speed?: number): Laya.Image {
                if (posArray.length <= 1) {
                    return;
                }
                let Img = new _circulationImage(parent, urlArr, colorRGBA, width, height, zOrder);
                let Imgfootprint = new _circulationImage(parent, urlArr, colorRGBA, width, height, zOrder);
                Imgfootprint.filters = Img.filters;
                Img.pos(posArray[0][0], posArray[0][1]);
                Img.alpha = 1;
                let moveCaller = {
                    num: 0,
                    alpha: true,
                    move: false,
                };
                Img['moveCaller'] = moveCaller;
                let _speed = speed ? speed : 3;
                let index = 0;
                Img.scale(1, 1);

                TimerAdmin._frameLoop(1, moveCaller, () => {
                    let Imgfootprint = new _circulationImage(parent, urlArr, colorRGBA, width, height, zOrder);
                    Imgfootprint.filters = Img.filters;
                    Imgfootprint.x = Img.x;
                    Imgfootprint.y = Img.y;
                    Imgfootprint.rotation = Img.rotation;
                    Imgfootprint.alpha = 1;
                    Imgfootprint.zOrder = -1;
                    Imgfootprint.scaleX = Img.scaleX;
                    Imgfootprint.scaleY = Img.scaleY;
                    Animation2D.fadeOut(Imgfootprint, 1, 0, 200, 0, () => {
                        Imgfootprint.removeSelf();
                    });
                    if (Img.parent == null) {
                        Laya.timer.clearAll(moveCaller);
                    }
                    moveCaller.num++;
                    if (urlArr) {
                        if (moveCaller.num > urlArr.length) {
                            moveCaller.num = 0;
                        } else {
                            Img.skin = urlArr[moveCaller.num];
                        }
                    }
                })
                var func = () => {
                    let targetXY = [posArray[index][0], posArray[index][1]];
                    let distance = (new Laya.Point(Img.x, Img.y)).distance(targetXY[0], targetXY[1]);
                    if (parallel) {
                        Img.rotation = Tools._Point.pointByAngle(Img.x - targetXY[0], Img.y - targetXY[1]) + 180;
                    }
                    let time = speed * 100 + distance / 5;
                    if (index == posArray.length + 1) {
                        targetXY = [posArray[0][0], posArray[0][1]];
                    }
                    Animation2D.move(Img, targetXY[0], targetXY[1], time, () => {
                        index++;
                        if (index == posArray.length) {
                            index = 0;
                        }
                        func();
                    });
                }
                func();
                return Img;
            }
        }
    }

    /**点击事件模块 */
    export module Click {
        export let _switch: boolean = true;
        /**按钮音效*/
        export let _audioUrl: string;
        /**
         * 动态创建一个按钮
         */
        export function _createButton(): void {
            let Btn = new Laya.Sprite();
            let img = new Laya.Image();
            let label = new Laya.Label();
        }
        /**点击效果类型*/
        export let _Type = {
            /**无效果*/
            no: 'no',
            /**点击放大*/
            largen: 'largen',
            /**点击缩小*/
            reduce: 'reduce',
        }
        export let _Use = {
            get value(): string {
                return this['Click_name'] ? this['Click_name'] : null;
            },
            set value(val: string) {
                this['Click_name'] = val;
            }
        }
        /**b
         * 点击事件注册,可以用(e)=>{}简写传递的函数参数
         * @param effect 效果类型 1.'largen'
         * @param target 节点
         * @param caller 执行域
         * @param down 按下函数
         * @param move 移动函数
         * @param up 抬起函数
         * @param out 出屏幕函数
         */
        export function _on(effect: string, target: Laya.Node, caller: any, down?: Function, move?: Function, up?: Function, out?: Function): void {
            let btnEffect: any;
            switch (effect) {
                case _Type.no:
                    btnEffect = new _NoEffect();
                    break;
                case _Type.largen:
                    btnEffect = new _Largen();
                    break;
                case _Type.reduce:
                    btnEffect = new _Reduce();
                    break;
                default:
                    btnEffect = new _NoEffect();
                    break;
            }
            target.on(Laya.Event.MOUSE_DOWN, caller, down);
            target.on(Laya.Event.MOUSE_MOVE, caller, move);
            target.on(Laya.Event.MOUSE_UP, caller, up);
            target.on(Laya.Event.MOUSE_OUT, caller, out);
            target.on(Laya.Event.MOUSE_DOWN, caller, btnEffect.down);
            target.on(Laya.Event.MOUSE_MOVE, caller, btnEffect.move);
            target.on(Laya.Event.MOUSE_UP, caller, btnEffect.up);
            target.on(Laya.Event.MOUSE_OUT, caller, btnEffect.out);
        }

        /**
         * 点击事件的关闭
        * @param effect 效果类型 1.'largen'
         * @param target 节点
         * @param caller 指向脚本（this）引用
         * @param down 按下函数
         * @param move 移动函数
         * @param up 抬起函数
         * @param out 出屏幕函数
         */
        export function _off(effect: string, target: any, caller: any, down?: Function, move?: Function, up?: Function, out?: Function): void {
            let btnEffect: any;
            switch (effect) {
                case _Type.no:
                    btnEffect = new _NoEffect();
                    break;
                case _Type.largen:
                    btnEffect = new _Largen();
                    break;
                case _Type.reduce:
                    btnEffect = new _Largen();
                    break;
                default:
                    btnEffect = new _NoEffect();
                    break;
            }

            target._off(Laya.Event.MOUSE_DOWN, caller, down);
            target._off(Laya.Event.MOUSE_MOVE, caller, move);
            target._off(Laya.Event.MOUSE_UP, caller, up);
            target._off(Laya.Event.MOUSE_OUT, caller, out);

            target._off(Laya.Event.MOUSE_DOWN, caller, btnEffect.down);
            target._off(Laya.Event.MOUSE_MOVE, caller, btnEffect.move);
            target._off(Laya.Event.MOUSE_UP, caller, btnEffect.up);
            target._off(Laya.Event.MOUSE_OUT, caller, btnEffect.out);
        }
        /**
         * 没有效果的点击事件，有时候用于防止界面的事件穿透
         */
        export class _NoEffect {
            down(): void { }
            move(): void { }
            up(): void { }
            out(): void { }
        }
        /**
         * 点击放大的按钮点击效果,每个类是一种效果，和点击的声音一一对应
         */
        export class _Largen {
            down(event: Laya.Event): void {
                event.currentTarget.scale(1.1, 1.1);
                AudioAdmin._playSound(Click._audioUrl);
            }
            move(): void { }
            up(event: Laya.Event): void {
                event.currentTarget.scale(1, 1);
            }
            out(event: Laya.Event): void {
                event.currentTarget.scale(1, 1);
            }
        }

        /**
        * 点击放大的按钮点击效果,每个类是一种效果，和点击的声音一一对应
        */
        export class _Reduce {

            down(event: Laya.Event): void {
                event.currentTarget.scale(0.9, 0.9);
                AudioAdmin._playSound(Click._audioUrl);

            }
            move(): void { }
            up(event: Laya.Event): void {
                event.currentTarget.scale(1, 1);
            }
            out(event: Laya.Event): void {
                event.currentTarget.scale(1, 1);
            }
        }
    }

    export module Animation3D {
        /**缓动集合，用于清除当前this上的所有缓动*/
        export let tweenMap: any = {};
        /**帧率*/
        export let frameRate: number = 1;
        /**
          * 移动物体
          * @param target 目标物体
          * @param toPos 要去的目的地坐标
          * @param duration 间隔
          * @param caller 回调执行领域
          * @param ease 缓动函数
          * @param complete 播放完成回调 
          * @param delay 延迟
          * @param coverBefore 是否覆盖上一个缓动
          * @param update 更新函数
          * @param frame 帧数间隔
          */
        export function moveTo(target: Laya.Sprite3D, toPos: Laya.Vector3, duration: number, caller: any
            , ease?: Function, complete?: Function, delay: number = 0, coverBefore: boolean = true, update?: Function, frame?: number) {
            let position: Laya.Vector3 = target.transform.position.clone();
            // target["position"] = target.transform.position;
            if (duration == 0 || duration === undefined || duration === null) {
                target.transform.position = toPos.clone();
                complete && complete.apply(caller);
                return;
            }
            if (frame <= 0 || frame === undefined || frame === null) {
                frame = frameRate;
            }
            let updateRenderPos = function () {
                if (target.transform) {
                    target.transform.position = position;
                }
                update && update();
            };
            Laya.timer.once(delay, target, function () {
                Laya.timer.frameLoop(frame, target, updateRenderPos);
            });

            let endTween = function () {
                if (target.transform) {
                    target.transform.position = toPos.clone();
                    Laya.timer.clear(target, updateRenderPos);
                }
                complete && complete.apply(caller);
            }

            let tween = Laya.Tween.to(position, { x: toPos.x, y: toPos.y, z: toPos.z }, duration, ease, Laya.Handler.create(target, endTween), delay, coverBefore);
            if (!tweenMap[target.id]) {
                tweenMap[target.id] = [];
            }
            tweenMap[target.id].push(tween);
        }

        /**
          * 旋转物体
          * @param target 目标物体
          * @param toPos 要去的目的地
          * @param duration 间隔
          * @param caller 回调执行领域
          * @param ease 缓动函数
          * @param complete 播放完成回调 
          * @param delay 延迟
          * @param coverBefore 是否覆盖上一个缓动
          * @param update 更新函数
          * @param frame 帧数间隔
          */
        export function rotateTo(target: Laya.Sprite3D, toRotation: Laya.Vector3, duration: number, caller: any
            , ease?: Function, complete?: Function, delay?: number, coverBefore?: boolean, update?: Function, frame?: number) {
            let rotation: Laya.Vector3 = target.transform.localRotationEuler.clone();
            if (duration == 0 || duration === undefined || duration === null) {
                target.transform.localRotationEuler = toRotation.clone();
                complete && complete.apply(caller);
                return;
            }
            if (frame <= 0 || frame === undefined || frame === null) {
                frame = frameRate;
            }
            let updateRenderRotation = function () {
                if (target.transform) {
                    target.transform.localRotationEuler = rotation;
                }
                update && update();
            };
            Laya.timer.once(delay, target, function () {
                Laya.timer.frameLoop(frame, target, updateRenderRotation);
            });

            let endTween = function () {
                if (target.transform) {
                    target.transform.localRotationEuler = toRotation.clone();
                    Laya.timer.clear(target, updateRenderRotation);
                }
                complete && complete.apply(caller);
            }

            let tween = Laya.Tween.to(rotation, { x: toRotation.x, y: toRotation.y, z: toRotation.z }, duration, ease, Laya.Handler.create(target, endTween), delay, coverBefore);
            if (!tweenMap[target.id]) {
                tweenMap[target.id] = [];
            }
            tweenMap[target.id].push(tween)
        }

        /**
        * 缩放物体
        * @param target 目标物体
        * @param toPos 要去的目的地
        * @param duration 间隔
        * @param caller 回调执行领域
        * @param ease 缓动函数
        * @param complete 播放完成回调 
        * @param delay 延迟
        * @param coverBefore 是否覆盖上一个缓动
        * @param update 更新函数
        * @param frame 帧数间隔
        */
        export function scaleTo(target: Laya.Sprite3D, toScale: Laya.Vector3, duration: number, caller: any
            , ease?: Function, complete?: Function, delay?: number, coverBefore?: boolean, update?: Function, frame?: number) {
            let localScale = target.transform.localScale.clone();
            if (duration == 0 || duration === undefined || duration === null) {
                target.transform.localScale = toScale.clone();
                complete && complete.apply(caller);
                return;
            }
            if (frame <= 0 || frame === undefined || frame === null) {
                frame = frameRate;
            }
            let updateRenderPos = function () {
                target.transform.localScale = localScale.clone();
                update && update();
            };
            Laya.timer.once(delay, this, function () {
                Laya.timer.frameLoop(frame, target, updateRenderPos);
            });
            let endTween = function () {
                target.transform.localScale = toScale.clone();
                Laya.timer.clear(target, updateRenderPos);
                complete && complete.apply(caller);
            }
            let tween = Laya.Tween.to(localScale, { x: toScale.x, y: toScale.y, z: toScale.z }, duration, ease, Laya.Handler.create(target, endTween), delay, coverBefore);
            if (!tweenMap[target.id]) {
                tweenMap[target.id] = [];
            }
            tweenMap[target.id].push(tween);
        }
        /**
         * 清除3d物体上的所有缓动动画
         * @param target 
         */
        export function ClearTween(target: Laya.Sprite3D) {
            let tweens = tweenMap[target.id] as Array<Laya.Tween>;
            if (tweens && tweens.length) {
                while (tweens.length > 0) {
                    let tween = tweens.pop();
                    tween.clear();
                }
            }
            Laya.timer.clearAll(target);
        }

        /**
         * 摇头动画，左右各摇摆一次，然后回到原来位置
         * @param target 目标
         * @param range 幅度
         * @param duration 时间
         * @param caller 回调执行域
         * @param func 回调函数
         * @param delayed 延时 
         * @param ease 缓动效果
         */
        export function rock(target: Laya.MeshSprite3D, range: Laya.Vector3, duration: number, caller: any, func?: Function, delayed?: number, ease?: Function): void {
            if (!delayed) {
                delayed = 0;
            }
            let v1: Laya.Vector3 = new Laya.Vector3(target.transform.localRotationEulerX + range.x, target.transform.localRotationEulerY + range.y, target.transform.localRotationEulerZ + range.z);

            rotateTo(target, v1, duration / 2, caller, ease, () => {

                let v2: Laya.Vector3 = new Laya.Vector3(target.transform.localRotationEulerX - range.x * 2, target.transform.localRotationEulerY - range.y * 2, target.transform.localRotationEulerZ - range.z * 2);

                rotateTo(target, v2, duration, caller, ease, () => {

                    let v3: Laya.Vector3 = new Laya.Vector3(target.transform.localRotationEulerX + range.x, target.transform.localRotationEulerY + range.y, target.transform.localRotationEulerZ + range.z);

                    rotateTo(target, v3, duration / 2, caller, ease, () => {
                        if (func) {
                            func();
                        }
                    });
                });
            }, delayed);
        }

        /**
           * 旋转并移动物体到另一个物体的角度和位置
           * @param Sp3d 要移动的物体
           * @param Target 目标物体
           * @param duration 间隔
           * @param caller 执行域
           * @param ease 缓动函数
           * @param complete 播放完成回调 
           * @param delay 延迟
           * @param clickLock 场景按钮此时是否可以继续点击
           * @param coverBefore 是否覆盖上一个缓动
           * @param update 更新函数
           * @param frame 帧数间隔
           */
        export function moveRotateTo(Sp3d: Laya.MeshSprite3D, Target: Laya.MeshSprite3D, duration: number, caller: any
            , ease?: Function, complete?: Function, delay?: number, coverBefore?: boolean, update?: Function, frame?: number): void {
            moveTo(Sp3d, Target.transform.position, duration, caller, ease, null, delay, coverBefore, update, frame)
            rotateTo(Sp3d, Target.transform.localRotationEuler, duration, caller, ease, complete, delay, coverBefore, null, frame);
        }
    }

    /**动画模块*/
    export module Animation2D {
        /**
        * @export 清理对象上的所有Tween动画
        * @param {Array<any>} arr 清理的数组
        */
        export function _clearAll(arr: Array<any>): void {
            for (let index = 0; index < arr.length; index++) {
                Laya.Tween.clearAll(arr[index]);
            }
        }
        /**
         * @export 类似于呼吸
         * @param {(Laya.Sprite | Laya.Image)} node
         * @param {number} range 幅度0.1~1 
         * @param {number} time 时间
         * @param {number} [delayed] 延时
         * @param {Function} [func] 回调
         */
        export function circulation_scale(node: Laya.Sprite | Laya.Image, range: number, time: number, delayed?: number, func?: Function): void {
            Laya.Tween.to(node, { scaleX: 1 + range, scaleY: 1 + range }, time, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { scaleX: 1 - range, scaleY: 1 - range }, time / 2, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 1, scaleY: 1 }, time / 2, null, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                    }), 0);
                }), 0);
            }), delayed ? delayed : 0);
        }

        /**
         * 左右抖动
         * @param node 节点
         * @param range 幅度
         * @param time 花费时间
         * @param delayed 延时
         * @param func 回调函数
         * @param click 是否设置场景此时可点击,默认可以点击，为true
         */
        export function leftRight_Shake(node, range, time, delayed?: number, func?: Function, click?: boolean): void {
            if (!delayed) {
                delayed = 0;
            }
            if (!click) {
                Click._switch = false
            }
            Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                // AudioAdmin._playSound(Enum.AudioName.commonShake, 1);
                Laya.Tween.to(node, { x: node.x + range * 2 }, time, null, Laya.Handler.create(this, function () {
                    // AudioAdmin._playSound(Enum.AudioName.commonShake, 1);
                    Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                        if (!click) {
                            Click._switch = true
                        }
                    }))
                }))
            }), delayed);
        }

        /**
          * 按中心点旋转动画
          * @param node 节点
          * @param Frotate 初始角度
          * @param Erotate 最终角度
          * @param time 花费时间
          * @param delayed 延时时间
          * @param func 回调函数
        */
        export function rotate(node, Erotate: number, time: number, delayed?: number, func?: Function): void {
            Laya.Tween.to(node, { rotation: Erotate }, time, null, Laya.Handler.create(node, function () {
                if (func) {
                    func();
                }
            }), delayed ? delayed : 0);
        }

        /**
         * 上下翻转动画
         * @param node 节点
         * @param time 花费时间
         */
        export function upDown_Overturn(node, time, func?: Function): void {
            Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                            if (func !== null || func !== undefined) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }), 0);
        }

        /**
         * 上下旋转动画
         * @param node 节点
         * @param time 花费时间
         * @param func 回调函数
         */
        export function leftRight_Overturn(node, time, func): void {
            Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                        }), 0);
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), 0);
            }), 0);
        }

        /**
      * 上下抖动
      * @param node 节点
      * @param range 幅度
      * @param time 花费时间
      * @param delayed 延迟时间
      * @param func 回调函数
      */
        export function upDwon_Shake(node, range, time, delayed, func): void {
            Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { y: node.y - range * 2 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }))
                }))
            }), delayed)
        }

        /**
         * 渐隐渐出
         * @param node 节点
         * @param alpha1 最初的透明度
         * @param alpha2 渐隐到的透明度
         * @param time 花费时间
         * @param delayed 延时
         * @param func 回调函数
         * @param  stageLock 场景锁
         */
        export function fadeOut(node: Laya.Sprite, alpha1: number, alpha2: number, time: number, delayed?: number, func?: Function, stageClick?: boolean): void {
            node.alpha = alpha1;
            if (stageClick) {
                Click._switch = false
            }
            Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                if (func) {
                    func();
                }
                if (stageClick) {
                    Click._switch = true
                }
            }), delayed ? delayed : 0)
        }

        /**
         * 渐出
         * @param node 节点
         * @param alpha1 最初的透明度
         * @param alpha2 渐隐到的透明度
         * @param time 花费时间
         * @param delayed 延时
         * @param func 回调函数
         */
        export function fadeOut_KickBack(node, alpha1, alpha2, time, delayed, func): void {
            node.alpha = alpha1;
            Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed)
        }

        /**
        * 渐出+移动，起始位置都是0，最终位置都是1
        * @param node 节点
        * @param firstX 初始x位置
        * @param firstY 初始y位置
        * @param targetX x轴移动位置
        * @param targetY y轴移动位置
        * @param time 花费时间
        * @param delayed 延时
        * @param func 回调函数
        */
        export function move_FadeOut(node, firstX, firstY, targetX, targetY, time, delayed, func): void {
            node.alpha = 0;
            node.x = firstX;
            node.y = firstY;
            Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed)
        }

        /**
         * 渐隐+移动，起始位置都是1，最终位置都是0
         * @param node 节点
         * @param firstX 初始x位置
         * @param firstY 初始y位置
         * @param targetX x轴目标位置
         * @param targetY y轴目标位置
         * @param time 花费时间
         * @param delayed 延时
         * @param func 回调函数
        */
        export function move_Fade_Out(node, firstX, firstY, targetX, targetY, time, delayed, func): void {
            node.alpha = 1;
            node.x = firstX;
            node.y = firstY;
            Laya.Tween.to(node, { alpha: 0, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed)
        }

        /**
        * 渐出+移动+缩放，起始位置都是0，最终位置都是1
        * @param node 节点
        * @param firstX 初始x位置
        * @param firstY 初始y位置
        * @param targetX x轴移动位置
        * @param targetY y轴移动位置
        * @param time 花费时间
        * @param delayed 延时
        * @param func 回调函数
        */
        export function move_FadeOut_Scale_01(node, firstX, firstY, targetX, targetY, time, delayed, func): void {
            node.alpha = 0;
            node.targetX = 0;
            node.targetY = 0;
            node.x = firstX;
            node.y = firstY;
            Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY, scaleX: 1, scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed)
        }

        /**
         * 移动+缩放,等比缩放
         * @param node 节点
         * @param fScale 初始大小
         * @param fX 初始x位置
         * @param fY 初始y位置
         * @param tX x轴目标位置
         * @param tY y轴目标位置
         * @param eScale 最终大小
         * @param time 花费时间
         * @param delayed 延时
         * @param ease 效果函数
         * @param func 回调函数
         */
        export function move_Scale(node, fScale, fX, fY, tX, tY, eScale, time, delayed?: number, ease?: Function, func?: Function): void {
            node.scaleX = fScale;
            node.scaleY = fScale;
            node.x = fX;
            node.y = fY;
            Laya.Tween.to(node, { x: tX, y: tY, scaleX: eScale, scaleY: eScale }, time, ease ? null : ease, Laya.Handler.create(this, function () {
                if (func) {
                    func();
                }
            }), delayed ? delayed : 0);
        }

        /**
         * @export 移动和旋转
         * @param {Laya.Sprite} Node 节点
         * @param {number} tRotate 最终角度
         * @param {number} tPoint 目标位置
         * @param {number} time 花费时间
         * @param {number} [delayed] 延时时间
         * @param {Function} [func] 回调函数
         */
        export function move_rotate(Node: Laya.Sprite, tRotate: number, tPoint: Laya.Point, time: number, delayed?: number, func?: Function): void {
            Laya.Tween.to(Node, { rotation: tRotate, x: tPoint.x, y: tPoint.y }, time, null, Laya.Handler.create(Node, () => {
                if (func) {
                    func();
                }
            }), delayed ? delayed : 0);
        }
        /**
         *旋转+放大缩小 
         * @param target 目标节点
         * @param fRotate 初始角度
         * @param fScaleX 初始X缩放
         * @param fScaleY 初始Y缩放
         * @param eRotate 最终角度
         * @param eScaleX 最终X缩放
         * @param eScaleY 最终Y缩放
         * @param time 花费时间
         * @param delayed 延迟时间
         * @param func 回调函数
         */
        export function rotate_Scale(target: Laya.Sprite, fRotate, fScaleX, fScaleY, eRotate, eScaleX, eScaleY, time, delayed?: number, func?: Function): void {
            target.scaleX = fScaleX;
            target.scaleY = fScaleY;
            target.rotation = fRotate;
            Laya.Tween.to(target, { rotation: eRotate, scaleX: eScaleX, scaleY: eScaleY }, time, null, Laya.Handler.create(this, () => {
                if (func) {
                    func();
                }
                target.rotation = 0;
            }), delayed ? delayed : 0)
        }

        /**
         * 简单下落
         * @param node 节点
         * @param fY 初始Y位置
         * @param tY 目标Y位置
         * @param rotation 落地角度
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 回调函数
         */
        export function drop_Simple(node, fY, tY, rotation, time, delayed, func): void {
            node.y = fY;
            Laya.Tween.to(node, { y: tY, rotation: rotation }, time, Laya.Ease.circOut, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed);
        }

        /**
          * 下落回弹动画 ，类似于连丝蜘蛛下落，下落=》低于目标位置=》回到目标位置
          * @param target 目标
          * @param fAlpha 初始透明度
          * @param firstY 初始位置
          * @param targetY 目标位置
          * @param extendY 延伸长度
          * @param time1 花费时间
          * @param delayed 延时时间
          * @param func 结束回调函数
          * */
        export function drop_KickBack(target, fAlpha, firstY, targetY, extendY, time1, delayed?: number, func?: Function): void {

            target.alpha = fAlpha;
            target.y = firstY;

            if (!delayed) {
                delayed = 0;
            }
            Laya.Tween.to(target, { alpha: 1, y: targetY + extendY }, time1, null, Laya.Handler.create(this, function () {

                Laya.Tween.to(target, { y: targetY - extendY / 2 }, time1 / 2, null, Laya.Handler.create(this, function () {

                    Laya.Tween.to(target, { y: targetY }, time1 / 4, null, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                    }), 0);
                }), 0);
            }), delayed);
        }

        /**
         * 偏移下落,模仿抛物线
         * @param node 节点
         * @param targetY y目标位置
         * @param targetX x偏移量
         * @param rotation 落地角度
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 回调函数
         */
        export function drop_Excursion(node, targetY, targetX, rotation, time, delayed, func): void {
            // 第一阶段
            Laya.Tween.to(node, { x: node.x + targetX, y: node.y + targetY * 1 / 6 }, time, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { x: node.x + targetX + 50, y: targetY, rotation: rotation }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), 0);
            }), delayed);
        }

        /**
         * 上升
         * @param node 节点
         * @param initialY 初始y位置
         * @param initialR 初始角度
         * @param targetY 目标y位置
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 回调函数
         */
        export function goUp_Simple(node, initialY, initialR, targetY, time, delayed, func): void {
            node.y = initialY;
            node.rotation = initialR;
            Laya.Tween.to(node, { y: targetY, rotation: 0 }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                if (func !== null) {
                    func();
                }
            }), delayed);
        }

        /**
         * 用于卡牌X轴方向的横向旋转
         * 两个面不一样的卡牌旋转动画，卡��正面有内容，卡牌背面没有内容，这个内容是一个子节点
         * @param node 节点
         * @param time 每次旋转1/2次花费时间
         * @param func1 中间回调，是否需要变化卡牌内容,也就是子节点内容
         * @param delayed 延时时间
         * @param func2 结束时回调函数
         */
        export function cardRotateX_TowFace(node: Laya.Sprite, time: number, func1?: Function, delayed?: number, func2?: Function): void {
            Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                // 所有子节点消失
                Tools._Node.childrenVisible2D(node, false);
                if (func1) {
                    func1();
                }
                Laya.Tween.to(node, { scaleX: 1 }, time * 0.9, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 0 }, time * 0.8, null, Laya.Handler.create(this, function () {

                        Tools._Node.childrenVisible2D(node, true);

                        Laya.Tween.to(node, { scaleX: 1 }, time * 0.7, null, Laya.Handler.create(this, function () {
                            if (func2) {
                                func2();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }), delayed);
        }

        /**
        * 用于卡牌X轴方向的横向旋转
        * 两个面一样的卡牌旋转动画，正反面内容是一样的
        * @param node 节点
        * @param func1 中间回调，是否需要变化卡牌内容,也就是子节点内容
        * @param time 每次旋转1/2次花费时间
        * @param delayed 延时时间
        * @param func2 结束时回调函数
        */
        export function cardRotateX_OneFace(node: Laya.Sprite, func1: Function, time: number, delayed: number, func2: Function): void {
            Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                if (func1 !== null) {
                    func1();
                }
                Laya.Tween.to(node, { scaleX: 1 }, time, null, Laya.Handler.create(this, function () {
                    if (func2 !== null) {
                        func2();
                    }
                }), 0);
            }), delayed);
        }

        /**
        * 用于卡牌Y轴方向的纵向旋转
        * 两个面不一样的卡牌旋转动画，卡牌正面有内容，卡牌背面没有内容，这个内容是一个子节点
        * @param node 节点
        * @param time 每次旋转1/2次花费时间
        * @param func1 中间回调，是否需要变化卡牌内容,也就是子节点内容
        * @param delayed 延时时间
        * @param func2 结束时回调函数
        */
        export function cardRotateY_TowFace(node: Laya.Sprite, time: number, func1?: Function, delayed?: number, func2?: Function): void {
            Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                // 所有子节点消失
                Tools._Node.childrenVisible2D(node, false);
                if (func1) {
                    func1();
                }
                Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleY: 1 }, time * 1 / 2, null, Laya.Handler.create(this, function () {
                            Tools._Node.childrenVisible2D(node, true);
                            if (func2) {
                                func2();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }), delayed);
        }

        /**
        * 用于卡牌Y轴方向的纵向旋转
        * 两个面一样的卡牌旋转动画，正反面内容是一样的
        * @param node 节点
        * @param func1 中间回调，是否需要变化卡牌内容,也就是子节点内容
        * @param time 每次旋转1/2次花费时间
        * @param delayed 延时时间
        * @param func2 结束时回调函数
        */
        export function cardRotateY_OneFace(node: Laya.Sprite, func1: Function, time: number, delayed?: number, func2?: Function): void {
            Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                if (func1) {
                    func1();
                }
                Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                    if (func2) {
                        func2();
                    }
                }), 0);
            }), delayed ? delayed : 0);
        }

        /**
         * 移动中变化一次角度属性，分为两个阶段，第一个阶段是移动并且变化角度，第二个阶段是到达目标位置，并且角度回归为0
         * @param node 节点
         * @param targetX 目标x位置
         * @param targetY 目标y位置
         * @param per 中间位置的百分比
         * @param rotation_per 第一阶段变化到多少角度
         * @param time 花费时间
         * @param func
         */
        export function move_changeRotate(node, targetX, targetY, per, rotation_pe, time, func): void {

            let targetPerX = targetX * per + node.x * (1 - per);
            let targetPerY = targetY * per + node.y * (1 - per);

            Laya.Tween.to(node, { x: targetPerX, y: targetPerY, rotation: 45 }, time, null, Laya.Handler.create(this, function () {

                Laya.Tween.to(node, { x: targetX, y: targetY, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func()
                    }
                }), 0);
            }), 0);
        }

        /**
         * 左右拉伸的Q弹动画
         * @param node 节点
         * @param MaxScale 最大拉伸
         * @param time 拉伸需要的时间，然后持续衰减
         * @param delayed 延时
         * @param func 回调函数
         */
        export function bomb_LeftRight(node, MaxScale, time, func?: Function, delayed?: number): void {
            Laya.Tween.to(node, { scaleX: MaxScale }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { scaleX: 0.85 }, time * 0.5, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: MaxScale * 0.9 }, time * 0.55, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 0.95 }, time * 0.6, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: 1 }, time * 0.65, null, Laya.Handler.create(this, function () {
                                if (func) func();
                            }), 0);
                        }), 0);
                    }), 0);
                }), 0);
            }), delayed);
        }

        /**
         * 类似气球弹出并且回弹，第一个阶段弹到空中，这个阶段可以给个角度，第二阶段落下变为原始状态，第三阶段再次放大一次，这次放大小一点，第四阶段回到原始状态，三、四个阶段是回弹一次，根据第一个阶段参数进行调整
         * @param node 节点
         * @param firstAlpha 初始透明度
         * @param firstScale 最终大小，因为有些节点可能初始Scale并不是1
         * @param maxScale 最大放大比例
         * @param rotation 第一阶段角度 
         * @param time1 第一阶段花费时间
         * @param delayed 延时时间
         * @param func 完成后的回调
         */
        export function bombs_Appear(node: Laya.Sprite, firstAlpha: number, endScale: number, maxScale: number, rotation: number, time: number, func?: Function, delayed?: number): void {
            node.scale(0, 0);
            node.alpha = firstAlpha;
            Laya.Tween.to(node, { scaleX: maxScale, scaleY: maxScale, alpha: 1, rotation: rotation }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                Laya.Tween.to(node, { scaleX: endScale, scaleY: endScale, rotation: 0 }, time / 2, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: endScale + (maxScale - endScale) / 3, scaleY: endScale + (maxScale - endScale) / 3, rotation: 0 }, time / 3, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: endScale, scaleY: endScale, rotation: 0 }, time / 4, null, Laya.Handler.create(this, function () {
                            if (func) {
                                func()
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }), delayed ? delayed : 0);
        }

        /**
         * 类似气球弹出并且回弹，所有子节点按顺序弹出来
         * @param node 节点
         * @param firstAlpha 初始透明度
         * @param endScale 初始大小
         * @param rotation1 第一阶段角度
         * @param scale1 第一阶段放大比例
         * @param time1 第一阶段花费时间
         * @param time2 第二阶段花费时间
         * @param interval 每个子节点的时间间隔
         * @param func 完成回调
         * @param audioType 音效类型
         */
        export function bombs_AppearAllChild(node: Laya.Sprite, firstAlpha, endScale, scale1, rotation1, time1, interval?: number, func?: Function, audioType?: String): void {
            let de1 = 0;
            if (!interval) {
                interval = 100;
            }
            for (let index = 0; index < node.numChildren; index++) {
                let Child = node.getChildAt(index) as Laya.Sprite;
                Child.alpha = 0;
                Laya.timer.once(de1, this, () => {
                    Child.alpha = 1;
                    if (index !== node.numChildren - 1) {
                        func == null;
                    }
                    bombs_Appear(Child, firstAlpha, endScale, scale1, rotation1, time1, func);
                })
                de1 += interval;
            }
        }

        /**
         *  类似气球消失，所有子节点按顺序消失
          * @param node 节点
         * @param scale 收缩后的大小
         * @param alpha 收缩后的透明度
         * @param rotation 收缩后的角度 
         * @param time 每个子节点花费时间
         * @param interval 每个子节点时间间隔
         * @param func 完成后的回调
         */
        export function bombs_VanishAllChild(node, endScale, alpha, rotation, time, interval, func?: Function) {
            let de1 = 0;
            if (!interval) {
                interval = 100;
            }
            for (let index = 0; index < node.numChildren; index++) {
                let Child = node.getChildAt(index);
                Laya.timer.once(de1, this, () => {
                    if (index !== node.numChildren - 1) {
                        func == null;
                    }
                    bombs_Vanish(node, endScale, alpha, rotation, time, func);
                })
                de1 += interval;
            }
        }

        /**
         * 类似气球收缩消失
         * @param node 节点
         * @param scale 收缩后的大小
         * @param alpha 收缩后的透明度
         * @param rotation 收缩后的角度 
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 完成后的回调
         */
        export function bombs_Vanish(node: Laya.Node, scale: number, alpha: number, rotation: number, time: number, func?: Function, delayed?: number): void {
            Laya.Tween.to(node, { scaleX: scale, scaleY: scale, alpha: alpha, rotation: rotation }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                if (func) {
                    func()
                }
            }), delayed ? delayed : 0);
        }

        /**
         * 类似于心脏跳动的回弹效果
         * @param node 节点
         * @param firstScale 初始大小,也就是原始大小
         * @param scale1 需要放大的大小,
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 完成后的回调
         */
        export function swell_shrink(node, firstScale, scale1, time, delayed?: number, func?: Function): void {
            // AudioAdmin._playSound(Enum.AudioName.commonPopup, 1);
            if (!delayed) {
                delayed = 0;
            }
            Laya.Tween.to(node, { scaleX: scale1, scaleY: scale1, alpha: 1, }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {

                Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {

                    Laya.Tween.to(node, { scaleX: firstScale + (scale1 - firstScale) * 0.5, scaleY: firstScale + (scale1 - firstScale) * 0.5, rotation: 0 }, time * 0.5, null, Laya.Handler.create(this, function () {

                        Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                            if (func) {
                                func()
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }), delayed);
        }

        /**
         * 简单移动,初始位置可以为null
         * @param node 节点
         * @param targetX 目标x位置
         * @param targetY 目标y位置
         * @param time 花费时间
         * @param delayed 延时时间
         * @param func 完成后的回调
         * @param ease 动画类型
         */
        export function move(node: Laya.Sprite, targetX: number, targetY: number, time: number, func?: Function, delayed?: number, ease?: Function,): void {
            Laya.Tween.to(node, { x: targetX, y: targetY }, time, ease ? ease : null, Laya.Handler.create(this, function () {
                if (func) {
                    func()
                }
            }), delayed ? delayed : 0);
        }

        /**
        * X轴方向的移动伴随形变回弹效果，移动的过程中X轴会被挤压，然后回到原始状态
        * @param node 节点
        * @param firstX 初始x位置
        * @param firstR 初始角度
        * @param scaleX x轴方向的挤压增量
        * @param scaleY y轴方向的挤压增量
        * @param targetX 目标X位置
        * @param time 花费时间
        * @param delayed 延时时间
        * @param func 完成后的回调
        */
        export function move_Deform_X(node, firstX, firstR, targetX, scaleX, scaleY, time, delayed, func): void {
            node.alpha = 0;
            node.x = firstX;
            node.rotation = firstR;
            Laya.Tween.to(node, { x: targetX, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                // 原始状态
                Laya.Tween.to(node, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func()
                    }
                }), 0);
            }), delayed);
        }


        /**
        * Y轴方向的移动伴随形变回弹效果，移动的过程中X轴会被挤压，然后回到原始状态
        * @param target 节点
        * @param firstY 初始Y位置
        * @param firstR 初始角度
        * @param scaleY y轴方向的挤压
        * @param scaleX x轴方向的挤压
        * @param targeY 目标Y位置
        * @param time 花费时间
        * @param delayed 延时时间
        * @param func 完成后的回调
        */
        export function move_Deform_Y(target, firstY, firstR, targeY, scaleX, scaleY, time, delayed, func): void {
            target.alpha = 0;
            if (firstY) {
                target.y = firstY;
            }
            target.rotation = firstR;
            Laya.Tween.to(target, { y: targeY, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                // 原始状态
                Laya.Tween.to(target, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func()
                    }
                }), 0);
            }), delayed);
        }

        /**
        * 简单的透明度渐变闪烁动画,闪一下消失
        * @param target 节点
        * @param minAlpha 最低到多少透明度
        * @param maXalpha 最高透明度
        * @param time 花费时间
        * @param delayed 延迟时间
        * @param func 完成后的回调
        */
        export function blink_FadeOut_v(target, minAlpha, maXalpha, time, delayed, func): void {
            target.alpha = minAlpha;
            Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                // 原始状态
                Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func()
                    }
                }), 0);
            }), delayed);
        }

        /**
          * 简单的透明度渐变闪烁动画，闪烁后不消失
          * @param target 节点
          * @param minAlpha 最低到多少透明度
          * @param maXalpha 最高透明度
          * @param time 花费时间
          * @param delayed 延迟时间
          * @param func 完成后的回调
          */
        export function blink_FadeOut(target, minAlpha, maXalpha, time, delayed?: number, func?: Function): void {
            target.alpha = minAlpha;
            if (!delayed) {
                delayed = 0;
            }
            Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                // 原始状态
                Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                    if (func) {
                        func()
                    }
                }), 0);
            }), delayed);
        }

        /**
          * 根据节点的锚点进行摇头动画，类似于不倒翁动画
          * @param target 节点
          * @param rotate 摇摆的幅度
          * @param time 花费时间
          * @param delayed 延迟时间
          * @param func 完成后的回调
          */
        export function shookHead_Simple(target, rotate, time, delayed?: number, func?: Function): void {
            let firstR = target.rotation;
            Laya.Tween.to(target, { rotation: firstR + rotate }, time, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(target, { rotation: firstR - rotate * 2 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { rotation: firstR + rotate }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { rotation: firstR }, time, null, Laya.Handler.create(this, function () {
                            if (func) {
                                func()
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }), delayed ? delayed : 0);
        }

        /**
         * 提示框动画1,从渐隐出现+上移=》停留=》到渐隐消失+向下
         * @param target 节点
         * @param upNum 向上上升高度
         * @param time1 向上上升的时间
         * @param stopTime 停留时间
         * @param downNum 向下消失距离
         * @param time2 向下消失时间
         * @param func 结束回调
         */
        export function HintAni_01(target, upNum, time1, stopTime, downNum, time2, func): void {
            target.alpha = 0;
            Laya.Tween.to(target, { alpha: 1, y: target.y - upNum }, time1, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(target, { y: target.y - 15 }, stopTime, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { alpha: 0, y: target.y + upNum + downNum }, time2, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func()
                        }

                    }), 0);
                }), 0);
            }), 0);
        }


        /**
        * 放大缩小加上渐变
        * @param target 节点
        * @param fAlpha 初始透明度
        * @param fScaleX 初始X大小
        * @param fScaleY 初始Y大小
        * @param endScaleX 最终X大小
        * @param endScaleY 最终Y大小
        * @param eAlpha 最终透明度
        * @param time 花费时间
        * @param delayed 延迟时间
        * @param func 结束回调
        * @param ease 效果
        */
        export function scale_Alpha(target, fAlpha, fScaleX, fScaleY, eScaleX, eScaleY, eAlpha, time, delayed?: number, func?: Function, ease?: Function): void {
            if (!delayed) {
                delayed = 0;
            }
            if (!ease) {
                ease = null;
            }
            target.alpha = fAlpha;
            target.scaleX = fScaleX;
            target.scaleY = fScaleY;
            Laya.Tween.to(target, { scaleX: eScaleX, scaleY: eScaleY, alpha: eAlpha }, time, ease, Laya.Handler.create(this, function () {
                if (func) {
                    func()
                }
            }), delayed);
        }

        /**
        * 普通缩放
        * @param target 节点
        * @param fScaleX 初始X大小
        * @param fScaleY 初始Y大小
        * @param endScaleX 最终X大小
        * @param endScaleY 最终Y大小
        * @param time 花费时间
        * @param delayed 延迟时间
        * @param func 结束回调
        * @param ease 效果
        */
        export function scale(target: Laya.Sprite, fScaleX: number, fScaleY: number, eScaleX: number, eScaleY: number, time: number, delayed?: number, func?: Function, ease?: Function): void {
            target.scaleX = fScaleX;
            target.scaleY = fScaleY;
            Laya.Tween.to(target, { scaleX: eScaleX, scaleY: eScaleY }, time, ease ? ease : null, Laya.Handler.create(this, function () {
                if (func) {
                    func()
                }
            }), delayed ? delayed : 0);
        }

        /**
         * 旋转放大回弹动画，旋转放大角度增加=》原始大小和角度=，旋转放大角��增加=》原始大小和角度，有一个回来效果
         * @param target 目标
         * @param eAngle 延伸角度，就是回收前的多出的角度
         * @param eScale 延伸大小，就是回收前的放大的大小
         * @param time1 第一阶段花费时间
         * @param time2 第二阶段花费时间
         * @param delayed1 第一阶段延时时间
         * @param delayed2 第一阶段延时时间
         * @param func 结束回调函数
         * */
        export function rotate_Magnify_KickBack(node, eAngle, eScale, time1, time2, delayed1, delayed2, func): void {
            node.alpha = 0;
            node.scaleX = 0;
            node.scaleY = 0;
            Laya.Tween.to(node, { alpha: 1, rotation: 360 + eAngle, scaleX: 1 + eScale, scaleY: 1 + eScale }, time1, null, Laya.Handler.create(this, function () {

                Laya.Tween.to(node, { rotation: 360 - eAngle / 2, scaleX: 1 + eScale / 2, scaleY: 1 + eScale / 2 }, time2, null, Laya.Handler.create(this, function () {

                    Laya.Tween.to(node, { rotation: 360 + eAngle / 3, scaleX: 1 + eScale / 5, scaleY: 1 + eScale / 5 }, time2, null, Laya.Handler.create(this, function () {

                        Laya.Tween.to(node, { rotation: 360, scaleX: 1, scaleY: 1 }, time2, null, Laya.Handler.create(this, function () {
                            node.rotation = 0;
                            if (func !== null) {
                                func()
                            }
                        }), 0);
                    }), delayed2);
                }), 0);
            }), delayed1);
        }
    }
    /**设置模块*/
    export module Setting {
        /**音效设置*/
        export let _sound = {
            get switch(): boolean {
                return Laya.LocalStorage.getItem('Setting_sound') == '0' ? false : true;
            },
            /**0表示关闭，1表示开启*/
            set switch(value: boolean) {
                let val;
                if (value) {
                    val = 1;
                } else {
                    val = 0;
                }
                Laya.LocalStorage.setItem('Setting_sound', val.toString());
            }
        };

        /**背景音乐开关*/
        export let _bgMusic = {
            get switch(): boolean {
                return Laya.LocalStorage.getItem('Setting_bgMusic') == '0' ? false : true;
            },
            /**0表示关闭，1表示开启*/
            set switch(value: boolean) {
                let val;
                if (value) {
                    val = 1;
                    Laya.LocalStorage.setItem('Setting_bgMusic', val.toString());
                    AudioAdmin._playMusic();
                } else {
                    val = 0;
                    Laya.LocalStorage.setItem('Setting_bgMusic', val.toString());
                    AudioAdmin._stopMusic();
                }
            }
        };

        /**震动开关*/
        export let _shake = {
            get switch(): boolean {
                return Laya.LocalStorage.getItem('Setting_shake') == '0' ? false : true;
            },
            /**0表示关闭，1表示开启*/
            set switch(value: boolean) {
                let val;
                if (value) {
                    val = 1;
                } else {
                    val = 0;
                }
                Laya.LocalStorage.setItem('Setting_shake', val.toString());
            }
        };

        /**设置按钮节点*/
        export let _BtnSet: Laya.Sprite;
        /**
         * 创建一个设置按钮
         * @param x X轴坐标
         * @param y Y轴坐标
         * @param width 宽度，不传则默认是100
         * @param height 高度，不传则默认是100
         * @param url 图片地址没有则是默认图片
         * @param parent 父节点，不传则就在舞台上
        */
        export function _createBtnSet(x: number, y: number, width?: number, height?: number, skin?: string, parent?: Laya.Sprite, ZOder?: number): Laya.Image {
            let btn = new Laya.Image;
            btn.width = width ? width : 100;
            btn.height = width ? width : 100;
            btn.skin = skin ? skin : 'Frame/UI/icon_set.png';
            if (parent) {
                parent.addChild(btn);
            } else {
                Laya.stage.addChild(btn);
            }
            btn.pivotX = btn.width / 2;
            btn.pivotY = btn.height / 2;
            btn.x = x;
            btn.y = y;
            btn.zOrder = ZOder ? ZOder : 100;
            var btnSetUp = function (e: Laya.Event): void {
                e.stopPropagation();
                Admin._openScene(Admin._SceneName.Set);
            }
            Click._on(Click._Type.largen, btn, null, null, btnSetUp, null);
            _BtnSet = btn;
            _BtnSet.name = 'BtnSetNode';
            return btn;
        }

        /**
         * 设置按钮的出现
         * @param delayed 延时时间
         * @param x 改变一次X轴位置
         * @param y 改变一次Y轴位置
        */
        export function btnSetAppear(delayed?: number, x?: number, y?: number): void {
            if (!_BtnSet) {
                return;
            }
            if (delayed) {
                Animation2D.scale_Alpha(_BtnSet, 0, 1, 1, 1, 1, 1, delayed, 0, f => {
                    _BtnSet.visible = true;
                });
            } else {
                _BtnSet.visible = true;
            }
            if (x) {
                _BtnSet.x = x;
            }
            if (y) {
                _BtnSet.y = y;
            }
        }

        /**
         * 设置按钮的消失
         * @param delayed 延时时间
        */
        export function btnSetVinish(delayed?: number): void {
            if (!_BtnSet) {
                return;
            }
            if (delayed) {
                Animation2D.scale_Alpha(_BtnSet, 1, 1, 1, 1, 1, 0, delayed, 0, f => {
                    _BtnSet.visible = false;
                });
            } else {
                _BtnSet.visible = false;
            }
        }
    }

    /**
     * 2.音乐播放模块
     */
    export module AudioAdmin {
        /**音效地址*/
        export enum _voiceUrl {
            btn = 'Lwg/Voice/btn.wav',
            bgm = 'Lwg/Voice/bgm.mp3',
            victory = 'Lwg/Voice/guoguan.wav',
            defeated = 'Lwg/Voice/wancheng.wav',
            huodejinbi = 'Lwg/Voice/huodejinbi.wav',
        }
        /**通用音效播放
         * @param url 音效地址，不传则是默认音效
         * @param number 播放次数，默认1次
         * @param func 播放完毕回调
         */
        export function _playSound(url?: string, number?: number, func?: Function) {
            if (!url) {
                url = _voiceUrl.btn;
            }
            if (!number) {
                number = 1;
            }
            if (Setting._sound.switch) {
                Laya.SoundManager.playSound(url, number, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }));
            }
        }

        /**通用失败音效播放
         * @param url 音效地址，不传则是默认音效
         * @param number 播放次数，默认1次
         * @param func 播放完毕回调
         */
        export function _playDefeatedSound(url?: string, number?: number, func?: Function) {
            if (!url) {
                url = _voiceUrl.defeated;
            }
            if (!number) {
                number = 1;
            }
            if (Setting._sound.switch) {
                Laya.SoundManager.playSound(url, number, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }));
            }
        }

        /**通用胜利音效播放
          * @param url 音效地址，不传则是默认音效
          * @param number 播放次数，默认1次
          * @param func 播放完毕回调
          */
        export function _playVictorySound(url?: string, number?: number, func?: Function) {
            if (!url) {
                url = _voiceUrl.victory;
            }
            if (!number) {
                number = 1;
            }
            if (Setting._sound.switch) {
                Laya.SoundManager.playSound(url, number, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }));
            }
        }

        /**通用背景音乐播放
        * @param url 音效地址，不传则是默认音效
        * @param number 循环次数，0表示无限循环
        * @param delayed 延时时间，默认0
        */
        export function _playMusic(url?: string, number?: number, delayed?: number) {
            if (!url) {
                url = _voiceUrl.bgm;
            }
            if (!number) {
                number = 0;
            }
            if (!delayed) {
                delayed = 0;
            }
            if (Setting._bgMusic.switch) {
                Laya.SoundManager.playMusic(url, number, Laya.Handler.create(this, function () { }), delayed);
            }
        }
        /**停止播放背景音乐*/
        export function _stopMusic() {
            Laya.SoundManager.stopMusic();
        }
    }
    /**工具模块*/
    export module Tools {
        /**
        * RGB三个颜色值转换成16进制的字符串‘000000’，需要加上‘#’；
        * @param r 
        * @param g
        * @param b
         */
        export function color_RGBtoHexString(r, g, b) {
            return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
        }
        /**格式化*/
        export module _Format {
            /**
             * 将数字格式化，例如1000 = 1k；
             * @param number 数字
            */
            export function formatNumber(crc: number, fixNum = 0) {
                let textTemp;
                if (crc >= 1e27) {
                    textTemp = (crc / 1e27).toFixed(fixNum) + "ae";
                } else if (crc >= 1e24) {
                    textTemp = (crc / 1e24).toFixed(fixNum) + "ad";
                } else if (crc >= 1e21) {
                    textTemp = (crc / 1e21).toFixed(fixNum) + "ac";
                } else if (crc >= 1e18) {
                    textTemp = (crc / 1e18).toFixed(fixNum) + "ab";
                } else if (crc >= 1e15) {
                    textTemp = (crc / 1e15).toFixed(fixNum) + "aa";
                } else if (crc >= 1e12) {
                    textTemp = (crc / 1e12).toFixed(fixNum) + "t";
                } else if (crc >= 1e9) {
                    textTemp = (crc / 1e9).toFixed(fixNum) + "b";
                } else if (crc >= 1e6) {
                    textTemp = (crc / 1e6).toFixed(fixNum) + "m";
                } else if (crc >= 1e3) {
                    textTemp = (crc / 1e3).toFixed(fixNum) + "k";
                } else {
                    textTemp = Math.round(crc).toString();
                }
                return textTemp;
            }
            /**
              * 字符串和数字相加返回字符串
              **/
            export function strAddNum(str: string, num: number): string {
                return (Number(str) + num).toString();
            }
            /**
             * 数字和字符串相加返回数字
             * */
            export function NumAddStr(num: number, str: string): number {
                return Number(str) + num;
            }
        }
        /**节点相关*/
        export module _Node {


            /**
             * 一个节点不会超出他的父节点
             * @param Node 节点
             * */
            export function tieByParent(Node: Laya.Sprite): void {
                const Parent = Node.parent as Laya.Sprite;
                if (Node.x > Parent.width - Node.width / 2) {
                    Node.x = Parent.width - Node.width / 2;
                }
                if (Node.x < Node.width / 2) {
                    Node.x = Node.width / 2;
                }
                if (Node.y > Parent.height - Node.height / 2) {
                    Node.y = Parent.height - Node.height / 2;
                }
                if (Node.y < Node.height / 2) {
                    Node.y = Node.height / 2;
                }
            }

            /**
              * 一个节点不会超出舞台
              * @param Node 节点
              * @param center 检测边缘还是坐标点，默认为false
              * */
            export function tieByStage(Node: Laya.Sprite, center?: boolean): void {
                const Parent = Node.parent as Laya.Sprite;
                const gPoint = Parent.localToGlobal(new Laya.Point(Node.x, Node.y));
                if (!center) {
                    if (gPoint.x > Laya.stage.width) {
                        gPoint.x = Laya.stage.width;
                    }
                } else {
                    if (gPoint.x > Laya.stage.width - Node.width / 2) {
                        gPoint.x = Laya.stage.width - Node.width / 2;
                    }
                }

                if (!center) {
                    if (gPoint.x < 0) {
                        gPoint.x = 0;
                    }
                } else {
                    if (gPoint.x < Node.width / 2) {
                        gPoint.x = Node.width / 2;
                    }
                }

                if (!center) {
                    if (gPoint.y > Laya.stage.height) {
                        gPoint.y = Laya.stage.height;
                    }
                } else {
                    if (gPoint.y > Laya.stage.height - Node.height / 2) {
                        gPoint.y = Laya.stage.height - Node.height / 2;
                    }
                }

                if (!center) {
                    if (gPoint.y < 0) {
                        gPoint.y = 0;
                    }
                } else {
                    if (gPoint.y < Node.height / 2) {
                        gPoint.y = Node.height / 2;
                    }
                }
                const lPoint = Parent.globalToLocal(gPoint);
                Node.pos(lPoint.x, lPoint.y);
            }

            /**
             * @export 简单拷贝一张img，只拷贝通用属性，深度拷贝可以借鉴通过对象的深度copy
             * @param {Laya.Image} Target 拷贝目标
             * @return {*}  {Laya.Image}
             */
            export function simpleCopyImg(Target: Laya.Image): Laya.Image {
                let Img = new Laya.Image;
                Img.skin = Target.skin;
                Img.width = Target.width;
                Img.height = Target.height;
                Img.pivotX = Target.pivotX;
                Img.pivotY = Target.pivotY;
                Img.scaleX = Target.scaleX;
                Img.scaleY = Target.scaleY;
                Img.skewX = Target.skewX;
                Img.skewY = Target.skewY;
                Img.rotation = Target.rotation;
                Img.x = Target.x;
                Img.y = Target.y;
                return Img;
            }
            /**
              * 检测节点是否超出舞台
              * @param _Sprite 节点
              * @param func 回调函数
              * */
            export function leaveStage(_Sprite: Laya.Sprite, func: Function): Laya.Point {
                let Parent = _Sprite.parent as Laya.Sprite;
                let gPoint = Parent.localToGlobal(new Laya.Point(_Sprite.x, _Sprite.y));
                if (gPoint.x > Laya.stage.width + 10 || gPoint.x < -10) {
                    if (func) {
                        func();
                    }
                }
                if (gPoint.y > Laya.stage.height + 10 || gPoint.y < -10) {
                    if (func) {
                        func();
                    }
                }
                return new Laya.Point(gPoint.x, gPoint.y);
            }

            /**
            * 检测两个节点的距离是否在指定距离之内,基于舞台
            * @param _Sprite1 节点1
            * @param _Sprite2 节点2
            * @param distance 距离
            * @param func 回调函数
            */
            export function checkTwoDistance(_Sprite1: Laya.Sprite, _Sprite2: Laya.Sprite, distance: number, func: Function): number {
                let Parent1 = _Sprite1.parent as Laya.Sprite;
                let gPoint1 = Parent1.localToGlobal(new Laya.Point(_Sprite1.x, _Sprite1.y));
                let Parent2 = _Sprite2.parent as Laya.Sprite;
                let gPoint2 = Parent2.localToGlobal(new Laya.Point(_Sprite2.x, _Sprite2.y));
                if (gPoint1.distance(gPoint2.x, gPoint2.y) < distance) {
                    if (func) {
                        func();
                    }
                }
                return gPoint1.distance(gPoint2.x, gPoint2.y);
            }
            /**
             * @export 返回子节点随着Y轴进行排序数组
             * @param {Laya.Sprite} sp 节点
             * @param {boolean} zOrder 是否改变其层级，默认为true,按照0起始的整数开始排序
             * @param {boolean} [along] 默认为true，Y坐标越大层级越高.false则反向
             */
            export function zOrderByY(sp: Laya.Sprite, zOrder?: boolean, along?: boolean): Array<Laya.Sprite> {
                let arr = [];
                if (sp.numChildren == 0) {
                    return arr;
                };
                for (let index = 0; index < sp.numChildren; index++) {
                    const element = sp.getChildAt(index);
                    arr.push(element);
                }
                _ObjArray.sortByProperty(arr, 'y');
                if (zOrder) {
                    for (let index = 0; index < arr.length; index++) {
                        const element = arr[index];
                        element['zOrder'] = index;
                    }
                }
                if (along) {
                    let arr0 = [];
                    for (let index = arr.length - 1; index >= 0; index--) {
                        const element = arr[index];
                        console.log(element);
                        element['zOrder'] = arr.length - index;
                        arr0.push(element);
                    }
                    return arr0;
                } else {
                    return arr;
                }
            }
            /**
             * @export 改变pivot不改变位置，图片没有设置宽高可能改不掉
             * @param {Laya.Sprite} sp 节点
             * @param {number} _pivotX 
             * @param {number} _pivotY 
             * @param {number} int 是转换为整数，如果内部有遮罩必须要整数,默认为false
             */
            export function changePivot(sp: Laya.Sprite, _pivotX: number, _pivotY: number, int?: boolean): void {
                let originalPovitX = sp.pivotX;
                let originalPovitY = sp.pivotY;
                if (int) {
                    _pivotX = Math.round(_pivotX);
                    _pivotY = Math.round(_pivotY);
                }
                if (sp.width) {
                    sp.pivot(_pivotX, _pivotY);
                    sp.x += (sp.pivotX - originalPovitX);
                    sp.y += (sp.pivotY - originalPovitY);
                }
            }
            /**
               * @export  Povit居中并且不改变位置
               * @param {Laya.Sprite} sp 节点
               * @param {number} _pivotX 
               * @param {number} _pivotY 
               * @param {number} int 是转换为整数，如果内部有遮罩必须要整数,默认为false
               */
            export function changePivotCenter(sp: Laya.Sprite, int?: boolean): void {
                let originalPovitX = sp.pivotX;
                let originalPovitY = sp.pivotY;
                let _pivotX: number;
                let _pivotY: number;
                if (int) {
                    _pivotX = Math.round(sp.width / 2);
                    _pivotY = Math.round(sp.height / 2);
                }
                if (sp.width) {
                    sp.pivot(sp.width / 2, sp.height / 2);
                    sp.x += (sp.pivotX - originalPovitX);
                    sp.y += (sp.pivotY - originalPovitY);
                }
            }
            /**
              * 根据子节点的某个属性包括手动赋值的node['属性']，获取相同属性的数组
              * @param node 节点
              * @param property 属性值
              * @param value 值
              * */
            export function getChildArrByProperty(node: Laya.Node, property: string, value: any): Array<Laya.Node> {
                let childArr = [];
                for (let index = 0; index < node.numChildren; index++) {
                    const element = node.getChildAt(index);
                    if (element[property] == value) {
                        childArr.push(element);
                    }
                }
                return childArr;
            }
            /**
             * 随机出数个子节点，返回这个子节点数组
             * @param node 节点
             * @param num 数量，默认为1
             */
            export function randomChildren(node: Laya.Node, num?: number): Array<Laya.Node> {
                let childArr = [];
                let indexArr = [];
                for (let i = 0; i < node.numChildren; i++) {
                    indexArr.push(i);
                }
                let randomIndex = Tools._Array.randomGetOut(indexArr, num);
                for (let j = 0; j < randomIndex.length; j++) {
                    childArr.push(node.getChildAt(randomIndex[j]));
                }
                return childArr;
            }

            /**
             * 移除该节点的所有子节点，没有子节点则无操作
             * @param node 节点
             */
            export function removeAllChildren(node: Laya.Node): void {
                if (node.numChildren > 0) {
                    node.removeChildren(0, node.numChildren - 1);
                }
            }
            /**
              * 通过某个节点名称移除某个子节点
              * @param nodeName 节点名称
              */
            export function removeOneChildren(node: Laya.Node, nodeName: string): void {
                for (let index = 0; index < node.numChildren; index++) {
                    const element = node.getChildAt(index);
                    // console.log(element);
                    if (element.name == nodeName) {
                        element.removeSelf();
                    }
                }
            }
            /**
             * 通过某个节点名判断是否是另一个节点的子节点
             * @param nodeName 节点名称
            */
            export function checkChildren(node: Laya.Node, nodeName: string): boolean {
                let bool = false;
                for (let index = 0; index < node.numChildren; index++) {
                    const element = node.getChildAt(index);
                    if (element.name == nodeName) {
                        bool = true;
                    }
                }
                return bool;
            }
            /**
             * 切换显示或隐藏子节点，当输入的名称数组是显示时，其他子节点则是隐藏
             * @param node 节点
             * @param childNameArr 子节点名称数组
             * @param bool 隐藏还是显示，true为显示，flase为隐藏，默认为true
             */
            export function showExcludedChild2D(node: Laya.Sprite, childNameArr: Array<string>, bool?: boolean): void {
                for (let i = 0; i < node.numChildren; i++) {
                    let Child = node.getChildAt(i) as Laya.Sprite;
                    for (let j = 0; j < childNameArr.length; j++) {
                        if (Child.name == childNameArr[j]) {
                            if (bool || bool == undefined) {
                                Child.visible = true;
                            } else {
                                Child.visible = false;
                            }
                        } else {
                            if (bool || bool == undefined) {
                                Child.visible = false;
                            } else {
                                Child.visible = true;
                            }
                        }
                    }
                }
            }
            /**
             * 切换隐藏或显示子节点，当输入的名称数组是隐藏时，其他子节点则是显示
             * @param node 节点
             * @param childNameArr 子节点名称数组
             * @param bool 隐藏还是显示，true为显示，flase为隐藏,默认为true
             */
            export function showExcludedChild3D(node: Laya.MeshSprite3D, childNameArr: Array<string>, bool?: boolean): void {
                for (let i = 0; i < node.numChildren; i++) {
                    let Child = node.getChildAt(i) as Laya.MeshSprite3D;
                    for (let j = 0; j < childNameArr.length; j++) {
                        if (Child.name == childNameArr[j]) {
                            if (bool || bool == undefined) {
                                Child.active = true;
                            } else {
                                Child.active = false;
                            }
                        } else {
                            if (bool || bool == undefined) {
                                Child.active = false;
                            } else {
                                Child.active = true;
                            }
                        }
                    }
                }
            }
            /**
             *通过prefab创建一个实例
             * @param {Laya.Prefab} prefab 预制体
             * @param {string} [name] 名称
             * @return {*}  {Laya.Sprite}
             */
            export function createPrefab(prefab: Laya.Prefab, Parent?: Laya.Node, point?: [number, number], zOrder?: number, name?: string): Laya.Sprite {
                let Sp: Laya.Video = Laya.Pool.getItemByCreateFun(name ? name : prefab.json['props']['name'], prefab.create, prefab);
                Parent && Parent.addChild(Sp);
                point && Sp.pos(point[0], point[1]);
                if (zOrder) {
                    Sp.zOrder = zOrder;
                }
                return Sp;
            }
            /**
             *2D隐藏或者打开所有子节点
             * @param node 节点
             * @param bool visible控制
            */
            export function childrenVisible2D(node: Laya.Sprite, bool: boolean): void {
                for (let index = 0; index < node.numChildren; index++) {
                    const element = node.getChildAt(index) as Laya.Sprite;
                    if (bool) {
                        element.visible = true;
                    } else {
                        element.visible = false;
                    }
                }
            }

            /**
             *3D隐藏或者打开所有子节点
             * @param node 节点
             * @param bool visible控制
            */
            export function childrenVisible3D(node: Laya.MeshSprite3D, bool: boolean): void {
                for (let index = 0; index < node.numChildren; index++) {
                    const element = node.getChildAt(index) as Laya.MeshSprite3D;
                    if (bool) {
                        element.active = true;
                    } else {
                        element.active = false;
                    }
                }
            }

            /**3D递归向下查找第一个子节点*/
            export function findChild3D(parent: any, name: string): Laya.MeshSprite3D {
                var item: Laya.MeshSprite3D = null;
                //寻找自身一级目录下的子物体有没有该名字的子物体
                item = parent.getChildByName(name) as Laya.MeshSprite3D;
                //如果有，返回他
                if (item != null) return item;
                var go: Laya.MeshSprite3D = null;
                //如果没有，就吧该父物体所有一级子物体下所有的二级子物体找一遍(以此类推)
                for (var i = 0; i < parent.numChildren; i++) {
                    go = findChild3D(parent.getChildAt(i) as Laya.MeshSprite3D, name);
                    if (go != null)
                        return go;
                }
                return null;
            }

            /**2D递归向下查找子节点*/
            export function findChild2D(parent: any, name: string): Laya.Sprite {
                var item: Laya.Sprite = null;
                //寻找自身一级目录下的子物体有没有该名字的子物体
                item = parent.getChildByName(name) as Laya.Sprite;
                //如果有，返回他
                if (item != null) return item;
                var go: Laya.Sprite = null;
                //如果没有，就吧该父物体所有一级子物体下所有的二级子物体找一遍(以此类推)
                for (var i = 0; i < parent.numChildren; i++) {
                    go = findChild2D(parent.getChildAt(i) as Laya.Sprite, name);
                    if (go != null)
                        return go;
                }
                return null;
            }

            /**
             * 通过一个名称的一部分查找整个节点下面的所有有这个名称的子节点,例如输入'name',那么以'name'为开头的命名的节点'name1'则会被找到
             * */
            export function findChildByName2D(parent: any, name: string): Array<Laya.Sprite> {
                let arr = [];

                // var item: Laya.Sprite = null;
                // //寻找自身一级目录下的子物体有没有该名字的子物体
                // item = parent.getChildByName(name) as Laya.Sprite;
                // //如果有，返回他
                // if (item != null) return item;
                // var go: Laya.Sprite = null;
                // //如果没有，就吧该父物体所有一级子物体下所有的二级子物体找一遍(以此类推)
                // for (var i = 0; i < parent.numChildren; i++) {
                //     go = node_2dFindChild(parent.getChildAt(i) as Laya.Sprite, name);
                //     if (go == null) {
                //         arr.push(go);

                //     }
                // }
                return arr;
            }
        }
        /**数字相关*/
        export module _Number {
            /**
               * 返回0或者1，用随机二分之一概率,返回后0是false，true是1，所以Boolen和number都可以判断
               * */
            export function randomOneHalf(): number {
                let number;
                number = Math.floor(Math.random() * 2);
                return number;
            }

            /**
             * 在某个区间内取一个整数
             * @param section1 区间1
             * @param section2 区间2，不输入则是0~section1
             */
            export function randomOneInt(section1, section2?: number): number {
                if (section2) {
                    return Math.round(Math.random() * (section2 - section1)) + section1;
                } else {
                    return Math.round(Math.random() * section1);
                }
            }

            /**
             * 返回一个数值区间内的数个随机数
             * @param section1 区间1
             * @param section2 区间2,不输入则是0~section1
             * @param count 数量默认是1个
             * @param intSet 是否是整数,默认是整数，为true
             */
            export function randomCountBySection(section1: number, section2?: number, count?: number, intSet?: boolean): Array<number> {
                let arr = [];
                if (!count) {
                    count = 1;
                }
                if (section2) {
                    while (count > arr.length) {
                        let num;
                        if (intSet || intSet == undefined) {
                            num = Math.floor(Math.random() * (section2 - section1)) + section1;
                        } else {
                            num = Math.random() * (section2 - section1) + section1;
                        }
                        arr.push(num);
                        _Array.unique01(arr);
                    };
                    return arr;
                } else {
                    while (count > arr.length) {
                        let num;
                        if (intSet || intSet == undefined) {
                            num = Math.floor(Math.random() * section1);
                        } else {
                            num = Math.random() * section1;
                        }
                        arr.push(num);
                        _Array.unique01(arr);
                    }
                    return arr;
                }
            }
            /**
            * 返回一个数值区间内的1个随机数
            * @param section1 区间1
            * @param section2 区间2,不输入则是0~section1
            * @param intSet 是否是整数,默认是不整数，为false
            */
            export function randomOneBySection(section1: number, section2?: number, intSet?: boolean): number {
                let chage: number;
                if (section1 > section2) {
                    chage = section1;
                    section1 = section2;
                    section2 = chage;
                }
                if (section2) {
                    let num: number;
                    if (intSet) {
                        num = Math.floor(Math.random() * (section2 - section1)) + section1;
                    } else {
                        num = Math.random() * (section2 - section1) + section1;
                    }
                    return num;
                } else {
                    let num;
                    if (intSet) {
                        num = Math.floor(Math.random() * section1);
                    } else {
                        num = Math.random() * section1;
                    }
                    return num;
                }
            }
        }
        /**坐标相关*/
        export module _Point {
            /**
             * @export 获取当前节点在另一个节点坐标系中的局部坐标
             * @param {Laya.Sprite} element 坐标节点
             * @param {Laya.Sprite} Other 另一个节点
             */
            export function getOtherLocal(element: Laya.Sprite, Other: Laya.Sprite): Laya.Point {
                let Parent = element.parent as Laya.Image;
                let gPoint = Parent.localToGlobal(new Laya.Point(element.x, element.y));
                return Other.globalToLocal(gPoint);
            }
            /**
             * 根据角度计算弧度
             * @param angle 角度
             */
            export function angleByRad(angle: number) {
                return angle / 180 * Math.PI;
            }
            /**
             *返回两个二维物体的距离
             * @param {Laya.Sprite} obj1
             * @param {Laya.Sprite} obj2
             * @return {*}  {number}
             */
            export function twoNodeDistance(obj1: Laya.Sprite, obj2: Laya.Sprite): number {
                let point = new Laya.Point(obj1.x, obj1.y);
                let len = point.distance(obj2.x, obj2.y);
                return len;
            }
            /**
              * 在Laya2维世界中
              * 求向量的夹角在坐标系中的角度
              * @param x 坐标x
              * @param y 坐标y
              * */
            export function pointByAngle(x: number, y: number): number {
                let radian: number = Math.atan2(x, y) //弧度  0.6435011087932844
                let angle: number = 90 - radian * (180 / Math.PI); //角度  36.86989764584402;
                if (angle <= 0) {
                    angle = 270 + (90 + angle);
                }
                return angle - 90;
            };

            /**
              * 在Laya2维世界中,属性检查器中的角度
              * 通过一个角度，返回一个单位向量
              * @param x 坐标x
              * @param y 坐标y
              * */
            export function angleByPoint(angle): Laya.Point {
                let radian = (90 - angle) / (180 / Math.PI);
                let p = new Laya.Point(Math.sin(radian), Math.cos(radian));
                p.normalize();
                return p;
            };

            /**
              * 二维坐标中一个点按照另一个点旋转一定的角度后，得到的点
              * @param x0 原点X
              * @param y0 原点Y
              * @param x1 旋转点X
              * @param y1 旋转点Y
              * @param angle 角度
              */
            export function dotRotatePoint(x0: number, y0: number, x1: number, y1: number, angle: number): Laya.Point {
                let x2 = x0 + (x1 - x0) * Math.cos(angle * Math.PI / 180) - (y1 - y0) * Math.sin(angle * Math.PI / 180);
                let y2 = y0 + (x1 - x0) * Math.sin(angle * Math.PI / 180) + (y1 - y0) * Math.cos(angle * Math.PI / 180);
                return new Laya.Point(x2, y2);
            }

            /**
             * 根据不同的角度和速度计算坐标,从而产生位移
             * @param angle 角度
             * @param len 长度
             * */
            export function angleAndLenByPoint(angle: number, len: number): Laya.Point {
                if (angle % 90 === 0 || !angle) {
                    //debugger
                }
                const speedXY = { x: 0, y: 0 };
                speedXY.x = len * Math.cos(angle * Math.PI / 180);
                speedXY.y = len * Math.sin(angle * Math.PI / 180);
                return new Laya.Point(speedXY.x, speedXY.y);
            }

            /**
            * 求圆上的点的坐标，可以根据角度和半径作出圆形位移
            * @param angle 角度
            * @param radius 半径
            * @param centerPos 原点
            */
            export function getRoundPos(angle: number, radius: number, centerPos: Laya.Point): Laya.Point {
                var center = centerPos; //圆心坐标
                var radius = radius; //半径
                var hudu = (2 * Math.PI / 360) * angle; //90度角的弧度

                var X = center.x + Math.sin(hudu) * radius; //求出90度角的x坐标
                var Y = center.y - Math.cos(hudu) * radius; //求出90度角的y坐标
                return new Laya.Point(X, Y);
            }

            /**
             * 返回在一个中心点周围的随机产生数个点的数组
             * @param centerPos 中心点坐标
             * @param radiusX X轴半径
             * @param radiusY Y轴半径
             * @param count 产生多少个随机点
             */
            export function randomPointByCenter(centerPos: Laya.Point, radiusX: number, radiusY: number, count?: number): Array<Laya.Point> {
                if (!count) {
                    count = 1;
                }
                let arr: Array<Laya.Point> = [];
                for (let index = 0; index < count; index++) {
                    let x0 = Tools._Number.randomCountBySection(0, radiusX, 1, false);
                    let y0 = Tools._Number.randomCountBySection(0, radiusY, 1, false);
                    let diffX = Tools._Number.randomOneHalf() == 0 ? x0[0] : -x0[0];
                    let diffY = Tools._Number.randomOneHalf() == 0 ? y0[0] : -y0[0];
                    let p = new Laya.Point(centerPos.x + diffX, centerPos.y + diffY);
                    arr.push(p);
                }
                return arr;
            }
            /**
             * @export 返回两个点之间连线上均匀排布的点
             * @param {Laya.Point} p1 点1
             * @param {Laya.Point} p2 点2
             * @param {number} num 个数
             * @return {*}  {Array<Laya.Point>}
             */
            export function getPArrBetweenTwoP(p1: Laya.Point, p2: Laya.Point, num: number): Array<Laya.Point> {
                let arr: Array<Laya.Point> = [];
                let x0 = p2.x - p1.x;
                let y0 = p2.y - p1.y;
                for (let index = 0; index < num; index++) {
                    arr.push(new Laya.Point(p1.x + (x0 / num) * index, p1.y + (y0 / num) * index));
                }
                if (arr.length >= 1) {
                    arr.unshift();
                }
                if (arr.length >= 1) {
                    arr.pop();
                }
                return arr;
            }
            /**
              * 返回一个向量相对于一个点的反向向量，或者反向向量的单位向量，可用于一个物体被另一个物体击退
              * @param type 二维还是三维
              * @param Vecoter1 固定点
              * @param Vecoter2 反弹物体向量
              * @param normalizing 是否归一成单位向量
              */
            export function reverseVector(Vecoter1: any, Vecoter2: any, normalizing: boolean): Laya.Vector3 {
                let p;
                p = new Laya.Point(Vecoter1.x - Vecoter2.x, Vecoter1.y - Vecoter2.y);
                if (normalizing) {
                    p.normalize();
                }
                return p;
            }
        }
        /**3D相关*/
        export module _3D {
            /**
             * @export 获取模型的大小
             * @param {Laya.MeshSprite3D} MSp3D
             * @return {*}  {Laya.Vector3}
             */
            export function getMeshSize(MSp3D: Laya.MeshSprite3D): Laya.Vector3 {
                if (MSp3D.meshRenderer) {
                    let v3: Laya.Vector3;
                    let extent = MSp3D.meshRenderer.bounds.getExtent();
                    return v3 = new Laya.Vector3(extent.x * 2, extent.y * 2, extent.z * 2)
                }
            }

            /**
             * @export 获取模型的大小
             * @param {Laya.MeshSprite3D} MSp3D
             * @return {*}  {Laya.Vector3}
             */
            export function getSkinMeshSize(MSp3D: Laya.SkinnedMeshSprite3D): Laya.Vector3 {
                if (MSp3D.skinnedMeshRenderer) {
                    let v3: Laya.Vector3;
                    let extent = MSp3D.skinnedMeshRenderer.bounds.getExtent();
                    return v3 = new Laya.Vector3(extent.x * 2, extent.y * 2, extent.z * 2)
                }
            }

            /**
              * 返回两个三维物体的世界空间的距离
              * @param obj1 物体1
              * @param obj2 物体2
              */
            export function twoNodeDistance(obj1: Laya.MeshSprite3D, obj2: Laya.MeshSprite3D): number {
                let obj1V3: Laya.Vector3 = obj1.transform.position;
                let obj2V3: Laya.Vector3 = obj2.transform.position;
                let p = new Laya.Vector3();
                // 向量相减后计算长度
                Laya.Vector3.subtract(obj1V3, obj2V3, p);
                let lenp = Laya.Vector3.scalarLength(p);
                return lenp;
            }
            /**
              * 返回两个3维向量之间的距离
              * @param v1 物体1
              * @param v2 物体2
              */
            export function twoPositionDistance(v1: Laya.Vector3, v2: Laya.Vector3): number {
                let p = twoSubV3(v1, v2);
                let lenp = Laya.Vector3.scalarLength(p);
                return lenp;
            }
            /**
              * 返回相同坐标系中两个三维向量的相减向量（obj1-obj2）
              * @param V31 向量1
              * @param V32 向量2
              * @param normalizing 是否是单位向量,默认为不是
              */
            export function twoSubV3(V31: Laya.Vector3, V32: Laya.Vector3, normalizing?: boolean): Laya.Vector3 {
                let p = new Laya.Vector3();
                // 向量相减后计算长度
                Laya.Vector3.subtract(V31, V32, p);
                if (normalizing) {
                    let p1: Laya.Vector3 = new Laya.Vector3();
                    Laya.Vector3.normalize(p, p1);
                    return p1;
                } else {
                    return p;
                }
            }

            /**
             * 3D世界中，制约一个物体不会超过和另一个点的最长距离,如果超过或者等于则设置这个球面坐标，并且返回这个坐标
             * @param originV3 原点的位置
             * @param obj 物体
             * @param length 长度
             */
            export function maximumDistanceLimi(originV3: Laya.Vector3, obj: Laya.Sprite3D, length: number): Laya.Vector3 {
                // 两个向量相减等于手臂到手的向量
                let subP = new Laya.Vector3();
                let objP = obj.transform.position;
                Laya.Vector3.subtract(objP, originV3, subP);
                // 向量的长度
                let lenP = Laya.Vector3.scalarLength(subP);
                if (lenP >= length) {
                    // 归一化向量
                    let normalizP = new Laya.Vector3();
                    Laya.Vector3.normalize(subP, normalizP);
                    // 坐标
                    let x = originV3.x + normalizP.x * length;
                    let y = originV3.y + normalizP.y * length;
                    let z = originV3.z + normalizP.z * length;
                    let p = new Laya.Vector3(x, y, z);
                    obj.transform.position = p;
                    return p;
                }
            }
            /**
              * 将3D坐标转换成屏幕坐标
              * @param v3 3D世界的坐标
              * @param camera 摄像机
             */
            export function posToScreen(v3: Laya.Vector3, camera: Laya.Camera): Laya.Vector2 {
                let ScreenV4 = new Laya.Vector4();
                camera.viewport.project(v3, camera.projectionViewMatrix, ScreenV4);
                let point: Laya.Vector2 = new Laya.Vector2();
                point.x = ScreenV4.x / Laya.stage.clientScaleX;
                point.y = ScreenV4.y / Laya.stage.clientScaleY;
                return point;
            }
            /**
              * 返回一个向量相对于一个点的反向向量，或者反向向量的单位向量，可用于一个物体被另一个物体击退
              * @param type 二维还是三维
              * @param Vecoter1 固定点
              * @param Vecoter2 反弹物体向量
              * @param normalizing 是否归一成单位向量
              */
            export function reverseVector(Vecoter1: any, Vecoter2: any, normalizing: boolean): Laya.Vector3 {
                let p = new Laya.Vector3(Vecoter1.x - Vecoter2.x, Vecoter1.y - Vecoter2.y, Vecoter1.z - Vecoter2.z);
                if (normalizing) {
                    let returnP = new Laya.Vector3();
                    Laya.Vector3.normalize(p, returnP);
                    return returnP;
                } else {
                    return p;
                }
            }

            // /**
            //   * 射线检测，返回射线扫描结果，可以筛选结果
            //   * @param camera 摄像机
            //   * @param scene3D 当前场景
            //   * @param vector2 触摸点
            //   * @param filtrateName 找出指定触摸的模型的信息，如果不传则返回全部信息数组；
            //   */
            // export function rayScanningFirst(camera: Laya.Camera, scene3D: Laya.Scene3D, vector2: Laya.Vector2): string {
            //     /**射线*/
            //     let _ray: Laya.Ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
            //     /**射线扫描结果*/
            //     let outs: Array<Laya.HitResult> = new Array<Laya.HitResult>();
            //     //射线碰撞到碰撞框，碰撞框的isTrigger属性要勾上，这样只检测碰撞，不产生碰撞反应
            //     camera.viewportPointToRay(vector2, _ray);
            //     scene3D.physicsSimulation.rayCastAll(_ray, outs);
            //     for (var i = 0; i < outs.length; i++) {
            //         //找到挡屏
            //         let hitResult = outs[i].collider.owner;
            //         if (i == 0) {
            //             console.log(hitResult.name);
            //             return hitResult.name;
            //         }
            //     }
            // }
            /**
             * 射线检测，返回射线扫描结果，可以筛选结果
             * @param camera 摄像机
             * @param scene3D 当前场景
             * @param vector2 触摸点
             * @param filtrateName 找出指定触摸的模型的信息，如果不传则返回全部信息数组；
             */
            export function rayScanning(camera: Laya.Camera, scene3D: Laya.Scene3D, vector2: Laya.Vector2, filtrateName?: string): any {
                /**射线*/
                let _ray: Laya.Ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
                /**射线扫描结果*/
                let outs: Array<Laya.HitResult> = new Array<Laya.HitResult>();
                //射线碰撞到碰撞框，碰撞框的isTrigger属性要勾上，这样只检测碰撞，不产生碰撞反应
                camera.viewportPointToRay(vector2, _ray);
                scene3D.physicsSimulation.rayCastAll(_ray, outs);
                if (filtrateName) {
                    let chek;
                    for (let i = 0; i < outs.length; i++) {
                        //找出指定
                        let Sp3d = outs[i].collider.owner;
                        if (Sp3d.name == filtrateName) {
                            // 开启移动
                            chek = outs[i];
                        }
                    }
                    return chek;
                } else {
                    return outs;
                }
            }

            /**
              * 播放动画。
              * @param Sp3D 节点
              * @param name 如果为null则播放默认动画，否则按名字播放动画片段。
              * @param normalizedTime 归一化的播放起始时间。
              * @param layerIndex 层索引。
              */
            export function animatorPlay(Sp3D: Laya.Sprite3D, aniName?: string, normalizedTime?: number, layerIndex?: number): Laya.Animator {
                let sp3DAni = Sp3D.getComponent(Laya.Animator) as Laya.Animator;
                if (!sp3DAni) {
                    console.log(Sp3D.name, '没有动画组件');
                    return;
                }
                if (!layerIndex) {
                    layerIndex = 0;
                }
                sp3DAni.play(aniName, layerIndex, normalizedTime);
                return sp3DAni;
            }
        }
        /**骨骼动画相关*/
        export module _Skeleton {
            export function sk_indexControl(sk: Laya.Skeleton, name: string): void {
                sk.play(name, true);//从初始位置开始继续播放
                sk.player.currentTime = 15 * 1000 / sk.player.cacheFrameRate;
            }
        }
        /**绘制类*/
        export module _Draw {

            /**
              * 为一个节点绘制一个扇形遮罩
              * 想要遮罩的形状发生变化，必须先将父节点的cacheAs改回“none”，接着改变其角度，再次将cacheAs改为“bitmap”，必须在同一帧内进行，因为是同一帧，所以在当前帧最后或者下一帧前表现出来，帧内时间不会表现任何状态，这是个思路，帧内做任何变化都不会显示，只要帧结尾改回来就行。
              * @param parent 被遮罩的节点，也是父节点
              * @param startAngle 扇形的初始角度
              * @param endAngle 扇形结束角度
             */
            export function drawPieMask(parent, startAngle, endAngle): Laya.DrawPieCmd {
                // 父节点cacheAs模式必须为"bitmap"
                parent.cacheAs = "bitmap";
                //新建一个sprite作为绘制扇形节点
                let drawPieSpt = new Laya.Sprite();
                //设置叠加模式
                drawPieSpt.blendMode = "destination-out";
                // 加入父节点
                parent.addChild(drawPieSpt);
                // 绘制扇形，位置在中心位置，大小略大于父节点，保证完全遮住
                let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
                return drawPie;
            }

            /**
             * 对一个Sprite进行截图，返回一个图片信息字符串，可直接当前图片地址使用
             * @export
             * @param {Laya.Sprite} Sp 需要截图的Sp，Sp必须有宽高
             * @param quality 品质0-1;
             * @return {*}  {string}
             */
            export function screenshot(Sp: Laya.Sprite, quality?: number): string {
                const htmlCanvas: Laya.HTMLCanvas = Sp.drawToCanvas(Sp.width, Sp.height, Sp.x, Sp.y);
                const base64 = htmlCanvas.toBase64("image/png", quality ? quality : 1);
                return base64;
            }

            /**绘制类绘制出的贴图和canvas的存储，每次只保存3个，自动销毁*/
            export let _texArr = [];
            /**
             * 将当前摄像机的图像渲染到一个sprite中
             * @export
             * @param {Laya.Camera} camera 摄像机
             * @param {Laya.Sprite} sprite 目标sprite,必须有宽高
             * @param {boolean} clear 是否延时自动清除贴图，默认为
             */
            export function cameraToSprite(camera: Laya.Camera, sprite: Laya.Sprite, clear?: boolean): void {
                // 赋值当前摄像机
                const _camera = camera.clone() as Laya.Camera;
                camera.scene.addChild(_camera);
                _camera.transform.position = camera.transform.position;
                _camera.transform.localRotationEuler = camera.transform.localRotationEuler;
                //选择渲染目标为纹理
                _camera.renderTarget = new Laya.RenderTexture(sprite.width, sprite.height);
                //渲染顺序
                _camera.renderingOrder = -1;
                //清除标记
                _camera.clearFlag = Laya.CameraClearFlags.Sky;
                const ptex = new Laya.Texture(((<Laya.Texture2D>(_camera.renderTarget as any))), Laya.Texture.DEF_UV);
                sprite.graphics.drawTexture(ptex, sprite.x, sprite.y, sprite.width, sprite.height);
                _texArr.push(ptex);
                if (_texArr.length > 2) {
                    _texArr[0].destroy();
                    _texArr.shift();
                }
                // 延迟销毁，因为渲染需要时间
                TimerAdmin._frameOnce(5, this, () => {
                    _camera.destroy();
                })
            }

            /**
               * 返回一个节点包括其子节点的截图
               * @export
               * @param {Laya.Sprite} Sp 需要截图的Sp，Sp必须有宽高
               * @param quality 品质0-1;
               * @return {*}  {string}
               */
            export function drawToTex(Sp: Laya.Sprite, quality?: number): Laya.Texture {
                let tex = Sp.drawToTexture(Sp.width, Sp.height, Sp.x, Sp.y) as Laya.Texture;
                return tex;
            }

            /**
             * 在一个节点上绘制一个圆形反向遮罩,可以绘制很多个，清除直接删除node中的子节点即可
             * 圆角矩形的中心点在节点的中间
             * @param node 节点
             * @param x x位置
             * @param y y位置
             * @param radius 半径
             * @param eliminate 是否清除其他遮罩，默认为true
             */
            export function reverseRoundMask(node, x: number, y: number, radius: number, eliminate?: boolean): Laya.Sprite {
                if (eliminate == undefined || eliminate == true) {
                    _Node.removeAllChildren(node);
                }
                let interactionArea = new Laya.Sprite();
                interactionArea.name = 'reverseRoundMask';
                //设置叠加模式
                interactionArea.blendMode = "destination-out";//利用叠加模式创建反向遮罩
                node.cacheAs = "bitmap";
                node.addChild(interactionArea);
                // 画出圆形，可以画很多个圆形
                interactionArea.graphics.drawCircle(0, 0, radius, "#000000");
                interactionArea.pos(x, y);
                return interactionArea;
            }
            /**
             * 在一个节点上绘制一个圆形反向遮罩,可以绘制很多个，清除直接删除node中的子节点即可
             * 圆角矩形的中心点在节点的中间
             * @param node 节点
             * @param x x位置
             * @param y y位置
             * @param width 宽
             * @param height 高
             * @param round 圆角角度
             * @param eliminate 是否清除其他遮罩，默认为true
             */
            export function reverseRoundrectMask(node, x: number, y: number, width: number, height: number, round: number, eliminate?: boolean): void {
                if (eliminate == undefined || eliminate == true) {
                    _Node.removeAllChildren(node);
                }
                let interactionArea = new Laya.Sprite();
                interactionArea.name = 'reverseRoundrectMask';
                //设置叠加模式
                interactionArea.blendMode = "destination-out";//利用叠加模式创建反向遮罩
                node.cacheAs = "bitmap";
                node.addChild(interactionArea);
                // 画出圆形，可以画很多个圆形
                interactionArea.graphics.drawPath(0, 0, [["moveTo", 5, 0], ["lineTo", width - round, 0], ["arcTo", width, 0, width, round, round], ["lineTo", width, height - round], ["arcTo", width, height, width - round, height, round], ["lineTo", height - round, height], ["arcTo", 0, height, 0, height - round, round], ["lineTo", 0, round], ["arcTo", 0, 0, round, 0, round], ["closePath"]], { fillStyle: "#000000" });
                interactionArea.width = width;
                interactionArea.height = height;
                interactionArea.pivotX = width / 2;
                interactionArea.pivotY = height / 2;
                interactionArea.pos(x, y);
            }
        }
        /**对象数组相关*/
        export module _ObjArray {
            /**
              * 对象数组按照对象的某个属性排序
              * @param array 对象数组
              * @param property 对象中一个相同的属性名称
              */
            export function sortByProperty(array: Array<any>, property: string): Array<any> {
                var compare = function (obj1: any, obj2: any) {
                    var val1 = obj1[property];
                    var val2 = obj2[property];
                    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                        val1 = Number(val1);
                        val2 = Number(val2);
                    }
                    if (val1 < val2) {
                        return -1;
                    } else if (val1 > val2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
                array.sort(compare);
                return array;
            }

            /**
              * 对比两个对象数组中的某个对象属性，返回相对第一个数组中有的这个property属性，第二个数组中没有这个属性的对象数组，例如两张数据表，通过名字查找，objArr2有8个不同的名字，objArr1也有（也可以没有）这个8个名字，并且objArr1还多了其他两个名字，那么返回objArr1中这两个名字的数组,为复制出的新数组
              * @param objArr1 对象数组1
              * @param objArr2 对象数组2
              * @param property 需要对比的属性名称
             */
            export function diffProByTwo(objArr1: Array<any>, objArr2: Array<any>, property: string): Array<any> {
                var result = [];
                for (var i = 0; i < objArr1.length; i++) {
                    var obj1 = objArr1[i];
                    var obj1Name = obj1[property];
                    var isExist = false;

                    for (var j = 0; j < objArr2.length; j++) {
                        var obj2 = objArr2[j];
                        var obj2Name = obj2[property];
                        if (obj2Name == obj1Name) {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        let _obj1 = _ObjArray.objCopy(obj1);
                        result.push(_obj1);
                    }
                }
                return result;
            }


            /**
             * 返回两个数组对象中，有相同属性的对象集合
             * @param data1 对象数组1
             * @param data2 对象数组2
             * @param property 需要对比的属性名称
             */
            export function identicalPropertyObjArr(data1: Array<any>, data2: Array<any>, property: string): Array<any> {
                var result = [];
                for (var i = 0; i < data1.length; i++) {
                    var obj1 = data1[i];
                    var obj1Name = obj1[property];
                    var isExist = false;

                    for (var j = 0; j < data2.length; j++) {
                        var obj2 = data2[j];
                        var obj2Name = obj2[property];
                        if (obj2Name == name) {
                            isExist = true;
                            break;
                        }
                    }
                    if (isExist) {
                        result.push(obj1);
                    }
                }
                return result;
            }
            /**
              * 对象数组去重，根据对象的某个属性值去重
              * @param arr 数组
              * @param property 属性
              * */
            export function objArrUnique(arr: Array<any>, property: string): any {
                for (var i = 0, len = arr.length; i < len; i++) {
                    for (var j = i + 1, len = arr.length; j < len; j++) {
                        if (arr[i][property] === arr[j][property]) {
                            arr.splice(j, 1);
                            j--;        // 每删除一个数j的值就减1
                            len--;      // j值减小时len也要相应减1（减少循环次数，节省性能）   
                        }
                    }
                }
                return arr;
            }


            /**
             * 根据一个对像的属性，从对象数组中返回某个属性的值数组
             * @param arr 
             * @param property 
             */
            export function getArrByValue(objArr: Array<any>, property: string): Array<any> {
                let arr = [];
                for (let i = 0; i < objArr.length; i++) {
                    if (objArr[i][property]) {
                        arr.push(objArr[i][property]);
                    }
                }
                return arr;
            }

            /**
             * 对象数组的拷贝
             * @param ObjArray 需要拷贝的对象数组 
             */
            export function arrCopy(ObjArray: Array<any>): any {
                var sourceCopy = ObjArray instanceof Array ? [] : {};
                for (var item in ObjArray) {
                    sourceCopy[item] = typeof ObjArray[item] === 'object' ? objCopy(ObjArray[item]) : ObjArray[item];
                }
                return sourceCopy;
            }

            /**
             * 批量修改对象数组中的某个属性值
             * @param objArr 对象数组
             * */
            export function modifyProValue(objArr: Array<any>, pro: string, value: any): any[] {
                for (const key in objArr) {
                    if (Object.prototype.hasOwnProperty.call(objArr, key)) {
                        const element = objArr[key];
                        if (element[pro]) {
                            element[pro] = value;
                        }
                    }
                }
                return objArr;
            }

            /**
              * 对象的拷贝
              * @param obj 需要拷贝的对象
              */
            export function objCopy(obj: any) {
                var _copyObj = {};
                for (const item in obj) {
                    if (obj.hasOwnProperty(item)) {
                        const element = obj[item];
                        if (typeof element === 'object') {
                            // 其中有一种情况是对某个对象值为数组的拷贝
                            if (Array.isArray(element)) {
                                let arr1 = _Array.copy(element);
                                _copyObj[item] = arr1;
                            } else {
                                objCopy(element);
                            }
                        } else {
                            _copyObj[item] = element;
                        }
                    }
                }
                return _copyObj;
            }
        }

        /**数组相关*/
        export module _Array {
            /**
              * 往第一个数组中陆续添加第二个数组中的元素
              * @param array1 
              * @param array2
              */
            export function addToarray(array1: Array<any>, array2: Array<any>): Array<any> {
                for (let index = 0; index < array2.length; index++) {
                    const element = array2[index];
                    array1.push(element);
                }
                return array1;
            }
            /**
             * 将一个数组倒过来
             * @param array
             */
            export function inverted(array: Array<any>,): Array<any> {
                let arr = [];
                for (let index = array.length - 1; index >= 0; index--) {
                    const element = array[index];
                    arr.push(element);
                }
                array = arr;
                return array;
            }

            /**
             * 从一个数组中随机取出几个元素，如果刚好是数组长度，则等于是乱序,此方法不会改变原数组
             * @param arr 数组
             * @param num 取出几个元素默认为1个
             */
            export function randomGetOut(arr: Array<any>, num?: number): any {
                if (!num) {
                    num = 1;
                }
                let arrCopy = _Array.copy(arr);
                let arr0 = [];
                if (num > arrCopy.length) {
                    return '数组长度小于取出的数！';
                } else {
                    for (let index = 0; index < num; index++) {
                        let ran = Math.round(Math.random() * (arrCopy.length - 1));
                        let a1 = arrCopy[ran];
                        arrCopy.splice(ran, 1);
                        arr0.push(a1);
                    }
                    return arr0;
                }
            }

            /**
            * 从一个数组中随机取出1个元素
            * @param arr 数组
            */
            export function randomGetOne(arr: Array<any>): any {
                let arrCopy = copy(arr);
                let ran = Math.round(Math.random() * (arrCopy.length - 1));
                return arrCopy[ran];
            }
            /**
              * 普通数组复制 
              * @param arr1 被复制的数组
              */
            export function copy(arr1): Array<any> {
                var arr = [];
                for (var i = 0; i < arr1.length; i++) {
                    arr.push(arr1[i]);
                }
                return arr;
            }
            /**
             * 数组去重
             * @param arr 数组
            */
            export function unique01(arr): Array<any> {
                for (var i = 0, len = arr.length; i < len; i++) {
                    for (var j = i + 1, len = arr.length; j < len; j++) {
                        if (arr[i] === arr[j]) {
                            arr.splice(j, 1);
                            j--;        // 每删除一个数j的值就减1
                            len--;      // j值减小时len也要相���减1（减少循环次数，节省性能）   
                        }
                    }
                }
                return arr;
            }
            /**数组去重*/
            export function unique02(arr): Array<any> {
                arr = arr.sort();
                var arr1 = [arr[0]];
                for (var i = 1, len = arr.length; i < len; i++) {
                    if (arr[i] !== arr[i - 1]) {
                        arr1.push(arr[i]);
                    }
                }
                return arr1;
            }
            /**ES6数组去重,返回的数组是新数组，需接收*/
            export function unique03(arr): Array<any> {
                return Array.from(new Set(arr));
            }

            /**
              * 返回从第一个数组中排除第二个数组中的元素，也就是第二个数组中没有第一个数组中的这些元素，如果第一个数组包含第二个数组，那么刚好等于是第一个数组排除第二个数组的元素
              * @param arr1 
              * @param arr2 
              */
            export function oneExcludeOtherOne(arr1, arr2): Array<any> {
                let arr1Capy = _Array.copy(arr1);
                let arr2Capy = _Array.copy(arr2);
                // console.log(arr1,arr2)
                for (let i = 0; i < arr1Capy.length; i++) {
                    for (let j = 0; j < arr2Capy.length; j++) {
                        if (arr1Capy[i] == arr2Capy[j]) {
                            arr1Capy.splice(i, 1);
                            i--;
                        }
                    }
                }
                return arr1Capy;
            }
            /**
              * 找出几个数组中都有的元素，或者相互没有的元素，
              * 查找方法如下：如果某个元素的个数等于数组个数，这说明他们都有；
              * @param arrays 数组组成的数组
              * @param exclude 默认为false,false为返回都有的元素，true为返回排除这些相同元素，也就是相互没有的元素
              */
            export function moreExclude(arrays: Array<Array<any>>, exclude?: boolean): Array<any> {
                // 避免三重for循环嵌套，一步一步做
                // 取出所有元素
                let arr0 = [];
                for (let i = 0; i < arrays.length; i++) {
                    for (let j = 0; j < arrays[i].length; j++) {
                        arr0.push(arrays[i][j]);
                    }
                }
                // 保留arr0，赋值一份
                let arr1 = copy(arr0);
                // 去重排列出元素列表
                let arr2 = copy(arr1);

                // 列出记录数量的数组
                let arrNum = [];
                for (let k = 0; k < arr2.length; k++) {
                    arrNum.push({
                        name: arr2[k],
                        num: 0,
                    });
                }

                // 记录数量
                for (let l = 0; l < arr0.length; l++) {
                    for (let m = 0; m < arrNum.length; m++) {
                        if (arr0[l] == arrNum[m]['name']) {
                            arrNum[m]['num']++;
                        }
                    }
                }
                // 找出数量和arrays长度相同或者不相同的数组
                let arrAllHave = [];
                let arrDiffHave = [];
                for (let n = 0; n < arrNum.length; n++) {
                    const element = arrNum[n];
                    if (arrNum[n]['num'] == arrays.length) {
                        arrAllHave.push(arrNum[n]['name']);
                    } else {
                        arrDiffHave.push(arrNum[n]['name']);
                    }
                }
                if (!exclude) {
                    return arrAllHave;
                } else {
                    return arrDiffHave;
                }
            }
        }
    }

    export module LwgPreLoad {
        /**3D场景的加载，其他3D物体，贴图，Mesh详见：  https://ldc2.layabox.com/doc/?nav=zh-ts-4-3-1   */
        let _scene3D: Array<string> = [];
        /**3D预设的加载，其他3D物体，贴图，Mesh详见：  https://ldc2.layabox.com/doc/?nav=zh-ts-4-3-1   */
        let _prefab3D: Array<any> = [];
        /**模型网格详见：  https://ldc2.layabox.com/doc/?nav=zh-ts-4-3-1   */
        let _mesh3D: Array<string> = [];
        /**材质详见：  https://ldc2.layabox.com/doc/?nav=zh-ts-4-3-1   */
        let _material: Array<string> = [];
        /**2D纹理*/
        let _texture: Array<string> = [];
        /**3D纹理加载详见：  https://ldc2.layabox.com/doc/?nav=zh-ts-4-3-1   */
        let _texture2D: Array<string> = [];

        /**需要加载的图片资源列表,一般是界面的图片*/
        let _pic2D: Array<string> = [];
        /**2D场景*/
        let _scene2D: Array<string> = [];
        /**2D预制体*/
        let _prefab2D: Array<string> = [];

        /**数据表、场景和预制体的加载，在框架中，json数据表为必须加载的项目*/
        let _json: Array<string> = [];
        /**数据表、场景和预制体的加载，在框架中，json数据表为必须加载的项目*/
        let _skeleton: Array<string> = [];

        /**进度条总长度,长度为以上三个加载资源类型的数组总长度*/
        export let _sumProgress: number = 0;
        /**加载顺序依次为3d,2d,数据表，可修改*/
        export let _loadOrder: Array<any> = [];
        /**当前加载到哪个分类数组*/
        export let _loadOrderIndex: number = 0;

        /**两种类型，页面前加载还是初始化前*/
        export let _loadType: string = Admin._SceneName.PreLoad;
        export enum _ListName {
            scene3D = 'scene3D',
            prefab3D = 'prefab3D',
            mesh3D = 'mesh3D',
            material = 'material',
            texture = 'texture',
            texture2D = 'texture2D',
            pic2D = 'pic2D',
            scene2D = 'scene2D',
            prefab2D = 'prefab2D',
            json = 'json',
            skeleton = 'skeleton',
        }
        /**当前进度条进度,起始位0，每加载成功1个资源，则加1,_currentProgress.value / _sumProgress为进度百分比*/
        export let _currentProgress = {
            /**获取进度条的数量值，_currentProgress.value / _sumProgress为进度百分比*/
            get value(): number {
                return this['len'] ? this['len'] : 0;
            },
            /**设置进度条的值*/
            set value(val: number) {
                this['len'] = val;
                if (this['len'] >= _sumProgress) {
                    if (_sumProgress == 0) {
                        return;
                    }
                    console.log('当前进度条进度为:', _currentProgress.value / _sumProgress);
                    // console.log('进度条停止！');
                    console.log('所有资源加载完成！此时所有资源可通过例如 Laya.loader.getRes("url")获取');
                    EventAdmin._notify(LwgPreLoad._Event.complete);
                } else {
                    // 当前进度达到当前长度节点时,去到下一个数组加载
                    let number = 0;
                    for (let index = 0; index <= _loadOrderIndex; index++) {
                        number += _loadOrder[index].length;
                    }
                    if (this['len'] == number) {
                        _loadOrderIndex++;
                    }
                    EventAdmin._notify(LwgPreLoad._Event.stepLoding);
                }
            },
        };

        /**事件类型*/
        export enum _Event {
            importList = '_PreLoad_importList',
            complete = '_PreLoad_complete',
            stepLoding = '_PreLoad_startLoding',
            progress = '_PreLoad_progress',
        }
        /**重制一些加载变量，方便在其他页面重新使用*/
        export function _remakeLode(): void {
            _scene3D = [];
            _prefab3D = [];
            _mesh3D = [];
            _material = [];
            _texture2D = [];
            _pic2D = [];
            _scene2D = [];
            _prefab2D = [];
            _json = [];
            _skeleton = [];
            _loadOrder = [];
            _sumProgress = 0;
            _loadOrderIndex = 0;
            _currentProgress.value = 0;
        }
        export class _PreLoadScene extends Admin._SceneBase {
            moduleOnAwake(): void {
                LwgPreLoad._remakeLode();
            }
            /**开始加载*/
            lwgStartLoding(any: any): void {
                EventAdmin._notify(LwgPreLoad._Event.importList, (any));
            }
            moduleEvent(): void {
                EventAdmin._registerOnce(_Event.importList, this, (listObj: {}) => {
                    for (const key in listObj) {
                        if (Object.prototype.hasOwnProperty.call(listObj, key)) {
                            for (const key1 in listObj[key]) {
                                if (Object.prototype.hasOwnProperty.call(listObj[key], key1)) {
                                    const element = listObj[key][key1];
                                    switch (key) {
                                        case _ListName.json:
                                            _json.push(element);
                                            break;
                                        case _ListName.material:
                                            _material.push(element);
                                            break;
                                        case _ListName.mesh3D:
                                            _mesh3D.push(element);
                                            break;
                                        case _ListName.pic2D:
                                            _pic2D.push(element);
                                            break;
                                        case _ListName.prefab2D:
                                            _prefab2D.push(element);
                                            break;
                                        case _ListName.prefab3D:
                                            _prefab3D.push(element);
                                            break;
                                        case _ListName.scene2D:
                                            _scene2D.push(element);
                                            break;
                                        case _ListName.scene3D:
                                            _scene3D.push(element);
                                            break;
                                        case _ListName.texture2D:
                                            _texture2D.push(element);
                                            break;
                                        case _ListName.skeleton:
                                            _skeleton.push(element);
                                            break;
                                        case _ListName.texture:
                                            _texture.push(element);
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            }
                        }
                    }
                    _loadOrder = [_pic2D, _scene2D, _prefab2D, _prefab3D, _json, _texture, _texture2D, _mesh3D, _material, _skeleton, _scene3D];
                    for (let index = 0; index < _loadOrder.length; index++) {
                        _sumProgress += _loadOrder[index].length;
                        if (_loadOrder[index].length <= 0) {
                            _loadOrder.splice(index, 1);
                            index--;
                        }
                    }
                    let time = this.lwgOpenAni();
                    Laya.timer.once(time ? time : 0, this, () => {
                        EventAdmin._notify(LwgPreLoad._Event.stepLoding);
                    })
                });
                EventAdmin._register(_Event.stepLoding, this, () => { this.startLodingRule() });
                EventAdmin._registerOnce(_Event.complete, this, () => {
                    Laya.timer.once(this.lwgAllComplete(), this, () => {
                        Admin._SceneControl[_loadType] = this._Owner;
                        // 页面前
                        if (_loadType !== Admin._SceneName.PreLoad) {
                            Admin._PreLoadCutIn.openName && this._openScene(Admin._PreLoadCutIn.openName);
                            // console.log('预加载完毕开始打开界面！')
                        } else {
                            //游戏开始前
                            for (const key in Admin._Moudel) {
                                if (Object.prototype.hasOwnProperty.call(Admin._Moudel, key)) {
                                    const element = Admin._Moudel[key];
                                    if (element['_init']) {
                                        element['_init']();
                                    } else {
                                        console.log(element, '模块没有初始化函数！');
                                    }
                                }
                            }
                            AudioAdmin._playMusic();
                            // 有新手引导则进入新手引导，没有
                            if (Admin._GuideControl.switch) {
                                this._openScene(_SceneName.Guide, true, false, () => {
                                    _loadType = Admin._SceneName.PreLoadCutIn;
                                })
                            } else {
                                this._openScene(_SceneName.Start, true, false, () => {
                                    _loadType = Admin._SceneName.PreLoadCutIn;
                                })
                            }
                        }
                    })
                });

                EventAdmin._register(_Event.progress, this, () => {
                    _currentProgress.value++;
                    if (_currentProgress.value < _sumProgress) {
                        console.log('当前进度条进度为:', _currentProgress.value / _sumProgress);
                        this.lwgStepComplete();
                    }
                });
            }
            moduleOnEnable(): void {
                _loadOrderIndex = 0;
            }
            /**根据加载顺序依次加载,第一次加载将会在openAni动画结束之后*/
            private startLodingRule(): void {
                if (_loadOrder.length <= 0) {
                    console.log('没有加载项');
                    EventAdmin._notify(LwgPreLoad._Event.complete);
                    return;
                }
                // 已经加载过的分类数组的长度
                let alreadyPro: number = 0;
                for (let i = 0; i < _loadOrderIndex; i++) {
                    alreadyPro += _loadOrder[i].length;
                }
                //获取到当前分类加载数组的下标 
                let index = _currentProgress.value - alreadyPro;

                switch (_loadOrder[_loadOrderIndex]) {
                    case _pic2D:
                        Laya.loader.load(_pic2D[index], Laya.Handler.create(this, (any) => {
                            if (any == null) {
                                console.log('XXXXXXXXXXX2D资源' + _pic2D[index] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                            } else {
                                console.log('2D图片' + _pic2D[index] + '加载完成！', '数组下标为：', index);
                            }
                            EventAdmin._notify(_Event.progress);
                        }));
                        break;

                    case _scene2D:
                        Laya.loader.load(_scene2D[index], Laya.Handler.create(this, (any) => {
                            if (any == null) {
                                console.log('XXXXXXXXXXX数据表' + _scene2D[index] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                            } else {
                                console.log('2D场景' + _scene2D[index] + '加载完成！', '数组下标为：', index);
                            }
                            EventAdmin._notify(_Event.progress);

                        }), null, Laya.Loader.JSON);
                        break;

                    case _scene3D:
                        Laya.Scene3D.load(_scene3D[index]['url'], Laya.Handler.create(this, (Scene: Laya.Scene3D) => {
                            if (Scene == null) {
                                console.log('XXXXXXXXXXX3D场景' + _scene3D[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                            } else {
                                _scene3D[index]['Scene'] = Scene;
                                console.log('3D场景' + _scene3D[index]['url'] + '加载完成！', '数组下标为：', index);
                            }
                            EventAdmin._notify(_Event.progress);

                        }));
                        break;

                    case _prefab3D:
                        Laya.Sprite3D.load(_prefab3D[index]['url'], Laya.Handler.create(this, (Sp: Laya.Sprite3D) => {
                            if (Sp == null) {
                                console.log('XXXXXXXXXXX3D预设体' + _prefab3D[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                            } else {
                                _prefab3D[index]['Prefab'] = Sp;
                                console.log('3D预制体' + _prefab3D[index]['url'] + '加载完成！', '数组下标为：', index);
                            }
                            EventAdmin._notify(_Event.progress);

                        }));
                        break;

                    case _mesh3D:
                        Laya.Mesh.load(_mesh3D[index]['url'], Laya.Handler.create(this, (any) => {
                            if (any == null) {
                                console.log('XXXXXXXXXXX3D网格' + _mesh3D[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                            } else {
                                console.log('3D网格' + _mesh3D[index]['url'] + '加载完成！', '数组下标为：', index);
                            }
                            EventAdmin._notify(_Event.progress);

                        }));
                        break;

                    case _texture:
                        Laya.loader.load(_texture[index]['url'], Laya.Handler.create(this, (tex: Laya.Texture) => {
                            if (tex == null) {
                                console.log('XXXXXXXXXXX2D纹理' + _texture[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                            } else {
                                _texture[index]['texture'] = tex;
                                console.log('纹理' + _texture[index]['url'] + '加载完成！', '数组下标为：', index);
                            }
                            EventAdmin._notify(_Event.progress);
                        }));
                        break;

                    case _texture2D:
                        //加载纹理资源
                        Laya.Texture2D.load(_texture2D[index]['url'], Laya.Handler.create(this, function (tex: Laya.Texture2D): void {
                            if (tex == null) {
                                console.log('XXXXXXXXXXX2D纹理' + _texture2D[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                            } else {
                                _texture2D[index]['texture2D'] = tex;
                                console.log('3D纹理' + _texture2D[index]['url'] + '加载完成！', '数组下标为：', index);
                            }
                            EventAdmin._notify(_Event.progress);
                        }));
                        break;

                    case _material:
                        Laya.Material.load(_material[index]['url'], Laya.Handler.create(this, (any: any) => {
                            if (any == null) {
                                console.log('XXXXXXXXXXX材质' + _material[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                            } else {
                                console.log('材质' + _material[index]['url'] + '加载完成！', '数组下标为：', index);
                            }
                            EventAdmin._notify(_Event.progress);
                        }));
                        break;

                    case _json:
                        Laya.loader.load(_json[index]['url'], Laya.Handler.create(this, (data) => {
                            if (data == null) {
                                console.log('XXXXXXXXXXX数据表' + _json[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                            } else {
                                _json[index]['dataArr'] = data["RECORDS"];
                                console.log('数据表' + _json[index]['url'] + '加载完成！', '数组下标为：', index);
                            }
                            EventAdmin._notify(_Event.progress);

                        }), null, Laya.Loader.JSON);
                        break;

                    case _skeleton:
                        _skeleton[index]['templet'].on(Laya.Event.ERROR, this, () => {
                            console.log('XXXXXXXXXXX骨骼动画' + _skeleton[index] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                            EventAdmin._notify(_Event.progress);
                        });
                        _skeleton[index]['templet'].on(Laya.Event.COMPLETE, this, () => {
                            console.log('骨骼动画', _skeleton[index]['templet']['url'], '加载完成！', '数组下标为：', index);
                            EventAdmin._notify(_Event.progress);
                        });
                        _skeleton[index]['templet'].loadAni(_skeleton[index]['url']);
                        break;

                    case _prefab2D:
                        Laya.loader.load(_prefab2D[index]['url'], Laya.Handler.create(this, (prefab: Laya.Prefab) => {
                            if (prefab == null) {
                                console.log('XXXXXXXXXXX数据表' + _prefab2D[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                            } else {
                                let _prefab = new Laya.Prefab();
                                _prefab.json = prefab;
                                _prefab2D[index]['prefab'] = _prefab;

                                console.log('2D预制体' + _prefab2D[index]['url'] + '加载完成！', '数组下标为：', index);
                            }
                            EventAdmin._notify(_Event.progress);

                        }));
                        break;

                    default:
                        break;
                }
            }
            /**每单个资源加载成功后，进度条每次增加后的回调，第一次加载将会在openAni动画结束之后*/
            lwgStepComplete(): void { }
            /**资源全部加载完成回调,每个游戏不一样,此方法执行后，自动进入init界面，也可以延时进入*/
            lwgAllComplete(): number { return 0 };
        }
    }
    /**配置模块，拉去资源，分包等*/
    export module _LwgInit {
        /**分包加载步骤*/
        export let _pkgStep: number = 0;
        /**分包信息*/
        export let _pkgInfo = [
            { name: "sp1", root: "res" },
            { name: "sp2", root: "3DScene" },
            { name: "sp3", root: "3DPrefab" },
        ];
        export enum _Event {
            start = '_ResPrepare_start',
            nextStep = '_ResPrepare_nextStep',
            compelet = '_ResPrepare_compelet',
        }
        /**开始*/
        export function _init() {
            switch (Platform._Ues.value) {
                case Platform._Tpye.WeChat:
                    _loadPkg_Wechat();
                    break;
                case Platform._Tpye.OPPO || Platform._Tpye.VIVO:
                    _loadPkg_VIVO();
                    break;
                default:
                    break;
            }
        }
        /**OV*/
        export function _loadPkg_VIVO() {
            if (_pkgStep !== _pkgInfo.length) {
                let info = _pkgInfo[_pkgStep];
                let name = info.name;
                Laya.Browser.window.qg.loadSubpackage({
                    name: name,
                    success: (res) => {
                        _pkgStep++;
                        _loadPkg_VIVO();
                    },
                    fail: (res) => {
                        console.error(`load ${name} err: `, res);
                    },
                })
            }
        }
        /**WX*/
        export function _loadPkg_Wechat() {
            if (_pkgStep !== _pkgInfo.length) {
                let info = _pkgInfo[_pkgStep];
                let name = info.name;
                let root = info.root;
                Laya.Browser.window.wx.loadSubpackage({
                    name: name,
                    success: (res) => {
                        console.log(`load ${name} suc`);
                        Laya.MiniAdpter.subNativeFiles[name] = root;
                        Laya.MiniAdpter.nativefiles.push(root);
                        _pkgStep++;
                        console.log("加载次数", _pkgStep);
                        _loadPkg_Wechat();
                    },
                    fail: (res) => {
                        console.error(`load ${name} err: `, res);
                    },
                });
            }
        }
        export class _LwgInitScene extends Admin._SceneBase {
            lwgOpenAni(): number {
                return 1;
            }
            moduleOnAwake(): void {
            }
            moduleOnStart(): void {
                _init();
                DateAdmin._init();
                this._openScene(_SceneName.PreLoad);
                this._Owner.close();
            };
        }
    }

    /**体力模块*/
    export module Execution {
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
        export function _createExecutionNode(parent: Laya.Sprite): void {
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
        export function _addExecution(x: number, y: number, func: Function): void {
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
                    Animation2D.move(sp, _ExecutionNode.x, _ExecutionNode.y, 800, () => {
                        Animation2D.fadeOut(sp, 1, 0, 200, 0, () => {
                            Animation2D.upDwon_Shake(_ExecutionNode, 10, 80, 0, null);
                            if (func) {
                                func();
                            }
                        });
                    }, 100);
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
            Animation2D.fadeOut(label, 0, 1, 200, 150, () => {
                Animation2D.leftRight_Shake(_ExecutionNode, 15, 60, 0, null);
                Animation2D.fadeOut(label, 1, 0, 600, 400, () => {
                });
            });
        }

        export class ExecutionNode extends Admin._ObjectBase {
            Num: Laya.FontClip;
            CountDown: Laya.Label;
            CountDown_board: Laya.Label;

            lwgOnAwake(): void {
                this.Num = this._Owner.getChildByName('Num') as Laya.FontClip;
                this.CountDown = this._Owner.getChildByName('CountDown') as Laya.Label;
                this.CountDown_board = this._Owner.getChildByName('CountDown_board') as Laya.Label;
                this.countNum = 59;
                this.CountDown.text = '00:' + this.countNum;
                this.CountDown_board.text = this.CountDown.text;

                // 获取上次的体力
                let d = new Date;
                if (d.getDate() !== _addExDate.value) {
                    _execution.value = 15;
                } else {
                    if (d.getHours() == _addExHours.value) {
                        console.log(d.getMinutes(), _addMinutes.value);
                        _execution.value += (d.getMinutes() - _addMinutes.value);
                        if (_execution.value > 15) {
                            _execution.value = 15;
                        }
                    } else {
                        _execution.value = 15;
                    }
                }
                this.Num.value = _execution.value.toString();
                _addExDate.value = d.getDate();
                _addExHours.value = d.getHours();
                _addMinutes.value = d.getMinutes();
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
                        _execution.value += 1;
                        this.Num.value = _execution.value.toString();
                        let d = new Date;
                        _addExHours.value = d.getHours();
                        _addMinutes.value = d.getMinutes();
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
                        _execution.value = 15;
                        this.Num.value = _execution.value.toString();
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
    }
}
export default lwg;
// 全局控制
export let Admin = lwg.Admin;
export let _SceneBase = Admin._SceneBase;
export let _ObjectBase = Admin._ObjectBase;
export let _SceneName = Admin._SceneName;
export let Platform = lwg.Platform;
export let SceneAnimation = lwg.SceneAnimation;
export let Adaptive = lwg.Adaptive;
export let StorageAdmin = lwg.StorageAdmin;
export let DataAdmin = lwg.DataAdmin;
export let EventAdmin = lwg.EventAdmin;
export let DateAdmin = lwg.DateAdmin;
export let TimerAdmin = lwg.TimerAdmin;
export let Execution = lwg.Execution;
export let Gold = lwg.Gold;
export let Setting = lwg.Setting;
export let AudioAdmin = lwg.AudioAdmin;
export let Click = lwg.Click;
export let Color = lwg.Color;
export let Effects2D = lwg.Effects2D;
export let Effects3D = lwg.Effects3D;
export let Dialogue = lwg.Dialogue;
export let Animation2D = lwg.Animation2D;
export let Animation3D = lwg.Animation3D;
export let Tools = lwg.Tools;
//预加载和初始化
export let _LwgPreLoad = lwg.LwgPreLoad;
export let _PreLoadScene = lwg.LwgPreLoad._PreLoadScene;
export let _LwgInit = lwg._LwgInit;
export let _LwgInitScene = lwg._LwgInit._LwgInitScene;
