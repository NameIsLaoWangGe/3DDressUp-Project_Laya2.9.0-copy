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
            }
            return this.ins;
        }
        _classify = {
            Dress: 'Dress',
            Top: 'Top',
            Bottoms: 'Bottoms',
            DIY: 'DIY',
            FaceMask: 'FaceMask',
            Accessories: 'Accessories',
            Shoe: 'Shoe',
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
            Tools._ObjArray.modifyProValue(copyDIYArr, 'classify', 'DIY');
            _Clothes._ins()._addObjectArr(copyDIYArr);
            _Clothes._ins()._List = this._ListVar('List');
            _Clothes._ins()._List.array = _Clothes._ins()._getArrByClassify(_Clothes._ins()._classify.DIY);
            _Clothes._ins()._pitchName = _Clothes._ins()._List.array[0]['name'];
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
            for (let index = 0; index < this._ImgVar('Classfiy').numChildren; index++) {
                const _element = this._ImgVar('Classfiy').getChildAt(index) as Laya.Image;
                this._btnUp(_element, () => {
                    for (let index = 0; index < this._ImgVar('Classfiy').numChildren; index++) {
                        const element = this._ImgVar('Classfiy').getChildAt(index) as Laya.Image;
                        const Icon = element.getChildAt(0) as Laya.Image;
                        if (_element === element) {
                            element.skin = `Game/UI/Common/kuang_fen.png`;
                            Icon.skin = `Game/UI/DressingRoom/ClassIcon/${element.name}_s.png`;
                            let arr = _Clothes._ins()._getArrByClassify(_element.name);
                            _Clothes._ins()._List.array = arr;
                        } else {
                            element.skin = `Game/UI/Common/kuang_bai.png`;
                            Icon.skin = `Game/UI/DressingRoom/ClassIcon/${element.name}.png`;
                        }
                    }
                }, 'no');
            }
        }
    }
}
export default _DressingRoom.DressingRoom;