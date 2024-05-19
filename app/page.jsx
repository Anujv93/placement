import React from 'react'
import { Button } from '@/components/ui/button'

function Page() {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Welcome to Placement Management</h1>
        <p>Streamline your placement process with our powerful app</p>
        <div className="cta-buttons">
          <Button variant="contained" color="primary">
            Log In
          </Button>
          <Button variant="outlined" color="primary">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Page