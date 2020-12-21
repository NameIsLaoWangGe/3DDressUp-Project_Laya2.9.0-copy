(function () {
    'use strict';

    var lwg;
    (function (lwg) {
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
        let Gold;
        (function (Gold_1) {
            Gold_1._num = {
                get value() {
                    return Laya.LocalStorage.getItem('GoldNum') ? Number(Laya.LocalStorage.getItem('GoldNum')) : 0;
                },
                set value(val) {
                    Laya.LocalStorage.setItem('GoldNum', val.toString());
                }
            };
            function _createGoldNode(x, y, parent) {
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
                    Num.text = Tools._Format.formatNumber(Gold_1._num.value);
                    parent.addChild(sp);
                    sp.pos(x, y);
                    sp.zOrder = 100;
                    Gold_1.GoldNode = sp;
                }));
            }
            Gold_1._createGoldNode = _createGoldNode;
            function _add(number) {
                Gold_1._num.value += Number(number);
                let Num = Gold_1.GoldNode.getChildByName('Num');
                Num.text = Tools._Format.formatNumber(Gold_1._num.value);
            }
            Gold_1._add = _add;
            function _addDisPlay(number) {
                let Num = Gold_1.GoldNode.getChildByName('Num');
                Num.value = (Number(Num.value) + Number(number)).toString();
            }
            Gold_1._addDisPlay = _addDisPlay;
            function _addNoDisPlay(number) {
                Gold_1._num.value += Number(number);
            }
            Gold_1._addNoDisPlay = _addNoDisPlay;
            function _nodeAppear(delayed, x, y) {
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
            Gold_1._nodeAppear = _nodeAppear;
            function _nodeVinish(delayed) {
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
            Gold_1._nodeVinish = _nodeVinish;
            let SkinUrl;
            (function (SkinUrl) {
                SkinUrl[SkinUrl["Frame/Effects/iconGold.png"] = 0] = "Frame/Effects/iconGold.png";
            })(SkinUrl || (SkinUrl = {}));
            function _createOne(width, height, url) {
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
            Gold_1._createOne = _createOne;
            function _getAni_Single(parent, number, width, height, url, firstPoint, targetPoint, func1, func2) {
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
            Gold_1._getAni_Single = _getAni_Single;
            function _getAni_Heap(parent, number, width, height, url, firstPoint, targetPoint, func1, func2) {
                for (let index = 0; index < number; index++) {
                    let Gold = _createOne(width ? width : 100, height ? height : 100, url ? url : SkinUrl[0]);
                    parent = parent ? parent : Laya.stage;
                    parent.addChild(Gold);
                    firstPoint = firstPoint ? firstPoint : new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2);
                    targetPoint = targetPoint ? targetPoint : new Laya.Point(Gold_1.GoldNode.x, Gold_1.GoldNode.y);
                    let x = Math.floor(Math.random() * 2) == 1 ? firstPoint.x + Math.random() * 100 : firstPoint.x - Math.random() * 100;
                    let y = Math.floor(Math.random() * 2) == 1 ? firstPoint.y + Math.random() * 100 : firstPoint.y - Math.random() * 100;
                    Animation2D.move_Scale(Gold, 0.5, firstPoint.x, firstPoint.y, x, y, 1, 300, Math.random() * 100 + 100, Laya.Ease.expoIn, () => {
                        Animation2D.move_Scale(Gold, 1, Gold.x, Gold.y, targetPoint.x, targetPoint.y, 1, 400, Math.random() * 200 + 100, Laya.Ease.cubicOut, () => {
                            AudioAdmin._playSound(AudioAdmin._voiceUrl.huodejinbi);
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
            Gold_1._getAni_Heap = _getAni_Heap;
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
            function _init() {
                let d = new Date;
                DateAdmin._loginInfo = StorageAdmin._arrayArr('DateAdmin._loginInfo');
                DateAdmin._loginInfo.value.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()]);
                let arr = [];
                if (DateAdmin._loginInfo.value.length > 0) {
                    for (let index = 0; index < DateAdmin._loginInfo.value.length; index++) {
                        arr.push(DateAdmin._loginInfo.value[index]);
                    }
                }
                arr.push([d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getDay(), d.getHours(), d.getMinutes(), d.getSeconds()]);
                DateAdmin._loginInfo.value = arr;
                DateAdmin._loginCount = StorageAdmin._mum('DateAdmin._loginCount');
                DateAdmin._loginCount.value++;
                DateAdmin._loginToday.num++;
            }
            DateAdmin._init = _init;
            DateAdmin._loginToday = {
                get num() {
                    return Laya.LocalStorage.getItem('DateAdmin._loginToday') ? Number(Laya.LocalStorage.getItem('DateAdmin._loginToday')) : 0;
                },
                set num(val) {
                    if (DateAdmin._date.date == DateAdmin._loginInfo.value[DateAdmin._loginInfo.value.length - 1][2]) {
                        Laya.LocalStorage.setItem('DateAdmin._loginToday', val.toString());
                    }
                }
            };
            DateAdmin._last = {
                get date() {
                    if (DateAdmin._loginInfo.value.length > 1) {
                        return DateAdmin._loginInfo.value[DateAdmin._loginInfo.value.length - 2][2];
                    }
                    else {
                        return DateAdmin._loginInfo.value[DateAdmin._loginInfo.value.length - 1][2];
                    }
                },
            };
            DateAdmin._front = {
                get date() {
                    return DateAdmin._loginInfo.value[DateAdmin._loginInfo.value.length - 1][2];
                },
            };
        })(DateAdmin = lwg.DateAdmin || (lwg.DateAdmin = {}));
        let TimerAdmin;
        (function (TimerAdmin) {
            TimerAdmin._switch = true;
            function _frameLoop(delay, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                Laya.timer.frameLoop(delay, caller, () => {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }, args, coverBefore);
            }
            TimerAdmin._frameLoop = _frameLoop;
            function _frameRandomLoop(delay1, delay2, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                var func = () => {
                    let delay = Tools._Number.randomOneInt(delay1, delay2);
                    Laya.timer.frameOnce(delay, caller, () => {
                        if (TimerAdmin._switch) {
                            method();
                            func();
                        }
                    }, args, coverBefore);
                };
                func();
            }
            TimerAdmin._frameRandomLoop = _frameRandomLoop;
            function _frameNumLoop(delay, num, caller, method, compeletMethod, immediately, args, coverBefore) {
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                let num0 = 0;
                var func = () => {
                    if (TimerAdmin._switch) {
                        num0++;
                        if (num0 >= num) {
                            method();
                            if (compeletMethod) {
                                compeletMethod();
                            }
                            Laya.timer.clear(caller, func);
                        }
                        else {
                            method();
                        }
                    }
                };
                Laya.timer.frameLoop(delay, caller, func, args, coverBefore);
            }
            TimerAdmin._frameNumLoop = _frameNumLoop;
            function _numRandomLoop(delay1, delay2, num, caller, method, compeletMethod, immediately, args, coverBefore) {
                immediately && TimerAdmin._switch && method();
                let num0 = 0;
                var func = () => {
                    let delay = Tools._Number.randomOneInt(delay1, delay2);
                    Laya.timer.frameOnce(delay, caller, () => {
                        if (TimerAdmin._switch) {
                            num0++;
                            if (num0 >= num) {
                                method();
                                compeletMethod();
                            }
                            else {
                                method();
                                func();
                            }
                        }
                    }, args, coverBefore);
                };
                func();
            }
            TimerAdmin._numRandomLoop = _numRandomLoop;
            function _frameNumRandomLoop(delay1, delay2, num, caller, method, compeletMethod, immediately, args, coverBefore) {
                immediately && TimerAdmin._switch && method();
                let num0 = 0;
                var func = () => {
                    let delay = Tools._Number.randomOneInt(delay1, delay2);
                    Laya.timer.frameOnce(delay, caller, () => {
                        if (TimerAdmin._switch) {
                            num0++;
                            if (num0 >= num) {
                                method();
                                compeletMethod && compeletMethod();
                            }
                            else {
                                method();
                                func();
                            }
                        }
                    }, args, coverBefore);
                };
                func();
            }
            TimerAdmin._frameNumRandomLoop = _frameNumRandomLoop;
            function _frameOnce(delay, caller, afterMethod, beforeMethod, args, coverBefore) {
                beforeMethod && beforeMethod();
                Laya.timer.frameOnce(delay, caller, () => {
                    afterMethod();
                }, args, coverBefore);
            }
            TimerAdmin._frameOnce = _frameOnce;
            function _frameNumOnce(delay, num, caller, afterMethod, beforeMethod, args, coverBefore) {
                for (let index = 0; index < num; index++) {
                    if (beforeMethod) {
                        beforeMethod();
                    }
                    Laya.timer.frameOnce(delay, caller, () => {
                        afterMethod();
                    }, args, coverBefore);
                }
            }
            TimerAdmin._frameNumOnce = _frameNumOnce;
            function _loop(delay, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                Laya.timer.loop(delay, caller, () => {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }, args, coverBefore);
            }
            TimerAdmin._loop = _loop;
            function _randomLoop(delay1, delay2, caller, method, immediately, args, coverBefore) {
                if (immediately) {
                    if (TimerAdmin._switch) {
                        method();
                    }
                }
                var func = () => {
                    let delay = Tools._Number.randomOneInt(delay1, delay2);
                    Laya.timer.once(delay, caller, () => {
                        if (TimerAdmin._switch) {
                            method();
                            func();
                        }
                    }, args, coverBefore);
                };
                func();
            }
            TimerAdmin._randomLoop = _randomLoop;
            function _numLoop(delay, num, caller, method, compeletMethod, immediately, args, coverBefore) {
                if (immediately) {
                    method();
                }
                let num0 = 0;
                var func = () => {
                    if (TimerAdmin._switch) {
                        num0++;
                        if (num0 > num) {
                            method();
                            if (compeletMethod) {
                                compeletMethod();
                            }
                            Laya.timer.clear(caller, func);
                        }
                        else {
                            method();
                        }
                    }
                };
                Laya.timer.loop(delay, caller, func, args, coverBefore);
            }
            TimerAdmin._numLoop = _numLoop;
            function _once(delay, caller, afterMethod, beforeMethod, args, coverBefore) {
                if (beforeMethod) {
                    beforeMethod();
                }
                Laya.timer.once(delay, caller, () => {
                    afterMethod();
                }, args, coverBefore);
            }
            TimerAdmin._once = _once;
            function _clearAll(arr) {
                for (let index = 0; index < arr.length; index++) {
                    Laya.timer.clearAll(arr[index]);
                }
            }
            TimerAdmin._clearAll = _clearAll;
            function _clear(arr) {
                for (let index = 0; index < arr.length; index++) {
                    Laya.timer.clear(arr[index][0], arr[index][1]);
                }
            }
            TimerAdmin._clear = _clear;
        })(TimerAdmin = lwg.TimerAdmin || (lwg.TimerAdmin = {}));
        let Adaptive;
        (function (Adaptive) {
            Adaptive._Use = {
                get value() {
                    return this['Adaptive_value'] ? this['Adaptive_value'] : null;
                },
                set value(val) {
                    this['Adaptive_value'] = val;
                }
            };
            function _stageWidth(arr) {
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index];
                    if (element.pivotX == 0 && element.width) {
                        element.x = element.x / Adaptive._Use.value[0] * Laya.stage.width + element.width / 2;
                    }
                    else {
                        element.x = element.x / Adaptive._Use.value[0] * Laya.stage.width;
                    }
                }
            }
            Adaptive._stageWidth = _stageWidth;
            function _stageHeight(arr) {
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index];
                    if (element.pivotY == 0 && element.height) {
                        element.y = element.y / Adaptive._Use.value[1] * element.scaleX * Laya.stage.height + element.height / 2;
                    }
                    else {
                        element.y = element.y / Adaptive._Use.value[1] * element.scaleX * Laya.stage.height;
                    }
                }
            }
            Adaptive._stageHeight = _stageHeight;
            function _center(arr, target) {
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index];
                    if (element.width > 0) {
                        element.x = target.width / 2 - (element.width / 2 - element.pivotX) * element.scaleX;
                    }
                    else {
                        element.x = target.width / 2;
                    }
                    if (element.height > 0) {
                        element.y = target.height / 2 - (element.height / 2 - element.pivotY) * element.scaleY;
                    }
                    else {
                        element.y = target.height / 2;
                    }
                }
            }
            Adaptive._center = _center;
        })(Adaptive = lwg.Adaptive || (lwg.Adaptive = {}));
        let Platform;
        (function (Platform) {
            Platform._Tpye = {
                Bytedance: 'Bytedance',
                WeChat: 'WeChat',
                OPPO: 'OPPO',
                OPPOTest: 'OPPOTest',
                VIVO: 'VIVO',
                General: 'General',
                Web: 'Web',
                WebTest: 'WebTest',
                Research: 'Research',
            };
            Platform._Ues = {
                get value() {
                    return this['_platform_name'] ? this['_platform_name'] : null;
                },
                set value(val) {
                    this['_platform_name'] = val;
                    switch (val) {
                        case Platform._Tpye.WebTest:
                            Laya.LocalStorage.clear();
                            Gold._num.value = 5000;
                            break;
                        case Platform._Tpye.Research:
                            Gold._num.value = 50000000000000;
                            break;
                        default:
                            break;
                    }
                }
            };
        })(Platform = lwg.Platform || (lwg.Platform = {}));
        let SceneAnimation;
        (function (SceneAnimation) {
            SceneAnimation._Type = {
                fadeOut: 'fadeOut',
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
            };
            SceneAnimation._openSwitch = true;
            SceneAnimation._closeSwitch = false;
            SceneAnimation._Use = {
                get value() {
                    return this['SceneAnimation_name'] ? this['SceneAnimation_name'] : null;
                },
                set value(val) {
                    this['SceneAnimation_name'] = val;
                }
            };
            function _commonOpenAni(Scene) {
                let sumDelay = 0;
                var afterAni = () => {
                    Click._switch = true;
                    if (Scene[Scene.name]) {
                        Scene[Scene.name].lwgOpenAniAfter();
                        Scene[Scene.name].lwgButton();
                        Admin._SceneChange._close();
                    }
                };
                if (!SceneAnimation._openSwitch) {
                    afterAni();
                    return 0;
                }
                switch (SceneAnimation._Use.value) {
                    case SceneAnimation._Type.fadeOut:
                        sumDelay = _fadeOut_Open(Scene);
                        break;
                    case SceneAnimation._Type.stickIn.randomstickIn:
                        sumDelay = _stickIn(Scene, SceneAnimation._Type.stickIn.randomstickIn);
                        break;
                    case SceneAnimation._Type.stickIn.upLeftDownLeft:
                        sumDelay = _stickIn(Scene, SceneAnimation._Type.stickIn.upLeftDownLeft);
                        break;
                    case SceneAnimation._Type.stickIn.upRightDownLeft:
                        sumDelay = _stickIn(Scene, SceneAnimation._Type.stickIn.upRightDownLeft);
                    case SceneAnimation._Type.stickIn.randomstickIn:
                        sumDelay = _stickIn(Scene, SceneAnimation._Type.stickIn.randomstickIn);
                    case SceneAnimation._Type.shutters.lSideling:
                        sumDelay = _shutters_Open(Scene, SceneAnimation._Type.shutters.lSideling);
                    default:
                        sumDelay = _fadeOut_Open(Scene);
                        break;
                }
                Laya.timer.once(sumDelay, this, () => {
                    afterAni();
                });
                return sumDelay;
            }
            SceneAnimation._commonOpenAni = _commonOpenAni;
            function _commonCloseAni(CloseScene, closeFunc) {
                CloseScene[CloseScene.name].lwgBeforeCloseAni();
                let sumDelay = 0;
                switch (SceneAnimation._Use.value) {
                    case SceneAnimation._Type.fadeOut:
                        sumDelay = _fadeOut_Close(CloseScene);
                        break;
                    case SceneAnimation._Type.stickIn.upLeftDownLeft:
                        break;
                    case SceneAnimation._Type.stickIn.upRightDownLeft:
                        break;
                    case SceneAnimation._Type.stickIn.randomstickIn:
                        break;
                    case SceneAnimation._Type.shutters.vertical:
                        sumDelay = _shutters_Close(CloseScene, SceneAnimation._Type.shutters.vertical);
                        break;
                    case SceneAnimation._Type.shutters.crosswise:
                        sumDelay = _shutters_Close(CloseScene, SceneAnimation._Type.shutters.crosswise);
                        break;
                    case SceneAnimation._Type.shutters.lSideling:
                        sumDelay = _shutters_Close(CloseScene, SceneAnimation._Type.shutters.lSideling);
                        break;
                    case SceneAnimation._Type.shutters.rSideling:
                        sumDelay = _shutters_Close(CloseScene, SceneAnimation._Type.shutters.rSideling);
                        break;
                    case SceneAnimation._Type.shutters.intersection1:
                        sumDelay = _shutters_Close(CloseScene, SceneAnimation._Type.shutters.intersection1);
                        break;
                    case SceneAnimation._Type.shutters.intersection2:
                        sumDelay = _shutters_Close(CloseScene, SceneAnimation._Type.shutters.intersection2);
                        break;
                    case SceneAnimation._Type.shutters.randomshutters:
                        sumDelay = _shutters_Close(CloseScene, SceneAnimation._Type.shutters.randomshutters);
                        break;
                    default:
                        sumDelay = _fadeOut_Close(CloseScene);
                        break;
                }
                Laya.timer.once(sumDelay, this, () => {
                    closeFunc();
                });
            }
            SceneAnimation._commonCloseAni = _commonCloseAni;
            function _fadeOut_Open(Scene) {
                let time = 400;
                let delay = 300;
                if (Scene['Background']) {
                    Animation2D.fadeOut(Scene, 0, 1, time / 2, delay);
                }
                Animation2D.fadeOut(Scene, 0, 1, time, 0);
                return time + delay;
            }
            function _fadeOut_Close(Scene) {
                let time = 150;
                let delay = 50;
                if (Scene['Background']) {
                    Animation2D.fadeOut(Scene, 1, 0, time / 2);
                }
                Animation2D.fadeOut(Scene, 1, 0, time, delay);
                return time + delay;
            }
            function _shutters_Open(Scene, type) {
                let num = 12;
                let time = 500;
                let delaye = 100;
                let caller = {};
                Scene.scale(1, 0);
                Laya.timer.once(delaye, caller, () => {
                    Scene.scale(1, 1);
                    var htmlCanvas1 = Laya.stage.drawToCanvas(Laya.stage.width, Laya.stage.height, 0, 0);
                    let base641 = htmlCanvas1.toBase64("image/png", 1);
                    Scene.scale(1, 0);
                    for (let index = 0; index < num; index++) {
                        let Sp = new Laya.Image;
                        Laya.stage.addChild(Sp);
                        Sp.width = Laya.stage.width;
                        Sp.height = Laya.stage.height;
                        Sp.pos(0, 0);
                        Sp.zOrder = 100;
                        Sp.name = 'shutters';
                        Sp.skin = base641;
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
                            Sp.destroy();
                        });
                    }
                });
                return time + delaye + 100;
            }
            function _shutters_Close(Scene, type) {
                let num = 12;
                let time = 600;
                let delaye = 100;
                let caller = {};
                let ran = Tools._Array.randomGetOne([0, 1, 2, 3, 4, 5]);
                Laya.timer.once(delaye, caller, () => {
                    var htmlCanvas1 = Laya.stage.drawToCanvas(Laya.stage.width, Laya.stage.height, 0, 0);
                    let base641 = htmlCanvas1.toBase64("image/png", 1);
                    Scene.scale(1, 0);
                    for (let index = 0; index < num; index++) {
                        let Sp = new Laya.Image;
                        Laya.stage.addChild(Sp);
                        Sp.width = Laya.stage.width;
                        Sp.height = Laya.stage.height;
                        Sp.pos(0, 0);
                        Sp.zOrder = 100;
                        Sp.name = 'shutters';
                        Sp.skin = base641;
                        let Mask = new Laya.Image;
                        Mask.skin = `Lwg/UI/ui_orthogon_cycn.png`;
                        Sp.mask = Mask;
                        var func1 = () => {
                            Mask.width = Laya.stage.width;
                            Mask.height = Laya.stage.height / num;
                            Mask.pos(0, Laya.stage.height / num * index);
                            Tools._Node.changePivot(Sp, Sp.width / 2, index * Sp.height / num + Sp.height / num / 2);
                            Animation2D.scale(Sp, 1, 1, 1, 0, time, 0, () => {
                                Sp.destroy();
                            });
                        };
                        var func2 = () => {
                            Mask.width = Laya.stage.width / num;
                            Mask.height = Laya.stage.height;
                            Mask.pos(Laya.stage.width / num * index, 0);
                            Tools._Node.changePivot(Sp, index * Sp.width / num + Sp.width / num / 2, Sp.height / 2);
                            Animation2D.scale(Sp, 1, 1, 0, 1, time, 0, () => {
                                Sp.destroy();
                            });
                        };
                        var func6 = () => {
                            Mask.width = Laya.stage.width;
                            Mask.height = Laya.stage.height / num;
                            Mask.pos(0, Laya.stage.height / num * index);
                            Tools._Node.changePivot(Sp, Sp.width / 2, index * Sp.height / num + Sp.height / num / 2);
                            Animation2D.scale(Sp, 1, 1, 1, 0, time, 0, () => {
                                Sp.destroy();
                            });
                            if (index % 2 == 0) {
                                let Sp1 = new Laya.Image;
                                Laya.stage.addChild(Sp1);
                                Sp1.width = Laya.stage.width;
                                Sp1.height = Laya.stage.height;
                                Sp1.pos(0, 0);
                                Sp1.zOrder = 100;
                                Sp1.name = 'shutters';
                                Sp1.skin = base641;
                                let Mask1 = new Laya.Image;
                                Mask1.skin = `Lwg/UI/ui_orthogon_cycn.png`;
                                Sp1.mask = Mask1;
                                Mask1.width = Laya.stage.width / num;
                                Mask1.height = Laya.stage.height;
                                Mask1.pos(Laya.stage.width / num * index, 0);
                                Tools._Node.changePivot(Sp1, index * Sp1.width / num + Sp1.width / num / 2, Sp1.height / 2);
                                Animation2D.scale(Sp1, 1, 1, 0, 1, time, 0, () => {
                                    Sp1.destroy();
                                });
                            }
                        };
                        var func3 = () => {
                            Mask.width = Laya.stage.width / num;
                            Mask.height = Laya.stage.height + 1000;
                            Mask.pos(Laya.stage.width / num * index, -1000 / 2);
                            Tools._Node.changePivot(Mask, Mask.width / 2, Mask.height / 2);
                            Tools._Node.changePivot(Sp, index * Sp.width / num + Sp.width / num / 2, Sp.height / 2);
                            Mask.rotation = 10;
                            Animation2D.scale(Sp, 1, 1, 0, 1, time, 0, () => {
                                Sp.destroy();
                            });
                        };
                        let addLen = 1000;
                        var func4 = () => {
                            Mask.width = Laya.stage.width / num;
                            Mask.height = Laya.stage.height + addLen;
                            Mask.pos(Laya.stage.width / num * index, -addLen / 2);
                            Tools._Node.changePivot(Mask, Mask.width / 2, Mask.height / 2);
                            Tools._Node.changePivot(Sp, index * Sp.width / num + Sp.width / num / 2, Sp.height / 2);
                            Mask.rotation = -10;
                            Animation2D.scale(Sp, 1, 1, 0, 1, time, 0, () => {
                                Sp.destroy();
                            });
                        };
                        var func5 = () => {
                            Mask.width = Laya.stage.width / num;
                            Mask.height = Laya.stage.height + addLen;
                            Mask.pos(Laya.stage.width / num * index, -addLen / 2);
                            Tools._Node.changePivot(Mask, Mask.width / 2, Mask.height / 2);
                            Tools._Node.changePivot(Sp, index * Sp.width / num + Sp.width / num / 2, Sp.height / 2);
                            Mask.rotation = -15;
                            Animation2D.scale(Sp, 1, 1, 0, 1, time, 0, () => {
                                Sp.destroy();
                            });
                            let Sp2 = new Laya.Image;
                            Laya.stage.addChild(Sp2);
                            Sp2.width = Laya.stage.width;
                            Sp2.height = Laya.stage.height;
                            Sp2.pos(0, 0);
                            Sp2.zOrder = 100;
                            Sp2.name = 'shutters';
                            Sp2.skin = base641;
                            let Mask1 = new Laya.Image;
                            Mask1.skin = `Lwg/UI/ui_orthogon_cycn.png`;
                            Sp2.mask = Mask1;
                            Mask1.width = Laya.stage.width / num;
                            Mask1.height = Laya.stage.height + addLen;
                            Mask1.pos(Laya.stage.width / num * index, -addLen / 2);
                            Tools._Node.changePivot(Mask1, Mask1.width / 2, Mask1.height / 2);
                            Tools._Node.changePivot(Sp2, index * Sp2.width / num + Sp2.width / num / 2, Sp2.height / 2);
                            Mask1.rotation = 15;
                            Animation2D.scale(Sp2, 1, 1, 0, 1, time, 0, () => {
                                Sp2.destroy();
                            });
                        };
                        let arr = [func1, func2, func3, func4, func5, func6];
                        switch (type) {
                            case SceneAnimation._Type.shutters.crosswise:
                                func1();
                                break;
                            case SceneAnimation._Type.shutters.vertical:
                                func2();
                                break;
                            case SceneAnimation._Type.shutters.lSideling:
                                func3();
                                break;
                            case SceneAnimation._Type.shutters.rSideling:
                                func4();
                                break;
                            case SceneAnimation._Type.shutters.intersection1:
                                func5();
                                break;
                            case SceneAnimation._Type.shutters.intersection2:
                                func6();
                            case SceneAnimation._Type.shutters.randomshutters:
                                arr[ran]();
                                break;
                            default:
                                break;
                        }
                    }
                });
                return time + delaye;
            }
            function _stickIn(Scene, type) {
                let sumDelay = 0;
                let time = 700;
                let delay = 100;
                if (Scene.getChildByName('Background')) {
                    Animation2D.fadeOut(Scene.getChildByName('Background'), 0, 1, time);
                }
                let stickInLeftArr = Tools._Node.zOrderByY(Scene, false);
                for (let index = 0; index < stickInLeftArr.length; index++) {
                    const element = stickInLeftArr[index];
                    if (element.name !== 'Background' && element.name.substr(0, 5) !== 'NoAni') {
                        let originalPovitX = element.pivotX;
                        let originalPovitY = element.pivotY;
                        switch (type) {
                            case SceneAnimation._Type.stickIn.upLeftDownLeft:
                                element.rotation = element.y > Laya.stage.height / 2 ? -180 : 180;
                                Tools._Node.changePivot(element, 0, 0);
                                break;
                            case SceneAnimation._Type.stickIn.upRightDownLeft:
                                element.rotation = element.y > Laya.stage.height / 2 ? -180 : 180;
                                Tools._Node.changePivot(element, element.rotation == 180 ? element.width : 0, 0);
                                break;
                            case SceneAnimation._Type.stickIn.randomstickIn:
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
        })(SceneAnimation = lwg.SceneAnimation || (lwg.SceneAnimation = {}));
        let Admin;
        (function (Admin) {
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
                            TimerAdmin._switch = false;
                            Click._switch = true;
                        }
                        else {
                            Admin._game.switch = true;
                            TimerAdmin._switch = true;
                            Click._switch = false;
                        }
                    }
                }
            };
            class _Game {
            }
            Admin._Game = _Game;
            Admin._GuideControl = {
                switch: false,
            };
            Admin._SceneControl = {};
            Admin._sceneScript = {};
            Admin._Moudel = {};
            let _SceneName;
            (function (_SceneName) {
                _SceneName["PreLoad"] = "PreLoad";
                _SceneName["PreLoadCutIn"] = "PreLoadCutIn";
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
            Admin._PreLoadCutIn = {
                openName: null,
                closeName: null,
                func: null,
                zOrder: null,
            };
            function _preLoadOpenScene(openName, closeName, func, zOrder) {
                _openScene(_SceneName.PreLoadCutIn, closeName, func);
                Admin._PreLoadCutIn.openName = openName;
                Admin._PreLoadCutIn.closeName = closeName;
                Admin._PreLoadCutIn.func = func;
                Admin._PreLoadCutIn.zOrder = zOrder;
            }
            Admin._preLoadOpenScene = _preLoadOpenScene;
            class _SceneChange {
                static _openZOderUp() {
                    if (SceneAnimation._closeSwitch) {
                        let num = 0;
                        for (const key in Admin._SceneControl) {
                            if (Object.prototype.hasOwnProperty.call(Admin._SceneControl, key)) {
                                const Scene = Admin._SceneControl[key];
                                if (Scene.parent) {
                                    num++;
                                }
                            }
                        }
                        if (this._openScene) {
                            this._openScene.zOrder = num;
                            for (let index = 0; index < this._closeScene.length; index++) {
                                const element = this._closeScene[index];
                                if (element) {
                                    element.zOrder = --num;
                                }
                                else {
                                    this._closeScene.splice(index, 1);
                                    index--;
                                }
                            }
                        }
                    }
                }
                ;
                static _closeZOderUP(CloseScene) {
                    if (SceneAnimation._closeSwitch) {
                        let num = 0;
                        for (const key in Admin._SceneControl) {
                            if (Object.prototype.hasOwnProperty.call(Admin._SceneControl, key)) {
                                const Scene = Admin._SceneControl[key];
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
                }
                ;
                static _open() {
                    if (this._openScene) {
                        if (this._openZOder) {
                            Laya.stage.addChildAt(this._openScene, this._openZOder);
                        }
                        else {
                            Laya.stage.addChild(this._openScene);
                        }
                        if (Admin._Moudel[`_${this._openScene.name}`]) {
                            if (Admin._Moudel[`_${this._openScene.name}`][this._openScene.name]) {
                                if (!this._openScene.getComponent(Admin._Moudel[`_${this._openScene.name}`][this._openScene.name])) {
                                    this._openScene.addComponent(Admin._Moudel[`_${this._openScene.name}`][this._openScene.name]);
                                }
                            }
                        }
                        else {
                            console.log(`${this._openScene.name}场景没有同名脚本！,需在LwgInit脚本中导入该模块！`);
                        }
                        this._openZOderUp();
                        this._openFunc();
                    }
                }
                ;
                static _close() {
                    if (this._closeScene.length > 0) {
                        for (let index = 0; index < this._closeScene.length; index++) {
                            let scene = this._closeScene[index];
                            if (scene) {
                                _closeScene(scene.name);
                                this._closeScene.splice(index, 1);
                                index--;
                            }
                        }
                    }
                    this._remake();
                }
                static _remake() {
                    this._openScene = null;
                    this._openZOder = 1;
                    this._openFunc = null;
                    this._closeZOder = 0;
                }
            }
            _SceneChange._openScene = null;
            _SceneChange._openZOder = 1;
            _SceneChange._openFunc = null;
            _SceneChange._closeScene = [];
            _SceneChange._closeZOder = 0;
            _SceneChange._sceneNum = 1;
            Admin._SceneChange = _SceneChange;
            function _openScene(openName, closeName, func, zOrder) {
                Click._switch = false;
                Laya.Scene.load('Scene/' + openName + '.json', Laya.Handler.create(this, function (scene) {
                    if (Tools._Node.checkChildren(Laya.stage, openName)) {
                        console.log(openName, '场景重复出现！请检查代码');
                    }
                    else {
                        _SceneChange._openScene = Admin._SceneControl[scene.name = openName] = scene;
                        _SceneChange._closeScene.push(Admin._SceneControl[closeName]);
                        _SceneChange._closeZOder = closeName ? Admin._SceneControl[closeName].zOrder : 0;
                        _SceneChange._openZOder = zOrder ? zOrder : null;
                        _SceneChange._openFunc = func ? func : () => { };
                        _SceneChange._open();
                    }
                }));
            }
            Admin._openScene = _openScene;
            function _closeScene(closeName, func) {
                if (!Admin._SceneControl[closeName]) {
                    console.log('场景', closeName, '关闭失败！可能是名称不对！');
                    return;
                }
                var closef = () => {
                    func && func();
                    Click._switch = true;
                    Admin._SceneControl[closeName].close();
                };
                if (!SceneAnimation._closeSwitch) {
                    closef();
                    return;
                }
                _SceneChange._closeZOderUP(Admin._SceneControl[closeName]);
                let script = Admin._SceneControl[closeName][Admin._SceneControl[closeName].name];
                if (script) {
                    if (script) {
                        Click._switch = false;
                        script.lwgBeforeCloseAni();
                        let time0 = script.lwgCloseAni();
                        if (time0 !== null) {
                            Laya.timer.once(time0, this, () => {
                                closef();
                                Click._switch = true;
                            });
                        }
                        else {
                            SceneAnimation._commonCloseAni(Admin._SceneControl[closeName], closef);
                        }
                    }
                }
            }
            Admin._closeScene = _closeScene;
            class _ScriptBase extends Laya.Script {
                constructor() {
                    super(...arguments);
                    this.ownerSceneName = '';
                }
                getFind(name, type) {
                    if (!this[`_Scene${type}${name}`]) {
                        let Node = Tools._Node.findChild2D(this.owner.scene, name);
                        if (Node) {
                            return this[`_Scene${type}${name}`] = Node;
                        }
                        else {
                            console.log(`场景内不存在节点${name}`);
                        }
                    }
                    else {
                        return this[`_Scene${type}${name}`];
                    }
                }
                _FindImg(name) {
                    return this.getFind(name, '_FindImg');
                }
                _FindSp(name) {
                    return this.getFind(name, '_FindSp');
                }
                _FindBox(name) {
                    return this.getFind(name, '_FindBox');
                }
                _FindTap(name) {
                    return this.getFind(name, '_FindTap');
                }
                _FindLabel(name) {
                    return this.getFind(name, '_FindLabel');
                }
                _FindList(name) {
                    return this.getFind(name, '_FindList');
                }
                _storeNum(name, _func, initial) {
                    return StorageAdmin._mum(`${this.owner.name}/${name}`, _func, initial);
                }
                _storeStr(name, _func, initial) {
                    return StorageAdmin._str(`${this.owner.name}/${name}`, _func, initial);
                }
                _storeBool(name, _func, initial) {
                    return StorageAdmin._bool(`${this.owner.name}/${name}`, _func, initial);
                }
                _storeArray(name, _func, initial) {
                    return StorageAdmin._array(`${this.owner.name}/${name}`, _func, initial);
                }
                lwgOnAwake() { }
                ;
                lwgAdaptive() { }
                ;
                lwgEvent() { }
                ;
                _evReg(name, func) {
                    EventAdmin._register(name, this, func);
                }
                _evRegOne(name, func) {
                    EventAdmin._registerOnce(name, this, func);
                }
                _evNotify(name, args) {
                    EventAdmin._notify(name, args);
                }
                lwgOnEnable() { }
                lwgOnStart() { }
                lwgButton() { }
                ;
                _btnDown(target, down, effect) {
                    Click._on(effect == undefined ? Click._Use.value : effect, target, this, (e) => {
                        Click._switch && down && down(e);
                    }, null, null, null);
                }
                _btnMove(target, move, effect) {
                    Click._on(effect == undefined ? Click._Use.value : effect, target, this, null, (e) => {
                        Click._switch && move && move(e);
                    }, null, null);
                }
                _btnUp(target, up, effect) {
                    Click._on(effect == undefined ? Click._Use.value : effect, target, this, null, null, (e) => {
                        Click._switch && up && up(e);
                    }, null);
                }
                _btnOut(target, out, effect) {
                    Click._on(effect == undefined ? Click._Use.value : effect, target, this, null, null, null, (e) => { Click._switch && out && out(e); });
                }
                _btnFour(target, down, move, up, out, effect) {
                    Click._on(effect == null ? effect : Click._Use.value, target, this, (e) => { Click._switch && down && down(e); }, (e) => { Click._switch && move && move(e); }, (e) => { Click._switch && up && up(e); }, (e) => { Click._switch && out && out(e); });
                }
                _openScene(openName, closeSelf, preLoadCutIn, func, zOrder) {
                    let closeName;
                    if (closeSelf == undefined || closeSelf == true) {
                        closeName = this.ownerSceneName;
                    }
                    if (!preLoadCutIn) {
                        Admin._openScene(openName, closeName, func, zOrder);
                    }
                    else {
                        Admin._preLoadOpenScene(openName, closeName, func, zOrder);
                    }
                }
                _closeScene(sceneName, func) {
                    Admin._closeScene(sceneName ? sceneName : this.ownerSceneName, func);
                }
                lwgOnUpdate() { }
                ;
                lwgOnDisable() { }
                ;
                onStageMouseDown(e) { Click._switch && this.lwgOnStageDown(e); }
                ;
                onStageMouseMove(e) { Click._switch && this.lwgOnStageMove(e); }
                ;
                onStageMouseUp(e) { Click._switch && this.lwgOnStageUp(e); }
                ;
                lwgOnStageDown(e) { }
                ;
                lwgOnStageMove(e) { }
                ;
                lwgOnStageUp(e) { }
                ;
            }
            Admin._ScriptBase = _ScriptBase;
            class _SceneBase extends _ScriptBase {
                constructor() {
                    super();
                    this._calssName = _SceneName.PreLoad;
                }
                get _Owner() {
                    return this.owner;
                }
                getVar(name, type) {
                    if (!this[`_Scene${type}${name}`]) {
                        if (this._Owner[name]) {
                            return this[`_Scene${type}${name}`] = this._Owner[name];
                        }
                        else {
                            console.log('场景内不存在var节点：', name);
                            return undefined;
                        }
                    }
                    else {
                        return this[`_Scene${type}${name}`];
                    }
                }
                _SpriteVar(name) {
                    return this.getVar(name, '_SpriteVar');
                }
                _AniVar(name) {
                    return this.getVar(name, '_AniVar');
                }
                _BtnVar(name) {
                    return this.getVar(name, '_BtnVar');
                }
                _ImgVar(name) {
                    return this.getVar(name, '_ImgVar');
                }
                _LabelVar(name) {
                    return this.getVar(name, '_LabelVar');
                }
                _ListVar(name) {
                    return this.getVar(name, '_ListVar');
                }
                _TapVar(name) {
                    return this.getVar(name, '_TapVar');
                }
                _TextVar(name) {
                    return this.getVar(name, '_TextVar');
                }
                _TextInputVar(name) {
                    return this.getVar(name, '_TextInputVar');
                }
                _FontClipVar(name) {
                    return this.getVar(name, '_FontClipVar');
                }
                _FontBox(name) {
                    return this.getVar(name, '_FontBox');
                }
                _FontTextInput(name) {
                    return this.getVar(name, '_FontInput');
                }
                onAwake() {
                    this._Owner.width = Laya.stage.width;
                    this._Owner.height = Laya.stage.height;
                    if (this._Owner.getChildByName('Background')) {
                        this._Owner.getChildByName('Background')['width'] = Laya.stage.width;
                        this._Owner.getChildByName('Background')['height'] = Laya.stage.height;
                    }
                    if (this._Owner.name == null) {
                        console.log('场景名称失效，脚本赋值失败');
                    }
                    else {
                        this.ownerSceneName = this._calssName = this._Owner.name;
                        this._Owner[this._calssName] = this;
                    }
                    this.moduleOnAwake();
                    this.lwgOnAwake();
                    this.lwgAdaptive();
                }
                moduleOnAwake() { }
                onEnable() {
                    this.moduleEvent();
                    this.lwgEvent();
                    this.moduleOnEnable();
                    this.lwgOnEnable();
                }
                moduleOnEnable() { }
                ;
                moduleEvent() { }
                ;
                onStart() {
                    this.btnAndOpenAni();
                    this.moduleOnStart();
                    this.lwgOnStart();
                }
                moduleOnStart() { }
                btnAndOpenAni() {
                    let time = this.lwgOpenAni();
                    if (time !== null) {
                        Laya.timer.once(time, this, () => {
                            Click._switch = true;
                            this.lwgOpenAniAfter();
                            this.lwgButton();
                            _SceneChange._close();
                        });
                    }
                    else {
                        SceneAnimation._commonOpenAni(this._Owner);
                    }
                }
                lwgOpenAni() { return null; }
                ;
                lwgOpenAniAfter() { }
                ;
                _adaHeight(arr) {
                    Adaptive._stageHeight(arr);
                }
                ;
                _adaWidth(arr) {
                    Adaptive._stageWidth(arr);
                }
                ;
                _adaptiveCenter(arr) {
                    Adaptive._center(arr, Laya.stage);
                }
                ;
                onUpdate() { this.lwgOnUpdate(); }
                ;
                lwgBeforeCloseAni() { }
                lwgCloseAni() { return null; }
                ;
                onDisable() {
                    Animation2D.fadeOut(this._Owner, 1, 0, 2000, 1);
                    this.lwgOnDisable();
                    Laya.timer.clearAll(this);
                    Laya.Tween.clearAll(this);
                    EventAdmin._offCaller(this);
                }
            }
            Admin._SceneBase = _SceneBase;
            class _ObjectBase extends _ScriptBase {
                constructor() {
                    super();
                }
                get _Owner() {
                    return this.owner;
                }
                get _point() {
                    return new Laya.Point(this._Owner.x, this._Owner.y);
                }
                get _Scene() {
                    return this.owner.scene;
                }
                get _Parent() {
                    if (this._Owner.parent) {
                        return this.owner.parent;
                    }
                }
                get _gPoint() {
                    return this._Parent.localToGlobal(new Laya.Point(this._Owner.x, this._Owner.y));
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
                        return this._Owner['_OwnerCilrcleCollier'] = this._Owner.getComponent(Laya.BoxCollider);
                    }
                    return this._Owner['_OwnerCilrcleCollier'];
                }
                get _PolygonCollier() {
                    if (!this._Owner['_OwnerPolygonCollier']) {
                        return this._Owner['_OwnerPolygonCollier'] = this._Owner.getComponent(Laya.BoxCollider);
                    }
                    return this._Owner['_OwnerPolygonCollier'];
                }
                getSceneVar(name, type) {
                    if (!this[`_Scene${type}${name}`]) {
                        if (this._Scene[name]) {
                            return this[`_Scene${type}${name}`] = this._Scene[name];
                        }
                        else {
                            console.log(`场景内不存在var节点${name}`);
                        }
                    }
                    else {
                        return this[`_Scene${type}${name}`];
                    }
                }
                _SceneSprite(name) {
                    return this.getSceneVar(name, '_SceneSprite');
                }
                _SceneAni(name) {
                    return this.getSceneVar(name, '_SceneAni');
                }
                _SceneImg(name) {
                    return this.getSceneVar(name, '_SceneImg');
                }
                _SceneLabel(name) {
                    return this.getSceneVar(name, '_SceneLabel');
                }
                _SceneList(name) {
                    return this.getSceneVar(name, '_SceneList');
                }
                _SceneTap(name) {
                    return this.getSceneVar(name, '_SceneTap');
                }
                _SceneText(name) {
                    return this.getSceneVar(name, '_SceneText');
                }
                _SceneFontClip(name) {
                    return this.getSceneVar(name, '_SceneFontClip');
                }
                _SceneBox(name) {
                    return this.getSceneVar(name, '_SceneBox');
                }
                getChild(name, type) {
                    if (!this[`${type}${name}`]) {
                        if (this._Owner.getChildByName(name)) {
                            return this[`${type}${name}`] = this._Owner.getChildByName(name);
                        }
                        else {
                            console.log('场景内不存在子节点：', name);
                            return null;
                        }
                    }
                    else {
                        return this[`${type}${name}`];
                    }
                }
                _ImgChild(name) {
                    return this.getChild(name, '_ImgChild');
                }
                _SpriteChild(name) {
                    return this.getChild(name, '_SpriteChild');
                }
                _LableChild(name) {
                    return this.getChild(name, '_LableChild');
                }
                _ListChild(name) {
                    return this.getChild(name, '_ListChild');
                }
                _TapChild(name) {
                    return this.getChild(name, '_TapChild');
                }
                _TapBox(name) {
                    return this.getChild(name, '_TapBox');
                }
                _TapFontClip(name) {
                    return this.getChild(name, '_TapFontClip');
                }
                onAwake() {
                    this._Owner[this['__proto__']['constructor'].name] = this;
                    this.ownerSceneName = this._Scene.name;
                    this._fPoint = new Laya.Point(this._Owner.x, this._Owner.y);
                    this._fRotation = this._Owner.rotation;
                    this.lwgOnAwake();
                    this.lwgAdaptive();
                }
                onEnable() {
                    this.lwgButton();
                    this.lwgEvent();
                    this.lwgOnEnable();
                }
                onStart() {
                    this.lwgOnStart();
                }
                onUpdate() {
                    this.lwgOnUpdate();
                }
                onDisable() {
                    this.lwgOnDisable();
                    Laya.timer.clearAll(this);
                    EventAdmin._offCaller(this);
                }
            }
            Admin._ObjectBase = _ObjectBase;
        })(Admin = lwg.Admin || (lwg.Admin = {}));
        let StorageAdmin;
        (function (StorageAdmin) {
            class admin {
                removeSelf() { }
                func() { }
            }
            class _NumVariable extends admin {
                get value() { return; }
                ;
                set value(val) { }
            }
            StorageAdmin._NumVariable = _NumVariable;
            class _StrVariable extends admin {
                get value() { return; }
                set value(val) { }
            }
            StorageAdmin._StrVariable = _StrVariable;
            class _BoolVariable extends admin {
                get value() { return; }
                set value(val) { }
            }
            StorageAdmin._BoolVariable = _BoolVariable;
            class _ArrayVariable extends admin {
                get value() { return; }
                set value(val) { }
            }
            StorageAdmin._ArrayVariable = _ArrayVariable;
            class _ArrayArrVariable extends admin {
                get value() { return; }
                set value(val) { }
            }
            StorageAdmin._ArrayArrVariable = _ArrayArrVariable;
            function _mum(name, _func, initial) {
                if (!this[`_mum${name}`]) {
                    this[`_mum${name}`] = {
                        get value() {
                            if (Laya.LocalStorage.getItem(name)) {
                                return Number(Laya.LocalStorage.getItem(name));
                            }
                            else {
                                initial = initial ? initial : 0;
                                Laya.LocalStorage.setItem(name, initial.toString());
                                return initial;
                            }
                        },
                        set value(data) {
                            Laya.LocalStorage.setItem(name, data.toString());
                            this['func']();
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            this['_func'] && this['_func']();
                        }
                    };
                }
                if (_func) {
                    this[`_mum${name}`]['_func'] = _func;
                }
                return this[`_mum${name}`];
            }
            StorageAdmin._mum = _mum;
            function _str(name, _func, initial) {
                if (!this[`_str${name}`]) {
                    this[`_str${name}`] = {
                        get value() {
                            if (Laya.LocalStorage.getItem(name)) {
                                return Laya.LocalStorage.getItem(name);
                            }
                            else {
                                initial = initial ? initial : null;
                                Laya.LocalStorage.setItem(name, initial.toString());
                                return initial;
                            }
                        },
                        set value(data) {
                            Laya.LocalStorage.setItem(name, data.toString());
                            this['func']();
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            _func && _func();
                        }
                    };
                }
                if (_func) {
                    this[`_str${name}`]['_func'] = _func;
                }
                return this[`_str${name}`];
            }
            StorageAdmin._str = _str;
            function _bool(name, _func, initial) {
                if (!this[`_bool${name}`]) {
                    this[`_bool${name}`] = {
                        get value() {
                            if (Laya.LocalStorage.getItem(name)) {
                                if (Laya.LocalStorage.getItem(name) == "false") {
                                    return false;
                                }
                                else if (Laya.LocalStorage.getItem(name) == "true") {
                                    return true;
                                }
                            }
                            else {
                                if (initial) {
                                    Laya.LocalStorage.setItem(name, "true");
                                }
                                else {
                                    Laya.LocalStorage.setItem(name, "false");
                                }
                                this['func']();
                                return initial;
                            }
                        },
                        set value(bool) {
                            bool = bool ? "true" : "false";
                            Laya.LocalStorage.setItem(name, bool.toString());
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            _func && _func();
                        }
                    };
                }
                if (_func) {
                    this[`_bool${name}`]['_func'] = _func;
                }
                return this[`_bool${name}`];
            }
            StorageAdmin._bool = _bool;
            function _array(name, _func, initial) {
                if (!this[`_array${name}`]) {
                    this[`_array${name}`] = {
                        get value() {
                            try {
                                let data = Laya.LocalStorage.getJSON(name);
                                if (data) {
                                    return JSON.parse(data);
                                    ;
                                }
                                else {
                                    initial = initial ? initial : [];
                                    Laya.LocalStorage.setItem(name, initial.toString());
                                    this['func']();
                                    return initial;
                                }
                            }
                            catch (error) {
                                return [];
                            }
                        },
                        set value(array) {
                            Laya.LocalStorage.setJSON(name, JSON.stringify(array));
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            _func && _func();
                        }
                    };
                }
                if (_func) {
                    this[`_array${name}`]['_func'] = _func;
                }
                return this[`_array${name}`];
            }
            StorageAdmin._array = _array;
            function _arrayArr(name, _func, initial) {
                if (!this[`_arrayArr${name}`]) {
                    this[`_arrayArr${name}`] = {
                        get value() {
                            try {
                                let data = Laya.LocalStorage.getJSON(name);
                                if (data) {
                                    return JSON.parse(data);
                                    ;
                                }
                                else {
                                    initial = initial ? initial : [];
                                    Laya.LocalStorage.setItem(name, initial.toString());
                                    return initial;
                                }
                            }
                            catch (error) {
                                return [];
                            }
                        },
                        set value(array) {
                            Laya.LocalStorage.setJSON(name, JSON.stringify(array));
                            this['func']();
                        },
                        removeSelf() {
                            Laya.LocalStorage.removeItem(name);
                        },
                        func() {
                            _func && _func();
                        }
                    };
                }
                if (_func) {
                    this[`_arrayArr${name}`]['_func'] = _func;
                }
                return this[`_arrayArr${name}`];
            }
            StorageAdmin._arrayArr = _arrayArr;
        })(StorageAdmin = lwg.StorageAdmin || (lwg.StorageAdmin = {}));
        let DataAdmin;
        (function (DataAdmin) {
            class _Table {
                constructor(tableName, _tableArr, localStorage, lastVtableName) {
                    this._property = {
                        name: 'name',
                        index: 'index',
                        sort: 'sort',
                        chName: 'chName',
                        classify: 'classify',
                        unlockWay: 'unlockWay',
                        conditionNum: 'conditionNum',
                        degreeNum: 'degreeNum',
                        compelet: 'compelet',
                        getAward: 'getAward',
                        pitch: 'pitch',
                    };
                    this._unlockWay = {
                        ads: 'ads',
                        gold: 'gold',
                        customs: 'free',
                        diamond: 'diamond',
                        free: 'free',
                    };
                    this._tableName = '';
                    this._lastArr = [];
                    this._localStorage = false;
                    if (tableName) {
                        this._tableName = tableName;
                        if (localStorage) {
                            this._localStorage = localStorage;
                            this._arr = addCompare(_tableArr, tableName, this._property.name);
                            if (lastVtableName) {
                                this._compareLastInfor(lastVtableName);
                            }
                        }
                        else {
                            this._arr = _tableArr;
                        }
                    }
                }
                get _arr() {
                    return this[`_${this._tableName}arr`];
                }
                set _arr(arr) {
                    this[`_${this._tableName}arr`] = arr;
                }
                get _List() {
                    return this[`${this._tableName}_List`];
                }
                set _List(list) {
                    this[`${this._tableName}_List`] = list;
                    list.array = this._arr;
                    list.selectEnable = false;
                    list.vScrollBarSkin = "";
                    list.renderHandler = new Laya.Handler(this, (Cell, index) => {
                        this._listRender && this._listRender(Cell, index);
                    });
                    list.selectHandler = new Laya.Handler(this, (index) => {
                        this._listSelect && this._listSelect(index);
                    });
                }
                _refreshAndStorage() {
                    if (this._localStorage) {
                        Laya.LocalStorage.setJSON(this._tableName, JSON.stringify(this._arr));
                    }
                    if (this._List) {
                        this._List.refresh();
                    }
                }
                _compareLastInfor(lastVtableName) {
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
                _getlastVersion(lastVtableName) {
                    let dataArr = [];
                    try {
                        if (Laya.LocalStorage.getJSON(lastVtableName)) {
                            dataArr = JSON.parse(Laya.LocalStorage.getJSON(lastVtableName));
                        }
                    }
                    catch (error) {
                        console.log(lastVtableName + '前版本不存在！');
                    }
                    return dataArr;
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
                _getPitchIndexArr() {
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (element[this._property.name] === this._pitchName) {
                            return index;
                        }
                    }
                }
                _getPitchIndexByList() {
                    if (this._List) {
                        for (let index = 0; index < this._List.array.length; index++) {
                            const element = this._List.array[index];
                            if (element[this._property.name] === this._pitchName) {
                                return index;
                            }
                        }
                    }
                }
                _listTweenToPitch(time, func) {
                    const index = this._getPitchIndexByList();
                    index && this._List.tweenTo(index, time, Laya.Handler.create(this, () => {
                        func && func();
                    }));
                }
                _listTweenToPitchChoose(diffIndex, time, func) {
                    const index = this._getPitchIndexByList();
                    index && this._List.tweenTo(index + diffIndex, time, Laya.Handler.create(this, () => {
                        func && func();
                    }));
                }
                _listScrollToLast() {
                    const index = this._List.array.length - 1;
                    index && this._List.scrollTo(index);
                }
                _setProperty(name, pro, value) {
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
                }
                ;
                _getObjByName(name) {
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
                _setProSoleByClassify(name, pro, value) {
                    const obj = this._getObjByName(name);
                    const objArr = this._getArrByClassify(obj[this._property.classify]);
                    for (const key in objArr) {
                        if (Object.prototype.hasOwnProperty.call(objArr, key)) {
                            const element = objArr[key];
                            if (element[this._property.name] == name) {
                                element[pro] = value;
                            }
                            else {
                                element[pro] = !value;
                            }
                        }
                    }
                    this._refreshAndStorage();
                }
                _setAllProPerty(pro, value) {
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        element[pro] = value;
                    }
                    this._refreshAndStorage();
                }
                _addAllProPerty(pro, valueFunc) {
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        element[pro] += valueFunc();
                    }
                    this._refreshAndStorage();
                }
                _setPitchProperty(pro, value) {
                    const obj = this._getPitchObj();
                    obj[pro] = value;
                    this._refreshAndStorage();
                    return value;
                }
                ;
                _getPitchProperty(pro) {
                    const obj = this._getPitchObj();
                    return obj[pro];
                }
                ;
                _randomOneObj(proName, value) {
                    let arr = [];
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (value) {
                                if (element[proName] && element[proName] == value) {
                                    arr.push(element);
                                }
                            }
                            else {
                                if (element[proName]) {
                                    arr.push(element);
                                }
                            }
                        }
                    }
                    if (arr.length == 0) {
                        return null;
                    }
                    else {
                        let any = Tools._Array.randomGetOne(arr);
                        return any;
                    }
                }
                _getArrByClassify(classify) {
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
                _getArrByPitchClassify() {
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
                _getArrByProperty(proName, value) {
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
                _getPitchClassfiyName() {
                    const obj = this._getObjByName(this._pitchName);
                    return obj[this._property.classify];
                }
                _getArrByNoProperty(proName, value) {
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
                _setArrByProperty(proName, value) {
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
                _checkAllCompelet() {
                    let bool = true;
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (!element[this._property.compelet]) {
                            bool = false;
                            return bool;
                        }
                    }
                    return bool;
                }
                get _pitchClassify() {
                    if (!this[`${this._tableName}/pitchClassify`]) {
                        if (this._localStorage) {
                            return Laya.LocalStorage.getItem(`${this._tableName}/pitchClassify`) ? Laya.LocalStorage.getItem(`${this._tableName}/pitchClassify`) : null;
                        }
                        else {
                            return this[`${this._tableName}/pitchClassify`] = null;
                        }
                    }
                    else {
                        return this[`${this._tableName}/pitchClassify`];
                    }
                }
                ;
                set _pitchClassify(str) {
                    this._lastPitchClassify = this[`${this._tableName}/pitchClassify`] ? this[`${this._tableName}/pitchClassify`] : null;
                    this[`${this._tableName}/pitchClassify`] = str;
                    if (this._localStorage) {
                        Laya.LocalStorage.setItem(`${this._tableName}/pitchClassify`, str.toString());
                    }
                    this._refreshAndStorage();
                }
                ;
                get _pitchName() {
                    if (!this[`${this._tableName}/_pitchName`]) {
                        if (this._localStorage) {
                            return Laya.LocalStorage.getItem(`${this._tableName}/_pitchName`) ? Laya.LocalStorage.getItem(`${this._tableName}/_pitchName`) : null;
                        }
                        else {
                            return this[`${this._tableName}/_pitchName`] = null;
                        }
                    }
                    else {
                        return this[`${this._tableName}/_pitchName`];
                    }
                }
                ;
                set _pitchName(str) {
                    this._lastPitchName = this[`${this._tableName}/_pitchName`];
                    this[`${this._tableName}/_pitchName`] = str;
                    if (this._localStorage) {
                        Laya.LocalStorage.setItem(`${this._tableName}/_pitchName`, str.toString());
                    }
                    this._refreshAndStorage();
                }
                ;
                get _lastPitchClassify() {
                    if (!this[`${this._tableName}/_lastPitchClassify`]) {
                        if (this._localStorage) {
                            return Laya.LocalStorage.getItem(`${this._tableName}/_lastPitchClassify`) ? Laya.LocalStorage.getItem(`${this._tableName}/_lastPitchClassify`) : null;
                        }
                        else {
                            return this[`${this._tableName}/_lastPitchClassify`] = null;
                        }
                    }
                    else {
                        return this[`${this._tableName}/_lastPitchClassify`];
                    }
                }
                ;
                set _lastPitchClassify(str) {
                    this[`${this._tableName}/_lastPitchClassify`] = str;
                    if (this._localStorage && str) {
                        Laya.LocalStorage.setItem(`${this._tableName}/_lastPitchClassify`, str.toString());
                    }
                }
                ;
                get _lastPitchName() {
                    if (!this[`${this._tableName}/_lastPitchName`]) {
                        if (this._localStorage) {
                            return Laya.LocalStorage.getItem(`${this._tableName}/_lastPitchName`) ? Laya.LocalStorage.getItem(`${this._tableName}/_lastPitchName`) : null;
                        }
                        else {
                            return this[`${this._tableName}/_lastPitchName`] = null;
                        }
                    }
                    else {
                        return this[`${this._tableName}/_lastPitchName`];
                    }
                }
                set _lastPitchName(str) {
                    this[`${this._tableName}/_lastPitchName`] = str;
                    if (this._localStorage && str) {
                        Laya.LocalStorage.setItem(`${this._tableName}/_lastPitchName`, str.toString());
                    }
                }
                ;
                _setPitch(name) {
                    let _calssify;
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (element[this._property.name] == name) {
                            element[this._property.pitch] = true;
                            _calssify = element[this._property.classify];
                        }
                        else {
                            element[this._property.pitch] = false;
                        }
                    }
                    this._pitchClassify = _calssify;
                    this._pitchName = name;
                    this._refreshAndStorage();
                }
                _getPitchObj() {
                    for (const key in this._arr) {
                        if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
                            const element = this._arr[key];
                            if (element[this._property.name] === this._pitchName) {
                                return element;
                            }
                        }
                    }
                }
                _addObject(obj) {
                    let _obj = Tools._ObjArray.objCopy(obj);
                    for (let index = 0; index < this._arr.length; index++) {
                        const element = this._arr[index];
                        if (element[this._property.name] === _obj[this._property.name]) {
                            this._arr[index] == _obj;
                        }
                    }
                    this._refreshAndStorage();
                }
                _addObjectArr(objArr) {
                    for (let i = 0; i < objArr.length; i++) {
                        const obj = objArr[i];
                        let _obj = Tools._ObjArray.objCopy(obj);
                        for (let j = 0; j < this._arr.length; j++) {
                            const element = this._arr[j];
                            if (obj[this._property.name] === element[this._property.name]) {
                                this._arr[j] = _obj;
                                objArr.splice(i, 1);
                                i--;
                                continue;
                            }
                        }
                    }
                    for (let k = 0; k < objArr.length; k++) {
                        const element = objArr[k];
                        this._arr.push(element);
                    }
                    this._refreshAndStorage();
                }
                _sortByProperty(pro, indexPro, inverted) {
                    Tools._ObjArray.sortByProperty(this._arr, pro);
                    if (inverted == undefined || inverted) {
                        for (let index = this._arr.length - 1; index >= 0; index--) {
                            const element = this._arr[index];
                            element[indexPro] = this._arr.length - index;
                        }
                        this._arr.reverse();
                    }
                    else {
                        for (let index = 0; index < this._arr.length; index++) {
                            const element = this._arr[index];
                            element[indexPro] = index + 1;
                        }
                    }
                    this._refreshAndStorage();
                }
            }
            DataAdmin._Table = _Table;
            function addCompare(tableArr, storageName, propertyName) {
                try {
                    Laya.LocalStorage.getJSON(storageName);
                }
                catch (error) {
                    Laya.LocalStorage.setJSON(storageName, JSON.stringify(tableArr));
                    return tableArr;
                }
                let storeArr;
                if (Laya.LocalStorage.getJSON(storageName)) {
                    storeArr = JSON.parse(Laya.LocalStorage.getJSON(storageName));
                    let diffArray = Tools._ObjArray.diffProByTwo(tableArr, storeArr, propertyName);
                    console.log(`${storageName}新添加对象`, diffArray);
                    Tools._Array.addToarray(storeArr, diffArray);
                }
                else {
                    storeArr = tableArr;
                }
                Laya.LocalStorage.setJSON(storageName, JSON.stringify(storeArr));
                return storeArr;
            }
            function _jsonCompare(url, storageName, propertyName) {
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
                            let diffArray = Tools._ObjArray.diffProByTwo(dataArr_0, dataArr, propertyName);
                            console.log('两个数据的差值为：', diffArray);
                            Tools._Array.addToarray(dataArr, diffArray);
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
                    cf.color(Tools._Number.randomOneBySection(255, 100, true), Tools._Number.randomOneBySection(255, 100, true), Tools._Number.randomOneBySection(255, 100, true), 1);
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
                let RGBA = [Tools._Number.randomCountBySection(RGBA1[0], RGBA2[0])[0], Tools._Number.randomCountBySection(RGBA1[1], RGBA2[1])[0], Tools._Number.randomCountBySection(RGBA1[2], RGBA2[2])[0], Tools._Number.randomCountBySection(RGBA1[3] ? RGBA1[3] : 1, RGBA2[3] ? RGBA2[3] : 1)[0]];
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
                _SkinUrl["\u7231\u5FC31"] = "Lwg/Effects/aixin1.png";
                _SkinUrl["\u7231\u5FC32"] = "Lwg/Effects/aixin2.png";
                _SkinUrl["\u7231\u5FC33"] = "Lwg/Effects/aixin3.png";
                _SkinUrl["\u82B11"] = "Lwg/Effects/hua1.png";
                _SkinUrl["\u82B12"] = "Lwg/Effects/hua2.png";
                _SkinUrl["\u82B13"] = "Lwg/Effects/hua3.png";
                _SkinUrl["\u82B14"] = "Lwg/Effects/hua4.png";
                _SkinUrl["\u661F\u661F1"] = "Lwg/Effects/star1.png";
                _SkinUrl["\u661F\u661F2"] = "Lwg/Effects/star2.png";
                _SkinUrl["\u661F\u661F3"] = "Lwg/Effects/star3.png";
                _SkinUrl["\u661F\u661F4"] = "Lwg/Effects/star4.png";
                _SkinUrl["\u661F\u661F5"] = "Lwg/Effects/star5.png";
                _SkinUrl["\u661F\u661F6"] = "Lwg/Effects/star6.png";
                _SkinUrl["\u661F\u661F7"] = "Lwg/Effects/star7.png";
                _SkinUrl["\u661F\u661F8"] = "Lwg/Effects/star8.png";
                _SkinUrl["\u83F1\u5F621"] = "Lwg/Effects/rhombus1.png";
                _SkinUrl["\u83F1\u5F622"] = "Lwg/Effects/rhombus1.png";
                _SkinUrl["\u83F1\u5F623"] = "Lwg/Effects/rhombus1.png";
                _SkinUrl["\u77E9\u5F621"] = "Lwg/Effects/rectangle1.png";
                _SkinUrl["\u77E9\u5F622"] = "Lwg/Effects/rectangle2.png";
                _SkinUrl["\u77E9\u5F623"] = "Lwg/Effects/rectangle3.png";
                _SkinUrl["\u96EA\u82B11"] = "Lwg/Effects/xuehua1.png";
                _SkinUrl["\u53F6\u5B501"] = "Lwg/Effects/yezi1.png";
                _SkinUrl["\u5706\u5F62\u53D1\u51491"] = "Lwg/Effects/yuanfaguang.png";
                _SkinUrl["\u5706\u5F621"] = "Lwg/Effects/yuan1.png";
                _SkinUrl["\u5149\u57081"] = "Lwg/Effects/guangquan1.png";
                _SkinUrl["\u5149\u57082"] = "Lwg/Effects/guangquan2.png";
                _SkinUrl["\u4E09\u89D2\u5F621"] = "Lwg/Effects/triangle1.png";
                _SkinUrl["\u4E09\u89D2\u5F622"] = "Lwg/Effects/triangle2.png";
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
                _Aperture._ApertureImage = _ApertureImage;
                function _continuous(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, zOrder, scale, speed, accelerated) {
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
                _Particle._ParticleImgBase = _ParticleImgBase;
                function _snow(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, rotationSpeed, speed, windX) {
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
                    });
                    return Img;
                }
                _Particle._snow = _snow;
                function _fallingRotate(parent, centerPoint, sectionWH, width, height, urlArr, colorRGBA, distance, moveSpeed, scaleSpeed, skewSpeed, rotationSpeed, zOrder) {
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
                            }
                            else {
                                Img.skewY += _skewSpeed;
                            }
                        }
                        else {
                            if (_scaleDir === 1) {
                                if (moveCaller.scaleSub) {
                                    Img.scaleX -= _scaleSpeed;
                                    if (Img.scaleX <= 0) {
                                        moveCaller.scaleSub = false;
                                    }
                                }
                                else {
                                    Img.scaleX += _scaleSpeed;
                                    if (Img.scaleX >= 1) {
                                        moveCaller.scaleSub = true;
                                    }
                                }
                            }
                            else {
                                if (moveCaller.scaleSub) {
                                    Img.scaleY -= _scaleSpeed;
                                    if (Img.scaleY <= 0) {
                                        moveCaller.scaleSub = false;
                                    }
                                }
                                else {
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
                    });
                    return Img;
                }
                _Particle._fallingRotate = _fallingRotate;
                function _fallingVertical(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, speed, accelerated) {
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
                    });
                    return Img;
                }
                _Particle._fallingVertical = _fallingVertical;
                function _fallingVertical_Reverse(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, speed, accelerated) {
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
                    });
                    return Img;
                }
                _Particle._fallingVertical_Reverse = _fallingVertical_Reverse;
                function _slowlyUp(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, distance, speed, accelerated) {
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
                function _sprayRound(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, distance, time, moveAngle, rotationSpeed, zOrder) {
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
                        }
                        else {
                            if (!moveCaller.vinish) {
                                radius += _speed;
                                let point = Tools._Point.getRoundPos(_angle, radius, centerPoint0);
                                Img.pos(point.x, point.y);
                                if (radius > _distance) {
                                    moveCaller.move = false;
                                    moveCaller.vinish = true;
                                }
                            }
                            else {
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
                    });
                    return Img;
                }
                _Particle._sprayRound = _sprayRound;
                function _spray(parent, centerPoint, width, height, rotation, urlArr, colorRGBA, distance, moveAngle, rotationSpeed, speed, accelerated, zOrder) {
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
                            let point = Tools._Point.getRoundPos(angle0, radius, centerPoint0);
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
                    let fixedXY = Tools._Number.randomOneHalf() == 0 ? 'x' : 'y';
                    curtailAngle = curtailAngle ? curtailAngle : 60;
                    if (fixedXY == 'x') {
                        if (Tools._Number.randomOneHalf() == 0) {
                            Img.x += sectionWH[0];
                            _angle = Tools._Number.randomOneHalf() == 0 ? Tools._Number.randomOneBySection(0, 90 - curtailAngle) : Tools._Number.randomOneBySection(0, -90 + curtailAngle);
                        }
                        else {
                            Img.x -= sectionWH[0];
                            _angle = Tools._Number.randomOneBySection(90 + curtailAngle, 270 - curtailAngle);
                        }
                        Img.y += Tools._Number.randomOneBySection(-sectionWH[1], sectionWH[1]);
                    }
                    else {
                        if (Tools._Number.randomOneHalf() == 0) {
                            Img.y -= sectionWH[1];
                            _angle = Tools._Number.randomOneBySection(180 + curtailAngle, 360 - curtailAngle);
                        }
                        else {
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
                        let point = Tools._Point.getRoundPos(angle0, radius, centerPoint0);
                        Img.pos(point.x, point.y);
                    });
                    return Img;
                }
                _Particle._moveToTargetToMove = _moveToTargetToMove;
                function _AnnularInhalation(parent, centerPoint, radius, rotation, width, height, urlArr, speed, accelerated, zOrder) {
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
                        }
                        else {
                            acc += accelerated;
                            radius0 -= (speed0 + acc);
                        }
                        let point = Tools._Point.getRoundPos(angle, radius0, centerPoint);
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
                    constructor(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, zOder) {
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
                _Glitter._GlitterImage = _GlitterImage;
                function _blinkStar(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, scale, speed, rotateSpeed, zOder) {
                    let Img = new _GlitterImage(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, zOder);
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
                    };
                    func();
                    return Img;
                }
                _circulation._corner = _corner;
            })(_circulation = Effects._circulation || (Effects._circulation = {}));
        })(Effects = lwg.Effects || (lwg.Effects = {}));
        let Click;
        (function (Click) {
            Click._switch = true;
            function _createButton() {
                let Btn = new Laya.Sprite();
                let img = new Laya.Image();
                let label = new Laya.Label();
            }
            Click._createButton = _createButton;
            Click._Type = {
                no: 'no',
                largen: 'largen',
                reduce: 'reduce',
            };
            Click._Use = {
                get value() {
                    return this['Click_name'] ? this['Click_name'] : null;
                },
                set value(val) {
                    this['Click_name'] = val;
                }
            };
            function _on(effect, target, caller, down, move, up, out) {
                let btnEffect;
                switch (effect) {
                    case Click._Type.no:
                        btnEffect = new _NoEffect();
                        break;
                    case Click._Type.largen:
                        btnEffect = new _Largen();
                        break;
                    case Click._Type.reduce:
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
            Click._on = _on;
            function _off(effect, target, caller, down, move, up, out) {
                let btnEffect;
                switch (effect) {
                    case Click._Type.no:
                        btnEffect = new _NoEffect();
                        break;
                    case Click._Type.largen:
                        btnEffect = new _Largen();
                        break;
                    case Click._Type.reduce:
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
            Click._off = _off;
            class _NoEffect {
                down() { }
                move() { }
                up() { }
                out() { }
            }
            Click._NoEffect = _NoEffect;
            class _Largen {
                down(event) {
                    event.currentTarget.scale(1.1, 1.1);
                    AudioAdmin._playSound(Click._audioUrl);
                }
                move() { }
                up(event) {
                    event.currentTarget.scale(1, 1);
                }
                out(event) {
                    event.currentTarget.scale(1, 1);
                }
            }
            Click._Largen = _Largen;
            class _Reduce {
                down(event) {
                    event.currentTarget.scale(0.9, 0.9);
                    AudioAdmin._playSound(Click._audioUrl);
                }
                move() { }
                up(event) {
                    event.currentTarget.scale(1, 1);
                }
                out(event) {
                    event.currentTarget.scale(1, 1);
                }
            }
            Click._Reduce = _Reduce;
        })(Click = lwg.Click || (lwg.Click = {}));
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
            function _clearAll(arr) {
                for (let index = 0; index < arr.length; index++) {
                    Laya.Tween.clearAll(arr[index]);
                }
            }
            Animation2D._clearAll = _clearAll;
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
                    Click._switch = false;
                }
                Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { x: node.x + range * 2 }, time, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { x: node.x - range }, time, null, Laya.Handler.create(this, function () {
                            if (func) {
                                func();
                            }
                            if (!click) {
                                Click._switch = true;
                            }
                        }));
                    }));
                }), delayed);
            }
            Animation2D.leftRight_Shake = leftRight_Shake;
            function rotate(node, Erotate, time, delayed, func) {
                Laya.Tween.to(node, { rotation: Erotate }, time, null, Laya.Handler.create(node, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.rotate = rotate;
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
                    Click._switch = false;
                }
                Laya.Tween.to(node, { alpha: alpha2 }, time, null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                    if (stageClick) {
                        Click._switch = true;
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
            function move_rotate(Node, tRotate, tPoint, time, delayed, func) {
                Laya.Tween.to(Node, { rotation: tRotate, x: tPoint.x, y: tPoint.y }, time, null, Laya.Handler.create(Node, () => {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.move_rotate = move_rotate;
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
            function bombs_Appear(node, firstAlpha, endScale, maxScale, rotation, time, func, delayed) {
                node.scale(0, 0);
                node.alpha = firstAlpha;
                Laya.Tween.to(node, { scaleX: maxScale, scaleY: maxScale, alpha: 1, rotation: rotation }, time, Laya.Ease.cubicInOut, Laya.Handler.create(this, function () {
                    Laya.Tween.to(node, { scaleX: endScale, scaleY: endScale, rotation: 0 }, time / 2, null, Laya.Handler.create(this, function () {
                        Laya.Tween.to(node, { scaleX: endScale + (maxScale - endScale) / 3, scaleY: endScale + (maxScale - endScale) / 3, rotation: 0 }, time / 3, null, Laya.Handler.create(this, function () {
                            Laya.Tween.to(node, { scaleX: endScale, scaleY: endScale, rotation: 0 }, time / 4, null, Laya.Handler.create(this, function () {
                                if (func) {
                                    func();
                                }
                            }), 0);
                        }), 0);
                    }), 0);
                }), delayed ? delayed : 0);
            }
            Animation2D.bombs_Appear = bombs_Appear;
            function bombs_AppearAllChild(node, firstAlpha, endScale, scale1, rotation1, time1, interval, func, audioType) {
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
                        bombs_Appear(Child, firstAlpha, endScale, scale1, rotation1, time1, func);
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
                        bombs_Vanish(node, endScale, alpha, rotation, time, func);
                    });
                    de1 += interval;
                }
            }
            Animation2D.bombs_VanishAllChild = bombs_VanishAllChild;
            function bombs_Vanish(node, scale, alpha, rotation, time, func, delayed) {
                Laya.Tween.to(node, { scaleX: scale, scaleY: scale, alpha: alpha, rotation: rotation }, time, Laya.Ease.cubicOut, Laya.Handler.create(this, function () {
                    console.log('完成！');
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
            function move(node, targetX, targetY, time, func, delayed, ease) {
                Laya.Tween.to(node, { x: targetX, y: targetY }, time, ease ? ease : null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.move = move;
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
                if (!ease) {
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
            function scale(target, fScaleX, fScaleY, eScaleX, eScaleY, time, delayed, func, ease) {
                target.scaleX = fScaleX;
                target.scaleY = fScaleY;
                Laya.Tween.to(target, { scaleX: eScaleX, scaleY: eScaleY }, time, ease ? ease : null, Laya.Handler.create(this, function () {
                    if (func) {
                        func();
                    }
                }), delayed ? delayed : 0);
            }
            Animation2D.scale = scale;
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
                        AudioAdmin._playMusic();
                    }
                    else {
                        val = 0;
                        Laya.LocalStorage.setItem('Setting_bgMusic', val.toString());
                        AudioAdmin._stopMusic();
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
            function _createBtnSet(x, y, width, height, skin, parent, ZOder) {
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
                Click._on(Click._Type.largen, btn, null, null, btnSetUp, null);
                Setting._BtnSet = btn;
                Setting._BtnSet.name = 'BtnSetNode';
                return btn;
            }
            Setting._createBtnSet = _createBtnSet;
            function btnSetAppear(delayed, x, y) {
                if (!Setting._BtnSet) {
                    return;
                }
                if (delayed) {
                    Animation2D.scale_Alpha(Setting._BtnSet, 0, 1, 1, 1, 1, 1, delayed, 0, f => {
                        Setting._BtnSet.visible = true;
                    });
                }
                else {
                    Setting._BtnSet.visible = true;
                }
                if (x) {
                    Setting._BtnSet.x = x;
                }
                if (y) {
                    Setting._BtnSet.y = y;
                }
            }
            Setting.btnSetAppear = btnSetAppear;
            function btnSetVinish(delayed) {
                if (!Setting._BtnSet) {
                    return;
                }
                if (delayed) {
                    Animation2D.scale_Alpha(Setting._BtnSet, 1, 1, 1, 1, 1, 0, delayed, 0, f => {
                        Setting._BtnSet.visible = false;
                    });
                }
                else {
                    Setting._BtnSet.visible = false;
                }
            }
            Setting.btnSetVinish = btnSetVinish;
        })(Setting = lwg.Setting || (lwg.Setting = {}));
        let AudioAdmin;
        (function (AudioAdmin) {
            let _voiceUrl;
            (function (_voiceUrl) {
                _voiceUrl["btn"] = "Lwg/Voice/btn.wav";
                _voiceUrl["bgm"] = "Lwg/Voice/bgm.mp3";
                _voiceUrl["victory"] = "Lwg/Voice/guoguan.wav";
                _voiceUrl["defeated"] = "Lwg/Voice/wancheng.wav";
                _voiceUrl["huodejinbi"] = "Lwg/Voice/huodejinbi.wav";
            })(_voiceUrl = AudioAdmin._voiceUrl || (AudioAdmin._voiceUrl = {}));
            function _playSound(url, number, func) {
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
            AudioAdmin._playSound = _playSound;
            function _playDefeatedSound(url, number, func) {
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
            AudioAdmin._playDefeatedSound = _playDefeatedSound;
            function _playVictorySound(url, number, func) {
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
            AudioAdmin._playVictorySound = _playVictorySound;
            function _playMusic(url, number, delayed) {
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
            AudioAdmin._playMusic = _playMusic;
            function _stopMusic() {
                Laya.SoundManager.stopMusic();
            }
            AudioAdmin._stopMusic = _stopMusic;
        })(AudioAdmin = lwg.AudioAdmin || (lwg.AudioAdmin = {}));
        let Tools;
        (function (Tools) {
            function color_RGBtoHexString(r, g, b) {
                return '#' + ("00000" + (r << 16 | g << 8 | b).toString(16)).slice(-6);
            }
            Tools.color_RGBtoHexString = color_RGBtoHexString;
            let _Format;
            (function (_Format) {
                function formatNumber(crc, fixNum = 0) {
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
                _Format.formatNumber = formatNumber;
                function strAddNum(str, num) {
                    return (Number(str) + num).toString();
                }
                _Format.strAddNum = strAddNum;
                function NumAddStr(num, str) {
                    return Number(str) + num;
                }
                _Format.NumAddStr = NumAddStr;
            })(_Format = Tools._Format || (Tools._Format = {}));
            let _Node;
            (function (_Node) {
                function tieByParent(Node) {
                    const Parent = Node.parent;
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
                _Node.tieByParent = tieByParent;
                function tieByStage(Node, center) {
                    const Parent = Node.parent;
                    const gPoint = Parent.localToGlobal(new Laya.Point(Node.x, Node.y));
                    if (!center) {
                        if (gPoint.x > Laya.stage.width) {
                            gPoint.x = Laya.stage.width;
                        }
                    }
                    else {
                        if (gPoint.x > Laya.stage.width - Node.width / 2) {
                            gPoint.x = Laya.stage.width - Node.width / 2;
                        }
                    }
                    if (!center) {
                        if (gPoint.x < 0) {
                            gPoint.x = 0;
                        }
                    }
                    else {
                        if (gPoint.x < Node.width / 2) {
                            gPoint.x = Node.width / 2;
                        }
                    }
                    if (!center) {
                        if (gPoint.y > Laya.stage.height) {
                            gPoint.y = Laya.stage.height;
                        }
                    }
                    else {
                        if (gPoint.y > Laya.stage.height - Node.height / 2) {
                            gPoint.y = Laya.stage.height - Node.height / 2;
                        }
                    }
                    if (!center) {
                        if (gPoint.y < 0) {
                            gPoint.y = 0;
                        }
                    }
                    else {
                        if (gPoint.y < Node.height / 2) {
                            gPoint.y = Node.height / 2;
                        }
                    }
                    const lPoint = Parent.globalToLocal(gPoint);
                    Node.pos(lPoint.x, lPoint.y);
                }
                _Node.tieByStage = tieByStage;
                function simpleCopyImg(Target) {
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
                _Node.simpleCopyImg = simpleCopyImg;
                function leaveStage(_Sprite, func) {
                    let Parent = _Sprite.parent;
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
                _Node.leaveStage = leaveStage;
                function checkTwoDistance(_Sprite1, _Sprite2, distance, func) {
                    let Parent1 = _Sprite1.parent;
                    let gPoint1 = Parent1.localToGlobal(new Laya.Point(_Sprite1.x, _Sprite1.y));
                    let Parent2 = _Sprite2.parent;
                    let gPoint2 = Parent2.localToGlobal(new Laya.Point(_Sprite2.x, _Sprite2.y));
                    if (gPoint1.distance(gPoint2.x, gPoint2.y) < distance) {
                        if (func) {
                            func();
                        }
                    }
                    return gPoint1.distance(gPoint2.x, gPoint2.y);
                }
                _Node.checkTwoDistance = checkTwoDistance;
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
                    }
                    else {
                        return arr;
                    }
                }
                _Node.zOrderByY = zOrderByY;
                function changePivot(sp, _pivotX, _pivotY, int) {
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
                _Node.changePivot = changePivot;
                function changePivotCenter(sp, int) {
                    let originalPovitX = sp.pivotX;
                    let originalPovitY = sp.pivotY;
                    let _pivotX;
                    let _pivotY;
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
                _Node.changePivotCenter = changePivotCenter;
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
                _Node.getChildArrByProperty = getChildArrByProperty;
                function randomChildren(node, num) {
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
                _Node.randomChildren = randomChildren;
                function removeAllChildren(node) {
                    if (node.numChildren > 0) {
                        node.removeChildren(0, node.numChildren - 1);
                    }
                }
                _Node.removeAllChildren = removeAllChildren;
                function removeOneChildren(node, nodeName) {
                    for (let index = 0; index < node.numChildren; index++) {
                        const element = node.getChildAt(index);
                        if (element.name == nodeName) {
                            element.removeSelf();
                        }
                    }
                }
                _Node.removeOneChildren = removeOneChildren;
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
                _Node.checkChildren = checkChildren;
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
                _Node.showExcludedChild2D = showExcludedChild2D;
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
                _Node.showExcludedChild3D = showExcludedChild3D;
                function createPrefab(prefab, Parent, point, zOrder, name) {
                    let Sp = Laya.Pool.getItemByCreateFun(name ? name : prefab.json['props']['name'], prefab.create, prefab);
                    Parent && Parent.addChild(Sp);
                    point && Sp.pos(point[0], point[1]);
                    if (zOrder) {
                        Sp.zOrder = zOrder;
                    }
                    return Sp;
                }
                _Node.createPrefab = createPrefab;
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
                _Node.childrenVisible2D = childrenVisible2D;
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
                _Node.childrenVisible3D = childrenVisible3D;
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
                _Node.findChild3D = findChild3D;
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
                _Node.findChild2D = findChild2D;
                function findChildByName2D(parent, name) {
                    let arr = [];
                    return arr;
                }
                _Node.findChildByName2D = findChildByName2D;
            })(_Node = Tools._Node || (Tools._Node = {}));
            let _Number;
            (function (_Number) {
                function randomOneHalf() {
                    let number;
                    number = Math.floor(Math.random() * 2);
                    return number;
                }
                _Number.randomOneHalf = randomOneHalf;
                function randomOneInt(section1, section2) {
                    if (section2) {
                        return Math.round(Math.random() * (section2 - section1)) + section1;
                    }
                    else {
                        return Math.round(Math.random() * section1);
                    }
                }
                _Number.randomOneInt = randomOneInt;
                function randomCountBySection(section1, section2, count, intSet) {
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
                            _Array.unique01(arr);
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
                            _Array.unique01(arr);
                        }
                        return arr;
                    }
                }
                _Number.randomCountBySection = randomCountBySection;
                function randomOneBySection(section1, section2, intSet) {
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
                _Number.randomOneBySection = randomOneBySection;
            })(_Number = Tools._Number || (Tools._Number = {}));
            let _Point;
            (function (_Point) {
                function getOtherLocal(element, Other) {
                    let Parent = element.parent;
                    let gPoint = Parent.localToGlobal(new Laya.Point(element.x, element.y));
                    return Other.globalToLocal(gPoint);
                }
                _Point.getOtherLocal = getOtherLocal;
                function angleByRad(angle) {
                    return angle / 180 * Math.PI;
                }
                _Point.angleByRad = angleByRad;
                function twoNodeDistance(obj1, obj2) {
                    let point = new Laya.Point(obj1.x, obj1.y);
                    let len = point.distance(obj2.x, obj2.y);
                    return len;
                }
                _Point.twoNodeDistance = twoNodeDistance;
                function pointByAngle(x, y) {
                    let radian = Math.atan2(x, y);
                    let angle = 90 - radian * (180 / Math.PI);
                    if (angle <= 0) {
                        angle = 270 + (90 + angle);
                    }
                    return angle - 90;
                }
                _Point.pointByAngle = pointByAngle;
                ;
                function angleByPoint(angle) {
                    let radian = (90 - angle) / (180 / Math.PI);
                    let p = new Laya.Point(Math.sin(radian), Math.cos(radian));
                    p.normalize();
                    return p;
                }
                _Point.angleByPoint = angleByPoint;
                ;
                function dotRotatePoint(x0, y0, x1, y1, angle) {
                    let x2 = x0 + (x1 - x0) * Math.cos(angle * Math.PI / 180) - (y1 - y0) * Math.sin(angle * Math.PI / 180);
                    let y2 = y0 + (x1 - x0) * Math.sin(angle * Math.PI / 180) + (y1 - y0) * Math.cos(angle * Math.PI / 180);
                    return new Laya.Point(x2, y2);
                }
                _Point.dotRotatePoint = dotRotatePoint;
                function angleAndLenByPoint(angle, len) {
                    if (angle % 90 === 0 || !angle) {
                    }
                    const speedXY = { x: 0, y: 0 };
                    speedXY.x = len * Math.cos(angle * Math.PI / 180);
                    speedXY.y = len * Math.sin(angle * Math.PI / 180);
                    return new Laya.Point(speedXY.x, speedXY.y);
                }
                _Point.angleAndLenByPoint = angleAndLenByPoint;
                function getRoundPos(angle, radius, centerPos) {
                    var center = centerPos;
                    var radius = radius;
                    var hudu = (2 * Math.PI / 360) * angle;
                    var X = center.x + Math.sin(hudu) * radius;
                    var Y = center.y - Math.cos(hudu) * radius;
                    return new Laya.Point(X, Y);
                }
                _Point.getRoundPos = getRoundPos;
                function randomPointByCenter(centerPos, radiusX, radiusY, count) {
                    if (!count) {
                        count = 1;
                    }
                    let arr = [];
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
                _Point.randomPointByCenter = randomPointByCenter;
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
                _Point.getPArrBetweenTwoP = getPArrBetweenTwoP;
                function reverseVector(Vecoter1, Vecoter2, normalizing) {
                    let p;
                    p = new Laya.Point(Vecoter1.x - Vecoter2.x, Vecoter1.y - Vecoter2.y);
                    if (normalizing) {
                        p.normalize();
                    }
                    return p;
                }
                _Point.reverseVector = reverseVector;
            })(_Point = Tools._Point || (Tools._Point = {}));
            let _3D;
            (function (_3D) {
                function getMeshSize(MSp3D) {
                    if (MSp3D.meshRenderer) {
                        let v3;
                        let extent = MSp3D.meshRenderer.bounds.getExtent();
                        return v3 = new Laya.Vector3(extent.x * 2, extent.y * 2, extent.z * 2);
                    }
                }
                _3D.getMeshSize = getMeshSize;
                function getSkinMeshSize(MSp3D) {
                    if (MSp3D.skinnedMeshRenderer) {
                        let v3;
                        let extent = MSp3D.skinnedMeshRenderer.bounds.getExtent();
                        return v3 = new Laya.Vector3(extent.x * 2, extent.y * 2, extent.z * 2);
                    }
                }
                _3D.getSkinMeshSize = getSkinMeshSize;
                function twoNodeDistance(obj1, obj2) {
                    let obj1V3 = obj1.transform.position;
                    let obj2V3 = obj2.transform.position;
                    let p = new Laya.Vector3();
                    Laya.Vector3.subtract(obj1V3, obj2V3, p);
                    let lenp = Laya.Vector3.scalarLength(p);
                    return lenp;
                }
                _3D.twoNodeDistance = twoNodeDistance;
                function twoPositionDistance(v1, v2) {
                    let p = twoSubV3(v1, v2);
                    let lenp = Laya.Vector3.scalarLength(p);
                    return lenp;
                }
                _3D.twoPositionDistance = twoPositionDistance;
                function twoSubV3(V31, V32, normalizing) {
                    let p = new Laya.Vector3();
                    Laya.Vector3.subtract(V31, V32, p);
                    if (normalizing) {
                        let p1 = new Laya.Vector3();
                        Laya.Vector3.normalize(p, p1);
                        return p1;
                    }
                    else {
                        return p;
                    }
                }
                _3D.twoSubV3 = twoSubV3;
                function maximumDistanceLimi(originV3, obj, length) {
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
                _3D.maximumDistanceLimi = maximumDistanceLimi;
                function posToScreen(v3, camera) {
                    let ScreenV4 = new Laya.Vector4();
                    camera.viewport.project(v3, camera.projectionViewMatrix, ScreenV4);
                    let point = new Laya.Vector2();
                    point.x = ScreenV4.x / Laya.stage.clientScaleX;
                    point.y = ScreenV4.y / Laya.stage.clientScaleY;
                    return point;
                }
                _3D.posToScreen = posToScreen;
                function reverseVector(Vecoter1, Vecoter2, normalizing) {
                    let p = new Laya.Vector3(Vecoter1.x - Vecoter2.x, Vecoter1.y - Vecoter2.y, Vecoter1.z - Vecoter2.z);
                    if (normalizing) {
                        let returnP = new Laya.Vector3();
                        Laya.Vector3.normalize(p, returnP);
                        return returnP;
                    }
                    else {
                        return p;
                    }
                }
                _3D.reverseVector = reverseVector;
                function rayScanning(camera, scene3D, vector2, filtrateName) {
                    let _ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 0));
                    let outs = new Array();
                    camera.viewportPointToRay(vector2, _ray);
                    scene3D.physicsSimulation.rayCastAll(_ray, outs);
                    if (filtrateName) {
                        let chek;
                        for (let i = 0; i < outs.length; i++) {
                            let Sp3d = outs[i].collider.owner;
                            if (Sp3d.name == filtrateName) {
                                chek = outs[i];
                            }
                        }
                        return chek;
                    }
                    else {
                        return outs;
                    }
                }
                _3D.rayScanning = rayScanning;
                function animatorPlay(Sp3D, aniName, normalizedTime, layerIndex) {
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
                _3D.animatorPlay = animatorPlay;
            })(_3D = Tools._3D || (Tools._3D = {}));
            let _Skeleton;
            (function (_Skeleton) {
                function sk_indexControl(sk, name) {
                    sk.play(name, true);
                    sk.player.currentTime = 15 * 1000 / sk.player.cacheFrameRate;
                }
                _Skeleton.sk_indexControl = sk_indexControl;
            })(_Skeleton = Tools._Skeleton || (Tools._Skeleton = {}));
            let _Draw;
            (function (_Draw) {
                function drawPieMask(parent, startAngle, endAngle) {
                    parent.cacheAs = "bitmap";
                    let drawPieSpt = new Laya.Sprite();
                    drawPieSpt.blendMode = "destination-out";
                    parent.addChild(drawPieSpt);
                    let drawPie = drawPieSpt.graphics.drawPie(parent.width / 2, parent.height / 2, parent.width / 2 + 10, startAngle, endAngle, "#000000");
                    return drawPie;
                }
                _Draw.drawPieMask = drawPieMask;
                function screenshot(Sp, quality) {
                    const htmlCanvas = Sp.drawToCanvas(Sp.width, Sp.height, Sp.x, Sp.y);
                    const base64 = htmlCanvas.toBase64("image/png", quality ? quality : 1);
                    return base64;
                }
                _Draw.screenshot = screenshot;
                function drawToTex(Sp, quality) {
                    let tex = Sp.drawToTexture(Sp.width, Sp.height, Sp.x, Sp.y);
                    return tex;
                }
                _Draw.drawToTex = drawToTex;
                function reverseRoundMask(node, x, y, radius, eliminate) {
                    if (eliminate == undefined || eliminate == true) {
                        _Node.removeAllChildren(node);
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
                _Draw.reverseRoundMask = reverseRoundMask;
                function reverseRoundrectMask(node, x, y, width, height, round, eliminate) {
                    if (eliminate == undefined || eliminate == true) {
                        _Node.removeAllChildren(node);
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
                _Draw.reverseRoundrectMask = reverseRoundrectMask;
            })(_Draw = Tools._Draw || (Tools._Draw = {}));
            let _ObjArray;
            (function (_ObjArray) {
                function sortByProperty(array, property) {
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
                _ObjArray.sortByProperty = sortByProperty;
                function diffProByTwo(objArr1, objArr2, property) {
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
                _ObjArray.diffProByTwo = diffProByTwo;
                function identicalPropertyObjArr(data1, data2, property) {
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
                _ObjArray.identicalPropertyObjArr = identicalPropertyObjArr;
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
                _ObjArray.objArrUnique = objArrUnique;
                function getArrByValue(objArr, property) {
                    let arr = [];
                    for (let i = 0; i < objArr.length; i++) {
                        if (objArr[i][property]) {
                            arr.push(objArr[i][property]);
                        }
                    }
                    return arr;
                }
                _ObjArray.getArrByValue = getArrByValue;
                function arrCopy(ObjArray) {
                    var sourceCopy = ObjArray instanceof Array ? [] : {};
                    for (var item in ObjArray) {
                        sourceCopy[item] = typeof ObjArray[item] === 'object' ? objCopy(ObjArray[item]) : ObjArray[item];
                    }
                    return sourceCopy;
                }
                _ObjArray.arrCopy = arrCopy;
                function modifyProValue(objArr, pro, value) {
                    for (const key in objArr) {
                        if (Object.prototype.hasOwnProperty.call(objArr, key)) {
                            const element = objArr[key];
                            if (element[pro]) {
                                element[pro] = value;
                            }
                        }
                    }
                }
                _ObjArray.modifyProValue = modifyProValue;
                function objCopy(obj) {
                    var _copyObj = {};
                    for (const item in obj) {
                        if (obj.hasOwnProperty(item)) {
                            const element = obj[item];
                            if (typeof element === 'object') {
                                if (Array.isArray(element)) {
                                    let arr1 = _Array.copy(element);
                                    _copyObj[item] = arr1;
                                }
                                else {
                                    objCopy(element);
                                }
                            }
                            else {
                                _copyObj[item] = element;
                            }
                        }
                    }
                    return _copyObj;
                }
                _ObjArray.objCopy = objCopy;
            })(_ObjArray = Tools._ObjArray || (Tools._ObjArray = {}));
            let _Array;
            (function (_Array) {
                function addToarray(array1, array2) {
                    for (let index = 0; index < array2.length; index++) {
                        const element = array2[index];
                        array1.push(element);
                    }
                    return array1;
                }
                _Array.addToarray = addToarray;
                function inverted(array) {
                    let arr = [];
                    for (let index = array.length - 1; index >= 0; index--) {
                        const element = array[index];
                        arr.push(element);
                    }
                    array = arr;
                    return array;
                }
                _Array.inverted = inverted;
                function randomGetOut(arr, num) {
                    if (!num) {
                        num = 1;
                    }
                    let arrCopy = _Array.copy(arr);
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
                _Array.randomGetOut = randomGetOut;
                function randomGetOne(arr) {
                    let arrCopy = copy(arr);
                    let ran = Math.round(Math.random() * (arrCopy.length - 1));
                    return arrCopy[ran];
                }
                _Array.randomGetOne = randomGetOne;
                function copy(arr1) {
                    var arr = [];
                    for (var i = 0; i < arr1.length; i++) {
                        arr.push(arr1[i]);
                    }
                    return arr;
                }
                _Array.copy = copy;
                function unique01(arr) {
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
                _Array.unique01 = unique01;
                function unique02(arr) {
                    arr = arr.sort();
                    var arr1 = [arr[0]];
                    for (var i = 1, len = arr.length; i < len; i++) {
                        if (arr[i] !== arr[i - 1]) {
                            arr1.push(arr[i]);
                        }
                    }
                    return arr1;
                }
                _Array.unique02 = unique02;
                function unique03(arr) {
                    return Array.from(new Set(arr));
                }
                _Array.unique03 = unique03;
                function oneExcludeOtherOne(arr1, arr2) {
                    let arr1Capy = _Array.copy(arr1);
                    let arr2Capy = _Array.copy(arr2);
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
                _Array.oneExcludeOtherOne = oneExcludeOtherOne;
                function moreExclude(arrays, exclude) {
                    let arr0 = [];
                    for (let i = 0; i < arrays.length; i++) {
                        for (let j = 0; j < arrays[i].length; j++) {
                            arr0.push(arrays[i][j]);
                        }
                    }
                    let arr1 = copy(arr0);
                    let arr2 = copy(arr1);
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
                _Array.moreExclude = moreExclude;
            })(_Array = Tools._Array || (Tools._Array = {}));
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
                        EventAdmin._notify(LwgPreLoad._Event.stepLoding);
                    }
                },
            };
            let _Event;
            (function (_Event) {
                _Event["importList"] = "_PreLoad_importList";
                _Event["complete"] = "_PreLoad_complete";
                _Event["stepLoding"] = "_PreLoad_startLoding";
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
                moduleEvent() {
                    EventAdmin._registerOnce(_Event.importList, this, (listObj) => {
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
                        LwgPreLoad._loadOrder = [_pic2D, _scene2D, _prefab2D, _prefab3D, _json, _texture, _texture2D, _mesh3D, _material, _skeleton, _scene3D];
                        for (let index = 0; index < LwgPreLoad._loadOrder.length; index++) {
                            LwgPreLoad._sumProgress += LwgPreLoad._loadOrder[index].length;
                            if (LwgPreLoad._loadOrder[index].length <= 0) {
                                LwgPreLoad._loadOrder.splice(index, 1);
                                index--;
                            }
                        }
                        let time = this.lwgOpenAni();
                        Laya.timer.once(time ? time : 0, this, () => {
                            EventAdmin._notify(LwgPreLoad._Event.stepLoding);
                        });
                    });
                    EventAdmin._register(_Event.stepLoding, this, () => { this.startLodingRule(); });
                    EventAdmin._registerOnce(_Event.complete, this, () => {
                        Laya.timer.once(this.lwgAllComplete(), this, () => {
                            Admin._SceneControl[LwgPreLoad._loadType] = this._Owner;
                            if (LwgPreLoad._loadType !== Admin._SceneName.PreLoad) {
                                Admin._PreLoadCutIn.openName && this._openScene(Admin._PreLoadCutIn.openName);
                            }
                            else {
                                for (const key in Admin._Moudel) {
                                    if (Object.prototype.hasOwnProperty.call(Admin._Moudel, key)) {
                                        const element = Admin._Moudel[key];
                                        if (element['_init']) {
                                            element['_init']();
                                        }
                                        else {
                                            console.log(element, '模块没有初始化函数！');
                                        }
                                    }
                                }
                                AudioAdmin._playMusic();
                                if (Admin._GuideControl.switch) {
                                    this._openScene(_SceneName.Guide, true, false, () => {
                                        LwgPreLoad._loadType = Admin._SceneName.PreLoadCutIn;
                                    });
                                }
                                else {
                                    this._openScene(_SceneName.Start, true, false, () => {
                                        LwgPreLoad._loadType = Admin._SceneName.PreLoadCutIn;
                                    });
                                }
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
                            Laya.Texture2D.load(_texture2D[index]['url'], Laya.Handler.create(this, function (tex) {
                                if (tex == null) {
                                    console.log('XXXXXXXXXXX2D纹理' + _texture2D[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
                                    _texture2D[index]['texture2D'] = tex;
                                    console.log('3D纹理' + _texture2D[index]['url'] + '加载完成！', '数组下标为：', index);
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
                                    console.log('XXXXXXXXXXX数据表' + _json[index]['url'] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                                }
                                else {
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
                lwgOpenAni() {
                    return 1;
                }
                moduleOnAwake() {
                }
                moduleOnStart() {
                    _init();
                    DateAdmin._init();
                    this._openScene(_SceneName.PreLoad);
                    this._Owner.close();
                }
                ;
            }
            _LwgInit._LwgInitScene = _LwgInitScene;
        })(_LwgInit = lwg._LwgInit || (lwg._LwgInit = {}));
        let Execution;
        (function (Execution) {
            Execution._execution = {
                get value() {
                    if (!this['_Execution_executionNum']) {
                        return Laya.LocalStorage.getItem('_Execution_executionNum') ? Number(Laya.LocalStorage.getItem('_Execution_executionNum')) : 15;
                    }
                    return this['_Execution_executionNum'];
                },
                set value(val) {
                    console.log(val);
                    this['_Execution_executionNum'] = val;
                    Laya.LocalStorage.setItem('_Execution_executionNum', val.toString());
                }
            };
            Execution._addExDate = {
                get value() {
                    if (!this['_Execution_addExDate']) {
                        return Laya.LocalStorage.getItem('_Execution_addExDate') ? Number(Laya.LocalStorage.getItem('_Execution_addExDate')) : (new Date()).getDay();
                    }
                    return this['_Execution_addExDate'];
                },
                set value(val) {
                    this['_Execution_addExDate'] = val;
                    Laya.LocalStorage.setItem('_Execution_addExDate', val.toString());
                }
            };
            Execution._addExHours = {
                get value() {
                    if (!this['_Execution_addExHours']) {
                        return Laya.LocalStorage.getItem('_Execution_addExHours') ? Number(Laya.LocalStorage.getItem('_Execution_addExHours')) : (new Date()).getHours();
                    }
                    return this['_Execution_addExHours'];
                },
                set value(val) {
                    this['_Execution_addExHours'] = val;
                    Laya.LocalStorage.setItem('_Execution_addExHours', val.toString());
                }
            };
            Execution._addMinutes = {
                get value() {
                    if (!this['_Execution_addMinutes']) {
                        return Laya.LocalStorage.getItem('_Execution_addMinutes') ? Number(Laya.LocalStorage.getItem('_Execution_addMinutes')) : (new Date()).getMinutes();
                    }
                    return this['_Execution_addMinutes'];
                },
                set value(val) {
                    this['_Execution_addMinutes'] = val;
                    Laya.LocalStorage.setItem('_Execution_addMinutes', val.toString());
                }
            };
            function _createExecutionNode(parent) {
                let sp;
                Laya.loader.load('prefab/ExecutionNum.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    parent.addChild(sp);
                    let num = sp.getChildByName('Num');
                    num.value = Execution._execution.value.toString();
                    sp.pos(297, 90);
                    sp.zOrder = 50;
                    Execution._ExecutionNode = sp;
                    Execution._ExecutionNode.name = '_ExecutionNode';
                }));
            }
            Execution._createExecutionNode = _createExecutionNode;
            function _addExecution(x, y, func) {
                let sp;
                Laya.loader.load('prefab/execution.json', Laya.Handler.create(this, function (prefab) {
                    let _prefab = new Laya.Prefab();
                    _prefab.json = prefab;
                    sp = Laya.Pool.getItemByCreateFun('prefab', _prefab.create, _prefab);
                    Laya.stage.addChild(sp);
                    sp.x = Laya.stage.width / 2;
                    sp.y = Laya.stage.height / 2;
                    sp.zOrder = 50;
                    if (Execution._ExecutionNode) {
                        Animation2D.move(sp, Execution._ExecutionNode.x, Execution._ExecutionNode.y, 800, () => {
                            Animation2D.fadeOut(sp, 1, 0, 200, 0, () => {
                                Animation2D.upDwon_Shake(Execution._ExecutionNode, 10, 80, 0, null);
                                if (func) {
                                    func();
                                }
                            });
                        }, 100);
                    }
                }));
            }
            Execution._addExecution = _addExecution;
            function createConsumeEx(subEx) {
                let label = Laya.Pool.getItemByClass('label', Laya.Label);
                label.name = 'label';
                Laya.stage.addChild(label);
                label.text = '-2';
                label.fontSize = 40;
                label.bold = true;
                label.color = '#59245c';
                label.x = Execution._ExecutionNode.x + 100;
                label.y = Execution._ExecutionNode.y - label.height / 2 + 4;
                label.zOrder = 100;
                Animation2D.fadeOut(label, 0, 1, 200, 150, () => {
                    Animation2D.leftRight_Shake(Execution._ExecutionNode, 15, 60, 0, null);
                    Animation2D.fadeOut(label, 1, 0, 600, 400, () => {
                    });
                });
            }
            Execution.createConsumeEx = createConsumeEx;
            class ExecutionNode extends Admin._ObjectBase {
                constructor() {
                    super(...arguments);
                    this.time = 0;
                    this.countNum = 59;
                    this.timeSwitch = true;
                }
                lwgOnAwake() {
                    this.Num = this._Owner.getChildByName('Num');
                    this.CountDown = this._Owner.getChildByName('CountDown');
                    this.CountDown_board = this._Owner.getChildByName('CountDown_board');
                    this.countNum = 59;
                    this.CountDown.text = '00:' + this.countNum;
                    this.CountDown_board.text = this.CountDown.text;
                    let d = new Date;
                    if (d.getDate() !== Execution._addExDate.value) {
                        Execution._execution.value = 15;
                    }
                    else {
                        if (d.getHours() == Execution._addExHours.value) {
                            console.log(d.getMinutes(), Execution._addMinutes.value);
                            Execution._execution.value += (d.getMinutes() - Execution._addMinutes.value);
                            if (Execution._execution.value > 15) {
                                Execution._execution.value = 15;
                            }
                        }
                        else {
                            Execution._execution.value = 15;
                        }
                    }
                    this.Num.value = Execution._execution.value.toString();
                    Execution._addExDate.value = d.getDate();
                    Execution._addExHours.value = d.getHours();
                    Execution._addMinutes.value = d.getMinutes();
                }
                countDownAddEx() {
                    this.time++;
                    if (this.time % 60 == 0) {
                        this.countNum--;
                        if (this.countNum < 0) {
                            this.countNum = 59;
                            Execution._execution.value += 1;
                            this.Num.value = Execution._execution.value.toString();
                            let d = new Date;
                            Execution._addExHours.value = d.getHours();
                            Execution._addMinutes.value = d.getMinutes();
                        }
                        if (this.countNum >= 10 && this.countNum <= 59) {
                            this.CountDown.text = '00:' + this.countNum;
                            this.CountDown_board.text = this.CountDown.text;
                        }
                        else if (this.countNum >= 0 && this.countNum < 10) {
                            this.CountDown.text = '00:0' + this.countNum;
                            this.CountDown_board.text = this.CountDown.text;
                        }
                    }
                }
                lwgOnUpdate() {
                    if (Number(this.Num.value) >= 15) {
                        if (this.timeSwitch) {
                            Execution._execution.value = 15;
                            this.Num.value = Execution._execution.value.toString();
                            this.CountDown.text = '00:00';
                            this.CountDown_board.text = this.CountDown.text;
                            this.countNum = 60;
                            this.timeSwitch = false;
                        }
                    }
                    else {
                        this.timeSwitch = true;
                        this.countDownAddEx();
                    }
                }
            }
            Execution.ExecutionNode = ExecutionNode;
        })(Execution = lwg.Execution || (lwg.Execution = {}));
    })(lwg || (lwg = {}));
    var lwg$1 = lwg;
    let Admin = lwg.Admin;
    let _SceneBase = Admin._SceneBase;
    let _ObjectBase = Admin._ObjectBase;
    let _SceneName = Admin._SceneName;
    let Platform = lwg.Platform;
    let SceneAnimation = lwg.SceneAnimation;
    let Adaptive = lwg.Adaptive;
    let StorageAdmin = lwg.StorageAdmin;
    let DataAdmin = lwg.DataAdmin;
    let EventAdmin = lwg.EventAdmin;
    let DateAdmin = lwg.DateAdmin;
    let TimerAdmin = lwg.TimerAdmin;
    let Execution = lwg.Execution;
    let Gold = lwg.Gold;
    let Setting = lwg.Setting;
    let AudioAdmin = lwg.AudioAdmin;
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
                console.log(Laya.stage['_children']);
            }
            lwgOpenAni() {
                return 1;
            }
            lwgEventRegister() {
            }
        }
        _Guide.Guide = Guide;
    })(_Guide || (_Guide = {}));
    var _Guide$1 = _Guide.Guide;

    class _UI {
        constructor(_Scene) {
            this.time = 100;
            this.delay = 100;
            this.scale = 1.4;
            if (!_Scene) {
                return;
            }
            this.Scene = _Scene;
            this.Operation = _Scene['Operation'];
            this.BtnAgain = Tools._Node.createPrefab(_Res._list.prefab2D.BtnAgain.prefab, _Scene, [200, 79]);
            Click._on(Click._Use.value, this.BtnAgain, this, null, null, () => {
                this.btnAgainClick && this.btnAgainClick();
            });
            this.BtnComplete = _Scene['BtnComplete'];
            Click._on(Click._Use.value, this.BtnComplete, this, null, null, () => {
                this.btnCompleteClick && this.btnCompleteClick();
            });
            this.BtnBack = Tools._Node.createPrefab(_Res._list.prefab2D.BtnBack.prefab, _Scene, [77, 79]);
            Click._on(Click._Use.value, this.BtnBack, this, null, null, () => {
                _Scene[_Scene.name]._openScene('Start', true, true);
            });
            this.BtnRollback = Tools._Node.createPrefab(_Res._list.prefab2D.BtnRollback.prefab, _Scene, [200, 79]);
            Click._on(Click._Use.value, this.BtnRollback, this, null, null, () => {
                this.btnRollbackClick && this.btnRollbackClick();
            });
            this.Operation.pos(Laya.stage.width + 500, 20);
            this.BtnComplete.scale(0, 0);
            this.BtnBack.scale(0, 0);
            this.BtnAgain.scale(0, 0);
            this.BtnRollback.scale(0, 0);
            this.BtnRollback.zOrder = this.BtnAgain.zOrder = this.BtnBack.zOrder = this.BtnComplete.zOrder = this.Operation.zOrder = 200;
            this.moveTargetX = Laya.stage.width - this.Operation.width + 50;
        }
        btnRollbackAppear(func, delay) {
            Animation2D.bombs_Appear(this.BtnRollback, 0, 1, this.scale, 0, this.time * 2, () => {
                func && func();
            }, delay ? delay : 0);
        }
        ;
        btnRollbackVinish(func, delay) {
            Animation2D.bombs_Vanish(this.BtnRollback, 0, 0, 0, this.time * 4, () => {
                func && func();
            }, delay ? delay : 0);
        }
        ;
        btnAgainAppear(func, delay) {
            Animation2D.bombs_Appear(this.BtnAgain, 0, 1, this.scale, 0, this.time * 2, () => {
                func && func();
            }, delay ? delay : 0);
        }
        ;
        btnAgainVinish(func, delay) {
            Animation2D.bombs_Vanish(this.BtnAgain, 0, 0, 0, this.time * 4, () => {
                func && func();
            }, delay ? delay : 0);
        }
        ;
        btnBackAppear(func, delay) {
            Animation2D.bombs_Appear(this.BtnBack, 0, 1, this.scale, 0, this.time * 2, () => {
                func && func();
            }, delay ? delay : 0);
        }
        ;
        btnBackVinish(func, delay) {
            Animation2D.bombs_Vanish(this.BtnBack, 0, 0, 0, this.time * 4, () => {
                func && func();
            }, delay ? delay : 0);
        }
        ;
        btnCompleteAppear(func, delay) {
            this.effect(this.Operation, new Laya.Point(this.BtnComplete.x, this.BtnComplete.y), delay);
            Animation2D.bombs_Appear(this.BtnComplete, 0, 1, this.scale, 0, this.time * 2, () => {
                func && func();
            }, delay ? delay : 0);
        }
        btnCompleteVinish(func, delay) {
            Animation2D.bombs_Vanish(this.BtnComplete, 0, 0, 0, this.time * 4, () => {
                func && func();
            }, delay ? delay : 0);
        }
        ;
        operationAppear(func, delay) {
            if (this.Scene.name === 'MakeTailor') {
                Animation2D.fadeOut(this.Scene['BG2'], this.Scene['BG2'].alpha, 1, 500);
            }
            Animation2D.move(this.Operation, this.moveTargetX - 40, this.Operation.y, this.time * 4, () => {
                Animation2D.move(this.Operation, this.moveTargetX, this.Operation.y, this.time, () => {
                    func && func();
                });
            }, delay ? delay : 0);
        }
        ;
        operationVinish(func, delay) {
            if (this.Scene.name === 'MakeTailor') {
                Animation2D.fadeOut(this.Scene['BG2'], this.Scene['BG2'].alpha, 0, 500);
            }
            Animation2D.bombs_Vanish(this.BtnComplete, 0, 0, 0, this.time * 4, () => {
                Animation2D.move(this.Operation, this.moveTargetX - 40, this.Operation.y, this.time, () => {
                    Animation2D.move(this.Operation, Laya.stage.width + 500, this.Operation.y, this.time * 4, () => {
                        func && func();
                    });
                });
            }, delay ? delay : 0);
        }
        effect(Parent, p, delay) {
            TimerAdmin._once(delay ? delay : 0, this, () => {
                const count = 40;
                const time = 5;
                const dis = Tools._Number.randomOneInt(30, 30);
                for (let index = 0; index < count; index++) {
                    Effects._Particle._sprayRound(Parent, p, null, [20, 40], null, [Effects._SkinUrl.星星8], null, [dis, dis], [time, time], null, null, 5);
                }
                AudioAdmin._playSound();
            });
        }
    }
    class UI1 {
        constructor(parameters) {
            this.time = 100;
            this.delay = 100;
            this.scale = 1.4;
        }
    }

    var _MakeTailor;
    (function (_MakeTailor) {
        let _Event;
        (function (_Event) {
            _Event["scissorTrigger"] = "_MakeTailor_ scissorTrigger";
            _Event["completeEffcet"] = "_MakeTailor_completeAni";
            _Event["changeClothes"] = "_MakeTailor_changeClothes";
            _Event["scissorAppear"] = "_MakeTailor_scissorAppear";
            _Event["scissorPlay"] = "_MakeTailor_scissorPlay";
            _Event["scissorStop"] = "_MakeTailor_scissorStop";
            _Event["scissorRotation"] = "_MakeTailor_scissorRotation";
            _Event["scissorAgain"] = "_MakeTailor_scissorSitu";
            _Event["scissorRemove"] = "_MakeTailor_scissorRemove";
        })(_Event = _MakeTailor._Event || (_MakeTailor._Event = {}));
        class _DIYClothes extends DataAdmin._Table {
            constructor() {
                super(...arguments);
                this._classify = {
                    Dress: 'Dress',
                    Top: 'Top',
                    Bottoms: 'Bottoms',
                };
                this._otherPro = {
                    color: 'color',
                    icon: 'icon',
                    diffX: 'diffX',
                    diffY: 'diffY',
                    texR: 'texR',
                    texF: 'texF',
                };
            }
            static _ins() {
                if (!this.ins) {
                    this.ins = new _DIYClothes('DIYClothes', _Res._list.json.DIYClothes.dataArr, true);
                }
                return this.ins;
            }
            ;
            getColor() {
                let obj = this._getPitchObj();
                return [obj[`${this._otherPro.color}1`], obj[`${this._otherPro.color}2`]];
            }
            getClothesArr() {
                if (!this.ClothesArr) {
                    this.ClothesArr = [];
                    const dataArr = _DIYClothes._ins()._arr;
                    for (let index = 0; index < dataArr.length; index++) {
                        let CloBox = this.createClothes(`${dataArr[index]['name']}`);
                        this.ClothesArr.push(CloBox);
                    }
                }
                return this.ClothesArr;
            }
            createClothes(name, Scene) {
                const Cloth = Tools._Node.createPrefab(_Res._list.prefab2D[name]['prefab']);
                const CloBox = new Laya.Sprite;
                CloBox.width = Laya.stage.width;
                CloBox.height = Laya.stage.height;
                CloBox.pivotX = CloBox.width / 2;
                CloBox.pivotY = CloBox.height / 2;
                CloBox.x = Laya.stage.width / 2;
                CloBox.y = Laya.stage.height / 2;
                CloBox.addChild(Cloth);
                CloBox.name = name;
                if (Scene) {
                    Scene.addChild(CloBox);
                    CloBox.zOrder = 20;
                }
                return CloBox;
            }
        }
        _MakeTailor._DIYClothes = _DIYClothes;
        class _TaskClothes extends DataAdmin._Table {
            constructor() {
                super(...arguments);
                this.moveTime = 600;
            }
            static _ins() {
                if (!this.ins) {
                    this.ins = new _TaskClothes('DIY_Task');
                }
                return this.ins;
            }
            again(Scene) {
                const clothesArr = _DIYClothes._ins().getClothesArr();
                const name = _DIYClothes._ins()._pitchName ? _DIYClothes._ins()._pitchName : clothesArr[0]['name'];
                for (let index = 0; index < clothesArr.length; index++) {
                    const element = clothesArr[index];
                    if (element.name === name) {
                        this.LastClothes = element;
                        clothesArr[index] = this.Clothes = _DIYClothes._ins().createClothes(name, Scene);
                        this.LineParent = this.Clothes.getChildAt(0).getChildByName('LineParent');
                        this.setData();
                    }
                }
                this.clothesMove();
                Animation2D.move_rotate(this.LastClothes, 45, new Laya.Point(Laya.stage.width * 1.5, Laya.stage.height * 1.5), this.moveTime, 0, () => {
                    this.LastClothes.removeSelf();
                });
            }
            clothesMove() {
                const time = 700;
                this.Clothes.pos(0, -Laya.stage.height * 1.5);
                this.Clothes.rotation = 45;
                Animation2D.move_rotate(this.Clothes, 0, new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2), time);
            }
            changeClothes(Scene) {
                const clothesArr = _DIYClothes._ins().getClothesArr();
                const name = _DIYClothes._ins()._pitchName ? _DIYClothes._ins()._pitchName : clothesArr[0]['name'];
                const lastName = _DIYClothes._ins()._lastPitchName;
                for (let index = 0; index < clothesArr.length; index++) {
                    const element = clothesArr[index];
                    if (element.name == name) {
                        element.removeSelf();
                        this.Clothes = clothesArr[index] = _DIYClothes._ins().createClothes(name, Scene);
                        this.LineParent = this.Clothes.getChildAt(0).getChildByName('LineParent');
                        this.setData();
                    }
                    else if (element.name == lastName) {
                        this.LastClothes = element;
                    }
                    else {
                        element.removeSelf();
                    }
                }
                this.clothesMove();
                this.LastClothes && Animation2D.move_rotate(this.LastClothes, -45, new Laya.Point(Laya.stage.width * 1.5, -Laya.stage.height * 1.5), this.moveTime, 0, () => {
                    this.LastClothes.removeSelf();
                });
            }
            setData() {
                this._arr = [];
                for (let index = 0; index < this.LineParent.numChildren; index++) {
                    const Line = this.LineParent.getChildAt(index);
                    if (Line.numChildren > 0) {
                        let data = {};
                        data['Line'] = Line;
                        data[this._property.name] = Line.name;
                        data[this._property.conditionNum] = Line.numChildren;
                        data[this._property.degreeNum] = 0;
                        this._arr.push(data);
                    }
                }
            }
        }
        _MakeTailor._TaskClothes = _TaskClothes;
        class _Scissor extends Admin._ObjectBase {
            constructor() {
                super(...arguments);
                this.Ani = {
                    vanishP: new Laya.Point(Laya.stage.width + 500, 0),
                    shearSpeed: 3,
                    range: 40,
                    dir: 'up',
                    dirType: {
                        up: 'up',
                        down: 'down',
                    },
                    paly: () => {
                        TimerAdmin._clearAll([this.Ani]);
                        Animation2D._clearAll([this.Ani]);
                        TimerAdmin._frameLoop(1, this.Ani, () => {
                            if (this._SceneImg('S2').rotation > this.Ani.range) {
                                this.Ani.dir = 'up';
                            }
                            else if (this._SceneImg('S2').rotation <= 0) {
                                this.Ani.dir = 'down';
                            }
                            if (this.Ani.dir == 'up') {
                                this._SceneImg('S1').rotation += this.Ani.shearSpeed * 4;
                                this._SceneImg('S2').rotation -= this.Ani.shearSpeed * 4;
                            }
                            else if (this.Ani.dir == 'down') {
                                this._SceneImg('S1').rotation -= this.Ani.shearSpeed;
                                this._SceneImg('S2').rotation += this.Ani.shearSpeed;
                            }
                        });
                    },
                    stop: () => {
                        TimerAdmin._frameOnce(30, this.Ani, () => {
                            let time = 100;
                            TimerAdmin._clearAll([this.Ani]);
                            Animation2D._clearAll([this.Ani]);
                            Animation2D.rotate(this._SceneImg('S1'), -this.Ani.range / 3, time);
                            Animation2D.rotate(this._SceneImg('S2'), this.Ani.range / 3, time);
                        });
                    },
                    event: () => {
                        this._evReg(_Event.scissorAppear, () => {
                            let time = 800;
                            Animation2D.move_rotate(this._Owner, this._fRotation + 360, this._fPoint, time, 0, () => {
                                this._Owner.rotation = this._fRotation;
                                this.Move.switch = true;
                            });
                        });
                        this._evReg(_Event.scissorPlay, () => {
                            this.Ani.paly();
                        });
                        this._evReg(_Event.scissorStop, () => {
                            this.Ani.stop();
                        });
                        this._evReg(_Event.scissorRemove, (func) => {
                            this.Move.switch = false;
                            let disX = 1500;
                            let disY = -600;
                            let time = 600;
                            let delay = 100;
                            Animation2D.move_rotate(this._Owner, this._Owner.rotation + 360, new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2), time / 2, delay, () => {
                                this._Owner.rotation = 0;
                                Animation2D.move_rotate(this._Owner, -30, new Laya.Point(this._Owner.x - disX / 6, this._Owner.y - disY / 5), time / 2, delay * 1.5, () => {
                                    Animation2D.move_rotate(this._Owner, Tools._Number.randomOneHalf() == 0 ? 720 : -720, new Laya.Point(this._Owner.x + disX, this._Owner.y + disY), time, delay, () => {
                                        func && func();
                                        this._Owner.rotation = 0;
                                        this._Owner.pos(this.Ani.vanishP.x, this.Ani.vanishP.y);
                                    });
                                });
                            });
                        });
                        this._evReg(_Event.scissorAgain, () => {
                            Animation2D.move_rotate(this._Owner, this._fRotation, this._fPoint, 600, 100, () => {
                                _TaskClothes._ins().again(this._Scene);
                            });
                        });
                        this._evReg(_Event.scissorRotation, (rotate) => {
                            TimerAdmin._clearAll([this._Owner]);
                            const time = 10;
                            let angle;
                            if (Math.abs(rotate - this._Owner.rotation) < 180) {
                                angle = rotate - this._Owner.rotation;
                            }
                            else {
                                angle = -(360 - (rotate - this._Owner.rotation));
                            }
                            let unit = angle / time;
                            TimerAdmin._frameNumLoop(1, time, this._Owner, () => {
                                this._Owner.rotation += unit;
                            });
                        });
                    },
                    effcts: () => {
                        const num = Tools._Number.randomOneInt(3, 6);
                        const color1 = _DIYClothes._ins().getColor()[0];
                        const color2 = _DIYClothes._ins().getColor()[1];
                        const color = Tools._Number.randomOneHalf() === 0 ? color1 : color2;
                        for (let index = 0; index < num; index++) {
                            Effects._Particle._spray(this._Scene, this._point, [10, 30], null, [0, 360], [Effects._SkinUrl.三角形1], [color1, color2], [20, 90], null, null, [1, 3], [0.1, 0.2], this._Owner.zOrder - 1);
                        }
                    }
                };
                this.Move = {
                    switch: false,
                    touchP: null,
                    diffP: null,
                };
            }
            lwgOnAwake() {
                this._Owner.pos(this.Ani.vanishP.x, this.Ani.vanishP.y);
            }
            lwgEvent() {
                this.Ani.event();
            }
            lwgButton() {
                this._btnFour(Laya.stage, (e) => {
                    if (this.Move.switch) {
                        this._evNotify(_Event.scissorPlay);
                        this.Move.touchP = new Laya.Point(e.stageX, e.stageY);
                    }
                }, (e) => {
                    if (this.Move.touchP && this.Move.switch) {
                        this.Move.diffP = new Laya.Point(e.stageX - this.Move.touchP.x, e.stageY - this.Move.touchP.y);
                        this._Owner.x += this.Move.diffP.x;
                        this._Owner.y += this.Move.diffP.y;
                        Tools._Node.tieByStage(this._Owner);
                        this.Move.touchP = new Laya.Point(e.stageX, e.stageY);
                        this._evNotify(_Event.scissorPlay);
                    }
                }, (e) => {
                    this._evNotify(_Event.scissorStop);
                    this.Move.touchP = null;
                });
            }
            onTriggerEnter(other, _Owner) {
                if (!other['cut'] && this.Move.switch) {
                    other['cut'] = true;
                    this._evNotify(_Event.scissorPlay);
                    this._evNotify(_Event.scissorStop);
                    EventAdmin._notify(_Event.scissorTrigger, [other.owner]);
                    this.Ani.effcts();
                }
            }
        }
        class _Item extends Admin._ObjectBase {
            lwgButton() {
                this._btnUp(this._Owner, () => {
                    if (this._Owner['_dataSource']['name'] !== _DIYClothes._ins()._pitchName) {
                        _DIYClothes._ins()._setPitch(this._Owner['_dataSource']['name']);
                        this._evNotify(_Event.changeClothes);
                    }
                });
            }
        }
        class MakeTailor extends Admin._SceneBase {
            constructor() {
                super(...arguments);
                this.effcet = {
                    ani1: () => {
                        this._AniVar('complete').play(0, false);
                        let _caller = {};
                        TimerAdmin._frameLoop(1, _caller, () => {
                            let gP = this._ImgVar('EFlower').parent.localToGlobal(new Laya.Point(this._ImgVar('EFlower').x, this._ImgVar('EFlower').y));
                            Effects._Particle._fallingVertical(this._Owner, new Laya.Point(gP.x, gP.y - 40), [0, 0], null, null, [0, 360], [Effects._SkinUrl.花2], [[255, 222, 0, 1], [255, 222, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1]);
                            Effects._Particle._fallingVertical(this._Owner, new Laya.Point(gP.x, gP.y), [0, 0], null, null, [0, 360], [Effects._SkinUrl.花2], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1]);
                        });
                        this._AniVar('complete').on(Laya.Event.COMPLETE, this, () => {
                            TimerAdmin._clearAll([_caller]);
                        });
                    },
                    ani2: () => {
                        let num = 6;
                        let spcaing = 20;
                        for (let index = 0; index < num; index++) {
                            let moveY = 7 * index + 5;
                            let p1 = new Laya.Point(-200, Laya.stage.height);
                            let _caller = {};
                            let funcL = () => {
                                p1.x += spcaing;
                                if (p1.x > Laya.stage.width) {
                                    Laya.timer.clearAll(_caller);
                                }
                                p1.y -= moveY;
                                Effects._Particle._fallingVertical(this._Owner, new Laya.Point(p1.x, p1.y), [0, 0], null, null, [0, 360], [Effects._SkinUrl.花2], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1]);
                            };
                            TimerAdmin._frameLoop(1, _caller, () => {
                                funcL();
                            });
                            let p2 = new Laya.Point(Laya.stage.width + 200, Laya.stage.height);
                            let _callerR = {};
                            let funcR = () => {
                                p2.x -= spcaing;
                                if (p2.x < 0) {
                                    Laya.timer.clearAll(_callerR);
                                }
                                p2.y -= moveY;
                                Effects._Particle._fallingVertical(this._Owner, new Laya.Point(p2.x, p2.y), [0, 0], null, null, [0, 360], [Effects._SkinUrl.花2], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1]);
                            };
                            TimerAdmin._frameLoop(1, _callerR, () => {
                                funcR();
                            });
                        }
                    },
                    ani3: () => {
                        let len = Laya.stage.width;
                        let _height = Laya.stage.height * 2.5;
                        let Img = new Laya.Image;
                        Img.width = 100;
                        Img.height = _height;
                        Img.rotation = 40;
                        Tools._Node.changePivot(Img, 0, _height / 2);
                        Img.pos(0, 0);
                        Laya.stage.addChild(Img);
                        Img.zOrder = 1000;
                        let num = 20;
                        let spcaing = 40;
                        for (let index = 0; index < num; index++) {
                            let p1 = new Laya.Point(0, Img.height / num * index);
                            let p2 = new Laya.Point(Laya.stage.width, Img.height / num * index);
                            let _caller = {};
                            let func = () => {
                                p1.x += spcaing;
                                if (p1.x > len) {
                                    Laya.timer.clearAll(_caller);
                                }
                                p2.x -= spcaing;
                                if (p2.x > len) {
                                    Laya.timer.clearAll(_caller);
                                }
                                if (index % 2 == 0) {
                                    Effects._Particle._fallingVertical(Img, new Laya.Point(p1.x, p1.y), [0, 0], null, null, [0, 360], [Effects._SkinUrl.星星8], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1]);
                                }
                                else {
                                    Effects._Particle._fallingVertical_Reverse(Img, new Laya.Point(p2.x, p2.y), [0, 0], null, null, [0, 360], [Effects._SkinUrl.星星8], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [-100, -200], [-0.8, -1.5], [-0.05, -0.1]);
                                }
                            };
                            TimerAdmin._frameNumLoop(2, 50, _caller, () => {
                                func();
                            });
                        }
                    }
                };
            }
            lwgOnAwake() {
                this._ImgVar('Scissor').addComponent(_Scissor);
                _DIYClothes._ins()._List = this._ListVar('List');
                _DIYClothes._ins()._List.array = _DIYClothes._ins()._getArrByPitchClassify();
                _DIYClothes._ins()._setPitch(_DIYClothes._ins()._getArrByPitchClassify()[0][_DIYClothes._ins()._property.name]);
                _DIYClothes._ins()._listRender = (Cell, index) => {
                    const data = Cell.dataSource;
                    const Icon = Cell.getChildByName('Icon');
                    let name = data['name'];
                    Icon.skin = `Game/UI/MakeTailor/${name}/${name.substr(0, name.length - 5)}cut.png`;
                    const Board = Cell.getChildByName('Board');
                    Board.skin = `Lwg/UI/ui_orthogon_green.png`;
                    if (data[_DIYClothes._ins()._property.pitch]) {
                        Board.skin = `Game/UI/Common/xuanzhong.png`;
                    }
                    else {
                        Board.skin = null;
                    }
                    if (!Cell.getComponent(_Item)) {
                        Cell.addComponent(_Item);
                    }
                };
            }
            lwgOnStart() {
                this.UI = new _UI(this._Owner);
                TimerAdmin._frameOnce(40, this, () => {
                    this.UI.operationAppear(() => {
                        this.UI.btnAgainVinish(null, 200);
                        this.UI.btnCompleteAppear(null, 400);
                    });
                    this.UI.btnBackAppear();
                });
                this.UI.BtnRollback.visible = false;
                this.UI.btnCompleteClick = () => {
                    this.UI.operationVinish(() => {
                        this.UI.btnAgainAppear();
                    }, 200);
                    TimerAdmin._frameOnce(30, this, () => {
                        this._evNotify(_Event.scissorAppear);
                    });
                };
                this.UI.btnAgainClick = () => {
                    this._evNotify(_Event.scissorRemove, [() => {
                            _TaskClothes._ins().again(this._Owner);
                        }]);
                    Click._switch = false;
                    TimerAdmin._frameOnce(60, this, () => {
                        this.UI.operationAppear(() => {
                            this.UI.btnAgainVinish(null, 200);
                            this.UI.btnCompleteAppear();
                        });
                        Click._switch = true;
                    });
                };
                TimerAdmin._frameOnce(20, this, () => {
                    _TaskClothes._ins().changeClothes(this._Owner);
                });
            }
            lwgEvent() {
                this._evReg(_Event.changeClothes, () => {
                    _TaskClothes._ins().changeClothes(this._Owner);
                });
                this._evReg(_Event.scissorTrigger, (Dotted) => {
                    const Parent = Dotted.parent;
                    const value = _TaskClothes._ins()._checkCondition(Parent.name);
                    Dotted.visible = false;
                    let Eraser = Parent.getChildByName('Eraser');
                    if (!Eraser) {
                        Eraser = new Laya.Sprite;
                        Parent.addChild(Eraser);
                    }
                    Eraser.blendMode = "destination-out";
                    Parent.cacheAs = "bitmap";
                    Eraser.graphics.drawCircle(Dotted.x, Dotted.y, 15, '#000000');
                    if (value) {
                        for (let index = 0; index < _TaskClothes._ins().Clothes.getChildAt(0).numChildren; index++) {
                            const element = _TaskClothes._ins().Clothes.getChildAt(0).getChildAt(index);
                            if (element.name.substr(5, 2) == Dotted.parent.name.substr(4, 2)) {
                                let time = 1500;
                                let disX = Tools._Number.randomOneInt(1000) + 1000;
                                let disY = Tools._Number.randomOneInt(1000) + 1000;
                                switch (element.name.substr(8)) {
                                    case 'U':
                                        disX = 0;
                                        disY = -disY;
                                        break;
                                    case 'LU':
                                        disX = -disX;
                                        disY = -disY;
                                        break;
                                    case 'L':
                                        disX = -disX;
                                        disY = 0;
                                        break;
                                    case 'R':
                                        disX = disX;
                                        disY = 0;
                                        break;
                                    case 'RU':
                                        disY = -disY;
                                        break;
                                    case 'D':
                                        disX = 0;
                                        break;
                                    case 'RD':
                                        break;
                                    case 'LD':
                                        disX = -disX;
                                        break;
                                    default:
                                        break;
                                }
                                Animation2D.move_rotate(element, 0, new Laya.Point(element.x + disX / 30, element.y + disY / 30), time / 6, 0, () => {
                                    let rotate1 = Tools._Number.randomOneBySection(180);
                                    let rotate2 = Tools._Number.randomOneBySection(-180);
                                    Animation2D.move_rotate(element, Tools._Number.randomOneHalf() == 0 ? rotate1 : rotate2, new Laya.Point(element.x + disX, element.y + disY), time, 0, () => {
                                        Animation2D.fadeOut(element, 1, 0, 200);
                                    });
                                });
                            }
                        }
                        if (_TaskClothes._ins()._checkAllCompelet()) {
                            Tools._Node.removeAllChildren(_TaskClothes._ins().LineParent);
                            this._evNotify(_Event.scissorRemove);
                            TimerAdmin._frameOnce(80, this, () => {
                                this._evNotify(_Event.completeEffcet);
                            });
                            TimerAdmin._frameOnce(280, this, () => {
                                this._openScene('MakePattern', true, true);
                            });
                        }
                    }
                    const gPos = Dotted.parent.localToGlobal(new Laya.Point(Dotted.x, Dotted.y));
                    if (Dotted.name == 'A') {
                        if (this._ImgVar('Scissor').x <= gPos.x) {
                            this._evNotify(_Event.scissorRotation, [Dotted.rotation]);
                        }
                        else {
                            this._evNotify(_Event.scissorRotation, [180 + Dotted.rotation]);
                        }
                    }
                    else {
                        if (this._ImgVar('Scissor').y >= gPos.y) {
                            this._evNotify(_Event.scissorRotation, [Dotted.rotation]);
                        }
                        else {
                            this._evNotify(_Event.scissorRotation, [180 + Dotted.rotation]);
                        }
                    }
                });
                this._evReg(_Event.completeEffcet, () => {
                    this.UI.btnBackVinish();
                    this.UI.btnAgainVinish();
                    AudioAdmin._playVictorySound();
                    this.effcet[`ani${Tools._Number.randomOneInt(1, 3)}`]();
                });
            }
        }
        _MakeTailor.MakeTailor = MakeTailor;
    })(_MakeTailor || (_MakeTailor = {}));

    var _3D;
    (function (_3D) {
        class _Scene {
            constructor() {
                this.aniName = {
                    Stand: 'Stand',
                    Pose1: 'Pose1',
                    Pose2: 'Pose2',
                    DispalyCloth: 'DispalyCloth',
                    Walk: 'Walk',
                };
            }
            static _ins() {
                if (!this.ins) {
                    this.ins = new _Scene();
                    this.ins._Owner = _Res._list.scene3D.MakeClothes.Scene;
                    Laya.stage.addChild(this.ins._Owner);
                    this.ins._Role = this.ins._Owner.getChildByName('Role');
                    this.ins._RoleFPos = new Laya.Vector3(this.ins._Role.transform.position.x, this.ins._Role.transform.position.y, this.ins._Role.transform.position.z);
                    this.ins._Root = this.ins._Role.getChildByName('Root');
                    this.ins._DIY = this.ins._Root.getChildByName('DIY');
                    this.ins._General = this.ins._Root.getChildByName('General');
                    this.ins._DBottoms = this.ins._DIY.getChildByName('Bottoms');
                    this.ins._DTop = this.ins._DIY.getChildByName('Top');
                    this.ins._DDress = this.ins._DIY.getChildByName('Dress');
                    this.ins._GBottoms = this.ins._General.getChildByName('Bottoms');
                    this.ins._GTop = this.ins._General.getChildByName('Top');
                    this.ins._GDress = this.ins._General.getChildByName('Dress');
                    this.ins._RoleAni = this.ins._Role.getComponent(Laya.Animator);
                    this.ins._MainCamara = this.ins._Owner.getChildByName('Main Camera');
                    this.ins._MirrorCamera = this.ins._Owner.getChildByName('MirrorCamera');
                    this.ins._Mirror = this.ins._Owner.getChildByName('Mirror');
                    this.ins._Bg1 = this.ins._Owner.getChildByName('Bg1');
                    this.ins._Bg2 = this.ins._Owner.getChildByName('Bg2');
                    this.ins._BtnDress = this.ins._Owner.getChildByName('BtnDress');
                    this.ins._BtnTop = this.ins._Owner.getChildByName('BtnTop');
                    this.ins._BtnBottoms = this.ins._Owner.getChildByName('BtnBottoms');
                    this.ins._BtnDressingRoom = this.ins._Owner.getChildByName('BtnDressingRoom');
                    this.ins._DIYHanger = this.ins._Owner.getChildByName('DIYHanger');
                }
                return this.ins;
            }
            playDispalyAni() {
                this._RoleAni.play(this.aniName.Stand);
                this._RoleAni.play(this.aniName.DispalyCloth);
                Laya.timer.clearAll(this._Role);
                TimerAdmin._once(3200, this._Role, () => {
                    this._RoleAni.crossFade(this.aniName.Stand, 0.3);
                });
            }
            playPoss1Ani() {
                this._RoleAni.crossFade(this.aniName.Pose1, 0.3);
                Laya.timer.clearAll(this._Role);
                TimerAdmin._once(3200, this._Role, () => {
                    this._RoleAni.crossFade(this.aniName.Stand, 0.3);
                });
            }
            playPoss2Ani() {
                this._RoleAni.crossFade(this.aniName.Pose2, 0.3);
                Laya.timer.clearAll(this._Role);
                TimerAdmin._once(3200, this._Role, () => {
                    this._RoleAni.crossFade(this.aniName.Stand, 0.3);
                });
            }
            playStandAni() {
                Laya.timer.clearAll(this);
                Laya.timer.clearAll(this._Role);
                this._RoleAni.crossFade(this.aniName.Stand, 0.3);
            }
            playRandomPose() {
                TimerAdmin._frameLoop(450, this, () => {
                    Tools._Number.randomOneHalf() == 0 ? _3D._Scene._ins().playPoss1Ani() : _3D._Scene._ins().playPoss2Ani();
                }, true);
            }
            get btnDressPos() {
                return Tools._3D.posToScreen(this._BtnDress.transform.position, this._MainCamara);
            }
            get btnTopPos() {
                return Tools._3D.posToScreen(this._BtnTop.transform.position, this._MainCamara);
            }
            get btnBottomsPos() {
                return Tools._3D.posToScreen(this._BtnBottoms.transform.position, this._MainCamara);
            }
            get btnDressingRoomPos() {
                return Tools._3D.posToScreen(this._BtnDressingRoom.transform.position, this._MainCamara);
            }
            openStartAni(func) {
                func();
                this.playRandomPose();
                this._DIYHanger.active = false;
                this._Role.active = true;
                this._MirrorCamera.active = false;
            }
            intoStart() {
                _3D._Scene._ins().playStandAni();
                _3D._Scene._ins()._Owner.active = true;
                this._MirrorCamera.active = false;
                this._Bg1.meshRenderer.material.albedoTexture = _Res._list.texture2D.bgStart.texture2D;
            }
            intogeDressingRoom() {
                _3D._Scene._ins().playStandAni();
                this._MirrorCamera.active = true;
                this._Bg1.meshRenderer.material.albedoTexture = _Res._list.texture2D.bgDressingRoom.texture2D;
            }
            createMirror(_Sp) {
                this._MirrorCamera.renderTarget = new Laya.RenderTexture(_Sp.width, _Sp.height);
                this._MirrorCamera.renderingOrder = -1;
                this._MirrorCamera.clearFlag = Laya.CameraClearFlags.Sky;
                this.mirrortex && this.mirrortex.destroy();
                this.mirrortex = new Laya.Texture(this._MirrorCamera.renderTarget, Laya.Texture.DEF_UV);
                _Sp.graphics.drawTexture(this.mirrortex);
            }
            intoMakePattern() {
                _3D._Scene._ins()._Owner.active = true;
                _3D.DIYCloth._ins().remake();
                this._Bg1.meshRenderer.material.albedoTexture = _Res._list.texture2D.bgMakePattern.texture2D;
            }
            intoMakeTailor() {
                _3D._Scene._ins()._Owner.active = false;
            }
            photoBg() {
                this._Bg1.meshRenderer.material.albedoTexture = _Res._list.texture2D.bgPhoto.texture2D;
            }
            displayDress() {
                this._GBottoms.active = this._GTop.active = this._DBottoms.active = this._DTop.active = false;
            }
            displayTopAndBotton() {
                this._GDress.active = this._DDress.active = false;
            }
        }
        _3D._Scene = _Scene;
        class DIYCloth {
            constructor() {
            }
            static _ins() {
                if (!this.ins) {
                    this.ins = new DIYCloth();
                }
                return this.ins;
            }
            remake() {
                _Scene._ins()._DIYHanger.active = true;
                _Scene._ins()._Role.active = false;
                const Classify = _Scene._ins()._DIYHanger.getChildByName(_MakeTailor._DIYClothes._ins()._pitchClassify);
                Tools._Node.showExcludedChild3D(_3D._Scene._ins()._DIYHanger, [Classify.name]);
                this.Present = Classify.getChildByName(_MakeTailor._DIYClothes._ins()._pitchName);
                Tools._Node.showExcludedChild3D(Classify, [this.Present.name]);
                this.Present.transform.localRotationEulerY = 180;
                this.Front = this.Present.getChildByName(`${this.Present.name}_0`);
                this.Reverse = this.Present.getChildByName(`${this.Present.name}_1`);
                this.ModelTap = this.Present.getChildByName('ModelTap');
                let center = this.Front.meshRenderer.bounds.getCenter();
                let extent = this.Front.meshRenderer.bounds.getExtent();
                let p1 = new Laya.Vector3(center.x, center.y + extent.y, center.z);
                let p2 = new Laya.Vector3(center.x, center.y - extent.y, center.z);
                let point1 = Tools._3D.posToScreen(p1, _Scene._ins()._MainCamara);
                let point2 = Tools._3D.posToScreen(p2, _Scene._ins()._MainCamara);
                this.texHeight = point2.y - point1.y;
            }
            addTexture2D(arr) {
                const bMF = this.Front.meshRenderer.material;
                bMF.albedoTexture && bMF.albedoTexture.destroy();
                bMF.albedoTexture = arr[0];
                const bMR = this.Reverse.meshRenderer.material;
                bMR.albedoTexture && bMR.albedoTexture.destroy();
                bMR.albedoTexture = arr[1];
            }
            rotate(num) {
                if (num == 1) {
                    this.Present.transform.localRotationEulerY++;
                }
                else {
                    this.Present.transform.localRotationEulerY--;
                }
            }
        }
        _3D.DIYCloth = DIYCloth;
    })(_3D || (_3D = {}));

    var _DressingRoom;
    (function (_DressingRoom) {
        let _Event;
        (function (_Event) {
            _Event["changeCloth"] = "_DressingRoom_ChangeCloth";
        })(_Event = _DressingRoom._Event || (_DressingRoom._Event = {}));
        class _Clothes extends DataAdmin._Table {
            constructor() {
                super(...arguments);
                this._classify = {
                    DIY: 'DIY',
                    General: 'General',
                };
                this._part = {
                    Dress: 'Dress',
                    Top: 'Top',
                    Bottoms: 'Bottoms',
                    FaceMask: 'FaceMask',
                    Accessories: 'Accessories',
                    Shoes: 'Shoes',
                    Hair: 'Hair',
                };
                this._otherPro = {
                    putOn: 'putOn',
                    part: 'part'
                };
            }
            static _ins() {
                if (!this.ins) {
                    this.ins = new _Clothes('ClothesGeneral', _Res._list.json.GeneralClothes.dataArr, true);
                }
                return this.ins;
            }
            collectDIY() {
                let DIYArr = _MakeTailor._DIYClothes._ins()._getArrByNoProperty(_MakeTailor._DIYClothes._ins()._otherPro.icon, "");
                let copyDIYArr = Tools._ObjArray.arrCopy(DIYArr);
                Tools._ObjArray.modifyProValue(copyDIYArr, _Clothes._ins()._property.classify, 'DIY');
                this._addObjectArr(copyDIYArr);
                return copyDIYArr;
            }
            changeAfterMaking() {
                _DressingRoom._Clothes._ins().collectDIY();
                _DressingRoom._Clothes._ins().accurateChange(_MakeTailor._DIYClothes._ins()._getPitchProperty('part'), _MakeTailor._DIYClothes._ins()._pitchName);
            }
            changeClass(classify, partArr, playAni) {
                const _classify = _3D._Scene._ins()._Root.getChildByName(classify);
                for (let i = 0; i < _classify.numChildren; i++) {
                    const _classifySp = _classify.getChildAt(i);
                    _classifySp.active = false;
                    for (let j = 0; j < partArr.length; j++) {
                        const obj = partArr[j];
                        if (obj[this._otherPro.part] === _classifySp.name) {
                            _classifySp.active = true;
                            for (let k = 0; k < _classifySp.numChildren; k++) {
                                const cloth = _classifySp.getChildAt(k);
                                if (cloth.name === obj[this._property.name]) {
                                    cloth.active = true;
                                    if (classify !== 'DIY') {
                                        let mat = cloth.skinnedMeshRenderer.material;
                                        if (!mat) {
                                            cloth.skinnedMeshRenderer.material = new Laya.UnlitMaterial();
                                        }
                                        mat.albedoTexture = _Res._list.texture2D[`${cloth.name}`]['texture2D'];
                                    }
                                    else {
                                        const front = cloth.getChildByName(`${cloth.name}_0`);
                                        const matF = front.skinnedMeshRenderer.material;
                                        const fSp = new Laya.Sprite;
                                        fSp.loadImage(Laya.LocalStorage.getItem(`${cloth.name}/${_MakeTailor._DIYClothes._ins()._otherPro.texF}`), Laya.Handler.create(this, () => {
                                            matF.albedoTexture = fSp.texture.bitmap;
                                            fSp.removeSelf();
                                        }));
                                        const reverse = cloth.getChildByName(`${cloth.name}_1`);
                                        const matR = reverse.skinnedMeshRenderer.material;
                                        const rSp = new Laya.Sprite;
                                        rSp.loadImage(Laya.LocalStorage.getItem(`${cloth.name}/${_MakeTailor._DIYClothes._ins()._otherPro.texR}`), Laya.Handler.create(this, () => {
                                            matR.albedoTexture = rSp.texture.bitmap;
                                            rSp.removeSelf();
                                        }));
                                    }
                                }
                                else {
                                    cloth.active = false;
                                }
                            }
                        }
                    }
                }
                playAni && _3D._Scene._ins().playDispalyAni();
            }
            changeClothStart() {
                const arr = this._getArrByProperty(this._otherPro.putOn, true);
                this.changeClass(this._classify.DIY, arr);
                this.changeClass(this._classify.General, arr);
                this.startSpecialSet();
            }
            changeCloth() {
                const arr = this._getArrByProperty(this._otherPro.putOn, true);
                this.changeClass(this._classify.DIY, arr, true);
                this.changeClass(this._classify.General, arr, true);
            }
            startSpecialSet() {
                if (StorageAdmin._bool('DressState').value) {
                    _3D._Scene._ins()._GBottoms.active = _3D._Scene._ins()._GTop.active = _3D._Scene._ins()._DBottoms.active = _3D._Scene._ins()._DTop.active = false;
                }
                else {
                    _3D._Scene._ins()._GDress.active = _3D._Scene._ins()._DDress.active = false;
                }
            }
            specialSet(part) {
                if (part === this._part.Dress) {
                    StorageAdmin._bool('DressState').value = true;
                }
                else if (part === this._part.Top || part === this._part.Bottoms) {
                    StorageAdmin._bool('DressState').value = false;
                }
                if (StorageAdmin._bool('DressState').value) {
                    _3D._Scene._ins().displayDress();
                }
                else {
                    _3D._Scene._ins().displayTopAndBotton();
                }
            }
            accurateChange(partValue, name) {
                const arr = _Clothes._ins()._getArrByProperty('part', partValue);
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index];
                    if (name === element['name']) {
                        element['putOn'] = true;
                    }
                    else {
                        element['putOn'] = false;
                    }
                }
                _Clothes._ins()._refreshAndStorage();
                _Clothes._ins().changeCloth();
                _Clothes._ins().specialSet(partValue);
            }
        }
        _DressingRoom._Clothes = _Clothes;
        class _Item extends Admin._ObjectBase {
            lwgButton() {
                this._btnUp(this._Owner, (e) => {
                    _Clothes._ins().accurateChange(this._Owner['dataSource']['part'], this._Owner['dataSource']['name']);
                }, null);
            }
        }
        class DressingRoom extends Admin._SceneBase {
            lwgOnAwake() {
                TimerAdmin._frameLoop(1, this, () => {
                    _3D._Scene._ins().createMirror(this._ImgVar('MirrorSurface'));
                });
                const copyDIYArr = _Clothes._ins().collectDIY();
                _Clothes._ins()._List = this._ListVar('List');
                _Clothes._ins()._List.array = _Clothes._ins()._getArrByClassify(_Clothes._ins()._classify.DIY);
                if (copyDIYArr.length > 0) {
                    this.switchClassify(this._ImgVar('DIY'));
                }
                else {
                    this.switchClassify(this._ImgVar('Dress'));
                }
                _Clothes._ins()._listRender = (Cell, index) => {
                    let data = Cell.dataSource;
                    let Icon = Cell.getChildByName('Icon');
                    const Board = Cell.getChildByName('Board');
                    if (data[_Clothes._ins()._otherPro.putOn]) {
                        Board.skin = `Game/UI/Common/xuanzhong.png`;
                    }
                    else {
                        Board.skin = null;
                    }
                    if (data[_Clothes._ins()._property.classify] === _Clothes._ins()._classify.DIY) {
                        Icon.skin = data[_MakeTailor._DIYClothes._ins()._otherPro.icon];
                    }
                    else {
                        Icon.skin = `Game/UI/DressingRoom/Icon/${data[_Clothes._ins()._property.name]}.png`;
                    }
                    if (!Cell.getComponent(_Item)) {
                        Cell.addComponent(_Item);
                    }
                };
            }
            lwgOnStart() {
                this.UI = new _UI(this._Owner);
                TimerAdmin._frameOnce(10, this, () => {
                    this.UI.operationAppear(() => {
                        this.UI.btnCompleteAppear(null, 400);
                    });
                    this.UI.btnBackAppear(null, 200);
                });
                this.UI.btnCompleteClick = () => {
                    this.UI.operationVinish(() => {
                        this.UI.btnBackVinish(() => {
                            this._openScene('Start', true, true);
                        });
                    }, 200);
                };
            }
            switchClassify(_element) {
                let arr = [];
                for (let index = 0; index < this._ImgVar('Part').numChildren; index++) {
                    const element = this._ImgVar('Part').getChildAt(index);
                    const Icon = element.getChildAt(0);
                    if (_element === element) {
                        element.skin = `Game/UI/Common/kuang_fen.png`;
                        Icon.skin = `Game/UI/DressingRoom/PartIcon/${element.name}_s.png`;
                        if (_element.name === 'DIY') {
                            arr = _Clothes._ins()._getArrByClassify(_element.name);
                        }
                        else {
                            let _arr = _Clothes._ins()._getArrByClassify(_Clothes._ins()._classify.General);
                            for (let index = 0; index < _arr.length; index++) {
                                const obj = _arr[index];
                                if (obj[_Clothes._ins()._otherPro.part] === _element.name) {
                                    arr.push(obj);
                                }
                            }
                        }
                    }
                    else {
                        element.skin = `Game/UI/Common/kuang_bai.png`;
                        Icon.skin = `Game/UI/DressingRoom/PartIcon/${element.name}.png`;
                    }
                    _Clothes._ins()._List.array = arr;
                }
            }
            lwgButton() {
                for (let index = 0; index < this._ImgVar('Part').numChildren; index++) {
                    const _element = this._ImgVar('Part').getChildAt(index);
                    this._btnUp(_element, () => {
                        this.switchClassify(_element);
                    }, 'no');
                }
            }
            lwgCloseAni() {
                return 100;
            }
        }
        _DressingRoom.DressingRoom = DressingRoom;
    })(_DressingRoom || (_DressingRoom = {}));
    var _DressingRoom$1 = _DressingRoom.DressingRoom;

    var _Res;
    (function (_Res) {
        _Res._list = {
            scene3D: {
                MakeClothes: {
                    url: `_Lwg3D/_Scene/LayaScene_MakeClothes/Conventional/MakeClothes.ls`,
                    Scene: null,
                },
            },
            prefab3D: {
                Level1: {
                    url: `_Lwg3D/_Prefab/LayaScene_MakeClothes/Conventional/MakeClothes.ls`,
                    Prefab: null,
                }
            },
            pic2D: {
                Effects: "res/atlas/lwg/Effects.png",
                MakeClothes: `res/atlas/Game/UI/MakeClothes.png`,
            },
            prefab2D: {
                BtnAgain: {
                    url: 'Prefab/BtnaGain.json',
                    prefab: new Laya.Prefab,
                },
                BtnBack: {
                    url: 'Prefab/BtnBack3.json',
                    prefab: new Laya.Prefab,
                },
                BtnRollback: {
                    url: 'Prefab/BtnRollback.json',
                    prefab: new Laya.Prefab,
                },
                diy_bottom_002_final: {
                    url: 'Prefab/diy_bottom_002_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_bottom_003_final: {
                    url: 'Prefab/diy_bottom_003_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_bottom_004_final: {
                    url: 'Prefab/diy_bottom_004_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_bottom_005_final: {
                    url: 'Prefab/diy_bottom_005_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_bottom_006_final: {
                    url: 'Prefab/diy_bottom_006_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_dress_001_final: {
                    url: 'Prefab/diy_dress_001_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_dress_002_final: {
                    url: 'Prefab/diy_dress_002_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_dress_003_final: {
                    url: 'Prefab/diy_dress_003_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_dress_004_final: {
                    url: 'Prefab/diy_dress_004_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_dress_005_final: {
                    url: 'Prefab/diy_dress_005_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_dress_006_final: {
                    url: 'Prefab/diy_dress_006_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_dress_007_final: {
                    url: 'Prefab/diy_dress_007_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_dress_008_final: {
                    url: 'Prefab/diy_dress_008_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_top_003_final: {
                    url: 'Prefab/diy_top_003_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_top_004_final: {
                    url: 'Prefab/diy_top_004_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_top_005_final: {
                    url: 'Prefab/diy_top_005_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_top_006_final: {
                    url: 'Prefab/diy_top_006_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_top_007_final: {
                    url: 'Prefab/diy_top_007_final.json',
                    prefab: new Laya.Prefab,
                },
                diy_top_008_final: {
                    url: 'Prefab/diy_top_008_final.json',
                    prefab: new Laya.Prefab,
                },
            },
            texture: {},
            texture2D: {
                bgStart: {
                    url: `Game/Background/bgStart.jpg`,
                    texture2D: null,
                },
                bgDressingRoom: {
                    url: `Game/Background/bgDressingRoom.jpg`,
                    texture2D: null,
                },
                bgMakePattern: {
                    url: `Game/Background/bgMakePattern.jpg`,
                    texture2D: null,
                },
                bgPhoto: {
                    url: `Game/Background/bgPhoto.png`,
                    texture2D: null,
                },
                dress_001: {
                    url: `Game/UI/DressingRoom/ClothTex/dress_001.png`,
                    texture2D: null,
                },
                dress_002: {
                    url: `Game/UI/DressingRoom/ClothTex/dress_002.png`,
                    texture2D: null,
                },
                dress_003: {
                    url: `Game/UI/DressingRoom/ClothTex/dress_003.png`,
                    texture2D: null,
                },
                dress_004: {
                    url: `Game/UI/DressingRoom/ClothTex/dress_004.png`,
                    texture2D: null,
                },
                dress_005: {
                    url: `Game/UI/DressingRoom/ClothTex/dress_005.png`,
                    texture2D: null,
                },
                dress_006: {
                    url: `Game/UI/DressingRoom/ClothTex/dress_006.png`,
                    texture2D: null,
                },
                top_001: {
                    url: `Game/UI/DressingRoom/ClothTex/top_001.png`,
                    texture2D: null,
                },
                top_002: {
                    url: `Game/UI/DressingRoom/ClothTex/top_002.png`,
                    texture2D: null,
                },
                top_003: {
                    url: `Game/UI/DressingRoom/ClothTex/top_003.png`,
                    texture2D: null,
                },
                top_004: {
                    url: `Game/UI/DressingRoom/ClothTex/top_004.png`,
                    texture2D: null,
                },
                top_005: {
                    url: `Game/UI/DressingRoom/ClothTex/top_005.png`,
                    texture2D: null,
                },
                top_006: {
                    url: `Game/UI/DressingRoom/ClothTex/top_006.png`,
                    texture2D: null,
                },
                bottom_001: {
                    url: `Game/UI/DressingRoom/ClothTex/bottom_001.png`,
                    texture2D: null,
                },
                bottom_002: {
                    url: `Game/UI/DressingRoom/ClothTex/bottom_002.png`,
                    texture2D: null,
                },
                bottom_003: {
                    url: `Game/UI/DressingRoom/ClothTex/bottom_003.png`,
                    texture2D: null,
                },
                bottom_004: {
                    url: `Game/UI/DressingRoom/ClothTex/bottom_004.png`,
                    texture2D: null,
                },
                bottom_005: {
                    url: `Game/UI/DressingRoom/ClothTex/bottom_005.png`,
                    texture2D: null,
                },
                bottom_006: {
                    url: `Game/UI/DressingRoom/ClothTex/bottom_006.png`,
                    texture2D: null,
                },
                shoes_001: {
                    url: `Game/UI/DressingRoom/ClothTex/shoes_001.png`,
                    texture2D: null,
                },
                shoes_002: {
                    url: `Game/UI/DressingRoom/ClothTex/shoes_002.png`,
                    texture2D: null,
                },
                shoes_003: {
                    url: `Game/UI/DressingRoom/ClothTex/shoes_003.png`,
                    texture2D: null,
                },
                shoes_004: {
                    url: `Game/UI/DressingRoom/ClothTex/shoes_004.png`,
                    texture2D: null,
                },
                shoes_005: {
                    url: `Game/UI/DressingRoom/ClothTex/shoes_005.png`,
                    texture2D: null,
                },
                shoes_006: {
                    url: `Game/UI/DressingRoom/ClothTex/shoes_006.png`,
                    texture2D: null,
                },
                shoes_007: {
                    url: `Game/UI/DressingRoom/ClothTex/shoes_007.png`,
                    texture2D: null,
                },
                hair_000: {
                    url: `Game/UI/DressingRoom/ClothTex/hair_000.png`,
                    texture2D: null,
                },
                hair_001: {
                    url: `Game/UI/DressingRoom/ClothTex/hair_001.png`,
                    texture2D: null,
                },
                hair_002: {
                    url: `Game/UI/DressingRoom/ClothTex/hair_002.png`,
                    texture2D: null,
                },
                hair_003: {
                    url: `Game/UI/DressingRoom/ClothTex/hair_003.png`,
                    texture2D: null,
                },
                hair_004: {
                    url: `Game/UI/DressingRoom/ClothTex/hair_004.png`,
                    texture2D: null,
                },
                hair_005: {
                    url: `Game/UI/DressingRoom/ClothTex/hair_005.png`,
                    texture2D: null,
                },
                hair_006: {
                    url: `Game/UI/DressingRoom/ClothTex/hair_006.png`,
                    texture2D: null,
                },
                hair_007: {
                    url: `Game/UI/DressingRoom/ClothTex/hair_007.png`,
                    texture2D: null,
                },
                hair_008: {
                    url: `Game/UI/DressingRoom/ClothTex/hair_008.png`,
                    texture2D: null,
                },
            },
            scene2D: {
                Start: `Scene/${_SceneName.Start}.json`,
                Guide: `Scene/${_SceneName.Guide}.json`,
                PreLoadStep: `Scene/${_SceneName.PreLoadCutIn}.json`,
                MakePattern: `Scene/${'MakePattern'}.json`,
            },
            json: {
                GeneralClothes: {
                    url: `_LwgData/_DressingRoom/GeneralClothes.json`,
                    dataArr: new Array,
                },
                DIYClothes: {
                    url: `_LwgData/_DressingRoom/DIYClothes.json`,
                    dataArr: new Array,
                },
                MakePattern: {
                    url: `_LwgData/_MakePattern/MakePattern.json`,
                    dataArr: new Array,
                },
                Ranking: {
                    url: `_LwgData/_Ranking/Ranking.json`,
                    dataArr: new Array,
                }
            },
        };
    })(_Res || (_Res = {}));
    var _PreLoad;
    (function (_PreLoad) {
        class PreLoad extends _LwgPreLoad._PreLoadScene {
            constructor() {
                super(...arguments);
                this.count = 0;
            }
            lwgOnStart() {
                const scale = 1.2;
                const time = 100;
                const delay = 100;
                this._ImgVar('LoGo').scale(0, 0);
                this._ImgVar('Progress').scale(0, 0);
                this._ImgVar('Anti').alpha = 0;
                TimerAdmin._once(delay * 4, this, () => {
                    this.effect();
                });
                TimerAdmin._once(delay * 4, this, () => {
                    Color._changeOnce(this._ImgVar('BG'), [100, 50, 0, 1], time / 3);
                });
                TimerAdmin._frameLoop(time / 2 * 2, this, () => {
                    TimerAdmin._once(delay * 6, this, () => {
                        Color._changeOnce(this._ImgVar('LoGo'), [5, 40, 10, 1], time / 2);
                    });
                });
                Animation2D.bombs_Appear(this._ImgVar('LoGo'), 0, 1, scale, 0, time * 5, () => {
                    TimerAdmin._frameRandomLoop(30, 50, this, () => {
                        Effects._Glitter._blinkStar(this._Owner, new Laya.Point(this._ImgVar('LoGo').x - 350, this._ImgVar('LoGo').y), [150, 100], [Effects._SkinUrl.星星1], null, [80, 80]);
                    }, true);
                    TimerAdmin._frameRandomLoop(30, 50, this, () => {
                        Effects._Glitter._blinkStar(this._Owner, new Laya.Point(this._ImgVar('LoGo').x + 350, this._ImgVar('LoGo').y), [150, 100], [Effects._SkinUrl.星星1], null, [80, 80]);
                    }, true);
                    Animation2D.bombs_Appear(this._ImgVar('Progress'), 0, 1, scale, 0, time * 1.5, () => {
                        TimerAdmin._frameNumLoop(2, 50, this, () => {
                            this.count++;
                            this.progressDisplay();
                        }, () => {
                            this._evNotify(_LwgPreLoad._Event.importList, [_Res._list]);
                        }, true);
                        Animation2D.fadeOut(this._ImgVar('Anti'), 0, 1, time * 2);
                    }, delay * 4);
                    TimerAdmin._once(delay * 4, this, () => {
                        AudioAdmin._playSound(AudioAdmin._voiceUrl.btn);
                    });
                }, delay * 4);
            }
            effect() {
                const count = 90;
                const time = 35;
                const dis = Tools._Number.randomOneInt(500, 500);
                const p = new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2);
                for (let index = 0; index < count; index++) {
                    Effects._Particle._sprayRound(this._Owner, p, null, [20, 40], null, [Effects._SkinUrl.花4], null, [dis, dis], [time, time], null, null, 5);
                }
                for (let index = 0; index < count * 2; index++) {
                    Effects._Particle._sprayRound(this._Owner, p, null, [20, 40], null, [Effects._SkinUrl.花4], null, [100, dis - 20], [time, time], null, null, 5);
                }
            }
            progressDisplay() {
                this._ImgVar('ProgressBar').mask.x = -this._ImgVar('ProgressBar').width + this._ImgVar('ProgressBar').width / 100 * this.count;
            }
            lwgOpenAni() { return 1; }
            lwgStepComplete() {
                this._ImgVar('ProgressBar').mask.x += 1;
            }
            lwgAllComplete() {
                this._ImgVar('ProgressBar').mask.x = 0;
                _DressingRoom._Clothes._ins().changeClothStart();
                _3D._Scene._ins().intoStart();
                Laya.BaseTexture.prototype.anisoLevel = 1000;
                return 1000;
            }
            lwgOnDisable() {
            }
        }
        _PreLoad.PreLoad = PreLoad;
    })(_PreLoad || (_PreLoad = {}));
    var _PreLoad$1 = _PreLoad.PreLoad;

    var _PersonalInfo;
    (function (_PersonalInfo) {
        _PersonalInfo._name = {
            get value() {
                return StorageAdmin._str('playerName', null, 'You').value;
            },
            set value(str) {
                StorageAdmin._str('playerName').value = str;
            }
        };
        class PersonalInfo extends Admin._SceneBase {
            lwgOnAwake() {
                this._TextInputVar('NameValue').text = _PersonalInfo._name.value;
                const obj = _Ranking._Data._ins()._getPitchObj();
                this._LabelVar('RankValue').text = obj[_Ranking._Data._ins()._otherPro.rankNum];
                this._LabelVar('FansValue').text = obj[_Ranking._Data._ins()._otherPro.fansNum];
            }
            lwgOpenAni() {
                this._ImgVar('Background').alpha = 0;
                this._ImgVar('Content').alpha = 0;
                Animation2D.fadeOut(this._ImgVar('Background'), 0, 1, 350, 0, () => {
                    TimerAdmin._frameLoop(240, this, () => {
                        this._AniVar('ani1').play(0, false);
                        this._AniVar('ani1').on(Laya.Event.LABEL, this, (e) => {
                            if (e === 'comp') {
                                Color._changeOnce(this._ImgVar('Head'), [50, 10, 10, 1], 40);
                            }
                        });
                    }, true);
                });
                Animation2D.fadeOut(this._ImgVar('Content'), 0, 1, 200);
                return 200;
            }
            lwgButton() {
                this._btnUp(this._ImgVar('BtnClose'), () => {
                    this._closeScene();
                });
                this._btnFour(this._ImgVar('NameValue'), () => {
                    this._ImgVar('BtnWrite').scale(0.85, 0.85);
                }, () => {
                    this._ImgVar('BtnWrite').scale(0.85, 0.85);
                }, () => {
                    this._ImgVar('BtnWrite').scale(1, 1);
                }, () => {
                    this._ImgVar('BtnWrite').scale(1, 1);
                });
                this._TextInputVar('NameValue').on(Laya.Event.FOCUS, this, () => {
                });
                this._TextInputVar('NameValue').on(Laya.Event.INPUT, this, () => {
                });
                this._TextInputVar('NameValue').on(Laya.Event.BLUR, this, () => {
                    if (this._TextInputVar('NameValue').text.length <= 5) {
                        this._TextInputVar('NameValue').fontSize = 30;
                    }
                    else if (this._TextInputVar('NameValue').text.length === 6) {
                        this._TextInputVar('NameValue').fontSize = 27;
                    }
                    else {
                        this._TextInputVar('NameValue').fontSize = 24;
                    }
                    _PersonalInfo._name.value = this._TextInputVar('NameValue').text;
                });
            }
            lwgCloseAni() {
                Animation2D.fadeOut(this._ImgVar('Background'), 1, 0, 200);
                Animation2D.fadeOut(this._ImgVar('Content'), 1, 0, 300);
                return 300;
            }
        }
        _PersonalInfo.PersonalInfo = PersonalInfo;
    })(_PersonalInfo || (_PersonalInfo = {}));

    var _Start;
    (function (_Start) {
        let _Event;
        (function (_Event) {
            _Event["updateRanking"] = "_Start_updateRanking";
        })(_Event = _Start._Event || (_Start._Event = {}));
        function _init() {
        }
        _Start._init = _init;
        class Start extends Admin._SceneBase {
            lwgOnAwake() {
                Tools._Node.childrenVisible2D(this._ImgVar('BtnParent'), false);
                _3D._Scene._ins().openStartAni(() => {
                    this._ImgVar('BtnTop').pos(_3D._Scene._ins().btnTopPos.x, _3D._Scene._ins().btnTopPos.y);
                    this._ImgVar('BtnDress').pos(_3D._Scene._ins().btnDressPos.x, _3D._Scene._ins().btnDressPos.y);
                    this._ImgVar('BtnBottoms').pos(_3D._Scene._ins().btnBottomsPos.x, _3D._Scene._ins().btnBottomsPos.y);
                    this._ImgVar('BtnDressingRoom').pos(_3D._Scene._ins().btnDressingRoomPos.x, _3D._Scene._ins().btnDressingRoomPos.y);
                    for (let index = 0; index < this._ImgVar('BtnParent').numChildren; index++) {
                        const element = this._ImgVar('BtnParent').getChildAt(index);
                        element.visible = true;
                        const delay = 200 * index;
                        Animation2D.bombs_Appear(element, 0, 1, 1.2, 0, 200, null, delay);
                        const UI = new _UI(null);
                        UI.effect(this._Owner, new Laya.Point(element.x, element.y), delay);
                    }
                });
                if (_Ranking._whereFrom === 'MakePattern') {
                    TimerAdmin._frameOnce(60, this, () => {
                        this._openScene('Ranking', false);
                    });
                }
            }
            lwgOnStart() {
                this._evNotify(_Event.updateRanking);
            }
            lwgEvent() {
                this._evReg(_Event.updateRanking, () => {
                    let obj = _Ranking._Data._ins()._getPitchObj();
                    this._LabelVar('RankNum').text = `${obj[_Ranking._Data._ins()._otherPro.rankNum]}/50`;
                });
            }
            lwgButton() {
                const Clothes = _MakeTailor._DIYClothes._ins();
                this._btnUp(this._ImgVar('BtnTop'), () => {
                    Clothes._pitchClassify = Clothes._classify.Top;
                    this._openScene('MakeTailor', true, true);
                });
                this._btnUp(this._ImgVar('BtnDress'), () => {
                    Clothes._pitchClassify = Clothes._classify.Dress;
                    this._openScene('MakeTailor', true, true);
                });
                this._btnUp(this._ImgVar('BtnBottoms'), () => {
                    Clothes._pitchClassify = Clothes._classify.Bottoms;
                    this._openScene('MakeTailor', true, true);
                });
                this._btnUp(this._ImgVar('BtnPersonalInfo'), () => {
                    this._openScene('PersonalInfo', false);
                });
                this._btnUp(this._ImgVar('BtnRanking'), () => {
                    _Ranking._whereFrom = 'Start';
                    this._openScene('Ranking', false);
                });
                this._btnUp(this._ImgVar('BtnDressingRoom'), () => {
                    Clothes._pitchClassify = Clothes._classify.Bottoms;
                    this._openScene('DressingRoom', true, true);
                });
            }
        }
        _Start.Start = Start;
    })(_Start || (_Start = {}));
    var _Start$1 = _Start.Start;

    var _Ranking;
    (function (_Ranking) {
        class _Data extends DataAdmin._Table {
            constructor() {
                super(...arguments);
                this._otherPro = {
                    rankNum: 'rankNum',
                    fansNum: 'fansNum',
                    iconSkin: 'iconSkin',
                };
                this._classify = {
                    other: 'other',
                    self: 'self',
                };
            }
            static _ins() {
                if (!this.ins) {
                    this.ins = new _Data('RankingData', _Res._list.json.Ranking.dataArr, true);
                    if (!this.ins._arr[0]['iconSkin']) {
                        for (let index = 0; index < this.ins._arr.length; index++) {
                            const element = this.ins._arr[index];
                            element['iconSkin'] = `Game/UI/Ranking/IconSkin/avatar_${element[this.ins._property.index]}.png`;
                        }
                    }
                    this.ins._pitchName = '玩家';
                }
                return this.ins;
            }
        }
        _Ranking._Data = _Data;
        _Ranking._whereFrom = 'Start';
        class Ranking extends Admin._SceneBase {
            lwgOnAwake() {
                _Data._ins()._List = this._ListVar('List');
                if (_Ranking._whereFrom === 'MakePattern') {
                    _Data._ins()._addAllProPerty(_Data._ins()._otherPro.fansNum, () => {
                        return Tools._Number.randomOneInt(100, 150);
                    });
                    const obj = _Data._ins()._getPitchObj();
                    obj[_Data._ins()._otherPro.fansNum] += Tools._Number.randomOneInt(115, 383);
                }
                _Data._ins()._sortByProperty(_Data._ins()._otherPro.fansNum, _Data._ins()._otherPro.rankNum);
                this._evNotify(_Start._Event.updateRanking);
                _Data._ins()._listRender = (Cell, index) => {
                    const data = Cell.dataSource;
                    const Board = Cell.getChildByName('Board');
                    const Name = Cell.getChildByName('Name');
                    if (data[_Data._ins()._property.classify] === _Data._ins()._classify.self) {
                        Board.skin = `Game/UI/Ranking/x_di.png`;
                        Name.text = _PersonalInfo._name.value;
                    }
                    else {
                        Board.skin = `Game/UI/Ranking/w_di.png`;
                        Name.text = data[_Data._ins()._property.name];
                    }
                    const RankNum = Cell.getChildByName('RankNum');
                    RankNum.text = String(data[_Data._ins()._otherPro.rankNum]);
                    const FansNum = Cell.getChildByName('FansNum');
                    FansNum.text = String(data[_Data._ins()._otherPro.fansNum]);
                    const IconPic = Cell.getChildByName('Icon').getChildAt(0);
                    IconPic.skin = data[_Data._ins()._otherPro.iconSkin];
                };
            }
            lwgOpenAni() {
                if (_Ranking._whereFrom === 'MakePattern') {
                    AudioAdmin._playVictorySound();
                    this._ImgVar('Background').alpha = 0;
                    this._ImgVar('Content').scale(0.5, 0.5);
                    Animation2D.bombs_Appear(this._ImgVar('Content'), 0, 1, 1.2, 0, 350, null, 0);
                    Animation2D.fadeOut(this._ImgVar('Background'), 0, 1, 350);
                }
                else {
                    this._ImgVar('Background').alpha = 0;
                    this._ImgVar('Content').alpha = 0;
                    Animation2D.fadeOut(this._ImgVar('Background'), 0, 1, 350);
                    Animation2D.fadeOut(this._ImgVar('Content'), 0, 1, 200);
                }
                return 100;
            }
            lwgOnStart() {
                _Data._ins()._listScrollToLast();
                if (_Ranking._whereFrom === 'MakePattern') {
                    _Data._ins()._listTweenToPitchChoose(-1, 1500);
                    const centerP1 = new Laya.Point(Laya.stage.width / 2, 0);
                    const num1 = 150;
                    TimerAdmin._frameNumRandomLoop(1, 3, num1, this, () => {
                        Effects._Particle._fallingRotate(Laya.stage, centerP1, [Laya.stage.width, 0], [10, 30], [10, 30], [Effects._SkinUrl.矩形1, Effects._SkinUrl.矩形2, Effects._SkinUrl.矩形3], null, [300, Laya.stage.height], [1, 8]);
                    });
                    const num2 = 16;
                    const centerP2 = new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2 - 50);
                    TimerAdmin._frameNumRandomLoop(10, 25, num2, this, () => {
                        const count = Tools._Number.randomOneInt(10, 20);
                        const time = 30;
                        const dis = Tools._Number.randomOneInt(100, 300);
                        const radomP = Tools._Point.randomPointByCenter(centerP2, 500, 150)[0];
                        for (let index = 0; index < count * 2; index++) {
                            Effects._Particle._sprayRound(Laya.stage, radomP, null, [20, 40], null, [Effects._SkinUrl.花4], null, [dis, dis], [time, time]);
                        }
                        for (let index = 0; index < count * 2; index++) {
                            Effects._Particle._sprayRound(Laya.stage, radomP, null, [20, 40], null, [Effects._SkinUrl.花4], null, [50, dis - 20], [time, time]);
                        }
                    });
                    _Ranking._whereFrom = 'Start';
                }
                else {
                    if (_Data._ins()._getProperty(_Data._ins()._pitchName, _Data._ins()._otherPro.rankNum) == 1) {
                        _Data._ins()._listTweenToPitch(600);
                    }
                    else {
                        _Data._ins()._listTweenToPitchChoose(-1, 600);
                    }
                }
            }
            lwgButton() {
                this._btnUp(this._ImgVar('BtnClose'), () => {
                    this._closeScene();
                });
            }
            lwgCloseAni() {
                Animation2D.fadeOut(this._ImgVar('Background'), 1, 0, 200);
                Animation2D.fadeOut(this._ImgVar('Content'), 1, 0, 300);
                return 200;
            }
        }
        _Ranking.Ranking = Ranking;
    })(_Ranking || (_Ranking = {}));
    var _Ranking$1 = _Ranking.Ranking;

    var _MakePattern;
    (function (_MakePattern) {
        let _Event;
        (function (_Event) {
            _Event["moveUltimately"] = "_MakePattern_moveUltimately";
            _Event["resetTex"] = "_MakePattern_resetTex";
            _Event["changeDir"] = "_MakePattern_resetTex";
            _Event["remake"] = "_MakePattern_remake";
            _Event["close"] = "_MakePattern_close";
            _Event["createImg"] = "_MakePattern_createImg";
            _Event["setTexSize"] = "_MakePattern_texSize";
        })(_Event = _MakePattern._Event || (_MakePattern._Event = {}));
        class _Pattern extends DataAdmin._Table {
            constructor() {
                super(...arguments);
                this._classify = {
                    general: 'general',
                };
            }
            static _ins() {
                if (!this.ins) {
                    this.ins = new _Pattern('_Chartlet', _Res._list.json.MakePattern.dataArr);
                    this.ins._pitchClassify = this.ins._classify.general;
                    this.ins._arr.push({}, {});
                }
                return this.ins;
            }
        }
        class _Item extends Admin._ObjectBase {
            constructor() {
                super(...arguments);
                this.diffX = 0;
                this.create = false;
            }
            lwgButton() {
                const Icon = this._Owner.getChildByName('Icon');
                this._btnFour(Icon, (e) => {
                    this.create = false;
                    this.diffX = 0;
                    this.fX = e.stageX;
                    this._evNotify(_Event.close);
                }, (e) => {
                    if (!this.create) {
                        this.diffX = this.fX - e.stageX;
                        if (this.diffX >= 5) {
                            Icon && this._evNotify(_Event.createImg, [this._Owner['_dataSource']['name'], this._gPoint]);
                            this.create = true;
                        }
                    }
                }, () => {
                    this.create = true;
                }, () => {
                    this.create = true;
                });
            }
        }
        _MakePattern._Item = _Item;
        class MakePattern extends Admin._SceneBase {
            constructor() {
                super(...arguments);
                this.Tex = {
                    Img: null,
                    DisImg: null,
                    imgWH: [128, 128],
                    touchP: null,
                    diffP: null,
                    dir: 'Front',
                    dirType: {
                        Front: 'Front',
                        Reverse: 'Reverse',
                    },
                    state: 'none',
                    stateType: {
                        none: 'none',
                        move: 'move',
                        scale: 'scale',
                        rotate: 'rotate',
                        addTex: 'addTex',
                    },
                    createImg: (name, gPoint) => {
                        this.Tex.DisImg && this.Tex.DisImg.destroy();
                        this.Tex.DisImg = new Laya.Image;
                        this.Tex.Img = new Laya.Image;
                        let lPoint = this._SpriteVar('Ultimately').globalToLocal(gPoint);
                        this.Tex.Img.skin = this.Tex.DisImg.skin = `Game/UI/MakePattern/Pattern/general/${name}.png`;
                        this.Tex.Img.x = this.Tex.DisImg.x = lPoint.x;
                        this.Tex.Img.y = this.Tex.DisImg.y = lPoint.y;
                        this.Tex.Img.width = this.Tex.DisImg.width = this.Tex.imgWH[0];
                        this.Tex.Img.height = this.Tex.DisImg.height = this.Tex.imgWH[1];
                        this.Tex.Img.pivotX = this.Tex.Img.pivotY = this.Tex.DisImg.pivotX = this.Tex.DisImg.pivotY = 64;
                        this._SpriteVar('Dispaly').addChild(this.Tex.DisImg);
                        this._SpriteVar('Dispaly').visible = true;
                        this.Tex.restore();
                    },
                    getTex: () => {
                        let ImgF = this._ImgVar(this.Tex.dirType.Front);
                        let ImgR = this._ImgVar(this.Tex.dirType.Reverse);
                        let arr = [
                            ImgF.drawToTexture(ImgF.width, ImgF.height, ImgF.x, ImgF.y + ImgF.height),
                            ImgR.drawToTexture(ImgR.width, ImgR.height, ImgR.x, ImgR.y + ImgR.height)
                        ];
                        return arr;
                    },
                    setImgPos: () => {
                        let posArr = this.Tex.setPosArr();
                        let indexArr = [];
                        let outArr = [];
                        for (let index = 0; index < posArr.length; index++) {
                            let gPoint = this._SpriteVar('Wireframe').localToGlobal(new Laya.Point(posArr[index].x, posArr[index].y));
                            const out = Tools._3D.rayScanning(_3D._Scene._ins()._MainCamara, _3D._Scene._ins()._Owner, new Laya.Vector2(gPoint.x, gPoint.y), 'model');
                            if (out) {
                                outArr.push(out);
                                indexArr.push(posArr[index]);
                                let Img = this._Owner.getChildByName(`Img${index}`);
                                if (!Img) {
                                    let Img = new Laya.Image;
                                    Img.skin = `Lwg/UI/ui_circle_004.png`;
                                    this._Owner.addChild(Img);
                                    Img.name = `Img${index}`;
                                    Img.width = 20;
                                    Img.height = 20;
                                    Img.pivotX = Img.width / 2;
                                    Img.pivotY = Img.height / 2;
                                }
                                else {
                                    Img.pos(gPoint.x, gPoint.y);
                                }
                            }
                        }
                        if (indexArr.length !== 0) {
                            const out = outArr[outArr.length - 1];
                            this._SpriteVar(this.Tex.dir).addChild(this.Tex.Img);
                            Tools._Node.changePivot(this.Tex.Img, indexArr[indexArr.length - 1].x, indexArr[indexArr.length - 1].y);
                            let _width = this._ImgVar(this.Tex.dir).width;
                            let _height = this._ImgVar(this.Tex.dir).height;
                            let angleXZ = Tools._Point.pointByAngle(_3D.DIYCloth._ins().ModelTap.transform.position.x - out.point.x, _3D.DIYCloth._ins().ModelTap.transform.position.z - out.point.z);
                            if (this.Tex.dir == this.Tex.dirType.Front) {
                                this.Tex.Img.x = _width - _width / 180 * (angleXZ + 90);
                            }
                            else {
                                this.Tex.Img.x = -_width / 180 * (angleXZ - 90);
                            }
                            this.Tex.Img.x += _MakeTailor._DIYClothes._ins()._getPitchProperty('diffX');
                            let pH = out.point.y - _3D.DIYCloth._ins().ModelTap.transform.position.y;
                            let _DirHeight = Tools._3D.getMeshSize(this.Tex.dir == this.Tex.dirType.Front ? _3D.DIYCloth._ins().Front : _3D.DIYCloth._ins().Reverse).y;
                            let ratio = 1 - pH / _DirHeight;
                            this.Tex.Img.y = ratio * _height + 50;
                            return true;
                        }
                        else {
                            return false;
                        }
                    },
                    setPosArr: () => {
                        let x = this._ImgVar('Frame').x;
                        let y = this._ImgVar('Frame').y;
                        let _width = this._ImgVar('Frame').width;
                        let _height = this._ImgVar('Frame').height;
                        return [
                            new Laya.Point(_width / 2, _height / 2),
                        ];
                    },
                    crashType: {
                        setImgPos: 'setImgPos',
                        enter: 'enter',
                        inside: 'inside',
                    },
                    checkInside: () => {
                        let posArr = this.Tex.setPosArr();
                        let bool = false;
                        for (let index = 0; index < posArr.length; index++) {
                            let gPoint = this._SpriteVar('Wireframe').localToGlobal(new Laya.Point(posArr[index].x, posArr[index].y));
                            const _out = Tools._3D.rayScanning(_3D._Scene._ins()._MainCamara, _3D._Scene._ins()._Owner, new Laya.Vector2(gPoint.x, gPoint.y), 'model');
                            if (_out) {
                                bool = true;
                            }
                        }
                        return bool;
                    },
                    getDisGP: () => {
                        return this.Tex.DisImg ? this._SpriteVar('Dispaly').localToGlobal(new Laya.Point(this.Tex.DisImg.x, this.Tex.DisImg.y)) : null;
                    },
                    disMove: () => {
                        this.Tex.DisImg.x += this.Tex.diffP.x;
                        this.Tex.DisImg.y += this.Tex.diffP.y;
                        let gPoint = this.Tex.getDisGP();
                        this._ImgVar('Wireframe').pos(gPoint.x, gPoint.y);
                    },
                    move: (e) => {
                        this.Tex.disMove();
                        this._ImgVar('Wireframe').visible = false;
                        if (this.Tex.checkInside()) {
                            this.Tex.setImgPos();
                            this._ImgVar('Wireframe').visible = true;
                            this.Tex.state = this.Tex.stateType.addTex;
                            this._SpriteVar('Dispaly').visible = false;
                        }
                    },
                    addTex: (e) => {
                        this.Tex.disMove();
                        let out = this.Tex.setImgPos();
                        if (!out) {
                            this._ImgVar('Wireframe').visible = false;
                            this.Tex.state = this.Tex.stateType.move;
                            this.Tex.Img.x = Laya.stage.width;
                            this._SpriteVar('Dispaly').visible = true;
                        }
                        _3D.DIYCloth._ins().addTexture2D(this.Tex.getTex());
                    },
                    scale: (e) => {
                        let lPoint = this._ImgVar('Wireframe').globalToLocal(new Laya.Point(e.stageX, e.stageY));
                        this._ImgVar('Frame').width = this._ImgVar('WConversion').x = lPoint.x;
                        this._ImgVar('Frame').height = this._ImgVar('WConversion').y = lPoint.y;
                        let gPoint = this._Owner.localToGlobal(new Laya.Point(this._ImgVar('Wireframe').x, this._ImgVar('Wireframe').y));
                        this.Tex.Img.rotation = this.Tex.DisImg.rotation = this._ImgVar('Wireframe').rotation = Tools._Point.pointByAngle(e.stageX - gPoint.x, e.stageY - gPoint.y) + 45;
                        let scaleWidth = this._ImgVar('Frame').width - this._ImgVar('Wireframe').width;
                        let scaleheight = this._ImgVar('Frame').height - this._ImgVar('Wireframe').height;
                        this.Tex.DisImg.width = this.Tex.Img.width = this.Tex.imgWH[0] + scaleWidth;
                        this.Tex.DisImg.height = this.Tex.Img.height = this.Tex.imgWH[1] + scaleheight;
                        Tools._Node.changePivot(this._ImgVar('Wireframe'), this._ImgVar('Frame').width / 2, this._ImgVar('Frame').height / 2);
                        Tools._Node.changePivotCenter(this.Tex.Img);
                        Tools._Node.changePivotCenter(this.Tex.DisImg);
                        this.Tex.setImgPos();
                        _3D.DIYCloth._ins().addTexture2D(this.Tex.getTex());
                    },
                    rotate: (e) => {
                        if (this.Tex.diffP.x > 0) {
                            _3D.DIYCloth._ins().rotate(1);
                        }
                        else {
                            _3D.DIYCloth._ins().rotate(0);
                        }
                    },
                    again: () => {
                        Tools._Node.removeAllChildren(this._SpriteVar('Front'));
                        Tools._Node.removeAllChildren(this._SpriteVar('Reverse'));
                        this._ImgVar('Wireframe').visible = false;
                        this.Tex.turnFace();
                        _3D.DIYCloth._ins().addTexture2D(this.Tex.getTex());
                    },
                    none: () => {
                        return;
                    },
                    operation: (e) => {
                        if (this.Tex.touchP) {
                            this.Tex.diffP = new Laya.Point(e.stageX - this.Tex.touchP.x, e.stageY - this.Tex.touchP.y);
                            this.Tex[this.Tex.state](e);
                            this.Tex.touchP = new Laya.Point(e.stageX, e.stageY);
                        }
                    },
                    restore: () => {
                        this._ImgVar('Wireframe').rotation = 0;
                        this._ImgVar('Wireframe').pivotX = this._ImgVar('Wireframe').width / 2;
                        this._ImgVar('Wireframe').pivotY = this._ImgVar('Wireframe').height / 2;
                        this._ImgVar('WConversion').x = this._ImgVar('Frame').width = this._ImgVar('Wireframe').width;
                        this._ImgVar('WConversion').y = this._ImgVar('Frame').height = this._ImgVar('Wireframe').height;
                        this._ImgVar('Wireframe').visible = false;
                    },
                    close: () => {
                        this.Tex.restore();
                        this.Tex.DisImg && this.Tex.DisImg.destroy();
                        this.Tex.Img && this.Tex.Img.destroy();
                        this.Tex.state = this.Tex.stateType.none;
                        this.Tex.touchP = null;
                        _3D.DIYCloth._ins().addTexture2D(this.Tex.getTex());
                    },
                    turnFace: () => {
                        const time = 500;
                        if (this.Tex.dir == this.Tex.dirType.Front) {
                            Animation3D.rotateTo(_3D.DIYCloth._ins().Present, new Laya.Vector3(0, 180, 0), time, this);
                        }
                        else {
                            Animation3D.rotateTo(_3D.DIYCloth._ins().Present, new Laya.Vector3(0, 0, 0), time, this);
                        }
                    },
                    btn: () => {
                        this._btnUp(this._ImgVar('BtnTurnFace'), (e) => {
                            if (this.Tex.dir == this.Tex.dirType.Front) {
                                this.Tex.dir = this.Tex.dirType.Reverse;
                                this._ImgVar('BtnTurnFace').skin = 'Game/UI/MakePattern/fan.png';
                            }
                            else {
                                this.Tex.dir = this.Tex.dirType.Front;
                                this._ImgVar('BtnTurnFace').skin = 'Game/UI/MakePattern/zheng.png';
                            }
                            this.Tex.turnFace();
                            this._ImgVar('Wireframe').visible = false;
                            this.Tex.state = this.Tex.stateType.rotate;
                            e.stopPropagation();
                        });
                        this._btnFour(this._ImgVar('WConversion'), (e) => {
                            e.stopPropagation();
                            this.Tex.state = this.Tex.stateType.scale;
                        }, null, (e) => {
                            e.stopPropagation();
                            this.Tex.state = this.Tex.stateType.addTex;
                        });
                        this._btnUp(this._ImgVar('WClose'), (e) => {
                            e.stopPropagation();
                            this.Tex.close();
                        });
                        this._btnFour(this._ImgVar('BtnL'), (e) => {
                            this._ImgVar('Wireframe').visible = false;
                            this.Tex.state = this.Tex.stateType.rotate;
                            TimerAdmin._frameLoop(1, this._ImgVar('BtnL'), () => {
                                _3D.DIYCloth._ins().rotate(0);
                            });
                        }, null, () => {
                            Laya.timer.clearAll(this._ImgVar('BtnL'));
                        }, () => {
                            Laya.timer.clearAll(this._ImgVar('BtnL'));
                        });
                        this._btnFour(this._ImgVar('BtnR'), (e) => {
                            this._ImgVar('Wireframe').visible = false;
                            this.Tex.state = this.Tex.stateType.rotate;
                            TimerAdmin._frameLoop(1, this._ImgVar('BtnR'), () => {
                                _3D.DIYCloth._ins().rotate(1);
                            });
                        }, null, () => {
                            Laya.timer.clearAll(this._ImgVar('BtnR'));
                        }, () => {
                            Laya.timer.clearAll(this._ImgVar('BtnR'));
                        });
                    }
                };
            }
            lwgOnAwake() {
                _Pattern._ins()._List = this._ListVar('List');
                _Pattern._ins()._List.scrollBar.touchScrollEnable = false;
                _Pattern._ins()._List.scrollBar.autoHide = true;
                _Pattern._ins()._listRender = (Cell, index) => {
                    const data = Cell.dataSource;
                    const Icon = Cell.getChildByName('Icon');
                    if (data['name']) {
                        Icon.skin = `Game/UI/MakePattern/PatternIcon/${_Pattern._ins()._pitchClassify}/${data['name']}.png`;
                    }
                    else {
                        Icon.skin = null;
                    }
                };
            }
            lwgAdaptive() {
                this._adaWidth([this._ImgVar('BtnR'), this._ImgVar('BtnL')]);
            }
            lwgOnStart() {
                for (let index = 0; index < _Pattern._ins()._List.cells.length; index++) {
                    let Cell = _Pattern._ins()._List.cells[index];
                    if (!Cell.getComponent(_Item)) {
                        Cell.addComponent(_Item);
                    }
                }
                let clothesName = _MakeTailor._DIYClothes._ins()._pitchName;
                const name0 = clothesName.substr(0, clothesName.length - 5);
                this._ImgVar('Front').loadImage(`Game/UI/MakePattern/basic/${name0}basic.png`, Laya.Handler.create(this, () => {
                    this._ImgVar('Reverse').loadImage(`Game/UI/MakePattern/basic/${name0}basic.png`, Laya.Handler.create(this, () => {
                        _3D.DIYCloth._ins().addTexture2D(this.Tex.getTex());
                    }));
                }));
                Animation2D.fadeOut(this._ImgVar('BtnL'), 0, 1, 200, 200);
                Animation2D.fadeOut(this._ImgVar('BtnR'), 0, 1, 200, 200);
                this.UI = new _UI(this._Owner);
                this.UI.BtnAgain.pos(86, 630);
                TimerAdmin._frameOnce(10, this, () => {
                    this.UI.operationAppear(() => {
                        this.UI.btnCompleteAppear(null, 400);
                    });
                    this.UI.btnBackAppear(null, 200);
                    this.UI.btnRollbackAppear(null, 600);
                    this.UI.btnAgainAppear(null, 800);
                });
                this.UI.btnCompleteClick = () => {
                    this.Tex.restore();
                    this.UI.operationVinish(() => {
                        Animation2D.fadeOut(this._ImgVar('BtnL'), 1, 0, 200);
                        Animation2D.fadeOut(this._ImgVar('BtnR'), 1, 0, 200);
                        this.UI.btnBackVinish();
                        this.UI.btnRollbackVinish();
                        this.UI.btnAgainVinish(() => {
                            this.photo();
                        });
                    }, 200);
                };
                this.UI.btnRollbackClick = () => {
                    this._openScene('MakeTailor', true, true);
                };
                this.UI.btnAgainClick = () => {
                    this.Tex.again();
                };
                this._SpriteVar('Front').height = this._ImgVar('Reverse').height = _3D.DIYCloth._ins().texHeight;
                this._SpriteVar('Front').y = this._ImgVar('Reverse').y = _3D.DIYCloth._ins().texHeight;
            }
            lwgEvent() {
                this._evReg(_Event.createImg, (name, gPoint) => {
                    this.Tex.state = this.Tex.stateType.move;
                    this.Tex.createImg(name, gPoint);
                    this.Tex.turnFace();
                });
                this._evReg(_Event.close, () => {
                    if (this.Tex.checkInside()) {
                        this.Tex.restore();
                    }
                    else {
                        this.Tex.close();
                    }
                    this.Tex.state = this.Tex.stateType.none;
                });
            }
            lwgButton() {
                this.Tex.btn();
            }
            photo() {
                _3D._Scene._ins().photoBg();
                _3D.DIYCloth._ins().Present.transform.localRotationEulerY = 180;
                this.EndCamera = _3D._Scene._ins()._MainCamara.clone();
                _3D._Scene._ins()._Owner.addChild(this.EndCamera);
                this.EndCamera.transform.position = _3D._Scene._ins()._MainCamara.transform.position;
                this.EndCamera.transform.localRotationEuler = _3D._Scene._ins()._MainCamara.transform.localRotationEuler;
                this.EndCamera.renderTarget = new Laya.RenderTexture(this._SpriteVar('IconPhoto').width, this._SpriteVar('IconPhoto').height);
                this.EndCamera.renderingOrder = -1;
                this.EndCamera.clearFlag = Laya.CameraClearFlags.Sky;
                const ptex = new Laya.Texture(this.EndCamera.renderTarget, Laya.Texture.DEF_UV);
                this._SpriteVar('IconPhoto').graphics.drawTexture(ptex);
                this._SpriteVar('Front').scaleY = this._SpriteVar('Reverse').scaleY = 1;
                const texF = Tools._Draw.drawToTex(this._SpriteVar('Front'));
                const texR = Tools._Draw.drawToTex(this._SpriteVar('Reverse'));
                texF.width = texF.height = texR.width = texR.height = 256;
                this._SpriteVar('DrawFront').graphics.drawTexture(texF);
                this._SpriteVar('DrawReverse').graphics.drawTexture(texR);
                TimerAdmin._frameOnce(10, this, () => {
                    const base64Icon = Tools._Draw.screenshot(this._SpriteVar('IconPhoto'), 0.5);
                    const base64F = Tools._Draw.screenshot(this._SpriteVar('DrawFront'), 0.1);
                    const base64R = Tools._Draw.screenshot(this._SpriteVar('DrawReverse'), 0.1);
                    _MakeTailor._DIYClothes._ins()._setPitchProperty(_MakeTailor._DIYClothes._ins()._otherPro.icon, base64Icon);
                    Laya.LocalStorage.setItem(`${_MakeTailor._DIYClothes._ins()._pitchName}/${_MakeTailor._DIYClothes._ins()._otherPro.texF}`, base64F);
                    Laya.LocalStorage.setItem(`${_MakeTailor._DIYClothes._ins()._pitchName}/${_MakeTailor._DIYClothes._ins()._otherPro.texR}`, base64R);
                    this.EndCamera.destroy();
                    _3D.DIYCloth._ins().Front.meshRenderer.material.albedoTexture = null;
                    _3D.DIYCloth._ins().Reverse.meshRenderer.material.albedoTexture = null;
                    this._openScene('Start', true, true, () => {
                        _DressingRoom._Clothes._ins().changeAfterMaking();
                    });
                    _Ranking._whereFrom = this._Owner.name;
                });
            }
            onStageMouseDown(e) {
                this.Tex.touchP = new Laya.Point(e.stageX, e.stageY);
                if (e.stageX > Laya.stage.width - this.UI.Operation.width) {
                    this['slideFY'] = e.stageY;
                }
                else {
                    const p = new Laya.Point(e.stageX, e.stageY);
                    if (p.distance(this._ImgVar('Wireframe').x, this._ImgVar('Wireframe').y) > this._ImgVar('Frame').width / 2 + 50) {
                        this._ImgVar('Wireframe').visible = false;
                    }
                    else {
                        this._ImgVar('Wireframe').visible = true;
                    }
                }
            }
            onStageMouseMove(e) {
                this.Tex.operation(e);
                if (e.stageX > Laya.stage.width - this.UI.Operation.width) {
                    if (this['slideFY']) {
                        let diffY = this['slideFY'] - e.stageY;
                        let index = _Pattern._ins()._List.startIndex;
                        if (Math.abs(diffY) > 25) {
                            if (diffY > 0) {
                                _Pattern._ins()._List.tweenTo(index + 1, 100);
                            }
                            if (diffY < 0) {
                                _Pattern._ins()._List.tweenTo(index - 1, 100);
                            }
                            this['slideFY'] = null;
                        }
                    }
                }
                else {
                    this['slideFY'] = null;
                }
            }
            onStageMouseUp(e) {
                this['slideFY'] = null;
                if (e.stageX > Laya.stage.width - this.UI.Operation.width) {
                    this._evNotify(_Event.close);
                }
                else {
                    if (!this.Tex.checkInside()) {
                        this.Tex.close();
                    }
                }
            }
            lwgCloseAni() {
                return 10;
            }
        }
        _MakePattern.MakePattern = MakePattern;
    })(_MakePattern || (_MakePattern = {}));
    var _MakePattern$1 = _MakePattern.MakePattern;

    var _PreLoadCutIn;
    (function (_PreLoadCutIn) {
        let _Event;
        (function (_Event) {
            _Event["animation1"] = "_PreLoadCutIn_animation1";
            _Event["preLoad"] = "_PreLoadCutIn_preLoad";
            _Event["animation2"] = "_PreLoadCutIn_animation2";
        })(_Event = _PreLoadCutIn._Event || (_PreLoadCutIn._Event = {}));
        class PreLoadCutIn extends _LwgPreLoad._PreLoadScene {
            lwgOnStart() {
                TimerAdmin._frameOnce(50, this, () => {
                    EventAdmin._notify(_Event.animation1);
                });
            }
            lwgEvent() {
                EventAdmin._register(_Event.animation1, this, () => {
                    let time = 0;
                    TimerAdmin._frameNumLoop(1, 30, this, () => {
                        time++;
                        this._LabelVar('Schedule').text = `${time}`;
                    }, () => {
                        switch (Admin._PreLoadCutIn.openName) {
                            case 'MakePattern':
                                _3D._Scene._ins().intoMakePattern();
                                break;
                            case 'MakeTailor':
                                _3D._Scene._ins().intoMakeTailor();
                                _MakeTailor._DIYClothes._ins().ClothesArr = null;
                                _MakeTailor._DIYClothes._ins().getClothesArr();
                                break;
                            case 'Start':
                                _3D._Scene._ins().intoStart();
                                break;
                            case 'DressingRoom':
                                _3D._Scene._ins().intogeDressingRoom();
                            default:
                                break;
                        }
                        TimerAdmin._frameOnce(20, this, () => {
                            EventAdmin._notify(_LwgPreLoad._Event.importList, [{}]);
                        });
                    });
                });
            }
            intoMakePattern() {
                EventAdmin._notify(_MakePattern._Event.remake);
            }
            lwgStepComplete() {
            }
            lwgAllComplete() {
                this._LabelVar('Schedule').text = `100`;
                return 500;
            }
        }
        _PreLoadCutIn.PreLoadCutIn = PreLoadCutIn;
    })(_PreLoadCutIn || (_PreLoadCutIn = {}));
    ;
    var _PreLoadCutIn$1 = _PreLoadCutIn.PreLoadCutIn;

    var lwg3D;
    (function (lwg3D) {
        class _Script3DBase extends Laya.Script3D {
            get _cameraPos() {
                if (!this['__cameraPos']) {
                    return this['__cameraPos'] = new Laya.Vector3(this._MainCamera.transform.localPositionX, this._MainCamera.transform.localPositionY, this._MainCamera.transform.localPositionZ);
                }
                else {
                    return this['__cameraPos'];
                }
            }
            get _MainCamera() {
                if (!this['__MainCamera']) {
                    if (this.owner.getChildByName('Main Camera')) {
                        return this['__MainCamera'] = this.owner.getChildByName('Main Camera');
                    }
                    for (let index = 0; index < this.owner.numChildren; index++) {
                        const element = this.owner.getChildAt(index);
                        if (typeof element == typeof (Laya.Camera)) {
                            return this['__MainCamera'] = element;
                        }
                    }
                }
                else {
                    return this['__MainCamera'];
                }
            }
            set _MainCamera(Camera) {
                this['__MainCamera'] = Camera;
            }
            _Child(name) {
                if (!this[`_child${name}`]) {
                    if (this.owner.getChildByName(name)) {
                        return this[`_child${name}`] = this.owner.getChildByName(name);
                    }
                    else {
                        console.log(`不存在子节点${name}`);
                    }
                }
                else {
                    return this[`_child${name}`];
                }
            }
            getChildComponent(name, Component) {
                if (!this[`_child${name}${Component}`]) {
                    let Child = this.owner.getChildByName(name);
                    if (Child) {
                        if (Child[Component]) {
                            return this[`_child${name}${Component}`] = Child[Component];
                        }
                        else {
                            console.log(`${name}子节点没有${Component}组件`);
                        }
                    }
                    else {
                        console.log(`不存在子节点${name}`);
                    }
                }
                else {
                    return this[`_child${name}${Component}`];
                }
            }
            _childTrans(name) {
                return this.getChildComponent(name, 'transform');
            }
            _childMRenderer(name) {
                return this.getChildComponent(name, 'meshRenderer');
            }
            getFindComponent(name, Component) {
                if (!this[`_child${name}${Component}`]) {
                    let Node = Tools._Node.findChild3D(this.owner, name);
                    if (Node) {
                        if (Node[Component]) {
                            return this[`_child${name}${Component}`] = Node[Component];
                        }
                        else {
                            console.log(`${name}场景内节点没有${Component}组件`);
                        }
                    }
                    else {
                        console.log(`场景内不存在子节点${name}`);
                    }
                }
                else {
                    return this[`_child${name}${Component}`];
                }
            }
            _find(name) {
                if (!this[`_FindNode${name}`]) {
                    let Node = Tools._Node.findChild3D(this.owner, name);
                    if (Node) {
                        return this[`_FindNode${name}`] = Node;
                    }
                    else {
                        console.log(`不存在节点${name}`);
                    }
                }
                else {
                    return this[`_FindNode${name}`];
                }
            }
            _findMRenderer(name) {
                return this.getFindComponent(name, 'meshRenderer');
            }
            _findTrans(name) {
                return this.getFindComponent(name, 'transform');
            }
            lwgOnAwake() {
            }
            lwgEvent() { }
            ;
            _evReg(name, func) {
                EventAdmin._register(name, this, func);
            }
            _evNotify(name, args) {
                EventAdmin._notify(name, args);
            }
            lwgOnEnable() { }
            lwgOnStart() { }
            lwgOnUpdate() {
            }
            lwgOnDisable() {
            }
        }
        class _Scene3DBase extends _Script3DBase {
            constructor() {
                super();
                this._cameraFp = new Laya.Vector3;
            }
            get _Owner() {
                return this.owner;
            }
            onAwake() {
                this._calssName = this['__proto__']['constructor'].name;
                if (this._MainCamera) {
                    this._cameraFp.x = this._MainCamera.transform.localPositionX;
                    this._cameraFp.y = this._MainCamera.transform.localPositionY;
                    this._cameraFp.z = this._MainCamera.transform.localPositionZ;
                }
                this.lwgOnAwake();
            }
            onEnable() {
                this._Owner[this._calssName] = this;
                this.lwgEvent();
                this.lwgOnEnable();
                this.lwgOpenAni();
            }
            onStart() {
                this.lwgOnStart();
            }
            lwgOpenAni() {
            }
            lwgVanishAni() {
            }
            onUpdate() {
                this.lwgOnUpdate();
            }
            onDisable() {
                this.lwgOnDisable();
                Laya.timer.clearAll(this);
                Laya.Tween.clearAll(this);
                EventAdmin._offCaller(this);
            }
        }
        lwg3D._Scene3DBase = _Scene3DBase;
        class _Object3D extends _Script3DBase {
            constructor() {
                super();
            }
            get _Owner() {
                return this.owner;
            }
            _locScale() {
                return this._Owner.transform.localScale;
            }
            _locPos() {
                return this._Owner.transform.localPosition;
            }
            _pos() {
                return this._Owner.transform.position;
            }
            _locEuler() {
                return this._Owner.transform.localRotationEuler;
            }
            get _Parent() {
                return this.owner.parent;
            }
            get _transform() {
                return this._Owner.transform;
            }
            get _Scene3D() {
                return this.owner.scene;
            }
            get _Rig3D() {
                if (!this._Owner['__Rigidbody3D']) {
                    this._Owner['__Rigidbody3D'] = this._Owner.getComponent(Laya.Rigidbody3D);
                }
                return this._Owner['__Rigidbody3D'];
            }
            onAwake() {
                this.lwgOnAwake();
            }
            onEnable() {
                this.lwgEvent();
                this.lwgOnEnable();
            }
            onUpdate() {
                this.lwgOnUpdate();
            }
            onDisable() {
                this.lwgOnDisable();
                Laya.Tween.clearAll(this);
                Laya.timer.clearAll(this);
                EventAdmin._offCaller(this);
            }
        }
        lwg3D._Object3D = _Object3D;
    })(lwg3D || (lwg3D = {}));

    var _MakeUp;
    (function (_MakeUp) {
        let _Event;
        (function (_Event) {
            _Event["posCalibration"] = "posCalibration";
            _Event["addTexture2D"] = "addTexture2D";
        })(_Event = _MakeUp._Event || (_MakeUp._Event = {}));
        class MakeUp extends Admin._SceneBase {
            constructor() {
                super(...arguments);
                this.Make = {
                    switch: true,
                    frontPos: null,
                    endPos: null,
                    DrawSp: null,
                    present: null,
                    color: null,
                    size: 20,
                    draw: (Sp, x, y, tex, color) => {
                    },
                    getTex: (element) => {
                        return element.drawToTexture(element.width, element.height, element.x, element.y);
                    },
                };
            }
            lwgOnStart() {
                if (!_MakeUp._Scene3D.getComponent(MakeUp3D)) {
                    _MakeUp._Scene3D.addComponent(MakeUp3D);
                }
                else {
                    _MakeUp._Scene3D.getComponent(MakeUp3D).lwgOnStart();
                }
                this._evNotify(_Event.addTexture2D, [this._ImgVar('Glasses1').name, this.Make.getTex(this._ImgVar('Glasses1')).bitmap]);
                this._evNotify(_Event.addTexture2D, [this._ImgVar('Glasses2').name, this.Make.getTex(this._ImgVar('Glasses2')).bitmap]);
            }
            lwgEvent() {
                this._evReg(_Event.posCalibration, (p1, p2) => {
                    this._ImgVar('Glasses1').pos(p1.x - this._ImgVar('Glasses1').width / 2, p1.y - this._ImgVar('Glasses1').height / 2);
                    this._ImgVar('Glasses2').pos(p2.x - this._ImgVar('Glasses2').width / 2, p2.y - this._ImgVar('Glasses1').height / 2);
                });
            }
            lwgButton() {
                for (let index = 0; index < this._ImgVar('Case').numChildren; index++) {
                    const element = this._ImgVar('Case').getChildAt(index);
                    this._btnUp(element, (e) => {
                        this.Make.color = element.getChildAt(0).text;
                        this.Make.switch = true;
                    });
                }
                for (let index = 0; index < this._ImgVar('Glasses').numChildren; index++) {
                    const element = this._ImgVar('Glasses').getChildAt(index);
                    let DrawBoard1 = new Laya.Sprite;
                    DrawBoard1.width = element.width;
                    DrawBoard1.height = element.height;
                    DrawBoard1.name = 'DrawBoard';
                    element.addChild(DrawBoard1);
                    this._btnFour(element, (e) => {
                        if (this.Make.switch) {
                            this.Make.frontPos = element.globalToLocal(new Laya.Point(e.stageX, e.stageY));
                            this.Make.present = element;
                            this.Make.DrawSp = new Laya.Sprite;
                            let _DrawBoard = element.getChildByName('DrawBoard');
                            _DrawBoard.addChild(this.Make.DrawSp);
                        }
                    }, (e) => {
                        if (this.Make.DrawSp && this.Make.present == element) {
                            this.Make.endPos = element.globalToLocal(new Laya.Point(e.stageX, e.stageY));
                            this.Make.DrawSp.graphics.drawCircle(this.Make.endPos.x, this.Make.endPos.y, this.Make.size / 2, this.Make.color);
                            this.Make.DrawSp.graphics.drawLine(this.Make.frontPos.x, this.Make.frontPos.y, this.Make.endPos.x, this.Make.endPos.y, this.Make.color, this.Make.size);
                            this.Make.frontPos = this.Make.endPos;
                            this._evNotify(_Event.addTexture2D, [element.name, this.Make.getTex(element).bitmap]);
                        }
                    }, (e) => {
                        let _DrawBoard = element.getChildByName('DrawBoard');
                        if (_DrawBoard) {
                            let NewBoard = element.addChild((new Laya.Sprite()).pos(0, 0));
                            NewBoard.width = _DrawBoard.width;
                            NewBoard.height = _DrawBoard.height;
                            NewBoard.name = 'DrawBoard';
                            NewBoard.texture = _DrawBoard.drawToTexture(_DrawBoard.width, _DrawBoard.height, _DrawBoard.x, _DrawBoard.y);
                            _DrawBoard.removeSelf();
                        }
                    }, (e) => {
                    }, null);
                }
                this._btnUp(this._ImgVar('BtnNext'), () => {
                    this._openScene('Start', true, true);
                });
            }
            onStageMouseDown(e) {
                this.Make.switch = true;
                if (this.Make.color) {
                }
            }
            onStageMouseMove(e) {
            }
            onStageMouseUp() {
            }
            lwgCloseAni() {
                return 10;
            }
        }
        _MakeUp.MakeUp = MakeUp;
        class MakeUp3D extends lwg3D._Scene3DBase {
            lwgOnAwake() {
            }
            lwgOnStart() {
                let p1 = Tools._3D.posToScreen(this._Child('Glasses1').transform.position, this._MainCamera);
                let p2 = Tools._3D.posToScreen(this._Child('Glasses2').transform.position, this._MainCamera);
                this._evNotify(_Event.posCalibration, [p1, p2]);
            }
            lwgEvent() {
                this._evReg(_Event.addTexture2D, (name, Text2D) => {
                    let bMaterial = this._Child(name).meshRenderer.material;
                    bMaterial.albedoTexture.destroy();
                    bMaterial.albedoTexture = Text2D;
                });
            }
        }
        _MakeUp.MakeUp3D = MakeUp3D;
    })(_MakeUp || (_MakeUp = {}));
    var _MakeUp$1 = _MakeUp.MakeUp3D;

    class LwgInit extends _LwgInitScene {
        lwgOnAwake() {
            _LwgInit._pkgInfo = [];
            Platform._Ues.value = Platform._Tpye.Web;
            Laya.Stat.show();
            SceneAnimation._Use.value = SceneAnimation._Type.shutters.randomshutters;
            SceneAnimation._closeSwitch = true;
            SceneAnimation._openSwitch = false;
            Click._Use.value = Click._Type.reduce;
            Adaptive._Use.value = [1280, 720];
            Admin._GuideControl.switch = false;
            Admin._Moudel = {
                _PreLoad: _PreLoad,
                _PreLoadCutIn: _PreLoadCutIn,
                _Guide: _Guide,
                _Start: _Start,
                _Game: _Game,
                _MakeTailor: _MakeTailor,
                _MakePattern: _MakePattern,
                _MakeUp: _MakeUp,
                _DressingRoom: _DressingRoom,
                _PersonalInfo: _PersonalInfo,
                _Ranking: _Ranking,
            };
        }
    }

    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var test;
        (function (test) {
            class TestSceneUI extends Scene {
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
    GameConfig.physicsDebug = false;
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
