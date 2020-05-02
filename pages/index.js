import { Component } from 'react'
import Chat from './chat'

class HomePage extends Component {
  render() {
    return (
      <main>
        <div className="chat">
          <Chat room="red" />
          <Chat room="blue" />
        </div>
      </main>
    )
  }
}

export default HomePage
