#!/usr/bin/env node
/* eslint-disable no-console */
'use strict'

const _ = require('lodash')
const readline = require('readline')
const socket = require('socket.io-client')
const minimist = require('minimist')
const clc = require('cli-color')

const argv = minimist(process.argv.slice(2))
const host = argv._[0]

let client

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function listenAllEvents() {
  let onevent = client.onevent

  client.onevent = function temp(packet) {
    let args = packet.data || []
    onevent.call(this, packet) // original call
    packet.data = ['*'].concat(args)
    onevent.call(this, packet)
  }

  client.on('*', (event, data) => {
    console.log()
    if (event === 'server_log') {
      if (data.level >= 10 && data.level < 20) {
        console.log(`DEBUG: ${data.message}`)
      }
      if (data.level >= 20 && data.level < 30) {
        console.log(`DEBUG: ${data.message}`)
      }
      if (data.level >= 30 && data.level < 40) {
        console.log(clc.cyan(`INFO: ${data.message}`))
      }
      if (data.level >= 40 && data.level < 50) {
        console.log(clc.magenta(`WARN: ${data.message}`))
      }
      if (data.level >= 50 && data.level < 60) {
        console.log(clc.red(`ERROR: ${data.message}`))
      }
      if (data.level >= 60) {
        console.log(clc.redBright(`FATAL: ${data.message}`))
      }
    } else {
      process.stdout.write(`${clc.blueBright(event)}: `)
      console.log(JSON.stringify(data, null, 2))
    }
    process.stdout.write('> ')
  })
}

function startConsole() {
  rl.setPrompt('> ')
  rl.prompt()

  rl.on('line', (input) => {
    let trimmed = _.trim(input)
    trimmed += ' '

    let command = trimmed.slice(0, trimmed.indexOf(' '))
    let data = trimmed.slice(trimmed.indexOf(' ') + 1)

    if (command === 'close') {
      return rl.close()
    }

    if (data) {
      try {
        // eslint-disable-next-line no-eval
        data = eval(`(${data})`)
      } catch (err) {
        console.log('Error with data:', clc.red(err.message))
        return rl.prompt()
      }
    } else {
      data = undefined
    }
    console.log('sending', clc.blueBright(command))
    client.emit(command, data)
    rl.prompt()
  })
  rl.on('close', () => {
    client.close()
  })
}

function displayHelp() {
  console.log('Salt Node Client')
  console.log('')
  console.log('NAME:')
  console.log('    ./client.js -- Connect to remote socket io server')
  console.log('')
  console.log('SYNOPSIS')
  console.log('    ./client.js host')
  console.log('')
  console.log('DESCRIPTION')
  console.log('    Starts a console client to run commands and debug')
  console.log('    events from the target socket io server.')
  console.log('')
  console.log('    host')
  console.log('        Full url to the target server')
  console.log('')
  process.exit(1)
}

if (!host) {
  displayHelp()
}

console.log('Connecting to:', clc.cyan(host))
client = socket(host, { reconnection: true })
listenAllEvents()

client.on('connect_error', () => {
  console.log(clc.red('Unable to connect to server'))
})

client.on('disconnect', () => {
  console.log()
  console.log(clc.red('Disconnected from server'))
})

client.on('connect', () => {
  console.log(clc.green('Connection established'))
  startConsole()
})
