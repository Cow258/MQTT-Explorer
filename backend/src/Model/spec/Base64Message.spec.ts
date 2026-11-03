import 'mocha'

import { expect } from 'chai'
import { Base64Message } from '../Base64Message'

describe('Base64Message hex', () => {
  it('parses 0x-prefixed bytes into binary and round-trips', () => {
    const message = Base64Message.fromHex('0x01 0x0A 0xFF')
    expect(Array.from(message.toBuffer())).to.deep.equal([0x01, 0x0a, 0xff])
    expect(Base64Message.toHex(message)).to.equal('0x01 0x0A 0xFF')
  })

  it('parses continuous hex without treating it as text', () => {
    const binary = Base64Message.fromHex('010aff')
    const text = Base64Message.fromString('010aff')

    expect(Array.from(binary.toBuffer())).to.deep.equal([1, 10, 255])
    expect(text.toBuffer().length).to.equal(6)
  })

  it('accepts colon, comma and dash separators', () => {
    const message = Base64Message.fromHex('01:02,03-04')
    expect(Array.from(message.toBuffer())).to.deep.equal([1, 2, 3, 4])
  })

  it('accepts a single nibble as one byte', () => {
    expect(Array.from(Base64Message.fromHex('0xA').toBuffer())).to.deep.equal([0x0a])
  })

  it('returns an empty payload for blank input', () => {
    expect(Base64Message.fromHex('   ').toBuffer().length).to.equal(0)
  })

  it('rejects invalid or odd-length hex', () => {
    expect(() => Base64Message.fromHex('zz')).to.throw(/Invalid hex payload/)
    expect(() => Base64Message.fromHex('010')).to.throw(/Invalid hex payload/)
  })

  it('wraps a hex dump onto multiple lines', () => {
    const message = Base64Message.fromHex('0001020304')
    expect(Base64Message.toHex(message, 2)).to.equal('0x00 0x01\n0x02 0x03\n0x04')
  })

  it('round-trips a wrapped hex dump', () => {
    const original = Base64Message.fromHex('000102030405060708090A0B0C0D0E0F10')
    const dump = Base64Message.toHex(original, 16)
    expect(dump).to.contain('\n')
    expect(Base64Message.toHex(Base64Message.fromHex(dump))).to.equal(Base64Message.toHex(original))
  })
})
