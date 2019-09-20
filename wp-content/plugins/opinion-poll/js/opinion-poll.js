document.getElementById("opinion-poll-btn").onclick = createPoll;

function setAttributes(el, attrs) {
    for(let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
} //helper function

function createPoll() {
    let elements = document.querySelectorAll('[data-poll-atts]');

    elements.forEach( function( element ) {
        
        this.opData = JSON.parse( element.getAttribute('data-poll-atts') );
        
        let pollContainer = document.createElement("div")
            setAttributes(pollContainer,
                {
                    "id": this.opData.id,
                    "class": "op-container"
                });
        
        let anchorNode = document.getElementById("opinion-poll")
            parentDiv = anchorNode.parentNode;
            parentDiv.replaceChild(pollContainer, anchorNode);

        let h4 = document.createElement("h4"),
            tn = document.createTextNode(this.opData.question)
            h4.appendChild(tn);
        
        pollContainer.appendChild(h4);

        let df = document.createDocumentFragment();
            df = document.getElementById(this.opData.id)
            form = document.createElement("form");
            setAttributes(form, {
                "id": "opForm",
                "onsubmit": "submitPoll(); return false"
            })
            ul = document.createElement("ul");

            for (let [key, value] of Object.entries(this.opData.answers)) {
                tn = document.createTextNode(value);
                input = document.createElement("input");
                setAttributes(input, 
                    {
                        "class": "custom-control-input",
                        "type": "radio",
                        "id": "answer-" + key,
                        "name": "answer",
                        "value": value,
                    });
                label = document.createElement("label");
                setAttributes(label, 
                    {   
                        "class": "custom-control-label",
                        "for": "answer-" + key
                    })
                li = document.createElement("li");
                setAttributes(li, 
                    {
                        "class": "custom-control custom-radio"
                    })
                label.append(tn);
                li.appendChild(input);
                li.appendChild(label);
                ul.appendChild(li);
            };
            form.appendChild(ul);

            let button = document.createElement("button");
                tn = document.createTextNode("Submit");
                setAttributes(button, 
                    {
                        "type": "submit",
                        "class": "btn btn-outline-primary"
                    });
            button.appendChild(tn);
            form.append(button);

        df.appendChild(form);
    });
}; 

function submitPoll() {
    this.selectedAnswer = document.forms.opForm.answer.value

    if (null === this.selectedAnswer) return; //do not run if no answer is selected

    var queryString = '?action=submit_poll_data&id=' + this.opData.id + '&answer=' + this.selectedAnswer;
    fetch(window.ajaxurl + queryString).then( function() {
       alert(this.selectedAnswer + ' - submitted!'); //debug
    }.bind(this) );
};

//function displayPollResults()


function getAnswerRatio( key ) {
    var total = Object.values(this.results).reduce( function( acc, cur ) { return acc+cur; }, 0 );
    var count = parseInt(this.results[key], 10) || 0;
    return count + ' / ' + total;
};

function getAnswerStyle( key ) {
    var total = Object.values(this.results).reduce( function( acc, cur ) { return acc+cur; }, 0 );
    var count = parseInt(this.results[key], 10) || 0;
    var percentage = (count / total) * 100;
    return 'width: '+ percentage + '%';
};

function getPollData() {
    var queryString = '?action=op_get_poll_data&id=' + this.atts.id
    fetch( window.ajaxurl + queryString )
        .then( function(response) { return response.json() } )
        .then( function(json) {
            this.results = json;
            console.log(this.results);
        }.bind(this) );
};
