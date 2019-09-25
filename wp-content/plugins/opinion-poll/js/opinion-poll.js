(function() {
    
    window.addEventListener('load', function() {

        document.getElementById("opinion-poll-btn").onclick = readPollData;

        // BOF helper functions

        function setAttributes(el, attrs) {
            for(let key in attrs) {
                el.setAttribute(key, attrs[key]);
            }
        };
        
        function removeClasses(els, attr) {
            for (var i = 0; i < els.length; i++) {
              els[i].classList.remove(attr)
            }
        };

        function getInputValue(text, el) {
            const labels = document.getElementById("opForm").getElementsByClassName("custom-control-label");
            for(let i = 0; i < labels.length; i++) {    
                if (text == labels[i].childNodes[0].nodeValue) {
                    labels[i].appendChild(el);
                };
            };
        };
        
        function getAnswerRatio(key) {
            var total = Object.values(this.results).reduce( function( acc, cur ) { return acc+cur; }, 0 );
            var count = parseInt(this.results[key], 10) || 0;
            return count + ' / ' + total;
        };
        
        function getAnswerStyle(key) {
            var total = Object.values(this.results).reduce( function( acc, cur ) { return acc+cur; }, 0 );
            var count = parseInt(this.results[key], 10) || 0;
            var percentage = Math.round((count / total) * 100);
            return percentage;
        };
        
        function animateResults(percentage, value) {
            var elm = document.getElementById("width-" + value);
            var width = 1;
            var id = setInterval(frame, 20);
            function frame() {
                if (width >= percentage) {
                    clearInterval(id);
                } else {
                    width++; 
                    elm.style.width = width + '%'; 
                }
            };
        };

        // EOF helper functions
        
        function readPollData() { 
            const elements = document.querySelectorAll('[data-poll-atts]'); //iterate through the object data 
            elements.forEach( function(element) {
                this.opData = JSON.parse( element.getAttribute('data-poll-atts') );
                createPoll();
            });
        };
        
        function createPoll() {
            const df = document.createDocumentFragment();
            const button = document.getElementById("opinion-poll-btn");
            let div = document.createElement("div");
            setAttributes(div,
                {
                    "class": "op-wrapper card"
                });
            let h4 = document.createElement("h4");
            setAttributes(h4,
                {
                    "class": "card-header"
                });
            h4.appendChild(document.createTextNode(this.opData.question));
            div.appendChild(h4);
        
            let form = document.createElement("form");
            form.addEventListener("submit", submitPoll);
            setAttributes(form,
                {
                    "id": "opForm",
                    "onsubmit": "return false"
                });
        
            let ul = document.createElement("ul");
            for (let [key, value] of Object.entries(this.opData.answers)) {
                let input = document.createElement("input");
                setAttributes(input, 
                    {
                        "class": "custom-control-input",
                        "type": "radio",
                        "id": "answer-" + key,
                        "name": "answer",
                        "value": value,
                    });
                let label = document.createElement("label");
                setAttributes(label, 
                    {   
                        "class": "custom-control-label",
                        "for": "answer-" + key,
                    });
                let li = document.createElement("li");
                setAttributes(li, 
                    {
                        "class": "custom-control custom-radio mt-3"
                    });
                label.append(document.createTextNode(value));
                li.appendChild(input);
                li.appendChild(label);
                ul.appendChild(li);
            };
            form.appendChild(ul);
        
            let btn = document.createElement("button");
            setAttributes(btn, 
                {   
                    "type": "submit",
                    "class": "btn btn-outline-primary",
                });
            btn.appendChild(document.createTextNode("Cast your vote"));
        
            let span = document.createElement("span");
                setAttributes(span,
                    {
                        "class": "invalid-feedback text-center"
                    });
                span.appendChild(document.createTextNode("Please choose the answer first!"));
            form.appendChild(span);
            
            form.append(btn);
        
            div.appendChild(form);
            df.appendChild(div);
            button.parentNode.replaceChild(df, button);
        };

        function submitPoll() {
            this.selectedAnswer = document.forms.opForm.answer.value;
            if ("" === this.selectedAnswer) {
                document.getElementsByClassName("invalid-feedback")[0].classList.add("show-error");
                return;
            } else {
                document.getElementsByClassName("invalid-feedback")[0].classList.remove("show-error"); 
            }
            const queryString = '?action=submit_poll_data&id=' + opData.id + '&answer=' + this.selectedAnswer;
            fetch(window.ajaxurl + queryString).then( function() {
               getPollData();
            }.bind(this) );
        };
        
        function getPollData() {
            var queryString = '?action=get_poll_data&id=' + this.opData.id
            fetch( window.ajaxurl + queryString )
                .then( function(response) { return response.json() } )
                .then( function(json) {
                    this.results = json;
                         
                    for (let [key, value] of Object.entries(this.results)) {
                        let p = document.createElement("p");
                        setAttributes(p, 
                            {
                                "class": "op-results"
                            });
                        p.appendChild(document.createTextNode(getAnswerRatio(key)));
                        let span = document.createElement("span");
                        setAttributes(span, 
                            {   
                                "id": "width-" + value,
                                "class": "rounded-right rounded-lg"
                            });
                        p.appendChild(span);
                        getInputValue(document.createTextNode(key).nodeValue, p);
                        animateResults(getAnswerStyle(key), value);
                    };
                
                let labels = document.getElementById("opForm").getElementsByTagName("label");
                removeClasses(labels, "custom-control-label");

                btn = document.getElementById("opForm").querySelector("button");
                btn.parentNode.removeChild(btn);
                                   
                }.bind(this) );
        };

    }, false);
})();
