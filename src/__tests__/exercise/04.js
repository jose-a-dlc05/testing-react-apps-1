// form testing
// http://localhost:3000/login

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../../components/login'

test('submitting the form calls onSubmit with username and password', async () => {
  // 🐨 create a variable called "submittedData" and a handleSubmit function that
  // accepts the data and assigns submittedData to the data that was submitted
  // 💰 if you need a hand, here's what the handleSubmit function should do:
  // const handleSubmit = data => (submittedData = data)

  // 🐨 render the login with your handleSubmit function as the onSubmit prop
  // 🐨 get the username and password fields via
  // `getByLabelText` - This will search for the label that matches the given TextMatch, then find the element associated with that label and will throw a descriptive error if no elements match
  // 🐨 use `await userEvent.type...` to change the username and password fields to
  //    whatever you want
  //
  // 🐨 click on the button with the text "Submit"
  //
  // assert that submittedData is correct
  // 💰 use `toEqual` from Jest: 📜 https://jestjs.io/docs/en/expect#toequalvalue
  let submittedData
  const handleSubmit = data => (submittedData = data)

  render(<Login onSubmit={handleSubmit} />)
  const username = screen.getByLabelText(/username/i)
  const password = screen.getByLabelText(/password/i)
  const submitBtn = screen.getByRole('button', {type: 'Submit'})

  await userEvent.type(username, 'jose-a-dlc05')
  await userEvent.type(password, 'password')
  await userEvent.click(submitBtn)
  expect(submittedData).toEqual({
    username: 'jose-a-dlc05',
    password: 'password',
  })
})

/*
eslint
  no-unused-vars: "off",
*/
