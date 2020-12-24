import PromoItem from "./PromoItem";
import Behaviour from "./Behaviour";

export default class P103 extends Behaviour
{
    private static style = "P103";

    private promoList: TJ.Develop.Yun.Promo.List = null;
    private itemList: PromoItem[] = [];

    layout: Laya.List = null;

    async OnAwake() 
    {
        this.layout = this.owner.getChildByName("layout") as Laya.List;
        let close = this.owner.getChildByName("close") as Laya.Button;
        close.clickHandler = new Laya.Handler(null, () => { this.OnClose() });

        TJ.Develop.Yun.Promo.Data.ReportAwake(P103.style);
        this.active = false;
        this.promoList = await TJ.Develop.Yun.Promo.List.Get(P103.style);
        if (this.promoList.count > 0)
        {
            TJ.Develop.Yun.Promo.Data.ReportStart(P103.style);
            for (let i = 0; i < this.layout.cells.length; i++)
            {
                let node = this.layout.getCell(i);
                if (i < this.promoList.count)
                {
                    let item: PromoItem = node.getComponent(PromoItem);
                    if (item != null)
                    {
                        this.itemList.push(item);
                        item.style = P103.style;
                        item.onAwake();
                    }
                    node.active = node.visible = true;
                }
                else
                {
                    node.active = node.visible = false;
                }
            }
            for (let item of this.itemList)
            {
                this.LoadIcon(item);
            }
            this.active = true;
        }
        else
        {
            this.owner.destroy();
        }
    }

    OnEnable()
    {
        for (let item of this.itemList)
        {
            item.OnShow();
        }
    }

    async OnDisable()
    {
        this.promoList = await TJ.Develop.Yun.Promo.List.Get(P103.style);
        for (let item of this.itemList)
        {
            this.LoadIcon(item);
        }
    }

    LoadIcon(promoItem: PromoItem)
    {
        let data = this.promoList.Load();
        if (data != null)
        {
            this.promoList.Unload(promoItem.data);
            promoItem.data = data;
            promoItem.onClick_ = (item) => { this.LoadAndShowIcon(item); };
            promoItem.DoLoad();
        }
        return data;
    }
    LoadAndShowIcon(promoItem: PromoItem)
    {
        if (this.LoadIcon(promoItem) != null)
        {
            promoItem.OnShow();
        }
    }

    public OnClose()
    {
        let node = this.owner as Laya.Box;
        node.active = node.visible = false;
    }
}
