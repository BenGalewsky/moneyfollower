'use strict';

var $ = require('jquery');
var _ = require('underscore');

var BODY_TEMPLATE = _.template(
  '<div class="data-container__tags">' +
    '<h3 class="tags__title">Viewing: ' +
      '<span class="js-tag-title tags__title__text">{{ title }}</span>' +
    '</h3>' +
    '<ul class="tags"></ul>' +
  '</div>',
  {interpolate: /\{\{(.+?)\}\}/g}
);

var TAG_TEMPLATE = _.template(
  '<li data-id="{{ key }}" class="tag">' +
    '{{ value }}' +
    '<button class="button tag__remove">' +
      '<span class="u-visually-hidden">Remove</span>' +
    '</button>' +
  '</li>',
  {interpolate: /\{\{(.+?)\}\}/g}
);

function TagList(opts) {
  this.opts = opts;

  this.$body = $(BODY_TEMPLATE({title: this.opts.title}));
  this.$list = this.$body.find('ul');
  this.$title = this.$body.find('.js-tag-title');

  $(document.body)
    .on('filter:added', this.addTag.bind(this))
    .on('filter:removed', this.removeTagEvt.bind(this))
    .on('filter:renamed', this.renameTag.bind(this));

  this.$list.on('click', '.tag', this.removeTagDom.bind(this));
}

TagList.prototype.addTag = function(e, opts) {
  this.removeTag(opts.key, false);
  this.$title.html('');

  var $tag = TAG_TEMPLATE(opts);
  this.$list.append($tag);
};

TagList.prototype.removeTag = function(key, emit) {
  var $tag = this.$list.find('#' + key);
  if ($tag.length) {
    if (emit) {
      $tag.trigger('tag:removed', [{key: key}]);
    }
    $tag.remove();
  }

  if (this.$list.find('.tag').length === 0) {
    this.$title.html(this.opts.title);
  }
};

TagList.prototype.removeTagEvt = function(e, opts) {
  this.removeTag(opts.key, false);
};

TagList.prototype.removeTagDom = function(e) {
  var key = $(e.target).closest('.tag').attr('id');
  this.removeTag(key, true);
};

TagList.prototype.renameTag = function(e, opts) {
  var $tag = this.$list.find('#' + opts.key);
  if ($tag.length) {
    $tag.replaceWith(TAG_TEMPLATE(opts));
  }
};

module.exports = {TagList: TagList};
