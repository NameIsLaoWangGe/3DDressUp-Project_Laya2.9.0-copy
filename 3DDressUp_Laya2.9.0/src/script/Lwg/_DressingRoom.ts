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

        /**
         *将DIY服装汇总进去
         * */
        collectDIY(): any[] {
            let DIYArr = _MakeTailor._DIYClothes._ins()._getArrByNoProperty(_MakeTailor._DIYClothes._ins()._otherPro.icon, "");
            const copyArr = Tools._ObjArray.arrCopy(DIYArr);
            // 将类型修改为'DIY'
            Tools._ObjArray.modifyProValue(copyArr, _Clothes._ins()._property.classify, 'DIY');
            this._addObjectArr(copyArr);
            return copyArr;
        }

        /**
         * 当前服装制作完毕后的换装
         */
        changeAfterMaking(): void {
            _DressingRoom._Clothes._ins().collectDIY();
            _DressingRoom._Clothes._ins().accurateChange(_MakeTailor._DIYClothes._ins()._getPitchProperty('part'), _MakeTailor._DIYClothes._ins()._pitchName);
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
                                    mat.albedoTexture = _Res._list.texture2D[`${cloth.name}`]['texture2D'];
                                } else {
                                    const front = cloth.getChildByName(`${cloth.name}_0`) as Laya.SkinnedMeshSprite3D;
                                    const matF = front.skinnedMeshRenderer.material as Laya.BlinnPhongMaterial;
                                    matF.normalTexture = _Res._list.texture2D[`${cloth.name}_mat_001_n`]['texture2D'];
                                    const fSp = new Laya.Sprite;
                                    fSp.loadImage(Laya.LocalStorage.getItem(`${cloth.name}/${_MakeTailor._DIYClothes._ins()._otherPro.texF}`), Laya.Handler.create(this, () => {
                                        matF.albedoTexture = (fSp.texture.bitmap as Laya.Texture2D);
                                        fSp.removeSelf();
                                    }));

                                    const reverse = cloth.getChildByName(`${cloth.name}_1`) as Laya.SkinnedMeshSprite3D;
                                    const matR = reverse.skinnedMeshRenderer.material as Laya.BlinnPhongMaterial;
                                    matR.normalTexture = _Res._list.texture2D[`${cloth.name}_mat_002_n`]['texture2D'];
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
            _Clothes._ins().collectDIY();
            // console.log(_Clothes._ins()._arr);
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

        /**
         * 精确换装
         * @param {*} partValue 部位
         * @param {string} name 名称
         * @memberof _Clothes
         */
        accurateChange(partValue: any, name: string): void {
            const arr = _Clothes._ins()._getArrByProperty('part', partValue);
            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];
                if (name === element['name']) {
                    element['putOn'] = true;
                } else {
                    element['putOn'] = false;
                }
            }
            // console.log(_Clothes._ins()._arr);
            _MakeTailor._DIYClothes._ins()._setProperty(_MakeTailor._DIYClothes._ins()._pitchName, 'putOn', true);
            _Clothes._ins().changeCloth();
            _Clothes._ins().specialSet(partValue);
            _Clothes._ins()._refreshAndStorage();
        }
    }

    class _Item extends Admin._ObjectBase {
        lwgButton(): void {
            this._btnUp(this._Owner, (e: Laya.Event) => {
                _Clothes._ins().accurateChange(this._Owner['dataSource']['part'], this._Owner['dataSource']['name']);
            }, null)
        }
    }

    export class DressingRoom extends Admin._SceneBase {

        lwgOnAwake(): void {
            _3D._Scene._ins().mirrorSurface = true;
            TimerAdmin._frameLoop(1, this, () => {
                _3D._Scene._ins().createMirror(this._ImgVar('MirrorSurface'));
            });
            const copyDIYArr = _Clothes._ins().collectDIY();
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
                    _3D._Scene._ins().mirrorSurface = false;
                    _3D._Scene._ins().cameraToSprite(this._Owner);
                    this._openScene('Start', true, true);
                    this.UI.btnBackVinish(() => {
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
        // lwgCloseAni(): number {
        //     return 100;
        // }
    }
}
export default _DressingRoom.DressingRoom;