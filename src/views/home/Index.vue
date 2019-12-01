<template>
  <div class="container">
    <!-- tab容器  swipeable 允许手势滑动 -->
    <!-- 要操作dom，关闭标签延迟渲染，自己主动渲染 -->
    <van-tabs @change="changeChannel" swipeable v-model="activeIndex" :lazy-render="false">
      <!-- 选项卡 + 对应的内容 -->
      <van-tab :key="item.id" v-for="item in myChannels" :title="item.name">
        <!-- 文章列表（滚动容器） -->
        <div ref="scrollWrapper" @scroll="remember($event)" class="scroll-wrapper">
          <van-pull-refresh
            v-model="activeChannel.downLoading"
            @refresh="onRefresh"
            :success-text="refreshSuccessText"
          >
            <van-list
              v-model="activeChannel.upLoading"
              :finished="activeChannel.finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell
                :to="{name:'article',params:{id:item.art_id.toString()}}"
                v-for="item in activeChannel.articles"
                :key="item.art_id.toString()"
              >
                <div class="article_item">
                  <h3 class="van-ellipsis">{{item.title}}</h3>
                  <div class="img_box" v-if="item.cover.type===3">
                    <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                    <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                    <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
                  </div>
                  <div class="img_box" v-if="item.cover.type===1">
                    <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
                  </div>
                  <div class="info_box">
                    <span>{{item.aut_name}}</span>
                    <span>{{item.comm_count}}评论</span>
                    <span>{{item.pubdate|relTime}}</span>
                    <span
                      class="close"
                      v-if="user.token"
                      @click.stop="openMoreAction(item.art_id.toString())"
                    >
                      <van-icon name="cross"></van-icon>
                    </span>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 频道按钮 -->
    <span class="bar_btn" slot="nav-right" @click="openChannelEdit">
      <van-icon name="wap-nav"></van-icon>
    </span>
    <!-- 更多操作 -->
    <more-action
      @on-dislike="removeArticle"
      v-if="user.token"
      v-model="showMoreAction"
      :articleId="articleId"
      @on-report="removeReport"
    ></more-action>
    <!-- 编辑操作 -->
    <!--1、 如果一个组件显示多个数据的双向绑定  v-model  不够使用 -->
    <!-- 2、 vue提供  sync修饰符  双向数据绑定（同步父组件和子组件数据） -->
    <!-- 3、 绑定属性  :attrName.sync='数据'  触发事件  $emit('updata:attrName',数据) -->
    <channel-edit
      v-model="showEditChannel"
      :myChannels="myChannels"
      :activeIndex.sync="activeIndex"
    ></channel-edit>
  </div>
</template>

