import { Admin, Tools } from "./Lwg";

 /**胜利宝箱模块*/
 export module VictoryBox {
    /**宝箱列表组件*/
    export let _BoxList: Laya.List;
    /**宝箱数据集合*/
    export let _BoxArray = [];
    /**还可以打开宝箱的次数,初始默认为三次，重写覆盖*/
    export let _canOpenNum: number = 3;
    /**已经领取了几次奖励*/
    export let _alreadyOpenNum: number = 0;
    /**看宝箱可以领取的最大次数*/
    export let _adsMaxOpenNum: number = 6;
    /**第几次打开宝箱界面*/
    export let _openVictoryBoxNum: number = 0;
    /**当前被选中的那个宝箱是什么宝箱*/
    export let _selectBox: string;
    /**
     * 通过名称获取宝箱的一个属性值
     * @param name 宝箱名称
     * @param property 宝箱属性名称
     * */
    export function getProperty(name: string, property: string): any {
        let pro = null;
        for (let index = 0; index < _BoxArray.length; index++) {
            const element = _BoxArray[index];
            if (element['name'] === name) {
                pro = element[property];
                break;
            }
        }
        if (pro !== null) {
            return pro;
        } else {
            console.log(name + '找不到属性:' + property, pro);
            return null;
        }
    }

    /**
     * 通过名称设置或者增加一个宝箱的一个属性值
     * @param name 宝箱名称
     * @param property 宝箱属性名称
     * @param value 需要设置或者增加的属性值
     * */
    export function setProperty(name: string, property: string, value: any): void {
        for (let index = 0; index < _BoxArray.length; index++) {
            const element = _BoxArray[index];
            if (element['name'] === name) {
                element[property] = value;
                break;
            }
        }
        if (_BoxList) {
            _BoxList.refresh();
        }
    }

    /**宝箱属性*/
    export enum BoxProperty {
        /**奖励名称*/
        name = 'name',
        /**奖励类型*/
        rewardType = 'rewardType',
        /**奖励数量*/
        rewardNum = 'rewardNum',
        /**是否已经被打开*/
        openState = 'openState',
        /**是否需要看广告*/
        ads = 'ads',
        /**是否被选中*/
        select = 'select',
    }

    /**事件类型*/
    export enum EventType {
        /**开宝箱*/
        openBox = 'openBox',
    }
    /**胜利宝箱场景父类*/
    export class VictoryBoxScene extends Admin._SceneBase {
        moduleOnAwake(): void {
            /**结构，如果没有则为null*/
            VictoryBox._BoxList = this._Owner['MyList'];
            //注意这里要复制数组，不可以直接赋值
            _BoxArray = Tools._ObjArray.arrCopy(Laya.loader.getRes("GameData/VictoryBox/VictoryBox.json")['RECORDS']);
            _selectBox = null;
            _canOpenNum = 3;
            _openVictoryBoxNum++;
            _adsMaxOpenNum = 6;
            _alreadyOpenNum = 0;
        }
        moduleOnEnable(): void {
            this.boxList_Create();
        }
        /**初始化list*/
        boxList_Create(): void {
            VictoryBox._BoxList.selectEnable = true;
            // VictoryBox._BoxList.vScrollBarSkin = "";//不需要移动时，就不设置移动条
            // this._ShopList.scrollBar.elasticBackTime = 0;//设置橡皮筋回弹时间。单位为毫秒。
            // this._ShopList.scrollBar.elasticDistance = 500;//设置橡皮筋极限距离。
            VictoryBox._BoxList.selectHandler = new Laya.Handler(this, this.boxList_Scelet);
            VictoryBox._BoxList.renderHandler = new Laya.Handler(this, this.boxList_Update);
            this.boxList_refresh();
        }
        /**list选中监听*/
        boxList_Scelet(index: number): void { }
        /**list列表刷新*/
        boxList_Update(cell, index: number): void { }
        /**刷新list数据,重写覆盖，默认为皮肤*/
        boxList_refresh(): void {
            if (VictoryBox._BoxList) {
                VictoryBox._BoxList.array = _BoxArray;
                VictoryBox._BoxList.refresh();
            }
        }
    }
}
