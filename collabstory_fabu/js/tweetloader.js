
(function() {
  var LoadingIndicator, TreeBuilder, TweetLoader, TweetVis, loadingIndicator, timeColors, tooltip, treeBuilder, tweetLoader, tweetVis, wrap,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  timeColors = {
    intervals: [300, 600, 3600, 10800],
    humanIntervals: ['5 min', '10 min', '1 hour', '3 hours+'],
    colors: ['#fff', '#fff', '#fff', '#fff']
  };

  tooltip = function(tweet) {
    var apop, height, hideTooltip, image, imageSize, margin, sinkSize, text, tpop, user, width, x, y, _ref;
    x = d3.select(this).attr('x');
    y = d3.select(this).attr('y');
    imageSize = 48;
    margin = 8;
    d3.select('#tweetPopup').remove();
    apop = d3.select('svg').append('a').attr('id', 'tweetPopup').attr('xlink:href', tweet.url).attr('target', '_blank').style('text-decoration', 'none');
    tpop = apop.append('g').attr('opacity', 0);



    var cleantweet = tweet.content;
    cleantweet = cleantweet.replace(/(^|\W)#(\w+)/ , '');


    text = tpop.append('text').text(cleantweet).attr('transform', "translate(" + (imageSize + 2 * margin) + " 20)");



    image = tpop.append('image').attr('xlink:href', tweet.avatar).attr('height', imageSize).attr('width', imageSize).attr('x', margin).attr('y', margin);
    user = tpop.append('text').text("@" + tweet.name).attr('font-weight', 'bold').attr('y', 12 + margin).attr('x', imageSize + 2 * margin);
    wrap(text, 250);
    _ref = tpop.node().getBBox(), height = _ref.height, width = _ref.width;
    hideTooltip = function() {
      return apop.transition().duration(200).attr('opacity', 0).remove();
    };
    tpop.insert('rect', ':first-child').attr('width', width + 2 * margin).attr('height', height + 2 * margin).attr('fill', 'white').attr('rx', 5).attr('opacity', 0.9).on('mouseover', hideTooltip);
    x -= width / 2 + margin;
    y -= height / 2 + margin;
    sinkSize = 24;
    tpop.append('rect').attr('width', sinkSize).attr('height', sinkSize).attr('x', width / 2 + margin - sinkSize / 2).attr('y', height / 2 + margin - sinkSize / 2).style('cursor', 'none').attr('opacity', 0).on('mouseleave', hideTooltip);
    tpop.attr('transform', "translate(" + x + " " + y + ")");
    return tpop.transition().duration(200).attr('opacity', 1);
  };

  wrap = function(text, width) {
    var dy, line, lineHeight, lineNumber, tspan, word, words, _results;
    words = text.text().split(/\s+/).reverse();
    line = [];
    lineNumber = 0;
    lineHeight = 1.1;
    dy = 1.1;
    tspan = text.text(null).append("tspan").attr("dy", dy + "em");
    _results = [];
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        _results.push(tspan = text.append("tspan").attr("x", '0px').attr("dy", dy + 'em').text(word));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  LoadingIndicator = (function() {
    LoadingIndicator.prototype.element = null;

    function LoadingIndicator(parent) {
      this.done = __bind(this.done, this);
      this.updateProgress = __bind(this.updateProgress, this);
      this.element = parent.append('h4').style('position', 'absolute').style('bottom', '10px').style('right', '20px').style('color', 'rgba(48,53,60,1)');
    }

    LoadingIndicator.prototype.updateProgress = function(num, denom) {
      return this.element.text("Loading (" + num + "/" + denom + ")");
    };

    LoadingIndicator.prototype.done = function() {
      return this.element.remove();
    };

    return LoadingIndicator;

  })();

  TreeBuilder = (function() {
    function TreeBuilder() {
      this.addNode = __bind(this.addNode, this);
    }

    TreeBuilder.prototype.changeCallback = null;

    TreeBuilder.prototype.root = null;

    TreeBuilder.prototype.idMap = {};

    TreeBuilder.prototype.maxDepth = 0;

    TreeBuilder.prototype.widthMap = {};

    TreeBuilder.prototype.maxWidth = 0;

    TreeBuilder.prototype.addNode = function(node) {
      var parent;
      if (this.root == null) {
        this.root = node;
        node.depth = 0;
      } else {
        parent = this.idMap[node.parent];
        if (parent == null) {
          return;
        }
        node.depth = parent.depth + 1;
        if (!('children' in parent)) {
          parent.children = [];
        }
        parent.children.push(node);
      }
      if (this.widthMap[node.depth] == null) {
        this.widthMap[node.depth] = 0;
      }
      this.widthMap[node.depth] += 1;
      this.maxWidth = Math.max(this.widthMap[node.depth], this.maxWidth);
      this.maxDepth = Math.max(node.depth, this.maxDepth);
      this.idMap[node.id] = node;
      return this.changeCallback(this.root, this.maxWidth, this.maxDepth);
    };

    return TreeBuilder;

  })();

  TweetLoader = (function() {
    function TweetLoader() {
      this.processConversation = __bind(this.processConversation, this);
      this.getTweetTree = __bind(this.getTweetTree, this);
      this.testTweet = __bind(this.testTweet, this);
    }

    TweetLoader.prototype.tweetCallback = null;

    TweetLoader.prototype.doneCallback = null;

    TweetLoader.prototype.statusCallback = null;

    TweetLoader.prototype.progNum = 0;

    TweetLoader.prototype.progDenom = 1;

    TweetLoader.prototype.testTweet = function() {
      return true;
    };

    TweetLoader.prototype.getTweetTree = function() {
      var tweetDiv, tweetId, user;
      tweetDiv = d3.select('.permalink-tweet');
      user = dynamicuservar;
      tweetId = dynamicidvar;
      this.tweetQueue = [];
      return this.getConversation(user, tweetId);
    };

    TweetLoader.prototype.processConversation = function() {
      var tweet, tweetId, url, user;
      tweet = this.tweetQueue.shift();
      if (tweet != null) {
        tweetId = tweet[0], user = tweet[1];
        url = "http://harryfk.me/collabstory/api.php?user=" + user + "&tweetId=" + tweetId;
        return d3.json(url).get((function(_this) {
          return function(error, data) {
            var doc, parentDiv, parser, tweetDiv;
            parser = new window.DOMParser();
            doc = parser.parseFromString(data.page, 'text/html');
            doc = d3.select(doc);
            tweet = {};
            parentDiv = doc.select('#ancestors li:last-child div.simple-tweet');
            if (!parentDiv.empty()) {
              tweet.parent = parentDiv.attr('data-tweet-id');
            }
            tweetDiv = doc.select('.permalink-tweet');
            tweet.id = tweetDiv.attr('data-tweet-id');
            tweet.user = tweetDiv.attr('data-screen-name');
            tweet.content = tweetDiv.select('.tweet-text').text();
            tweet.avatar = tweetDiv.select('.avatar').attr('src');
            tweet.name = tweetDiv.attr('data-name');
            tweet.time = parseInt(tweetDiv.select('._timestamp').attr('data-time'));
            tweet.url = "http://twitter.com/" + tweet.user + "/status/" + tweet.id;
            _this.progNum++;
            _this.statusCallback(_this.progNum, _this.progDenom);
            _this.tweetCallback(tweet);
            return _this.processConversation();
          };
        })(this));
      } else {
        return this.doneCallback();
      }
    };

    TweetLoader.prototype.getMoreConversation = function(user, tweetId, max_position) {
      var url;
      url = "http://harryfk.me/collabstory/api.php?user=" + user + "&tweetId=" + tweetId + "&action=conversation&max_position=" + max_position;
      return d3.json(url).get((function(_this) {
        return function(error, data) {
          var doc, i, parser, tweetQueue;
          parser = new window.DOMParser();
          doc = parser.parseFromString(data.descendants.items_html, 'text/html');
          tweetQueue = _this.tweetQueue;
          i = 0;
          d3.select(doc).selectAll('.simple-tweet').each(function() {
            var replyDiv, replyId, replyUser;
            replyDiv = d3.select(this);
            replyId = replyDiv.attr('data-tweet-id');
            replyUser = replyDiv.attr('data-screen-name');
            tweetQueue.push([replyId, replyUser]);
            max_position = replyId;
            return i++;
          });
          _this.progDenom += i;
          _this.statusCallback(0, _this.progDenom);
          if (data.descendants.has_more_items) {
            return _this.getMoreConversation(user, tweetId, max_position);
          } else {
            return _this.processConversation();
          }
        };
      })(this));
    };

    TweetLoader.prototype.getConversation = function(user, tweetId) {
      this.tweetQueue.push([tweetId, user]);
      return this.getMoreConversation(user, tweetId, 0);
    };

    return TweetLoader;

  })();

  TweetVis = (function() {
    function TweetVis() {
      this.drawTree = __bind(this.drawTree, this);
      this.makeLayout = __bind(this.makeLayout, this);
      this.makeSVG = __bind(this.makeSVG, this);
      this.init = __bind(this.init, this);
    }

    TweetVis.prototype.margin = 100;

    TweetVis.prototype.init = function() {
      return this.makeSVG();
    };

    TweetVis.prototype.makeSVG = function() {
      var container;
      d3.select('#tweetvis').remove();
      container = d3.select('#treewrapper');
      d3.select(window).on('popstate', function() {
        return d3.select('#tweetvis').remove();
      });
      this.div = container.append('div').attr('id', 'tweetvis').style('position', 'absolute').style('left', 0).style('top', '10vh').style('bottom', 0).style('right', 0).style('z-index', 1).style('background-color', '#ccc');
      
      // this.div.append('p').text('Reply times: ').style('position', 'absolute').style('top', '20px').style('left', '20px').style('color', '#ddd').selectAll('span').data(d3.zip(timeColors.humanIntervals, timeColors.colors)).enter().append('span').text(function(d) {
      //   return d[0] + ' ';
      // }).style('color', function(d) {
      //   return d[1];
      // }).style('margin-left', '20px');
      this.svg = this.div.append('svg:svg');
      this.svg.attr('id', 'tweetvis_svg').attr('height', '100%').attr('width', '100%');
      this.svg.append('g').attr('id', 'edges');
      this.svg.append('g').attr('id', 'nodes');
      return this.svg.append('g').attr('id', 'details');
    };

    TweetVis.prototype.makeLayout = function(root, maxWidth, depth) {
      var tree;
      this.maxWidth = maxWidth;
      this.depth = depth;
      tree = d3.layout.tree().size([1, 1]);
      this.layout = tree.nodes(root);
      this.links = tree.links(this.layout);
      return this.drawTree();
    };
  

    TweetVis.prototype.drawTree = function() {
      var animDuration, cs, edgeToPath, enterNodes, height, margin, nodeGroup, nodeSize, pathGroup, scale, width, x, y;
      width = window.innerWidth;
      height = window.innerHeight;
      margin = 60;
      nodeSize = 24;
      scale = 8 / Math.min(Math.max(8, this.maxWidth, this.depth), 24);
      animDuration = 300;
      x = d3.scale.linear().range([margin, width - 2 * margin]);
      y = d3.scale.linear().range([margin, height - 2 * margin]);
      cs = d3.scale.sqrt().domain(timeColors.intervals).range(timeColors.colors);

      /*
       *   Draw Nodes
       */
      nodeGroup = d3.select('svg #nodes').selectAll('g').data(this.layout, function(d) {
        return d.id;
      });
      nodeGroup.transition().duration(animDuration).attr('transform', function(d) {
        return "translate(" + (x(d.x)) + " " + (y(d.y)) + ") scale(" + scale + ")";
      }).attr('x', function(d) {
        return x(d.x);
      }).attr('y', function(d) {
        return y(d.y);
      });
      enterNodes = nodeGroup.enter().append('g').attr('transform', function(d) {
        return "translate(" + (x(d.x)) + " " + (y(d.y)) + ") scale(" + scale + ")";
      }).on('mouseover', tooltip).attr('x', function(d) {
        return x(d.x);
      }).attr('y', function(d) {
        return y(d.y);
      });
      enterNodes.append('image').attr('xlink:href', function(d) {
        return d.avatar1;
      }).attr('height', "" + nodeSize + "px").attr('width', "" + nodeSize + "px").attr('x', "-" + (nodeSize / 2) + "px").attr('y', "-" + (nodeSize / 2) + "px").attr('opacity', 0).transition().delay(animDuration).attr('opacity', 1);
      enterNodes.append('rect').attr('height', "" + nodeSize + "px").attr('width', "" + nodeSize + "px").attr('x', "-" + (nodeSize / 2) + "px").attr('y', "-" + (nodeSize / 2) + "px").attr('rx', "100px").attr('border-radius', "1000px").attr('fill', 'rgba(48,53,60,1)').attr('opacity', 0).transition().delay(animDuration).attr('opacity', 1);

      /*
       *   Draw Edges
       */
      edgeToPath = (function(_this) {
        return function(_arg) {
          var endX, endY, source, startX, startY, target;
          source = _arg.source, target = _arg.target;
          startX = x(source.x);
          startY = y(source.y);
          endX = x(target.x);
          endY = y(target.y);
          return "M" + startX + "," + startY + " C" + startX + "," + startY + " " + endX + "," + startY + " " + endX + "," + endY;
        };
      })(this);
      pathGroup = this.svg.select('#edges').selectAll('path').data(this.links, function(d) {
        return d.target.id;
      });
      pathGroup.transition().duration(animDuration).attr('d', edgeToPath).attr('opacity', 1);
      return pathGroup.enter().append('path').attr('d', edgeToPath).attr('fill', 'none').attr('stroke', function(d) {
        return cs(d.target.time - d.source.time);
      }).attr('stroke-width', '1px').attr('stroke', 'rgba(48,53,60,1)').attr('opacity', 0).transition().delay(animDuration).attr('opacity', 1);
    };

    return TweetVis;

  })();

  tweetLoader = new TweetLoader();

  if (!tweetLoader.testTweet()) {
    alert('Not on a tweet; Navigate to a tweet and try again');
  } else {
    tweetVis = new TweetVis();
    tweetVis.init();
    loadingIndicator = new LoadingIndicator(tweetVis.div);
    treeBuilder = new TreeBuilder();
    treeBuilder.changeCallback = tweetVis.makeLayout;
    window.onresize = tweetVis.drawTree;
    tweetLoader.tweetCallback = treeBuilder.addNode;
    tweetLoader.statusCallback = loadingIndicator.updateProgress;
    tweetLoader.doneCallback = loadingIndicator.done;
    tweetLoader.getTweetTree();
  }

}).call(this);