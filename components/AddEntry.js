import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminderValue } from '../utils/helper'
import Uslider from './Uslider'
import Usteppers from './Usteppers'
import DateHeader from './DateHeader'
import {Ionicons} from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions'

function SubmitBtn ({onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}>
      <Text>SUBMIT</Text>
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
    submitEntry({key, entry})
    //clear notification
  }

  reset = () => {
    const key = timeToString()

    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue()
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
    removeEntry(key)
    //clear notification

  }

  render () {
    const metaInfo = getMetricMetaInfo()

    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons
            name='ios-happy-outline'
            size={100}/>
          <Text>You already logged your information for today.</Text>
          <TextButton onPress={this.reset}>RESET</TextButton>
        </View>
      )
    }
    return (
      <View>
        <DateHeader date={(new Date()).toLocaleDateString()} />
        {Object.keys(metaInfo).map((key) => {
          const {getIcon, type, ...rest} = metaInfo[key]
          const val = this.state[key]

          return (
            <View key={key}>
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

mapStateToProps = (state) => {
  const key = timeToString()
  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined',

  }
}
export default connect(mapStateToProps)(AddEntry)
