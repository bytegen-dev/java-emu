import { useState } from 'react'
import './App.css'
import { CheerpJRunner } from './components/CheerpJRunner'
import { FreeJ2MEEmbed } from './components/FreeJ2MEEmbed'
import { JarInspector } from './components/JarInspector'
import { PhoneFrame } from './components/PhoneFrame'

type Tab = 'inspect' | 'run' | 'midlet'

function App() {
  const [tab, setTab] = useState<Tab>('inspect')

  return (
    <div className="app">
      <header className="hero">
        <h1>J2ME shell + Java in the browser</h1>
        <p>
          Inspect <code>.jar</code> files, run a <strong>desktop</strong> sample with <strong>CheerpJ</strong>, or
          open <strong>FreeJ2ME</strong> for real <strong>MIDP</strong> games (embedded or self-hosted).
        </p>
      </header>

      <nav className="tabs" aria-label="Modes">
        <button
          type="button"
          className={tab === 'inspect' ? 'active' : ''}
          onClick={() => setTab('inspect')}
        >
          Inspect JAR
        </button>
        <button
          type="button"
          className={tab === 'run' ? 'active' : ''}
          onClick={() => setTab('run')}
        >
          Run Java (CheerpJ)
        </button>
        <button
          type="button"
          className={tab === 'midlet' ? 'active' : ''}
          onClick={() => setTab('midlet')}
        >
          Run MIDlet (FreeJ2ME)
        </button>
      </nav>

      {tab === 'midlet' ? (
        <FreeJ2MEEmbed />
      ) : (
        <div className="layout">
          <PhoneFrame title={tab === 'inspect' ? 'JAR inspector' : 'CheerpJ display'}>
            {tab === 'inspect' ? <JarInspector /> : <CheerpJRunner />}
          </PhoneFrame>
        </div>
      )}

      <footer className="foot">
        <small>
          CheerpJ is a third-party runtime (Leaning Technologies). Use for evaluation; see their
          licensing for production.
        </small>
      </footer>
    </div>
  )
}

export default App
