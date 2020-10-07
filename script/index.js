/**
 * This function shows compose on the third column on click
 * after hiding the instructions
 * @Tushar
 */
function showCompose() {
  //hides the instructions about clicking the mail to read
  $("#select-mail-ins").css("display", "none");

  //Clears all the input fields
  $(".input-group input").val("");
  $("#send-msg").val("");

  //Displays the compose column
  $("#compose").css("display", "block");
}

/**
 * This function hides compose on the third column on click
 * and displays the instructions
 * @Tushar
 */
function showDraft() {
  //Hides the compose column
  $("#compose").css("display", "none");
  //Shows the instruction to click mail to read it
  $("#select-mail-ins").css("display", "block");
}

/**
 * This function hides compose on the third column on click
 * and displays the instructions
 * @Tushar
 */
function showSent() {
  //Hides the compose column
  $("#compose").css("display", "none");
  //Shows the instruction to click mail to read it
  $("#select-mail-ins").css("display", "block");
}

/**
 * function to send email to admin
 * It saves two copy of the email into local storage one in 'student-sent-items',
 * and one in 'admin-inbox-items'
 * @Tushar
 */
function sendToStudent() {
  // Create empty JSON object with name value pair for the emails detail saves in email variable
  var email = { emails: [] };

  //Gets the value of to, cc, sb, message from the inputs and textarea
  var from = $("#send-from").val();
  var to = $("#send-to").val();
  var cc = $("#send-cc").val();
  var sb = $("#send-sb").val();
  var msg = $("#send-msg").val();

  //If from field is empty show alert
  if (from.length == 0) {
    alert('"From" field is blank');
  }
  //else send mail
  else {
    //Confirmation to send email

    if (
      $("#send-check-1").is(":checked") &&
      $("#send-check-2").is(":checked") &&
      $("#send-check-3").is(":checked") &&
      $("#send-check-4").is(":checked") &&
      $("#send-check-5").is(":checked")
    ) {
      //Check if the window storage is undefined, alert if so
      if (typeof window.Storage === "undefined") {
        alert("Local storage not supported by this browser.");
      } else if (localStorage.getItem("admin-sent-items") !== null) {
        /*else if the local storage 'admin-sent-items' is not null 
            then get the JSON object into email variable*/
        //Save the email to be sent to 'admin-sent-items' local storage
        email = JSON.parse(localStorage.getItem("admin-sent-items"));
      }
      //saves the email to the first index of 'emails' array
      email.emails.unshift({
        to: to,
        cc: cc,
        sb: sb,
        text: msg,
      });

      try {
        //Saves the email into local storage "admin-sent-items"
        localStorage.setItem("admin-sent-items", JSON.stringify(email));
      } catch (localStrorageError) {
        console.log("Error Thrown: " + localStorageError.name);
      }

      //Initialize the variable email into empty JSON object for the emails detail
      email = { emails: [] };

      //Check if the window storage is undefined, alert if so

      if (typeof window.Storage === "undefined") {
        alert("Local storage not supported by this browser.");
      } else if (localStorage.getItem("student-inbox-items") !== null) {
        /*else if the local storage 'student-inbox-items' is not null
            then get the JSON object into email variable*/
        //Save the email to be sent to 'student-inbox-items' local storage
        email = JSON.parse(localStorage.getItem("student-inbox-items"));
      }

      //saves the email to the first index of 'emails' array
      email.emails.unshift({
        from: from,
        cc: cc,
        sb: sb,
        text: msg,
      });

      try {
        //Saves the email into local storage "student-inbox-items"
        localStorage.setItem("student-inbox-items", JSON.stringify(email));
      } catch (localStrorageError) {
        console.log("Error Thrown: " + localStorageError.name);
      }
      $("#myModal").modal("hide");
      $("#compose").css("display", "none");
      $("#select-mail-ins").css("display", "block");
    }
  }
}

/**
 * This function hides compose on the third column on click
 * and displays the instructions
 * @Tushar
 */
function showInbox() {
  $("#compose").css("display", "none");
  $("#select-mail-ins").css("display", "block");
  var email = { emails: [] };
  //If the window storage is undefined show alert message
  if (typeof window.Storage === "undefined") {
    alert("Local storage not supported by this browser.");
  }
  //else if the local storage is not null populate the emails on the respective page
  else if (localStorage.getItem("student-inbox-items") !== null) {
    //Get the admin inbox emails JSON object from the local Storage
    email = JSON.parse(localStorage.getItem("student-inbox-items"));
  }
  //Initialize index for emails to 0
  var i = 0;

  // Create empty String
  var dynamicHTML = "";

  //concatinate the HTML tags through the while loop for all the emails
  while (i < email.emails.length) {
    dynamicHTML =
      dynamicHTML +
      '<ul class="list-mail"><li class="list-header email-' +
      i +
      '">' +
      email.emails[i].from +
      '</li><li class="list-sb">' +
      email.emails[i].sb +
      "</li></ul>";
    i++;
  }
  $(".col-4").html("");
  //Append the sent emails in the empty String
  $(".col-4").append(dynamicHTML);
}

/**
 * This function hides compose on the third column on click
 * and displays the instructions
 * @Tushar
 */
function showSent() {
  $("#compose").css("display", "none");
  $("#select-mail-ins").css("display", "block");
  var email = { emails: [] };
  //If the window storage is undefined show alert message
  if (typeof window.Storage === "undefined") {
    alert("Local storage not supported by this browser.");
  }
  //else if the local storage is not null populate the emails on the respective page
  else if (localStorage.getItem("admin-sent-items") !== null) {
    //Get the admin inbox emails JSON object from the local Storage
    email = JSON.parse(localStorage.getItem("admin-sent-items"));
  }
  //Initialize index for emails to 0
  var i = 0;

  // Create empty String
  var dynamicHTML = "";

  //concatinate the HTML tags through the while loop for all the emails
  while (i < email.emails.length) {
    dynamicHTML =
      dynamicHTML +
      '<ul class="list-mail"><li class="list-header email-' +
      i +
      '">' +
      email.emails[i].to +
      '</li><li class="list-sb">' +
      email.emails[i].sb +
      "</li></ul>";
    i++;
  }
  $(".col-4").html("");
  //Append the sent emails in the empty String
  $(".col-4").append(dynamicHTML);
}

/**
 * This opens the alert modal to confirm using checkboxes before sending the email
 */
function sendConfirm() {
  //Triggers alertbox
  $("#myModal").modal();
}
