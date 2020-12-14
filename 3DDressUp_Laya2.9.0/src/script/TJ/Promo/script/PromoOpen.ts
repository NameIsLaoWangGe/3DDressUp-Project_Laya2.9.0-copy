
export default class PromoOpen extends Laya.Script
{

    /** @prop {name:target,type:Node} */
    target: Laya.Box = null;

    onClick()
    {
        this.target.active = this.target.visible = true;
    }

}
