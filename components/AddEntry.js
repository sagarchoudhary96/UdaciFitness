import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminderValue, clearLocalNotification, setLocalNotification } from '../utils/helper'
import Uslider from './Uslider'
import Usteppers from './Usteppers'
import DateHeader from './DateHeader'
import {Ionicons} from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions'
import { white, purple } from '../utils/colors'
import { NavigationActions } from 'react-navigation'

function SubmitBtn ({onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={Platform.OS === 'ios' ? styles.iosSubmitButton: styles.androidSubmitButton}>
      <Text style={styles.submitButtonText}>SUBMIT</Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {

  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  }

  increment = (metric) => {
    const {max, step } = getMetricMetaInfo(metric)
    this.setState((state)=> {
      const count = state[metric] + step

      return {
        ...state,
        [metric]: count > max ? max : count
      }
    })
  }

  decrement = (metric) => {
    this.setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step

      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      }
    })
  }

  slide = (metric, val) => {
    this.setState({
      [metric]: val
    })
  }

  submit = () => {
    const key = timeToString()
    const entry = this.state

    this.props.dispatch(addEntry({
      [key]: entry
    }))

    //clear the state
    this.setState({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    })
    //update redux
    //navigate to home
    //save to database
    this.toHome()
    submitEntry({key, entry})

    clearLocalNotification()
      .then(setLocalNotification)
  }

  reset = () => {
    const key = timeToString()

    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue()
    }))

    this.toHome()
    removeEntry(key)
  }

  toHome = () => {
    this.props.navigation.dispatch(NavigationActions.back({
      key: 'AddEntry',
    }))
  }

  render () {
    const metaInfo = getMetricMetaInfo()

    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.OS==='ios' ? 'ios-happy-outline' : 'md-happy'}
            size={100}/>
          <Text>You already logged your information for today.</Text>
          <TextButton onPress={this.reset} style={{padding: 10}}>RESET</TextButton>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <DateHeader date={(new Date()).toLocaleDateString()} />
        {Object.keys(metaInfo).map((key) => {
          const {getIcon, type, ...rest} = metaInfo[key]
          const val = this.state[key]

          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === 'slider'
              ? <Uslider
                  value={val}
                  onChange={(value)=> this.slide(key, value)}
                  {...rest}
                />
              : <Usteppers
                  value={val}
                  onIncrement={()=>this.increment(key)}
                  onDecrement={()=>this.decrement(key)}
                  {...rest}
                />
            }
            </View>
          )
        })}
        <SubmitBtn onPress={this.submit}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white
  },
  iosSubmitButton: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginRight: 40,
    marginLeft: 40
  },
  androidSubmitButton: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 2,
    height: 45,
    paddingRight: 30,
    paddingLeft: 30,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitButtonText: {
    color: white,
    fontSize: 22,
    textAlign: 'center'
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30
  }
})

mapStateToProps = (state) => {
  const key = timeToString()
  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined',

  }
}
export default connect(mapStateToProps)(AddEntry)
