import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import UrlContainer from './UrlContainer'

describe('UrlContainer', () => {
  const mockData = [
    {
      id: 1,
      long_url: 'https://images.unsplash.com/photo-15318984188',
      short_url: 'http://localhost:3001/useshorturl/1',
      title: 'Awesome photo'
    },
    {
      id: 2,
      long_url: 'https://images.unsplashed.com/photo-1531898418865-480b7090470f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
      short_url: 'http://localhost:3001/useshorturl/2',
      title: 'Some photo'
    }
  ]

  it('should render without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<UrlContainer urls={mockData}/> , div);
    ReactDOM.unmountComponentAtNode(div);
  })

  it('should display fetched data in homepage', () => {
    const { getByText, getAllByTestId } = render(<UrlContainer urls={mockData} />)
    const firstItemTitle = getByText('Awesome photo')
    const firstItemLongUrl = getByText('https://images.unsplash.com/photo-15318984188')
    const firstItemShortUrl = getByText('http://localhost:3001/useshorturl/1')
    const deleteButtons = getAllByTestId('delete-btn')
    expect(firstItemTitle).toBeInTheDocument()
    expect(firstItemLongUrl).toBeInTheDocument()
    expect(firstItemShortUrl).toBeInTheDocument()
    expect(deleteButtons.length).toEqual(2)
  })
})