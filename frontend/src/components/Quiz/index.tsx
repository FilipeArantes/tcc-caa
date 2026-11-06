import { QuizAchievements } from './QuizAchievements'
import { QuizActions } from './QuizActions'
import { QuizAudio } from './QuizAudio'
import { QuizEmpty } from './QuizEmpty'
import { QuizFeedback } from './QuizFeedback'
import { QuizFinished } from './QuizFinished'
import { QuizImage } from './QuizImage'
import { QuizOption } from './QuizOption'
import { QuizOptions } from './QuizOptions'
import { QuizPlaying } from './QuizPlaying'
import { QuizProgress } from './QuizProgress'
import { QuizProvider } from './QuizProvider'
import { QuizQuestion } from './QuizQuestion'
import { QuizResult } from './QuizResult'
import { QuizRoot } from './QuizRoot'
import { QuizText } from './QuizText'

export const Quiz = {
  Provider: QuizProvider,
  Root: QuizRoot,
  Playing: QuizPlaying,
  Finished: QuizFinished,
  Empty: QuizEmpty,
  Progress: QuizProgress,
  Question: QuizQuestion,
  Image: QuizImage,
  Audio: QuizAudio,
  Text: QuizText,
  Options: QuizOptions,
  Option: QuizOption,
  Feedback: QuizFeedback,
  Actions: QuizActions,
  Result: QuizResult,
  Achievements: QuizAchievements,
}
