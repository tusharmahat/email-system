var currPage = window.location.href;

//Show active tab for desktop and small device
if (isScreenSmall().matches) {
  activateTab(currPage, "tab-m");
} else {
  activateTab(currPage, "tab");
}

$(document).ready(function () {
  if ($("#email--view").parents("#right").length == 1) {
    $("#middle-m").css("display", "none");
    $("#right").css("display", "block");
  }
});

// Compose for small device
$(".btn-compose").on("click", () => {
  if (isScreenSmall().matches) {
    $("#middle-m").css("display", "none");
    $("#right").css("display", "block");
    $(".menu-m ul").css("left", "-100%");
  }
});

// Compose for small device
$(".btn-back").on("click", () => {
  if (isScreenSmall().matches) {
    $("#right").css("display", "none");
    $("#middle-m").css("display", "block");
  }
});

/**
 * Function to show and hide the menu on left for mobile
 */
function navSwipe() {
  if ($("#check").is(":checked")) {
    // $(".menu-m").css("display", "block");
    $(".menu-m ul").css("left", "35px");
    $(".menu-m ul").css("transition", "all 0.5s");
  } else {
    // $(".menu-m").css("display", "none");
    $(".menu-m ul").css("left", "-100%");
    $(".menu-m ul").css("transition", "all 0.5s");
  }
}

/**
 * returns the max width of the device
 */
function isScreenSmall() {
  return window.matchMedia("(max-width: 768px)");
}
// Show Alert if there are unread emails
$(function () {
  if (currPage.match("home")) {
    // fetch the unread emails count
    fetch("/users/unread-count")
      .then((res) => res.json())
      .then((res) => {
        //If there there are unread emails show alert for confirmation
        if (res.count > 0) {
          $(".menu-m ul").css("left", "35px");
          // If clicked on yes in the confirmation open unread emails
          if (
            confirm(
              `You have ${res.count} unread emails, Do you want to read them now?`
            )
          ) {
            // Open the unread emails
            window.location.href = res.url;
          }
        }
      });
  }
});

/**
 * Actives the tab which is opened
 * @param {*} currPage
 */
function activateTab(currPage, tab) {
  var btns = document.getElementsByClassName(tab);
  if (btns.length > 0) {
    if (currPage.match("inbox") || currPage.match("home")) {
      btns[1].className += " active";
    } else if (currPage.match("sent")) {
      btns[2].className += " active";
    } else if (currPage.match("fav")) {
      btns[3].className += " active";
    } else if (currPage.match("unread")) {
      btns[4].className += " active";
    } else if (currPage.match("deleted")) {
      btns[5].className += " active";
    }
  }
}
function deleteAcAlert() {
  if (confirm("Are you sure want to delete this account?")) {
    return true;
  } else {
    return false;
  }
}
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
  $("#email--view").css("display", "none");
  $("#compose").css("display", "block");
}

/**
 * Add this email to favorite, itdoes not add in separate box,
 * it just marks the inbox emails as favorite if clicked on star
 *
 * @param {*} box
 * @param {*} index
 */
function addToFav(box, index) {
  // Send post request to add this email to favorite
  fetch(`/users/${box}/add-to-fav/${index}`, { method: "POST" })
    .then((res) => {
      // If redirected then redirect to the url that it gets as response
      if (res.redirected) {
        window.location.href = res.url;
      }
    })
    .catch((err) => {
      console.log("Error while adding it to favorite:" + err);
    });
}
/**
 * This opens the alert modal to confirm using checkboxes before sending the email
 */
function sendConfirm() {
  //Triggers alertbox
  $("#send-alert").modal();
}

/**
 * This checks if all the checkboxes are ticked or else changes the bg-color to red of the instructions box
 * @author Tushar
 * @contributer Akrit
 *
 */
