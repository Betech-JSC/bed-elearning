type ChatListener = (instructorId: string, instructorName: string, instructorImage?: string) => void
type CloseListener = () => void

class ChatStore {
  private listeners: Set<ChatListener> = new Set()
  private closeListeners: Set<CloseListener> = new Set()

  subscribe(listener: ChatListener) {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  subscribeClose(listener: CloseListener) {
    this.closeListeners.add(listener)
    return () => {
      this.closeListeners.delete(listener)
    }
  }

  openChat(instructorId: string, instructorName: string, instructorImage?: string) {
    this.listeners.forEach((listener) => {
      try {
        listener(instructorId, instructorName, instructorImage)
      } catch (e) {
        console.error(e)
      }
    })
  }

  closeChat() {
    this.closeListeners.forEach((listener) => {
      try {
        listener()
      } catch (e) {
        console.error(e)
      }
    })
  }
}

export const chatStore = new ChatStore()
