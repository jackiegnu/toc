// Extension loading compatible with AMD and CommonJs
(function(extension) {
  'use strict';

  if (typeof showdown === 'object') {
    // global (browser or nodejs global)
    showdown.extension('custom-header', extension());
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define('custom-header', extension());
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = extension();
  } else {
    // showdown was not found so we throw
    throw Error('Could not find showdown library');
  }

}(function() {
  var rgx = /^(#{1,6})[ \t]*(.+?) *\{: *#([\S]+?)\}[ \t]*#*$/gmi;

  return [{
    type: 'listener',
    listeners: {
      'headers.before': function (event, text, converter, options, globals) {
        text = text.replace(rgx, function (wm, hLevel, hText, hCustomId) {
          console.log(hCustomId)
          // find how many # there are at the beginning of the header
          // these will define the header level
          hLevel = hLevel.length;

          // since headers can have markdown in them (ex: # some *italic* header)
          // we need to pass the text to the span parser
          hText = showdown.subParser('spanGamut')(hText, options, globals);

          // create the appropriate HTML
          var header = '<h' + hLevel + ' id="' + hCustomId + '">' + hText + '</h' + hLevel + '>';

          // hash block to prevent any further modification
          return showdown.subParser('hashBlock')(header, options, globals);
        });
        // return the changed text
        return text;
      }
    }
  }];
}));
