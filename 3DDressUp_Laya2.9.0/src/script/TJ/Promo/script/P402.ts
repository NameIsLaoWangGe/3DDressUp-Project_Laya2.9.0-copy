import Behaviour from "./Behaviour";
import PromoItem from "./PromoItem";
import { GO } from "../../GO";

export default class P402 extends Behaviour
{
    private static style = "P402";

    scroll: Laya.Box = null;

    layout: Laya.Box = null;

    layoutS: P402Layout;

    shield: boolean;

    get node()
    {
        return this.owner as Laya.Box;
    }

    async OnAwake()
    {
        this.shield = TJ.Develop.Yun.Location.shield;

        this.scroll = this.owner.getChildByName("scroll") as Laya.Box;
        this.layout = this.scroll.getChildByName("layout") as Laya.Box;

        TJ.Develop.Yun.Promo.Data.ReportAwake(P402.style);

        this.layoutS = this.layout.addComponent(P402Layout);

        this.active = false;
        if(this.shield)return;
        let list = await TJ.Develop.Yun.Promo.List.Get();
        if (list != null && list.count > 0)
        {
            if (this.layoutS != null)
            {
                if (this.shield)
                {
                    for (let i = 0; i < Math.min(list.count, 9); i++)
                    {
                        this.layoutS.datas.push(list.Load());
                    }
                }
                else
                {
                    for (let i = 0; i < list.count; i++)
                    {
                        this.layoutS.datas.push(list.Load());
                    }
                }
                this.layoutS.Init(this.scroll.width, this.scroll.height, this.shield);
                this.active = true;
                TJ.Develop.Yun.Promo.Data.ReportStart(P402.style);

                this.targetX = this.layout.x;
            }
            else
            {
                this.node.destroy();
            }
        }
        else
        {
            this.node.destroy();
        }
    }

    async OnDisable()
    {
        if (!this.shield) return;
        let list = await TJ.Develop.Yun.Promo.List.Get();
        if (list != null && list.count > 0)
        {
            this.layoutS.datas = [];
            for (let i = 0; i < Math.min(list.count, 9); i++)
            {
                this.layoutS.datas.push(list.Load());
            }
            this.layoutS.Redata();
        }
    }

    mouseDown = false;
    lastStageX = 0;
    lastStageY = 0;
    OnStart()
    {
        if (this.shield) return;
        let checkPos = () =>
        {
            let d = this.layout.x - this.targetX;
            if (d > 0 && d > this.layoutS.pageSpace / 2)
            {
                this.targetX += this.layoutS.pageSpace;
            }
            else if (d < 0 && d < -this.layoutS.pageSpace / 2)
            {
                this.targetX -= this.layoutS.pageSpace;
            }
        };
        this.scroll.on(Laya.Event.MOUSE_DOWN, null, (event: Laya.Event) => 
        {
            this.mouseDown = true;
            this.lastStageX = event.stageX;
            this.lastStageY = event.stageY;
        });
        this.scroll.on(Laya.Event.MOUSE_OUT, null, (event: Laya.Event) => 
        {
            this.mouseDown = false;
            checkPos();
        });
        this.scroll.on(Laya.Event.MOUSE_UP, null, (event: Laya.Event) => 
        {
            this.mouseDown = false;
            checkPos();
        });
        this.scroll.on(Laya.Event.MOUSE_MOVE, null, (event: Laya.Event) => 
        {
            if (this.mouseDown)
            {
                let dx = event.stageX - this.lastStageX;
                let dy = event.stageY - this.lastStageY;
                this.lastStageX = event.stageX;
                this.lastStageY = event.stageY;
                let tx = this.layoutS.node.x + dx;
                this.layoutS.node.x = tx;
            }
        });
    }

    targetX = 0;
    cd = 0;

