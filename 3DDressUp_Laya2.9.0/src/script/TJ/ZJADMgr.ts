//import { TJ, DP } from "../TJ";
export class shieldTime {
    time: string;//屏蔽时段例如7-19
    status: boolean;//屏蔽状态 true为屏蔽 false为不屏蔽
}

export class ShieldScene {
    status: boolean;
    Scene: string;
}

export class ConfigInfo {
    shareimage: string;
    activestate: number;
    codeVer: string;//需要判断是否屏蔽的版本号
    shieldStatus: boolean;//当前codever的屏蔽状态 true为屏蔽 false为不屏蔽
    ADPoint: string;//正在运用的分享内容 1001:90|1002:10
    shieldCity: string;//屏蔽城市缩写”,“分割 。“all" 为屏蔽全部城市.示例： 南京,上海
    shieldTime: shieldTime;//屏蔽时段 true
    showExport: boolean;
    ShieldScene: ShieldScene;
}


export class ipData {
    country: string;
    province: string;
    city: string;
    ip: string;
    server_time: number;
}

export class IPInfo {
    code: number;
    data: ipData;
}

export enum ShieldLevel  {
    low = 'Low',
    mid = 'Mid',
    high = 'High'
}
export default class ZJADMgr {

    static ins: ZJADMgr;

    tt = Laya.Browser.window.tt;
    shieldLevel: ShieldLevel = ShieldLevel.high;
    //platform recoard key
    prk_init = "platform_init";
    prk_shareTimes = "platform_shareTimes";
    prk_shareTs = "platform_shareTs";
    shareItv = 1 * 3600 * 1000;
    shareMaxTimes = 5;
    shareImgUrl = "http://image.tomatojoy.cn/fkbxs01.jpg";
    shareContent = "消灭方块，人人有责！";

    showVideo: string;
    lureShareInfo: object;

    shieldArea = false;
    shieldUser = false;
    shieldVersion = false;
    shieldtime = false;
    shareTimes = 0;
    lastShareTs = 0;

    configInited = false;
    ipInfoInited = false;

    constructor()  {
        ZJADMgr.ins = this;
        this.requestInfo();
    }

    async GameCfg()  {
        let www = new TJ.Common.WWW("https://h5.tomatojoy.cn/res/" + TJ.API.AppInfo.AppGuid() + "/config/game.json");
        await www.Send();
        if (www.error == null && www.text != null)  {
            this.onGameCfgSuccess(www.text);

            return;
        } else  {
            let www = new TJ.Common.WWW("https://h5.tomatojoy.cn/res/" + TJ.API.AppInfo.AppGuid() + "/config/game.json");
            await www.Send();
            if (www.error == null && www.text != null)  {
                this.onGameCfgSuccess(www.text);
                return;
            } else  {
                let www = new TJ.Common.WWW("https://h5.tomatojoy.cn/res/" + TJ.API.AppInfo.AppGuid() + "/config/game.json");
                await www.Send();
                if (www.error == null && www.text != null)  {
                    this.onGameCfgSuccess(www.text);
                    return;
                }
            }
        }
        return null;
    }

    async  GetIP()  {
        let www = new TJ.Common.WWW("https://api1.tomatojoy.cn/getIp");
        await www.Send();
        if (www.error == null && www.text != null)  {
            this.onGetIpSuccess(www.text);

            return;
        } else  {

            let www = new TJ.Common.WWW("https://api1.tomatojoy.cn/getIp");
            await www.Send();
            if (www.error == null && www.text != null)  {
                this.onGetIpSuccess(www.text);
                return;
            } else  {

                let www = new TJ.Common.WWW("https://api1.tomatojoy.cn/getIp");
                await www.Send();
                if (www.error == null && www.text != null)  {
                    this.onGetIpSuccess(www.text);
                    return;
                } else  {
                    console.log(www.error)
                }
            }
        }
        return null;
    }
    configinfo: ConfigInfo
    onGameCfgSuccess(config)  {


        let _configinfo: ConfigInfo = JSON.parse(config);
        this.configinfo = _configinfo;
        this.configInited = true;
        if (this.ipInfoInited)  {
            this.init();
        }

    }
    iPInfo: IPInfo
    onGetIpSuccess(ipInfo)  {


        let _iPInfo: IPInfo = JSON.parse(ipInfo);
        this.iPInfo = _iPInfo;
        this.ipInfoInited = true;
        if (this.configInited)  {
            this.init();
        }

    }



