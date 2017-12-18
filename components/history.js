import React, { Component } from 'react'
import {View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { receiveEntries, addEntry } from '../actions'
import { timeToString, getDailyReminderValue} from '../utils/helper'
import { fetchCalendarResults } from '../utils/api'
import UdaciFitnessCalendar from 'udacifitness-calendar'
import { white } from '../utils/colors'
import DateHeader from './DateHeader'
import MetricCard from './metricCard'
import { AppLoading } from 'expo'

class History extends Component {

  state = {
    isReady: false
  }
  componentDidMount() {
      fetchCalendarResults()
        .then((entries) => this.props.dispatch(receiveEntries(entries)))
        .then(({entries}) => {
          if(!entries[timeToString()]) {
            this.props.dispatch(addEntry({
              [timeToString()]: getDailyReminderValue()
            }))
          }
        })
        .then (() => this.setState({isReady: true}))
  }

  renderItem = ({today, ...metrics}, formattedDate, key)=>(
    <View style={styles.item}>
      {today
        ?<View>
          <DateHeader date={formattedDate} />
          <Text style={styles.noDataText}> {today} </Text>
        </View>
        : <TouchableOpacity onPress={()=>console.log("pressed")}>
          <MetricCard metrics = {metrics} date = {formattedDate}/>
        </TouchableOpacity>
      }
    </View>
  )

  renderEmptyDate = (formattedDate) => (
    <View style={styles.item}>
      <DateHeader  date={formattedDate}/>
      <Text style={styles.noDataText}>
        You didn't log any data on this day.
      </Text>
    </View>
  )

  render() {

    if (this.state.isReady === false) {
      return (<AppLoading/>)
    }

    return (

        <UdaciFitnessCalendar
          items={this.props.entries}
          renderItem={ this.renderItem }
          renderEmptyDate={ this.renderEmptyDate }
          />
    )
  }
}

styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    borderRadius: Platform.OS ==='ios'? 16 : 2,
    padding: 20,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 17,
    justifyContent: 'center',
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0,0,0,0.24)',
    shadowOffset: {
      width: 0,
      height: 3
    }
  },
  noDataText: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20
  }
})

mapStateToProps = (entries) => ({entries})

export default connect(mapStateToProps)(History)
