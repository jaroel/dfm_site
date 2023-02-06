import type {Component} from 'solid-js'
import {playerUrl, setAudioStreamState} from '../stores'

export const UitzendingGemistPlayer: Component = () => <>
  <audio src={playerUrl() ?? ''} autoplay onAbort={() => {
    setAudioStreamState('stopped')
  }}
  onLoadStart={() => {
    setAudioStreamState(playerUrl() ? 'loading' : 'stopped')
  }}
  onPlaying={() => {
    setAudioStreamState('playing')
  }}></audio>
</>
