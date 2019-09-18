document.getElementById("opinion-poll-btn").onclick = createPoll;

function setAttributes(el, attrs) {
    for(let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
} //helper function

function createPoll() {
    let elements = document.querySelectorAll('[data-poll-atts]');

    elements.forEach( function( element ) {
        
        let opData = JSON.parse( element.getAttribute('data-poll-atts') );
            this.opData = opData; //?
        
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
            form =document.createElement("form");
            setAttributes(form, {
                "onsubmit": "alert('Submit!'); return false"
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

    console.log(opData); //debug
    for (let [key, value] of Object.entries(opData.answers)) {
        let answer = key
        document.getElementById(answer).onclick = console.log('You clicked answer No: ' + answer);
    }
}; 

function submitPoll() {
    if (null === this.selectedAnswer) return; //do not run if no answer is selected
    var queryString = '?action=op_submit_poll&id=' + this.opData.id + '&answer=' + this.selectedAnswer;
    console.log(queryString); //debug
    fetch(window.ajaxurl + queryString).then( function() {
        this.$emit('submitted');
        console.log('submitted!'); //debug
    }.bind(this) );
};

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
