export class SubpackController {
    pkgFlag: number;
    onCpl: Function;

    subPkgInfo = [
        { name: "sp1", root: "res" },
        { name: "sp2", root: "3DScene" },
        { name: "sp3", root: "3DPrefab" },
    ];

    init(cb) {
        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt) {
            this.onCpl = cb;
            this.pkgFlag = 0;
            this.loadPkg_wx();
        }
        // else{
        //     this.onCpl();
        // }
    }

    loadPkg_wx() {
        if (this.pkgFlag == this.subPkgInfo.length) {

            this.onCpl();

        } else {
            let info = this.subPkgInfo[this.pkgFlag];
            let name = info.name;
            let root = info.root;

            Laya.Browser.window.wx.loadSubpackage({
                name: name,
                success: (res) => {
                    console.log(`load ${name} suc`);
                    Laya.MiniAdpter.subNativeFiles[name] = root;
                    Laya.MiniAdpter.nativefiles.push(root);
                    this.pkgFlag++;
                    console.log("加载次数", this.pkgFlag);
                    this.loadPkg_wx();
                },
                fail: (res) => {
                    console.error(`load ${name} err: `, res);
                },
            });
        }
    }
}