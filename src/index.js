const express = require('express')

const app = express()

app.use(express.json())

const employees = []
const classes = []

function verifyIfEmployeeAlrealdyExists(req, res, next) {
  const { employeeRegistration } = req.body
  const employeeAlreadyExists = employees.some(employee => employee.employeeRegistration === employeeRegistration)

  if (employeeAlreadyExists) {
    return res.status(400).json({ error: 'Employee already exists!' })
  }
  return next()
}

function verifyIfClassAlreadyExists(req, res, next) {
  const { id } = req.body
  const classAlreadyExists = classes.some(classId => classId.id === id)
  if (classAlreadyExists) {
    return res.status(400).json({ error: 'Class already exists' })
  }
  return next()
}

function nameFormated(name) {
  return name.toUpperCase()
}

function cpfFormated(cpf) {
  return cpf.substring(0, 3) + '.' + cpf.substring(3, 6) + '.' + cpf.substring(6, 9) + '.' + cpf.substring(9, 11)
}

function cellFormated(number) {
  return number.substring(0, 3) + ' (' + number.substring(3, 5) + ') ' + number.substring(5, 10) + '-' + number.substring(10, 14)
}

function dateFormated() {
  const newDate = new Date()
  const year = newDate().getFullYear()
  const month = monthFormated(newDate.getMonth() + 1)
  const day = dayFormated(newDate.getDate())
  return `${day}/${month}/${year}`
}

app.post('/register/employee', verifyIfEmployeeAlrealdyExists, (req, res) => {
  const { name, employeeRegistration, password, cpf, email, birthDate, cellPhone } = req.body
  employees.push({
    name: nameFormated(name),
    employeeRegistration,
    cpf: cpfFormated(cpf),
    password,
    email,
    birthDate,
    cellPhone: cellFormated(cellPhone),
    createdAt: dateFormated(),
    class: []
  })
  return res.status(201).send()
})

app.post('/register/class', verifyIfEmployeeAlrealdyExists, (req, res) => {
  const { name, id } = req.body
  classes.push({ name, id, createdAt: dateFormated() })
  return res.status(201).send()
})

app.listen(3333)