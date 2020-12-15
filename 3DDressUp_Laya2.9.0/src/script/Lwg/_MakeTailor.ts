import lwg, { Admin, Animation2D, AudioAdmin, Click, DataAdmin, Effects, EventAdmin, SceneAnimation, TimerAdmin, Tools, _SceneName } from "./Lwg";
import { _Res } from "./_PreLoad";

export module _MakeTailor {
    export enum _Event {
        scissorTrigger = '_MakeTailor_ scissorTrigger',
        completeEffcet = '_MakeTailor_completeAni',
        changeClothes = '_MakeTailor_changeClothes',
        scissorAppear = '_MakeTailor_scissorAppear',
        scissorPlay = '_MakeTailor_scissorPlay',
        scissorStop = '_MakeTailor_scissorStop',
        scissorRotation = '_MakeTailor_scissorRotation',
        scissorAgain = '_MakeTailor_scissorSitu',
        scissorRemove = '_MakeTailor_scissorRemove',
    }

    /**服装总数据数据*/
    export class _DIYClothes extends DataAdmin._Table {
        private static ins: _DIYClothes;
        static _ins() {
            if (!this.ins) {
                this.ins = new _DIYClothes('DIYClothes', _Res._list.json.DIYClothes.dataArr, true);
                //设置初始值
            }
            return this.ins;
        };
        _classify = {
            Dress: 'Dress',
            Top: 'Top',
            Bottoms: 'Bottoms',
        };
        _otherPro = {
            color: 'color',
            icon: 'icon',
            texR: 'texR',
            texF: 'texF',
        };
        _getColor(): Array<any> {
            let obj = this._getPitchObj();
            return [obj[`${this._otherPro.color}1`], obj[`${this._otherPro.color}2`]]
        }

