<template>
  <the-portlet :full-height="true" :title="title">
    <template v-slot:tool>
      <b-link v-if="showIssue" @click="showIssueModal" class="mr-5">
        Danh sách issue
      </b-link>
      <b-button
        :disabled="isSaveing"
        @click="saveScript"
        size="sm"
        variant="primary"
      >
        <b-spinner v-show="isSaveing" small></b-spinner>
        Lưu lại
      </b-button>
    </template>
    <div v-if="scriptList.length === 0" class="mb-3">
      Chưa có hành động nào, vui lòng kéo hành động ở bên trái để tạo hành động
      mới!
    </div>
    <div class="script-wrap">
      <draggable
        :list="scriptList"
        v-bind="dragOptions"
        @start="isDragging = true"
        @end="isDragging = false"
        @change="log"
        :class="{ 'has-items': scriptList.length === 0 }"
        class="dragArea list-group kt-widget kt-widget--users list-script"
      >
        <transition-group type="transition" name="flip-list">
          <div
            v-for="(element, index) in scriptList"
            :key="element.id"
            :class="{ 'not-done': !calculateState(element) }"
            class="list-group-item activity-item"
          >
            <div class="kt-widget__item">
              <span @click="showScript(element)" class="kt-media">
                <img :src="getIconActivity(element)" alt="image" />
              </span>
              <div
                @click="showScript(element)"
                :data-preview-image="getPreviewActivity(element)"
                class="kt-widget__info"
              >
                <div class="kt-widget__section">
                  <a href="javascript:;" class="kt-widget__username">
                    {{ getActivityName(element) }}
                  </a>
                </div>
                <span class="kt-widget__desc">
                  {{ getActivityContent(element) }}
                </span>
              </div>

              <div class="kt-widget__action d-flex flex-column">
                <a
                  @click="duplicateScript(element, index)"
                  href="javascript:;"
                  class="text-success"
                  >Nhân bản</a
                >
                <a
                  @click="removeScript(element, index)"
                  href="javascript:;"
                  class="text-danger"
                  >Xóa</a
                >
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>

    <sentence-modal ref="sentenceModal" v-on:updateScript="updateScript" />
    <conversation-modal
      ref="conversationModal"
      v-on:updateScript="updateScript"
    />
    <single-choice-inline-modal
      ref="singleChoiceInlineModal"
      v-on:updateScript="updateScript"
    />
    <multi-choice-inline-modal
      ref="multiChoiceInlineModal"
      v-on:updateScript="updateScript"
    />
    <a-q-with-given-words-modal
      ref="aQWithGivenQordsModal"
      v-on:updateScript="updateScript"
    />
    <answer-question-writing-modal
      ref="answerQuestionWritingModal"
      v-on:updateScript="updateScript"
    />
    <answer-question-picture-modal
      ref="answerQuestionPictureModal"
      v-on:updateScript="updateScript"
    />
    <listen-and-speak-word-modal
      ref="listenAndSpeakWordModal"
      v-on:updateScript="updateScript"
    />
    <listen-and-speak-sentence-modal
      ref="listenAndSpeakSentenceModal"
      v-on:updateScript="updateScript"
    />
    <listen-and-answer-modal
      ref="listenAndAnswerModal"
      v-on:updateScript="updateScript"
    />
    <flashcard-modal ref="flashcardModal" v-on:updateScript="updateScript" />
    <learn-word-flashcard-modal
      ref="learnWordFlashcardModal"
      v-on:updateScript="updateScript"
    />
    <flashcard-new-modal
      ref="flashcardNewModal"
      v-on:updateScript="updateScript"
    />
    <l-a-q-with-order-modal
      ref="listenAnswerQuestionWithOrder"
      v-on:updateScript="updateScript"
    />
    <listen-fill-in-blank-writing-modal
      ref="listenFillInBlankWritingModal"
      v-on:updateScript="updateScript"
    />
    <listen-single-choice-modal
      ref="listenSingleChoiceModal"
      v-on:updateScript="updateScript"
    />
    <listen-multi-choice-modal
      ref="listenMultiChoiceModal"
      v-on:updateScript="updateScript"
    />
    <f-i-b-with-given-word-modal
      ref="fIBWithGivenWordModal"
      v-on:updateScript="updateScript"
    />
    <f-i-b-multi-part-modal
      ref="fIBMultiPartModal"
      v-on:updateScript="updateScript"
    />
    <f-i-b-paragraph-with-given-words-modal
      ref="fIBParagraphWithGivenWordsModal"
      v-on:updateScript="updateScript"
    />
    <f-i-b-paragraph-writing-modal
      ref="fIBParagraphWritingModal"
      v-on:updateScript="updateScript"
    />
    <match-expression-with-picture-modal
      ref="matchExpressionWithPictureModal"
      v-on:updateScript="updateScript"
    />
    <common-answer-all-questions-modal
      ref="commonAnswerAllQuestionsModal"
      v-on:updateScript="updateScript"
    />
    <f-i-b-sentence-with-given-word-modal
      ref="fIBSentenceWithGivenWordModal"
      v-on:updateScript="updateScript"
    />
    <f-i-b-paragraph-choose-correct-words-modal
      ref="fIBSentenceChoseCorrectWordsModal"
      v-on:updateScript="updateScript"
    />
    <speaking-roleplay-modal
      ref="speakingRoleplayModal"
      v-on:updateScript="updateScript"
    />
    <speaking-roleplay-modal
      ref="speakingRoleplayVipModal"
      v-on:updateScript="updateScript"
      title="Speaking roleplay VIP"
    />
    <water-up-modal ref="waterUpModal" v-on:updateScript="updateScript" />
    <water-up-new-modal
      ref="waterUpNewModal"
      v-on:updateScript="updateScript"
    />
    <vocabulary-picture-scatter-modal
      ref="vocabularyPictureScatterModal"
      v-on:updateScript="updateScript"
    />
    <vocabulary-word-meditation-modal
      ref="vocabularyWordMeditationModal"
      v-on:updateScript="updateScript"
    />
    <vocabulary-match-words-with-definitions-modal
      ref="vocabularyMatchWordsWithDefinitionsModal"
      v-on:updateScript="updateScript"
    />
    <reading-answer-questions-modal
      ref="readingAnswerQuestionsModal"
      v-on:updateScript="updateScript"
    />
    <common-matching-modal
      ref="commonMatchingModal"
      v-on:updateScript="updateScript"
    />
    <reading-matching-modal
      ref="readingMatchingModal"
      v-on:updateScript="updateScript"
    />
    <pronounciation-syllable-highlight-modal
      ref="pronounciationSyllableHighlightModal"
      v-on:updateScript="updateScript"
    />
    <video-speaking-answer-modal
      ref="videoSpeakingAnswerModal"
      v-on:updateScript="updateScript"
    />
    <audio-speaking-answer-modal
      ref="audioSpeakingAnswerModal"
      v-on:updateScript="updateScript"
    />
    <listen-choose-correct-pictures-modal
      ref="listenChooseCorrectPicturesModal"
      v-on:updateScript="updateScript"
    />
    <f-i-b-multi-questions-modal
      ref="fIBMultiQuestionsModal"
      v-on:updateScript="updateScript"
    />
    <c-h-o-strikethrough-sentence-modal
      ref="cHOStrikethroughSentenceModal"
      v-on:updateScript="updateScript"
    />
    <c-h-o-strikethrough-paragraph-modal
      ref="cHOStrikethroughParagraphModal"
      v-on:updateScript="updateScript"
    />
    <speaking-coach-intro-modal
      ref="speakingCoachIntroModal"
      v-on:updateScript="updateScript"
    />
    <speaking-coach-sentence-modal
      ref="speakingCoachSentenceModal"
      v-on:updateScript="updateScript"
    />
    <speaking-coach-word-modal
      ref="speakingCoachWordModal"
      v-on:updateScript="updateScript"
    />
    <listen-and-check-modal
      ref="listenAndCheckModal"
      v-on:updateScript="updateScript"
    />
    <find-the-words-modal
      ref="findTheWordsModal"
      v-on:updateScript="updateScript"
    />
    <read-and-check-modal
      ref="readAndCheckModal"
      v-on:updateScript="updateScript"
    />
    <listen-and-tick-or-cross-modal
      ref="listenAndTickOrCrossModal"
      v-on:updateScript="updateScript"
    />
    <look-and-trace-modal
      ref="lookAndTraceModal"
      v-on:updateScript="updateScript"
    />
    <listen-and-point-modal
      ref="listenAndPointModal"
      v-on:updateScript="updateScript"
    />
    <point-and-say-modal
      ref="pointAndSayModal"
      v-on:updateScript="updateScript"
    />
    <lets-talk-modal ref="letsTalkModal" v-on:updateScript="updateScript" />
    <listen-and-repeat2-modal
      ref="listenAndRepeatModal"
      v-on:updateScript="updateScript"
    />
    <choose-answer-for-image-modal
      ref="chooseAnswerForImageModal"
      v-on:updateScript="updateScript"
    />
    <write-something-modal
      ref="writeSomethingModal"
      v-on:updateScript="updateScript"
    />
    <listen-and-write-modal
      ref="listenAndWriteModal"
      v-on:updateScript="updateScript"
    />
    <look-and-write-modal
      ref="lookAndWriteModal"
      v-on:updateScript="updateScript"
    />

    <read-and-complete-modal
      ref="readAndCompleteModal"
      v-on:updateScript="updateScript"
    />

    <look-and-repeat-letter-word-sentence-modal
      ref="lookAndRepeatLetterWordSentenceModal"
      v-on:updateScript="updateScript"
    />

    <listen-and-number-modal
      ref="listenAndNumberModal"
      v-on:updateScript="updateScript"
    />

    <let-talk-conversation-modal
      ref="letTalkConversationModal"
      v-on:updateScript="updateScript"
    />

    <listen-and-chant-modal
      ref="listenAndChantModal"
      v-on:updateScript="updateScript"
    />

    <lets-sing-modal ref="letsSingModal" v-on:updateScript="updateScript" />

    <look-listen-repeat-sentence-modal
      ref="lookListenRepeatSentenceModal"
      v-on:updateScript="updateScript"
    />

    <read-and-match-text-modal
      ref="readAndMatchTextModal"
      v-on:updateScript="updateScript"
    />

    <let-talk-with-situation-modal
      ref="letTalkWithSituationModal"
      v-on:updateScript="updateScript"
    />

    <speaking-stress-word-inline-modal
      ref="speakingStressWordInlineModal"
      v-on:updateScript="updateScript"
    />

    <speaking-stress-sentence-inline-modal
      ref="speakingStressSentenceInlineModal"
      v-on:updateScript="updateScript"
    />

    <speaking-intonation-inline-modal
      ref="speakingIntonationInlineModal"
      v-on:updateScript="updateScript"
    />

    <speaking-linking-sound-inline-modal
      ref="speakingLinkingSoundInlineModal"
      v-on:updateScript="updateScript"
    />

    <point-and-say-bubble-modal
      ref="pointAndSayBubbleModal"
      v-on:updateScript="updateScript"
    />

    <look-listen-and-number-modal
      ref="lookListenAndNumberModal"
      v-on:updateScript="updateScript"
    />
  </the-portlet>
