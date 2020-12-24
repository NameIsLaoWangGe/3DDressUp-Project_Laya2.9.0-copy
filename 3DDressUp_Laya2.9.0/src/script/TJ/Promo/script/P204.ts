import PromoItem from "./PromoItem";
import Behaviour from "./Behaviour";

export default class P204 extends Behaviour
{
    private static style = "P204";

    private promoList: TJ.Develop.Yun.Promo.List = null;
    private itemList: PromoItem[] = [];

    scroll: Laya.Panel = null;
    layout: Laya.List = null;
    prefab: Laya.Box = null;
    paddingLeft = 20;
    paddingRight = 20;

    async OnAwake()
    {
        this.scroll = this.owner.getChildByName("scroll") as Laya.Panel
        this.layout = this.scroll.getChildByName("layout") as Laya.List;
        this.prefab = this.layout.getCell(0);

        TJ.Develop.Yun.Promo.Data.ReportAwake(P204.style);

        this.active = false;
        let list = await TJ.Develop.Yun.Promo.List.Get(P204.style);
        if (this.promoList == null) this.promoList = list;
        if (this.promoList.count > 0)
        {
            TJ.Develop.Yun.Promo.Data.ReportStart(P204.style);
            this.layout.repeatX = this.promoList.count;
            for (let i = 0; i < this.layout.cells.length; i++)
            {
                let node = this.layout.getCell(i);
                if (i < this.promoList.count)
                {
                    let item: PromoItem = node.getComponent(PromoItem);
                    if (item != null)
                    {
                        this.itemList.push(item);
                        item.style = P204.style;
                        item.onAwake();
                    }
                    node.active = node.visible = true;
                }
                else
                {
                    node.active = node.visible = false;
                }
            }

            let w = this.paddingLeft + this.paddingRight;
            w += this.prefab.width * this.itemList.length + this.layout.spaceX * (this.itemList.length - 1);
            this.layout.width = w;
            if (this.scroll.width < this.layout.width)
            {
                this.scroll.hScrollBarSkin = "";
                this.scroll.hScrollBar.rollRatio = 0;
            }

            this.layout.width = w;
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

    get maxLeft()
    {
        let x = 0;
        return x;
    }
    get maxRight()
    {
        let x = this.scroll.hScrollBar.max;
        return x;
    }
    get scrollValue()
    {
        if (this.scroll.hScrollBar != null)
        {
            return this.scroll.hScrollBar.value;
        }
        return 0;
    }
    set scrollValue(v)
    {
        if (this.scroll.hScrollBar != null)
        {
            this.scroll.hScrollBar.value = v;
        }
    }

    toLeft = false;
    OnUpdate()
    {
        let deltaTime = Laya.timer.delta / 1000;
        if (this.scroll.width < this.layout.width)
        {
            if (this.scrollValue >= this.maxRight)
            {
                this.toLeft = true;
            }
            else if (this.scrollValue <= this.maxLeft)
            {
                this.toLeft = false;
            }
            if (this.toLeft)
            {
                this.scrollValue -= 50 * deltaTime;
            }
            else
            {
                this.scrollValue += 50 * deltaTime;
            }
        }
        else
        {
            this.layout.x = this.maxLeft;
        }
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

    showing: PromoItem[] = [];
    CheckShow()
    {
        let a = 0;
        for (let item of this.itemList)
        {
            let node = item.owner as Laya.Box;
            let d = Math.abs(node.x - this.scrollValue - this.scroll.width / 2 + node.width / 2 + this.layout.spaceX);
            let i = this.showing.indexOf(item);
            if (d < this.scroll.width / 2)
            {
                if (i < 0)
                {
                    this.showing.push(item);
                    item.OnShow();
                    // console.log("P104 show " + item.data.title);
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
}
