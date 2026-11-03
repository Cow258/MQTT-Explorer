import { Base64 } from 'js-base64'
import { TopicDataType } from './TreeNode'

export type Base64MessageDTO = Pick<Base64Message, 'base64Message'>

export class Base64Message {
  public base64Message: string
  private _unicodeValue: string | undefined

  // Todo: Rename to `encodedLength`
  public get length(): number {
    return this.base64Message.length
  }

  private get unicodeValue(): string {
    if (!this._unicodeValue) {
      this._unicodeValue = Base64.decode(this.base64Message ?? '')
    }

    return this._unicodeValue
  }

  constructor(base64Str?: string | Base64MessageDTO, error?: string) {
    if (typeof base64Str === 'string' || typeof base64Str === 'undefined') {
      this.base64Message = base64Str ?? ''
    } else {
      if (typeof base64Str.base64Message !== 'string') {
        throw new Error('Received unexpected type in copy constructor')
      }
      this.base64Message = base64Str.base64Message
    }
  }

  /**
   * Override default JSON serialization behavior to only return the DTO
   * @returns
   */
  public toJSON(): Base64MessageDTO {
    return { base64Message: this.base64Message }
  }

  public toUnicodeString() {
    return this.unicodeValue || ''
  }

  public static fromBuffer(buffer: Buffer) {
    return new Base64Message(buffer.toString('base64'))
  }

  public toBuffer(): Buffer {
    return Buffer.from(this.base64Message, 'base64')
  }

  public static fromString(str: string) {
    return new Base64Message(Base64.encode(str))
  }

  /**
   * Decode a hex string into raw bytes.
   * Accepts continuous hex (`01FF`), separated bytes (`01 FF`, `01:FF`, `01-FF`)
   * and `0x` prefixes (`0x01 0xFF`). A single nibble (`0xA`) is one byte.
   */
  public static fromHex(hex: string): Base64Message {
    const trimmed = hex.trim()
    if (trimmed.length === 0) {
      return Base64Message.fromBuffer(Buffer.alloc(0))
    }

    const tokens = trimmed.split(/[\s,;:-]+/).filter(token => token.length > 0)
    const bytes: number[] = []
    tokens.forEach(token => {
      Base64Message.parseHexToken(token).forEach(byte => bytes.push(byte))
    })
    return Base64Message.fromBuffer(Buffer.from(bytes))
  }

  private static parseHexToken(token: string): number[] {
    const digits = token.replace(/^0x/i, '')
    if (!/^[0-9a-fA-F]+$/.test(digits)) {
      throw new Error(`Invalid hex payload: "${token}"`)
    }
    if (digits.length === 1) {
      return [parseInt(digits, 16)]
    }
    if (digits.length % 2 !== 0) {
      throw new Error(`Invalid hex payload: "${token}"`)
    }

    const bytes: number[] = []
    for (let index = 0; index < digits.length; index += 2) {
      bytes.push(parseInt(digits.substring(index, index + 2), 16))
    }
    return bytes
  }

  public format(type: TopicDataType = 'string'): [string, 'json' | undefined] {
    try {
      switch (type) {
        case 'json': {
          const json = JSON.parse(this.toUnicodeString())
          return [JSON.stringify(json, undefined, '  '), 'json']
        }
        case 'hex': {
          const hex = Base64Message.toHex(this)
          return [hex, undefined]
        }
        default: {
          const str = this.toUnicodeString()
          return [str, undefined]
        }
      }
    } catch (error) {
      const str = this.toUnicodeString()
      return [str, undefined]
    }
  }

  public static toHex(message: Base64Message, bytesPerLine?: number) {
    const buf = Buffer.from(message.base64Message, 'base64')
    const tokens: string[] = []
    buf.forEach(element => {
      const hex = element.toString(16).toUpperCase()
      tokens.push(`0x${hex.length < 2 ? `0${hex}` : hex}`)
    })

    if (!bytesPerLine || bytesPerLine < 1) {
      return tokens.join(' ')
    }

    const lines: string[] = []
    for (let index = 0; index < tokens.length; index += bytesPerLine) {
      lines.push(tokens.slice(index, index + bytesPerLine).join(' '))
    }
    return lines.join('\n')
  }

  public static toDataUri(message: Base64Message, mimeType: string) {
    return `data:${mimeType};base64,${message.base64Message}`
  }
}
