import { ui } from "../ui/layaMaxUI";

/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
export default class GameUI extends ui.test.TestSceneUI {
    private mat1:Laya.BlinnPhongMaterial;
    private newScene:Laya.Scene3D;
    constructor() {
        super();
		this.newScene = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
		
		//初始化照相机
		var camera = this.newScene.addChild(new Laya.Camera(0, 0.1, 100)) as Laya.Camera;
		camera.transform.translate(new Laya.Vector3(0, 6, 9.5));
		camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
		
		//方向光
		var directionLight = new Laya.DirectionLight();
		this.newScene.addChild(directionLight);
		directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
		//设置平行光的方向
		var mat = directionLight.transform.worldMatrix;
		mat.setForward(new Laya.Vector3(-1.0, -1.0, -1.0));
		directionLight.transform.worldMatrix=mat;
		
		//平面
		var plane = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createPlane(10, 10, 10, 10))) as Laya.MeshSprite3D;
		var planeMat = new Laya.BlinnPhongMaterial();
		Laya.Texture2D.load("res/grass.png", Laya.Handler.create(this, function(tex:Laya.Texture2D):void {
			planeMat.albedoTexture = tex;
		}));
		//设置纹理平铺和偏移
		var tilingOffset = planeMat.tilingOffset;
		tilingOffset.setValue(5, 5, 0, 0);
		planeMat.tilingOffset = tilingOffset;
		//设置材质
		plane.meshRenderer.material = planeMat;
		
		//平面添加物理碰撞体组件
		var planeStaticCollider = plane.addComponent(Laya.PhysicsCollider);
		//创建盒子形状碰撞器
		var planeShape = new Laya.BoxColliderShape(10, 0, 10);
		//物理碰撞体设置形状
		planeStaticCollider.colliderShape = planeShape;
		//物理碰撞体设置摩擦力
		planeStaticCollider.friction = 2;
		//物理碰撞体设置弹力
		planeStaticCollider.restitution = 0.3;
		
		
		this.mat1 = new Laya.BlinnPhongMaterial();
		//加载纹理资源
		Laya.Texture2D.load("res/wood.jpg", Laya.Handler.create(this, function(tex:Laya.Texture2D):void {
			this.mat1.albedoTexture = tex;
			//添加一个球体
			Laya.timer.once(100, this, function():void {
				this.addBox();
			});
		}));
		
    }

    private addBox():void {
		//创建盒型MeshSprite3D
		var box = this.newScene.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(0.75, 0.5, 0.5))) as Laya.MeshSprite3D;
		//设置材质
		box.meshRenderer.material = this.mat1;
		var transform = box.transform;
		var pos = transform.position;
		pos.setValue(0, 10, 0);
		transform.position = pos;
		//创建刚体碰撞器
		var rigidBody = box.addComponent(Laya.Rigidbody3D);
		//创建盒子形状碰撞器
		var boxShape = new Laya.BoxColliderShape(0.75, 0.5, 0.5);
		//设置盒子的碰撞形状
		rigidBody.colliderShape = boxShape;
		//设置刚体的质量
		rigidBody.mass = 10;
	}
}