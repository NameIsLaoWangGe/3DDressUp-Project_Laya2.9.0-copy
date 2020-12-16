import { Admin, Animation2D, DataAdmin, StorageAdmin, TimerAdmin, Tools } from "./Lwg";
import { _MakeTailor } from "./_MakeTailor";
import { _Res } from "./_PreLoad";
import { _PropTry } from "./_PropTry";

export module _DressingRoom {
    export enum _Event {
        changeCloth = '_DressingRoom_ChangeCloth',
    }
    export enum _AniName {
        Stand = 'Stand',
        Poss1 = 'Poss1',
        Poss2 = 'Poss2',
        DispalyCloth = 'DispalyCloth',
    }
    export class _Clothes extends DataAdmin._Table {
        private static ins: _Clothes;
        static _ins() {
            if (!this.ins) {
                this.ins = new _Clothes('ClothesGeneral', _Res._list.json.GeneralClothes.dataArr, true);
                this.ins._Scene3D = _Res._list.scene3D.MakeClothes.Scene;
                this.ins._Role = this.ins._Scene3D.getChildByName('Role') as Laya.MeshSprite3D;
                this.ins._Root = this.ins._Role.getChildByName('Root') as Laya.MeshSprite3D;
                this.ins._DIY = this.ins._Root.getChildByName('DIY') as Laya.MeshSprite3D;
                this.ins._General = this.ins._Root.getChildByName('General') as Laya.MeshSprite3D;

                this.ins._DBottoms = this.ins._DIY.getChildByName('Bottoms') as Laya.MeshSprite3D;
                this.ins._DTop = this.ins._DIY.getChildByName('Top') as Laya.MeshSprite3D;
                this.ins._DDress = this.ins._DIY.getChildByName('Dress') as Laya.MeshSprite3D;

                this.ins._GBottoms = this.ins._General.getChildByName('Bottoms') as Laya.MeshSprite3D;
                this.ins._GTop = this.ins._General.getChildByName('Top') as Laya.MeshSprite3D;
                this.ins._GDress = this.ins._General.getChildByName('Dress') as Laya.MeshSprite3D;

                this.ins._RoleAni = this.ins._Role.getComponent(Laya.Animator) as Laya.Animator;

                this.ins._SecondCameraTag = this.ins._Scene3D.getChildByName('SecondCameraTag') as Laya.MeshSprite3D;

                this.ins._MainCamara = this.ins._Scene3D.getChildByName('SecondCameraTag') as Laya.Camera;
                this.ins._MirrorCamera = this.ins._Scene3D.getChildByName('MirrorCamera') as Laya.Camera;
            }
            return this.ins;
        }
        _classify = {
            DIY: 'DIY',
            General: 'General',
        };
        /**部位*/
        _part = {
            Dress: 'Dress',
            Top: 'Top',
            Bottoms: 'Bottoms',
            FaceMask: 'FaceMask',
            Accessories: 'Accessories',
            Shoes: 'Shoes',
            Hair: 'Hair',
        }
        _otherPro = {
            putOn: 'putOn',
            part: 'part'
        }

        _Scene3D: Laya.Scene3D;
        _Role: Laya.MeshSprite3D;
        _RoleAni: Laya.Animator;
        _Root: Laya.MeshSprite3D;
        _DIY: Laya.MeshSprite3D;
        _DTop: Laya.MeshSprite3D;
        _DDress: Laya.MeshSprite3D;
        _DBottoms: Laya.MeshSprite3D;
        _General: Laya.MeshSprite3D;
        _GTop: Laya.MeshSprite3D;
        _GDress: Laya.MeshSprite3D;
        _GBottoms: Laya.MeshSprite3D;
        _SecondCameraTag: Laya.MeshSprite3D;
        _MirrorCamera: Laya.Camera;
        _MainCamara: Laya.Camera;
     

