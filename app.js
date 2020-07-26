process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
var path = require("path");
var multer = require("multer");
var async = require("async");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const { count } = require("console");
const { stringify } = require("querystring");
const fs = require("fs");
const { assign, forEach } = require("lodash");
const nodemailer = require("nodemailer");
var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  passportLocalMongoose = require("passport-local-mongoose");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var cookieParser = require("cookie-parser");
var crypto = require("crypto");
const xoauth2 = require("xoauth2");
const sharp = require("sharp");
const connectDb = require("./config/db");

connectDb();
// var teacher_subject_arrray=[];
var FacultyName;
var FacultyId;
var teacher_subject_arrray = [];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//session for notification
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const studentSchema = new mongoose.Schema({
  image: {
    type: String,
    default: null,
    data: Buffer,
  },
  name: String,
  enroll_id: String,
  email: String,
  mob: Number,
  fname: String,
  gender: String,
  dob: String,
  address: String,
  course: String,
  sem: String,
  bsy: String,
  bey: String,
  password: {
    type: String,
    default: null,
  },
});

const teacherSchema = new mongoose.Schema({
  t_name: String,
  t_id: String,
  email: String,
  mob: Number,
  fname: String,
  gender: String,
  mob: Number,
  dob: String,
  address: String,
  subject: Array,
  work_since: String,
  password: {
    type: String,
    default: null,
  },
});

const adminSchema = new mongoose.Schema({
  admin_id: String,
  password: String,
});

const attendSchema = new mongoose.Schema({
  name: String,
  enroll_id: String,
  t_name: String,
  t_id: String,
  course: String,
  subject: String,
  date: String,
  attend: String,
});

const complainSchema = new mongoose.Schema({
  date: String,
  enroll_id: String,
  sub: String,
  message: String,
});

const noticeSchema = new mongoose.Schema({
  subject: String,
  message: String,
  date: String,
});

const testSchema = new mongoose.Schema({
  name: String,
  enroll_id: String,
  t_id: String,
  t_name: String,
  subject: String,
  course: String,
  date: String,
  marks_from: Number,
  exam_name: String,
  marks: String,
  result: String,
});

var assignSchema = new mongoose.Schema({
  A_id: Number,
  t_id: String,
  date: String,
  due_date: String,
  due_allowed: String,
  course: String,
  sem: String,
  assPath: String,
  subject: String,
  message: String,
});

var submit_assignSchema = new mongoose.Schema({
  A_id: String,
  enroll_id: String,
  name: String,
  date: String,
  due_allowed: String,
  due_date: String,
  submit_date: String,
  assPath: String,
  subject: String,
  message: String,
  st_message: String,
  fileuploadPath: String,
});

var picSchema = new mongoose.Schema({
  t_id: String,
  picspath: String,
  subject: String,
  date: String,
  course: String,
  sem: String,
});

var courseSchema = new mongoose.Schema({
  course: String,
});

const Stud = mongoose.model("Stud", studentSchema);
const teacher = mongoose.model("teacher", teacherSchema);
const stAttendance = mongoose.model("stAttendance", attendSchema);
const stComplain = mongoose.model("stComplain", complainSchema);
const tNotice = mongoose.model("tNotice", noticeSchema);
const stTest = mongoose.model("stTest", testSchema);
const stAssignment = mongoose.model("stAssignment", assignSchema);
const stSubmitAssignment = mongoose.model(
  "stSubmitAssignment",
  submit_assignSchema
);
const CourseDb = mongoose.model("CourseDb", courseSchema);
var picModel = mongoose.model("picsdemo", picSchema);
var adminDb = mongoose.model("adminDb", adminSchema);

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Centre for Development of Advanced Computing (C-DAC) is the premier R&D organization of the Ministry of Electronics and Information Technology (MeitY) for carrying out R&D in IT, Electronics and associated areas.  Different areas of C-DAC, had originated at different times, many of which came out as a result of identification of opportunities.<br><ul><li>The setting up of C-DAC in 1988 itself was to built Supercomputers in context of denial of import of Supercomputers by USA. Since then C-DAC has been undertaking building of multiple generations of Supercomputer starting from PARAM with 1 GF in 1988.</li><li>Almost at the same time, C-DAC started building Indian Language Computing Solutions with setting up of GIST group (Graphics and Intelligence based Script Technology); National Centre for Software Technology (NCST) set up in 1985 had also initiated work in Indian Language Computing around the same period.</li><li>Electronic Research and Development Centre of India (ER&DCI) with various constituents starting as adjunct entities of various State Electronic Corporations, had been brought under the hold of Department of Electronics and Telecommunications (now MeitY) in around 1988. They were focusing on various aspects of applied electronics, technology and applications.</li><li>With the passage of time as a result of creative ecosystem that got set up in C-DAC, more areas such as Health Informatics, etc., got created; while right from the beginning the focus of NCST was on Software Technologies; similarly C-DAC started its education & training activities in 1994 as a spin-off with the passage of time, it grew to a large efforts to meet the growing needs of Indian Industry for finishing schools.</li></ul><br>C-DAC has today emerged as a premier R&D organization in IT&E (Information Technologies and Electronics) in the country working on strengthening national technological capabilities in the context of global developments in the field and responding to change in the market need in selected foundation areas.  In that process, C-DAC represents a unique facet working in close junction with MeitY to realize nation’s policy and pragmatic interventions and initiatives in Information Technology. As an institution for high-end Research and Development (R&D), C-DAC has been at the forefront of the Information Technology (IT) revolution, constantly building capacities in emerging/enabling technologies and innovating and leveraging its expertise, caliber, skill sets to develop and deploy IT products and solutions for different sectors of the economy, as per the mandate of its parent, the Ministry of Electronics and Information Technology, Ministry of Communications and Information Technology, Government of India and other stakeholders including funding agencies, collaborators, users and the market-place.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

var fileTime;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const UserId = req.body;
    const dir = "./public/uploads";
    cb(null, dir);
  },
  filename(req, file, cb) {
    fileTime = Date.now();
    //cb(null, file.fieldname + '-' + Date.now())
    cb(null, fileTime + file.originalname);
  },
});

var upload = multer({ storage: storage });

app.set("views", path.resolve(__dirname, "views"));

var picPath = path.resolve(__dirname, "public");

app.use(express.static(picPath));

app.use(bodyParser.urlencoded({ extended: false }));

//student side code starts
//login and signup starts here

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/log");
}
passport.use(
  "User-local",
  new LocalStrategy(
    { usernameField: "enroll", passwordField: "password" },
    (enroll, password, done) => {
      Stud.findOne({ enroll_id: enroll }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: "Invalid enrollment_id or password",
          });
        }
        // comparing password with the hashed one stored inside db.
        bcrypt.compare(password, user.password, (err, MatchFound) => {
          if (err) {
            console.log(err);
          }
          if (MatchFound) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Invalid enrollment_id or password",
            });
          }
        });
      });
    }
  )
);