function validate() {
  // If all the checkboxes are checked then return true
  if (
    $("#send-check-1").is(":checked") &&
    $("#send-check-2").is(":checked") &&
    $("#send-check-3").is(":checked") &&
    $("#send-check-4").is(":checked") &&
    $("#send-check-5").is(":checked")
  ) {
    return true;
  }
  // @akrit
  //If all the checkboxes are not ticked change the bg-color of instructions box to red
  $("#help-yellow").css("background-color", "#FFC107");

  //On click No button
  $("#btn-no").on("click", () => {
    //If all the checkboxes are not ticked change the bg-color of instructions box to default
    $("#help-yellow").css("background-color", "#fafad2");
  });
  return false;
}

/**
 *This function redirect to the recent tab after I cancel the Compose tab
 * @Akrit
 */
function back() {
  if (!isScreenSmall().matches) {
    var isCancel = confirm("Are you sure want to cancel, and go back?");
    //If isCancel is true then go back to the respective page
    if (isCancel) {
      //Hides the compose column
      $("#compose").css("display", "none");
      //Hides the view column
      $("#email--view").css("display", "none");
      //Displays the instructions about clicking the mail to read
      $("#select-mail-ins").css("display", "block");
      return true;
    } else {
      return false;
    }
  }
}
// ---------------------JUST HELP MESSAGES, TOO LONG, DON'T LOOK THESE-----------------------------------//
//HELP FUNCTIONS WITH MESSSAGES
/**
 * Generates help according to the topic arg passed from the buttons
 * @param {String} topic
 */
