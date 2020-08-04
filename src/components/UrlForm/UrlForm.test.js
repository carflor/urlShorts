import React from 'react';
import ReactDOM from 'react-dom';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UrlForm from './UrlForm'

describe('UrlForm', () => {
  const postUrls = jest.fn()
  const updateUrls = jest.fn()

  it('should render form without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<UrlForm postUrls={postUrls} updateUrls={updateUrls}  /> , div);
    ReactDOM.unmountComponentAtNode(div);
  })
  
  it('should display form in homepage', () => {
    const { getByPlaceholderText, getByTestId } = render(<UrlForm postUrls={postUrls} updateUrls={updateUrls} />)
    const titleInput = getByPlaceholderText('Title...')
    const urlInput = getByPlaceholderText('URL to Shorten...')
    const submitBtn = getByTestId('submit-btn')
    expect(titleInput).toBeInTheDocument()
    expect(urlInput).toBeInTheDocument()
    expect(submitBtn).toBeInTheDocument()
  })

  it('should update data on input', () => {
    const { getByDisplayValue, getByPlaceholderText } = render(<UrlForm postUrls={postUrls} updateUrls={updateUrls} />)
    const titleInput = getByPlaceholderText('Title...')
    const urlInput = getByPlaceholderText('URL to Shorten...')
    fireEvent.change(titleInput, {target: {value: "Epic example"}})
    fireEvent.change(urlInput, {target: {value: "http://www.something.com/somethingsomethingsomething"}})
    const newTitleInput = getByDisplayValue("Epic example")
    const newUrlInput = getByDisplayValue("http://www.something.com/somethingsomethingsomething")
    expect(newTitleInput).toBeInTheDocument()
    expect(newUrlInput).toBeInTheDocument()
  })

  it('should trigger correct functions on submit', () => {
    const { getByDisplayValue, getByPlaceholderText, getByTestId } = render(<UrlForm postUrls={postUrls} updateUrls={updateUrls} />)
    const titleInput = getByPlaceholderText('Title...')
    const urlInput = getByPlaceholderText('URL to Shorten...')
    const submitBtn = getByTestId('submit-btn')
    fireEvent.change(titleInput, {target: {value: "Epic example"}})
    fireEvent.change(urlInput, {target: {value: "http://www.something.com/somethingsomethingsomething"}})
    const newTitleInput = getByDisplayValue("Epic example")
    const newUrlInput = getByDisplayValue("http://www.something.com/somethingsomethingsomething")
    expect(newTitleInput).toBeInTheDocument()
    expect(newUrlInput).toBeInTheDocument()
    expect(submitBtn).toBeInTheDocument()
    fireEvent.click(submitBtn)
    expect(postUrls).toHaveBeenCalledTimes(1)
    expect(updateUrls).toHaveBeenCalledTimes(1)
  })
})