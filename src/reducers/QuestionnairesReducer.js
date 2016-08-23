import * as Types from '../constants/QuestionnairesActionTypes'
import * as Status from '../constants/QuestionnairesStatus'
import { handleActions } from 'redux-actions'
import { cloneObject } from '../scripts/util'

var signal = 0
const list = localStorage.list ? JSON.parse(localStorage.list) : []
const initialEditing = {
  id: -1,
  question: -1,
  title: '点击编辑标题',
  questions: [],
  status: Status.UN_RELEASE,
  deadline: '',
  data: []
}
const initialState = {
  list,
  editing: cloneObject(initialEditing)
}

const questionnaires = handleActions({
  [Types.ADD_QUESTIONNAIRE](state, action) {
    const { list } = state
    return Object.assign({}, state, { editing: { ...cloneObject(initialEditing), id: list.length } })
  },
  [Types.REMOVE_QUESTIONNAIRE](state, action) {
    const { list } = state
    const questionnaire = action.payload
    list.splice(questionnaire, 1)
    localStorage.list = JSON.stringify(list);
    return Object.assign({}, state, { list })
  },
  [Types.EDIT_QUESTIONNAIRE](state, action) {
    const { list } = state
    const questionnaire = action.payload
    const { title, deadline } = list[questionnaire]
    const questions = cloneObject(list[questionnaire].questions)
    const editing = { ...cloneObject(initialEditing), id: questionnaire, title, deadline, questions}
    return Object.assign({}, state, { editing })
  },
  [Types.ADD_QUESTION](state, action) {
    const { editing } = state
    const type = action.payload
    let question
    switch(type) {
      case 'SC': question = { type: 'SC', content: '单选题 － 点击编辑题目', options: ['选项一', '选项二'] }; break;
      case 'MC': question = { type: 'MC', content: '多选题 － 点击编辑题目', options: ['选项一', '选项二', '选项三', '选项四'] }; break;
      case 'TX': question = { type: 'TX', content: '文本题 － 点击编辑题目', isRequiered: false }; break;
      default: question = {}
    }
    editing.questions.push(question)
    return Object.assign({}, state, { editing })
  },
  [Types.REMOVE_QUESTION](state, action) {
    const { editing } = state
    const question = action.payload
    editing.questions.splice(question , 1)
    return Object.assign({}, state, { editing })
  },
  [Types.REUSE_QUESTION](state, action) {
    const { editing } = state
    const question = action.payload
    let copy = Object.assign({}, editing.questions[question])
    if(copy.type !== 'TX')
      copy.options = copy.options.slice(0)
    editing.questions.splice(question + 1, 0, copy)
    return Object.assign({}, state, { editing })
  },
  [Types.SHIFT_QUESTION](state, action) {
    const { editing } = state
    const { question, direction } = action.payload
    editing.questions.splice(question + direction, 0, editing.questions.splice(question, 1)[0])
    return Object.assign({}, state, { editing })
  },
  [Types.TOGGLE_REQUIREMENT](state, action) {
    const { editing } = state
    const question = action.payload
    editing.questions[question].isRequiered = !editing.questions[question].isRequiered
    return Object.assign({}, state, { editing })
  },
  [Types.ADD_OPTION](state, action) {
    const { editing } = state
    const question = action.payload
    editing.questions[question].options.push(`选项${editing.questions[question].options.length + 1}`)
    return Object.assign({}, state, { editing })
  },
  [Types.REMOVE_OPTION](state, action) {
    const { editing } = state
    const { question, option } = action.payload
    editing.questions[question].options.splice(option, 1)
    return Object.assign({}, state, { editing })
  },
  [Types.SAVE_TEXT](state, action) {
    const { editing } = state
    const { question, option, newText } = action.payload;
    if(question === -1)
    return Object.assign({}, state, { editing: { ...editing, title: newText} })
    if(option === -1) {
      editing.questions[question].content = newText
      return Object.assign({}, state, { editing })
    }
    editing.questions[question].options[option] = newText
    return Object.assign({}, state, { editing })
  },
  [Types.SAVE_QUESTIONNAIRE](state, action) {
    const { list, editing, editing: { title, questions } } = state
    const { id, selectedDay } = action.payload
    editing.deadline = selectedDay
    list[id] = { title, status: Status.UN_RELEASE, questions: cloneObject(questions), deadline: selectedDay, data: [] }
    localStorage.list = JSON.stringify(list);
    return Object.assign({}, state, { list, editing })
  },
  [Types.RELEASE_QUESTIONNAIRE](state, action) {
    const { list } = state
    const id = action.payload
    list[id].status = Status.ON_RELEASE
    localStorage.list = JSON.stringify(list);
    return Object.assign({}, state, { list, editing: cloneObject(initialEditing) });
  },
  [Types.FILL_QUESTIONNAIRE](state, action) {
    const { list } = state
    const id = action.payload
    let data = []
    list[id].questions.forEach((question, questionIndex) => {
      switch(question.type) {
        case 'SC': data.push(-1); break;
        case 'MC': data.push([]); break;
        case 'TX': data.push(''); break;
      }
    })
    return Object.assign({}, state, { list, editing:{ ...cloneObject(initialEditing), id, data } })
  },
  [Types.CHOOSE_OPTION](state, action) {
    const { editing } = state
    const { question, option } = action.payload
    editing.data[question] = option
    return Object.assign({}, state, { editing })
  },
  [Types.TOGGLE_OPTION](state, action) {
    const { editing } = state
    const { question, option } = action.payload
    const index = editing.data[question].indexOf(option)
    index ^ -1 ? editing.data[question].splice(index, 1) : editing.data[question].push(option)
    return Object.assign({}, state, { editing })
  },
  [Types.FILL_TEXT](state, action) {
    const { editing } = state
    const { text, question } = action.payload
    editing.data[question] = text
    return Object.assign({}, state, { editing })
  },
  [Types.SUBMIT_QUESTIONNAIRE](state, action) {
    const { list, editing } = state
    list[editing.id].data.push(editing.data)
    localStorage.list = JSON.stringify(list)
    return Object.assign({}, state, { list })
  },
  [Types.CHECK_DATA](state, action) {
    const id = action.payload
    return Object.assign({}, state, { editing: { ...cloneObject(initialEditing), id } })
  },
  [Types.CLOSE_QUESTIONNAIRE](state, action) {
    const { list } = state
    const id = action.payload
    list[id].status = Status.OVER_RELEASE
    return Object.assign({}, state, { list })
  },
  [Types.SORT_QUESTIONNAIRE](state, action) {
    const { list } = state
    const dataKey = action.payload
    signal ^= -1
    list.sort((a, b) => (signal || 1 ) * (a[dataKey] >= b[dataKey] ? 1 : -1))
    return Object.assign({}, state, { list })
  }
}, initialState)

export default questionnaires
