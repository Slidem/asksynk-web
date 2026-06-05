# Timer sounds

Drop these files here (served at `/sounds/timer/*`). Until present, playback is a
silent no-op — nothing breaks.

| File             | Plays when                                  |
| ---------------- | ------------------------------------------- |
| `start.mp3`      | A session starts                            |
| `pause.mp3`      | A running session is paused                 |
| `resume.mp3`     | A paused session is resumed                 |
| `stop.mp3`       | A session is stopped                        |
| `complete.mp3`   | A session finishes (`timer.completed`)      |
| `ending-soon.mp3`| Session enters its last 60s / final 10%     |

Mapping + volume/enabled handling live in `src/timer/sounds/`. Use short `.mp3`
clips; `ending-soon.mp3` and `complete.mp3` are the most important.
