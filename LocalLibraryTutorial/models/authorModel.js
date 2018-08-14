var mongoose = require("mongoose");
var moment = require('moment');

var Schema = mongoose.Schema;

var author_schema = new Schema(
    {
        first_name:     {type: String, required: true, max: 100},
        last_name:      {type: String, required: true, max: 100},
        date_of_birth:  {type: Date},
        date_of_death:  {type: Date}
    }
);

//virtual for author's full name
author_schema.virtual('name').get(function (){ 
    return this.last_name + ', ' + this.first_name;
});

author_schema.virtual('URL').get(function (){
    return '/author/' + this._id;
});

module.exports = mongoose.model('Author', author_schema);