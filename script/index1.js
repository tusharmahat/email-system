const SERVER_URL = "http://140.184.230.209:3095";
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
  /*Gets the value of to, cc, sb, message from the inputs and textarea 
                  and save it in newEmail in JSON format*/
  var newEmail = {
    to: $("#send-to").val(),
    from: "Terry (Terry@humanisticsystems.ca)",
    cc: $("#send-cc").val(),
    sb: $("#send-sb").val(),
    msg: $("#send-msg").val(),
    read: 0,
    fav: 0,
  };

  //Confirmation to send email
  sendConfirm();
  if (
    $("#send-check-1").is(":checked") &&
    $("#send-check-2").is(":checked") &&
    $("#send-check-3").is(":checked") &&
    $("#send-check-4").is(":checked") &&
    $("#send-check-5").is(":checked")
  ) {
    //Post request to get clientInbox from the server
    $.post(SERVER_URL + "/getClientInbox", email, getCallbackInbox).fail(
      errorCallback
    );

    //Callback funtions runs after server throws no error
    /**
     * @param {string | any[]} data
     */
    function getCallbackInbox(data) {
      if (data.length > 0) {
        /*Saves the data response from the server to email
       as JSON object */
        email = { emails: data };
      }
      // Adds new email to the begining of the email
      email.emails.unshift(newEmail);

      //Post request to save clientInbox to the server
      $.post(SERVER_URL + "/sendToClientInbox", email, insertCallback).fail(
        errorCallback
      );

      // Post request to get getAdminSentItems from the server
      $.post(
        SERVER_URL + "/getAdminSentItems",
        email,
        getCallbackSentItems
      ).fail(errorCallback);

      //Callback funtions runs after server throws no error
      /**
       * @param {string | any[]} data
       */
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

        $.post(
          SERVER_URL + "/sendToAdminSentItems",
          email,

          insertCallback
        ).fail(errorCallback);
      }
    }

    $("#myModal").modal("hide");

    $("#compose").css("display", "none");

    $("#select-mail-ins").css("display", "block");
    showSent();
  }
}

/**
 * This function hides compose on the third column on click
 * and displays the instructions
 * @Tushar
 */
function showInbox() {
  // $(".inbox-active").css("background-color", "var(--main-link-hover-color)");
  // Hide the compose
  $("#compose").css("display", "none");
  // Display the instruction to click on email to view
  $("#select-mail-ins").css("display", "block");
  // Hide if the email is already viewing from the sent
  $("#email--view").css("display", "none");

  hideSideMenu();
  //Initialize clientInbox variable
  var email = { emails: [] };

  //Post request to get getAdminInbox from the server
  $.post(SERVER_URL + "/getAdminInbox", email, getCallbackInbox).fail(
    errorCallback
  );

  /**
   * Callback function runs after the server throws no error
   * @param {object} data is the email JSON object
   */
  function getCallbackInbox(data) {
    if (data.length > 0) {
      /*Saves the data response from the server to adminInbox
                                                       as JSON object */
      email = { emails: data };

      //Initialize the index of emails
      var i = 0;
      //Variable to save the read or unread value of email
      var readOrNot;

      // Create empty String
      var dynamicHTML = "";
      var unreadCount = 0;
      var icon = "";
      //concatinate the HTML tags through the while loop for all the emails
      while (i < email.emails.length) {
        //Gets the read(1) or unread(0) value of the email at index i
        readOrNot = email.emails[i].read == 1 ? "" : " unread";
        if (readOrNot == " unread") {
          unreadCount++;
        }
        if (email.emails[i].fav == 0) {
          icon =
            '<img class="icon--float--left" id="icon" src="./images/fav-add-icon.png';
        } else {
          icon =
            '<img class="icon--float--left" id="icon" src="./images/fav-delete-icon.png';
        }
        dynamicHTML =
          dynamicHTML +
          icon +
          '" onclick="addToFav(' +
          i +
          ')" /><div class="list-mail"  id="email-' +
          i +
          '" onclick="viewEmail(' +
          "'inbox'," +
          i +
          ')" data-role="controlgroup" data-type="horizontal">' +
          '<a data-role="button" class="list-email' +
          readOrNot +
          '">' +
          email.emails[i].from +
          '</a><a data-role="button" class="list-sb">' +
          email.emails[i].sb +
          "</a></div>";
        i++;
      }
    }
    //Display the number of unread emails
    $(".badge").html("");
    if (unreadCount != 0) {
      $(".badge").append(unreadCount);
    }
    if (unreadCount > 0) {
      $(".exclam").html("");
      $(".exclam").append("!");
    }
    //select the class to disply the emails
    $(".col-4, .col-m").html("");
    //Append the sent emails in the empty String
    $(".col-4, .col-m").append(dynamicHTML);
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
  // $(".sent-active").css("background-color", "var(--main-link-hover-color)");
  // Hide the compose
  $("#compose").css("display", "none");
  // Display the instruction to click on email to view
  $("#select-mail-ins").css("display", "block");
  // Hide if the email is already viewing from the sent
  $("#email--view").css("display", "none");
  hideSideMenu();
  //Initialize clientInbox variable
  var email = { emails: [] };

  //Post request to get getAdminInbox from the server
  $.post(SERVER_URL + "/getAdminSentItems", email, getCallbackInbox).fail(
    errorCallback
  );

  /**
   * Callback function runs after the server throws no error
   * @param {object} data is the email JSON object
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
        '<div class="list-mail"  id="email-' +
        i +
        '" onclick="viewEmail(' +
        "'sent'," +
        i +
        ')" data-role="controlgroup" data-type="horizontal">' +
        '<a data-role="button" class="list-email">' +
        email.emails[i].from +
        '</a><a data-role="button" class="list-sb">' +
        email.emails[i].sb +
        "</a></div>";
      i++;
    }

    //select the class to disply the emails
    $(".col-4, .col-m").html("");
    //Append the sent emails in the empty String
    $(".col-4, .col-m").append(dynamicHTML);
    try {
      // Save the value of select to local storage as select
      localStorage.setItem("page", JSON.stringify("inbox"));
    } catch (localStorageError) {
      console.log("Error Thrown: " + localStorageError.name);
    }
  }
}

/**
 *This function shows the recent tab after I cancel the Compose tab
 * @Akrit
 */
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

    //If selection has value 0 or null, open showInbox
    if (page == "inbox" || page == null) {
      showInbox();
    }
    //else open the showSent()
    else {
      showSent();
    }
  }
}

