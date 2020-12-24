import { Adaptive, Admin } from "./Lwg";

export module _Tweeting {
    export let _photo = [];

    export class Tweeting extends Admin._SceneBase {
        Main = {
            owner: null as Laya.Box,
            PlayerName: null as Laya.Label,
            AttentionNum: null as Laya.Label,
            FansNum: null as Laya.Label,
            AroductionNum: null as Laya.Label,
            HotList: null as Laya.List,
            Publishontent: null as Laya.Label,
            ChoosePhotos: null as Laya.Panel,
        };
        ChoosePhot = {
            owner: null as Laya.Box,
            open: ()=>{},
            close: ()=>{},
        };
        Dynamic = {
            owner: null as Laya.Box,
            open: ()=>{},
            close: ()=>{},
        };
        GetFan = {
            owner: null as Laya.Box,
            open: ()=>{},
            close: ()=>{},
        };

        lwgOnAwake(): void {

            
        }

    }
}