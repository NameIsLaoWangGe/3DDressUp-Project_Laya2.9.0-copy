import { Admin, Animation2D, AudioAdmin, DataAdmin, Effects2D, TimerAdmin, Tools } from "./Lwg";
import { _PersonalInfo } from "./_PersonalInfo";
import { _Res } from "./_PreLoad";
import { _Start } from "./_Start";

export module _Ranking {
    export class _Data extends DataAdmin._Table {
        private static ins: _Data;
        static _ins() {
            if (!this.ins) {
                this.ins = new _Data('RankingData', _Res._list.json.Ranking.dataArr, true);
                if (!this.ins._arr[0]['iconSkin']) {
                    for (let index = 0; index < this.ins._arr.length; index++) {
                        const element = this.ins._arr[index];
                        element['iconSkin'] = `Game/UI/Ranking/IconSkin/avatar_${element[this.ins._property.index]}.png`;
                    }
                }
                this.ins._pitchName = '玩家';
            }
            return this.ins;
        }
        _otherPro = {
            rankNum: 'rankNum',
            fansNum: 'fansNum',
            iconSkin: 'iconSkin',
        }
        _classify = {
            other: 'other',
            self: 'self',
        }
    }

    /**从哪里进来*/
    export let _whereFrom: string = 'Start';
    export class Ranking extends Admin._SceneBase {
        lwgOnAwake(): void {
            _Data._ins()._List = this._ListVar('List');
            if (_whereFrom === 'MakePattern') {
                _Data._ins()._addAllProPerty(_Data._ins()._otherPro.fansNum, (): number => {
                    return Tools._Number.randomOneInt(100, 150);
                })
                const obj = _Data._ins()._getPitchObj();
                obj[_Data._ins()._otherPro.fansNum] += Tools._Number.randomOneInt(115, 383);
            }
            _Data._ins()._sortByProperty(_Data._ins()._otherPro.fansNum, _Data._ins()._otherPro.rankNum);
            this._evNotify(_Start._Event.updateRanking);
            _Data._ins()._listRender = (Cell: Laya.Box, index: number) => {
                const data = Cell.dataSource;
                const Board = Cell.getChildByName('Board') as Laya.Image;
                const Name = Cell.getChildByName('Name') as Laya.Label;
                if (data[_Data._ins()._property.classify] === _Data._ins()._classify.self) {
                    Board.skin = `Game/UI/Ranking/x_di.png`;
                    Name.text = _PersonalInfo._name.value;
                } else {
                    Board.skin = `Game/UI/Ranking/w_di.png`;
                    Name.text = data[_Data._ins()._property.name];
                }
                const RankNum = Cell.getChildByName('RankNum') as Laya.Label;
                RankNum.text = String(data[_Data._ins()._otherPro.rankNum]);
                const FansNum = Cell.getChildByName('FansNum') as Laya.Label;
                FansNum.text = String(data[_Data._ins()._otherPro.fansNum]);

                const IconPic = Cell.getChildByName('Icon').getChildAt(0) as Laya.Image;
                IconPic.skin = data[_Data._ins()._otherPro.iconSkin];
            }
        }

        lwgOpenAni(): number {
            if (_whereFrom === 'MakePattern') {
                AudioAdmin._playVictorySound();
                this._ImgVar('Background').alpha = 0;
                this._ImgVar('Content').scale(0.5, 0.5);
                Animation2D.bombs_Appear(this._ImgVar('Content'), 0, 1, 1.2, 0, 350, null, 0);
                Animation2D.fadeOut(this._ImgVar('Background'), 0, 1, 350);
            } else {
                this._ImgVar('Background').alpha = 0;
                this._ImgVar('Content').alpha = 0;
                Animation2D.fadeOut(this._ImgVar('Background'), 0, 1, 350);
                Animation2D.fadeOut(this._ImgVar('Content'), 0, 1, 200);
            }
            return 100;
        }

        lwgOnStart(): void {
            _Data._ins()._listScrollToLast();
            if (_whereFrom === 'MakePattern') {
                _Data._ins()._listTweenToPitchChoose(-1, 1500);

                const centerP1 = new Laya.Point(Laya.stage.width / 2, 0);
                const num1 = 150;
                TimerAdmin._frameNumRandomLoop(1, 3, num1, this, () => {
                    Effects2D._Particle._fallingRotate(Laya.stage, centerP1, [Laya.stage.width, 0], [10, 30], [10, 30], [Effects2D._SkinUrl.矩形1, Effects2D._SkinUrl.矩形2, Effects2D._SkinUrl.矩形3], null, [300, Laya.stage.height], [1, 8]);
                })

                const num2 = 16;
                const centerP2 = new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2 - 50);
                TimerAdmin._frameNumRandomLoop(10, 25, num2, this, () => {
                    const count = Tools._Number.randomOneInt(10, 20);
                    const time = 30;
                    const dis = Tools._Number.randomOneInt(100, 300);
                    const radomP = Tools._Point.randomPointByCenter(centerP2, 500, 150)[0];
                    for (let index = 0; index < count * 2; index++) {
                        Effects2D._Particle._sprayRound(Laya.stage, radomP, null, [20, 40], null, [Effects2D._SkinUrl.花4], null, [dis, dis], [time, time]);
                    }
                    for (let index = 0; index < count * 2; index++) {
                        Effects2D._Particle._sprayRound(Laya.stage, radomP, null, [20, 40], null, [Effects2D._SkinUrl.花4], null, [50, dis - 20], [time, time]);
                    }
                })
                _whereFrom = 'Start';
            } else {
                if (_Data._ins()._getProperty(_Data._ins()._pitchName, _Data._ins()._otherPro.rankNum) == 1) {
                    _Data._ins()._listTweenToPitch(600);
                } else {
                    _Data._ins()._listTweenToPitchChoose(-1, 600);
                }
            }
        }

        lwgButton(): void {
            this._btnUp(this._ImgVar('BtnClose'), () => {
                this._closeScene();
            })
        }
        lwgCloseAni(): number {
            Animation2D.fadeOut(this._ImgVar('Background'), 1, 0, 200);
            Animation2D.fadeOut(this._ImgVar('Content'), 1, 0, 300);
            return 200;
        }
    }
}

export default _Ranking.Ranking;