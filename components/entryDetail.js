import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { white } from '../utils/colors'
import MetricCard from './metricCard'
import { addEntry } from '../actions'
import { removeEntry } from '../utils/api'
import { timeToString, getDailyReminderValue } from '../utils/helper'
import TextButton from './TextButton'

class EntryDetail extends Component {

  static navigationOptions = ({navigation}) => {
    const { entryId } = navigation.state.params

    const year = entryId.slice(0,4)
    const month =  entryId.slice(5,7)
    const day = entryId.slice(8)

    return {
      title: `${month}/${day}/${year}`
    }
  }

  reset = () => {
    const { remove, goBack, entryId } = this.props

    remove()
    goBack()
    removeEntry(entryId)
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.metrics !== null && !nextProps.metrics.today
  }

  render () {
    const { metrics } = this.props
    return (
      <View style={styles.container}>
        <MetricCard metrics = {metrics}/>
        <TextButton onPress={this.reset} style={{margin: 20}}>
          RESET
        </TextButton>
      </View>
    )
  }
}

mapStateToProps = (state, { navigation }) => {
  const { entryId } = navigation.state.params
  return {
    entryId,
    metrics: state[entryId]
  }
}

mapDispatchToProps = (dispatch, {navigation}) => {
  const { entryId } = navigation.state.params
  return {
    remove: () => dispatch(addEntry({
      [entryId]: timeToString() === entryId
        ? getDailyReminderValue()
        : null
    })),
    goBack: () => navigation.goBack()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail)
