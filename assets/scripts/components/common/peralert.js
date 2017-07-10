cc.Class({
    extends: cc.Component,

    properties: {
        _alert:null,
        _btnOK:null,
        _btnCancel:null,
        _title:null,
        _content:null,
        _onok:null,
        _cancel:null,
        _richtext:null,
    },

    // use this for initialization
    onLoad: function () {
        cc.vv.peralert = this;
        console.log("PreRootNode peralert onLoad !:"+cc.vv.peralert);
        this._alert = this.node;
        this._title = this._alert.getChildByName("title").getComponent(cc.Label);
        this._content = this._alert.getChildByName("content");
        this._richtext = this._alert.getChildByName("richtext");

        this._btnOK = this._alert.getChildByName("btn_ok");
        this._btnCancel = this._alert.getChildByName("btn_cancel");

        this.node.active = false;
        //cc.vv.peralert = this;
        var self = this;
        setTimeout(function() {
            cc.vv.peralert = self;
        }, 100);
    },
    start:function(){        
        cc.vv.peralert = this;
        console.log("PreRootNode peralert start !:"+cc.vv.peralert);
    },
    hide:function(){
        try {
            this._alert.active = false;
            this._onok = null;
            this._cancel = null;
        } catch (error) {
            
        }
        
    },
    onBtnClicked:function(event){
        if(event.target.name == "btn_ok"){
            if(this._onok){
                this._onok();
            }
        }else if(event.target.name == "btn_cancel"){
            if(this._cancel){
                this._cancel();
            }
        }
        this._alert.active = false;
        this._onok = null;
        this._cancel = null;
    },

    //确定键有事件，取消键没事件
    show:function(title,content,onok,needcancel,isRichText){
        this._alert.active = true;
        this._onok = onok;
        this._title.string = title;
        console.log("show  title:"+JSON.stringify(title));
        //添加了富文本显示
        if(isRichText != null){
            console.log("richtext  alert");
            this._content.active = false;
            this._richtext.active = true;
            this._richtext.getComponent(cc.richtext).string = content;
        }else{
            console.log("not richtext  alert");
            this._content.active = true;
            this._richtext.active = false;
            this._content.getComponent(cc.Label).string = content;
        }
        //this._content.string = content;

        if(needcancel){
            this._btnCancel.active = true;
            this._btnOK.x = -150;
            this._btnCancel.x = 150;
        }
        else{
            this._btnCancel.active = false;
            this._btnOK.x = 0;
        }
    },

    //取消键有事件，确定键没事件
    showCancel: function (title, content, cancel,isRichText) {
        this._alert.active = true;
        this._cancel = cancel;
        this._title.string = title;

        //添加了富文本显示
        if(isRichText != null){
            this._content.active = false;
            this._richtext.active = true;
            this._richtext.getComponent(cc.richtext).string = content;
        }else{
            this._content.active = true;
            this._richtext.active = false;
            this._content.getComponent(cc.Label).string = content;
        }
        //this._content.string = content;

        //有取消键的位置
        this._btnCancel.active = true;
        this._btnOK.x = -150;
        this._btnCancel.x = 150;

    },
    
    onDestory:function(){
        if(cc.vv){
            cc.vv.peralert = null;    
        }
    }
});
