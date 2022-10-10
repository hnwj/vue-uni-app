<template>
	<view>
		<view class="my-search-container"  :style="{'background-color':bgcolor}"
			@click="searchBoxHandler">
			<!-- 使用view组件模拟input输入框的样式 -->
			<view class="my-search-box" :style="{'border-radius':radius+'px'}">
				<uni-icon type="search" size="17"></uni-icon>
				<text class="placeholder">搜索</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			bgcolor: {
				type: String,
				default: '#C00000'
			},
			radius: {
				type: Number,
				// 单位是 px
				default: 18
			}
		},
		data() {
			return {

			};
		},
		onLoad() {

		},
		methods: {
			searchBoxHandler() {
				// 触发外界通过 @click 绑定的 click 事件处理函数
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
	.my-search-container {
		// background-color: #c00000;
		height: 50px;
		padding: 0 10px;
		display: flex;
		align-items: center;

		.my-search-box {
			height: 36px;
			background-color: #ffffff;
			// border-radius: 15px;
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;

			.placeholder {
				font-size: 15px;
				margin-left: 5px;
			}
		}
	}
</style>
