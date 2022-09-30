<template>
  <div>
    <b-modal
      ref="modal"
      :no-enforce-focus="true"
      :ok-title="$t('button.cancel')"
      @hidden="handleModalHide"
      @ok="handleModalHide"
      :static="staticModal"
      title="Danh sách issues"
      ok-only
      ok-variant="secondary"
      size="xl"
      body-class="pt-0"
      header-border-variant="white"
      header-class="pb-0"
    >
      <b-tabs
        justified
        nav-class="nav-tabs-line nav-tabs-line-success"
        active-nav-item-class="font-weight-bold"
      >
        <b-tab title="Danh sách issue chưa fix" active>
          <activity-issue-tab
            :issue-criterion-groups="issueCriterionGroups"
            @has-fixed="hasFixed = true"
          />
        </b-tab>
        <b-tab title="Danh sách issue đã fix"
          ><activity-issue-tab :issue-criterion-groups="fixCriterionGroups"
        /></b-tab>
      </b-tabs>
    </b-modal>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import ActivityIssueTab from '~/features/activity/partial/ActivityIssueTab'

export default {
  name: 'ActivityIssueModal',
  components: {
    ActivityIssueTab
  },
  props: {
    criterionGroups: {
      type: Array,
      required: true
    },
    staticModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerCriterionGroups: [],
      issueCriterionGroups: [],
      fixCriterionGroups: [],
      innerItem: {},
      hasFixed: false
    }
  },
  created() {
    this.innerCriterionGroups = this.criterionGroups.map((v) => cloneDeep(v))
  },
  methods: {
    show(item = null) {
      this.innerItem = cloneDeep(item)
      if (this.innerItem.review_criterions) {
        const criterionItems = this.innerItem.review_criterions
        this.innerCriterionGroups.forEach((innerCriterionGroup) => {
          const issueCriterionGroupItem = {
            _id: innerCriterionGroup._id,
            name: innerCriterionGroup.name,
            criterions: []
          }
          const fixCriterionGroupItem = {
            _id: innerCriterionGroup._id,
            name: innerCriterionGroup.name,
            criterions: []
          }
          innerCriterionGroup.criterions.forEach((valCriterion) => {
            const innerCriterion = {
              _id: valCriterion._id,
              name: valCriterion.name,
              issues: []
            }
            const fixedCriterion = {
              _id: valCriterion._id,
              name: valCriterion.name,
              issues: []
            }
            criterionItems.forEach((review) => {
              const criterionItem = review.criterions.find(
                (val) => val._id === valCriterion._id
              )
              if (criterionItem && criterionItem.score === 0) {
                if (criterionItem.fixed) {
                  fixedCriterion.issues.push({
                    reviewer_id: review.reviewer_id,
                    reviewer_activity_criterion_id: review._id,
                    ...criterionItem
                  })
                } else {
                  innerCriterion.issues.push({
                    reviewer_id: review.reviewer_id,
                    reviewer_activity_criterion_id: review._id,
                    ...criterionItem
                  })
                }
              }
            })
            if (innerCriterion.issues.length > 0) {
              issueCriterionGroupItem.criterions.push(innerCriterion)
            }
            if (fixedCriterion.issues.length > 0) {
              fixCriterionGroupItem.criterions.push(fixedCriterion)
            }
          })
          if (issueCriterionGroupItem.criterions.length > 0) {
            this.issueCriterionGroups.push(issueCriterionGroupItem)
          }
          if (fixCriterionGroupItem.criterions.length > 0) {
            this.fixCriterionGroups.push(fixCriterionGroupItem)
          }
        })
      }

      this.$refs.modal.show()
    },
    handleModalHide(bvModalEvt) {
      if (this.hasFixed) {
        this.$emit('has-fixed')
      }

      this.innerCriterionGroups = this.criterionGroups.map((v) => cloneDeep(v))
      this.innerItem = {}
      this.issueCriterionGroups = []
      this.fixCriterionGroups = []
      this.hasFixed = false
    }
  }
}
</script>