        ClothesArr: Array<Laya.Sprite>;
        /**当前选中的类别中所有的服装*/
        getClothesArr(): Array<any> {
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
        createClothes(name: string, Scene?: Laya.Scene): Laya.Sprite {
            const Cloth = Tools._Node.createPrefab(_Res._list.prefab2D[name]['prefab']);
            // 增加一个和舞台一样大小的父节点方便移动
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

    /**当前任务服装数据*/
    export class _TaskClothes extends DataAdmin._Table {
        private static ins: _TaskClothes;
        static _ins() {
            if (!this.ins) {
                this.ins = new _TaskClothes('DIY_Task');
            }
            return this.ins;
        }

        /**本关重来*/
        again(Scene: Laya.Scene): void {
            const clothesArr = _DIYClothes._ins().getClothesArr();
            const name = _DIYClothes._ins()._pitchName ? _DIYClothes._ins()._pitchName : clothesArr[0]['name'];
            for (let index = 0; index < clothesArr.length; index++) {
                const element = clothesArr[index] as Laya.Sprite;
                if (element.name === name) {
                    this.LastClothes = element;
                    clothesArr[index] = this.Clothes = _DIYClothes._ins().createClothes(name, Scene);
                    this.LineParent = this.Clothes.getChildAt(0).getChildByName('LineParent') as Laya.Image;
                    this.setData();
                }
            }
            this.clothesMove();
            Animation2D.move_rotate(this.LastClothes, 45, new Laya.Point(Laya.stage.width * 1.5, Laya.stage.height * 1.5), this.moveTime, 0, () => {
                this.LastClothes.removeSelf();
            })
        }
        Clothes: Laya.Sprite;
        moveTime = 600;
        clothesMove(): void {
            const time = 700;
            this.Clothes.pos(0, -Laya.stage.height * 1.5);
            this.Clothes.rotation = 45;
            Animation2D.move_rotate(this.Clothes, 0, new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2), time);
        }
        LastClothes: Laya.Sprite;
        LineParent: Laya.Image;
        /**更换服装*/
        changeClothes(Scene: Laya.Scene): void {
            const clothesArr = _DIYClothes._ins().getClothesArr();
            const name = _DIYClothes._ins()._pitchName ? _DIYClothes._ins()._pitchName : clothesArr[0]['name'];
            const lastName = _DIYClothes._ins()._lastPitchName;
            for (let index = 0; index < clothesArr.length; index++) {
                const element = clothesArr[index] as Laya.Sprite;
                if (element.name == name) {
                    element.removeSelf();
                    // 重新创建一个，否则可能会导致碰撞框位置不正确
                    this.Clothes = clothesArr[index] = _DIYClothes._ins().createClothes(name, Scene);
                    this.LineParent = this.Clothes.getChildAt(0).getChildByName('LineParent') as Laya.Image;
                    this.setData();
                } else if (element.name == lastName) {
                    this.LastClothes = element;
                } else {
                    element.removeSelf();
                }
            }
            this.clothesMove();
            this.LastClothes && Animation2D.move_rotate(this.LastClothes, -45, new Laya.Point(Laya.stage.width * 1.5, -Laya.stage.height * 1.5), this.moveTime, 0, () => {
                this.LastClothes.removeSelf();
            })
        }

        /**设置单个服装的任务信息*/
        setData(): void {
            this._arr = [];
            for (let index = 0; index < this.LineParent.numChildren; index++) {
                const Line = this.LineParent.getChildAt(index) as Laya.Image;
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

    export class _UI {
        constructor(_Scene: Laya.Scene) {
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
                // Animation2D.fadeOut(this.Scene['BG2'], this.Scene['BG2'].alpha, 1, 500);
                const BG1 = this.Scene['BG1'] as Laya.Image;
                const BG2 = this.Scene['BG2'] as Laya.Image;
                BG1.pivot(0, Laya.stage.height);
                BG1.x = 0;
                BG1.y = Laya.stage.height;
                BG2.pivot(Laya.stage.width, Laya.stage.height);
                BG2.x = Laya.stage.width;
                BG2.y = Laya.stage.height;
                BG1.rotation = BG2.rotation = 0;
                BG1.zOrder = 1;
                BG2.zOrder = 0;
                Animation2D.move_rotate(BG1, -30, new Laya.Point(0, -Laya.stage.height), this.time * 6);
            }
            Animation2D.move(this.Operation, this.moveTargetX - 40, this.Operation.y, this.time * 4, () => {
                Animation2D.move(this.Operation, this.moveTargetX, this.Operation.y, this.time, () => {
                    func && func();
                })
            }, delay ? delay : 0)
        };
        operationVinish(func?: Function, delay?: number): void {
            if (this.Scene.name === 'MakeTailor') {
                // Animation2D.fadeOut(this.Scene['BG2'], this.Scene['BG2'].alpha, 0, 500);
                const BG1 = this.Scene['BG1'] as Laya.Image;
                const BG2 = this.Scene['BG2'] as Laya.Image;
                BG1.pivot(0, Laya.stage.height);
                BG1.x = 0;
                BG1.y = Laya.stage.height;
                BG2.pivot(Laya.stage.width, Laya.stage.height);
                BG2.x = Laya.stage.width;
                BG2.y = Laya.stage.height;
                BG1.rotation = BG2.rotation = 0;
                BG1.zOrder = 0;
                BG2.zOrder = 1;
                Animation2D.move_rotate(BG2, 30, new Laya.Point(Laya.stage.width, -Laya.stage.height), this.time * 6);
            }
            Animation2D.bombs_Vanish(this.BtnComplete, 0, 0, 0, this.time * 4, () => {
                Animation2D.move(this.Operation, this.moveTargetX - 40, this.Operation.y, this.time, () => {
                    Animation2D.move(this.Operation, Laya.stage.width + 500, this.Operation.y, this.time * 4, () => {
                        func && func();

                    });
                });
            }, delay ? delay : 0)
        }
    }

    /**剪刀*/
    class _Scissor extends Admin._ObjectBase {
        lwgOnAwake(): void {
            this._Owner.pos(this.Ani.vanishP.x, this.Ani.vanishP.y);
        }
        /**动画控制*/
        Ani = {
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
                    } else if (this._SceneImg('S2').rotation <= 0) {
                        this.Ani.dir = 'down';
                    }
                    if (this.Ani.dir == 'up') {
                        this._SceneImg('S1').rotation += this.Ani.shearSpeed * 4;
                        this._SceneImg('S2').rotation -= this.Ani.shearSpeed * 4;
                    } else if (this.Ani.dir == 'down') {
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
                    Animation2D.rotate(this._SceneImg('S1'), -this.Ani.range / 3, time)
                    Animation2D.rotate(this._SceneImg('S2'), this.Ani.range / 3, time)
                })
            },

            event: () => {
                this._evReg(_Event.scissorAppear, () => {
                    let time = 800;
                    Animation2D.move_rotate(this._Owner, this._fRotation + 360, this._fPoint, time, 0, () => {
                        this._Owner.rotation = this._fRotation;
                        this.Move.switch = true;
                    })
                })
                this._evReg(_Event.scissorPlay, () => {
                    this.Ani.paly();
                })
                this._evReg(_Event.scissorStop, () => {
                    this.Ani.stop();
                })
                this._evReg(_Event.scissorRemove, (func?: Function) => {
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
                    })
                })

                this._evReg(_Event.scissorAgain, () => {
                    Animation2D.move_rotate(this._Owner, this._fRotation, this._fPoint, 600, 100, () => {
                        _TaskClothes._ins().again(this._Scene);
                    });
                })

                this._evReg(_Event.scissorRotation, (rotate: number) => {
                    TimerAdmin._clearAll([this._Owner]);
                    const time = 10;
                    let angle: number;
                    if (Math.abs(rotate - this._Owner.rotation) < 180) {
                        angle = rotate - this._Owner.rotation;
                    } else {
                        angle = -(360 - (rotate - this._Owner.rotation));
                    }
                    let unit = angle / time;
                    TimerAdmin._frameNumLoop(1, time, this._Owner, () => {
                        this._Owner.rotation += unit;
                    })
                })
            },
            effcts: () => {
                const num = Tools._Number.randomOneInt(3, 6);
                const color1 = _DIYClothes._ins()._getColor()[0];
                const color2 = _DIYClothes._ins()._getColor()[1];
                const color = Tools._Number.randomOneHalf() === 0 ? color1 : color2;
                for (let index = 0; index < num; index++) {
                    Effects._Particle._spray(this._Scene, this._point, [10, 30], null, [0, 360], [Effects._SkinUrl.三角形1], [color1, color2], [20, 90], null, null, [1, 3], [0.1, 0.2], this._Owner.zOrder - 1);
                }
            }
        }
        lwgEvent(): void {
            this.Ani.event();
        }
        Move = {
            switch: false,
            touchP: null as Laya.Point,
            diffP: null as Laya.Point,
        }

