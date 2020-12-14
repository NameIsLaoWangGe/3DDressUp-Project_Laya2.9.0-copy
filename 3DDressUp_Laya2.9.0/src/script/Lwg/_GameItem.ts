import ADManager, { TaT } from "../TJ/Admanager";
import { Admin, Animation2D, Click, EventAdmin, TimerAdmin, Tools, _SceneName } from "./Lwg";
import { _Compound } from "./_Compound";
import { _Game } from "./_Game";
import { _PropTry } from "./_PropTry";

export class _GameItem extends Admin._Object {
    lwgOnAwake(): void {
        this.Compound.Pic = this.Owner.getChildByName('Pic') as Laya.Image;
    }
    lwgOnStart(): void {
        var caller = {};
        TimerAdmin._frameLoop(1, caller, () => {
            if (this.Owner['_dataSource']) {
                Laya.timer.clearAll(caller);
                Animation2D.bombs_Appear(this.Owner, 0, 1, 1.3, Tools.randomOneHalf() == 1 ? 10 : -10, 300, 150, Math.round(Math.random() * 500) + 800, () => {
                    if (!this.Owner.getComponents(_GameItem)) {
                        !this.Owner.addComponent(_GameItem)
                    }
                    if ((_Game._GeneralPencils._pitchName == this.Owner['_dataSource'][_Game._GeneralPencils._property.name])) {
                        Animation2D.rotate_Scale(this.Owner, 0, 1, 1, 180, 1.2, 1.2, 250, 0, () => {
                            Animation2D.rotate_Scale(this.Owner, 0, 1, 1, 360, 1, 1, 250, 0, () => {
                                this.Owner.rotation = 0;
                            });
                        });
                    }
                })
            }
        });
    }
    Compound = {
        Pic: null as Laya.Image,
        time: 0,
        restrict: 1,
        Img: null as Laya.Image,
        firstPos: null as Laya.Point,
        PosArr: null,
        homing: () => {
            if (this.Compound.Img) {
                this.Compound.Img.destroy();
                this.Compound.Img = null;
                this.Compound.Pic.visible = true;
            }
        },
        remake: () => {
            // console.log('重制')
            this.Compound.homing();
            this.Compound.time = 0;
            _Game._GeneralPencils._compoundName = null;
            _Game._activate = true;
        }
    }
    onStageMouseMove(e: Laya.Event): void {
        if (this.Owner['_dataSource'] && this.Compound.time > this.Compound.restrict && this.Compound.Img) {
            _Game._activate = false;
            _Game._GeneralPencils._compoundName = this.Owner['_dataSource']['name'];
            this.Compound.Img.visible = true;
            this.Compound.Pic.visible = false;
            this.Compound.Img.pos(e.stageX, e.stageY);
        }
    }
    onStageMouseUp(e: Laya.Event): void {
        if (this.Owner['_dataSource']) {
            this.Compound.remake();
        }
    }
    lwgBtnClick(): void {
        Click._on(Click._Type.noEffect, this.Compound.Pic, this,
            (e: Laya.Event) => {
                if (!this.Compound.Img && this.Owner['_dataSource']) {
                    this.Compound.firstPos = new Laya.Point(e.stageX, e.stageY);
                    this.Compound.Img = new Laya.Image;
                    this.OwnerScene.addChild(this.Compound.Img);
                    this.Compound.Img.zOrder = 300;
                    this.Compound.Img.width = this.Compound.Pic.width;
                    this.Compound.Img.height = this.Compound.Pic.height;
                    this.Compound.Img.scale(this.Compound.Pic.scaleX, this.Compound.Pic.scaleY);
                    Tools.Node.changePovit(this.Compound.Img, this.Compound.Img.width / 2, this.Compound.Img.height / 2);
                    this.Compound.Img.skin = this.Compound.Pic.skin;
                    this.Compound.Img.visible = false;
                }
                e.stopPropagation();
            },
            (e: Laya.Event) => {
                this.Compound.time++;
            },
            (e: Laya.Event) => {
                console.log('抬起！')
                if (_Game._GeneralPencils._compoundName && _Game._GeneralPencils._compoundName !== this.Owner['_dataSource']['name']) {
                    _Compound.Skin1 = _Game._GeneralPencils._compoundName;
                    _Compound.Skin2 = this.Owner['_dataSource']['name'];
                    this.lwgOpenScene(_SceneName.Compound, false);
                    this.Compound.remake();
                    return;
                }
                // console.log(this.Owner);
                // e.stopPropagation();
                ADManager.TAPoint(TaT.BtnClick, `id_${this.Owner['_dataSource']['name']}`);
                let lastName = _Game._GeneralPencils._pitchName;
                _Game._GeneralPencils._pitchName = this.Owner['_dataSource']['name'];
                if (this.Owner['_dataSource']['name'] == 'colours') {
                    // console.log(this.Owner['_dataSource']['name']);
                    if (!_Game._ColoursPencils._switch) {
                        _Game._GeneralPencils._pitchName = lastName;
                        _PropTry._comeFrom = _SceneName.Game;
                        this.lwgOpenScene(_SceneName.PropTry, false);
                        _Game._activate = false;
                        return;
                    }
                    _Game._ColoursPencils._clickNum++;
                    if (_Game._ColoursPencils._clickNum == 1) {
                        EventAdmin._notify(_Game._Event.generalRefresh);
                        return;
                    }
                    for (let index = 0; index < _Game._ColoursPencils._data.length; index++) {
                        const element = _Game._ColoursPencils._data[index];
                        if (_Game._ColoursPencils._pitchName == element[_Game._GeneralPencils._property.name]) {
                            let nameIndex = Number(_Game._ColoursPencils._pitchName.substr(5));
                            // console.log(nameIndex);
                            if (_Game._ColoursPencils._switch) {
                                if (!nameIndex) {
                                    nameIndex = 1;
                                }
                                nameIndex++;
                                if (nameIndex > 7) {
                                    nameIndex = 1;
                                }
                                _Game._ColoursPencils._pitchName = `caise${nameIndex}`;
                                _Game._ColoursPencils._setPresentColorArr();
                            }
                            EventAdmin._notify(_Game._Event.generalRefresh);
                            return;
                        }
                    }
                } else {
                    _Game._ColoursPencils._clickNum = 0;
                }
            },
            (e: Laya.Event) => {
                e.stopPropagation();
            });
    }
}