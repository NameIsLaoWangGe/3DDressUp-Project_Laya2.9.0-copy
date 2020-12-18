import lwg, { Admin, EventAdmin, TimerAdmin, Tools } from "./Lwg";
import { lwg3D } from "./Lwg3D";
import { _MakeTailor } from "./_MakeTailor";
import { _Res } from "./_PreLoad";

export module _3D {
    export class _Scene {
        private static ins: _Scene;
        aniName = {
            Stand: 'Stand',
            Pose1: 'Pose1',
            Pose2: 'Pose2',
            DispalyCloth: 'DispalyCloth',
            Walk: 'Walk',
        }
        static _ins() {
            if (!this.ins) {
                this.ins = new _Scene();
                this.ins._Owner = _Res._list.scene3D.MakeClothes.Scene;
                Laya.stage.addChild(this.ins._Owner);

                this.ins._Role = this.ins._Owner.getChildByName('Role') as Laya.MeshSprite3D;
                this.ins._RoleFPos = new Laya.Vector3(this.ins._Role.transform.position.x, this.ins._Role.transform.position.y, this.ins._Role.transform.position.z);

                this.ins._Root = this.ins._Role.getChildByName('Root') as Laya.MeshSprite3D;
                this.ins._DIY = this.ins._Root.getChildByName('DIY') as Laya.MeshSprite3D;
                this.ins._General = this.ins._Root.getChildByName('General') as Laya.MeshSprite3D;

                this.ins._DBottoms = this.ins._DIY.getChildByName('Bottoms') as Laya.MeshSprite3D;
                this.ins._DTop = this.ins._DIY.getChildByName('Top') as Laya.MeshSprite3D;
                this.ins._DDress = this.ins._DIY.getChildByName('Dress') as Laya.MeshSprite3D;

                this.ins._GBottoms = this.ins._General.getChildByName('Bottoms') as Laya.MeshSprite3D;
                this.ins._GTop = this.ins._General.getChildByName('Top') as Laya.MeshSprite3D;
                this.ins._GDress = this.ins._General.getChildByName('Dress') as Laya.MeshSprite3D;

                this.ins._RoleAni = this.ins._Role.getComponent(Laya.Animator) as Laya.Animator;

                this.ins._MainCamara = this.ins._Owner.getChildByName('Main Camera') as Laya.Camera;
                this.ins._MirrorCamera = this.ins._Owner.getChildByName('MirrorCamera') as Laya.Camera;
                this.ins._Mirror = this.ins._Owner.getChildByName('Mirror') as Laya.MeshSprite3D;
                this.ins._Bg1 = this.ins._Owner.getChildByName('Bg1') as Laya.MeshSprite3D;
                this.ins._Bg2 = this.ins._Owner.getChildByName('Bg2') as Laya.MeshSprite3D;

                this.ins._BtnDress = this.ins._Owner.getChildByName('BtnDress') as Laya.MeshSprite3D;
                this.ins._BtnTop = this.ins._Owner.getChildByName('BtnTop') as Laya.MeshSprite3D;
                this.ins._BtnBottoms = this.ins._Owner.getChildByName('BtnBottoms') as Laya.MeshSprite3D;
                this.ins._BtnDressingRoom = this.ins._Owner.getChildByName('BtnDressingRoom') as Laya.MeshSprite3D;

                this.ins._DIYHanger = this.ins._Owner.getChildByName('DIYHanger') as Laya.MeshSprite3D;
            }
            return this.ins;
        }
        _Owner: Laya.Scene3D;
        _MainCamara: Laya.Camera;
        _Role: Laya.MeshSprite3D;
        _RoleFPos: Laya.Vector3;

        _RoleAni: Laya.Animator;
        _Root: Laya.MeshSprite3D;
        _DIY: Laya.MeshSprite3D;
        _DTop: Laya.MeshSprite3D;
        _DDress: Laya.MeshSprite3D;
        _DBottoms: Laya.MeshSprite3D;
        _General: Laya.MeshSprite3D;
        _GTop: Laya.MeshSprite3D;
        _GDress: Laya.MeshSprite3D;
        _GBottoms: Laya.MeshSprite3D;
        _SecondCameraTag: Laya.MeshSprite3D;
        _MirrorCamera: Laya.Camera;
        _Mirror: Laya.MeshSprite3D;
        _Bg1: Laya.MeshSprite3D;
        _Bg2: Laya.MeshSprite3D;
        _BtnDress: Laya.MeshSprite3D;
        _BtnTop: Laya.MeshSprite3D;
        _BtnBottoms: Laya.MeshSprite3D;
        _BtnDressingRoom: Laya.MeshSprite3D;
        _DIYHanger: Laya.MeshSprite3D;

