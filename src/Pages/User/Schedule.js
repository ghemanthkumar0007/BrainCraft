import React from 'react'

function Schedule() {
    function Iframe(props) {
        return (<div dangerouslySetInnerHTML={ {__html:  props.iframe?props.iframe:""}} />);
      }
      const iframe = '<iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=Asia%2FKolkata&src=YW5pcnVkaC5iaGFyYWR3YWoyMDIxQHZpdHN0dWRlbnQuYWMuaW4&src=Y19jYjJkMmVlNzYyNzkzMjkwM2Q4MGJmZTJjNmJkNmExZjY3NTk5YmU1NDBkOGU5ZjIzZmI4ODAyZmRmYmNjNjJiQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&src=Y181OWFkMWI0YWVmMmViMmI5ZDE3YTBkYjg1ZTBlZTk2ZTFlYjk0ZmQyMWRmNDdjMzRjNDM1YjI0Y2EwMDUyOWM3QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23039BE5&color=%239E69AF&color=%23009688" style="border:solid 1px #777" width="800" height="600" frameBorder="0" scrolling="no"></iframe>'
  return (
    <div>
        <Iframe iframe={
        iframe
        } />
    </div>
  )
}

export default Schedule