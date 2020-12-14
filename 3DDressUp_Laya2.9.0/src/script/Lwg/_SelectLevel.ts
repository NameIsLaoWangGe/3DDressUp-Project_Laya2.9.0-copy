// import ADManager, { TaT } from "../TJ/Admanager";
// import { Admin, Click,  Tools, Dialogue, _SceneName, EventAdmin, Animation2D, DataAdmin, Gold } from "./Lwg";
// import { _Execution } from "./_Execution";
// import { _Game } from "./_Game";
// import { _Res } from "./_PreLoad";
// import { _PropTry } from "./_PropTry";
// export module _SelectLevel {
//     export class _Data {
//         static _property = {
//             name: 'name',
//             chName: 'chName',
//             classify: 'classify',
//             unlockWay: 'unlockWay',
//             condition: 'condition',
//             resCondition: 'resCondition',
//             unlock: 'unlock',
//             haveBeenDrawn: 'haveBeenDrawn',
//         };
//         static _classify = {
//             limit: 'limit',
//             animal: 'animal',
//             botany: 'botany',
//             other: 'other',
//         };
//         static _pich = {
//             get classify(): string {
//                 return this['_SelectLevel_pichclassify'] ? this['_SelectLevel_pichclassify'] : 'animal';
//             },
//             set classify(str: string) {
//                 if (_MyList) {
//                     _MyList.array = _Data._getClassifyArr(str);
//                     _MyList.refresh();
//                 }
//                 this['_SelectLevel_pichclassify'] = str;
//             },
//             get customs(): string {
//                 return Laya.LocalStorage.getItem('_SelectLevel_pichcustoms') ? Laya.LocalStorage.getItem('_SelectLevel_pichcustoms') : null;
//             },
//             set customs(str: string) {
//                 _MyList.array = _Data._getClassifyArr(str);
//                 _MyList.refresh();
//                 Laya.LocalStorage.setItem('_SelectLevel_pichcustoms', str.toString());
//             }
//         };

//         static _getClassifyArr(classify: string): Array<any> {
//             let _arr = [];
//             for (const key in this._arr) {
//                 if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
//                     const element = this._arr[key];
//                     if (element[this._property.classify] == classify) {
//                         _arr.push(element);
//                     }
//                 }
//             }
//             return _arr;
//         };
//         static _unlockWay = {
//             free: 'free',
//             gold: 'gold',
//             ads: 'ads',
//         };
//         static get _arr(): Array<string> {
//             if (!this['_SelectLevel_Data3']) {
//                 // this['_SelectLevel_Data3'] = DataAdmin._jsonCompare(_Res._list.json.SelectLevel1.url, '_SelectLevel_Data3', _Data._property.name);
//             }
//             return this['_SelectLevel_Data3'];
//         };
//         static set _arr(array: Array<string>) {
//             this['_SelectLevel_Data3'] = array;
//         };
//         // 查看当前名称的关卡是否解锁
//         static _getUnlockByName(name: string): any {
//             let bool: boolean;
//             for (const key in this._arr) {
//                 if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
//                     const element = this._arr[key];
//                     if (element[this._property.name] == name) {
//                         bool = element[this._property.unlock];
//                         break;
//                     }
//                 }
//                 return bool;
//             }
//         };
//         // 获取一个属性值
//         static _getProperty(name: string, pro: string): any {
//             let value: any;
//             for (const key in this._arr) {
//                 if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
//                     const element = this._arr[key];
//                     if (element[this._property.name] == name) {
//                         value = element[pro];
//                         break;
//                     }
//                 }
//             }
//             return value;
//         };
//         // 获取一个属性值
//         static _setProperty(name: string, pro: string, value: any): any {
//             for (const key in this._arr) {
//                 if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
//                     const element = this._arr[key];
//                     if (element[this._property.name] == name) {
//                         element[pro] = value;
//                         _MyList.refresh();
//                         Laya.LocalStorage.setJSON('_SelectLevel_Data3', JSON.stringify(this._arr));
//                         break;
//                     }
//                 }
//             }
//             return value;
//         };

