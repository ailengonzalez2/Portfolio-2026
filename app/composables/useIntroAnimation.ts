export const useIntroAnimation = () => {
  const isIntroComplete = useState('introComplete', () => false)

  const setIntroComplete = () => {
    isIntroComplete.value = true
  }

  return {
    isIntroComplete,
    setIntroComplete
  }
}
