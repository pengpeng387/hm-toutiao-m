<template>
  <div class="container-serach">
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <van-search v-model.trim="q" placeholder="请输入搜索关键词" shape="round" @search="onSearch" />
    <!-- 联想搜索 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell icon="search" v-for="item in suggestList" :key="item">
        <p v-html="item" @click="onSearch(item.replace(`<span>${q}</span>`,q))"></p>
      </van-cell>
    </van-cell-group>
    <!-- 搜索历史 -->
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <van-icon name="delete" @click="clearHistory"></van-icon>
      </div>
      <van-cell-group>
        <van-cell v-for="(key,i) in historyList" :key="key">
          <a @click="toSerach(key)" class="word_btn">{{key}}</a>
          <van-icon @click="delHistory(i)" class="close_btn" slot="right-icon" name="cross" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { suggest } from '@/api/articles'
// 约定历史记录本地存储的key
const KEY = 'hm-toutiao-history-key'
export default {
  name: 'search-index',
  data () {
    return {
      q: '',
      // 初始化历史记录列表
      historyList: JSON.parse(window.localStorage.getItem(KEY) || '[]'),
      // 联想建议列表
      suggestList: [],
      timer: null
    }
  },
  methods: {
    // 进行搜索
    onSearch (key) {
      // key表示当前输入框的值
      // 存储搜索历史(key不能存重复的)  集合
      const keySet = new Set(this.historyList)
      keySet.add(key)
      this.historyList = [...keySet]
      // 存储在本地
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
      // 跳转搜索结果
      this.$router.push({ path: '/search/result', query: { q: key } })
    },

    // 根据历史搜索
    toSerach (key) {
      this.$router.push({ path: '/search/result', query: { q: key } })
    },

    // 删除历史记录
    delHistory (index) {
      this.historyList.splice(index, 1)
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
    },

    // 清空历史记录
    clearHistory () {
      this.historyList = []
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
    }
  },
  watch: {
    // 函数防抖
    async q () {
      window.clearTimeout(this.timer)
      this.timer = window.setTimeout(async () => {
        if (!this.q) {
          this.suggestList = []
          return false
        }
        const data = await suggest(this.q)
        this.suggestList = data.options.map(item => item.toLowerCase().replace(this.q, `<span>${this.q}</span>`))
      }, 500)
    }
  }
}
</script>

<style scoped lang='less'>
.history-box {
  padding: 0 20px;
  .head {
    line-height: 36px;
    color: #999;
    .van-icon {
      font-size: 16px;
      float: right;
      margin-top: 10px;
    }
  }
  .van-cell {
    padding: 10px 0;
  }
  .word_btn {
    color: #3296fa;
  }
  .close_btn {
    margin-top: 5px;
    color: #999;
  }
}

.suggest-box {
  /deep/ .van-cell {
    padding: 10px 20px;
    color: #999;
    p {
      span {
        color: red;
      }
    }
  }
}
</style>
