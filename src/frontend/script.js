//sshar374 SE3316 Lab4

//populate the questions
populateQuestions();

//get date from JSON file and then populate the questions accordingly
function populateQuestions() {
    //create and send a new AJAX request
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/questions", true);
    xhr.send();
    //fill questions on state change
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let question_block = document.getElementById("question_block");
            //parse question.JSON as the acting question db
            let qBank = JSON.parse(xhr.responseText);
            //define an empty page to fill content
            let page = "";
            //define initial question ID
            let q_id = 0;
            //display grade here
            page += "<div id='grade'></div>";
            page += `<form action=javascript:submitTest()>`;
            for (question of qBank) {
                //define question value
                let q_val = 0;
                //fill in each label with question text from the JSON db
                page += `<label class='question_text' id = ${q_id} value = "incorrect">${question.stem}</label>`;

                //fill each option
                for (option of question.options) {
                    //list options with ul and radio buttons
                    page += `<ul><input type="radio" onclick='javascript:provideFeedback(${q_val}, ${q_id})' id = ${q_id}${q_val} name=${q_id} value= ${q_val}>`;
                    page += `<label for="${option}">${option}</label></ul>`;
                    q_val++;
                }
                //division line for aesthetic purposes
                page += "<hr>";
                q_id++;
            }
            page += `<br><input type="submit" value="submit" id="submit" >`;
            page += "</form>";
            //populate html page without reloading
            question_block.innerHTML = page;
        }
    };
    //error handler
    xhr.error = () => {
        console.log("Error 1: cannot retrieve question");
    };
}

//provide instant feedback to user when a radio button is selected
function provideFeedback(value, id) {
    //new AJAX request
    let xhr = new XMLHttpRequest();
    //using GET, is asynchronous
    xhr.open("GET", "/feedback?value=" + value + "&id=" + id, true);
    //send request
    xhr.send();
    //check correctness of question on state change
    xhr.onreadystatechange = () => {
        //define empty alert window
        let alert_page = "";
        let id = "";
        if (xhr.readyState == 4 && xhr.status == 200) {
            if (xhr.responseText.substring(0, 7) == "Correct") {
                alert_page = "That's the correct answer!";
                id = xhr.responseText.substring(8, xhr.responseText.length - 1);
                document.getElementById(id).setAttribute("value", "Correct");
            } else {
                alert_page = "That is the incorrect answer.";
                id = xhr.responseText.substring(10, xhr.responseText.length - 1);
                document.getElementById(id).setAttribute("value", "Incorrect");
            }
            alert(alert_page);
        }
    };
    //error handler
    xhr.error = () => {
        console.log("Error 2: cannot retrieve feedback");
    };
}

//submit the test to check and display accuracy
function submitTest() {
    //new AJAX request
    let xhr = new XMLHttpRequest();
    //using GET, is asynchronous
    xhr.open("GET", "/questions", true);
    //send request
    xhr.send();
    //display user grade on state change
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            //parse question.JSON as question banks
            let qBank = JSON.parse(xhr.responseText);
            //get reference to the grade section
            let grade = document.getElementById("grade");
            let total = 0; //keep track of total question count
            let correct_count = 0; //ktrack questions already answered correctly
            //iterate through each question and check accuracy
            for (question of qBank) {
                if (document.getElementById(total).getAttribute("value") == "Correct") {
                    correct_count++;
                }
                total++;
            }
            //display final grade to the user
            grade.innerHTML =
                "You correctly answered " +
                correct_count +
                "/" +
                total +
                " (" +
                100 * (correct_count / total) +
                "%)";
        }
    };
    //error handler
    xhr.error = () => {
        console.log("Error 3: cannot retrieve grade");
    };
}