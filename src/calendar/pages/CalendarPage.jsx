import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Navbar, CalendarEvent, CalendarModal } from "../"
import { addHours } from 'date-fns'
import { localizer, getMessagesES } from '../../helpers'
import { useState } from 'react'


  const events = [{
    title: "Cumpleaños del jefe",
    notes: "Hay que coprar el pastel",
    start: new Date(),
    end: addHours(new Date(), 2),
    bgColor:'#fafafa',
    user: {
        _id:'123',
        name: 'jose'
    }
  }]

 
export const CalendarPage = () => {

    const [lastView, setlastView] = useState(localStorage.getItem('lastView') || 'week')

    const eventStyleGetter = (event, start, end, isSelected) => {

        const style = {
            backgroundColor: '#347CCF7',
            borderRadius: '5px',
            opacity: 0.9,
            color:'white'
        }
        return{
            style
        }
    
      }

      const onDoubleClick = (event) => {
        console.log({event})

      }
      const onSelect = (event)  => {

      }
      const onViewChanged =(event) => {
        localStorage.setItem('lastView', event)

      }


    return(
        <>
            <Navbar />

            <Calendar
            culture='es'
                localizer={localizer}
                events={events}
                defaultView={lastView}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc(100vh - 80px' }}
                messages={getMessagesES()}
                eventPropGetter={eventStyleGetter}
                components={{
                    event: CalendarEvent
                }}
                onDoubleClickEvent={onDoubleClick}//sobre el evento
                onSelectEvent={onSelect}
                onView={onViewChanged}
            />

            <CalendarModal />
        </>
    )
}