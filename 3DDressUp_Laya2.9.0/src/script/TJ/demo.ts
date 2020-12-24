export default class test extends Laya.Script
{

    onAwake()
    {
        let pay1 = this.owner.getChildByName("pay1") as Laya.Button;
        let pay2 = this.owner.getChildByName("pay2") as Laya.Button;
        let pay3 = this.owner.getChildByName("pay3") as Laya.Button;
        let restore = this.owner.getChildByName("restore") as Laya.Button;
        let review = this.owner.getChildByName("review") as Laya.Button;
        let banner = this.owner.getChildByName("banner") as Laya.Button;
        let normal = this.owner.getChildByName("normal") as Laya.Button;
        let reward = this.owner.getChildByName("reward") as Laya.Button;
        let vibrateShort = this.owner.getChildByName("vibrateShort") as Laya.Button;
        let vibrateLong = this.owner.getChildByName("vibrateLong") as Laya.Button;
        let userAgreement = this.owner.getChildByName("userAgreement") as Laya.Button;
        let privacyPolicy = this.owner.getChildByName("privacyPolicy") as Laya.Button;

        pay1.clickHandler = new Laya.Handler(null, () => { this.Pay1(); });
        pay2.clickHandler = new Laya.Handler(null, () => { this.Pay2(); });
        pay3.clickHandler = new Laya.Handler(null, () => { this.Pay3(); });
        restore.clickHandler = new Laya.Handler(null, () => { this.Restore(); });
        review.clickHandler = new Laya.Handler(null, () => { this.Review(); });
        banner.clickHandler = new Laya.Handler(null, () => { this.Banner(); });
        normal.clickHandler = new Laya.Handler(null, () => { this.Normal(); });
        reward.clickHandler = new Laya.Handler(null, () => { this.Reward(); });
        vibrateShort.clickHandler = new Laya.Handler(null, () => { this.VibrateShort(); });
        vibrateLong.clickHandler = new Laya.Handler(null, () => { this.VibrateLong(); });
        userAgreement.clickHandler = new Laya.Handler(null, () => { this.UserAgreement(); });
        privacyPolicy.clickHandler = new Laya.Handler(null, () => { this.PrivacyPolicy(); });
    }

    onStart()
    {
        if (window["conch"] != null)
        {
            window["conch"].setOnBackPressedFunction(() =>
            {
                TJ.API.AppCtl.Quit();//调用退出窗（android必接）
            });//注册返回键调用退出窗
        }

        console.log(TJ.API.AppInfo.ProductName());//产品名
        console.log(TJ.API.AppInfo.PackageName());//包名
        console.log(TJ.API.AppInfo.VersionName());//版本名
        console.log(TJ.API.AppInfo.VersionCode());//版本号
        console.log(TJ.API.AppInfo.Channel());//返回上传统计后台对应的渠道名 oppo , vivo , 4399 , meizu ...
        console.log(TJ.API.Billing.Exist());//是否存在内购
        console.log(TJ.API.AdService.Exist());//是否存在广告


        switch (TJ.Engine.RuntimeInfo.platform)//由引擎提供的接口判断当前运行平台
        {
            case TJ.Define.Platform.Android:
                break;
            case TJ.Define.Platform.iOS:
                break;
            case TJ.Define.Platform.AppRt://小游戏
                break;
        }
        switch (TJ.API.AppInfo.Channel())//通过配置文件和运行时对象判断当前运行的渠道平台
        {
            case TJ.Define.Channel.Android.oppo://android oppo
                break;
            case TJ.Define.Channel.AppRt.ZJTD_AppRt://字节小游戏
                break;
        }

        this.Event();
    }

    public Event()//事件统计
    {
        let p = new TJ.API.Analytics.Param()
        p.id = "eventName";//不要使用(./)等特殊符号
        p.dic["extraParam1"] = 1;//事件可附带参数，部分环境下无效，可正常调用
        p.dic["extraParam2"] = "2";
        TJ.API.Analytics.Event(p);
    }


    public Pay1()//调用计费
    {
        let p = new TJ.API.Billing.Param();
        p.product.price = .01;
        p.product.name = "测试计费点1分";
        p.product.description = "这是一个一分钱的测试计费点";
        p.cbi.Add(TJ.Define.Event.Reward, () =>
        {
            console.log("支付成功");
        });
        p.cbi.Add(TJ.Define.Event.NoReward, () =>
        {
            console.log("支付失败");
        });
        TJ.API.Billing.Purchase(p);
    }
    public Pay2()
    {
        let p = new TJ.API.Billing.Param();
        p.product.price = .1;
        p.product.name = "测试计费点1角";
        p.product.description = "这是一个一角钱的测试计费点";
        p.cbi.Add(TJ.Define.Event.Reward, () =>
        {
            console.log("支付成功");
        });
        p.cbi.Add(TJ.Define.Event.NoReward, () =>
        {
            console.log("支付失败");
        });
        TJ.API.Billing.Purchase(p);
    }
    public Pay3()
    {
        let p = new TJ.API.Billing.Param();
        p.product.price = 1.;
        p.product.name = "测试计费点1元";
        p.product.description = "这是一个一元钱的测试计费点";
        p.cbi.Add(TJ.Define.Event.Reward, () =>
        {
            console.log("支付成功");
        });
        p.cbi.Add(TJ.Define.Event.NoReward, () =>
        {
            console.log("支付失败");
        });
        TJ.API.Billing.Purchase(p);
    }

    public Restore()//掉单恢复(主要是Android华为渠道)
    {
        let param = new TJ.API.Billing.Param();
        param.cbi.Add(TJ.Define.Event.Complete, (list: TJ.API.Billing.Param[]) =>
        {
            for (let item of list)
            {
                console.log("restore = " + item.product.name + " = " + item.product.id);//判断商品类型，发放对应奖励
                TJ.API.Billing.Consume(item);//消耗订单
            }
        });
        TJ.API.Billing.QueryAll(param);//查询未发放奖励的订单
    }
    public Review()
    {
        TJ.API.AppCtl.Review();//跳转评价
    }

    public VibrateShort()
    {
        TJ.API.Vibrate.Short();
    }
    public VibrateLong()
    {
        TJ.API.Vibrate.Long();
    }
    public Vibrate()//震动
    {
        TJ.API.Vibrate.Time(0.1);//不支持设置时长的渠道会根据时长转换为长震或短震
    }

    public UserAgreement()
    {
        TJ.API.AppCtl.UserAgreement();//跳转用户协议
    }
    public PrivacyPolicy()
    {
        TJ.API.AppCtl.PrivacyPolicy();//跳转隐私政策
    }
    public AppCtl()
    {
        TJ.API.AppCtl.Quit();//退出应用
    }

    public Banner()//展示横幅广告
    {
        let p = new TJ.API.AdService.Param();
        p.place = TJ.API.AdService.Place.BOTTOM | TJ.API.AdService.Place.CENTER;
        TJ.API.AdService.ShowBanner(p);
    }
    public Normal()//展示插屏广告
    {
        let p = new TJ.API.AdService.Param();
        TJ.API.AdService.ShowNormal(p);
    }
    public Reward()//展示激励广告，一般是视频
    {
        let p = new TJ.API.AdService.Param();
        p.extraAd = true;//视频结束后通常会追加一次插屏
        p.cbi.Add(TJ.Define.Event.Reward, () =>
        {
            console.log("发放奖励");
        });
        p.cbi.Add(TJ.Define.Event.NoAds, () =>
        {
            console.log("没有广告");
        });
        TJ.API.AdService.ShowReward(p);
    }

    public Native()//获取原生广告，使用引擎控件自渲染
    {
        let nad = TJ.API.AdService.LoadNative(new TJ.API.AdService.Param());
        if (nad != null)//判断是否有填充
        {
            nad.title;//标题
            nad.desc;//详情
            nad.iconUrl;//图标
            nad.imgUrl;//大图
            nad.logoUrl;//角标
            nad.OnShow();//上报展示(必须，且在OnClick之前)
            //......
            nad.OnClick();//用户点击时调用，上报点击同时跳转
        }

    }

}