//         /**
//          *已经绘制过的图片进行保存
//          * @param {string} imgSkin 图片
//          * @param {string} [name] 关卡名称，默认为当前关卡
//          * @memberof _data
//          */
//         static _setHaveBeenDrawn(imgSkin: string, name?: string): void {
//             for (const key in this._arr) {
//                 if (Object.prototype.hasOwnProperty.call(this._arr, key)) {
//                     const element = this._arr[key];
//                     name = name ? name : this._pich.customs;
//                     if (element[this._property.name] == name) {
//                         element[this._property.haveBeenDrawn] = imgSkin;
//                         Laya.LocalStorage.setJSON('_SelectLevel_Data3', JSON.stringify(this._arr));
//                     }
//                 }
//             }
//         }
//     }

//     export let _comeFrom: string = _SceneName.SelectLevel;

//     export enum _Event {
//         _SelectLevel_Close = '_SelectLevel_Close',
//         _OpenTiliBuC = '_OpenTiliBuC',
//         _OpenTiliBuC2 = '_OpenTiliBuC2',
//     }
//     export function _init(): void {

//         _Data._pich.classify='limit'
//         _Data._pich.customs='laowugui'

//         // let arr = Laya.LocalStorage.getJSON('_SelectLevel_Data3');
//         // for (let index = 0; index < arr.length; index++) {
//         //     const element = _Data._arr[index];
//         //     if (element[_Data._property.unlock]) {
//         //         arr.push(element['name']);
//         //     }
//         // }
//         // let arr4 = [];
//         // for (let index = 0; index < arr4.length; index++) {
//         //     const element1 = arr4[index];
//         //     for (let index = 0; index < arr.length; index++) {
//         //         const element2 = arr[index];
//         //         if (element1['name'] == element2['name']) {
//         //             element2[_Data._property.unlock] = true;
//         //         }
//         //     }
//         // }
//         // Laya.LocalStorage.setJSON('_SelectLevel_Data4', JSON.stringify(arr4));
//     }
//     export let _MyList: Laya.List;
//     export class _SelectLevelItem extends Admin._ObjectBase {
//         lwgOnEnable(): void {
//             ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_choosecard');
//             // let Content = this._Owner.getChildByName('Content') as Laya.Image;
//             // let BtnContent = Content.getChildByName('BtnContent') as Laya.Image;
//             // let IconLock = BtnContent.getChildByName('IconLock') as Laya.Image;
//             // Tools.Node.changePovit(IconLock, IconLock.width / 2, IconLock.height / 2);
//             // let ani = () => {
//             //     if (this._Owner['_dataSource'][_Data._property.unlock] && !this._Owner['_dataSource'][_Data._property.haveBeenDrawn]) {
//             //         Animation2D.circulation_scale(IconLock, 0.2, 500, 0, () => {
//             //             ani();
//             //         });
//             //     }
//             // };
//             // ani();
//         }
//         lwgBtnClick(): void {
//             let BtnContent = (this._Owner.getChildByName('Content') as Laya.Image).getChildByName('BtnContent');
//             Click._on(Click._Type.largen, BtnContent, this, null, null, () => {
//                 if (!this.owner['_dataSource'][_Data._property.unlock]) {
//                     switch (this.owner['_dataSource'][_Data._property.unlockWay]) {
//                         case _Data._unlockWay.ads:
//                             ADManager.ShowReward(() => {
//                                 ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_choosecard');
//                                 _Data._setProperty(this._Owner['_dataSource'][_Data._property.name], _Data._property.unlock, true);
//                             });
//                             break;
//                         case _Data._unlockWay.gold:
//                             let num = this.owner['_dataSource'][_Data._property.condition]
//                             if (Gold._num.value >= num) {
//                                 _Data._setProperty(this._Owner['_dataSource'][_Data._property.name], _Data._property.unlock, true);
//                                 Gold._num.value -= num;
//                             } else {

