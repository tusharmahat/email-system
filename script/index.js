const SERVER_URL = "http://140.184.230.209:3095";
/**
 * This function shows compose on the third column on click
 * after hiding the instructions
 * @Tushar
 */
function showCompose() {
  //hides the instructions about clicking the mail to read
  // @ts-ignore
  $("#select-mail-ins").css("display", "none");

  //Clears all the input fields
  // @ts-ignore
  $(".input-group input").val("");
  // @ts-ignore
  $("#send-msg").val("");

  //Displays the compose column
  // @ts-ignore
  $("#compose").css("display", "block");
}

/**
 * This function hides compose on the third column on click
 * and displays the instructions
 * @Tushar
 */
function showDraft() {
  //Hides the compose column
  // @ts-ignore
  $("#compose").css("display", "none");
  //Shows the instruction to click mail to read it
  // @ts-ignore
  $("#select-mail-ins").css("display", "block");
}

/**
 * This function hides compose on the third column on click
 * and displays the instructions
 * @Tushar
 */
function showSent() {
  //Hides the compose column
  // @ts-ignore
  $("#compose").css("display", "none");
  //Shows the instruction to click mail to read it
  // @ts-ignore
  $("#select-mail-ins").css("display", "block");
}

function showFavorites() { }

/**
 * function to send email to admin
 * It saves two copy of the email into local storage one in 'student-sent-items',
 * and one in 'admin-inbox-items'
 * @Tushar
 */
function sendToStudent() {
  // Create empty JSON object with name value pair for the emails detail saves in email variable
  var email = { emails: [] };
  /*Gets the value of to, cc, sb, message from the inputs and textarea 
                  and save it in newEmail in JSON format*/
  var newEmail = {
    to: $("#send-to").val(),
    from: "Terry (Terry@humanisticsystems.ca)",
    cc: $("#send-cc").val(),
    sb: $("#send-sb").val(),
    msg: $("#send-msg").val(),
    read: 0,
    urgency: 0,
  };

  //Confirmation to send email

  if (
    // @ts-ignore
    $("#send-check-1").is(":checked") &&
    // @ts-ignore
    $("#send-check-2").is(":checked") &&
    // @ts-ignore
    $("#send-check-3").is(":checked") &&
    // @ts-ignore
    $("#send-check-4").is(":checked") &&
    // @ts-ignore
    $("#send-check-5").is(":checked")
  ) {
    //Post request to get clientInbox from the server
    // @ts-ignore
    $.post(SERVER_URL + "/getClientInbox", email, getCallbackInbox).fail(
      // @ts-ignore
      errorCallback
    );

    //Callback funtions runs after server throws no error
    function getCallbackInbox(data) {
      if (data.length > 0) {
        /*Saves the data response from the server to email
       as JSON object */
        email = { emails: data };
      }
      // Adds new email to the begining of the email
      email.emails.unshift(newEmail);

      //Post request to save adminInbox to the server
      // @ts-ignore
      $.post(SERVER_URL + "/sendToClientInbox", email, insertCallback).fail(
        // @ts-ignore
        errorCallback
      );

      // Post request to get clientSentItems from the server
      // @ts-ignore
      $.post(
        SERVER_URL + "/getAdminSentItems",
        email,
        getCallbackSentItems
        // @ts-ignore
      ).fail(errorCallback);

      //Callback funtions runs after server throws no error
      function getCallbackSentItems(data) {
        email = { emails: [] };
        if (data.length > 0) {
          /*Saves the data response from the server to email
       as JSON object */
          email = { emails: data };
        }

        // Adds new email to the begining of the email
        email.emails.unshift(newEmail);

        //Post request to save clientSentItems to the server
        // @ts-ignore
        $.post(
          SERVER_URL + "/sendToAdminSentItems",
          email,
          // @ts-ignore
          insertCallback
          // @ts-ignore
        ).fail(errorCallback);
      }
    }
    // @ts-ignore
    $("#myModal").modal("hide");
    // @ts-ignore
    $("#compose").css("display", "none");
    // @ts-ignore
    $("#select-mail-ins").css("display", "block");
  }
}

