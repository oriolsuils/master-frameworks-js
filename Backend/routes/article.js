'use strict'

var express = require('express');
var articleController = require('../controllers/article');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/articles'});

var router = express.Router();

router.get('/test-controller', articleController.test);
router.post('/course-data', articleController.datosCurso);

router.post('/save', articleController.save);
router.get('/articles/:last?', articleController.getArticles);
router.get('/article/:id', articleController.getArticle);
router.put('/article/:id', articleController.update);
router.delete('/article/:id', articleController.delete);
router.post('/upload-image/:id', md_upload, articleController.upload);
router.get('/image/:image', articleController.getImage);
router.get('/search/:search', articleController.search);

module.exports = router;