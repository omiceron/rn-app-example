import React, {Component} from 'react'
import {SafeAreaView, StyleSheet, Text, ScrollView} from 'react-native'
import {MapView, Permissions, Location} from 'expo'
import PropTypes from 'prop-types'
import AttachedMap from './attached-map'
import TableView from '../common/table-view'
import TableRow from '../common/table-row'
import {REGION_DELTAS} from '../../constants'

class Post extends Component {
  static propTypes = {
    post: PropTypes.shape({
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      coords: PropTypes.object
    }).isRequired
  }

  render() {
    const {title, text, coords} = this.props.post

    const renderMap = () => {
      if (!coords) return null

      return <MapView
        style = {styles.mapView}
        initialRegion = {{...coords, ...REGION_DELTAS}}
      >
        <MapView.Marker
          coordinate = {{...coords}}
        />
      </MapView>

    }

    return <TableView scrollable>
        <TableRow disableSeparator>
          <Text style = {styles.title}>
            {title}
          </Text>
        </TableRow>
        <TableRow>
          <Text style = {styles.text}>
            {text}
          </Text>
        </TableRow>
      {renderMap()}
    </TableView>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 30,
    fontWeight: '100'
  },
  text: {
    fontSize: 20,
    fontWeight: '100'
  },
  mapView: {
    height: 100
  },
})

export default Post