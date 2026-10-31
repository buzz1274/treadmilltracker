class AuthStore {
  private readonly storageKey = 'treadmilltracker.token'
  private token: string | null = null

  public getToken(): string | null {
    try {
      return window.sessionStorage.getItem(this.storageKey) ?? this.token
    } catch {
      return this.token
    }
  }

  public setToken(token: string | null): void {
    this.token = token
    try {
      if (token) {
        window.sessionStorage.setItem(this.storageKey, token)
      } else {
        window.sessionStorage.removeItem(this.storageKey)
      }
    } catch {
      // Retain in-memory authentication if browser storage is unavailable.
    }
  }
}

export const authStore: AuthStore = new AuthStore()
