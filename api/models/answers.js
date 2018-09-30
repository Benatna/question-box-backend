const shortid = require('shortid')
const cryptr = require('../models/DBcontroller').cryptr
const db = require('../models/DBcontroller').db
const userModel = require('../models/users')


exports.submitOrUpdateAnswer = ({question_id, ambassador, answer}) => {

  const sender = userModel.getUser(ambassador)

  answer["ambassador"] = sender.name

  const question = db.get('questions')
  .find( {id : question_id} )

  if (!question.value()) {
    return null
  } else {
    if ( !question.get('answers').value() ) {

      db.get('questions')
      .find( { id : question_id } )
      .assign( { answers : [ answer ] } )
      .write()

      return db.get('questions').find( { id : question_id } ).value()

    } else {
      question.get('answers')
      .remove( { ambassador : sender.name } )
      .write()

      question.get('answers')
      .push( answer )
      .write()

      return question.value()
    }
  }
}

exports.deleteAnswer = (question_id) => {
  const question = db.get('questions')
  .find({ id : question_id })
  .value()

  if (question) {
    if (question.answer) {
      db.get('questions')
      .find( {id : question_id} )
      .unset('answer')
      .write()

      return question

    } else {
      return null
    }
  } else {
    return null
  }
}