/**
 * This opens the alert modal to confirm using checkboxes before sending the email
 */
function sendConfirm() {
  //Triggers alertbox
  $("#myModal").modal();
}

/**
 * view the email
 * @Tushar
 * @param {string} link is either inbox or sent
 * @param {string | number}  is the index of email
 */
function viewEmail(link, i) {
  //Hides the compose column
  $("#compose").css("display", "none");

  //varaible to store the name of the local storage
  var route;

  //if the link is inbox then grab emails from the student-inbox-items else from admin-sent-items
  if (link == "inbox") {
    route = "AdminInbox";
  } else {
    route = "AdminSentItems";
  }

  //Variable to store the emails
  var email;

  //hides the instructions about clicking the mail to read
  $("#select-mail-ins").css("display", "none");

  //Displays the compose column
  $("#email--view").css("display", "block");

  //Post request to get emails from the server
  $.post(SERVER_URL + "/get" + route, email, getCallbackIndex).fail(
    errorCallback
  );

  /**
   * Callback function runs after the server throws no error
   * @param {object} data is the email JSON object
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
      $(".emailAdd").html("From");
      $("#view-emailAdd").val(email.emails[i].from);
    } else {
      $(".emailAdd").html("To");
      $("#view-emailAdd").val(email.emails[i].to);
    }
    $("#view-cc").val(email.emails[i].cc);
    $("#view-sb").val(email.emails[i].sb);
    $("#view-msg").val(email.emails[i].msg);
    //Set the read value of email at index itemNum to read (1)
    email.emails[i].read = 1;
    //Post request to save emails to inbox or sentItems to the server according to route
    $.post(SERVER_URL + "/sendTo" + route, email, insertCallback).fail(
      errorCallback
    );
  }
}

/**
 * call back funtion to return error
 * @param {*} err is the erro returned
 */
function errorCallback(err) {
  console.log("Get Successful");
  console.log(err.responseText);
}
function error(err) {
  console.log("error in fav");
}

/**
 * Call back function to run after the data is sent succesfully to server
 * @param {object} data is the email JSON object
 */
function insertCallback(data) {
  console.log("Insert Successful");
}

// /**
//  * Loads the inbox in every 2 minutes
//  */
// function loadInbox() {
//   showInbox();
//   setInterval(showInbox, 120000);
// }

function showUnread() {
  // $(".unread-active").css("background-color", "var(--main-link-hover-color)");
  // Hide the compose
  $("#compose").css("display", "none");
  // Display the instruction to click on email to view
  $("#select-mail-ins").css("display", "block");
  // Hide if the email is already viewing from the sent
  $("#email--view").css("display", "none");

  hideSideMenu();

  //Initialize clientInbox variable
  var email = { emails: [] };
  //Post request to get adminSentitems from the server
  $.post(SERVER_URL + "/getAdminInbox", email, getCallbackInbox).fail(
    errorCallback
  );
  /**
   * Callback function runs after the server throws no error
   * @param {object} data is the email JSON obejct
   */
  function getCallbackInbox(data) {
    if (data.length > 0) {
      /*Saves the data response from the server to email as a JSON object */
      email = { emails: data };
      // Initialize the index of emails
      var i = 0;
      var readOrNot;
      var icon;
      var dynamicHTML = "";
      //concatinate the HTML tags through the while loop for all the emails
      while (i < email.emails.length) {
        if (email.emails[i].read == 0) {
          //Gets the read(1) or unread(0) value of the email at index i
          if (email.emails[i].fav == 0) {
            icon =
              '<img class="icon--float--left" id="icon" src="./images/fav-add-icon.png';
          } else {
            icon =
              '<img class="icon--float--left" id="icon" src="./images/fav-delete-icon.png';
          }
          dynamicHTML =
            dynamicHTML +
            icon +
            '" onclick="addToFav(' +
            i +
            ')" /><div class="list-mail"  id="email-' +
            i +
            '" onclick="viewEmail(' +
            "'inbox'," +
            i +
            ')" data-role="controlgroup" data-type="horizontal">' +
            '<a data-role="button" class="list-email' +
            readOrNot +
            '">' +
            email.emails[i].from +
            '</a><a data-role="button" class="list-sb">' +
            email.emails[i].sb +
            "</a></div>";
        }
        i++;
      }
      //select the class to disply the emails
      $(".col-4,.col-m").html("");
      //Append the sent emails in the empty String
      $(".col-4,.col-m").append(dynamicHTML);
    }
  }
}

function addToFav(i) {
  var email;
  //Post request to get clientInbox from the server
  $.post(SERVER_URL + "/getAdminInbox", email, getCallbackInbox).fail(
    errorCallback
  );

  //Callback funtions runs after server throws no error
  /**
   * @param {string | any[]} data
   */
  function getCallbackInbox(data) {
    if (data.length > 0) {
      /*Saves the data response from the server to email
     as JSON object */
      email = { emails: data };
      if (email.emails[i].fav == 0) {
        email.emails[i].fav = 1;
        alert("Added to Favorites");
      } else {
        email.emails[i].fav = 0;
        alert("Removed from Favorites");
      }
      //Post request to save clientInbox to the server
      $.post(SERVER_URL + "/sendToAdminInbox", email, insertCallback).fail(
        error
      );
    }
    showInbox();
  }
}

function navSwipe() {
  if ($("#check").is(":checked")) {
    $(".col-2").css("display", "block");
    $("ul").css("left", "0");
    $("ul").css("transition", "all 0.5s");
  } else {
    $(".col-2").css("display", "none");
    $("ul").css("left", "-100%");
    $("ul").css("transition", "all 0.5s");
  }
}

function hideSideMenu() {
  //Hide the side menu
  var screenSize = window.matchMedia("(max-width: 768px)");
  console.log(screenSize);
  if (screenSize) {
    $(".col-2").css("display", "none");
    $("ul").css("left", "-100%");
  }
}

function showFavorites() {
  // $(".fav-active").css("background-color", "var(--main-link-hover-color)");

  // Hide the compose
  $("#compose").css("display", "none");
  // Display the instruction to click on email to view
  $("#select-mail-ins").css("display", "block");
  // Hide if the email is already viewing from the sent
  $("#email--view").css("display", "none");

  hideSideMenu();

  var email;

  $.post(SERVER_URL + "/getAdminInbox", email, getCallbackInbox).fail(
    errorCallback
  );

  /**
   * Callback function runs after the server throws no error
   * @param {object} data is the email JSON object
   */
  function getCallbackInbox(data) {
    if (data.length > 0) {
      /*Saves the data response from the server to adminInbox
                                                       as JSON object */
      email = { emails: data };

      //Initialize the index of emails
      var i = 0;
      //Variable to save the read or unread value of email
      var readOrNot;
      var unreadEmail = { index: [] };
      // Create empty String
      var dynamicHTML = "";
      var unreadCount = 0;
      var icon = "";
      //concatinate the HTML tags through the while loop for all the emails
      while (i < email.emails.length) {
        //Gets the read(1) or unread(0) value of the email at index i
        readOrNot = email.emails[i].read == 1 ? "" : " unread";
        if (readOrNot == " unread") {
          unreadEmail.index.unshift({ id: i });
          unreadCount++;
        }
        if (email.emails[i].fav == 0) {
          icon =
            '<img class="icon--float--left" id="icon" src="./images/fav-add-icon.png';
        } else {
          icon =
            '<img class="icon--float--left" id="icon" src="./images/fav-delete-icon.png';
          dynamicHTML =
            dynamicHTML +
            icon +
            '" onclick="addToFav(' +
            i +
            ')" /><div class="list-mail"  id="email-' +
            i +
            '" onclick="viewEmail(' +
            "'inbox'," +
            i +
            ')" data-role="controlgroup" data-type="horizontal">' +
            '<a data-role="button" class="list-email' +
            readOrNot +
            '">' +
            email.emails[i].from +
            '</a><a data-role="button" class="list-sb">' +
            email.emails[i].sb +
            "</a></div>";
        }
        i++;
      }
    }
    //select the class to disply the emails
    $(".col-4, .col-m").html("");
    //Append the sent emails in the empty String
    $(".col-4, .col-m").append(dynamicHTML);
  }
}