/**
 * This function hides compose on the third column on click
 * and displays the instructions
 * @Tushar
 */
function showInbox() {
  // @ts-ignore
  $("#compose").css("display", "none");
  // @ts-ignore
  $("#select-mail-ins").css("display", "block");
  //Initialize clientInbox variable
  var email = { emails: [] };

  //Post request to get getAdminInbox from the server
  // @ts-ignore
  $.post(SERVER_URL + "/getAdminInbox", email, getCallbackInbox).fail(
    // @ts-ignore
    errorCallback
  );

  /**
   * Callback function runs after the server throws no error
   * @param {JSON object} data is the email
   */
  function getCallbackInbox(data) {
    if (data.length > 0) {
      /*Saves the data response from the server to adminInbox
                                                       as JSON object */
      email = { emails: data };
    }

    //Initialize the index of emails
    var i = 0;
    //Variable to save the read or unread value of email
    var readOrNot;

    // Create empty String
    var dynamicHTML = "";

    //concatinate the HTML tags through the while loop for all the emails
    while (i < email.emails.length) {
      //Gets the read(1) or unread(0) value of the email at index i
      readOrNot = email.emails[i].read == 1 ? "" : " unread";
      dynamicHTML =
        dynamicHTML +
        '<ul class="list-mail"' +
        readOrNot +
        'id="email-' +
        i +
        '" onclick="viewEmail(' +
        "'inbox'," +
        i +
        ')"><li class="list-email"><input id="checkbox--round" type="checkbox" />' +
        email.emails[i].from +
        '</li><li class="list-sb">' +
        email.emails[i].sb +
        "</li></ul>";
      i++;
    }
    // @ts-ignore
    $(".col-4").html("");
    //Append the sent emails in the empty String
    // @ts-ignore
    $(".col-4").append(dynamicHTML);
    try {
      // Save the value of select to local storage as select
      localStorage.setItem("page", JSON.stringify("inbox"));
    } catch (localStorageError) {
      console.log("Error Thrown: " + localStorageError.name);
    }
  }
}

/**
 * This function hides compose on the third column on click
 * and displays the instructions
 * @Tushar
 */
function showSent() {
  // @ts-ignore
  $("#compose").css("display", "none");
  // @ts-ignore
  $("#select-mail-ins").css("display", "block");
  //Initialize clientInbox variable
  var email = { emails: [] };

  //Post request to get clientInbox from the server
  // @ts-ignore
  $.post(SERVER_URL + "/getAdminSentItems", email, getCallbackInbox).fail(
    // @ts-ignore
    errorCallback
  );

  /**
   * Callback function runs after the server throws no error
   * @param {JSON object} data is the email
   */
  function getCallbackInbox(data) {
    if (data.length > 0) {
      /*Saves the data response from the server to clientInbox
                                                       as JSON object */
      email = { emails: data };
    }

    //Initialize the index of emails
    var i = 0;
    //Variable to save the read or unread value of email
    var readOrNot;

    // Create empty String
    var dynamicHTML = "";

    //concatinate the HTML tags through the while loop for all the emails
    while (i < email.emails.length) {
      //Gets the read(1) or unread(0) value of the email at index i
      readOrNot = email.emails[i].read == 1 ? "" : " unread";
      dynamicHTML =
        dynamicHTML +
        '<ul class="list-mail"' +
        readOrNot +
        'id="email-' +
        i +
        '" onclick="viewEmail(' +
        "'sent'," +
        i +
        ')"><li class="list-email"><input id="checkbox--round" type="checkbox" />' +
        email.emails[i].to +
        '</li><li class="list-sb">' +
        email.emails[i].sb +
        "</li></ul>";
      i++;
    }
    // @ts-ignore
    $(".col-4").html("");
    //Append the sent emails in the empty String
    // @ts-ignore
    $(".col-4").append(dynamicHTML);
  }
  try {
    // Save the value of select to local storage as select
    localStorage.setItem("page", JSON.stringify("sent"));
  } catch (localStorageError) {
    console.log("Error Thrown: " + localStorageError.name);
  }
}

