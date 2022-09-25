export const validate = (element, formdata = []) => {
  let error = [true, '']

  if (element?.validation?.email) {
    const valid = /^.*?@.*?\.[a-zA-Z]+$/.test(element.value)
    const message = `${!valid ? 'Το email πρέπει να έχει σωστή μορφή' : ''}`
    error = !valid ? [valid, message] : error
  }

  if (element?.validation?.confirm) {
    const valid =
      element.value.trim() === formdata[element.validation.confirm].value

    const message = `${
      !valid
        ? 'Ο κωδικός πρόσβασης και η επιβεβαίωση κωδικού πρόσβασης δεν ταιριάζουν'
        : ''
    }`
    error = !valid ? [valid, message] : error
  }

  if (element?.validation?.required) {
    const valid = element.value.trim() !== ''
    const message = `${!valid ? 'Το πεδίο είναι απαραίτητο' : ''}`
    error = !valid ? [valid, message] : error
  }

  return error
}

export const update = (element, formdata, formName) => {
  let newFormData = {
    ...formdata,
  }

  let newElement = {
    ...newFormData[element.id],
  }

  newElement.value = element.event.target.value

  if (element.blur) {
    let validData = validate(newElement, formdata)
    newElement.valid = validData[0]
    newElement.validationMessage = validData[1]
  }

  newElement.touched = element.blur
  newFormData[element.id] = newElement

  return newFormData
}

export const generateData = (formdata, formName) => {
  let dataToSubmit = {}

  for (let key in formdata) {
    if (key !== 'confirmPassword') {
      dataToSubmit[key] = formdata[key].value
    }
  }

  return dataToSubmit
}

export const isFormValid = (formdata, formName) => {
  let formIsValid = true

  for (let key in formdata) {
    formIsValid = formdata[key].valid && formIsValid
  }

  return formIsValid
}
