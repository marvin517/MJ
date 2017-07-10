
const dd = cc.dd;
var NodePoolMgr = cc.Class({
    // statics: {
    //     getInstance() {
    //         if (!this.nodePoolMgr) {
    //             this.nodePoolMgr = new NodePoolMgr();
    //         }
    //         return this.nodePoolMgr;
    //     },


    // },

    init() {
        this._nodePoolArr = {};
        // 加载配置里所有的缓冲池
        // dd._.forIn(dd.nodePoolCfg.CFG, (value) => {
        //     this.addNodePool(value);
        // });
        cc.log("NodePoolMgr init:"+Object.keys(dd.nodePoolCfg.CFG).length);
        // for(var i in dd.nodePoolCfg.CFG)
        // {
        //     this.addNodePool(i);
        // }
    },

    /**
     *  创建对象缓冲池（用对象存取缓冲池）
     *  @param index 生成多个物体时的标识符
     * @param cfgObj   配置的对象
     * @param callback  回调函数
     */
    addNodePool(cfgObj, callback, index) {
        const self = this;
        cc.log("NodePoolMgr addNodePool:cfgObj.url:"+cfgObj.url);
        cc.vv.LoadLocResHandle.LoadByKey(cfgObj.url,cfgObj.url,function(err, prefab, Key){
             if (cfgObj.url === Key) {
                 if (err) {
                     cc.log(err);
                 } else {
                     let num = cfgObj.increaseNum;  //  默认给缓冲池添加配置里递增的数量（已存在对应缓冲池）
                     if (!self._nodePoolArr[cfgObj.url]) {  //  判断是否存在当前缓冲池
                         const newNodePool = new cc.NodePool(cfgObj.url);
                         self._nodePoolArr[cfgObj.url] = ({preName: newNodePool});
                         num = cfgObj.count;  //  新生成缓冲池时(对应缓冲池不存在)，缓冲池里资源数量为配置里的数量
                     }
                     if (self._nodePoolArr[cfgObj.url].preName.size() > 0) {
                         cc.log("对象缓冲池存在资源，不需要重新添加");
                     } else {
                         for (let i = 0; i < num; i++) {  //  将指定数量资源放入缓冲池
                             const newObject = cc.instantiate(prefab);
                             self._nodePoolArr[cfgObj.url].preName.put(newObject);
                         }
                     }
                     if (callback && callback instanceof Function) {  //  执行回调
                         //todo  调用基类的init方法进行初始化
                         const nodeObj = self._nodePoolArr[cfgObj.url].preName.get();
                         nodeObj.preurl = cfgObj.url;
                         const comp = nodeObj.getComponent("BaseNode");
                         if (comp) {
                             comp.init();
                         }
                         callback(nodeObj, index);
                     }
                 }
             }
        });
    },

    /**
     *  从对象缓冲池中获取资源（如果没有，则重新给缓冲池添加资源）
     *  @param index 当生成多个物体时，用于标识对应的物体
     * @param url  配置的对象
     * @param callback  回调
     * @returns {*}  返回资源
     */
    getNode(url,index,callback) {
        const func = () => {  //  处理在缓冲池里未找到资源的情况
            const cfgObj = dd.nodePoolCfg.getObjByUrl(url, index);
            if (cfgObj) {
                cc.log("pool add :"+url);
                this.addNodePool(cfgObj, callback, index);
            }
        };
        if (!this._nodePoolArr[url]) {  //  当不存在缓冲池
            func();
            return null;
        }
        const presNodePool = this._nodePoolArr[url].preName;
        if (presNodePool.size() > 0) {  //  当所需资源缓冲池中size大于0时，则可直接取
            const newPre = presNodePool.get();
            newPre.preurl = url;  //  节点添加一个属性，为后面将此节点放回原来缓冲池

            //todo 对基类进行初始换
            // const comp = newPre.getComponent("BaseNode");
            // if (comp) {
            //     comp.init();
            // }
            callback(newPre, index);
            return newPre;
        } else {  //  当对象缓冲池未存在资源时，则重新生成
            func();
            return null;
        }
    },
    GetNodeSucess:function(url,index,succallback)
    {
        this.getNode(url,index,callback);
    },
    /**
     *  将资源重新放回缓冲池
     * @param delNodes  需要放回缓冲池的资源
     */
    delNode(delNodes) {
        if (delNodes.preurl && this._nodePoolArr[delNodes.preurl]) {
            const nodePool = this._nodePoolArr[delNodes.preurl].preName;
            nodePool.put(delNodes);
        } else {
            cc.log("delNode.preurl[%s] is null or this._nodePoolArr[delNodes.preurl] is null", delNodes.preurl);
        }
    },

    /**
     *  清空缓冲池
     *  @param cfgObj  需要清空的缓冲池的配置对象(此参数不传，则默认清空所有缓冲池)
     */
    clearNodePool(cfgObj) {
        if (cfgObj) {
            // todo 清空指定的缓冲池
            const nodePool = this._nodePoolArr[cfgObj.url].preName;
            if (nodePool) {
                nodePool.clear();
            }
        } else {
            //todo 清空所有缓冲池
            for (let obj in this._nodePoolArr) {
                if (this._nodePoolArr[obj].preName) {
                    this._nodePoolArr[obj].preName.clear();
                }
            }
        }
    },
});
module.exports = new NodePoolMgr();
//dd.nodePoolMgr = require("NodePoolMgr");
