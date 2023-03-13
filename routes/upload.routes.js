let router = require("express").Router();
// let upload = require("../helper/upload");
// let response = require("../helper/response")
// let {
//   multiUpload
// } = require("../helper/imageUpload")

// // router.post("/", async (req, res) => {
// //   console.log(
// //     "🚀 ~ file: uploadRouter.js ~ line 39 ~ router.post ~ req",
// //     req.files
// //   );
// //   var file = req.files;
// //   finalres = await upload.upload(file);
// //   res.send({
// //     fileURL: finalres
// //   });
// // });
// // module.exports = router;



// router.post("/", async (req, res) => {
//   try {
//     let link = [""];
//     if (req.files.length) {
//       req.files.map((x) => {
//         console.log(x.originalname);
//         x.uniquename = `${uniqueId()}${path.extname(x.originalname)}`;
//         return x;
//       });
//       console.log(req.files, "+++++++++++++++++++");
//       link = await multiUpload(req, req.files);
//       console.log(
//         "🚀 ~ file: medias.controller.js ~ line 113 ~ insert ~ link",
//         link
//       );
//     }
//     const payload = {
//       url: link[0],
//       userId: req.user.userId,
//       mimeType: req.files[0].mimetype,
//       fileSize: req.files[0].size / 1024,
//     };
//     response.successResponse(req, res, payload);
//   } catch (error) {
//     console.log("error ", error)
//     response.errorMsgResponse(req, res, "error");
//   }
// });
module.exports = router