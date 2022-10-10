<template>
	<view>
		<view class="goods-list">
			<view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<myGoods :goods="goods"></myGoods>
			</view>
		</view>
	</view>
</template>

<script>
	import myGoods from '../../compontents/my-goods/my-goods.vue'
	export default {
		components: {
			myGoods
		},
		data() {
			return {
				// 请求参数对象
				queryObj: {
					// 查询关键词
					query: '',
					// 商品分类Id
					cid: '',
					// 页码值
					pagenum: 1,
					// 每页显示多少条数据
					pagesize: 10
				},
				// 商品列表的数据
				goodsList: [],
				// 总数量，用来实现分页
				total: 0,
				// 是否正在请求数据(节流)
				isloading: false,
			}
		},
		onLoad(options) {
			// 将页面参数转存到 this.queryObj 对象中
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			// 调用获取商品列表数据的方法
			this.getGoodsList()
		},
		// 触底事件
		onReachBottom() {
			// 判断是否还有下一页数据
			if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
			// 判断是否正在请求其它数据，如果是，则不发起额外的请求
			if (this.isloading) return
			// 让页码的值自动加1
			this.queryObj.pagenum++;
			// 重新调用方法，让数据加载更多（判断页码数和每页显示数与总数关系）
			// (页码数 * 每页显示数 <=总数 )
			this.getGoodsList()
		},
		// 下拉刷新
		onPullDownRefresh() {
			// 1. 重置关键数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodsList = []
			// 2. 重新发起请求
			this.getGoodsList(() => uni.stopPullDownRefresh())
		},
		methods: {
			async getGoodsList(cb) {
				// 发起请求
				// 发起请求前，打开节流阀
				this.isloading = true
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				// 请求完毕后，关闭节流阀
				this.isloading = false
				// 只要数据请求完毕，就立即按需调用 cb 回调函数
				cb && cb()
				if (res.meta.status !== 200) return uni.$showMsg()
				// 为数据赋值,数据拼接
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
				console.log('this.goodsList', this.goodsList);
			},
			// 跳转到商品详情页面
			gotoDetail(goods) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
				})
			}
		}
	}
</script>

<style lang="less">

</style>
