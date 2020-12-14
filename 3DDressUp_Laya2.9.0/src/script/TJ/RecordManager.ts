import { Dialogue } from "../Lwg/Lwg";

export default class RecordManager {
    static Init() {
        RecordManager.grv = new TJ.Platform.AppRt.DevKit.TT.GameRecorderVideo();
    }
    static recording = false;
    static autoRecording = false;
    static lastRecordTime;
    private GRV: TJ.Platform.AppRt.DevKit.TT.GameRecorderVideo = null;
    private isRecordVideoing: boolean = false;   //是否在录屏
    private isVideoRecord: boolean = false;      //是否录屏突破记录
    private videoRecordTimer: number = 0;
    private isHasVideoRecord: boolean = false;      //是否已存在录制
    public static startAutoRecord() {
        if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt) return;
        if (RecordManager.grv == null)
            RecordManager.Init();

        if (RecordManager.recording)
            return;

        RecordManager.autoRecording = true;
        console.log("******************开始录屏");
        RecordManager._start();
        RecordManager.lastRecordTime = Date.now();
    }

    public static stopAutoRecord(): boolean {
        if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt) return;
        if (!RecordManager.autoRecording) {
            console.log("RecordManager.autoRecording", RecordManager.autoRecording);
            return false;
        }
        RecordManager.autoRecording = false;
        RecordManager._end(false);
        if (Date.now() - RecordManager.lastRecordTime > 6000) {
            return true;
        }
        if (Date.now() - RecordManager.lastRecordTime < 3000) {
            console.log("小于3秒");
            return false;
        }
        return true;
    }

    public static startRecord() {

        if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt) return;
        if (RecordManager.autoRecording) {
            this.stopAutoRecord();
        }
        RecordManager.recording = true;
        RecordManager._start();
        RecordManager.lastRecordTime = Date.now();
    }

    public static stopRecord(): boolean {
        if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt) return;
        console.log("time:" + (Date.now() - RecordManager.lastRecordTime));
        if (Date.now() - RecordManager.lastRecordTime <= 3000) {
            return false;
        }

        RecordManager.recording = false;
        RecordManager._end(true);

        return true;
    }

    static grv: TJ.Platform.AppRt.DevKit.TT.GameRecorderVideo;

    public static _start() {
        if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt) return;
        console.log("******************180s  ？？？？？");
        RecordManager.grv.Start(180);//录屏开始
    }
    public static _end(share: boolean) {
        if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt) return;
        console.log("******************180结束 ？？？？？");
        RecordManager.grv.Stop(share);//结束录屏，是否自动调起分享
    }
    public static _share(type: string, successedAc: Function, completedAc: Function = null, failAc: Function = null) {
        if (TJ.API.AppInfo.Channel() != TJ.Define.Channel.AppRt.ZJTD_AppRt) return;
        console.log("******************吊起分享 ？？？？？", RecordManager.grv, RecordManager.grv.videoPath);
        if (RecordManager.grv.videoPath) {
            let p = new TJ.Platform.AppRt.Extern.TT.ShareAppMessageParam();
            p.extra.videoTopics = ["涂鸦小画手", "番茄小游戏", "抖音小游戏"]
            p.channel = "video";
            p.success = () => {
                Dialogue.createHint_Middle("分享成功!");
                successedAc();
            };
            p.fail = () => {
                if (type === 'noAward') {
                    Dialogue.createHint_Middle("分享失败！");
                } else {
                    Dialogue.createHint_Middle("分享成功后才能获取奖励！");
                }
                failAc();
            }
            RecordManager.grv.Share(p);
        }
        else {
            Dialogue.createHint_Middle("暂无视频，玩一局游戏之后分享！");
            // UIMgr.tip("暂无录屏，玩一局游戏可以分享");
        }
    }
}