function helpGenerate(topic) {
  // If help-apper is not open, remove the html tag, just to make html look cleaner
  if ($("#help-appear").css("display") === "none") {
    $("#help-appear").remove();
  }
  // variable for the Title of help modal
  var title;

  // variable for the body of help modal
  var body;

  if (topic == "subject") {
    // If help topic is 'subject', set title and body for it
    title = "Subject Line";
    body = `<p>
      Write a few words that describes the general idea of what your email is about.
      But beware of making your subject line too long.<br><br>
  </p>
  
  <p>
      <b>Click here for examples of Subject Line:</b><br>
      <a class="help-ex" onclick="showMore('subject')"><img class="icon" src="./images/more.png" alt=""></a>
  </p>`;
  }
  if (topic == "to") {
    // If help topic is 'to', set title and body for it
    title = "Recipient Line";
    body = ` <p>
      Write the email address of the person to whom you want to send the email.
      <br><br>
  </p>
  
  <p>
      <b> Click here for examples of an email recipient:</b><br>
      <a class="help-ex" onclick="showMore('to')"><img class="icon" src="./images/more.png" alt=""></a>
  </p>`;
  }
  if (topic == "cc") {
    // If help topic is 'cc', set title and body for it
    title = "Carbon Copy";
    body = `<p>
      Write the email address of the person to whom you want to send this copy of the email to.
      <br><br>
  </p>
  
  <p>
      <b> Click here for examples of a Cc:</b><br>
      <a class="help-ex" onclick="showMore('cc')"><img class="icon" src="./images/more.png" alt=""></a>
  </p>
  
  `;
  }
  if (topic == "greeting") {
    // If help topic is 'greeting', set title and body for it
    title = "Greetings";
    body = `<p>
      Write a word or couple of words to show a sign of welcome or recognition to the person you
      are
      sending this email to.<br><br>
  </p>
  
  <p>
      <b>Click here for examples of greetings:</b><br>
      <a class="help-ex" onclick="showMore('greeting')"><img class="icon" src="./images/more.png" alt=""></a>
  </p>`;
  }
  if (topic == "message") {
    // If help topic is 'message', set title and body for it
    title = "Introduction/Body";
    body = ` <p>
      With short introduction about yourself, write your message in this section.
      <br>It should consist of detailed and clear content as your email recipient would not
      misunderstand any of your important points and gets the actual message you are trying to
      convey.<br><br>
  </p>
  <p>
      <b>Click here for examples of Messages:</b><br>
      <a class="help-ex" onclick="showMore('message')"><img class="icon" src="./images/more.png" alt=""></a>
  </p>`;
  }
  if (topic == "closing") {
    // If help topic is 'closing', set title and body for it
    title = "Closing";
    body = `<p>
      Write a word or couple of words that may provide a good last impression.<br>
      Its better if you include your full name, contact information, and title (if appropriate) as
      shown in the example when you click the more icon.
      <br><br>
  </p>
  
  <p>
      <b>Click here for examples of Closings:</b><br>
      <a class="help-ex" onclick="showMore('closing')"><img class="icon" src="./images/more.png" alt=""></a>
  </p>`;
  }
  if (topic == "example") {
    // If help topic is 'example', set title and body for it
    title = "Example";
    body = `Dear April,<br><br>
  
      My name is Leslie and I’m a park director with the Indiana Parks and Recreation Department. We’re dedicated to making Indiana parks more beautiful and visitor-friendly.<br><br>
      
      I’m reaching out today to see if you would be interested in learning more about our summer initiative to get more kids outside and to the parks. 
      I know you run a summer camp, and I’d love to talk about partnering with you to use our parks for certain outdoor activities.<br><br>
      
      Let me know if you’d like to learn more.<br><br>
      
      Sincerely,<br>
      Leslie Knope<br>
      Park Director, Indiana Parks<br>
      April_Knope@hotmail.com<br>
      (555) 555-6546`;
  }
  if (topic == "help") {
    // If help topic is 'help' set title and body for it
    title = "Help";
    body = `
      <p class="help-menu"><img class="icon icon--no-margin" src="../images/inbox-icon.png" alt=""> >> List of received emails</p>
      <p class="help-menu"><img class="icon icon--no-margin" src="../images/sent-icon.png" alt=""> >> List of sent emails</p>
      <p class="help-menu"><img class="icon icon--no-margin" src="../images/draft-icon.png" alt=""> >> List of draft emails</p>
      <p class="help-menu"><img class="icon icon--no-margin" src="../images/fav-icon.png" alt=""> >> List of emails added to favorite</p>
      <p class="help-menu"><img class="icon icon--no-margin" src="../images/unread-icon.png" alt=""> >> List of unread emails</p>
      <p class="help-menu"><img class="icon icon-fav icon--no-margin" src="../images/fav-add-icon.png"> >> is a favorite email, click to remove it from favorite</p>
      <p class="help-menu"><img class="icon icon--no-margin" src="../images/fav-add-icon.png"> >> is not a favorite email, click on it to add to favorite</p>
      <p class="help-menu"><img class="icon icon--no-margin" src="../images/delete-icon.png"> >> deletes a particular email</p>
      <p class="help-menu"><img class="icon icon--no-margin" src="../images/delete-all-icon.png"> >> deletes all emails in the box</p>
      
      <p class="help-menu"><img class="icon icon--no-margin" src="../images/search.png"> >> Search a particular email using the email address</p>
      <p class="help-menu help--yellow"><span class="unread">Emily_Francis@hotmail.com<span> >> Unread email </p>
      <p class="help-menu help--yellow">Emily_Francis@hotmail.com >> Read email</p>
      <p class="help-menu"><img class="icon--no-margin" src="../images/storage.png" alt=""> >> Storage between 0 to 95%</p>
      <p class="help-menu"><img class="icon--no-margin" src="../images/storage-danger.png" alt=""> >> Storage 95% or more</p>`;
  }
  // Call the show help function, passing respective args
  showHelp(title, body);
}

/**
 * Displays help model according to the topic and body
 * @param {*} title
 * @param {*} body
 */
function showHelp(title, body) {
  // create html according to the title and body
  var html = `<div class="modal fade" id="help-appear" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
    style="display: none">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">
                    ${title}
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-bod">
            ${body}          </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                    Close
                </button>
            </div>
        </div>
    </div>
  </div>`;
  // Display the message
  $("body").append(html);
  $("#help-appear").modal();
}

/**
 * Show more help if clicked on arrow on help model
 * @param {*} topic
 */
