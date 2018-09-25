const questionModel = require('../models/questions')


exports.listAnsweredQuestions = (req, res, next) => {
  try {
    filteredQuestions = questionModel.getQuestionSet({
      filterNull: true,
      publicFields: true
    })

    return res.status(200).json(
      filteredQuestions
    )
  } catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}


exports.sendNewQuestion = (req, res, next) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({
        error: "No question sent to the server. Please try again."
      })

    } else if (req.body.text.en || req.body.text.de) {
      let created_question = questionModel.addQuestion({
        text: req.body.text,
        additional_details: req.body.additional_details,
        related_question: req.body.related_question,
        asker_age: req.body.asker_age
      })

      return res.status(201).json(
        created_question
      )
    } else {
      return res.status(400).json({
        error: "The question sent is not in a valid language."
      })
    }
  } catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}


// NOTE: REVIEW THIS
exports.addAdditionalDetails = (req, res, next) => {
  try {
    let updated_question = questionModel.updateQuestion({
      id: req.params.questionId,
      additional_details: req.body.additional_details,
      related_question: req.body.related_question,
      asker_age: req.body.asker_age
    })

    if (updated_question) {
      return res.status(200).json(
        updated_question
      )
    } else {
      return res.status(400).json({
        error: "Bad input, please review question id and payload"
      })
    }
  } catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}


exports.updateNumberOfViews = (req, res, next) => {
  try {

    let question = questionModel.increaseViews(req.params.questionId)

    if (question) {
      return res.status(200).json(
        question
      )
    } else {
      return res.status(404).json({
        error: "Question not found."
      })
    }
  } catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}


exports.listAllQuestions = (req, res, next) => {
  try {
    allQuestions = questionModel.getQuestionSet({
      filterNull: false,
      publicFields: false
    })

    return res.status(200).json(
      allQuestions
    )
  } catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}


exports.getSpecificQuestion = (req, res, next) => {
  try {
    const question = questionModel.getQuestionById(req.params.questionId)

    if (question) {
      return res.status(200).json(
        question
      )
    } else {
      return res.status(404).json({
        error: "Question not found."
      })
    }
  } catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}


exports.modifyQuestion = (req, res, next) => {
  try {
    let text = {}
    if (req.body.text) {
      text = req.body.text
    }
    let updated_question = questionModel.updateQuestion({
      id: req.params.questionId,
      text_en: text.en,
      text_de: text.de,
      additional_details: req.body.additional_details,
      related_question: req.body.related_question,
      date_asked: req.body.date_asked,
      number_of_views: req.body.number_of_views,
      asker_age: req.body.asker_age,
    })

    if (updated_question) {
      return res.status(200).json(
        updated_question
      )
    } else {
      return res.status(400).json({
        error: "Bad input, please review question id and payload"
      })
    }
  } catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}

exports.deleteQuestion = (req, res, next) => {
  try {
    let question = questionModel.deleteQuestion(req.params.questionId)

    if (question === 'Ok') {
      return res.status(200).json({
        message: "Question Deleted."
      })
    } else {
      return res.status(404).json({
        message: "Question does not exists."
      })
    }
  } catch (err) {
    return res.status(500).json({
      error: err.toString()
    })
  }
}
