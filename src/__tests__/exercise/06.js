// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from 'react'
import {render, screen, act} from '@testing-library/react'
import Location from '../../examples/location'
import {useCurrentPosition} from 'react-use-geolocation'

// This is an alternative way of mocking the function which is by mocking the third-party module
// in location.js that is interacting with geoloaction

// Below, Jest will look for all the exports from react-use-geolocation, and any of those that are functions, it's going to create a jest.mock function for that automatically for us
jest.mock('react-use-geolocation')

test('displays the users current location', async () => {
  // 🐨 create a fakePosition object that has an object called "coords" with latitude and longitude
  // 📜 https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition
  const fakePosition = {
    coords: {
      latitude: 40.0,
      longitude: 150.0,
    },
  }

  let setReturnValue
  function useMockCurrentPosition() {
    const state = React.useState([])
    setReturnValue = state[1] // stateUpdateFunction
    return state[0] // stateValue
  }
  useCurrentPosition.mockImplementation(useMockCurrentPosition)

  render(<Location />)
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  // this test need to be wrapped in act, because we're calling a state updater function. We just want to make sure that React flushes all of the side effects that are going to be triggered as a result of this state update before we continue with the rest of our test. Let's go ahead and save that. Our test is indeed passing.
  act(() => {
    setReturnValue([fakePosition])
  })

  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(screen.getByText(/latitude/i)).toHaveTextContent(
    `Latitude: ${fakePosition.coords.latitude}`,
  )
  expect(screen.getByText(/longitude/i)).toHaveTextContent(
    `Longitude: ${fakePosition.coords.longitude}`,
  )
})

test('displays the error message', async () => {
  const fakeError = new Error(
    'Geolocation is not supported or permission denied',
  )

  let setErrorValue
  function useMockCurrentPosition() {
    const state = React.useState([])
    setErrorValue = state[1]
    state[0] = fakeError
    return state[0]
  }
  useCurrentPosition.mockImplementation(useMockCurrentPosition)
  render(<Location />)
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  act(() => {
    setErrorValue([fakeError])
  })
})

// In Review, in the implementation `location.js`, location is rendered by calling useCurrentPosition from 'react-geo-location' (line 6 - `location.js`).

// In our test, that won't happen because we used jest.mock, which rewrites all our module imports to use a mocked version of 'react-geo-location' hence useCurrentPosition being mocked as well.

// When useCurrentPosition is called, it will call 'useMockCurrentPosition' which is technically a custom hook. It's using React useState, but we're taking that state updater value and assigning it to something that we can call ourselves.

// It's returning the state value, which at the very beginning is just this empty array. We get position is undefined, error is undefined, which will result in this spinner showing up. That allows us to verify that the spinner is in the document. (line 8 - 9 - `location.js`)

// We want to trigger a state update from our test. We're going to say, "Hey, act. I'm going to do some sort of action and when I'm all done, I want you to flush all of the side effects." The action that we take is to set the return value to this array that has our fake position.

// That will trigger a re-render in any component that's using useCurrentPosition. This time, when we say state at position , it's going to be this array that has a fake position.

// We come back to this location, we call useCurrentPosition, which is our useMockCurrentPosition. This is going to give us our fake position, which will ultimately result in rendering this latitude and longitude. We can make all of those assertions to ensure that our component is working properly.

// https://epicreact.dev/modules/testing-react-apps/mocking-browser-apis-and-modules-extra-credit-solution-1

/*
eslint
  no-unused-vars: "off",
*/
