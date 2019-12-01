<template>
  <!-- @closed="editing=false" 关闭屉式菜单  重置编辑状态为不编辑 -->
  <van-action-sheet
    :value="value"
    @closed="editing=false"
    @input="$emit('input', $event)"
    title="编辑频道"
  >
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,i) in myChannels" :key="item.id">
          <span class="f12" @click="enterChannel(i)" :class="{red:i===activeIndex}">{{item.name}}</span>
          <van-icon
            v-show="editing && i!==0"
            class="btn"
            name="cross"
            @click="delChannel(i,item.id)"
          ></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon @click="addChannel(item)" class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>

<script>
import { getAllChannels, delChannel, addChannel } from '@/api/channel'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 当前频道
    myChannels: {
      type: Array,
      default: () => {}
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 编辑或完成
      editing: false,
      // 全部频道
      allChannels: []
    }
  },
  methods: {
    // 添加频道
    async addChannel ({ id, name }) {
      try {
        // 1、得到有排序的数组
        const orderChannels = this.myChannels.map((item, i) => {
          return {
            id: item.id,
            name: item.name,
            seq: i
          }
        })
        // 追加一项
        orderChannels.push({ id, name, seq: orderChannels.length })
        // 删除推荐
        orderChannels.splice(0, 1)
        // 调用api
        await addChannel(orderChannels)
        // 提示信息
        this.$toast.success('添加成功')
        // 往组件中的mychannels追加一项，组件渲染
        this.myChannels.push({
          id,
          name,
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
        })
      } catch (e) {
        this.$toast.fail('添加失败')
      }
    },

    // 获取全部频道
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    },

    // 点击进入频道
    enterChannel (index) {
      this.$emit('update:activeIndex', index)
      this.$emit('input', false)
    },

    // 删除频道
    async delChannel (index, channelId) {
      try {
        // 1、调用api来删除频道数据
        await delChannel(channelId)
        // 2、提示信息
        this.$toast.success('删除成功')
        // 3、当删除的索引  小于等于  当前激活频道的索引  让激活索引前移一位
        if (index <= this.activeIndex) {
          this.$emit('update:activeIndex', this.activeIndex - 1)
        }
        // 删除组件依赖我的频道数据 myChannel中的索引对应的频道
        this.myChannels.splice(index, 1)
      } catch (e) {
        this.$toast.fail('删除失败')
      }
    }
  },
  created () {
    this.getAllChannels()
  },
  computed: {
    // 可选频道
    optionalChannels () {
      // 可选频道=全部频道-我的频道
      // 根据当前频道的ID区我的频道中找
      // 找到了  false，就不是可选频道，抛弃
      // 没找到 true，是可选频道，留下
      return this.allChannels.filter(
        item =>
          this.myChannels.findIndex(myItem => myItem.id === item.id) === -1
      )
    }
  }
}
</script>

<style scoped lang='less'>
.van-popup--bottom {
  &.van-popup--round {
    border-radius: 0;
  }
}
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit {
    line-height: 3;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12 {
    font-size: 12px;
    color: #555;
  }
  .red {
    color: red;
  }
}
</style>
