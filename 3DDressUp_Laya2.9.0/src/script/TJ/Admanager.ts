import lwg, { Admin, EventAdmin,Audio, Setting, _SceneName } from "../Lwg/Lwg";
import { _Task } from "../Lwg/_Task";
export default class ADManager {

    public static ShowBanner() {
        // if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
        //     return;
        // }
        let p = new TJ.ADS.Param();
        p.place = TJ.ADS.Place.BOTTOM | TJ.ADS.Place.CENTER;
        TJ.ADS.Api.ShowBanner(p);
    }

    public static CloseBanner() {
        let p = new TJ.ADS.Param();
        p.place = TJ.ADS.Place.BOTTOM | TJ.ADS.Place.CENTER;
        TJ.ADS.Api.RemoveBanner(p);
    }
    public static ShowNormal() {
        // let p = new TJ.ADS.Param();
        // TJ.ADS.Api.ShowNormal(p);
        TJ.API.AdService.ShowNormal(new TJ.API.AdService.Param());
    }
    static showNormal2() {

        TJ.API.AdService.ShowNormal(new TJ.API.AdService.Param());
    }

    /**当前广告奖励的奖励回调函数,用于在其他地方执行这个函数*/
    static CanShowCD: boolean = true;
    public static ShowReward(rewardAction: Function, CDTime: number = 500)//展示激励广告，一般是视频
    {
        if (Admin._platform.ues == Admin._platform.tpye.WebTest || Admin._platform.ues == Admin._platform.tpye.OPPOTest || Admin._platform.ues == Admin._platform.tpye.Research) {
            rewardAction();
            return;
        }
        if (ADManager.CanShowCD) {
            Audio._stopMusic();
            console.log("?????");
            let p = new TJ.ADS.Param();
            p.extraAd = true;//视频结束后通常会追加一次插屏
            let getReward = false;

            p.cbi.Add(TJ.Define.Event.Reward, () => {
                getReward = true;
                Audio._playMusic(Audio._voiceUrl.bgm, 0, 1000);
                if (rewardAction != null) {
                    rewardAction();
                    EventAdmin._notify(_Task._Event.adsTime);
                }
            });

            p.cbi.Add(TJ.Define.Event.Close, () => {

                if (!getReward) {
                    Audio._playMusic(Audio._voiceUrl.bgm, 0, 1000);
                    //UIMgr.show("UISubSkinTry", 2);
                    // Dialog.createHint_Middle(Dialog.HintContent["观看完整广告才能获取奖励哦！"]);
                    console.log('观看完整广告才能获取奖励哦！');
                    Admin._openScene(_SceneName.AdsHint, null, () => {
                        console.log(Admin._sceneControl['AdsHint']);
                        // EventAdmin._notify('setCallBack', [rewardAction])
                        Admin._sceneControl['AdsHint']['AdsHint'].setCallBack(rewardAction);
                    });
                    //TipPanel.ins.showString("观看完整广告才能获取奖励哦！");
                }
            });
            p.cbi.Add(TJ.Define.Event.NoAds, () => {
                Audio._playMusic(Audio._voiceUrl.bgm, 0, 1000);

                //UIMgr.show("UISubSkinTry", 1);
                lwg.Dialogue.createHint_Middle("暂时没有广告，过会儿再试试吧！");
                //TipPanel.ins.showString("暂时没有广告，过会儿再试试吧！");
            });

            TJ.ADS.Api.ShowReward(p);
            ADManager.CanShowCD = false;
            setTimeout(() => {
                ADManager.CanShowCD = true;
            }, CDTime)
        }
        else {
            //提示位 
            //TipPanel.ins.showString("广告准备中");
        }
    }

    static Event(param: string, value: string) {
        console.log("Param:>" + param + "Value:>" + value);
        let p = new TJ.GSA.Param()
        if (value == null) {
            p.id = param;
        }
        else {
            p.id = param + value;
        }
        console.log(p.id)
        TJ.GSA.Api.Event(p);
    }

    static wx = Laya.Browser.window.wx;

    static shareImgUrl = "http://image.tomatojoy.cn/6847506204006681a5d5fa0cd91ce408";
    static shareContent = "涂鸦小画手";
    static initShare() {
        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt) {
            this.wx.onShareAppMessage(() => {
                return {
                    title: this.shareContent,
                    imageUrl: this.shareImgUrl,
                    query: ""
                };
            });

            this.wx.showShareMenu({
                withShareTicket: true,
                success: null,
                fail: null,
                complete: null
            });
        }
    }

    static lureShare() {
        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt) {
            this.wx.shareAppMessage({
                title: this.shareContent,
                imageUrl: this.shareImgUrl,
                query: ""
            });
        }
    }

    static VibrateShort() {
        if (!Setting._shake.switch) {
            return;
        }
        TJ.API.Vibrate.Short();
    }
    static Vibratelong() {
        if (!Setting._shake.switch) {
            return;
        }
        TJ.API.Vibrate.Long();
    }

    public static TAPoint(type: TaT, name: string) {
        let p = new TJ.API.TA.Param();
        p.id = name;
        switch (type) {
            case TaT.BtnShow:
                TJ.API.TA.Event_Button_Show(p);
                break;
            case TaT.BtnClick:
                TJ.API.TA.Event_Button_Click(p);
                break;
            case TaT.PageShow:
                TJ.API.TA.Event_Page_Show(p);
                break;
            case TaT.PageEnter:
                TJ.API.TA.Event_Page_Enter(p);
                break;
            case TaT.PageLeave:
                TJ.API.TA.Event_Page_Leave(p);
                break;
            case TaT.LevelStart:
                TJ.API.TA.Event_Level_Start(p);
                console.log('本关开始打点');
                break;
            case TaT.LevelFail:
                TJ.API.TA.Event_Level_Fail(p);
                console.log('本关失败打点');
                break;
            case TaT.LevelFinish:
                TJ.API.TA.Event_Level_Finish(p);
                console.log('本关胜利打点');

                break;
        }
    }
}

export enum TaT {
    BtnShow,
    BtnClick,
    PageShow,
    PageEnter,
    PageLeave,
    LevelStart,
    LevelFinish,
    LevelFail
}