//                                 Dialogue.createHint_Middle('金币不够了！');
//                             }
//                             break;
//                         default:
//                             break;
//                     }
//                 } else {
//                     if (_TiliXT._execution.value >= 2) {
//                         EventAdmin._notify(_SelectLevel._Event._OpenTiliBuC);
//                         ADManager.TAPoint(TaT.PageShow, 'firstHPpage');
//                         ADManager.TAPoint(TaT.BtnShow, 'ADrewardbt_firstHP');
//                         EventAdmin._register(_Event._OpenTiliBuC2, this, () => {
//                             if (this._Owner['_dataSource'][_Data._property.chName] === "乌龟" || this._Owner['_dataSource'][_Data._property.chName] === "小红花" || this._Owner['_dataSource'][_Data._property.chName] === "小汽车") {
//                                 _SelectLevel._Data._pich.customs = this._Owner['_dataSource'][_SelectLevel._Data._property.name];
//                                 Admin._sceneAnimation.presentAni = Admin._sceneAnimation.type.stickIn.random;
//                                 // this.lwgOpenScene(_SceneName.PropTry, false);

//                                 if (_comeFrom == _SceneName.SelectLevel) {
//                                     let levelName = _SceneName.Game + '_' + _SelectLevel._Data._pich.customs;
//                                     this.lwgOpenScene(levelName, true, () => {
//                                         if (!Admin._sceneControl[levelName].getComponent(_Game.Game)) {
//                                             Admin._sceneControl[levelName].addComponent(_Game.Game);
//                                         }

//                                     });
//                                     EventAdmin._notify(_SelectLevel._Event._SelectLevel_Close);
//                                 } else {
//                                     this.lwgCloseScene();
//                                 }


//                             } else {
//                                 // _Data._setProperty(this._Owner['_dataSource'][_Data._property.name], _Data._property.unlock, false);
//                                 _SelectLevel._Data._pich.customs = this._Owner['_dataSource'][_SelectLevel._Data._property.name];
//                                 Admin._sceneAnimation.presentAni = Admin._sceneAnimation.type.stickIn.random;
//                                 // this.lwgOpenScene(_SceneName.PropTry, false);
//                                 if (_comeFrom == _SceneName.SelectLevel) {
//                                     let levelName = _SceneName.Game + '_' + _SelectLevel._Data._pich.customs;
//                                     this.lwgOpenScene(levelName, true, () => {
//                                         if (!Admin._sceneControl[levelName].getComponent(_Game.Game)) {
//                                             Admin._sceneControl[levelName].addComponent(_Game.Game);
//                                         }

//                                     });
//                                     EventAdmin._notify(_SelectLevel._Event._SelectLevel_Close);
//                                 } else {
//                                     this.lwgCloseScene();
//                                 }

//                             }
//                         })

//                     } else {
//                         this.lwgOpenScene("TiliFou", false);
//                     }
//                 }
//                 _MyList.refresh();
//             });




//             let ADjiesuo = (this._Owner.getChildByName('Content') as Laya.Image).getChildByName('ADjiesuo') as Laya.Image;
//             Click._on(Click._Type.noEffect, ADjiesuo, this, null, null, () => {

//                 if (!this.owner['_dataSource'][_Data._property.unlock]) {
//                     switch (this.owner['_dataSource'][_Data._property.unlockWay]) {
//                         case _Data._unlockWay.ads:
//                             ADManager.ShowReward(() => {
//                                 ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_choosecard');
//                                 _Data._setProperty(this._Owner['_dataSource'][_Data._property.name], _Data._property.unlock, true);
//                             });
//                             break;
//                         case _Data._unlockWay.gold:
//                             ADManager.ShowReward(() => {
//                                 ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_choosecard');
//                                 _Data._setProperty(this._Owner['_dataSource'][_Data._property.name], _Data._property.unlock, true);

//                             });
//                             break;
//                         default:

//                             break;
//                     }
//                 }
//                 _MyList.refresh();
//             });
//         }

//     }

