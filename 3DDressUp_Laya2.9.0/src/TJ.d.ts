declare namespace TJ.Define {
    namespace Channel {
        namespace Android {
            let GooglePlay: string;
            let MiGuTV: string;
            let _233: string;
            let wdj: string;
            let aiqiyi: string;
            let mailaing3: string;
            let mintegral: string;
            let tongyong2: string;
            let egame: string;
            let mailiang: string;
            let agg: string;
            let test: string;
            let baidu: string;
            let tianzi: string;
            let _4399: string;
            let nby: string;
            let wifi: string;
            let baidu2: string;
            let tianzi1: string;
            let _43992: string;
            let haoyou: string;
            let toutiao: string;
            let tongyong: string;
            let xiaoqi: string;
            let qingning: string;
            let coolpad: string;
            let jinli: string;
            let zhongxing: string;
            let samsung: string;
            let taptap: string;
            let yyb: string;
            let jiuyou: string;
            let yyh: string;
            let qihoo: string;
            let lenovo: string;
            let huawei: string;
            let meizu: string;
            let xiaomi: string;
            let vivo: string;
            let oppo: string;
        }
        namespace iOS {
            let AppStore_iOS: string;
        }
        namespace AppRt {
            let HUAWEI_AppRt: string;
            let _4399_AppRt: string;
            let WX_AppRt: string;
            let XIAOMI_AppRt: string;
            let VIVO_AppRt: string;
            let OPPO_AppRt: string;
            let QTT_AppRt: string;
            let ZJTD_AppRt: string;
            let Kwai_AppRt: string;
            let UC_AppRt: string;
            let SQ_AppRt: string;
            let SY_AppRt: string;
            let MZ_AppRt: string;
            let HG_AppRt: string;
        }
    }
}
declare namespace TJ.Define {
    enum Event {
        Click = 0,
        Close = 1,
        Expose = 2,
        NoAds = 3,
        Reward = 4,
        NoReward = 5,
        Success = 6,
        Failure = 7,
        Error = 8,
        Cancel = 9,
        Complete = 10,
        Statistic = 11
    }
}
declare namespace TJ.Define {
    enum Platform {
        Unknown = 0,
        Android = 1,
        iOS = 2,
        AppRt = 3
    }
}
declare namespace TJ.Define.SDK {
    let version: string;
}
declare namespace TJ.Engine {
    namespace Android {
        class Java {
            private static javaClass;
            private static Send;
            static Set(className: string, fieldName: string, value: string, obj: string): void;
            static Get(className: string, fieldName: string, obj: string): string;
            static Call(className: string, methodName: string, values: string, obj: string): string;
            static New(className: string, values: string): string;
            static Class(obj: string): string;
            static GetInt(obj: string): number;
            static GetFloat(obj: string): number;
            static GetBoolean(obj: string): boolean;
            static GetString(obj: string): string;
            static SetValue(value: number | boolean | string, javaSignature: string): string;
        }
    }
}
declare namespace TJ.Engine {
    namespace iOS {
        class Objc {
            private static objcClass;
            private static Send;
            static Set(className: string, fieldName: string, value: string, obj: string): void;
            static Get(className: string, fieldName: string, obj: string): string;
            static Call(className: string, methodName: string, values: string, obj: string): string;
            static New(className: string): string;
            static Class(obj: string): string;
            static GetInt(obj: string): number;
            static GetFloat(obj: string): number;
            static GetBoolean(obj: string): boolean;
            static GetString(obj: string): string;
            static SetValue(value: number | boolean | string): string;
        }
    }
}
declare namespace TJ.Engine {
    class RuntimeInfo {
        static readonly windowSize: {
            width: number;
            height: number;
        };
        static readonly platform: Define.Platform;
    }
}
declare namespace TJ.Common {
    class MD5 {
        private hexcase;
        private b64pad;
        hex_md5(s: string): string;
        b64_md5(s: string): string;
        any_md5(s: string, e: string): string;
        hex_hmac_md5(k: string, d: string): string;
        b64_hmac_md5(k: string, d: string): string;
        any_hmac_md5(k: string, d: string, e: string): string;
        rstr_md5(s: string): string;
        rstr_hmac_md5(key: string, data: string): string;
        rstr2hex(input: string): string;
        rstr2b64(input: string): string;
        rstr2any(input: string, encoding: string): string;
        str2rstr_utf8(input: string): string;
        str2rstr_utf16le(input: string): string;
        str2rstr_utf16be(input: string): string;
        rstr2binl(input: string): any[];
        binl2rstr(input: number[]): string;
        binl_md5(x: number[], len: number): number[];
        md5_cmn(q: any, a: any, b: any, x: any, s: any, t: any): number;
        md5_ff(a: any, b: any, c: any, d: any, x: any, s: any, t: any): number;
        md5_gg(a: any, b: any, c: any, d: any, x: any, s: any, t: any): number;
        md5_hh(a: any, b: any, c: any, d: any, x: any, s: any, t: any): number;
        md5_ii(a: any, b: any, c: any, d: any, x: any, s: any, t: any): number;
        safe_add(x: any, y: any): number;
        bit_rol(num: any, cnt: any): number;
    }
}
declare namespace TJ.Common {
    class Guid {
        static New(): string;
    }
}
declare namespace TJ.Common {
    class Num_ {
        protected _value: number;
        constructor(value: number);
        readonly value: number;
        toString(): string;
    }
    class Int_ extends Num_ {
        readonly value: number;
        readonly javaSignature: string;
    }
    class Long_ extends Num_ {
        readonly value: number;
        readonly javaSignature: string;
    }
    class Float_ extends Num_ {
        readonly javaSignature: string;
    }
    class Bool_ {
        protected _value: boolean;
        constructor(value: boolean);
        readonly value: boolean;
        toString(): string;
        readonly javaSignature: string;
    }
    class String_ {
        protected _value: string;
        constructor(value: string);
        readonly value: string;
        toString(): string;
        readonly javaSignature: string;
        static Format(format: string, ...args: string[]): string;
        static IsNullOrEmpty(value: string): boolean;
    }
    class Date_ {
        static readonly nowSeconds: number;
        static Format(date: Date, fmt: string): string;
    }
}
declare namespace TJ.Common {
    class Action {
        constructor(...func: any[]);
        private invocationList;
        GetInvocationList(): Function[];
        Add(func: Function | Action): this;
        Remove(func: Function | Action): void;
        Clear(): void;
        Invoke(...param: any[]): void;
    }
}
declare namespace TJ.Common.Android {
    class Java {
        private static SerializeObjects;
        static Set(className: string, fieldName: string, value: Object_, obj: Object_): void;
        static Get(className: string, fieldName: string, obj: Object_): Object_;
        static Call(className: string, methodName: string, values: Object_[], obj: Object_): Object_;
        static New(className: string, values: Object_[]): Object_;
        static Class(obj: Object_): string;
        static GetInt(obj: Object_): number;
        static GetFloat(obj: Object_): number;
        static GetBoolean(obj: Object_): boolean;
        static GetString(obj: Object_): string;
        static SetValue(value: Int_ | Float_ | Bool_ | String_): Object_;
    }
    class Object_ {
        private objectIndex;
        toString(): string;
        private constructor();
        static Get(obj: Int_ | Float_ | Bool_ | String_ | string): Object_;
        GetValue<T extends Int_ | Float_ | Bool_ | String_>(type: {
            prototype: T;
        }): T;
    }
    class JavaClass {
        className: string;
        constructor(className: string);
        SetStatic(fieldName: string, value: Int_ | Float_ | Bool_ | String_ | JavaObject): void;
        GetStatic<T extends Int_ | Float_ | Bool_ | String_ | JavaObject>(type: {
            prototype: T;
        }, fieldName: string): T;
        CallStatic(methodName: string, ...values: (Int_ | Float_ | Bool_ | String_ | JavaObject)[]): void;
        CallStatic<T extends Int_ | Float_ | Bool_ | String_ | JavaObject>(type: {
            prototype: T;
        }, methodName: string, ...values: (Int_ | Float_ | Bool_ | String_ | JavaObject)[]): T;
        New(...values: (Int_ | Float_ | Bool_ | String_ | JavaObject)[]): Object_;
    }
    class JavaObject {
        private javaClass;
        private object;
        toString(): string;
        private constructor();
        static New(className: string, ...values: (Int_ | Float_ | Bool_ | String_ | JavaObject)[]): JavaObject;
        static Get(obj: Object_): JavaObject;
        Set(fieldName: string, value: Int_ | Float_ | Bool_ | String_ | JavaObject): void;
        Get<T extends Int_ | Float_ | Bool_ | String_ | JavaObject>(type: {
            prototype: T;
        }, fieldName: string): T;
        Call(methodName: string, ...values: (Int_ | Float_ | Bool_ | String_ | JavaObject)[]): void;
        Call<T extends Int_ | Float_ | Bool_ | String_ | JavaObject>(type: {
            prototype: T;
        }, methodName: string, ...values: (Int_ | Float_ | Bool_ | String_ | JavaObject)[]): T;
        static GetValue<T extends Int_ | Float_ | Bool_ | String_ | JavaObject>(type: {
            prototype: T;
        }, obj: Object_): T;
        static SetValue(value: Int_ | Float_ | Bool_ | String_ | JavaObject): Object_;
        static SetValues(...value: (Int_ | Float_ | Bool_ | String_ | JavaObject)[]): Object_[];
    }
}
declare namespace TJ.Common {
    class CallbackManager {
        private static callbacks;
        static Set(cbi: CallbackInfo): string;
        static Get(guid: string): CallbackInfo;
    }
    class CallbackInfo {
        Clone(): CallbackInfo;
        private callbacks;
        Get(key: any): Action;
        Set(key: any, value: Action | Function): void;
        Add(key: any, value: Action | Function): void;
        Run(key: any, ...args: any[]): void;
    }
}
declare namespace TJ.Common {
    namespace Component {
        class Interface {
            private isInit;
            DoInit(): void;
            OnInit(): void;
        }
        class Manager {
            private static components;
            static AddComponent<T extends Interface>(type: {
                prototype: T;
            }): Interface;
            static GetComponent<T extends Interface>(type: {
                prototype: T;
            }): T;
            static GetComponents<T extends Interface>(type: {
                prototype: T;
            }): T[];
            static GetComponentsWithInit<T extends Interface>(type: {
                prototype: T;
            }): T[];
        }
    }
}
declare namespace TJ.Common.iOS {
    class Objc {
        private static SerializeObjects;
        static Set(className: string, fieldName: string, value: Object_, obj: Object_): void;
        static Get(className: string, fieldName: string, obj: Object_): Object_;
        static Call(className: string, methodName: string, values: Object_[], obj: Object_): Object_;
        static New(className: string): Object_;
        static Class(obj: Object_): string;
        static GetInt(obj: Object_): number;
        static GetFloat(obj: Object_): number;
        static GetBoolean(obj: Object_): boolean;
        static GetString(obj: Object_): string;
        static SetValue(value: Int_ | Float_ | Bool_ | String_): Object_;
    }
    class Object_ {
        private objectIndex;
        toString(): string;
        private constructor();
        static Get(obj: Int_ | Float_ | Bool_ | String_ | string): Object_;
        GetValue<T extends Int_ | Float_ | Bool_ | String_>(type: {
            prototype: T;
        }): T;
    }
    class ObjcClass {
        className: string;
        constructor(className: string);
        SetStatic(fieldName: string, value: Int_ | Float_ | Bool_ | String_ | ObjcObject): void;
        GetStatic<T extends Int_ | Float_ | Bool_ | String_ | ObjcObject>(type: {
            prototype: T;
        }, fieldName: string): T;
        CallStatic(methodName: string, ...values: (Int_ | Float_ | Bool_ | String_ | ObjcObject)[]): void;
        CallStatic<T extends Int_ | Float_ | Bool_ | String_ | ObjcObject>(type: {
            prototype: T;
        }, methodName: string, ...values: (Int_ | Float_ | Bool_ | String_ | ObjcObject)[]): T;
        New(...values: (Int_ | Float_ | Bool_ | String_ | ObjcObject)[]): Object_;
    }
    class ObjcObject {
        private objcClass;
        private object;
        toString(): string;
        private constructor();
        static New(className: string, ...values: (Int_ | Float_ | Bool_ | String_ | ObjcObject)[]): ObjcObject;
        static Get(obj: Object_): ObjcObject;
        Set(fieldName: string, value: Int_ | Float_ | Bool_ | String_ | ObjcObject): void;
        Get<T extends Int_ | Float_ | Bool_ | String_ | ObjcObject>(type: {
            prototype: T;
        }, fieldName: string): T;
        Call(methodName: string, ...values: (Int_ | Float_ | Bool_ | String_ | ObjcObject)[]): void;
        Call<T extends Int_ | Float_ | Bool_ | String_ | ObjcObject>(type: {
            prototype: T;
        }, methodName: string, ...values: (Int_ | Float_ | Bool_ | String_ | ObjcObject)[]): T;
        static GetValue<T extends Int_ | Float_ | Bool_ | String_ | ObjcObject>(type: {
            prototype: T;
        }, obj: Object_): T;
        static SetValue(value: Int_ | Float_ | Bool_ | String_ | ObjcObject): Object_;
        static SetValues(...value: (Int_ | Float_ | Bool_ | String_ | ObjcObject)[]): Object_[];
    }
    class SwiftClass extends ObjcClass {
        constructor(className: string);
    }
    class SwiftObject {
        static New(className: string, ...values: (Int_ | Float_ | Bool_ | String_ | ObjcObject)[]): ObjcObject;
    }
}
declare namespace TJ.Common.Prefs {
    class RawData {
        value: any;
        time: number;
    }
    namespace Raw {
        let changeKey: string;
        let changeKeys: string[];
        function GetRaw(key: string): string;
        function SetRaw(key: string, value: any): void;
        function GetRawData(key: string): RawData;
        function SetRawData(key: string, data: RawData): RawData;
        function RawGet(key: string): any;
        function RawSet(key: string, value: any): any;
        function Get(key: string): any;
        function Set(key: string, value: any): void;
        function GetInt(key: string, defaultValue?: number): number;
        function SetInt(key: string, value: number): void;
        function GetFloat(key: string, defaultValue?: number): number;
        function SetFloat(key: string, value: number): void;
        function GetString(key: string, defaultValue?: string): string;
        function SetString(key: string, value: string): void;
        function GetBool(key: string, defaultValue?: boolean): boolean;
        function SetBool(key: string, value: boolean): void;
        function DeleteAll(tag?: string): void;
        function DeleteKey(key: string): void;
        function HasKey(key: string): boolean;
    }
}
declare namespace TJ.Common.Prefs.Player {
    function Get(key: string): any;
    function Set(key: string, value: any): void;
    function GetInt(key: string, defaultValue?: number): number;
    function SetInt(key: string, value: number): void;
    function GetFloat(key: string, defaultValue?: number): number;
    function SetFloat(key: string, value: number): void;
    function GetString(key: string, defaultValue?: string): string;
    function SetString(key: string, value: string): void;
    function GetBool(key: string, defaultValue?: boolean): boolean;
    function SetBool(key: string, value: boolean): void;
    function DeleteAll(): void;
    function DeleteKey(key: string): void;
    function HasKey(key: string): boolean;
}
declare namespace TJ.Common.Prefs.System {
    function Get(key: string): any;
    function Set(key: string, value: any): void;
    function GetInt(key: string, defaultValue?: number): number;
    function SetInt(key: string, value: number): void;
    function GetFloat(key: string, defaultValue?: number): number;
    function SetFloat(key: string, value: number): void;
    function GetString(key: string, defaultValue?: string): string;
    function SetString(key: string, value: string): void;
    function GetBool(key: string, defaultValue?: boolean): boolean;
    function SetBool(key: string, value: boolean): void;
    function DeleteAll(): void;
    function DeleteKey(key: string): void;
    function HasKey(key: string): boolean;
}
declare namespace TJ.Common.PriorityInit {
    function Add(p: number, f: Function): void;
}
declare namespace TJ.Common {
    class PromiseWrap<T> {
        constructor(executor?: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void);
        promise: Promise<T>;
        pending: Promise<any>;
        private resolve;
        resolved: boolean;
        value: T | PromiseLike<T>;
        Resolve(value?: T | PromiseLike<T>): void;
        private reject;
        rejucted: boolean;
        reason: any;
        Reject(reason?: any): void;
    }
}
declare namespace TJ.Common {
    class SystemInfo {
        static startupGuid: string;
        static startupTime: number;
        private static _clientGuid;
        static readonly clientGuid: string;
        private static _userGuid;
        static userGuid: string;
        static foreground: boolean;
        static foregroundTime: number;
    }
}
declare namespace TJ.Common {
    class Url {
        static GetArgs(url?: string): any;
    }
}
declare namespace TJ.Common {
    class WWW {
        private _form;
        private _url;
        private _promise;
        private _resolve;
        private _error;
        private _text;
        private guid;
        private readonly logTag;
        constructor(url: string, form?: {});
        logSend: boolean;
        readonly error: string;
        logError: boolean;
        private LogError;
        readonly text: string;
        logText: boolean;
        private LogText;
        Send(method?: "get" | "post", format?: "form" | "json"): Promise<{}>;
        DoSend(url: string, method: string, data: string): void;
    }
}
declare namespace TJ.API.Account {
    class IAccount extends Common.Component.Interface {
        Login(param: Param): Promise<{}>;
        GetUserInfo(param: Param): Promise<{}>;
        OnInit(): Promise<void>;
    }
    class Param {
        force: boolean;
    }
    let userId: {};
    let autoLogin: boolean;
    let loginPromiseWrap: Common.PromiseWrap<{}>;
    function Login(param: Param): Promise<void>;
    let userInfo: {};
    let autoGetUserInfo: boolean;
    let getUserInfoPromiseWrap: Common.PromiseWrap<{}>;
    function GetUserInfo(param: Param): Promise<void>;
}
declare namespace TJ.API.AdService {
    class IAdService extends Common.Component.Interface {
        ShowBanner(param: Param): void;
        RemoveBanner(param: Param): void;
        NormalReady(param: Param): boolean;
        ShowNormal(param: Param): void;
        RewardReady(param: Param): boolean;
        ShowReward(param: Param): void;
        LoadNative(param: Param): NativeItem;
        Exist(): boolean;
    }
    class Param {
        cbi: Common.CallbackInfo;
        id: string;
        place: Place;
        extraAd: boolean;
        template: boolean;
        video: boolean;
        refresh: boolean;
        onNative: (item: NativeItem) => void;
        ToJson(): string;
    }
    enum Place {
        LEFT = 3,
        RIGHT = 5,
        CENTER = 17,
        TOP = 48,
        BOTTOM = 80
    }
    function ShowBanner(param: Param): void;
    function RemoveBanner(param: Param): void;
    function NormalReady(param: Param): boolean;
    function ShowNormal(param: Param): void;
    function RewardReady(param: Param): boolean;
    function ShowReward(param: Param): void;
    class NativeItem {
        title: string;
        desc: string;
        iconUrl: string;
        imgUrl: string;
        logoUrl: string;
        OnShow(): void;
        OnClick(): void;
    }
    function LoadNative(param: Param): NativeItem;
    function Exist(): boolean;
}
declare namespace TJ.API.Analytics {
    class IAnalytics extends Common.Component.Interface {
        Event(param: Param): void;
        EventBegin(param: Param): void;
        EventEnd(param: Param): void;
        PageBegin(param: Param): void;
        PageEnd(param: Param): void;
        LevelStart(param: Param): void;
        LevelFinish(param: Param): void;
        LevelFail(param: Param): void;
        Pay(param: Param): void;
        Buy(param: Param): void;
        Use(param: Param): void;
        Bonus(param: Param): void;
    }
    class Param {
        id: string;
        dic: {};
        cash: number;
        coin: number;
        amount: number;
        price: number;
        source: number;
        ToJson(): string;
    }
    function Event(param: Param): void;
    function EventBegin(param: Param): void;
    function EventEnd(param: Param): void;
    function PageBegin(param: Param): void;
    function PageEnd(param: Param): void;
    function LevelStart(param: Param): void;
    function LevelFinish(param: Param): void;
    function LevelFail(param: Param): void;
    function Pay(param: Param): void;
    function Buy(param: Param): void;
    function Use(param: Param): void;
    function Bonus(param: Param): void;
}
declare namespace TJ.API.AppCtl {
    class IAppCtl extends Common.Component.Interface {
        Review(): void;
        Quit(): void;
        UserAgreement(): void;
        PrivacyPolicy(): void;
    }
    function Review(): void;
    function Quit(): void;
    function UserAgreement(): void;
    function PrivacyPolicy(): void;
}
declare namespace TJ.API.AppInfo {
    class IAppInfo extends Common.Component.Interface {
        AppGuid(): string;
        ProductName(): string;
        PackageName(): string;
        VersionName(): string;
        VersionCode(): number;
        Channel(): string;
    }
    function AppGuid(): string;
    function ProductName(): string;
    function PackageName(): string;
    function VersionName(): string;
    function VersionCode(): number;
    function Channel(): string;
}
declare namespace TJ.API.Billing {
    class IBilling extends Common.Component.Interface {
        Purchase(param: Param): void;
        QueryAll(param: Param): void;
        Consume(param: Param): void;
        Exist(): boolean;
    }
    class Param {
        cbi: Common.CallbackInfo;
        product: Product;
        order: Order;
        ToJson(): string;
    }
    class Product {
        id: string;
        name: string;
        description: string;
        price: number;
        restore: boolean;
        subs: boolean;
    }
    class Order {
        id: string;
        date: Date;
    }
    function Purchase(param: Param): void;
    function QueryAll(param: Param): void;
    function Consume(param: Param): void;
    function Exist(): boolean;
}
declare namespace TJ.API.Promo {
    class IPromo extends Common.Component.Interface {
        Pop(param: Param): void;
    }
    class Param {
        appId: string;
        appPackage: string;
        storePackage: string;
        path: string;
        extraData: {};
        uri: string;
        cbi: Common.CallbackInfo;
    }
    function Pop(param: Param): void;
}
declare namespace TJ.API.TA {
    class ITA extends Common.Component.Interface {
        Event(param: Param): void;
        PromoEvent(param: Param): void;
        PromoEvents(params: Param[]): void;
        Event_LifeCycle_Load(param: Param): void;
        Event_LifeCycle_Start(param: Param): void;
        Event_LifeCycle_Destroy(param: Param): void;
        Event_LifeCycle_Enable(param: Param): void;
        Event_LifeCycle_Disable(param: Param): void;
        Event_Page_Enter(param: Param): void;
        Event_Page_Show(param: Param): void;
        Event_Page_Leave(param: Param): void;
        Event_Button_Show(param: Param): void;
        Event_Button_Click(param: Param): void;
        Event_Level_Start(param: Param): void;
        Event_Level_Finish(param: Param): void;
        Event_Level_Fail(param: Param): void;
    }
    class Param {
        id: string;
        source: string;
        type: string;
        style: string;
        icon: string;
    }
    let log: boolean;
    function Event(param: Param): void;
    function PromoEvent(param: Param): void;
    function PromoEvents(params: Param[]): void;
    function Event_LifeCycle_Load(param: Param): void;
    function Event_LifeCycle_Start(param: Param): void;
    function Event_LifeCycle_Destroy(param: Param): void;
    function Event_LifeCycle_Enable(param: Param): void;
    function Event_LifeCycle_Disable(param: Param): void;
    function Event_Page_Enter(param: Param): void;
    function Event_Page_Show(param: Param): void;
    function Event_Page_Leave(param: Param): void;
    function Event_Button_Show(param: Param): void;
    function Event_Button_Click(param: Param): void;
    function Event_Level_Start(param: Param): void;
    function Event_Level_Finish(param: Param): void;
    function Event_Level_Fail(param: Param): void;
}
declare namespace TJ.API.Vibrate {
    class IVibrate extends Common.Component.Interface {
        Short(): void;
        Long(): void;
        Time(seconds: number): void;
    }
    function Short(): void;
    function Long(): void;
    function Time(seconds: number): void;
}
declare namespace TJ.Develop.ABTest {
    let plan: string;
    let plans: string[];
    function Init(checkVersion?: boolean): void;
}
declare namespace TJ.Develop.ReYun {
    namespace Raw {
        let log: boolean;
        function Install(appid: string, deviceid: string, channelid: string): void;
        function Startup(appid: string, deviceid: string, channelid: string): void;
        function Register(appid: string, deviceid: string, channelid: string, who: string): void;
        function Loggedin(appid: string, deviceid: string, channelid: string, who: string): void;
        function Payment(appid: string, deviceid: string, channelid: string, who: string, currencyAmount: string, currencytype: string, iapamount: string, iapname: string, paymenttype: string, transactionid: string, virtualcoinamount: string): void;
        function Economy(appid: string, deviceid: string, channelid: string, who: string, itemamount: string, itemname: string, itemtotalprice: string): void;
        function Quest(appid: string, deviceid: string, channelid: string, who: string, questid: string, queststatus: string, questtype: string): void;
        function Event(appid: string, deviceid: string, channelid: string, who: string, what: string): void;
        function Heartbeat(appid: string, deviceid: string, channelid: string, who: string): void;
    }
    class Data {
        appid: string;
        channelid: string;
        who: string;
        log: boolean;
    }
    function Install(data: Data): void;
    function Startup(data: Data): void;
    function Register(data: Data): void;
    function Loggedin(data: Data): void;
    function Payment(data: Data, currencyAmount: string, currencytype: string, iapamount: string, iapname: string, paymenttype: string, transactionid: string, virtualcoinamount: string): void;
    function Economy(data: Data, itemamount: string, itemname: string, itemtotalprice: string): void;
    function Quest(data: Data, questid: string, queststatus: string, questtype: string): void;
    function Event(data: Data, what: string): void;
    function Heartbeat(data: Data): void;
}
declare namespace TJ.Develop.Yun.Storage.Player {
    function GetData(): Promise<{}>;
    function SaveData(data: {}): Promise<void>;
    function ClearData(keys: string[]): Promise<void>;
}
declare namespace TJ.Develop.Yun {
    let apiUrl: string;
    class Result {
        P: any;
        E: string;
    }
    function GetResult(www: Common.WWW): Promise<any>;
}
declare namespace TJ.Develop.Yun.Config {
    function GameCfg(): Promise<any>;
}
declare namespace TJ.Develop.Yun.DouYin {
    let apiUrl: string;
    function ReportVideoIdInfo(videoIdInfo: {
        videoId: string;
        videoguid: string;
    }): Promise<void>;
    function GetVideosByTime(startTime: number, endTime: number): Promise<{
        videoId: string;
        createAt: number;
    }[]>;
    function ReportVideoInfo(videoInfo: {
        videoId: string;
        diggCount?: number;
        coverUrl?: string;
    }): Promise<void>;
}
declare namespace TJ.Develop.Yun.Location {
    let ip: string;
    let country: string;
    let province: string;
    let city: string;
    function NowTime(): number;
    let syncPromise: Promise<void>;
    function Sync(): Promise<void>;
    let shield: boolean;
}
declare namespace TJ.Develop.Yun.Login {
    let apiUrl: string;
}
declare namespace TJ.Develop.Yun.Login.CLogin {
    function QQAppRT(exInfo: {
        code: string;
    }): Promise<{
        openid: string;
        session_key: string;
        unionid: string;
        errcode: number;
        errmsg: string;
    }>;
    function TTAppRT(exInfo: {
        code: string;
        anonymousCode: string;
    }): Promise<{
        session_key: string;
        openid: string;
        anonymous_openid: string;
        errcode: number;
        errmsg: string;
    }>;
    function WXLogin(exInfo: {
        code: string;
    }): Promise<{
        openid: string;
        session_key: string;
        unionid: string;
        errcode: number;
        errmsg: string;
    }>;
    function VIVOAppRT(exInfo: {
        token: string;
    }): Promise<{
        code: number;
        msg: string;
        data: {
            openId: string;
            nickName: string;
            smallAvatar: string;
            biggerAvatar: string;
            gender: number;
        };
    }>;
    function QTTAppRT(exInfo: {
        ticket: string;
        platform: string;
    }): Promise<{
        code: number;
        message: string;
        showErr: number;
        currentTime: number;
        data: {
            open_id: string;
            union_id: string;
            nickname: string;
            avatar: string;
            wlx_platform: string;
        };
    }>;
}
declare namespace TJ.Develop.Yun.Login.Public {
    function GetUserguid(userId: {}): Promise<string>;
}
declare namespace TJ.Develop.Yun.Player {
    let apiUrl: string;
}
declare namespace TJ.Develop.Yun.Player.Player {
    function ReportUserInfo(userInfo: {}): Promise<void>;
}
declare namespace TJ.Develop.Yun.Prefs.Player {
    function Get(key: string): any;
    function Set(key: string, value: any): void;
    function GetInt(key: string, defaultValue?: number): number;
    function SetInt(key: string, value: number): void;
    function GetFloat(key: string, defaultValue?: number): number;
    function SetFloat(key: string, value: number): void;
    function GetString(key: string, defaultValue?: string): string;
    function SetString(key: string, value: string): void;
    function GetBool(key: string, defaultValue?: boolean): boolean;
    function SetBool(key: string, value: boolean): void;
    function DeleteAll(): void;
    function DeleteKey(key: string): void;
    function HasKey(key: string): boolean;
    function UploadData(key?: string): void;
    function Sync(): Promise<void>;
}
declare namespace TJ.Develop.Yun.Promo {
    class Data {
        private static readonly dataUrl;
        private static www;
        private static send;
        static LoadList(style?: string): Promise<Data[]>;
        promoGuid: string;
        appGuid: string;
        appPackageName: string;
        promoOriginIcon: string;
        weight: number;
        title: string;
        describe: string;
        tag: number;
        private promoStyle;
        private iconList;
        appId: string;
        path: string;
        private channelPackageName;
        private channelRule;
        private style;
        private iconMD5;
        readonly icon: string;
        static ReportAwake(style?: string): void;
        static ReportStart(style?: string): void;
        loaded: boolean;
        ReportLoad(): void;
        showed: boolean;
        ReportShow(): void;
        clicked: boolean;
        ReportClick(): void;
        opened: boolean;
        ReportOpen(): void;
        private Event;
        private static Event;
        Load(): void;
        Click(): void;
        private static readonly formatLogApp;
        private static FormatLogStyle;
        private readonly formatLogStyle;
        private readonly formatLogPromo;
        private readonly formatLogIcon;
        private static FormatLogEvent;
        static readonly reyunData: ReYun.Data;
    }
}
declare namespace TJ.Develop.Yun.Promo {
    class List {
        private datas;
        private loaded;
        Add(data: Data): void;
        Remove(data: Data): void;
        readonly count: number;
        Load(reuse?: boolean): Data;
        Unload(data: Data): void;
        private static Random;
        static Get(style?: string): Promise<List>;
    }
}
declare namespace TJ.Develop.Yun.Rank {
    class RankData {
        userguid: string;
        score: number;
        rank: number;
        userName: string;
        avatar: string;
    }
    function GetSelfRank(rankguid: string): RankData;
    function GetRankList(rankguid: string): Promise<RankData[]>;
    function ReportScore(rankguid: string, score: number, userguid?: string): Promise<void>;
}
declare namespace TJ.Platform.Android.Extern.ADS {
    class ExApi {
        static jc: Common.Android.JavaClass;
        static Debug(fn: any, ...ps: any[]): void;
        static ShowBanner(json: string): void;
        static RemoveBanner(json: string): void;
        static NormalReady(json: string): boolean;
        static ShowNormal(json: string): void;
        static RewardReady(json: string): boolean;
        static ShowReward(json: string): void;
        static Exist(): boolean;
    }
}
declare namespace TJ.Platform.Android.Extern.APP {
    class Api {
        static jc: Common.Android.JavaClass;
        static Debug(fn: any, ...ps: any[]): void;
        static AppGuid(): string;
    }
    class ExApi {
        static jc: Common.Android.JavaClass;
        static Debug(fn: any, ...ps: any[]): void;
        static Quit(): void;
        static ProductName(): string;
        static PackageName(): string;
        static VersionName(): string;
        static VersionCode(): number;
        static Channel(): string;
        static UserAgreement(): void;
        static PrivacyPolicy(): void;
    }
}
declare namespace TJ.Platform.Android.Extern.GSA {
    class ExApi {
        static jc: Common.Android.JavaClass;
        static Debug(fn: any, ...ps: any[]): void;
        static Event(json: string): void;
        static EventBegin(json: string): void;
        static EventEnd(json: string): void;
        static PageBegin(json: string): void;
        static PageEnd(json: string): void;
        static LevelStart(json: string): void;
        static LevelFinish(json: string): void;
        static LevelFail(json: string): void;
        static Pay(json: string): void;
        static Buy(json: string): void;
        static Use(json: string): void;
        static Bonus(json: string): void;
    }
}
declare namespace TJ.Platform.Android.Extern.IAP {
    class ExApi {
        static jc: Common.Android.JavaClass;
        static Debug(fn: any, ...ps: any[]): void;
        static Purchase(json: string): void;
        static QueryAll(json: string): void;
        static Consume(json: string): void;
        static Exist(): boolean;
    }
}
declare namespace TJ.Platform.Android.Extern.oppo.mobad {
    class Act {
        static jc: Common.Android.JavaClass;
        static Debug(fn: any, ...ps: any[]): void;
        static GetNativeCustom(): string;
        static ShowNativeCustom(guid: string): void;
        static ClickNativeCustom(guid: string): void;
    }
}
declare namespace TJ.Platform.Android.Extern.Tools {
    class App {
        static jc: Common.Android.JavaClass;
        static Debug(fn: any, ...ps: any[]): void;
        static StartUri(uri: string, pkg: string): void;
    }
}
declare namespace TJ.Platform.Android.SDK.AdService {
}
declare namespace TJ.Platform.Android.SDK.Analytics {
}
declare namespace TJ.Platform.Android.SDK.AppCtl {
}
declare namespace TJ.Platform.Android.SDK.AppInfo {
}
declare namespace TJ.Platform.Android.SDK.Billing {
}
declare namespace TJ.Platform.Android.SDK.oppo.mobad {
}
declare namespace TJ.Platform.Android.SDK.Promo {
}
declare namespace TJ.Platform.Android.SDK.Vibrate {
}
declare namespace TJ.Platform.AppRt.Extern._4399 {
    function Exist(): boolean;
    class CanPlayAdResult {
        canPlayAd: boolean;
        remain: number;
    }
    class PlayAdResult {
        message: string;
        code: number;
    }
    function CanPlayAd(callback: (res: CanPlayAdResult) => void): void;
    function PlayAd(callback: (code: PlayAdResult) => void): void;
}
declare namespace TJ.Platform.AppRt.Extern.Adwending {
    function Exist(): boolean;
    class Parm {
        username: string;
        gameid: number;
        subtype: "X_INSPIRE" | "X_FULLVIDEO";
        isheng: 0 | 1;
        reward: number;
        checkpoint: number;
    }
    function PlayVideo(parm: Parm): void;
    function Message(callback: (res: boolean) => void): void;
    function GameOut(parm: Parm): void;
    function GameInto(parm: Parm): void;
    function GameStart(parm: Parm): void;
    function GameOver(parm: Parm): void;
}
declare namespace TJ.Platform.AppRt.Extern.HBS {
    function Exist(): boolean;
    class CallbackParam {
        success: Function;
        fail: Function;
        complete: Function;
    }
    class GameLoginResult {
        playerId: string;
        displayName: string;
        playerLevel: number;
        isAuth: number;
        ts: string;
        gameAuthSign: string;
    }
    class GameLoginParam extends CallbackParam {
        forceLogin: number;
        appid: string;
        success: (res: GameLoginResult) => void;
        fail: (data: string, code: number) => void;
    }
    function GameLogin(param: GameLoginParam): void;
    function ExitApplication(param: CallbackParam): void;
    class LaunchOption {
        query: {};
        referrerInfo: {};
    }
    function GetLaunchOptionsSync(): LaunchOption;
}
declare namespace TJ.Platform.AppRt.Extern.HG {
    function Exist(): boolean;
    function GameLoadResult(parm: {
        code: number;
    }): void;
    class RewardedVideoAd {
        private rewardedVideoAd;
        constructor(obj: any);
        Show(): Promise<any>;
        onError: (res: any) => void;
        onClose: (res: {
            isEnded: boolean;
        }) => void;
    }
    function CreateRewardedVideoAd(param: {
        adUnitId: number;
        tag?: number;
    }): RewardedVideoAd;
}
declare namespace TJ.Platform.AppRt.Extern.Kwai {
    function Exist(): boolean;
    function ReadyGo(): void;
    function WillClose(): void;
    function Init(param: {
        appId: string;
    }): void;
    class MediaRecoder {
        private obj;
        constructor(obj: any);
        Init(param: {
            callback: (error: {
                code: number;
                msg: string;
            }) => void;
        }): void;
        Destory(param: {
            callback: (error: {
                code: number;
                msg: string;
            }) => void;
        }): void;
        Start(param: {
            callback: (error: {
                code: number;
                msg: string;
            }) => void;
        }): void;
        Stop(param: {
            callback: (error: {
                code: number;
                msg: string;
            }) => void;
        }): void;
        Pause(param: {
            callback: (error: {
                code: number;
                msg: string;
            }) => void;
        }): void;
        Resume(param: {
            callback: (error: {
                code: number;
                msg: string;
            }) => void;
        }): void;
        PublishVideo(param: {
            callback: (error: {
                code: number;
                msg: string;
            }) => void;
            mouldId?: string;
        }): void;
        OnError(param: {
            listener: (error: {
                code: number;
                msg: string;
            }) => void;
        }): void;
    }
    function CreateMediaRecorder(): MediaRecoder;
    class RewardVideo {
        private rewardVideo;
        constructor(obj: any);
        Show(param: {
            success: (res: any) => void;
            fail: (code: number, msg: string) => void;
        }): void;
        OnReward(callback: (res: any) => void): void;
        OnClose(callback: (res: any) => void): void;
    }
    function CreateRewardedVideoAd(param: {
        adUnitId: string;
    }): RewardVideo;
}
declare namespace TJ.Platform.AppRt.Extern.MZ {
    function Exist(): boolean;
    class CallbackParam {
        success: (res: any) => void;
        fail: (res: any) => void;
        complete: (res: any) => void;
    }
    function VibrateShort(parm: CallbackParam): void;
    function VibrateLong(parm: CallbackParam): void;
    class BannerAdStyle {
        left: number;
        top: number;
        width: number;
        height: number;
    }
    class BannerAd {
        private bannerAd;
        constructor(obj: any);
        readonly style: BannerAdStyle;
        Show(): Promise<any>;
        Hide(): Promise<any>;
        OnClose(callback: (res: any) => void): void;
        OffClose(callback?: (res: any) => void): void;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        OffError(callback?: (res: any) => void): void;
        OnResize(callback: (res: {
            width: number;
            height: number;
        }) => void): void;
        OffResize(callback?: (res: any) => void): void;
        Destroy(): void;
    }
    function CreateBannerAd(adUnitId: string, style?: BannerAdStyle): BannerAd;
    class InsertAd {
        private insertAd;
        constructor(obj: any);
        Load(): Promise<any>;
        Show(): Promise<any>;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnClose(callback: (res: any) => void): void;
        OffClose(callback?: (res: any) => void): void;
        OnError(callback: (res: any) => void): void;
        OffError(callback?: (res: any) => void): void;
    }
    function CreateInsertAd(adUnitId: string): InsertAd;
    class RewardedVideoAd {
        private rewardedVideoAd;
        constructor(obj: any);
        Load(): void;
        Show(): void;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnRewarded(callback: (res: any) => void): void;
        OffRewarded(callback?: (res: any) => void): void;
        OnError(callback: (res: any) => void): void;
        OffError(callback?: (res: any) => void): void;
        OnClose(callback: (res: any) => void): void;
        OffClose(callback?: (res: any) => void): void;
    }
    function CreateRewardedVideoAd(adUnitId: string): RewardedVideoAd;
}
declare namespace TJ.Platform.AppRt.Extern.OPPO.QG {
    function Exist(): boolean;
    class CallbackResult {
        code: number;
        msg: string;
    }
    class CallbackParam {
        success: (res: CallbackResult) => void;
        fail: (res: CallbackResult) => void;
        complete: (res: CallbackResult) => void;
    }
}
declare namespace TJ.Platform.AppRt.Extern.OPPO.QG {
    class InitAdServiceParam extends CallbackParam {
        appId: string;
        isDebug: boolean;
        success: (res: CallbackResult) => void;
        fail: (res: CallbackResult) => void;
        complete: (res: CallbackResult) => void;
    }
    function InitAdService(param: InitAdServiceParam): void;
    class BannerAd {
        private obj;
        constructor(obj: any);
        Show(): void;
        Hide(): void;
        OnShow(callback: (res: CallbackResult) => void): void;
        OffShow(callback: any): void;
        OnHide(callback: (res: CallbackResult) => void): void;
        OffHide(callback: any): void;
        OnError(callback: (res: CallbackResult) => void): void;
        OffError(callback: any): void;
        OnResize(callback: (res: CallbackResult) => void): void;
        OffResize(): void;
        Destroy(): void;
    }
    function CreateBannerAd(posId: string): BannerAd;
    class InsertAd {
        private obj;
        constructor(obj: any);
        Load(): void;
        Show(): void;
        OnLoad(callback: (res: CallbackResult) => void): void;
        OffLoad(): void;
        OnShow(callback: (res: CallbackResult) => void): void;
        OffShow(): void;
        OnError(callback: (res: CallbackResult) => void): void;
        OffError(): void;
        Destroy(): void;
    }
    function CreateInsertAd(posId: string): InsertAd;
    class RewardedVideoAdCloseResult extends CallbackResult {
        isEnded: boolean;
    }
    class RewardedVideoAd {
        private obj;
        constructor(obj: any);
        Load(): void;
        Show(): void;
        OnLoad(callback: (res: CallbackResult) => void): void;
        OffLoad(): void;
        OnVideoStart(callback: (res: CallbackResult) => void): void;
        OffVideoStart(): void;
        OnRewarded(callback: (res: CallbackResult) => void): void;
        OffRewarded(): void;
        OnClose(callback: (res: RewardedVideoAdCloseResult) => void): void;
        OffClose(): void;
        OnError(callback: (res: CallbackResult) => void): void;
        OffError(): void;
        Destroy(): void;
    }
    function CreateRewardedVideoAd(posId: string): RewardedVideoAd;
    class NativeAdData {
        adId: string;
        title: string;
        desc: string;
        iconUrlList: string[];
        imgUrlList: string[];
        logoUrl: string;
        clickBtnTxt: string;
        creativeType: number;
        interactionType: number;
    }
    class NativeAd {
        private obj;
        constructor(obj: any);
        Load(): void;
        ReportAdShow(adId: string): void;
        ReportAdClick(adId: string): void;
        OnLoad(callback: (res: {
            adList: NativeAdData[];
        }) => void): void;
        OffLoad(): void;
        OnError(callback: (res: CallbackResult) => void): void;
        OffError(): void;
        Destroy(): void;
    }
    function CreateNativeAd(posId: string): NativeAd;
    class GameBannerAd {
        private obj;
        constructor(obj: any);
        Show(): Promise<any>;
        Hide(): Promise<any>;
        OnLoad(callback: (res: CallbackResult) => void): void;
        OffLoad(callback: Function): void;
        OnError(callback: (res: CallbackResult) => void): void;
        OffError(callback: Function): void;
        Destroy(): Promise<any>;
    }
    function CreateGameBannerAd(param: {
        adUnitId: string;
    }): GameBannerAd;
    class GamePortalAd {
        private obj;
        constructor(obj: any);
        Load(): Promise<any>;
        Show(): Promise<any>;
        OnLoad(callback: (res: CallbackResult) => void): void;
        OffLoad(callback: Function): void;
        OnClose(callback: (res: CallbackResult) => void): void;
        OffClose(callback: Function): void;
        OnError(callback: (res: CallbackResult) => void): void;
        OffError(callback: Function): void;
        Destroy(): Promise<any>;
    }
    function CreateGamePortalAd(param: {
        adUnitId: string;
    }): GamePortalAd;
}
declare namespace TJ.Platform.AppRt.Extern.OPPO.QG {
    function InstallShortcut(param: CallbackParam): void;
    class HasShortcutInstalledParam {
        success: (res: boolean) => void;
        fail: (err: any) => void;
        complete: Function;
    }
    function HasShortcutInstalled(param: HasShortcutInstalledParam): void;
}
declare namespace TJ.Platform.AppRt.Extern.OPPO.QG {
    class NavigateToMiniGameParam extends CallbackParam {
        pkgName: string;
        path: string;
        extraData: {};
    }
    function NavigateToMiniGame(param: NavigateToMiniGameParam): void;
}
declare namespace TJ.Platform.AppRt.Extern {
    namespace OPPO {
        namespace QG {
            class LoginResultData {
                age: string;
                avatar: string;
                birthday: string;
                isTourist: string;
                nickName: string;
                phoneNum: string;
                token: string;
                uid: string;
                code: number;
            }
            class LoginResult extends CallbackResult {
                data: LoginResultData;
                code: number;
                errCode: number;
                errMsg: string;
            }
            class LoginParam extends CallbackParam {
                success: (res: LoginResult) => void;
            }
            function Login(param: LoginParam): void;
            function SetLoadingProgress(progress: number): void;
            function LoadingComplete(param: CallbackParam): void;
            class ReferrerInfo {
                package: string;
                extraData: {};
            }
            class LaunchOption {
                query: {};
                referrerInfo: ReferrerInfo;
            }
            function GetLaunchOptionsSync(): LaunchOption;
            function VibrateShort(parm: CallbackParam): void;
            function VibrateLong(parm: CallbackParam): void;
            function ReportMonitor(name?: string, value?: number): void;
        }
    }
}
declare namespace TJ.Platform.AppRt.Extern.QQ {
    function Exist(): boolean;
    class CallbackResult {
        errMsg: string;
    }
    class CallbackParam {
        success: (res: CallbackResult) => void;
        fail: (res: CallbackResult) => void;
        complete: (res: CallbackResult) => void;
    }
    class LoginSuccessResult extends CallbackResult {
        code: string;
    }
    class LoginParam extends CallbackParam {
        timeout?: number;
        success: (res: LoginSuccessResult) => void;
    }
    function Login(param: LoginParam): void;
    class UserInfo {
        nickName: string;
        avatarUrl: string;
        gender: 0 | 1 | 2;
        country: string;
        province: string;
        city: string;
        language: "en" | "zh_CN" | "zh_TW";
    }
    class GetUserInfoSuccessResult extends CallbackResult {
        userInfo: UserInfo;
        rawData: string;
        signature: string;
        encryptedData: string;
        iv: string;
    }
    class GetUserInfoParam extends CallbackParam {
        withCredentials?: boolean;
        lang?: "en" | "zh_CN" | "zh_TW";
        success: (res: GetUserInfoSuccessResult) => void;
    }
    function GetUserInfo(param: LoginParam): void;
    class UserInfoButtonStyle {
        left: number;
        top: number;
        width: number;
        height: number;
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
        borderRadius: number;
        color: string;
        textAlign: "left" | "center" | "right";
        fontSize: number;
        lineHeight: number;
    }
    class CreateUserInfoButtonParam {
        type: "text" | "image";
        text: string;
        image: string;
        style: UserInfoButtonStyle;
        withCredentials: boolean;
        lang?: "en" | "zh_CN" | "zh_TW";
    }
    function CreateUserInfoButton(param: CreateUserInfoButtonParam): UserInfoButton;
    class UserInfoButton {
        private userInfoButton;
        constructor(obj: any);
        readonly type: string;
        readonly text: string;
        readonly image: string;
        readonly style: UserInfoButtonStyle;
        Show(): any;
        Hide(): any;
        OnTap(callback: (res: GetUserInfoSuccessResult) => void): void;
        OffTap(callback?: (res: any) => void): void;
        Destroy(): void;
    }
    class ShowShareMenuParam extends CallbackParam {
        showShareItems: ("qq" | "qzone" | "wechatFriends" | "wechatMoment")[];
        withShareTicket: boolean;
    }
    function ShowShareMenu(param: ShowShareMenuParam): void;
    class ShareAppMessageParam extends CallbackParam {
        title: string;
        imageUrl: string;
        query: string;
        entryDataHash: string;
    }
    function ShareAppMessage(param: ShareAppMessageParam): void;
    function OnShareAppMessage(callback: (res: {
        title: string;
        imageUrl: string;
        query: string;
    }) => void): void;
    function OffShareAppMessage(callback: Function): void;
    class UpdateShareMenuParam extends CallbackParam {
        withShareTicket: boolean;
    }
    function UpdateShareMenu(param: UpdateShareMenuParam): void;
    class HideShareMenuParam extends CallbackParam {
        hideShareItems: ("qq" | "qzone")[];
    }
    function HideShareMenu(param: HideShareMenuParam): void;
    class GetShareInfoResult extends CallbackResult {
        errMsg: string;
        encryptedData: string;
        iv: string;
    }
    class GetShareInfoParam extends CallbackParam {
        shareTicket: string;
        timeout: number;
        success: (res: GetShareInfoResult) => void;
    }
    function GetShareInfo(param: GetShareInfoParam): void;
    class NavigateToMiniProgramParam extends CallbackParam {
        appId: string;
        path: string;
        extraData: {};
        envVersion: "develop" | "trial" | "release";
    }
    function NavigateToMiniProgram(param: NavigateToMiniProgramParam): void;
    class ShowModalResultSuccess extends CallbackResult {
        confirm: boolean;
        cancel: boolean;
    }
    class ShowModalParam extends CallbackParam {
        title: string;
        content: string;
        showCancel: boolean;
        cancelText: string;
        cancelColor: string;
        confirmText: string;
        confirmColor: string;
        success: (res: ShowModalResultSuccess) => void;
    }
    function ShowModal(param: ShowModalParam): void;
    function AddColorSign(parm: CallbackParam): void;
    function IsColorSignExistSync(): boolean;
    function VibrateShort(parm: CallbackParam): void;
    function VibrateLong(parm: CallbackParam): void;
    class BannerAdStyle {
        left: number;
        top: number;
        width: number;
        height: number;
    }
    class BannerAd {
        private bannerAd;
        constructor(obj: any);
        readonly style: BannerAdStyle;
        Show(): Promise<any>;
        Hide(): Promise<any>;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        OffError(callback?: (res: any) => void): void;
        OnResize(callback: (res: {
            width: number;
            height: number;
        }) => void): void;
        OffResize(callback?: (res: any) => void): void;
        Destroy(): void;
    }
    function CreateBannerAd(adUnitId: string, style?: BannerAdStyle): BannerAd;
    class InterstitialAd {
        private interstitialAd;
        constructor(obj: any);
        Load(): Promise<any>;
        Show(): Promise<any>;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnClose(callback: (res: any) => void): void;
        OffClose(callback?: (res: any) => void): void;
        OnError(callback: (res: any) => void): void;
        OffError(callback?: (res: any) => void): void;
        Destroy(): void;
    }
    function CreateInterstitialAd(adUnitId: string): InterstitialAd;
    class RewardedVideoAd {
        private rewardedVideoAd;
        constructor(obj: any);
        Load(): Promise<any>;
        Show(): Promise<any>;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        OffError(callback?: (res: any) => void): void;
        OnClose(callback: (res: {
            isEnded: boolean;
        }) => void): void;
        OffClose(callback?: (res: any) => void): void;
    }
    function CreateRewardedVideoAd(adUnitId: string): RewardedVideoAd;
    class AppBox {
        private appBox;
        constructor(obj: any);
        Load(): Promise<any>;
        Show(): Promise<any>;
        Destroy(): Promise<any>;
        OnClose(callback: (res: {
            isEnded: boolean;
        }) => void): void;
        OffClose(callback?: (res: any) => void): void;
    }
    function CreateAppBox(adUnitId: string): AppBox;
}
declare namespace TJ.Platform.AppRt.Extern.QTTGame {
    function Exist(): boolean;
    function ShowBanner(): void;
    function HideBanner(): void;
    class VideoOptionsData {
        title: string;
        url: string;
    }
    class VideoOptions {
        gametype: number;
        rewardtype: number;
        data: VideoOptionsData;
        callback: (code: number) => void;
    }
    function ShowVideo(callback: (code: number) => void, options?: VideoOptions): void;
    function ShowHDAD(options?: VideoOptions): void;
    function ShowHDReward(options?: VideoOptions): void;
    class ReportDataParam {
        type: "ready" | "login" | "load" | "start" | "newRole" | "newUser" | "upgrade" | "userInfo" | "abnormal";
        app_id: string;
        open_id: string;
        game_name: string;
        extend_info: {};
    }
    function ReportData(param: ReportDataParam): void;
}
declare namespace TJ.Platform.AppRt.Extern.TT {
    function Exist(): boolean;
    class SystemInfo {
        brand: string;
        model: string;
        pixelRatio: number;
        screenWidth: number;
        screenHeight: number;
        windowWidth: number;
        windowHeight: number;
        language: string;
        version: string;
        appName: "Toutiao" | "Douyin";
        system: string;
        platform: string;
        fontSizeSetting: number;
        SDKVersion: string;
        benchmarkLevel: number;
        battery: number;
        wifiSignal: number;
    }
    function GetSystemInfoSync(): SystemInfo;
    class CallbackResult {
        errMsg: string;
    }
    class CallbackParam {
        success: (res: CallbackResult) => void;
        fail: (res: CallbackResult) => void;
        complete: (res: CallbackResult) => void;
    }
    class LoginResult extends CallbackResult {
        code: string;
        anonymousCode: string;
        isLogin: boolean;
    }
    class LoginParam extends CallbackParam {
        force: boolean;
        success: (res: LoginResult) => void;
    }
    function Login(param: LoginParam): void;
    class UserInfo {
        avatarUrl: string;
        nickName: string;
        gender: number;
        city: string;
        province: string;
        country: string;
        language: string;
    }
    class GetUserInfoResult extends CallbackResult {
        errMsg: string;
        userInfo: UserInfo;
        rawData: string;
    }
    class GetUserInfoParam extends CallbackParam {
        withCredentials: boolean;
        success: (res: GetUserInfoResult) => void;
    }
    function GetUserInfo(param: GetUserInfoParam): void;
    class NavigateToMiniProgramParam extends CallbackParam {
        appId: string;
        path: string;
        extraData: {};
        envVersion: "current" | "latest";
    }
    function NavigateToMiniProgram(param: NavigateToMiniProgramParam): void;
    class NavigateToVideoViewParam extends CallbackParam {
        videoId: string;
    }
    function NavigateToVideoView(param: NavigateToVideoViewParam): void;
    class RecordClipResult extends CallbackResult {
        index: number;
    }
    class RecordClipParam extends CallbackParam {
        timeRange: number[];
        success: (res: RecordClipResult) => void;
    }
    class ClipVideoResult extends CallbackResult {
        videoPath: string;
    }
    class ClipVideoParam extends CallbackParam {
        path: string;
        timeRange: number[];
        clipRange: number[];
        success: (res: ClipVideoResult) => void;
    }
    class GameRecorderManager {
        private gameRecorderManager;
        constructor(obj: any);
        Start(duration: number): void;
        OnStart(callback: (res: any) => void): void;
        RecordClip(param: RecordClipParam): void;
        Stop(): void;
        OnStop(callback: (res: {
            videoPath: string;
        }) => void): void;
        ClipVideo(param: ClipVideoParam): void;
    }
    function GetGameRecorderManager(): GameRecorderManager;
    class ShareAppMessageResult extends CallbackResult {
        videoId?: string;
    }
    class ShareAppMessageParamExtra {
        withVideoId: boolean;
        videoPath: string;
        videoTopics: string[];
        createChallenge: boolean;
        video_title: string;
        cutTemplateId?: string;
    }
    class ShareAppMessageParam extends CallbackParam {
        channel: "article" | "video" | "token";
        templateId: string;
        desc: string;
        title: string;
        imageUrl: string;
        query: string;
        extra: ShareAppMessageParamExtra;
        success: (res: ShareAppMessageResult) => void;
    }
    function ShareAppMessage(param: ShareAppMessageParam): void;
    function OnShareAppMessage(callback: (res: {
        channel: "article" | "video" | "token";
    }) => ShareAppMessageParam): void;
    function ReportAnalytics(eventName: string, data: {}): void;
    class ReferrerInfo {
        appId: string;
        extraData: {};
    }
    class LaunchOption {
        path: string;
        scene: string;
        query: {};
        referrerInfo: ReferrerInfo;
    }
    function GetLaunchOptionsSync(): LaunchOption;
    class OnNavigateToMiniGameResult {
        errCode: 0 | 1 | 2;
        errMsg: string;
    }
    class AppLaunchOptions {
        appId: string;
        query?: string;
        extraData?: {};
    }
    class MoreGamesButtonStyle {
        left: number;
        top: number;
        width: number;
        height: number;
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
        borderRadius: number;
        textAlign: "left" | "center" | "right";
        fontSize: number;
        lineHeight: number;
        textColor: string;
    }
    class CreateMoreGamesButtonParam {
        type: "text" | "image";
        image: string;
        text: string;
        style: MoreGamesButtonStyle;
        appLaunchOptions: AppLaunchOptions[];
        onNavigateToMiniGame: (res: OnNavigateToMiniGameResult) => void;
    }
    function CreateMoreGamesButton(param: CreateMoreGamesButtonParam): MoreGamesButton;
    class MoreGamesButton {
        private moreGamesButton;
        constructor(obj: any);
        readonly buttonId: string;
        Show(): any;
        Hide(): any;
        OnTap(callback: (res: any) => void): void;
        OffTap(callback?: (res: any) => void): void;
        Destroy(): void;
    }
    class ShowMoreGamesModalParam extends CallbackParam {
        appLaunchOptions: AppLaunchOptions[];
    }
    function ShowMoreGamesModal(param: ShowMoreGamesModalParam): void;
    function SetMoreGamesInfo(param: ShowMoreGamesModalParam): void;
    function VibrateShort(parm: CallbackParam): void;
    function VibrateLong(parm: CallbackParam): void;
    class CheckFollowAwemeStateResult extends CallbackResult {
        hasFollowed: boolean;
    }
    class CheckFollowAwemeStateParam extends CallbackParam {
        success: (res: CheckFollowAwemeStateResult) => void;
    }
    function CheckFollowAwemeState(param: CheckFollowAwemeStateParam): void;
    class OpenAwemeUserProfileResult extends CallbackResult {
        hasFollowed: boolean;
    }
    class OpenAwemeUserProfileParam extends CallbackParam {
        success: (res: OpenAwemeUserProfileResult) => void;
    }
    function OpenAwemeUserProfile(param: OpenAwemeUserProfileParam): void;
    function StartAccelerometer(param: CallbackParam): void;
    function StopAccelerometer(param: CallbackParam): void;
    class OnAccelerometerChangeResult {
        x: number;
        y: number;
        z: number;
    }
    function OnAccelerometerChange(callback: (res: OnAccelerometerChangeResult) => void): void;
    class BannerAdStyle {
        left: number;
        top: number;
        width: number;
        height: number;
    }
    class BannerAd {
        private bannerAd;
        constructor(obj: any);
        readonly style: BannerAdStyle;
        Show(): Promise<any>;
        Hide(): Promise<any>;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        OffError(callback?: (res: any) => void): void;
        OnResize(callback: (res: {
            width: number;
            height: number;
        }) => void): void;
        OffResize(callback?: (res: any) => void): void;
        Destroy(): void;
    }
    function CreateBannerAd(adUnitId: string, style?: BannerAdStyle): BannerAd;
    class InterstitialAd {
        private interstitialAd;
        constructor(obj: any);
        Show(): Promise<any>;
        Load(): Promise<any>;
        Destroy(): void;
        OnLoad(callback: Function): void;
        OffLoad(callback: Function): void;
        OnError(callback: Function): void;
        OffError(callback: Function): void;
        OnClose(callback: Function): void;
        OffClose(callback: Function): void;
    }
    function CreateInterstitialAd(adUnitId: string): InterstitialAd;
    class RewardedVideoAd {
        private rewardedVideoAd;
        constructor(obj: any);
        Load(): Promise<any>;
        Show(): Promise<any>;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        OffError(callback?: (res: any) => void): void;
        OnClose(callback: (res: {
            isEnded: boolean;
        }) => void): void;
        OffClose(callback?: (res: any) => void): void;
    }
    function CreateRewardedVideoAd(adUnitId: string): RewardedVideoAd;
    class CreatMoreGamesBannerParam {
        style: MoreGamesBannerStyle;
        appLaunchOptions: AppLaunchOptions[];
    }
    function CreatMoreGamesBanner(param: CreatMoreGamesBannerParam): MoreGameBnaner;
    class MoreGamesBannerStyle {
        left: number;
        top: number;
        width: number;
        verticalAlign: "top" | "center" | "bottom";
        horizontalAlign: "left" | "center" | "right";
    }
    class MoreGameBnaner {
        private moreGamesBnaner;
        constructor(obj: any);
        Show(): any;
        Hide(): any;
        OnResize(callback: (res: any) => void): void;
        OffResize(callback: (res: any) => void): void;
        OnTap(callback: (res: any) => void): void;
        OffTap(callback: (res: any) => void): void;
        OnError(callback: (res: any) => void): void;
        OffError(callback: (res: any) => void): void;
        Destroy(): void;
    }
}
declare namespace TJ.Platform.AppRt.Extern.UC {
    function Exist(): boolean;
    class BannerAdStyle {
        gravity: any;
        left: any;
        top: any;
        bottom: any;
        right: any;
        width: any;
        height: any;
    }
    class BannerAd {
        private bannerAd;
        constructor(obj: any);
        Show(): Promise<any>;
        Hide(): Promise<any>;
        OnLoad(callback: (res: any) => void): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        Destroy(): void;
    }
    function CreateBannerAd(style: BannerAdStyle): BannerAd;
    class RewardedVideoAd {
        private rewardedVideoAd;
        constructor(obj: any);
        Load(): Promise<any>;
        Show(): Promise<any>;
        OnShow(callback: (res: any) => void): void;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        OffError(callback?: (res: any) => void): void;
        OnClose(callback: (res: {
            isEnded: boolean;
        }) => void): void;
        OffClose(callback?: (res: any) => void): void;
    }
    function CreateRewardVideoAd(): RewardedVideoAd;
}
declare namespace TJ.Platform.AppRt.Extern.VIVO.QG {
    function Exist(): boolean;
    class AuthorizeResult {
        state: string;
        code: string;
        accessToken: string;
        tokenType: string;
        expiresIn: number;
        scope: string;
    }
    class AuthorizeParam {
        type: "token" | "code";
        redirectUri?: any;
        scope?: string;
        state?: string;
        success?: (res: AuthorizeResult) => void;
        fail?: (res: AuthorizeResult, code: string) => void;
        complete?: (res: any) => void;
    }
    function Authorize(param: AuthorizeParam): void;
    class GetProfileResult {
        openid: string;
        id: string;
        unionid: string;
        nickname: string;
        avatar: {};
    }
    class GetProfileParam {
        token: string;
        success?: (res: GetProfileResult) => void;
        fail?: (res: GetProfileResult, code: string) => void;
        complete?: (res: any) => void;
    }
    function GetProfile(param: GetProfileParam): void;
    class LoginResultData {
        token: string;
    }
    class LoginResult {
        data: LoginResultData;
    }
    class LoginParam {
        success: (res: LoginResult) => void;
        fail: (res: any) => void;
    }
    function Login(param: LoginParam): void;
    class BannerAd {
        private bannerAd;
        constructor(obj: any);
        Show(): Promise<any>;
        Hide(): Promise<any>;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        OffError(callback?: (res: any) => void): void;
        OnClose(callback: (res: any) => void): void;
        OffClose(callback?: (res: any) => void): void;
        OnSize(callback: (res: {
            width: number;
            height: number;
        }) => void): void;
        OffSize(callback?: (res: any) => void): void;
    }
    function CreateBannerAd(posId: string): BannerAd;
    class InterstitialAd {
        private interstitialAd;
        constructor(obj: any);
        Show(): Promise<any>;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        OffError(callback?: (res: any) => void): void;
        OnClose(callback: (res: any) => void): void;
        OffClose(callback?: (res: any) => void): void;
    }
    function CreateInterstitialAd(posId: string): InterstitialAd;
    class RewardedVideoAd {
        private rewardedVideoAd;
        constructor(obj: any);
        Load(): Promise<any>;
        Show(): Promise<any>;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        OffError(callback?: (res: any) => void): void;
        OnClose(callback: (res: {
            isEnded: boolean;
        }) => void): void;
        OffClose(callback?: (res: any) => void): void;
    }
    function CreateRewardedVideoAd(posId: string): RewardedVideoAd;
    class NativeAdData {
        adId: string;
        title: string;
        desc: string;
        icon: string;
        imgUrlList: string[];
        logoUrl: string;
        clickBtnTxt: string;
        creativeType: number;
        interactionType: number;
    }
    class NativeAd {
        private nativeAd;
        constructor(obj: any);
        Load(): void;
        ReportAdShow(adId: string): void;
        ReportAdClick(adId: string): void;
        OnLoad(callback: (res: {
            adList: NativeAdData[];
        }) => void): void;
        OffLoad(): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        OffError(): void;
    }
    function CreateNativeAd(posId: string): NativeAd;
    interface RequestTask {
        abort(): void;
    }
    class RequestParam {
        url: string;
        header: {};
        method: string;
        data: string;
        dataType: "json" | "arraybuffer" | "text";
        success: (res: {
            data: {};
            header: {};
            statusCode: number;
        }) => void;
        fail: (error: {}, code: number) => void;
        complete: (res: any) => void;
    }
    function Request(param: RequestParam): RequestTask;
}
declare namespace TJ.Platform.AppRt.Extern.WX {
    function Exist(): boolean;
    class CallbackResult {
        errMsg: string;
    }
    class CallbackParam {
        success: (res: CallbackResult) => void;
        fail: (res: CallbackResult) => void;
        complete: (res: CallbackResult) => void;
    }
}
declare namespace TJ.Platform.AppRt.Extern.WX {
    class NavigateToMiniProgramParam extends CallbackParam {
        appId: string;
        path: string;
        extraData: {};
        envVersion: "develop" | "trial" | "release";
    }
    function NavigateToMiniProgram(param: NavigateToMiniProgramParam): void;
}
declare namespace TJ.Platform.AppRt.Extern.WX {
    class AuthorizeParam extends CallbackParam {
        scope: "scope.userInfo" | "scope.userLocation" | "scope.werun" | "scope.writePhotosAlbum";
    }
    function Authorize(param: AuthorizeParam): void;
    class UserInfoButtonStyle {
        left: number;
        top: number;
        width: number;
        height: number;
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
        borderRadius: number;
        color: string;
        textAlign: "left" | "center" | "right";
        fontSize: number;
        lineHeight: number;
    }
    class CreateUserInfoButtonParam {
        type: "text" | "image";
        text: string;
        image: string;
        style: UserInfoButtonStyle;
        withCredentials: boolean;
        lang?: "en" | "zh_CN" | "zh_TW";
    }
    function CreateUserInfoButton(param: CreateUserInfoButtonParam): UserInfoButton;
    class UserInfoButton {
        private userInfoButton;
        constructor(obj: any);
        readonly type: string;
        readonly text: string;
        readonly image: string;
        readonly style: UserInfoButtonStyle;
        Show(): any;
        Hide(): any;
        OnTap(callback: (res: GetUserInfoSuccessResult) => void): void;
        OffTap(callback?: (res: any) => void): void;
        Destroy(): void;
    }
    class LoginSuccessResult extends CallbackResult {
        code: string;
    }
    class LoginParam extends CallbackParam {
        timeout: number;
        success: (res: LoginSuccessResult) => void;
    }
    function Login(param: LoginParam): void;
    class UserInfo {
        nickName: string;
        avatarUrl: string;
        gender: 0 | 1 | 2;
        country: string;
        province: string;
        city: string;
        language: "en" | "zh_CN" | "zh_TW";
    }
    class GetUserInfoSuccessResult extends CallbackResult {
        userInfo: UserInfo;
        rawData: string;
        signature: string;
        encryptedData: string;
        iv: string;
        cloudID: string;
    }
    class GetUserInfoParam extends CallbackParam {
        withCredentials: boolean;
        lang: "en" | "zh_CN" | "zh_TW";
        success: (res: GetUserInfoSuccessResult) => void;
    }
    function GetUserInfo(param: GetUserInfoParam): void;
    function OnShow(callback: Function): void;
    function OffShow(callback: Function): void;
    function OnHide(callback: Function): void;
    function OffHide(callback: Function): void;
    class ReferrerInfo {
        appId: string;
        extraData: {};
    }
    class LaunchOption {
        scene: number;
        query: {};
        shareTicket: string;
        referrerInfo: ReferrerInfo;
    }
    function GetLaunchOptionsSync(): LaunchOption;
    function VibrateShort(parm: CallbackParam): void;
    function VibrateLong(parm: CallbackParam): void;
    class BannerAdStyle {
        left: number;
        top: number;
        width: number;
        height: number;
    }
    class BannerAd {
        private bannerAd;
        constructor(obj: any);
        readonly style: BannerAdStyle;
        Show(): Promise<any>;
        Hide(): Promise<any>;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        OffError(callback?: (res: any) => void): void;
        OnResize(callback: (res: {
            width: number;
            height: number;
        }) => void): void;
        OffResize(callback?: (res: any) => void): void;
        Destroy(): void;
    }
    function CreateBannerAd(adUnitId: string, style: BannerAdStyle, adIntervals?: number): BannerAd;
    class InterstitialAd {
        private interstitialAd;
        constructor(obj: any);
        Load(): Promise<any>;
        Show(): Promise<any>;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnClose(callback: (res: any) => void): void;
        OffClose(callback?: (res: any) => void): void;
        OnError(callback: (res: any) => void): void;
        OffError(callback?: (res: any) => void): void;
        Destroy(): void;
    }
    function CreateInterstitialAd(adUnitId: string): InterstitialAd;
    class RewardedVideoAd {
        private rewardedVideoAd;
        constructor(obj: any);
        Load(): Promise<any>;
        Show(): Promise<any>;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        OffError(callback?: (res: any) => void): void;
        OnClose(callback: (res: {
            isEnded: boolean;
        }) => void): void;
        OffClose(callback?: (res: any) => void): void;
        Destroy(): void;
    }
    function CreateRewardedVideoAd(adUnitId: string, multiton?: boolean): RewardedVideoAd;
    class GridAdStyle {
        left: number;
        top: number;
        width: number;
        height: number;
        realWidth: number;
        realHeight: number;
    }
    class GridAd {
        private gridAd;
        constructor(obj: any);
        readonly style: BannerAdStyle;
        Show(): Promise<any>;
        Hide(): Promise<any>;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        OffError(callback?: (res: any) => void): void;
        OnResize(callback: (res: {
            width: number;
            height: number;
        }) => void): void;
        OffResize(callback?: (res: any) => void): void;
        Destroy(): void;
    }
    class CreateGridAdParam {
        adUnitId: string;
        adIntervals?: number;
        style: GridAdStyle;
        adTheme: "white" | "black";
        gridCount: 5 | 8;
    }
    function CreateGridAd(param: CreateGridAdParam): GridAd;
    class CustomAd {
        private customAd;
        constructor(obj: any);
        readonly style: BannerAdStyle;
        IsShow(): boolean;
        Show(): Promise<any>;
        Hide(): Promise<any>;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback?: (res: any) => void): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        OffError(callback?: (res: any) => void): void;
        OnClose(callback: (res: {
            isEnded: boolean;
        }) => void): void;
        OffClose(callback?: (res: any) => void): void;
        Destroy(): void;
    }
    class CreateCustomAdParam {
        adUnitId: string;
        top: number;
        left: number;
        fixed: boolean;
    }
    function CreateCustomAd(param: CreateCustomAdParam): CustomAd;
    class ShareAppMessageParam {
        title: string;
        imageUrl: string;
        query: string;
        imageUrlId: string;
    }
    function ShareAppMessage(param: ShareAppMessageParam): void;
    class OnShareAppMessageParam {
        title: string;
        imageUrl: string;
        query: string;
        imageUrlId: string;
    }
    function OnShareAppMessage(param: OnShareAppMessageParam): void;
    function ShowShareMenu(param: ShowShareMenusParam): void;
    class ShowShareMenusParam extends CallbackParam {
        withShareTicket: boolean;
        menus: string[];
    }
}
declare namespace TJ.Platform.AppRt.Extern.XIAOMI.QG {
    function Exist(): boolean;
    class InsertAd {
        private insertAd;
        constructor(obj: any);
        Show(): Promise<{}>;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback: (res: any) => void): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        OffError(callback: (res: any) => void): void;
        OnClose(callback: (res: any) => void): void;
        OffClose(callback: (res: any) => void): void;
    }
    function CreateInsertAd(posId: string): InsertAd;
    class RewardedVideoAd {
        private videoAd;
        constructor(obj: any);
        Show(): Promise<{}>;
        Load(): Promise<{}>;
        OnLoad(callback: (res: any) => void): void;
        OffLoad(callback: (res: any) => void): void;
        OnClose(callback: (res: {
            isEnded: boolean;
        }) => void): void;
        OffClose(callback: (res: any) => void): void;
        OnError(callback: (res: {
            errMsg: string;
            errCode: number;
        }) => void): void;
        OffError(callback: (res: any) => void): void;
    }
    function CreateRewardedVideoAd(posId: string): RewardedVideoAd;
}
declare namespace TJ.Platform.AppRt.Develop.HBS.Account {
    function Login(): Promise<Extern.HBS.GameLoginResult>;
    function GetUserInfo(): Promise<Extern.HBS.GameLoginResult>;
}
declare namespace TJ.Platform.AppRt.Develop.Kwai {
    class MediaRecoder {
        private _obj;
        private readonly obj;
        private recording;
        readonly hasVideo: boolean;
        constructor();
        Start(): void;
        Stop(share?: boolean): void;
        Share(): void;
    }
}
declare namespace TJ.Platform.AppRt.Develop.OPPO.Account {
    function Login(): Promise<Extern.OPPO.QG.LoginResult>;
    function GetUserInfo(): Promise<Extern.OPPO.QG.LoginResultData>;
}
declare namespace TJ.Platform.AppRt.Develop.OPPO.GameAd {
    function ShowBanner(): void;
    function RemoveBanner(): void;
    function ShowPortal(): void;
}
declare namespace TJ.Platform.AppRt.Develop.QQ.Account {
    function Login(): Promise<{
        code: string;
    }>;
    function YLogin(): Promise<{
        openid: string;
        session_key: string;
        unionid: string;
        errcode: number;
        errmsg: string;
    }>;
    function GetUserInfo(): Promise<Extern.QQ.UserInfo>;
}
declare namespace TJ.Platform.AppRt.Develop.QTT.Account {
    function Login(): Promise<{
        ticket: any;
        platform: any;
    }>;
    function YLogin(): Promise<{
        code: number;
        message: string;
        showErr: number;
        currentTime: number;
        data: {
            open_id: string;
            union_id: string;
            nickname: string;
            avatar: string;
            wlx_platform: string;
        };
    }>;
    function GetUserInfo(): Promise<{
        open_id: string;
        union_id: string;
        nickname: string;
        avatar: string;
        wlx_platform: string;
    }>;
}
declare namespace TJ.Platform.AppRt.Develop.TA {
    namespace Raw {
        let log: boolean;
        let tryCount: number;
        function sync_data(param: {}): void;
        function track(event_name: string, properties: {}): void;
        function user_set(properties: {}): void;
        function user_setOnce(properties: {}): void;
    }
    function Startup(): void;
    function FirstStartup(): void;
    function Event(id: string): void;
    function LaunchOptions(ops: {}): void;
    function PromoEvent(promoGuid: string, type: "Awake" | "Start" | "Load" | "Show" | "Hide" | "Click" | "Open", style: string, icon: string): void;
    function PromoEvents(list: {
        promo: string;
        type: "Awake" | "Start" | "Load" | "Show" | "Click" | "Open";
        style: string;
        icon: string;
    }[]): void;
    function Event_LifeCycle_Load(id: string): void;
    function Event_LifeCycle_Start(id: string): void;
    function Event_LifeCycle_Destroy(id: string): void;
    function Event_LifeCycle_Enable(id: string): void;
    function Event_LifeCycle_Disable(id: string): void;
    function Event_Page_Enter(id: string, id_source?: string): void;
    function Event_Page_Show(id: string, id_source?: string): void;
    function Event_Page_Leave(id: string, id_source?: string): void;
    function Event_Button_Show(id: string, id_source?: string): void;
    function Event_Button_Click(id: string, id_source?: string): void;
    function Event_Level_Start(id: string): void;
    function Event_Level_Finish(id: string): void;
    function Event_Level_Fail(id: string): void;
}
declare namespace TJ.Platform.AppRt.Develop.TT.Account {
    function Login(force?: boolean): Promise<{
        code: string;
        anonymousCode: string;
    }>;
    function YLogin(force?: boolean): Promise<{
        session_key: string;
        openid: string;
        anonymous_openid: string;
        errcode: number;
        errmsg: string;
    }>;
    function GetUserInfo(): Promise<Extern.TT.UserInfo>;
}
declare namespace TJ.Platform.AppRt.Develop.TT.VideoRank {
    class VideoInfo {
        videoID: string;
        rank: number;
        digg_count: number;
        cover_url: string;
    }
    function GetByLike(number_of_top: number): Promise<VideoInfo[]>;
    function GetByTime(number_of_top: number): Promise<VideoInfo[]>;
}
declare namespace TJ.Platform.AppRt.Develop.VIVO.Account {
    function Login(): Promise<{
        token: string;
    }>;
    function YLogin(): Promise<{
        code: number;
        msg: string;
        data: {
            openId: string;
            nickName: string;
            smallAvatar: string;
            biggerAvatar: string;
            gender: number;
        };
    }>;
    function GetUserInfo(): Promise<{
        openId: string;
        nickName: string;
        smallAvatar: string;
        biggerAvatar: string;
        gender: number;
    }>;
}
declare namespace TJ.Platform.AppRt.Develop.WX.Account {
    function Login(): Promise<{
        code: string;
    }>;
    function YLogin(): Promise<{
        openid: string;
        session_key: string;
        unionid: string;
        errcode: number;
        errmsg: string;
    }>;
    function GetUserInfo(): Promise<Extern.WX.UserInfo>;
}
declare namespace TJ.Platform.AppRt.Develop.Yun.Login {
    function OPPOLogin(param: {
        userInfo: {};
    }): Promise<void>;
    function VIVOLogin(param: {
        userInfo: {};
    }): Promise<void>;
    function VIVOLogin2(param: {
        token: string;
    }): Promise<void>;
    function TTLogin(param: {
        userInfo: {};
        code: string;
    }): Promise<void>;
    function WXLogin(param: {
        userInfo: {};
        code: string;
    }): Promise<void>;
    function QTTLogin(param: {
        platform: any;
        ticket: any;
    }): Promise<void>;
    function HWLogin(param: {
        userInfo: {};
    }): Promise<void>;
    function GetAccessToken(): Promise<string>;
}
declare namespace TJ.Platform.AppRt.Develop.Yun.Player {
    function GetUserInfo(): Promise<{}>;
    class ResultParam_GetFriendAssist {
        code: number;
        count: number;
        list: any[];
    }
    function GetFriendAssist(): Promise<ResultParam_GetFriendAssist>;
    function ReportFriendAssist(originguid: string): Promise<ResultParam_GetFriendAssist>;
}
declare namespace TJ.Platform.AppRt.API.AdPoly {
    class IAdPoly extends Common.Component.Interface {
        ADReady(param: TJ.API.AdService.Param, grade: Grade): boolean;
        ShowAD(param: TJ.API.AdService.Param, grade: Grade): void;
        RemoveAD(param: TJ.API.AdService.Param, grade: Grade): void;
    }
    enum Grade {
        banner = 0,
        normal = 1,
        reward = 2
    }
}
declare namespace TJ.Platform.AppRt.DevKit._4399 {
}
declare namespace TJ.Platform.AppRt.DevKit.HBS {
    function GameLogin(): Promise<{
        userInfo: any;
    }>;
}
declare namespace TJ.Platform.AppRt.DevKit.OPPO {
    namespace QG {
        function Login(): Promise<{
            token: string;
            userInfo: Extern.OPPO.QG.LoginResultData;
        }>;
    }
}
declare namespace TJ.Platform.AppRt.DevKit.OPPO.QG {
    function InstallShortcut(callback: (has: boolean) => void, source: string): void;
    function HasShortcutInstalled(callback: (has: boolean) => void): void;
}
declare namespace TJ.Platform.AppRt.DevKit.QQ {
    class AppBox {
        constructor(posId: string);
        appBox: Extern.QQ.AppBox;
        Show(): void;
    }
}
declare namespace TJ.Platform.AppRt.DevKit.QTTGame {
    function ReportData_load(): void;
    function ReportData_start(): void;
}
declare namespace TJ.Platform.AppRt.DevKit.TT {
    class GameRecorderClip {
        index: number;
        time: number;
    }
    class GameRecorderVideo {
        private readonly grm;
        videoPath: string;
        private share;
        constructor();
        Start(duration: number): void;
        Stop(share?: boolean): void;
        clips: GameRecorderClip[];
        RecordClip(beforeTime: number, afterTime: number): GameRecorderClip;
        Share(param?: Extern.TT.ShareAppMessageParam): void;
    }
    class MoreGamesButton {
        btn: Extern.TT.MoreGamesButton;
        private CreateBtn;
        onTap: (res: any) => void;
        private static OnTap;
        private static buttons;
        constructor(apps: Extern.TT.AppLaunchOptions[], x: number, y: number, w: number, h: number, image?: string);
        Show(): void;
        Hide(): void;
        Destroy(): void;
    }
    function Login(): Promise<{
        code: string;
        userInfo: Extern.TT.UserInfo;
    }>;
}
declare namespace TJ.Platform.AppRt.DevKit.VIVO {
    namespace QG {
        function Login(): Promise<{
            token: string;
        }>;
    }
}
declare namespace TJ.Platform.AppRt.DevKit.VIVO {
}
declare namespace TJ.Platform.AppRt.DevKit.WX {
    function Login(): Promise<{
        code: string;
        userInfo: Extern.WX.UserInfo;
    }>;
}
declare namespace TJ.Platform.AppRt.SDK._4399 {
    class Manager extends Common.Component.Interface {
        OnInit(): void;
    }
}
declare namespace TJ.Platform.AppRt.SDK.ABTest {
}
declare namespace TJ.Platform.AppRt.SDK.AdService {
}
declare namespace TJ.Platform.AppRt.SDK.Adwending {
    class Manager extends Common.Component.Interface {
        OnInit(): void;
    }
}
declare namespace TJ.Platform.AppRt.SDK.AppInfo {
}
declare namespace TJ.Platform.AppRt.SDK.HBS {
    class Manager extends Common.Component.Interface {
        OnInit(): void;
    }
}
declare namespace TJ.Platform.AppRt.SDK.HG {
    class Manager extends Common.Component.Interface {
        OnInit(): void;
    }
}
declare namespace TJ.Platform.AppRt.SDK.Kwai {
    class Manager extends Common.Component.Interface {
        OnInit(): void;
    }
}
declare namespace TJ.Platform.AppRt.SDK.MZ {
    class Manager extends Common.Component.Interface {
        OnInit(): void;
    }
}
declare namespace TJ.Platform.AppRt.SDK.OPPO.QG {
    class Manager extends Common.Component.Interface {
        OnInit(): void;
    }
}
declare namespace TJ.Platform.AppRt.SDK.QQ {
    class Manager extends Common.Component.Interface {
        OnInit(): void;
    }
}
declare namespace TJ.Platform.AppRt.SDK.QTTGame {
    class Manager extends Common.Component.Interface {
        OnInit(): void;
    }
}
declare namespace TJ.Platform.AppRt.SDK.ReYun {
    class Manager extends Common.Component.Interface {
        static readonly reyunData: TJ.Develop.ReYun.Data;
        OnInit(): void;
    }
}
declare namespace TJ.Platform.AppRt.SDK.TA {
    class OTA extends TJ.API.TA.ITA {
        OnInit(): void;
        Event(param: TJ.API.TA.Param): void;
        PromoEvent(param: TJ.API.TA.Param): void;
        PromoEvents(params: TJ.API.TA.Param[]): void;
        Event_LifeCycle_Load(param: TJ.API.TA.Param): void;
        Event_LifeCycle_Start(param: TJ.API.TA.Param): void;
        Event_LifeCycle_Destroy(param: TJ.API.TA.Param): void;
        Event_LifeCycle_Enable(param: TJ.API.TA.Param): void;
        Event_LifeCycle_Disable(param: TJ.API.TA.Param): void;
        Event_Page_Enter(param: TJ.API.TA.Param): void;
        Event_Page_Show(param: TJ.API.TA.Param): void;
        Event_Page_Leave(param: TJ.API.TA.Param): void;
        Event_Button_Show(param: TJ.API.TA.Param): void;
        Event_Button_Click(param: TJ.API.TA.Param): void;
        Event_Level_Start(param: TJ.API.TA.Param): void;
        Event_Level_Finish(param: TJ.API.TA.Param): void;
        Event_Level_Fail(param: TJ.API.TA.Param): void;
    }
}
declare namespace TJ.Platform.AppRt.SDK.TT {
    class Manager extends Common.Component.Interface {
        OnInit(): void;
    }
}
declare namespace TJ.Platform.AppRt.SDK.UC {
    class Manager extends Common.Component.Interface {
        OnInit(): void;
    }
}
declare namespace TJ.Platform.AppRt.SDK.VIVO.QG {
    class Manager extends Common.Component.Interface {
        OnInit(): void;
    }
}
declare namespace TJ.Platform.AppRt.SDK.WX {
    class Manager extends Common.Component.Interface {
        OnInit(): void;
    }
}
declare namespace TJ.Platform.AppRt.SDK.XIAOMI {
    namespace QG {
        class Manager extends Common.Component.Interface {
            OnInit(): void;
        }
    }
}
declare namespace TJ.Platform.iOS.Extern.ADS {
    class ExApi {
        static sc: Common.iOS.SwiftClass;
        static Debug(fn: any, ...ps: any[]): void;
        static ShowBanner(json: string): void;
        static RemoveBanner(json: string): void;
        static NormalReady(json: string): boolean;
        static ShowNormal(json: string): void;
        static RewardReady(json: string): boolean;
        static ShowReward(json: string): void;
    }
}
declare namespace TJ.Platform.iOS.Extern.APP {
    class Api {
        static sc: Common.iOS.SwiftClass;
        static Debug(fn: any, ...ps: any[]): void;
        static AppGuid(): string;
        static UserAgreement(): void;
        static PrivacyPolicy(): void;
    }
}
declare namespace TJ.Platform.iOS.Extern.GSA {
    class ExApi {
        static sc: Common.iOS.SwiftClass;
        static Debug(fn: any, ...ps: any[]): void;
        static Event(json: string): void;
    }
}
declare namespace TJ.Platform.iOS.Extern.IAP {
    class ExApi {
        static Debug(fn: any, ...ps: any[]): void;
    }
}
declare namespace TJ.Platform.iOS.Extern.Tools {
    class StoreKitHelper {
        static sc: Common.iOS.SwiftClass;
        static Debug(fn: any, ...ps: any[]): void;
        static ReviewApp(): void;
        static PopApp(appId: string): void;
    }
    class VibrateHelper {
        static sc: Common.iOS.SwiftClass;
        static Debug(fn: any, ...ps: any[]): void;
        static Short(): void;
        static Long(): void;
    }
}
declare namespace TJ.Platform.iOS.SDK.AdService {
}
declare namespace TJ.Platform.iOS.SDK.Analytics {
}
declare namespace TJ.Platform.iOS.SDK.AppCtl {
}
declare namespace TJ.Platform.iOS.SDK.AppInfo {
}
declare namespace TJ.Platform.iOS.SDK.Promo {
}
declare namespace TJ.Platform.iOS.SDK.Vibrate {
}
declare namespace TJ.ADS {
    class Param extends API.AdService.Param {
    }
    enum Place {
        LEFT = 3,
        RIGHT = 5,
        CENTER = 17,
        TOP = 48,
        BOTTOM = 80
    }
    class Api {
        static ShowBanner(param: Param): void;
        static RemoveBanner(param: Param): void;
        static NormalReady(param: Param): boolean;
        static ShowNormal(param: Param): void;
        static RewardReady(param: Param): boolean;
        static ShowReward(param: Param): void;
        static readonly exist: boolean;
    }
}
declare namespace TJ.APP {
    class Api {
        static Quit(): void;
        static readonly appGuid: string;
        static readonly productName: string;
        static readonly packageName: string;
        static readonly versionName: string;
        static readonly versionCode: number;
        static readonly channel: string;
        static UserAgreement(): void;
        static PrivacyPolicy(): void;
    }
}
declare namespace TJ.GSA {
    class Param extends API.Analytics.Param {
    }
    class Api {
        static Event(param: Param): void;
        static EventBegin(param: Param): void;
        static EventEnd(param: Param): void;
        static PageBegin(param: Param): void;
        static PageEnd(param: Param): void;
        static LevelStart(param: Param): void;
        static LevelFinish(param: Param): void;
        static LevelFail(param: Param): void;
        static Pay(param: Param): void;
        static Buy(param: Param): void;
        static Use(param: Param): void;
        static Bonus(param: Param): void;
    }
}
declare namespace TJ.IAP {
    class Param extends API.Billing.Param {
    }
    class Api {
        static Purchase(param: Param): void;
        static QueryAll(param: Param): void;
        static Consume(param: Param): void;
        static readonly exist: boolean;
    }
}
