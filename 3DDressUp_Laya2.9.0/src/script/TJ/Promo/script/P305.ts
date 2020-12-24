import PromoItem from "./PromoItem";
import Behaviour from "./Behaviour";
import { GO } from "../../GO";

export default class P305 extends Behaviour
{
    private static style = "P305";

    private promoList: TJ.Develop.Yun.Promo.List = null;

    scroll: Laya.Box = null;
    layout: Laya.Box = null;
    paddingTop = 10;
    paddingBottom = 10;

    move: Laya.Box = null;

    show: Laya.Button = null;

    hide: Laya.Button = null;

    layoutS: P305Layout;

    maxX = 580;
    async OnAwake()
    {
        this.move = this.owner.getChildByName("move") as Laya.Box;
        let button = this.move.getChildByName("button") as Laya.Box;
        this.show = button.getChildByName("show") as Laya.Button;
        this.hide = button.getChildByName("hide") as Laya.Button;
        let board = this.move.getChildByName("board") as Laya.Box;
        this.scroll = board.getChildByName("scroll") as Laya.Box;
        this.layout = this.scroll.getChildByName("layout") as Laya.Box;

        TJ.Develop.Yun.Promo.Data.ReportAwake(P305.style);

        this.show.clickHandler = new Laya.Handler(null, () => { this.Show(); });
        this.hide.clickHandler = new Laya.Handler(null, () => { this.Hide(); });


        this.layoutS = this.layout.addComponent(P305Layout);

        if ((this.show.parent as Laya.Box).scaleX < 0) this.maxX = -this.maxX;

        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.ZJTD_AppRt)
        {
            return;
        }

        this.active = false;
        this.promoList = await TJ.Develop.Yun.Promo.List.Get();
        if (this.promoList.count > 0)
        {
            if (this.layoutS != null)
            {
                for (let i = 0; i < this.promoList.count; i++)
                {
                    this.layoutS.datas.push(this.promoList.Load());
                }
                this.layoutS.Init(this.scroll.width, this.scroll.height);
                this.active = true;
                TJ.Develop.Yun.Promo.Data.ReportStart(P305.style);
            }
            else
            {
                this.owner.destroy();
            }
        }
        else
        {
            this.owner.destroy();
        }
    }

    mouseDown = false;
    lastStageX = 0;
    lastStageY = 0;
    OnStart()
    {

        this.scroll.on(Laya.Event.MOUSE_DOWN, null, (event: Laya.Event) => 
        {
            this.mouseDown = true;
            this.lastStageX = event.stageX;
            this.lastStageY = event.stageY;
        });
        this.scroll.on(Laya.Event.MOUSE_OUT, null, (event: Laya.Event) => 
        {
            this.mouseDown = false;
        });
        this.scroll.on(Laya.Event.MOUSE_UP, null, (event: Laya.Event) => 
        {
            this.mouseDown = false;
        });
        this.scroll.on(Laya.Event.MOUSE_MOVE, null, (event: Laya.Event) => 
        {
            if (this.mouseDown)
            {
                let dx = event.stageX - this.lastStageX;
                let dy = event.stageY - this.lastStageY;
                this.lastStageX = event.stageX;
                this.lastStageY = event.stageY;
                let ty = this.layoutS.node.y + dy;
                this.layoutS.node.y = ty;
            }
        });
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
        this.layout.y = 0;
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
            }
        }
        else
        {
            if (this.move.centerX == this.maxX)
            {
                this.layout.y -= 0.8;
            }
        }
        this.layoutS.Refresh(this.layout.y);
    }

    showing: PromoItem[] = [];
}

class P305Layout extends Behaviour
{
    datas: TJ.Develop.Yun.Promo.Data[] = [];
    items: PromoItem[] = [];

    prefab: Laya.Box = null;

    get node()
    {
        return this.owner as Laya.Box;
    }

    OnAwake()
    {
        this.prefab = this.node.getChildAt(0) as Laya.Box;
        this.prefab.active = this.prefab.visible = false;
    }

    line = 0;
    column = 0;

    Init(width: number, height: number)
    {
        while (width >= this.prefab.width)
        {
            width = width - this.prefab.width - 15;//this.layout.spaceX;
            this.column++;
        }
        while (height >= this.prefab.height)
        {
            height = height - this.prefab.height - 10;//this.layout.spaceY;
            this.line++;
        }
        this.line += 2;
        for (let y = 0; y < this.line; y++)
        {
            for (let x = 0; x < this.column; x++)
            {
                let item = GO.Instantiate(this.prefab).getComponent(PromoItem) as PromoItem;
                this.node.addChild(item.owner);
                item.owner.active = (item.owner as Laya.Box).visible = true;
                this.items.push(item);
                item.onAwake();
            }
        }

    }


    Refresh(posY: number)
    {
        let ic = this.items.length;
        let dc = this.datas.length;

        if (ic < 1) return;
        if (dc < 1) return;

        let uh = this.prefab.height;
        let spaceY = uh + 10;//this.layout.spaceY;
        let spaceX = this.prefab.width + 15;//this.layout.spaceX;

        let k = -posY / spaceY;
        k = Math.floor(k);
        let k1 = Math.floor(k / this.line) * this.line, k2 = k < 0 ? (this.line + k % this.line) % this.line : (k % this.line);

        let checkPos = (item: PromoItem, b: number, l: number, c: number) =>
        {
            let pid = b + l * this.column + c;
            if (item.posId != pid)
            {
                item.posId = pid;
                (item.owner as Laya.Box).x = spaceX * c + this.prefab.width / 2;
                (item.owner as Laya.Box).y = (b + l) * spaceY + this.prefab.height / 2;
                let did = pid < 0 ? (dc + pid % dc) % dc : (pid % dc);
                if (item.dataId != did)
                {
                    item.dataId = did;
                    item.data = this.datas[did];
                    item.data.Load();
                    item.DoLoad();
                }
            }
        };

        for (let l = 0; l < k2; l++)
        {
            for (let c = 0; c < this.column; c++)
            {
                checkPos(this.items[l * this.column + c], k1 + this.line, l, c);
            }
        }
        for (let l = k2; l < this.line; l++)
        {
            for (let c = 0; c < this.column; c++)
            {
                checkPos(this.items[l * this.column + c], k1, l, c);
            }
        }
    }
}
