import { Admin, DateAdmin, Tools } from "./Lwg";
import { _SkinQualified } from "./_SkinQualified";

    /**签到模块*/
    export module CheckIn {
        /**从哪个界面弹出的签到*/
        export let _fromWhich: string = Admin._SceneName.PreLoad;
        /**签到list列表*/
        export let _checkList: Laya.List;
        /**列表信息*/
        export let _checkArray: Array<any>;
        /**上次的签到日期，主要判断今日会不会弹出签到，不一样则弹出签到，一样则不弹出签到*/
        export let _lastCheckDate = {
            get date(): number {
                return Laya.LocalStorage.getItem('Check_lastCheckDate') ? Number(Laya.LocalStorage.getItem('Check_lastCheckDate')) : -1;
            },
            // 日期写数字
            set date(date: number) {
                Laya.LocalStorage.setItem('Check_lastCheckDate', date.toString());
            }
        }
        /**当前签到第几天了，7日签到为7天一个循环*/
        export let _checkInNum = {
            get number(): number {
                return Laya.LocalStorage.getItem('Check_checkInNum') ? Number(Laya.LocalStorage.getItem('Check_checkInNum')) : 0;
            },
            /**次数写数字*/
            set number(num: number) {
                Laya.LocalStorage.setItem('Check_checkInNum', num.toString());
            }
        }

        /**
         * 今天是否已经签到
         */
        export let _todayCheckIn = {
            get bool(): boolean {
                return _lastCheckDate.date == DateAdmin._date.date ? true : false;
            },
        }

        /**
         * 通过名称获取签到的一个属性值
         * @param name 签到名称
         * @param property 签到属性名称
         * */
        export function getProperty(name: string, property: string): any {
            let pro = null;
            for (let index = 0; index < _checkArray.length; index++) {
                const element = _checkArray[index];
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
         * 通过名称设置或者增加一个签到的一个属性值
         * @param className 签到种类
         * @param name 签到类型
         * @param property 签到属性名称
         * @param value 需要设置或者增加的属性值
         * */
        export function setProperty(className, name: string, property: string, value: any): void {
            for (let index = 0; index < _checkArray.length; index++) {
                const element = _checkArray[index];
                if (element['name'] === name) {
                    element[property] = value;
                    break;
                }
            }
            let data = {};
            data[className] = _checkArray;
            Laya.LocalStorage.setJSON(className, JSON.stringify(data));
            if (_checkList) {
                _checkList.refresh();
            }
        }

        /**
         * 是否弹出签到页面
         */
        export function openCheckIn(): void {
            if (!_todayCheckIn.bool) {
                console.log('没有签到过，弹出签到页面！');
                Admin._openScene(Admin._SceneName.CheckIn);
            } else {
                if (_SkinQualified._adsNum.value < 7) {
                    Admin._openScene(Admin._SceneName.SkinQualified);
                }
                console.log('签到过了，今日不可以再签到');
            }
        }

        /**
         * 七日签到，签到一次并且返回今天的奖励
        */
        export function todayCheckIn_7Days(): number {
            _lastCheckDate.date = DateAdmin._date.date;
            _checkInNum.number++;
            setProperty(CheckClass.chek_7Days, 'day' + _checkInNum.number, CheckProPerty.checkInState, true);
            let rewardNum = getProperty('day' + _checkInNum.number, CheckProPerty.rewardNum);
            return rewardNum;
        }

        /**
         * 签到初始化
         * */
        export function init(): void {
            if (_checkInNum.number === 7 && !_todayCheckIn.bool) {
                _checkInNum.number = 0;
                Laya.LocalStorage.removeItem(CheckClass.chek_7Days);
            }
        }

        /**签到种类*/
        export enum CheckClass {
            chek_7Days = 'Chek_7Days',
            chek_15Days = 'Chek_15Days',
            chek_30Days = 'Chek_30Days',
        }

        /**签到中的属性*/
        export enum CheckProPerty {
            /**名称，第几天*/
            name = 'name',
            /**奖励类型*/
            rewardType = 'rewardType',
            /**签到奖励*/
            rewardNum = 'rewardNum',
            /**是否签到过了*/
            checkInState = 'checkInState',
            /**排列顺序*/
            arrange = 'arrange',
        }

        /**事件类型*/
        export enum EventType {
            /**移除签到按钮*/
            removeCheckBtn = 'removeCheckBtn',
        }

        export class CheckInScene extends Admin._SceneBase {
            moduleOnAwake(): void {
                /**结构，如果没有则为null*/
                CheckIn._checkList = this._Owner['CheckList'];
                //注意这里要复制数组，不可以直接赋值
                _checkArray = Tools.jsonCompare('GameData/CheckIn/CheckIn.json', CheckClass.chek_7Days, CheckProPerty.name);
            }
            moduleOnEnable(): void {
                this.checkList_Create();
            }
            moduleEventRegister(): void {

            }
            /**初始化list*/
            checkList_Create(): void {
                CheckIn._checkList.selectEnable = true;
                // CheckIn._checkList.vScrollBarSkin = "";//不需要移动时，就不设置移动条
                // this._ShopList.scrollBar.elasticBackTime = 0;//设置橡皮筋回����时间。单位为毫秒。
                // this._ShopList.scrollBar.elasticDistance = 500;//设置橡皮筋极限距离。
                CheckIn._checkList.selectHandler = new Laya.Handler(this, this.checkList_Scelet);
                CheckIn._checkList.renderHandler = new Laya.Handler(this, this.checkList_Update);
                this.checkList_refresh();
            }
            /**list选中监听*/
            checkList_Scelet(index: number): void { }
            /**list列表刷新*/
            checkList_Update(cell, index: number): void { }
            /**刷新list数据,重写覆盖，默认为皮肤*/
            checkList_refresh(): void {
                if (CheckIn._checkList) {
                    CheckIn._checkList.array = _checkArray;
                    CheckIn._checkList.refresh();
                }
            }
        }
    }