<script>
import { getMyChannels } from '@/api/channel'
import { getArticles } from '@/api/articles'
import { mapState } from 'vuex'
import MoreAction from './components/more-action'
import ChannelEdit from './components/channel-edit'
export default {
  name: 'home-index',
  components: {
    MoreAction,
    ChannelEdit
  },
  data () {
    return {
      // // 上拉加载
      // upLoading: false,
      // // 是否全部加载完成
      // finished: false,
      // // 文章列表
      // articles: [],
      // // 是否是刷新中状态
      // downLoading: false,
      // 刷新完成的提示
      refreshSuccessText: '',
      // 频道列表
      myChannels: [],
      // 当前激活的频道索引
      activeIndex: 0,
      // 显示或隐藏弹出层
      showMoreAction: false,
      // 点击时，当前文章ID
      articleId: null,
      // 显示或隐藏屉式菜单
      showEditChannel: false
    }
  },
  activated () {
    // 激活组件时候触发(初始化也会触发)
    if (this.$refs['scrollWrapper']) {
      // 获取当前的dom元素
      const dom = this.$refs['scrollWrapper'][this.activeIndex]
      // 把当前的频道列表滚动到记录的位置
      dom.scrollTop = this.activeChannel.scrollTop
    }
  },
  methods: {
    // 显示编辑
    openChannelEdit () {
      this.showEditChannel = true
    },
    // 举报文章
    removeReport () {
      const articles = this.activeChannel.articles
      const index = articles.findIndex(
        item => item.art_id.toString() === this.articleId
      )
      articles.splice(index, 1)
    },
    // 对文章不喜欢
    removeArticle () {
      const articles = this.activeChannel.articles
      const index = articles.findIndex(
        item => item.art_id.toString() === this.articleId
      )
      articles.splice(index, 1)
    },
    // 打开弹出层
    openMoreAction (articleId) {
      this.showMoreAction = true
      // 获取点击时的ID
      this.articleId = articleId
    },
    // 记录每次滚动的距离
    remember (e) {
      this.activeChannel.scrollTop = e.target.scrollTop
    },
    // 切换频道（当激活的标签发生改变时）
    changeChannel () {
      // 判断当前频道下是否有数据
      if (!this.activeChannel.articles.length) {
        // 开启加载中效果
        this.activeChannel.upLoading = true
        // 重新加载
        this.onLoad()
      } else {
        // 滚动到之前记录的位置
        // tab组件：默认滚动到顶部

        // 第一种
        // window.setTimeout(() => {
        //   const dom = this.$refs['scrollWrapper'][this.activeIndex]
        //   // 把当前的频道列表滚动到记录的位置
        //   dom.scrollTop = this.activeChannel.scrollTop
        // }, 0)

        // 第二种
        // 使用$nextTick()延迟执行(vue的)    下一帧执行
        // 情景一：当两段代码同时操作dom，不论先后顺序，使用$nextTick
        // 情景二：当数据驱动视图(慢)，此时操作dom不一定成功，使用$nextTick
        this.$nextTick(() => {
          const dom = this.$refs['scrollWrapper'][this.activeIndex]
          // 把当前的频道列表滚动到记录的位置
          dom.scrollTop = this.activeChannel.scrollTop
        })
      }
    },
    // 上拉加载
    async onLoad () {
      //  测试代码

      // window.setTimeout(() => {
      //   // 是否所有数据已经加载完毕 （模拟一下，数据超过50就加载完毕）
      //   if (this.articles.length >= 20) {
      //     this.finished = true
      //     this.upLoading = false
      //     return false
      //   }
      //   // 获取数据成功，模拟一下数据
      //   const data = []
      //   // 1-10  11-20  21-30 ...
      //   for (
      //     let i = this.articles.length + 1;
      //     i <= this.articles.length + 10;
      //     i++
      //   ) {
      //     data.push(i)
      //   }
      //   // 获取文章列表ok
      //   this.articles.push(...data)
      //   // 结束上拉加载效果
      //   this.upLoading = false
      // }, 1000)

      const data = await getArticles(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      // 把获取的数据累加到当前频道下的文章列表中
      this.activeChannel.articles.push(...data.results)
      // 结束上拉加载效果
      this.activeChannel.upLoading = false
      // 是否所有数据已经加载完毕
      if (!data.pre_timestamp) {
        this.activeChannel.finished = true
      } else {
        // 把后端返回的时间戳记录下来
        this.activeChannel.timestamp = data.pre_timestamp
      }
    },
    // 下拉刷新
    async onRefresh () {
      // 测试代码
      // window.setTimeout(() => {
      //   const data = [1, 2, 3, 4, 5]
      //   this.downLoading = false
      //   if (data.length) {
      //     // 有数据
      //     // 渲染页面
      //     this.articles.unshift(...data)
      //     // 提示信息
      //     this.refreshSuccessText = '更新成功'
      //     // 主动加载下一屏数据（防止不足一屏）
      //     this.onLoad()
      //     // 重置  加载全部数据
      //     this.finished = false
      //   } else {
      //     this.refreshSuccessText = '暂无更新'
      //   }
      // }, 1000)

      this.activeChannel.timestamp = Date.now()
      const data = await getArticles(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      // 结束下拉刷新效果
      this.activeChannel.downLoading = false
      // 判断是否有数据
      if (data.results.length) {
        this.activeChannel.articles = data.results
        // 加载有数据的文案
        this.refreshSuccessText = '更新成功'
        // 防止看到 没有更多了 信息 （重新刷新列表，下一页应该是有数据的）
        // this.activeChannel.finished = false
        // 加上时间戳  加载下一页数据
        this.activeChannel.timestamp = data.pre_timestamp
        // 防止数据不够一屏
        this.onLoad()
      } else {
        // 没有数据的提示
        this.refreshSuccessText = '暂无更新'
      }
    },
    // 获取频道列表
    async getMyChannels () {
      const data = await getMyChannels()
      // 清除tabs组件的缓存
      this.myChannels = []
      this.$nextTick(() => {
        this.myChannels = data.channels.map(item => {
          return {
            id: item.id,
            name: item.name,
            // 文章列表
            articles: [],
            // 加载中
            upLoading: false,
            //  刷新中
            downLoading: false,
            // 是否全部加载完成
            finished: false,
            // 时间戳,类似于页码
            timestamp: Date.now(),
            // 滚动的距离
            scrollTop: 0
          }
        })
      })
    }
  },
  // 监听
  watch: {
    user () {
      // 更新当前频道（默认推荐）
      this.activeIndex = 0
      // 重新获取频道列表
      this.getMyChannels()
      // 重新加载数据
      this.onLoad()
    }
  },
  created () {
    this.getMyChannels()
  },
  computed: {
    // 当前频道
    activeChannel () {
      return this.myChannels[this.activeIndex]
    },
    ...mapState(['user'])
  }
}
</script>

<style scoped lang='less'>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
//  按钮
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
// 文章布局
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
