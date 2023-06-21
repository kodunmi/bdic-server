var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
const fs = require("fs");
const handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
var mg = require("nodemailer-mailgun-transport");
const multer = require("multer");

dotenv.config();

const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

handlebars.registerHelper("eq", function (a, b, options) {
  if (a == b) {
    return true;
  }
  return false;
});

// Read the Handlebars template file
const templateSource = fs.readFileSync("views/index.handlebars", "utf8");

// Compile the template
const template = handlebars.compile(templateSource);

handlebars.registerHelper("eq", function (a, b, options) {
  return a === b ? true : false;
});

// handlebars.registerHelper("length", function (array) {
//   console.log(array);
//   return 3;
// });

// Define the array of data for generating multiple PDFs
// const dataArray = [
//   {
//     name: "John Doe",
//     email: "john.doe@example.com",
//     // Add any additional data you need for your template
//   },
//   {
//     name: "Jane Smith",
//     email: "jane.smith@example.com",
//     // Add any additional data you need for your template
//   },
//   // Add more data objects as needed
// ];

// const dataArray = [
//   {
//     title: "Personal Statement of Financial Affairs",
//     entries: [
//       {
//         title: "Your Application Code",
//         entry: "79474-9772",
//       },
//       {
//         title: "Your First Name",
//         entry: "Anazodo",
//       },
//       {
//         title: "Your Middle Name",
//         entry: "Erin Prosacco",
//       },
//       {
//         title: "Your Last Name",
//         entry: "Somto",
//       },
//       {
//         title: "Home Address",
//         entry: "9 District Centre Kubwa Abuja",
//       },
//       {
//         title: "Mailing Address (If different from home address)",
//         entry: "434 Lucio Shores",
//       },
//       {
//         title: "Community",
//         entry: "Ulukhaktok",
//       },
//       {
//         title: "If Other please specify",
//       },
//       {
//         title: "Province/Territory",
//         entry: "British Columbia",
//       },
//       {
//         title: "Postal Code",
//         entry: "A1A 2a2",
//       },
//       {
//         title: "Telephone Number",
//         entry: "(070) 696-39328",
//       },
//       {
//         title: "Email Address",
//         entry: "somto8000@gmail.com",
//       },
//       {
//         title: "Your Employer",
//         entry: "Mollitia quia omnis.",
//       },
//       {
//         title: "Position",
//         entry: "sit eos fuga",
//       },
//       {
//         title: "Work Phone",
//         entry: "(732) 265-8044",
//       },
//       {
//         title: "Your Annual Income",
//         entry:
//           "Iste labore eius sunt quis sapiente facilis ducimus distinctio incidunt.",
//       },
//       {
//         title: "Are you married?",
//         entry: "yes",
//       },
//       {
//         title: "Spouse First Name",
//         entry: "Euna",
//       },
//       {
//         title: "Spouse Surname",
//         entry: "Herman_Mante81",
//       },
//       {
//         title: "Spouse Annual Income",
//         entry: "Inventore laboriosam labore molestias.",
//       },
//       {
//         title: "List All Assets",
//         entry:
//           "1) description: Velit magni voluptatibus magni amet. amount: 422 ;",
//       },
//       {
//         title: "List All Debts & Liabilities",
//         entry:
//           "1) description: Architecto facere mollitia facere minima dolor possimus nam accusamus eius. amount: 633 ;",
//       },
//       {
//         title: "Total Net Worth",
//         entry: -211,
//       },
//       {
//         title: "Have you ever had an asset repossessed by a creditor?",
//         entry: "no",
//       },
//       {
//         title: "If Yes, please explain",
//       },
//       {
//         title:
//           "Are you involved in any lawsuits or claims that could affect your financial situation?",
//         entry: "no",
//       },
//       {
//         title: "If Yes, please explain",
//       },
//       {
//         title: "Have you ever declared bankruptcy?",
//         entry: "no",
//       },
//       {
//         title: "If Yes, when",
//       },
//       {
//         title: "Are you discharged?",
//       },
//       {
//         title: "If  No, why?",
//       },
//       {
//         title:
//           "Do you have any outstanding liabilities to the Government of the Northwest Territories, Canada Revenue Agency or the Workers Safety and Compensation Commission?",
//         entry: "no",
//       },
//       {
//         title: "If Yes, please explain",
//       },
//       {
//         title:
//           "Are you a shareholder, director or stakeholder of any other business, corporation, partnership, proprietorship etc?",
//         entry: "no",
//       },
//       {
//         title:
//           "If Yes, provide details (i.e. name of business, nature of your involvement and amount and nature of your interest).",
//       },
//       {
//         title: "",
//       },
//       {
//         title: "Your Name",
//         entry: "Pink_Klein",
//       },
//       {
//         title: "Date",
//         entry: "2023-10-01",
//       },
//       {
//         title: "Please check the box below to give your consent",
//         entry: "1) 0: I 1:   2: a 3: g 4: r 5: e 6: e ;",
//       },
//     ],
//     applicationCode: "79474-9772",
//   },
// ];