    OnUpdate()
    {
        if (this.shield) return;
        if (this.mouseDown)
        {
            this.cd = 0;
        }
        else
        {
            let dt = Laya.timer.delta / 1000;
            this.cd += dt;
            if (this.cd >= 3)
            {
                this.cd -= 3;
                this.targetX -= this.layoutS.pageSpace;
            }
            // this.layout.x -= .8;
            if (this.layout.x != this.targetX)
            {
                let d = this.targetX - this.layout.x;
                let s = 20;
                if (d > 0)
                {
                    d = Math.min(this.layout.x + s, this.targetX);
                }
                else
                {
                    d = Math.max(this.layout.x - s, this.targetX);
                }
                this.layout.x = d;
            }
        }
        this.layoutS.Repos(this.layout.x);
    }
}

class P402Layout extends Behaviour
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
    spacingX = 15;
    spacingY = 15;

    public pageSpace = 0;

    Init(width: number, height: number, shield: boolean)
    {
        this.node.x = this.prefab.width / 2;

        while (width >= this.prefab.width)
        {
            width = width - this.prefab.width - this.spacingX;
            this.column++;
        }
        while (height >= this.prefab.height)
        {
            height = height - this.prefab.height - this.spacingY;
            this.line++;
        }
        this.pageSpace = (this.prefab.width + this.spacingX) * this.column;
        if (shield)
        {
            let uw = this.prefab.width;
            let uh = this.prefab.height;
            let spaceX = uw + this.spacingX;
            let spaceY = uh + this.spacingY;
            for (let y = 0; y < this.line; y++)
            {
                for (let x = 0; x < this.column; x++)
                {
                    if (this.items.length < this.datas.length)
                    {
                        let item = GO.Instantiate(this.prefab).getComponent(PromoItem) as PromoItem;
                        this.node.addChild(item.owner);
                        item.owner.active = (item.owner as Laya.Box).visible = true;
                        this.items.push(item);
                        (item.owner as Laya.Box).x = x * spaceX;
                        (item.owner as Laya.Box).y = spaceY * y + uh / 2;
                        item.onAwake();
                    }
                }
            }
            this.Redata();
        }
        else
        {
            this.datas.sort((a, b) => b.weight - a.weight);
            this.column += 2;
            for (let x = 0; x < this.column; x++)
            {
                for (let y = 0; y < this.line; y++)
                {
                    let item = GO.Instantiate(this.prefab).getComponent(PromoItem) as PromoItem;
                    this.node.addChild(item.owner);
                    item.owner.active = (item.owner as Laya.Box).visible = true;
                    this.items.push(item);
                    item.onAwake();
                }
            }
        }
    }

    public Redata()
    {
        for (let i = 0; i < this.items.length; i++)
        {
            let item = this.items[i];
            item.data = this.datas[i];
            item.data.Load();
            item.DoLoad();
        }
    }
    Repos(posX: number)
    {
        let ic = this.items.length;
        let dc = this.datas.length;

        if (ic < 1) return;
        if (dc < 1) return;

        let uw = this.prefab.width;
        let uh = this.prefab.height;
        let spaceX = uw + this.spacingX;
        let spaceY = uh + this.spacingY;

        let k = -posX / spaceX;
        k = Math.floor(k);
        let k1 = Math.floor(k / this.column) * this.column, k2 = k < 0 ? (this.column + k % this.column) % this.column : (k % this.column);

        let checkPos = (item: PromoItem, b: number, l: number, c: number) =>
        {
            let pid = (b + c) * this.line + l;
            if (item.posId != pid)
            {
                item.posId = pid;
                (item.owner as Laya.Box).x = (b + c) * spaceX;
                (item.owner as Laya.Box).y = spaceY * l + uh / 2;

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

        for (let c = 0; c < k2; c++)
        {
            for (let l = 0; l < this.line; l++)
            {
                checkPos(this.items[c * this.line + l], k1 + this.column, l, c);
            }
        }
        for (let c = k2; c < this.column; c++)
        {
            for (let l = 0; l < this.line; l++)
            {
                checkPos(this.items[c * this.line + l], k1, l, c);
            }
        }
    }
}