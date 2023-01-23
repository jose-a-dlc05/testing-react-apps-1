// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
// 🐨 you'll need to grab waitForElementToBeRemoved from '@testing-library/react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
// 🐨 you'll need to import rest from 'msw' and setupServer from msw/node
import Login from '../../components/login-submission'
import {setupServer} from 'msw/node'
import {rest} from 'msw'
import {handlers} from '../../test/server-handlers'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

// 🐨 get the server setup with an async function to handle the login POST request:
// 💰 here's something to get you started
// rest.post(
//   'https://auth-provider.example.com/api/login',
//   async (req, res, ctx) => {},
// )
// you'll want to respond with an JSON object that has the username.
// 📜 https://mswjs.io/

// 🐨 before all the tests, start the server with `server.listen()`
// 🐨 after all the tests, stop the server with `server.close()`
const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test(`logging in displays the user's username`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.type(screen.getByLabelText(/password/i), password)
  // 🐨 uncomment this and you'll start making the request!
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))
  // as soon as the user hits submit, we render a spinner to the screen. That
  // spinner has an aria-label of "loading" for accessibility purposes, so
  // 🐨 wait for the loading spinner to be removed using waitForElementToBeRemoved
  // 📜 https://testing-library.com/docs/dom-testing-library/api-async#waitforelementtoberemoved
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
  // once the login is successful, then the loading spinner disappears and
  // we render the username.
  // 🐨 assert that the username is on the screen
  expect(screen.getByText(username)).toBeInTheDocument()
})

test(`not entering username displays error message`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/password/i), password)
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  const errorMsg = screen.getByRole('alert')
  expect(errorMsg).toMatchInlineSnapshot(`
    <div
      role="alert"
      style="color: red;"
    >
      username required
    </div>
  `)
})
test(`not entering password displays error message`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  const errorMsg = screen.getByRole('alert')

  expect(errorMsg).toMatchInlineSnapshot(`
    <div
      role="alert"
      style="color: red;"
    >
      password required
    </div>
  `)
})

test('handles server error', async () => {
  const testErrorMsg = 'Error 500: server unavailable'
  server.use(
    rest.post(
      // note that it's the same URL as our app-wide handler
      // so this will override the other.
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        // your one-off handler here
        return res(ctx.status(500), ctx.json({message: testErrorMsg}))
      },
    ),
  )

  render(<Login />)
  const {username, password} = buildLoginForm()
  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.type(screen.getByLabelText(/password/i), password)
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

  const errorMsg = screen.getByRole('alert')

  expect(errorMsg).toHaveTextContent('Error 500: server unavailable')
})
