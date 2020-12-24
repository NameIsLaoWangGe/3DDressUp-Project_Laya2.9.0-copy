import Behaviour from "./Behaviour";
import PromoItem from "./PromoItem";
import { GO } from "../../GO";

export default class P302 extends Behaviour
{
    private static style = "P302";

    layoutsNode: Laya.Box = null;

    layouts: P302Layout[] = [];

    get node()
    {
        return this.owner as Laya.Box;
    }

    async OnAwake()
    {
        this.layoutsNode = this.node.getChildByName("lines") as Laya.Box;

        TJ.Develop.Yun.Promo.Data.ReportAwake(P302.style);

        for (let i = 0; i < this.layoutsNode.numChildren; i++)
        {
            this.layouts.push(this.layoutsNode.getChildAt(i).addComponent(P302Layout));
        }

        this.active = false;
        let list = await TJ.Develop.Yun.Promo.Data.LoadList();
        if (list != null && list.length > 0)
        {
            let www = new TJ.Common.WWW("http://h5.tomatojoy.cn/res/659827d1-d6a0-8248-c5ec-849bda0841a5/promo/cftest.json");
            await www.Send();
            if (www.text != null)
            {
                let dic: { P302: string[][] } = JSON.parse(www.text);
                for (let l = 0; l < this.layouts.length; l++)
                {
                    if (l < dic.P302.length)
                    {
                        for (let i = 0; i < dic.P302[l].length; i++)
                        {
                            let data = list.find((item) => item.promoGuid == dic.P302[l][i]);
                            // if (data != null) this.layouts[l].datas.push(data);
                        }
                        // this.lines[l].onAwake();
                        this.layouts[l].Init(this.node.width);
                    }
                    else
                    {
                        this.layouts[l].node.active = false;
                    }
                }
                this.active = true;
                TJ.Develop.Yun.Promo.Data.ReportStart(P302.style);
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


    OnUpdate()
    {
        this.layoutsNode.x -= .8;
        for (let layout of this.layouts)
        {
            if (layout.node.active)
            {
                layout.Refresh(this.layoutsNode.x);
            }
        }
    }
}

class P302Layout extends Behaviour
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

    Init(width: number)
    {
        let mx = width / (this.prefab.width + 13);
        mx = Math.ceil(mx) + 3;

        let column = 0;
        while (width >= this.prefab.width)
        {
            width = width - this.prefab.width - 13;
            column++;
        }
        column += 3;
        for (let i = 0; i < column; i++)
        {
            let item = GO.Instantiate(this.prefab).getComponent(PromoItem) as PromoItem;
            this.node.addChild(item.owner);
            item.owner.active = (item.owner as Laya.Box).visible = true;
            this.items.push(item);
            item.onAwake();
            // if (i == 0)
            // {
            //     console.log(this.prefab, item.owner);
            //     console.log(this.prefab["_mouseEnabled"], item.owner["_mouseEnabled"]);
            // }
        }
    }

    Refresh(posX: number)
    {
        let ic = this.items.length;
        let dc = this.datas.length;

        if (ic < 1) return;
        if (dc < 1) return;

        let space = this.prefab.width + 13;

        let k = -posX / space;
        k = Math.floor(k);
        let k1 = Math.floor(k / ic) * ic, k2 = k < 0 ? (ic + k % ic) % ic : (k % ic);

        let checkPos = (item: PromoItem, pid: number) =>
        {
            if (item.posId != pid)
            {
                item.posId = pid;
                (item.owner as Laya.Box).x = pid * space - this.prefab.width / 2;
                pid -= 1;
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

        for (let i = 0; i < k2; i++)
        {
            checkPos(this.items[i], k1 + ic + i);
        }
        for (let i = k2; i < ic; i++)
        {
            checkPos(this.items[i], k1 + i);
        }
    }
}