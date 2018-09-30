const bcrypt = require('bcrypt')

const shortid = require('shortid')
const cryptr = require('../models/DBcontroller').cryptr
const db = require('../models/DBcontroller').db

exports.getUser = (user_email) => {
  let userSet = db.get('users').cloneDeep()

  userSet = userSet.forEach( (user) => {
    user.email = cryptr.decrypt(user.email)
  })
  return userSet.find( { email : cryptr.decrypt(user_email) } ).value()
}

exports.getAdministrators = () => {
  const administrators = db.get('users')
  .filter( { role : "administrator" } )
  .value()

  return administrators
}

exports.getUsers = ({role, publicFields}) => {
  let users = db.get('users').cloneDeep()

  if (role) {
    users = users.filter({ role: role })
  }

  if (publicFields) {
    users = users.map(el => {
      return {
        id: el.id,
        name : el.name,
        picture : el.picture,
        age : el.age,
        location : el.location,
        bio : el.bio
      }
    })
  }
  return users
}

exports.createUser = ({user_email, hash, role, name, picture, age, location, bio}) => {
  try {
    db.get('users')
    .push({
      id : shortid.generate(),
      email : user_email,
      password : hash,
      role : role,
      name : name,
      picture : picture,
      age : age,
      location : location,
      bio : bio
    })
    .write()

    return "Ok"
  }
  catch (err) {
    return null
  }
}

exports.userUpdate = ({user_email, hash, role, name, picture, age, location, bio}) => {
  try {
    let payload = {}

    if (user_email) {
      payload["email"] = cryptr.encrypt(user_email)
    }
    if (hash) {
      payload["password"] = hash
    }
    if (role) {
      payload["role"] = role
    }
    if (name) {
      payload["name"] = name
    }
    if (picture) {
      payload["picture"] = picture
    }
    if (age) {
      payload["age"] = age
    }
    if (location) {
      payload["location"] = location
    }
    if (bio) {
      payload["bio"] = bio
    }

    db.get("users")
    .find( { id : id } )
    .assign(payload)
    .write()

    return "Ok"
  }

  catch (err) {
    return null
  }
}

exports.deleteUser = (id) => {
  try {
    db.get("users")
    .remove( { id : id } )
    .write()

    return "Ok"
  }
  catch (err) {
    return null
  }
}
