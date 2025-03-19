import React from 'react'
import Search from './Search'
import JobHome from './JobHome'

const Home = () => {
  console.log('Home');
  return (
    <div>
      <Search/>
      <JobHome/>
    </div>
  )
}

export default Home
