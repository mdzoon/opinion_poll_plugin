document.getElementById("opinion-poll-btn").onclick = createPoll;

function createPoll() {
    var pollContainer = document.createElement("div");
    pollContainer.id = "opinion-poll";
    pollContainer.setAttribute("class", "op-container");

    var pollContainer_content = document.createTextNode("loop throught poll list");
    pollContainer.appendChild(pollContainer_content);

    var pollAnchor = document.getElementById("opinion-poll");
    var parentDiv = pollAnchor.parentNode;
    parentDiv.replaceChild(pollContainer, pollAnchor); 
};

function displayPoll() {
    let elements = document.querySelectorAll('[data-poll-atts]');

    elements.forEach( function( element ) {
        let atts = JSON.parse( element.getAttribute('data-poll-atts') );
        console.log(atts); //debug
        this.atts = atts;    
    });
};

function submitPoll() {
    if( null === this.selectedAnswer ) return; //do not run if no answer is selected
    var queryString = '?action=pk_submit_poll&id=' + this.atts.id + '&answer=' + this.selectedAnswer;
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
    var queryString = '?action=pk_get_poll_data&id=' + this.atts.id
    fetch( window.ajaxurl + queryString )
        .then( function(response) { return response.json() } )
        .then( function(json) {
            this.results = json;
            console.log(this.results);
        }.bind(this) );
};
