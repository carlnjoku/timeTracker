import React, { useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import { useStopwatch } from 'react-timer-hook';
import Appbar from './components/Appbar';
import { Grid, IconButton, Button } from '@material-ui/core';
import './App.css';
import userService from './services/userService';
import moment from 'moment-timezone';


const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

// This function is for padding the hour range minutes to 2 digit
  function pad(n, len) {
    let l = Math.floor(len)
    let sn = '' + n
    let snl = sn.length
    if(snl >= l) return sn
    return '0'.repeat(l - snl) + sn
}


function App() {
  const classes = useStyles();
  

  const[hourly_payment, setHourlyPayment] = useState('')
  const[timezone_name, setTimezname] = useState('')
  const[workbookId, setWorkbookId] = useState('')
  //const[localTime, setLocaltime] = useState('')
  const[start_time, setStartTime] = useState('')
  const[end_time, setEndTime] = useState('')
  const[hours_tracked, setHoursTracked] = useState('')
  const[isStart, setIsStart] = useState(true)
  const[isStop, setIsStop] = useState(false)

  

  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false });
   

    function addEntry(){
      const end_screenshot_time = moment().tz(`${timezone_name}`).format('HH:mm') // Stop time
      const end_screenshot_time_to_seconds = moment.duration(`${end_screenshot_time}`).asSeconds(); // Convert screenshot end time to seconds
      
      const ten_minutes_to_seconds = 10 * 60  // Convert ten minutes before the end_screenshot_time to seconds

      const difference_time = end_screenshot_time_to_seconds - ten_minutes_to_seconds // Difference between screenshot_to_seconds and ten_minutes_to_seconds
      const start_screenshot_time = moment.utc(difference_time*1000).format('HH:mm'); // Output start_screenshot_time
      
      
      // start time and end time
      var startTime = moment(start_screenshot_time, "HH:mm a");
      var endTime = moment(end_screenshot_time, "HH:mm a");
    
      // calculate total duration
      var duration = moment.duration(endTime.diff(startTime));

      // duration in hours
      var hours = parseInt(duration.asHours());

      console.log(hours)
      // duration in minutes
      var minutes = parseInt(duration.asMinutes())%60;
      var pad_minutes = pad(minutes, 2)

      const hours_w = moment.duration(hours+':'+pad_minutes).asSeconds()
      setHoursTracked(hours_w)

      const logged_date = moment().tz(`${timezone_name}`).format('ddd MMM DD YYYY')
      const data = {
              "workbookId" : workbookId,
              "contractId" : "609fa2b98342bc6832e346b5",
              "hourly_rate" : hourly_payment.hourly_rate,
              "start_time" : start_time,
              "end_time" : end_time,
              "start_screenshot_time": start_screenshot_time,
              "end_screenshot_time": end_screenshot_time,
              "task" : "Working on the homepage and signup",
              "hours_tracked" : hours_w,
              "total_daily_time_tracked" : hours_w,
              "logged_date" : logged_date
          }
      
      userService.addTimeAutomatically(data)
    }

    function onStopEntry(){
      
      
      // start time and end time

      var startTime = moment(start_time, "HH:mm");
      console.log(moment(start_time, "HH:mm").format('HH:mm'))
      var stopTime = moment().tz(`${timezone_name}`).format('HH:mm') // Stop time

      var endTime = moment(stopTime, "HH:mm: a")
      
      // calculate total duration
      var duration = moment.duration(endTime.diff(startTime));

      // duration in hours
      var hours = parseInt(duration.asHours());

      console.log(hours)
      // duration in minutes
      var minutes = parseInt(duration.asMinutes())%60;
      var pad_minutes = pad(minutes, 2)

      const hours_w = moment.duration(hours+':'+pad_minutes).asSeconds()
      setHoursTracked(hours_w)

      const logged_date = moment().tz(`${timezone_name}`).format('ddd MMM DD YYYY')
      const data = {
              "workbookId" : workbookId,
              "contractId" : "609fa2b98342bc6832e346b5",
              "hourly_rate" : hourly_payment.hourly_rate,
              "start_time" : start_time,
              "end_time" : endTime,
              "start_screenshot_time": moment(start_time, "HH:mm").format('HH:mm'),
              "end_screenshot_time": stopTime,
              "task" : "Working on the homepage and signup",
              "hours_tracked" : hours_w,
              "total_daily_time_tracked" : hours_w,
              "logged_date" : logged_date
          }
      
      userService.addTimeAutomatically(data)
    }

    useEffect(()=>{
      const contractId = "609fa2b98342bc6832e346b5"
      const freelancerId = "60279ba7f3a33532cb73a4dd"
      userService.getUser(freelancerId)
      .then(response => {
          const res = response.data.data

          const timezname = res.timezoneName
          setTimezname(timezname)
          // Check if workbook for the day exists 
          const logged_date = moment().tz(`${timezname}`).format('ddd MMM DD YYYY')
          userService.checkWkBook(logged_date)
          .then(response => {
                const res = response.data.data
                if(res){
                    setWorkbookId(res._id)
                    userService.getHourlyPaymentByFreelancer(freelancerId,contractId)
                    .then(response => {
                        const res = response.data.data;
                        setHourlyPayment(res)
                    })
                  
                }else{
                    userService.getHourlyPaymentByFreelancer(freelancerId,contractId)
                    .then(response => {
                        const res = response.data.data;
                        setHourlyPayment(res)
                        console.log(res)

                        const data = {
                            "freelancerId" : res.developerId,
                            "contractId" : res.contractId,
                            "title" : res.project_title,
                            "projectId" : res.projectId,
                            "hourly_rate" : res.hourly_rate,
                            // "task" : "Working on the homepage and signup",
                            // "hours_tracked" : 0,
                            "logged_date" : logged_date,
                            "total_daily_time_tracked" : 0,
                            "activities" : [],
                        }

                        // Create workbook
                        userService.createWorkBook(data)
                        .then(response => {
                          const res = response.data.data
                          setWorkbookId(res)
                          
                        })
                    })
                }
        
            })
      })

      
    },[])




    let intervalID;
    useEffect(() => {
        if (isRunning) {
          intervalID = setInterval(() => {
            console.log('Logs every minute');
            addEntry()
            
          }, 600000);
          
        }
          return () => clearInterval(intervalID);
      }, [isRunning]);

    
  


 


  return (
    <div className="App">
      <Appbar />
      <br />
      <Grid container spacing ={1}>
        <Grid item xs={12} sm={12} md ={12}>
          Hello world started 4550
            
          {/* <MyStopwatch  /> */}
          {hourly_payment.hourly_rate}

          <div style={{textAlign: 'center'}}>
            <h1>Colony Timer</h1>
            <p>Time Tracker ({workbookId})</p>
            {start_time}
            {end_time}
            <br />
            <br />

            <div style={{fontSize: '100px'}}>
              <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
            </div>
            <p>{isRunning ? 'Working'  : 'Not working'  }</p>
            
            
            {isStart && 
              <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<PlayArrowIcon fontSize="20" />}
              
              onClick={() => {
                start()
                const local_time = moment().tz(`${timezone_name}`).format('HH:mm a ');
                setStartTime(local_time)
                setIsStart(true)

              }}
            >
            </Button>
            }
            

            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<PauseIcon fontSize="20" />}
              
              onClick={() => {
                start()
                const local_time = moment().tz(`${timezone_name}`).format('HH:mm a ');
                setStartTime(local_time)
                setIsStop(true)

              }}
              
            >
              
            </Button>
            
            <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
            <button onClick={() => {
                start()
                const local_time = moment().tz(`${timezone_name}`).format('HH:mm a ');
                setStartTime(local_time)

              }
            }>
              Start
            </button>
            <button onClick={() => {
                pause()
                const local_time = moment().tz(`${timezone_name}`).format('HH:mm a ');
                setEndTime(local_time)
                onStopEntry()
              }
            }>
              Stop
            </button>
          </div>
        </Grid>
      </Grid>


      
      
    </div>
  );
}


export default App;