</template>

<script>
import draggable from 'vuedraggable'
import randomstring from 'randomstring'
import cloneDeep from 'lodash/cloneDeep'
import truncate from 'lodash/truncate'
import jQuery from 'jquery'
import ThePortlet from '~/components/base/ThePortlet'

import SentenceModal from '~/components/elements/script/SentenceModal'
import SingleChoiceInlineModal from '~/components/elements/script/SingleChoiceInlineModal'
import MultiChoiceInlineModal from '~/components/elements/script/MultiChoiceInlineModal'
import ConversationModal from '~/components/elements/script/ConversationModal'
import AQWithGivenWordsModal from '~/components/elements/script/AQWithGivenWordsModal'
import AnswerQuestionWritingModal from '~/components/elements/script/AnswerQuestionWritingModal'
import AnswerQuestionPictureModal from '~/components/elements/script/AnswerQuestionPictureModal'
import ListenAndSpeakWordModal from '~/components/elements/script/ListenAndSpeakWordModal'
import ListenAndSpeakSentenceModal from '~/components/elements/script/ListenAndSpeakSentenceModal'
import ListenAndAnswerModal from '~/components/elements/script/ListenAndAnswerModal'
import FlashcardModal from '~/components/elements/script/FlashcardModal'
import LearnWordFlashcardModal from '~/components/elements/script/LearnWordFlashcardModal'
import FlashcardNewModal from '~/components/elements/script/FlashcardNewModal'
import LAQWithOrderModal from '~/components/elements/script/LAQWithOrderModal'
import ListenFillInBlankWritingModal from '~/components/elements/script/ListenFillInBlankWritingModal'
import ListenSingleChoiceModal from '~/components/elements/script/ListenSingleChoiceModal'
import ListenMultiChoiceModal from '~/components/elements/script/ListenMultiChoiceModal'
import FIBMultiPartModal from '~/components/elements/script/FIBMultiPartModal'
import FIBWithGivenWordModal from '~/components/elements/script/FIBWithGivenWordModal'
import FIBSentenceWithGivenWordModal from '~/components/elements/script/FIBSentenceWithGivenWordModal'
import FIBParagraphChooseCorrectWordsModal from '~/components/elements/script/FIBParagraphChooseCorrectWordsModal'
import FIBParagraphWithGivenWordsModal from '~/components/elements/script/FIBParagraphWithGivenWordsModal'
import FIBParagraphWritingModal from '~/components/elements/script/FIBParagraphWritingModal'
import SpeakingRoleplayModal from '~/components/elements/script/SpeakingRoleplayModal'
import WaterUpModal from '~/components/elements/script/WaterUpModal'
import WaterUpNewModal from '~/components/elements/script/WaterUpNewModal'
import VocabularyPictureScatterModal from '~/components/elements/script/VocabularyPictureScatterModal'
import VocabularyWordMeditationModal from '~/components/elements/script/VocabularyWordMeditationModal'
import VocabularyMatchWordsWithDefinitionsModal from '~/components/elements/script/VocabularyMatchWordsWithDefinitionsModal'
import ReadingAnswerQuestionsModal from '~/components/elements/script/ReadingAnswerQuestionsModal'
import CommonMatchingModal from '~/components/elements/script/CommonMatchingModal'
import ReadingMatchingModal from '~/components/elements/script/ReadingMatchingModal'
import PronounciationSyllableHighlightModal from '~/components/elements/script/PronounciationSyllableHighlightModal'
import MatchExpressionWithPictureModal from '~/components/elements/script/MatchExpressionWithPictureModal'
import CommonAnswerAllQuestionsModal from '~/components/elements/script/CommonAnswerAllQuestionsModal'
import VideoSpeakingAnswerModal from '~/components/elements/script/VideoSpeakingAnswerModal'
import ListenChooseCorrectPicturesModal from '~/components/elements/script/ListenChooseCorrectPicturesModal'
import FIBMultiQuestionsModal from '~/components/elements/script/FIBMultiQuestionsModal'
import CHOStrikethroughSentenceModal from '~/components/elements/script/CHOStrikethroughSentenceModal'
import CHOStrikethroughParagraphModal from '~/components/elements/script/CHOStrikethroughParagraphModal'
import SpeakingCoachIntroModal from '~/components/elements/script/SpeakingCoachIntroModal'
import SpeakingCoachWordModal from '~/components/elements/script/SpeakingCoachWordModal'
import SpeakingCoachSentenceModal from '~/components/elements/script/SpeakingCoachSentenceModal'
import { notifyUpdateSuccess, notifyTryAgain } from '~/utils/bootstrap-notify'
import AudioSpeakingAnswerModal from '~/components/elements/script/AudioSpeakingAnswerModal'
import ListenAndCheckModal from '~/components/elements/script/partial/primarySchool/ListenAndCheckModal'
import LookAndTraceModal from '~/components/elements/script/partial/primarySchool/LookAndTraceModal'
import ListenAndPointModal from '~/components/elements/script/partial/primarySchool/ListenAndPointModal'
import LetsTalkModal from '~/components/elements/script/partial/primarySchool/LetsTalkModal'
import ChooseAnswerForImageModal from '~/components/elements/script/partial/primarySchool/ChooseAnswerForImageModal'
import WriteSomethingModal from '~/components/elements/script/partial/primarySchool/WriteSomethingModal'
import PointAndSayModal from '~/components/elements/script/partial/primarySchool/PointAndSayModal'
import ListenAndWriteModal from '~/components/elements/script/partial/primarySchool/ListenAndWriteModal'
import LookAndWriteModal from '~/components/elements/script/partial/primarySchool/LookAndWriteModal'
import ReadAndCompleteModal from '~/components/elements/script/partial/primarySchool/ReadAndCompleteModal'
import LookAndRepeatLetterWordSentenceModal from '~/components/elements/script/partial/primarySchool/LookAndRepeatLetterWordSentenceModal'
import ListenAndNumberModal from '~/components/elements/script/partial/primarySchool/ListenAndNumberModal'
import LetTalkConversationModal from '~/components/elements/script/partial/primarySchool/LetTalkConversationModal'
import ListenAndChantModal from '~/components/elements/script/partial/primarySchool/ListenAndChantModal'
import LetsSingModal from '~/components/elements/script/partial/primarySchool/LetsSingModal'
import LookListenRepeatSentenceModal from '~/components/elements/script/partial/primarySchool/LookListenRepeatSentenceModal'
import ReadAndMatchTextModal from '~/components/elements/script/partial/primarySchool/ReadAndMatchTextModal'
import LetTalkWithSituationModal from '~/components/elements/script/partial/primarySchool/LetTalkWithSituationModal'
import ListenAndRepeat2Modal from '~/components/elements/script/partial/primarySchool/ListenAndRepeat2Modal'
import SpeakingStressWordInlineModal from '~/components/elements/script/SpeakingStressWordInlineModal'
import SpeakingStressSentenceInlineModal from '~/components/elements/script/SpeakingStressSentenceInlineModal'
import SpeakingIntonationInlineModal from '~/components/elements/script/SpeakingIntonationInlineModal'
import SpeakingLinkingSoundInlineModal from '~/components/elements/script/SpeakingLinkingSoundInlineModal'
import ReadAndCheckModal from '~/components/elements/script/partial/primarySchool/ReadAndCheckModal'
import ListenAndTickOrCrossModal from '~/components/elements/script/partial/primarySchool/ListenAndTickOrCrossModal'
import FindTheWordsModal from '~/components/elements/script/partial/primarySchool/FindTheWordsModal'
import PointAndSayBubbleModal from '~/components/elements/script/partial/primarySchool/PointAndSayBubbleModal'
import LookListenAndNumberModal from '~/components/elements/script/partial/primarySchool/LookListenAndNumberModal'

