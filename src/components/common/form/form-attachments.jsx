import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { BLACK_TEXT_COLOR } from '../../../constants'
import TableRow from '../table/table-row'
import AttachedImagesRow from '../attachments/attached-images-row'
import AttachedLocation from '../../feed/attached-location'

class FormAttachments extends Component {
    static propTypes = {
        // style: View.propTypes.style,
        images: PropTypes.array,
        location: PropTypes.string
    }

    renderAttachedImagesRow = () => {
        const { images } = this.props

        return (
            <TableRow style={{ paddingHorizontal: 8 }}>
                <AttachedImagesRow attachments={images} />
            </TableRow>
        )
    }

    renderAttachedLocation = () => {
        const { location } = this.props

        return (
            <TableRow>
                <AttachedLocation disableIcon location={location} />
            </TableRow>
        )
    }

    render() {
        const { images, location } = this.props

        return (
            <React.Fragment>
                {images.length ? this.renderAttachedImagesRow() : null}
                {location ? this.renderAttachedLocation() : null}
            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        fontSize: 16,
        fontWeight: '100',
        color: BLACK_TEXT_COLOR
    }
})

export default FormAttachments
