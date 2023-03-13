let mongoose = require("mongoose");
let connection = require("../helper/database");
let log = require("../helper/logger");
let ERRORS = require("../helper/errorMessage");

let User = mongoose.model("User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  register: (data) => {
    return new Promise((resolve, reject) => {
      log.debug("register");
      User.findOne({ email: data.email })
        .then((resUser) => {
          console.log("resUser", resUser);
          if (resUser) {
            reject(ERRORS.USER_ALREADY_REGISTERED);
          } else {
            bcrypt.genSalt(saltRounds, function (err, salt) {
              bcrypt.hash(data.password, salt, function (err, hash) {
                data["password"] = hash;
                var user = new User(data);
                user
                  .save()
                  .then((resData) => {
                    resolve(resData);
                  })
                  .catch((error) => {
                    log.error(error);
                    reject(ERRORS.SOMETHING_WENT_WRONG);
                  });
              });
            });
          }
        })
        .catch((error) => {
          log.error(error);
          reject(ERRORS.SOMETHING_WENT_WRONG);
        });
    });
  },

  loginWithSocial: (data) => {
    return new Promise((resolve, reject) => {
      var object = {};
      if (data.hasOwnProperty("email")) {
        object["email"] = data.email;
      }
      User.findOne({
        ...object,
        status: {
          $ne: "deleted",
        },
      }).then((resUser) => {
        if (resUser) {
          resolve(resUser);
        } else {
          var obj = {
            email: data && data.email ? data.email : null,
            firstName: data.firstName,
            lastName: data.lastName,
            designation: "User",
            loginType: data.loginType,
            isEmailVerified: data && data.email ? "Verified" : "Not",
          };
          var user = new User(obj);
          user
            .save()
            .then((resData) => {
              resolve(resData);
            })
            .catch((error) => {
              console.log("error", error);

              reject(error);
            });
        }
      });
    });
  },

  login: (user) => {
    return new Promise((resolve, reject) => {
      log.info("user", user);
      var object = {};
      if (user.hasOwnProperty("email")) {
        object["email"] = user.email;
      } else {
        object["mobileNumber"] = user.mobileNumber;
      }
      User.findOne({
        ...object, //Spread Oparetor
        status: {
          $ne: "deleted",
        },
      })
        .then((resData) => {
          console.log(resData);
          if (!resData) {
            reject({
              code: 400,
            }); //Email not found
          } else {
            if (resData.isEmailVerified !== "Verified") {
              reject("Please verify email");
            } else {
              bcrypt.compare(
                user.password,
                resData.password,
                function (err, result) {
                  if (result) {
                    User.findByIdAndUpdate(
                      {
                        _id: resData._id,
                      },
                      {
                        isOnline: true,
                      },
                      {
                        $new: true,
                      }
                    )
                      .then((response) => {
                        delete resData.password;
                        delete resData.location;
                        resolve(resData);
                      })
                      .catch((error) => {
                        reject({
                          code: 401,
                        }); //Wrong password
                      });
                  } else {
                    reject("wrong password"); //wrong Password
                  }
                }
              );
            }
          }
        })
        .catch((error) => {
          log.error(error);
          reject(error);
        });
    });
  },

  verifyEmail: (email) => {
    return new Promise((resolve, reject) => {
      log.info("user", email);
      // User.findOne({
      //   encryptedEmail: email,
      // })
      User.findOneAndUpdate(
        {
          encryptedEmail: email,
        },
        {
          isEmailVerified: "Verified",
          encryptedEmail: null,
        },
        {
          new: true,
        }
      )
        .then((resData) => {
          if (resData) {
            log.info("resData", resData);
          } else {
            reject(ERRORS.EMAIL_NOT_FOUND);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  verifyMobile: (mobile, otp) => {
    return new Promise((resolve, reject) => {
      log.info("user", mobile, otp);
      User.findOneAndUpdate(
        {
          mobileNumber: mobile,
          otp: otp,
        },
        {
          isMobileVerified: "Verified",
          otp: null,
        },
        {
          new: true,
        }
      )
        .then((resData) => {
          if (resData) {
            resolve(resData);
          } else {
            reject(ERRORS.WRONG_OTP);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
