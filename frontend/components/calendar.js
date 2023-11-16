import React from 'react'
import { useRouter } from 'next/router'
import Router from 'next/router'
import { decrypt } from '../utils/utils.js'
import { setCookie, getCookie } from 'cookies-next'
import FullCalendar, { render } from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick

export default class Calendar extends React.Component {
    
    calendarRef = React.createRef();
    
    render() {
        return (
            <div>

                <FullCalendar
                    initialView="dayGridMonth"
                    headerToolbar={{
                        start: 'prev,next today',
                        center: 'title',
                        end: 'dayGridMonth,dayGridWeek,timeGridDay',
                    }}

                    forceEventDuration={true}
                    defaultTimedEventDuration={'00:30'}

                    editable={false}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEventRows={true}
                    allDaySlot={true}

                    dateClick={this.handleDateClick}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    dayRender={this.assignLogoMonth}
                    ref={this.calendarRef}
                    events={JSON.parse(this.props.events)}

                    eventClick={this.handleEventClick}
                />
            </div>
        )
    }

    handleDateClick = dateClickInfo => {
        this.calendarRef.current
            .getApi()
            .changeView('timeGridDay', dateClickInfo.date)
    };

    handleEventClick = async (info) => {
        const Swal = require('sweetalert2')

        if (info.event.allDay != true) {
            Swal.fire({
                icon: 'info',
                title: 'Inspection',
                html:
                    '<ul><li>Address: ' + info.event.title + '</li><li>Start Time: ' + info.event.start + '</li><li>Duration: 30 minutes</li><li><b>Select OK to View Property Details<b></li></ul> ',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonColor: 'teal',
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    Router.push('/edit_property?id=' + info.event.id)
                } 
            })
            
        }

    };

};

// grab each tentative itinerary's locations & times
//var data = [{ "id": "1", "title": "1 Pleasant Avenue, The Ponds", "start": "2022-11-16T12:30", "end": "2022-11-02T16:00" }, { "id": "2", "title": "10 Drive St, Balmain", "start": "2022-11-02T14:00:00", "end": "2022-11-02T14:30:00" }];
