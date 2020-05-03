'use strict'

var validator = require('validator');
var Article = require('../models/article');
var fs = require('fs');
var path = require('path');

var controller = {
    datosCurso: (req, res) => {
        return res.status(200).send({
            curso:'Master en Frameworks JS',
            autor:'Victor',
            url:'victorrobles@web.es'
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'I am the test function'
        });
    },

    save: (req, res) => {
        var params = req.body;
        try {
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);
        } catch(err) {
            return res.status(200).send({
                status: 'error',
                message: 'Wrong input data'
            }); 
        }
        if(validateTitle && validateContent) {
            var article = new Article();

            article.title = params.title;
            article.content = params.content;
            article.image = null;

            article.save((err, articleStored) => {
                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error saving article'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article
                });
            });
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Wrong input data'
            });
        }
    },

    getArticles: (req, res) => {

        var query = Article.find({});

        var last = req.params.last;
        if(last || last != undefined) {
            query.limit(5);
        }

        query.sort('-_id').exec((err, articles) => {
            if(err || !articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No articles in DB'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });
    },

    getArticle: (req, res) => {
        
        var articleId = req.params.id;
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'Article does not exist'
            });
        }

        Article.findById(articleId, (err, article) => {
            if(err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Article does not exist'
                });
            }

            return res.status(200).send({
                status: 'success',
                article
            });
        });
    },

    update: (req, res) => {
        var articleId = req.params.id;
        var params = req.body;
        try {
            var validateTitle = !validator.isEmpty(params.title);
            var validateContent = !validator.isEmpty(params.content);
        } catch(err) {
            return res.status(200).send({
                status: 'error',
                message: 'Wrong input data'
            }); 
        }
        if(validateTitle && validateContent) {
            Article.findOneAndUpdate({_id: articleId}, params, {new: true}, (err, articleUpdated) => {
                if(err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error while updating article'
                    });
                }

                if(!articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Article does not exist'
                    });
                }

                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        } else {
            if(!articleId || articleId == null){
                return res.status(200).send({
                    status: 'error',
                    message: 'Wrong input data'
                });
            }
        }        
    },

    delete: (req, res) => {
        var articleId = req.params.id;
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'Article does not exist'
            });
        }

        Article.findOneAndDelete({_id: articleId}, (err, articleDeleted) => {
            if(err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error while removing article'
                });
            }

            if(!articleDeleted) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Article does not exist'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleDeleted
            });
        });
    },

    upload: (req, res) => {
        var filename = 'Image not upload';
        var articleId = req.params.id;
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'Article does not exist'
            });
        }

        if(!req.files) {
            return res.status(404).send({
                status: 'error',
                article: filename
            });
        }

        var filePath = req.files.file0.path;
        var fileSplit = filePath.split('\\');

        var file_name = fileSplit[2];
        var file_ext = file_name.split('\.')[1];

        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            fs.unlink(filePath, (err) => {
                if(err) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'Wrong File extension'
                    });
                }
            });
        } else {
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new: true}, (err, articleUpdated) => {
                if(err || !articleUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Article does not exist'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            });
        }
    },

    getImage: (req, res) => {
        var file = req.params.image;
        var pathFile = './upload/articles/'+file;
        fs.exists(pathFile, (exists) => {
            if(exists) {
                return res.sendFile(path.resolve(pathFile));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'Image does not exist'
                });
            }
        });
    }, 

    search: (req, res) => {
        var searchQuery = req.params.search;

        Article.find({ "$or": [
            {"title": {"$regex": searchQuery, "$options": "i"}},
            {"content": {"$regex": searchQuery, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, articles) => {
            if(err || !articles || articles.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: 'Wrong input data'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });
    }
};

module.exports = controller;