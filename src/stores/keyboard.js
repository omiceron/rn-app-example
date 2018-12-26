import {observable, action} from 'mobx'
import {Keyboard} from 'react-native'
import BasicStore from "./basic-store"

class KeyboardStore extends BasicStore {
  constructor(...args) {
    super(...args)

    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
    Keyboard.addListener('keyboardDidShow', this.keyboardDidShow)

  }

  @observable isInTransition = false

  @action keyboardWillShow = () => this.isInTransition = true
  @action keyboardDidShow = () => this.isInTransition = false

  dismiss = () => {
    // if (!this.isInTransition) {
      Keyboard.dismiss()
    // }
  }

}

export default KeyboardStore