app.post(
  "/login",
  passport.authenticate("User-local", {
    successRedirect: "/studenthome",
    failureRedirect: "/log",
    failureFlash: true,
  })
);

app.post("/signin", function (req, res) {
  Stud.countDocuments({ enroll_id: req.body.enroll }).then((count) => {
    if (count > 0) {
      Stud.findOne(
        { enroll_id: req.body.enroll },
        { password: 1 },
        (err, passData) => {
          if (passData.password == null) {
            if (
              !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                String(req.body.email)
              )
            ) {
              req.flash("message", "Email is not valid");
              return res.redirect("/signup");
            }
            if (
              !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@]{8,}$/.test(
                String(req.body.pass)
              )
            ) {
              req.flash("message", "Password is not valid");
              return res.redirect("/signup");
            }
            if (
              !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@]{8,}$/.test(
                String(req.body.conpass)
              )
            ) {
              req.flash("message", "Password is not valid");
              return res.redirect("/signup");
            }
            if (req.body.conpass == req.body.pass) {
              const salt = bcrypt.genSaltSync(10);
              const hash = bcrypt.hashSync(req.body.pass, salt);
              Stud.updateOne(
                { enroll_id: req.body.enroll },
                { $set: { password: hash } },
                (err) => {
                  if (!err) {
                    var transporter = nodemailer.createTransport({
                      service: "gmail",
                      auth: {
                        user: "paycar5111@gmail.com",
                        pass: "S7@23094094",
                      },
                    });

                    var mailOptions = {
                      from: "paycar5111@gmail.com",
                      to: req.body.email,
                      subject: "Sending Email using Node.js",
                      text:
                        "You are receiving this because you signup in student portal of Cdac .\n\n" +
                        "Please click on the following link, or paste this into your browser to go to the  Login page, Your crdentials are :\n\n" +
                        "Enrollment Number: " +
                        req.body.enroll +
                        "\n\n Password:  " +
                        req.body.pass +
                        " \n\nhttp://" +
                        req.headers.host +
                        "/" +
                        "\n\n",
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                      if (error) {
                        console.log(error);
                      } else {
                        req.flash(
                          "message",
                          "" + req.body.name + " you are successfully signed up"
                        );
                        res.redirect("/log");
                      }
                    });
                  }
                }
              );
            } else {
              req.flash("message", "Password do not match");
              res.redirect("/signup");
            }
          } else {
            req.flash("message", "Already Signed up , Please login");
            res.redirect("/signup");
          }
        }
      );
    } else {
      req.flash(
        "message",
        "Sorry,Enrollment id " +
          req.body.enroll +
          " is not recognized institute id"
      );
      res.redirect("/signup");
    }
  });
});

//teacher signup and login

app.get("/teachLog", (req, res) => {
  res.render("teachLog", { message: req.flash("message") });
});
app.get("/teachSignup", (req, res) => {
  res.render("teachSignup", { message: req.flash("message") });
});

app.post("/teacherSignin", (req, res) => {
  teacher.countDocuments({ t_id: req.body.enroll }).then((count) => {
    if (count > 0) {
      teacher.findOne(
        { t_id: req.body.enroll },
        { password: 1 },
        (err, passData) => {
          if (passData.password == null) {
            if (
              !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                String(req.body.email)
              )
            ) {
              req.flash("message", "Email is not valid");
              return res.redirect("/teachSignup");
            }
            if (
              !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@]{8,}$/.test(
                String(req.body.pass)
              )
            ) {
              req.flash("message", "Password is not valid");
              return res.redirect("/teachSignup");
            }
            if (
              !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@]{8,}$/.test(
                String(req.body.conpass)
              )
            ) {
              req.flash("message", "Password is not valid");
              return res.redirect("/teachSignup");
            }
            if (req.body.conpass == req.body.pass) {
              const salt = bcrypt.genSaltSync(10);
              const hash = bcrypt.hashSync(req.body.pass, salt);
              teacher.updateOne(
                { t_id: req.body.enroll },
                { $set: { password: hash } },
                (err) => {
                  if (!err) {
                    req.flash(
                      "message",
                      "" + req.body.name + " you are successfully signed up"
                    );
                    res.redirect("/teachLog");
                  }
                }
              );
            } else {
              req.flash("message", "Password do not match");
              res.redirect("/teachSignup");
            }
          } else {
            req.flash("message", "Already signed up, Please login");
            res.redirect("/teachSignup");
          }
        }
      );
    } else {
      req.flash(
        "message",
        "Sorry,Teacher id " +
          req.body.enroll +
          " is not a recognized institute id"
      );
      res.redirect("/teachSignup");
    }
  });
});

passport.use(
  "teacher-local",
  new LocalStrategy(
    { usernameField: "enroll", passwordField: "password" },
    (enroll, password, done) => {
      teacher.findOne({ t_id: enroll }, function (err, Tuser) {
        if (err) {
          return done(err);
        }
        if (!Tuser) {
          return done(null, false, {
            message: "Invalid Teacher Id or password",
          });
        }
        bcrypt.compare(password, Tuser.password, (err, MatchFound) => {
          if (err) {
            console.log(err);
          }
          if (MatchFound) {
            return done(null, Tuser);
          } else {
            return done(null, false, {
              message: "Invalid Teacher Id or password",
            });
          }
        });
      });
    }
  )
);

function isLogged(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/teachLog");
}

app.post(
  "/teacherlogin",
  passport.authenticate("teacher-local", {
    successRedirect: "/faculty",
    failureRedirect: "/teachLog",
    failureFlash: true,
  })
);
//teacher signup and login ends here
//forget code
app.post("/forPass", (req, res) => {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString("hex");
        done(err, token);
      });
    },
    function (token, done) {
      Stud.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
          req.flash("error", "No account with that email address exists.");
          return res.redirect("/stForgetPass");
        }
        Email = user.email;
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "paycar5111@gmail.com",
          pass: "S7@23094094",
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      var mailOptions = {
        from: "paycar5111@gmail.com",
        to: Email,
        subject: "Sending Email using Node.js",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
          "http://" +
          req.headers.host +
          "/newPassword" +
          "\n\n" +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          req.flash(
            "message",
            "Please go to your mail to continue with change password"
          );
          res.redirect("/log");
        }
      });
    },
  ]);
});

app.post("/newStPass", function (req, res) {
  Stud.findOne({ email: Email }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      req.flash("message", "Email id not registered");
      res.redirect("/stForgetPass");
    } else {
      if (
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@]{8,}$/.test(
          String(req.body.password)
        )
      ) {
        req.flash("message", "Password is not valid");
        res.redirect("/newPassword");
      }
      if (
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@]{8,}$/.test(
          String(req.body.conpassword)
        )
      ) {
        req.flash("message", "Password is not valid");
        res.redirect("/newPassword");
      }

      if (req.body.conpassword == req.body.password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        Stud.updateOne(
          { email: Email },
          { $set: { password: hash } },
          (err) => {
            req.flash("message", "Password has been changed successfully");
            res.redirect("/log");
          }
        );
      } else {
        req.flash("message", "Password does not match");
        res.redirect("/newPassword");
      }
    }
  });
});
///////////

