var AudioMgr = cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        bgmVolume:1.0,
        sfxVolume:1.0,
        
        bgmAudioID:-1,
    },

    // use this for initialization
    init: function () {
        var t = cc.sys.localStorage.getItem("bgmVolume");
        if(t != null){
            this.bgmVolume = parseFloat(t);    
        }
        
        var t = cc.sys.localStorage.getItem("sfxVolume");
        if(t != null){
            this.sfxVolume = parseFloat(t);    
        }
        
        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    getUrl:function(url){
        return cc.url.raw("resources/sounds/" + url);
    },
    
    playBGM(url){
        var audioUrl = this.getUrl(url);
        console.log(audioUrl);
        if(this.bgmAudioID >= 0){
            cc.audioEngine.stop(this.bgmAudioID);
        }
        this.bgmAudioID = cc.audioEngine.playMusic(audioUrl,true);
        cc.audioEngine.setMusicVolume(this.bgmVolume);
    },
    
    playSFX(url){
        if (cc.vv.voiceMgr._isRecording)
            return;
        console.log("playSFX url:" + url);
        var audioUrl = this.getUrl(url);
        if(this.sfxVolume > 0){
            var audioId = cc.audioEngine.play(audioUrl,false,this.sfxVolume);    
            return audioId;
        }
    },

    playSFX_NM(sex,url){
        if (cc.vv.voiceMgr._isRecording)
            return;
        console.log("playSFX_NM sex:" + sex);
        var audioUrl = this.getUrl(sex+"_nm/"+url);
        if(this.sfxVolume > 0){
            var audioId = cc.audioEngine.play(audioUrl,false,this.sfxVolume);    
            return audioId;
        }
    },

    playNM_shortmsg(sex,url){
        if (cc.vv.voiceMgr._isRecording)
            return;
        console.log("playSFX_NM sex:" + sex);
        var audioUrl = this.getUrl("nm_" + sex+"_shortmsg/"+url);
        if(this.sfxVolume > 0){
            var audioId = cc.audioEngine.play(audioUrl,false,this.sfxVolume);  
            return audioId;  
        }
    },
    stopSFX(audioID){
        console.log("localMessage HandleMessage stopSFX");
        if(audioID != null && audioID != undefined)
        {
            try {
                cc.audioEngine.stop(audioID);
            } catch (e) {
                return false;
            }
        }
    },
    //setting每次关闭存储音量
    keepAllVolume:function(){
        cc.sys.localStorage.setItem("sfxVolume",this.sfxVolume);
        cc.sys.localStorage.setItem("bgmVolume",this.bgmVolume);
    },

    //fm屏蔽每次都本地存储音量
    setSFXVolume:function(v){
        if(this.sfxVolume != v){
            //cc.sys.localStorage.setItem("sfxVolume",v);
            this.sfxVolume = v;
        }
    },

    //fm屏蔽每次都本地存储音量
    setBGMVolume:function(v,force){
        if(this.bgmAudioID >= 0){
            if(v > 0){
                cc.audioEngine.resume(this.bgmAudioID);
            }
            else{
                cc.audioEngine.pause(this.bgmAudioID);
            }
            //cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
        }
        if(this.bgmVolume != v || force){
            //cc.sys.localStorage.setItem("bgmVolume",v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID,v);
        }
    },
    
    pauseAll:function(){
        cc.audioEngine.pauseAll();
    },
    
    resumeAll:function(){
        cc.audioEngine.resumeAll();
    }
});
module.exports = new AudioMgr();