        lwgButton(): void {

            this._btnFour(Laya.stage,
                (e: Laya.Event) => {
                    if (this.Move.switch) {
                        this._evNotify(_Event.scissorPlay);
                        this.Move.touchP = new Laya.Point(e.stageX, e.stageY);
                    }
                },
                (e: Laya.Event) => {
                    if (this.Move.touchP && this.Move.switch) {
                        this.Move.diffP = new Laya.Point(e.stageX - this.Move.touchP.x, e.stageY - this.Move.touchP.y);
                        this._Owner.x += this.Move.diffP.x;
                        this._Owner.y += this.Move.diffP.y;
                        Tools._Node.tieByStage(this._Owner);
                        this.Move.touchP = new Laya.Point(e.stageX, e.stageY);
                        this._evNotify(_Event.scissorPlay);
                    }
                },
                (e: Laya.Event) => {
                    this._evNotify(_Event.scissorStop);
                    this.Move.touchP = null;
                })
        }
        onTriggerEnter(other: Laya.CircleCollider, _Owner: Laya.CircleCollider): void {
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
        lwgButton(): void {
            this._btnUp(this._Owner, () => {
                if (this._Owner['_dataSource']['name'] !== _DIYClothes._ins()._pitchName) {
                    _DIYClothes._ins()._setPitch(this._Owner['_dataSource']['name']);
                    this._evNotify(_Event.changeClothes);
                }
            })
        }
    }

