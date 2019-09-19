import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Attachment from '../attachment'
import {IMAGE_SEPARATOR_SIZE} from '../../../constants'
import {chunk} from 'lodash'
import BasicList from '../basic-list'
import BasicRow from '../basic-row'
import RowSeparator from './row-separator'
import ColumnSeparator from './column-separator'

// const isLastRow = rowIndex === Math.floor(attachments.length / 2 - 1 + attachments.length % 2)
// const isOnlyImage = isOnlyImageInRow && rows.length === 1

class Attachments extends Component {
  static propTypes = {
    attachments: PropTypes.array.isRequired,
    maxSize: PropTypes.number.isRequired,
    lastRowBottomBorder: PropTypes.number
  }

  render() {
    const {maxSize, attachments, lastRowBottomBorder} = this.props

    const COLUMNS_NUMBER = 2
    const halfSize = (maxSize - IMAGE_SEPARATOR_SIZE) / COLUMNS_NUMBER
    const isOnlyImage = attachments.length === 1
    const attachmentHeight = isOnlyImage ? maxSize : halfSize

    const rows = chunk(attachments, COLUMNS_NUMBER)

    return (
      <BasicList separator = {ColumnSeparator}>
        {rows.map((imagesRow, rowIndex) => {
          const isOnlyImageInRow = imagesRow.length === 1
          const attachmentWidth = isOnlyImageInRow ? maxSize : halfSize

          const style = {}
          const isLastRow = rowIndex === rows.length - 1

          if (lastRowBottomBorder && isLastRow) {
            style.borderBottomRightRadius = lastRowBottomBorder
            style.borderBottomLeftRadius = lastRowBottomBorder
          }

          return (
            <BasicRow key = {`row-${rowIndex}`} separator = {RowSeparator} style = {style}>
              {imagesRow.map((image) => (
                  <Attachment
                    {...image}
                    width = {attachmentWidth}
                    height = {attachmentHeight}
                  />
                )
              )}
            </BasicRow>
          )
        })}
      </BasicList>
    )
  }
}

export default Attachments