const upload = multer({ dest: "uploads/" });

// Function to generate PDF from HTML using Puppeteer
async function generatePDF(data) {
  const html = template(data);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    margin: {
      top: 30,
      bottom: 30,
      left: 50,
      right: 50,
    },
  });

  await browser.close();

  return pdf;
}

// Generate PDFs for each data object in the array
async function generatePDFs(dataArray) {
  console.log(dataArray);
  const pdfPromises = dataArray.map(async (data, index) => {
    const pdf = await generatePDF(data);
    return {
      pdf,
      index,
      title: data.title,
      applicationCode: data.applicationCode,
    };
  });

  return Promise.all(pdfPromises);
}

// Send email with attached PDFs
async function sendEmailWithAttachments(pdfDataArray, files) {
  // const transporter = nodemailer.createTransport({
  //   host: "sandbox.smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: "58b54fb2facd56",
  //     pass: "b7e34c671979e1",
  //   },
  // });

  const mailOptions = {
    from: "info@bdic.com",
    to: ["lekan126@gmail.com", "somto8000@gmail.com"], //"valueenabler@gmail.com",
    subject: `${pdfDataArray[0].title} - ${pdfDataArray[0].applicationCode}`,
    text: "Application has been received",
    // attachments: pdfDataArray.map((pdfData) => ({
    //   filename: `${pdfData.title} - ${pdfData.applicationCode}.pdf`,
    //   content: pdfData.pdf,
    // })),

    attachments: [
      // Attach PDFs
      ...pdfDataArray.map((pdfData) => ({
        filename: `${pdfData.title} - ${pdfData.applicationCode}.pdf`,
        content: pdfData.pdf,
      })),
      // Attach files
      ...files.map((file) => ({
        filename: file.originalname,
        content: fs.createReadStream(file.path),
      })),
    ],
  };

  let auth = {
    auth: {
      api_key: "key-01c7fc84f6ea931e434cfc537630dd34",
      domain: "citizensraffle.org",
    },
    // proxy: 'http://user:pass@localhost:8080' // optional proxy, default is false
  };
  let transporter = nodemailer.createTransport(mg(auth));

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred while sending email:", error);
    } else {
      console.log("Email sent successfully!", info.response);
    }
  });
}

