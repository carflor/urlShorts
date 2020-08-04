import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getUrls, postUrls } from '../../apiCalls';
jest.mock('../../apiCalls')

describe('App', () => {
  beforeEach(() => {
    getUrls.mockResolvedValueOnce({ 
      urls: [
      {
        id: 1,
        long_url: 'https://images.unsplash.com/photo-15318984188',
        short_url: 'http://localhost:3001/useshorturl/1',
        title: 'Awesome photo'
      }
    ]})
  })

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  
  it('should display homepage', () => {
    const { getByText, getByPlaceholderText } = render(<App />)
    const pageTitle = getByText("URL Shortener")
    const submitBtn = getByText("Shorten Please!")
    const noUrlsMessage = getByText('No urls yet! Find some to shorten!')
    expect(pageTitle).toBeInTheDocument()
    expect(submitBtn).toBeInTheDocument()
    expect(noUrlsMessage).toBeInTheDocument()
  })

  it('should display homepage with fetched data', async () => {
    const { getByText } = render(<App />)
    const pageTitle = getByText("URL Shortener")
    const submitBtn = getByText("Shorten Please!")
    expect(pageTitle).toBeInTheDocument()
    expect(submitBtn).toBeInTheDocument()
    const cardTitle = await waitFor(() => getByText('Awesome photo'))
    const longUrl = await waitFor(() => getByText('https://images.unsplash.com/photo-15318984188'))
    const shortUrl = await waitFor(() => getByText('http://localhost:3001/useshorturl/1'))
    expect(cardTitle).toBeInTheDocument()
    expect(longUrl).toBeInTheDocument()
    expect(shortUrl).toBeInTheDocument()
  })

  it('should display new user submitted data after post', async () => {
    getUrls.mockResolvedValueOnce({ 
      urls: [
        {
          id: 1,
          long_url: 'https://images.unsplash.com/photo-15318984188',
          short_url: 'http://localhost:3001/useshorturl/1',
          title: 'Awesome photo'
        },
        {
          id: 2,
          long_url: "http://www.something.com/somethingsomethingsomething",
          short_url: 'http://localhost:3001/useshorturl/2',
          title: "Epic example"
        }
      ]}
    )
    // page setup
    const { getByText, getAllByTestId, getByDisplayValue, getByPlaceholderText } = render(<App />)
    const pageTitle = getByText("URL Shortener")
    const submitBtn = getByText("Shorten Please!")
    expect(pageTitle).toBeInTheDocument()
    expect(submitBtn).toBeInTheDocument()

    // displaysFetchedData
    const cardTitle = await waitFor(() => getByText('Awesome photo'))
    const longUrl = await waitFor(() => getByText('https://images.unsplash.com/photo-15318984188'))
    const shortUrl = await waitFor(() => getByText('http://localhost:3001/useshorturl/1'))
    expect(cardTitle).toBeInTheDocument()
    expect(longUrl).toBeInTheDocument()
    expect(shortUrl).toBeInTheDocument()

    // inputs work
    const titleInput = getByPlaceholderText('Title...')
    const urlInput = getByPlaceholderText('URL to Shorten...')
    fireEvent.change(titleInput, {target: {value: "Epic example"}})
    fireEvent.change(urlInput, {target: {value: "http://www.something.com/somethingsomethingsomething"}})
    const newTitleInput = getByDisplayValue("Epic example")
    const newUrlInput = getByDisplayValue("http://www.something.com/somethingsomethingsomething")
    expect(newTitleInput).toBeInTheDocument()
    expect(newUrlInput).toBeInTheDocument()

    // submit post + new display 
    fireEvent.click(submitBtn)
    const newCardTitle = await waitFor(() => getByText("Epic example"))
    const newCardUrl = await waitFor(() => getByText("http://www.something.com/somethingsomethingsomething"))
    const deleteButtons = await waitFor(() => getAllByTestId('delete-btn'))

    expect(newCardTitle).toBeInTheDocument()
    expect(newCardUrl).toBeInTheDocument()
    expect(deleteButtons.length).toEqual(2)
  })

  it('should be able to delete a card on click', async () => {
    const { getByText } = render(<App />)
    const pageTitle = getByText("URL Shortener")
    const submitBtn = getByText("Shorten Please!")
    expect(pageTitle).toBeInTheDocument()
    expect(submitBtn).toBeInTheDocument()

    // displaysFetchedData 
    const cardTitle = await waitFor(() => getByText('Awesome photo'))
    const longUrl = await waitFor(() => getByText('https://images.unsplash.com/photo-15318984188'))
    const shortUrl = await waitFor(() => getByText('http://localhost:3001/useshorturl/1'))
    const deleteBtn = await waitFor(() => getByText('DELETE'))
    expect(cardTitle).toBeInTheDocument()
    expect(longUrl).toBeInTheDocument()
    expect(shortUrl).toBeInTheDocument()
    expect(deleteBtn).toBeInTheDocument()

    // deletes card 
    fireEvent.click(deleteBtn)
    expect(cardTitle).not.toBeInTheDocument()
    expect(longUrl).not.toBeInTheDocument()
    expect(shortUrl).not.toBeInTheDocument()
    expect(deleteBtn).not.toBeInTheDocument()
  })

})