    requestInfo()  {
        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
            this.GameCfg();
            this.GetIP();
        }
    }
    inited = false;

    onConFigInited: Function;


    init() {
        if (this.configinfo.shieldStatus)  {
            if (TJ.API.AppInfo.VersionName() == this.configinfo.codeVer)
                this.shieldVersion = true;
        }


        if (this.iPInfo != null)  {
            if (this.iPInfo.code == 200)  {
                let m_cityName = this.iPInfo.data.city;
                if (this.configinfo.shieldCity != "")  {

                    if (this.configinfo.shieldCity == "all")  {
                        this.shieldArea = true;
                    } else {
                        this.shieldArea = false;

                        let shieldcities = this.configinfo.shieldCity.split(",");

                        for (var i = 0; i < shieldcities.length; i++)  {

                            if (m_cityName.indexOf(shieldcities[i]) >= 0)  {
                                this.shieldArea = true;
                                break;
                            }
                        }
                    }
                } else  {

                    this.shieldArea = false;
                }
            } else  {

                this.shieldArea = true;
            }
        }
        if (this.configinfo.shieldTime.status)  {
            let timeLimit = this.configinfo.shieldTime.time.split("-");
            let date = new Date();


            if (date.getHours() >= Number(timeLimit[0]) && date.getHours() <= Number(timeLimit[1]))  {
                this.shieldtime = true;
            } else  {
                this.shieldtime = false;
            }

        } else  {
            this.shieldtime = false;
        }





        let launchRes = this.tt.getLaunchOptionsSync();

        console.log(launchRes);
        if (this.configinfo.ShieldScene.status)  {
            let timeLimit = this.configinfo.ShieldScene.Scene.split("|");
            this.shieldUser = timeLimit.indexOf(launchRes.scene) >= 0;
            console.log(this.shieldUser);
        }




        this.inited = true;

        if (this.onConFigInited != null)
            this.onConFigInited();

        let iswifi: boolean = false;

        this.tt.getNetworkType({
            success: (obj) =>  {
                if (obj.networkType == "wifi")  {
                    if (ZJADMgr.ins.shieldArea)  {

                        ZJADMgr.ins.shieldLevel = ShieldLevel.high;
                    } else  {

                        ZJADMgr.ins.shieldLevel = ShieldLevel.low;
                    }

                } else  {
                    ZJADMgr.ins.shieldLevel = ShieldLevel.high;
                }

                if (ZJADMgr.ins.shieldUser)  {

                    ZJADMgr.ins.shieldLevel = ShieldLevel.high;
                }

                if (ZJADMgr.ins.shieldVersion)  {

                    ZJADMgr.ins.shieldLevel = ShieldLevel.high;
                }

                if (ZJADMgr.ins.shieldtime)  {

                    ZJADMgr.ins.shieldLevel = ShieldLevel.high;
                }
                console.log("--------ZJADMgr.ins.shieldLevel-------");
                console.log(ZJADMgr.ins.shieldLevel);
            },
            fail: null,
            complete: null
        })

        this.showVideo = this.configinfo.ADPoint;
    }
    playVideoIndex = 0;
    public CheckPlayVideo()  {
        if (!this.inited)
            return false;
        if (this.shieldLevel == ShieldLevel.low)  {
            if (this.showVideo[this.playVideoIndex % this.showVideo.length] == '0')  {
                this.playVideoIndex++;
                return false;
            } else  {
                this.playVideoIndex++;
                return true;
            }
        }
        return false;
    }






}