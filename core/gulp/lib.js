var loadJSONfile = function(filename, encoding) {
    var fs = require('fs')
    try {
        if (typeof (encoding) == 'undefined') encoding = 'utf8';
        var contents = fs.readFileSync(filename, encoding);
        return JSON.parse(contents);
    } catch (err) {
        throw err;
    }
}

var MergeRecursive = function(obj1, obj2) {
    //todo: duplicated in gulp/i18n.js, make as global
    for (var p in obj2) {
        try {
            if ( obj2[p].constructor==Object ) {
                obj1[p] = MergeRecursive(obj1[p], obj2[p]);
            } else {
                obj1[p] = obj2[p];
            }
        } catch(e) {
            obj1[p] = obj2[p];
        }
    }
    return obj1;
}


module.exports = {
    loadJSONfile: loadJSONfile,
    MergeRecursive: MergeRecursive
};
