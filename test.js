const string = require('glsl-token-string')
const tokenize = require('glsl-tokenizer')
const Shader = require('gl-shader')
const test = require('tape')
const path = require('path')
const trim = require('./')
const fs = require('fs')
const GL = require('gl')

const fixtures = path.join(__dirname, 'fixtures')
const src = fs.readFileSync(path.join(fixtures, 'base.glsl'), 'utf8')
const vert = fs.readFileSync(path.join(fixtures, 'base.vert'), 'utf8')

test('glsl-token-whitespace-trim: newlines', function (t) {
  const expected = fs.readFileSync(path.join(fixtures, 'base-newlines.glsl'), 'utf8').trim()
  const tokens = trim(tokenize(src))
  const gl = GL(2, 2)

  t.equal(string(tokens).trim(), expected)
  t.ok(Shader(gl, vert, string(tokens)), 'shader compiled successfully')
  t.end()
})

test('glsl-token-whitespace-trim: padded (sanity check)', function (t) {
  const expected = fs.readFileSync(path.join(fixtures, 'base-padded.glsl'), 'utf8').trim()
  const tokens = pad(tokenize(src))

  t.equal(string(tokens).trim(), expected)
  t.end()
})

test('glsl-token-whitespace-trim: all', function (t) {
  const expected = fs.readFileSync(path.join(fixtures, 'base-all.glsl'), 'utf8').trim()
  const tokens = trim(pad(tokenize(src)), true)
  const gl = GL(2, 2)

  t.equal(string(tokens).trim(), expected)
  t.ok(Shader(gl, vert, string(tokens)), 'shader compiled successfully')
  t.end()
})

function pad (tokens) {
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i].type !== 'whitespace') continue
    tokens.splice(i++, 0, { type: 'whitespace', data: '\n\n\n\n\n\n\n\n\n\n\n\n' })
  }

  return tokens
}
