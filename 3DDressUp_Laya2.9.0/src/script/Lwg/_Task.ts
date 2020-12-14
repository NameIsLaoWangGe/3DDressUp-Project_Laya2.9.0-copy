import { Admin, Tools } from "./Lwg";

/**任务模块*/
export module _Task {
    /**任务种类集合*/
    export let _allClassifyArr = [];
    /**任种类切换页*/
    export let _TaskTap: Laya.Tab;
    /**假如还有一个任切换页_OtherTap*/
    export let _OtherTap: Laya.Tab;
    /**任务列表*/
    export let _TaskList: Laya.List;

    /**每日任务数据集合*/
    export let _everydayTask: Array<any>;
    /**非每日任务集合*/
    export let _perpetualTask: Array<any>;

    /**今日日期*/
    export let _todayDate = {
        /**获取存储的日期*/
        get date(): number {
            return Laya.LocalStorage.getItem('Task_todayDate') ? Number(Laya.LocalStorage.getItem('Task_todayDate')) : null;
        },
        /**设置存储的日期*/
        set date(date: number) {
            Laya.LocalStorage.setItem('Task_todayDate', date.toString());
        }
    };
    /**
    * 通过名称获取任务的一个属性值
    * @param ClassName 任务类型名称
    * @param name 任务名称
    * @param property 任务属性
    * */
    export function _getProperty(ClassName: string, name: string, property: string): any {
        let pro = null;
        let arr = _getClassArr(ClassName);
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
     * 通过名称设置或者增加一个任务的一个属性值,并且刷新list列表
     * @param goodsClass 任务类型
     * @param ClassName 任务名称
     * @param property 设置或者增加任务属性名称
     * @param value 需要设置或者增加的属性值
     * */
    export function _setProperty(ClassName: string, name: string, property: string, value: any): void {
        let arr = _getClassArr(ClassName);
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            if (element['name'] === name) {
                element[property] = value;
                break;
            }
        }
        let data = {};
        data[ClassName] = arr;
        Laya.LocalStorage.setJSON(ClassName, JSON.stringify(data));

        if (_TaskList) {
            _TaskList.refresh();
        }
    }

    /**根据任务类型返回任务数组*/
    export function _getClassArr(ClassName: string): Array<any> {
        let arr = [];
        switch (ClassName) {
            case _Classify.everyday:
                arr = _everydayTask;
                break;
            case _Classify.perpetual:
                arr = _perpetualTask;
                break;
            default:
                break;
        }
        return arr;
    }

    /**
     * 通过resCondition/condition，做任务并且完成了这次任务，然后检总进度是否完成,并且设置成完成状态,返回false表示任务没有完成，true代表刚好完成奖励未领取，-1代表任务完成了也领取了奖励
     * @param calssName 任务种类
     * @param name 任务名称
     * @param number 做几次任务，不传则默认为1次
     */
    export function _doDetection(calssName: string, name: string, number?: number): any {
        if (!number) {
            number = 1;
        }
        let resCondition = _Task._getProperty(calssName, name, _Task._Property.resCondition);
        let condition = _Task._getProperty(calssName, name, _Task._Property.condition);
        if (_Task._getProperty(calssName, name, _Task._Property.get) !== -1) {
            if (condition <= resCondition + number) {
                _Task._setProperty(calssName, name, _Task._Property.resCondition, condition);
                _Task._setProperty(calssName, name, _Task._Property.get, 1);
                if (_TaskList) {
                    _TaskList.refresh();
                }
                return true;
            } else {
                _Task._setProperty(calssName, name, _Task._Property.resCondition, resCondition + number);
                if (_TaskList) {
                    _TaskList.refresh();
                }
                return false;
            }
        } else {
            return -1;
        }
    }

    /**任务属性列表，数据表中的任务应该有哪些属性,name和have是必须有的属性,可以无限增加*/
    export enum _Property {
        /**名称*/
        name = 'name',
        /**任务解释*/
        explain = 'explain',
        /**任务类型*/
        CompeletType = 'CompeletType',
        /**需要完成任务的总数*/
        condition = 'condition',
        /**根据获取途径，剩余需要条件的数量，会平凡改这个数量*/
        resCondition = 'resCondition',
        /**奖励类型*/
        rewardType = 'rewardType',
        /**奖励数量*/
        rewardNum = 'rewardNum',
        /**排列顺序*/
        arrange = 'arrange',
        /**剩余可完成次数,为零时将不可继续进行*/
        time = 'time',
        /**是否有可领取的奖励,有三种状态，1代表有奖励未领取，0表示任务没有完成，-1代表今天任务完成了也领取了奖励*/
        get = 'get',
    }