async function sendEmailWithAttachmentsUser(pdfDataArray, files, email) {
  const mailOptions = {
    from: "info@bdic.com",
    to: email, //"valueenabler@gmail.com",
    subject: `Your application has been sent`,
    html: `<div><p>Thank you for your interest in the BDIC’s programs. <br> Your unique ID is ${pdfDataArray[0].applicationCode}, you can expect a follow up (by phone or email) within 5 business days of submitting this form. <br> If you do not hear from us within this timeframe, please reach out to info@bdic.ca or call 867-767-9075 to ensure the information has been received.</p></div>`,

    attachments: [
      // Attach PDFs
      ...pdfDataArray.map((pdfData) => ({
        filename: `${pdfData.title} - ${pdfData.applicationCode}.pdf`,
        content: pdfData.pdf,
      })),
      // Attach files
      ...files.map((file) => ({
        filename: file.originalname,
        content: fs.createReadStream(file.path),
      })),
    ],
  };

  let auth = {
    auth: {
      api_key: "key-01c7fc84f6ea931e434cfc537630dd34",
      domain: "citizensraffle.org",
    },
    // proxy: 'http://user:pass@localhost:8080' // optional proxy, default is false
  };
  let transporter = nodemailer.createTransport(mg(auth));

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred while sending email:", error);
    } else {
      console.log("Email sent successfully!", info.response);
    }
  });
}

async function notifyPartners(emails, applicationCode) {
  const mailOptions = {
    from: "info@bdic.com",
    to: [...emails], //"valueenabler@gmail.com",
    subject: `Request for Personal Statement of Finance`,
    // text: `
    // Recently, an online program application was received by the NWT Business Development and Investment Corporation (BDIC) for a company in which you are an owner/shareholder. As part of the application, your email address was provided to the BDIC to gather additional information that is needed for the application.

    // Please follow the link below to complete a Personal Statement of Financial Affairs which will be required as part of the application process.
    // ${process.env.PSFA_LINK}

    // Your unique application code is ${applicationCode}. This unique application code will be required when you fill out your Personal Statement of Financial Affairs.
    // If you have any questions or would like additional information, please contact the BDIC at 867-767-9075 or send an email to info@bdic.ca.

    // Thank you.`,
    html: `<div>
    <p>Recently, an online program application was received by the NWT Business Development and Investment Corporation
        (BDIC) for a company in which you are an owner/shareholder.</p>
        
    <p>As part of the application, your email address was provided to the BDIC to gather additional information that is needed for the application.</p>
    <p>Please follow the link below to complete a Personal Statement of Financial Affairs which will be required as part
        of the application process. </p>
    <p> ${process.env.PSFA_LINK}</p>
    <p> Your unique application code is ${applicationCode}, This unique application code will be required when you fill
        out your Personal Statement of Financial Affairs.</p> 
    <p>If you have any questions or would like additional information, please contact the BDIC at 867-767-9075 or send
        an email to info@bdic.ca.</p>
    <p>Thank you.</p>
</div>`,
  };

  let auth = {
    auth: {
      api_key: "key-01c7fc84f6ea931e434cfc537630dd34",
      domain: "citizensraffle.org",
    },
    // proxy: 'http://user:pass@localhost:8080' // optional proxy, default is false
  };
  let transporter = nodemailer.createTransport(mg(auth));

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred while sending email:", error);
    } else {
      console.log("Email sent successfully!", info.response);
    }
  });
}

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/psfa", async (req, res) => {
  const dataArray = req.body;

  try {
    const pdfDataArray = await generatePDFs(dataArray);
    await sendEmailWithAttachments(pdfDataArray, []);
    res.send("PDFs generated and email sent successfully!");
  } catch (error) {
    console.log("Error occurred:", error);
    res
      .status(500)
      .send("An error occurred while generating PDFs and sending the email.");
  }
});

router.post("/apply", upload.array("files[]"), async (req, res) => {
  console.log(req.files);

  const files = req.files;

  const { entries, emails, applicationCode, userEmail } = JSON.parse(
    req.body.data
  );

  console.log(entries, emails);
  console.log(files);

  // return;

  try {
    const pdfDataArray = await generatePDFs(entries);
    await sendEmailWithAttachments(pdfDataArray, files);
    await sendEmailWithAttachmentsUser(pdfDataArray, files, userEmail);

    if (emails.length > 0) {
      await notifyPartners(emails, applicationCode);
    }

    res.send("PDFs generated and email sent successfully!");
  } catch (error) {
    console.log("Error occurred:", error);
    res
      .status(500)
      .send("An error occurred while generating PDFs and sending the email.");
  }
});

module.exports = router;
