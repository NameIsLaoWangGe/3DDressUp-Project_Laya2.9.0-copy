import { TimerAdmin, Tools } from "./Lwg";

/**特效模块*/
export module OldEffects {
    /**特效元素的图片地址，所有项目都可用*/
    export enum SkinUrl {
        'Frame/Effects/cir_white.png',
        // "Frame/Effects/cir_black.png",
        "Frame/Effects/cir_blue.png",
        "Frame/Effects/cir_bluish.png",
        "Frame/Effects/cir_cyan.png",
        "Frame/Effects/cir_grass.png",
        "Frame/Effects/cir_green.png",
        "Frame/Effects/cir_orange.png",
        "Frame/Effects/cir_pink.png",
        "Frame/Effects/cir_purple.png",
        "Frame/Effects/cir_red.png",
        "Frame/Effects/cir_yellow.png",

        // "Frame/Effects/star_black.png",
        "Frame/Effects/star_blue.png",
        "Frame/Effects/star_bluish.png",
        "Frame/Effects/star_cyan.png",
        "Frame/Effects/star_grass.png",
        "Frame/Effects/star_green.png",
        "Frame/Effects/star_orange.png",
        "Frame/Effects/star_pink.png",
        "Frame/Effects/star_purple.png",
        "Frame/Effects/star_red.png",
        "Frame/Effects/star_white.png",
        "Frame/Effects/star_yellow.png",

        "Frame/Effects/ui_Circular_l_yellow.png",

        "Frame/UI/ui_square_guang.png",

    }

    /**表示需要什么样的图片样式*/
    export enum SkinStyle {
        star = 'star',
        dot = 'dot',
    }

    /**类粒子特效的通用父类*/
    export class EffectsBase extends Laya.Script {
        /**挂载当前脚本的节点*/
        self: Laya.Sprite;
        /**所在场景*/
        selfScene: Laya.Scene;
        /**移动开关*/
        moveSwitch: boolean;
        /**时间线*/
        timer: number;
        /**在组中的位置*/
        group: number;
        /**在行中的位置*/
        row: number;
        /**在列中的位置*/
        line: number;
        /**初始角度*/
        startAngle: number;
        /**基础速度*/
        startSpeed: number;
        /**加速度*/
        accelerated: number;

        /**随机大小*/
        startScale: number;
        /**随机起始透明度*/
        startAlpha: number;
        /**初始角度*/
        startRotat: number;

        /**随机旋转方向*/
        rotateDir: string;
        /**随机旋转角度*/
        rotateRan: number;
        /**随机消失时间*/
        continueTime: number;

        onAwake(): void {
            this.initProperty();
        }
        onEnable(): void {
            this.self = this.owner as Laya.Sprite;
            this.selfScene = this.self.scene;
            let calssName = this['__proto__']['constructor'].name;
            this.self[calssName] = this;
            // console.log(this.self.getBounds());
            this.timer = 0;
            this.lwgInit();
            this.propertyAssign();

        }
        /**初始化，在onEnable中执行，重写即可覆盖*/
        lwgInit(): void {
        }
        /**初始化特效单元的属性*/
        initProperty(): void {
        }
        /**一些节点上的初始属性赋值*/
        propertyAssign(): void {
            if (this.startAlpha) {
                this.self.alpha = this.startAlpha;
            }
            if (this.startScale) {
                this.self.scale(this.startScale, this.startScale);
            }
            if (this.startRotat) {
                this.self.rotation = this.startRotat;
            }
        }
        /**
          * 通用按角度移动移动，按单一角度移动
          * @param angle 角度
          * @param basedSpeed 基础速度
          */
        commonSpeedXYByAngle(angle: number, speed: number) {
            this.self.x += Tools._Point.angleAndLenByPoint(angle, speed + this.accelerated).x;
            this.self.y += Tools._Point.angleAndLenByPoint(angle, speed + this.accelerated).y;
        }
        /**移动规则*/
        moveRules(): void {
        }
        onUpdate(): void {
            this.moveRules();
        }
        onDisable(): void {
            Laya.Pool.recover(this.self.name, this.self);
            this.destroy();//删除自己，下次重新添加
            Laya.Tween.clearAll(this);
            Laya.timer.clearAll(this);
        }
    }


