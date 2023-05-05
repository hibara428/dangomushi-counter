import { getCookie } from 'typescript-cookie'
import jwt_decode from 'jwt-decode'

// constants
const COGNITO_BASE_PREFIX = 'CognitoIdentityServiceProvider'

// interfaces
type TokenName = 'idToken' | 'refreshToken' | 'accessToken' | 'tokenScopesString' | 'LastAuthUser'
export interface CognitoUser {
  idToken: string
  payload: { [name: string]: string }
  email: string
}

// classes
export class CognitoCookieParser {
  parse = (userPoolAppId: string): CognitoUser | undefined => {
    const idToken = this.getIdToken(userPoolAppId)
    if (!idToken) {
      return undefined
    }

    const payload = jwt_decode<{ [name: string]: string }>(idToken)
    const email = payload.email
    if (!email) {
      return undefined
    }

    return { idToken, payload, email }
  }

  /**
   * Get ID token.
   *
   * @param userPoolAppId Cognito user pool app ID
   * @returns ID token
   */
  getIdToken = (userPoolAppId: string): string | undefined => {
    const lastAuthUser = this.getLastAuthUser(userPoolAppId) || ''
    return this.getTokenFromCookie(userPoolAppId, 'idToken', lastAuthUser)
  }

  /**
   * Get token from cookie.
   *
   * @param   userPoolAppId Cognito user pool app ID
   * @param   tokenName     Token name
   * @param   lastAuthUser  Last auth user
   * @returns Token
   */
  private getTokenFromCookie = (
    userPoolAppId: string,
    tokenName: TokenName,
    lastAuthUser: string = ''
  ): string | undefined => {
    const cookieName = this.getTokenCookieName(userPoolAppId, tokenName, lastAuthUser)
    return getCookie(cookieName)
  }

  /**
   * Get last auth user.
   *
   * @param userPoolAppId Cognito user pool ID
   * @returns Last auth user
   */
  private getLastAuthUser = (userPoolAppId: string) => {
    return this.getTokenFromCookie(userPoolAppId, 'LastAuthUser') || ''
  }

  /**
   * Get cookie name.
   *
   * @param   userPoolAppId Cognito user pool app ID
   * @param   tokenName     Token name
   * @param   lastAuthUser  Last auth user
   * @returns Cookie name
   */
  private getTokenCookieName = (
    userPoolAppId: string,
    tokenName: TokenName,
    lastAuthUser: string = ''
  ): string => {
    return [this.getCookieNamePrefix(userPoolAppId, lastAuthUser), tokenName].join('.')
  }

  /**
   * Get cookie name prefix with last auth user.
   *
   * @param   userPoolAppId Cognito user pool app ID
   * @param   lastAuthUser  Last auth user
   * @returns Cookie name prefix
   */
  private getCookieNamePrefix = (userPoolAppId: string, lastAuthUser: string = ''): string => {
    return lastAuthUser.length > 0
      ? [COGNITO_BASE_PREFIX, userPoolAppId, lastAuthUser].join('.')
      : [COGNITO_BASE_PREFIX, userPoolAppId].join('.')
  }
}
