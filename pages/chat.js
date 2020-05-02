import React from 'react'
import PropTypes from 'prop-types'
import { v4 as uuid } from 'uuid'
import io from 'socket.io-client'
import fetch from 'isomorphic-fetch'

export default class Chat extends React.Component {
  static async getInitialProps({ req }) {
    const response = await fetch('http://localhost:3000/messages')
    const messages = await response.json()
    return { messages }
  }

  // init state with the prefetched messages
  state = {
    field: '',
    messages: this.props.messages,
    uuid: uuid(),
  }

  // connect to WS server and listen event
  componentDidMount() {
    this.channelName = `message::${this.props.room}`
    this.socket = io('http://localhost:3000')
    this.socket.on(this.channelName, this.handleMessage)
    this.socket.emit('newUser', this.createMessage({ value: this.state.uuid }))
  }

  // close socket connection
  componentWillUnmount() {
    this.socket.off(this.channelName, this.handleMessage)
    this.socket.close()
  }

  // add messages from server to the state
  handleMessage = (message) => {
    this.setState({ messages: this.state.messages.concat(message) })
  }

  handleChange = (event) => {
    this.setState({ field: event.target.value })
  }

  createMessage = (data) => ({
    uuid: this.state.uuid,
    id: new Date().getTime(),
    room: this.props.room,
    ...data,
  })

  emit(message) {
    this.socket.emit('message', message)
  }

  // send messages to server and add them to the state
  handleSubmit = (event) => {
    event.preventDefault()
    const message = this.createMessage({ value: this.state.field })

    this.emit(message)

    // add it to state and clean current input value
    this.setState((state) => ({
      field: '',
      messages: state.messages.concat(message),
    }))
  }

  renderMessage = (message) => {
    const name = message.uuid ? message.uuid.slice(0, 6) : '???'

    return (
      <li key={message.id}>
        <span>{name}:</span>
        <span>{message.value}</span>
      </li>
    )
  }

  render() {
    const { room } = this.props
    const { uuid, messages, field } = this.state

    return (
      <div className="__chat">
        <div>{`room: ${room}`}</div>
        <div>{`uuid: ${uuid}`}</div>
        <ul>{messages.map(this.renderMessage)}</ul>
        <form onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleChange}
            type="text"
            placeholder="Hello world!"
            value={field}
          />
          <button>Send</button>
        </form>
      </div>
    )
  }
}

Chat.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.any),
  room: PropTypes.string,
}

Chat.defaultProps = {
  messages: [],
  room: 'default',
}