app.post("/TeachForget", (req, res) => {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString("hex");
        done(err, token);
      });
    },
    function (token, done) {
      teacher.findOne({ email: req.body.Temail }, function (err, user) {
        if (!user) {
          req.flash("error", "No account with that email address exists.");
          return res.redirect("/TeachForgetPass");
        }
        Email = user.email;
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "paycar5111@gmail.com",
          pass: "S7@23094094",
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      var mailOptions = {
        from: "paycar5111@gmail.com",
        to: Email,
        subject: "Sending Email using Node.js",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
          "http://" +
          req.headers.host +
          "/TeachNewPass" +
          "\n\n" +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          req.flash(
            "message",
            "Please go to your mail to continue with change password"
          );
          res.redirect("/teachLog");
        }
      });
    },
  ]);
});

app.post("/newTeachPass", function (req, res) {
  var flag = 0;
  teacher.findOne({ email: Email }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      req.flash("message", "Email id not registered");
      res.redirect("/TeachForgetPass");
    } else {
      if (
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@]{8,}$/.test(
          String(req.body.password)
        )
      ) {
        req.flash("message", "Password is not valid");
        res.redirect("/TeachNewPass");
      }
      if (
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@]{8,}$/.test(
          String(req.body.conpassword)
        )
      ) {
        req.flash("message", "Password is not valid");
        res.redirect("/TeachNewPass");
      }
      if (req.body.conpassword == req.body.password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        teacher.updateOne(
          { email: Email },
          { $set: { password: hash } },
          (err) => {
            req.flash("message", "Password has been changed successfully");
            res.redirect("/teachLog");
          }
        );
      } else {
        req.flash("message", "Password does not match");
        res.redirect("/TeachNewPass");
      }
    }
  });
});

function SessionConstructor(userId, userGroup, details) {
  this.userId = userId;
  this.userGroup = userGroup;
  this.details = details;
}

passport.serializeUser(function (userObject, done) {
  let userGroup = "Student";
  let userPrototype = Object.getPrototypeOf(userObject);

  if (userPrototype === Stud.prototype) {
    userGroup = "Student";
  } else {
    userGroup = "Teacher";
  }
  let sessionConstructor = new SessionConstructor(userObject.id, userGroup, "");
  done(null, sessionConstructor);
});

passport.deserializeUser(function (sessionConstructor, done) {
  if (sessionConstructor.userGroup == "Student") {
    Stud.findOne(
      {
        _id: sessionConstructor.userId,
      },
      "-localStrategy.password",
      function (err, user) {
        done(err, user);
      }
    );
  } else if (sessionConstructor.userGroup == "Teacher") {
    teacher.findOne(
      {
        _id: sessionConstructor.userId,
      },
      "-localStrategy.password",
      function (err, user) {
        done(err, user);
      }
    );
  }
});

var Student_course;
var Student_name;
var Student_sem;
var Student_enroll_id;
var imageData;

app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/log");
    }
  });
});

app.get("/teachLogout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/teachLog");
    }
  });
});

app.get("/log", (req, res) => {
  res.render("log", { message: req.flash("message") });
});

app.get("/signup", (req, res) => {
  res.render("signup", { message: req.flash("message") });
});

app.get("/stForgetPass", (req, res) => {
  res.render("stForgetPass", { message: req.flash("message") });
});

app.get("/newPassword", function (req, res) {
  res.render("newPassword", { message: req.flash("message") });
});

app.get("/TeachForgetPass", (req, res) => {
  res.render("TeachForgetPass", { message: req.flash("message") });
});

app.get("/TeachNewPass", function (req, res) {
  res.render("TeachNewPass", { message: req.flash("message") });
});

//login and signup ends here
//notes
app.get("/note", isLoggedIn, (req, res) => {
  req.session.name = Student_name;
  picModel.find({ course: Student_course, sem: Student_sem }, (err, data) => {
    if (err) {
      console.log(err);
    }
    if (data) {
      res.render("note", {
        im: imageData,
        loginName: Student_name,
        data: data,
      });
    } else {
      res.render("note", { im: imageData, loginName: Student_name, data: {} });
    }
  });
});

//Assignment code
app.get("/assupcoming", isLoggedIn, (req, res) => {
  stAssignment.find(
    { course: Student_course, sem: Student_sem },
    {},
    (err, data) => {
      res.render("assupcoming", {
        im: imageData,
        loginName: Student_name,
        message: req.flash("message"),
        data: data,
      });
    }
  );
});

app.get("/StudentUpAssign/:id/:sub", isLoggedIn, (req, res) => {
  res.render("StudentUpAssign", {
    im: imageData,
    loginName: Student_name,
    data: req.params.id,
    data1: req.params.sub,
  });
});

app.post("/assup/:id", upload.single("pic"), (req, res) => {
  var filePath = "uploads/" + fileTime + req.file.originalname;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;

  stAssignment.find({ _id: req.params.id }, {}, (err, data) => {
    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        var subAssign = new stSubmitAssignment({
          A_id: data[i].A_id,
          enroll_id: Student_enroll_id,
          name: Student_name,
          date: data[i].date,
          due_allowed: data[i].due_allowed,
          due_date: data[i].due_date,
          submit_date: today,
          assPath: data[i].assPath,
          subject: data[i].subject,
          message: data[i].message,
          st_message: req.body.msg,
          fileuploadPath: filePath,
        });
        subAssign.save();
      }
    }
    req.flash("message", "Assignment has been uploaded successfully");
    res.redirect("/assupcoming");
  });
});

app.get("/submittedassignmentSt", isLoggedIn, (req, res) => {
  stSubmitAssignment.find({ enroll_id: Student_enroll_id }, {}, (err, data) => {
    if (!err)
      res.render("submittedassignmentSt", {
        loginName: Student_name,
        im: imageData,
        message: req.flash("message"),
        data: data,
      });
  });
});

app.get("/StudentReUpAssign/:id/:sub", isLoggedIn, (req, res) => {
  res.render("StudentReUpAssign", {
    loginName: Student_name,
    im: imageData,
    data: req.params.id,
    data1: req.params.sub,
  });
});

app.post("/AssignReupload/:id", upload.single("pic"), (req, res) => {
  var Path = "uploads/" + fileTime + req.file.originalname;
  stSubmitAssignment.updateOne(
    { _id: req.params.id },
    { $set: { st_message: req.body.msg, fileuploadPath: Path } },
    (err) => {
      if (!err) {
        req.flash("message", "Assignment has been Re-Uploaded successfully");
        res.redirect("/submittedassignmentSt");
      }
    }
  );
});

