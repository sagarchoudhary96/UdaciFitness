import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { FontAwesome, Entypo} from '@expo/vector-icons'
import { white, gray, purple } from '../utils/colors'

export default function Usteppers({max, unit, step, value, onIncrement, onDecrement}) {
  return (
      <View style={[styles.row, {justifyContent: 'space-between'}]}>
        {Platform.OS==='ios'
          ?<View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={onDecrement} style={styles.iosButton}>
              <Entypo name='minus' size={30} color={purple}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={onIncrement} style={styles.iosButton}>
              <Entypo name='plus' size={30} color={purple}/>
            </TouchableOpacity>
          </View>
          :<View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={onDecrement} style={styles.androidButton}>
              <FontAwesome name='minus' size={30} color={white}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={onIncrement} style={styles.androidButton}>
              <FontAwesome name='plus' size={30} color={white}/>
            </TouchableOpacity>
          </View>
        }

        <View style={styles.metricCounter}>
          <Text style={{fontSize: 24, textAlign: 'center'}}>{value}</Text>
          <Text style={{fontSize: 18, color: gray}}>{unit}</Text>
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  iosButton: {
    backgroundColor: white,
    borderColor: purple,
    borderWidth: 1,
    borderRadius: 3,
    padding: 5,
    paddingLeft: 25,
    paddingRight: 25,
    marginLeft:2.5,
    marginRight:2.5
  },
  metricCounter: {
    width: 85,
    justifyContent: 'center',
    alignItems: 'center'
  },
  androidButton: {
    margin: 5,
    backgroundColor: purple,
    padding: 10,
    borderRadius: 2
  }
})
