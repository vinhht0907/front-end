<template>
  <div class="speaker-management">
    <label>Danh sách người nói</label>
    <div class="speaker-list">
      <div
        v-for="(speaker, index) in speakers"
        :key="speaker.id"
        class="speaker-item"
      >
        <el-popover width="365">
          <div class="avatar-list">
            <img
              v-for="avatar in avatars"
              :src="avatar.path"
              @click="setSpeakerAvatar(speaker, avatar)"
            />
          </div>
          <div slot="reference" class="speaker-avatar">
            <img :src="speaker.avatar" v-if="speaker.avatar" />
            <span v-else class="choose-avatar"><i class="la la-plus"></i></span>
          </div>
        </el-popover>

        <input
          v-model="speaker.name"
          type="text"
          placeholder="Nhập tên người nói..."
        />
        <a
          @click="deleteSpeaker(index)"
          class="speaker-delete d-flex justify-content-center align-items-center"
          href="javascript:;"
          >x</a
        >
      </div>

      <a
        @click="addSpeaker"
        href="javascript:;"
        class="btn btn-primary speaker-item add-more"
      >
        <i class="la la-plus"></i> Thêm người nói
      </a>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import randomstring from 'randomstring'

const defaultSpeaker = {
  name: null,
  avatar: null
}

export default {
  name: 'SpeakerManagement',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      avatars: [],
      speakers: []
    }
  },
  watch: {
    speakers: {
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    },
    value: {
      deep: true,
      handler(val) {
        this.speakers = val
      }
    }
  },
  mounted() {
    this.loadData()
  },
  created() {
    if (this.value) {
      this.speakers = this.value
    }
  },
  methods: {
    addSpeaker() {
      const speaker = cloneDeep(defaultSpeaker)
      speaker.id = randomstring.generate()
      this.speakers.push(speaker)
    },
    async loadData() {
      const { data } = await this.$axios.post('/speaker-avatar/list', {
        length: -1,
        start: 0
      })

      if (data.data) {
        this.avatars = data.data
      }
      try {
      } catch (e) {}
    },
    setSpeakerAvatar(speaker, avatar) {
      speaker.avatar = avatar.path
    },
    deleteSpeaker(index) {
      this.speakers.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.avatar-list {
  img {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    cursor: pointer;
    margin-bottom: 10px;
    margin-right: 10px;
  }
}
.speaker-management {
  .speaker-list {
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0;

    .speaker-item {
      border-radius: 24px;
      border: 1px solid #ddd;
      overflow: hidden;
      display: flex;
      justify-content: center;
      margin-right: 15px;
      margin-bottom: 15px;

      &.add-more {
        height: 42px;
        width: 230px;
      }

      .speaker-avatar {
        cursor: pointer;
        img {
          width: 40px;
          height: 40px;
        }
        span.choose-avatar {
          border: 1px dashed #ccc;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
      input {
        height: calc(100% - 2px);
        border: none;
      }
      .speaker-delete {
        width: 30px;
        border-left: 1px solid #ccc;
        color: red;
        font-size: 18px;
      }
    }
  }
}
</style>