app.get("/AssignDownload/:id", (req, res) => {
  stSubmitAssignment.find({ _id: req.params.id }, (err, data) => {
    if (!err) {
      var path = __dirname + "/public/" + data[0].assPath;
      res.download(path);
    }
  });
});

app.get("/SubmittedAssignDownload/:id", (req, res) => {
  stSubmitAssignment.find({ _id: req.params.id }, (err, data) => {
    if (!err) {
      var path = __dirname + "/public/" + data[0].fileuploadPath;
      res.download(path);
    }
  });
});

//assignment code ends here
//attendance code starts here
app.get("/attendance", isLoggedIn, (req, res) => {
  var array = [];
  var array1 = [];
  var test = [];

  stAttendance.aggregate(
    [
      { $match: { enroll_id: Student_enroll_id } },
      { $group: { _id: { subject: "$subject" }, count: { $sum: 1 } } },
      { $sort: { "_id.subject": 1 } },
    ],
    function (err, user) {
      array = user;
      array.forEach(function (current_value) {});
    }
  );

  stAttendance.aggregate(
    [
      { $match: { enroll_id: Student_enroll_id, attend: "Absent" } },
      { $group: { _id: { subject: "$subject" }, count: { $sum: 1 } } },
      { $sort: { "_id.subject": 1 } },
    ],
    function (err, user) {
      test = user;
      test.forEach(function (current_value, index) {
        array.forEach(function (current, i) {
          if (current_value._id.subject == current._id.subject) {
            if (array[i].count == current_value.count) {
              array[i].count = 0;
            }
          }
        });
      });
    }
  );

  stAttendance.aggregate(
    [
      { $match: { enroll_id: Student_enroll_id, attend: "Present" } },
      { $group: { _id: { subject: "$subject" }, count: { $sum: 1 } } },
      { $sort: { "_id.subject": 1 } },
    ],
    function (err, user) {
      array1 = user;
      array1.forEach(function (current_value, index) {
        array.forEach(function (current, i) {
          if (current_value._id.subject == current._id.subject) {
            array[i].count = (current_value.count / array[i].count) * 100;
          }
        });
      });
      res.render("attendance", {
        im: imageData,
        loginName: Student_name,
        data: array,
      });
    }
  );
});

app.get("/subjectattendance", isLogged, (req, res) => {
  stAttendance.find(
    { enroll_id: Student_enroll_id, subject: req.body.subjectId },
    {},
    (err, pData) => {
      res.render("subjectattendance", { attData: pData });
    }
  );
});

app.get("/attendSpecific", isLoggedIn, (req, res) => {
  stAttendance.find({}, {}, (err, attendData) => {
    if (!err) {
      res.render("attendSpecific", {
        im: imageData,
        loginName: Student_name,
        data: attendData,
      });
    }
  });
});

app.get("/attendanceof/:id", isLoggedIn, (req, res) => {
  stAttendance.find(
    { subject: req.params.id, enroll_id: Student_enroll_id },
    {},
    (err, attendData) => {
      if (!err)
        res.render("attendSpecific", {
          im: imageData,
          loginName: Student_name,
          data: attendData,
          subName: req.params.id,
        });
    }
  );
});
//attendance code ends here
//student home code starts here
app.get("/studenthome", isLoggedIn, function (req, res) {
  if (req.session.passport.user.userGroup == "Student") {
    Stud.find(
      { _id: req.session.passport.user.userId },
      { image: 1, enroll_id: 1, name: 1, course: 1, sem: 1, _id: 0 },
      (err, sesData) => {
        for (var kkey in sesData) {
          if (sesData.hasOwnProperty(kkey)) {
            (Student_enroll_id = sesData[kkey].enroll_id),
              (Student_name = sesData[kkey].name),
              (Student_course = sesData[kkey].course),
              (Student_sem = sesData[kkey].sem),
              (imageData = sesData[kkey].image);
          }
        }
      }
    );
    Stud.find({ _id: req.session.passport.user.userId }, {}, (err, stData) => {
      stAssignment
        .find(
          { course: Student_course, sem: Student_sem },
          { assPath: 1 },
          (err, assignData) => {
            tNotice
              .find({}, { subject: 1 }, (err, nData) => {
                picModel
                  .find(
                    { course: Student_course, sem: Student_sem },
                    { subject: 1 },
                    (err, comData) => {
                      if (!err) {
                        res.render("studenthome", {
                          loginName: Student_name,
                          message: req.flash("message"),
                          im: imageData,
                          cData: comData,
                          noticeData: nData,
                          data: stData,
                          aData: assignData,
                        });
                      }
                    }
                  )
                  .limit(3)
                  .sort({ date: -1 });
              })
              .limit(3)
              .sort({ date: -1 });
          }
        )
        .limit(3)
        .sort({ date: -1 });
    });
  } else {
    req.flash("message", "Please, login first");
    res.redirect("/log");
  }
});

app.post("/uploadImage", upload.single("fileInput"), (req, res) => {
  var imagePath = "uploads/" + fileTime + req.file.originalname;
  Stud.updateOne(
    { _id: req.session.passport.user.userId },
    { $set: { image: imagePath } },
    (err) => {
      req.flash("message", "Photo has been updated successfully");
      res.redirect("/studenthome");
    }
  );
});

app.post("/mobilechange", (req, res) => {
  Stud.updateOne(
    { _id: req.session.passport.user.userId },
    { $set: { mob: req.body.newMobile } },
    (err) => {
      req.flash(
        "message",
        "Mobile Number " + req.body.newMobile + " has been updated successfully"
      );
      res.redirect("/studenthome");
    }
  );
});

app.post("/addresschange", (req, res) => {
  Stud.updateOne(
    { _id: req.session.passport.user.userId },
    { $set: { address: req.body.newAddress } },
    (err) => {
      req.flash(
        "message",
        "New address " + req.body.newAddress + " has been updated successfully"
      );
      res.redirect("/studenthome");
    }
  );
});

app.post("/emailchange", (req, res) => {
  Stud.updateOne(
    { _id: req.session.passport.user.userId },
    { $set: { email: req.body.newEmail } },
    (err) => {
      req.flash(
        "message",
        "Email id " + req.body.newEmail + " has been updated successfully"
      );
      res.redirect("/studenthome");
    }
  );
});

//student home code ends here
//student test code starts here
app.get("/studentTest", isLoggedIn, (req, res) => {
  stTest.distinct("exam_name", (err, examData) => {
    stTest.distinct("subject", (err, subData) => {
      if (!err)
        res.render("studentTest", {
          im: imageData,
          loginName: Student_name,
          testData: {},
          sData: subData,
          eData: examData,
        });
    });
  });
});