        playDispalyAni(): void {
            this._RoleAni.play(this.aniName.Stand);
            this._RoleAni.play(this.aniName.DispalyCloth);
            Laya.timer.clearAll(this._Role);
            TimerAdmin._once(3200, this._Role, () => {
                this._RoleAni.crossFade(this.aniName.Stand, 0.3);
            })
        }
        playPoss1Ani(): void {
            this._RoleAni.crossFade(this.aniName.Pose1, 0.3);
            Laya.timer.clearAll(this._Role);
            TimerAdmin._once(3200, this._Role, () => {
                this._RoleAni.crossFade(this.aniName.Stand, 0.3);
            })
        }

        playPoss2Ani(): void {
            this._RoleAni.crossFade(this.aniName.Pose2, 0.3);
            Laya.timer.clearAll(this._Role);
            TimerAdmin._once(3200, this._Role, () => {
                this._RoleAni.crossFade(this.aniName.Stand, 0.3);
            })
        }

        playStandAni(): void {
            Laya.timer.clearAll(this);
            Laya.timer.clearAll(this._Role);
            this._RoleAni.crossFade(this.aniName.Stand, 0.3);
        }

        playRandomPose(): void {
            TimerAdmin._frameLoop(450, this, () => {
                Tools._Number.randomOneHalf() == 0 ? _3D._Scene._ins().playPoss1Ani() : _3D._Scene._ins().playPoss2Ani()
            }, true);
        }

        get btnDressPos(): Laya.Vector2 {
            return Tools._3D.posToScreen(this._BtnDress.transform.position, this._MainCamara);
        }
        get btnTopPos(): Laya.Vector2 {
            return Tools._3D.posToScreen(this._BtnTop.transform.position, this._MainCamara);
        }
        get btnBottomsPos(): Laya.Vector2 {
            return Tools._3D.posToScreen(this._BtnBottoms.transform.position, this._MainCamara);
        }
        get btnDressingRoomPos(): Laya.Vector2 {
            return Tools._3D.posToScreen(this._BtnDressingRoom.transform.position, this._MainCamara);
        }

        openStartAni(func: Function): void {
            func();
            this.playRandomPose();
            this._DIYHanger.active = false;
            this._Role.active = true;
            this._MirrorCamera.active = false;
            // this._RoleAni.play(this.aniName.Walk);
            // const dis = Tools._Number.randomOneHalf() == 0 ? - 3 : 3;
            // const time = 180;
            // const rotate = dis == 3 ? 90 : -90;
            // this._Role.transform.position = new Laya.Vector3(this._RoleFPos.x + dis, this._RoleFPos.y, this._RoleFPos.z);
            // this._Role.transform.localRotationEuler = new Laya.Vector3(0, this._Role.transform.localRotationEuler.y + rotate, 0);

            // this._Role.transform.localRotationEuler = new Laya.Vector3(-10, this._Role.transform.localRotationEuler.y, 0);

            // const CaRotate = Tools._Number.randomOneHalf() == 0 ? - 5 : 5;
            // this._MainCamara.transform.localRotationEuler.x += CaRotate;
            // TimerAdmin._frameNumLoop(1, time, this, () => {

            //     this._MainCamara.transform.localRotationEuler = new Laya.Vector3(this._MainCamara.transform.localRotationEuler.x - CaRotate / time, this._MainCamara.transform.localRotationEuler.y, this._MainCamara.transform.localRotationEuler.z);

            //     this._Role.transform.localRotationEuler = new Laya.Vector3(this._Role.transform.localRotationEuler.x + 10 / time, this._Role.transform.localRotationEuler.y, 0);

            //     this._Role.transform.position = new Laya.Vector3(this._Role.transform.position.x - dis / time, this._Role.transform.position.y, this._Role.transform.position.z);
            // })
            // TimerAdmin._frameOnce(time - 45, this, () => {
            //     TimerAdmin._frameNumLoop(1, 45, this, () => {
            //         const speed = rotate > 0 ? 2 : -2;
            //         this._Role.transform.localRotationEuler = new Laya.Vector3(this._Role.transform.localRotationEuler.x, this._Role.transform.localRotationEuler.y -= speed, 0);
            //     }, () => {
            //         Tools._Number.randomOneHalf() == 0 ? this._RoleAni.crossFade(this.aniName.Pose1, 0.3) :
            //             this._RoleAni.crossFade(this.aniName.Pose2, 0.1);
            //         TimerAdmin._once(3000, this, () => {
            //             this._RoleAni.crossFade(this.aniName.Stand, 0.1);
            //             func();
            //             this.playRandomPose();
            //         })
            //     })
            // })
        }
        intoStart(): void {
            _3D._Scene._ins().playStandAni();
            _3D._Scene._ins()._Owner.active = true;
            this._MirrorCamera.active = false;
            (this._Bg1.meshRenderer.material as Laya.UnlitMaterial).albedoTexture = _Res._list.texture2D.bgStart.texture2D;
        }
        intogeDressingRoom(): void {
            _3D._Scene._ins().playStandAni();
            this._MirrorCamera.active = true;
            (this._Bg1.meshRenderer.material as Laya.UnlitMaterial).albedoTexture = _Res._list.texture2D.bgDressingRoom.texture2D;
        }
        /**2D图片有遮罩的时候无法事实渲染，需要每帧渲染，所以需要手动清理前一帧的贴图，必须是可查找变量，否则无法手动回收*/
        mirrortex: Laya.Texture;
        createMirror(_Sp: Laya.Image): void {
            //选择渲染目标为纹理
            this._MirrorCamera.renderTarget = new Laya.RenderTexture(_Sp.width, _Sp.height);
            //渲染顺序
            this._MirrorCamera.renderingOrder = -1;
            //清除标记
            this._MirrorCamera.clearFlag = Laya.CameraClearFlags.Sky;
            // 频繁更换需要删除
            this.mirrortex && this.mirrortex.destroy();
            this.mirrortex = new Laya.Texture(((<Laya.Texture2D>(this._MirrorCamera.renderTarget as any))), Laya.Texture.DEF_UV);
            //设置网格精灵的纹理
            _Sp.graphics.drawTexture(this.mirrortex);
        }

