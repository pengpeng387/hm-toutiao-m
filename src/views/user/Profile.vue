<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="$router.back()" title="编辑资料" right-text="保存" @click-right="save"></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" @click="showPhoto=true" center>
        <van-image slot="default" width="1.5rem" height="1.5rem" fit="cover" round :src="photo" />
      </van-cell>
      <van-cell is-link title="名称" @click="showName=true" :value="user.name" />
      <van-cell is-link title="性别" @click="showGender=true" :value="user.gender===0?'男':'女'" />
      <van-cell is-link title="生日" @click="openDate()" :value="user.birthday" />
    </van-cell-group>
    <van-popup v-model="showPhoto" position="bottom">
      <van-cell value="本地相册选择" is-link @click="$refs.fileInput.click()"/>
      <van-cell value="拍照" is-link />
    </van-popup>
    <van-popup v-model="showName" position="bottom">
      <van-field v-model="user.name" required placeholder="请输入用户名" />
    </van-popup>
    <van-popup v-model="showGender" position="bottom">
      <van-cell value="男" @click="changeGender(0)" is-link />
      <van-cell value="女" @click="changeGender(1)" is-link />
    </van-popup>
    <van-popup v-model="showBirthday" position="bottom">
      <van-datetime-picker
        title="选择生日"
        v-model="nowDate"
        type="date"
        :min-date="minDate"
        @cancel="dateShow=false"
        @confirm="confirmDate"
      />
    </van-popup>
    <input type="file" @change="preview" style="display:none" ref="fileInput">
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { getUserProfile, saveUserPhoto, saveUserInfo } from '@/api/user'
export default {
  data () {
    return {
      // 弹窗控制
      showPhoto: false,
      showName: false,
      showGender: false,
      showBirthday: false,
      nowDate: new Date(),
      minDate: new Date('1950-01-01'),
      // 默认用户信息
      photo: 'https://img.yzcdn.cn/vant/cat.jpeg',
      user: {
        name: '默认信息',
        gender: 0,
        birthday: '2019-10-10'
      }
    }
  },
  created () {
    this.getUserProfile()
  },
  methods: {
    openDate () {
      // 有生日数据
      if (this.user.birthday) {
        this.nowDate = new Date(this.user.birthday)
      }
      this.showBirthday = true
    },
    confirmDate (value) {
      // 确认时间后  把Date转换成String
      this.user.birthday = dayjs(value).format('YYYY-MM-DD')
      this.showBirthday = false
    },
    changeGender (gender) {
      // 选择性别 gender 0 男  1 女
      this.user.gender = gender
      this.showGender = false
    },
    // 渲染
    async getUserProfile () {
      const data = await getUserProfile()
      this.user = data
      this.photo = data.photo
    },
    // 预览图片
    preview () {
      // 获取当前选择的文件对象
      const file = this.$refs.fileInput.files[0]
      // 从你选择的文件对象读取文件信息(base64编码格式)
      const fileReader = new FileReader()

      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        // 把读取后的数据  赋值给  src 属性即可
        this.photo = fileReader.result
        this.showPhoto = false
      }
    },
    // 保存信息
    async save () {
      try {
        // 上传头像
        const formData = new FormData()
        formData.append('photo', this.$refs.fileInput.files[0])
        await saveUserPhoto(formData)
        // 保存信息
        const { name, gender, birthday } = this.user
        await saveUserInfo(name, gender, birthday)
        this.$toast.success('保存成功')
        this.$router.push({ path: '/user' })
      } catch (e) {
        this.$toast.fail('保存失败')
      }
    }
  }
}
</script>

<style scoped lang='less'></style>
