<template>
  <div class="row">
    <div class="col-md-6">
      <activity-list
        :activity-list="activityList"
        :display="display"
        @add-script="addScript"
      />
    </div>
    <div class="col-md-6">
      <script-list
        ref="scriptList"
        :id="activity._id"
        :script="activity.script"
        :activity-list="activityList"
        :title="title"
        :url="`${urlPrefix}/set-script`"
        @show-issue="showIssueModal"
        show-issue
      />
      <activity-issue-modal
        ref="issueModal"
        :criterion-groups="criterionGroups"
        :static-modal="true"
      />
    </div>
  </div>
</template>

<script>
import { notifyDanger } from '~/utils/bootstrap-notify'
import ScriptList from '~/components/elements/script/ScriptList'
import ActivityList from '~/components/elements/script/ActivityList'
import ActivityIssueModal from '~/features/activity/ActivityIssueModal'

export default {
  name: 'ScriptDetail',
  components: { ActivityIssueModal, ActivityList, ScriptList },
  props: {
    title: {
      type: String,
      default: ''
    },
    urlPrefix: {
      type: String,
      default: ''
    },
    display: {
      type: String,
      default: 'normal'
    }
  },
  data() {
    return {
      activity: {},
      criterionGroups: [],
      activityList: []
    }
  },
  created() {
    this.loadActivity()
    this.loadCriterionGroups()
    this.loadActivityTypes()
  },
  methods: {
    addScript(item) {
      this.$refs.scriptList.addScript(item)
    },
    showIssueModal() {
      this.$refs.issueModal.show(this.activity)
    },
    async loadActivity() {
      try {
        const { data } = await this.$axios.post(
          `/${this.urlPrefix}/get-script`,
          {
            _id: this.$route.params.id
          }
        )
        if (!data.script) {
          notifyDanger('activity not found')
        }
        this.activity = data
      } catch (e) {
        notifyDanger('activity error')
      }
    },
    async loadCriterionGroups() {
      try {
        const { data } = await this.$axios.post('/activity/list-criterions', {
          _id: this.$route.params.id
        })
        this.criterionGroups = data
      } catch (e) {
        notifyDanger('criterions error')
      }
    },
    async loadActivityTypes() {
      try {
        const { data } = await this.$axios.post('/activity-type/list', {
          _id: this.$route.params.id
        })
        this.activityList = data
      } catch (e) {
        notifyDanger('activity type error')
      }
    }
  }
}
</script>
