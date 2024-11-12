// axios封装
//引入axios
// import axios from 'axios'
// //创建实例
// const api = axios.create({
//     //请求地址的公共部分
//     baseURL: '',
//     //请求的超时时间
//     timeout: 3000
// })
// //axios拦截器
// api.interceptors, request.use(config => {//config·请求的信息
//     return config
// },
//     err· => { Promise.reject(err) }) / 抛出错误

// api.interceptors.response.use(res => {
//     console.log(res)
//     return Promise.resolve(res)
// }, err => {
//     //抛出错误
//     Promise.reject(err)
// })
// export default api

// 调用axios文件
// import api from 'axios.js'
// export const login = () => api({
//     url: '',
//     method: 'get',
//     params: params
// })
// //使用
// import { login } from 'request.js'
// method: {
//     login().then(res => { console.log(res) })
// }

// 一、defineProperty 是对属性拦截，proxy 是对代理对象
const data = {
    name: 'Tom',
    age: 18
};
defineProperty
// 只能拦截对象的某一个属性，不能对整个对象进行拦截，如果需要监听一个对象的所有属性，需要遍历对象的所有属性并对其进行拦截来实现监听。
Object.keys(data).forEach(key => {
    let oldValue = data[key];
    Object.defineProperty(data, key, {
        get() {
            console.log('调用get');
            return oldValue;
        },
        set(value) {
            console.log('调用set');
            oldValue = value;
        }
    });
});
console.log(data.name); // Tom
data.name = 'Jerry';
console.log(data.name); // Jerry
console.log(data);
proxy
// 设置代理对象的属性后，原始对象和代理对象都发生了变化，但是获取原始对象的属性不会触发getter，只有访问代理对象的属性才能触发getter。
const proxyData = new Proxy(data, {
    get(target, prop) {
        console.log('调用get');
        return Reflect.get(target, prop);
    },
    set(target, prop, value) {
        console.log('调用set');
        // Reflect通过代理对象更改目标对象的属性值
        return Reflect.set(target, prop, value);
    }
});

console.log('proxyData.name ->', proxyData.name); // Tom
console.log('data.name ->', data.name); // Tom
proxyData.name = 'Jerry';
console.log('proxyData.name ->', proxyData.name); // Jerry
console.log('data.name ->', data.name); // Jerry
// 二、defineProperty无法监听对象新增属性，proxy可以
// 根据他们的监听方式的不同我们就知道，当对象新增属性的时候，defineProperty没有对新增的属性进行拦截，自然就不会监听到对象新增的属性变化。而proxy是对对象进行代理，自然就能监听到对象属性的新增。
// 三、defineProperty也无法监听对象删除属性，proxy可以
// proxy有专门针对属性删除的办法deleteProperty，可以在对象属性被删除时触发。
const proxyData = new Proxy(data, {
    get(target, prop) {
        console.log('调用get');
        return Reflect.get(target, prop);
    },
    set(target, prop, value) {
        console.log('调用set');
        return Reflect.set(target, prop, value);
    },
    deleteProperty(target, prop) {
        console.log('调用delete');
        Reflect.deleteProperty(target, prop);
        return true;
    }
});
delete proxyData.age;
console.log(data);
// 四、defineProperty不能监听数组下标改变值的变化，proxy 可以且不需要对数组的方法进行重写
// 原始数据
const data = [1, 2];
// 用defineProperty监听数组
Object.keys(data).forEach(key => {
    let oldValue = data[key];
    Object.defineProperty(data, key, {
        get() {
            console.log('调用get，key:', key);
            return oldValue;
        },
        set(value) {
            console.log('调用set');
            oldValue = value; // 注意：这里只是修改了局部变量oldValue，并没有真正改变数组的值
        }
    });
});
console.log(data); // 打印数组内容
data[0] = 3; // 调用set（但实际上这里的set并不会改变数组的真实值，因为oldValue是局部变量）
console.log(data); // 仍然打印 [1, 2]，因为上面的set方法并没有改变数组
data.push(3); // 不调用set
console.log(data); // 打印 [1, 2, 3]，因为push方法没有触发set

// 数组的 key 就是数组的索引。
// 问题是:数组的 push、pop、shift、unshift、splice、sort，reverse是无法触发 set 方法的,
// proxy 监听数组方式
const proxyData = new Proxy(data, {
    get(target, prop, receiver) {
        console.log(`调用get，prop: ${prop}`);
        return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
        console.log(`调用set，prop: ${prop}，value: ${value}`);
        return Reflect.set(target, prop, value, receiver);
    }
});
proxyData[0] = 3; // 这将触发set方法，设置数组的第一个元素为3
proxyData.push(3);
// 五、defineProperty性能较差
// defineProperty 是循环遍历对象属性的方式来进行监听，自然会比 proxy对整个对象进行监听的方式要耗性能。另外Proxy的拦截也是懒处理行为，如果用户没有访问嵌套对象，那么也不会实施拦截，这就让初始化的速度和内存占用都改善了。

