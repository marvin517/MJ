
const dd = cc.dd;
const NodePoolCfg = {


};
/**
 *  配置
 * @type {{LabelPre: {url: string, count: number, increaseNum: number}}}
 */
NodePoolCfg.CFG = {
    LabelPre: {
        url: "prefabs/TestPoolNode",  //  路径
        count: 5,  //  初始缓冲池资源的数量
        increaseNum: 2,
    },
};

/**
 *  给配置文件增加配置（key值为“cfg + NodePoolCfg.nameIndex”）
 * @param url  资源的url
 */
NodePoolCfg.addCfg = (url) => {
    NodePoolCfg.CFG.url = {
        url: url,
        count: 1,
        increaseNum: 1,
    };
    return NodePoolCfg.CFG.url;
};
/**\
 *  根据url返回对应的配置对象
 * @param url  资源的url
 * @returns {*} 放回对应的配置对象，不存在则返回null
 */
NodePoolCfg.getObjByUrl = (url) => {
    for (let obj in NodePoolCfg.CFG) {
        if (NodePoolCfg.CFG[obj] instanceof Object && NodePoolCfg.CFG[obj].url === url) {
            return NodePoolCfg.CFG[obj];
        }
    }
    return NodePoolCfg.addCfg(url);
};

dd.nodePoolCfg = NodePoolCfg;
