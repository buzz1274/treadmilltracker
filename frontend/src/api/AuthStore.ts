class AuthStore {
  private token: string | null = null

  public getToken(): string | null {
    return this.token
  }

  public setToken(token: string | null): void {
    this.token = token
  }
}

export const authStore: AuthStore = new AuthStore()