app.post("/studentSearch", (req, res) => {
  stTest.distinct("exam_name", (err, examData) => {
    stTest.distinct("subject", (err, subData) => {
      if (req.body.sub == "Select a subject") {
        stTest
          .find(
            { exam_name: req.body.exam, enroll_id: Student_enroll_id },
            {},
            (err, testRecord) => {
              if (!err)
                res.render("studentTest", {
                  im: imageData,
                  loginName: Student_name,
                  testData: testRecord,
                  sData: subData,
                  eData: examData,
                });
            }
          )
          .sort({ enroll_id: 1, marks: -1 });
      } else if (req.body.exam == "Select a exam") {
        stTest
          .find(
            { subject: req.body.sub, enroll_id: Student_enroll_id },
            {},
            (err, testRecord) => {
              if (!err)
                res.render("studentTest", {
                  im: imageData,
                  loginName: Student_name,
                  testData: testRecord,
                  sData: subData,
                  eData: examData,
                });
            }
          )
          .sort({ enroll_id: 1, marks: -1 });
      } else if (
        req.body.exam != "Select a exam" &&
        req.body.sub != "Select a subject"
      ) {
        stTest
          .find(
            {
              subject: req.body.sub,
              exam_name: req.body.exam,
              enroll_id: Student_enroll_id,
            },
            {},
            (err, testRecord) => {
              if (!err)
                res.render("studentTest", {
                  im: imageData,
                  loginName: Student_name,
                  testData: testRecord,
                  sData: subData,
                  eData: examData,
                });
            }
          )
          .sort({ enroll_id: 1, marks: -1 });
      }
    });
  });
});

//student test code ends here
//complaint code starts here
app.get("/complaint", isLoggedIn, (req, res) => {
  stComplain.find({ enroll_id: Student_enroll_id }, {}, (err, comp) => {
    if (!err)
      res.render("complaint", {
        im: imageData,
        loginName: Student_name,
        compData: comp,
        message: req.flash("message"),
      });
  });
});

app.post("/complaint-post", isLoggedIn, (req, res) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  const newComplain = new stComplain({
    date: today,
    enroll_id: Student_enroll_id,
    sub: req.body.subject,
    message: req.body.msg,
  });
  newComplain.save(function (err) {
    if (!err) {
      req.flash("message", "Complaint hasbeen filed successfully");
      res.redirect("/complaint");
    }
  });
});
//complaint code ends here
//notice code starts here

app.get("/studentNotice", isLoggedIn, (req, res) => {
  tNotice
    .find({}, { subject: 1, message: 1, date: 1 }, function (err, noticeData) {
      if (!err)
        res.render("studentNotice", {
          im: imageData,
          loginName: Student_name,
          cirData: noticeData,
        });
    })
    .sort({ date: -1 });
});
//notice code ends here
//student side code ends
//teacher side code starts here
//assignment code starts

app.get("/teacherassign", isLogged, (req, res) => {
  stAssignment.find({ t_id: FacultyId }, {}, (err, data) => {
    var array = [];
    teacher.find(
      { t_id: FacultyId },
      { subject: 1, _id: 0 },
      (err, subData) => {
        Stud.distinct("course", (err, courseData) => {
          for (var key in subData) {
            if (subData.hasOwnProperty(key)) {
              array.push(subData[key].subject);
            }
          }
          if (data) {
            res.render("teacherassign", {
              loginName: FacultyName,
              data: data,
              message: req.flash("message"),
              courseData: courseData,
              subData: teacher_subject_arrray.toString().split(","),
            });
          } else {
            res.render("teacherassign", {
              loginName: FacultyName,
              data: {},
              message: req.flash("message"),
              courseData: courseData,
              subData: teacher_subject_arrray.toString().split(","),
            });
          }
        });
      }
    );
  });
});

app.post("/teacherassign", isLogged, upload.single("pic"), (req, res) => {
  console.log("In assign");
  var x = "uploads/" + fileTime + req.file.originalname;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  var ar;
  today = yyyy + "-" + mm + "-" + dd;
  stAssignment
    .find({}, { A_id: 1, _id: 0 }, (err, data) => {
      if (data.length == 0) {
        ar = 0;
      } else {
        data.forEach(function (item) {
          ar = item.A_id;
        });
      }
      var sta = new stAssignment({
        A_id: ++ar,
        t_id: FacultyId,
        date: today,
        course: req.body.cour,
        sem: req.body.semester,
        due_date: req.body.time,
        due_allowed: req.body.duesub,
        assPath: x,
        subject: req.body.sub,
        message: req.body.msg,
      });
      sta.save((err, data) => {
        if (!err) {
          req.flash(
            "message",
            "Assignment of " + req.body.sub + " has been uploaded successfully"
          );
          res.redirect("/teacherassign");
        }
      });
    })
    .sort({ A_id: -1 })
    .limit(1);
});

app.get("/AssignDownload/:id", isLogged, (req, res) => {
  stAssignment.find({ _id: req.params.id }, (err, data) => {
    if (!err) {
      var path = __dirname + "/public/" + data[0].assPath;
      res.download(path);
    }
  });
});

app.post("/AssignDelete/:id", isLogged, (req, res) => {
  stAssignment.deleteOne({ _id: req.params.id }, (err) => {
    if (!err) {
      req.flash("message", "Assignment deleted successfully");
      res.redirect("/teacherassign");
    }
  });
});

app.get("/AssignmentSubmission", isLogged, (req, res) => {
  stSubmitAssignment
    .find({}, {}, (err, data) => {
      if (!err) {
        res.render("AssignmentSubmission", {
          data: data,
          loginName: FacultyName,
        });
      }
    })
    .sort({ enroll_id: 1 });
});

app.get("/AssignSubmission/:id", isLogged, (req, res) => {
  stSubmitAssignment
    .find({ A_id: req.params.id }, {}, (err, data) => {
      if (!err) {
        res.render("AssignmentSubmission", {
          data: data,
          loginName: FacultyName,
        });
      }
    })
    .sort({ enroll_id: 1 });
});
app.get("/SubAssignDownload/:id", isLogged, (req, res) => {
  stSubmitAssignment.find({ _id: req.params.id }, (err, data) => {
    if (!err) {
      var path = __dirname + "/public/" + data[0].fileuploadPath;
      res.download(path);
    }
  });
});

//assignment ends code  here
//notes code starts here
app.get("/facultynote", isLogged, (req, res) => {
  var array = [];
  picModel.find({ t_id: FacultyId }, {}, (err, data) => {
    teacher.find(
      { t_id: FacultyId },
      { subject: 1, _id: 0 },
      (err, subData) => {
        Stud.distinct("course", (err, courseData) => {
          for (var key in subData) {
            if (subData.hasOwnProperty(key)) {
              array.push(subData[key].subject);
            }
          }
          if (err) {
            console.log(err);
          }
          if (data) {
            res.render("facultynote", {
              loginName: FacultyName,
              data: data,
              courseData: courseData,
              subData: array.toString().split(","),
              message: req.flash("message"),
            });
          } else {
            res.render("facultynote", {
              loginName: FacultyName,
              data: {},
              courseData: courseData,
              subData: array.toString().split(","),
              message: req.flash("message"),
            });
          }
        });
      }
    );
  });
});

