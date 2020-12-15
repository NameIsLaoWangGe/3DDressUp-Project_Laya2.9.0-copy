import { Admin, Animation2D, DataAdmin, TimerAdmin, Tools } from "./Lwg";
import { _MakeTailor } from "./_MakeTailor";
import { _Res } from "./_PreLoad";
import { _PropTry } from "./_PropTry";

export module _DressingRoom {
    export class _Clothes extends DataAdmin._Table {
        private static ins: _Clothes;
        static _ins() {
            if (!this.ins) {
                this.ins = new _Clothes('ClothesGeneral', _Res._list.json.GeneralClothes.dataArr, true);
                this.ins._Scene3D = _Res._list.scene3D.MakeClothes.Scene;
                this.ins._Role = this.ins._Scene3D.getChildByName('Role') as Laya.MeshSprite3D;
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

        private changeClass(classify: string, partArr: Array<any>): void {
            const Root = this._Role.getChildByName('Root') as Laya.MeshSprite3D;
            const DIY = Root.getChildByName(classify) as Laya.MeshSprite3D;
            for (let i = 0; i < DIY.numChildren; i++) {
                const Sp = DIY.getChildAt(i) as Laya.MeshSprite3D;
                Sp.active = false;
                for (let j = 0; j < partArr.length; j++) {
                    const obj = partArr[j];
                    if (obj[this._otherPro.part] === Sp.name) {
                        Sp.active = true;
                        for (let k = 0; k < Sp.numChildren; k++) {
                            const cloth = Sp.getChildAt(k) as Laya.SkinnedMeshSprite3D;
                            if (cloth.name === obj[this._property.name]) {
                                cloth.active = true;
                                if (!cloth.skinnedMeshRenderer.material) {
                                    cloth.skinnedMeshRenderer.material = new Laya.BlinnPhongMaterial();
                                }
                                Laya.Texture2D.load(`Game/UI/DressingRoom/ClothTex/${cloth.name}.png`, Laya.Handler.create(this, function (tex: Laya.Texture2D): void {
                                    (cloth.skinnedMeshRenderer.material as Laya.BlinnPhongMaterial).albedoTexture = tex;
                                }));
                            } else {
                                cloth.active = false;
                            }
                        }
                    }
                }
            }
        }
        /**换装规则*/
        change(): void {
            const arr = this._getPropertyArr(this._otherPro.putOn, true);
            this.changeClass(this._classify.DIY, arr);
            this.changeClass(this._classify.General, arr);
        }
        diychange(obj: any): void {
            obj[this._property.classify];
        }
    }

    class _Item extends Admin._ObjectBase {
        lwgButton(): void {
            this._btnUp(this._Owner, (e: Laya.Event) => {
                _Clothes._ins()._setPitch(this._Owner['_dataSource'][_Clothes._ins()._property.name]);
            }, null)
        }
    }

    export class DressingRoom extends Admin._SceneBase {

        lwgOnAwake(): void {
            let DIYArr = _MakeTailor._DIYClothes._ins()._getNoPropertyArr(_MakeTailor._DIYClothes._ins()._otherPro.icon, "");
            // 必须复制
            let copyDIYArr = Tools._ObjArray.arrCopy(DIYArr);
            _Clothes._ins()._addObjectArr(copyDIYArr);
            _Clothes._ins()._List = this._ListVar('List');
            _Clothes._ins()._List.array = _Clothes._ins()._getArrByClassify(_Clothes._ins()._classify.DIY)
            if (_Clothes._ins()._List.array.length > 0) {
                _Clothes._ins()._pitchName = _Clothes._ins()._List.array[0]['name'];
            }
            this._ImgVar('DIY').skin = `Game/UI/Common/kuang_fen.png`;
            const Icon = this._ImgVar('DIY').getChildAt(0) as Laya.Image;
            Icon.skin = `Game/UI/DressingRoom/ClassIcon/${this._ImgVar('DIY').name}_s.png`;
            _Clothes._ins()._listRender = (Cell: Laya.Box, index: number) => {
                let data = Cell.dataSource;
                let Icon = Cell.getChildByName('Icon') as Laya.Image;
                const Board = Cell.getChildByName('Board') as Laya.Image;
                if (data[_Clothes._ins()._property.pitch]) {
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
        lwgAdaptive(): void {
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
                                // 部位
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