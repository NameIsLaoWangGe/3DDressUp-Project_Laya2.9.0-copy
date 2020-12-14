import { Admin, DateAdmin, Tools } from "./lwg";

/**商城模块,用于购买和穿戴，主要是购买和存储，次要是穿戴*/
export module _Shop {
    /**商品品类集合，重写则规定列表顺序*/
    export let _Classify: Array<Array<any>> = [];
    /**商品种类切换页*/
    export let _ShopTap: Laya.Tab;
    /**假如还有一个商品切换页_OtherTap*/
    export let _OtherTap: Laya.Tab;
    /**商品列表*/
    export let _ShopList: Laya.List;
    /**试用商品名称记录，一般用于皮肤试用,包括试用类别名称和名字*/
    export let _tryGoodRecord: Array<string> = [];

    //皮肤*****************************************************************************************************
    /**皮肤的总数据，存储对象依次为[{名称，获取方式，剩余数量或者次数}]*/
    export let _allSkin = [];
    /**默认皮肤*/
    export let _defaultSkin: string;
    /**当前穿戴的皮肤*/
    export let _currentSkin = {
        get name(): string {
            return Laya.LocalStorage.getItem('Shop_currentSkin') ? Laya.LocalStorage.getItem('Shop_currentSkin') : null;
        },
        set name(name: string) {
            Laya.LocalStorage.setItem('Shop_currentSkin', name);
            if (_currentSkin.name) {
                _useSkinTypeToday.setOnce(_currentSkin.name);
            }
        }
    };

    //默认道具**********************************************************************************************************
    /**所有道具*/
    export let _allProps: Array<any> = [];
    /**当前道具*/
    export let _defaultProp: string;
    /**当前道具*/
    export let _currentProp = {
        get name(): string {
            return Laya.LocalStorage.getItem('Shop_currentProp') ? Laya.LocalStorage.getItem('Shop_currentProp') : null;
        },
        set name(name: string) {
            Laya.LocalStorage.setItem('Shop_currentProp', name);
            if (_currentProp.name) {
                _useSkinTypeToday.setOnce(_currentProp.name);
            }
        }
    };

    //其他道具，第三种物品的统称***********************************************************************************
    /**所有其他道具集合*/
    export let _allOther: Array<any> = [];
    /**默认穿戴的其他道具*/
    export let _defaultOther: string;
    /**当前使用的其他物品*/
    export let _currentOther = {
        get name(): string {
            return Laya.LocalStorage.getItem('Shop_crrentOther') ? Laya.LocalStorage.getItem('Shop_crrentOther') : null;
        },
        set name(name: string) {
            Laya.LocalStorage.setItem('Shop_crrentOther', name);
            if (_currentOther.name) {
                _useSkinTypeToday.setOnce(_currentOther.name);
            }
        }
    };
    /**今日用了商品的种类，用在开始游戏界面，可能会有些任务需要用到*/
    export let _useSkinTypeToday = {
        get array(): Array<string> {
            return Laya.LocalStorage.getJSON('Shop_useSkinType') ? Laya.LocalStorage.getJSON('Shop_useSkinType') : null;
        },
        /**昨日日期*/
        last: {
            /**获取存储的日期*/
            get date(): number {
                return Laya.LocalStorage.getItem('Shop_useSkinType_lastDate') ? Number(Laya.LocalStorage.getItem('Shop_useSkinType_lastDate')) : null;
            },
            /**设置存储的日期*/
            set date(date: number) {
                Laya.LocalStorage.setItem('Shop_useSkinType_lastDate', date.toString());
            }
        },
        setOnce(any: string) {
            if (_useSkinTypeToday.array) {
                let arr = [];
                if (_useSkinTypeToday.last.date !== (new Date).getDate()) {
                    _useSkinTypeToday.last.date = (new Date).getDate();
                    _useSkinTypeToday.array.push(any);
                } else {
                    _useSkinTypeToday.array.push(any);
                    arr = Tools._Array.copy(_useSkinTypeToday.array);
                    arr = Tools._Array.unique03(arr);
                }
                Laya.LocalStorage.setJSON('Shop_useSkinType', JSON.stringify({
                    Shop_useSkinType: arr,
                }));
            }
        }
    };

    /**
     * 通过名称获取商品的一个属性值
     * @param classify 品类名称
     * @param name 商品名称
     * @param property 商品属性
     * */
    export function _getProperty(classify: string, name: string, property: string): any {
        let pro = null;
        let arr = getClassify(classify);
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
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
     * 通过名称设置或者增加一个商品的一个属性值
     * @param classify 品类名称
     * @param name 商品名称
     * @param property 设置或者增加商品属性名称
     * @param value 需要设置或者增加的属性值
     * */
    export function _setProperty(classify: string, name: string, property: string, value: any): void {
        let arr = getClassify(classify);
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            if (element['name'] === name) {
                element[property] = value;
                break;
            }
        }
        let data = {};
        data[classify] = arr;
        Laya.LocalStorage.setJSON(classify, JSON.stringify(data));
        if (_ShopList) {
            _ShopList.refresh();
        }
    }