app.post("/facultynote", isLogged, upload.single("pic"), (req, res) => {
  var x = "uploads/" + fileTime + req.file.originalname;
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  var picss = new picModel({
    t_id: FacultyId,
    picspath: x,
    subject: req.body.sub,
    date: today,
    course: req.body.cour,
    sem: req.body.seme,
  });
  picss.save((err, data) => {
    if (!err) {
      req.flash(
        "message",
        "" + req.file.originalname + " has been uploaded successfully"
      );
      res.redirect("/facultynote");
    }
  });
});

app.post("/delete/:id", isLogged, (req, res) => {
  picModel.deleteOne({ _id: req.params.id }, (err) => {
    picModel.find((err, data) => {
      if (err) {
        console.log(err);
      }
      if (data) {
        req.flash("message", "Note deleted succesfully");
        res.redirect("/facultynote");
      } else {
        req.flash("message", "Note deleted succesfully");
        res.redirect("/facultynote");
      }
    });
  });
});

//notes code ends here
app.get("/faculty", isLogged, function (req, res) {
  if (req.session.passport.user.userGroup == "Teacher") {
    teacher.find(
      { _id: req.session.passport.user.userId },
      { t_name: 1, t_id: 1, subject: 1, _id: 0 },
      (err, sesData) => {
        for (var kkey in sesData) {
          if (sesData.hasOwnProperty(kkey)) {
            (FacultyId = sesData[kkey].t_id),
              (FacultyName = sesData[kkey].t_name),
              (teacher_subject_arrray = sesData[kkey].subject);
          }
        }
      }
    );

    teacher.find({ _id: req.session.passport.user.userId }, {}, (err, data) => {
      res.render("faculty", {
        loginName: FacultyName,
        data: data,
        message: req.flash("message"),
      });
    });
  } else {
    req.flash("message", "Please, login first");
    res.redirect("/teachLog");
  }
});

app.post("/teachmobilechange", (req, res) => {
  teacher.updateOne(
    { _id: req.session.passport.user.userId },
    { $set: { mob: req.body.newteachMobile } },
    (err) => {
      req.flash(
        "message",
        "Mobile number " +
          req.body.newteachMobile +
          " has been updated successfully"
      );
      res.redirect("/faculty");
    }
  );
});

app.post("/teachaddresschange", (req, res) => {
  teacher.updateOne(
    { _id: req.session.passport.user.userId },
    { $set: { address: req.body.newteachAddress } },
    (err) => {
      req.flash(
        "message",
        "New Address " +
          req.body.newteachAddress +
          " has been updated successfully"
      );
      res.redirect("/faculty");
    }
  );
});

app.post("/teachFatherUpdate", (req, res) => {
  teacher.updateOne(
    { _id: req.session.passport.user.userId },
    { $set: { fname: req.body.newteachFather } },
    (err) => {
      req.flash(
        "message",
        "Father Name " +
          req.body.newteachFather +
          " has been updated successfully"
      );
      res.redirect("/faculty");
    }
  );
});

app.post("/teachemailchange", (req, res) => {
  teacher.updateOne(
    { _id: req.session.passport.user.userId },
    { $set: { email: req.body.newteachEmail } },
    (err) => {
      req.flash(
        "message",
        "Email Id  " + req.body.newteachEmail + " has been updated successfully"
      );
      res.redirect("/faculty");
    }
  );
});

//query of marks page starts here
app.get("/teachTest", isLogged, (req, res) => {
  Stud.distinct("course", (err, courseData) => {
    res.render("teachTest", {
      loginName: FacultyName,
      message: req.flash("message"),
      courseData: courseData,
      data: {},
    });
  });
});

app.post("/enter_marks", isLogged, (req, res) => {
  Stud.distinct("course", (err, courseData) => {
    Stud.find({ course: req.body.cour, sem: req.body.semester }, function (
      err,
      markData
    ) {
      var array = [];
      teacher.find(
        { t_id: FacultyId },
        { subject: 1, _id: 0 },
        (err, subData) => {
          for (var key in subData) {
            if (subData.hasOwnProperty(key)) {
              array.push(subData[key].subject);
            }
          }
          if (!err)
            res.render("teachTest", {
              loginName: FacultyName,
              message: {},
              courseData: courseData,
              data: markData,
              subData: array.toString().split(","),
            });
        }
      );
    }).sort({ enroll_id: 1 });
  });
});

app.post("/post_marks/:cour/:seme", (req, res) => {
  var array = [];
  for (var key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      array.push(req.body[key]);
    }
  }
  var arl = array.length;
  var j = 4;
  var resTemp;
  Stud.find(
    { course: req.params.cour, sem: req.params.seme },
    {},
    (err, data) => {
      var comp = array[3];
      for (var i in data) {
        if (array[j] >= (array[3] / 100) * array[arl - 1]) {
          //  if(array[j]>=3){
          resTemp = "Pass";
        } else {
          resTemp = "Fail";
        }
        if (data.hasOwnProperty(i)) {
          const newMarks = new stTest({
            name: data[i].name,
            enroll_id: data[i].enroll_id,
            t_id: FacultyId,
            t_name: FacultyName,
            subject: array[0],
            course: data[i].course,
            date: array[2],
            marks_from: array[arl - 1],
            exam_name: array[1],
            marks: array[j],
            result: resTemp,
          });
          newMarks.save();
        }
        j++;
      }
    }
  );
  req.flash(
    "message",
    "Marks of " +
      array[0] +
      " subject for " +
      array[1] +
      " exam has been uploaded successfully"
  );
  res.redirect("/teachTest");
});

app.get("/teach_checkmarks", isLogged, (req, res) => {
  stTest.distinct("exam_name", (err, examData) => {
    res.render("teach_checkmarks", {
      loginName: FacultyName,
      testData: {},
      examData: examData,
      subData: teacher_subject_arrray.toString().split(","),
    });
  });
});