export default {
  name: 'ScriptList',
  components: {
    LookListenAndNumberModal,
    PointAndSayBubbleModal,
    FindTheWordsModal,
    ListenAndTickOrCrossModal,
    ReadAndCheckModal,
    SpeakingLinkingSoundInlineModal,
    SpeakingIntonationInlineModal,
    SpeakingStressSentenceInlineModal,
    SpeakingStressWordInlineModal,
    ListenAndChantModal,
    WriteSomethingModal,
    ChooseAnswerForImageModal,
    LetsTalkModal,
    ListenAndPointModal,
    LookAndTraceModal,
    ListenAndCheckModal,
    AudioSpeakingAnswerModal,
    CHOStrikethroughParagraphModal,
    ReadingMatchingModal,
    FIBParagraphWithGivenWordsModal,
    FIBParagraphWritingModal,
    ListenAndSpeakSentenceModal,
    FIBWithGivenWordModal,
    ListenFillInBlankWritingModal,
    ConversationModal,
    SingleChoiceInlineModal,
    MultiChoiceInlineModal,
    AQWithGivenWordsModal,
    AnswerQuestionWritingModal,
    AnswerQuestionPictureModal,
    ListenAndSpeakWordModal,
    ListenAndAnswerModal,
    SentenceModal,
    FlashcardModal,
    LearnWordFlashcardModal,
    FlashcardNewModal,
    LAQWithOrderModal,
    ListenSingleChoiceModal,
    ListenMultiChoiceModal,
    FIBMultiPartModal,
    MatchExpressionWithPictureModal,
    CommonAnswerAllQuestionsModal,
    FIBSentenceWithGivenWordModal,
    FIBParagraphChooseCorrectWordsModal,
    SpeakingRoleplayModal,
    WaterUpModal,
    WaterUpNewModal,
    VocabularyPictureScatterModal,
    VocabularyWordMeditationModal,
    VocabularyMatchWordsWithDefinitionsModal,
    ReadingAnswerQuestionsModal,
    CommonMatchingModal,
    VideoSpeakingAnswerModal,
    PronounciationSyllableHighlightModal,
    ListenChooseCorrectPicturesModal,
    FIBMultiQuestionsModal,
    CHOStrikethroughSentenceModal,
    SpeakingCoachIntroModal,
    SpeakingCoachWordModal,
    SpeakingCoachSentenceModal,
    ThePortlet,
    draggable,
    PointAndSayModal,
    ListenAndWriteModal,
    LookAndWriteModal,
    ReadAndCompleteModal,
    LookAndRepeatLetterWordSentenceModal,
    ListenAndNumberModal,
    LetTalkConversationModal,
    LetsSingModal,
    LookListenRepeatSentenceModal,
    ReadAndMatchTextModal,
    LetTalkWithSituationModal,
    ListenAndRepeat2Modal
  },
  props: {
    id: {
      type: String,
      required: true,
      default: ''
    },
    script: {
      type: Array,
      required: true,
      default: () => []
    },
    url: {
      type: String,
      default: 'activity/set-script'
    },
    title: {
      type: String,
      default: 'Kịch bản'
    },
    showIssue: {
      type: Boolean,
      default: false
    },
    activityList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isDragging: false,
      isSaveing: false,
      dragOptions: {
        animation: 0,
        group: 'activity',
        ghostClass: 'ghost'
      },
      scriptList: []
    }
  },
  watch: {
    script(newVal) {
      this.scriptList = newVal
    }
  },
  mounted() {
    this.preview()
  },
  methods: {
    getActivityName(element) {
      const icon = this.activityList.find((x) => x.type === element.type)
      if (icon) {
        return icon.name
      } else {
        return element.name
      }
    },
    getActivityContent(element) {
      let content = ''
      const icon = this.activityList.find((x) => x.type === element.type)
      if (icon) {
        content = icon.name
      } else {
        content = element.name
      }
      return truncate(content, {
        length: 60,
        separator: ' '
      })
    },
    getIconActivity(element) {
      const icon = this.activityList.find((x) => x.type === element.type)
      if (icon) {
        return icon.icon
      } else {
        return element.icon
      }
    },
    getPreviewActivity(element) {
      const icon = this.activityList.find((x) => x.type === element.type)
      if (icon) {
        return icon.preview
      } else {
        return element.preview
      }
    },
    log(evt) {
      if (evt.added) {
        this.showScript(evt.added.element)
      }
      if (evt.removed) {
      }
      if (evt.moved) {
      }
    },
    showScript(script) {
      const { type } = script

      switch (type) {
        case 'sentence':
          this.$refs.sentenceModal.show(script)
          break
        case 'single_choice_inline':
          this.$refs.singleChoiceInlineModal.show(script)
          break
        case 'multi_choice_inline':
          this.$refs.multiChoiceInlineModal.show(script)
          break
        case 'answer_question_with_given_words':
          this.$refs.aQWithGivenQordsModal.show(script)
          break
        case 'answer_question_writing':
          this.$refs.answerQuestionWritingModal.show(script)
          break
        case 'answer_question_picture':
          this.$refs.answerQuestionPictureModal.show(script)
          break
        case 'listen_and_speak_word':
          this.$refs.listenAndSpeakWordModal.show(script)
          break
        case 'listen_and_speak_sentence':
          this.$refs.listenAndSpeakSentenceModal.show(script)
          break
        case 'listen_and_speak_word_full':
          this.$refs.listenAndSpeakWordModal.show(script)
          break
        case 'listen_and_speak_sentence_full':
          this.$refs.listenAndSpeakSentenceModal.show(script)
          break
        case 'listen_and_answer':
          this.$refs.listenAndAnswerModal.show(script)
          break
        case 'flashcard':
          this.$refs.flashcardModal.show(script)
          break
        case 'learn_word_by_flashcard':
          this.$refs.learnWordFlashcardModal.show(script)
          break
        case 'flashcard_new':
          this.$refs.flashcardNewModal.show(script)
          break
        case 'listen_answer_question_with_order':
          this.$refs.listenAnswerQuestionWithOrder.show(script)
          break
        case 'fill_in_blank_writing':
          this.$refs.listenFillInBlankWritingModal.show(script)
          break
        case 'listen_single_choice':
          this.$refs.listenSingleChoiceModal.show(script)
          break
        case 'listen_multi_choice':
          this.$refs.listenMultiChoiceModal.show(script)
          break
        case 'fill_in_blank_with_given_words':
          this.$refs.fIBWithGivenWordModal.show(script)
          break
        case 'fill_in_blank_multi_part':
          this.$refs.fIBMultiPartModal.show(script)
          break
        case 'fill_in_blank_paragraph_with_given_words':
          this.$refs.fIBParagraphWithGivenWordsModal.show(script)
          break
        case 'fill_in_blank_paragraph_writing':
          this.$refs.fIBParagraphWritingModal.show(script)
          break
        case 'match_expression_with_picture':
          this.$refs.matchExpressionWithPictureModal.show(script)
          break
        case 'common_answer_all_questions':
          this.$refs.commonAnswerAllQuestionsModal.show(script)
          break
        case 'fill_in_blank_sentence_with_given_word':
          this.$refs.fIBSentenceWithGivenWordModal.show(script)
          break
        case 'fill_in_blank_paragraph_choose_correct_words':
          this.$refs.fIBSentenceChoseCorrectWordsModal.show(script)
          break
        case 'conversation':
          this.$refs.conversationModal.show(script)
          break
        case 'speaking_roleplay':
          this.$refs.speakingRoleplayModal.show(script)
          break
        case 'speaking_roleplay_vip':
          this.$refs.speakingRoleplayVipModal.show(script)
          break
        case 'water_up':
          this.$refs.waterUpModal.show(script)
          break
        case 'water_up_new':
          this.$refs.waterUpNewModal.show(script)
          break
        case 'vocabulary_picture_scatter':
          this.$refs.vocabularyPictureScatterModal.show(script)
          break
        case 'vocabulary_word_meditation':
          this.$refs.vocabularyWordMeditationModal.show(script)
          break
        case 'vocabulary_match_words_with_definitions':
          this.$refs.vocabularyMatchWordsWithDefinitionsModal.show(script)
          break
        case 'reading_answer_questions':
          this.$refs.readingAnswerQuestionsModal.show(script)
          break
        case 'common_matching':
          this.$refs.commonMatchingModal.show(script)
          break
        case 'reading_matching':
          this.$refs.readingMatchingModal.show(script)
          break
        case 'pronounciation_syllable_highlight':
          this.$refs.pronounciationSyllableHighlightModal.show(script)
          break
        case 'video_speaking_answer':
          this.$refs.videoSpeakingAnswerModal.show(script)
          break
        case 'audio_speaking_answer':
          this.$refs.audioSpeakingAnswerModal.show(script)
          break
        case 'listen_choose_correct_pictures':
          this.$refs.listenChooseCorrectPicturesModal.show(script)
          break
        case 'fill_in_blank_multi_questions':
          this.$refs.fIBMultiQuestionsModal.show(script)
          break
        case 'common_highlight_or_strikethrough_sentence':
          this.$refs.cHOStrikethroughSentenceModal.show(script)
          break
        case 'common_highlight_or_strikethrough_paragraph':
          this.$refs.cHOStrikethroughParagraphModal.show(script)
          break
        case 'speaking_coach_introduction':
          this.$refs.speakingCoachIntroModal.show(script)
          break
        case 'speaking_coach_word':
          this.$refs.speakingCoachWordModal.show(script)
          break
        case 'speaking_coach_sentence':
          this.$refs.speakingCoachSentenceModal.show(script)
          break
        case 'listen_and_check':
          this.$refs.listenAndCheckModal.show(script)
          break
        case 'read_and_tick':
          this.$refs.readAndCheckModal.show(script)
          break
        case 'find_the_words':
          this.$refs.findTheWordsModal.show(script)
          break
        case 'listen_and_tick_or_cross':
          this.$refs.listenAndTickOrCrossModal.show(script)
          break
        case 'look_and_trace':
          this.$refs.lookAndTraceModal.show(script)
          break
        case 'listen_and_point':
          this.$refs.listenAndPointModal.show(script)
          break
        case 'point_and_say':
          this.$refs.pointAndSayModal.show(script)
          break
        case 'lets_talk':
          this.$refs.letsTalkModal.show(script)
          break
        case 'listen_and_repeat':
          this.$refs.listenAndRepeatModal.show(script)
          break
        case 'choose_answer_for_image':
          this.$refs.chooseAnswerForImageModal.show(script)
          break
        case 'write_something':
          this.$refs.writeSomethingModal.show(script)
          break
        case 'listen_and_write':
          this.$refs.listenAndWriteModal.show(script)
          break
        case 'look_and_write':
          this.$refs.lookAndWriteModal.show(script)
          break
        case 'read_and_complete':
          this.$refs.readAndCompleteModal.show(script)
          break
        case 'look_and_repeat_letter_word_sentence':
          this.$refs.lookAndRepeatLetterWordSentenceModal.show(script)
          break
        case 'listen_and_number':
          this.$refs.listenAndNumberModal.show(script)
          break
        case 'let_talk_conversation':
          this.$refs.letTalkConversationModal.show(script)
          break
        case 'listen_and_chant':
          this.$refs.listenAndChantModal.show(script)
          break
        case 'lets_sing':
          this.$refs.letsSingModal.show(script)
          break
        case 'look_listen_and_repeat_sentence':
          this.$refs.lookListenRepeatSentenceModal.show(script)
          break
        case 'read_and_match_text':
          this.$refs.readAndMatchTextModal.show(script)
          break
        case 'lets_talk_with_situation':
          this.$refs.letTalkWithSituationModal.show(script)
          break
        case 'speaking_stress_word_inline':
          this.$refs.speakingStressWordInlineModal.show(script)
          break
        case 'speaking_stress_sentence_inline':
          this.$refs.speakingStressSentenceInlineModal.show(script)
          break
        case 'speaking_intonation_inline':
          this.$refs.speakingIntonationInlineModal.show(script)
          break
        case 'speaking_linking_sound_inline':
          this.$refs.speakingLinkingSoundInlineModal.show(script)
          break
        case 'point_and_say_bubble':
          this.$refs.pointAndSayBubbleModal.show(script)
          break
        case 'look_listen_and_number':
          this.$refs.lookListenAndNumberModal.show(script)
          break
      }
    },
    removeScript(script, index) {
      this.scriptList.splice(index, 1)
    },
    addScript(script) {
      const cloneScript = cloneDeep(script)
      cloneScript.id = script.type + '_' + randomstring.generate()
      this.scriptList.push(cloneScript)
    },
    duplicateScript(script, index) {
      const cloneScript = cloneDeep(script)
      cloneScript.id = script.type + '_' + randomstring.generate()

      this.scriptList.splice(index + 1, 0, cloneScript)
    },
    calculateState(script) {
      switch (script.type) {
        case 'sentence':
          return !!script.content
      }

      return false
    },
    updateScript(script) {
      const index = this.scriptList.findIndex((item) => item.id === script.id)

      if (index !== -1) {
        this.$set(this.scriptList, index, script)
      }
    },
    async saveScript() {
      this.isSaveing = true
      try {
        const { data } = await this.$axios.post(
          `${this.$axios.defaults.baseURL}/${this.url}`,
          {
            _id: this.id,
            script: this.scriptList
          }
        )

        this.scriptList = data.script
        notifyUpdateSuccess('Script')
      } catch (e) {
        console.log(e)
        notifyTryAgain()
      }
      this.isSaveing = false
    },
    showIssueModal() {
      this.$emit('show-issue')
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

<style lang="scss">
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-script {
  min-height: 65px;

  &.has-items {
    border: 1px dashed #ccc;
  }

  .activity-item {
    &.not-done {
      background-color: #fbf4f4;
    }
  }
}
</style>
