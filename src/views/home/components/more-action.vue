<template>
  <van-popup :value="value" @open="isReport=false" @input="$emit('input',$event)">
    <van-cell-group v-if="!isReport">
      <van-cell @click="disLikes">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell
        @click="report(item.value)"
        icon="info-o"
        v-for="item in reports"
        :key="item.value"
      >{{item.label}}</van-cell>
    </van-cell-group>
  </van-popup>
</template>
<script>
import { disLike, report } from '@/api/articles'
import { reports } from '@/api/constants'
export default {
  name: 'more-action',
  data () {
    return {
      isReport: false,
      reports
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 当前文章ID
    articleId: {
      type: String,
      default: null
    }
  },
  methods: {
    // 不感兴趣
    async disLikes () {
      try {
        // 发请求
        await disLike(this.articleId)
        // 提示信息
        this.$toast({ type: 'success', message: '操作成功' })
        // 关闭
        this.$emit('input', false)
        // 删除文章
        this.$emit('on-dislike', this.articleId)
      } catch (e) {
        this.$toast({ type: 'fail', message: '操作失败' })
      }
    },
    // 举报文章
    async report (type) {
      try {
        await report(this.articleId, type)
        // 提示
        this.$toast({ type: 'success', message: '举报成功' })
        // 关闭
        this.$emit('input', false)
        // 删除文章
        this.$emit('on-report', this.articleId)
      } catch (e) {
        if (e.response.status === 409) {
          this.$toast({ message: '已举报过' })
          return
        }
        this.$toast({ type: 'fail', message: '举报成功' })
      }
    }
  }
}
</script>

<style scoped lang='less'>
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
