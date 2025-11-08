import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import './ModelSelector.css'

const models = [
  { id: 'llama3.2', name: 'Llama 3.2 (Ollama)' },
  { id: 'gemini', name: 'Gemini (Google AI)' },
]

export default function ModelSelector({ selectedModel, setSelectedModel }) {
  return (
    <div className="model-selector">
      {/* SVG Gradient Definition for the checkmark */}
      <svg width="0" height="0" className="hidden">
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#3b82f6' }} />
          <stop offset="100%" style={{ stopColor: '#9333ea' }} />
        </linearGradient>
      </svg>

      <Listbox value={selectedModel} onChange={setSelectedModel}>
        <div className="relative mt-1">
          <Listbox.Button className="selector-button">
            <span className="selector-text">{models.find(m => m.id === selectedModel)?.name}</span>
            <span className="selector-icon">
              <ChevronUpDownIcon aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="options-list">
              {models.map((model) => (
                <Listbox.Option
                  key={model.id}
                  className={({ active }) =>
                    `option-item ${active ? 'active' : 'inactive'}`
                  }
                  value={model.id}
                >
                  {({ selected }) => (
                    <>
                      <span className={`option-text ${selected ? 'selected' : 'not-selected'}`}>
                        {model.name}
                      </span>
                      {selected ? (
                        <span className="option-check">
                          <CheckIcon aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}