function showMore(topic) {
  // varaible for the title
  var title;
  // Variable for the body
  var body;
  if (topic == "subject") {
    // If help topic is 'subject' set title and body for it
    title = "Subject Line";
    body = `<p><b>A Formal example email of the subject line:</b><br>
      <i>Required Student Meeting: December 5th, 9:30 a.m</i></p>
      <br>
  <p>
      <b>An informal example email of the subject line:</b><br>
      <i>Upcoming Meeting</i>
  </p>
  <br>
  <p>
      Notice that the first subject line is more informative and complete. The informal subject
      line, sent to someone you know well, just barely touches on the topic.
  </p><a onclick="helpGenerate('subject')">Back</a>`;
  }
  if (topic == "to") {
    // If help topic is 'to' set title and body for it
    title = "Recipient Line";
    body = `<p><b>Examples of email address:</b><br><i>Emily_Clarke99@gmail.com<br>James.Hall2020@gmail.com</i></p><br>
  <p><b>Email address names can include the following:</b>
      <br>
      Uppercase and lowercase letters: A-Z and a-z.<br>
      Digits: 0-9.<br>
  </p>
  `;
  }
  if (topic == "cc") {
    // If help topic is 'cc' set title and body for it
    title = "Carbon Copy";
    body = ` <i>To: LucasBalotelli@gmail.com, <br> Cc: Ana.Gomes@icloud.com,
          Carl_Henry11@gmail.com</i><br><br>
  </p>
  <p>
      You can add more recipients by separating the emails by <b>","</b>.
  </p>
  
  `;
  }
  if (topic == "greeting") {
    // If help topic is 'greeting' set title and body for it
    title = "Greetings";
    body = `
  <p>
      <i>Dear/Hi Shawn, Respected Professor Robert, Hello everyone</i></p>
  <br>
  
  <p>
      It is more preferred when you use the name of the person you are sending the email to.
  </p>
  <br>
  
  <p>
      <b> Here’s an example of a formal greeting with the job title of the person but without
          their
          name: </b><br>
      <i>Dear Human Resources Director, Respected Manager of Tim Hortons</i>
  </p>
  <br>
  <p>
      <b> In rare instances where you don’t know a person’s name or title, it’s okay to use this
          greeting: </b><br>
      <i>To whom it may concern,</i><br>
  </p>`;
  }
  if (topic == "message") {
    // If help topic is 'message' set title and body for it
    title = "Introduction/Body";
    body = `<p><i>My name is Jordan Smith. I am the professor of Statistics for Saint Mary's University.
          This
          message is for all students enrolled in this course.</i></p><br>
  After the introduction write your message.
  `;
  }
  if (topic == "closing") {
    // If help topic is 'Closing' set title and body for it
    title = "Closing";
    body = `<p><b>Closing sample:</b><br>
      <i>Sincerely with kind regards,<br>
          Jordan Smith<br>
          Professor of Computer Science, York College<br>
          jordan.smith7@gmail.com<br>
          (902)345-6789<br>
      </i><br>
      <b>Other examples of closing words that you could use are: </b>
      <br>
      <i>Best Regards, Warm Wishes, Many Thanks, With gratitude.</i>
  </p>
  `;
  }
  if (topic == "example") {
    // If help topic is 'example' set title and body for it
    title = "Example";
    body = `Dear April,<br><br>
  
      My name is Leslie and I’m a park director with the Indiana Parks and Recreation Department. We’re dedicated to making Indiana parks more beautiful and visitor-friendly.<br><br>
      
      I’m reaching out today to see if you would be interested in learning more about our summer initiative to get more kids outside and to the parks. 
      I know you run a summer camp, and I’d love to talk about partnering with you to use our parks for certain outdoor activities.<br><br>
      
      Let me know if you’d like to learn more.<br><br>
      
      Sincerely,<br>
      Leslie Knope<br>
      Park Director, Indiana Parks<br>
      April_Knope@hotmail.com<br>
      (555) 555-6546`;
  }
  // Display the modal
  $(".modal-bod").html(body);
}
