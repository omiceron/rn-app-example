import React, {Component} from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import PropTypes from 'prop-types'
import Attachment from './attachment'
import {IMAGE_DIVIDER} from '../../constants'
import {chunk} from 'lodash'

class Attachments extends Component {
  static propTypes = {
    attachments: PropTypes.array.isRequired,
    maxSize: PropTypes.number.isRequired,
    lastRowBottomBorder: PropTypes.number
  }

  renderImagesRow = (rowImages, rowIndex, {length: rowsLength}) => {
    const {maxSize, attachments: {length}, lastRowBottomBorder} = this.props

    // const isLastRow = rowIndex === Math.floor(length / 2 - 1 + length % 2)
    // const isOnlyImage = isOnlyImageInRow && rowsLength === 1

    const isLastRow = rowIndex === rowsLength - 1
    const isOnlyImageInRow = rowImages.length === 1
    const isOnlyImage = length === 1
    const halfSize = (maxSize - IMAGE_DIVIDER) / 2

    const borderRadius = {
      borderBottomRightRadius: isLastRow ? lastRowBottomBorder : 0,
      borderBottomLeftRadius: isLastRow ? lastRowBottomBorder : 0
    }

    return (
      <View style = {[styles.row, lastRowBottomBorder && borderRadius]} key = {rowIndex}>
        {rowImages.map((image, imageIndex) => {

          const dividerStyle = {
            marginLeft: imageIndex === 1 ? IMAGE_DIVIDER : 0,
            marginTop: rowIndex === 0 ? 0 : IMAGE_DIVIDER
          }

          // TODO: Create universal wrappers for rows and cols with separator element
            return (
              <View style = {dividerStyle} key = {rowIndex + '_' + imageIndex}>
                <Attachment
                  {...image}
                  width = {isOnlyImageInRow ? maxSize : halfSize}
                  height = {isOnlyImage ? maxSize : halfSize}
                />
              </View>
            )
          }
        )}
      </View>
    )
  }

  renderImages = (images) => chunk(images, 2).map(this.renderImagesRow)

  render() {
    const {attachments} = this.props

    return <View style = {styles.container}>
      {this.renderImages(attachments)}
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden'
  }
})

export default Attachments