app.post("/get_marks", isLogged, (req, res) => {
  if (req.body.exam != "Select exam" && req.body.enroll == "") {
    stTest
      .find(
        { exam_name: req.body.exam, subject: req.body.sub },
        {},
        (err, tsData) => {
          stTest.distinct("exam_name", (err, examData) => {
            if (!err)
              res.render("teach_checkmarks", {
                loginName: FacultyName,
                examData: examData,
                testData: tsData,
                subData: teacher_subject_arrray.toString().split(","),
              });
          });
        }
      )
      .sort({ enroll_id: 1 });
  }
  ///
  else if (req.body.exam != "Select exam" && req.body.enroll != " ") {
    stTest
      .find(
        {
          subject: req.body.sub,
          exam_name: req.body.exam,
          enroll_id: req.body.enroll,
        },
        {},
        (err, tsData) => {
          stTest.distinct("exam_name", (err, examData) => {
            if (!err)
              res.render("teach_checkmarks", {
                loginName: FacultyName,
                examData: examData,
                testData: tsData,
                subData: teacher_subject_arrray.toString().split(","),
              });
          });
        }
      )
      .sort({ enroll_id: 1 });
  }
  ////
  else if (req.body.exam == "Select exam" && req.body.enroll != " ") {
    stTest
      .find(
        { enroll_id: req.body.enroll, subject: req.body.sub },
        {},
        (err, tsData) => {
          stTest.distinct("exam_name", (err, examData) => {
            if (!err)
              res.render("teach_checkmarks", {
                loginName: FacultyName,
                examData: examData,
                testData: tsData,
                subData: teacher_subject_arrray.toString().split(","),
              });
          });
        }
      )
      .sort({ enroll_id: 1 });
  }
});
//query of marks ends here
//notice code starts here
app.get("/teachcomplaint", isLogged, (req, res) => {
  stComplain.find({}, {}, function (err, complainData) {
    if (!err)
      res.render("teachcomplaint", {
        loginName: FacultyName,
        comData: complainData,
      });
  });
});

app.get("/post_notice", isLogged, (req, res) => {
  tNotice.find({}, { subject: 1, message: 1, date: 1 }, function (
    err,
    noticeData
  ) {
    if (err) console.log(err);
    else
      res.render("post_notice", {
        loginName: FacultyName,
        message: req.flash("message"),
        cirData: noticeData,
      });
  });
});

app.post("/post_notice1", (req, res) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  const circular = new tNotice({
    subject: req.body.sub,
    message: req.body.msg,
    date: today,
  });

  circular.save(function (err) {
    if (!err) {
      req.flash("message", "Notice uploaded succesfully");
      res.redirect("/post_notice");
    }
  });
});

//notice code ends here
//attendance code starts here

app.get("/markattendance", isLogged, (req, res) => {
  Stud.distinct("course", (err, courseData) => {
    Stud.find((err) => {
      res.render("markattendance", {
        loginName: FacultyName,
        data1: courseData,
        message: req.flash("message"),
        data: {},
        subData: {},
      });
    });
  });
});

app.post("/get-data", isLogged, function (req, res) {
  Stud.distinct("course", (err, courseData) => {
    Stud.find(
      { course: req.body.cour, sem: req.body.semester },
      (err, studData) => {
        var array = [];
        teacher.find(
          { t_id: FacultyId },
          { subject: 1, _id: 0 },
          (err, subData) => {
            for (var key in subData) {
              if (subData.hasOwnProperty(key)) {
                array.push(subData[key].subject);
              }
            }
            if (!err)
              res.render("markattendance", {
                loginName: FacultyName,
                message: {},
                data: studData,
                data1: courseData,
                subData: array.toString().split(","),
              });
          }
        );
      }
    ).sort({ enroll_id: 1 });
  });
});

app.post("/post-attendance/:cou/:seme", isLogged, (req, res) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  var ar = [];
  for (var key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      ar.push(req.body[key]);
    }
  }
  var arl = ar.length;
  Stud.find(
    { course: req.params.cou, sem: req.params.seme },
    {},
    (err, data) => {
      for (var i in data) {
        if (data.hasOwnProperty(i)) {
          const newAttendance = new stAttendance({
            name: data[i].name,
            enroll_id: data[i].enroll_id,
            t_name: FacultyName,
            t_id: FacultyId,
            course: data[i].course,
            subject: ar[arl - 1],
            date: today,
            attend: ar[i],
          });
          newAttendance.save();
        }
      }
      req.flash(
        "message",
        "Attendance of " + ar[arl - 1] + " is marked successfully"
      );
      res.redirect("/markattendance");
    }
  );
});

app.get("/checkstudentattend", isLogged, (req, res) => {
  var array = [];
  teacher.find({ t_id: FacultyId }, { subject: 1, _id: 0 }, (err, subData) => {
    for (var key in subData) {
      if (subData.hasOwnProperty(key)) {
        array.push(subData[key].subject);
      }
    }
    res.render("checkstudentattend", {
      attData: {},
      loginName: FacultyName,
      subData: teacher_subject_arrray.toString().split(","),
    });
  });
});

app.post("/checkAttendanceStudent", isLogged, (req, res) => {
  var array = [];
  stAttendance.find(
    { enroll_id: req.body.enroll, subject: req.body.sub },
    {},
    (err, attData) => {
      teacher.find({ t_id: 1 }, { subject: 1, _id: 0 }, (err, subData) => {
        for (var key in subData) {
          if (subData.hasOwnProperty(key)) {
            array.push(subData[key].subject);
          }
        }
        res.render("checkstudentattend", {
          attData: attData,
          loginName: FacultyName,
          subData: array.toString().split(","),
        });
      });
    }
  );
});

app.get("/checksubjectattend", isLogged, (req, res) => {
  var array = [];
  teacher.find({ t_id: 1 }, { subject: 1, _id: 0 }, (err, subData) => {
    for (var key in subData) {
      if (subData.hasOwnProperty(key)) {
        array.push(subData[key].subject);
      }
    }
    res.render("checksubjectattend", {
      loginName: FacultyName,
      data: {},
      subData: array.toString().split(","),
    });
  });
});

app.post("/checksubjectattendance", isLogged, (req, res) => {
  var array = [];
  stAttendance.find(
    { subject: req.body.sub, date: req.body.attDate },
    function (err, attendData1) {
      teacher.find({ t_id: 1 }, { subject: 1, _id: 0 }, (err, subData) => {
        for (var key in subData) {
          if (subData.hasOwnProperty(key)) {
            array.push(subData[key].subject);
          }
        }
        if (err) console.log(err);
        else {
          res.render("checksubjectattend", {
            loginName: FacultyName,
            data: attendData1,
            subData: array.toString().split(","),
          });
        }
      });
    }
  );
});

//assignment code ends here
//teacher student common codes starts here
app.get("/download/:id", (req, res) => {
  picModel.find({ _id: req.params.id }, (err, data) => {
    if (!err) {
      var path = __dirname + "/public/" + data[0].picspath;
      res.download(path);
    }
  });
});

//teacher student common codes ends here
app.get("/", function (req, res) {
  res.render("home", { HomeInfo: homeStartingContent });
});

