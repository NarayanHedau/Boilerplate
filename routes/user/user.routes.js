let router = require("express").Router();
let log = require("../../helper/logger");
let response = require("../../helper/response");
const commonController = require("../../controller/commonController");
const ERRORS = require("../../helper/errorMessage");
const _ = require("lodash");
const mongoose = require("mongoose");
const User = mongoose.model("User");
// const WalletTransaction = mongoose.model("WalletTransaction");
const auth = require("../../helper/auth");

router.get("/get/:userId", (req, res) => {
  commonController
    .getOne(User, {
      _id: req.params.userId,
    })
    .then((resData) => {
      var profile, usrnm;
      // if(resData.avatar){
      //     profile = resData.avatar
      // }
      // else {
      //     profile = ""
      // }
      var responseObj = {
        _id: resData._id,
        firstName: resData.firstName,
        lastName: resData.lastName,
        avatar: resData.avatar,
        username: resData.username,
        followers: 20,
        following: 20,
        likes: 20,
        rating: 30,
        paidVideos: 20,
      };
      responseObj.firstName != null
        ? responseObj.firstName
        : (responseObj.firstName = "");
      responseObj.avatar != null
        ? responseObj.avatar
        : (responseObj.avatar = "");
      responseObj.username != null
        ? responseObj.username
        : (responseObj.username = "");
      response.successResponse(res, 200, responseObj);
    })
    .catch((error) => {
      log.error("Error :", error);
      response.errorMsgResponse(res, 301, ERRORS.SOMETHING_WENT_WRONG);
    });
});

router.get("/getAll", auth, (req, res) => {
  commonController
    .getBy(User, {
      _id: {
        $ne: req.userId,
      },
    })
    .then((resData) => {
      response.successResponse(res, 200, resData);
    })
    .catch((error) => {
      response.errorMsgResponse(res, 301, ERRORS.SOMETHING_WENT_WRONG);
    });
});

router.post("/send/money", auth, (req, res) => {
  commonController
    .getOne(User, {
      _id: req.userId,
    })
    .then((resData) => {
      if (req.body.amount > 1) {
        if (resData.wallet >= req.body.amount) {
          commonController
            .updateBy(User, req.body.userId, {
              $inc: {
                wallet: req.body.amount,
              },
            })
            .then((incData) => {
              commonController
                .updateBy(User, req.userId, {
                  $inc: {
                    wallet: -req.body.amount,
                  },
                })
                .then((decdata) => {
                  var walletObj = {
                    userId: req.userId,
                    amount: req.body.amount,
                    receiverId: req.body.userId,
                  };
                  commonController
                    .add(WalletTransaction, walletObj)
                    .then((wallet) => {
                      response.successResponse(res, 200, "Amount Transffered");
                    })
                    .catch((error) => {
                      response.errorMsgResponse(res, 301, error);
                    });
                })
                .catch((error) => {
                  response.errorMsgResponse(res, 301, error);
                });
            })
            .catch((error) => {
              response.errorMsgResponse(res, 301, error);
            });
        } else {
          response.errorMsgResponse(res, 301, "Insuffecient Amount");
        }
      } else {
        response.errorMsgResponse(res, 301, "Amout should be greater than 1 ");
      }
    })
    .catch((error) => {
      response.errorMsgResponse(res, 301, error);
    });
});

router.get("/wallet/amount", auth, (req, res) => {
  commonController
    .getOne(User, {
      _id: req.userId,
    })
    .then((resData) => {
      response.successResponse(res, 200, resData.wallet);
    })
    .catch((error) => {
      response.errorMsgResponse(res, 301, ERRORS.SOMETHING_WENT_WRONG);
    });
});

module.exports = router;
