import PromoItem from "./PromoItem";
import Behaviour from "./Behaviour";

export default class P201 extends Behaviour
{
    private static style = "P201";

    private static promoList: TJ.Develop.Yun.Promo.List = null;

    public promoItem: PromoItem = null;

    /** @prop {name:shake,type:Bool} */
    public shake = false;

    async OnAwake()
    {
        this.promoItem = this.owner.getComponent(PromoItem);

        TJ.Develop.Yun.Promo.Data.ReportAwake(P201.style);
        this.promoItem.style = P201.style;

        this.active = false;
    
        if (Laya.Browser.onIOS && TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt) {
            return;
        }
        if (P201.promoList == null)
        {
            let list = await TJ.Develop.Yun.Promo.List.Get(P201.style);
            if (P201.promoList == null) P201.promoList = list;
        }
        if (P201.promoList.count > 0)
        {
            TJ.Develop.Yun.Promo.Data.ReportStart(P201.style);
            this.active = true;
        }
        else
        {
            this.owner.destroy();
        }
    }

    OnEnable()
    {
        this.LoadAndShowIcon();
    }

    OnDisable()
    {
        if (P201.promoList != null)
        {
            P201.promoList.Unload(this.promoItem.data);
        }
    }

    private animTime: number = 0;
    private refrTime: number = 0;
    OnUpdate()
    {
        let deltaTime = Laya.timer.delta / 1000;
        this.refrTime += deltaTime;
        if (this.refrTime > 5)
        {
            this.refrTime -= 5;
            this.LoadAndShowIcon();
        }
        if (!this.shake) return;
        this.animTime += deltaTime;
        this.animTime %= 2.5;
        if (this.animTime <= .75)
        {
            (this.promoItem.owner as Laya.Box).rotation = Math.sin(this.animTime * 6 * Math.PI) * 25 * (1 - this.animTime / .75);
        }
        else
        {
            (this.promoItem.owner as Laya.Box).rotation = 0;
        }
    }


    LoadIcon()
    {
        let data = P201.promoList.Load();
        if (data != null)
        {
            P201.promoList.Unload(this.promoItem.data);
            this.promoItem.data = data;
            this.promoItem.onClick_ = () => { this.LoadAndShowIcon(); };
            this.promoItem.DoLoad();
        }
        return data;
    }
    LoadAndShowIcon()
    {
        if (this.LoadIcon() != null)
        {
            this.promoItem.OnShow();
        }
        else
        {
            if (this.promoItem.data == null)
            {
                this.owner.destroy();
            }
        }
    }
}
