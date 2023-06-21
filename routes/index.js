var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Personal Statement of Financial Affairs",
    entries: [
      {
        title: "Your Application Code",
        entry: "79474-9772",
      },
      {
        title: "Your First Name",
        entry: "Anazodo",
      },
      {
        title: "Your Middle Name",
        entry: "Erin Prosacco",
      },
      {
        title: "Your Last Name",
        entry: "Somto",
      },
      {
        title: "Home Address",
        entry: "9 District Centre Kubwa Abuja",
      },
      {
        title: "Mailing Address (If different from home address)",
        entry: "434 Lucio Shores",
      },
      {
        title: "Community",
        entry: "Ulukhaktok",
      },
      {
        title: "If Other please specify",
      },
      {
        title: "Province/Territory",
        entry: "British Columbia",
      },
      {
        title: "Postal Code",
        entry: "A1A 2a2",
      },
      {
        title: "Telephone Number",
        entry: "(070) 696-39328",
      },
      {
        title: "Email Address",
        entry: "somto8000@gmail.com",
      },
      {
        title: "Your Employer",
        entry: "Mollitia quia omnis.",
      },
      {
        title: "Position",
        entry: "sit eos fuga",
      },
      {
        title: "Work Phone",
        entry: "(732) 265-8044",
      },
      {
        title: "Your Annual Income",
        entry:
          "Iste labore eius sunt quis sapiente facilis ducimus distinctio incidunt.",
      },
      {
        title: "Are you married?",
        entry: "yes",
      },
      {
        title: "Spouse First Name",
        entry: "Euna",
      },
      {
        title: "Spouse Surname",
        entry: "Herman_Mante81",
      },
      {
        title: "Spouse Annual Income",
        entry: "Inventore laboriosam labore molestias.",
      },
      {
        title: "List All Assets",
        entry:
          "1) description: Velit magni voluptatibus magni amet. amount: 422 ;",
      },
      {
        title: "List All Debts & Liabilities",
        entry:
          "1) description: Architecto facere mollitia facere minima dolor possimus nam accusamus eius. amount: 633 ;",
      },
      {
        title: "Total Net Worth",
        entry: -211,
      },
      {
        title: "Have you ever had an asset repossessed by a creditor?",
        entry: "no",
      },
      {
        title: "If Yes, please explain",
      },
      {
        title:
          "Are you involved in any lawsuits or claims that could affect your financial situation?",
        entry: "no",
      },
      {
        title: "If Yes, please explain",
      },
      {
        title: "Have you ever declared bankruptcy?",
        entry: "no",
      },
      {
        title: "If Yes, when",
      },
      {
        title: "Are you discharged?",
      },
      {
        title: "If  No, why?",
      },
      {
        title:
          "Do you have any outstanding liabilities to the Government of the Northwest Territories, Canada Revenue Agency or the Workers Safety and Compensation Commission?",
        entry: "no",
      },
      {
        title: "If Yes, please explain",
      },
      {
        title:
          "Are you a shareholder, director or stakeholder of any other business, corporation, partnership, proprietorship etc?",
        entry: "no",
      },
      {
        title:
          "If Yes, provide details (i.e. name of business, nature of your involvement and amount and nature of your interest).",
      },
      {
        title: "",
      },
      {
        title: "Your Name",
        entry: "Pink_Klein",
      },
      {
        title: "Date",
        entry: "2023-10-01",
      },
      {
        title: "Please check the box below to give your consent",
        entry: "1) 0: I 1:   2: a 3: g 4: r 5: e 6: e ;",
      },
    ],
    applicationCode: "79474-9772",
  });
});

module.exports = router;
