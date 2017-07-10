cc.Class({
    extends: cc.Component,

    properties: {
        updatePanel: {
            default: null,
            type: cc.Node
        },
        manifestUrl: {
            default: null,
            url: cc.RawAsset
        },
        percent: {
            default: null,
            type: cc.Label
        },
        percentprogress: {
            default: null,
            type: cc.ProgressBar
        },
        lblErr: {
            default: null,
            type: cc.Label
        },
        loadprogress:0,
        IsLoadFile:false,
    },

    checkCb: function (event) {
        cc.vv.global.Debuglog('Code: ' + event.getEventCode());
        this.loadprogres = 0;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.vv.global.Debuglog("No local manifest file found, hot update skipped.");
                cc.eventManager.removeListener(this._checkListener);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.vv.global.Debuglog("Fail to download manifest file, hot update skipped.");
                cc.eventManager.removeListener(this._checkListener);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.vv.global.Debuglog("Already up to date with the latest remote version.");
                cc.eventManager.removeListener(this._checkListener);
                this.lblErr.string += "游戏不需要更新\n";
                cc.vv.global.UpdateSucess();
                //预加载场景，然后进入
                cc.vv.wc.show("");
                cc.vv.global.loadScene("loading");
                //cc.game.restart();
                //cc.director.loadScene("loading");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this._needUpdate = true;
                this.updatePanel.active = true;
                this.percent.string = '00.00%';
                this.percentprogress.progress = 0.0;
                cc.eventManager.removeListener(this._checkListener);
                break;
            default:
                break;
        }
        this.hotUpdate();
    },
    
    hotUpdate: function () {
        if (this._am && this._needUpdate) {
            this.lblErr.string += "开始更新游戏资源...\n";
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            this._failCount = 0;
            this._am.update();
        }
    },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.vv.global.Debuglog('No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                cc.vv.global.Debuglog('jsb.EventAssetsManager.UPDATE_PROGRESSION'+event.getPercent());
                cc.vv.global.Debuglog("File progression : " + event.getPercentByFile());
                cc.vv.global.Debuglog('jsb.EventAssetsManager.UPDATE_PROGRESSION'+JSON.stringify(event));



                var percent = event.getPercent();
                if(percent == 0)
                {
                    this.loadprogres++;
                }
                else
                {
                    this.loadprogres = this.loadprogres > percent?this.loadprogres:percent;
                }
                //this.loadprogress;
                var percentByFile = event.getPercentByFile();

                var msg = event.getMessage();
                if (msg) {
                    this.loadprogres = 0;
                    this.IsLoadFile = true;
                    cc.vv.global.Debuglog("eventmsg:"+msg);
                }
                
                if(this.IsLoadFile == true)
                {
                    percentByFile = percentByFile > percent?percentByFile:percent;
                    cc.vv.global.Debuglog(percentByFile.toFixed(2) + '%');
                    this.percentprogress.progress = percentByFile/100;
                    this.percent.string = percentByFile.toFixed(2) + '%';
                }
                else
                {
                    cc.vv.global.Debuglog(this.loadprogres.toFixed(2) + '%');
                    this.percentprogress.progress = this.loadprogres/100;
                    this.percent.string = this.loadprogres.toFixed(2) + '%';
                }
                
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.vv.global.Debuglog('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.vv.global.Debuglog('Already up to date with the latest remote version.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.vv.global.Debuglog('Update finished. ' + event.getMessage());

                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                cc.vv.global.Debuglog('Update failed. ' + event.getMessage());

                this._failCount ++;
                if (this._failCount < 5)
                {
                    this._am.downloadFailedAssets();
                }
                else
                {
                    cc.vv.global.Debuglog('Reach maximum fail count, exit update process');
                    this._failCount = 0;
                    failed = true;
                }
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                cc.vv.global.Debuglog('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                cc.vv.global.Debuglog("ERROR_DECOMPRESS"+event.getMessage());
                break;
            default:
                cc.vv.global.Debuglog('default Code: ' + event.getEventCode());
                break;
        }

        if (failed) {
            cc.vv.global.Debuglog("failed failed");
            cc.eventManager.removeListener(this._updateListener);
            this.updatePanel.active = false;
        }

        if (needRestart) {
            cc.vv.global.Debuglog("needRestart needRestart");
            cc.eventManager.removeListener(this._updateListener);
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            Array.prototype.unshift(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));

            if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) 
            {
                cc.sys.localStorage.setItem("localVersion",cc.vv.global.version);
            }
            jsb.fileUtils.setSearchPaths(searchPaths);
            this.lblErr.string += "游戏资源更新完毕\n";
            cc.vv.global.UpdateSucess();

            var fn = function()
            {
                cc.sys.garbageCollect();
                // cc.game.restart();
                cc.vv.global.restart();
            }
            setTimeout(fn, 100);
        }
    },

    

    // use this for initialization
    onLoad: function () {
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            return;
        }
        this.loadprogres = 0;
        this.IsLoadFile = false;
        this.lblErr.string += "检查游戏资源...\n";
        var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'asset');
        cc.vv.global.Debuglog('Storage path for remote asset : ' + storagePath);
        //this.lblErr.string += storagePath + "\n";
        cc.vv.global.Debuglog('Local manifest URL : ' + this.manifestUrl);
        this._am = new jsb.AssetsManager(this.manifestUrl, storagePath);
        
        if (cc.sys.os == cc.sys.OS_ANDROID) 
        {
            //this._am.setMaxConcurrentTask(3);
        }
        else if(cc.sys.os == cc.sys.OS_IOS)
        {
            this._am.setMaxConcurrentTask(10);
        }
            
        //this._am.setMaxConcurrentTask(10);

        
        
        console.log('this._am:'+this._am)
        this._am.retain();

        this._needUpdate = false;
        if (this._am.getLocalManifest().isLoaded())
        {
            cc.vv.global.Debuglog("this._am.getLocalManifest().isLoaded()");
            this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
            cc.eventManager.addListener(this._checkListener, 1);

            this._am.checkUpdate();
        }

        //确保 alert 和 wc 一定是显示的
        //cc.find("alertAndWc").active = true;
        cc.find("Canvas/alertAndWc").setPosition(0, 0);
        cc.find("Canvas/alertAndWc").setLocalZOrder(100);
        // //加载预制 alert wc
        // cc.vv.ourLoadPreRes.loadAlertAndWc();
    },

    onDestroy: function () {
        this._am && this._am.release();
    }
});
