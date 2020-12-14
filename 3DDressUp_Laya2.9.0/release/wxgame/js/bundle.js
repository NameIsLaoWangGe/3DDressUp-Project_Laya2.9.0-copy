(function () {
    'use strict';

    var lwg;
    (function (lwg) {
        let Pause;
        (function (Pause) {
            function _createBtnPause(parent) {
                let sp;
                Laya.loader.load('prefab/BtnPause.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    sp.pos(645, 167);
                    sp.zOrder = 0;
                    Pause.BtnPauseNode = sp;
                    Pause.BtnPauseNode.name = 'BtnPauseNode';
                    Click._on(Click._Effect.type.largen, sp, null, null, btnPauseUp, null);
                }));
            }
            Pause._createBtnPause = _createBtnPause;
            function btnPauseUp(event) {
                event.stopPropagation();
                event.currentTarget.scale(1, 1);
                lwg.Admin._openScene('UIPause', null, null, null);
            }
            Pause.btnPauseUp = btnPauseUp;
        })(Pause = lwg.Pause || (lwg.Pause = {}));
        let Dialogue;
        (function (Dialogue) {
            let Skin;
            (function (Skin) {
                Skin["blackBord"] = "Frame/UI/ui_orthogon_black.png";
            })(Skin || (Skin = {}));
            function createHint_Middle(describe) {
                let Hint_M = Laya.Pool.getItemByClass('Hint_M', Laya.Sprite);
                Hint_M.name = 'Hint_M';
                Laya.stage.addChild(Hint_M);
                Hint_M.width = Laya.stage.width;
                Hint_M.height = 100;
                Hint_M.pivotY = Hint_M.height / 2;
                Hint_M.pivotX = Laya.stage.width / 2;
                Hint_M.x = Laya.stage.width / 2;
                Hint_M.y = Laya.stage.height / 2;
                Hint_M.zOrder = 100;
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
                let Dec = new Laya.Label();
                Hint_M.addChild(Dec);
                Dec.width = Laya.stage.width;
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
            Dialogue.createHint_Middle = createHint_Middle;
            Dialogue._dialogContent = {
                get Array() {
                    return Laya.loader.getRes("GameData/Dialogue/Dialogue.json")['RECORDS'] !== null ? Laya.loader.getRes("GameData/Dialogue/Dialogue.json")['RECORDS'] : [];
                },
            };
            function getDialogContent(useWhere, name) {
                let dia;
                for (let index = 0; index < Dialogue._dialogContent.Array.length; index++) {
                    const element = Dialogue._dialogContent.Array[index];
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
            Dialogue.getDialogContent = getDialogContent;
            function getDialogContent_Random(useWhere) {
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
            Dialogue.getDialogContent_Random = getDialogContent_Random;
            function getUseWhere(useWhere) {
                let arr = [];
                for (let index = 0; index < Dialogue._dialogContent.Array.length; index++) {
                    const element = Dialogue._dialogContent.Array[index];
                    if (element['useWhere'] == useWhere) {
                        arr.push(element);
                    }
                }
                return arr;
            }
            Dialogue.getUseWhere = getUseWhere;
            let UseWhere;
            (function (UseWhere) {
                UseWhere["scene1"] = "scene1";
                UseWhere["scene2"] = "scene2";
                UseWhere["scene3"] = "scene3";
            })(UseWhere = Dialogue.UseWhere || (Dialogue.UseWhere = {}));
            let DialogProperty;
            (function (DialogProperty) {
                DialogProperty["name"] = "name";
                DialogProperty["useWhere"] = "useWhere";
                DialogProperty["content"] = "content";
                DialogProperty["max"] = "max";
            })(DialogProperty = Dialogue.DialogProperty || (Dialogue.DialogProperty = {}));
            let PlayMode;
            (function (PlayMode) {
                PlayMode["voluntarily"] = "voluntarily";
                PlayMode["manual"] = "manual";
                PlayMode["clickContent"] = "clickContent";
            })(PlayMode = Dialogue.PlayMode || (Dialogue.PlayMode = {}));
            function createVoluntarilyDialogue(x, y, useWhere, startDelayed, delayed, parent, content) {
                if (startDelayed == undefined) {
                    startDelayed = 0;
                }
                Laya.timer.once(startDelayed, this, () => {
                    let Pre_Dialogue;
                    Laya.loader.load('Prefab/Dialogue_Common.json', Laya.Handler.create(this, function (prefab) {
                        let _prefab = new Laya.Prefab();
                        _prefab.json = prefab;
                        Pre_Dialogue = Laya.Pool.getItemByCreateFun('Pre_Dialogue', _prefab.create, _prefab);
                        if (parent) {
                            parent.addChild(Pre_Dialogue);
                        }
                        else {
                            Laya.stage.addChild(Pre_Dialogue);
                        }
                        Pre_Dialogue.x = x;
                        Pre_Dialogue.y = y;
                        let ContentLabel = Pre_Dialogue.getChildByName('Content');
                        let contentArr;
                        if (content !== undefined) {
                            ContentLabel.text = content[0];
                        }
                        else {
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
                                            });
                                        });
                                    }
                                });
                            }
                        });
                        Dialogue.DialogueNode = Pre_Dialogue;
                    }));
                });
            }
            Dialogue.createVoluntarilyDialogue = createVoluntarilyDialogue;
            function createCommonDialog(parent, x, y, content) {
                let Dialogue_Common;
                Laya.loader.load('Prefab/Dialogue_Common.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    Dialogue_Common = Laya.Pool.getItemByCreateFun('Dialogue_Common', _prefab.create, _prefab);
                    parent.addChild(Dialogue_Common);
                    Dialogue_Common.pos(x, y);
                    let Content = Dialogue_Common.getChildByName('Dialogue_Common');
                    Content.text = content;
                }));
            }
            Dialogue.createCommonDialog = createCommonDialog;
        })(Dialogue = lwg.Dialogue || (lwg.Dialogue = {}));
        let Execution;
        (function (Execution) {
            Execution._execution = {
                get value() {
                    return Laya.LocalStorage.getItem('_execution') ? Number(Laya.LocalStorage.getItem('_execution')) : 15;
                },
                set value(val) {
                    Laya.LocalStorage.setItem('_execution', val.toString());
                }
            };
            function _createExecutionNum(parent) {
                let sp;
                Laya.loader.load('prefab/ExecutionNum.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    let num = sp.getChildByName('Num');
                    sp.pos(297, 90);
                    sp.zOrder = 50;
                    Execution.ExecutionNumNode = sp;
                    Execution.ExecutionNumNode.name = 'ExecutionNumNode';
                }));
            }
            Execution._createExecutionNum = _createExecutionNum;
            function _createAddExecution(x, y, func) {
                let sp;
                Laya.loader.load('prefab/execution.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    Laya.stage.addChild(sp);
                    sp.x = Laya.stage.width / 2;
                    sp.y = Laya.stage.height / 2;
                    sp.zOrder = 50;
                    if (Execution.ExecutionNumNode) {
                        Animation2D.move_Simple(sp, sp.x, sp.y, Execution.ExecutionNumNode.x, Execution.ExecutionNumNode.y, 800, 100, f => {
                            Animation2D.fadeOut(sp, 1, 0, 200, 0, f => {
                                lwg.Animation2D.upDwon_Shake(Execution.ExecutionNumNode, 10, 80, 0, null);
                                if (func) {
                                    func();
                                }
                            });
                        }, Laya.Ease.expoIn);
                    }
                }));
            }
            Execution._createAddExecution = _createAddExecution;
            function createConsumeEx(subEx) {
                let label = Laya.Pool.getItemByClass('label', Laya.Label);
                label.name = 'label';
                Laya.stage.addChild(label);
                label.text = '-2';
                label.fontSize = 40;
                label.bold = true;
                label.color = '#59245c';
                label.x = Execution.ExecutionNumNode.x + 100;
                label.y = Execution.ExecutionNumNode.y - label.height / 2 + 4;
                label.zOrder = 100;
                lwg.Animation2D.fadeOut(label, 0, 1, 200, 150, f => {
                    lwg.Animation2D.leftRight_Shake(Execution.ExecutionNumNode, 15, 60, 0, null);
                    lwg.Animation2D.fadeOut(label, 1, 0, 600, 400, f => {
                    });
                });
            }
            Execution.createConsumeEx = createConsumeEx;
        })(Execution = lwg.Execution || (lwg.Execution = {}));
        let Gold;
        (function (Gold_1) {
            Gold_1._num = {
                get value() {
                    return Laya.LocalStorage.getItem('_goldNum') ? Number(Laya.LocalStorage.getItem('_goldNum')) : 0;
                },
                set value(val) {
                    Laya.LocalStorage.setItem('_goldNum', val.toString());
                }
            };
            function createGoldNode(x, y, parent) {
                if (!parent) {
                    parent = Laya.stage;
                }
                if (Gold_1.GoldNode) {
                    Gold_1.GoldNode.removeSelf();
                }
                let sp;
                Laya.loader.load('Prefab/LwgGold.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('gold', _prefab.create, _prefab);
                    let Num = sp.getChildByName('Num');
                    Num.text = Tools.format_FormatNumber(Gold_1._num.value);
                    parent.addChild(sp);
                    sp.pos(x, y);
                    sp.zOrder = 100;
                    Gold_1.GoldNode = sp;
                }));
            }
            Gold_1.createGoldNode = createGoldNode;
            function _addGold(number) {
                Gold_1._num.value += Number(number);
                let Num = Gold_1.GoldNode.getChildByName('Num');
                Num.text = Tools.format_FormatNumber(Gold_1._num.value);
            }
            Gold_1._addGold = _addGold;
            function addGoldDisPlay(number) {
                let Num = Gold_1.GoldNode.getChildByName('Num');
                Num.value = (Number(Num.value) + Number(number)).toString();
            }
            Gold_1.addGoldDisPlay = addGoldDisPlay;
            function addGoldNoDisPlay(number) {
                Gold_1._num.value += Number(number);
            }
            Gold_1.addGoldNoDisPlay = addGoldNoDisPlay;
            function goldAppear(delayed, x, y) {
                if (!Gold_1.GoldNode) {
                    return;
                }
                if (delayed) {
                    Animation2D.scale_Alpha(Gold_1.GoldNode, 0, 1, 1, 1, 1, 1, delayed, 0, f => {
                        Gold_1.GoldNode.visible = true;
                    });
                }
                else {
                    Gold_1.GoldNode.visible = true;
                }
                if (x) {
                    Gold_1.GoldNode.x = x;
                }
                if (y) {
                    Gold_1.GoldNode.y = y;
                }
            }
            Gold_1.goldAppear = goldAppear;
            function goldVinish(delayed) {
                if (!Gold_1.GoldNode) {
                    return;
                }
                if (delayed) {
                    Animation2D.scale_Alpha(Gold_1.GoldNode, 1, 1, 1, 1, 1, 0, delayed, 0, f => {
                        Gold_1.GoldNode.visible = false;
                    });
                }
                else {
                    Gold_1.GoldNode.visible = false;
                }
            }
            Gold_1.goldVinish = goldVinish;
            let SkinUrl;
            (function (SkinUrl) {
                SkinUrl[SkinUrl["Frame/Effects/icon_gold.png"] = 0] = "Frame/Effects/icon_gold.png";
            })(SkinUrl || (SkinUrl = {}));
            function createOneGold(width, height, url) {
                let Gold = Laya.Pool.getItemByClass('addGold', Laya.Image);
                Gold.name = 'addGold';
                let num = Math.floor(Math.random() * 12);
                Gold.alpha = 1;
                Gold.zOrder = 60;
                Gold.width = width;
                Gold.height = height;
                Gold.pivotX = width / 2;
                Gold.pivotY = height / 2;
                if (!url) {
                    Gold.skin = SkinUrl[0];
                }
                else {
                    Gold.skin = url;
                }
                if (Gold_1.GoldNode) {
                    Gold.zOrder = Gold_1.GoldNode.zOrder + 10;
                }
                return Gold;
            }
            Gold_1.createOneGold = createOneGold;
            function getGoldAni_Single(parent, number, width, height, url, firstPoint, targetPoint, func1, func2) {
                for (let index = 0; index < number; index++) {
                    Laya.timer.once(index * 30, this, () => {
                        let Gold = createOneGold(width, height, url);
                        parent.addChild(Gold);
                        Animation2D.move_Scale(Gold, 1, firstPoint.x, firstPoint.y, targetPoint.x, targetPoint.y, 1, 350, 0, null, () => {
                            PalyAudio.playSound(PalyAudio.voiceUrl.huodejinbi);
                            if (index === number - 1) {
                                Laya.timer.once(200, this, () => {
                                    if (func2) {
                                        func2();
                                    }
                                });
                            }
                            else {
                                if (func1) {
                                    func1();
                                }
                            }
                            Gold.removeSelf();
                        });
                    });
                }
            }
            Gold_1.getGoldAni_Single = getGoldAni_Single;
            function _getGoldAni_Heap(parent, number, width, height, url, firstPoint, targetPoint, func1, func2) {
                for (let index = 0; index < number; index++) {
                    let Gold = createOneGold(width ? width : 100, height ? height : 100, url ? url : SkinUrl[0]);
                    parent = parent ? parent : Laya.stage;
                    parent.addChild(Gold);
                    firstPoint = firstPoint ? firstPoint : new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2);
                    targetPoint = targetPoint ? targetPoint : new Laya.Point(Gold_1.GoldNode.x, Gold_1.GoldNode.y);
                    let x = Math.floor(Math.random() * 2) == 1 ? firstPoint.x + Math.random() * 100 : firstPoint.x - Math.random() * 100;
                    let y = Math.floor(Math.random() * 2) == 1 ? firstPoint.y + Math.random() * 100 : firstPoint.y - Math.random() * 100;
                    Animation2D.move_Scale(Gold, 0.5, firstPoint.x, firstPoint.y, x, y, 1, 300, Math.random() * 100 + 100, Laya.Ease.expoIn, () => {
                        Animation2D.move_Scale(Gold, 1, Gold.x, Gold.y, targetPoint.x, targetPoint.y, 1, 400, Math.random() * 200 + 100, Laya.Ease.cubicOut, () => {
                            PalyAudio.playSound(PalyAudio.voiceUrl.huodejinbi);
                            if (index === number - 1) {
                                Laya.timer.once(200, this, () => {
                                    if (func2) {
                                        func2();
                                    }
                                });
                            }
                            else {
                                if (func1) {
                                    func1();
                                }
                            }
                            Gold.removeSelf();
                        });
                    });
                }
            }
            Gold_1._getGoldAni_Heap = _getGoldAni_Heap;
            class GoldAniBase extends Laya.Script {
                onAwake() {
                    this.initProperty();
                }
                onEnable() {
                    this._Owner = this.owner;
                    this.selfScene = this._Owner.scene;
                    let _calssName = this['__proto__']['constructor'].name;
                    this._Owner[_calssName] = this;
                    this.timer = 0;
                    this.lwgInit();
                    this.propertyAssign();
                }
                lwgInit() {
                }
                initProperty() {
                }
                propertyAssign() {
                    if (this.startAlpha) {
                        this._Owner.alpha = this.startAlpha;
                    }
                    if (this.startScale) {
                        this._Owner.scale(this.startScale, this.startScale);
                    }
                    if (this.startRotat) {
                        this._Owner.rotation = this.startRotat;
                    }
                }
                commonSpeedXYByAngle(angle, speed) {
                    this._Owner.x += Tools.Point.SpeedXYByAngle(angle, speed + this.accelerated).x;
                    this._Owner.y += Tools.Point.SpeedXYByAngle(angle, speed + this.accelerated).y;
                }
                moveRules() {
                }
                onUpdate() {
                    this.moveRules();
                }
                onDisable() {
                    Laya.Pool.recover(this._Owner.name, this._Owner);
                    this.destroy();
                    Laya.Tween.clearAll(this);
                    Laya.timer.clearAll(this);
                }
            }
            Gold_1.GoldAniBase = GoldAniBase;
            class AddGold extends GoldAniBase {
                lwgInit() {
                    this._Owner.width = 115;
                    this._Owner.height = 111;
                    this._Owner.pivotX = this._Owner.width / 2;
                    this._Owner.pivotY = this._Owner.height / 2;
                }
                initProperty() {
                }
                moveRules() {
                    if (this.moveSwitch) {
                        this.timer++;
                        if (this.timer > 0) {
                            lwg.Animation2D.move_Scale(this._Owner, 1, this._Owner.x, this._Owner.y, this.targetX, this.targetY, 0.35, 250, 0, f => {
                                this._Owner.removeSelf();
                                if (this.func !== null) {
                                    this.func();
                                }
                            });
                            this.moveSwitch = false;
                        }
                    }
                }
            }
            Gold_1.AddGold = AddGold;
        })(Gold = lwg.Gold || (lwg.Gold = {}));
        let EventAdmin;
        (function (EventAdmin) {
            EventAdmin.dispatcher = new Laya.EventDispatcher();
            function _register(type, caller, listener) {
                if (!caller) {
                    console.error("事件的执行域必须存在!");
                }
                EventAdmin.dispatcher.on(type.toString(), caller, listener);
            }
            EventAdmin._register = _register;
            function _registerOnce(type, caller, listener) {
                if (!caller) {
                    console.error("事件的执行域必须存在!");
                }
                EventAdmin.dispatcher.once(type.toString(), caller, listener);
            }
            EventAdmin._registerOnce = _registerOnce;
            function _notify(type, args) {
                EventAdmin.dispatcher.event(type.toString(), args);
            }
            EventAdmin._notify = _notify;
            function _off(type, caller, listener) {
                EventAdmin.dispatcher.off(type.toString(), caller, listener);
            }
            EventAdmin._off = _off;
            function _offAll(type) {
                EventAdmin.dispatcher.offAll(type.toString());
            }
            EventAdmin._offAll = _offAll;
            function _offCaller(caller) {
                EventAdmin.dispatcher.offAllCaller(caller);
            }
            EventAdmin._offCaller = _offCaller;
        })(EventAdmin = lwg.EventAdmin || (lwg.EventAdmin = {}));
        let DateAdmin;
        (function (DateAdmin) {
            DateAdmin._date = {
                get year() {
                    return (new Date()).getFullYear();
                },
                get month() {
                    return (new Date()).getMonth();
                },
                get date() {
                    return (new Date()).getDate();
                },
                get day() {
                    return (new Date()).getDay();
                },
                get hours() {
                    return (new Date()).getHours();
                },
                get minutes() {
                    return (new Date()).getMinutes();
                },
                get seconds() {
                    return (new Date()).getSeconds();
                },
                get milliseconds() {
                    return (new Date()).getMilliseconds();
                },
                get toLocaleDateString() {
                    return (new Date()).toLocaleDateString();
                },
                get toLocaleTimeString() {
                    return (new Date()).toLocaleTimeString();
                }
            };
            DateAdmin._loginDate = {
                get value() {
                    let data;
                    let dataArr = [];
                    let d = new Date();
                    let date1 = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay()];
                    try {
                        data = Laya.LocalStorage.getJSON('DateAdmin_loginDate');
                        let dataArr = [];
                        dataArr = JSON.parse(data);
                        let equal = false;
                        for (let index = 0; index < dataArr.length; index++) {
                            if (dataArr[index].toString() == date1.toString()) {
                                equal = true;
                            }
                        }
                        if (!equal) {
                            dataArr.push(date1);
                        }
                    }
                    catch (error) {
                        if (dataArr.length == 0) {
                            dataArr.push(date1);
                        }
                    }
                    Laya.LocalStorage.setJSON('DateAdmin_loginDate', JSON.stringify(dataArr));
                    return dataArr;
                },
            };
            DateAdmin._loginNumber = {
                get value() {
                    return Laya.LocalStorage.getItem('DateAdmin_loginNumber') ? Number(Laya.LocalStorage.getItem('DateAdmin_loginNumber')) : 1;
                },
                set value(val) {
                    Laya.LocalStorage.setItem('DateAdmin_loginNumber', val.toString());
                }
            };
            DateAdmin._last = {
                get date() {
                    return Laya.LocalStorage.getItem('DateAdmin_last') ? Number(Laya.LocalStorage.getItem('DateAdmin_last')) : DateAdmin._date.date;
                },
                setLastDate() {
                    Laya.LocalStorage.setItem('DateAdmin_last', DateAdmin._date.date.toString());
                }
            };
        })(DateAdmin = lwg.DateAdmin || (lwg.DateAdmin = {}));
        let TimerAdmin;
        (function (TimerAdmin) {
            function _frameLoop(delay, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    method();
                }
                Laya.timer.frameLoop(delay, caller, () => {
                    method();
                }, args, coverBefore);
            }
            TimerAdmin._frameLoop = _frameLoop;
            function _frameRandomLoop(delay1, delay2, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    method();
                }
                var func = () => {
                    let delay = Tools.randomOneInt(delay1, delay2);
                    Laya.timer.frameOnce(delay, caller, () => {
                        method();
                        func();
                    }, args, coverBefore);
                };
                func();
            }
            TimerAdmin._frameRandomLoop = _frameRandomLoop;
            function _frameNumLoop(delay, num, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    method();
                }
                let num0 = 0;
                var func = () => {
                    num0++;
                    if (num0 > num) {
                        Laya.timer.clear(caller, func);
                    }
                    else {
                        method();
                    }
                };
                Laya.timer.frameLoop(delay, caller, func, args, coverBefore);
            }
            TimerAdmin._frameNumLoop = _frameNumLoop;
            function _frameOnce(delay, caller, afterMethod, beforeMethod, args, coverBefore) {
                if (beforeMethod) {
                    beforeMethod();
                }
                Laya.timer.frameOnce(delay, caller, () => {
                    afterMethod();
                }, args, coverBefore);
            }
            TimerAdmin._frameOnce = _frameOnce;
            function _loop(delay, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    method();
                }
                Laya.timer.loop(delay, caller, () => {
                    method();
                }, args, coverBefore);
            }
            TimerAdmin._loop = _loop;
            function _randomLoop(delay1, delay2, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    method();
                }
                var func = () => {
                    let delay = Tools.randomOneInt(delay1, delay2);
                    Laya.timer.once(delay, caller, () => {
                        method();
                        func();
                    }, args, coverBefore);
                };
                func();
            }
            TimerAdmin._randomLoop = _randomLoop;
            function _numLoop(delay, num, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    method();
                }
                let num0 = 0;
                var func = () => {
                    num0++;
                    if (num0 > num) {
                        Laya.timer.clear(caller, func);
                    }
                    else {
                        method();
                    }
                };
                Laya.timer.loop(delay, caller, func, args, coverBefore);
            }
            TimerAdmin._numLoop = _numLoop;
            function _once(delay, afterMethod, beforeMethod, args, coverBefore) {
                if (beforeMethod) {
                    beforeMethod();
                }
                let caller = {};
                Laya.timer.once(delay, caller, () => {
                    afterMethod();
                }, args, coverBefore);
            }
            TimerAdmin._once = _once;
        })(TimerAdmin = lwg.TimerAdmin || (lwg.TimerAdmin = {}));
        let Admin;
        (function (Admin) {
            Admin._platform = {
                tpye: {
                    Bytedance: 'Bytedance',
                    WeChat: 'WeChat',
                    OPPO: 'OPPO',
                    OPPOTest: 'OPPOTest',
                    VIVO: 'VIVO',
                    General: 'General',
                    Web: 'Web',
                    WebTest: 'WebTest',
                    Research: 'Research',
                },
                get ues() {
                    return this['_platform_name'] ? this['_platform_name'] : null;
                },
                set ues(val) {
                    this['_platform_name'] = val;
                    switch (val) {
                        case Admin._platform.tpye.WebTest:
                            Laya.LocalStorage.clear();
                            _Gold._num.value = 5000;
                            break;
                        case Admin._platform.tpye.Research:
                            Laya.Stat.show();
                            _Gold._num.value = 50000000000000;
                            break;
                        default:
                            break;
                    }
                }
            };
            Admin._game = {
                switch: true,
                get level() {
                    return Laya.LocalStorage.getItem('_gameLevel') ? Number(Laya.LocalStorage.getItem('_gameLevel')) : 1;
                },
                set level(val) {
                    let diff = val - this.level;
                    if (diff > 0) {
                        this.maxLevel += diff;
                    }
                    if (val > this.loopLevel && this.loopLevel != -1) {
                        Laya.LocalStorage.setItem('_gameLevel', (1).toString());
                    }
                    else {
                        Laya.LocalStorage.setItem('_gameLevel', (val).toString());
                    }
                },
                get maxLevel() {
                    return Laya.LocalStorage.getItem('_game_maxLevel') ? Number(Laya.LocalStorage.getItem('_game_maxLevel')) : this.level;
                },
                set maxLevel(val) {
                    Laya.LocalStorage.setItem('_game_maxLevel', val.toString());
                },
                get loopLevel() {
                    return this['_gameloopLevel'] ? this['_gameloopLevel'] : -1;
                },
                set loopLevel(lev) {
                    this['_gameloopLevel'] = lev;
                },
                LevelNode: new Laya.Sprite,
                _createLevel(parent, x, y) {
                    let sp;
                    Laya.loader.load('prefab/LevelNode.json', Laya.Handler.create(this, function (prefab) {
                        let _prefab = new Laya.Prefab();
                        _prefab.json = prefab;
                        sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                        parent.addChild(sp);
                        sp.pos(x, y);
                        sp.zOrder = 0;
                        let level = sp.getChildByName('level');
                        Admin._game.LevelNode = sp;
                    }));
                },
                pause: {
                    get switch() {
                        return Admin._game.switch;
                    },
                    set switch(bool) {
                        this.bool = bool;
                        if (bool) {
                            Admin._game.switch = false;
                            Laya.timer.pause();
                        }
                        else {
                            Admin._game.switch = true;
                            Laya.timer.resume();
                        }
                    }
                }
            };
            class _Game {
            }
            Admin._Game = _Game;
            Admin._clickLock = {
                get switch() {
                    return Laya.stage.getChildByName('__stageClickLock__') ? true : false;
                },
                set switch(bool) {
                    if (bool) {
                        if (!Laya.stage.getChildByName('__stageClickLock__')) {
                            console.log('锁住点击！');
                            let __stageClickLock__ = new Laya.Sprite();
                            __stageClickLock__.name = '__stageClickLock__';
                            Laya.stage.addChild(__stageClickLock__);
                            __stageClickLock__.zOrder = 3000;
                            __stageClickLock__.width = Laya.stage.width;
                            __stageClickLock__.height = Laya.stage.height;
                            __stageClickLock__.pos(0, 0);
                            Click._on(Click._Effect.type.no, __stageClickLock__, this, null, null, (e) => {
                                console.log('舞台点击被锁住了！请用admin._clickLock=false解锁');
                                e.stopPropagation();
                            });
                        }
                        else {
                        }
                    }
                    else {
                        if (Laya.stage.getChildByName('__stageClickLock__')) {
                            Laya.stage.getChildByName('__stageClickLock__').removeSelf();
                        }
                    }
                }
            };
            function _secneLockClick(scene) {
                _unlockPreventClick(scene);
                let __lockClick__ = new Laya.Sprite();
                scene.addChild(__lockClick__);
                __lockClick__.zOrder = 1000;
                __lockClick__.name = '__lockClick__';
                __lockClick__.width = Laya.stage.width;
                __lockClick__.height = Laya.stage.height;
                __lockClick__.pos(0, 0);
                Click._on(Click._Effect.type.no, __lockClick__, this, null, null, (e) => {
                    console.log('场景点击被锁住了！请用admin._unlockPreventClick（）解锁');
                    e.stopPropagation();
                });
            }
            Admin._secneLockClick = _secneLockClick;
            function _unlockPreventClick(scene) {
                let __lockClick__ = scene.getChildByName('__lockClick__');
                if (__lockClick__) {
                    __lockClick__.removeSelf();
                }
            }
            Admin._unlockPreventClick = _unlockPreventClick;
            Admin._sceneControl = {};
            Admin._sceneScript = {};
            Admin._moudel = {};
            let _SceneName;
            (function (_SceneName) {
                _SceneName["PreLoad"] = "PreLoad";
                _SceneName["PreLoadStep"] = "PreLoadStep";
                _SceneName["Guide"] = "Guide";
                _SceneName["Start"] = "Start";
                _SceneName["Shop"] = "Shop";
                _SceneName["Task"] = "Task";
                _SceneName["Set"] = "Set";
                _SceneName["Skin"] = "Skin";
                _SceneName["Puase"] = "Puase";
                _SceneName["Share"] = "Share";
                _SceneName["Game3D"] = "Game3D";
                _SceneName["Victory"] = "Victory";
                _SceneName["Defeated"] = "Defeated";
                _SceneName["PassHint"] = "PassHint";
                _SceneName["SkinTry"] = "SkinTry";
                _SceneName["Redeem"] = "Redeem";
                _SceneName["Turntable"] = "Turntable";
                _SceneName["CaidanPifu"] = "CaidanPifu";
                _SceneName["Operation"] = "Operation";
                _SceneName["VictoryBox"] = "VictoryBox";
                _SceneName["CheckIn"] = "CheckIn";
                _SceneName["Resurgence"] = "Resurgence";
                _SceneName["AdsHint"] = "AdsHint";
                _SceneName["LwgInit"] = "LwgInit";
                _SceneName["Game"] = "Game";
                _SceneName["SmallHint"] = "SmallHint";
                _SceneName["DrawCard"] = "DrawCard";
                _SceneName["PropTry"] = "PropTry";
                _SceneName["Card"] = "Card";
                _SceneName["ExecutionHint"] = "ExecutionHint";
                _SceneName["SkinQualified"] = "SkinQualified";
                _SceneName["Eastereggister"] = "Eastereggister";
                _SceneName["SelectLevel"] = "SelectLevel";
                _SceneName["Settle"] = "Settle";
                _SceneName["Special"] = "Special";
                _SceneName["Compound"] = "Compound";
            })(_SceneName = Admin._SceneName || (Admin._SceneName = {}));
            function _preLoadOpenScene(openName, cloesName, func, zOrder) {
                _openScene(_SceneName.PreLoadStep);
                Admin._preLoadOpenSceneLater.openName = openName;
                Admin._preLoadOpenSceneLater.cloesName = cloesName;
                Admin._preLoadOpenSceneLater.func = func;
                Admin._preLoadOpenSceneLater.zOrder = zOrder;
            }
            Admin._preLoadOpenScene = _preLoadOpenScene;
            Admin._preLoadOpenSceneLater = {
                openName: null,
                cloesName: null,
                func: null,
                zOrder: null,
            };
            function _openScene(openName, cloesName, func, zOrder) {
                Admin._clickLock.switch = true;
                Laya.Scene.load('Scene/' + openName + '.json', Laya.Handler.create(this, function (scene) {
                    if (Admin._moudel['_' + openName]) {
                        if (Admin._moudel['_' + openName][openName]) {
                            if (!scene.getComponent(Admin._moudel['_' + openName][openName])) {
                                scene.addComponent(Admin._moudel['_' + openName][openName]);
                            }
                        }
                    }
                    else {
                        console.log(`${openName}场景没有同名脚本！`);
                    }
                    scene.width = Laya.stage.width;
                    scene.height = Laya.stage.height;
                    var openf = () => {
                        if (Tools.Node.checkChildren(Laya.stage, openName)) {
                            console.log(openName, '场景重复出现！请检查代码');
                            return;
                        }
                        if (zOrder) {
                            Laya.stage.addChildAt(scene, zOrder);
                        }
                        else {
                            Laya.stage.addChild(scene);
                        }
                        if (func) {
                            func();
                        }
                    };
                    scene.name = openName;
                    Admin._sceneControl[openName] = scene;
                    let background = scene.getChildByName('Background');
                    if (background) {
                        background.width = Laya.stage.width;
                        background.height = Laya.stage.height;
                    }
                    if (Admin._sceneControl[cloesName]) {
                        _closeScene(cloesName, openf);
                    }
                    else {
                        openf();
                    }
                }));
            }
            Admin._openScene = _openScene;
            function _closeScene(closeName, func) {
                if (!Admin._sceneControl[closeName]) {
                    console.log('场景', closeName, '关闭失败！可能是名称不对！');
                    return;
                }
                var closef = () => {
                    Admin._clickLock.switch = false;
                    Admin._sceneControl[closeName].close();
                    if (func) {
                        func();
                    }
                };
                if (!Admin._sceneAnimation.vanishSwitch) {
                    closef();
                    return;
                }
                let cloesSceneScript = Admin._sceneControl[closeName][Admin._sceneControl[closeName].name];
                if (cloesSceneScript) {
                    if (cloesSceneScript) {
                        Admin._clickLock.switch = true;
                        cloesSceneScript.lwgBeforeVanishAni();
                        let time0 = cloesSceneScript.lwgVanishAni();
                        if (time0 !== null) {
                            Laya.timer.once(time0, this, () => {
                                closef();
                                Admin._clickLock.switch = false;
                            });
                        }
                        else {
                            _commonVanishAni(Admin._sceneControl[closeName], closef);
                        }
                    }
                }
            }
            Admin._closeScene = _closeScene;
            Admin._sceneAnimation = {
                type: {
                    fadeOut: 'fadeOut',
                    stickIn: {
                        random: 'random',
                        upLeftDownLeft: 'upLeftDownRight',
                        upRightDownLeft: 'upRightDownLeft',
                    },
                    leftMove: 'leftMove',
                    rightMove: 'rightMove',
                    centerRotate: 'centerRotate',
                    drawUp: 'drawUp',
                },
                vanishSwitch: false,
                openSwitch: true,
                use: 'fadeOut',
            };
            function _commonVanishAni(CloseScene, closeFunc) {
                CloseScene[CloseScene.name].lwgBeforeVanishAni();
                let time;
                let delay;
                switch (Admin._sceneAnimation.use) {
                    case Admin._sceneAnimation.type.fadeOut:
                        time = 150;
                        delay = 50;
                        if (CloseScene['Background']) {
                            Animation2D.fadeOut(CloseScene, 1, 0, time / 2);
                        }
                        Animation2D.fadeOut(CloseScene, 1, 0, time, delay, () => {
                            closeFunc();
                        });
                        break;
                    case Admin._sceneAnimation.type.stickIn.random:
                        closeFunc();
                        break;
                    default:
                        break;
                }
            }
            function _commonOpenAni(Scene) {
                let time;
                let delay;
                let sumDelay;
                var afterAni = () => {
                    Admin._clickLock.switch = false;
                    if (Scene[Scene.name]) {
                        Scene[Scene.name].lwgOpenAniAfter();
                        Scene[Scene.name].lwgBtnRegister();
                    }
                };
                switch (Admin._sceneAnimation.use) {
                    case Admin._sceneAnimation.type.fadeOut:
                        time = 400;
                        delay = 300;
                        if (Scene['Background']) {
                            Animation2D.fadeOut(Scene, 0, 1, time / 2, delay);
                        }
                        Animation2D.fadeOut(Scene, 0, 1, time, 0);
                        sumDelay = 400;
                        break;
                    case Admin._sceneAnimation.type.stickIn.upLeftDownLeft:
                        _sceneAnimationTypeStickIn(Scene, Admin._sceneAnimation.type.stickIn.upLeftDownLeft);
                        break;
                    case Admin._sceneAnimation.type.stickIn.upRightDownLeft:
                        _sceneAnimationTypeStickIn(Scene, Admin._sceneAnimation.type.stickIn.upRightDownLeft);
                    case Admin._sceneAnimation.type.stickIn.random:
                        _sceneAnimationTypeStickIn(Scene, Admin._sceneAnimation.type.stickIn.random);
                    default:
                        break;
                }
                Laya.timer.once(sumDelay, this, () => {
                    afterAni();
                });
                return sumDelay;
            }
            function _sceneAnimationTypeStickIn(Scene, type) {
                let sumDelay = 0;
                let time = 700;
                let delay = 100;
                if (Scene.getChildByName('Background')) {
                    Animation2D.fadeOut(Scene.getChildByName('Background'), 0, 1, time);
                }
                let stickInLeftArr = Tools.Node.zOrderByY(Scene, false);
                for (let index = 0; index < stickInLeftArr.length; index++) {
                    const element = stickInLeftArr[index];
                    if (element.name !== 'Background' && element.name.substr(0, 5) !== 'NoAni') {
                        let originalPovitX = element.pivotX;
                        let originalPovitY = element.pivotY;
                        switch (type) {
                            case Admin._sceneAnimation.type.stickIn.upLeftDownLeft:
                                element.rotation = element.y > Laya.stage.height / 2 ? -180 : 180;
                                Tools.Node.changePovit(element, 0, 0);
                                break;
                            case Admin._sceneAnimation.type.stickIn.upRightDownLeft:
                                element.rotation = element.y > Laya.stage.height / 2 ? -180 : 180;
                                Tools.Node.changePovit(element, element.rotation == 180 ? element.width : 0, 0);
                                break;
                            case Admin._sceneAnimation.type.stickIn.random:
                                element.rotation = Tools.randomOneHalf() == 1 ? 180 : -180;
                                Tools.Node.changePovit(element, Tools.randomOneHalf() == 1 ? 0 : element.width, Tools.randomOneHalf() == 1 ? 0 : element.height);
                                break;
                            default:
                                break;
                        }
                        let originalX = element.x;
                        let originalY = element.y;
                        element.x = element.pivotX > element.width / 2 ? 800 + element.width : -800 - element.width;
                        element.y = element.rotation > 0 ? element.y + 200 : element.y - 200;
                        Animation2D.simple_Rotate(element, element.rotation, 0, time, delay * index);
                        Animation2D.move_Simple(element, element.x, element.y, originalX, originalY, time, delay * index, () => {
                            Tools.Node.changePovit(element, originalPovitX, originalPovitY);
                        });
                    }
                }
                sumDelay = Scene.numChildren * delay + time + 200;
                return sumDelay;
            }
            Admin._gameState = {
                type: {
                    Start: 'Start',
                    Play: 'Play',
                    Pause: 'pause',
                    Victory: 'victory',
                    Defeated: 'defeated',
                },
                state: 'Start',
                setState(_calssName) {
                    switch (_calssName) {
                        case _SceneName.Start:
                            Admin._gameState.state = Admin._gameState.type.Start;
                            break;
                        case _SceneName.Game:
                            Admin._gameState.state = Admin._gameState.type.Play;
                            break;
                        case _SceneName.Defeated:
                            Admin._gameState.state = Admin._gameState.type.Defeated;
                            break;
                        case _SceneName.Victory:
                            Admin._gameState.state = Admin._gameState.type.Victory;
                            break;
                        default:
                            break;
                    }
                }
            };
            class _SceneBase extends Laya.Script {
                constructor() {
                    super();
                    this._calssName = _SceneName.PreLoad;
                }
                get _Owner() {
                    return this.owner;
                }
                _SpriteVar(str) {
                    if (this._Owner[str]) {
                        return this._Owner[str];
                    }
                    else {
                        console.log('场景内不存在全局节点：', str);
                        return undefined;
                    }
                }
                _AniVar(str) {
                    if (this._Owner[str]) {
                        return this._Owner[str];
                    }
                    else {
                        console.log('场景内不存在动画：', str);
                        return undefined;
                    }
                }
                _btnVar(str) {
                    if (this._Owner[str]) {
                        return this._Owner[str];
                    }
                    else {
                        console.log('场景内不存在全局按钮：', str);
                        return undefined;
                    }
                }
                _ImgVar(str) {
                    if (this._Owner[str]) {
                        return this._Owner[str];
                    }
                    else {
                        console.log('场景内不存在全局节点：', str);
                        return undefined;
                    }
                }
                _ListVar(str) {
                    if (this._Owner[str]) {
                        return this._Owner[str];
                    }
                    else {
                        console.log('场景内不存在全局节点：', str);
                    }
                }
                _TapVar(str) {
                    if (this._Owner[str]) {
                        return this._Owner[str];
                    }
                    else {
                        console.log('场景内不存在全局节点：', str);
                    }
                }
                onAwake() {
                    if (this._Owner.name == null) {
                        console.log('场景名称失效，脚本赋值失败');
                    }
                    else {
                        this._calssName = this._Owner.name;
                        this._Owner[this._calssName] = this;
                    }
                    Admin._gameState.setState(this._calssName);
                    this.moduleOnAwake();
                    this.lwgOnAwake();
                    this.lwgAdaptive();
                }
                lwgOnAwake() { }
                ;
                moduleOnAwake() { }
                onEnable() {
                    this.moduleEventRegister();
                    this.lwgEventRegister();
                    this.moduleOnEnable();
                    this.lwgOnEnable();
                    this.btnAndlwgOpenAni();
                }
                moduleOnEnable() { }
                ;
                lwgEventRegister() { }
                ;
                moduleEventRegister() { }
                ;
                lwgOnEnable() { }
                onStart() {
                    this.moduleOnStart();
                    this.lwgOnStart();
                }
                _openScene(openName, closeSelf, func, zOrder) {
                    let closeName;
                    if (closeSelf == undefined || closeSelf == true) {
                        closeName = this._Owner.name;
                    }
                    Admin._openScene(openName, closeName, func, zOrder);
                }
                _closeScene(sceneName, func) {
                    Admin._closeScene(sceneName ? sceneName : this._Owner.name, func);
                }
                lwgOnStart() { }
                moduleOnStart() { }
                btnAndlwgOpenAni() {
                    let time = this.lwgOpenAni();
                    if (time !== null) {
                        Laya.timer.once(time, this, () => {
                            Admin._clickLock.switch = false;
                            this.lwgOpenAniAfter();
                            this.lwgBtnRegister();
                        });
                    }
                    else {
                        time = _commonOpenAni(this._Owner);
                    }
                }
                lwgOpenAni() { return null; }
                ;
                lwgOpenAniAfter() { }
                ;
                lwgBtnRegister() { }
                ;
                _btnUp(target, up, effect) {
                    Click._on(effect ? effect : Click._Effect.use, target, this, null, null, up, null);
                }
                _btnDown(target, down, effect) {
                    Click._on(effect ? effect : Click._Effect.use, target, this, down, null, null, null);
                }
                _btnAll(target, down, move, up, out, effect) {
                    Click._on(effect ? effect : Click._Effect.use, target, this, down, move, up, out);
                }
                lwgAdaptive() { }
                ;
                _adaptiveHeight(arr) {
                    for (let index = 0; index < arr.length; index++) {
                        const element = arr[index];
                        element.y / GameConfig.height * Laya.stage.height;
                    }
                }
                ;
                _adaptiveWidth(arr) {
                    for (let index = 0; index < arr.length; index++) {
                        const element = arr[index];
                        element.x / GameConfig.width * Laya.stage.width;
                    }
                }
                ;
                onUpdate() { this.lwgOnUpdate(); }
                ;
                lwgOnUpdate() { }
                ;
                lwgBeforeVanishAni() { }
                lwgVanishAni() { return null; }
                ;
                onDisable() {
                    Animation2D.fadeOut(this._Owner, 1, 0, 2000, 1);
                    this.lwgOnDisable();
                    Laya.timer.clearAll(this);
                    Laya.Tween.clearAll(this);
                    EventAdmin._offCaller(this);
                }
                lwgOnDisable() { }
                ;
            }
            Admin._SceneBase = _SceneBase;
            class _ObjectBase extends Laya.Script {
                constructor() {
                    super();
                }
                get _Owner() {
                    return this.owner;
                }
                get _OwnerScene() {
                    return this.owner.scene;
                }
                get _RigidBody() {
                    if (!this._Owner['_OwnerRigidBody']) {
                        this._Owner['_OwnerRigidBody'] = this._Owner.getComponent(Laya.RigidBody);
                    }
                    return this._Owner['_OwnerRigidBody'];
                }
                get _BoxCollier() {
                    if (!this._Owner['_OwnerBoxCollier']) {
                        this._Owner['_OwnerBoxCollier'] = this._Owner.getComponent(Laya.BoxCollider);
                    }
                    return this._Owner['_OwnerBoxCollier'];
                }
                get _CilrcleCollier() {
                    if (!this._Owner['_OwnerCilrcleCollier']) {
                        this._Owner['_OwnerCilrcleCollier'] = this._Owner.getComponent(Laya.BoxCollider);
                    }
                    return this._Owner['_OwnerCilrcleCollier'];
                }
                get _PolygonCollier() {
                    if (!this._Owner['_OwnerPolygonCollier']) {
                        this._Owner['_OwnerPolygonCollier'] = this._Owner.getComponent(Laya.BoxCollider);
                    }
                    return this._Owner['_OwnerPolygonCollier'];
                }
                onAwake() {
                    let _calssName = this['__proto__']['constructor'].name;
                    this._Owner[_calssName] = this;
                    this.lwgOnAwake();
                    this.lwgAdaptive();
                }
                lwgAdaptive() { }
                ;
                _adaptiveHeight(arr) {
                    for (let index = 0; index < arr.length; index++) {
                        const element = arr[index];
                        element.y / GameConfig.height * Laya.stage.height;
                    }
                }
                ;
                _adaptiveWidth(arr) {
                    for (let index = 0; index < arr.length; index++) {
                        const element = arr[index];
                        element.x / GameConfig.width * Laya.stage.width;
                    }
                }
                ;
                _ImgChild(str) {
                    if (this._Owner.getChildByName(str)) {
                        return this._Owner.getChildByName(str);
                    }
                    else {
                        console.log('场景内不存在子节点：', str);
                        return null;
                    }
                }
                lwgOpenScene(openName, closeSelf, func, zOrder) {
                    let closeName;
                    if (closeSelf == undefined || closeSelf == true) {
                        closeName = this._OwnerScene.name;
                    }
                    Admin._openScene(openName, closeName, func, zOrder);
                }
                lwgCloseScene(sceneName, func) {
                    Admin._closeScene(sceneName ? sceneName : this._Owner.name, func);
                }
                lwgOnAwake() { }
                onEnable() {
                    this.lwgBtnRegister();
                    this.lwgEventRegister();
                    this.lwgOnEnable();
                }
                lwgOnEnable() { }
                lwgBtnRegister() { }
                _btnUp(target, up, effect) {
                    Click._on(effect ? effect : Click._Effect.use, target, this, null, null, up, null);
                }
                _btnDown(target, down, effect) {
                    Click._on(effect ? effect : Click._Effect.use, target, this, down, null, null, null);
                }
                _btnAll(target, down, move, up, out, effect) {
                    Click._on(effect ? effect : Click._Effect.use, target, this, down, move, up, out);
                }
                lwgEventRegister() { }
                onStart() {
                    this.lwgOnStart();
                }
                lwgOnStart() { }
                onUpdate() {
                    this.lwgOnUpdate();
                }
                lwgOnUpdate() { }
                onDisable() {
                    this.lwgOnDisable();
                    Laya.timer.clearAll(this);
                    EventAdmin._offCaller(this);
                }
                lwgOnDisable() { }
            }
            Admin._ObjectBase = _ObjectBase;
        })(Admin = lwg.Admin || (lwg.Admin = {}));
        let DataAdmin;
        (function (DataAdmin) {
            class _Store {
                getVariables() {
                }
            }
            DataAdmin._Store = _Store;
            class _Table {
                constructor(dataName, arrUrl, localStorage, proName) {
                    this._property = {
                        name: 'name',
                        chName: 'chName',
                        classify: 'classify',
                        unlockWay: 'unlockWay',
                        conditionNum: 'conditionNum',
                        degreeNum: 'degreeNum',
                        compelet: 'compelet',
                        unlock: 'unlock',
                        have: 'have',
                        getAward: 'getAward',
                    };
                    this._arr = [];
                    if (dataName) {
                        if (localStorage) {
                            this._arr = Tools.jsonCompare(arrUrl, dataName, proName ? proName : 'name');
                        }
                        else {
                            if (Laya.Loader.getRes(arrUrl)) {
                                this._arr = Laya.Loader.getRes(arrUrl);
                            }
                            else {
                                console.log(arrUrl, '数据表不存在！');
                            }
                        }
                    }
                }
                _getProperty(name, pro) {
                    let value;
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
                }
                ;
                _setProperty(name, pro, value) {
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element[this._property.name] == name) {
                                element[pro] = value;
                                break;
                            }
                        }
                    }
                    return value;
                }
                ;
                _randomOne(proName, value) {
                    let data1;
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element[proName]) {
                                arr.push(element);
                            }
                        }
                    }
                    if (arr.length == 0) {
                        return null;
                    }
                    else {
                        let any = Tools.arrayRandomGetOne(arr);
                        return any;
                    }
                }
                _getPropertyArr(proName, value) {
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
                _setPropertyArr(proName, value) {
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
                    return arr;
                }
                _checkCondition(name, number, func) {
                    let chek = null;
                    number = number == undefined ? 1 : number;
                    let degreeNum = this._getProperty(name, this._property.degreeNum);
                    let condition = this._getProperty(name, this._property.conditionNum);
                    let compelet = this._getProperty(name, this._property.compelet);
                    if (!compelet) {
                        if (condition <= degreeNum + number) {
                            this._setProperty(name, this._property.degreeNum, condition);
                            this._setProperty(name, this._property.compelet, true);
                            chek = true;
                        }
                        else {
                            this._setProperty(name, this._property.degreeNum, degreeNum + number);
                            chek = false;
                        }
                    }
                    else {
                        chek = -1;
                    }
                    if (func) {
                        func();
                    }
                    return chek;
                }
            }
            DataAdmin._Table = _Table;
        })(DataAdmin = lwg.DataAdmin || (lwg.DataAdmin = {}));
        let Color;
        (function (Color) {
            function RGBToHexString(r, g, b) {
                return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
            }
            Color.RGBToHexString = RGBToHexString;
            function HexStringToRGB(str) {
                let arr = [];
                return arr;
            }
            Color.HexStringToRGB = HexStringToRGB;
            function _colour(node, RGBA, vanishtime) {
                let cf = new Laya.ColorFilter();
                node.blendMode = 'null';
                if (!RGBA) {
                    cf.color(Tools.randomOneNumber(255, 100, true), Tools.randomOneNumber(255, 100, true), Tools.randomOneNumber(255, 100, true), 1);
                }
                else {
                    cf.color(RGBA[0], RGBA[1], RGBA[2], RGBA[3]);
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
                    });
                }
                return cf;
            }
            Color._colour = _colour;
            function _changeOnce(node, RGBA, time, func) {
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
                        if (speedA !== 0)
                            A += speedA;
                        if (R >= RGBA[0]) {
                            caller.add = false;
                        }
                    }
                    else {
                        R -= speedR;
                        G -= speedG;
                        B -= speedB;
                        if (speedA !== 0)
                            A -= speedA;
                        if (R <= 0) {
                            if (func) {
                                func();
                            }
                            Laya.timer.clearAll(caller);
                        }
                    }
                    cf.color(R, G, B, A);
                    node.filters = [cf];
                });
            }
            Color._changeOnce = _changeOnce;
            function _changeConstant(node, RGBA1, RGBA2, frameTime) {
                let cf;
                let RGBA0 = [];
                if (!node.filters) {
                    cf = new Laya.ColorFilter();
                    cf.color(RGBA1[0], RGBA1[1], RGBA1[2], RGBA1[3] ? RGBA1[3] : 1);
                    RGBA0 = [RGBA1[0], RGBA1[1], RGBA1[2], RGBA1[3] ? RGBA1[3] : 1];
                    node.filters = [cf];
                }
                else {
                    cf = node.filters[0];
                    RGBA0 = [node.filters[0]['_alpha'][0], node.filters[0]['_alpha'][1], node.filters[0]['_alpha'][2], node.filters[0]['_alpha'][3] ? node.filters[0]['_alpha'][3] : 1];
                }
                let RGBA = [Tools.randomCountNumer(RGBA1[0], RGBA2[0])[0], Tools.randomCountNumer(RGBA1[1], RGBA2[1])[0], Tools.randomCountNumer(RGBA1[2], RGBA2[2])[0], Tools.randomCountNumer(RGBA1[3] ? RGBA1[3] : 1, RGBA2[3] ? RGBA2[3] : 1)[0]];
                let speedR = (RGBA[0] - RGBA0[0]) / frameTime;
                let speedG = (RGBA[1] - RGBA0[1]) / frameTime;
                let speedB = (RGBA[2] - RGBA0[2]) / frameTime;
                let speedA = 0;
                if (RGBA[3]) {
                    speedA = (RGBA[3] - RGBA0[3]) / frameTime;
                }
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
                    }
                    else {
                        Laya.timer.clearAll(changeCaller);
                    }
                    cf.color(RGBA0[0], RGBA0[1], RGBA0[2], RGBA0[3]);
                    node.filters = [cf];
                });
            }
            Color._changeConstant = _changeConstant;
        })(Color = lwg.Color || (lwg.Color = {}));
        let Effects;
        (function (Effects) {
            let _SkinUrl;
            (function (_SkinUrl) {
                _SkinUrl["\u7231\u5FC31"] = "Frame/Effects/aixin1.png";
                _SkinUrl["\u7231\u5FC32"] = "Frame/Effects/aixin2.png";
                _SkinUrl["\u7231\u5FC33"] = "Frame/Effects/aixin3.png";
                _SkinUrl["\u82B11"] = "Frame/Effects/hua1.png";
                _SkinUrl["\u82B12"] = "Frame/Effects/hua2.png";
                _SkinUrl["\u82B13"] = "Frame/Effects/hua3.png";
                _SkinUrl["\u82B14"] = "Frame/Effects/hua4.png";
                _SkinUrl["\u661F\u661F1"] = "Frame/Effects/star1.png";
                _SkinUrl["\u661F\u661F2"] = "Frame/Effects/star2.png";
                _SkinUrl["\u661F\u661F3"] = "Frame/Effects/star3.png";
                _SkinUrl["\u661F\u661F4"] = "Frame/Effects/star4.png";
                _SkinUrl["\u661F\u661F5"] = "Frame/Effects/star5.png";
                _SkinUrl["\u661F\u661F6"] = "Frame/Effects/star6.png";
                _SkinUrl["\u661F\u661F7"] = "Frame/Effects/star7.png";
                _SkinUrl["\u96EA\u82B11"] = "Frame/Effects/xuehua1.png";
                _SkinUrl["\u53F6\u5B501"] = "Frame/Effects/yezi1.png";
                _SkinUrl["\u5706\u5F62\u53D1\u51491"] = "Frame/Effects/yuanfaguang.png";
                _SkinUrl["\u5706\u5F621"] = "Frame/Effects/yuan1.png";
                _SkinUrl["\u5149\u57081"] = "Frame/Effects/guangquan1.png";
                _SkinUrl["\u5149\u57082"] = "Frame/Effects/guangquan2.png";
            })(_SkinUrl = Effects._SkinUrl || (Effects._SkinUrl = {}));
            let _Aperture;
            (function (_Aperture) {
                class _ApertureImage extends Laya.Image {
                    constructor(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, zOrder) {
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
                        this.rotation = rotation ? Tools.randomOneNumber(rotation[0], rotation[1]) : Tools.randomOneNumber(360);
                        this.skin = urlArr ? Tools.arrayRandomGetOne(urlArr) : _SkinUrl.花3;
                        this.zOrder = zOrder ? zOrder : 0;
                        this.alpha = 0;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][0], colorRGBA[1][0]) : Tools.randomOneNumber(0, 255);
                        RGBA[1] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][1], colorRGBA[1][1]) : Tools.randomOneNumber(0, 255);
                        RGBA[2] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][2], colorRGBA[1][2]) : Tools.randomOneNumber(0, 255);
                        RGBA[3] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][3], colorRGBA[1][3]) : Tools.randomOneNumber(0, 255);
                        Color._colour(this, RGBA);
                    }
                }
                _Aperture._ApertureImage = _ApertureImage;
                function _continuous(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, zOrder, scale, speed, accelerated) {
                    let Img = new _ApertureImage(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, zOrder);
                    let _speed = speed ? Tools.randomOneNumber(speed[0], speed[1]) : 0.025;
                    let _accelerated = accelerated ? Tools.randomOneNumber(accelerated[0], accelerated[1]) : 0.0005;
                    let _scale = scale ? Tools.randomOneNumber(scale[0], scale[1]) : 2;
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
                        }
                        else if (moveCaller.scale) {
                            acc += _accelerated;
                            if (Img.scaleX > _scale) {
                                moveCaller.scale = false;
                                moveCaller.vanish = true;
                            }
                        }
                        else if (moveCaller.vanish) {
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
                    });
                }
                _Aperture._continuous = _continuous;
            })(_Aperture = Effects._Aperture || (Effects._Aperture = {}));
            let _Particle;
            (function (_Particle) {
                class _ParticleImgBase extends Laya.Image {
                    constructor(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder) {
                        super();
                        parent.addChild(this);
                        let sectionWidth = sectionWH ? Tools.randomOneNumber(sectionWH[0]) : Tools.randomOneNumber(200);
                        let sectionHeight = sectionWH ? Tools.randomOneNumber(sectionWH[1]) : Tools.randomOneNumber(50);
                        sectionWidth = Tools.randomOneHalf() == 0 ? sectionWidth : -sectionWidth;
                        sectionHeight = Tools.randomOneHalf() == 0 ? sectionHeight : -sectionHeight;
                        this.x = centerPoint ? centerPoint.x + sectionWidth : sectionWidth;
                        this.y = centerPoint ? centerPoint.y + sectionHeight : sectionHeight;
                        this.width = width ? Tools.randomOneNumber(width[0], width[1]) : Tools.randomOneNumber(20, 50);
                        this.height = height ? Tools.randomOneNumber(height[0], height[1]) : this.width;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        this.skin = urlArr ? Tools.arrayRandomGetOne(urlArr) : _SkinUrl.圆形1;
                        this.rotation = rotation ? Tools.randomOneNumber(rotation[0], rotation[1]) : 0;
                        this.alpha = 0;
                        this.zOrder = zOrder ? zOrder : 0;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][0], colorRGBA[1][0]) : Tools.randomOneNumber(0, 255);
                        RGBA[1] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][1], colorRGBA[1][1]) : Tools.randomOneNumber(0, 255);
                        RGBA[2] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][2], colorRGBA[1][2]) : Tools.randomOneNumber(0, 255);
                        RGBA[3] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][3], colorRGBA[1][3]) : Tools.randomOneNumber(0, 255);
                        Color._colour(this, RGBA);
                    }
                }
                _Particle._ParticleImgBase = _ParticleImgBase;
                function _snow(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, rotationSpeed, speed, windX) {
                    let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                    let _rotationSpeed = rotationSpeed ? Tools.randomOneNumber(rotationSpeed[0], rotationSpeed[1]) : Tools.randomOneNumber(0, 1);
                    _rotationSpeed = Tools.randomOneHalf() == 0 ? _rotationSpeed : -_rotationSpeed;
                    let speed0 = speed ? Tools.randomOneNumber(speed[0], speed[1]) : Tools.randomOneNumber(1, 2.5);
                    let _windX = windX ? Tools.randomOneNumber(windX[0], windX[1]) : 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let distance0 = 0;
                    let distance1 = distance ? Tools.randomOneNumber(distance[0], distance[1]) : Tools.randomOneNumber(100, 300);
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
                    });
                    return Img;
                }
                _Particle._snow = _snow;
                function _fallingVertical(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                    let speed0 = speed ? Tools.randomOneNumber(speed[0], speed[1]) : Tools.randomOneNumber(4, 8);
                    let accelerated0 = accelerated ? Tools.randomOneNumber(accelerated[0], accelerated[1]) : Tools.randomOneNumber(0.25, 0.45);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let distance0 = 0;
                    let distance1 = distance ? Tools.randomOneNumber(distance[0], distance[1]) : Tools.randomOneNumber(100, 300);
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.05;
                            distance0 = Img.y++;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        if (distance0 < distance1 && moveCaller.move) {
                            acc += accelerated0;
                            distance0 = Img.y += (speed0 + acc);
                            if (distance0 >= distance1) {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                        }
                        if (moveCaller.vinish) {
                            acc -= accelerated0 / 2;
                            Img.alpha -= 0.03;
                            Img.y += (speed0 + acc);
                            if (Img.alpha <= 0 || (speed0 + acc) <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                    });
                    return Img;
                }
                _Particle._fallingVertical = _fallingVertical;
                function _slowlyUp(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder);
                    let speed0 = speed ? Tools.randomOneNumber(speed[0], speed[1]) : Tools.randomOneNumber(1.5, 2);
                    let accelerated0 = accelerated ? Tools.randomOneNumber(accelerated[0], accelerated[1]) : Tools.randomOneNumber(0.001, 0.005);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let fy = Img.y;
                    let distance0 = 0;
                    let distance1 = distance ? Tools.randomOneNumber(distance[0], distance[1]) : Tools.randomOneNumber(-250, -600);
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.03;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        if (distance0 > distance1 && moveCaller.move) {
                        }
                        else {
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
                    });
                    return Img;
                }
                _Particle._slowlyUp = _slowlyUp;
                function _spray(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, moveAngle, distance, rotationSpeed, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                    let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
                    let speed0 = speed ? Tools.randomOneNumber(speed[0], speed[1]) : Tools.randomOneNumber(3, 10);
                    let accelerated0 = accelerated ? Tools.randomOneNumber(accelerated[0], accelerated[1]) : Tools.randomOneNumber(0.25, 0.45);
                    let acc = 0;
                    let moveCaller = {
                        alpha: true,
                        move: false,
                        vinish: false,
                    };
                    Img['moveCaller'] = moveCaller;
                    let radius = 0;
                    let distance1 = distance ? Tools.randomOneNumber(distance[0], distance[1]) : Tools.randomOneNumber(100, 200);
                    let angle0 = moveAngle ? Tools.randomOneNumber(moveAngle[0], moveAngle[1]) : Tools.randomOneNumber(0, 360);
                    let rotationSpeed0 = rotationSpeed ? Tools.randomOneNumber(rotationSpeed[0], rotationSpeed[1]) : Tools.randomOneNumber(0, 20);
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        Img.rotation += rotationSpeed0;
                        if (Img.alpha < 1 && moveCaller.alpha) {
                            Img.alpha += 0.5;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move = true;
                            }
                        }
                        else {
                            if (radius < distance1 && moveCaller.move) {
                            }
                            else {
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
                            let point = Tools.Point.getRoundPos(angle0, radius, centerPoint0);
                            Img.pos(point.x, point.y);
                        }
                    });
                    return Img;
                }
                _Particle._spray = _spray;
                function _outsideBox(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, curtailAngle, distance, rotateSpeed, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                    let _angle = 0;
                    sectionWH = sectionWH ? sectionWH : [100, 100];
                    let fixedXY = Tools.randomOneHalf() == 0 ? 'x' : 'y';
                    curtailAngle = curtailAngle ? curtailAngle : 60;
                    if (fixedXY == 'x') {
                        if (Tools.randomOneHalf() == 0) {
                            Img.x += sectionWH[0];
                            _angle = Tools.randomOneHalf() == 0 ? Tools.randomOneNumber(0, 90 - curtailAngle) : Tools.randomOneNumber(0, -90 + curtailAngle);
                        }
                        else {
                            Img.x -= sectionWH[0];
                            _angle = Tools.randomOneNumber(90 + curtailAngle, 270 - curtailAngle);
                        }
                        Img.y += Tools.randomOneNumber(-sectionWH[1], sectionWH[1]);
                    }
                    else {
                        if (Tools.randomOneHalf() == 0) {
                            Img.y -= sectionWH[1];
                            _angle = Tools.randomOneNumber(180 + curtailAngle, 360 - curtailAngle);
                        }
                        else {
                            Img.y += sectionWH[1];
                            _angle = Tools.randomOneNumber(0 + curtailAngle, 180 - curtailAngle);
                        }
                        Img.x += Tools.randomOneNumber(-sectionWH[0], sectionWH[0]);
                    }
                    let p = Tools.d2_angle_Vector(_angle);
                    let _distance = distance ? Tools.randomOneNumber(distance[0], distance[1]) : Tools.randomOneNumber(20, 50);
                    let speed0 = speed ? Tools.randomOneNumber(speed[0], speed[1]) : Tools.randomOneNumber(0.5, 1);
                    let accelerated0 = accelerated ? Tools.randomOneNumber(accelerated[0], accelerated[1]) : Tools.randomOneNumber(0.25, 0.45);
                    let acc = 0;
                    let rotationSpeed0 = rotateSpeed ? Tools.randomOneNumber(rotateSpeed[0], rotateSpeed[1]) : Tools.randomOneNumber(0, 20);
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
                        }
                        else if (moveCaller.move) {
                            if (firstP.distance(Img.x, Img.y) >= _distance) {
                                moveCaller.move = false;
                                moveCaller.vinish = true;
                            }
                        }
                        else if (moveCaller.vinish) {
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
                    });
                    return Img;
                }
                _Particle._outsideBox = _outsideBox;
                function _moveToTargetToMove(parent, centerPoint, width, height, rotation, angle, urlArr, colorRGBA, zOrder, distance1, distance2, rotationSpeed, speed, accelerated) {
                    let Img = new _ParticleImgBase(parent, centerPoint, [0, 0], width, height, rotation, urlArr, colorRGBA, zOrder);
                    let centerPoint0 = centerPoint ? centerPoint : new Laya.Point(0, 0);
                    let speed0 = speed ? Tools.randomOneNumber(speed[0], speed[1]) : Tools.randomOneNumber(5, 6);
                    let accelerated0 = accelerated ? Tools.randomOneNumber(accelerated[0], accelerated[1]) : Tools.randomOneNumber(0.25, 0.45);
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
                    let dis1 = distance1 ? Tools.randomOneNumber(distance1[0], distance1[1]) : Tools.randomOneNumber(100, 200);
                    let dis2 = distance2 ? Tools.randomOneNumber(distance2[0], distance2[1]) : Tools.randomOneNumber(100, 200);
                    let angle0 = angle ? Tools.randomOneNumber(angle[0], angle[1]) : Tools.randomOneNumber(0, 360);
                    Img.rotation = angle0 - 90;
                    let rotationSpeed0 = rotationSpeed ? Tools.randomOneNumber(rotationSpeed[0], rotationSpeed[1]) : Tools.randomOneNumber(0, 20);
                    TimerAdmin._frameLoop(1, moveCaller, () => {
                        if (moveCaller.alpha) {
                            acc += accelerated0;
                            radius += speed0 + acc;
                            Img.alpha += 0.5;
                            if (Img.alpha >= 1) {
                                moveCaller.alpha = false;
                                moveCaller.move1 = true;
                            }
                        }
                        else if (moveCaller.move1) {
                            acc += accelerated0;
                            radius += speed0 + acc;
                            if (radius >= dis1) {
                                moveCaller.move1 = false;
                                moveCaller.stop = true;
                            }
                        }
                        else if (moveCaller.stop) {
                            acc -= 0.3;
                            radius += 0.1;
                            if (acc <= 0) {
                                moveCaller.stop = false;
                                moveCaller.move2 = true;
                            }
                        }
                        else if (moveCaller.move2) {
                            acc += accelerated0 / 2;
                            radius += speed0 + acc;
                            if (radius >= dis1 + dis2) {
                                moveCaller.move2 = false;
                                moveCaller.vinish = true;
                            }
                        }
                        else if (moveCaller.vinish) {
                            radius += 0.5;
                            Img.alpha -= 0.05;
                            if (Img.alpha <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                        let point = Tools.Point.getRoundPos(angle0, radius, centerPoint0);
                        Img.pos(point.x, point.y);
                    });
                    return Img;
                }
                _Particle._moveToTargetToMove = _moveToTargetToMove;
                function _AnnularInhalation(parent, centerPoint, radius, rotation, width, height, urlArr, speed, accelerated, zOrder) {
                    let Img = new Laya.Image();
                    parent.addChild(Img);
                    width = width ? width : [25, 50];
                    Img.width = Tools.randomCountNumer(width[0], width[1])[0];
                    Img.height = height ? Tools.randomCountNumer(height[0], height[1])[0] : Img.width;
                    Img.pivotX = Img.width / 2;
                    Img.pivotY = Img.height / 2;
                    Img.skin = urlArr ? Tools.arrayRandomGetOut(urlArr)[0] : _SkinUrl[Tools.randomCountNumer(0, 12)[0]];
                    let radius0 = Tools.randomCountNumer(radius[0], radius[1])[0];
                    Img.alpha = 0;
                    let speed0 = speed ? Tools.randomCountNumer(speed[0], speed[1])[0] : Tools.randomCountNumer(5, 10)[0];
                    let angle = rotation ? Tools.randomCountNumer(rotation[0], rotation[1])[0] : Tools.randomCountNumer(0, 360)[0];
                    let caller = {};
                    let acc = 0;
                    accelerated = accelerated ? accelerated : 0.35;
                    TimerAdmin._frameLoop(1, caller, () => {
                        if (Img.alpha < 1) {
                            Img.alpha += 0.05;
                            acc += (accelerated / 5);
                            radius0 -= (speed0 / 2 + acc);
                        }
                        else {
                            acc += accelerated;
                            radius0 -= (speed0 + acc);
                        }
                        let point = Tools.Point.getRoundPos(angle, radius0, centerPoint);
                        Img.pos(point.x, point.y);
                        if (point.distance(centerPoint.x, centerPoint.y) <= 20 || point.distance(centerPoint.x, centerPoint.y) >= 1000) {
                            Img.removeSelf();
                            Laya.timer.clearAll(caller);
                        }
                    });
                    return Img;
                }
                _Particle._AnnularInhalation = _AnnularInhalation;
            })(_Particle = Effects._Particle || (Effects._Particle = {}));
            let _Glitter;
            (function (_Glitter) {
                class _GlitterImage extends Laya.Image {
                    constructor(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height) {
                        super();
                        if (!parent.parent) {
                            return;
                        }
                        parent.addChild(this);
                        this.skin = urlArr ? Tools.arrayRandomGetOne(urlArr) : _SkinUrl.星星1;
                        this.width = width ? Tools.randomOneNumber(width[0], width[1]) : 80;
                        this.height = height ? Tools.randomOneNumber(height[0], height[1]) : this.width;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        let p = radiusXY ? Tools.Point.randomPointByCenter(centerPos, radiusXY[0], radiusXY[1], 1) : Tools.Point.randomPointByCenter(centerPos, 100, 100, 1);
                        this.pos(p[0].x, p[0].y);
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][0], colorRGBA[1][0]) : Tools.randomOneNumber(0, 255);
                        RGBA[1] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][1], colorRGBA[1][1]) : Tools.randomOneNumber(0, 255);
                        RGBA[2] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][2], colorRGBA[1][2]) : Tools.randomOneNumber(0, 255);
                        RGBA[3] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][3], colorRGBA[1][3]) : Tools.randomOneNumber(0, 255);
                        Color._colour(this, RGBA);
                        this.alpha = 0;
                    }
                }
                _Glitter._GlitterImage = _GlitterImage;
                function _blinkStar(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, scale, speed, rotateSpeed) {
                    let Img = new _GlitterImage(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height);
                    Img.scaleX = 0;
                    Img.scaleY = 0;
                    let _scale = scale ? Tools.randomOneNumber(scale[0], scale[1]) : Tools.randomOneNumber(0.8, 1.2);
                    let _speed = speed ? Tools.randomOneNumber(speed[0], speed[1]) : Tools.randomOneNumber(0.01, 0.02);
                    let _rotateSpeed = rotateSpeed ? Tools.randomOneInt(rotateSpeed[0], rotateSpeed[1]) : Tools.randomOneInt(0, 5);
                    _rotateSpeed = Tools.randomOneHalf() == 0 ? -_rotateSpeed : _rotateSpeed;
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
                        }
                        else if (moveCaller.scale) {
                            Img.rotation += _rotateSpeed;
                            Img.scaleX = Img.scaleY += _speed;
                            if (Img.scaleX > _scale) {
                                moveCaller.scale = false;
                                moveCaller.vanish = true;
                            }
                        }
                        else if (moveCaller.vanish) {
                            Img.rotation -= _rotateSpeed;
                            Img.alpha -= 0.015;
                            Img.scaleX -= 0.01;
                            Img.scaleY -= 0.01;
                            if (Img.scaleX <= 0) {
                                Img.removeSelf();
                                Laya.timer.clearAll(moveCaller);
                            }
                        }
                    };
                    Laya.timer.frameLoop(1, moveCaller, ani);
                    return Img;
                }
                _Glitter._blinkStar = _blinkStar;
                function _simpleInfinite(parent, x, y, width, height, zOrder, url, speed) {
                    let Img = new Laya.Image();
                    parent.addChild(Img);
                    Img.width = width;
                    Img.height = height;
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
                                }
                                else {
                                    add = true;
                                }
                            }
                        }
                        else {
                            Img.alpha += speed ? speed * 2 : 0.01 * 2;
                            if (Img.alpha >= 1) {
                                add = false;
                                caller['end'] = true;
                            }
                        }
                    };
                    Laya.timer.frameLoop(1, caller, func);
                    return Img;
                }
                _Glitter._simpleInfinite = _simpleInfinite;
            })(_Glitter = Effects._Glitter || (Effects._Glitter = {}));
            let _circulation;
            (function (_circulation) {
                class _circulationImage extends Laya.Image {
                    constructor(parent, urlArr, colorRGBA, width, height, zOrder) {
                        super();
                        parent.addChild(this);
                        this.skin = urlArr ? Tools.arrayRandomGetOne(urlArr) : _SkinUrl.圆形发光1;
                        this.width = width ? Tools.randomOneNumber(width[0], width[1]) : 80;
                        this.height = height ? Tools.randomOneNumber(height[0], height[1]) : this.width;
                        this.pivotX = this.width / 2;
                        this.pivotY = this.height / 2;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][0], colorRGBA[1][0]) : Tools.randomOneNumber(0, 255);
                        RGBA[1] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][1], colorRGBA[1][1]) : Tools.randomOneNumber(0, 255);
                        RGBA[2] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][2], colorRGBA[1][2]) : Tools.randomOneNumber(0, 255);
                        RGBA[3] = colorRGBA ? Tools.randomOneNumber(colorRGBA[0][3], colorRGBA[1][3]) : Tools.randomOneNumber(0, 255);
                        Color._colour(this, RGBA);
                        this.zOrder = zOrder ? zOrder : 0;
                        this.alpha = 0;
                        this.scaleX = 0;
                        this.scaleY = 0;
                    }
                }
                _circulation._circulationImage = _circulationImage;
                function _corner(parent, posArray, urlArr, colorRGBA, width, height, zOrder, parallel, speed) {
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
                            }
                            else {
                                Img.skin = urlArr[moveCaller.num];
                            }
                        }
                    });
                    var func = () => {
                        let targetXY = [posArray[index][0], posArray[index][1]];
                        let distance = (new Laya.Point(Img.x, Img.y)).distance(targetXY[0], targetXY[1]);
                        if (parallel) {
                            Img.rotation = Tools.d2_Vector_Angle(Img.x - targetXY[0], Img.y - targetXY[1]) + 180;
                        }
                        let time = speed * 100 + distance / 5;
                        if (index == posArray.length + 1) {
                            targetXY = [posArray[0][0], posArray[0][1]];
                        }
                        Animation2D.move_Simple(Img, Img.x, Img.y, targetXY[0], targetXY[1], time, 0, () => {
                            index++;
                            if (index == posArray.length) {
                                index = 0;
                            }
                            func();
                        });
                    };
                    func();
                    return Img;
                }
                _circulation._corner = _corner;
            })(_circulation = Effects._circulation || (Effects._circulation = {}));
        })(Effects = lwg.Effects || (lwg.Effects = {}));
        let Click;
        (function (Click) {
            function _createButton() {
                let Btn = new Laya.Sprite();
                let img = new Laya.Image();
                let label = new Laya.Label();
            }
            Click._createButton = _createButton;
            Click._Effect = {
                use: 'largen',
                type: {
                    no: 'no',
                    largen: 'largen',
                    balloon: 'balloon',
                    beetle: 'beetle',
                },
            };
            function _on(effect, target, caller, down, move, up, out) {
                let btnEffect;
                switch (effect) {
                    case Click._Effect.type.no:
                        btnEffect = new Btn_NoEffect();
                        break;
                    case Click._Effect.type.largen:
                        btnEffect = new Btn_LargenEffect();
                        break;
                    case Click._Effect.type.balloon:
                        btnEffect = new Btn_Balloon();
                        break;
                    case Click._Effect.type.balloon:
                        btnEffect = new Btn_Beetle();
                        break;
                    default:
                        btnEffect = new Btn_LargenEffect();
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
            Click._on = _on;
            function _off(effect, target, caller, down, move, up, out) {
                let btnEffect;
                switch (effect) {
                    case Click._Effect.type.no:
                        btnEffect = new Btn_NoEffect();
                        break;
                    case Click._Effect.type.largen:
                        btnEffect = new Btn_LargenEffect();
                        break;
                    case Click._Effect.type.balloon:
                        btnEffect = new Btn_Balloon();
                        break;
                    case Click._Effect.type.balloon:
                        btnEffect = new Btn_Beetle();
                        break;
                    default:
                        btnEffect = new Btn_LargenEffect();
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
            Click._off = _off;
        })(Click = lwg.Click || (lwg.Click = {}));
        class Btn_NoEffect {
            constructor() {
            }
            down(event) {
            }
            move(event) {
            }
            up(event) {
            }
            out(event) {
            }
        }
        lwg.Btn_NoEffect = Btn_NoEffect;
        class Btn_LargenEffect {
            constructor() {
            }
            down(event) {
                event.currentTarget.scale(1.1, 1.1);
                PalyAudio.playSound(Click._audioUrl);
            }
            move(event) {
            }
            up(event) {
                event.currentTarget.scale(1, 1);
            }
            out(event) {
                event.currentTarget.scale(1, 1);
            }
        }
        lwg.Btn_LargenEffect = Btn_LargenEffect;
        class Btn_Balloon {
            constructor() {
            }
            down(event) {
                event.currentTarget.scale(Click._balloonScale + 0.06, Click._balloonScale + 0.06);
                PalyAudio.playSound(Click._audioUrl);
            }
            up(event) {
                event.currentTarget.scale(Click._balloonScale, Click._balloonScale);
            }
            move(event) {
                event.currentTarget.scale(Click._balloonScale, Click._balloonScale);
            }
            out(event) {
                event.currentTarget.scale(Click._balloonScale, Click._balloonScale);
            }
        }
        lwg.Btn_Balloon = Btn_Balloon;
        class Btn_Beetle {
            constructor() {
            }
            down(event) {
                event.currentTarget.scale(Click._beetleScale + 0.06, Click._beetleScale + 0.06);
                PalyAudio.playSound(Click._audioUrl);
            }
            up(event) {
                event.currentTarget.scale(Click._beetleScale, Click._beetleScale);
            }
            move(event) {
                event.currentTarget.scale(Click._beetleScale, Click._beetleScale);
            }
            out(event) {
                event.currentTarget.scale(Click._beetleScale, Click._beetleScale);
            }
        }
        lwg.Btn_Beetle = Btn_Beetle;
        let Animation3D;
        (function (Animation3D) {
            Animation3D.tweenMap = {};
            Animation3D.frameRate = 1;
            function moveTo(target, toPos, duration, caller, ease, complete, delay = 0, coverBefore = true, update, frame) {
                let position = target.transform.position.clone();
                if (duration == 0 || duration === undefined || duration === null) {
                    target.transform.position = toPos.clone();
                    complete && complete.apply(caller);
                    return;
                }
                if (frame <= 0 || frame === undefined || frame === null) {
                    frame = Animation3D.frameRate;
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
                };
                let tween = Laya.Tween.to(position, { x: toPos.x, y: toPos.y, z: toPos.z }, duration, ease, Laya.Handler.create(target, endTween), delay, coverBefore);
                if (!Animation3D.tweenMap[target.id]) {
                    Animation3D.tweenMap[target.id] = [];
                }
                Animation3D.tweenMap[target.id].push(tween);
            }
            Animation3D.moveTo = moveTo;
            function rotateTo(target, toRotation, duration, caller, ease, complete, delay, coverBefore, update, frame) {
                let rotation = target.transform.localRotationEuler.clone();
                if (duration == 0 || duration === undefined || duration === null) {
                    target.transform.localRotationEuler = toRotation.clone();
                    complete && complete.apply(caller);
                    return;
                }
                if (frame <= 0 || frame === undefined || frame === null) {
                    frame = Animation3D.frameRate;
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
                };
                let tween = Laya.Tween.to(rotation, { x: toRotation.x, y: toRotation.y, z: toRotation.z }, duration, ease, Laya.Handler.create(target, endTween), delay, coverBefore);
                if (!Animation3D.tweenMap[target.id]) {
                    Animation3D.tweenMap[target.id] = [];
                }
                Animation3D.tweenMap[target.id].push(tween);
            }
            Animation3D.rotateTo = rotateTo;
            function scaleTo(target, toScale, duration, caller, ease, complete, delay, coverBefore, update, frame) {
                let localScale = target.transform.localScale.clone();
                if (duration == 0 || duration === undefined || duration === null) {
                    target.transform.localScale = toScale.clone();
                    complete && complete.apply(caller);
                    return;
                }
                if (frame <= 0 || frame === undefined || frame === null) {
                    frame = Animation3D.frameRate;
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
                };
                let tween = Laya.Tween.to(localScale, { x: toScale.x, y: toScale.y, z: toScale.z }, duration, ease, Laya.Handler.create(target, endTween), delay, coverBefore);
                if (!Animation3D.tweenMap[target.id]) {
                    Animation3D.tweenMap[target.id] = [];
                }
                Animation3D.tweenMap[target.id].push(tween);
            }
            Animation3D.scaleTo = scaleTo;
            function ClearTween(target) {
                let tweens = Animation3D.tweenMap[target.id];
                if (tweens && tweens.length) {
                    while (tweens.length > 0) {
                        let tween = tweens.pop();
                        tween.clear();
                    }
                }
                Laya.timer.clearAll(target);
            }
            Animation3D.ClearTween = ClearTween;
            function rock(target, range, duration, caller, func, delayed, ease) {
                if (!delayed) {
                    delayed = 0;
                }
                let v1 = new Laya.Vector3(target.transform.localRotationEulerX + range.x, target.transform.localRotationEulerY + range.y, target.transform.localRotationEulerZ + range.z);
                rotateTo(target, v1, duration / 2, caller, ease, () => {
                    let v2 = new Laya.Vector3(target.transform.localRotationEulerX - range.x * 2, target.transform.localRotationEulerY - range.y * 2, target.transform.localRotationEulerZ - range.z * 2);
                    rotateTo(target, v2, duration, caller, ease, () => {
                        let v3 = new Laya.Vector3(target.transform.localRotationEulerX + range.x, target.transform.localRotationEulerY + range.y, target.transform.localRotationEulerZ + range.z);
                        rotateTo(target, v3, duration / 2, caller, ease, () => {
                            if (func) {
                                func();
                            }
                        });
                    });
                }, delayed);
            }
            Animation3D.rock = rock;
            function moveRotateTo(Sp3d, Target, duration, caller, ease, complete, delay, coverBefore, update, frame) {
                moveTo(Sp3d, Target.transform.position, duration, caller, ease, null, delay, coverBefore, update, frame);
                rotateTo(Sp3d, Target.transform.localRotationEuler, duration, caller, ease, complete, delay, coverBefore, null, frame);
            }
            Animation3D.moveRotateTo = moveRotateTo;
        })(Animation3D = lwg.Animation3D || (lwg.Animation3D = {}));
        let Animation2D;
        (function (Animation2D) {
            function circulation_scale(node, range, time, delayed, func) {
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
            Animation2D.circulation_scale = circulation_scale;
            function leftRight_Shake(node, range, time, delayed, func, click) {
                if (!delayed) {
                    delayed = 0;
                }
                if (!click) {
                    Admin._clickLock.switch = true;
                }
                Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: node.x + range * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                            if (func) {
                                func();
                            }
                            if (!click) {
                                Admin._clickLock.switch = false;
                            }
                        }));
                    }));
                }), delayed);
            }
            Animation2D.leftRight_Shake = leftRight_Shake;
            function simple_Rotate(node, Frotate, Erotate, time, delayed, func) {
                node.rotation = Frotate;
                if (!delayed) {
                    delayed = 0;
                }
                Laya.Tween.to(node, { rotation: Erotate }, time, null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.simple_Rotate = simple_Rotate;
            function upDown_Overturn(node, time, func) {
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
            Animation2D.upDown_Overturn = upDown_Overturn;
            function leftRight_Overturn(node, time, func) {
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
            Animation2D.leftRight_Overturn = leftRight_Overturn;
            function upDwon_Shake(node, range, time, delayed, func) {
                Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { y: node.y - range * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { y: node.y + range }, time, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }));
                    }));
                }), delayed);
            }
            Animation2D.upDwon_Shake = upDwon_Shake;
            function fadeOut(node, alpha1, alpha2, time, delayed, func, stageClick) {
                node.alpha = alpha1;
                if (stageClick) {
                    Admin._clickLock.switch = true;
                }
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                    if (stageClick) {
                        Admin._clickLock.switch = false;
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.fadeOut = fadeOut;
            function fadeOut_KickBack(node, alpha1, alpha2, time, delayed, func) {
                node.alpha = alpha1;
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.fadeOut_KickBack = fadeOut_KickBack;
            function move_FadeOut(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 0;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.move_FadeOut = move_FadeOut;
            function move_Fade_Out(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 1;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 0, x: targetX, y: targetY }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.move_Fade_Out = move_Fade_Out;
            function move_FadeOut_Scale_01(node, firstX, firstY, targetX, targetY, time, delayed, func) {
                node.alpha = 0;
                node.targetX = 0;
                node.targetY = 0;
                node.x = firstX;
                node.y = firstY;
                Laya.Tween.to(node, { alpha: 1, x: targetX, y: targetY, scaleX: 1, scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.move_FadeOut_Scale_01 = move_FadeOut_Scale_01;
            function move_Scale(node, fScale, fX, fY, tX, tY, eScale, time, delayed, ease, func) {
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
            Animation2D.move_Scale = move_Scale;
            function rotate_Scale(target, fRotate, fScaleX, fScaleY, eRotate, eScaleX, eScaleY, time, delayed, func) {
                target.scaleX = fScaleX;
                target.scaleY = fScaleY;
                target.rotation = fRotate;
                Laya.Tween.to(target, { rotation: eRotate, scaleX: eScaleX, scaleY: eScaleY }, time, null, Laya.Handler.create(this, () => {
                    if (func) {
                        func();
                    }
                    target.rotation = 0;
                }), delayed ? delayed : 0);
            }
            Animation2D.rotate_Scale = rotate_Scale;
            function drop_Simple(node, fY, tY, rotation, time, delayed, func) {
                node.y = fY;
                Laya.Tween.to(node, { y: tY, rotation: rotation }, time, Laya.Ease.circOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.drop_Simple = drop_Simple;
            function drop_KickBack(target, fAlpha, firstY, targetY, extendY, time1, delayed, func) {
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
            Animation2D.drop_KickBack = drop_KickBack;
            function drop_Excursion(node, targetY, targetX, rotation, time, delayed, func) {
                Laya.Tween.to(node, { x: node.x + targetX, y: node.y + targetY * 1 / 6 }, time, Laya.Ease.expoIn, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: node.x + targetX + 50, y: targetY, rotation: rotation }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation2D.drop_Excursion = drop_Excursion;
            function goUp_Simple(node, initialY, initialR, targetY, time, delayed, func) {
                node.y = initialY;
                node.rotation = initialR;
                Laya.Tween.to(node, { y: targetY, rotation: 0 }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func !== null) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.goUp_Simple = goUp_Simple;
            function cardRotateX_TowFace(node, time, func1, delayed, func2) {
                Laya.Tween.to(node, { scaleX: 0 }, time, null, Laya.Handler.create(this, function () {
                    Tools.Node.childrenVisible2D(node, false);
                    if (func1) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleX: 1 }, time * 0.9, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: 0 }, time * 0.8, null, Laya.Handler.create(this, function () {
                            Tools.Node.childrenVisible2D(node, true);
                            Laya.Tween.to(node, { scaleX: 1 }, time * 0.7, null, Laya.Handler.create(this, function () {
                                if (func2) {
                                    func2();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation2D.cardRotateX_TowFace = cardRotateX_TowFace;
            function cardRotateX_OneFace(node, func1, time, delayed, func2) {
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
            Animation2D.cardRotateX_OneFace = cardRotateX_OneFace;
            function cardRotateY_TowFace(node, time, func1, delayed, func2) {
                Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                    Tools.Node.childrenVisible2D(node, false);
                    if (func1) {
                        func1();
                    }
                    Laya.Tween.to(node, { scaleY: 1 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleY: 0 }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleY: 1 }, time * 1 / 2, null, Laya.Handler.create(this, function () {
                                Tools.Node.childrenVisible2D(node, true);
                                if (func2) {
                                    func2();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation2D.cardRotateY_TowFace = cardRotateY_TowFace;
            function cardRotateY_OneFace(node, func1, time, delayed, func2) {
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
            Animation2D.cardRotateY_OneFace = cardRotateY_OneFace;
            function move_changeRotate(node, targetX, targetY, per, rotation_pe, time, func) {
                let targetPerX = targetX * per + node.x * (1 - per);
                let targetPerY = targetY * per + node.y * (1 - per);
                Laya.Tween.to(node, { x: targetPerX, y: targetPerY, rotation: 45 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: targetX, y: targetY, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), 0);
            }
            Animation2D.move_changeRotate = move_changeRotate;
            function bomb_LeftRight(node, MaxScale, time, func, delayed) {
                Laya.Tween.to(node, { scaleX: MaxScale }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 0.85 }, time * 0.5, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: MaxScale * 0.9 }, time * 0.55, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: 0.95 }, time * 0.6, null, Laya.Handler.create(this, function () {
                                Laya.Tween.to(node, { scaleX: 1 }, time * 0.65, null, Laya.Handler.create(this, function () {
                                    if (func)
                                        func();
                                }), 0);
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation2D.bomb_LeftRight = bomb_LeftRight;
            function bombs_Appear(node, firstAlpha, endScale, maxScale, rotation1, time1, time2, delayed, func) {
                node.scale(0, 0);
                node.alpha = firstAlpha;
                Laya.Tween.to(node, { scaleX: maxScale, scaleY: maxScale, alpha: 1, rotation: rotation1 }, time1, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: endScale, scaleY: endScale, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: endScale + (maxScale - endScale) * 0.2, scaleY: endScale + (maxScale - endScale) * 0.2, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: endScale, scaleY: endScale, rotation: 0 }, time2, null, Laya.Handler.create(this, function () {
                                if (func) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed ? delayed : 0);
            }
            Animation2D.bombs_Appear = bombs_Appear;
            function bombs_AppearAllChild(node, firstAlpha, endScale, scale1, rotation1, time1, time2, interval, func, audioType) {
                let de1 = 0;
                if (!interval) {
                    interval = 100;
                }
                for (let index = 0; index < node.numChildren; index++) {
                    let Child = node.getChildAt(index);
                    Child.alpha = 0;
                    Laya.timer.once(de1, this, () => {
                        Child.alpha = 1;
                        if (index !== node.numChildren - 1) {
                            func == null;
                        }
                        bombs_Appear(Child, firstAlpha, endScale, scale1, rotation1, time1, time2, null, func);
                    });
                    de1 += interval;
                }
            }
            Animation2D.bombs_AppearAllChild = bombs_AppearAllChild;
            function bombs_VanishAllChild(node, endScale, alpha, rotation, time, interval, func) {
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
                        bombs_Vanish(node, endScale, alpha, rotation, time, 0, func);
                    });
                    de1 += interval;
                }
            }
            Animation2D.bombs_VanishAllChild = bombs_VanishAllChild;
            function bombs_Vanish(node, scale, alpha, rotation, time, delayed, func) {
                Laya.Tween.to(node, { scaleX: scale, scaleY: scale, alpha: alpha, rotation: rotation }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.bombs_Vanish = bombs_Vanish;
            function swell_shrink(node, firstScale, scale1, time, delayed, func) {
                if (!delayed) {
                    delayed = 0;
                }
                Laya.Tween.to(node, { scaleX: scale1, scaleY: scale1, alpha: 1, }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: firstScale + (scale1 - firstScale) * 0.5, scaleY: firstScale + (scale1 - firstScale) * 0.5, rotation: 0 }, time * 0.5, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: firstScale, scaleY: firstScale, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                                if (func) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed);
            }
            Animation2D.swell_shrink = swell_shrink;
            function move_Simple(node, fX, fY, targetX, targetY, time, delayed, func, ease) {
                node.x = fX;
                node.y = fY;
                Laya.Tween.to(node, { x: targetX, y: targetY }, time, ease ? ease : null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.move_Simple = move_Simple;
            function move_Deform_X(node, firstX, firstR, targetX, scaleX, scaleY, time, delayed, func) {
                node.alpha = 0;
                node.x = firstX;
                node.rotation = firstR;
                Laya.Tween.to(node, { x: targetX, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation2D.move_Deform_X = move_Deform_X;
            function move_Deform_Y(target, firstY, firstR, targeY, scaleX, scaleY, time, delayed, func) {
                target.alpha = 0;
                if (firstY) {
                    target.y = firstY;
                }
                target.rotation = firstR;
                Laya.Tween.to(target, { y: targeY, scaleX: 1 + scaleX, scaleY: 1 + scaleY, rotation: firstR / 3, alpha: 1 }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { scaleX: 1, scaleY: 1, rotation: 0 }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation2D.move_Deform_Y = move_Deform_Y;
            function blink_FadeOut_v(target, minAlpha, maXalpha, time, delayed, func) {
                target.alpha = minAlpha;
                Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                        if (func !== null) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation2D.blink_FadeOut_v = blink_FadeOut_v;
            function blink_FadeOut(target, minAlpha, maXalpha, time, delayed, func) {
                target.alpha = minAlpha;
                if (!delayed) {
                    delayed = 0;
                }
                Laya.Tween.to(target, { alpha: minAlpha }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { alpha: maXalpha }, time, null, Laya.Handler.create(this, function () {
                        if (func) {
                            func();
                        }
                    }), 0);
                }), delayed);
            }
            Animation2D.blink_FadeOut = blink_FadeOut;
            function shookHead_Simple(target, rotate, time, delayed, func) {
                let firstR = target.rotation;
                Laya.Tween.to(target, { rotation: firstR + rotate }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { rotation: firstR - rotate * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { rotation: firstR + rotate }, time, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(target, { rotation: firstR }, time, null, Laya.Handler.create(this, function () {
                                if (func) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed ? delayed : 0);
            }
            Animation2D.shookHead_Simple = shookHead_Simple;
            function HintAni_01(target, upNum, time1, stopTime, downNum, time2, func) {
                target.alpha = 0;
                Laya.Tween.to(target, { alpha: 1, y: target.y - upNum }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(target, { y: target.y - 15 }, stopTime, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(target, { alpha: 0, y: target.y + upNum + downNum }, time2, null, Laya.Handler.create(this, function () {
                            if (func !== null) {
                                func();
                            }
                        }), 0);
                    }), 0);
                }), 0);
            }
            Animation2D.HintAni_01 = HintAni_01;
            function scale_Alpha(target, fAlpha, fScaleX, fScaleY, eScaleX, eScaleY, eAlpha, time, delayed, func, ease) {
                if (!delayed) {
                    delayed = 0;
                }
                if (!delayed) {
                    ease = null;
                }
                target.alpha = fAlpha;
                target.scaleX = fScaleX;
                target.scaleY = fScaleY;
                Laya.Tween.to(target, { scaleX: eScaleX, scaleY: eScaleY, alpha: eAlpha }, time, ease, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed);
            }
            Animation2D.scale_Alpha = scale_Alpha;
            function rotate_Magnify_KickBack(node, eAngle, eScale, time1, time2, delayed1, delayed2, func) {
                node.alpha = 0;
                node.scaleX = 0;
                node.scaleY = 0;
                Laya.Tween.to(node, { alpha: 1, rotation: 360 + eAngle, scaleX: 1 + eScale, scaleY: 1 + eScale }, time1, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { rotation: 360 - eAngle / 2, scaleX: 1 + eScale / 2, scaleY: 1 + eScale / 2 }, time2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { rotation: 360 + eAngle / 3, scaleX: 1 + eScale / 5, scaleY: 1 + eScale / 5 }, time2, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { rotation: 360, scaleX: 1, scaleY: 1 }, time2, null, Laya.Handler.create(this, function () {
                                node.rotation = 0;
                                if (func !== null) {
                                    func();
                                }
                            }), 0);
                        }), delayed2);
                    }), 0);
                }), delayed1);
            }
            Animation2D.rotate_Magnify_KickBack = rotate_Magnify_KickBack;
        })(Animation2D = lwg.Animation2D || (lwg.Animation2D = {}));
        let Setting;
        (function (Setting) {
            Setting._sound = {
                get switch() {
                    return Laya.LocalStorage.getItem('Setting_sound') == '0' ? false : true;
                },
                set switch(value) {
                    let val;
                    if (value) {
                        val = 1;
                    }
                    else {
                        val = 0;
                    }
                    Laya.LocalStorage.setItem('Setting_sound', val.toString());
                }
            };
            Setting._bgMusic = {
                get switch() {
                    return Laya.LocalStorage.getItem('Setting_bgMusic') == '0' ? false : true;
                },
                set switch(value) {
                    let val;
                    if (value) {
                        val = 1;
                        Laya.LocalStorage.setItem('Setting_bgMusic', val.toString());
                        PalyAudio.playMusic();
                    }
                    else {
                        val = 0;
                        Laya.LocalStorage.setItem('Setting_bgMusic', val.toString());
                        PalyAudio.stopMusic();
                    }
                }
            };
            Setting._shake = {
                get switch() {
                    return Laya.LocalStorage.getItem('Setting_shake') == '0' ? false : true;
                },
                set switch(value) {
                    let val;
                    if (value) {
                        val = 1;
                    }
                    else {
                        val = 0;
                    }
                    Laya.LocalStorage.setItem('Setting_shake', val.toString());
                }
            };
            function createSetBtn(x, y, width, height, skin, parent, ZOder) {
                let btn = new Laya.Image;
                btn.width = width ? width : 100;
                btn.height = width ? width : 100;
                btn.skin = skin ? skin : 'Frame/UI/icon_set.png';
                if (parent) {
                    parent.addChild(btn);
                }
                else {
                    Laya.stage.addChild(btn);
                }
                btn.pivotX = btn.width / 2;
                btn.pivotY = btn.height / 2;
                btn.x = x;
                btn.y = y;
                btn.zOrder = ZOder ? ZOder : 100;
                var btnSetUp = function (e) {
                    e.stopPropagation();
                    Admin._openScene(Admin._SceneName.Set);
                };
                Click._on(Click._Effect.type.largen, btn, null, null, btnSetUp, null);
                Setting.BtnSetNode = btn;
                Setting.BtnSetNode.name = 'BtnSetNode';
                return btn;
            }
            Setting.createSetBtn = createSetBtn;
            function setBtnAppear(delayed, x, y) {
                if (!Setting.BtnSetNode) {
                    return;
                }
                if (delayed) {
                    Animation2D.scale_Alpha(Setting.BtnSetNode, 0, 1, 1, 1, 1, 1, delayed, 0, f => {
                        Setting.BtnSetNode.visible = true;
                    });
                }
                else {
                    Setting.BtnSetNode.visible = true;
                }
                if (x) {
                    Setting.BtnSetNode.x = x;
                }
                if (y) {
                    Setting.BtnSetNode.y = y;
                }
            }
            Setting.setBtnAppear = setBtnAppear;
            function setBtnVinish(delayed) {
                if (!Setting.BtnSetNode) {
                    return;
                }
                if (delayed) {
                    Animation2D.scale_Alpha(Setting.BtnSetNode, 1, 1, 1, 1, 1, 0, delayed, 0, f => {
                        Setting.BtnSetNode.visible = false;
                    });
                }
                else {
                    Setting.BtnSetNode.visible = false;
                }
            }
            Setting.setBtnVinish = setBtnVinish;
        })(Setting = lwg.Setting || (lwg.Setting = {}));
        let PalyAudio;
        (function (PalyAudio) {
            let voiceUrl;
            (function (voiceUrl) {
                voiceUrl["btn"] = "Lwg/Voice/btn.wav";
                voiceUrl["bgm"] = "Lwg/Voice/bgm.mp3";
                voiceUrl["victory"] = "Lwg/Voice/guoguan.wav";
                voiceUrl["defeated"] = "Lwg/Voice/wancheng.wav";
                voiceUrl["huodejinbi"] = "Lwg/Voice/huodejinbi.wav";
            })(voiceUrl = PalyAudio.voiceUrl || (PalyAudio.voiceUrl = {}));
            function playSound(url, number, func) {
                if (!url) {
                    url = voiceUrl.btn;
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
            PalyAudio.playSound = playSound;
            function playDefeatedSound(url, number, func) {
                if (!url) {
                    url = voiceUrl.defeated;
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
            PalyAudio.playDefeatedSound = playDefeatedSound;
            function playVictorySound(url, number, func) {
                if (!url) {
                    url = voiceUrl.victory;
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
            PalyAudio.playVictorySound = playVictorySound;
            function playMusic(url, number, delayed) {
                if (!url) {
                    url = voiceUrl.bgm;
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
            PalyAudio.playMusic = playMusic;
            function stopMusic() {
                Laya.SoundManager.stopMusic();
            }
            PalyAudio.stopMusic = stopMusic;
        })(PalyAudio = lwg.PalyAudio || (lwg.PalyAudio = {}));
        let Tools;
        (function (Tools) {
            function color_RGBtoHexString(r, g, b) {
                return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
            }
            Tools.color_RGBtoHexString = color_RGBtoHexString;
            function format_FormatNumber(crc, fixNum = 0) {
                let textTemp;
                if (crc >= 1e27) {
                    textTemp = (crc / 1e27).toFixed(fixNum) + "ae";
                }
                else if (crc >= 1e24) {
                    textTemp = (crc / 1e24).toFixed(fixNum) + "ad";
                }
                else if (crc >= 1e21) {
                    textTemp = (crc / 1e21).toFixed(fixNum) + "ac";
                }
                else if (crc >= 1e18) {
                    textTemp = (crc / 1e18).toFixed(fixNum) + "ab";
                }
                else if (crc >= 1e15) {
                    textTemp = (crc / 1e15).toFixed(fixNum) + "aa";
                }
                else if (crc >= 1e12) {
                    textTemp = (crc / 1e12).toFixed(fixNum) + "t";
                }
                else if (crc >= 1e9) {
                    textTemp = (crc / 1e9).toFixed(fixNum) + "b";
                }
                else if (crc >= 1e6) {
                    textTemp = (crc / 1e6).toFixed(fixNum) + "m";
                }
                else if (crc >= 1e3) {
                    textTemp = (crc / 1e3).toFixed(fixNum) + "k";
                }
                else {
                    textTemp = Math.round(crc).toString();
                }
                return textTemp;
            }
            Tools.format_FormatNumber = format_FormatNumber;
            function format_StrAddNum(str, num) {
                return (Number(str) + num).toString();
            }
            Tools.format_StrAddNum = format_StrAddNum;
            function format_NumAddStr(num, str) {
                return Number(str) + num;
            }
            Tools.format_NumAddStr = format_NumAddStr;
            let Node;
            (function (Node) {
                function zOrderByY(sp, zOrder, along) {
                    let arr = [];
                    if (sp.numChildren == 0) {
                        return arr;
                    }
                    ;
                    for (let index = 0; index < sp.numChildren; index++) {
                        const element = sp.getChildAt(index);
                        arr.push(element);
                    }
                    Tools.objArrPropertySort(arr, 'y');
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
                    }
                    else {
                        return arr;
                    }
                }
                Node.zOrderByY = zOrderByY;
                function changePovit(sp, _pivotX, _pivotY, int) {
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
                Node.changePovit = changePovit;
                function getChildArrByProperty(node, property, value) {
                    let childArr = [];
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (element[property] == value) {
                            childArr.push(element);
                        }
                    }
                    return childArr;
                }
                Node.getChildArrByProperty = getChildArrByProperty;
                function randomChildren(node, num) {
                    let childArr = [];
                    let indexArr = [];
                    for (let i = 0; i < node.numChildren; i++) {
                        indexArr.push(i);
                    }
                    let randomIndex = Tools.arrayRandomGetOut(indexArr, num);
                    for (let j = 0; j < randomIndex.length; j++) {
                        childArr.push(node.getChildAt(randomIndex[j]));
                    }
                    return childArr;
                }
                Node.randomChildren = randomChildren;
                function removeAllChildren(node) {
                    if (node.numChildren > 0) {
                        node.removeChildren(0, node.numChildren - 1);
                    }
                }
                Node.removeAllChildren = removeAllChildren;
                function removeOneChildren(node, nodeName) {
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (element.name == nodeName) {
                            element.removeSelf();
                        }
                    }
                }
                Node.removeOneChildren = removeOneChildren;
                function checkChildren(node, nodeName) {
                    let bool = false;
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (element.name == nodeName) {
                            bool = true;
                        }
                    }
                    return bool;
                }
                Node.checkChildren = checkChildren;
                function showExcludedChild2D(node, childNameArr, bool) {
                    for (let i = 0; i < node.numChildren; i++) {
                        let Child = node.getChildAt(i);
                        for (let j = 0; j < childNameArr.length; j++) {
                            if (Child.name == childNameArr[j]) {
                                if (bool || bool == undefined) {
                                    Child.visible = true;
                                }
                                else {
                                    Child.visible = false;
                                }
                            }
                            else {
                                if (bool || bool == undefined) {
                                    Child.visible = false;
                                }
                                else {
                                    Child.visible = true;
                                }
                            }
                        }
                    }
                }
                Node.showExcludedChild2D = showExcludedChild2D;
                function showExcludedChild3D(node, childNameArr, bool) {
                    for (let i = 0; i < node.numChildren; i++) {
                        let Child = node.getChildAt(i);
                        for (let j = 0; j < childNameArr.length; j++) {
                            if (Child.name == childNameArr[j]) {
                                if (bool || bool == undefined) {
                                    Child.active = true;
                                }
                                else {
                                    Child.active = false;
                                }
                            }
                            else {
                                if (bool || bool == undefined) {
                                    Child.active = false;
                                }
                                else {
                                    Child.active = true;
                                }
                            }
                        }
                    }
                }
                Node.showExcludedChild3D = showExcludedChild3D;
                function prefabCreate(prefab, name) {
                    let sp = Laya.Pool.getItemByCreateFun(name ? name : prefab.json['props']['name'], prefab.create, prefab);
                    return sp;
                }
                Node.prefabCreate = prefabCreate;
                function childrenVisible2D(node, bool) {
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (bool) {
                            element.visible = true;
                        }
                        else {
                            element.visible = false;
                        }
                    }
                }
                Node.childrenVisible2D = childrenVisible2D;
                function childrenVisible3D(node, bool) {
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (bool) {
                            element.active = true;
                        }
                        else {
                            element.active = false;
                        }
                    }
                }
                Node.childrenVisible3D = childrenVisible3D;
                function findChild3D(parent, name) {
                    var item = null;
                    item = parent.getChildByName(name);
                    if (item != null)
                        return item;
                    var go = null;
                    for (var i = 0; i < parent.numChildren; i++) {
                        go = findChild3D(parent.getChildAt(i), name);
                        if (go != null)
                            return go;
                    }
                    return null;
                }
                Node.findChild3D = findChild3D;
                function findChild2D(parent, name) {
                    var item = null;
                    item = parent.getChildByName(name);
                    if (item != null)
                        return item;
                    var go = null;
                    for (var i = 0; i < parent.numChildren; i++) {
                        go = findChild2D(parent.getChildAt(i), name);
                        if (go != null)
                            return go;
                    }
                    return null;
                }
                Node.findChild2D = findChild2D;
                function findChildByName2D(parent, name) {
                    let arr = [];
                    return arr;
                }
                Node.findChildByName2D = findChildByName2D;
            })(Node = Tools.Node || (Tools.Node = {}));
            function randomOneHalf() {
                let number;
                number = Math.floor(Math.random() * 2);
                return number;
            }
            Tools.randomOneHalf = randomOneHalf;
            function randomOneInt(section1, section2) {
                if (section2) {
                    return Math.floor(Math.random() * (section2 - section1)) + section1;
                }
                else {
                    return Math.floor(Math.random() * section1);
                }
            }
            Tools.randomOneInt = randomOneInt;
            function randomCountNumer(section1, section2, count, intSet) {
                let arr = [];
                if (!count) {
                    count = 1;
                }
                if (section2) {
                    while (count > arr.length) {
                        let num;
                        if (intSet || intSet == undefined) {
                            num = Math.floor(Math.random() * (section2 - section1)) + section1;
                        }
                        else {
                            num = Math.random() * (section2 - section1) + section1;
                        }
                        arr.push(num);
                        Tools.arrayUnique_01(arr);
                    }
                    ;
                    return arr;
                }
                else {
                    while (count > arr.length) {
                        let num;
                        if (intSet || intSet == undefined) {
                            num = Math.floor(Math.random() * section1);
                        }
                        else {
                            num = Math.random() * section1;
                        }
                        arr.push(num);
                        Tools.arrayUnique_01(arr);
                    }
                    return arr;
                }
            }
            Tools.randomCountNumer = randomCountNumer;
            function randomOneNumber(section1, section2, intSet) {
                let chage;
                if (section1 > section2) {
                    chage = section1;
                    section1 = section2;
                    section2 = chage;
                }
                if (section2) {
                    let num;
                    if (intSet) {
                        num = Math.floor(Math.random() * (section2 - section1)) + section1;
                    }
                    else {
                        num = Math.random() * (section2 - section1) + section1;
                    }
                    return num;
                }
                else {
                    let num;
                    if (intSet) {
                        num = Math.floor(Math.random() * section1);
                    }
                    else {
                        num = Math.random() * section1;
                    }
                    return num;
                }
            }
            Tools.randomOneNumber = randomOneNumber;
            function d2_twoObjectsLen(obj1, obj2) {
                let point = new Laya.Point(obj1.x, obj1.y);
                let len = point.distance(obj2.x, obj2.y);
                return len;
            }
            Tools.d2_twoObjectsLen = d2_twoObjectsLen;
            function d2_Vector_Angle(x, y) {
                let radian = Math.atan2(x, y);
                let angle = 90 - radian * (180 / Math.PI);
                if (angle <= 0) {
                    angle = 270 + (90 + angle);
                }
                return angle - 90;
            }
            Tools.d2_Vector_Angle = d2_Vector_Angle;
            ;
            function d2_angle_Vector(angle) {
                let radian = (90 - angle) / (180 / Math.PI);
                let p = new Laya.Point(Math.sin(radian), Math.cos(radian));
                p.normalize();
                return p;
            }
            Tools.d2_angle_Vector = d2_angle_Vector;
            ;
            function d3_twoObjectsLen(obj1, obj2) {
                let obj1V3 = obj1.transform.position;
                let obj2V3 = obj2.transform.position;
                let p = new Laya.Vector3();
                Laya.Vector3.subtract(obj1V3, obj2V3, p);
                let lenp = Laya.Vector3.scalarLength(p);
                return lenp;
            }
            Tools.d3_twoObjectsLen = d3_twoObjectsLen;
            function d3_twoPositionLen(v1, v2) {
                let p = d3_twoSubV3(v1, v2);
                let lenp = Laya.Vector3.scalarLength(p);
                return lenp;
            }
            Tools.d3_twoPositionLen = d3_twoPositionLen;
            function d3_twoSubV3(V3_01, V3_02, normalizing) {
                let p = new Laya.Vector3();
                Laya.Vector3.subtract(V3_01, V3_02, p);
                if (normalizing) {
                    let p1 = new Laya.Vector3();
                    Laya.Vector3.normalize(p, p1);
                    return p1;
                }
                else {
                    return p;
                }
            }
            Tools.d3_twoSubV3 = d3_twoSubV3;
            function d3_maximumDistanceLimi(originV3, obj, length) {
                let subP = new Laya.Vector3();
                let objP = obj.transform.position;
                Laya.Vector3.subtract(objP, originV3, subP);
                let lenP = Laya.Vector3.scalarLength(subP);
                if (lenP >= length) {
                    let normalizP = new Laya.Vector3();
                    Laya.Vector3.normalize(subP, normalizP);
                    let x = originV3.x + normalizP.x * length;
                    let y = originV3.y + normalizP.y * length;
                    let z = originV3.z + normalizP.z * length;
                    let p = new Laya.Vector3(x, y, z);
                    obj.transform.position = p;
                    return p;
                }
            }
            Tools.d3_maximumDistanceLimi = d3_maximumDistanceLimi;
            function d3_rayScanning(camera, scene3D, vector2, filtrateName) {
                let _ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
                let outs = new Array();
                camera.viewportPointToRay(vector2, _ray);
                scene3D.physicsSimulation.rayCastAll(_ray, outs);
                if (outs.length != 0 && filtrateName) {
                    let outsChaild = null;
                    for (var i = 0; i < outs.length; i++) {
                        let hitResult = outs[i].collider.owner;
                        if (hitResult.name === filtrateName) {
                            outsChaild = outs[i];
                        }
                    }
                    return outsChaild;
                }
                else {
                    return outs;
                }
            }
            Tools.d3_rayScanning = d3_rayScanning;
            function d3_TransitionScreenPointfor(v3, camera) {
                let ScreenV4 = new Laya.Vector4();
                camera.viewport.project(v3, camera.projectionViewMatrix, ScreenV4);
                let point = new Laya.Vector2();
                point.x = ScreenV4.x;
                point.y = ScreenV4.y;
                return point;
            }
            Tools.d3_TransitionScreenPointfor = d3_TransitionScreenPointfor;
            function d3_animatorPlay(Sp3D, aniName, normalizedTime, layerIndex) {
                let sp3DAni = Sp3D.getComponent(Laya.Animator);
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
            Tools.d3_animatorPlay = d3_animatorPlay;
            function dAll_reverseVector(type, Vecoter1, Vecoter2, normalizing) {
                let p;
                if (type === '2d') {
                    p = new Laya.Point(Vecoter1.x - Vecoter2.x, Vecoter1.y - Vecoter2.y);
                    if (normalizing) {
                        p.normalize();
                    }
                    return p;
                }
                else if (type === '3d') {
                    p = new Laya.Vector3(Vecoter1.x - Vecoter2.x, Vecoter1.y - Vecoter2.y, Vecoter1.z - Vecoter2.z);
                    if (normalizing) {
                        let returnP = new Laya.Vector3();
                        Laya.Vector3.normalize(p, returnP);
                        return returnP;
                    }
                    else {
                        return p;
                    }
                }
            }
            Tools.dAll_reverseVector = dAll_reverseVector;
            function sk_indexControl(sk, name) {
                sk.play(name, true);
                sk.player.currentTime = 15 * 1000 / sk.player.cacheFrameRate;
            }
            Tools.sk_indexControl = sk_indexControl;
            let Draw;
            (function (Draw) {
                function drawPieMask(parent, startAngle, endAngle) {
                    parent.cacheAs = "bitmap";
                    let drawPieSpt = new Laya.Sprite();
                    drawPieSpt.blendMode = "destination-out";
                    parent.addChild(drawPieSpt);
                    let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
                    return drawPie;
                }
                Draw.drawPieMask = drawPieMask;
                function reverseRoundMask(node, x, y, radius, eliminate) {
                    if (eliminate == undefined || eliminate == true) {
                        Node.removeAllChildren(node);
                    }
                    let interactionArea = new Laya.Sprite();
                    interactionArea.name = 'reverseRoundMask';
                    interactionArea.blendMode = "destination-out";
                    node.cacheAs = "bitmap";
                    node.addChild(interactionArea);
                    interactionArea.graphics.drawCircle(0, 0, radius, "#000000");
                    interactionArea.pos(x, y);
                    return interactionArea;
                }
                Draw.reverseRoundMask = reverseRoundMask;
                function reverseRoundrectMask(node, x, y, width, height, round, eliminate) {
                    if (eliminate == undefined || eliminate == true) {
                        Node.removeAllChildren(node);
                    }
                    let interactionArea = new Laya.Sprite();
                    interactionArea.name = 'reverseRoundrectMask';
                    interactionArea.blendMode = "destination-out";
                    node.cacheAs = "bitmap";
                    node.addChild(interactionArea);
                    interactionArea.graphics.drawPath(0, 0, [["moveTo", 5, 0], ["lineTo", width - round, 0], ["arcTo", width, 0, width, round, round], ["lineTo", width, height - round], ["arcTo", width, height, width - round, height, round], ["lineTo", height - round, height], ["arcTo", 0, height, 0, height - round, round], ["lineTo", 0, round], ["arcTo", 0, 0, round, 0, round], ["closePath"]], { fillStyle: "#000000" });
                    interactionArea.width = width;
                    interactionArea.height = height;
                    interactionArea.pivotX = width / 2;
                    interactionArea.pivotY = height / 2;
                    interactionArea.pos(x, y);
                }
                Draw.reverseRoundrectMask = reverseRoundrectMask;
            })(Draw = Tools.Draw || (Tools.Draw = {}));
            function objArrPropertySort(array, property) {
                var compare = function (obj1, obj2) {
                    var val1 = obj1[property];
                    var val2 = obj2[property];
                    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                        val1 = Number(val1);
                        val2 = Number(val2);
                    }
                    if (val1 < val2) {
                        return -1;
                    }
                    else if (val1 > val2) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                };
                array.sort(compare);
                return array;
            }
            Tools.objArrPropertySort = objArrPropertySort;
            function objArr2DifferentPropertyObjArr1(objArr1, objArr2, property) {
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
                        result.push(obj1);
                    }
                }
                return result;
            }
            Tools.objArr2DifferentPropertyObjArr1 = objArr2DifferentPropertyObjArr1;
            function objArr1IdenticalPropertyObjArr2(data1, data2, property) {
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
            Tools.objArr1IdenticalPropertyObjArr2 = objArr1IdenticalPropertyObjArr2;
            function objArrUnique(arr, property) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    for (var j = i + 1, len = arr.length; j < len; j++) {
                        if (arr[i][property] === arr[j][property]) {
                            arr.splice(j, 1);
                            j--;
                            len--;
                        }
                    }
                }
                return arr;
            }
            Tools.objArrUnique = objArrUnique;
            function objArrGetValue(objArr, property) {
                let arr = [];
                for (let i = 0; i < objArr.length; i++) {
                    if (objArr[i][property]) {
                        arr.push(objArr[i][property]);
                    }
                }
                return arr;
            }
            Tools.objArrGetValue = objArrGetValue;
            function objArray_Copy(ObjArray) {
                var sourceCopy = ObjArray instanceof Array ? [] : {};
                for (var item in ObjArray) {
                    sourceCopy[item] = typeof ObjArray[item] === 'object' ? obj_Copy(ObjArray[item]) : ObjArray[item];
                }
                return sourceCopy;
            }
            Tools.objArray_Copy = objArray_Copy;
            function obj_Copy(obj) {
                var objCopy = {};
                for (const item in obj) {
                    if (obj.hasOwnProperty(item)) {
                        const element = obj[item];
                        if (typeof element === 'object') {
                            if (Array.isArray(element)) {
                                let arr1 = array_Copy(element);
                                objCopy[item] = arr1;
                            }
                            else {
                                obj_Copy(element);
                            }
                        }
                        else {
                            objCopy[item] = element;
                        }
                    }
                }
                return objCopy;
            }
            Tools.obj_Copy = obj_Copy;
            function arrayAddToarray(array1, array2) {
                for (let index = 0; index < array2.length; index++) {
                    const element = array2[index];
                    array1.push(element);
                }
                return array1;
            }
            Tools.arrayAddToarray = arrayAddToarray;
            function arrayRandomGetOut(arr, num) {
                if (!num) {
                    num = 1;
                }
                let arrCopy = Tools.array_Copy(arr);
                let arr0 = [];
                if (num > arrCopy.length) {
                    return '数组长度小于取出的数！';
                }
                else {
                    for (let index = 0; index < num; index++) {
                        let ran = Math.round(Math.random() * (arrCopy.length - 1));
                        let a1 = arrCopy[ran];
                        arrCopy.splice(ran, 1);
                        arr0.push(a1);
                    }
                    return arr0;
                }
            }
            Tools.arrayRandomGetOut = arrayRandomGetOut;
            function arrayRandomGetOne(arr) {
                let arrCopy = Tools.array_Copy(arr);
                let ran = Math.round(Math.random() * (arrCopy.length - 1));
                return arrCopy[ran];
            }
            Tools.arrayRandomGetOne = arrayRandomGetOne;
            function array_Copy(arr1) {
                var arr = [];
                for (var i = 0; i < arr1.length; i++) {
                    arr.push(arr1[i]);
                }
                return arr;
            }
            Tools.array_Copy = array_Copy;
            function arrayUnique_01(arr) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    for (var j = i + 1, len = arr.length; j < len; j++) {
                        if (arr[i] === arr[j]) {
                            arr.splice(j, 1);
                            j--;
                            len--;
                        }
                    }
                }
                return arr;
            }
            Tools.arrayUnique_01 = arrayUnique_01;
            function arrayUnique_02(arr) {
                arr = arr.sort();
                var arr1 = [arr[0]];
                for (var i = 1, len = arr.length; i < len; i++) {
                    if (arr[i] !== arr[i - 1]) {
                        arr1.push(arr[i]);
                    }
                }
                return arr1;
            }
            Tools.arrayUnique_02 = arrayUnique_02;
            function arrayUnique_03(arr) {
                return Array.from(new Set(arr));
            }
            Tools.arrayUnique_03 = arrayUnique_03;
            function array1ExcludeArray2(arr1, arr2) {
                let arr1Capy = array_Copy(arr1);
                let arr2Capy = array_Copy(arr2);
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
            Tools.array1ExcludeArray2 = array1ExcludeArray2;
            function array_ExcludeArrays(arrays, exclude) {
                let arr0 = [];
                for (let i = 0; i < arrays.length; i++) {
                    for (let j = 0; j < arrays[i].length; j++) {
                        arr0.push(arrays[i][j]);
                    }
                }
                let arr1 = Tools.array_Copy(arr0);
                let arr2 = Tools.arrayUnique_01(arr1);
                let arrNum = [];
                for (let k = 0; k < arr2.length; k++) {
                    arrNum.push({
                        name: arr2[k],
                        num: 0,
                    });
                }
                for (let l = 0; l < arr0.length; l++) {
                    for (let m = 0; m < arrNum.length; m++) {
                        if (arr0[l] == arrNum[m]['name']) {
                            arrNum[m]['num']++;
                        }
                    }
                }
                let arrAllHave = [];
                let arrDiffHave = [];
                for (let n = 0; n < arrNum.length; n++) {
                    const element = arrNum[n];
                    if (arrNum[n]['num'] == arrays.length) {
                        arrAllHave.push(arrNum[n]['name']);
                    }
                    else {
                        arrDiffHave.push(arrNum[n]['name']);
                    }
                }
                if (!exclude) {
                    return arrAllHave;
                }
                else {
                    return arrDiffHave;
                }
            }
            Tools.array_ExcludeArrays = array_ExcludeArrays;
            let Point;
            (function (Point) {
                function dotRotatePoint(x0, y0, x1, y1, angle) {
                    let x2 = x0 + (x1 - x0) * Math.cos(angle * Math.PI / 180) - (y1 - y0) * Math.sin(angle * Math.PI / 180);
                    let y2 = y0 + (x1 - x0) * Math.sin(angle * Math.PI / 180) + (y1 - y0) * Math.cos(angle * Math.PI / 180);
                    return new Laya.Point(x2, y2);
                }
                Point.dotRotatePoint = dotRotatePoint;
                function SpeedXYByAngle(angle, speed) {
                    if (angle % 90 === 0 || !angle) {
                    }
                    const speedXY = { x: 0, y: 0 };
                    speedXY.x = speed * Math.cos(angle * Math.PI / 180);
                    speedXY.y = speed * Math.sin(angle * Math.PI / 180);
                    return new Laya.Point(speedXY.x, speedXY.y);
                }
                Point.SpeedXYByAngle = SpeedXYByAngle;
                function getRoundPos(angle, radius, centerPos) {
                    var center = centerPos;
                    var radius = radius;
                    var hudu = (2 * Math.PI / 360) * angle;
                    var X = center.x + Math.sin(hudu) * radius;
                    var Y = center.y - Math.cos(hudu) * radius;
                    return new Laya.Point(X, Y);
                }
                Point.getRoundPos = getRoundPos;
                function randomPointByCenter(centerPos, radiusX, radiusY, count) {
                    if (!count) {
                        count = 1;
                    }
                    let arr = [];
                    for (let index = 0; index < count; index++) {
                        let x0 = Tools.randomCountNumer(0, radiusX, 1, false);
                        let y0 = Tools.randomCountNumer(0, radiusY, 1, false);
                        let diffX = Tools.randomOneHalf() == 0 ? x0[0] : -x0[0];
                        let diffY = Tools.randomOneHalf() == 0 ? y0[0] : -y0[0];
                        let p = new Laya.Point(centerPos.x + diffX, centerPos.y + diffY);
                        arr.push(p);
                    }
                    return arr;
                }
                Point.randomPointByCenter = randomPointByCenter;
                function getPArrBetweenTwoP(p1, p2, num) {
                    let arr = [];
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
                Point.getPArrBetweenTwoP = getPArrBetweenTwoP;
            })(Point = Tools.Point || (Tools.Point = {}));
            function angle_GetRad(angle) {
                return angle / 180 * Math.PI;
            }
            Tools.angle_GetRad = angle_GetRad;
            function jsonCompare(url, storageName, propertyName) {
                let dataArr;
                try {
                    Laya.LocalStorage.getJSON(storageName);
                }
                catch (error) {
                    dataArr = Laya.loader.getRes(url)['RECORDS'];
                    Laya.LocalStorage.setJSON(storageName, JSON.stringify(dataArr));
                    return dataArr;
                }
                if (Laya.LocalStorage.getJSON(storageName)) {
                    dataArr = JSON.parse(Laya.LocalStorage.getJSON(storageName));
                    console.log(storageName + '从本地缓存中获取到数据,将和文件夹的json文件进行对比');
                    try {
                        let dataArr_0 = Laya.loader.getRes(url)['RECORDS'];
                        if (dataArr_0.length >= dataArr.length) {
                            let diffArray = Tools.objArr2DifferentPropertyObjArr1(dataArr_0, dataArr, propertyName);
                            console.log('两个数据的差值为：', diffArray);
                            Tools.arrayAddToarray(dataArr, diffArray);
                        }
                        else {
                            console.log(storageName + '数据表填写有误，长度不能小于之前的长度');
                        }
                    }
                    catch (error) {
                        console.log(storageName, '数据赋值失败！请检查数据表或者手动赋值！');
                    }
                }
                else {
                    try {
                        dataArr = Laya.loader.getRes(url)['RECORDS'];
                    }
                    catch (error) {
                        console.log(storageName + '数据赋值失败！请检查数据表或者手动赋值！');
                    }
                }
                Laya.LocalStorage.setJSON(storageName, JSON.stringify(dataArr));
                return dataArr;
            }
            Tools.jsonCompare = jsonCompare;
        })(Tools = lwg.Tools || (lwg.Tools = {}));
        let LwgPreLoad;
        (function (LwgPreLoad) {
            let _scene3D = [];
            let _prefab3D = [];
            let _mesh3D = [];
            let _material = [];
            let _texture = [];
            let _texture2D = [];
            let _pic2D = [];
            let _scene2D = [];
            let _prefab2D = [];
            let _json = [];
            let _skeleton = [];
            LwgPreLoad._sumProgress = 0;
            LwgPreLoad._loadOrder = [];
            LwgPreLoad._loadOrderIndex = 0;
            LwgPreLoad._loadType = Admin._SceneName.PreLoad;
            let _ListName;
            (function (_ListName) {
                _ListName["scene3D"] = "scene3D";
                _ListName["prefab3D"] = "prefab3D";
                _ListName["mesh3D"] = "mesh3D";
                _ListName["material"] = "material";
                _ListName["texture"] = "texture";
                _ListName["texture2D"] = "texture2D";
                _ListName["pic2D"] = "pic2D";
                _ListName["scene2D"] = "scene2D";
                _ListName["prefab2D"] = "prefab2D";
                _ListName["json"] = "json";
                _ListName["skeleton"] = "skeleton";
            })(_ListName = LwgPreLoad._ListName || (LwgPreLoad._ListName = {}));
            LwgPreLoad._currentProgress = {
                get value() {
                    return this['len'] ? this['len'] : 0;
                },
                set value(val) {
                    this['len'] = val;
                    if (this['len'] >= LwgPreLoad._sumProgress) {
                        if (LwgPreLoad._sumProgress == 0) {
                            return;
                        }
                        console.log('当前进度条进度为:', LwgPreLoad._currentProgress.value / LwgPreLoad._sumProgress);
                        console.log('所有资源加载完成！此时所有资源可通过例如 Laya.loader.getRes("url")获取');
                        EventAdmin._notify(LwgPreLoad._Event.complete);
                    }
                    else {
                        let number = 0;
                        for (let index = 0; index <= LwgPreLoad._loadOrderIndex; index++) {
                            number += LwgPreLoad._loadOrder[index].length;
                        }
                        if (this['len'] == number) {
                            LwgPreLoad._loadOrderIndex++;
                        }
                        EventAdmin._notify(LwgPreLoad._Event.startLoding);
                    }
                },
            };
            let _Event;
            (function (_Event) {
                _Event["importList"] = "_PreLoad_importList";
                _Event["complete"] = "_PreLoad_complete";
                _Event["startLoding"] = "_PreLoad_startLoding";
                _Event["progress"] = "_PreLoad_progress";
            })(_Event = LwgPreLoad._Event || (LwgPreLoad._Event = {}));
            function _remakeLode() {
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
                LwgPreLoad._loadOrder = [];
                LwgPreLoad._sumProgress = 0;
                LwgPreLoad._loadOrderIndex = 0;
                LwgPreLoad._currentProgress.value = 0;
            }
            LwgPreLoad._remakeLode = _remakeLode;
            class _PreLoadScene extends Admin._SceneBase {
                moduleOnAwake() {
                    LwgPreLoad._remakeLode();
                }
                lwgStartLoding(any) {
                    EventAdmin._notify(LwgPreLoad._Event.importList, (any));
                }
                moduleEventRegister() {
                    EventAdmin._register(_Event.importList, this, (listObj) => {
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
                        LwgPreLoad._loadOrder = [_pic2D, _scene2D, _prefab2D, _scene3D, _prefab3D, _json, _texture, _texture2D, _mesh3D, _material, _skeleton];
                        for (let index = 0; index < LwgPreLoad._loadOrder.length; index++) {
                            LwgPreLoad._sumProgress += LwgPreLoad._loadOrder[index].length;
                            if (LwgPreLoad._loadOrder[index].length <= 0) {
                                LwgPreLoad._loadOrder.splice(index, 1);
                                index--;
                            }
                        }
                        let time = this.lwgOpenAni();
                        if (time == null) {
                            time = 0;
                        }
                        Laya.timer.once(time, this, () => {
                            EventAdmin._notify(LwgPreLoad._Event.startLoding);
                        });
                    });
                    EventAdmin._register(_Event.startLoding, this, () => { this.startLodingRule(); });
                    EventAdmin._register(_Event.complete, this, () => {
                        let time = this.lwgAllComplete();
                        Laya.timer.once(time, this, () => {
                            this._Owner.name = LwgPreLoad._loadType;
                            Admin._sceneControl[LwgPreLoad._loadType] = this._Owner;
                            if (LwgPreLoad._loadType !== Admin._SceneName.PreLoad) {
                                if (Admin._preLoadOpenSceneLater.openName) {
                                    Admin._openScene(Admin._preLoadOpenSceneLater.openName, Admin._preLoadOpenSceneLater.cloesName, () => {
                                        Admin._preLoadOpenSceneLater.func;
                                        Admin._closeScene(LwgPreLoad._loadType);
                                    }, Admin._preLoadOpenSceneLater.zOrder);
                                }
                            }
                            else {
                                for (const key in Admin._moudel) {
                                    if (Object.prototype.hasOwnProperty.call(Admin._moudel, key)) {
                                        const element = Admin._moudel[key];
                                        if (element['_init']) {
                                            element['_init']();
                                        }
                                        else {
                                            console.log(element, '模块没有初始化函数！');
                                        }
                                    }
                                }
                                PalyAudio.playMusic();
                                this._openScene(_SceneName.Guide, true, () => {
                                    LwgPreLoad._loadType = Admin._SceneName.PreLoadStep;
                                });
                            }
                        });
                    });
                    EventAdmin._register(_Event.progress, this, () => {
                        LwgPreLoad._currentProgress.value++;
                        if (LwgPreLoad._currentProgress.value < LwgPreLoad._sumProgress) {
                            console.log('当前进度条进度为:', LwgPreLoad._currentProgress.value / LwgPreLoad._sumProgress);
                            this.lwgStepComplete();
                        }
                    });
                }
                moduleOnEnable() {
                    LwgPreLoad._loadOrderIndex = 0;
                }
                startLodingRule() {
                    if (LwgPreLoad._loadOrder.length <= 0) {
                        console.log('没有加载项');
                        EventAdmin._notify(LwgPreLoad._Event.complete);
                        return;
                    }
                    let alreadyPro = 0;
                    for (let i = 0; i < LwgPreLoad._loadOrderIndex; i++) {
                        alreadyPro += LwgPreLoad._loadOrder[i].length;
                    }
                    let index = LwgPreLoad._currentProgress.value - alreadyPro;
                    switch (LwgPreLoad._loadOrder[LwgPreLoad._loadOrderIndex]) {
                        case _pic2D:
                            Laya.loader.load(_pic2D[index], Laya.Handler.create(this, (any) => {
                                if (any == null) {
                                    console.log('XXXXXXXXXXX2D资源' + _pic2D[index] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    console.log('2D图片' + _pic2D[index] + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case _scene2D:
                            Laya.loader.load(_scene2D[index], Laya.Handler.create(this, (any) => {
                                if (any == null) {
                                    console.log('XXXXXXXXXXX数据表' + _scene2D[index] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    console.log('2D场景' + _scene2D[index] + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }), null, Laya.Loader.JSON);
                            break;
                        case _scene3D:
                            Laya.Scene3D.load(_scene3D[index]['url'], Laya.Handler.create(this, (Scene) => {
                                if (Scene == null) {
                                    console.log('XXXXXXXXXXX3D场景' + _scene3D[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    _scene3D[index]['Scene'] = Scene;
                                    console.log('3D场景' + _scene3D[index]['url'] + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case _prefab3D:
                            Laya.Sprite3D.load(_prefab3D[index]['url'], Laya.Handler.create(this, (Sp) => {
                                if (Sp == null) {
                                    console.log('XXXXXXXXXXX3D预设体' + _prefab3D[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
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
                                }
                                else {
                                    console.log('3D网格' + _mesh3D[index]['url'] + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case _texture:
                            Laya.loader.load(_texture[index]['url'], Laya.Handler.create(this, (tex) => {
                                if (tex == null) {
                                    console.log('XXXXXXXXXXX2D纹理' + _texture[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    _texture[index]['texture'] = tex;
                                    console.log('纹理' + _texture[index]['url'] + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case _texture2D:
                            Laya.Texture2D.load(_texture2D[index]['url'], Laya.Handler.create(this, (tex) => {
                                if (tex == null) {
                                    console.log('XXXXXXXXXXX2D纹理' + _texture2D[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    _texture2D[index]['texture2D'] = tex;
                                    console.log('2D纹理' + _texture2D[index]['url'] + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case _material:
                            Laya.Material.load(_material[index]['url'], Laya.Handler.create(this, (any) => {
                                if (any == null) {
                                    console.log('XXXXXXXXXXX材质' + _material[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    console.log('材质' + _material[index]['url'] + '加载完成！', '数组下标为：', index);
                                }
                                EventAdmin._notify(_Event.progress);
                            }));
                            break;
                        case _json:
                            Laya.loader.load(_json[index]['url'], Laya.Handler.create(this, (data) => {
                                if (data == null) {
                                    console.log('XXXXXXXXXXX数据表' + _json[index] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    _json[index]['data'] = data["RECORDS"];
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
                            Laya.loader.load(_prefab2D[index]['url'], Laya.Handler.create(this, (prefab) => {
                                if (prefab == null) {
                                    console.log('XXXXXXXXXXX数据表' + _prefab2D[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
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
                lwgStepComplete() { }
                lwgAllComplete() { return 0; }
                ;
            }
            LwgPreLoad._PreLoadScene = _PreLoadScene;
        })(LwgPreLoad = lwg.LwgPreLoad || (lwg.LwgPreLoad = {}));
        let _LwgInit;
        (function (_LwgInit) {
            _LwgInit._pkgStep = 0;
            _LwgInit._pkgInfo = [
                { name: "sp1", root: "res" },
                { name: "sp2", root: "3DScene" },
                { name: "sp3", root: "3DPrefab" },
            ];
            let _Event;
            (function (_Event) {
                _Event["start"] = "_ResPrepare_start";
                _Event["nextStep"] = "_ResPrepare_nextStep";
                _Event["compelet"] = "_ResPrepare_compelet";
            })(_Event = _LwgInit._Event || (_LwgInit._Event = {}));
            function _init() {
                switch (Admin._platform.ues) {
                    case Admin._platform.tpye.WeChat:
                        _loadPkg_Wechat();
                        break;
                    case Admin._platform.tpye.OPPO || Admin._platform.tpye.VIVO:
                        _loadPkg_VIVO();
                        break;
                    default:
                        break;
                }
            }
            _LwgInit._init = _init;
            function _loadPkg_VIVO() {
                if (_LwgInit._pkgStep !== _LwgInit._pkgInfo.length) {
                    let info = _LwgInit._pkgInfo[_LwgInit._pkgStep];
                    let name = info.name;
                    Laya.Browser.window.qg.loadSubpackage({
                        name: name,
                        success: (res) => {
                            _LwgInit._pkgStep++;
                            _loadPkg_VIVO();
                        },
                        fail: (res) => {
                            console.error(`load ${name} err: `, res);
                        },
                    });
                }
            }
            _LwgInit._loadPkg_VIVO = _loadPkg_VIVO;
            function _loadPkg_Wechat() {
                if (_LwgInit._pkgStep !== _LwgInit._pkgInfo.length) {
                    let info = _LwgInit._pkgInfo[_LwgInit._pkgStep];
                    let name = info.name;
                    let root = info.root;
                    Laya.Browser.window.wx.loadSubpackage({
                        name: name,
                        success: (res) => {
                            console.log(`load ${name} suc`);
                            Laya.MiniAdpter.subNativeFiles[name] = root;
                            Laya.MiniAdpter.nativefiles.push(root);
                            _LwgInit._pkgStep++;
                            console.log("加载次数", _LwgInit._pkgStep);
                            _loadPkg_Wechat();
                        },
                        fail: (res) => {
                            console.error(`load ${name} err: `, res);
                        },
                    });
                }
            }
            _LwgInit._loadPkg_Wechat = _loadPkg_Wechat;
            class _LwgInitScene extends Admin._SceneBase {
                moduleOnStart() {
                    _init();
                    this._openScene(_SceneName.PreLoad, null, () => {
                    });
                }
                ;
            }
            _LwgInit._LwgInitScene = _LwgInitScene;
        })(_LwgInit = lwg._LwgInit || (lwg._LwgInit = {}));
    })(lwg || (lwg = {}));
    var lwg$1 = lwg;
    let Admin = lwg.Admin;
    let _SceneBase = Admin._SceneBase;
    let _ObjectBase = Admin._ObjectBase;
    let DataAdmin = lwg.DataAdmin;
    let _SceneName = Admin._SceneName;
    let EventAdmin = lwg.EventAdmin;
    let DateAdmin = lwg.DateAdmin;
    let TimerAdmin = lwg.TimerAdmin;
    let Pause = lwg.Pause;
    let Execution = lwg.Execution;
    let _Gold = lwg.Gold;
    let Setting = lwg.Setting;
    let PalyAudio = lwg.PalyAudio;
    let Click = lwg.Click;
    let Color = lwg.Color;
    let Effects = lwg.Effects;
    let Dialogue = lwg.Dialogue;
    let Animation2D = lwg.Animation2D;
    let Animation3D = lwg.Animation3D;
    let Tools = lwg.Tools;
    let _LwgPreLoad = lwg.LwgPreLoad;
    let _PreLoadScene = lwg.LwgPreLoad._PreLoadScene;
    let _LwgInit = lwg._LwgInit;
    let _LwgInitScene = lwg._LwgInit._LwgInitScene;

    var _Game;
    (function (_Game) {
        let _Event;
        (function (_Event) {
            _Event["start"] = "_Game_start";
            _Event["showStepBtn"] = "_Game_showStepBtn";
            _Event["lastStep"] = "_Game_lastStep";
            _Event["nextStep"] = "_Game_nextStep";
            _Event["compelet"] = "_Game_compelet";
            _Event["playAni1"] = "_Game_playAni1";
            _Event["playAni2"] = "_Game_playAni2";
            _Event["restoreZOder"] = "_Game_restoreZoder";
            _Event["colseScene"] = "_Game_colseScene";
            _Event["victory"] = "_Game_victory";
            _Event["Photo"] = "_Game_Photo";
            _Event["turnRight"] = "_Game_turnRight";
            _Event["turnLeft"] = "_Game_turnLeft";
            _Event["generalRefresh"] = "_Game_generalRefresh";
        })(_Event = _Game._Event || (_Game._Event = {}));
        let _Animation;
        (function (_Animation) {
            _Animation["action1"] = "action1";
            _Animation["action2"] = "action2";
        })(_Animation = _Game._Animation || (_Game._Animation = {}));
        function _init() {
        }
        _Game._init = _init;
        class Game extends Admin._SceneBase {
        }
        _Game.Game = Game;
    })(_Game || (_Game = {}));
    var _Game$1 = _Game.Game;

    var _Guide;
    (function (_Guide) {
        _Guide._complete = {
            get bool() {
                if (Laya.LocalStorage.getItem('_Guide_complete')) {
                    if (Number(Laya.LocalStorage.getItem('_Guide_complete')) == 0) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return false;
                }
            },
            set bool(bol) {
                if (bol == true) {
                    bol = 1;
                }
                Laya.LocalStorage.setItem('_Guide_complete', bol.toString());
            }
        };
        _Guide._whichStep = {
            get num() {
                return Laya.LocalStorage.getItem('_Guide_whichStep') ? Number(Laya.LocalStorage.getItem('_Guide_whichStep')) : 1;
            },
            set num(num0) {
                Laya.LocalStorage.setItem('_Guide_whichStep', num0.toString());
            }
        };
        _Guide._whichStepNum = 1;
        let _Event;
        (function (_Event) {
            _Event["onStep"] = "_Guide_onStep";
            _Event["stepComplete"] = "_Guide_stepComplete";
            _Event["appear"] = "_Guide_appear";
            _Event["start"] = "_Guide_start";
            _Event["complete"] = "_Guide_complete";
        })(_Event = _Guide._Event || (_Guide._Event = {}));
        function _init() {
        }
        _Guide._init = _init;
        class Guide extends Admin._SceneBase {
            lwgOnEnable() {
            }
            lwgOnStart() {
                console.log('新手引导完成！');
                this._openScene(_SceneName.Start);
            }
            lwgEventRegister() {
            }
        }
        _Guide.Guide = Guide;
    })(_Guide || (_Guide = {}));
    var _Guide$1 = _Guide.Guide;

    var _MakeClothes;
    (function (_MakeClothes) {
        let _Event;
        (function (_Event) {
            _Event["trigger"] = "_MakeClothes_trigger";
        })(_Event = _MakeClothes._Event || (_MakeClothes._Event = {}));
        class DottedLine extends DataAdmin._Table {
            constructor(Root, LineParent) {
                super();
                this.Root = Root;
                this.LineParent = LineParent;
                this.init();
            }
            init() {
                for (let index = 0; index < this.LineParent.numChildren; index++) {
                    const element = this.LineParent.getChildAt(index);
                    if (element.getComponents(Laya.BoxCollider)) {
                        let data = {};
                        data['Img'] = element;
                        data[this._property.name] = element.name;
                        data[this._property.conditionNum] = element.getComponents(Laya.BoxCollider).length;
                        data[this._property.degreeNum] = 0;
                        this._arr.push(data);
                    }
                }
            }
            removeCloth(name) {
                this.LineParent.getChildByName(name).removeSelf();
                let Cloth = this.Root.getChildByName(`Cloth${name.substr(4)}`);
                if (Cloth) {
                    Cloth.removeSelf();
                }
                else {
                    console.log('当前虚线上没有可以裁剪布料，请查看');
                }
            }
        }
        _MakeClothes.DottedLine = DottedLine;
        class Scissor extends Admin._ObjectBase {
            onTriggerEnter(other, self) {
                EventAdmin._notify(_Event.trigger, [other.owner.name]);
                other.destroy();
            }
        }
        _MakeClothes.Scissor = Scissor;
        class MakeClothes extends Admin._SceneBase {
            constructor() {
                super(...arguments);
                this.Cutting = {
                    Scissor: () => {
                        return this._ImgVar('Scissor');
                    },
                    touchP: new Laya.Point(),
                    diffP: new Laya.Point(),
                    EraserSp: () => {
                        if (!this._ImgVar('LineParent').getChildByName('EraserSp')) {
                            let Sp = new Laya.Sprite();
                            Sp.name = 'EraserSp';
                            Sp.blendMode = "destination-out";
                            this._ImgVar('LineParent').addChild(Sp);
                            this._ImgVar('LineParent').cacheAs = "bitmap";
                            return Sp;
                        }
                        else {
                            return this._ImgVar('LineParent').getChildByName('EraserSp');
                        }
                    },
                    EraserSize: 60,
                    erasureLine: () => {
                        let gPos = this.Cutting.Scissor().parent.localToGlobal(new Laya.Point(this._ImgVar('Scissor').x, this._ImgVar('Scissor').y));
                        let localPos = this.Cutting.EraserSp().globalToLocal(gPos);
                        this.Cutting.EraserSp().graphics.drawCircle(localPos.x, localPos.y, this.Cutting.EraserSize / 2, "#000000");
                    }
                };
            }
            lwgOnAwake() {
                this.DottedLineControl = new DottedLine(this._ImgVar('Root'), this._ImgVar('LineParent'));
                console.log(this.DottedLineControl._arr);
                this._ImgVar('Scissor').addComponent(Scissor);
            }
            lwgEventRegister() {
                EventAdmin._register(_Event.trigger, this, (name) => {
                    let value = this.DottedLineControl._checkCondition(name);
                    if (value) {
                        this.DottedLineControl.removeCloth(name);
                    }
                });
            }
            lwgBtnRegister() {
                this._btnUp(this._ImgVar('BtnBack'), () => {
                    this._openScene(_SceneName.Start);
                });
            }
            onStageMouseDown(e) {
                this.Cutting.touchP = new Laya.Point(e.stageX, e.stageY);
            }
            onStageMouseMove(e) {
                if (this.Cutting.touchP) {
                    this.Cutting.diffP.x = e.stageX - this.Cutting.touchP.x;
                    this.Cutting.diffP.y = e.stageY - this.Cutting.touchP.y;
                    this.Cutting.Scissor().x += this.Cutting.diffP.x;
                    this.Cutting.Scissor().y += this.Cutting.diffP.y;
                    this.Cutting.erasureLine();
                    this.Cutting.touchP = new Laya.Point(e.stageX, e.stageY);
                }
            }
            onStageMouseUp() {
                this.Cutting.touchP = null;
            }
        }
        _MakeClothes.MakeClothes = MakeClothes;
    })(_MakeClothes || (_MakeClothes = {}));

    var _Res;
    (function (_Res) {
        _Res._list = {
            scene3D: {
                MakeScene: {
                    url: `_Lwg3D/_Scene/LayaScene_MakeScene/Conventional/MakeScene.ls`,
                    Scene: null,
                },
            },
            scene2D: {
                Start: `Scene/${_SceneName.Start}.json`,
                Guide: `Scene/${_SceneName.Guide}.json`,
                PreLoadStep: `Scene/${_SceneName.PreLoadStep}.json`,
            },
        };
    })(_Res || (_Res = {}));
    var _PreLoad;
    (function (_PreLoad) {
        class PreLoad extends _LwgPreLoad._PreLoadScene {
            lwgOnStart() {
                EventAdmin._notify(_LwgPreLoad._Event.importList, (_Res._list));
            }
            lwgOpenAni() { return 1; }
            lwgStepComplete() {
            }
            lwgAllComplete() {
                return 1000;
            }
            lwgOnDisable() {
            }
        }
        _PreLoad.PreLoad = PreLoad;
    })(_PreLoad || (_PreLoad = {}));

    var _PreLoadStepUrl;
    (function (_PreLoadStepUrl) {
        _PreLoadStepUrl._game = {};
    })(_PreLoadStepUrl || (_PreLoadStepUrl = {}));
    var _PreLoadStep;
    (function (_PreLoadStep) {
        class PreLoadStep extends _LwgPreLoad._PreLoadScene {
            lwgOnStart() {
                switch (Admin._preLoadOpenSceneLater.openName) {
                    case _SceneName.Game:
                        EventAdmin._notify(_LwgPreLoad._Event.importList, ([_PreLoadStepUrl._game]));
                        break;
                    default:
                        break;
                }
            }
        }
        _PreLoadStep.PreLoadStep = PreLoadStep;
    })(_PreLoadStep || (_PreLoadStep = {}));
    ;
    var _PreLoadStep$1 = _PreLoadStep.PreLoadStep;

    var _Start;
    (function (_Start) {
        function _init() {
        }
        _Start._init = _init;
        class Start extends Admin._SceneBase {
            lwgBtnRegister() {
                this._btnUp(this._ImgVar('BtnStart'), () => {
                    this._openScene('MakeClothes');
                });
            }
        }
        _Start.Start = Start;
    })(_Start || (_Start = {}));
    var _Start$1 = _Start.Start;

    class LwgInit extends _LwgInitScene {
        lwgOnAwake() {
            _LwgInit._pkgInfo = [];
            Admin._platform.ues = Admin._platform.tpye.Bytedance;
            Admin._sceneAnimation.use = Admin._sceneAnimation.type.stickIn.random;
            Click._Effect.use = Click._Effect.type.largen;
            Admin._moudel = {
                _PreLoad: _PreLoad,
                _Guide: _Guide,
                _Start: _Start,
                _Game: _Game,
                _PreLoadStep: _PreLoadStep,
                _MakeClothes: _MakeClothes,
            };
        }
    }

    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var test;
        (function (test) {
            class TestSceneUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.loadScene("test/TestScene");
                }
            }
            test.TestSceneUI = TestSceneUI;
            REG("ui.test.TestSceneUI", TestSceneUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

    class GameUI extends ui.test.TestSceneUI {
        constructor() {
            super();
            this.newScene = Laya.stage.addChild(new Laya.Scene3D());
            var camera = this.newScene.addChild(new Laya.Camera(0, 0.1, 100));
            camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            var directionLight = new Laya.DirectionLight();
            this.newScene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            var mat = directionLight.transform.worldMatrix;
            mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
            directionLight.transform.worldMatrix = mat;
            var plane = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(10, 10, 10, 10)));
            var planeMat = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load("res/grass.png", Laya.Handler.create(this, function (tex) {
                planeMat.albedoTexture = tex;
            }));
            var tilingOffset = planeMat.tilingOffset;
            tilingOffset.setValue(5, 5, 0, 0);
            planeMat.tilingOffset = tilingOffset;
            plane.meshRenderer.material = planeMat;
            var planeStaticCollider = plane.addComponent(Laya.PhysicsCollider);
            var planeShape = new Laya.BoxColliderShape(10, 0, 10);
            planeStaticCollider.colliderShape = planeShape;
            planeStaticCollider.friction = 2;
            planeStaticCollider.restitution = 0.3;
            this.mat1 = new Laya.BlinnPhongMaterial();
            Laya.Texture2D.load("res/wood.jpg", Laya.Handler.create(this, function (tex) {
                this.mat1.albedoTexture = tex;
                Laya.timer.once(100, this, function () {
                    this.addBox();
                });
            }));
        }
        addBox() {
            var box = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(0.75, 0.5, 0.5)));
            box.meshRenderer.material = this.mat1;
            var transform = box.transform;
            var pos = transform.position;
            pos.setValue(0, 10, 0);
            transform.position = pos;
            var rigidBody = box.addComponent(Laya.Rigidbody3D);
            var boxShape = new Laya.BoxColliderShape(0.75, 0.5, 0.5);
            rigidBody.colliderShape = boxShape;
            rigidBody.mass = 10;
        }
    }

    class GameConfig {
        constructor() {
        }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/Lwg/LwgInit.ts", LwgInit);
            reg("script/GameUI.ts", GameUI);
        }
    }
    GameConfig.width = 1280;
    GameConfig.height = 720;
    GameConfig.scaleMode = "fixedheight";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "Scene/LwgInit.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = true;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