    export class MakeTailor extends Admin._SceneBase {
        lwgOnAwake(): void {
            this._ImgVar('Scissor').addComponent(_Scissor);
            _DIYClothes._ins()._List = this._ListVar('List');
            _DIYClothes._ins()._List.array = _DIYClothes._ins()._getArrByPitchClassify();
            _DIYClothes._ins()._setPitch(_DIYClothes._ins()._getArrByPitchClassify()[0][_DIYClothes._ins()._property.name]);
            _DIYClothes._ins()._listRender = (Cell: Laya.Box, index: number) => {
                const data = Cell.dataSource;
                const Icon = Cell.getChildByName('Icon') as Laya.Image;
                let name = data['name'] as string;
                Icon.skin = `Game/UI/MakeTailor/${name}/${name.substr(0, name.length - 5)}cut.png`;
                const Board = Cell.getChildByName('Board') as Laya.Image;
                Board.skin = `Lwg/UI/ui_orthogon_green.png`;
                if (data[_DIYClothes._ins()._property.pitch]) {
                    Board.skin = `Game/UI/Common/xuanzhong.png`;
                } else {
                    Board.skin = null;
                }
                if (!Cell.getComponent(_Item)) {
                    Cell.addComponent(_Item)
                }
            }
        }
        UI: _UI;
        lwgOnStart(): void {
            this.UI = new _UI(this._Owner);
            TimerAdmin._frameOnce(40, this, () => {
                this.UI.operationAppear(() => {
                    this.UI.btnAgainVinish(null, 200);
                    this.UI.btnCompleteAppear();
                });
                this.UI.btnBackAppear();
            })
            this.UI.BtnRollback.visible = false;
            this.UI.btnCompleteClick = () => {
                this.UI.operationVinish(() => {
                    this.UI.btnAgainAppear();
                }, 200);
                TimerAdmin._frameOnce(30, this, () => {
                    this._evNotify(_Event.scissorAppear);
                })
            }
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
                })
            }

            TimerAdmin._frameOnce(20, this, () => {
                _TaskClothes._ins().changeClothes(this._Owner);
            })
        }

        lwgEvent(): void {
            this._evReg(_Event.changeClothes, () => {
                _TaskClothes._ins().changeClothes(this._Owner);
            })

            this._evReg(_Event.scissorTrigger, (Dotted: Laya.Image) => {
                const Parent = Dotted.parent as Laya.Sprite;
                const value = _TaskClothes._ins()._checkCondition(Parent.name);
                Dotted.visible = false;
                // 将底下线擦掉
                let Eraser = Parent.getChildByName('Eraser') as Laya.Sprite;
                if (!Eraser) {
                    Eraser = new Laya.Sprite;
                    Parent.addChild(Eraser);
                }
                Eraser.blendMode = "destination-out";
                Parent.cacheAs = "bitmap";
                Eraser.graphics.drawCircle(Dotted.x, Dotted.y, 15, '#000000');

                if (value) {
                    // 删除布料
                    for (let index = 0; index < _TaskClothes._ins().Clothes.getChildAt(0).numChildren; index++) {
                        const element = _TaskClothes._ins().Clothes.getChildAt(0).getChildAt(index) as Laya.Image;
                        // 比对索引值
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
                    // 检测是否全部完成
                    if (_TaskClothes._ins()._checkAllCompelet()) {
                        Tools._Node.removeAllChildren(_TaskClothes._ins().LineParent);
                        this._evNotify(_Event.scissorRemove);
                        TimerAdmin._frameOnce(80, this, () => {
                            this._evNotify(_Event.completeEffcet);
                        })
                        TimerAdmin._frameOnce(280, this, () => {
                            this._openScene('MakePattern', true, true);
                        })
                    }
                }
                // 剪刀转向
                const gPos = (Dotted.parent as Laya.Image).localToGlobal(new Laya.Point(Dotted.x, Dotted.y));
                if (Dotted.name == 'A') {
                    if (this._ImgVar('Scissor').x <= gPos.x) {
                        this._evNotify(_Event.scissorRotation, [Dotted.rotation]);
                    } else {
                        this._evNotify(_Event.scissorRotation, [180 + Dotted.rotation]);
                    }
                } else {
                    if (this._ImgVar('Scissor').y >= gPos.y) {
                        this._evNotify(_Event.scissorRotation, [Dotted.rotation]);
                    } else {
                        this._evNotify(_Event.scissorRotation, [180 + Dotted.rotation]);
                    }
                }
            })

            this._evReg(_Event.completeEffcet, () => {
                this.UI.btnBackVinish();
                this.UI.btnAgainVinish();
                AudioAdmin._playVictorySound();
                this.effcet[`ani${Tools._Number.randomOneInt(1, 3)}`]();
            })
        }

        effcet = {
            ani1: () => {
                this._AniVar('complete').play(0, false);
                let _caller = {};
                TimerAdmin._frameLoop(1, _caller, () => {
                    let gP = (this._ImgVar('EFlower').parent as Laya.Image).localToGlobal(new Laya.Point(this._ImgVar('EFlower').x, this._ImgVar('EFlower').y))
                    Effects._Particle._fallingVertical(this._Owner, new Laya.Point(gP.x, gP.y - 40), [0, 0], null, null, [0, 360], [Effects._SkinUrl.花2], [[255, 222, 0, 1], [255, 222, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1])

                    Effects._Particle._fallingVertical(this._Owner, new Laya.Point(gP.x, gP.y), [0, 0], null, null, [0, 360], [Effects._SkinUrl.花2], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1])
                })
                this._AniVar('complete').on(Laya.Event.COMPLETE, this, () => {
                    TimerAdmin._clearAll([_caller]);
                })
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
                        Effects._Particle._fallingVertical(this._Owner, new Laya.Point(p1.x, p1.y), [0, 0], null, null, [0, 360], [Effects._SkinUrl.花2], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1])
                    }
                    TimerAdmin._frameLoop(1, _caller, () => {
                        funcL();
                    })

                    let p2 = new Laya.Point(Laya.stage.width + 200, Laya.stage.height);
                    let _callerR = {};
                    let funcR = () => {
                        p2.x -= spcaing;
                        if (p2.x < 0) {
                            Laya.timer.clearAll(_callerR);
                        }
                        p2.y -= moveY;
                        Effects._Particle._fallingVertical(this._Owner, new Laya.Point(p2.x, p2.y), [0, 0], null, null, [0, 360], [Effects._SkinUrl.花2], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1])
                    }
                    TimerAdmin._frameLoop(1, _callerR, () => {
                        funcR();
                    })
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
                            Effects._Particle._fallingVertical(Img, new Laya.Point(p1.x, p1.y), [0, 0], null, null, [0, 360], [Effects._SkinUrl.星星8], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1])
                        } else {
                            Effects._Particle._fallingVertical_Reverse(Img, new Laya.Point(p2.x, p2.y), [0, 0], null, null, [0, 360], [Effects._SkinUrl.星星8], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [-100, -200], [-0.8, -1.5], [-0.05, -0.1])
                        }
                    }
                    TimerAdmin._frameNumLoop(2, 50, _caller, () => {
                        func();
                    })
                }
            }
        }
    }
}