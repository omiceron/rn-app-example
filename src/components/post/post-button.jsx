import React, {Component} from 'react'
import PropTypes from 'prop-types'
import BasicButton from '../common/basic-button'
import {INACTIVE_BACKGROUND_COLOR, INACTIVE_TEXT_COLOR, WHITE_BACKGROUND_COLOR} from '../../constants'

class PostButton extends Component {
    static propTypes = {
        isActive: PropTypes.any,
        icon: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired
    }

    render() {
        return (
            <BasicButton
                {...this.props}
                size={20}
                activeBackgroundColor={WHITE_BACKGROUND_COLOR}
                inactiveBackgroundColor={INACTIVE_BACKGROUND_COLOR}
                color={INACTIVE_TEXT_COLOR}
            />
        )
    }
}

export default PostButton