    /**
     * 返回当前品类中已经拥有的商品
     * @param   classify 商品品类
    */
    export function _getHaveArr(classify: string): Array<any> {
        let arr = getClassify(classify);
        let arrHave = [];
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            if (element[_Property.have]) {
                arrHave.push(element);
            }
        }
        return arrHave;
    }

    /**
     * 返回当前只能用金币购买的商品数组
     * @param classify 商品品类
     * @param have 是否显示获取到的，true为已获得，flase为没有获得，不传则是全部
     * @param excludeCurrent 假设当前的装扮的皮肤恰好是金币购买的，是否排除这个皮肤，默认为不排除
     * */
    export function _getwayGoldArr(classify: string, have?: boolean, excludeCurrent?: boolean) {
        let arr = getClassify(classify);
        let arrNoHave = [];
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            if (have && have !== undefined) {
                if (element[_Property.have] && element[_Property.getway] === _Getway.gold) {
                    arrNoHave.push(element);
                }
            }
            else if (!have && have !== undefined) {
                if (!element[_Property.have] && element[_Property.getway] === _Getway.gold) {
                    arrNoHave.push(element);
                }
            }
            else if (have == undefined) {
                if (element[_Property.getway] === _Getway.gold) {
                    arrNoHave.push(element);
                }
            }
        }

        if (excludeCurrent && excludeCurrent !== undefined) {
            for (let index = 0; index < arrNoHave.length; index++) {
                const element = arrNoHave[index];
                if (element[_Property.name] === _GetCurrent(classify)) {
                    arrNoHave.splice(index, 1);
                    break;
                }
            }
        }
        return arrNoHave;
    }

    /**
     * 返回当前只能通过关卡进度获取的商品品类
     * @param classify 商品品类
     * @param have 是否显示获取到的，true为已获得，flase为没有获得，不传则是全部
     * */
    export function _getwayIneedwinArr(classify: string, have?: boolean) {
        let arr = getClassify(classify);
        let arrIneedwin = [];
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            if (have && have !== undefined) {
                if (element[_Property.have] && element[_Property.getway] === _Getway.ineedwin) {
                    arrIneedwin.push(element);
                }
            } else if (!have && have !== undefined) {
                if (!element[_Property.have] && element[_Property.getway] === _Getway.ineedwin) {
                    arrIneedwin.push(element);
                }
            } else if (have == undefined) {
                if (element[_Property.getway] === _Getway.ineedwin) {
                    arrIneedwin.push(element);
                }
            }
        }
        return arrIneedwin;
    }

    /**根据品类返回当前使用的皮肤*/
    export function _GetCurrent(classify: string): string {
        let _current = null;
        switch (classify) {
            case GoodsClass.Skin:
                _current = _currentSkin.name;
                break;
            case GoodsClass.Props:
                _current = _currentProp.name;
                break;
            case GoodsClass.Other:
                _current = _currentOther.name;
                break;
            default:
                break;
        }
        return _current;
    }

    /**根据品类返回品类名称数组*/
    export function getClassify(classify: string): Array<any> {
        let arr = [];
        switch (classify) {
            case GoodsClass.Skin:
                arr = _allSkin;
                break;
            case GoodsClass.Props:
                arr = _allProps;
                break;
            case GoodsClass.Other:
                arr = _allOther;
                break;

            default:
                break;
        }
        return arr;
    }

    /**
     * 通过resCondition/condition，购买商品，有些商品需要购买很多次，购买后，并且设置成购买状态，返回false表示没有购买完成，true刚好完成，-1已经拥有或者是没有改商品
     * @param calssName 商品种类
     * @param name 商品名称
     * @param number 购买几次，不传则默认为1次
     */
    export function _buyGoods(calssName: string, name: string, number?: number): any {
        if (!number) {
            number = 1;
        }
        let resCondition = _getProperty(calssName, name, _Property.resCondition);
        let condition = _getProperty(calssName, name, _Property.condition);
        let have = _getProperty(calssName, name, _Property.have);
        if (have !== true && have !== null) {
            if (condition <= resCondition + number) {
                _setProperty(calssName, name, _Property.resCondition, condition);
                _setProperty(calssName, name, _Property.have, true);
                if (_ShopList) {
                    _ShopList.refresh();
                }
                return true;
            } else {
                _setProperty(calssName, name, _Property.resCondition, resCondition + number);
                if (_ShopList) {
                    _ShopList.refresh();
                }
                return false;
            }
        } else {
            return -1;
        }
    }

    /**在loding界面或者开始界面执行一次！*/
    export function _init(): void {
        //如果上个日期等于今天的日期，那么从存储中获取，如果不相等则直接从数据表中获取
        // _Shop._allSkin = Tools.jsonCompare('GameData/_Shop/Skin.json', GoodsClass.Skin, _Property.name);
        // _Shop._allProps = Tools.jsonCompare('GameData/_Shop/Props.json', GoodsClass.Props, _Property.name);
        // _Shop._allOther = Tools.jsonCompare('GameData/_Shop/Other.json', GoodsClass.Other, _Property.name);
    }

    /**商品属性列表，数据表中的商品应该有哪些属性,name和have是必须有的属性,可以无限增加*/
    export enum _Property {
        /**名称*/
        name = 'name',
        /**获取途径*/
        getway = 'getway',
        /**根据获取途径，给予需要条件的总量*/
        condition = 'condition',
        /**根据获取途径，剩余需要条件的数量，会平凡改这个数量*/
        resCondition = 'resCondition',
        /**排列顺序*/
        arrange = 'arrange',
        /**获得顺序，我们可能会给予玩家固定的获得顺序*/
        getOder = 'getOder',
        /**是否已经拥有*/
        have = 'have',
    }

    /**获得方式列举,方式可以添加*/
    export enum _Getway {
        /**免费获取*/
        free = 'free',
        /**看广告*/
        ads = 'ads',
        /**特殊页面看广告*/
        adsXD = 'adsXD',
        /**关卡中获得，或者是过了多少关获得*/
        ineedwin = 'ineedwin',
        /**金币购买*/
        gold = 'gold',
        /**钻石购买购买*/
        diamond = 'diamond',
        /**彩蛋获取*/
        easterEgg = 'easterEgg',
        /**其他方式*/
        other = 'other',
    }

    /**商店中的商品大致类别,同时对应图片地址的文件夹*/
    export enum GoodsClass {
        /**皮肤*/
        Skin = 'Shop_Skin',
        /**道具*/
        Props = 'Shop_Props',
        /**其他商品*/
        Other = 'Shop_Other',
    }
    /**事件名称*/
    export enum _Event {
        select = 'select',
    }

    export class _ShopBase extends Admin._SceneBase {
        moduleOnAwake(): void {
            /**结构，如果没有则为null*/
            _Shop._ShopTap = this._Owner['MyTap'];
            _Shop._ShopList = this._Owner['MyList'];
            // if (!_Shop._allSkin) {
            //     _Shop._allSkin = Tools.jsonCompare('GameData/_Shop/Skin.json', GoodsClass.Skin, _Property.name);
            // }
            // if (!_Shop._allProps) {
            //     _Shop._allProps = Tools.jsonCompare('GameData/_Shop/Props.json', GoodsClass.Props, _Property.name);
            // }
            // if (!_Shop._allOther) {
            //     _Shop._allOther = Tools.jsonCompare('GameData/_Shop/Other.json', GoodsClass.Other, _Property.name);
            // }
            _Classify = [_Shop._allSkin, _Shop._allProps, _Shop._allOther];
        }
        moduleOnEnable(): void {
            this.myList_Create();
            this.myTap_Create();
        }
        /**Tap初始化*/
        myTap_Create(): void {
            _Shop._ShopTap.selectHandler = new Laya.Handler(this, this.myTap_Select);
        }
        /**myTap的触摸监听*/
        myTap_Select(index: number): void { }
        /**初始化list*/
        myList_Create(): void {
            _Shop._ShopList.selectEnable = true;
            // _Shop._ShopList.vScrollBarSkin = "";
            // this._ShopList.scrollBar.elasticBackTime = 0;//设置橡皮筋回弹时间。单位为毫秒。
            // this._ShopList.scrollBar.elasticDistance = 500;//设置橡皮筋极限距离。
            _Shop._ShopList.selectHandler = new Laya.Handler(this, this.myList_Scelet);
            _Shop._ShopList.renderHandler = new Laya.Handler(this, this.myList_Update);
            this.myList_refresh();
        }
        /**list选中监听*/
        myList_Scelet(index: number): void { }
        /**list列表刷新*/
        myList_Update(cell, index: number): void { }
        /**刷新list数据,重写覆盖，默认为皮肤*/
        myList_refresh(): void {
            if (_Shop._ShopList && _Classify.length > 0) {
                _Shop._ShopList.array = _Classify[0];
                _Shop._ShopList.refresh();
            }
        }
    }
}