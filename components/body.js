import Chat from './chat'
import styles from './body.module.scss'

export default function Body() {
  return (
    <div className="container">
      <div className={styles.Body}></div>
      <div className="row">
        <div className="seven columns">Game </div>
        <div className="five columns">
          <Chat room="red" />
        </div>
      </div>
    </div>
  )
}