app.get("/about", function (req, res) {
  res.render("about", { Ainfo: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { CInfo: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/Product", function (req, res) {
  res.render("compose");
});

app.get("/Research", function (req, res) {
  res.render("compose");
});

app.get("/Press", function (req, res) {
  res.render("compose");
});

app.get("/Downloads", function (req, res) {
  res.render("compose");
});

app.get("/Careers", function (req, res) {
  res.render("compose");
});

app.get("/Tenders", function (req, res) {
  res.render("compose");
});

//enroll_id value will be replaced by session id
//Admin place starts

app.get("/adminLogin", (req, res) => {
  res.render("adminLogin", { message: req.flash("message") });
});

app.post("/Admin_login", (req, res) => {
  adminDb
    .countDocuments({ admin_id: req.body.aid, password: req.body.apass })
    .then((count) => {
      if (count > 0) {
        res.redirect("/admin");
      } else {
        req.flash("message", "Invalid Admin id and Password");
        res.redirect("/adminLogin");
      }
    });
});

app.get("/AdminForget", (req, res) => {
  res.render("AdminForget", { message: req.flash("message") });
});

app.post("/AdminForgetPass", (req, res) => {
  adminDb.countDocuments({ aadmin_id: req.body.aid }).then((count) => {
    if (count > 0) {
      if (
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@]{8,}$/.test(
          String(req.body.pass)
        )
      ) {
        req.flash("message", "Password is not valid");
        return res.redirect("/AdminForget");
      }
      if (
        !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@]{8,}$/.test(
          String(req.body.conpass)
        )
      ) {
        req.flash("message", "Password is not valid");
        return res.redirect("/AdminForget");
      }
    }
    if (req.body.password == req.body.conpassword) {
      adminDb.updateOne(
        { admin_id: req.body.aid },
        {
          $set: {
            password: req.body.password,
          },
        },
        (err) => {
          req.flash("message", "Password has been updated successfully");
          res.redirect("/adminLogin");
        }
      );
    } else {
      req.flash("message", "Password does not match");
      res.redirect("/AdminForget");
    }
  });
});

app.get("/admin", function (req, res) {
  res.render("admin", { message: req.flash("message") });
});

app.get("/addstudent", (req, res) => {
  res.render("addstudent", { message: req.flash("message") });
});
app.post("/addst", (req, res) => {
  const newStudent = new Stud({
    name: req.body.name,
    enroll_id: req.body.enroll,
    email: req.body.email,
    mobile: req.body.mob,
    gender: req.body.gen,
    fname: req.body.fname,
    dob: req.body.dob,
    address: req.body.address,
    course: req.body.course,
    sem: req.body.sem,
    bsy: req.body.syear,
    bey: req.body.eyear,
  });
  Stud.countDocuments({ enroll_id: req.body.enroll }).then((count) => {
    if (count > 0) {
      req.flash("message", "Student record has been already exists");
      res.redirect("/addstudent");
    } else {
      newStudent.save().then((doc) => {
        req.flash("message", "Student record has been added successfully");
        res.redirect("/addstudent");
      });
    }
  });
});

app.get("/editstudent", (req, res) => {
  res.render("editstudent", { data: {}, message: req.flash("message") });
});

app.post("/editstudent1", (req, res) => {
  Stud.find({ enroll_id: req.body.enrollment }, {}, (err, data) => {
    res.render("editstudent", { message: {}, data: data });
  });
});

app.post("/editstudent2/:id", (req, res) => {
  Stud.updateOne(
    { _id: req.params.id },
    {
      $set: {
        enroll_id: req.body.enroll1,
        name: req.body.name1,
        fname: req.body.fname1,
        gender: req.body.gender1,
        fname: req.body.fname1,
        dob: req.body.dob1,
        course: req.body.cour1,
        sem: req.body.seme,
        bsy: req.body.bsy1,
        bey: req.body.bey1,
      },
    },
    (err) => {
      if (!err) {
        req.flash(
          "message",
          "Record of Enrollment Id " +
            req.body.enroll1 +
            " has been updated successfully"
        );
        res.redirect("/editstudent");
      }
    }
  );
});

app.post("/deletestudent", (req, res) => {
  Stud.countDocuments({ enroll_id: req.body.Denroll }).then((count) => {
    if (count > 0) {
      Stud.deleteOne({ enroll_id: req.body.Denroll }, (err) => {
        req.flash(
          "message",
          "Record of student id " +
            req.body.Denroll +
            " has been successfully deleted"
        );
        res.redirect("/admin");
      });
    } else {
      req.flash(
        "message",
        "Record of student id " + req.body.Denroll + " is not available"
      );
      res.redirect("/admin");
    }
  });
});

app.get("/editteacher", (req, res) => {
  res.render("editteacher", { data: {}, message: req.flash("message") });
});

app.post("/editteacher1", (req, res) => {
  teacher.find({ t_id: req.body.tid1 }, {}, (err, data) => {
    res.render("editteacher", { message: {}, data: data });
  });
});

app.post("/editteacher2/:id", (req, res) => {
  teacher.update(
    { _id: req.params.id },
    {
      $set: {
        t_name: req.body.tname,
        t_id: req.body.tid,
        gender: req.body.gender1,
        work_since: req.body.work,
        subject: req.body.sub,
      },
    },
    (err) => {
      if (!err) {
        req.flash(
          "message",
          "Record of Teacher Id " +
            req.body.tid +
            " has been updated successfully"
        );
        res.redirect("/editteacher");
      }
    }
  );
});

app.post("/deleteteacher", (req, res) => {
  teacher.countDocuments({ t_id: req.body.Dtid }).then((count) => {
    if (count > 0) {
      teacher.deleteOne({ t_id: req.body.Dtid }, (err) => {
        req.flash(
          "message",
          "Record of teacher id " +
            req.body.Dtid +
            " has been successfully deleted"
        );
        res.redirect("/admin");
      });
    } else {
      req.flash(
        "message",
        "Record of teacher id " + req.body.Dtid + " is not available"
      );
      res.redirect("/admin");
    }
  });
});

app.get("/addteacher", (req, res) => {
  res.render("addteacher", { message: req.flash("message") });
});

app.post("/addCourse", (req, res) => {
  const newCourse = new CourseDb({
    course: req.body.cour,
  });
  newCourse.save(function (err) {
    req.flash(
      "message",
      "Course " + req.body.cour + " has been added successfully"
    );
    res.redirect("/admin");
  });
});

app.post("/addteach", (req, res) => {
  const newTeacher = new teacher({
    t_name: req.body.name,
    t_id: req.body.tid,
    email: req.body.email,
    mob: req.body.mob,
    gender: req.body.gen,
    fname: req.body.fname,
    dob: req.body.dob,
    address: req.body.address,
    work_since: req.body.time,
    subject: req.body.sub.split(","),
  });
  teacher.countDocuments({ t_id: req.body.tid }).then((count) => {
    if (count > 0) {
      req.flash("message", "Teacher id already registered");
      res.redirect("/addteacher");
    } else {
      newTeacher.save().then((doc) => {
        req.flash("message", "Teacher record added succesfully");
        res.redirect("/addteacher");
      });
    }
  });
});

app.get("/teacherDelete", (req, res) => {
  res.render("teacherDelete");
});
//Admin Place ends
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server started on port 3000");
});
module.exports = app;
