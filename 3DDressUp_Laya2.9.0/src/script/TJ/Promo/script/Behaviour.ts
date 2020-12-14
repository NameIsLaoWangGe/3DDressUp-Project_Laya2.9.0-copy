export default class Behaviour extends Laya.Script
{

    OnAwake() { }
    OnStart() { }
    OnUpdate() { }
    OnEnable() { }
    OnDisable() { }
    OnDestroy() { }

    private isAwake = false;
    private DoAwake()
    {
        if (!this.active) return;
        if (!this.isAwake)
        {
            this.isAwake = true;
            this.OnAwake();
        }
    }
    private isStart = false;
    private DoStart()
    {
        if (!this.active) return;
        if (!this.isStart)
        {
            this.isStart = true;
            this.OnStart();
        }
    }
    private DoUpdate()
    {
        if (!this.active) return;
        if (this.isStart)
        {
            this.OnUpdate();
        }
    }
    private isEnable = false;
    private DoEnable()
    {
        if (!this.active) return;
        if (!this.isEnable)
        {
            this.isEnable = true;
            this.OnEnable();
        }
    }
    private DoDisable()
    {
        if (this.isEnable)
        {
            this.isEnable = false;
            this.OnDisable();
        }
    }
    private isDestroy = false;
    private DoDestroy()
    {
        if (!this.isDestroy)
        {
            this.isDestroy = true;
            this.OnDestroy();
        }
    }

    onAwake()
    {
        this.DoAwake();
    }
    onStart()
    {
        this.DoAwake();
        this.DoStart();
    }
    onUpdate()
    {
        this.DoAwake();
        this.DoEnable();
        this.DoStart();
        this.DoUpdate();
    }
    onEnable()
    {
        this.DoAwake();
        this.DoEnable();
        this.DoStart();
    }
    onDisable()
    {
        this.DoDisable();
    }
    onDestroy()
    {
        this.DoDestroy();
    }

    public static SetActive(node: Laya.Node, value: boolean)
    {
        if (node == null) return;
        node.active = value;
        if (node instanceof Laya.Box)
        {
            (node as Laya.Box).visible = value;
        }
    }

    public static GetActive(node: Laya.Node)
    {
        if (node == null) return false;
        if (!node.active) return false;
        if (node instanceof Laya.Box)
        {
            if (!(node as Laya.Box).visible) return false;
        }
        return true;
    }

    get active()
    {
        return Behaviour.GetActive(this.owner);
    }
    set active(value: boolean)
    {
        Behaviour.SetActive(this.owner, value);
        if (value)
        {
            this.DoEnable();
        }
        else
        {
            this.DoDisable();
        }
    }
}