        playDispalyAni(): void {
            this._RoleAni.play(_AniName.Stand);
            this._RoleAni.play(_AniName.DispalyCloth);
            Laya.timer.clearAll(this._Role);
            TimerAdmin._once(3200, this._Role, () => {
                this._RoleAni.crossFade(_AniName.Stand, 0.3);
            })
        }
        private changeClass(classify: string, partArr: Array<any>): void {
            const _classify = this._Root.getChildByName(classify) as Laya.MeshSprite3D;
            for (let i = 0; i < _classify.numChildren; i++) {
                const _classifySp = _classify.getChildAt(i) as Laya.MeshSprite3D;
                _classifySp.active = false;
                for (let j = 0; j < partArr.length; j++) {
                    const obj = partArr[j];
                    if (obj[this._otherPro.part] === _classifySp.name) {
                        _classifySp.active = true;
                        for (let k = 0; k < _classifySp.numChildren; k++) {
                            const cloth = _classifySp.getChildAt(k) as Laya.SkinnedMeshSprite3D;
                            if (cloth.name === obj[this._property.name]) {
                                cloth.active = true;
                                if (!cloth.skinnedMeshRenderer.material) {
                                    cloth.skinnedMeshRenderer.material = new Laya.UnlitMaterial();
                                }
                                Laya.Texture2D.load(`Game/UI/DressingRoom/ClothTex/${cloth.name}.png`, Laya.Handler.create(this, function (tex: Laya.Texture2D): void {
                                    (cloth.skinnedMeshRenderer.material as Laya.UnlitMaterial).albedoTexture = tex;
                                }));
                            } else {
                                cloth.active = false;
                            }
                        }
                    }
                }
            }
            this.playDispalyAni();
        }
        /**换装规则*/
        changeAll(): void {
            const arr = this._getArrByProperty(this._otherPro.putOn, true);
            this.changeClass(this._classify.DIY, arr);
            this.changeClass(this._classify.General, arr);
        }

        /**进游戏时的特殊设置*/
        startSpecialSet(): void {
            if (StorageAdmin._bool('DressState').value) {
                this._GBottoms.active = this._GTop.active = this._DBottoms.active = this._DTop.active = false;
            } else {
                this._GDress.active = this._DDress.active = false;
            }
        }

        /**特殊设置*/
        specialSet(part?: string): void {
            if (part === this._part.Dress) {
                this['DressState'] = true;
            } else if (part === this._part.Top || part === this._part.Bottoms) {
                this['DressState'] = false;
            }
            if (this['DressState']) {
                this._GBottoms.active = this._GTop.active = this._DBottoms.active = this._DTop.active = false;
            } else {
                this._GDress.active = this._DDress.active = false;
            }
            StorageAdmin._bool('DressState').value = this['DressState'];
        }
    }

