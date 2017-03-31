var models = require('../models/models.js');
var userController = require('./user_controller');
var postController = require('./post_controller');
var sessionController = require('./user_controller');

exports.puntuar = function (req, res, next) {

    models.Favourite.findAll({
        where: {
            userId: req.user.id,
            postId: req.post.id
        },
    })

    .success(function(favourites) {

        if (favourites.length > 0) {

            for (var i in favourites){
                favourites[i].destroy()
                .success(function() {})
                .error(function(error) {
                    next(error);
                });
            };
        }   
    
        var fav = models.Favourite.build(
            { best: req.body.best || 5,
              userId: req.user.id,
              postId: req.post.id,
            });
        
        var validate_errors = fav.validate();
            if (validate_errors) {
                console.log("Errores en la validación:", validate_errors);

                req.flash('error', 'Datos del formulario incorrectos.');
                for (var err in validate_errors) {
                    req.flash('error', validate_errors[err]);
                    return;
                };
            } 
            
            fav.save()
                .success(function() {
                        req.flash('success', 'Puntuación guardada satisfactoriamente.');
                        res.redirect('/posts');
                    })
                    .error(function(error) {
                        next(error);
                    });
    })
    .error(function(error) {
        next(error);
    });
};

exports.index = function(req, res, next){
    models.Favourite
            .findAll({where: {userId: req.user.id,
                              best: [4, 5]}
                            })
            .success(function(favourites) {
                var postIds = favourites.map(function(favourite) {
                    return favourite.postId;
                });
                var where_value_patch;
                    if (postIds.length == 0) {
                        where_value_patch = '"Posts"."id" in (NULL)';
                    } else {
                        where_value_patch = '"Posts"."id" in (' + postIds.join(',') + ')';
                    }
                models.Post
                    .findAll({
                        offset: req.pagination.offset,
                        limit:  req.pagination.limit,
                        order: 'updatedAt DESC',
                        where: where_value_patch, 
                        include: [ { model: models.User, as: 'Author' },
                                    models.Favourite]
                })
                .success(function(posts) {
                    res.render('favourites/index', {
                        posts: posts,
                        redir: req.url,
                        favourites: favourites
                    });
                })
                .error(function(error) {
                    next(error);
                });
            })
        .error(function(error) {
                next(error);
        });
    };




exports.load = function(req, res, next, id) {

   models.Favourites
        .find({where: {id: Number(id)}})
        .success(function(favourites) {
            if (favourites) {
                req.favourites = favourites;
                next();
            } else {
                req.flash('error', 'No se encuentra el favorito con id='+id+'.');
                next('No se encuentra el favorito con id='+id+'.');
            }
        })
        .error(function(error) {
            next(error);
        });
};





exports.update = function(req, res, next){

};

// GET users/:userid([0-9]+)/favourites/:postid([0-9]+)
exports.destroy = function (req, res, next) {
 models.Favourite.findAll({ 
        where: {  
            userId: req.user.id,
            postId: req.post.id
        },
    })

    .success(function(favourites) {

        for (var i in favourites){
            favourites[i].destroy()
            .success(function() {})
            .error(function(error) {
                next(error);
            });
        };
        req.flash('success', 'Favorito eliminado satisfactoriamente.');
        res.redirect('/users/'+req.user.id+'/favourites');
    })
    .error(function(error) {
        next(error);
    });
};