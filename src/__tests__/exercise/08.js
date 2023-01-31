// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useCounter from '../../components/use-counter'

// 🐨 create a simple function component that uses the useCounter hook
// and then exposes some UI that our test can interact with to test the
// capabilities of this hook
// 💰 here's how to use the hook:
// const {count, increment, decrement} = useCounter()
const CounterApp = () => {
  const {count, increment, decrement} = useCounter()
  return (
    <div>
      <div>Current count: {count}</div>
      <button onClick={decrement}>Decrement</button>
      <button onClick={increment}>Increment</button>
    </div>
  )
}

test('exposes the count and increment/decrement functions', async () => {
  // 🐨 render the component
  render(<CounterApp />)
  // 🐨 get the elements you need using screen
  const countDisplay = screen.getByText(/current/i)
  const incrementBtn = screen.getByText(/increment/i)
  const decrementBtn = screen.getByText(/decrement/i)
  // 🐨 assert on the initial state of the hook
  expect(countDisplay.innerHTML).toBe('Current count: 0')
  // 🐨 interact with the UI using userEvent and assert on the changes in the UI
  await userEvent.click(incrementBtn)
  expect(countDisplay.innerHTML).toBe('Current count: 1')
})

// Some other tests you can write are for the props

/* eslint no-unused-vars:0 */
