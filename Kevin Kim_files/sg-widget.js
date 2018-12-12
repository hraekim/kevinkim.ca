document.addEventListener("DOMContentLoaded", function(event) {  
        var submit_btn = document.getElementById("sg-submit-btn");
        var wrapper = document.getElementById("sendgrid-subscription-widget");
        var form = document.getElementById("sg-widget");
        
        submit_btn.addEventListener("click",function(e){
            e.preventDefault();
            var email = '';

            if (document.getElementById('sg_email')) {
                email = stripHTML(document.getElementById('sg_email').value);
            } else {
                email = stripHTML(document.getElementById('email').value);
            }

            if(!email || !isValidEmailAddress(email)) {
                
                var email_error = 'Please enter a valid email address'
                if (typeof wrapper.dataset.emailerror != 'undefined') {
                    email_error = wrapper.dataset.emailerror;
                } 

                show_response(email_error, 'error');
                return;
            }

            if (document.getElementById('sg_consent_checkbox')) {
                sg_consent_checkbox = document.getElementById('sg_consent_checkbox');
                if (!sg_consent_checkbox.checked == true) {

                    var checkbox_error = 'Please tick the box to accept our conditions'
                    if (typeof wrapper.dataset.checkboxerror != 'undefined') {
                        checkbox_error = wrapper.dataset.checkboxerror;
                    }

                    show_response(checkbox_error, 'error');
                    sg_consent_checkbox.focus();
                    return;
                } 
            }

            submit_btn.disabled = true; 
            submitFormAjax();
          
        },false);
        
      
        function submitFormAjax()
        {
            var url = 'https://sgwidget.leaderapps.co/v2/api/newsletter-signup';
            //ar url = 'https://sgwidget.test/v2/api/newsletter-signup';
            
        
            
            var email = '';
            var first_name = '';
            var last_name = '';


            if (document.getElementById('sg_email')) {
                email = stripHTML(document.getElementById('sg_email').value);
            } else {
                email = stripHTML(document.getElementById('email').value);
            }

            if (document.getElementById('sg_signup_first_name')) {
                first_name = stripHTML(document.getElementById('sg_signup_first_name').value);
            }
            if (document.getElementById('sg_signup_last_name')) {
                last_name = stripHTML(document.getElementById('sg_signup_last_name').value);
            }

            var data = new FormData();
            data.append('email', email);
            data.append('first_name', first_name);
            data.append('last_name', last_name);
            data.append('token', form.dataset.token);

            var xmlhttp = window.XMLHttpRequest ?
                new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

            xmlhttp.open("POST", url, true);
            xmlhttp.onload = function () {
                var resp = JSON.parse(xmlhttp.responseText);
                if (xmlhttp.status == 200) {
                    if(resp.message.indexOf('error') !== -1) {
                        submit_btn.disabled = false; 
                        show_response(resp.message, 'error');
                    } else {
                        handle_successful_signup(resp, email, first_name, last_name)
                    }
                } else if (xmlhttp.status == 500) {
                    show_response(resp.message, 'error');

                }
            };
            xmlhttp.send(data);
        }

        function handle_successful_signup(response, email, first_name, last_name) {
            if (response.success_redirect_url && response.success_redirect_url != '') {
        
                response.success_redirect_url = response.success_redirect_url + "?email="+email;

                if (first_name != false) {
                    response.success_redirect_url = response.success_redirect_url + "&first_name="+first_name;
                }

                if (last_name != false) {
                    response.success_redirect_url = response.success_redirect_url + "&last_name="+last_name;
                }

                window.location = response.success_redirect_url;
            } else {
                show_response(response.message, 'success');
            }
        }

        function show_response(response, resp_class) {
            document.getElementById("sg-response").className = '';
            document.getElementById("sg-response").className += 'sg-response '+resp_class;
            document.getElementById("sg-response").innerHTML = response;
            document.getElementById("sg-response").style.display = 'block';
            return;
        }

        function stripHTML(text){
           var regex = /(<([^>]+)>)/ig;
           return text.replace(regex, "");
        }

        function isValidEmailAddress(emailAddress) {
            var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
            return pattern.test(emailAddress);
        };

    });
//# sourceMappingURL=sg-widget.js.map
