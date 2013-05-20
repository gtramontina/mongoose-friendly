var urlify = require('urlify').create({
  spaces      : '-',
  toLower     : true,
  trim        : true,
  nonPrintable: ''
});

var defaults = function(opts) {
  opts = opts || {};
  opts.source   = opts.source   || 'title';
  opts.friendly = opts.friendly || 'slug';
  opts.addIndex = opts.addIndex !== undefined ? opts.addIndex : true;
  opts.findById = opts.findById !== undefined ? opts.findById : true;
  return opts;
};

module.exports = function(schema, options) {
  options = defaults(options);
  if (!schema.paths[options.source])
    throw new Error('Your schema does not have an attribute called "'+options.source+'". Please either include it or specify the source attribute you want to use.')

  var friendly = {};
  friendly[options.friendly] = { type: String };
  if (options.addIndex === true)
    friendly[options.friendly].index = { unique: true };
  schema.add(friendly);
  schema._friendly = options.friendly;

  schema.statics.findByFriendly = findByFriendly;
  if (options.findById === true)
    schema.statics.findById = schema.statics.findByFriendly;

  schema.pre('save', setFriendlyAttribute(options));
};

var findByFriendly = function(id, fields, options, callback) {
  var friendly = {}; friendly[this.schema._friendly] = id;
  var query = { $or: [friendly] };
  if (id && id.toString().match(/^[0-9a-fA-F]{24}$/)) query.$or.push({ _id: id });
  return this.findOne(query, fields, options, callback);
};

var setFriendlyAttribute = function(options) { return function(next) {
  var doc = this;
  var candidate = this[options.friendly] || urlify(this[options.source]);
  unique.apply(this, [candidate, options, function(friendly) {
    doc[options.friendly] = friendly; next();
  }]);
}};

var unique = function(candidate, options, callback) {
  var where  = {}; where [options.friendly] = new RegExp('^'+candidate);
  var sort   = {}; sort  [options.friendly] = -1;
  var fields = {}; fields[options.friendly] = true;

  where['_id'] = { $ne: this._id };
  this.collection.findOne(where, fields, { sort: sort }, function(error, existing) {
    if (!existing) return callback(candidate);
    var count = existing[options.friendly].match(/.*-(\d+)$/);
    count = (count ? count[1]*1 : 0) + 1;
    callback(candidate + '-' + count);
  });
};