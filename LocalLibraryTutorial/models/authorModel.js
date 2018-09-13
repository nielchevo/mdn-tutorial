var mongoose = require("mongoose");
var moment = require('moment');

var Schema = mongoose.Schema;

var author_schema = new Schema(
    {
        first_name:     {type: String, required: true, max: 100},
        family_name:    {type: String, required: true, max: 100},
        date_of_birth:  {type: Date},
        date_of_death:  {type: Date}
    }
);

//virtual for author's full name
author_schema.virtual('name').get(function (){ 
    return this.family_name + ', ' + this.first_name;
});

author_schema.virtual('url').get(function (){
    return '/author/' + this._id;
});

author_schema.virtual('lifespan').get(function() {
    let dateBirth= 'NULL';
    let dateDeath= 'Present';
    
    if(this.date_of_birth) {
        dateBirth = moment(this.date_of_birth).format('MMMM do, YYYY');
    }
    if(this.date_of_death) {
        dateDeath = moment(this.date_of_death).format('MMMM do, YYYY');
    }

    return dateBirth +' - '+ dateDeath;
})

module.exports = mongoose.model('Author', author_schema);