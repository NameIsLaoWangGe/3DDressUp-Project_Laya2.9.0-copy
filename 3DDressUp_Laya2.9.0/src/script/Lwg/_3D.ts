import { EventAdmin, TimerAdmin, Tools } from "./Lwg";
import { _Res } from "./_PreLoad";

export module _3D {
    export enum _AniName {
        Stand = 'Stand',
        Poss1 = 'Poss1',
        Poss2 = 'Poss2',
        DispalyCloth = 'DispalyCloth',
        Walk = 'Walk',
    }
    export class _Scene {
        private static ins: _Scene;
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
            this._RoleAni.play(_AniName.Stand);
            this._RoleAni.play(_AniName.DispalyCloth);
            Laya.timer.clearAll(this._Role);
            TimerAdmin._once(3200, this._Role, () => {
                this._RoleAni.crossFade(_AniName.Stand, 0.3);
            })
        }
        playPoss1Ani(): void {
            this._RoleAni.play(_AniName.Stand);
            this._RoleAni.play(_AniName.Poss1);
            Laya.timer.clearAll(this._Role);
            TimerAdmin._once(3200, this._Role, () => {
                this._RoleAni.crossFade(_AniName.Stand, 0.3);
            })
        }

        playPoss2Ani(): void {
            this._RoleAni.play(_AniName.Stand);
            this._RoleAni.play(_AniName.Poss2);
            Laya.timer.clearAll(this._Role);
            TimerAdmin._once(3200, this._Role, () => {
                this._RoleAni.crossFade(_AniName.Stand, 0.3);
            })
        }

        playStandAni(): void {
            Laya.timer.clearAll(this._Role);
            this._RoleAni.crossFade(_AniName.Stand, 0.3);
        }

        playRandomPoss(): void {
            TimerAdmin._frameLoop(300, this._Role, () => {
                Tools._Number.randomOneHalf() == 0 ? _3D._Scene._ins().playPoss1Ani() : _3D._Scene._ins().playPoss2Ani()
            })
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

            this._RoleAni.play(_AniName.Walk);
            const dis = Tools._Number.randomOneHalf() == 0 ? - 3 : 3;
            const time = 180;
            const rotate = dis == 3 ? 90 : -90;
            this._Role.transform.position = new Laya.Vector3(this._RoleFPos.x + dis, this._RoleFPos.y, this._RoleFPos.z);
            this._Role.transform.localRotationEuler = new Laya.Vector3(0, this._Role.transform.localRotationEuler.y + rotate, 0);

            this._Role.transform.localRotationEuler = new Laya.Vector3(-10, this._Role.transform.localRotationEuler.y, 0);

            const CaRotate = Tools._Number.randomOneHalf() == 0 ? - 5 : 5;
            this._MainCamara.transform.localRotationEuler.x += CaRotate;
            TimerAdmin._frameNumLoop(1, time, this, () => {

                this._MainCamara.transform.localRotationEuler = new Laya.Vector3(this._MainCamara.transform.localRotationEuler.x - CaRotate / time, this._MainCamara.transform.localRotationEuler.y, this._MainCamara.transform.localRotationEuler.z);

                this._Role.transform.localRotationEuler = new Laya.Vector3(this._Role.transform.localRotationEuler.x + 10 / time, this._Role.transform.localRotationEuler.y, 0);

                this._Role.transform.position = new Laya.Vector3(this._Role.transform.position.x - dis / time, this._Role.transform.position.y, this._Role.transform.position.z);
            })
            TimerAdmin._frameOnce(time - 45, this, () => {
                TimerAdmin._frameNumLoop(1, 45, this, () => {
                    const speed = rotate > 0 ? 2 : -2;
                    this._Role.transform.localRotationEuler = new Laya.Vector3(this._Role.transform.localRotationEuler.x, this._Role.transform.localRotationEuler.y -= speed, 0);
                }, () => {
                    Tools._Number.randomOneHalf() == 0 ? this._RoleAni.crossFade(_AniName.Poss1, 0.3) :
                        this._RoleAni.crossFade(_AniName.Poss2, 0.1);
                    TimerAdmin._once(3000, this, () => {
                        this._RoleAni.crossFade(_AniName.Stand, 0.1);
                        func();
                        this.playRandomPoss();
                    })
                })
            })
        }
        changeStartBg(): void {
            (this._Bg1.meshRenderer.material as Laya.UnlitMaterial).albedoTexture = _Res._list.texture2D.bgStart.texture2D;
        }
        changeDressingRoomBg(): void {
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


        /**
         * 获取一件DiY衣服模型
         * @param {string} part 部位
         * @param {string} name 衣服名称
         * @return {*}  {[any]}
         * @memberof _Scene
         */
        getCloneDIYClothes(part: string, name: string): any[] {
            Tools._Node.removeAllChildren(this._DIYHanger);
            const _part = this._DIY.getChildByName(part) as Laya.MeshSprite3D;
            const _0 = (_part.getChildByName(`${name}_0`) as Laya.SkinnedMeshSprite3D).clone() as Laya.MeshSprite3D;
            const _1 = (_part.getChildByName(`${name}_1`) as Laya.SkinnedMeshSprite3D).clone() as Laya.MeshSprite3D;
            this._DIYHanger.addChild(_0).active = true;
            this._DIYHanger.addChild(_1).active = true;
            this._Role.active = false;
            _0.transform.localRotationEulerX = -90;
            _1.transform.localRotationEulerX = -90;
            _0.transform.localRotationEulerY = 180;
            _1.transform.localRotationEulerY = 180;
            return [_0, _1];
        }


    }

}