    /**
     * 创建普通爆炸动画，四周爆炸随机散开
     * @param parent 父节点
     * @param quantity 数量
     * @param speed 速度
     * @param x X轴位置
     * @param y Y轴位置
     * @param style 图片样式
     * @param speed 移动速度
     * @param continueTime 持续时间（按帧数计算）
     */
    export function createCommonExplosion(parent, quantity, x, y, style, speed, continueTime): void {
        for (let index = 0; index < quantity; index++) {
            let ele = Laya.Pool.getItemByClass('ele', Laya.Image) as Laya.Image;
            ele.name = 'ele';//标识符和名称一样
            let num
            if (style === SkinStyle.star) {
                num = 10 + Math.floor(Math.random() * 12);
            } else if (style === SkinStyle.dot) {
                num = Math.floor(Math.random() * 12);
            }
            ele.skin = SkinUrl[num];
            ele.alpha = 1;
            parent.addChild(ele);
            ele.pos(x, y);
            let scirpt = ele.addComponent(commonExplosion);
            scirpt.startSpeed = Math.random() * speed;
            scirpt.continueTime = 2 * Math.random() + continueTime;
        }
    }

    /**普通爆炸移动类*/
    export class commonExplosion extends EffectsBase {
        lwgInit(): void {
            this.self.width = 25;
            this.self.height = 25;
            this.self.pivotX = this.self.width / 2;
            this.self.pivotY = this.self.height / 2;
        }
        initProperty(): void {
            this.startAngle = 360 * Math.random();
            this.startSpeed = 5 * Math.random() + 8;
            this.startScale = 0.4 + Math.random() * 0.6;
            this.accelerated = 2;
            this.continueTime = 8 + Math.random() * 10;
            this.rotateDir = Math.floor(Math.random() * 2) === 1 ? 'left' : 'right';
            this.rotateRan = Math.random() * 10;
        }
        moveRules(): void {
            this.timer++;
            if (this.rotateDir === 'left') {
                this.self.rotation += this.rotateRan;
            } else {
                this.self.rotation -= this.rotateRan;
            }
            if (this.timer >= this.continueTime / 2) {
                this.self.alpha -= 0.04;
                if (this.self.alpha <= 0.65) {
                    this.self.removeSelf();
                }
            }
            this.commonSpeedXYByAngle(this.startAngle, this.startSpeed + this.accelerated);
            this.accelerated += 0.2;
        }
    }

    /**
      * 创建爆炸旋转动画，爆炸后会在结尾处旋转几次
      * @param parent 父节点
      * @param quantity 数量
      * @param x X位置
      * @param Y Y位置
      * @param speed 速度
      * @param rotate 旋转最大值
      */
    export function createExplosion_Rotate(parent, quantity, x, y, style, speed, rotate): void {
        for (let index = 0; index < quantity; index++) {
            let ele = Laya.Pool.getItemByClass('ele', Laya.Image) as Laya.Image;
            ele.name = 'ele';//标识符和名称一样
            let num;
            if (style === SkinStyle.star) {
                num = 10 + Math.floor(Math.random() * 12);
            } else if (style === SkinStyle.dot) {
                num = Math.floor(Math.random() * 12);
            }
            ele.skin = SkinUrl[num];
            ele.alpha = 1;
            parent.addChild(ele);
            ele.pos(x, y);
            let scirpt = ele.addComponent(Explosion_Rotate);
            scirpt.startSpeed = 2 + Math.random() * speed;
            scirpt.rotateRan = Math.random() * rotate;
        }
    }

    /**
     * 创建爆炸旋转动画控制脚本
     * */
    export class Explosion_Rotate extends EffectsBase {
        lwgInit(): void {
            this.self.width = 41;
            this.self.height = 41;
            this.self.pivotX = this.self.width / 2;
            this.self.pivotY = this.self.height / 2;
        }
        initProperty(): void {
            this.startAngle = 360 * Math.random();
            this.startSpeed = 5 * Math.random() + 8;
            this.startScale = 0.4 + Math.random() * 0.6;
            this.accelerated = 0;
            this.continueTime = 5 + Math.random() * 20;
            this.rotateDir = Math.floor(Math.random() * 2) === 1 ? 'left' : 'right';
            this.rotateRan = Math.random() * 15;
        }
        moveRules(): void {

            if (this.rotateDir === 'left') {
                this.self.rotation += this.rotateRan;
            } else {
                this.self.rotation -= this.rotateRan;
            }
            if (this.startSpeed - this.accelerated <= 0.1) {
                this.self.alpha -= 0.03;
                if (this.self.alpha <= 0) {
                    this.self.removeSelf();
                }
            } else {
                this.accelerated += 0.2;
            }
            this.commonSpeedXYByAngle(this.startAngle, this.startSpeed - this.accelerated);
        }
    }


