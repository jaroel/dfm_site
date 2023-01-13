import type {Component} from 'solid-js'
import {playerUrl, setPlayerUrl, audioStreamState, setAudioStreamState} from '../stores'

export const UitzendingGemistPlayer: Component = () => (
  <>
    <button
      onClick={() => {
        setPlayerUrl(undefined)
      }}
    >
        Stop
    </button>
    <p>Playing url: {playerUrl()}</p>
    <p>Stream: {audioStreamState()}</p>
    <audio src={playerUrl() ?? ''} autoplay onAbort={() => {
      setAudioStreamState('stopped')
    }}
    onLoadStart={() => {
      setAudioStreamState('loading')
    }}
    onPlaying={() => {
      setAudioStreamState('playing')
    }}></audio>
  </>
)
