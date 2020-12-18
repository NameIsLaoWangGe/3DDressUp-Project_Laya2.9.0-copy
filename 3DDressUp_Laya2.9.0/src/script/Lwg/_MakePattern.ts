import { TaT } from "../TJ/Admanager";
import { Admin, Animation2D, Click, DataAdmin, EventAdmin, TimerAdmin, Tools } from "./Lwg";
import { lwg3D } from "./Lwg3D";
import { _3D } from "./_3D";
import { _MakeTailor } from "./_MakeTailor";
import { _MakeUp } from "./_MakeUp";
import { _Res } from "./_PreLoad";
import { _Ranking } from "./_Ranking";
import { _UI } from "./_UI";
export module _MakePattern {
    export enum _Event {
        moveUltimately = '_MakePattern_moveUltimately',
        resetTex = '_MakePattern_resetTex',
        changeDir = '_MakePattern_resetTex',
        remake = '_MakePattern_remake',
        close = '_MakePattern_close',
        createImg = '_MakePattern_createImg',
        setTexSize = '_MakePattern_texSize',
    }

    class _Pattern extends DataAdmin._Table {
        private static ins: _Pattern;
        static _ins(): _Pattern {
            if (!this.ins) {
                this.ins = new _Pattern('_Chartlet', _Res._list.json.MakePattern.dataArr);
                this.ins._pitchClassify = this.ins._classify.general;
                //空位置用于站位 
                this.ins._arr.push({}, {});
            }
            return this.ins;
        }
        _classify = {
            general: 'general',
        }
    }

    export class _Item extends Admin._ObjectBase {
        fX: number;
        diffX: number = 0;
        create: boolean = false;
        lwgButton(): void {
            const Icon = this._Owner.getChildByName('Icon');
            this._btnFour(Icon,
                (e: Laya.Event) => {
                    this.create = false;
                    this.diffX = 0;
                    this.fX = e.stageX;
                    this._evNotify(_Event.close);
                },
                (e: Laya.Event) => {
                    if (!this.create) {
                        this.diffX = this.fX - e.stageX;
                        if (this.diffX >= 5) {
                            Icon && this._evNotify(_Event.createImg, [this._Owner['_dataSource']['name'], this._gPoint]);
                            this.create = true;
                        }
                    }
                },
                () => {
                    this.create = true;
                },
                () => {
                    this.create = true;
                })
        }
    }

    export class MakePattern extends Admin._SceneBase {
        lwgOnAwake(): void {
            _Pattern._ins()._List = this._ListVar('List');
            _Pattern._ins()._List.scrollBar.touchScrollEnable = false;
            _Pattern._ins()._List.scrollBar.autoHide = true;
            _Pattern._ins()._listRender = (Cell: Laya.Box, index: number) => {
                const data = Cell.dataSource;
                const Icon = Cell.getChildByName('Icon') as Laya.Image;
                if (data['name']) {
                    Icon.skin = `Game/UI/MakePattern/PatternIcon/${_Pattern._ins()._pitchClassify}/${data['name']}.png`;
                } else {
                    Icon.skin = null;
                }
            }
        }
        lwgAdaptive(): void {
            // this._adaptiveCenter([this._SpriteVar('Ultimately'), this._SpriteVar('Dispaly')]);
            this._adaWidth([this._ImgVar('BtnR'), this._ImgVar('BtnL')]);
        }

