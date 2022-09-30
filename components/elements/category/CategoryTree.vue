<template>
  <el-tree
    :data="data"
    @node-drag-start="handleDragStart"
    @node-drag-enter="handleDragEnter"
    @node-drag-leave="handleDragLeave"
    @node-drag-over="handleDragOver"
    @node-drag-end="handleDragEnd"
    @node-drop="handleDrop"
    :allow-drop="allowDrop"
    :allow-drag="allowDrag"
    node-key="id"
    default-expand-all
    draggable
  >
  </el-tree>
</template>

<script>
import { SUCCESS } from '~/constants/httpCode'
export default {
  data() {
    return {
      categories: [],
      data: [],
      maxDepth: 0,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    data: {
      handler(newVal) {
        this.$emit('input', newVal)
      },
      deep: true
    }
  },
  mounted() {
    this.loadingData()
  },
  methods: {
    handleDragStart(node, ev) {
      // console.log('drag start', node)
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      // console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      // console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver(draggingNode, dropNode, ev) {
      // console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      // console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      // console.log('tree drop: ', dropNode.label, dropType)
    },
    allowDrop(draggingNode, dropNode, type) {
      // if (dropNode.data.label === 'Level two 3-1') {
      //   return type !== 'inner'
      // } else {
      return true
      // }
    },
    allowDrag(draggingNode) {
      // return !draggingNode.data.label.includes('Level three 3-1-1')
      return true
    },
    async loadingData() {
      try {
        const response = await this.$axios.post('category/get-all')

        if (response.status === SUCCESS) {
          this.categories = response.data.data
          this.maxDepth = response.data.depth
          await this.handleData()
        }
      } catch (e) {
        console.log(e)
      }
    },
    async handleData() {
      let data = await this.categories
        .filter((e) => {
          return e.depth === this.maxDepth
        })
        .map((e) => {
          e.label = e.name
          e.children = []
          return e
        })

      console.log('data', data)

      for (let i = this.maxDepth - 1; i >= 0; i--) {
        const dataDepthLevelI = this.categories
          .filter((e) => {
            return e.depth === i
          })
          .map((e) => {
            e.label = e.name
            e.children = []
            return e
          })

        data.forEach((e, index) => {
          dataDepthLevelI.forEach((e1, index1) => {
            if (e.parent_id === e1.id) {
              dataDepthLevelI[index1].children.push(e)
            }
          })
        })
        data = dataDepthLevelI
      }
      this.data = data
    },
    async handleDataLevel($depth) {}
  }
}
</script>
