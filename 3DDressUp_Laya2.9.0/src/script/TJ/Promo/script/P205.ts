import PromoItem from "./PromoItem";
import Behaviour from "./Behaviour";

export default class P205 extends Behaviour
{
    private static style = "P205";

    private promoList: TJ.Develop.Yun.Promo.List = null;
    private itemList: PromoItem[] = [];

    scroll: Laya.Panel = null;
    layout: Laya.List = null;
    prefab: Laya.Box = null;
    paddingTop = 10;
    paddingBottom = 10;

    move: Laya.Box = null;

    show: Laya.Button = null;

    hide: Laya.Button = null;

    maxX = 620;
    async OnAwake()
    {
        this.move = this.owner.getChildByName("move") as Laya.Box;
        let button = this.move.getChildByName("button") as Laya.Box;
        this.show = button.getChildByName("show") as Laya.Button;
        this.hide = button.getChildByName("hide") as Laya.Button;
        let board = this.move.getChildByName("board") as Laya.Box;
        this.scroll = board.getChildByName("scroll") as Laya.Panel
        this.layout = this.scroll.getChildByName("layout") as Laya.List;
        this.prefab = this.layout.getCell(0);

        this.show.clickHandler = new Laya.Handler(null, () => { this.Show(); });
        this.hide.clickHandler = new Laya.Handler(null, () => { this.Hide(); });

        let w = this.scroll.width - this.paddingTop - this.paddingBottom;
        while (w >= this.prefab.width)
        {
            w = w - this.prefab.width - this.layout.spaceX;
            this.column++;
        }

        TJ.Develop.Yun.Promo.Data.ReportAwake(P205.style);

        if ((this.show.parent as Laya.Box).scaleX < 0) this.maxX = -this.maxX;

        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt)
        {
            return;
        }

        this.active = false;
        this.promoList = await TJ.Develop.Yun.Promo.List.Get(P205.style);
        if (this.promoList.count > 0)
        {
            TJ.Develop.Yun.Promo.Data.ReportStart(P205.style);

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
                        item.style = P205.style;
                        item.onAwake();
                    }
                    node.active = node.visible = true;
                }
                else
                {
                    node.active = node.visible = false;
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

    line = 0;
    column = 0;
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

    public Show()
    {
        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt)
        {
            let param = new TJ.API.Promo.Param();
            param.extraData = { "TJ_App": TJ.API.AppInfo.AppGuid() };
            TJ.API.Promo.Pop(param);
            return;
        }
        this.targetX = this.maxX;
        this.show.active = this.show.visible = false;
        this.hide.active = this.hide.visible = true;
        this.scrollValue = 0;
    }
    public Hide()
    {
        this.targetX = 0;
        this.showing = [];
    }
    targetX: number = 0;
    OnUpdate()
    {
        let deltaTime = Laya.timer.delta / 1000;
        if (this.move.centerX != this.targetX)
        {
            let d = this.targetX - this.move.centerX;
            let s = 3000 * deltaTime;
            if (d > 0)
            {
                d = Math.min(this.move.centerX + s, this.targetX);
            }
            else
            {
                d = Math.max(this.move.centerX - s, this.targetX);
            }
            this.move.centerX = d;
            if (this.move.centerX == 0)
            {
                this.show.active = this.show.visible = true;
                this.hide.active = this.hide.visible = false;
                window.setTimeout(async () =>
                {
                    this.promoList = await TJ.Develop.Yun.Promo.List.Get(P205.style);
                    for (let item of this.itemList)
                    {
                        this.LoadIcon(item);
                    }
                }, 0);
            }
        }
        else
        {
            if (this.move.centerX == this.maxX)
            {
                this.CheckShow();
            }
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
                    // console.log("P205 show " + item.data.title);
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