    /**任务中的任务大致类别,同时对应图片地址的文件夹*/
    export enum _Classify {
        /**每日任务*/
        everyday = 'Task_Everyday',
        /**永久性任务*/
        perpetual = 'Task_Perpetual',
    }

    /**事件名称*/
    export enum _Event {
        /**领取奖励*/
        getAward = 'Task_getAward',
        /**每次点击广告获得金币*/
        adsGetAward_Every = 'Task_adsGetAward_Every',
        /**试用皮肤*/
        useSkins = 'Task_useSkins',
        /**胜利*/
        victory = 'Task_victory',
        /**看广告的次数*/
        adsTime = 'Task_adsTime',
        /**看广告的次数*/
        victoryBox = 'Task_victoryBox',
    }
    /**完成方式列举,方式可以添加*/
    export enum _CompeletType {
        /**看广告*/
        ads = 'ads',
        /**胜利次数*/
        victory = 'victory',
        /**使用皮肤次数*/
        useSkins = 'useSkins',
        /**开宝箱次数*/
        treasureBox = 'treasureBox',
    }
    /**任务类型名称*/
    export enum _Name {
        观看广告获得金币 = "观看广告获得金币",
        每日服务10位客人 = "每日服务10位客人",
        每日观看两个广告 = "每日观看两个广告",
        每日使用5种皮肤 = "每日使用5种皮肤",
        每日开启10个宝箱 = "每日开启10个宝箱"
    }
    /**在loding界面或者开始界面执行一次！*/
    export function _init(): void {
        //如果上个日期等于今天的日期，那么从存储中获取，如果不相等则直接从数据表中获取
        // if (_todayDate.date !== (new Date).getDate()) {
        //     _Task._everydayTask = Laya.loader.getRes('LwgGameData/Task/_everydayTask.json')['RECORDS'];
        //     console.log('不是同一天，每日任务重制！');
        //     _todayDate.date = (new Date).getDate();
        // } else {
        //     _Task._everydayTask = Tools.jsonCompare('LwgGameData/Task/_everydayTask.json', _Classify.everyday, _Property.name);
        //     console.log('是同一天！，继续每日任务');
        // }
    }

    /**对任务场景进行初始化*/
    export class _TaskBase extends Admin._SceneBase {
        moduleOnAwake(): void {
            _allClassifyArr = [_Task._everydayTask];
            _Task._TaskTap = this._Owner['TaskTap'];
            _Task._TaskList = this._Owner['TaskList'];
        }
        moduleOnEnable(): void {
            this.lwgTapCreate();
            this.lwgListCreate();
        }
        /**Tap初始化*/
        lwgTapCreate(): void {
            _Task._TaskList.selectHandler = new Laya.Handler(this, this.lwgTapSelect);
        }
        /**taskTap的触摸监听,重写覆盖*/
        lwgTapSelect(index: number): void { }
        /**初始化list*/
        lwgListCreate(): void {
            _Task._TaskList.selectEnable = true;
            _Task._TaskList.vScrollBarSkin = "";
            // this._ShopList.scrollBar.elasticBackTime = 0;//设置橡皮筋回弹时间。单位为毫秒。
            // this._ShopList.scrollBar.elasticDistance = 500;//设置橡皮筋极限距离。
            _Task._TaskList.selectHandler = new Laya.Handler(this, this.lwgListScelet);
            _Task._TaskList.renderHandler = new Laya.Handler(this, this.lwgListUpdate);
            if (_allClassifyArr[0]) {
                _Task._TaskList.array = _allClassifyArr[0];
                this.lwgAddItemComponent();
            }
        }
        /**list选中监听,重写覆盖*/
        lwgListScelet(index: number): void { }
        /**list列表刷新,重写覆盖*/
        lwgListUpdate(cell: Laya.Box, index: number): void { }
        lwgAddItemComponent(): void {
            for (let index = 0; index < _Task._TaskList.cells.length; index++) {
                const element = _Task._TaskList.cells[index];
                if (!element.getComponent(TaskItem)) {
                    element.addComponent(TaskItem);
                }
            }
        }
    }
    /**可以手动挂在脚本中的类，全脚本唯一的默认导出，也可动态添加，动态添加写在模块内更方便*/
    export  class Task extends _Task._TaskBase {
    }

    /**列表脚本*/
    export class TaskItem extends Admin._ObjectBase {

    }
}
export default _Task.Task