//     export class SelectLevelBase extends Admin._SceneBase {
//         moduleOnAwake(): void {
//             ADManager.TAPoint(TaT.PageShow, 'choosecardpage');
//             _MyList = this._ListVar('MyList');
//             _MyList.array = _Data._getClassifyArr(_Data._pich.classify);
//             _MyList.selectEnable = true;
//             _MyList.vScrollBarSkin = "";
//             // this._ShopList.scrollBar.elasticBackTime = 0;//设置橡皮筋回弹时间。单位为毫秒。
//             // this._ShopList.scrollBar.elasticDistance = 500;//设置橡皮筋极限距离。
//             _MyList.selectHandler = new Laya.Handler(this, (index: number) => { });
//             _MyList.renderHandler = new Laya.Handler(this, (cell: Laya.Box, index: number) => {
//                 let _dataSource = cell.dataSource;
//                 let Content = cell.getChildByName('Content') as Laya.Image;
//                 let BtnContent = Content.getChildByName('BtnContent') as Laya.Image;
//                 let ADjiesuo = Content.getChildByName('ADjiesuo') as Laya.Image;
//                 let Name = BtnContent.getChildByName('Name') as Laya.Image;
//                 Name.skin = `Game/UI/SelectLevel/Name/${_dataSource[_Data._property.name]}.png`;
//                 let Xianlu = Content.getChildByName('Xianlu') as Laya.Image;
//                 let IconPen = Content.getChildByName('IconPen') as Laya.Image;
//                 if (index % 3 == 0) {
//                     IconPen.skin = `Game/UI/SelectLevel/IconDress/bi.png`
//                 } else if (index % 2 == 0) {
//                     IconPen.skin = `Game/UI/SelectLevel/IconDress/bz.png`
//                 } else {
//                     IconPen.skin = `Game/UI/SelectLevel/IconDress/shu.png`
//                 }
//                 if (index % 2 !== 0) {
//                     Content.pos(27, 8);
//                     Xianlu.pos(104, 189);
//                     Xianlu.skin = `Game/UI/SelectLevel/xianlu2.png`;
//                     IconPen.scaleX = 1;
//                     IconPen.pos(350, 180);
//                 } else {
//                     Content.pos(363, 10);
//                     Xianlu.pos(-140, 170);
//                     Xianlu.skin = `Game/UI/SelectLevel/xianlu1.png`;
//                     IconPen.scaleX = -1;
//                     IconPen.pos(-31, 195);
//                 }
//                 let IconAds = BtnContent.getChildByName('IconAds') as Laya.Image;
//                 let IconLock = BtnContent.getChildByName('IconLock') as Laya.Image;
//                 let GoldNum = BtnContent.getChildByName('GoldNum') as Laya.Label;
//                 let GoldBoard = BtnContent.getChildByName('GoldBoard') as Laya.Image;


//                 if (!_dataSource[_Data._property.unlock]) {
//                     switch (_dataSource[_Data._property.unlockWay]) {
//                         case _Data._unlockWay.ads:
//                             GoldBoard.visible = GoldNum.visible = false;
//                             IconAds.visible = true;
//                             ADjiesuo.visible = false;
//                             break;
//                         case _Data._unlockWay.free:
//                             GoldBoard.visible = GoldNum.visible = false;
//                             IconAds.visible = false;
//                             ADjiesuo.visible = false;
//                             break;
//                         case _Data._unlockWay.gold:
//                             GoldNum.text = _dataSource[_Data._property.condition];
//                             GoldBoard.visible = GoldNum.visible = true;
//                             IconAds.visible = false;
//                             if (_dataSource[_Data._property.chName] === "丁老太") {
//                                 ADjiesuo.visible = false;
//                             } else {
//                                 ADjiesuo.visible = true;
//                             }

