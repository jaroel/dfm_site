import {atom, action} from 'nanostores'
import {useStore} from '@nanostores/solid'

// Homepage
export const video = atom(false)

// Uitzending gemist
const _playerUrl = atom<string | undefined>()
export const setPlayerUrl = action(_playerUrl, 'setPlaying', (_store, value: string | undefined) => {
  _playerUrl.set(value)
})
export const playerUrl = useStore(_playerUrl)

const _audioStreamState = atom<'stopped' | 'loading' | 'playing'>('stopped')
export const setAudioStreamState = action(_audioStreamState, 'setAudioStreamState', (_store, value: 'stopped' | 'loading' | 'playing') => {
  _audioStreamState.set(value)
})
export const audioStreamState = useStore(_audioStreamState)
