import React, {Component} from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated
} from 'react-native'
import {observer, inject} from 'mobx-react'
import SocialMedia from './social-media'
import InputRow from './auth-input-row'
import BackgroundImage from '../common/background-image'
import {config} from '../../config'
import Button from './button'
import withAnimation from '../common/with-animation'
import {bool, string, func, shape, objectOf, number} from 'prop-types'

import {
  DIVIDER_MARGIN_TOP,
  WINDOW_HEIGHT,
  STATUS_BAR_HEIGHT,
  LOGO,
  INPUT,
  FOOTER,
  BUTTON,
  KEYBOARD,
  TRANSLATE,
  Y,
  OPACITY,
  SCALE,
  AUTH_STORE,
  KEYBOARD_STORE, HIT_SLOP
} from '../../constants'

@inject(AUTH_STORE)
@inject(KEYBOARD_STORE)
@observer
class SignIn extends Component {

  static propTypes = {
    signUp: func.isRequired,
    getAnimation: func.isRequired,
    setLayout: func.isRequired,
    onFocus: func.isRequired,
    onBlur: func.isRequired,
    layouts: objectOf(objectOf(number)).isRequired,
    auth: shape({
      setEmail: func.isRequired,
      setPassword: func.isRequired,
      password: string.isRequired,
      signIn: func.isRequired,
      email: string.isRequired,
      isEmailValid: bool.isRequired,
      isPasswordValid: bool.isRequired,
      loginWithFacebook: func.isRequired,
      loginWithGoogle: func.isRequired
    }).isRequired
  }

  getAnimation = (type) => this.props.getAnimation(type, this.getOutputRange)

  getOutputRange = (type) => {
    const {layouts} = this.props

    switch (type) {

      case LOGO + SCALE:
        return [1, 0.5]

      case LOGO + TRANSLATE + Y:
        return [0, layouts[LOGO].height / 2]

      case INPUT + TRANSLATE + Y:
        return [0, STATUS_BAR_HEIGHT - layouts[INPUT].y - layouts[LOGO].height / 2]

      case BUTTON + TRANSLATE + Y: {
        const {y, height} = layouts[BUTTON]
        return [0, layouts[KEYBOARD].y - y + height]
      }

      case FOOTER + TRANSLATE + Y: {
        const {y} = layouts[FOOTER]
        const {height: keyboardHeight} = layouts[KEYBOARD]
        return [0, WINDOW_HEIGHT - DIVIDER_MARGIN_TOP - y - keyboardHeight * 3 / 4]
      }

      case FOOTER + OPACITY:
        return [1, 0]

      default:
        return [0, 1]
    }

  }

  renderLogo = () => {
    return <Animated.View
      onLayout = {this.props.setLayout(LOGO)}
      style = {[styles.row, {
        transform: [{
          scale: this.getAnimation(LOGO + SCALE)
        }, {
          translateY: this.getAnimation(LOGO + TRANSLATE + Y)
        }],
        marginVertical: 0
      }]}>
      <Text style = {[styles.titleText]}>
        <Text style = {styles.boldText}>
          Meow
        </Text>
        chat
      </Text>
    </Animated.View>
  }

  renderInput = () => {
    const {
      setEmail,
      setPassword,
      password,
      signIn,
      email,
      isEmailValid,
      isPasswordValid
    } = this.props.auth

    return <Animated.View
      onLayout = {this.props.setLayout(INPUT)}
      style = {{
        // flex: 4,
        // minHeight: 296,
        transform: [{translateY: this.getAnimation(INPUT + TRANSLATE + Y)}],
        justifyContent: 'flex-end'
      }}
    >
      {this.renderLogo()}

      <InputRow
        onChangeText = {setEmail}
        value = {email}
        onSubmitEditing = {() => this.textInput.focus()}
        keyboardType = 'email-address'
        placeholder = 'email'
        textContentType = 'username'
        clearButtonMode = 'while-editing'
        returnKeyType = 'next'
      />

      <InputRow
        onChangeText = {setPassword}
        onSubmitEditing = {signIn}
        value = {password}
        setRef = {ref => this.textInput = ref}
        placeholder = 'password'
        returnKeyType = 'done'
        textContentType = 'password'
        blurOnSubmit
        secureTextEntry
        visibilitySwitch
      />
      <Animated.View
        onLayout = {this.props.setLayout(BUTTON)}
        // style = {{transform: [{translateY: this.buttonTranslateY}]}}
      >
        <Button
          disabled = {!isEmailValid || !isPasswordValid}
          title = 'Sign in'
          onPress = {signIn}
        />

        <View style = {styles.row}>
          <TouchableOpacity
            hitSlop = {HIT_SLOP}
            onPress = {() => alert('forgot')}
          >
            <Text style = {styles.text}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>

      </Animated.View>

    </Animated.View>

  }

  renderDivider() {
    return <View style = {[styles.row, styles.dividerView]}>
      <View style = {styles.divider}/>
      <View style = {styles.dividerTextView}>
        <Text style = {styles.dividerText}>
          Or sign in with
        </Text>
      </View>
      <View style = {styles.divider}/>
    </View>
  }

  renderSocial() {
    return <View style = {styles.row}>
      <SocialMedia name = 'facebook' onPress = {this.props.auth.loginWithFacebook}/>
      <SocialMedia name = 'google-plus' onPress = {this.props.auth.loginWithGoogle}/>
      <SocialMedia name = 'vk'/>
    </View>
  }

  renderRegister() {
    const {signUp} = this.props
    return <View style = {styles.row}>

      <Text style = {styles.text}>
        Do not have an account?
      </Text>

      <TouchableOpacity
        hitSlop = {HIT_SLOP}
        onPress = {signUp}>
        <Text style = {[styles.text, styles.signUpButton]}>
          Sign up
        </Text>
      </TouchableOpacity>

    </View>

  }

  render() {
    return <BackgroundImage onPress = {this.props.keyboard.dismiss}
                            overlayOpacity = {0.2}
                            blurRadius = {5}
                            source = {require('../../../assets/images/splash.png')}
                            resizeMode = 'contain'
                            style = {{
                              backgroundColor: '#fff0c0'
                            }}

      // onPress = {() => this.onFocus({duration: 2000, endCoordinates: {height: 0, screenY: 0}})}
    >
      <SafeAreaView style = {styles.container}>
        {this.renderInput()}

        <Animated.View
          onLayout = {this.props.setLayout(FOOTER)}
          style = {{
            // flex: 3,
            // minHeight: 168,
            opacity: this.getAnimation(FOOTER + OPACITY),
            transform: [{translateY: this.getAnimation(FOOTER + TRANSLATE + Y)}]
          }}>

          {this.renderDivider()}
          {this.renderSocial()}
          {this.renderRegister()}
        </Animated.View>

      </SafeAreaView>
    </BackgroundImage>

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: 'center'
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'HelveticaNeue-Thin'
  },
  titleText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 50,
    fontFamily: 'HelveticaNeue-UltraLight'
  },
  boldText: {
    fontWeight: '600'
  },
  signUpButton: {
    fontWeight: '600',
    margin: 4
  },
  divider: {
    flex: 3,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255, .8)'
  },
  dividerTextView: {
    flex: 5,
    alignItems: 'center'
  },
  dividerText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'HelveticaNeue-Thin'
  },
  dividerView: {
    marginTop: DIVIDER_MARGIN_TOP
  },
  row: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 8
  }
})

export default withAnimation(SignIn, {
  layoutNames: [LOGO, INPUT, FOOTER, BUTTON, KEYBOARD]
})