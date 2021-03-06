'use strict'

/**
 * adonis-asterisk-ami
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require('lodash')
const Base = require('./Base')

class AmiAction extends Base {
  static get commandName () {
    return 'ami:action'
  }

  /**
   * signature defines the requirements and name
   * of command.
   *
   * @return {String}
   */
  static get signature () {
    return `ami:action {action} {--props=@value} {--id=@value} {--debug?} {--host?} {--port?} {--username?} {--secret?}`
  }

  /**
   * description is the little helpful information displayed
   * on the console.
   *
   * @return {String}
   */
  static get description () {
    return 'Handle Asterisk AMI actions.'
  }

  /**
   * handle method is invoked automatically by ace, once your
   * command has been executed.
   *
   * @param  {Object} args    [description]
   * @param  {Object} options [description]
   */
  async handle (args, options) {
    await super.handle(args, options)

    let {
      props, id, debug
    } = options

    if (props) {
      props = _.split(props, ';')
      props = _.reduce(props, (result, value) => {
        if (value.length) {
          const colonIndex = value.indexOf(':')
          const k = value.substring(0, colonIndex)
          const v = value.substring(colonIndex + 1, value.length)
          result[k] = v
        }
        return result
      }, {})
    }
    props = props || {}
    props.Action = args.action
    if (id) {
      props.ActionID = id
    }

    const response = await this.Client.action(props, true)

    if (debug) {
      this.table(['key', 'value'], response)
    }

    this.Emitter.fire('ami.action.sended', response)

    this.Client.disconnect()

    return response
  }
}

module.exports = AmiAction
