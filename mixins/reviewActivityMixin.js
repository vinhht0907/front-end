export default {
  async asyncData({ params, app, error }) {
    try {
      const { data } = await app.$axios.post('/activity/list-criterions')
      return { criterionGroups: data }
    } catch (e) {
      error({ statusCode: 404, message: 'Post not found' })
    }
  },
  methods: {
    renderIssues(data) {
      const groups = []
      this.criterionGroups.forEach((criterionGroup) => {
        let numberTrue = 0
        let total = 0
        const reviewers = []
        criterionGroup.criterions.forEach((criterion) => {
          data.forEach((review) => {
            const criterionItem = review.criterions.find(
              (val) => val._id === criterion._id
            )
            if (criterionItem) {
              if (criterionItem.score === 1 || criterionItem.fixed) {
                numberTrue += 1
              }
              if (!reviewers.includes(review.reviewer_id._id))
                reviewers.push(review.reviewer_id._id)
            }
          })
          total += 1
        })

        const numberReview = reviewers.length
        numberTrue = numberReview ? numberTrue / numberReview : 0
        numberTrue = Math.round((numberTrue + Number.EPSILON) * 100) / 100
        groups.push({
          name: criterionGroup.name,
          number_true: numberTrue,
          number_review: numberReview,
          total
        })
      })
      return groups
        .map(
          (group) =>
            `<b>${group.number_review} <i class="la la-user bold"></i></b> | </span><span>${group.name}</span>: <span class="text-danger">${group.number_true} / ${group.total}</span>`
        )
        .join('</br>')
    },
    renderImageAndNotification(data, type, row) {
      const numberIssue = row.review_criterions.reduce(
        (accumulator, reviewCriterion) => {
          const numIssueItem = reviewCriterion.criterions.reduce(
            (accumulatorItem, reviewCriterion) => {
              if (reviewCriterion.score === 0 && !reviewCriterion.fixed) {
                return accumulatorItem + 1
              }
              return accumulatorItem
            },
            0
          )
          return accumulator + numIssueItem
        },
        0
      )
      return `<div class="badge-table-wrap">
<img src="${data}" width="70" height="70" />
${
  numberIssue > 0
    ? `<span class="badge badge-pill badge-danger" title="số issue">${numberIssue}</span>`
    : ''
}
</div>`
    }
  }
}
