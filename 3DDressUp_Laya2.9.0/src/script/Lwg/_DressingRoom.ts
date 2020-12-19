import { Admin, Animation2D, DataAdmin, StorageAdmin, TimerAdmin, Tools } from "./Lwg";
import { _3D } from "./_3D";
import { _MakeTailor } from "./_MakeTailor";
import { _Res } from "./_PreLoad";
import { _PropTry } from "./_PropTry";
import { _UI } from "./_UI";

export module _DressingRoom {
    export enum _Event {
        changeCloth = '_DressingRoom_ChangeCloth',
    }
    export class _Clothes extends DataAdmin._Table {
        private static ins: _Clothes;
        static _ins() {
            if (!this.ins) {
                this.ins = new _Clothes('ClothesGeneral', _Res._list.json.GeneralClothes.dataArr, true);
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
        private changeClass(classify: string, partArr: Array<any>, playAni?: boolean): void {
            const _classify = _3D._Scene._ins()._Root.getChildByName(classify) as Laya.MeshSprite3D;
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
                                if (classify !== 'DIY') {
                                    let mat = cloth.skinnedMeshRenderer.material as Laya.UnlitMaterial;
                                    if (!mat) {
                                        cloth.skinnedMeshRenderer.material = new Laya.UnlitMaterial();
                                    }
                                    if (mat.albedoTexture) {
                                        mat.albedoTexture.destroy();
                                    }
                                    Laya.Texture2D.load(`Game/UI/DressingRoom/ClothTex/${cloth.name}.png`, Laya.Handler.create(this, function (tex: Laya.Texture2D): void {
                                        mat.albedoTexture = tex;
                                    }));
                                } else {
                                    const front = cloth.getChildByName(`${cloth.name}_0`) as Laya.SkinnedMeshSprite3D;
                                    const matF = front.skinnedMeshRenderer.material as Laya.UnlitMaterial;
                                    const fSp = new Laya.Sprite;
                                    fSp.loadImage(Laya.LocalStorage.getItem(`${cloth.name}/${_MakeTailor._DIYClothes._ins()._otherPro.texF}`), Laya.Handler.create(this, () => {
                                        matF.albedoTexture = (fSp.texture.bitmap as Laya.Texture2D);
                                        fSp.removeSelf();
                                    }));

                                    const reverse = cloth.getChildByName(`${cloth.name}_1`) as Laya.SkinnedMeshSprite3D;
                                    const matR = reverse.skinnedMeshRenderer.material as Laya.UnlitMaterial;
                                    const rSp = new Laya.Sprite;
                                    rSp.loadImage(Laya.LocalStorage.getItem(`${cloth.name}/${_MakeTailor._DIYClothes._ins()._otherPro.texR}`), Laya.Handler.create(this, () => {
                                        matR.albedoTexture = (rSp.texture.bitmap as Laya.Texture2D);
                                        rSp.removeSelf();
                                    }));
                                }

                            } else {
                                cloth.active = false;
                            }
                        }
                    }
                }
            }
            playAni && _3D._Scene._ins().playDispalyAni();
        }
        changeClothStart(): void {
            const arr = this._getArrByProperty(this._otherPro.putOn, true);
            this.changeClass(this._classify.DIY, arr);
            this.changeClass(this._classify.General, arr);
            this.startSpecialSet();
        }
        /**换装规则*/
        changeCloth(): void {
            const arr = this._getArrByProperty(this._otherPro.putOn, true);
            this.changeClass(this._classify.DIY, arr, true);
            this.changeClass(this._classify.General, arr, true);
        }

        /**进游戏时的特殊设置*/
        private startSpecialSet(): void {
            if (StorageAdmin._bool('DressState').value) {
                _3D._Scene._ins()._GBottoms.active = _3D._Scene._ins()._GTop.active = _3D._Scene._ins()._DBottoms.active = _3D._Scene._ins()._DTop.active = false;
            } else {
                _3D._Scene._ins()._GDress.active = _3D._Scene._ins()._DDress.active = false;
            }
        }

        /**特殊设置*/
        specialSet(part?: string): void {
            if (part === this._part.Dress) {
                StorageAdmin._bool('DressState').value = true;
            } else if (part === this._part.Top || part === this._part.Bottoms) {
                StorageAdmin._bool('DressState').value = false;
            }
            if (StorageAdmin._bool('DressState').value) {
                _3D._Scene._ins().displayDress();
            } else {
                _3D._Scene._ins().displayTopAndBotton();
            }
        }

        changeDIY(): void {
            // this._ImgVar('Front').loadImage(Laya.LocalStorage.getItem(`${_MakeTailor._DIYClothes._ins()._pitchName}/${_MakeTailor._DIYClothes._ins()._otherPro.texF}`));
            // this._ImgVar('Reverse').loadImage(Laya.LocalStorage.getItem(`${_MakeTailor._DIYClothes._ins()._pitchName}/${_MakeTailor._DIYClothes._ins()._otherPro.texR}`));
            // this._ImgVar('Front').width = this._ImgVar('Front').height = 512;
            // this._ImgVar('Reverse').width = this._ImgVar('Reverse').height = 512;
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
                _Clothes._ins().changeCloth();
                _Clothes._ins().specialSet(this._Owner['dataSource']['part']);
            }, null)
        }
    }

    export class DressingRoom extends Admin._SceneBase {

        lwgOnAwake(): void {

            TimerAdmin._frameLoop(1, this, () => {
                _3D._Scene._ins().createMirror(this._ImgVar('MirrorSurface'));
            });

            let DIYArr = _MakeTailor._DIYClothes._ins()._getArrByNoProperty(_MakeTailor._DIYClothes._ins()._otherPro.icon, "");
            // 必须复制
            let copyDIYArr = Tools._ObjArray.arrCopy(DIYArr);
            // 将类型修改为'DIY'
            Tools._ObjArray.modifyProValue(copyDIYArr, _Clothes._ins()._property.classify, 'DIY');
            _Clothes._ins()._addObjectArr(copyDIYArr);
            _Clothes._ins()._List = this._ListVar('List');
            _Clothes._ins()._List.array = _Clothes._ins()._getArrByClassify(_Clothes._ins()._classify.DIY);

            if (copyDIYArr.length > 0) {
                this.switchClassify(this._ImgVar('DIY'));
            } else {
                this.switchClassify(this._ImgVar('Dress'));
            }

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

        }

        UI: _UI;
        lwgOnStart(): void {
            this.UI = new _UI(this._Owner);
            TimerAdmin._frameOnce(10, this, () => {
                this.UI.operationAppear(() => {
                    this.UI.btnCompleteAppear(null, 400);
                });
                this.UI.btnBackAppear(null, 200);
            })
            this.UI.btnCompleteClick = () => {
                this.UI.operationVinish(() => {
                    this.UI.btnBackVinish(() => {
                        this._openScene('Start', true, true);
                    });
                }, 200);
            }
        }

        switchClassify(_element: Laya.Image): void {
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
        }

        lwgButton(): void {
            for (let index = 0; index < this._ImgVar('Part').numChildren; index++) {
                const _element = this._ImgVar('Part').getChildAt(index) as Laya.Image;
                this._btnUp(_element, () => {
                    this.switchClassify(_element);
                }, 'no');
            }
        }
    }
}
export default _DressingRoom.DressingRoom;