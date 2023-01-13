import type {Component} from 'solid-js'
import {groupBy} from '../groupby'
import {playerUrl, setPlayerUrl} from '../stores'
import type {Recording} from '../uzg'

type UitzendingGemistProps = {
  recordings: Recording[];
}

export const UitzendingGemist: Component<UitzendingGemistProps> = props => (
  <>
    {groupBy(props.recordings, item => item.year).map(byYear => (
      <>
        <h2 class='text-lg font-medium leading-6 '>{byYear.head.year}</h2>
        {groupBy(byYear.members, item => item.monthDisplayLC).map(byMonth => (
          <>
            <h3 class='text-lg font-medium leading-6 '>
              {byMonth.head.monthDisplayUC}
            </h3>
            {groupBy(byMonth.members, item => item.day).map(byDay => (
              <>
                <h4 class='text-lg font-medium leading-6 '>
                  {byDay.head.weekdayDisplayUC} {byDay.head.day}{' '}
                  {byDay.head.monthDisplayLC} {byDay.head.year}
                </h4>
                {byDay.members.map(recording => (
                  <label class='block'>
                    <input
                      class='mr-2'
                      type='checkbox'
                      checked={recording.url === playerUrl()}
                      onChange={event => {
                        const checked = event.currentTarget.checked
                        setPlayerUrl(checked ? recording.url : undefined)
                      }}
                    />
                    {recording.filename}
                  </label>
                ))}
              </>
            ))}
          </>
        ))}
      </>
    ))}
  </>
)