        UI: _UI;
        lwgOnStart(): void {
            for (let index = 0; index < _Pattern._ins()._List.cells.length; index++) {
                let Cell = _Pattern._ins()._List.cells[index];
                if (!Cell.getComponent(_Item)) {
                    Cell.addComponent(_Item);
                }
            }

            // 设置皮肤
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
            })
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
            }
            this.UI.btnRollbackClick = () => {
                this._openScene('MakeTailor', true, true);
            }
            this.UI.btnAgainClick = () => {
                Tools._Node.removeAllChildren(this._SpriteVar('Front'));
                Tools._Node.removeAllChildren(this._SpriteVar('Reverse'));
                _3D.DIYCloth._ins().addTexture2D(this.Tex.getTex());
            }

            this._SpriteVar('Front').height = this._ImgVar('Reverse').height = _3D.DIYCloth._ins().texHeight;
            this._SpriteVar('Front').y = this._ImgVar('Reverse').y = _3D.DIYCloth._ins().texHeight;
        }

        lwgEvent(): void {
            this._evReg(_Event.createImg, (name: string, gPoint: Laya.Point) => {
                this.Tex.state = this.Tex.stateType.move;
                this.Tex.createImg(name, gPoint);
            })

            this._evReg(_Event.close, () => {
                if (this.Tex.checkInside()) {
                    this.Tex.restore();
                } else {
                    this.Tex.close();
                }
                this.Tex.state = this.Tex.stateType.none;
            })

            // this._evReg(_Event.setTexSize, (_height: number) => {
            //     this._SpriteVar('Front').height = this._ImgVar('Reverse').height = _height;
            //     this._SpriteVar('Front').y = this._ImgVar('Reverse').y = _height;
            // })
        }
        /**图片移动控制*/
        Tex = {
            Img: null as Laya.Image,
            DisImg: null as Laya.Image,
            imgWH: [128, 128],
            touchP: null as Laya.Point,
            diffP: null as Laya.Point,
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
            createImg: (name: string, gPoint: Laya.Point) => {
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
            getTex: (): Laya.Texture[] => {
                let ImgF = this._ImgVar(this.Tex.dirType.Front);
                let ImgR = this._ImgVar(this.Tex.dirType.Reverse);
                let arr = [
                    ImgF.drawToTexture(ImgF.width, ImgF.height, ImgF.x, ImgF.y + ImgF.height) as Laya.Texture,
                    ImgR.drawToTexture(ImgR.width, ImgR.height, ImgR.x, ImgR.y + ImgR.height) as Laya.Texture
                ]
                return arr;
            },
            setImgPos: (): boolean => {
                let posArr = this.Tex.setPosArr();
                let indexArr: Array<Laya.Point> = [];
                let outArr: Laya.HitResult[] = [];
                for (let index = 0; index < posArr.length; index++) {
                    let gPoint = this._SpriteVar('Wireframe').localToGlobal(new Laya.Point(posArr[index].x, posArr[index].y));
                    const out = Tools._3D.rayScanning(_3D._Scene._ins()._MainCamara, _3D._Scene._ins()._Owner, new Laya.Vector2(gPoint.x, gPoint.y), 'model');
                    if (out) {
                        outArr.push(out);
                        indexArr.push(posArr[index]);
                        let Img = this._Owner.getChildByName(`Img${index}`) as Laya.Image;
                        if (!Img) {
                            let Img = new Laya.Image;
                            Img.skin = `Lwg/UI/ui_circle_004.png`;
                            this._Owner.addChild(Img);
                            Img.name = `Img${index}`;
                            Img.width = 20;
                            Img.height = 20;
                            Img.pivotX = Img.width / 2;
                            Img.pivotY = Img.height / 2;
                        } else {
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
                    //通过xz的角度计算x的比例，俯视
                    let angleXZ = Tools._Point.pointByAngle(_3D.DIYCloth._ins().ModelTap.transform.position.x - out.point.x, _3D.DIYCloth._ins().ModelTap.transform.position.z - out.point.z);
                    // let _angleY: number;
                    if (this.Tex.dir == this.Tex.dirType.Front) {
                        // _angleY = angleXZ + _3D.DIYCloth._ins().simRY;
                        this.Tex.Img.x = _width - _width / 180 * (angleXZ + 90);
                    } else {
                        // _angleY = angleXZ + _3D.DIYCloth._ins().simRY - 180;
                        this.Tex.Img.x = - _width / 180 * (angleXZ - 90);
                    }
                    // console.log(this.Tex.Img.x);

                    // 通过xy计算y
                    let pH = out.point.y - _3D.DIYCloth._ins().ModelTap.transform.position.y;//扫描点位置
                    let _DirHeight = Tools._3D.getMeshSize(this.Tex.dir == this.Tex.dirType.Front ? _3D.DIYCloth._ins().Front : _3D.DIYCloth._ins().Reverse).y;
                    let ratio = 1 - pH / _DirHeight;//比例
                    this.Tex.Img.y = ratio * _height;

                    // console.log(this.Tex.Img.x, this.Tex.Img.y);
                    return true;
                } else {
                    return false;
                }
            },
            setPosArr: (): Array<Laya.Point> => {
                let x = this._ImgVar('Frame').x;
                let y = this._ImgVar('Frame').y;
                let _width = this._ImgVar('Frame').width;
                let _height = this._ImgVar('Frame').height;
                return [
                    new Laya.Point(0, 0),
                    new Laya.Point(0, _height / 2),
                    new Laya.Point(_width, _height / 2),
                    new Laya.Point(_width, 0),
                    new Laya.Point(_width / 2, 0),
                    new Laya.Point(_width / 2, _height),
                    new Laya.Point(_width * 1 / 4, _height * 3 / 4),
                    new Laya.Point(_width * 3 / 4, _height * 1 / 4),
                    new Laya.Point(_width / 2, _height / 2),
                    new Laya.Point(_width * 1 / 4, _height * 1 / 4),
                    new Laya.Point(_width * 3 / 4, _height * 3 / 4),
                    new Laya.Point(x, _height),
                    new Laya.Point(_width, _height),
                ];
            },
            crashType: {
                setImgPos: 'setImgPos',
                enter: 'enter',
                inside: 'inside',
            },
            /**
             * 检测是不是在模型中
             * */
            checkInside: (): any => {
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
            getDisGP: (): Laya.Point => {
                return this.Tex.DisImg ? this._SpriteVar('Dispaly').localToGlobal(new Laya.Point(this.Tex.DisImg.x, this.Tex.DisImg.y)) : null
            },
            disMove: () => {
                this.Tex.DisImg.x += this.Tex.diffP.x;
                this.Tex.DisImg.y += this.Tex.diffP.y;
                let gPoint = this.Tex.getDisGP();
                this._ImgVar('Wireframe').pos(gPoint.x, gPoint.y);
            },
            move: (e: Laya.Event) => {
                this.Tex.disMove();
                this._ImgVar('Wireframe').visible = false;
                if (this.Tex.checkInside()) {
                    this.Tex.setImgPos();
                    this._ImgVar('Wireframe').visible = true;
                    this.Tex.state = this.Tex.stateType.addTex;
                    this._SpriteVar('Dispaly').visible = false;
                }
            },
            addTex: (e: Laya.Event) => {
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
            scale: (e: Laya.Event): void => {
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
            rotate: (e: Laya.Event) => {
                if (this.Tex.diffP.x > 0) {
                    _3D.DIYCloth._ins().rotate(1);
                } else {
                    _3D.DIYCloth._ins().rotate(0);
                }
            },
            none: () => {
                return;
            },
            operation: (e: Laya.Event): void => {
                if (this.Tex.touchP) {
                    this.Tex.diffP = new Laya.Point(e.stageX - this.Tex.touchP.x, e.stageY - this.Tex.touchP.y);
                    this.Tex[this.Tex.state](e);
                    this.Tex.touchP = new Laya.Point(e.stageX, e.stageY);
                }
            },
            /**重制方框*/
            restore: () => {
                this._ImgVar('Wireframe').rotation = 0;
                this._ImgVar('Wireframe').pivotX = this._ImgVar('Wireframe').width / 2;
                this._ImgVar('Wireframe').pivotY = this._ImgVar('Wireframe').height / 2;
                this._ImgVar('WConversion').x = this._ImgVar('Frame').width = this._ImgVar('Wireframe').width;
                this._ImgVar('WConversion').y = this._ImgVar('Frame').height = this._ImgVar('Wireframe').height;
                this._ImgVar('Wireframe').visible = false;
            },
            /**关闭方框去掉图片*/
            close: (): void => {
                this.Tex.restore();
                this.Tex.DisImg && this.Tex.DisImg.destroy();
                this.Tex.Img && this.Tex.Img.destroy();
                this.Tex.state = this.Tex.stateType.none;
                this.Tex.touchP = null;
                _3D.DIYCloth._ins().addTexture2D(this.Tex.getTex());
            },
            btn: () => {
                this._btnFour(this._ImgVar('WConversion'), (e: Laya.Event) => {
                    e.stopPropagation();
                    this.Tex.state = this.Tex.stateType.scale;
                }, null
                    , (e: Laya.Event) => {
                        e.stopPropagation();
                        this.Tex.state = this.Tex.stateType.addTex;
                    })
                this._btnUp(this._ImgVar('WClose'), (e: Laya.Event) => {
                    e.stopPropagation();
                    this.Tex.close();
                })
                this._btnFour(this._ImgVar('BtnL'), (e: Laya.Event) => {
                    this._ImgVar('Wireframe').visible = false;
                    this.Tex.state = this.Tex.stateType.rotate;
                    TimerAdmin._frameLoop(1, this._ImgVar('BtnL'), () => {
                        _3D.DIYCloth._ins().rotate(0);
                    })
                }, null, () => {
                    Laya.timer.clearAll(this._ImgVar('BtnL'));
                }, () => {
                    Laya.timer.clearAll(this._ImgVar('BtnL'));
                })
                this._btnFour(this._ImgVar('BtnR'), (e: Laya.Event) => {
                    this._ImgVar('Wireframe').visible = false;
                    this.Tex.state = this.Tex.stateType.rotate;
                    TimerAdmin._frameLoop(1, this._ImgVar('BtnR'), () => {
                        _3D.DIYCloth._ins().rotate(1);
                    })
                }, null, () => {
                    Laya.timer.clearAll(this._ImgVar('BtnR'));
                }, () => {
                    Laya.timer.clearAll(this._ImgVar('BtnR'));
                })
            }
        }
        lwgButton(): void {
            this.Tex.btn();
        }

        EndCamera: Laya.Camera;
        /**截图*/
        photo(): void {
            _3D.DIYCloth._ins().Present.transform.localRotationEulerY = 180;
            this.EndCamera = _3D._Scene._ins()._MainCamara.clone() as Laya.Camera;
            _3D._Scene._ins()._Owner.addChild(this.EndCamera);
            this.EndCamera.transform.position = _3D._Scene._ins()._MainCamara.transform.position;
            this.EndCamera.transform.localRotationEuler = _3D._Scene._ins()._MainCamara.transform.localRotationEuler;
            //选择渲染目标为纹理
            this.EndCamera.renderTarget = new Laya.RenderTexture(this._SpriteVar('IconPhoto').width, this._SpriteVar('IconPhoto').height);
            //渲染顺序
            this.EndCamera.renderingOrder = -1;
            //清除标记
            this.EndCamera.clearFlag = Laya.CameraClearFlags.Sky;
            var rtex = new Laya.Texture(((<Laya.Texture2D>(this.EndCamera.renderTarget as any))), Laya.Texture.DEF_UV);
            this._SpriteVar('IconPhoto').graphics.drawTexture(rtex);
            TimerAdmin._frameOnce(10, this, () => {
                const base64Icon = Tools._Draw.screenshot(this._SpriteVar('IconPhoto'), 0.5);
                this._SpriteVar('Front').scaleY = 1;
                this._SpriteVar('Front').width = this._SpriteVar('Front').height = 256;
                const base64F = Tools._Draw.screenshot(this._SpriteVar('Front'), 0.1);
                this._SpriteVar('Reverse').scaleY = 1;
                this._SpriteVar('Reverse').width = this._SpriteVar('Reverse').height = 256;
                const base64R = Tools._Draw.screenshot(this._SpriteVar('Reverse'), 0.1);
                _MakeTailor._DIYClothes._ins()._setPitchProperty(_MakeTailor._DIYClothes._ins()._otherPro.icon, base64Icon);
                Laya.LocalStorage.setItem(`${_MakeTailor._DIYClothes._ins()._pitchName}/${_MakeTailor._DIYClothes._ins()._otherPro.texF}`, base64F);
                Laya.LocalStorage.setItem(`${_MakeTailor._DIYClothes._ins()._pitchName}/${_MakeTailor._DIYClothes._ins()._otherPro.texR}`, base64R);

                this.EndCamera.destroy();
                this._openScene('Start', true, true);
                _Ranking._whereFrom = this._Owner.name;
                // console.log(base64Icon);
                // console.log(base64F);
                // console.log(base64R);
            })
        }

        onStageMouseDown(e: Laya.Event): void {
            this.Tex.touchP = new Laya.Point(e.stageX, e.stageY);
            if (e.stageX > Laya.stage.width - this.UI.Operation.width) {
                this['slideFY'] = e.stageY;
            }
        }

        onStageMouseMove(e: Laya.Event) {
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
        onStageMouseUp(e: Laya.Event) {
            this['slideFY'] = null;
            if (e.stageX > Laya.stage.width - this.UI.Operation.width) {
                this._evNotify(_Event.close);
            } else {
                if (!this.Tex.checkInside()) {
                    this.Tex.close()
                } else {

                }
            }
        }
        lwgCloseAni(): number {
            return 10;
        }
    }
}
export default _MakePattern.MakePattern;