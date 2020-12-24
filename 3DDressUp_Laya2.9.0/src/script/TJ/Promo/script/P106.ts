import PromoItem from "./PromoItem";
import Behaviour from "./Behaviour";

export default class P106 extends Behaviour
{

    private static style = "P106";

    private promoList: TJ.Develop.Yun.Promo.List = null;
    private itemList: PromoItem[] = [];

    layout: Laya.List = null;
    scrollView: Laya.Panel;

    async OnAwake()
    {
        this.scrollView = this.owner.getChildByName("scroll") as Laya.Panel
        this.layout = this.scrollView.getChildByName("layout") as Laya.List;
        this.scrollView.vScrollBarSkin = "";
        // this.scrollView.vScrollBar.rollRatio = 0;
        let close = this.owner.getChildByName("close") as Laya.Button;
        close.clickHandler = new Laya.Handler(null, () => { this.OnClose() });

        TJ.Develop.Yun.Promo.Data.ReportAwake(P106.style);

        this.active = false;

        let list = await TJ.Develop.Yun.Promo.List.Get(P106.style);
        if (this.promoList == null) this.promoList = list;
        if (this.promoList.count > 0)
        {
            TJ.Develop.Yun.Promo.Data.ReportStart(P106.style);
            this.layout.repeatY = this.promoList.count;
            let h = 0;
            for (let i = 0; i < this.layout.cells.length; i++)
            {
                let node = this.layout.getCell(i);
                if (i < this.promoList.count)
                {
                    let item: PromoItem = node.getComponent(PromoItem);
                    if (item != null)
                    {
                        this.itemList.push(item);
                        item.style = P106.style;
                        item.onAwake();
                    }
                    Behaviour.SetActive(node, true);
                }
                else
                {
                    Behaviour.SetActive(node, false);
                }
                if (i > 0)
                {
                    h += this.layout.spaceY;
                }
                h += node.height;
            }
            this.layout.height = h;
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
        this.scrollValue = 0;
    }

    async OnDisable()
    {
        this.promoList = await TJ.Develop.Yun.Promo.List.Get(P106.style);
        for (let item of this.itemList)
        {
            this.LoadIcon(item);
        }
    }
    OnUpdate()
    {
        this.CheckShow();
    }

    LoadIcon(promoItem: PromoItem)
    {
        let data = this.promoList.Load();
        if (data != null)
        {
            this.promoList.Unload(promoItem.data);
            promoItem.data = data;
            promoItem.onClick_ = (item) => { this.LoadIcon(item); };
            promoItem.DoLoad();
            let i = this.showing.indexOf(promoItem);
            if (i >= 0)
            {
                this.showing.splice(i, 1);
            }
        }
        return data;
    }

    get scrollValue()
    {
        if (this.scrollView.vScrollBar != null)
        {
            return this.scrollView.vScrollBar.value;
        }
        return 0;
    }
    set scrollValue(v)
    {
        if (this.scrollView.vScrollBar != null)
        {
            this.scrollView.vScrollBar.value = v;
        }
    }

    showing: PromoItem[] = [];
    CheckShow()
    {
        for (let item of this.itemList)
        {
            let node = item.owner as Laya.Box;
            let d = Math.abs(node.y - this.scrollValue - this.scrollView.height / 2 + node.height / 2 + this.layout.spaceY);
            let i = this.showing.indexOf(item);
            if (d < this.scrollView.height / 2)
            {
                if (i < 0)
                {
                    this.showing.push(item);
                    item.OnShow();
                    // console.log("P106 show " + item.data.title);
                }
            }
            else
            {
                if (i >= 0)
                {
                    this.showing.splice(i, 1);
                }
            }
        }
    }

    public OnClose()
    {
        let node = this.owner as Laya.Box;
        node.active = node.visible = false;
    }
}
