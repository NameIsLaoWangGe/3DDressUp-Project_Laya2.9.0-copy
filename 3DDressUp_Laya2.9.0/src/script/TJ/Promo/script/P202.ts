import PromoItem from "./PromoItem";
import Behaviour from "./Behaviour";

export default class P202 extends Behaviour
{
    private static style = "P202";

    private promoList: TJ.Develop.Yun.Promo.List = null;
    private itemList: PromoItem[] = [];

    scroll: Laya.Panel = null;
    layout: Laya.List = null;
    prefab: Laya.Box = null;
    paddingTop = 10;
    paddingBottom = 10;

    async OnAwake()
    {
        this.scroll = this.owner.getChildByName("scroll") as Laya.Panel
        this.layout = this.scroll.getChildByName("layout") as Laya.List;
        this.prefab = this.layout.getCell(0);

        let w = (this.owner as Laya.Box).width - this.paddingTop - this.paddingBottom;
        while (w >= this.prefab.width)
        {
            w = w - this.prefab.width - this.layout.spaceX;
            this.column++;
        }

        TJ.Develop.Yun.Promo.Data.ReportAwake(P202.style);

        this.active = false;

        this.promoList = await TJ.Develop.Yun.Promo.List.Get(P202.style);
        if (this.promoList.count > 0)
        {
            TJ.Develop.Yun.Promo.Data.ReportStart(P202.style);

            this.line = Math.ceil(this.promoList.count / this.column);
            this.layout.repeatX = this.column;
            this.layout.repeatY = this.line;
            for (let i = 0; i < this.layout.cells.length; i++)
            {
                let node = this.layout.getCell(i);
                if (i < this.promoList.count)
                {
                    let item: PromoItem = node.getComponent(PromoItem);
                    if (item != null)
                    {
                        this.itemList.push(item);
                        item.style = P202.style;
                        item.onAwake();
                    }
                    Behaviour.SetActive(node, true);
                }
                else
                {
                    Behaviour.SetActive(node, false);
                }
            }

            this.line = Math.ceil(this.itemList.length / this.column);
            let h = this.paddingTop + this.paddingBottom;
            h += this.prefab.height * this.line + this.layout.spaceY * (this.line - 1);
            this.layout.height = h;
            if (this.scroll.height < this.layout.height)
            {
                this.scroll.vScrollBarSkin = "";
                this.scroll.vScrollBar.rollRatio = 0;
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

    async OnDisable()
    {
        this.promoList = await TJ.Develop.Yun.Promo.List.Get(P202.style);
        for (let item of this.itemList)
        {
            this.LoadIcon(item);
        }
    }

    line = 0;
    column = 0;

    get maxTop()
    {
        return 0;
    }
    get maxBottom()
    {
        let y = this.paddingTop + this.paddingBottom;
        y += this.prefab.height * this.line + this.layout.spaceY * (this.line - 1) - this.scroll.height;
        return y;
    }
    get scrollValue()
    {
        if (this.scroll.vScrollBar != null)
        {
            return this.scroll.vScrollBar.value;
        }
        return 0;
    }
    set scrollValue(v)
    {
        if (this.scroll.vScrollBar != null)
        {
            this.scroll.vScrollBar.value = v;
        }
    }

    toTop = false;
    OnUpdate()
    {
        let deltaTime = Laya.timer.delta / 1000;
        if (this.scroll.height < this.layout.height)
        {
            if (this.scrollValue <= this.maxTop)
            {
                this.toTop = false;
            }
            else if (this.scrollValue >= this.maxBottom)
            {
                this.toTop = true;
            }
            if (this.toTop)
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
            this.scrollValue = this.maxTop;
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
            promoItem.onClick_ = (item) => { this.LoadAndShowIcon(item); };
            promoItem.DoLoad();
            promoItem.infoText.text = 1 + Math.floor(Math.random() * 40) / 10 + "w人在玩";
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

    showing: PromoItem[] = [];
    CheckShow()
    {
        for (let item of this.itemList)
        {
            let i = this.showing.indexOf(item);
            let node = item.owner as Laya.Box;
            let d = Math.abs(-node.y - this.paddingTop - this.prefab.height / 2 + this.scrollValue + this.scroll.height / 2);
            if (d < this.scroll.height / 2)
            {
                if (i < 0)
                {
                    this.showing.push(item);
                    item.OnShow();
                    // console.log("P202 show " + item.data.title);
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