    class _Item extends Admin._ObjectBase {
        lwgButton(): void {
            this._btnUp(this._Owner, (e: Laya.Event) => {
                const arr = _Clothes._ins()._getArrByProperty('part', this._Owner['dataSource']['part']);
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index];
                    if (this._Owner['dataSource']['name'] === element['name']) {
                        element['putOn'] = true;
                    } else {
                        element['putOn'] = false;
                    }
                }
                _Clothes._ins()._refreshAndStorage();
                _Clothes._ins().changeAll();
                _Clothes._ins().specialSet(this._Owner['dataSource']['part']);
            }, null)
        }
    }

    export class DressingRoom extends Admin._SceneBase {

        lwgOnAwake(): void {
            let DIYArr = _MakeTailor._DIYClothes._ins()._getArrByNoProperty(_MakeTailor._DIYClothes._ins()._otherPro.icon, "");
            // 必须复制
            let copyDIYArr = Tools._ObjArray.arrCopy(DIYArr);
            _Clothes._ins()._addObjectArr(copyDIYArr);
            _Clothes._ins()._List = this._ListVar('List');
            _Clothes._ins()._List.array = _Clothes._ins()._getArrByClassify(_Clothes._ins()._classify.DIY)
            this._ImgVar('DIY').skin = `Game/UI/Common/kuang_fen.png`;
            const Icon = this._ImgVar('DIY').getChildAt(0) as Laya.Image;
            Icon.skin = `Game/UI/DressingRoom/ClassIcon/${this._ImgVar('DIY').name}_s.png`;
            _Clothes._ins()._listRender = (Cell: Laya.Box, index: number) => {
                let data = Cell.dataSource;
                let Icon = Cell.getChildByName('Icon') as Laya.Image;
                const Board = Cell.getChildByName('Board') as Laya.Image;
                if (data[_Clothes._ins()._otherPro.putOn]) {
                    Board.skin = `Game/UI/Common/xuanzhong.png`;
                } else {
                    Board.skin = null;
                }
                if (data[_Clothes._ins()._property.classify] === _Clothes._ins()._classify.DIY) {
                    Icon.skin = data[_MakeTailor._DIYClothes._ins()._otherPro.icon];
                } else {
                    Icon.skin = `Game/UI/DressingRoom/Icon/${data[_Clothes._ins()._property.name]}.png`;
                }
                if (!Cell.getComponent(_Item)) {
                    Cell.addComponent(_Item)
                }
            }
            // this._ImgVar('Front').loadImage(Laya.LocalStorage.getItem(`${_MakeTailor._DIYClothes._ins()._pitchName}/${_MakeTailor._DIYClothes._ins()._otherPro.texF}`));
            // this._ImgVar('Front').width = this._ImgVar('Front').height = 512;
            // this._ImgVar('Reverse').loadImage(Laya.LocalStorage.getItem(`${_MakeTailor._DIYClothes._ins()._pitchName}/${_MakeTailor._DIYClothes._ins()._otherPro.texR}`));
            // this._ImgVar('Reverse').width = this._ImgVar('Reverse').height = 512;
        }
        // createMirror(): void {
        //     //选择渲染目标为纹理
        //     _Clothes._ins()._MirrorCamera.renderTarget = new Laya.RenderTexture(this._ImgVar('MirrorSurface').width, this._ImgVar('MirrorSurface').height);
        //     //渲染顺序
        //     _Clothes._ins()._MirrorCamera.renderingOrder = -1;
        //     //清除标记
        //     _Clothes._ins()._MirrorCamera.clearFlag = Laya.CameraClearFlags.Sky;
        //     var rtex = new Laya.Texture(((<Laya.Texture2D>(_Clothes._ins()._MirrorCamera.renderTarget as any))), Laya.Texture.DEF_UV);
        //     this._ImgVar('MirrorSurface').graphics.drawTexture(rtex);
        //     this._SpriteVar('IconPhoto').graphics.drawTexture(rtex);
        // }

        lwgEvent(): void {
            this._evReg(_Event.changeCloth, () => {

            })
        }

        UI: _MakeTailor._UI;
        lwgOnStart(): void {
            this.UI = new _MakeTailor._UI(this._Owner);
            TimerAdmin._frameOnce(10, this, () => {
                this.UI.operationAppear();
                this.UI.btnBackAppear(null, 200);
                this.UI.btnCompleteAppear(null, 400);
            })
            this.UI.btnCompleteClick = () => {
                this.UI.operationVinish(() => {
                    this.UI.btnBackVinish(() => {
                        this._openScene('Start', true, true);
                    });
                }, 200);
            }
        }

        lwgButton(): void {
            for (let index = 0; index < this._ImgVar('Part').numChildren; index++) {
                const _element = this._ImgVar('Part').getChildAt(index) as Laya.Image;
                this._btnUp(_element, () => {
                    let arr = [];
                    for (let index = 0; index < this._ImgVar('Part').numChildren; index++) {
                        const element = this._ImgVar('Part').getChildAt(index) as Laya.Image;
                        const Icon = element.getChildAt(0) as Laya.Image;
                        if (_element === element) {
                            element.skin = `Game/UI/Common/kuang_fen.png`;
                            Icon.skin = `Game/UI/DressingRoom/PartIcon/${element.name}_s.png`;
                            // 如果是DIY那么直接是分类
                            if (_element.name === 'DIY') {
                                arr = _Clothes._ins()._getArrByClassify(_element.name);
                            } else {
                                let _arr = _Clothes._ins()._getArrByClassify(_Clothes._ins()._classify.General);
                                // 非DIY分部位
                                for (let index = 0; index < _arr.length; index++) {
                                    const obj = _arr[index];
                                    if (obj[_Clothes._ins()._otherPro.part] === _element.name) {
                                        arr.push(obj);
                                    }
                                }
                            }
                        } else {
                            element.skin = `Game/UI/Common/kuang_bai.png`;
                            Icon.skin = `Game/UI/DressingRoom/PartIcon/${element.name}.png`;
                        }
                        _Clothes._ins()._List.array = arr;
                    }
                }, 'no');
            }
        }
    }
}
export default _DressingRoom.DressingRoom;