//                             break;
//                         default:
//                             break;
//                     }
//                     IconLock.skin = `Game/UI/SelectLevel/suo.png`;
//                     IconLock.pos(143, 107);
//                 } else {
//                     IconAds.visible = false;
//                     GoldNum.visible = false;
//                     GoldBoard.visible = false;
//                     ADjiesuo.visible = false;
//                     IconLock.skin = `Game/UI/SelectLevel/icon_can.png`;
//                     IconLock.pos(143, 127);
//                 }
//                 let Board2 = BtnContent.getChildByName('Board2') as Laya.Image;
//                 let Pic = Board2.getChildByName('Pic') as Laya.Image;
//                 if (_dataSource[_Data._property.haveBeenDrawn]) {
//                     Pic.skin = _dataSource[_Data._property.haveBeenDrawn];
//                     IconLock.visible = false;
//                     Board2.skin = `Game/UI/SelectLevel/yuan1.png`;
//                 } else {
//                     Pic.skin = null;
//                     IconLock.visible = true;
//                     Board2.skin = `Game/UI/SelectLevel/yuan.png`;
//                 }
//                 if (index == _MyList.array.length - 1) {
//                     IconPen.visible = Xianlu.visible = false;
//                 } else {
//                     IconPen.visible = Xianlu.visible = true;
//                 }
//                 cell.zOrder = index;
//             });
//         }
//     }
//     export class SelectLevel extends _SelectLevel.SelectLevelBase {
//         lwgOnAwake(): void {
//             console.log(_Data._pich.classify);
//             _PropTry._comeFrom = _SceneName.SelectLevel;
//             for (let index = 0; index < this.ImgVar('CutBtn').numChildren; index++) {
//                 const element = this.ImgVar('CutBtn').getChildAt(index) as Laya.Image;
//                 if (element.name == _Data._pich.classify) {
//                     element.y = 11;
//                 } else {
//                     element.y = 69;
//                 }
//             }
//         }
//         lwgAdaptive(): void {
//             this.ImgVar('UiLand').y = Laya.stage.height - 74;
//             this.ImgVar('BtnBack').y = Laya.stage.height - 80;
//             this._ListVar('MyList').height = Laya.stage.height - 320;
//         }
//         lwgEventRegister(): void {
//             EventAdmin._register(_Event._SelectLevel_Close, this, () => {
//                 this.lwgCloseScene();
//             })
//             EventAdmin._register(_Event._OpenTiliBuC, this, () => {
//                 this.ImgVar('TiliTishi').visible = true;
//             })
//         }
//         lwgBtnClick(): void {
//             Click._on(Click._Type.largen, this.ImgVar('BtnBack'), this, null, null, () => {
//                 this.lwgOpenScene(_SceneName.Start);
//             });
//             if (_MyList.cells.length !== 0) {
//                 for (let index = 0; index < _MyList.cells.length; index++) {
//                     const element = _MyList.cells[index];
//                     if (!element.getComponent(_SelectLevelItem)) {
//                         element.addComponent(_SelectLevelItem);
//                     }
//                 }
//             }

//             for (let index = 0; index < this.ImgVar('CutBtn').numChildren; index++) {
//                 const element = this.ImgVar('CutBtn').getChildAt(index) as Laya.Image;
//                 if (element.name == _Data._pich.classify) {
//                     element.y = 11;
//                 } else {
//                     element.y = 69;
//                 }
//                 Click._on(Click._Type.largen, element, this, null, null, (e: Laya.Event) => {
//                     for (let index = 0; index < this.ImgVar('CutBtn').numChildren; index++) {
//                         const Btn = this.ImgVar('CutBtn').getChildAt(index) as Laya.Image;
//                         if (Btn == e.currentTarget) {
//                             Btn.y = 35;
//                             _Data._pich.classify = Btn.name;
//                         } else {
//                             Btn.y = 69;
//                         }
//                     }
//                 });
//             }

//             Click._on(Click._Type.largen, this.ImgVar('SureQ'), this, null, null, () => {
//                 ADManager.ShowReward(() => {
//                     EventAdmin._notify(_SelectLevel._Event._OpenTiliBuC2);
//                     ADManager.TAPoint(TaT.BtnClick, 'ADrewardbt_firstHP');
//                     ADManager.TAPoint(TaT.PageLeave, 'firstHPpage');
//                 });
//             });

//             Click._on(Click._Type.largen, this.ImgVar('GuanQ'), this, null, null, () => {
//                 _TiliXT._execution.value -= 2;
//                 _ShuXing.SKJ += 2;
//                 Laya.LocalStorage.setItem("SKJ", _ShuXing.SKJ.toString());
//                 EventAdmin._notify(_SelectLevel._Event._OpenTiliBuC2);
//                 Dialogue.createHint_Middle(`消耗2点体力`);
//                 ADManager.TAPoint(TaT.PageLeave, 'firstHPpage');
//             });
//         }
//         lwgOnDisable(): void {
//             ADManager.TAPoint(TaT.PageLeave, 'choosecardpage');
//         }
//     }
// }
// export default _SelectLevel.SelectLevel;


