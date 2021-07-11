import React, {Component, PureComponent} from 'react'
import {View, Text, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Animated} from 'react-native'
import {observer, inject} from 'mobx-react'
import {bool, string, func, shape, objectOf, number} from 'prop-types'
import InputRow from './auth-input-row'
import BackgroundImage from '../ui/background-image'
import Button from './button'
import BackButton from './auth-back-button'
import withAnimation from '../ui/with-animation'
import {BACK_BUTTON_HEIGHT, AUTH_STORE, KEYBOARD_STORE, INPUT, TITLE, TRANSLATE, Y, OPACITY} from '../../constants'

@inject(KEYBOARD_STORE)
@inject(AUTH_STORE)
@observer
@withAnimation(INPUT, TITLE)
class SignUp extends Component {
    static propTypes = {
        getAnimation: func.isRequired,
        setLayout: func.isRequired,
        onFocus: func.isRequired,
        onBlur: func.isRequired,
        layouts: objectOf(objectOf(number)).isRequired,
        auth: shape({
            setSignUpEmail: func.isRequired,
            setSignUpPassword: func.isRequired,
            signUpEmail: string.isRequired,
            signUpPassword: string.isRequired,
            signUp: func.isRequired,
            isSignUpEmailValid: bool.isRequired,
            isSignUpPasswordValid: bool.isRequired,
            firstName: string.isRequired,
            setFirstName: func.isRequired,
            isFirstNameValid: bool.isRequired
        })
    }

    getAnimation = (type) => this.props.getAnimation(type, this.getOutputRange)

    getOutputRange = (type) => {
        const {layouts} = this.props

        switch (type) {
            case INPUT + TRANSLATE + Y:
                return [0, -layouts[TITLE].y - layouts[TITLE].height - 8]

            case TITLE + OPACITY:
                return [1, 0]

            default:
                return [0, 1]
        }
    }

    renderTitle = () => {
        return (
            <Animated.View
                onLayout={this.props.setLayout(TITLE)}
                style={[
                    styles.title,
                    {
                        opacity: this.getAnimation(TITLE + OPACITY),
                        transform: [
                            {
                                translateY: this.getAnimation(INPUT + TRANSLATE + Y)
                            }
                        ]
                    }
                ]}
            >
                <Text style={styles.titleText}>Enter your first name, e-mail and password to register</Text>
            </Animated.View>
        )
    }

    renderInput = () => {
        const {
            setSignUpEmail,
            setSignUpPassword,
            signUpEmail,
            signUpPassword,
            signUp,
            isSignUpEmailValid,
            isSignUpPasswordValid,
            firstName,
            setFirstName,
            isFirstNameValid
        } = this.props.auth

        const {setLayout} = this.props

        return (
            <Animated.View
                onLayout={setLayout(INPUT)}
                style={{
                    flex: 2,
                    transform: [
                        {
                            translateY: this.getAnimation(INPUT + TRANSLATE + Y)
                        }
                    ]
                }}
            >
                <InputRow
                    onChangeText={setFirstName}
                    onSubmitEditing={() => this.emailInput.focus()}
                    value={firstName}
                    placeholder="first name"
                    textContentType="givenName"
                    clearButtonMode="while-editing"
                    returnKeyType="next"
                />

                <InputRow
                    onChangeText={setSignUpEmail}
                    onSubmitEditing={() => this.passwordInput.focus()}
                    setRef={(ref) => (this.emailInput = ref)}
                    value={signUpEmail}
                    keyboardType="email-address"
                    placeholder="email"
                    textContentType="username"
                    clearButtonMode="while-editing"
                    returnKeyType="next"
                />

                <InputRow
                    onChangeText={setSignUpPassword}
                    onSubmitEditing={signUp}
                    value={signUpPassword}
                    setRef={(ref) => (this.passwordInput = ref)}
                    placeholder="password"
                    returnKeyType="done"
                    textContentType="password"
                    blurOnSubmit
                    secureTextEntry
                    visibilitySwitch
                />

                <Button
                    disabled={!isSignUpEmailValid || !isSignUpPasswordValid || !isFirstNameValid}
                    title="Sign up"
                    onPress={signUp}
                    loading={this.props.auth.loading}
                />
            </Animated.View>
        )
    }

    render() {
        // return <BackgroundImage
        //   onPress = {this.props.keyboard.dismiss}
        //   overlayOpacity = {0.2}
        //   blurRadius = {5}
        // >
        return (
            <TouchableWithoutFeedback onPress={this.props.keyboard.dismiss}>
                <SafeAreaView style={{flex: 1, backgroundColor: '#7a839e'}}>
                    <View style={styles.container}>
                        <BackButton />
                        <View style={styles.content}>
                            {this.renderTitle()}
                            {this.renderInput()}
                        </View>
                        <View style={styles.bottom} />
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        )

        // </BackgroundImage>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 8,
        backgroundColor: '#7a839e'
    },
    content: {
        flex: 1,
        justifyContent: 'center'
    },
    titleText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 28,
        fontFamily: 'HelveticaNeue-UltraLight'
    },
    title: {
        flex: 1,
        justifyContent: 'flex-end',
        marginHorizontal: 32
    },
    bottom: {
        height: BACK_BUTTON_HEIGHT
    }
})

export default SignUp
