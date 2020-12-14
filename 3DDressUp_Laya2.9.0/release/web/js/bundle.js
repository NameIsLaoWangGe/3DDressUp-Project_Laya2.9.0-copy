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
                            Audio._playSound(Audio._voiceUrl.huodejinbi);
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
                            Audio._playSound(Audio._voiceUrl.huodejinbi);
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
        let Adaptive;
        (function (Adaptive) {
            Adaptive._designWidth = 720;
            Adaptive._desigheight = 1280;
            function _stageWidth(arr) {
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index];
                    if (element.pivotX == 0 && element.width) {
                        element.x = element.x / Adaptive._designWidth * Laya.stage.width + element.width / 2;
                    }
                    else {
                        element.x = element.x / Adaptive._designWidth * Laya.stage.width;
                    }
                }
            }
            Adaptive._stageWidth = _stageWidth;
            function _stageHeight(arr) {
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index];
                    if (element.pivotY == 0 && element.height) {
                        element.y = element.y / Adaptive._desigheight * element.scaleX * Laya.stage.height + element.height / 2;
                    }
                    else {
                        element.y = element.y / Adaptive._desigheight * element.scaleX * Laya.stage.height;
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
                            Gold._num.value = 5000;
                            break;
                        case Admin._platform.tpye.Research:
                            Laya.Stat.show();
                            Gold._num.value = 50000000000000;
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
            function _preLoadOpenScene(openName, cloesName, func, zOrder) {
                _openScene(_SceneName.PreLoadCutIn);
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
                        console.log(`${openName}场景没有同名脚本！,需在LwgInit脚本中导入该模块！`);
                    }
                    scene.width = Laya.stage.width;
                    scene.height = Laya.stage.height;
                    var openf = () => {
                        if (Tools._Node.checkChildren(Laya.stage, openName)) {
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
                let stickInLeftArr = Tools._Node.zOrderByY(Scene, false);
                for (let index = 0; index < stickInLeftArr.length; index++) {
                    const element = stickInLeftArr[index];
                    if (element.name !== 'Background' && element.name.substr(0, 5) !== 'NoAni') {
                        let originalPovitX = element.pivotX;
                        let originalPovitY = element.pivotY;
                        switch (type) {
                            case Admin._sceneAnimation.type.stickIn.upLeftDownLeft:
                                element.rotation = element.y > Laya.stage.height / 2 ? -180 : 180;
                                Tools._Node.changePivot(element, 0, 0);
                                break;
                            case Admin._sceneAnimation.type.stickIn.upRightDownLeft:
                                element.rotation = element.y > Laya.stage.height / 2 ? -180 : 180;
                                Tools._Node.changePivot(element, element.rotation == 180 ? element.width : 0, 0);
                                break;
                            case Admin._sceneAnimation.type.stickIn.random:
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
                        Animation2D.simple_Rotate(element, element.rotation, 0, time, delay * index);
                        Animation2D.move_Simple(element, element.x, element.y, originalX, originalY, time, delay * index, () => {
                            Tools._Node.changePivot(element, originalPovitX, originalPovitY);
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
            class _ScriptBase extends Laya.Script {
                constructor() {
                    super(...arguments);
                    this.ownerSceneName = '';
                }
                lwgOnAwake() { }
                ;
                lwgAdaptive() { }
                ;
                lwgEventRegister() { }
                ;
                _EvReg(name, func) {
                    EventAdmin._register(name, this, func);
                }
                _EvNotify(name, args) {
                    EventAdmin._notify(name, args);
                }
                lwgOnEnable() { }
                lwgOnStart() { }
                lwgBtnRegister() { }
                ;
                _btnDown(target, down, effect) {
                    Click._on(effect == undefined ? Click._Effect.use : effect, target, this, down, null, null, null);
                }
                _btnMove(target, move, effect) {
                    Click._on(effect == undefined ? Click._Effect.use : effect, target, this, null, move, null, null);
                }
                _btnUp(target, up, effect) {
                    Click._on(effect == undefined ? Click._Effect.use : effect, target, this, null, null, up, null);
                }
                _btnOut(target, out, effect) {
                    Click._on(effect == undefined ? Click._Effect.use : effect, target, this, null, null, null, out);
                }
                _btnFour(target, down, move, up, out, effect) {
                    Click._on(effect == null ? effect : Click._Effect.use, target, this, down, move, up, out);
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
            }
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
                _FontClipVar(name) {
                    return this.getVar(name, '_FontClipVar');
                }
                _FontBox(name) {
                    return this.getVar(name, '_FontBox');
                }
                onAwake() {
                    if (this._Owner.name == null) {
                        console.log('场景名称失效，脚本赋值失败');
                    }
                    else {
                        this._calssName = this._Owner.name;
                        this._Owner[this._calssName] = this;
                    }
                    this.ownerSceneName = this.owner.name;
                    this.moduleOnAwake();
                    this.lwgOnAwake();
                    this.lwgAdaptive();
                }
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
                moduleEventRegister() { }
                ;
                onStart() {
                    this.moduleOnStart();
                    this.lwgOnStart();
                }
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
                _adaptiveHeight(arr) {
                    Adaptive._stageHeight(arr);
                }
                ;
                _adaptiveWidth(arr) {
                    Adaptive._stageWidth(arr);
                }
                ;
                _adaptiveCenter(arr) {
                    Adaptive._center(arr, Laya.stage);
                }
                ;
                onUpdate() { this.lwgOnUpdate(); }
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
            }
            Admin._SceneBase = _SceneBase;
            class _ObjectBase extends _ScriptBase {
                constructor() {
                    super();
                }
                get _Owner() {
                    return this.owner;
                }
                get _Scene() {
                    return this.owner.scene;
                }
                get _Parent() {
                    if (this._Owner.parent) {
                        return this.owner.parent;
                    }
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
                    this.lwgOnAwake();
                    this.lwgAdaptive();
                }
                onEnable() {
                    this.lwgBtnRegister();
                    this.lwgEventRegister();
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
        let DataAdmin;
        (function (DataAdmin) {
            class _Store {
                getVariables(name) {
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
                        let any = Tools._Array.randomGetOne(arr);
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
                        this.zOrder = zOrder ? zOrder : 0;
                        let RGBA = [];
                        RGBA[0] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[1] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[2] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[3] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : Tools._Number.randomOneBySection(0, 255);
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
                    let distance0 = 0;
                    let distance1 = distance ? Tools._Number.randomOneBySection(distance[0], distance[1]) : Tools._Number.randomOneBySection(100, 300);
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
                function _spray(parent, centerPoint, sectionWH, width, height, rotation, urlArr, colorRGBA, zOrder, moveAngle, distance, rotationSpeed, speed, accelerated) {
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
                    constructor(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height) {
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
                        RGBA[0] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][0], colorRGBA[1][0]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[1] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][1], colorRGBA[1][1]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[2] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][2], colorRGBA[1][2]) : Tools._Number.randomOneBySection(0, 255);
                        RGBA[3] = colorRGBA ? Tools._Number.randomOneBySection(colorRGBA[0][3], colorRGBA[1][3]) : Tools._Number.randomOneBySection(0, 255);
                        Color._colour(this, RGBA);
                        this.alpha = 0;
                    }
                }
                _Glitter._GlitterImage = _GlitterImage;
                function _blinkStar(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height, scale, speed, rotateSpeed) {
                    let Img = new _GlitterImage(parent, centerPos, radiusXY, urlArr, colorRGBA, width, height);
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
                        btnEffect = new _NoEffect();
                        break;
                    case Click._Effect.type.largen:
                        btnEffect = new _Largen();
                        break;
                    case Click._Effect.type.balloon:
                        btnEffect = new _Balloon();
                        break;
                    case Click._Effect.type.balloon:
                        btnEffect = new _Beetle();
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
                    case Click._Effect.type.no:
                        btnEffect = new _NoEffect();
                        break;
                    case Click._Effect.type.largen:
                        btnEffect = new _Largen();
                        break;
                    case Click._Effect.type.balloon:
                        btnEffect = new _Balloon();
                        break;
                    case Click._Effect.type.balloon:
                        btnEffect = new _Beetle();
                        break;
                    default:
                        btnEffect = new _Largen();
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
        class _NoEffect {
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
        lwg._NoEffect = _NoEffect;
        class _Largen {
            constructor() {
            }
            down(event) {
                event.currentTarget.scale(1.1, 1.1);
                Audio._playSound(Click._audioUrl);
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
        lwg._Largen = _Largen;
        class _Balloon {
            constructor() {
            }
            down(event) {
                event.currentTarget.scale(Click._balloonScale + 0.06, Click._balloonScale + 0.06);
                Audio._playSound(Click._audioUrl);
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
        lwg._Balloon = _Balloon;
        class _Beetle {
            constructor() {
            }
            down(event) {
                event.currentTarget.scale(Click._beetleScale + 0.06, Click._beetleScale + 0.06);
                Audio._playSound(Click._audioUrl);
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
        lwg._Beetle = _Beetle;
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
            function move_rotate(Node, tRotate, tPoint, time, delayed, func) {
                Laya.Tween.to(Node, { rotation: tRotate, x: tPoint.x, y: tPoint.y }, time, null, Laya.Handler.create(Node['move_rotate'], () => {
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
                        Audio._playMusic();
                    }
                    else {
                        val = 0;
                        Laya.LocalStorage.setItem('Setting_bgMusic', val.toString());
                        Audio._stopMusic();
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
                Click._on(Click._Effect.type.largen, btn, null, null, btnSetUp, null);
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
        let Audio;
        (function (Audio) {
            let _voiceUrl;
            (function (_voiceUrl) {
                _voiceUrl["btn"] = "Lwg/Voice/btn.wav";
                _voiceUrl["bgm"] = "Lwg/Voice/bgm.mp3";
                _voiceUrl["victory"] = "Lwg/Voice/guoguan.wav";
                _voiceUrl["defeated"] = "Lwg/Voice/wancheng.wav";
                _voiceUrl["huodejinbi"] = "Lwg/Voice/huodejinbi.wav";
            })(_voiceUrl = Audio._voiceUrl || (Audio._voiceUrl = {}));
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
            Audio._playSound = _playSound;
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
            Audio._playDefeatedSound = _playDefeatedSound;
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
            Audio._playVictorySound = _playVictorySound;
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
            Audio._playMusic = _playMusic;
            function _stopMusic() {
                Laya.SoundManager.stopMusic();
            }
            Audio._stopMusic = _stopMusic;
        })(Audio = lwg.Audio || (lwg.Audio = {}));
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
                    _ObjArray.onPropertySort(arr, 'y');
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
                function createPrefab(prefab, name) {
                    let sp = Laya.Pool.getItemByCreateFun(name ? name : prefab.json['props']['name'], prefab.create, prefab);
                    return sp;
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
                        return Math.floor(Math.random() * (section2 - section1)) + section1;
                    }
                    else {
                        return Math.floor(Math.random() * section1);
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
                    point.x = ScreenV4.x;
                    point.y = ScreenV4.y;
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
                        let outsChaild = null;
                        for (var i = 0; i < outs.length; i++) {
                            let hitResult = outs[i].collider.owner;
                            if (hitResult.name == filtrateName) {
                                outsChaild = outs[i];
                            }
                        }
                        return outsChaild;
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
                function onPropertySort(array, property) {
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
                _ObjArray.onPropertySort = onPropertySort;
                function differentPropertyTwo(objArr1, objArr2, property) {
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
                _ObjArray.differentPropertyTwo = differentPropertyTwo;
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
                _ObjArray.objArr1IdenticalPropertyObjArr2 = objArr1IdenticalPropertyObjArr2;
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
                function objArrGetValue(objArr, property) {
                    let arr = [];
                    for (let i = 0; i < objArr.length; i++) {
                        if (objArr[i][property]) {
                            arr.push(objArr[i][property]);
                        }
                    }
                    return arr;
                }
                _ObjArray.objArrGetValue = objArrGetValue;
                function objArray_Copy(ObjArray) {
                    var sourceCopy = ObjArray instanceof Array ? [] : {};
                    for (var item in ObjArray) {
                        sourceCopy[item] = typeof ObjArray[item] === 'object' ? obj_Copy(ObjArray[item]) : ObjArray[item];
                    }
                    return sourceCopy;
                }
                _ObjArray.objArray_Copy = objArray_Copy;
                function obj_Copy(obj) {
                    var objCopy = {};
                    for (const item in obj) {
                        if (obj.hasOwnProperty(item)) {
                            const element = obj[item];
                            if (typeof element === 'object') {
                                if (Array.isArray(element)) {
                                    let arr1 = _Array.copy(element);
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
                _ObjArray.obj_Copy = obj_Copy;
            })(_ObjArray = Tools._ObjArray || (Tools._ObjArray = {}));
            let _Array;
            (function (_Array) {
                function oneAddToarray(array1, array2) {
                    for (let index = 0; index < array2.length; index++) {
                        const element = array2[index];
                        array1.push(element);
                    }
                    return array1;
                }
                _Array.oneAddToarray = oneAddToarray;
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
                            let diffArray = _ObjArray.differentPropertyTwo(dataArr_0, dataArr, propertyName);
                            console.log('两个数据的差值为：', diffArray);
                            _Array.oneAddToarray(dataArr, diffArray);
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
                                Audio._playMusic();
                                this._openScene(_SceneName.Guide, true, false, () => {
                                    LwgPreLoad._loadType = Admin._SceneName.PreLoadCutIn;
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
                    this._openScene(_SceneName.PreLoad);
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
                        Animation2D.move_Simple(sp, sp.x, sp.y, Execution._ExecutionNode.x, Execution._ExecutionNode.y, 800, 100, f => {
                            Animation2D.fadeOut(sp, 1, 0, 200, 0, f => {
                                Animation2D.upDwon_Shake(Execution._ExecutionNode, 10, 80, 0, null);
                                if (func) {
                                    func();
                                }
                            });
                        });
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
                Animation2D.fadeOut(label, 0, 1, 200, 150, f => {
                    Animation2D.leftRight_Shake(Execution._ExecutionNode, 15, 60, 0, null);
                    Animation2D.fadeOut(label, 1, 0, 600, 400, f => {
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
    let Adaptive = lwg.Adaptive;
    let DataAdmin = lwg.DataAdmin;
    let EventAdmin = lwg.EventAdmin;
    let DateAdmin = lwg.DateAdmin;
    let TimerAdmin = lwg.TimerAdmin;
    let Pause = lwg.Pause;
    let Execution = lwg.Execution;
    let Gold = lwg.Gold;
    let Setting = lwg.Setting;
    let Audio = lwg.Audio;
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

    var _Res;
    (function (_Res) {
        _Res._list = {
            scene3D: {
                MakeClothes: {
                    url: `_Lwg3D/_Scene/LayaScene_MakeClothes/Conventional/MakeClothes.ls`,
                    Scene: null,
                },
                MakeUp: {
                    url: `_Lwg3D/_Scene/LayaScene_MakeUp/Conventional/MakeUp.ls`,
                    Scene: null,
                }
            },
            prefab2D: {
                BtnCompelet: {
                    url: 'Prefab/BtnCompelet.json',
                    prefab: null,
                },
            },
            texture: {},
            scene2D: {
                Start: `Scene/${_SceneName.Start}.json`,
                Guide: `Scene/${_SceneName.Guide}.json`,
                PreLoadStep: `Scene/${_SceneName.PreLoadCutIn}.json`,
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

    var _Tailor;
    (function (_Tailor) {
        let _Event;
        (function (_Event) {
            _Event["trigger"] = "_MakeClothes_trigger";
            _Event["playAni"] = "_MakeClothes_playAni";
        })(_Event = _Tailor._Event || (_Tailor._Event = {}));
        class DottedLine extends DataAdmin._Table {
            constructor(Root, LineParent, OwnerScene) {
                super();
                this.Root = Root;
                this.LineParent = LineParent;
                this.OwnerScene = OwnerScene;
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
                    let ani = this.OwnerScene[`ani${name.substr(4)}`];
                    ani.play(0, false);
                    ani.on(Laya.Event.COMPLETE, this, () => {
                        Cloth.removeSelf();
                        console.log('删除节点！');
                    });
                }
                else {
                    console.log('当前虚线上没有可以裁剪布料，请查看');
                }
            }
        }
        _Tailor.DottedLine = DottedLine;
        class Scissor extends Admin._ObjectBase {
            onTriggerEnter(other, self) {
                if (!other['cut']) {
                    other['cut'] = true;
                    EventAdmin._notify(_Event.trigger, [other.owner.name]);
                }
            }
        }
        _Tailor.Scissor = Scissor;
        class Tailor extends Admin._SceneBase {
            constructor() {
                super(...arguments);
                this.Cutting = {
                    Scissor: () => {
                        return this._ImgVar('Scissor');
                    },
                    touchP: new Laya.Point(),
                    maxSpeed: 30,
                    get diffP() {
                        return this['_diffP'] ? this['_diffP'] : new Laya.Point();
                    },
                    set diffP(p) {
                        p.x = p.x > this['maxSpeed'] ? this['maxSpeed'] : p.x;
                        p.x = p.x < -this['maxSpeed'] ? -this['maxSpeed'] : p.x;
                        p.y = p.y > this['maxSpeed'] ? this['maxSpeed'] : p.y;
                        p.y = p.y < -this['maxSpeed'] ? -this['maxSpeed'] : p.y;
                        this['_diffP'] = p;
                    },
                    EraserSp: () => {
                        if (!this._ImgVar('LineParent').getChildByName('EraserSp')) {
                            let Sp = new Laya.Sprite();
                            Sp.name = 'EraserSp';
                            Sp.blendMode = "destination-out";
                            this._ImgVar('LineParent').addChild(Sp);
                            return Sp;
                        }
                        else {
                            return this._ImgVar('LineParent').getChildByName('EraserSp');
                        }
                    },
                    EraserSize: 50,
                    erasureLine: () => {
                        let gPos = this.Cutting.Scissor().parent.localToGlobal(new Laya.Point(this._ImgVar('Scissor').x, this._ImgVar('Scissor').y));
                        let localPos = this.Cutting.EraserSp().globalToLocal(gPos);
                        this.Cutting.EraserSp().graphics.drawCircle(localPos.x, localPos.y, this.Cutting.EraserSize / 2, "#000000");
                    }
                };
            }
            lwgOnAwake() {
                this.DottedLineControl = new DottedLine(this._ImgVar('Root'), this._ImgVar('LineParent'), this._Owner);
                this.DottedLineControl.BtnCompelet = Tools._Node.createPrefab(_Res._list.prefab2D.BtnCompelet.prefab);
                this._Owner.addChild(this.DottedLineControl.BtnCompelet);
                this.DottedLineControl.BtnCompelet.pos(Laya.stage.width - 100, 150);
                this.DottedLineControl.BtnCompelet.visible = false;
                this._ImgVar('Scissor').addComponent(Scissor);
                this._ImgVar('LineParent').cacheAs = "bitmap";
            }
            lwgAdaptive() {
            }
            lwgOpenAni() {
                return 100;
            }
            lwgEventRegister() {
                EventAdmin._register(_Event.trigger, this, (name) => {
                    let value = this.DottedLineControl._checkCondition(name);
                    if (value) {
                        this.DottedLineControl.removeCloth(name);
                        let boll = this.DottedLineControl._checkAllCompelet();
                        if (boll) {
                            this.DottedLineControl.BtnCompelet.visible = true;
                        }
                    }
                });
            }
            lwgBtnRegister() {
                this._btnUp(this._ImgVar('BtnNext'), () => {
                    this._openScene('MakeClothes', true, true);
                });
                this._btnUp(this.DottedLineControl.BtnCompelet, () => {
                    this._openScene('MakeClothes', true, true);
                });
            }
            onStageMouseDown(e) {
                this.Cutting.touchP = new Laya.Point(e.stageX, e.stageY);
            }
            onStageMouseMove(e) {
                if (this.Cutting.touchP) {
                    this.Cutting.diffP = new Laya.Point(e.stageX - this.Cutting.touchP.x, e.stageY - this.Cutting.touchP.y);
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
        _Tailor.Tailor = Tailor;
    })(_Tailor || (_Tailor = {}));

    var _CutInRes;
    (function (_CutInRes) {
        _CutInRes._MakeClothes = {};
    })(_CutInRes || (_CutInRes = {}));
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
                EventAdmin._notify(_Event.animation1);
            }
            lwgEventRegister() {
                EventAdmin._register(_Event.animation1, this, () => {
                    let time = 0;
                    TimerAdmin._frameNumLoop(1, 30, this, () => {
                        time++;
                        this._LabelVar('Schedule').text = `${time}`;
                    }, () => {
                        switch (Admin._preLoadOpenSceneLater.openName) {
                            case 'MakeClothes':
                                Laya.stage.addChildAt(_Res._list.scene3D.MakeClothes.Scene, 0);
                                this._Owner.zOrder = 1;
                                break;
                            case 'MakeUp':
                                _Res._list.scene3D.MakeClothes.Scene.removeSelf();
                                Laya.stage.addChildAt(_Res._list.scene3D.MakeUp.Scene, 0);
                                this._Owner.zOrder = 1;
                                break;
                            case 'Start':
                                _Res._list.scene3D.MakeUp.Scene.removeSelf();
                                this._Owner.zOrder = 1;
                                break;
                            default:
                                break;
                        }
                        EventAdmin._notify(_LwgPreLoad._Event.importList, ([_CutInRes[`_${Admin._preLoadOpenSceneLater.openName}`]]));
                    });
                });
            }
            lwgOpenAni() {
                return 100;
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

    var _Start;
    (function (_Start) {
        function _init() {
        }
        _Start._init = _init;
        class Start extends Admin._SceneBase {
            lwgOpenAni() {
                return 100;
            }
            lwgBtnRegister() {
                this._btnUp(this._ImgVar('BtnStart'), () => {
                    this._openScene('Tailor');
                });
            }
        }
        _Start.Start = Start;
    })(_Start || (_Start = {}));
    var _Start$1 = _Start.Start;

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
            _child(name) {
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
            _childTrans(name) {
                if (!this[`_child${name}Transform`]) {
                    if (this.owner.getChildByName(name)) {
                        let _MeshSprite3D = this.owner.getChildByName(name);
                        this[`_child${name}Transform`] = _MeshSprite3D.transform;
                        return this[`_child${name}Transform`];
                    }
                    else {
                        console.log(`不存在子节点${name}`);
                    }
                }
                else {
                    return this[`_child${name}Transform`];
                }
            }
            getChildTransPro(childName, transformProperty) {
                if (!this[`_child${childName}Transform${transformProperty}`]) {
                    if (this.owner.getChildByName(childName)) {
                        let _MeshSprite3D = this.owner.getChildByName(childName);
                        this[`_child${childName}Transform${transformProperty}`] = _MeshSprite3D.transform[transformProperty];
                        return this[`_child${childName}Transform${transformProperty}`];
                    }
                    else {
                        console.log(`不存在子节点${name}`);
                    }
                }
                else {
                    return this[`_child${childName}Transform${transformProperty}`];
                }
            }
            lwgOnAwake() {
            }
            lwgEventRegister() { }
            ;
            _EvReg(name, func) {
                EventAdmin._register(name, this, func);
            }
            _EvNotify(name, args) {
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
                this.lwgEventRegister();
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
                this.lwgEventRegister();
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

    var _MakeClothes;
    (function (_MakeClothes) {
        let _Event;
        (function (_Event) {
            _Event["addTexture2D"] = "_MakeClothes_addTexture2D";
            _Event["rotateHanger"] = "_MakeClothes_rotateHanger";
            _Event["moveUltimately"] = "_MakeClothes_moveUltimately";
        })(_Event = _MakeClothes._Event || (_MakeClothes._Event = {}));
        class MakeClothes extends Admin._SceneBase {
            constructor() {
                super(...arguments);
                this.Tex = {
                    Img: null,
                    DisImg: null,
                    touchP: null,
                    diffP: null,
                    state: 'none',
                    stateType: {
                        none: 'none',
                        move: 'move',
                        scale: 'scale',
                        rotate: 'rotate',
                        addTex: 'addTex',
                    },
                    createImg: (element) => {
                        if (this.Tex.DisImg) {
                            this.Tex.DisImg.destroy();
                        }
                        this.Tex.Img = Tools._Node.simpleCopyImg(element);
                        this.Tex.Img.skin = `${element.skin.substr(0, element.skin.length - 7)}.png`;
                        this._SpriteVar('Ultimately').addChild(this.Tex.Img);
                        let lPoint = Tools._Point.getOtherLocal(element, this._SpriteVar('UltimatelyParent'));
                        this.Tex.Img.pos(lPoint.x, lPoint.y);
                        this.Tex.DisImg = Tools._Node.simpleCopyImg(element);
                        this.Tex.DisImg.skin = `${element.skin.substr(0, element.skin.length - 7)}.png`;
                        this.Tex.DisImg.pos(lPoint.x, lPoint.y);
                        this._SpriteVar('Dispaly').addChild(this.Tex.DisImg);
                        this.Tex.Img.width = this.Tex.DisImg.width = 128;
                        this.Tex.Img.height = this.Tex.DisImg.height = 128;
                        this.Tex.Img.pivotX = this.Tex.Img.pivotY = this.Tex.DisImg.pivotX = this.Tex.DisImg.pivotY = 64;
                        this._SpriteVar('Dispaly').visible = true;
                        this.Tex.restore();
                    },
                    getTex: () => {
                        return this._ImgVar('Ultimately').drawToTexture(this._ImgVar('Ultimately').width, this._ImgVar('Ultimately').height, this._ImgVar('Ultimately').x, this._ImgVar('Ultimately').y + this._ImgVar('Ultimately').height);
                    },
                    setImgPos: () => {
                        if (!_MakeClothes._HangerTrans) {
                            return;
                        }
                        let anlgeY = _MakeClothes._HangerTrans.localRotationEulerY;
                        let x;
                        let _width = this._SpriteVar('UltimatelyParent').width;
                        if (anlgeY >= 0) {
                            if (anlgeY % 360 >= 270) {
                                x = (1 - ((anlgeY - 270) % 360) * 0.25 / 90) * _width;
                            }
                            else {
                                x = (0.75 - anlgeY % 360 * 0.25 / 90) * _width;
                            }
                        }
                        if (anlgeY < 0) {
                            if (anlgeY % 360 >= -90) {
                                x = (1 - (anlgeY + 90) % 360 * 0.25 / 90) * _width;
                            }
                            else {
                                x = (-anlgeY % 360 * 0.25 / 90 - 0.25) * _width;
                            }
                        }
                        if (this._SpriteVar('Wireframe').x < Laya.stage.width / 2) {
                            this.Tex.Img.x = x - this._SpriteVar('UltimatelyParent').width / 2;
                        }
                        else {
                            this.Tex.Img.x = x;
                        }
                        return x;
                    },
                    getOut: () => {
                        let x = this._ImgVar('Frame').x;
                        let y = this._ImgVar('Frame').y;
                        let _width = this._ImgVar('Frame').width;
                        let _height = this._ImgVar('Frame').height;
                        let p1 = [_width * 1 / 4, _height * 1 / 4];
                        let p2 = [_width * 1 / 4, _height * 3 / 4];
                        let p3 = [_width * 3 / 4, _height * 1 / 4];
                        let p4 = [_width * 3 / 4, _height * 3 / 4];
                        let p5 = [0, 0];
                        let p6 = [x + _width, y];
                        let p7 = [x, y + _height];
                        let p8 = [x + _width / 2, y + _height / 2];
                        let p9 = [x + _width, y + _height];
                        let posArr = [p1, p2, p3, p4, p5, p6, p7, p8, p9];
                        let bool;
                        for (let index = 0; index < posArr.length; index++) {
                            const element = posArr[index];
                            let gPoint = this._SpriteVar('Wireframe').localToGlobal(new Laya.Point(posArr[index][0], posArr[index][1]));
                            let out = Tools._3D.rayScanning(_MakeClothes._MainCamara, _MakeClothes._Scene3D, new Laya.Vector2(gPoint.x + x, gPoint.y + y), 'Hanger');
                            if (out) {
                                bool = true;
                                return bool;
                            }
                        }
                        return bool;
                    },
                    move: (e) => {
                        this.Tex.Img.y += this.Tex.diffP.y;
                        this.Tex.DisImg.x += this.Tex.diffP.x;
                        this.Tex.DisImg.y += this.Tex.diffP.y;
                        let gPoint = this._SpriteVar('Dispaly').localToGlobal(new Laya.Point(this.Tex.DisImg.x, this.Tex.DisImg.y));
                        this._ImgVar('Wireframe').pos(gPoint.x, gPoint.y);
                        if (this.Tex.touchP && this.Tex.Img) {
                            if (this.Tex.getOut()) {
                                this.Tex.setImgPos();
                                this._ImgVar('Wireframe').visible = true;
                                this.Tex.state = this.Tex.stateType.addTex;
                                this._SpriteVar('Dispaly').visible = false;
                                return;
                            }
                        }
                    },
                    addTex: (e) => {
                        this.Tex.Img.x += this.Tex.diffP.x;
                        this.Tex.Img.y += this.Tex.diffP.y;
                        this.Tex.DisImg.x += this.Tex.diffP.x;
                        this.Tex.DisImg.y += this.Tex.diffP.y;
                        let gPoint = this._SpriteVar('Dispaly').localToGlobal(new Laya.Point(this.Tex.DisImg.x, this.Tex.DisImg.y));
                        this._ImgVar('Wireframe').pos(gPoint.x, gPoint.y);
                        if (!this.Tex.getOut()) {
                            this._ImgVar('Wireframe').visible = false;
                            this.Tex.state = this.Tex.stateType.move;
                            this.Tex.Img.x = Laya.stage.width;
                            this._SpriteVar('Dispaly').visible = true;
                        }
                        EventAdmin._notify(_Event.addTexture2D, [this.Tex.getTex().bitmap]);
                    },
                    scale: (e) => {
                        let lPoint = this._ImgVar('Wireframe').globalToLocal(new Laya.Point(e.stageX, e.stageY));
                        this._ImgVar('WConversion').pos(lPoint.x, lPoint.y);
                        this._ImgVar('Frame').width = lPoint.x;
                        this._ImgVar('Frame').height = Math.abs(lPoint.y);
                        let gPoint = this._Owner.localToGlobal(new Laya.Point(this._ImgVar('Wireframe').x, this._ImgVar('Wireframe').y));
                        this.Tex.Img.rotation = this.Tex.DisImg.rotation = this._ImgVar('Wireframe').rotation = Tools._Point.pointByAngle(e.stageX - gPoint.x, e.stageY - gPoint.y) + 45;
                        let scaleWidth = this._ImgVar('Frame').width - this._ImgVar('Wireframe').width;
                        let scaleheight = this._ImgVar('Frame').height - this._ImgVar('Wireframe').height;
                        this.Tex.DisImg.width = this.Tex.Img.width = 128 + scaleWidth;
                        this.Tex.DisImg.height = this.Tex.Img.height = 128 + scaleheight;
                        Tools._Node.changePivot(this._ImgVar('Wireframe'), this._ImgVar('Frame').width / 2, this._ImgVar('Frame').height / 2);
                        Tools._Node.changePivotCenter(this.Tex.Img);
                        Tools._Node.changePivotCenter(this.Tex.DisImg);
                        EventAdmin._notify(_Event.addTexture2D, [this.Tex.getTex().bitmap]);
                    },
                    rotate: (e) => {
                        if (this.Tex.diffP.x > 0) {
                            EventAdmin._notify(_Event.rotateHanger, [1]);
                        }
                        else {
                            EventAdmin._notify(_Event.rotateHanger, [0]);
                        }
                    },
                    none: () => {
                        return;
                    },
                    operation: (e) => {
                        this.Tex.diffP = new Laya.Point(e.stageX - this.Tex.touchP.x, e.stageY - this.Tex.touchP.y);
                        this.Tex[this.Tex.state](e);
                        this.Tex.touchP = new Laya.Point(e.stageX, e.stageY);
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
                        if (this.Tex.DisImg) {
                            this.Tex.DisImg.destroy();
                        }
                        if (this.Tex.Img) {
                            this.Tex.Img.destroy();
                        }
                        this.Tex.state = this.Tex.stateType.none;
                        this.Tex.touchP = null;
                        EventAdmin._notify(_Event.addTexture2D, [this.Tex.getTex().bitmap]);
                    },
                    btn: () => {
                        for (let index = 0; index < this._ImgVar('Figure').numChildren; index++) {
                            const element = this._ImgVar('Figure').getChildAt(index);
                            this._btnDown(element, (e) => {
                                this.Tex.state = this.Tex.stateType.move;
                                this.Tex.createImg(element);
                            });
                        }
                        this._btnFour(this._ImgVar('WConversion'), (e) => {
                            this.Tex.state = this.Tex.stateType.scale;
                        }, null, (e) => {
                            this.Tex.state = this.Tex.stateType.addTex;
                        });
                        this._btnUp(this._ImgVar('WClose'), (e) => {
                            this.Tex.close();
                        });
                        this._btnDown(this._ImgVar('BtnLRotate'), (e) => {
                            this._ImgVar('Wireframe').visible = false;
                            this.Tex.state = this.Tex.stateType.rotate;
                        });
                        this._btnDown(this._ImgVar('BtnRRotate'), (e) => {
                            this._ImgVar('Wireframe').visible = false;
                            this.Tex.state = this.Tex.stateType.rotate;
                        });
                    }
                };
            }
            lwgOnAwake() {
                _MakeClothes._Scene3D = _Res._list.scene3D.MakeClothes.Scene;
                if (!_MakeClothes._Scene3D.getComponent(MakeClothes3D)) {
                    _MakeClothes._Scene3D.addComponent(MakeClothes3D);
                }
            }
            lwgAdaptive() {
                this._adaptiveWidth([this._ImgVar('BtnRRotate'), this._ImgVar('BtnLRotate')]);
            }
            lwgOpenAni() {
                return 100;
            }
            lwgEventRegister() {
            }
            lwgBtnRegister() {
                this.Tex.btn();
                this._btnUp(this._ImgVar('BtnNext'), () => {
                    this._openScene('MakeUp', true, true);
                });
            }
            onStageMouseDown(e) {
                this.Tex.touchP = new Laya.Point(e.stageX, e.stageY);
            }
            onStageMouseMove(e) {
                this.Tex.operation(e);
            }
            onStageMouseUp() {
                if (!this.Tex.getOut()) {
                    this.Tex.close();
                }
            }
        }
        _MakeClothes.MakeClothes = MakeClothes;
        class MakeClothes3D extends lwg3D._Scene3DBase {
            lwgOnAwake() {
                _MakeClothes._HangerTrans = this._childTrans('Hanger');
                _MakeClothes._MainCamara = this._MainCamera;
            }
            lwgEventRegister() {
                EventAdmin._register(_Event.addTexture2D, this, (Text2D) => {
                    let bMaterial = this._child('Hanger').meshRenderer.material;
                    bMaterial.albedoTexture.destroy();
                    bMaterial.albedoTexture = Text2D;
                });
                EventAdmin._register(_Event.rotateHanger, this, (num) => {
                    if (num == 1) {
                        this._childTrans('Hanger').localRotationEulerY++;
                    }
                    else {
                        this._childTrans('Hanger').localRotationEulerY--;
                    }
                    this._childTrans('Hanger').localRotationEulerY %= 360;
                    console.log(this._childTrans('Hanger').localRotationEulerY);
                });
            }
        }
        _MakeClothes.MakeClothes3D = MakeClothes3D;
    })(_MakeClothes || (_MakeClothes = {}));
    var _MakeClothes$1 = _MakeClothes.MakeClothes;

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
                        if (element == this._ImgVar('Glasses1')) {
                            let tex = element.drawToTexture(element.width, element.height, element.x, element.y + element.height);
                            return tex;
                        }
                        else {
                            return element.drawToTexture(element.width, element.height, element.x, element.y + element.height);
                        }
                    },
                };
            }
            lwgOnAwake() {
                _MakeUp._Scene3D = _Res._list.scene3D.MakeUp.Scene;
                if (!_MakeUp._Scene3D.getComponent(MakeUp3D)) {
                    _MakeUp._Scene3D.addComponent(MakeUp3D);
                }
            }
            lwgOnStart() {
            }
            lwgOpenAni() {
                return 100;
            }
            lwgAdaptive() {
            }
            lwgEventRegister() {
                this._EvReg(_Event.posCalibration, (p1, p2) => {
                    this._ImgVar('Glasses1').pos(p1.x - this._ImgVar('Glasses1').width / 2, p1.y + this._ImgVar('Glasses1').height / 2);
                    this._ImgVar('Glasses2').pos(p2.x - this._ImgVar('Glasses2').width / 2, p2.y + this._ImgVar('Glasses1').height / 2);
                });
            }
            lwgBtnRegister() {
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
                            this._EvNotify(_Event.addTexture2D, [element.name, this.Make.getTex(element).bitmap]);
                        }
                    }, (e) => {
                        let _DrawBoard = element.getChildByName('DrawBoard');
                        console.log(_DrawBoard.numChildren);
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
        }
        _MakeUp.MakeUp = MakeUp;
        class MakeUp3D extends lwg3D._Scene3DBase {
            lwgOnAwake() {
            }
            lwgOnStart() {
                let p1 = Tools._3D.posToScreen(this._child('Glasses1').transform.position, this._MainCamera);
                let p2 = Tools._3D.posToScreen(this._child('Glasses2').transform.position, this._MainCamera);
                this._EvNotify(_Event.posCalibration, [p1, p2]);
            }
            lwgEventRegister() {
                this._EvReg(_Event.addTexture2D, (name, Text2D) => {
                    let bMaterial = this._child(name).meshRenderer.material;
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
            Admin._platform.ues = Admin._platform.tpye.Research;
            Admin._sceneAnimation.use = Admin._sceneAnimation.type.stickIn.random;
            Click._Effect.use = Click._Effect.type.largen;
            Adaptive._desigheight = 720;
            Adaptive._designWidth = 1280;
            Admin._moudel = {
                _PreLoad: _PreLoad,
                _PreLoadCutIn: _PreLoadCutIn,
                _Guide: _Guide,
                _Start: _Start,
                _Game: _Game,
                _Tailor: _Tailor,
                _MakeClothes: _MakeClothes,
                _MakeUp: _MakeUp,
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
