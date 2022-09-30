<template>
  <the-portlet
    :title="
      display === 'normal' ? 'Danh sách kịch bản' : 'Danh sách kịch bản VIP'
    "
  >
    <template v-slot:tool>
      <b-form-input
        v-model="search"
        :autocomplete="'disabled'"
        placeholder="Tìm kiếm"
      ></b-form-input>
    </template>

    <div class="activity-wrap">
      <draggable
        :list="filteredList"
        v-bind="dragOptions"
        :clone="cloneItem"
        @start="draggable = false"
        class="dragArea list-group kt-widget kt-widget--users"
      >
        <div
          v-for="element in filteredList"
          :key="element.type"
          class="list-group-item activity-item"
        >
          <div class="kt-widget__item">
            <span class="kt-media">
              <img :src="element.icon" alt="image" />
            </span>
            <div :data-preview-image="element.preview" class="kt-widget__info">
              <div class="kt-widget__section">
                <a href="javascript:;" class="kt-widget__username">
                  {{ element.name }}
                </a>
              </div>
              <span class="kt-widget__desc">
                {{ element.desc }}
              </span>
            </div>
            <div class="kt-widget__action">
              <a
                @click="addScript(element)"
                href="javascript:;"
                class="text-success wrap-username"
                >Thêm vào cuối</a
              >
            </div>
          </div>
        </div>
      </draggable>
    </div>
  </the-portlet>
</template>

<style>
.wrap-username {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<script>
import draggable from 'vuedraggable'
import randomstring from 'randomstring'
import jQuery from 'jquery'
import ThePortlet from '~/components/base/ThePortlet'

export default {
  name: 'ActivityList',
  components: { ThePortlet, draggable },
  props: {
    display: {
      type: String,
      default: 'normal'
    },
    activityList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dragOptions: {},
      search: ''
    }
  },
  computed: {
    filteredList() {
      if (this.display === 'normal') {
        return this.activityList.filter((item) => {
          return (
            item.display === 'normal' &&
            (item.name.toLowerCase().includes(this.search.toLowerCase()) ||
              item.desc.toLowerCase().includes(this.search.toLowerCase()))
          )
        })
      } else {
        return this.activityList.filter((item) => {
          return (
            item.name.toLowerCase().includes(this.search.toLowerCase()) ||
            item.desc.toLowerCase().includes(this.search.toLowerCase())
          )
        })
      }
    }
  },
  mounted() {
    this.preview()
  },
  methods: {
    cloneItem(item) {
      return {
        ...item,
        id: item.type + '_' + randomstring.generate()
      }
    },
    addScript(item) {
      this.$emit('add-script', item)
    },
    preview() {
      ;(function($) {
        $.previewImage = function(options) {
          const element = $(document)
          const namespace = '.previewImage'

          const opts = $.extend(
            {
              /* The following set of options are the ones that should most often be changed
               by passing an options object into this method.
            */
              xOffset: 20, // the x offset from the cursor where the image will be overlayed.
              yOffset: -180, // the y offset from the cursor where the image will be overlayed.
              fadeIn: 'fast', // speed in ms to fade in, 'fast' and 'slow' also supported.
              css: {
                // css to use, may also be set to false.
                // padding: '8px',
                border: '1px solid #E1E5EC',
                'background-color': '#fff',
                'z-index': 999999
              },

              /* The following options should normally not be changed - they are here for
               cases where this plugin causes problems with other plugins/javascript.
            */
              eventSelector: '[data-preview-image]', // the selector for binding mouse events.
              dataKey: 'previewImage', // the key to the link data, should match the above value.
              overlayId: 'preview-image-plugin-overlay' // the id of the overlay that will be created.
            },
            options
          )

          // unbind any previous event listeners:
          element.off(namespace)

          element.on('mouseover' + namespace, opts.eventSelector, function(e) {
            const p = $('<div>')
              .attr('id', opts.overlayId)
              .css('position', 'absolute')
              .css('display', 'none')
              .append(
                $('<img>')
                  .attr('src', $(this).data(opts.dataKey))
                  .css({
                    'max-height': '400px',
                    'z-index': '999999'
                  })
              )
            if (opts.css) p.css(opts.css)

            $('body').append(p)

            p.css('top', e.pageY + opts.yOffset + 'px')
              .css('left', e.pageX + opts.xOffset + 'px')
              .fadeIn(opts.fadeIn)
          })

          element.on('mouseout' + namespace, opts.eventSelector, function(e) {
            $('#kt_wrapper').scrollTop(e.pageY - 20 + 'px')
            $('#' + opts.overlayId).remove()
          })

          element.on('mousedown' + namespace, opts.eventSelector, function(e) {
            $('#kt_wrapper').scrollTop(e.pageY - 20 + 'px')
            $('#' + opts.overlayId).remove()
          })

          element.on('mousemove' + namespace, opts.eventSelector, function(e) {
            $('#' + opts.overlayId)
              .css('top', e.pageY + opts.yOffset + 'px')
              .css('left', e.pageX + opts.xOffset + 'px')
          })

          return this
        }

        // bind with defaults so that the plugin can be used immediately if defaults are taken:
        $.previewImage()
      })(jQuery)
    }
  }
}
</script>
