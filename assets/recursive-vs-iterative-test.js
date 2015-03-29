/* jshint ignore:start */

/* jshint ignore:end */

define('recursive-vs-iterative-test/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'recursive-vs-iterative-test/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('recursive-vs-iterative-test/components/cached-color', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var CachedColorComponent = Ember['default'].Component.extend({
        items: null,

        renderObserver: (function () {
            this.rerender();
        }).observes("items.@each.template"),

        render: function render(buffer) {
            var items = this.get("items");
            if (items) {
                items.forEach(function (item) {
                    return buffer.push(item.get("template"));
                });
            }
        }
    });

    exports['default'] = CachedColorComponent;

});
define('recursive-vs-iterative-test/components/custom-color', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var CustomColorComponent = Ember['default'].Component.extend({
        items: null,

        renderObserver: (function () {
            this.rerender();
        }).observes("items.@each.color"),

        render: function render(buffer) {
            var _this = this;

            var items = this.get("items");
            if (items) {
                items.forEach(function (item) {
                    return buffer.push(_this.getMarkup(item));
                });
            }
        },

        getMarkup: function getMarkup(item) {
            return "\n            <div class=\"color-component\" style=\"background-color: " + item.get("color") + ";\">\n                    " + item.get("id") + "\n            </div>\n        ";
        }
    });

    exports['default'] = CustomColorComponent;

});
define('recursive-vs-iterative-test/components/iterative-color', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var IterativeColorComponent = Ember['default'].Component.extend({
        classNames: ["color-component"],
        attributeBindings: ["style"],
        item: null,

        style: (function () {
            return "background-color: " + this.get("item.color") + ";";
        }).property("item.color")
    });

    exports['default'] = IterativeColorComponent;

});
define('recursive-vs-iterative-test/components/recursive-color', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var RecursiveColorComponent = Ember['default'].Component.extend({
        item: null,

        style: (function () {
            return "background-color: " + this.get("item.color") + ";";
        }).property("item.color")
    });

    exports['default'] = RecursiveColorComponent;

});
define('recursive-vs-iterative-test/controllers/index', ['exports', 'ember', 'recursive-vs-iterative-test/utils/generators'], function (exports, Ember, Generators) {

    'use strict';

    var IndexController = Ember['default'].Controller.extend({
        renderMethod: "iterative",
        dataStructureSize: null,
        data: null,

        itemCountBreakover: (function () {
            var size = this.get("iterativeDataStructure.length");
            if (size <= 10) {
                return "small";
            } else if (size <= 100) {
                return "medium";
            } else {
                return "large";
            }
        }).property("iterativeDataStructure.length"),

        recursiveRenderSelected: (function () {
            return this.get("renderMethod") === "recursive";
        }).property("renderMethod"),

        iterativeRenderSelected: (function () {
            return this.get("renderMethod") === "iterative";
        }).property("renderMethod"),

        customRenderSelected: (function () {
            return this.get("renderMethod") === "custom";
        }).property("renderMethod"),

        cachedRenderSelected: (function () {
            return this.get("renderMethod") === "cached";
        }).property("renderMethod"),

        actions: {
            selectRender: function selectRender(type) {
                var _this = this;

                this.send("clear");
                this.set("renderMethod", type);
                Ember['default'].run.scheduleOnce("afterRender", function () {
                    return _this.send("run");
                });
            },

            clear: function clear() {
                this.set("data", null);
                this.set("renderTime", null);
            },

            run: function run() {
                var _this = this;

                var input = this.get("dataStructureSize") || "0";
                var size = parseInt(input, 10);
                if (size === 0) {
                    this.send("clear");
                    return;
                }

                var data = this.createData(size);
                this.runWithTiming(function () {
                    return _this.set("data", data);
                });
            },

            addFront: function addFront() {
                var _this = this;

                this.runWithTiming(function () {
                    return _this.get("recursiveRenderSelected") ? Generators['default'].addToListFront(_this.get("data")) : Generators['default'].addToArrayFront(_this.get("data"));
                });
            },

            addEnd: function addEnd() {
                var _this = this;

                this.runWithTiming(function () {
                    return _this.get("recursiveRenderSelected") ? Generators['default'].addToListEnd(_this.get("data")) : Generators['default'].addToArrayEnd(_this.get("data"));
                });
            }
        },

        createData: function createData(size) {
            return this.get("recursiveRenderSelected") ? Generators['default'].dataList(size) : Generators['default'].dataArray(size);
        },

        runWithTiming: function runWithTiming(runnable) {
            var _this = this;

            this.set("renderTime", null);
            var start = new Date().valueOf();
            runnable();
            Ember['default'].run.scheduleOnce("afterRender", function () {
                var end = new Date().valueOf();
                _this.set("renderTime", end - start);
            });
        }
    });

    exports['default'] = IndexController;

});
define('recursive-vs-iterative-test/initializers/app-version', ['exports', 'recursive-vs-iterative-test/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;

  exports['default'] = {
    name: "App Version",
    initialize: function initialize(container, application) {
      var appName = classify(application.toString());
      Ember['default'].libraries.register(appName, config['default'].APP.version);
    }
  };

});
define('recursive-vs-iterative-test/initializers/export-application-global', ['exports', 'ember', 'recursive-vs-iterative-test/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  }

  ;

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('recursive-vs-iterative-test/router', ['exports', 'ember', 'recursive-vs-iterative-test/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {});

  exports['default'] = Router;

});
define('recursive-vs-iterative-test/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        dom.setAttribute(el1,"id","title");
        var el2 = dom.createTextNode("Recursive VS Iterative render test");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,2,2,contextualElement);
        content(env, morph0, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('recursive-vs-iterative-test/templates/components/iterative-color', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, null);
        dom.insertBoundary(fragment, 0);
        content(env, morph0, context, "item.id");
        return fragment;
      }
    };
  }()));

});
define('recursive-vs-iterative-test/templates/components/recursive-color', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          inline(env, morph0, context, "recursive-color", [], {"item": get(env, context, "item.next")});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","color-component");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, element = hooks.element, content = hooks.content, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(element0,1,1);
        var morph1 = dom.createMorphAt(fragment,2,2,contextualElement);
        dom.insertBoundary(fragment, null);
        element(env, element0, context, "bind-attr", [], {"style": get(env, context, "style")});
        content(env, morph0, context, "item.id");
        block(env, morph1, context, "if", [get(env, context, "item.next")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('recursive-vs-iterative-test/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        Time to render: ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("ms\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          content(env, morph0, context, "renderTime");
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("         \n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          inline(env, morph0, context, "recursive-color", [], {"item": get(env, context, "data.head")});
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.11.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
            inline(env, morph0, context, "iterative-color", [], {"item": get(env, context, "item")});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, null);
          dom.insertBoundary(fragment, 0);
          block(env, morph0, context, "each", [get(env, context, "data")], {"keyword": "item"}, child0, null);
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          inline(env, morph0, context, "custom-color", [], {"items": get(env, context, "data")});
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.11.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          inline(env, morph0, context, "cached-color", [], {"items": get(env, context, "data")});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.11.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","elapsed");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","controls");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        var el3 = dom.createTextNode("Clear");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        var el3 = dom.createTextNode("Run");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        var el3 = dom.createTextNode("+1 Front");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        var el3 = dom.createTextNode("+1 End");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","render-method");
        var el2 = dom.createTextNode("\n    Rendering Method:\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","iterative");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        var el4 = dom.createTextNode("Iterative");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","recursive");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        var el4 = dom.createTextNode("Recursive");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","custom");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        var el4 = dom.createTextNode("Custom");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","cached");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        var el4 = dom.createTextNode("Cached");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","label");
        var el3 = dom.createTextNode("Render method: ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block, inline = hooks.inline, element = hooks.element, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [2]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(element0, [5]);
        var element3 = dom.childAt(element0, [7]);
        var element4 = dom.childAt(element0, [9]);
        var element5 = dom.childAt(fragment, [4]);
        var element6 = dom.childAt(element5, [1]);
        var element7 = dom.childAt(element6, [3]);
        var element8 = dom.childAt(element5, [3]);
        var element9 = dom.childAt(element8, [3]);
        var element10 = dom.childAt(element5, [5]);
        var element11 = dom.childAt(element10, [3]);
        var element12 = dom.childAt(element5, [7]);
        var element13 = dom.childAt(element12, [3]);
        var element14 = dom.childAt(fragment, [6]);
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        var morph1 = dom.createMorphAt(dom.childAt(element0, [1]),1,1);
        var morph2 = dom.createMorphAt(element6,1,1);
        var morph3 = dom.createMorphAt(element8,1,1);
        var morph4 = dom.createMorphAt(element10,1,1);
        var morph5 = dom.createMorphAt(element12,1,1);
        var morph6 = dom.createMorphAt(dom.childAt(element14, [1]),1,1);
        var morph7 = dom.createMorphAt(element14,3,3);
        var morph8 = dom.createMorphAt(element14,5,5);
        var morph9 = dom.createMorphAt(element14,7,7);
        var morph10 = dom.createMorphAt(element14,9,9);
        block(env, morph0, context, "if", [get(env, context, "renderTime")], {}, child0, child1);
        inline(env, morph1, context, "input", [], {"value": get(env, context, "dataStructureSize"), "placeholder": "entity count"});
        element(env, element1, context, "action", ["clear"], {});
        element(env, element2, context, "action", ["run"], {});
        element(env, element3, context, "action", ["addFront"], {});
        element(env, element4, context, "action", ["addEnd"], {});
        inline(env, morph2, context, "input", [], {"type": "checkbox", "checked": get(env, context, "iterativeRenderSelected"), "disabled": true});
        element(env, element7, context, "action", ["selectRender", "iterative"], {});
        inline(env, morph3, context, "input", [], {"type": "checkbox", "checked": get(env, context, "recursiveRenderSelected"), "disabled": true});
        element(env, element9, context, "action", ["selectRender", "recursive"], {});
        inline(env, morph4, context, "input", [], {"type": "checkbox", "checked": get(env, context, "customRenderSelected"), "disabled": true});
        element(env, element11, context, "action", ["selectRender", "custom"], {});
        inline(env, morph5, context, "input", [], {"type": "checkbox", "checked": get(env, context, "cachedRenderSelected"), "disabled": true});
        element(env, element13, context, "action", ["selectRender", "cached"], {});
        element(env, element14, context, "bind-attr", [], {"class": ":render-pane itemCountBreakover"});
        content(env, morph6, context, "renderMethod");
        block(env, morph7, context, "if", [get(env, context, "recursiveRenderSelected")], {}, child2, null);
        block(env, morph8, context, "if", [get(env, context, "iterativeRenderSelected")], {}, child3, null);
        block(env, morph9, context, "if", [get(env, context, "customRenderSelected")], {}, child4, null);
        block(env, morph10, context, "if", [get(env, context, "cachedRenderSelected")], {}, child5, null);
        return fragment;
      }
    };
  }()));

});
define('recursive-vs-iterative-test/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('recursive-vs-iterative-test/tests/components/cached-color.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/cached-color.js should pass jshint', function() { 
    ok(true, 'components/cached-color.js should pass jshint.'); 
  });

});
define('recursive-vs-iterative-test/tests/components/custom-color.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/custom-color.js should pass jshint', function() { 
    ok(true, 'components/custom-color.js should pass jshint.'); 
  });

});
define('recursive-vs-iterative-test/tests/components/iterative-color.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/iterative-color.js should pass jshint', function() { 
    ok(true, 'components/iterative-color.js should pass jshint.'); 
  });

});
define('recursive-vs-iterative-test/tests/components/recursive-color.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/recursive-color.js should pass jshint', function() { 
    ok(true, 'components/recursive-color.js should pass jshint.'); 
  });

});
define('recursive-vs-iterative-test/tests/controllers/index.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/index.js should pass jshint', function() { 
    ok(true, 'controllers/index.js should pass jshint.'); 
  });

});
define('recursive-vs-iterative-test/tests/helpers/resolver', ['exports', 'ember/resolver', 'recursive-vs-iterative-test/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('recursive-vs-iterative-test/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('recursive-vs-iterative-test/tests/helpers/start-app', ['exports', 'ember', 'recursive-vs-iterative-test/app', 'recursive-vs-iterative-test/router', 'recursive-vs-iterative-test/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('recursive-vs-iterative-test/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('recursive-vs-iterative-test/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('recursive-vs-iterative-test/tests/test-helper', ['recursive-vs-iterative-test/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('recursive-vs-iterative-test/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('recursive-vs-iterative-test/tests/utils/generators.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/generators.js should pass jshint', function() { 
    ok(true, 'utils/generators.js should pass jshint.'); 
  });

});
define('recursive-vs-iterative-test/utils/generators', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    var randomColor = function () {
        return "#" + Math.floor(Math.random() * 16777215).toString(16);
    };

    var createObj = function (id) {
        return Ember['default'].Object.create({
            id: id,
            color: randomColor(),
            template: "\n        <div class=\"color-component\" style=\"background-color: " + randomColor() + ";\">\n            " + id + "\n        </div>\n    "
        });
    };

    var dataArray = function (size) {
        return new Array(size).fill(0).map(function (val, index) {
            return createObj(index);
        });
    };

    var dataList = function (size) {
        return Ember['default'].Object.create({
            head: dataArray(size).map(function (current, index, collection) {
                return current.set("next", collection[index + 1]);
            }).get(0)
        });
    };

    var getLast = function (list) {
        return !list.get("next") ? list : getLast(list.get("next"));
    };

    var addToListFront = function (list) {
        return list.set("head", createObj(list.get("head.id") - 1).set("next", list.get("head")));
    };

    var addToListEnd = function (list) {
        var last = getLast(list.get("head"));
        last.set("next", createObj(last.get("id") + 1));
    };

    var addToArrayFront = function (array) {
        return array.unshiftObject(createObj(array.get("firstObject.id") - 1));
    };

    var addToArrayEnd = function (array) {
        return array.pushObject(createObj(array.get("lastObject.id") + 1));
    };

    exports['default'] = Ember['default'].Object.create({
        dataArray: dataArray,
        dataList: dataList,
        addToListFront: addToListFront,
        addToListEnd: addToListEnd,
        addToArrayFront: addToArrayFront,
        addToArrayEnd: addToArrayEnd
    });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('recursive-vs-iterative-test/config/environment', ['ember'], function(Ember) {
  var prefix = 'recursive-vs-iterative-test';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("recursive-vs-iterative-test/tests/test-helper");
} else {
  require("recursive-vs-iterative-test/app")["default"].create({"name":"recursive-vs-iterative-test","version":"0.0.0.54344412"});
}

/* jshint ignore:end */
//# sourceMappingURL=recursive-vs-iterative-test.map