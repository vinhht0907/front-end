<template>
  <div>
    <template v-if="issueCriterionGroups.length > 0">
      <b-form-group
        v-for="criterionGroup in issueCriterionGroups"
        :key="criterionGroup._id"
        :label="criterionGroup.name"
        label-class="font-weight-bold label-title"
        class="mb-0"
      >
        <b-form-group
          v-for="(criterion, criterionKey) in criterionGroup.criterions"
          :key="criterion._id"
          :label="criterionKey + 1 + '. ' + criterion.name"
          class="mb-0"
          label-class="font-weight-bold"
        >
          <b-form-group
            v-for="issue in criterion.issues"
            :key="issue.reviewer_activity_criterion_id"
            class="mb-0"
            label-class="review-title"
          >
            <template v-slot:label>
              <span>
                <i class="la la-user"></i>
                {{ issue.reviewer_id.full_name }} ({{
                  issue.reviewer_id.email
                }})
              </span>

              <b-button
                @click="fixIssue(issue)"
                :disabled="checkLoading(issue) || checkCompleted(issue)"
                variant="success"
                size="sm"
              >
                <b-spinner v-if="checkLoading(issue)" small></b-spinner>
                <span v-if="checkCompleted(issue)">Issue đã được fix</span>
                <template v-else
                  ><i class="la la-check"></i> Đánh dấu đã fix issue</template
                >
              </b-button>
            </template>
            <b-row>
              <b-col v-if="issue.text">
                <p class="issue-text">
                  {{ issue.text }}
                </p>
              </b-col>
              <b-col v-if="issue.images.length > 0">
                <div class="list-image-group">
                  <ul class="el-upload-list el-upload-list--picture-card">
                    <li
                      v-for="image in issue.images"
                      class="el-upload-list__item"
                    >
                      <div class="item-el-upload">
                        <img
                          :src="image"
                          class="el-upload-list__item-thumbnail"
                        />
                        <span class="el-upload-list__item-actions">
                          <span
                            @click="previewMedia(image)"
                            class="el-upload-list__item-preview"
                            ><i class="el-icon-zoom-in"></i
                          ></span>
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </b-col>
            </b-row>
          </b-form-group>
        </b-form-group>
      </b-form-group>
    </template>
    <div v-else class="no-results">
      Không có Issue nào
    </div>
    <b-modal v-model="previewModal" hide-header hide-footer size="lg"
      ><img :src="previewImageUrl" :alt="previewImageUrl" width="100%"
    /></b-modal>
  </div>
</template>

<script>
import { notifyAddSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'

export default {
  name: 'ActivityIssueTab',
  props: {
    issueCriterionGroups: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      previewModal: false,
      previewImageUrl: '',
      loadingFixed: [],
      completeFixed: []
    }
  },
  methods: {
    previewMedia(image) {
      this.previewImageUrl = image
      this.previewModal = true
    },
    async fixIssue(issue) {
      try {
        this.loadingFixed.push(
          `${issue.reviewer_activity_criterion_id}.${issue._id}`
        )
        await this.$axios.$post('/activity/fix-issue', {
          reviewer_activity_criterion_id: issue.reviewer_activity_criterion_id,
          criterion_id: issue._id
        })
        this.loadingFixed = this.loadingFixed.filter(
          (item) =>
            item !== `${issue.reviewer_activity_criterion_id}.${issue._id}`
        )
        notifyAddSuccess('Fix issue thành công')
        this.completeFixed.push(
          `${issue.reviewer_activity_criterion_id}.${issue._id}`
        )
        issue.fixed = true
        this.$emit('has-fixed')
      } catch (e) {
        notifyTryAgain()
      }
    },
    checkLoading(issue) {
      return this.loadingFixed.includes(
        `${issue.reviewer_activity_criterion_id}.${issue._id}`
      )
    },
    checkCompleted(issue) {
      return (
        issue.fixed ||
        this.completeFixed.includes(
          `${issue.reviewer_activity_criterion_id}.${issue._id}`
        )
      )
    }
  }
}
</script>