        intoMakePattern(): void {
            _3D._Scene._ins()._Owner.active = true;
            _3D.DIYCloth._ins().remake();
            (this._Bg1.meshRenderer.material as Laya.UnlitMaterial).albedoTexture = _Res._list.texture2D.bgMakePattern.texture2D;
        }

        intoMakeTailor(): void {
            _3D._Scene._ins()._Owner.active = false;
        }
        photoBg(): void {
            (this._Bg1.meshRenderer.material as Laya.UnlitMaterial).albedoTexture = _Res._list.texture2D.bgPhoto.texture2D;
        }

        displayDress(): void {
            this._GBottoms.active = this._GTop.active = this._DBottoms.active = this._DTop.active = false;
        }
        displayTopAndBotton(): void {
            this._GDress.active = this._DDress.active = false;
        }
    }
    export class DIYCloth {
        private static ins: DIYCloth;
        static _ins() {
            if (!this.ins) {
                this.ins = new DIYCloth();
            }
            return this.ins;
        }
        constructor() {
        }
        Present: Laya.MeshSprite3D;
        Front: Laya.MeshSprite3D;
        Reverse: Laya.MeshSprite3D;
        ModelTap: Laya.MeshSprite3D;//触摸模型
        texHeight: number;
        // simRY: number = 90;
        remake(): void {
            _Scene._ins()._DIYHanger.active = true;
            _Scene._ins()._Role.active = false;

            const Classify = _Scene._ins()._DIYHanger.getChildByName(_MakeTailor._DIYClothes._ins()._pitchClassify) as Laya.MeshSprite3D;
            Tools._Node.showExcludedChild3D(_3D._Scene._ins()._DIYHanger, [Classify.name]);

            this.Present = Classify.getChildByName(_MakeTailor._DIYClothes._ins()._pitchName) as Laya.MeshSprite3D;
            Tools._Node.showExcludedChild3D(Classify, [this.Present.name]);

            this.Present.transform.localRotationEulerY = 180;

            this.Front = this.Present.getChildByName(`${this.Present.name}_0`) as Laya.MeshSprite3D;
            this.Reverse = this.Present.getChildByName(`${this.Present.name}_1`) as Laya.MeshSprite3D;

            this.ModelTap = this.Present.getChildByName('ModelTap') as Laya.MeshSprite3D;

            let center = this.Front.meshRenderer.bounds.getCenter();
            let extent = this.Front.meshRenderer.bounds.getExtent();

            //映射贴图图片宽高
            let p1 = new Laya.Vector3(center.x, center.y + extent.y, center.z);
            let p2 = new Laya.Vector3(center.x, center.y - extent.y, center.z);
            let point1 = Tools._3D.posToScreen(p1, _Scene._ins()._MainCamara);
            let point2 = Tools._3D.posToScreen(p2, _Scene._ins()._MainCamara);
            this.texHeight = point2.y - point1.y;
        }
        addTexture2D(arr: any[]): void {
            const bMF = this.Front.meshRenderer.material as Laya.UnlitMaterial;
            bMF.albedoTexture && bMF.albedoTexture.destroy();
            bMF.albedoTexture = arr[0];
            const bMR = this.Reverse.meshRenderer.material as Laya.UnlitMaterial;
            bMR.albedoTexture && bMR.albedoTexture.destroy();
            bMR.albedoTexture = arr[1];
        }
        rotate(num: number): void {
            if (num == 1) {
                this.Present.transform.localRotationEulerY++;
                // this.simRY += 2;
                // if (this.simRY > 360) {
                //     this.simRY = 0;
                // }
            } else {
                this.Present.transform.localRotationEulerY--;
                // this.simRY -= 2;
                // if (this.simRY < 0) {
                //     this.simRY = 359;
                // }
            }
        }
    }
}