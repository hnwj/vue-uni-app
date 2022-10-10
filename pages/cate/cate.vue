<template>
	<view>
		<!-- 搜索框 -->
		<view class="search-box">
			<mySearch @click="gotoSearch"></mySearch>
		</view>
		<view class="scroll-view-container">
			<!-- 左侧滚动视图 -->
			<scroll-view scroll-y="true" class="left-scroll" :style="{height: wh + 'px'}">
				<block v-for="(item,index) in cateList" :key="item.cat_id">
					<view :class="['left-scroll-item',index === active ? 'active':'']" @click="activeHandler(index)">
						{{item.cat_name}}
					</view>
				</block>
			</scroll-view>
			<!-- 右侧滚动视图 -->
			<scroll-view scroll-y="true" class="right-scroll" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2, index2) in cateLevel2" :key="index2">
					<view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
					<!-- 动态渲染三级分类的列表数据 -->
					<view class="cate-lv3-list">
						<!-- 三级分类 Item 项 -->
						<view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3"
							@click="gotoGoodsList(item3)">
							<!-- 图片 -->
							<image :src="item3.cat_icon.replace('dev','web')"></image>
							<!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import mySearch from '../../compontents/my-search/my-search.vue'
	export default {
		components: {
			mySearch
		},
		data() {
			return {
				// 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
				wh: 0,
				// 分类数据列表
				cateList: [],
				// 当前选中项的索引，默认让第一项被选中
				active: 0,
				// 二级分类列表
				cateLevel2: [],
				// 滚动条距离顶部的距离
				scrollTop: 0,
			};
		},
		onLoad() {
			// 获取当前系统的信息
			const sysInfo = uni.getSystemInfoSync()
			console.log(sysInfo);
			// 为 wh 窗口可用高度动态赋值
			// 可用高度 = 屏幕高度 - navigationBar高度 - tabBar高度 - 自定义的search组件高度
			this.wh = sysInfo.windowHeight - 50
			// 调用获取分类列表数据的方法
			this.getCateList()
		},
		methods: {
			// 获取分类列表数据的方法
			async getCateList() {
				// 发起请求
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories')
				// 判断是否获取失败
				if (res.meta.status !== 200) return uni.$showMsg()
				// 转存数据(一级)
				this.cateList = res.message
				// 转存数据（二级）
				this.cateLevel2 = res.message[0].children
				console.log('this.cateList', this.cateList);
				console.log('this.cateLevel2', this.cateLevel2);
			},
			// 修改item中的css样式
			activeHandler(index) {
				this.active = index
				// 为二级分类列表重新赋值
				this.cateLevel2 = this.cateList[index].children
				// 置顶效果
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
			},
			// 跳转到商品列表页面
			gotoGoodsList(item) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
				})
			},
			// 跳转到分包中的搜索页面
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
		display: flex;
		justify-content: space-around;

		.left-scroll {
			width: 120px;

			.left-scroll-item {
				line-height: 60px;
				background-color: #f7f7f7;
				text-align: center;
				font-size: 12px;

				// 激活项的样式
				&.active {
					background-color: #ffffff;
					position: relative;

					// 渲染左侧的红色指示线
					&::before {
						content: ' ';
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						position: absolute;
						left: 0;
						top: 50%;
						transform: translateY(-50%);
					}
				}
			}

		}
	}

	.cate-lv2-title {
		font-size: 12px;
		font-weight: bold;
		text-align: center;
		padding: 15px 0;
	}

	.cate-lv3-list {
		display: flex;
		flex-wrap: wrap;

		.cate-lv3-item {
			width: 33.33%;
			margin-bottom: 10px;
			display: flex;
			flex-direction: column;
			align-items: center;

			image {
				width: 60px;
				height: 60px;
			}

			text {
				font-size: 12px;
			}
		}
	}

	// 吸顶效果
	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}
</style>
