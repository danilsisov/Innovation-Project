import './App.css';

function DatesSelect() {
    async function datesSubmit(e) {
        e.preventDefault();
        let dateInput1 = document.getElementById('date_input1').value;
        let dateInput2 = document.getElementById('date_input2').value;
        let userInput = document.getElementById('user_id').value;

        if (dateInput1 > dateInput2) {
            alert("The 1st date must be before the 2nd date!");
            return false;
        }

        const response = await fetch('http://localhost:3001/datesSelect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "searched_uid": userInput,
                "date1": dateInput1,
                "date2": dateInput2,
            })
        });
        console.log("Submitted " + dateInput1 + " to " + dateInput2);
        return response.json();
    }


    return (
        <form onSubmit={datesSubmit}>
            <div className='dateInput'>
                <label htmlFor="user_id"> User ID:</label>
                <input type="text" id="user_id" name="user_id" required></input>
                <label htmlFor="name">From:</label>
                <input type="date" id="date_input1" name="date_input1"/>
                <label htmlFor="name">To:</label>
                <input type="date" id="date_input2" name="date_input2" required/>
                <input type="submit" value="Submit"/>
            </div>
        </form>
    )
}

export default DatesSelect;