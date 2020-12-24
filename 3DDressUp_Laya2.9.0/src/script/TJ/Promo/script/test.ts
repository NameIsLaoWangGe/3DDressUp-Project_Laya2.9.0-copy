import Behaviour from "./Behaviour";
import { GO } from "../../GO";
import P201 from "./P201";

export default class test extends Behaviour
{
    /** @prop {name:prefab, tips:"", type:Node, default:null}*/
    public prefab: Laya.Node;
    OnAwake()
    {
        let node = GO.Instantiate(this.prefab) as Laya.Box;
        console.log("node", node);
        this.owner.addChild(node);
        node.centerX = node.centerY = 0;
        node.active = node.visible = true;
        let p201 = node.getComponent(P201) as P201;
        p201.shake = true;
    }
}