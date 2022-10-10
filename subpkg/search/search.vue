<template>
	<view class="search-box">
		<uni-search-bar placeholder="请输入搜索内容" v-model="kw" cancelButton="none" @input="input" :radius="100">
			<template v-slot:searchIcon>
				<uni-icons color="#999999" size="18" type="search" />
			</template>
		</uni-search-bar>
		<!-- 搜索结果列表 -->
		<view class="sugg-list" v-if="searchResults.length!==0">
			<view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item, i) in historyList" :key="i" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 防抖处理
				timer: null,
				// 搜索关键词
				kw: '',
				// 搜索结果列表
				searchResults: [],
				// 搜索关键词的历史记录
				historyList: ['a', 'app', 'apple'],
			};
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		methods: {
			input(e) {
				// 清除 timer 对应的延时器
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.kw = e
					console.log(this.kw);
					// 根据关键词，查询搜索建议列表
					this.getSearchList()
				}, 500)
			},
			// 根据搜索关键词，搜索商品建议列表
			async getSearchList() {
				// 先判断输入是否为空
				if (this.kw === '') {
					this.searchResults = []
					return
				}
				// 输入不为空，调用接口查询
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.kw
				})
				if (res.meta.status !== 200) return uni.$showMsg()
				this.searchResults = res.message
				console.log('this.searchResults', this.searchResults);
				// 将搜索的关键字存入到历史记录中
				this.saveSearchHistory()
			},
			// 跳转到详情页面
			gotoDetail(goods_id) {
				uni.navigateTo({
					// 指定详情页面的 URL 地址，并传递 goods_id 参数
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
				})
			},
			// 将搜索的关键字存入到历史记录中
			saveSearchHistory() {
				this.historyList.unshift(this.kw)
				// 对数组进行去重处理
				this.historyList = [...new Set(this.historyList)]
				// 调用uni.setStorageSync(key,value),将搜索历史记录持久化存到本地
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
			},
			// 清空历史记录
			cleanHistory() {
				this.historyList = []
				// 清空本地存储中记录的搜索历史
				uni.setStorageSync('kw', '[]')
			},
			// 跳转到商品列表页面
			gotoGoodsList(item) {
				uni.navigateTo({
					 url: '/subpkg/goods_list/goods_list?query=' + item
				})
			}
		}
	}
</script>

<style lang="scss">
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}

	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.goods-name {
				// 文字不允许换行（单行文本）
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后，使用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
</style>
