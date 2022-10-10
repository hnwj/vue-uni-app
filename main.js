import App from './App'
// 按需导入 $http 对象
import {
	$http
} from '@escook/request-miniprogram'
// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http
// 配置基础路劲
$http.baseUrl = 'https://api-ugo-web.itheima.net'
// 请求拦截器（请求前）
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...',
	})
}
// 请求完成之后做一些事情
$http.afterRequest = function() {
	uni.hideLoading()
}

// 封装一个信息提示函数 uni.$showMsg() 
uni.$showMsg = function(title = "数据加载失败", duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}


// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
