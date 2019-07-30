import { saveDefault } from '@/util/utils.js';

const context = require.context('./', true, /model.js/);
const keys = context.keys();
const models = keys.map(item => context(item).default);
const results = {};
const namespaces = models.reduce((pre, next) => {
    const key = next.namespace;
    pre[key] = pre[key] ? pre[key] + 1 : 1
    return pre;
}, {});
for (const k in namespaces) {
    if (Object.prototype.hasOwnProperty.call(namespaces, k)) {
        if (namespaces[k] > 1) {
            throw new Error(`namespace of model has to be unique,${k} model is repetitive!`);
        }
    }
}

models.forEach(element => {
    const key = element.namespace;
    const reducers = element.reducers || {};
    element.reducers = { // 添加默认的reducer
        saveDefault,
        ...reducers
    };
    if (!key) { // model的namespace必填
        throw new Error('namespace of model is required!');
    }
    results[key] = element;
});

export default results;