/**
 *This function shows the recent tab after I cancel the Compose tab
 * @Akrit
 */
// @ts-ignore
function cancel() {
  var page;
  //Confirmation for cancelling the composing
  var isCancel = confirm("Are you sure want to cancel?");
  //If isCancel is true then go back to the respective page
  if (isCancel) {
    //If window storage is undefined alert message
    if (typeof window.Storage === "undefined") {
      alert("Local storage not supported by this browser.");
    } else if (localStorage.getItem("page") !== null) {
      /*else if the local storage 'page' is not null 
        then get the JSON object into page variable*/
      // Gets the value of select and store it in selection
      page = JSON.parse(localStorage.getItem("page"));
      // remove the page from the local storage
      localStorage.removeItem("page");
    }

    //If selection has value 0 or null, open index.html
    if (page == "inbox" || page == null) {
      showInbox();
    }
    //else open the sentitems.html
    else {
      showSent();
    }
  }
}

/**
 * This opens the alert modal to confirm using checkboxes before sending the email
 */
// @ts-ignore
function sendConfirm() {
  //Triggers alertbox
  // @ts-ignore
  $("#myModal").modal();
}

/**
 * view the email
 * @Tushar
 */
// @ts-ignore
function viewEmail(link, i) {
  //Hides the compose column
  // @ts-ignore
  $("#compose").css("display", "none");

  //varaible to store the name of the local storage
  var route;

  //if the link is inbox then grab emails from the student-inbox-items else from admin-sent-items
  if (link == "inbox") {
    route = "getAdminInbox";
  } else {
    route = "getAdminSentItems";
  }

  //Variable to store the emails
  var email;
  //hides the instructions about clicking the mail to read
  // @ts-ignore
  $("#select-mail-ins").css("display", "none");
  //Displays the compose column
  // @ts-ignore
  $("#email--view").css("display", "block");

  //Post request to get emails from the server
  $.post(SERVER_URL + "/getAdminInbox", email, getCallbackIndex).fail(
    errorCallback
  );

  /**
   * Callback function runs after the server throws no error
   * @param {JSON object} data is the email
   */
  function getCallbackIndex(data) {
    if (data.length > 0) {
      /*Saves the data response from the server to clientInbox
      as JSON object */
      email = { emails: data };
    }

    //View the email in the third column
    //if the link is from inbox change the title to "From" else "To"
    if (link == "inbox") {
      // @ts-ignore
      $(".emailAdd").html("From");
      // @ts-ignore
      $("#view-emailAdd").val(email.emails[i].from);
    } else {
      // @ts-ignore
      $(".emailAdd").html("To");
      // @ts-ignore
      $("#view-emailAdd").val(email.emails[i].to);
    }
    // @ts-ignore
    $("#view-cc").val(email.emails[i].cc);
    // @ts-ignore
    $("#view-sb").val(email.emails[i].sb);
    // @ts-ignore
    $("#view-msg").val(email.emails[i].msg);
    //Set the read value of email at index itemNum to read (1)
    email.emails[i].read = 1;
    //Post request to save clientSentItems to the server
    $.post(SERVER_URL + "/sendToClientInbox", email, insertCallback).fail(
      errorCallback
    );
  } // @ts-ignore
}
/**
 * call back funtion to return error
 * @param {*} err is the erro returned
 */
function errorCallback(err) {
  console.log(err.responseText);
}

/**
 * Call back function to run after the data is sent succesfully to server
 * @param {JSON object} data is the email
 */
function insertCallback(data) {
  console.log("Successfully sent");
}