    /**
      * 创建类似于烟花爆炸动画，四周爆炸随机散开
      * @param parent 父节点
      * @param quantity 数量
      * @param x X轴位置
      * @param y Y轴位置
      */
    export function createFireworks(parent, quantity, x, y): void {
        for (let index = 0; index < quantity; index++) {
            let ele = Laya.Pool.getItemByClass('fireworks', Laya.Image) as Laya.Image;
            ele.name = 'fireworks';//标识符和名称一样
            let num = 12 + Math.floor(Math.random() * 11);
            ele.alpha = 1;
            ele.skin = SkinUrl[num];
            parent.addChild(ele);
            ele.pos(x, y);
            let scirpt = ele.getComponent(Fireworks);
            if (!scirpt) {
                ele.addComponent(Fireworks);
            }
        }
    }

    /**类似烟花爆炸，速度逐渐减慢，并且有下降趋势*/
    export class Fireworks extends EffectsBase {
        lwgInit(): void {
            this.self.width = 41;
            this.self.height = 41;
            this.self.pivotX = this.self.width / 2;
            this.self.pivotY = this.self.height / 2;
        }

        initProperty(): void {
            this.startAngle = 360 * Math.random();
            this.startSpeed = 5 * Math.random() + 5;
            this.startScale = 0.4 + Math.random() * 0.6;
            this.accelerated = 0.1;
            this.continueTime = 200 + Math.random() * 10;
        }
        moveRules(): void {
            this.timer++;
            if (this.timer >= this.continueTime * 3 / 5) {
                this.self.alpha -= 0.1;
            }
            if (this.timer >= this.continueTime) {
                this.self.removeSelf();
            } else {
                this.commonSpeedXYByAngle(this.startAngle, this.startSpeed);
            }
            if (this.self.scaleX < 0) {
                this.self.scaleX += 0.01;
            } else if (this.self.scaleX >= this.startScale) {
                this.self.scaleX -= 0.01;
            }
        }
    }

    /**
     * 创建左右喷彩带动画
     * @param parent 父节点
     * @param direction 方向
     * @param quantity 数量
     * @param x X轴位置
     * @param y Y轴位置
    */
    export function createLeftOrRightJet(parent, direction, quantity, x, y): void {
        for (let index = 0; index < quantity; index++) {
            let ele = Laya.Pool.getItemByClass('Jet', Laya.Image) as Laya.Image;
            ele.name = 'Jet';//标识符和名称一样
            let num = 12 + Math.floor(Math.random() * 11);
            ele.skin = SkinUrl[num];
            ele.alpha = 1;
            parent.addChild(ele);
            ele.pos(x, y);
            let scirpt = ele.getComponent(leftOrRightJet);
            if (!scirpt) {
                ele.addComponent(leftOrRightJet);
                let scirpt1 = ele.getComponent(leftOrRightJet);
                scirpt1.direction = direction;
                scirpt1.initProperty();
            } else {
                scirpt.direction = direction;
                scirpt.initProperty();
            }
        }
    }
    /**创建左右喷彩带动画类*/
    export class leftOrRightJet extends EffectsBase {
        direction: string;
        randomRotate: number;

        lwgInit(): void {
            this.self.width = 41;
            this.self.height = 41;
            this.self.pivotX = this.self.width / 2;
            this.self.pivotY = this.self.height / 2;
        }
        initProperty(): void {
            if (this.direction === 'left') {
                this.startAngle = 100 * Math.random() - 90 + 45 - 10 - 20;
            } else if (this.direction === 'right') {
                this.startAngle = 100 * Math.random() + 90 + 45 + 20;
            }
            this.startSpeed = 10 * Math.random() + 3;
            this.startScale = 0.4 + Math.random() * 0.6;
            this.accelerated = 0.1;
            this.continueTime = 300 + Math.random() * 50;
            this.randomRotate = 1 + Math.random() * 20;
        }
        moveRules(): void {
            this.timer++;
            if (this.timer >= this.continueTime * 3 / 5) {
                this.self.alpha -= 0.1;
            }
            if (this.timer >= this.continueTime) {
                this.self.removeSelf();
            } else {
                this.commonSpeedXYByAngle(this.startAngle, this.startSpeed);
                // this.self.y += this.accelerated * 10;
            }

            this.self.rotation += this.randomRotate;

            if (this.self.scaleX < 0) {
                this.self.scaleX += 0.01;
            } else if (this.self.scaleX >= this.startScale) {
                this.self.scaleX -= 0.01;
            }
        }
    }
}
export default OldEffects;