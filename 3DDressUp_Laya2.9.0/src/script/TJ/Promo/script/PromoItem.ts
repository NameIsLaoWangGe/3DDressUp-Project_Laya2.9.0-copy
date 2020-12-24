import Behaviour from "./Behaviour";

export default class PromoItem extends Behaviour
{
    public bgImage: Laya.Image = null;
    public iconImage: Laya.Image = null;
    public nameText: Laya.Label = null;
    public infoText: Laya.Label = null;
    public flag1: Laya.Image = null;
    public flag2: Laya.Image = null;
    public flag3: Laya.Image = null;

    public nbg: Laya.Image = null;

    public onClick_: Function;

    public style: string;
    public data: TJ.Develop.Yun.Promo.Data;

    public posId: number;
    public dataId: number;

    OnAwake()
    {
        this.bgImage = this.owner.getChildByName("bg") as Laya.Image;
        this.iconImage = this.owner.getChildByName("icon") as Laya.Image;
        if (this.iconImage != null)
        {
            this.flag1 = this.iconImage.getChildByName("flag1") as Laya.Image;
            this.flag2 = this.iconImage.getChildByName("flag2") as Laya.Image;
            this.flag3 = this.iconImage.getChildByName("flag3") as Laya.Image;
        }
        this.nameText = this.owner.getChildByName("name") as Laya.Label;
        this.infoText = this.owner.getChildByName("info") as Laya.Label;
        this.nbg = this.owner.getChildByName("nbg") as Laya.Image;
    }


    public DoLoad()
    {
        if (this.data == null) return;
        if (this.iconImage != null) this.iconImage.skin = this.data.icon;
        if (this.nameText != null) this.nameText.text = this.data.title;
        if (this.nbg != null) this.nbg.skin = "TJ/Promo/image/互推icon底色/" + this.data.titleBG + ".png";
        this.SetFlag();
    }

    private SetFlag()
    {
        if (this.flag1 != null) this.flag1.active = this.flag1.visible = false;
        if (this.flag2 != null) this.flag2.active = this.flag2.visible = false;
        if (this.flag3 != null) this.flag3.active = this.flag3.visible = false;
        switch (this.data.tag)
        {
            case 1:
                if (this.flag1 != null) this.flag1.active = this.flag1.visible = true;
                break;
            case 2:
                if (this.flag2 != null) this.flag2.active = this.flag2.visible = true;
                break;
            case 3:
                if (this.flag3 != null) this.flag3.active = this.flag3.visible = true;
                break;
        }
    }

    public OnShow()
    {
        this.data.ReportShow();
    }

    public OnClick()
    {
        this.data.Click();
        if (this.onClick_ != null)
        {
            this.onClick_(this);
        }
    }

    onClick()
    {
        this.OnClick();
    }
}
