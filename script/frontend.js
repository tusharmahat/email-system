var currPage = window.location.href;
activateTab(currPage);

/**
 * Actives the tab which is opened
 * @param {*} currPage
 */
function activateTab(currPage) {
  var btns = document.getElementsByClassName("tab");
  if (currPage.match("inbox") || currPage.match("home")) {
    btns[0].className += " active";
  } else if (currPage.match("sent")) {
    btns[1].className += " active";
  } else if (currPage.match("fav")) {
    btns[2].className += " active";
  } else if (currPage.match("unread")) {
    btns[3].className += " active";
  } else {
    btns[4].className += " active";
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
 * It fetches the email from the server using get request
 * @param {*} box
 * @param {*} index
 */
function getEmail(box, index) {
  //Fetch that email from the server
  fetch(`/users/${box}/view/:${index}`)
    .then((res) => res.json())
    .then((data) => {
      // View the email received from the server
      viewEmail(box, data);
    })
    .catch((err) => {
      console.log(err);
    });
}

/**
 * It displays the fetched email on the right column of the page
 *
 * @param {*} box
 * @param {*} email
 */
function viewEmail(box, email) {
  //Hides the compose column
  $("#compose").css("display", "none");
  //hides the instructions about clicking the mail to read
  $("#select-mail-ins").css("display", "none");

  //Displays the compose column
  $("#email--view").css("display", "block");
  //View the email in the third column
  //if the link is from inbox change the title to "From" else "To"
  if (box == "inbox") {
    $(".emailAdd").html("From");
    $("#view-emailAdd").val(email.from);
    currPage = "inbox";
  } else {
    $(".emailAdd").html("To");
    $("#view-emailAdd").val(email.to);
    currPage = "sent";
  }
  $("#view-cc").val(email.cc);
  $("#view-sb").val(email.sb);
  $("#view-msg").val(email.msg);
}

/**
 *
 * @param {*} box
 * @param {*} index
 */
function deleteOne(box, index) {
  //Confirmation for deletion of an email
  var isDelete = confirm("Are you sure want delete this mail?");
  //If isDelete is true then delete that mail
  if (isDelete) {
    fetch(`/users/${box}/delete-one/:${index}`, { method: "POST" })
      .then((res) => {
        if (res.redirected) {
          window.location.href = res.url;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

/**
 *
 * @param {*} box
 * @param {*} index
 */
function addToFav(box, index) {
  fetch(`/users/${box}/add-to-fav/:${index}`, { method: "POST" })
    .then((res) => {
      if (res.redirected) {
        window.location.href = res.url;
      }
    })
    .catch((err) => {
      console.log(err);
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
 *This function shows the recent tab after I cancel the Compose tab
 * @Akrit
 */
function back() {
  var isCancel = confirm("Are you sure want to cancel, and go back?");
  //If isCancel is true then go back to the respective page
  if (isCancel) {
    //Hides the compose column
    $("#compose").css("display", "none");
    //Hides the view column
    $("#email--view").css("display", "none");
    //Displays the instructions about clicking the mail to read
    $("#select-mail-ins").css("display", "block");
  }
}

//HELP FUNCTIONS WITH MESSSAGES
/**
 * Generates help according to the topic
 * @param {String} topic
 */
function helpGenerate(topic) {
  if ($("#help-appear").css("display") === "none") {
    $("#help-appear").remove();
  }

  var title;
  var body;
  if (topic == "subject") {
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
    title = "Help";
    body = `
      <p class="help-menu"><img class="icon icon--no-margin" src="./images/inbox-icon.png" alt=""> >> List of received emails</p>
      <p class="help-menu"><img class="icon icon--no-margin" src="./images/sent-icon.png" alt=""> >> List of sent emails</p>
      <p class="help-menu"><img class="icon icon--no-margin" src="./images/draft-icon.png" alt=""> >> List of draft emails</p>
      <p class="help-menu"><img class="icon icon--no-margin" src="./images/fav-icon.png" alt=""> >> List of emails added to favorite</p>
      <p class="help-menu"><img class="icon icon--no-margin" src="./images/unread-icon.png" alt=""> >> List of unread emails</p>
      <p class="help-menu"><img class="icon icon-fav icon--no-margin" src="./images/fav-add-icon.png"> >> is a favorite email, click to remove it from favorite</p>
      <p class="help-menu"><img class="icon icon--no-margin" src="./images/fav-add-icon.png"> >> is not a favorite email, click on it to add to favorite</p>
      <p class="help-menu"><img class="icon icon--no-margin" src="./images/delete-icon.png"> >> deletes a particular email</p>
      <p class="help-menu"><img class="icon icon--no-margin" src="./images/search.png"> >> Search a particular email using the email address</p>
      <p class="help-menu help--yellow"><span class="unread">Emily_Francis@hotmail.com<span> >> Unread email </p>
      <p class="help-menu help--yellow">Emily_Francis@hotmail.com >> Read email</p>`;
  }

  showHelp(title, body);
}

/**
 *
 * @param {*} title
 * @param {*} body
 */
function showHelp(title, body) {
  var dynamicHTML = `<div class="modal fade" id="help-appear" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
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
  $("body").append(dynamicHTML);
  $("#help-appear").modal();
}

function showMore(topic) {
  var title;
  var body;
  if (topic == "subject") {
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
    title = "Introduction/Body";
    body = `<p><i>My name is Jordan Smith. I am the professor of Statistics for Saint Mary's University.
          This
          message is for all students enrolled in this course.</i></p><br>
  After the introduction write your message.
  `;
  }
  if (topic == "closing") {
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
  $(".modal-bod").html(body);
}
