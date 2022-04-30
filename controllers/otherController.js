const ContactUs = require("./../models/contactUsModel");

module.exports = { sendMessage, getMessage, getMessages };

async function sendMessage(request, response, next) {
  const contactUs = new ContactUs({
    fullName: request.body.fullName,
    email: request.body.email,
    subject: request.body.subject,
    message: request.body.message,
  });
  contactUs.save().then(() => {
    response.status(200).json({
      message: "Your message sent successfully",
      statusCode: 200,
    });
  });
}

async function getMessage(request, response, next) {
    ContactUs.findOne({ email: request.params.email })
    .then((res) => {
      response.status(200).json({
        message: res,
      });
    })
    .catch((error) => {
      response.status(401).json({
        error: error,
      });
    });
}

async function getMessages(request, response, next) {
    ContactUs.find()
    .then((res) => {
      response.status(200).json({
        messages: res,
      });
    })
    .catch((error) => {
      response.status(401).json({
        error: error,
      });
    });
}
