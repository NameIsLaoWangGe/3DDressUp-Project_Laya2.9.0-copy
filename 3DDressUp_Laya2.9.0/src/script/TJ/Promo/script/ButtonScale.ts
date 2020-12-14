
export default class ButtonScale extends Laya.Script
{

    /** @prop {name:time,type:Number,default:.1} */
    time: number = .1;
    /** @prop {name:ratio,type:Number,default:1.04} */
    ratio: number = 1.04;

    startScaleX = 1;
    startScaleY = 1;

    onAwake()
    {
        this.owner.on(Laya.Event.MOUSE_DOWN, null, () => { this.ScaleBig(); });
        this.owner.on(Laya.Event.MOUSE_UP, null, () => { this.ScaleSmall(); });
        this.owner.on(Laya.Event.MOUSE_OUT, null, () => { this.ScaleSmall(); });
    }

    scaled = false;
    private ScaleBig(): void
    {
        if (this.scaled) return;
        this.scaled = true;
        Laya.Tween.to(this.owner, { scaleX: this.startScaleX * this.ratio, scaleY: this.startScaleY * this.ratio }, this.time * 1000);
    }
    private ScaleSmall(): void
    {
        if (!this.scaled) return;
        this.scaled = false;
        Laya.Tween.to(this.owner, { scaleX: this.startScaleX, scaleY: this.startScaleY }, this.time * 1000);
    }

}