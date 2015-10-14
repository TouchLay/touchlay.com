 /*
 * # Semantic UI - 2.1.4
 * https://github.com/Semantic-Org/Semantic-UI
 * http://www.semantic-ui.com/
 *
 * Copyright 2014 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
/*!
 * # Semantic UI 2.1.4 - Site
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2015 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */
;(function ( $, window, document, undefined ) {

$.site = $.fn.site = function(parameters) {
  var
    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),

    settings        = ( $.isPlainObject(parameters) )
      ? $.extend(true, {}, $.site.settings, parameters)
      : $.extend({}, $.site.settings),

    namespace       = settings.namespace,
    error           = settings.error,

    eventNamespace  = '.' + namespace,
    moduleNamespace = 'module-' + namespace,

    $document       = $(document),
    $module         = $document,
    element         = this,
    instance        = $module.data(moduleNamespace),

    module,
    returnedValue
  ;
  module = {

    initialize: function() {
      module.instantiate();
    },

    instantiate: function() {
      module.verbose('Storing instance of site', module);
      instance = module;
      $module
        .data(moduleNamespace, module)
      ;
    },

    normalize: function() {
      module.fix.console();
      module.fix.requestAnimationFrame();
    },

    fix: {
      console: function() {
        module.debug('Normalizing window.console');
        if (console === undefined || console.log === undefined) {
          module.verbose('Console not available, normalizing events');
          module.disable.console();
        }
        if (typeof console.group == 'undefined' || typeof console.groupEnd == 'undefined' || typeof console.groupCollapsed == 'undefined') {
          module.verbose('Console group not available, normalizing events');
          window.console.group = function() {};
          window.console.groupEnd = function() {};
          window.console.groupCollapsed = function() {};
        }
        if (typeof console.markTimeline == 'undefined') {
          module.verbose('Mark timeline not available, normalizing events');
          window.console.markTimeline = function() {};
        }
      },
      consoleClear: function() {
        module.debug('Disabling programmatic console clearing');
        window.console.clear = function() {};
      },
      requestAnimationFrame: function() {
        module.debug('Normalizing requestAnimationFrame');
        if(window.requestAnimationFrame === undefined) {
          module.debug('RequestAnimationFrame not available, normalizing event');
          window.requestAnimationFrame = window.requestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.msRequestAnimationFrame
            || function(callback) { setTimeout(callback, 0); }
          ;
        }
      }
    },

    moduleExists: function(name) {
      return ($.fn[name] !== undefined && $.fn[name].settings !== undefined);
    },

    enabled: {
      modules: function(modules) {
        var
          enabledModules = []
        ;
        modules = modules || settings.modules;
        $.each(modules, function(index, name) {
          if(module.moduleExists(name)) {
            enabledModules.push(name);
          }
        });
        return enabledModules;
      }
    },

    disabled: {
      modules: function(modules) {
        var
          disabledModules = []
        ;
        modules = modules || settings.modules;
        $.each(modules, function(index, name) {
          if(!module.moduleExists(name)) {
            disabledModules.push(name);
          }
        });
        return disabledModules;
      }
    },

    change: {
      setting: function(setting, value, modules, modifyExisting) {
        modules = (typeof modules === 'string')
          ? (modules === 'all')
            ? settings.modules
            : [modules]
          : modules || settings.modules
        ;
        modifyExisting = (modifyExisting !== undefined)
          ? modifyExisting
          : true
        ;
        $.each(modules, function(index, name) {
          var
            namespace = (module.moduleExists(name))
              ? $.fn[name].settings.namespace || false
              : true,
            $existingModules
          ;
          if(module.moduleExists(name)) {
            module.verbose('Changing default setting', setting, value, name);
            $.fn[name].settings[setting] = value;
            if(modifyExisting && namespace) {
              $existingModules = $(':data(module-' + namespace + ')');
              if($existingModules.length > 0) {
                module.verbose('Modifying existing settings', $existingModules);
                $existingModules[name]('setting', setting, value);
              }
            }
          }
        });
      },
      settings: function(newSettings, modules, modifyExisting) {
        modules = (typeof modules === 'string')
          ? [modules]
          : modules || settings.modules
        ;
        modifyExisting = (modifyExisting !== undefined)
          ? modifyExisting
          : true
        ;
        $.each(modules, function(index, name) {
          var
            $existingModules
          ;
          if(module.moduleExists(name)) {
            module.verbose('Changing default setting', newSettings, name);
            $.extend(true, $.fn[name].settings, newSettings);
            if(modifyExisting && namespace) {
              $existingModules = $(':data(module-' + namespace + ')');
              if($existingModules.length > 0) {
                module.verbose('Modifying existing settings', $existingModules);
                $existingModules[name]('setting', newSettings);
              }
            }
          }
        });
      }
    },

    enable: {
      console: function() {
        module.console(true);
      },
      debug: function(modules, modifyExisting) {
        modules = modules || settings.modules;
        module.debug('Enabling debug for modules', modules);
        module.change.setting('debug', true, modules, modifyExisting);
      },
      verbose: function(modules, modifyExisting) {
        modules = modules || settings.modules;
        module.debug('Enabling verbose debug for modules', modules);
        module.change.setting('verbose', true, modules, modifyExisting);
      }
    },
    disable: {
      console: function() {
        module.console(false);
      },
      debug: function(modules, modifyExisting) {
        modules = modules || settings.modules;
        module.debug('Disabling debug for modules', modules);
        module.change.setting('debug', false, modules, modifyExisting);
      },
      verbose: function(modules, modifyExisting) {
        modules = modules || settings.modules;
        module.debug('Disabling verbose debug for modules', modules);
        module.change.setting('verbose', false, modules, modifyExisting);
      }
    },

    console: function(enable) {
      if(enable) {
        if(instance.cache.console === undefined) {
          module.error(error.console);
          return;
        }
        module.debug('Restoring console function');
        window.console = instance.cache.console;
      }
      else {
        module.debug('Disabling console function');
        instance.cache.console = window.console;
        window.console = {
          clear          : function(){},
          error          : function(){},
          group          : function(){},
          groupCollapsed : function(){},
          groupEnd       : function(){},
          info           : function(){},
          log            : function(){},
          markTimeline   : function(){},
          warn           : function(){}
        };
      }
    },

    destroy: function() {
      module.verbose('Destroying previous site for', $module);
      $module
        .removeData(moduleNamespace)
      ;
    },

    cache: {},

    setting: function(name, value) {
      if( $.isPlainObject(name) ) {
        $.extend(true, settings, name);
      }
      else if(value !== undefined) {
        settings[name] = value;
      }
      else {
        return settings[name];
      }
    },
    internal: function(name, value) {
      if( $.isPlainObject(name) ) {
        $.extend(true, module, name);
      }
      else if(value !== undefined) {
        module[name] = value;
      }
      else {
        return module[name];
      }
    },
    debug: function() {
      if(settings.debug) {
        if(settings.performance) {
          module.performance.log(arguments);
        }
        else {
          module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
          module.debug.apply(console, arguments);
        }
      }
    },
    verbose: function() {
      if(settings.verbose && settings.debug) {
        if(settings.performance) {
          module.performance.log(arguments);
        }
        else {
          module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
          module.verbose.apply(console, arguments);
        }
      }
    },
    error: function() {
      module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
      module.error.apply(console, arguments);
    },
    performance: {
      log: function(message) {
        var
          currentTime,
          executionTime,
          previousTime
        ;
        if(settings.performance) {
          currentTime   = new Date().getTime();
          previousTime  = time || currentTime;
          executionTime = currentTime - previousTime;
          time          = currentTime;
          performance.push({
            'Element'        : element,
            'Name'           : message[0],
            'Arguments'      : [].slice.call(message, 1) || '',
            'Execution Time' : executionTime
          });
        }
        clearTimeout(module.performance.timer);
        module.performance.timer = setTimeout(module.performance.display, 500);
      },
      display: function() {
        var
          title = settings.name + ':',
          totalTime = 0
        ;
        time = false;
        clearTimeout(module.performance.timer);
        $.each(performance, function(index, data) {
          totalTime += data['Execution Time'];
        });
        title += ' ' + totalTime + 'ms';
        if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
          console.groupCollapsed(title);
          if(console.table) {
            console.table(performance);
          }
          else {
            $.each(performance, function(index, data) {
              console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
            });
          }
          console.groupEnd();
        }
        performance = [];
      }
    },
    invoke: function(query, passedArguments, context) {
      var
        object = instance,
        maxDepth,
        found,
        response
      ;
      passedArguments = passedArguments || queryArguments;
      context         = element         || context;
      if(typeof query == 'string' && object !== undefined) {
        query    = query.split(/[\. ]/);
        maxDepth = query.length - 1;
        $.each(query, function(depth, value) {
          var camelCaseValue = (depth != maxDepth)
            ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
            : query
          ;
          if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
            object = object[camelCaseValue];
          }
          else if( object[camelCaseValue] !== undefined ) {
            found = object[camelCaseValue];
            return false;
          }
          else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
            object = object[value];
          }
          else if( object[value] !== undefined ) {
            found = object[value];
            return false;
          }
          else {
            module.error(error.method, query);
            return false;
          }
        });
      }
      if ( $.isFunction( found ) ) {
        response = found.apply(context, passedArguments);
      }
      else if(found !== undefined) {
        response = found;
      }
      if($.isArray(returnedValue)) {
        returnedValue.push(response);
      }
      else if(returnedValue !== undefined) {
        returnedValue = [returnedValue, response];
      }
      else if(response !== undefined) {
        returnedValue = response;
      }
      return found;
    }
  };

  if(methodInvoked) {
    if(instance === undefined) {
      module.initialize();
    }
    module.invoke(query);
  }
  else {
    if(instance !== undefined) {
      module.destroy();
    }
    module.initialize();
  }
  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.site.settings = {

  name        : 'Site',
  namespace   : 'site',

  error : {
    console : 'Console cannot be restored, most likely it was overwritten outside of module',
    method : 'The method you called is not defined.'
  },

  debug       : false,
  verbose     : false,
  performance : true,

  modules: [
    'accordion',
    'api',
    'checkbox',
    'dimmer',
    'dropdown',
    'embed',
    'form',
    'modal',
    'nag',
    'popup',
    'rating',
    'shape',
    'sidebar',
    'state',
    'sticky',
    'tab',
    'transition',
    'visit',
    'visibility'
  ],

  siteNamespace   : 'site',
  namespaceStub   : {
    cache     : {},
    config    : {},
    sections  : {},
    section   : {},
    utilities : {}
  }

};

// allows for selection of elements with data attributes
$.extend($.expr[ ":" ], {
  data: ($.expr.createPseudo)
    ? $.expr.createPseudo(function(dataName) {
        return function(elem) {
          return !!$.data(elem, dataName);
        };
      })
    : function(elem, i, match) {
      // support: jQuery < 1.8
      return !!$.data(elem, match[ 3 ]);
    }
});


})( jQuery, window , document );

/*!
 * # Semantic UI 2.1.4 - Form Validation
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2015 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.fn.form = function(parameters) {
  var
    $allModules      = $(this),
    moduleSelector   = $allModules.selector || '',

    time             = new Date().getTime(),
    performance      = [],

    query            = arguments[0],
    legacyParameters = arguments[1],
    methodInvoked    = (typeof query == 'string'),
    queryArguments   = [].slice.call(arguments, 1),
    returnedValue
  ;
  $allModules
    .each(function() {
      var
        $module     = $(this),
        element     = this,

        formErrors  = [],
        keyHeldDown = false,

        // set at run-time
        $field,
        $group,
        $message,
        $prompt,
        $submit,
        $clear,
        $reset,

        settings,
        validation,

        metadata,
        selector,
        className,
        error,

        namespace,
        moduleNamespace,
        eventNamespace,

        instance,
        module
      ;

      module      = {

        initialize: function() {

          // settings grabbed at run time
          module.get.settings();
          if(methodInvoked) {
            if(instance === undefined) {
              module.instantiate();
            }
            module.invoke(query);
          }
          else {
            module.verbose('Initializing form validation', $module, settings);
            module.bindEvents();
            module.set.defaults();
            module.instantiate();
          }
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous module', instance);
          module.removeEvents();
          $module
            .removeData(moduleNamespace)
          ;
        },

        refresh: function() {
          module.verbose('Refreshing selector cache');
          $field      = $module.find(selector.field);
          $group      = $module.find(selector.group);
          $message    = $module.find(selector.message);
          $prompt     = $module.find(selector.prompt);

          $submit     = $module.find(selector.submit);
          $clear      = $module.find(selector.clear);
          $reset      = $module.find(selector.reset);
        },

        submit: function() {
          module.verbose('Submitting form', $module);
          $module
            .submit()
          ;
        },

        attachEvents: function(selector, action) {
          action = action || 'submit';
          $(selector)
            .on('click' + eventNamespace, function(event) {
              module[action]();
              event.preventDefault();
            })
          ;
        },

        bindEvents: function() {
          module.verbose('Attaching form events');
          $module
            .on('submit' + eventNamespace, module.validate.form)
            .on('blur'   + eventNamespace, selector.field, module.event.field.blur)
            .on('click'  + eventNamespace, selector.submit, module.submit)
            .on('click'  + eventNamespace, selector.reset, module.reset)
            .on('click'  + eventNamespace, selector.clear, module.clear)
          ;
          if(settings.keyboardShortcuts) {
            $module
              .on('keydown' + eventNamespace, selector.field, module.event.field.keydown)
            ;
          }
          $field
            .each(function() {
              var
                $input     = $(this),
                type       = $input.prop('type'),
                inputEvent = module.get.changeEvent(type, $input)
              ;
              $(this)
                .on(inputEvent + eventNamespace, module.event.field.change)
              ;
            })
          ;
        },

        clear: function() {
          $field
            .each(function () {
              var
                $field       = $(this),
                $element     = $field.parent(),
                $fieldGroup  = $field.closest($group),
                $prompt      = $fieldGroup.find(selector.prompt),
                defaultValue = $field.data(metadata.defaultValue) || '',
                isCheckbox   = $element.is(selector.uiCheckbox),
                isDropdown   = $element.is(selector.uiDropdown),
                isErrored    = $fieldGroup.hasClass(className.error)
              ;
              if(isErrored) {
                module.verbose('Resetting error on field', $fieldGroup);
                $fieldGroup.removeClass(className.error);
                $prompt.remove();
              }
              if(isDropdown) {
                module.verbose('Resetting dropdown value', $element, defaultValue);
                $element.dropdown('clear');
              }
              else if(isCheckbox) {
                $field.prop('checked', false);
              }
              else {
                module.verbose('Resetting field value', $field, defaultValue);
                $field.val('');
              }
            })
          ;
        },

        reset: function() {
          $field
            .each(function () {
              var
                $field       = $(this),
                $element     = $field.parent(),
                $fieldGroup  = $field.closest($group),
                $prompt      = $fieldGroup.find(selector.prompt),
                defaultValue = $field.data(metadata.defaultValue),
                isCheckbox   = $element.is(selector.uiCheckbox),
                isDropdown   = $element.is(selector.uiDropdown),
                isErrored    = $fieldGroup.hasClass(className.error)
              ;
              if(defaultValue === undefined) {
                return;
              }
              if(isErrored) {
                module.verbose('Resetting error on field', $fieldGroup);
                $fieldGroup.removeClass(className.error);
                $prompt.remove();
              }
              if(isDropdown) {
                module.verbose('Resetting dropdown value', $element, defaultValue);
                $element.dropdown('restore defaults');
              }
              else if(isCheckbox) {
                module.verbose('Resetting checkbox value', $element, defaultValue);
                $field.prop('checked', defaultValue);
              }
              else {
                module.verbose('Resetting field value', $field, defaultValue);
                $field.val(defaultValue);
              }
            })
          ;
        },

        is: {
          bracketedRule: function(rule) {
            return (rule.type && rule.type.match(settings.regExp.bracket));
          },
          valid: function() {
            var
              allValid = true
            ;
            module.verbose('Checking if form is valid');
            $.each(validation, function(fieldName, field) {
              if( !( module.validate.field(field, fieldName) ) ) {
                allValid = false;
              }
            });
            return allValid;
          }
        },

        removeEvents: function() {
          $module
            .off(eventNamespace)
          ;
          $field
            .off(eventNamespace)
          ;
          $submit
            .off(eventNamespace)
          ;
          $field
            .off(eventNamespace)
          ;
        },

        event: {
          field: {
            keydown: function(event) {
              var
                $field  = $(this),
                key     = event.which,
                keyCode = {
                  enter  : 13,
                  escape : 27
                }
              ;
              if( key == keyCode.escape) {
                module.verbose('Escape key pressed blurring field');
                $field
                  .blur()
                ;
              }
              if(!event.ctrlKey && key == keyCode.enter && $field.is(selector.input) && $field.not(selector.checkbox).length > 0 ) {
                if(!keyHeldDown) {
                  $field
                    .one('keyup' + eventNamespace, module.event.field.keyup)
                  ;
                  module.submit();
                  module.debug('Enter pressed on input submitting form');
                }
                keyHeldDown = true;
              }
            },
            keyup: function() {
              keyHeldDown = false;
            },
            blur: function(event) {
              var
                $field          = $(this),
                $fieldGroup     = $field.closest($group),
                validationRules = module.get.validation($field)
              ;
              if( $fieldGroup.hasClass(className.error) ) {
                module.debug('Revalidating field', $field, validationRules);
                module.validate.form.call(module, event, true);
              }
              else if(settings.on == 'blur' || settings.on == 'change') {
                module.validate.field( validationRules );
              }
            },
            change: function(event) {
              var
                $field      = $(this),
                $fieldGroup = $field.closest($group)
              ;
              if(settings.on == 'change' || ( $fieldGroup.hasClass(className.error) && settings.revalidate) ) {
                clearTimeout(module.timer);
                module.timer = setTimeout(function() {
                  module.debug('Revalidating field', $field,  module.get.validation($field));
                  module.validate.form.call(module, event, true);
                }, settings.delay);
              }
            }
          }

        },

        get: {
          ancillaryValue: function(rule) {
            if(!rule.type || !module.is.bracketedRule(rule)) {
              return false;
            }
            return rule.type.match(settings.regExp.bracket)[1] + '';
          },
          ruleName: function(rule) {
            if( module.is.bracketedRule(rule) ) {
              return rule.type.replace(rule.type.match(settings.regExp.bracket)[0], '');
            }
            return rule.type;
          },
          changeEvent: function(type, $input) {
            if(type == 'checkbox' || type == 'radio' || type == 'hidden' || $input.is('select')) {
              return 'change';
            }
            else {
              return module.get.inputEvent();
            }
          },
          inputEvent: function() {
            return (document.createElement('input').oninput !== undefined)
              ? 'input'
              : (document.createElement('input').onpropertychange !== undefined)
                ? 'propertychange'
                : 'keyup'
            ;
          },
          prompt: function(rule, field) {
            var
              ruleName      = module.get.ruleName(rule),
              ancillary     = module.get.ancillaryValue(rule),
              prompt        = rule.prompt || settings.prompt[ruleName] || settings.text.unspecifiedRule,
              requiresValue = (prompt.search('{value}') !== -1),
              requiresName  = (prompt.search('{name}') !== -1),
              $label,
              $field,
              name
            ;
            if(requiresName || requiresValue) {
              $field = module.get.field(field.identifier);
            }
            if(requiresValue) {
              prompt = prompt.replace('{value}', $field.val());
            }
            if(requiresName) {
              $label = $field.closest(selector.group).find('label').eq(0);
              name = ($label.size() == 1)
                ? $label.text()
                : $field.prop('placeholder') || settings.text.unspecifiedField
              ;
              prompt = prompt.replace('{name}', name);
            }
            prompt = prompt.replace('{identifier}', field.identifier);
            prompt = prompt.replace('{ruleValue}', ancillary);
            if(!rule.prompt) {
              module.verbose('Using default validation prompt for type', prompt, ruleName);
            }
            return prompt;
          },
          settings: function() {
            if($.isPlainObject(parameters)) {
              var
                keys     = Object.keys(parameters),
                isLegacySettings = (keys.length > 0)
                  ? (parameters[keys[0]].identifier !== undefined && parameters[keys[0]].rules !== undefined)
                  : false,
                ruleKeys
              ;
              if(isLegacySettings) {
                // 1.x (ducktyped)
                settings   = $.extend(true, {}, $.fn.form.settings, legacyParameters);
                validation = $.extend({}, $.fn.form.settings.defaults, parameters);
                module.error(settings.error.oldSyntax, element);
                module.verbose('Extending settings from legacy parameters', validation, settings);
              }
              else {
                // 2.x
                if(parameters.fields) {
                  ruleKeys = Object.keys(parameters.fields);
                  if( typeof parameters.fields[ruleKeys[0]] == 'string' || $.isArray(parameters.fields[ruleKeys[0]]) ) {
                    $.each(parameters.fields, function(name, rules) {
                      if(typeof rules == 'string') {
                        rules = [rules];
                      }
                      parameters.fields[name] = {
                        rules: []
                      };
                      $.each(rules, function(index, rule) {
                        parameters.fields[name].rules.push({ type: rule });
                      });
                    });
                  }
                }

                settings   = $.extend(true, {}, $.fn.form.settings, parameters);
                validation = $.extend({}, $.fn.form.settings.defaults, settings.fields);
                module.verbose('Extending settings', validation, settings);
              }
            }
            else {
              settings   = $.fn.form.settings;
              validation = $.fn.form.settings.defaults;
              module.verbose('Using default form validation', validation, settings);
            }

            // shorthand
            namespace       = settings.namespace;
            metadata        = settings.metadata;
            selector        = settings.selector;
            className       = settings.className;
            error           = settings.error;
            moduleNamespace = 'module-' + namespace;
            eventNamespace  = '.' + namespace;

            // grab instance
            instance = $module.data(moduleNamespace);

            // refresh selector cache
            module.refresh();
          },
          field: function(identifier) {
            module.verbose('Finding field with identifier', identifier);
            if( $field.filter('#' + identifier).length > 0 ) {
              return $field.filter('#' + identifier);
            }
            else if( $field.filter('[name="' + identifier +'"]').length > 0 ) {
              return $field.filter('[name="' + identifier +'"]');
            }
            else if( $field.filter('[name="' + identifier +'[]"]').length > 0 ) {
              return $field.filter('[name="' + identifier +'[]"]');
            }
            else if( $field.filter('[data-' + metadata.validate + '="'+ identifier +'"]').length > 0 ) {
              return $field.filter('[data-' + metadata.validate + '="'+ identifier +'"]');
            }
            return $('<input/>');
          },
          fields: function(fields) {
            var
              $fields = $()
            ;
            $.each(fields, function(index, name) {
              $fields = $fields.add( module.get.field(name) );
            });
            return $fields;
          },
          validation: function($field) {
            var
              fieldValidation,
              identifier
            ;
            if(!validation) {
              return false;
            }
            $.each(validation, function(fieldName, field) {
              identifier = field.identifier || fieldName;
              if( module.get.field(identifier)[0] == $field[0] ) {
                field.identifier = identifier;
                fieldValidation = field;
              }
            });
            return fieldValidation || false;
          },
          value: function (field) {
            var
              fields = [],
              results
            ;
            fields.push(field);
            results = module.get.values.call(element, fields);
            return results[field];
          },
          values: function (fields) {
            var
              $fields = $.isArray(fields)
                ? module.get.fields(fields)
                : $field,
              values = {}
            ;
            $fields.each(function(index, field) {
              var
                $field     = $(field),
                type       = $field.prop('type'),
                name       = $field.prop('name'),
                value      = $field.val(),
                isCheckbox = $field.is(selector.checkbox),
                isRadio    = $field.is(selector.radio),
                isMultiple = (name.indexOf('[]') !== -1),
                isChecked  = (isCheckbox)
                  ? $field.is(':checked')
                  : false
              ;
              if(name) {
                if(isMultiple) {
                  name = name.replace('[]', '');
                  if(!values[name]) {
                    values[name] = [];
                  }
                  if(isCheckbox) {
                    if(isChecked) {
                      values[name].push(value || true);
                    }
                    else {
                      values[name].push(false);
                    }
                  }
                  else {
                    values[name].push(value);
                  }
                }
                else {
                  if(isRadio) {
                    if(isChecked) {
                      values[name] = value;
                    }
                  }
                  else if(isCheckbox) {
                    if(isChecked) {
                      values[name] = value || true;
                    }
                    else {
                      values[name] = false;
                    }
                  }
                  else {
                    values[name] = value;
                  }
                }
              }
            });
            return values;
          }
        },

        has: {

          field: function(identifier) {
            module.verbose('Checking for existence of a field with identifier', identifier);
            if(typeof identifier !== 'string') {
              module.error(error.identifier, identifier);
            }
            if( $field.filter('#' + identifier).length > 0 ) {
              return true;
            }
            else if( $field.filter('[name="' + identifier +'"]').length > 0 ) {
              return true;
            }
            else if( $field.filter('[data-' + metadata.validate + '="'+ identifier +'"]').length > 0 ) {
              return true;
            }
            return false;
          }

        },

        add: {
          prompt: function(identifier, errors) {
            var
              $field       = module.get.field(identifier),
              $fieldGroup  = $field.closest($group),
              $prompt      = $fieldGroup.children(selector.prompt),
              promptExists = ($prompt.length !== 0)
            ;
            errors = (typeof errors == 'string')
              ? [errors]
              : errors
            ;
            module.verbose('Adding field error state', identifier);
            $fieldGroup
              .addClass(className.error)
            ;
            if(settings.inline) {
              if(!promptExists) {
                $prompt = settings.templates.prompt(errors);
                $prompt
                  .appendTo($fieldGroup)
                ;
              }
              $prompt
                .html(errors[0])
              ;
              if(!promptExists) {
                if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
                  module.verbose('Displaying error with css transition', settings.transition);
                  $prompt.transition(settings.transition + ' in', settings.duration);
                }
                else {
                  module.verbose('Displaying error with fallback javascript animation');
                  $prompt
                    .fadeIn(settings.duration)
                  ;
                }
              }
              else {
                module.verbose('Inline errors are disabled, no inline error added', identifier);
              }
            }
          },
          errors: function(errors) {
            module.debug('Adding form error messages', errors);
            module.set.error();
            $message
              .html( settings.templates.error(errors) )
            ;
          }
        },

        remove: {
          prompt: function(identifier) {
            var
              $field      = module.get.field(identifier),
              $fieldGroup = $field.closest($group),
              $prompt     = $fieldGroup.children(selector.prompt)
            ;
            $fieldGroup
              .removeClass(className.error)
            ;
            if(settings.inline && $prompt.is(':visible')) {
              module.verbose('Removing prompt for field', identifier);
              if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
                $prompt.transition(settings.transition + ' out', settings.duration, function() {
                  $prompt.remove();
                });
              }
              else {
                $prompt
                  .fadeOut(settings.duration, function(){
                    $prompt.remove();
                  })
                ;
              }
            }
          }
        },

        set: {
          success: function() {
            $module
              .removeClass(className.error)
              .addClass(className.success)
            ;
          },
          defaults: function () {
            $field
              .each(function () {
                var
                  $field     = $(this),
                  isCheckbox = ($field.filter(selector.checkbox).length > 0),
                  value      = (isCheckbox)
                    ? $field.is(':checked')
                    : $field.val()
                ;
                $field.data(metadata.defaultValue, value);
              })
            ;
          },
          error: function() {
            $module
              .removeClass(className.success)
              .addClass(className.error)
            ;
          },
          value: function (field, value) {
            var
              fields = {}
            ;
            fields[field] = value;
            return module.set.values.call(element, fields);
          },
          values: function (fields) {
            if($.isEmptyObject(fields)) {
              return;
            }
            $.each(fields, function(key, value) {
              var
                $field      = module.get.field(key),
                $element    = $field.parent(),
                isMultiple  = $.isArray(value),
                isCheckbox  = $element.is(selector.uiCheckbox),
                isDropdown  = $element.is(selector.uiDropdown),
                isRadio     = ($field.is(selector.radio) && isCheckbox),
                fieldExists = ($field.length > 0),
                $multipleField
              ;
              if(fieldExists) {
                if(isMultiple && isCheckbox) {
                  module.verbose('Selecting multiple', value, $field);
                  $element.checkbox('uncheck');
                  $.each(value, function(index, value) {
                    $multipleField = $field.filter('[value="' + value + '"]');
                    $element       = $multipleField.parent();
                    if($multipleField.length > 0) {
                      $element.checkbox('check');
                    }
                  });
                }
                else if(isRadio) {
                  module.verbose('Selecting radio value', value, $field);
                  $field.filter('[value="' + value + '"]')
                    .parent(selector.uiCheckbox)
                      .checkbox('check')
                  ;
                }
                else if(isCheckbox) {
                  module.verbose('Setting checkbox value', value, $element);
                  if(value === true) {
                    $element.checkbox('check');
                  }
                  else {
                    $element.checkbox('uncheck');
                  }
                }
                else if(isDropdown) {
                  module.verbose('Setting dropdown value', value, $element);
                  $element.dropdown('set selected', value);
                }
                else {
                  module.verbose('Setting field value', value, $field);
                  $field.val(value);
                }
              }
            });
          }
        },

        validate: {

          form: function(event, ignoreCallbacks) {
            var
              values = module.get.values(),
              apiRequest
            ;

            // input keydown event will fire submit repeatedly by browser default
            if(keyHeldDown) {
              return false;
            }

            // reset errors
            formErrors = [];
            if( module.is.valid() ) {
              module.debug('Form has no validation errors, submitting');
              module.set.success();
              if(ignoreCallbacks !== true) {
                return settings.onSuccess.call(element, event, values);
              }
            }
            else {
              module.debug('Form has errors');
              module.set.error();
              if(!settings.inline) {
                module.add.errors(formErrors);
              }
              // prevent ajax submit
              if($module.data('moduleApi') !== undefined) {
                event.stopImmediatePropagation();
              }
              if(ignoreCallbacks !== true) {
                return settings.onFailure.call(element, formErrors, values);
              }
            }
          },

          // takes a validation object and returns whether field passes validation
          field: function(field, fieldName) {
            var
              identifier  = field.identifier || fieldName,
              $field      = module.get.field(identifier),
              fieldValid  = true,
              fieldErrors = []
            ;
            if(!field.identifier) {
              module.debug('Using field name as identifier', identifier);
              field.identifier = identifier;
            }
            if($field.prop('disabled')) {
              module.debug('Field is disabled. Skipping', identifier);
              fieldValid = true;
            }
            else if(field.optional && $.trim($field.val()) === ''){
              module.debug('Field is optional and empty. Skipping', identifier);
              fieldValid = true;
            }
            else if(field.rules !== undefined) {
              $.each(field.rules, function(index, rule) {
                if( module.has.field(identifier) && !( module.validate.rule(field, rule) ) ) {
                  module.debug('Field is invalid', identifier, rule.type);
                  fieldErrors.push(module.get.prompt(rule, field));
                  fieldValid = false;
                }
              });
            }
            if(fieldValid) {
              module.remove.prompt(identifier, fieldErrors);
              settings.onValid.call($field);
            }
            else {
              formErrors = formErrors.concat(fieldErrors);
              module.add.prompt(identifier, fieldErrors);
              settings.onInvalid.call($field, fieldErrors);
              return false;
            }
            return true;
          },

          // takes validation rule and returns whether field passes rule
          rule: function(field, rule) {
            var
              $field       = module.get.field(field.identifier),
              type         = rule.type,
              value        = $field.val(),
              isValid      = true,
              ancillary    = module.get.ancillaryValue(rule),
              ruleName     = module.get.ruleName(rule),
              ruleFunction = settings.rules[ruleName]
            ;
            if( !$.isFunction(ruleFunction) ) {
              module.error(error.noRule, ruleName);
              return;
            }
            // cast to string avoiding encoding special values
            value = (value === undefined || value === '' || value === null)
              ? ''
              : $.trim(value + '')
            ;
            return ruleFunction.call($field, value, ancillary);
          }
        },

        setting: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if($allModules.length > 1) {
              title += ' ' + '(' + $allModules.length + ')';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                return false;
              }
            });
          }
          if( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };
      module.initialize();
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.form.settings = {

  name              : 'Form',
  namespace         : 'form',

  debug             : false,
  verbose           : false,
  performance       : true,

  fields            : false,

  keyboardShortcuts : true,
  on                : 'submit',
  inline            : false,

  delay             : 200,
  revalidate        : true,

  transition        : 'scale',
  duration          : 200,

  onValid           : function() {},
  onInvalid         : function() {},
  onSuccess         : function() { return true; },
  onFailure         : function() { return false; },

  metadata : {
    defaultValue : 'default',
    validate     : 'validate'
  },

  regExp: {
    bracket : /\[(.*)\]/i,
    decimal : /^\-?\d*(\.\d+)?$/,
    email   : "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?",
    escape  : /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
    flags   : /^\/(.*)\/(.*)?/,
    integer : /^\-?\d+$/,
    number  : /^\-?\d*(\.\d+)?$/,
    url     : /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/i
  },

  text: {
    unspecifiedRule  : 'Please enter a valid value',
    unspecifiedField : 'This field'
  },

  prompt: {
    empty                : '{name} must have a value',
    checked              : '{name} must be checked',
    email                : '{name} must be a valid e-mail',
    url                  : '{name} must be a valid url',
    regExp               : '{name} is not formatted correctly',
    integer              : '{name} must be an integer',
    decimal              : '{name} must be a decimal number',
    number               : '{name} must be set to a number',
    is                   : '{name} must be "{ruleValue}"',
    isExactly            : '{name} must be exactly "{ruleValue}"',
    not                  : '{name} cannot be set to "{ruleValue}"',
    notExactly           : '{name} cannot be set to exactly "{ruleValue}"',
    contain              : '{name} cannot contain "{ruleValue}"',
    containExactly       : '{name} cannot contain exactly "{ruleValue}"',
    doesntContain        : '{name} must contain  "{ruleValue}"',
    doesntContainExactly : '{name} must contain exactly "{ruleValue}"',
    minLength            : '{name} must be at least {ruleValue} characters',
    length               : '{name} must be at least {ruleValue} characters',
    exactLength          : '{name} must be exactly {ruleValue} characters',
    maxLength            : '{name} cannot be longer than {ruleValue} characters',
    match                : '{name} must match {ruleValue} field',
    different            : '{name} must have a different value than {ruleValue} field',
    creditCard           : '{name} must be a valid credit card number',
    minCount             : '{name} must have at least {ruleValue} choices',
    exactCount           : '{name} must have exactly {ruleValue} choices',
    maxCount             : '{name} must have {ruleValue} or less choices'
  },

  selector : {
    checkbox   : 'input[type="checkbox"], input[type="radio"]',
    clear      : '.clear',
    field      : 'input, textarea, select',
    group      : '.field',
    input      : 'input',
    message    : '.error.message',
    prompt     : '.prompt.label',
    radio      : 'input[type="radio"]',
    reset      : '.reset:not([type="reset"])',
    submit     : '.submit:not([type="submit"])',
    uiCheckbox : '.ui.checkbox',
    uiDropdown : '.ui.dropdown'
  },

  className : {
    error   : 'error',
    label   : 'ui prompt label',
    pressed : 'down',
    success : 'success'
  },

  error: {
    identifier : 'You must specify a string identifier for each field',
    method     : 'The method you called is not defined.',
    noRule     : 'There is no rule matching the one you specified',
    oldSyntax  : 'Starting in 2.0 forms now only take a single settings object. Validation settings converted to new syntax automatically.'
  },

  templates: {

    // template that produces error message
    error: function(errors) {
      var
        html = '<ul class="list">'
      ;
      $.each(errors, function(index, value) {
        html += '<li>' + value + '</li>';
      });
      html += '</ul>';
      return $(html);
    },

    // template that produces label
    prompt: function(errors) {
      return $('<div/>')
        .addClass('ui basic red pointing prompt label')
        .html(errors[0])
      ;
    }
  },

  rules: {

    // is not empty or blank string
    empty: function(value) {
      return !(value === undefined || '' === value || $.isArray(value) && value.length === 0);
    },

    // checkbox checked
    checked: function() {
      return ($(this).filter(':checked').length > 0);
    },

    // is most likely an email
    email: function(value){
      var
        emailRegExp = new RegExp($.fn.form.settings.regExp.email, 'i')
      ;
      return emailRegExp.test(value);
    },

    // value is most likely url
    url: function(value) {
      return $.fn.form.settings.regExp.url.test(value);
    },

    // matches specified regExp
    regExp: function(value, regExp) {
      var
        regExpParts = regExp.match($.fn.form.settings.regExp.flags),
        flags
      ;
      // regular expression specified as /baz/gi (flags)
      if(regExpParts) {
        regExp = (regExpParts.length >= 2)
          ? regExpParts[1]
          : regExp
        ;
        flags = (regExpParts.length >= 3)
          ? regExpParts[2]
          : ''
        ;
      }
      return value.match( new RegExp(regExp, flags) );
    },

    // is valid integer or matches range
    integer: function(value, range) {
      var
        intRegExp = $.fn.form.settings.regExp.integer,
        min,
        max,
        parts
      ;
      if(range === undefined || range === '' || range === '..') {
        // do nothing
      }
      else if(range.indexOf('..') == -1) {
        if(intRegExp.test(range)) {
          min = max = range - 0;
        }
      }
      else {
        parts = range.split('..', 2);
        if(intRegExp.test(parts[0])) {
          min = parts[0] - 0;
        }
        if(intRegExp.test(parts[1])) {
          max = parts[1] - 0;
        }
      }
      return (
        intRegExp.test(value) &&
        (min === undefined || value >= min) &&
        (max === undefined || value <= max)
      );
    },

    // is valid number (with decimal)
    decimal: function(value) {
      return $.fn.form.settings.regExp.decimal.test(value);
    },

    // is valid number
    number: function(value) {
      return $.fn.form.settings.regExp.number.test(value);
    },

    // is value (case insensitive)
    is: function(value, text) {
      text = (typeof text == 'string')
        ? text.toLowerCase()
        : text
      ;
      value = (typeof value == 'string')
        ? value.toLowerCase()
        : value
      ;
      return (value == text);
    },

    // is value
    isExactly: function(value, text) {
      return (value == text);
    },

    // value is not another value (case insensitive)
    not: function(value, notValue) {
      value = (typeof value == 'string')
        ? value.toLowerCase()
        : value
      ;
      notValue = (typeof notValue == 'string')
        ? notValue.toLowerCase()
        : notValue
      ;
      return (value != notValue);
    },

    // value is not another value (case sensitive)
    notExactly: function(value, notValue) {
      return (value != notValue);
    },

    // value contains text (insensitive)
    contains: function(value, text) {
      // escape regex characters
      text = text.replace($.fn.form.settings.regExp.escape, "\\$&");
      return (value.search( new RegExp(text, 'i') ) !== -1);
    },

    // value contains text (case sensitive)
    containsExactly: function(value, text) {
      // escape regex characters
      text = text.replace($.fn.form.settings.regExp.escape, "\\$&");
      return (value.search( new RegExp(text) ) !== -1);
    },

    // value contains text (insensitive)
    doesntContain: function(value, text) {
      // escape regex characters
      text = text.replace($.fn.form.settings.regExp.escape, "\\$&");
      return (value.search( new RegExp(text, 'i') ) === -1);
    },

    // value contains text (case sensitive)
    doesntContainExactly: function(value, text) {
      // escape regex characters
      text = text.replace($.fn.form.settings.regExp.escape, "\\$&");
      return (value.search( new RegExp(text) ) === -1);
    },

    // is at least string length
    minLength: function(value, requiredLength) {
      return (value !== undefined)
        ? (value.length >= requiredLength)
        : false
      ;
    },

    // see rls notes for 2.0.6 (this is a duplicate of minLength)
    length: function(value, requiredLength) {
      return (value !== undefined)
        ? (value.length >= requiredLength)
        : false
      ;
    },

    // is exactly length
    exactLength: function(value, requiredLength) {
      return (value !== undefined)
        ? (value.length == requiredLength)
        : false
      ;
    },

    // is less than length
    maxLength: function(value, maxLength) {
      return (value !== undefined)
        ? (value.length <= maxLength)
        : false
      ;
    },

    // matches another field
    match: function(value, identifier) {
      var
        $form = $(this),
        matchingValue
      ;
      if( $('[data-validate="'+ identifier +'"]').length > 0 ) {
        matchingValue = $('[data-validate="'+ identifier +'"]').val();
      }
      else if($('#' + identifier).length > 0) {
        matchingValue = $('#' + identifier).val();
      }
      else if($('[name="' + identifier +'"]').length > 0) {
        matchingValue = $('[name="' + identifier + '"]').val();
      }
      else if( $('[name="' + identifier +'[]"]').length > 0 ) {
        matchingValue = $('[name="' + identifier +'[]"]');
      }
      return (matchingValue !== undefined)
        ? ( value.toString() == matchingValue.toString() )
        : false
      ;
    },

    // different than another field
    different: function(value, identifier) {
      // use either id or name of field
      var
        $form = $(this),
        matchingValue
      ;
      if( $('[data-validate="'+ identifier +'"]').length > 0 ) {
        matchingValue = $('[data-validate="'+ identifier +'"]').val();
      }
      else if($('#' + identifier).length > 0) {
        matchingValue = $('#' + identifier).val();
      }
      else if($('[name="' + identifier +'"]').length > 0) {
        matchingValue = $('[name="' + identifier + '"]').val();
      }
      else if( $('[name="' + identifier +'[]"]').length > 0 ) {
        matchingValue = $('[name="' + identifier +'[]"]');
      }
      return (matchingValue !== undefined)
        ? ( value.toString() !== matchingValue.toString() )
        : false
      ;
    },

    creditCard: function(cardNumber, cardTypes) {
      var
        cards = {
          visa: {
            pattern : /^4/,
            length  : [16]
          },
          amex: {
            pattern : /^3[47]/,
            length  : [15]
          },
          mastercard: {
            pattern : /^5[1-5]/,
            length  : [16]
          },
          discover: {
            pattern : /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
            length  : [16]
          },
          unionPay: {
            pattern : /^(62|88)/,
            length  : [16, 17, 18, 19]
          },
          jcb: {
            pattern : /^35(2[89]|[3-8][0-9])/,
            length  : [16]
          },
          maestro: {
            pattern : /^(5018|5020|5038|6304|6759|676[1-3])/,
            length  : [12, 13, 14, 15, 16, 17, 18, 19]
          },
          dinersClub: {
            pattern : /^(30[0-5]|^36)/,
            length  : [14]
          },
          laser: {
            pattern : /^(6304|670[69]|6771)/,
            length  : [16, 17, 18, 19]
          },
          visaElectron: {
            pattern : /^(4026|417500|4508|4844|491(3|7))/,
            length  : [16]
          }
        },
        valid         = {},
        validCard     = false,
        requiredTypes = (typeof cardTypes == 'string')
          ? cardTypes.split(',')
          : false,
        unionPay,
        validation
      ;

      if(typeof cardNumber !== 'string' || cardNumber.length === 0) {
        return;
      }

      // verify card types
      if(requiredTypes) {
        $.each(requiredTypes, function(index, type){
          // verify each card type
          validation = cards[type];
          if(validation) {
            valid = {
              length  : ($.inArray(cardNumber.length, validation.length) !== -1),
              pattern : (cardNumber.search(validation.pattern) !== -1)
            };
            if(valid.length && valid.pattern) {
              validCard = true;
            }
          }
        });

        if(!validCard) {
          return false;
        }
      }

      // skip luhn for UnionPay
      unionPay = {
        number  : ($.inArray(cardNumber.length, cards.unionPay.length) !== -1),
        pattern : (cardNumber.search(cards.unionPay.pattern) !== -1)
      };
      if(unionPay.number && unionPay.pattern) {
        return true;
      }

      // verify luhn, adapted from  <https://gist.github.com/2134376>
      var
        length        = cardNumber.length,
        multiple      = 0,
        producedValue = [
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
        ],
        sum           = 0
      ;
      while (length--) {
        sum += producedValue[multiple][parseInt(cardNumber.charAt(length), 10)];
        multiple ^= 1;
      }
      return (sum % 10 === 0 && sum > 0);
    },

    minCount: function(value, minCount) {
      if(minCount == 0) {
        return true;
      }
      if(minCount == 1) {
        return (value !== '');
      }
      return (value.split(',').length >= minCount);
    },

    exactCount: function(value, exactCount) {
      if(exactCount == 0) {
        return (value === '');
      }
      if(exactCount == 1) {
        return (value !== '' && value.search(',') === -1);
      }
      return (value.split(',').length == exactCount);
    },

    maxCount: function(value, maxCount) {
      if(maxCount == 0) {
        return false;
      }
      if(maxCount == 1) {
        return (value.search(',') === -1);
      }
      return (value.split(',').length <= maxCount);
    }
  }

};

})( jQuery, window , document );

/*!
 * # Semantic UI 2.1.4 - Dimmer
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2015 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.fn.dimmer = function(parameters) {
  var
    $allModules     = $(this),

    time            = new Date().getTime(),
    performance     = [],

    query           = arguments[0],
    methodInvoked   = (typeof query == 'string'),
    queryArguments  = [].slice.call(arguments, 1),

    returnedValue
  ;

  $allModules
    .each(function() {
      var
        settings        = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.dimmer.settings, parameters)
          : $.extend({}, $.fn.dimmer.settings),

        selector        = settings.selector,
        namespace       = settings.namespace,
        className       = settings.className,
        error           = settings.error,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,
        moduleSelector  = $allModules.selector || '',

        clickEvent      = ('ontouchstart' in document.documentElement)
          ? 'touchstart'
          : 'click',

        $module = $(this),
        $dimmer,
        $dimmable,

        element   = this,
        instance  = $module.data(moduleNamespace),
        module
      ;

      module = {

        preinitialize: function() {
          if( module.is.dimmer() ) {

            $dimmable = $module.parent();
            $dimmer   = $module;
          }
          else {
            $dimmable = $module;
            if( module.has.dimmer() ) {
              if(settings.dimmerName) {
                $dimmer = $dimmable.find(selector.dimmer).filter('.' + settings.dimmerName);
              }
              else {
                $dimmer = $dimmable.find(selector.dimmer);
              }
            }
            else {
              $dimmer = module.create();
            }
          }
        },

        initialize: function() {
          module.debug('Initializing dimmer', settings);

          module.bind.events();
          module.set.dimmable();
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, instance)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous module', $dimmer);
          module.unbind.events();
          module.remove.variation();
          $dimmable
            .off(eventNamespace)
          ;
        },

        bind: {
          events: function() {
            if(settings.on == 'hover') {
              $dimmable
                .on('mouseenter' + eventNamespace, module.show)
                .on('mouseleave' + eventNamespace, module.hide)
              ;
            }
            else if(settings.on == 'click') {
              $dimmable
                .on(clickEvent + eventNamespace, module.toggle)
              ;
            }
            if( module.is.page() ) {
              module.debug('Setting as a page dimmer', $dimmable);
              module.set.pageDimmer();
            }

            if( module.is.closable() ) {
              module.verbose('Adding dimmer close event', $dimmer);
              $dimmable
                .on(clickEvent + eventNamespace, selector.dimmer, module.event.click)
              ;
            }
          }
        },

        unbind: {
          events: function() {
            $module
              .removeData(moduleNamespace)
            ;
          }
        },

        event: {
          click: function(event) {
            module.verbose('Determining if event occured on dimmer', event);
            if( $dimmer.find(event.target).length === 0 || $(event.target).is(selector.content) ) {
              module.hide();
              event.stopImmediatePropagation();
            }
          }
        },

        addContent: function(element) {
          var
            $content = $(element)
          ;
          module.debug('Add content to dimmer', $content);
          if($content.parent()[0] !== $dimmer[0]) {
            $content.detach().appendTo($dimmer);
          }
        },

        create: function() {
          var
            $element = $( settings.template.dimmer() )
          ;
          if(settings.variation) {
            module.debug('Creating dimmer with variation', settings.variation);
            $element.addClass(settings.variation);
          }
          if(settings.dimmerName) {
            module.debug('Creating named dimmer', settings.dimmerName);
            $element.addClass(settings.dimmerName);
          }
          $element
            .appendTo($dimmable)
          ;
          return $element;
        },

        show: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          module.debug('Showing dimmer', $dimmer, settings);
          if( (!module.is.dimmed() || module.is.animating()) && module.is.enabled() ) {
            module.animate.show(callback);
            settings.onShow.call(element);
            settings.onChange.call(element);
          }
          else {
            module.debug('Dimmer is already shown or disabled');
          }
        },

        hide: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( module.is.dimmed() || module.is.animating() ) {
            module.debug('Hiding dimmer', $dimmer);
            module.animate.hide(callback);
            settings.onHide.call(element);
            settings.onChange.call(element);
          }
          else {
            module.debug('Dimmer is not visible');
          }
        },

        toggle: function() {
          module.verbose('Toggling dimmer visibility', $dimmer);
          if( !module.is.dimmed() ) {
            module.show();
          }
          else {
            module.hide();
          }
        },

        animate: {
          show: function(callback) {
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if(settings.useCSS && $.fn.transition !== undefined && $dimmer.transition('is supported')) {
              if(settings.opacity !== 'auto') {
                module.set.opacity();
              }
              $dimmer
                .transition({
                  animation   : settings.transition + ' in',
                  queue       : false,
                  duration    : module.get.duration(),
                  useFailSafe : true,
                  onStart     : function() {
                    module.set.dimmed();
                  },
                  onComplete  : function() {
                    module.set.active();
                    callback();
                  }
                })
              ;
            }
            else {
              module.verbose('Showing dimmer animation with javascript');
              module.set.dimmed();
              if(settings.opacity == 'auto') {
                settings.opacity = 0.8;
              }
              $dimmer
                .stop()
                .css({
                  opacity : 0,
                  width   : '100%',
                  height  : '100%'
                })
                .fadeTo(module.get.duration(), settings.opacity, function() {
                  $dimmer.removeAttr('style');
                  module.set.active();
                  callback();
                })
              ;
            }
          },
          hide: function(callback) {
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if(settings.useCSS && $.fn.transition !== undefined && $dimmer.transition('is supported')) {
              module.verbose('Hiding dimmer with css');
              $dimmer
                .transition({
                  animation   : settings.transition + ' out',
                  queue       : false,
                  duration    : module.get.duration(),
                  useFailSafe : true,
                  onStart     : function() {
                    module.remove.dimmed();
                  },
                  onComplete  : function() {
                    module.remove.active();
                    callback();
                  }
                })
              ;
            }
            else {
              module.verbose('Hiding dimmer with javascript');
              module.remove.dimmed();
              $dimmer
                .stop()
                .fadeOut(module.get.duration(), function() {
                  module.remove.active();
                  $dimmer.removeAttr('style');
                  callback();
                })
              ;
            }
          }
        },

        get: {
          dimmer: function() {
            return $dimmer;
          },
          duration: function() {
            if(typeof settings.duration == 'object') {
              if( module.is.active() ) {
                return settings.duration.hide;
              }
              else {
                return settings.duration.show;
              }
            }
            return settings.duration;
          }
        },

        has: {
          dimmer: function() {
            if(settings.dimmerName) {
              return ($module.find(selector.dimmer).filter('.' + settings.dimmerName).length > 0);
            }
            else {
              return ( $module.find(selector.dimmer).length > 0 );
            }
          }
        },

        is: {
          active: function() {
            return $dimmer.hasClass(className.active);
          },
          animating: function() {
            return ( $dimmer.is(':animated') || $dimmer.hasClass(className.animating) );
          },
          closable: function() {
            if(settings.closable == 'auto') {
              if(settings.on == 'hover') {
                return false;
              }
              return true;
            }
            return settings.closable;
          },
          dimmer: function() {
            return $module.hasClass(className.dimmer);
          },
          dimmable: function() {
            return $module.hasClass(className.dimmable);
          },
          dimmed: function() {
            return $dimmable.hasClass(className.dimmed);
          },
          disabled: function() {
            return $dimmable.hasClass(className.disabled);
          },
          enabled: function() {
            return !module.is.disabled();
          },
          page: function () {
            return $dimmable.is('body');
          },
          pageDimmer: function() {
            return $dimmer.hasClass(className.pageDimmer);
          }
        },

        can: {
          show: function() {
            return !$dimmer.hasClass(className.disabled);
          }
        },

        set: {
          opacity: function(opacity) {
            var
              color      = $dimmer.css('background-color'),
              colorArray = color.split(','),
              isRGBA     = (colorArray && colorArray.length == 4)
            ;
            opacity    = settings.opacity || opacity;
            if(isRGBA) {
              colorArray[3] = opacity + ')';
              color         = colorArray.join(',');
            }
            else {
              color = 'rgba(0, 0, 0, ' + opacity + ')';
            }
            module.debug('Setting opacity to', opacity);
            $dimmer.css('background-color', color);
          },
          active: function() {
            $dimmer.addClass(className.active);
          },
          dimmable: function() {
            $dimmable.addClass(className.dimmable);
          },
          dimmed: function() {
            $dimmable.addClass(className.dimmed);
          },
          pageDimmer: function() {
            $dimmer.addClass(className.pageDimmer);
          },
          disabled: function() {
            $dimmer.addClass(className.disabled);
          },
          variation: function(variation) {
            variation = variation || settings.variation;
            if(variation) {
              $dimmer.addClass(variation);
            }
          }
        },

        remove: {
          active: function() {
            $dimmer
              .removeClass(className.active)
            ;
          },
          dimmed: function() {
            $dimmable.removeClass(className.dimmed);
          },
          disabled: function() {
            $dimmer.removeClass(className.disabled);
          },
          variation: function(variation) {
            variation = variation || settings.variation;
            if(variation) {
              $dimmer.removeClass(variation);
            }
          }
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if($allModules.length > 1) {
              title += ' ' + '(' + $allModules.length + ')';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      module.preinitialize();

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          instance.invoke('destroy');
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.dimmer.settings = {

  name        : 'Dimmer',
  namespace   : 'dimmer',

  debug       : false,
  verbose     : false,
  performance : true,

  // name to distinguish between multiple dimmers in context
  dimmerName  : false,

  // whether to add a variation type
  variation   : false,

  // whether to bind close events
  closable    : 'auto',

  // whether to use css animations
  useCSS      : true,

  // css animation to use
  transition  : 'fade',

  // event to bind to
  on          : false,

  // overriding opacity value
  opacity     : 'auto',

  // transition durations
  duration    : {
    show : 500,
    hide : 500
  },

  onChange    : function(){},
  onShow      : function(){},
  onHide      : function(){},

  error   : {
    method   : 'The method you called is not defined.'
  },

  className : {
    active     : 'active',
    animating  : 'animating',
    dimmable   : 'dimmable',
    dimmed     : 'dimmed',
    dimmer     : 'dimmer',
    disabled   : 'disabled',
    hide       : 'hide',
    pageDimmer : 'page',
    show       : 'show'
  },

  selector: {
    dimmer   : '> .ui.dimmer',
    content  : '.ui.dimmer > .content, .ui.dimmer > .content > .center'
  },

  template: {
    dimmer: function() {
     return $('<div />').attr('class', 'ui dimmer');
    }
  }

};

})( jQuery, window , document );
/*!
 * # Semantic UI 2.1.4 - Dropdown
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2015 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.fn.dropdown = function(parameters) {
  var
    $allModules    = $(this),
    $document      = $(document),

    moduleSelector = $allModules.selector || '',

    hasTouch       = ('ontouchstart' in document.documentElement),
    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),
    returnedValue
  ;

  $allModules
    .each(function(elementIndex) {
      var
        settings          = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.dropdown.settings, parameters)
          : $.extend({}, $.fn.dropdown.settings),

        className       = settings.className,
        message         = settings.message,
        fields          = settings.fields,
        metadata        = settings.metadata,
        namespace       = settings.namespace,
        regExp          = settings.regExp,
        selector        = settings.selector,
        error           = settings.error,
        templates       = settings.templates,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,

        $module         = $(this),
        $context        = $(settings.context),
        $text           = $module.find(selector.text),
        $search         = $module.find(selector.search),
        $input          = $module.find(selector.input),
        $icon           = $module.find(selector.icon),

        $combo = ($module.prev().find(selector.text).length > 0)
          ? $module.prev().find(selector.text)
          : $module.prev(),

        $menu           = $module.children(selector.menu),
        $item           = $menu.find(selector.item),

        activated       = false,
        itemActivated   = false,
        internalChange  = false,
        element         = this,
        instance        = $module.data(moduleNamespace),

        initialLoad,
        pageLostFocus,
        elementNamespace,
        id,
        selectObserver,
        menuObserver,
        module
      ;

      module = {

        initialize: function() {
          module.debug('Initializing dropdown', settings);

          if( module.is.alreadySetup() ) {
            module.setup.reference();
          }
          else {
            module.setup.layout();
            module.refreshData();

            module.save.defaults();
            module.restore.selected();

            module.create.id();
            module.bind.events();

            module.observeChanges();
            module.instantiate();
          }

        },

        instantiate: function() {
          module.verbose('Storing instance of dropdown', module);
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous dropdown', $module);
          module.remove.tabbable();
          $module
            .off(eventNamespace)
            .removeData(moduleNamespace)
          ;
          $menu
            .off(eventNamespace)
          ;
          $document
            .off(elementNamespace)
          ;
          if(selectObserver) {
            selectObserver.disconnect();
          }
          if(menuObserver) {
            menuObserver.disconnect();
          }
        },

        observeChanges: function() {
          if('MutationObserver' in window) {
            selectObserver = new MutationObserver(function(mutations) {
              module.debug('<select> modified, recreating menu');
              module.setup.select();
            });
            menuObserver = new MutationObserver(function(mutations) {
              module.debug('Menu modified, updating selector cache');
              module.refresh();
            });
            if(module.has.input()) {
              selectObserver.observe($input[0], {
                childList : true,
                subtree   : true
              });
            }
            if(module.has.menu()) {
              menuObserver.observe($menu[0], {
                childList : true,
                subtree   : true
              });
            }
            module.debug('Setting up mutation observer', selectObserver, menuObserver);
          }
        },

        create: {
          id: function() {
            id = (Math.random().toString(16) + '000000000').substr(2, 8);
            elementNamespace = '.' + id;
            module.verbose('Creating unique id for element', id);
          },
          userChoice: function(values) {
            var
              $userChoices,
              $userChoice,
              isUserValue,
              html
            ;
            values = values || module.get.userValues();
            if(!values) {
              return false;
            }
            values = $.isArray(values)
              ? values
              : [values]
            ;
            $.each(values, function(index, value) {
              if(module.get.item(value) === false) {
                html         = settings.templates.addition( module.add.variables(message.addResult, value) );
                $userChoice  = $('<div />')
                  .html(html)
                  .attr('data-' + metadata.value, value)
                  .attr('data-' + metadata.text, value)
                  .addClass(className.addition)
                  .addClass(className.item)
                ;
                $userChoices = ($userChoices === undefined)
                  ? $userChoice
                  : $userChoices.add($userChoice)
                ;
                module.verbose('Creating user choices for value', value, $userChoice);
              }
            });
            return $userChoices;
          },
          userLabels: function(value) {
            var
              userValues = module.get.userValues()
            ;
            if(userValues) {
              module.debug('Adding user labels', userValues);
              $.each(userValues, function(index, value) {
                module.verbose('Adding custom user value');
                module.add.label(value, value);
              });
            }
          },
          menu: function() {
            $menu = $('<div />')
              .addClass(className.menu)
              .appendTo($module)
            ;
          }
        },

        search: function(query) {
          query = (query !== undefined)
            ? query
            : module.get.query()
          ;
          module.verbose('Searching for query', query);
          module.filter(query);
        },

        select: {
          firstUnfiltered: function() {
            module.verbose('Selecting first non-filtered element');
            module.remove.selectedItem();
            $item
              .not(selector.unselectable)
                .eq(0)
                .addClass(className.selected)
            ;
          },
          nextAvailable: function($selected) {
            $selected = $selected.eq(0);
            var
              $nextAvailable = $selected.nextAll(selector.item).not(selector.unselectable).eq(0),
              $prevAvailable = $selected.prevAll(selector.item).not(selector.unselectable).eq(0),
              hasNext        = ($nextAvailable.length > 0)
            ;
            if(hasNext) {
              module.verbose('Moving selection to', $nextAvailable);
              $nextAvailable.addClass(className.selected);
            }
            else {
              module.verbose('Moving selection to', $prevAvailable);
              $prevAvailable.addClass(className.selected);
            }
          }
        },

        setup: {
          api: function() {
            var
              apiSettings = {
                debug : settings.debug,
                on    : false
              }
            ;
            module.verbose('First request, initializing API');
            $module
              .api(apiSettings)
            ;
          },
          layout: function() {
            if( $module.is('select') ) {
              module.setup.select();
              module.setup.returnedObject();
            }
            if( !module.has.menu() ) {
              module.create.menu();
            }
            if( module.is.search() && !module.has.search() ) {
              module.verbose('Adding search input');
              $search = $('<input />')
                .addClass(className.search)
                .insertBefore($text)
              ;
            }
            if(settings.allowTab) {
              module.set.tabbable();
            }
          },
          select: function() {
            var
              selectValues  = module.get.selectValues()
            ;
            module.debug('Dropdown initialized on a select', selectValues);
            if( $module.is('select') ) {
              $input = $module;
            }
            // see if select is placed correctly already
            if($input.parent(selector.dropdown).length > 0) {
              module.debug('UI dropdown already exists. Creating dropdown menu only');
              $module = $input.closest(selector.dropdown);
              if( !module.has.menu() ) {
                module.create.menu();
              }
              $menu = $module.children(selector.menu);
              module.setup.menu(selectValues);
            }
            else {
              module.debug('Creating entire dropdown from select');
              $module = $('<div />')
                .attr('class', $input.attr('class') )
                .addClass(className.selection)
                .addClass(className.dropdown)
                .html( templates.dropdown(selectValues) )
                .insertBefore($input)
              ;
              if($input.hasClass(className.multiple) && $input.prop('multiple') === false) {
                module.error(error.missingMultiple);
                $input.prop('multiple', true);
              }
              if($input.is('[multiple]')) {
                module.set.multiple();
              }
              if ($input.prop('disabled')) {
                module.debug('Disabling dropdown')
                $module.addClass(className.disabled)
              }
              $input
                .removeAttr('class')
                .detach()
                .prependTo($module)
              ;
            }
            module.refresh();
          },
          menu: function(values) {
            $menu.html( templates.menu(values, fields));
            $item = $menu.find(selector.item);
          },
          reference: function() {
            module.debug('Dropdown behavior was called on select, replacing with closest dropdown');
            // replace module reference
            $module = $module.parent(selector.dropdown);
            module.refresh();
            module.setup.returnedObject();
            // invoke method in context of current instance
            if(methodInvoked) {
              instance = module;
              module.invoke(query);
            }
          },
          returnedObject: function() {
            var
              $firstModules = $allModules.slice(0, elementIndex),
              $lastModules = $allModules.slice(elementIndex + 1)
            ;
            // adjust all modules to use correct reference
            $allModules = $firstModules.add($module).add($lastModules);
          }
        },

        refresh: function() {
          module.refreshSelectors();
          module.refreshData();
        },

        refreshSelectors: function() {
          module.verbose('Refreshing selector cache');
          $text   = $module.find(selector.text);
          $search = $module.find(selector.search);
          $input  = $module.find(selector.input);
          $icon   = $module.find(selector.icon);
          $combo  = ($module.prev().find(selector.text).length > 0)
            ? $module.prev().find(selector.text)
            : $module.prev()
          ;
          $menu    = $module.children(selector.menu);
          $item    = $menu.find(selector.item);
        },

        refreshData: function() {
          module.verbose('Refreshing cached metadata');
          $item
            .removeData(metadata.text)
            .removeData(metadata.value)
          ;
          $module
            .removeData(metadata.defaultText)
            .removeData(metadata.defaultValue)
            .removeData(metadata.placeholderText)
          ;
        },

        toggle: function() {
          module.verbose('Toggling menu visibility');
          if( !module.is.active() ) {
            module.show();
          }
          else {
            module.hide();
          }
        },

        show: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( module.can.show() && !module.is.active() ) {
            module.debug('Showing dropdown');
            if(module.is.multiple() && !module.has.search() && module.is.allFiltered()) {
              return true;
            }
            if(module.has.message() && !module.has.maxSelections()) {
              module.remove.message();
            }
            if(settings.onShow.call(element) !== false) {
              module.animate.show(function() {
                if( module.can.click() ) {
                  module.bind.intent();
                }
                module.set.visible();
                callback.call(element);
              });
            }
          }
        },

        hide: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( module.is.active() ) {
            module.debug('Hiding dropdown');
            if(settings.onHide.call(element) !== false) {
              module.animate.hide(function() {
                module.remove.visible();
                callback.call(element);
              });
            }
          }
        },

        hideOthers: function() {
          module.verbose('Finding other dropdowns to hide');
          $allModules
            .not($module)
              .has(selector.menu + '.' + className.visible)
                .dropdown('hide')
          ;
        },

        hideMenu: function() {
          module.verbose('Hiding menu  instantaneously');
          module.remove.active();
          module.remove.visible();
          $menu.transition('hide');
        },

        hideSubMenus: function() {
          var
            $subMenus = $menu.children(selector.item).find(selector.menu)
          ;
          module.verbose('Hiding sub menus', $subMenus);
          $subMenus.transition('hide');
        },

        bind: {
          events: function() {
            if(hasTouch) {
              module.bind.touchEvents();
            }
            module.bind.keyboardEvents();
            module.bind.inputEvents();
            module.bind.mouseEvents();
          },
          touchEvents: function() {
            module.debug('Touch device detected binding additional touch events');
            if( module.is.searchSelection() ) {
              // do nothing special yet
            }
            else if( module.is.single() ) {
              $module
                .on('touchstart' + eventNamespace, module.event.test.toggle)
              ;
            }
            $menu
              .on('touchstart' + eventNamespace, selector.item, module.event.item.mouseenter)
            ;
          },
          keyboardEvents: function() {
            module.verbose('Binding keyboard events');
            $module
              .on('keydown' + eventNamespace, module.event.keydown)
            ;
            if( module.has.search() ) {
              $module
                .on(module.get.inputEvent() + eventNamespace, selector.search, module.event.input)
              ;
            }
            if( module.is.multiple() ) {
              $document
                .on('keydown' + elementNamespace, module.event.document.keydown)
              ;
            }
          },
          inputEvents: function() {
            module.verbose('Binding input change events');
            $module
              .on('change' + eventNamespace, selector.input, module.event.change)
            ;
          },
          mouseEvents: function() {
            module.verbose('Binding mouse events');
            if(module.is.multiple()) {
              $module
                .on('click'   + eventNamespace, selector.label,  module.event.label.click)
                .on('click'   + eventNamespace, selector.remove, module.event.remove.click)
              ;
            }
            if( module.is.searchSelection() ) {
              $module
                .on('mousedown' + eventNamespace, selector.menu,   module.event.menu.mousedown)
                .on('mouseup'   + eventNamespace, selector.menu,   module.event.menu.mouseup)
                .on('click'     + eventNamespace, selector.icon,   module.event.icon.click)
                .on('click'     + eventNamespace, selector.search, module.show)
                .on('focus'     + eventNamespace, selector.search, module.event.search.focus)
                .on('blur'      + eventNamespace, selector.search, module.event.search.blur)
                .on('click'     + eventNamespace, selector.text,   module.event.text.focus)
              ;
              if(module.is.multiple()) {
                $module
                  .on('click' + eventNamespace, module.event.click)
                ;
              }
            }
            else {
              if(settings.on == 'click') {
                $module
                  .on('click' + eventNamespace, selector.icon, module.event.icon.click)
                  .on('click' + eventNamespace, module.event.test.toggle)
                ;
              }
              else if(settings.on == 'hover') {
                $module
                  .on('mouseenter' + eventNamespace, module.delay.show)
                  .on('mouseleave' + eventNamespace, module.delay.hide)
                ;
              }
              else {
                $module
                  .on(settings.on + eventNamespace, module.toggle)
                ;
              }
              $module
                .on('mousedown' + eventNamespace, module.event.mousedown)
                .on('mouseup'   + eventNamespace, module.event.mouseup)
                .on('focus'     + eventNamespace, module.event.focus)
                .on('blur'      + eventNamespace, module.event.blur)
              ;
            }
            $menu
              .on('mouseenter' + eventNamespace, selector.item, module.event.item.mouseenter)
              .on('mouseleave' + eventNamespace, selector.item, module.event.item.mouseleave)
              .on('click'      + eventNamespace, selector.item, module.event.item.click)
            ;
          },
          intent: function() {
            module.verbose('Binding hide intent event to document');
            if(hasTouch) {
              $document
                .on('touchstart' + elementNamespace, module.event.test.touch)
                .on('touchmove'  + elementNamespace, module.event.test.touch)
              ;
            }
            $document
              .on('click' + elementNamespace, module.event.test.hide)
            ;
          }
        },

        unbind: {
          intent: function() {
            module.verbose('Removing hide intent event from document');
            if(hasTouch) {
              $document
                .off('touchstart' + elementNamespace)
                .off('touchmove' + elementNamespace)
              ;
            }
            $document
              .off('click' + elementNamespace)
            ;
          }
        },

        filter: function(query) {
          var
            searchTerm = (query !== undefined)
              ? query
              : module.get.query(),
            afterFiltered = function() {
              if(module.is.multiple()) {
                module.filterActive();
              }
              module.select.firstUnfiltered();
              if( module.has.allResultsFiltered() ) {
                if( settings.onNoResults.call(element, searchTerm) ) {
                  if(!settings.allowAdditions) {
                    module.verbose('All items filtered, showing message', searchTerm);
                    module.add.message(message.noResults);
                  }
                }
                else {
                  module.verbose('All items filtered, hiding dropdown', searchTerm);
                  module.hideMenu();
                }
              }
              else {
                module.remove.message();
              }
              if(settings.allowAdditions) {
                module.add.userSuggestion(query);
              }
              if(module.is.searchSelection() && module.can.show() && module.is.focusedOnSearch() ) {
                module.show();
              }
            }
          ;
          if(settings.useLabels && module.has.maxSelections()) {
            return;
          }
          if(settings.apiSettings) {
            if( module.can.useAPI() ) {
              module.queryRemote(searchTerm, function() {
                afterFiltered();
              });
            }
            else {
              module.error(error.noAPI);
            }
          }
          else {
            module.filterItems(searchTerm);
            afterFiltered();
          }
        },

        queryRemote: function(query, callback) {
          var
            apiSettings = {
              errorDuration        : false,
              throttle             : settings.throttle,
              urlData              : {
                query: query
              },
              onError: function() {
                module.add.message(message.serverError);
                callback();
              },
              onFailure: function() {
                module.add.message(message.serverError);
                callback();
              },
              onSuccess : function(response) {
                module.remove.message();
                module.setup.menu({
                  values: response.results
                });
                callback();
              }
            }
          ;
          if( !$module.api('get request') ) {
            module.setup.api();
          }
          apiSettings = $.extend(true, {}, apiSettings, settings.apiSettings);
          $module
            .api('setting', apiSettings)
            .api('query')
          ;
        },

        filterItems: function(query) {
          var
            searchTerm = (query !== undefined)
              ? query
              : module.get.query(),
            $results         = $(),
            escapedTerm      = module.escape.regExp(searchTerm),
            beginsWithRegExp = new RegExp('^' + escapedTerm, 'igm')
          ;
          // avoid loop if we're matching nothing
          if( !module.has.query() ) {
            $results = $item;
          }
          else {
            module.verbose('Searching for matching values', searchTerm);
            $item
              .each(function(){
                var
                  $choice = $(this),
                  text,
                  value
                ;
                if(settings.match == 'both' || settings.match == 'text') {
                  text = String(module.get.choiceText($choice, false));
                  if(text.search(beginsWithRegExp) !== -1) {
                    $results = $results.add($choice);
                    return true;
                  }
                  else if(settings.fullTextSearch && module.fuzzySearch(searchTerm, text)) {
                    $results = $results.add($choice);
                    return true;
                  }
                }
                if(settings.match == 'both' || settings.match == 'value') {
                  value = String(module.get.choiceValue($choice, text));

                  if(value.search(beginsWithRegExp) !== -1) {
                    $results = $results.add($choice);
                    return true;
                  }
                  else if(settings.fullTextSearch && module.fuzzySearch(searchTerm, value)) {
                    $results = $results.add($choice);
                    return true;
                  }
                }
              })
            ;
          }
          module.debug('Showing only matched items', searchTerm);
          module.remove.filteredItem();
          $item
            .not($results)
            .addClass(className.filtered)
          ;
        },

        fuzzySearch: function(query, term) {
          var
            termLength  = term.length,
            queryLength = query.length
          ;
          query = query.toLowerCase();
          term  = term.toLowerCase();
          if(queryLength > termLength) {
            return false;
          }
          if(queryLength === termLength) {
            return (query === term);
          }
          search: for (var characterIndex = 0, nextCharacterIndex = 0; characterIndex < queryLength; characterIndex++) {
            var
              queryCharacter = query.charCodeAt(characterIndex)
            ;
            while(nextCharacterIndex < termLength) {
              if(term.charCodeAt(nextCharacterIndex++) === queryCharacter) {
                continue search;
              }
            }
            return false;
          }
          return true;
        },

        filterActive: function() {
          if(settings.useLabels) {
            $item.filter('.' + className.active)
              .addClass(className.filtered)
            ;
          }
        },

        focusSearch: function() {
          if( module.is.search() && !module.is.focusedOnSearch() ) {
            $search[0].focus();
          }
        },

        forceSelection: function() {
          var
            $currentlySelected = $item.not(className.filtered).filter('.' + className.selected).eq(0),
            $activeItem        = $item.not(className.filtered).filter('.' + className.active).eq(0),
            $selectedItem      = ($currentlySelected.length > 0)
              ? $currentlySelected
              : $activeItem,
            hasSelected = ($selectedItem.size() > 0)
          ;
          if( hasSelected && module.has.query() ) {
            module.debug('Forcing partial selection to selected item', $selectedItem);
            module.event.item.click.call($selectedItem);
          }
          else {
            module.hide();
          }
        },

        event: {
          change: function() {
            if(!internalChange) {
              module.debug('Input changed, updating selection');
              module.set.selected();
            }
          },
          focus: function() {
            if(settings.showOnFocus && !activated && module.is.hidden() && !pageLostFocus) {
              module.show();
            }
          },
          click: function(event) {
            var
              $target = $(event.target)
            ;
            // focus search
            if($target.is($module) && !module.is.focusedOnSearch()) {
              module.focusSearch();
            }
          },
          blur: function(event) {
            pageLostFocus = (document.activeElement === this);
            if(!activated && !pageLostFocus) {
              module.remove.activeLabel();
              module.hide();
            }
          },
          // prevents focus callback from occurring on mousedown
          mousedown: function() {
            activated = true;
          },
          mouseup: function() {
            activated = false;
          },
          search: {
            focus: function() {
              activated = true;
              if(module.is.multiple()) {
                module.remove.activeLabel();
              }
              if(settings.showOnFocus) {
                module.show();
              }
            },
            blur: function(event) {
              pageLostFocus = (document.activeElement === this);
              if(!itemActivated && !pageLostFocus) {
                if(module.is.multiple()) {
                  module.remove.activeLabel();
                  module.hide();
                }
                else if(settings.forceSelection) {
                  module.forceSelection();
                }
                else {
                  module.hide();
                }
              }
              else if(pageLostFocus) {
                if(settings.forceSelection) {
                  module.forceSelection();
                }
              }
            }
          },
          icon: {
            click: function(event) {
              module.toggle();
              event.stopPropagation();
            }
          },
          text: {
            focus: function(event) {
              activated = true;
              module.focusSearch();
            }
          },
          input: function(event) {
            if(module.is.multiple() || module.is.searchSelection()) {
              module.set.filtered();
            }
            clearTimeout(module.timer);
            module.timer = setTimeout(module.search, settings.delay.search);
          },
          label: {
            click: function(event) {
              var
                $label        = $(this),
                $labels       = $module.find(selector.label),
                $activeLabels = $labels.filter('.' + className.active),
                $nextActive   = $label.nextAll('.' + className.active),
                $prevActive   = $label.prevAll('.' + className.active),
                $range = ($nextActive.length > 0)
                  ? $label.nextUntil($nextActive).add($activeLabels).add($label)
                  : $label.prevUntil($prevActive).add($activeLabels).add($label)
              ;
              if(event.shiftKey) {
                $activeLabels.removeClass(className.active);
                $range.addClass(className.active);
              }
              else if(event.ctrlKey) {
                $label.toggleClass(className.active);
              }
              else {
                $activeLabels.removeClass(className.active);
                $label.addClass(className.active);
              }
              settings.onLabelSelect.apply(this, $labels.filter('.' + className.active));
            }
          },
          remove: {
            click: function() {
              var
                $label = $(this).parent()
              ;
              if( $label.hasClass(className.active) ) {
                // remove all selected labels
                module.remove.activeLabels();
              }
              else {
                // remove this label only
                module.remove.activeLabels( $label );
              }
            }
          },
          test: {
            toggle: function(event) {
              var
                toggleBehavior = (module.is.multiple())
                  ? module.show
                  : module.toggle
              ;
              if( module.determine.eventOnElement(event, toggleBehavior) ) {
                event.preventDefault();
              }
            },
            touch: function(event) {
              module.determine.eventOnElement(event, function() {
                if(event.type == 'touchstart') {
                  module.timer = setTimeout(function() {
                    module.hide();
                  }, settings.delay.touch);
                }
                else if(event.type == 'touchmove') {
                  clearTimeout(module.timer);
                }
              });
              event.stopPropagation();
            },
            hide: function(event) {
              module.determine.eventInModule(event, module.hide);
            }
          },
          menu: {
            mousedown: function() {
              itemActivated = true;
            },
            mouseup: function() {
              itemActivated = false;
            }
          },
          item: {
            mouseenter: function(event) {
              var
                $subMenu    = $(this).children(selector.menu),
                $otherMenus = $(this).siblings(selector.item).children(selector.menu)
              ;
              if( $subMenu.length > 0 ) {
                clearTimeout(module.itemTimer);
                module.itemTimer = setTimeout(function() {
                  module.verbose('Showing sub-menu', $subMenu);
                  $.each($otherMenus, function() {
                    module.animate.hide(false, $(this));
                  });
                  module.animate.show(false,  $subMenu);
                }, settings.delay.show);
                event.preventDefault();
              }
            },
            mouseleave: function(event) {
              var
                $subMenu = $(this).children(selector.menu)
              ;
              if($subMenu.length > 0) {
                clearTimeout(module.itemTimer);
                module.itemTimer = setTimeout(function() {
                  module.verbose('Hiding sub-menu', $subMenu);
                  module.animate.hide(false,  $subMenu);
                }, settings.delay.hide);
              }
            },
            touchend: function() {
            },
            click: function (event) {
              var
                $choice        = $(this),
                $target        = (event)
                  ? $(event.target)
                  : $(''),
                $subMenu       = $choice.find(selector.menu),
                text           = module.get.choiceText($choice),
                value          = module.get.choiceValue($choice, text),
                hasSubMenu     = ($subMenu.length > 0),
                isBubbledEvent = ($subMenu.find($target).length > 0)
              ;
              if(!isBubbledEvent && (!hasSubMenu || settings.allowCategorySelection)) {
                if(!settings.useLabels) {
                  module.remove.filteredItem();
                  module.remove.searchTerm();
                  module.set.scrollPosition($choice);
                }
                module.determine.selectAction.call(this, text, value);
              }
            }
          },

          document: {
            // label selection should occur even when element has no focus
            keydown: function(event) {
              var
                pressedKey    = event.which,
                keys          = module.get.shortcutKeys(),
                isShortcutKey = module.is.inObject(pressedKey, keys)
              ;
              if(isShortcutKey) {
                var
                  $label            = $module.find(selector.label),
                  $activeLabel      = $label.filter('.' + className.active),
                  activeValue       = $activeLabel.data(metadata.value),
                  labelIndex        = $label.index($activeLabel),
                  labelCount        = $label.length,
                  hasActiveLabel    = ($activeLabel.length > 0),
                  hasMultipleActive = ($activeLabel.length > 1),
                  isFirstLabel      = (labelIndex === 0),
                  isLastLabel       = (labelIndex + 1 == labelCount),
                  isSearch          = module.is.searchSelection(),
                  isFocusedOnSearch = module.is.focusedOnSearch(),
                  isFocused         = module.is.focused(),
                  caretAtStart      = (isFocusedOnSearch && module.get.caretPosition() === 0),
                  $nextLabel
                ;
                if(isSearch && !hasActiveLabel && !isFocusedOnSearch) {
                  return;
                }

                if(pressedKey == keys.leftArrow) {
                  // activate previous label
                  if((isFocused || caretAtStart) && !hasActiveLabel) {
                    module.verbose('Selecting previous label');
                    $label.last().addClass(className.active);
                  }
                  else if(hasActiveLabel) {
                    if(!event.shiftKey) {
                      module.verbose('Selecting previous label');
                      $label.removeClass(className.active);
                    }
                    else {
                      module.verbose('Adding previous label to selection');
                    }
                    if(isFirstLabel && !hasMultipleActive) {
                      $activeLabel.addClass(className.active);
                    }
                    else {
                      $activeLabel.prev(selector.siblingLabel)
                        .addClass(className.active)
                        .end()
                      ;
                    }
                    event.preventDefault();
                  }
                }
                else if(pressedKey == keys.rightArrow) {
                  // activate first label
                  if(isFocused && !hasActiveLabel) {
                    $label.first().addClass(className.active);
                  }
                  // activate next label
                  if(hasActiveLabel) {
                    if(!event.shiftKey) {
                      module.verbose('Selecting next label');
                      $label.removeClass(className.active);
                    }
                    else {
                      module.verbose('Adding next label to selection');
                    }
                    if(isLastLabel) {
                      if(isSearch) {
                        if(!isFocusedOnSearch) {
                          module.focusSearch();
                        }
                        else {
                          $label.removeClass(className.active);
                        }
                      }
                      else if(hasMultipleActive) {
                        $activeLabel.next(selector.siblingLabel).addClass(className.active);
                      }
                      else {
                        $activeLabel.addClass(className.active);
                      }
                    }
                    else {
                      $activeLabel.next(selector.siblingLabel).addClass(className.active);
                    }
                    event.preventDefault();
                  }
                }
                else if(pressedKey == keys.deleteKey || pressedKey == keys.backspace) {
                  if(hasActiveLabel) {
                    module.verbose('Removing active labels');
                    if(isLastLabel) {
                      if(isSearch && !isFocusedOnSearch) {
                        module.focusSearch();
                      }
                    }
                    $activeLabel.last().next(selector.siblingLabel).addClass(className.active);
                    module.remove.activeLabels($activeLabel);
                    event.preventDefault();
                  }
                  else if(caretAtStart && !hasActiveLabel && pressedKey == keys.backspace) {
                    module.verbose('Removing last label on input backspace');
                    $activeLabel = $label.last().addClass(className.active);
                    module.remove.activeLabels($activeLabel);
                  }
                }
                else {
                  $activeLabel.removeClass(className.active);
                }
              }
            }
          },

          keydown: function(event) {
            var
              pressedKey    = event.which,
              keys          = module.get.shortcutKeys(),
              isShortcutKey = module.is.inObject(pressedKey, keys)
            ;
            if(isShortcutKey) {
              var
                $currentlySelected = $item.not(selector.unselectable).filter('.' + className.selected).eq(0),
                $activeItem        = $menu.children('.' + className.active).eq(0),
                $selectedItem      = ($currentlySelected.length > 0)
                  ? $currentlySelected
                  : $activeItem,
                $visibleItems = ($selectedItem.length > 0)
                  ? $selectedItem.siblings(':not(.' + className.filtered +')').andSelf()
                  : $menu.children(':not(.' + className.filtered +')'),
                $subMenu             = $selectedItem.children(selector.menu),
                $parentMenu          = $selectedItem.closest(selector.menu),
                inVisibleMenu        = ($parentMenu.hasClass(className.visible) || $parentMenu.hasClass(className.animating) || $parentMenu.parent(selector.menu).length > 0),
                hasSubMenu           = ($subMenu.length> 0),
                hasSelectedItem      = ($selectedItem.length > 0),
                selectedIsSelectable = ($selectedItem.not(selector.unselectable).length > 0),
                delimiterPressed     = (pressedKey == keys.delimiter && settings.allowAdditions && module.is.multiple()),
                $nextItem,
                isSubMenuItem,
                newIndex
              ;

              // visible menu keyboard shortcuts
              if( module.is.visible() ) {

                // enter (select or open sub-menu)
                if(pressedKey == keys.enter || delimiterPressed) {
                  if(pressedKey == keys.enter && hasSelectedItem && hasSubMenu && !settings.allowCategorySelection) {
                    module.verbose('Pressed enter on unselectable category, opening sub menu');
                    pressedKey = keys.rightArrow;
                  }
                  else if(selectedIsSelectable) {
                    module.verbose('Selecting item from keyboard shortcut', $selectedItem);
                    module.event.item.click.call($selectedItem, event);
                    if(module.is.searchSelection()) {
                      module.remove.searchTerm();
                    }
                  }
                  event.preventDefault();
                }

                // left arrow (hide sub-menu)
                if(pressedKey == keys.leftArrow) {

                  isSubMenuItem = ($parentMenu[0] !== $menu[0]);

                  if(isSubMenuItem) {
                    module.verbose('Left key pressed, closing sub-menu');
                    module.animate.hide(false,  $parentMenu);
                    $selectedItem
                      .removeClass(className.selected)
                    ;
                    $parentMenu
                      .closest(selector.item)
                        .addClass(className.selected)
                    ;
                    event.preventDefault();
                  }
                }

                // right arrow (show sub-menu)
                if(pressedKey == keys.rightArrow) {
                  if(hasSubMenu) {
                    module.verbose('Right key pressed, opening sub-menu');
                    module.animate.show(false,  $subMenu);
                    $selectedItem
                      .removeClass(className.selected)
                    ;
                    $subMenu
                      .find(selector.item).eq(0)
                        .addClass(className.selected)
                    ;
                    event.preventDefault();
                  }
                }

                // up arrow (traverse menu up)
                if(pressedKey == keys.upArrow) {
                  $nextItem = (hasSelectedItem && inVisibleMenu)
                    ? $selectedItem.prevAll(selector.item + ':not(' + selector.unselectable + ')').eq(0)
                    : $item.eq(0)
                  ;
                  if($visibleItems.index( $nextItem ) < 0) {
                    module.verbose('Up key pressed but reached top of current menu');
                    event.preventDefault();
                    return;
                  }
                  else {
                    module.verbose('Up key pressed, changing active item');
                    $selectedItem
                      .removeClass(className.selected)
                    ;
                    $nextItem
                      .addClass(className.selected)
                    ;
                    module.set.scrollPosition($nextItem);
                  }
                  event.preventDefault();
                }

                // down arrow (traverse menu down)
                if(pressedKey == keys.downArrow) {
                  $nextItem = (hasSelectedItem && inVisibleMenu)
                    ? $nextItem = $selectedItem.nextAll(selector.item + ':not(' + selector.unselectable + ')').eq(0)
                    : $item.eq(0)
                  ;
                  if($nextItem.length === 0) {
                    module.verbose('Down key pressed but reached bottom of current menu');
                    event.preventDefault();
                    return;
                  }
                  else {
                    module.verbose('Down key pressed, changing active item');
                    $item
                      .removeClass(className.selected)
                    ;
                    $nextItem
                      .addClass(className.selected)
                    ;
                    module.set.scrollPosition($nextItem);
                  }
                  event.preventDefault();
                }

                // page down (show next page)
                if(pressedKey == keys.pageUp) {
                  module.scrollPage('up');
                  event.preventDefault();
                }
                if(pressedKey == keys.pageDown) {
                  module.scrollPage('down');
                  event.preventDefault();
                }

                // escape (close menu)
                if(pressedKey == keys.escape) {
                  module.verbose('Escape key pressed, closing dropdown');
                  module.hide();
                }

              }
              else {
                // delimiter key
                if(delimiterPressed) {
                  event.preventDefault();
                }
                // down arrow (open menu)
                if(pressedKey == keys.downArrow) {
                  module.verbose('Down key pressed, showing dropdown');
                  module.show();
                  event.preventDefault();
                }
              }
            }
            else {
              if( module.is.selection() && !module.is.search() ) {
                module.set.selectedLetter( String.fromCharCode(pressedKey) );
              }
            }
          }
        },

        determine: {
          selectAction: function(text, value) {
            module.verbose('Determining action', settings.action);
            if( $.isFunction( module.action[settings.action] ) ) {
              module.verbose('Triggering preset action', settings.action, text, value);
              module.action[ settings.action ].call(this, text, value);
            }
            else if( $.isFunction(settings.action) ) {
              module.verbose('Triggering user action', settings.action, text, value);
              settings.action.call(this, text, value);
            }
            else {
              module.error(error.action, settings.action);
            }
          },
          eventInModule: function(event, callback) {
            var
              $target    = $(event.target),
              inDocument = ($target.closest(document.documentElement).length > 0),
              inModule   = ($target.closest($module).length > 0)
            ;
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if(inDocument && !inModule) {
              module.verbose('Triggering event', callback);
              callback();
              return true;
            }
            else {
              module.verbose('Event occurred in dropdown, canceling callback');
              return false;
            }
          },
          eventOnElement: function(event, callback) {
            var
              $target    = $(event.target),
              $label     = $target.closest(selector.siblingLabel),
              notOnLabel = ($module.find($label).length === 0),
              notInMenu  = ($target.closest($menu).length === 0)
            ;
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if(notOnLabel && notInMenu) {
              module.verbose('Triggering event', callback);
              callback();
              return true;
            }
            else {
              module.verbose('Event occurred in dropdown menu, canceling callback');
              return false;
            }
          }
        },

        action: {

          nothing: function() {},

          activate: function(text, value) {
            value = (value !== undefined)
              ? value
              : text
            ;
            if( module.can.activate( $(this) ) ) {
              module.set.selected(value, $(this));
              if(module.is.multiple() && !module.is.allFiltered()) {
                return;
              }
              else {
                module.hideAndClear();
              }
            }
          },

          select: function(text, value) {
            // mimics action.activate but does not select text
            module.action.activate.call(this);
          },

          combo: function(text, value) {
            value = (value !== undefined)
              ? value
              : text
            ;
            module.set.selected(value, $(this));
            module.hideAndClear();
          },

          hide: function(text, value) {
            module.set.value(value);
            module.hideAndClear();
          }

        },

        get: {
          id: function() {
            return id;
          },
          defaultText: function() {
            return $module.data(metadata.defaultText);
          },
          defaultValue: function() {
            return $module.data(metadata.defaultValue);
          },
          placeholderText: function() {
            return $module.data(metadata.placeholderText) || '';
          },
          text: function() {
            return $text.text();
          },
          query: function() {
            return $.trim($search.val());
          },
          searchWidth: function(characterCount) {
            return (characterCount * settings.glyphWidth) + 'em';
          },
          selectionCount: function() {
            var
              values = module.get.values(),
              count
            ;
            count = ( module.is.multiple() )
              ? $.isArray(values)
                ? values.length
                : 0
              : (module.get.value() !== '')
                ? 1
                : 0
            ;
            return count;
          },
          transition: function($subMenu) {
            return (settings.transition == 'auto')
              ? module.is.upward($subMenu)
                ? 'slide up'
                : 'slide down'
              : settings.transition
            ;
          },
          userValues: function() {
            var
              values = module.get.values()
            ;
            if(!values) {
              return false;
            }
            values = $.isArray(values)
              ? values
              : [values]
            ;
            return $.grep(values, function(value) {
              return (module.get.item(value) === false);
            });
          },
          uniqueArray: function(array) {
            return $.grep(array, function (value, index) {
                return $.inArray(value, array) === index;
            });
          },
          caretPosition: function() {
            var
              input = $search.get(0),
              range,
              rangeLength
            ;
            if('selectionStart' in input) {
              return input.selectionStart;
            }
            else if (document.selection) {
              input.focus();
              range       = document.selection.createRange();
              rangeLength = range.text.length;
              range.moveStart('character', -input.value.length);
              return range.text.length - rangeLength;
            }
          },
          shortcutKeys: function() {
            return {
              backspace  : 8,
              delimiter  : 188, // comma
              deleteKey  : 46,
              enter      : 13,
              escape     : 27,
              pageUp     : 33,
              pageDown   : 34,
              leftArrow  : 37,
              upArrow    : 38,
              rightArrow : 39,
              downArrow  : 40
            };
          },
          value: function() {
            var
              value = ($input.length > 0)
                ? $input.val()
                : $module.data(metadata.value)
            ;
            // prevents placeholder element from being selected when multiple
            if($.isArray(value) && value.length === 1 && value[0] === '') {
              return '';
            }
            return value;
          },
          values: function() {
            var
              value = module.get.value()
            ;
            if(value === '') {
              return '';
            }
            return ( !module.has.selectInput() && module.is.multiple() )
              ? (typeof value == 'string') // delimited string
                ? value.split(settings.delimiter)
                : ''
              : value
            ;
          },
          remoteValues: function() {
            var
              values = module.get.values(),
              remoteValues = false
            ;
            if(values) {
              if(typeof values == 'string') {
                values = [values];
              }
              remoteValues = {};
              $.each(values, function(index, value) {
                var
                  name = module.read.remoteData(value)
                ;
                module.verbose('Restoring value from session data', name, value);
                remoteValues[value] = (name)
                  ? name
                  : value
                ;
              });
            }
            return remoteValues;
          },
          choiceText: function($choice, preserveHTML) {
            preserveHTML = (preserveHTML !== undefined)
              ? preserveHTML
              : settings.preserveHTML
            ;
            if($choice) {
              if($choice.find(selector.menu).length > 0) {
                module.verbose('Retreiving text of element with sub-menu');
                $choice = $choice.clone();
                $choice.find(selector.menu).remove();
                $choice.find(selector.menuIcon).remove();
              }
              return ($choice.data(metadata.text) !== undefined)
                ? $choice.data(metadata.text)
                : (preserveHTML)
                  ? $.trim($choice.html())
                  : $.trim($choice.text())
              ;
            }
          },
          choiceValue: function($choice, choiceText) {
            choiceText = choiceText || module.get.choiceText($choice);
            if(!$choice) {
              return false;
            }
            return ($choice.data(metadata.value) !== undefined)
              ? String( $choice.data(metadata.value) )
              : (typeof choiceText === 'string')
                ? $.trim(choiceText.toLowerCase())
                : String(choiceText)
            ;
          },
          inputEvent: function() {
            var
              input = $search[0]
            ;
            if(input) {
              return (input.oninput !== undefined)
                ? 'input'
                : (input.onpropertychange !== undefined)
                  ? 'propertychange'
                  : 'keyup'
              ;
            }
            return false;
          },
          selectValues: function() {
            var
              select = {}
            ;
            select.values = [];
            $module
              .find('option')
                .each(function() {
                  var
                    $option  = $(this),
                    name     = $option.html(),
                    disabled = $option.attr('disabled'),
                    value    = ( $option.attr('value') !== undefined )
                      ? $option.attr('value')
                      : name
                  ;
                  if(settings.placeholder === 'auto' && value === '') {
                    select.placeholder = name;
                  }
                  else {
                    select.values.push({
                      name     : name,
                      value    : value,
                      disabled : disabled
                    });
                  }
                })
            ;
            if(settings.placeholder && settings.placeholder !== 'auto') {
              module.debug('Setting placeholder value to', settings.placeholder);
              select.placeholder = settings.placeholder;
            }
            if(settings.sortSelect) {
              select.values.sort(function(a, b) {
                return (a.name > b.name)
                  ? 1
                  : -1
                ;
              });
              module.debug('Retrieved and sorted values from select', select);
            }
            else {
              module.debug('Retreived values from select', select);
            }
            return select;
          },
          activeItem: function() {
            return $item.filter('.'  + className.active);
          },
          selectedItem: function() {
            var
              $selectedItem = $item.not(selector.unselectable).filter('.'  + className.selected)
            ;
            return ($selectedItem.length > 0)
              ? $selectedItem
              : $item.eq(0)
            ;
          },
          itemWithAdditions: function(value) {
            var
              $items       = module.get.item(value),
              $userItems   = module.create.userChoice(value),
              hasUserItems = ($userItems && $userItems.length > 0)
            ;
            if(hasUserItems) {
              $items = ($items.length > 0)
                ? $items.add($userItems)
                : $userItems
              ;
            }
            return $items;
          },
          item: function(value, strict) {
            var
              $selectedItem = false,
              shouldSearch,
              isMultiple
            ;
            value = (value !== undefined)
              ? value
              : ( module.get.values() !== undefined)
                ? module.get.values()
                : module.get.text()
            ;
            shouldSearch = (isMultiple)
              ? (value.length > 0)
              : (value !== undefined && value !== null)
            ;
            isMultiple = (module.is.multiple() && $.isArray(value));
            strict     = (value === '' || value === 0)
              ? true
              : strict || false
            ;
            if(shouldSearch) {
              $item
                .each(function() {
                  var
                    $choice       = $(this),
                    optionText    = module.get.choiceText($choice),
                    optionValue   = module.get.choiceValue($choice, optionText)
                  ;
                  // safe early exit
                  if(optionValue === null || optionValue === undefined) {
                    return;
                  }
                  if(isMultiple) {
                    if($.inArray( String(optionValue), value) !== -1 || $.inArray(optionText, value) !== -1) {
                      $selectedItem = ($selectedItem)
                        ? $selectedItem.add($choice)
                        : $choice
                      ;
                    }
                  }
                  else if(strict) {
                    module.verbose('Ambiguous dropdown value using strict type check', $choice, value);
                    if( optionValue === value || optionText === value) {
                      $selectedItem = $choice;
                      return true;
                    }
                  }
                  else {
                    if( String(optionValue) == String(value) || optionText == value) {
                      module.verbose('Found select item by value', optionValue, value);
                      $selectedItem = $choice;
                      return true;
                    }
                  }
                })
              ;
            }
            return $selectedItem;
          }
        },

        check: {
          maxSelections: function(selectionCount) {
            if(settings.maxSelections) {
              selectionCount = (selectionCount !== undefined)
                ? selectionCount
                : module.get.selectionCount()
              ;
              if(selectionCount >= settings.maxSelections) {
                module.debug('Maximum selection count reached');
                if(settings.useLabels) {
                  $item.addClass(className.filtered);
                  module.add.message(message.maxSelections);
                }
                return true;
              }
              else {
                module.verbose('No longer at maximum selection count');
                module.remove.message();
                module.remove.filteredItem();
                if(module.is.searchSelection()) {
                  module.filterItems();
                }
                return false;
              }
            }
            return true;
          }
        },

        restore: {
          defaults: function() {
            module.clear();
            module.restore.defaultText();
            module.restore.defaultValue();
          },
          defaultText: function() {
            var
              defaultText     = module.get.defaultText(),
              placeholderText = module.get.placeholderText
            ;
            if(defaultText === placeholderText) {
              module.debug('Restoring default placeholder text', defaultText);
              module.set.placeholderText(defaultText);
            }
            else {
              module.debug('Restoring default text', defaultText);
              module.set.text(defaultText);
            }
          },
          defaultValue: function() {
            var
              defaultValue = module.get.defaultValue()
            ;
            if(defaultValue !== undefined) {
              module.debug('Restoring default value', defaultValue);
              if(defaultValue !== '') {
                module.set.value(defaultValue);
                module.set.selected();
              }
              else {
                module.remove.activeItem();
                module.remove.selectedItem();
              }
            }
          },
          labels: function() {
            if(settings.allowAdditions) {
              if(!settings.useLabels) {
                module.error(error.labels);
                settings.useLabels = true;
              }
              module.debug('Restoring selected values');
              module.create.userLabels();
            }
            module.check.maxSelections();
          },
          selected: function() {
            module.restore.values();
            if(module.is.multiple()) {
              module.debug('Restoring previously selected values and labels');
              module.restore.labels();
            }
            else {
              module.debug('Restoring previously selected values');
            }
          },
          values: function() {
            // prevents callbacks from occuring on initial load
            module.set.initialLoad();
            if(settings.apiSettings) {
              if(settings.saveRemoteData) {
                module.restore.remoteValues();
              }
              else {
                module.clearValue();
              }
            }
            else {
              module.set.selected();
            }
            module.remove.initialLoad();
          },
          remoteValues: function() {
            var
              values = module.get.remoteValues()
            ;
            module.debug('Recreating selected from session data', values);
            if(values) {
              if( module.is.single() ) {
                $.each(values, function(value, name) {
                  module.set.text(name);
                });
              }
              else {
                $.each(values, function(value, name) {
                  module.add.label(value, name);
                });
              }
            }
          }
        },

        read: {
          remoteData: function(value) {
            var
              name
            ;
            if(window.Storage === undefined) {
              module.error(error.noStorage);
              return;
            }
            name = sessionStorage.getItem(value);
            return (name !== undefined)
              ? name
              : false
            ;
          }
        },

        save: {
          defaults: function() {
            module.save.defaultText();
            module.save.placeholderText();
            module.save.defaultValue();
          },
          defaultValue: function() {
            var
              value = module.get.value()
            ;
            module.verbose('Saving default value as', value);
            $module.data(metadata.defaultValue, value);
          },
          defaultText: function() {
            var
              text = module.get.text()
            ;
            module.verbose('Saving default text as', text);
            $module.data(metadata.defaultText, text);
          },
          placeholderText: function() {
            var
              text
            ;
            if(settings.placeholder !== false && $text.hasClass(className.placeholder)) {
              text = module.get.text();
              module.verbose('Saving placeholder text as', text);
              $module.data(metadata.placeholderText, text);
            }
          },
          remoteData: function(name, value) {
            if(window.Storage === undefined) {
              module.error(error.noStorage);
              return;
            }
            module.verbose('Saving remote data to session storage', value, name);
            sessionStorage.setItem(value, name);
          }
        },

        clear: function() {
          if(module.is.multiple()) {
            module.remove.labels();
          }
          else {
            module.remove.activeItem();
            module.remove.selectedItem();
          }
          module.set.placeholderText();
          module.clearValue();
        },

        clearValue: function() {
          module.set.value('');
        },

        scrollPage: function(direction, $selectedItem) {
          var
            $currentItem  = $selectedItem || module.get.selectedItem(),
            $menu         = $currentItem.closest(selector.menu),
            menuHeight    = $menu.outerHeight(),
            currentScroll = $menu.scrollTop(),
            itemHeight    = $item.eq(0).outerHeight(),
            itemsPerPage  = Math.floor(menuHeight / itemHeight),
            maxScroll     = $menu.prop('scrollHeight'),
            newScroll     = (direction == 'up')
              ? currentScroll - (itemHeight * itemsPerPage)
              : currentScroll + (itemHeight * itemsPerPage),
            $selectableItem = $item.not(selector.unselectable),
            isWithinRange,
            $nextSelectedItem,
            elementIndex
          ;
          elementIndex      = (direction == 'up')
            ? $selectableItem.index($currentItem) - itemsPerPage
            : $selectableItem.index($currentItem) + itemsPerPage
          ;
          isWithinRange = (direction == 'up')
            ? (elementIndex >= 0)
            : (elementIndex < $selectableItem.length)
          ;
          $nextSelectedItem = (isWithinRange)
            ? $selectableItem.eq(elementIndex)
            : (direction == 'up')
              ? $selectableItem.first()
              : $selectableItem.last()
          ;
          if($nextSelectedItem.length > 0) {
            module.debug('Scrolling page', direction, $nextSelectedItem);
            $currentItem
              .removeClass(className.selected)
            ;
            $nextSelectedItem
              .addClass(className.selected)
            ;
            $menu
              .scrollTop(newScroll)
            ;
          }
        },

        set: {
          filtered: function() {
            var
              isMultiple       = module.is.multiple(),
              isSearch         = module.is.searchSelection(),
              isSearchMultiple = (isMultiple && isSearch),
              searchValue      = (isSearch)
                ? module.get.query()
                : '',
              hasSearchValue   = (typeof searchValue === 'string' && searchValue.length > 0),
              searchWidth      = module.get.searchWidth(searchValue.length),
              valueIsSet       = searchValue !== ''
            ;
            if(isMultiple && hasSearchValue) {
              module.verbose('Adjusting input width', searchWidth, settings.glyphWidth);
              $search.css('width', searchWidth);
            }
            if(hasSearchValue || (isSearchMultiple && valueIsSet)) {
              module.verbose('Hiding placeholder text');
              $text.addClass(className.filtered);
            }
            else if(!isMultiple || (isSearchMultiple && !valueIsSet)) {
              module.verbose('Showing placeholder text');
              $text.removeClass(className.filtered);
            }
          },
          loading: function() {
            $module.addClass(className.loading);
          },
          placeholderText: function(text) {
            text = text || module.get.placeholderText();
            module.debug('Setting placeholder text', text);
            module.set.text(text);
            $text.addClass(className.placeholder);
          },
          tabbable: function() {
            if( module.has.search() ) {
              module.debug('Added tabindex to searchable dropdown');
              $search
                .val('')
                .attr('tabindex', 0)
              ;
              $menu
                .attr('tabindex', -1)
              ;
            }
            else {
              module.debug('Added tabindex to dropdown');
              if(!$module.attr('tabindex') ) {
                $module
                  .attr('tabindex', 0)
                ;
                $menu
                  .attr('tabindex', -1)
                ;
              }
            }
          },
          initialLoad: function() {
            module.verbose('Setting initial load');
            initialLoad = true;
          },
          activeItem: function($item) {
            if( settings.allowAdditions && $item.filter(selector.addition).length > 0 ) {
              $item.addClass(className.filtered);
            }
            else {
              $item.addClass(className.active);
            }
          },
          scrollPosition: function($item, forceScroll) {
            var
              edgeTolerance = 5,
              $menu,
              hasActive,
              offset,
              itemHeight,
              itemOffset,
              menuOffset,
              menuScroll,
              menuHeight,
              abovePage,
              belowPage
            ;

            $item       = $item || module.get.selectedItem();
            $menu       = $item.closest(selector.menu);
            hasActive   = ($item && $item.length > 0);
            forceScroll = (forceScroll !== undefined)
              ? forceScroll
              : false
            ;
            if($item && $menu.length > 0 && hasActive) {
              itemOffset = $item.position().top;

              $menu.addClass(className.loading);
              menuScroll = $menu.scrollTop();
              menuOffset = $menu.offset().top;
              itemOffset = $item.offset().top;
              offset     = menuScroll - menuOffset + itemOffset;
              if(!forceScroll) {
                menuHeight = $menu.height();
                belowPage  = menuScroll + menuHeight < (offset + edgeTolerance);
                abovePage  = ((offset - edgeTolerance) < menuScroll);
              }
              module.debug('Scrolling to active item', offset);
              if(forceScroll || abovePage || belowPage) {
                $menu.scrollTop(offset);
              }
              $menu.removeClass(className.loading);
            }
          },
          text: function(text) {
            if(settings.action !== 'select') {
              if(settings.action == 'combo') {
                module.debug('Changing combo button text', text, $combo);
                if(settings.preserveHTML) {
                  $combo.html(text);
                }
                else {
                  $combo.text(text);
                }
              }
              else {
                if(text !== module.get.placeholderText()) {
                  $text.removeClass(className.placeholder);
                }
                module.debug('Changing text', text, $text);
                $text
                  .removeClass(className.filtered)
                ;
                if(settings.preserveHTML) {
                  $text.html(text);
                }
                else {
                  $text.text(text);
                }
              }
            }
          },
          selectedLetter: function(letter) {
            var
              $selectedItem         = $item.filter('.' + className.selected),
              alreadySelectedLetter = $selectedItem.length > 0 && module.has.firstLetter($selectedItem, letter),
              $nextValue            = false,
              $nextItem
            ;
            // check next of same letter
            if(alreadySelectedLetter) {
              $nextItem = $selectedItem.nextAll($item).eq(0);
              if( module.has.firstLetter($nextItem, letter) ) {
                $nextValue  = $nextItem;
              }
            }
            // check all values
            if(!$nextValue) {
              $item
                .each(function(){
                  if(module.has.firstLetter($(this), letter)) {
                    $nextValue = $(this);
                    return false;
                  }
                })
              ;
            }
            // set next value
            if($nextValue) {
              module.verbose('Scrolling to next value with letter', letter);
              module.set.scrollPosition($nextValue);
              $selectedItem.removeClass(className.selected);
              $nextValue.addClass(className.selected);
            }
          },
          direction: function($menu) {
            if(settings.direction == 'auto') {
              if(module.is.onScreen($menu)) {
                module.remove.upward($menu);
              }
              else {
                module.set.upward($menu);
              }
            }
            else if(settings.direction == 'upward') {
              module.set.upward($menu);
            }
          },
          upward: function($menu) {
            var $element = $menu || $module;
            $element.addClass(className.upward);
          },
          value: function(value, text, $selected) {
            var
              hasInput     = ($input.length > 0),
              isAddition   = !module.has.value(value),
              currentValue = module.get.values(),
              stringValue  = (value !== undefined)
                ? String(value)
                : value,
              newValue
            ;
            if(hasInput) {
              if(stringValue == currentValue) {
                module.verbose('Skipping value update already same value', value, currentValue);
                if(!module.is.initialLoad()) {
                  return;
                }
              }

              if( module.is.single() && module.has.selectInput() && module.can.extendSelect() ) {
                module.debug('Adding user option', value);
                module.add.optionValue(value);
              }
              module.debug('Updating input value', value, currentValue);
              internalChange = true;
              $input
                .val(value)
              ;
              if(settings.fireOnInit === false && module.is.initialLoad()) {
                module.debug('Input native change event ignored on initial load');
              }
              else {
                $input.trigger('change');
              }
              internalChange = false;
            }
            else {
              module.verbose('Storing value in metadata', value, $input);
              if(value !== currentValue) {
                $module.data(metadata.value, stringValue);
              }
            }
            if(settings.fireOnInit === false && module.is.initialLoad()) {
              module.verbose('No callback on initial load', settings.onChange);
            }
            else {
              settings.onChange.call(element, value, text, $selected);
            }
          },
          active: function() {
            $module
              .addClass(className.active)
            ;
          },
          multiple: function() {
            $module.addClass(className.multiple);
          },
          visible: function() {
            $module.addClass(className.visible);
          },
          exactly: function(value, $selectedItem) {
            module.debug('Setting selected to exact values');
            module.clear();
            module.set.selected(value, $selectedItem);
          },
          selected: function(value, $selectedItem) {
            var
              isMultiple = module.is.multiple(),
              $userSelectedItem
            ;
            $selectedItem = (settings.allowAdditions)
              ? $selectedItem || module.get.itemWithAdditions(value)
              : $selectedItem || module.get.item(value)
            ;
            if(!$selectedItem) {
              return;
            }
            module.debug('Setting selected menu item to', $selectedItem);
            if(module.is.single()) {
              module.remove.activeItem();
              module.remove.selectedItem();
            }
            else if(settings.useLabels) {
              module.remove.selectedItem();
            }
            // select each item
            $selectedItem
              .each(function() {
                var
                  $selected      = $(this),
                  selectedText   = module.get.choiceText($selected),
                  selectedValue  = module.get.choiceValue($selected, selectedText),

                  isFiltered     = $selected.hasClass(className.filtered),
                  isActive       = $selected.hasClass(className.active),
                  isUserValue    = $selected.hasClass(className.addition),
                  shouldAnimate  = (isMultiple && $selectedItem.length == 1)
                ;
                if(isMultiple) {
                  if(!isActive || isUserValue) {
                    if(settings.apiSettings && settings.saveRemoteData) {
                      module.save.remoteData(selectedText, selectedValue);
                    }
                    if(settings.useLabels) {
                      module.add.value(selectedValue, selectedText, $selected);
                      module.add.label(selectedValue, selectedText, shouldAnimate);
                      module.set.activeItem($selected);
                      module.filterActive();
                      module.select.nextAvailable($selectedItem);
                    }
                    else {
                      module.add.value(selectedValue, selectedText, $selected);
                      module.set.text(module.add.variables(message.count));
                      module.set.activeItem($selected);
                    }
                  }
                  else if(!isFiltered) {
                    module.debug('Selected active value, removing label');
                    module.remove.selected(selectedValue);
                  }
                }
                else {
                  if(settings.apiSettings && settings.saveRemoteData) {
                    module.save.remoteData(selectedText, selectedValue);
                  }
                  module.set.text(selectedText);
                  module.set.value(selectedValue, selectedText, $selected);
                  $selected
                    .addClass(className.active)
                    .addClass(className.selected)
                  ;
                }
              })
            ;
          }
        },

        add: {
          label: function(value, text, shouldAnimate) {
            var
              $next  = module.is.searchSelection()
                ? $search
                : $text,
              $label
            ;
            $label =  $('<a />')
              .addClass(className.label)
              .attr('data-value', value)
              .html(templates.label(value, text))
            ;
            $label = settings.onLabelCreate.call($label, value, text);

            if(module.has.label(value)) {
              module.debug('Label already exists, skipping', value);
              return;
            }
            if(settings.label.variation) {
              $label.addClass(settings.label.variation);
            }
            if(shouldAnimate === true) {
              module.debug('Animating in label', $label);
              $label
                .addClass(className.hidden)
                .insertBefore($next)
                .transition(settings.label.transition, settings.label.duration)
              ;
            }
            else {
              module.debug('Adding selection label', $label);
              $label
                .insertBefore($next)
              ;
            }
          },
          message: function(message) {
            var
              $message = $menu.children(selector.message),
              html     = settings.templates.message(module.add.variables(message))
            ;
            if($message.length > 0) {
              $message
                .html(html)
              ;
            }
            else {
              $message = $('<div/>')
                .html(html)
                .addClass(className.message)
                .appendTo($menu)
              ;
            }
          },
          optionValue: function(value) {
            var
              $option   = $input.find('option[value="' + value + '"]'),
              hasOption = ($option.length > 0)
            ;
            if(hasOption) {
              return;
            }
            // temporarily disconnect observer
            if(selectObserver) {
              selectObserver.disconnect();
              module.verbose('Temporarily disconnecting mutation observer', value);
            }
            if( module.is.single() ) {
              module.verbose('Removing previous user addition');
              $input.find('option.' + className.addition).remove();
            }
            $('<option/>')
              .prop('value', value)
              .addClass(className.addition)
              .html(value)
              .appendTo($input)
            ;
            module.verbose('Adding user addition as an <option>', value);
            if(selectObserver) {
              selectObserver.observe($input[0], {
                childList : true,
                subtree   : true
              });
            }
          },
          userSuggestion: function(value) {
            var
              $addition         = $menu.children(selector.addition),
              $existingItem     = module.get.item(value),
              alreadyHasValue   = $existingItem && $existingItem.not(selector.addition).length,
              hasUserSuggestion = $addition.length > 0,
              html
            ;
            if(settings.useLabels && module.has.maxSelections()) {
              return;
            }
            if(value === '' || alreadyHasValue) {
              $addition.remove();
              return;
            }
            $item
              .removeClass(className.selected)
            ;
            if(hasUserSuggestion) {
              html = settings.templates.addition( module.add.variables(message.addResult, value) );
              $addition
                .html(html)
                .attr('data-' + metadata.value, value)
                .attr('data-' + metadata.text, value)
                .removeClass(className.filtered)
                .addClass(className.selected)
              ;
              module.verbose('Replacing user suggestion with new value', $addition);
            }
            else {
              $addition = module.create.userChoice(value);
              $addition
                .prependTo($menu)
                .addClass(className.selected)
              ;
              module.verbose('Adding item choice to menu corresponding with user choice addition', $addition);
            }
          },
          variables: function(message, term) {
            var
              hasCount    = (message.search('{count}') !== -1),
              hasMaxCount = (message.search('{maxCount}') !== -1),
              hasTerm     = (message.search('{term}') !== -1),
              values,
              count,
              query
            ;
            module.verbose('Adding templated variables to message', message);
            if(hasCount) {
              count  = module.get.selectionCount();
              message = message.replace('{count}', count);
            }
            if(hasMaxCount) {
              count  = module.get.selectionCount();
              message = message.replace('{maxCount}', settings.maxSelections);
            }
            if(hasTerm) {
              query   = term || module.get.query();
              message = message.replace('{term}', query);
            }
            return message;
          },
          value: function(addedValue, addedText, $selectedItem) {
            var
              currentValue = module.get.values(),
              newValue
            ;
            if(addedValue === '') {
              module.debug('Cannot select blank values from multiselect');
              return;
            }
            // extend current array
            if($.isArray(currentValue)) {
              newValue = currentValue.concat([addedValue]);
              newValue = module.get.uniqueArray(newValue);
            }
            else {
              newValue = [addedValue];
            }
            // add values
            if( module.has.selectInput() ) {
              if(module.can.extendSelect()) {
                module.debug('Adding value to select', addedValue, newValue, $input);
                module.add.optionValue(addedValue);
              }
            }
            else {
              newValue = newValue.join(settings.delimiter);
              module.debug('Setting hidden input to delimited value', newValue, $input);
            }

            if(settings.fireOnInit === false && module.is.initialLoad()) {
              module.verbose('Skipping onadd callback on initial load', settings.onAdd);
            }
            else {
              settings.onAdd.call(element, addedValue, addedText, $selectedItem);
            }
            module.set.value(newValue, addedValue, addedText, $selectedItem);
            module.check.maxSelections();
          }
        },

        remove: {
          active: function() {
            $module.removeClass(className.active);
          },
          activeLabel: function() {
            $module.find(selector.label).removeClass(className.active);
          },
          loading: function() {
            $module.removeClass(className.loading);
          },
          initialLoad: function() {
            initialLoad = false;
          },
          upward: function($menu) {
            var $element = $menu || $module;
            $element.removeClass(className.upward);
          },
          visible: function() {
            $module.removeClass(className.visible);
          },
          activeItem: function() {
            $item.removeClass(className.active);
          },
          filteredItem: function() {
            if(settings.useLabels && module.has.maxSelections() ) {
              return;
            }
            if(settings.useLabels && module.is.multiple()) {
              $item.not('.' + className.active).removeClass(className.filtered);
            }
            else {
              $item.removeClass(className.filtered);
            }
          },
          optionValue: function(value) {
            var
              $option   = $input.find('option[value="' + value + '"]'),
              hasOption = ($option.length > 0)
            ;
            if(!hasOption || !$option.hasClass(className.addition)) {
              return;
            }
            // temporarily disconnect observer
            if(selectObserver) {
              selectObserver.disconnect();
              module.verbose('Temporarily disconnecting mutation observer', value);
            }
            $option.remove();
            module.verbose('Removing user addition as an <option>', value);
            if(selectObserver) {
              selectObserver.observe($input[0], {
                childList : true,
                subtree   : true
              });
            }
          },
          message: function() {
            $menu.children(selector.message).remove();
          },
          searchTerm: function() {
            module.verbose('Cleared search term');
            $search.val('');
            module.set.filtered();
          },
          selected: function(value, $selectedItem) {
            $selectedItem = (settings.allowAdditions)
              ? $selectedItem || module.get.itemWithAdditions(value)
              : $selectedItem || module.get.item(value)
            ;

            if(!$selectedItem) {
              return false;
            }

            $selectedItem
              .each(function() {
                var
                  $selected     = $(this),
                  selectedText  = module.get.choiceText($selected),
                  selectedValue = module.get.choiceValue($selected, selectedText)
                ;
                if(module.is.multiple()) {
                  if(settings.useLabels) {
                    module.remove.value(selectedValue, selectedText, $selected);
                    module.remove.label(selectedValue);
                  }
                  else {
                    module.remove.value(selectedValue, selectedText, $selected);
                    if(module.get.selectionCount() === 0) {
                      module.set.placeholderText();
                    }
                    else {
                      module.set.text(module.add.variables(message.count));
                    }
                  }
                }
                else {
                  module.remove.value(selectedValue, selectedText, $selected);
                }
                $selected
                  .removeClass(className.filtered)
                  .removeClass(className.active)
                ;
                if(settings.useLabels) {
                  $selected.removeClass(className.selected);
                }
              })
            ;
          },
          selectedItem: function() {
            $item.removeClass(className.selected);
          },
          value: function(removedValue, removedText, $removedItem) {
            var
              values = module.get.values(),
              newValue
            ;
            if( module.has.selectInput() ) {
              module.verbose('Input is <select> removing selected option', removedValue);
              newValue = module.remove.arrayValue(removedValue, values);
              module.remove.optionValue(removedValue);
            }
            else {
              module.verbose('Removing from delimited values', removedValue);
              newValue = module.remove.arrayValue(removedValue, values);
              newValue = newValue.join(settings.delimiter);
            }
            if(settings.fireOnInit === false && module.is.initialLoad()) {
              module.verbose('No callback on initial load', settings.onRemove);
            }
            else {
              settings.onRemove.call(element, removedValue, removedText, $removedItem);
            }
            module.set.value(newValue, removedText, $removedItem);
            module.check.maxSelections();
          },
          arrayValue: function(removedValue, values) {
            if( !$.isArray(values) ) {
              values = [values];
            }
            values = $.grep(values, function(value){
              return (removedValue != value);
            });
            module.verbose('Removed value from delimited string', removedValue, values);
            return values;
          },
          label: function(value, shouldAnimate) {
            var
              $labels       = $module.find(selector.label),
              $removedLabel = $labels.filter('[data-value="' + value +'"]')
            ;
            module.verbose('Removing label', $removedLabel);
            $removedLabel.remove();
          },
          activeLabels: function($activeLabels) {
            $activeLabels = $activeLabels || $module.find(selector.label).filter('.' + className.active);
            module.verbose('Removing active label selections', $activeLabels);
            module.remove.labels($activeLabels);
          },
          labels: function($labels) {
            $labels = $labels || $module.find(selector.label);
            module.verbose('Removing labels', $labels);
            $labels
              .each(function(){
                var
                  value       = $(this).data(metadata.value),
                  stringValue = (value !== undefined)
                    ? String(value)
                    : value,
                  isUserValue = module.is.userValue(stringValue)
                ;
                if(isUserValue) {
                  module.remove.value(stringValue);
                  module.remove.label(stringValue);
                }
                else {
                  // selected will also remove label
                  module.remove.selected(stringValue);
                }
              })
            ;
          },
          tabbable: function() {
            if( module.has.search() ) {
              module.debug('Searchable dropdown initialized');
              $search
                .attr('tabindex', '-1')
              ;
              $menu
                .attr('tabindex', '-1')
              ;
            }
            else {
              module.debug('Simple selection dropdown initialized');
              $module
                .attr('tabindex', '-1')
              ;
              $menu
                .attr('tabindex', '-1')
              ;
            }
          }
        },

        has: {
          search: function() {
            return ($search.length > 0);
          },
          selectInput: function() {
            return ( $input.is('select') );
          },
          firstLetter: function($item, letter) {
            var
              text,
              firstLetter
            ;
            if(!$item || $item.length === 0 || typeof letter !== 'string') {
              return false;
            }
            text        = module.get.choiceText($item, false);
            letter      = letter.toLowerCase();
            firstLetter = String(text).charAt(0).toLowerCase();
            return (letter == firstLetter);
          },
          input: function() {
            return ($input.length > 0);
          },
          items: function() {
            return ($item.length > 0);
          },
          menu: function() {
            return ($menu.length > 0);
          },
          message: function() {
            return ($menu.children(selector.message).length !== 0);
          },
          label: function(value) {
            var
              $labels = $module.find(selector.label)
            ;
            return ($labels.filter('[data-value="' + value +'"]').length > 0);
          },
          maxSelections: function() {
            return (settings.maxSelections && module.get.selectionCount() >= settings.maxSelections);
          },
          allResultsFiltered: function() {
            return ($item.filter(selector.unselectable).length === $item.length);
          },
          query: function() {
            return (module.get.query() !== '');
          },
          value: function(value) {
            var
              values   = module.get.values(),
              hasValue = $.isArray(values)
               ? values && ($.inArray(value, values) !== -1)
               : (values == value)
            ;
            return (hasValue)
              ? true
              : false
            ;
          }
        },

        is: {
          active: function() {
            return $module.hasClass(className.active);
          },
          alreadySetup: function() {
            return ($module.is('select') && $module.parent(selector.dropdown).length > 0  && $module.prev().length === 0);
          },
          animating: function($subMenu) {
            return ($subMenu)
              ? $subMenu.transition && $subMenu.transition('is animating')
              : $menu.transition    && $menu.transition('is animating')
            ;
          },
          disabled: function() {
            return $module.hasClass(className.disabled);
          },
          focused: function() {
            return (document.activeElement === $module[0]);
          },
          focusedOnSearch: function() {
            return (document.activeElement === $search[0]);
          },
          allFiltered: function() {
            return( (module.is.multiple() || module.has.search()) && !module.has.message() && module.has.allResultsFiltered() );
          },
          hidden: function($subMenu) {
            return !module.is.visible($subMenu);
          },
          initialLoad: function() {
            return initialLoad;
          },
          onScreen: function($subMenu) {
            var
              $currentMenu   = $subMenu || $menu,
              canOpenDownward = true,
              onScreen = {},
              calculations
            ;
            $currentMenu.addClass(className.loading);
            calculations = {
              context: {
                scrollTop : $context.scrollTop(),
                height    : $context.outerHeight()
              },
              menu : {
                offset: $currentMenu.offset(),
                height: $currentMenu.outerHeight()
              }
            };
            onScreen = {
              above : (calculations.context.scrollTop) <= calculations.menu.offset.top - calculations.menu.height,
              below : (calculations.context.scrollTop + calculations.context.height) >= calculations.menu.offset.top + calculations.menu.height
            };
            if(onScreen.below) {
              module.verbose('Dropdown can fit in context downward', onScreen);
              canOpenDownward = true;
            }
            else if(!onScreen.below && !onScreen.above) {
              module.verbose('Dropdown cannot fit in either direction, favoring downward', onScreen);
              canOpenDownward = true;
            }
            else {
              module.verbose('Dropdown cannot fit below, opening upward', onScreen);
              canOpenDownward = false;
            }
            $currentMenu.removeClass(className.loading);
            return canOpenDownward;
          },
          inObject: function(needle, object) {
            var
              found = false
            ;
            $.each(object, function(index, property) {
              if(property == needle) {
                found = true;
                return true;
              }
            });
            return found;
          },
          multiple: function() {
            return $module.hasClass(className.multiple);
          },
          single: function() {
            return !module.is.multiple();
          },
          selectMutation: function(mutations) {
            var
              selectChanged = false
            ;
            $.each(mutations, function(index, mutation) {
              if(mutation.target && $(mutation.target).is('select')) {
                selectChanged = true;
                return true;
              }
            });
            return selectChanged;
          },
          search: function() {
            return $module.hasClass(className.search);
          },
          searchSelection: function() {
            return ( module.has.search() && $search.parent(selector.dropdown).length === 1 );
          },
          selection: function() {
            return $module.hasClass(className.selection);
          },
          userValue: function(value) {
            return ($.inArray(value, module.get.userValues()) !== -1);
          },
          upward: function($menu) {
            var $element = $menu || $module;
            return $element.hasClass(className.upward);
          },
          visible: function($subMenu) {
            return ($subMenu)
              ? $subMenu.hasClass(className.visible)
              : $menu.hasClass(className.visible)
            ;
          }
        },

        can: {
          activate: function($item) {
            if(settings.useLabels) {
              return true;
            }
            if(!module.has.maxSelections()) {
              return true;
            }
            if(module.has.maxSelections() && $item.hasClass(className.active)) {
              return true;
            }
            return false;
          },
          click: function() {
            return (hasTouch || settings.on == 'click');
          },
          extendSelect: function() {
            return settings.allowAdditions || settings.apiSettings;
          },
          show: function() {
            return !module.is.disabled() && (module.has.items() || module.has.message());
          },
          useAPI: function() {
            return $.fn.api !== undefined;
          }
        },

        animate: {
          show: function(callback, $subMenu) {
            var
              $currentMenu = $subMenu || $menu,
              start = ($subMenu)
                ? function() {}
                : function() {
                  module.hideSubMenus();
                  module.hideOthers();
                  module.set.active();
                },
              transition
            ;
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            module.verbose('Doing menu show animation', $currentMenu);
            module.set.direction($subMenu);
            transition = module.get.transition($subMenu);
            if( module.is.selection() ) {
              module.set.scrollPosition(module.get.selectedItem(), true);
            }
            if( module.is.hidden($currentMenu) || module.is.animating($currentMenu) ) {
              if(transition == 'none') {
                start();
                $currentMenu.transition('show');
                callback.call(element);
              }
              else if($.fn.transition !== undefined && $module.transition('is supported')) {
                $currentMenu
                  .transition({
                    animation  : transition + ' in',
                    debug      : settings.debug,
                    verbose    : settings.verbose,
                    duration   : settings.duration,
                    queue      : true,
                    onStart    : start,
                    onComplete : function() {
                      callback.call(element);
                    }
                  })
                ;
              }
              else {
                module.error(error.noTransition, transition);
              }
            }
          },
          hide: function(callback, $subMenu) {
            var
              $currentMenu = $subMenu || $menu,
              duration = ($subMenu)
                ? (settings.duration * 0.9)
                : settings.duration,
              start = ($subMenu)
                ? function() {}
                : function() {
                  if( module.can.click() ) {
                    module.unbind.intent();
                  }
                  module.remove.active();
                },
              transition = module.get.transition($subMenu)
            ;
            callback = $.isFunction(callback)
              ? callback
              : function(){}
            ;
            if( module.is.visible($currentMenu) || module.is.animating($currentMenu) ) {
              module.verbose('Doing menu hide animation', $currentMenu);

              if(transition == 'none') {
                start();
                $currentMenu.transition('hide');
                callback.call(element);
              }
              else if($.fn.transition !== undefined && $module.transition('is supported')) {
                $currentMenu
                  .transition({
                    animation  : transition + ' out',
                    duration   : settings.duration,
                    debug      : settings.debug,
                    verbose    : settings.verbose,
                    queue      : true,
                    onStart    : start,
                    onComplete : function() {
                      if(settings.direction == 'auto') {
                        module.remove.upward($subMenu);
                      }
                      callback.call(element);
                    }
                  })
                ;
              }
              else {
                module.error(error.transition);
              }
            }
          }
        },

        hideAndClear: function() {
          module.remove.searchTerm();
          if( module.has.maxSelections() ) {
            return;
          }
          if(module.has.search()) {
            module.hide(function() {
              module.remove.filteredItem();
            });
          }
          else {
            module.hide();
          }
        },

        delay: {
          show: function() {
            module.verbose('Delaying show event to ensure user intent');
            clearTimeout(module.timer);
            module.timer = setTimeout(module.show, settings.delay.show);
          },
          hide: function() {
            module.verbose('Delaying hide event to ensure user intent');
            clearTimeout(module.timer);
            module.timer = setTimeout(module.hide, settings.delay.hide);
          }
        },

        escape: {
          regExp: function(text) {
            text =  String(text);
            return text.replace(regExp.escape, '\\$&');
          }
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          instance.invoke('destroy');
        }
        module.initialize();
      }
    })
  ;
  return (returnedValue !== undefined)
    ? returnedValue
    : $allModules
  ;
};

$.fn.dropdown.settings = {

  debug                  : false,
  verbose                : false,
  performance            : true,

  on                     : 'click',    // what event should show menu action on item selection
  action                 : 'activate', // action on item selection (nothing, activate, select, combo, hide, function(){})


  apiSettings            : false,
  saveRemoteData         : true,      // Whether remote name/value pairs should be stored in sessionStorage to allow remote data to be restored on page refresh
  throttle               : 200,       // How long to wait after last user input to search remotely

  context                : window,      // Context to use when determining if on screen
  direction              : 'auto',     // Whether dropdown should always open in one direction
  keepOnScreen           : true,       // Whether dropdown should check whether it is on screen before showing

  match                  : 'both',     // what to match against with search selection (both, text, or label)
  fullTextSearch         : false,      // search anywhere in value

  placeholder            : 'auto',     // whether to convert blank <select> values to placeholder text
  preserveHTML           : true,       // preserve html when selecting value
  sortSelect             : false,      // sort selection on init

  forceSelection         : true,       // force a choice on blur with search selection
  allowAdditions         : false,      // whether multiple select should allow user added values

  maxSelections          : false,      // When set to a number limits the number of selections to this count
  useLabels              : true,       // whether multiple select should filter currently active selections from choices
  delimiter              : ',',        // when multiselect uses normal <input> the values will be delimited with this character

  showOnFocus            : true,       // show menu on focus
  allowTab               : true,       // add tabindex to element
  allowCategorySelection : false,      // allow elements with sub-menus to be selected

  fireOnInit             : false,      // Whether callbacks should fire when initializing dropdown values

  transition             : 'auto',     // auto transition will slide down or up based on direction
  duration               : 200,        // duration of transition

  glyphWidth             : 1.0714,     // widest glyph width in em (W is 1.0714 em) used to calculate multiselect input width

  // label settings on multi-select
  label: {
    transition : 'scale',
    duration   : 200,
    variation  : false
  },

  // delay before event
  delay : {
    hide   : 300,
    show   : 200,
    search : 20,
    touch  : 50
  },

  /* Callbacks */
  onChange      : function(value, text, $selected){},
  onAdd         : function(value, text, $selected){},
  onRemove      : function(value, text, $selected){},

  onLabelSelect : function($selectedLabels){},
  onLabelCreate : function(value, text) { return $(this); },
  onNoResults   : function(searchTerm) { return true; },
  onShow        : function(){},
  onHide        : function(){},

  /* Component */
  name           : 'Dropdown',
  namespace      : 'dropdown',

  message: {
    addResult     : 'Add <b>{term}</b>',
    count         : '{count} selected',
    maxSelections : 'Max {maxCount} selections',
    noResults     : 'No results found.',
    serverError   : 'There was an error contacting the server'
  },

  error : {
    action          : 'You called a dropdown action that was not defined',
    alreadySetup    : 'Once a select has been initialized behaviors must be called on the created ui dropdown',
    labels          : 'Allowing user additions currently requires the use of labels.',
    missingMultiple : '<select> requires multiple property to be set to correctly preserve multiple values',
    method          : 'The method you called is not defined.',
    noAPI           : 'The API module is required to load resources remotely',
    noStorage       : 'Saving remote data requires session storage',
    noTransition    : 'This module requires ui transitions <https://github.com/Semantic-Org/UI-Transition>'
  },

  regExp : {
    escape   : /[-[\]{}()*+?.,\\^$|#\s]/g,
  },

  metadata : {
    defaultText     : 'defaultText',
    defaultValue    : 'defaultValue',
    placeholderText : 'placeholder',
    text            : 'text',
    value           : 'value'
  },

  // property names for remote query
  fields: {
    values : 'values', // grouping for all dropdown values
    name   : 'name',   // displayed dropdown text
    value  : 'value'   // actual dropdown value
  },

  selector : {
    addition     : '.addition',
    dropdown     : '.ui.dropdown',
    icon         : '> .dropdown.icon',
    input        : '> input[type="hidden"], > select',
    item         : '.item',
    label        : '> .label',
    remove       : '> .label > .delete.icon',
    siblingLabel : '.label',
    menu         : '.menu',
    message      : '.message',
    menuIcon     : '.dropdown.icon',
    search       : 'input.search, .menu > .search > input',
    text         : '> .text:not(.icon)',
    unselectable : '.disabled, .filtered'
  },

  className : {
    active      : 'active',
    addition    : 'addition',
    animating   : 'animating',
    disabled    : 'disabled',
    dropdown    : 'ui dropdown',
    filtered    : 'filtered',
    hidden      : 'hidden transition',
    item        : 'item',
    label       : 'ui label',
    loading     : 'loading',
    menu        : 'menu',
    message     : 'message',
    multiple    : 'multiple',
    placeholder : 'default',
    search      : 'search',
    selected    : 'selected',
    selection   : 'selection',
    upward      : 'upward',
    visible     : 'visible'
  }

};

/* Templates */
$.fn.dropdown.settings.templates = {

  // generates dropdown from select values
  dropdown: function(select) {
    var
      placeholder = select.placeholder || false,
      values      = select.values || {},
      html        = ''
    ;
    html +=  '<i class="dropdown icon"></i>';
    if(select.placeholder) {
      html += '<div class="default text">' + placeholder + '</div>';
    }
    else {
      html += '<div class="text"></div>';
    }
    html += '<div class="menu">';
    $.each(select.values, function(index, option) {
      html += (option.disabled)
        ? '<div class="disabled item" data-value="' + option.value + '">' + option.name + '</div>'
        : '<div class="item" data-value="' + option.value + '">' + option.name + '</div>'
      ;
    });
    html += '</div>';
    return html;
  },

  // generates just menu from select
  menu: function(response, fields) {
    var
      values = response.values || {},
      html   = ''
    ;
    $.each(response[fields.values], function(index, option) {
      html += '<div class="item" data-value="' + option[fields.value] + '">' + option[fields.name] + '</div>';
    });
    return html;
  },

  // generates label for multiselect
  label: function(value, text) {
    return text + '<i class="delete icon"></i>';
  },


  // generates messages like "No results"
  message: function(message) {
    return message;
  },

  // generates user addition to selection menu
  addition: function(choice) {
    return choice;
  }

};

})( jQuery, window , document );

/*!
 * # Semantic UI 2.1.4 - Modal
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2015 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.fn.modal = function(parameters) {
  var
    $allModules    = $(this),
    $window        = $(window),
    $document      = $(document),
    $body          = $('body'),

    moduleSelector = $allModules.selector || '',

    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),

    requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function(callback) { setTimeout(callback, 0); },

    returnedValue
  ;

  $allModules
    .each(function() {
      var
        settings    = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.modal.settings, parameters)
          : $.extend({}, $.fn.modal.settings),

        selector        = settings.selector,
        className       = settings.className,
        namespace       = settings.namespace,
        error           = settings.error,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,

        $module         = $(this),
        $context        = $(settings.context),
        $close          = $module.find(selector.close),

        $allModals,
        $otherModals,
        $focusedElement,
        $dimmable,
        $dimmer,

        element         = this,
        instance        = $module.data(moduleNamespace),

        elementNamespace,
        id,
        observer,
        module
      ;
      module  = {

        initialize: function() {
          module.verbose('Initializing dimmer', $context);

          module.create.id();
          module.create.dimmer();
          module.refreshModals();

          module.bind.events();
          if(settings.observeChanges) {
            module.observeChanges();
          }
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of modal');
          instance = module;
          $module
            .data(moduleNamespace, instance)
          ;
        },

        create: {
          dimmer: function() {
            var
              defaultSettings = {
                debug      : settings.debug,
                dimmerName : 'modals',
                duration   : {
                  show     : settings.duration,
                  hide     : settings.duration
                }
              },
              dimmerSettings = $.extend(true, defaultSettings, settings.dimmerSettings)
            ;
            if(settings.inverted) {
              dimmerSettings.variation = (dimmerSettings.variation !== undefined)
                ? dimmerSettings.variation + ' inverted'
                : 'inverted'
              ;
            }
            if($.fn.dimmer === undefined) {
              module.error(error.dimmer);
              return;
            }
            module.debug('Creating dimmer with settings', dimmerSettings);
            $dimmable = $context.dimmer(dimmerSettings);
            if(settings.detachable) {
              module.verbose('Modal is detachable, moving content into dimmer');
              $dimmable.dimmer('add content', $module);
            }
            else {
              module.set.undetached();
            }
            if(settings.blurring) {
              $dimmable.addClass(className.blurring);
            }
            $dimmer = $dimmable.dimmer('get dimmer');
          },
          id: function() {
            id = (Math.random().toString(16) + '000000000').substr(2,8);
            elementNamespace = '.' + id;
            module.verbose('Creating unique id for element', id);
          }
        },

        destroy: function() {
          module.verbose('Destroying previous modal');
          $module
            .removeData(moduleNamespace)
            .off(eventNamespace)
          ;
          $window.off(elementNamespace);
          $close.off(eventNamespace);
          $context.dimmer('destroy');
        },

        observeChanges: function() {
          if('MutationObserver' in window) {
            observer = new MutationObserver(function(mutations) {
              module.debug('DOM tree modified, refreshing');
              module.refresh();
            });
            observer.observe(element, {
              childList : true,
              subtree   : true
            });
            module.debug('Setting up mutation observer', observer);
          }
        },

        refresh: function() {
          module.remove.scrolling();
          module.cacheSizes();
          module.set.screenHeight();
          module.set.type();
          module.set.position();
        },

        refreshModals: function() {
          $otherModals = $module.siblings(selector.modal);
          $allModals   = $otherModals.add($module);
        },

        attachEvents: function(selector, event) {
          var
            $toggle = $(selector)
          ;
          event = $.isFunction(module[event])
            ? module[event]
            : module.toggle
          ;
          if($toggle.length > 0) {
            module.debug('Attaching modal events to element', selector, event);
            $toggle
              .off(eventNamespace)
              .on('click' + eventNamespace, event)
            ;
          }
          else {
            module.error(error.notFound, selector);
          }
        },

        bind: {
          events: function() {
            module.verbose('Attaching events');
            $module
              .on('click' + eventNamespace, selector.close, module.event.close)
              .on('click' + eventNamespace, selector.approve, module.event.approve)
              .on('click' + eventNamespace, selector.deny, module.event.deny)
            ;
            $window
              .on('resize' + elementNamespace, module.event.resize)
            ;
          }
        },

        get: {
          id: function() {
            return (Math.random().toString(16) + '000000000').substr(2,8);
          }
        },

        event: {
          approve: function() {
            if(settings.onApprove.call(element, $(this)) === false) {
              module.verbose('Approve callback returned false cancelling hide');
              return;
            }
            module.hide();
          },
          deny: function() {
            if(settings.onDeny.call(element, $(this)) === false) {
              module.verbose('Deny callback returned false cancelling hide');
              return;
            }
            module.hide();
          },
          close: function() {
            module.hide();
          },
          click: function(event) {
            var
              $target   = $(event.target),
              isInModal = ($target.closest(selector.modal).length > 0),
              isInDOM   = $.contains(document.documentElement, event.target)
            ;
            if(!isInModal && isInDOM) {
              module.debug('Dimmer clicked, hiding all modals');
              if( module.is.active() ) {
                module.remove.clickaway();
                if(settings.allowMultiple) {
                  module.hide();
                }
                else {
                  module.hideAll();
                }
              }
            }
          },
          debounce: function(method, delay) {
            clearTimeout(module.timer);
            module.timer = setTimeout(method, delay);
          },
          keyboard: function(event) {
            var
              keyCode   = event.which,
              escapeKey = 27
            ;
            if(keyCode == escapeKey) {
              if(settings.closable) {
                module.debug('Escape key pressed hiding modal');
                module.hide();
              }
              else {
                module.debug('Escape key pressed, but closable is set to false');
              }
              event.preventDefault();
            }
          },
          resize: function() {
            if( $dimmable.dimmer('is active') ) {
              requestAnimationFrame(module.refresh);
            }
          }
        },

        toggle: function() {
          if( module.is.active() || module.is.animating() ) {
            module.hide();
          }
          else {
            module.show();
          }
        },

        show: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          module.refreshModals();
          module.showModal(callback);
        },

        hide: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          module.refreshModals();
          module.hideModal(callback);
        },

        showModal: function(callback) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( module.is.animating() || !module.is.active() ) {

            module.showDimmer();
            module.cacheSizes();
            module.set.position();
            module.set.screenHeight();
            module.set.type();
            module.set.clickaway();

            if( !settings.allowMultiple && module.others.active() ) {
              module.hideOthers(module.showModal);
            }
            else {
              settings.onShow.call(element);
              if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
                module.debug('Showing modal with css animations');
                $module
                  .transition({
                    debug       : settings.debug,
                    animation   : settings.transition + ' in',
                    queue       : settings.queue,
                    duration    : settings.duration,
                    useFailSafe : true,
                    onComplete : function() {
                      settings.onVisible.apply(element);
                      module.add.keyboardShortcuts();
                      module.save.focus();
                      module.set.active();
                      if(settings.autofocus) {
                        module.set.autofocus();
                      }
                      callback();
                    }
                  })
                ;
              }
              else {
                module.error(error.noTransition);
              }
            }
          }
          else {
            module.debug('Modal is already visible');
          }
        },

        hideModal: function(callback, keepDimmed) {
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          module.debug('Hiding modal');
          settings.onHide.call(element);

          if( module.is.animating() || module.is.active() ) {
            if(settings.transition && $.fn.transition !== undefined && $module.transition('is supported')) {
              module.remove.active();
              $module
                .transition({
                  debug       : settings.debug,
                  animation   : settings.transition + ' out',
                  queue       : settings.queue,
                  duration    : settings.duration,
                  useFailSafe : true,
                  onStart     : function() {
                    if(!module.others.active() && !keepDimmed) {
                      module.hideDimmer();
                    }
                    module.remove.keyboardShortcuts();
                  },
                  onComplete : function() {
                    settings.onHidden.call(element);
                    module.restore.focus();
                    callback();
                  }
                })
              ;
            }
            else {
              module.error(error.noTransition);
            }
          }
        },

        showDimmer: function() {
          if($dimmable.dimmer('is animating') || !$dimmable.dimmer('is active') ) {
            module.debug('Showing dimmer');
            $dimmable.dimmer('show');
          }
          else {
            module.debug('Dimmer already visible');
          }
        },

        hideDimmer: function() {
          if( $dimmable.dimmer('is animating') || ($dimmable.dimmer('is active')) ) {
            $dimmable.dimmer('hide', function() {
              module.remove.clickaway();
              module.remove.screenHeight();
            });
          }
          else {
            module.debug('Dimmer is not visible cannot hide');
            return;
          }
        },

        hideAll: function(callback) {
          var
            $visibleModals = $allModals.filter('.' + className.active + ', .' + className.animating)
          ;
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( $visibleModals.length > 0 ) {
            module.debug('Hiding all visible modals');
            module.hideDimmer();
            $visibleModals
              .modal('hide modal', callback)
            ;
          }
        },

        hideOthers: function(callback) {
          var
            $visibleModals = $otherModals.filter('.' + className.active + ', .' + className.animating)
          ;
          callback = $.isFunction(callback)
            ? callback
            : function(){}
          ;
          if( $visibleModals.length > 0 ) {
            module.debug('Hiding other modals', $otherModals);
            $visibleModals
              .modal('hide modal', callback, true)
            ;
          }
        },

        others: {
          active: function() {
            return ($otherModals.filter('.' + className.active).length > 0);
          },
          animating: function() {
            return ($otherModals.filter('.' + className.animating).length > 0);
          }
        },


        add: {
          keyboardShortcuts: function() {
            module.verbose('Adding keyboard shortcuts');
            $document
              .on('keyup' + eventNamespace, module.event.keyboard)
            ;
          }
        },

        save: {
          focus: function() {
            $focusedElement = $(document.activeElement).blur();
          }
        },

        restore: {
          focus: function() {
            if($focusedElement && $focusedElement.length > 0) {
              $focusedElement.focus();
            }
          }
        },

        remove: {
          active: function() {
            $module.removeClass(className.active);
          },
          clickaway: function() {
            if(settings.closable) {
              $dimmer
                .off('click' + elementNamespace)
              ;
            }
          },
          bodyStyle: function() {
            if($body.attr('style') === '') {
              module.verbose('Removing style attribute');
              $body.removeAttr('style');
            }
          },
          screenHeight: function() {
            module.debug('Removing page height');
            $body
              .css('height', '')
            ;
          },
          keyboardShortcuts: function() {
            module.verbose('Removing keyboard shortcuts');
            $document
              .off('keyup' + eventNamespace)
            ;
          },
          scrolling: function() {
            $dimmable.removeClass(className.scrolling);
            $module.removeClass(className.scrolling);
          }
        },

        cacheSizes: function() {
          var
            modalHeight = $module.outerHeight()
          ;
          if(module.cache === undefined || modalHeight !== 0) {
            module.cache = {
              pageHeight    : $(document).outerHeight(),
              height        : modalHeight + settings.offset,
              contextHeight : (settings.context == 'body')
                ? $(window).height()
                : $dimmable.height()
            };
          }
          module.debug('Caching modal and container sizes', module.cache);
        },

        can: {
          fit: function() {
            return ( ( module.cache.height + (settings.padding * 2) ) < module.cache.contextHeight);
          }
        },

        is: {
          active: function() {
            return $module.hasClass(className.active);
          },
          animating: function() {
            return $module.transition('is supported')
              ? $module.transition('is animating')
              : $module.is(':visible')
            ;
          },
          scrolling: function() {
            return $dimmable.hasClass(className.scrolling);
          },
          modernBrowser: function() {
            // appName for IE11 reports 'Netscape' can no longer use
            return !(window.ActiveXObject || "ActiveXObject" in window);
          }
        },

        set: {
          autofocus: function() {
            var
              $inputs    = $module.find(':input').filter(':visible'),
              $autofocus = $inputs.filter('[autofocus]'),
              $input     = ($autofocus.length > 0)
                ? $autofocus.first()
                : $inputs.first()
            ;
            if($input.length > 0) {
              $input.focus();
            }
          },
          clickaway: function() {
            if(settings.closable) {
              $dimmer
                .on('click' + elementNamespace, module.event.click)
              ;
            }
          },
          screenHeight: function() {
            if( module.can.fit() ) {
              $body.css('height', '');
            }
            else {
              module.debug('Modal is taller than page content, resizing page height');
              $body
                .css('height', module.cache.height + (settings.padding * 2) )
              ;
            }
          },
          active: function() {
            $module.addClass(className.active);
          },
          scrolling: function() {
            $dimmable.addClass(className.scrolling);
            $module.addClass(className.scrolling);
          },
          type: function() {
            if(module.can.fit()) {
              module.verbose('Modal fits on screen');
              if(!module.others.active() && !module.others.animating()) {
                module.remove.scrolling();
              }
            }
            else {
              module.verbose('Modal cannot fit on screen setting to scrolling');
              module.set.scrolling();
            }
          },
          position: function() {
            module.verbose('Centering modal on page', module.cache);
            if(module.can.fit()) {
              $module
                .css({
                  top: '',
                  marginTop: -(module.cache.height / 2)
                })
              ;
            }
            else {
              $module
                .css({
                  marginTop : '',
                  top       : $document.scrollTop()
                })
              ;
            }
          },
          undetached: function() {
            $dimmable.addClass(className.undetached);
          }
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          instance.invoke('destroy');
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.modal.settings = {

  name           : 'Modal',
  namespace      : 'modal',

  debug          : false,
  verbose        : false,
  performance    : true,

  observeChanges : false,

  allowMultiple  : false,
  detachable     : true,
  closable       : true,
  autofocus      : true,

  inverted       : false,
  blurring       : false,

  dimmerSettings : {
    closable : false,
    useCSS   : true
  },


  context    : 'body',

  queue      : false,
  duration   : 500,
  offset     : 0,
  transition : 'scale',

  // padding with edge of page
  padding    : 50,

  // called before show animation
  onShow     : function(){},

  // called after show animation
  onVisible  : function(){},

  // called before hide animation
  onHide     : function(){},

  // called after hide animation
  onHidden   : function(){},

  // called after approve selector match
  onApprove  : function(){ return true; },

  // called after deny selector match
  onDeny     : function(){ return true; },

  selector    : {
    close    : '> .close',
    approve  : '.actions .positive, .actions .approve, .actions .ok',
    deny     : '.actions .negative, .actions .deny, .actions .cancel',
    modal    : '.ui.modal'
  },
  error : {
    dimmer    : 'UI Dimmer, a required component is not included in this page',
    method    : 'The method you called is not defined.',
    notFound  : 'The element you specified could not be found'
  },
  className : {
    active     : 'active',
    animating  : 'animating',
    blurring   : 'blurring',
    scrolling  : 'scrolling',
    undetached : 'undetached'
  }
};


})( jQuery, window , document );

/*!
 * # Semantic UI 2.1.4 - Transition
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2015 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.fn.transition = function() {
  var
    $allModules     = $(this),
    moduleSelector  = $allModules.selector || '',

    time            = new Date().getTime(),
    performance     = [],

    moduleArguments = arguments,
    query           = moduleArguments[0],
    queryArguments  = [].slice.call(arguments, 1),
    methodInvoked   = (typeof query === 'string'),

    requestAnimationFrame = window.requestAnimationFrame
      || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame
      || window.msRequestAnimationFrame
      || function(callback) { setTimeout(callback, 0); },

    returnedValue
  ;
  $allModules
    .each(function(index) {
      var
        $module  = $(this),
        element  = this,

        // set at run time
        settings,
        instance,

        error,
        className,
        metadata,
        animationEnd,
        animationName,

        namespace,
        moduleNamespace,
        eventNamespace,
        module
      ;

      module = {

        initialize: function() {

          // get full settings
          settings        = module.get.settings.apply(element, moduleArguments);

          // shorthand
          className       = settings.className;
          error           = settings.error;
          metadata        = settings.metadata;

          // define namespace
          eventNamespace  = '.' + settings.namespace;
          moduleNamespace = 'module-' + settings.namespace;
          instance        = $module.data(moduleNamespace) || module;

          // get vendor specific events
          animationEnd    = module.get.animationEndEvent();

          if(methodInvoked) {
            methodInvoked = module.invoke(query);
          }

          // method not invoked, lets run an animation
          if(methodInvoked === false) {
            module.verbose('Converted arguments into settings object', settings);
            if(settings.interval) {
              module.delay(settings.animate);
            }
            else  {
              module.animate();
            }
            module.instantiate();
          }
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, instance)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous module for', element);
          $module
            .removeData(moduleNamespace)
          ;
        },

        refresh: function() {
          module.verbose('Refreshing display type on next animation');
          delete module.displayType;
        },

        forceRepaint: function() {
          module.verbose('Forcing element repaint');
          var
            $parentElement = $module.parent(),
            $nextElement = $module.next()
          ;
          if($nextElement.length === 0) {
            $module.detach().appendTo($parentElement);
          }
          else {
            $module.detach().insertBefore($nextElement);
          }
        },

        repaint: function() {
          module.verbose('Repainting element');
          var
            fakeAssignment = element.offsetWidth
          ;
        },

        delay: function(interval) {
          var
            direction = module.get.animationDirection(),
            shouldReverse,
            delay
          ;
          if(!direction) {
            direction = module.can.transition()
              ? module.get.direction()
              : 'static'
            ;
          }
          interval = (interval !== undefined)
            ? interval
            : settings.interval
          ;
          shouldReverse = (settings.reverse == 'auto' && direction == className.outward);
          delay = (shouldReverse || settings.reverse == true)
            ? ($allModules.length - index) * settings.interval
            : index * settings.interval
          ;
          module.debug('Delaying animation by', delay);
          setTimeout(module.animate, delay);
        },

        animate: function(overrideSettings) {
          settings = overrideSettings || settings;
          if(!module.is.supported()) {
            module.error(error.support);
            return false;
          }
          module.debug('Preparing animation', settings.animation);
          if(module.is.animating()) {
            if(settings.queue) {
              if(!settings.allowRepeats && module.has.direction() && module.is.occurring() && module.queuing !== true) {
                module.debug('Animation is currently occurring, preventing queueing same animation', settings.animation);
              }
              else {
                module.queue(settings.animation);
              }
              return false;
            }
            else if(!settings.allowRepeats && module.is.occurring()) {
              module.debug('Animation is already occurring, will not execute repeated animation', settings.animation);
              return false;
            }
            else {
              module.debug('New animation started, completing previous early', settings.animation);
              instance.complete();
            }
          }
          if( module.can.animate() ) {
            module.set.animating(settings.animation);
          }
          else {
            module.error(error.noAnimation, settings.animation, element);
          }
        },

        reset: function() {
          module.debug('Resetting animation to beginning conditions');
          module.remove.animationCallbacks();
          module.restore.conditions();
          module.remove.animating();
        },

        queue: function(animation) {
          module.debug('Queueing animation of', animation);
          module.queuing = true;
          $module
            .one(animationEnd + '.queue' + eventNamespace, function() {
              module.queuing = false;
              module.repaint();
              module.animate.apply(this, settings);
            })
          ;
        },

        complete: function (event) {
          module.debug('Animation complete', settings.animation);
          module.remove.completeCallback();
          module.remove.failSafe();
          if(!module.is.looping()) {
            if( module.is.outward() ) {
              module.verbose('Animation is outward, hiding element');
              module.restore.conditions();
              module.hide();
            }
            else if( module.is.inward() ) {
              module.verbose('Animation is outward, showing element');
              module.restore.conditions();
              module.show();
            }
            else {
              module.restore.conditions();
            }
          }
        },

        force: {
          visible: function() {
            var
              style          = $module.attr('style'),
              userStyle      = module.get.userStyle(),
              displayType    = module.get.displayType(),
              overrideStyle  = userStyle + 'display: ' + displayType + ' !important;',
              currentDisplay = $module.css('display'),
              emptyStyle     = (style === undefined || style === '')
            ;
            if(currentDisplay !== displayType) {
              module.verbose('Overriding default display to show element', displayType);
              $module
                .attr('style', overrideStyle)
              ;
            }
            else if(emptyStyle) {
              $module.removeAttr('style');
            }
          },
          hidden: function() {
            var
              style          = $module.attr('style'),
              currentDisplay = $module.css('display'),
              emptyStyle     = (style === undefined || style === '')
            ;
            if(currentDisplay !== 'none' && !module.is.hidden()) {
              module.verbose('Overriding default display to hide element');
              $module
                .css('display', 'none')
              ;
            }
            else if(emptyStyle) {
              $module
                .removeAttr('style')
              ;
            }
          }
        },

        has: {
          direction: function(animation) {
            var
              hasDirection = false
            ;
            animation = animation || settings.animation;
            if(typeof animation === 'string') {
              animation = animation.split(' ');
              $.each(animation, function(index, word){
                if(word === className.inward || word === className.outward) {
                  hasDirection = true;
                }
              });
            }
            return hasDirection;
          },
          inlineDisplay: function() {
            var
              style = $module.attr('style') || ''
            ;
            return $.isArray(style.match(/display.*?;/, ''));
          }
        },

        set: {
          animating: function(animation) {
            var
              animationClass,
              direction
            ;
            // remove previous callbacks
            module.remove.completeCallback();

            // determine exact animation
            animation      = animation || settings.animation;
            animationClass = module.get.animationClass(animation);

            // save animation class in cache to restore class names
            module.save.animation(animationClass);

            // override display if necessary so animation appears visibly
            module.force.visible();

            module.remove.hidden();
            module.remove.direction();

            module.start.animation(animationClass);

          },
          duration: function(animationName, duration) {
            duration = duration || settings.duration;
            duration = (typeof duration == 'number')
              ? duration + 'ms'
              : duration
            ;
            if(duration || duration === 0) {
              module.verbose('Setting animation duration', duration);
              $module
                .css({
                  'animation-duration':  duration
                })
              ;
            }
          },
          direction: function(direction) {
            direction = direction || module.get.direction();
            if(direction == className.inward) {
              module.set.inward();
            }
            else {
              module.set.outward();
            }
          },
          looping: function() {
            module.debug('Transition set to loop');
            $module
              .addClass(className.looping)
            ;
          },
          hidden: function() {
            $module
              .addClass(className.transition)
              .addClass(className.hidden)
            ;
          },
          inward: function() {
            module.debug('Setting direction to inward');
            $module
              .removeClass(className.outward)
              .addClass(className.inward)
            ;
          },
          outward: function() {
            module.debug('Setting direction to outward');
            $module
              .removeClass(className.inward)
              .addClass(className.outward)
            ;
          },
          visible: function() {
            $module
              .addClass(className.transition)
              .addClass(className.visible)
            ;
          }
        },

        start: {
          animation: function(animationClass) {
            animationClass = animationClass || module.get.animationClass();
            module.debug('Starting tween', animationClass);
            $module
              .addClass(animationClass)
              .one(animationEnd + '.complete' + eventNamespace, module.complete)
            ;
            if(settings.useFailSafe) {
              module.add.failSafe();
            }
            module.set.duration(settings.duration);
            settings.onStart.call(element);
          }
        },

        save: {
          animation: function(animation) {
            if(!module.cache) {
              module.cache = {};
            }
            module.cache.animation = animation;
          },
          displayType: function(displayType) {
            if(displayType !== 'none') {
              $module.data(metadata.displayType, displayType);
            }
          },
          transitionExists: function(animation, exists) {
            $.fn.transition.exists[animation] = exists;
            module.verbose('Saving existence of transition', animation, exists);
          }
        },

        restore: {
          conditions: function() {
            var
              animation = module.get.currentAnimation()
            ;
            if(animation) {
              $module
                .removeClass(animation)
              ;
              module.verbose('Removing animation class', module.cache);
            }
            module.remove.duration();
          }
        },

        add: {
          failSafe: function() {
            var
              duration = module.get.duration()
            ;
            module.timer = setTimeout(function() {
              $module.triggerHandler(animationEnd);
            }, duration + settings.failSafeDelay);
            module.verbose('Adding fail safe timer', module.timer);
          }
        },

        remove: {
          animating: function() {
            $module.removeClass(className.animating);
          },
          animationCallbacks: function() {
            module.remove.queueCallback();
            module.remove.completeCallback();
          },
          queueCallback: function() {
            $module.off('.queue' + eventNamespace);
          },
          completeCallback: function() {
            $module.off('.complete' + eventNamespace);
          },
          display: function() {
            $module.css('display', '');
          },
          direction: function() {
            $module
              .removeClass(className.inward)
              .removeClass(className.outward)
            ;
          },
          duration: function() {
            $module
              .css('animation-duration', '')
            ;
          },
          failSafe: function() {
            module.verbose('Removing fail safe timer', module.timer);
            if(module.timer) {
              clearTimeout(module.timer);
            }
          },
          hidden: function() {
            $module.removeClass(className.hidden);
          },
          visible: function() {
            $module.removeClass(className.visible);
          },
          looping: function() {
            module.debug('Transitions are no longer looping');
            if( module.is.looping() ) {
              module.reset();
              $module
                .removeClass(className.looping)
              ;
            }
          },
          transition: function() {
            $module
              .removeClass(className.visible)
              .removeClass(className.hidden)
            ;
          }
        },
        get: {
          settings: function(animation, duration, onComplete) {
            // single settings object
            if(typeof animation == 'object') {
              return $.extend(true, {}, $.fn.transition.settings, animation);
            }
            // all arguments provided
            else if(typeof onComplete == 'function') {
              return $.extend({}, $.fn.transition.settings, {
                animation  : animation,
                onComplete : onComplete,
                duration   : duration
              });
            }
            // only duration provided
            else if(typeof duration == 'string' || typeof duration == 'number') {
              return $.extend({}, $.fn.transition.settings, {
                animation : animation,
                duration  : duration
              });
            }
            // duration is actually settings object
            else if(typeof duration == 'object') {
              return $.extend({}, $.fn.transition.settings, duration, {
                animation : animation
              });
            }
            // duration is actually callback
            else if(typeof duration == 'function') {
              return $.extend({}, $.fn.transition.settings, {
                animation  : animation,
                onComplete : duration
              });
            }
            // only animation provided
            else {
              return $.extend({}, $.fn.transition.settings, {
                animation : animation
              });
            }
            return $.fn.transition.settings;
          },
          animationClass: function(animation) {
            var
              animationClass = animation || settings.animation,
              directionClass = (module.can.transition() && !module.has.direction())
                ? module.get.direction() + ' '
                : ''
            ;
            return className.animating + ' '
              + className.transition + ' '
              + directionClass
              + animationClass
            ;
          },
          currentAnimation: function() {
            return (module.cache && module.cache.animation !== undefined)
              ? module.cache.animation
              : false
            ;
          },
          currentDirection: function() {
            return module.is.inward()
              ? className.inward
              : className.outward
            ;
          },
          direction: function() {
            return module.is.hidden() || !module.is.visible()
              ? className.inward
              : className.outward
            ;
          },
          animationDirection: function(animation) {
            var
              direction
            ;
            animation = animation || settings.animation;
            if(typeof animation === 'string') {
              animation = animation.split(' ');
              // search animation name for out/in class
              $.each(animation, function(index, word){
                if(word === className.inward) {
                  direction = className.inward;
                }
                else if(word === className.outward) {
                  direction = className.outward;
                }
              });
            }
            // return found direction
            if(direction) {
              return direction;
            }
            return false;
          },
          duration: function(duration) {
            duration = duration || settings.duration;
            if(duration === false) {
              duration = $module.css('animation-duration') || 0;
            }
            return (typeof duration === 'string')
              ? (duration.indexOf('ms') > -1)
                ? parseFloat(duration)
                : parseFloat(duration) * 1000
              : duration
            ;
          },
          displayType: function() {
            if(settings.displayType) {
              return settings.displayType;
            }
            if($module.data(metadata.displayType) === undefined) {
              // create fake element to determine display state
              module.can.transition(true);
            }
            return $module.data(metadata.displayType);
          },
          userStyle: function(style) {
            style = style || $module.attr('style') || '';
            return style.replace(/display.*?;/, '');
          },
          transitionExists: function(animation) {
            return $.fn.transition.exists[animation];
          },
          animationStartEvent: function() {
            var
              element     = document.createElement('div'),
              animations  = {
                'animation'       :'animationstart',
                'OAnimation'      :'oAnimationStart',
                'MozAnimation'    :'mozAnimationStart',
                'WebkitAnimation' :'webkitAnimationStart'
              },
              animation
            ;
            for(animation in animations){
              if( element.style[animation] !== undefined ){
                return animations[animation];
              }
            }
            return false;
          },
          animationEndEvent: function() {
            var
              element     = document.createElement('div'),
              animations  = {
                'animation'       :'animationend',
                'OAnimation'      :'oAnimationEnd',
                'MozAnimation'    :'mozAnimationEnd',
                'WebkitAnimation' :'webkitAnimationEnd'
              },
              animation
            ;
            for(animation in animations){
              if( element.style[animation] !== undefined ){
                return animations[animation];
              }
            }
            return false;
          }

        },

        can: {
          transition: function(forced) {
            var
              animation         = settings.animation,
              transitionExists  = module.get.transitionExists(animation),
              elementClass,
              tagName,
              $clone,
              currentAnimation,
              inAnimation,
              directionExists,
              displayType
            ;
            if( transitionExists === undefined || forced) {
              module.verbose('Determining whether animation exists');
              elementClass = $module.attr('class');
              tagName      = $module.prop('tagName');

              $clone = $('<' + tagName + ' />').addClass( elementClass ).insertAfter($module);
              currentAnimation = $clone
                .addClass(animation)
                .removeClass(className.inward)
                .removeClass(className.outward)
                .addClass(className.animating)
                .addClass(className.transition)
                .css('animationName')
              ;
              inAnimation = $clone
                .addClass(className.inward)
                .css('animationName')
              ;
              displayType = $clone
                .attr('class', elementClass)
                .removeAttr('style')
                .removeClass(className.hidden)
                .removeClass(className.visible)
                .show()
                .css('display')
              ;
              module.verbose('Determining final display state', displayType);
              module.save.displayType(displayType);

              $clone.remove();
              if(currentAnimation != inAnimation) {
                module.debug('Direction exists for animation', animation);
                directionExists = true;
              }
              else if(currentAnimation == 'none' || !currentAnimation) {
                module.debug('No animation defined in css', animation);
                return;
              }
              else {
                module.debug('Static animation found', animation, displayType);
                directionExists = false;
              }
              module.save.transitionExists(animation, directionExists);
            }
            return (transitionExists !== undefined)
              ? transitionExists
              : directionExists
            ;
          },
          animate: function() {
            // can transition does not return a value if animation does not exist
            return (module.can.transition() !== undefined);
          }
        },

        is: {
          animating: function() {
            return $module.hasClass(className.animating);
          },
          inward: function() {
            return $module.hasClass(className.inward);
          },
          outward: function() {
            return $module.hasClass(className.outward);
          },
          looping: function() {
            return $module.hasClass(className.looping);
          },
          occurring: function(animation) {
            animation = animation || settings.animation;
            animation = '.' + animation.replace(' ', '.');
            return ( $module.filter(animation).length > 0 );
          },
          visible: function() {
            return $module.is(':visible');
          },
          hidden: function() {
            return $module.css('visibility') === 'hidden';
          },
          supported: function() {
            return(animationEnd !== false);
          }
        },

        hide: function() {
          module.verbose('Hiding element');
          if( module.is.animating() ) {
            module.reset();
          }
          element.blur(); // IE will trigger focus change if element is not blurred before hiding
          module.remove.display();
          module.remove.visible();
          module.set.hidden();
          module.force.hidden();
          settings.onHide.call(element);
          settings.onComplete.call(element);
          // module.repaint();
        },

        show: function(display) {
          module.verbose('Showing element', display);
          module.remove.hidden();
          module.set.visible();
          module.force.visible();
          settings.onShow.call(element);
          settings.onComplete.call(element);
          // module.repaint();
        },

        toggle: function() {
          if( module.is.visible() ) {
            module.hide();
          }
          else {
            module.show();
          }
        },

        stop: function() {
          module.debug('Stopping current animation');
          $module.triggerHandler(animationEnd);
        },

        stopAll: function() {
          module.debug('Stopping all animation');
          module.remove.queueCallback();
          $module.triggerHandler(animationEnd);
        },

        clear: {
          queue: function() {
            module.debug('Clearing animation queue');
            module.remove.queueCallback();
          }
        },

        enable: function() {
          module.verbose('Starting animation');
          $module.removeClass(className.disabled);
        },

        disable: function() {
          module.debug('Stopping animation');
          $module.addClass(className.disabled);
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if($allModules.length > 1) {
              title += ' ' + '(' + $allModules.length + ')';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        // modified for transition to return invoke success
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }

          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return (found !== undefined)
            ? found
            : false
          ;
        }
      };
      module.initialize();
    })
  ;
  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

// Records if CSS transition is available
$.fn.transition.exists = {};

$.fn.transition.settings = {

  // module info
  name          : 'Transition',

  // debug content outputted to console
  debug         : false,

  // verbose debug output
  verbose       : false,

  // performance data output
  performance   : true,

  // event namespace
  namespace     : 'transition',

  // delay between animations in group
  interval      : 0,

  // whether group animations should be reversed
  reverse       : 'auto',

  // animation callback event
  onStart       : function() {},
  onComplete    : function() {},
  onShow        : function() {},
  onHide        : function() {},

  // whether timeout should be used to ensure callback fires in cases animationend does not
  useFailSafe   : true,

  // delay in ms for fail safe
  failSafeDelay : 100,

  // whether EXACT animation can occur twice in a row
  allowRepeats  : false,

  // Override final display type on visible
  displayType   : false,

  // animation duration
  animation     : 'fade',
  duration      : false,

  // new animations will occur after previous ones
  queue         : true,

  metadata : {
    displayType: 'display'
  },

  className   : {
    animating  : 'animating',
    disabled   : 'disabled',
    hidden     : 'hidden',
    inward     : 'in',
    loading    : 'loading',
    looping    : 'looping',
    outward    : 'out',
    transition : 'transition',
    visible    : 'visible'
  },

  // possible errors
  error: {
    noAnimation : 'There is no css animation matching the one you specified. Please make sure your css is vendor prefixed, and you have included transition css.',
    repeated    : 'That animation is already occurring, cancelling repeated animation',
    method      : 'The method you called is not defined',
    support     : 'This browser does not support CSS animations'
  }

};


})( jQuery, window , document );

/*!
 * # Semantic UI 2.1.4 - API
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2015 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.api = $.fn.api = function(parameters) {

  var
    // use window context if none specified
    $allModules     = $.isFunction(this)
        ? $(window)
        : $(this),
    moduleSelector = $allModules.selector || '',
    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),

    returnedValue
  ;

  $allModules
    .each(function() {
      var
        settings          = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.api.settings, parameters)
          : $.extend({}, $.fn.api.settings),

        // internal aliases
        namespace       = settings.namespace,
        metadata        = settings.metadata,
        selector        = settings.selector,
        error           = settings.error,
        className       = settings.className,

        // define namespaces for modules
        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,

        // element that creates request
        $module         = $(this),
        $form           = $module.closest(selector.form),

        // context used for state
        $context        = (settings.stateContext)
          ? $(settings.stateContext)
          : $module,

        // request details
        ajaxSettings,
        requestSettings,
        url,
        data,
        requestStartTime,

        // standard module
        element         = this,
        context         = $context[0],
        instance        = $module.data(moduleNamespace),
        module
      ;

      module = {

        initialize: function() {
          if(!methodInvoked) {
            module.bind.events();
          }
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, instance)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous module for', element);
          $module
            .removeData(moduleNamespace)
            .off(eventNamespace)
          ;
        },

        bind: {
          events: function() {
            var
              triggerEvent = module.get.event()
            ;
            if( triggerEvent ) {
              module.verbose('Attaching API events to element', triggerEvent);
              $module
                .on(triggerEvent + eventNamespace, module.event.trigger)
              ;
            }
            else if(settings.on == 'now') {
              module.debug('Querying API endpoint immediately');
              module.query();
            }
          }
        },

        decode: {
          json: function(response) {
            if(response !== undefined && typeof response == 'string') {
              try {
               response = JSON.parse(response);
              }
              catch(e) {
                // isnt json string
              }
            }
            return response;
          }
        },

        read: {
          cachedResponse: function(url) {
            var
              response
            ;
            if(window.Storage === undefined) {
              module.error(error.noStorage);
              return;
            }
            response = sessionStorage.getItem(url);
            module.debug('Using cached response', url, response);
            response = module.decode.json(response);
            return false;
          }
        },
        write: {
          cachedResponse: function(url, response) {
            if(response && response === '') {
              module.debug('Response empty, not caching', response);
              return;
            }
            if(window.Storage === undefined) {
              module.error(error.noStorage);
              return;
            }
            if( $.isPlainObject(response) ) {
              response = JSON.stringify(response);
            }
            sessionStorage.setItem(url, response);
            module.verbose('Storing cached response for url', url, response);
          }
        },

        query: function() {

          if(module.is.disabled()) {
            module.debug('Element is disabled API request aborted');
            return;
          }

          if(module.is.loading()) {
            if(settings.interruptRequests) {
              module.debug('Interrupting previous request');
              module.abort();
            }
            else {
              module.debug('Cancelling request, previous request is still pending');
              return;
            }
          }

          // pass element metadata to url (value, text)
          if(settings.defaultData) {
            $.extend(true, settings.urlData, module.get.defaultData());
          }

          // Add form content
          if(settings.serializeForm) {
            settings.data = module.add.formData(settings.data);
          }

          // call beforesend and get any settings changes
          requestSettings = module.get.settings();

          // check if before send cancelled request
          if(requestSettings === false) {
            module.cancelled = true;
            module.error(error.beforeSend);
            return;
          }
          else {
            module.cancelled = false;
          }

          // get url
          url = module.get.templatedURL();

          if(!url && !module.is.mocked()) {
            module.error(error.missingURL);
            return;
          }

          // replace variables
          url = module.add.urlData( url );

          // missing url parameters
          if( !url && !module.is.mocked()) {
            return;
          }


          // look for jQuery ajax parameters in settings
          ajaxSettings = $.extend(true, {}, settings, {
            type       : settings.method || settings.type,
            data       : data,
            url        : settings.base + url,
            beforeSend : settings.beforeXHR,
            success    : function() {},
            failure    : function() {},
            complete   : function() {}
          });

          module.debug('Querying URL', ajaxSettings.url);
          module.verbose('Using AJAX settings', ajaxSettings);

          if(settings.cache === 'local' && module.read.cachedResponse(url)) {
            module.debug('Response returned from local cache');
            module.request = module.create.request();
            module.request.resolveWith(context, [ module.read.cachedResponse(url) ]);
            return;
          }

          if( !settings.throttle ) {
            module.debug('Sending request', data, ajaxSettings.method);
            module.send.request();
          }
          else {
            if(!settings.throttleFirstRequest && !module.timer) {
              module.debug('Sending request', data, ajaxSettings.method);
              module.send.request();
              module.timer = setTimeout(function(){}, settings.throttle);
            }
            else {
              module.debug('Throttling request', settings.throttle);
              clearTimeout(module.timer);
              module.timer = setTimeout(function() {
                if(module.timer) {
                  delete module.timer;
                }
                module.debug('Sending throttled request', data, ajaxSettings.method);
                module.send.request();
              }, settings.throttle);
            }
          }

        },

        should: {
          removeError: function() {
            return ( settings.hideError === true || (settings.hideError === 'auto' && !module.is.form()) );
          }
        },

        is: {
          disabled: function() {
            return ($module.filter(selector.disabled).length > 0);
          },
          form: function() {
            return $module.is('form') || $context.is('form');
          },
          mocked: function() {
            return (settings.mockResponse || settings.mockResponseAsync);
          },
          input: function() {
            return $module.is('input');
          },
          loading: function() {
            return (module.request && module.request.state() == 'pending');
          },
          abortedRequest: function(xhr) {
            if(xhr && xhr.readyState !== undefined && xhr.readyState === 0) {
              module.verbose('XHR request determined to be aborted');
              return true;
            }
            else {
              module.verbose('XHR request was not aborted');
              return false;
            }
          },
          validResponse: function(response) {
            if( (settings.dataType !== 'json' && settings.dataType !== 'jsonp') || !$.isFunction(settings.successTest) ) {
              module.verbose('Response is not JSON, skipping validation', settings.successTest, response);
              return true;
            }
            module.debug('Checking JSON returned success', settings.successTest, response);
            if( settings.successTest(response) ) {
              module.debug('Response passed success test', response);
              return true;
            }
            else {
              module.debug('Response failed success test', response);
              return false;
            }
          }
        },

        was: {
          cancelled: function() {
            return (module.cancelled || false);
          },
          succesful: function() {
            return (module.request && module.request.state() == 'resolved');
          },
          failure: function() {
            return (module.request && module.request.state() == 'rejected');
          },
          complete: function() {
            return (module.request && (module.request.state() == 'resolved' || module.request.state() == 'rejected') );
          }
        },

        add: {
          urlData: function(url, urlData) {
            var
              requiredVariables,
              optionalVariables
            ;
            if(url) {
              requiredVariables = url.match(settings.regExp.required);
              optionalVariables = url.match(settings.regExp.optional);
              urlData           = urlData || settings.urlData;
              if(requiredVariables) {
                module.debug('Looking for required URL variables', requiredVariables);
                $.each(requiredVariables, function(index, templatedString) {
                  var
                    // allow legacy {$var} style
                    variable = (templatedString.indexOf('$') !== -1)
                      ? templatedString.substr(2, templatedString.length - 3)
                      : templatedString.substr(1, templatedString.length - 2),
                    value   = ($.isPlainObject(urlData) && urlData[variable] !== undefined)
                      ? urlData[variable]
                      : ($module.data(variable) !== undefined)
                        ? $module.data(variable)
                        : ($context.data(variable) !== undefined)
                          ? $context.data(variable)
                          : urlData[variable]
                  ;
                  // remove value
                  if(value === undefined) {
                    module.error(error.requiredParameter, variable, url);
                    url = false;
                    return false;
                  }
                  else {
                    module.verbose('Found required variable', variable, value);
                    value = (settings.encodeParameters)
                      ? module.get.urlEncodedValue(value)
                      : value
                    ;
                    url = url.replace(templatedString, value);
                  }
                });
              }
              if(optionalVariables) {
                module.debug('Looking for optional URL variables', requiredVariables);
                $.each(optionalVariables, function(index, templatedString) {
                  var
                    // allow legacy {/$var} style
                    variable = (templatedString.indexOf('$') !== -1)
                      ? templatedString.substr(3, templatedString.length - 4)
                      : templatedString.substr(2, templatedString.length - 3),
                    value   = ($.isPlainObject(urlData) && urlData[variable] !== undefined)
                      ? urlData[variable]
                      : ($module.data(variable) !== undefined)
                        ? $module.data(variable)
                        : ($context.data(variable) !== undefined)
                          ? $context.data(variable)
                          : urlData[variable]
                  ;
                  // optional replacement
                  if(value !== undefined) {
                    module.verbose('Optional variable Found', variable, value);
                    url = url.replace(templatedString, value);
                  }
                  else {
                    module.verbose('Optional variable not found', variable);
                    // remove preceding slash if set
                    if(url.indexOf('/' + templatedString) !== -1) {
                      url = url.replace('/' + templatedString, '');
                    }
                    else {
                      url = url.replace(templatedString, '');
                    }
                  }
                });
              }
            }
            return url;
          },
          formData: function(data) {
            var
              canSerialize = ($.fn.serializeObject !== undefined),
              formData     = (canSerialize)
                ? $form.serializeObject()
                : $form.serialize(),
              hasOtherData
            ;
            data         = data || settings.data;
            hasOtherData = $.isPlainObject(data);

            if(hasOtherData) {
              if(canSerialize) {
                module.debug('Extending existing data with form data', data, formData);
                data = $.extend(true, {}, data, formData);
              }
              else {
                module.error(error.missingSerialize);
                module.debug('Cant extend data. Replacing data with form data', data, formData);
                data = formData;
              }
            }
            else {
              module.debug('Adding form data', formData);
              data = formData;
            }
            return data;
          }
        },

        send: {
          request: function() {
            module.set.loading();
            module.request = module.create.request();
            if( module.is.mocked() ) {
              module.mockedXHR = module.create.mockedXHR();
            }
            else {
              module.xhr = module.create.xhr();
            }
            settings.onRequest.call(context, module.request, module.xhr);
          }
        },

        event: {
          trigger: function(event) {
            module.query();
            if(event.type == 'submit' || event.type == 'click') {
              event.preventDefault();
            }
          },
          xhr: {
            always: function() {
              // nothing special
            },
            done: function(response, textStatus, xhr) {
              var
                context            = this,
                elapsedTime        = (new Date().getTime() - requestStartTime),
                timeLeft           = (settings.loadingDuration - elapsedTime),
                translatedResponse = ( $.isFunction(settings.onResponse) )
                  ? settings.onResponse.call(context, $.extend(true, {}, response))
                  : false
              ;
              timeLeft = (timeLeft > 0)
                ? timeLeft
                : 0
              ;
              if(translatedResponse) {
                module.debug('Modified API response in onResponse callback', settings.onResponse, translatedResponse, response);
                response = translatedResponse;
              }
              if(timeLeft > 0) {
                module.debug('Response completed early delaying state change by', timeLeft);
              }
              setTimeout(function() {
                if( module.is.validResponse(response) ) {
                  module.request.resolveWith(context, [response, xhr]);
                }
                else {
                  module.request.rejectWith(context, [xhr, 'invalid']);
                }
              }, timeLeft);
            },
            fail: function(xhr, status, httpMessage) {
              var
                context     = this,
                elapsedTime = (new Date().getTime() - requestStartTime),
                timeLeft    = (settings.loadingDuration - elapsedTime)
              ;
              timeLeft = (timeLeft > 0)
                ? timeLeft
                : 0
              ;
              if(timeLeft > 0) {
                module.debug('Response completed early delaying state change by', timeLeft);
              }
              setTimeout(function() {
                if( module.is.abortedRequest(xhr) ) {
                  module.request.rejectWith(context, [xhr, 'aborted', httpMessage]);
                }
                else {
                  module.request.rejectWith(context, [xhr, 'error', status, httpMessage]);
                }
              }, timeLeft);
            }
          },
          request: {
            done: function(response, xhr) {
              module.debug('Successful API Response', response);
              if(settings.cache === 'local' && url) {
                module.write.cachedResponse(url, response);
                module.debug('Saving server response locally', module.cache);
              }
              settings.onSuccess.call(context, response, $module, xhr);
            },
            complete: function(firstParameter, secondParameter) {
              var
                xhr,
                response
              ;
              // have to guess callback parameters based on request success
              if( module.was.succesful() ) {
                response = firstParameter;
                xhr      = secondParameter;
              }
              else {
                xhr      = firstParameter;
                response = module.get.responseFromXHR(xhr);
              }
              module.remove.loading();
              settings.onComplete.call(context, response, $module, xhr);
            },
            fail: function(xhr, status, httpMessage) {
              var
                // pull response from xhr if available
                response     = module.get.responseFromXHR(xhr),
                errorMessage = module.get.errorFromRequest(response, status, httpMessage)
              ;
              if(status == 'aborted') {
                module.debug('XHR Aborted (Most likely caused by page navigation or CORS Policy)', status, httpMessage);
                settings.onAbort.call(context, status, $module, xhr);
              }
              else if(status == 'invalid') {
                module.debug('JSON did not pass success test. A server-side error has most likely occurred', response);
              }
              else if(status == 'error')  {
                if(xhr !== undefined) {
                  module.debug('XHR produced a server error', status, httpMessage);
                  // make sure we have an error to display to console
                  if( xhr.status != 200 && httpMessage !== undefined && httpMessage !== '') {
                    module.error(error.statusMessage + httpMessage, ajaxSettings.url);
                  }
                  settings.onError.call(context, errorMessage, $module, xhr);
                }
              }

              if(settings.errorDuration && status !== 'aborted') {
                module.debug('Adding error state');
                module.set.error();
                if( module.should.removeError() ) {
                  setTimeout(module.remove.error, settings.errorDuration);
                }
              }
              module.debug('API Request failed', errorMessage, xhr);
              settings.onFailure.call(context, response, $module, xhr);
            }
          }
        },

        create: {

          request: function() {
            // api request promise
            return $.Deferred()
              .always(module.event.request.complete)
              .done(module.event.request.done)
              .fail(module.event.request.fail)
            ;
          },

          mockedXHR: function () {
            var
              // xhr does not simulate these properties of xhr but must return them
              textStatus  = false,
              status      = false,
              httpMessage = false,
              asyncCallback,
              response,
              mockedXHR
            ;

            mockedXHR = $.Deferred()
              .always(module.event.xhr.complete)
              .done(module.event.xhr.done)
              .fail(module.event.xhr.fail)
            ;

            if(settings.mockResponse) {
              if( $.isFunction(settings.mockResponse) ) {
                module.debug('Using mocked callback returning response', settings.mockResponse);
                response = settings.mockResponse.call(context, settings);
              }
              else {
                module.debug('Using specified response', settings.mockResponse);
                response = settings.mockResponse;
              }
              // simulating response
              mockedXHR.resolveWith(context, [ response, textStatus, { responseText: response }]);
            }
            else if( $.isFunction(settings.mockResponseAsync) ) {
              asyncCallback = function(response) {
                module.debug('Async callback returned response', response);

                if(response) {
                  mockedXHR.resolveWith(context, [ response, textStatus, { responseText: response }]);
                }
                else {
                  mockedXHR.rejectWith(context, [{ responseText: response }, status, httpMessage]);
                }
              };
              module.debug('Using async mocked response', settings.mockResponseAsync);
              settings.mockResponseAsync.call(context, settings, asyncCallback);
            }
            return mockedXHR;
          },

          xhr: function() {
            var
              xhr
            ;
            // ajax request promise
            xhr = $.ajax(ajaxSettings)
              .always(module.event.xhr.always)
              .done(module.event.xhr.done)
              .fail(module.event.xhr.fail)
            ;
            module.verbose('Created server request', xhr);
            return xhr;
          }
        },

        set: {
          error: function() {
            module.verbose('Adding error state to element', $context);
            $context.addClass(className.error);
          },
          loading: function() {
            module.verbose('Adding loading state to element', $context);
            $context.addClass(className.loading);
            requestStartTime = new Date().getTime();
          }
        },

        remove: {
          error: function() {
            module.verbose('Removing error state from element', $context);
            $context.removeClass(className.error);
          },
          loading: function() {
            module.verbose('Removing loading state from element', $context);
            $context.removeClass(className.loading);
          }
        },

        get: {
          responseFromXHR: function(xhr) {
            return $.isPlainObject(xhr)
              ? (settings.dataType == 'json' || settings.dataType == 'jsonp')
                ? module.decode.json(xhr.responseText)
                : xhr.responseText
              : false
            ;
          },
          errorFromRequest: function(response, status, httpMessage) {
            return ($.isPlainObject(response) && response.error !== undefined)
              ? response.error // use json error message
              : (settings.error[status] !== undefined) // use server error message
                ? settings.error[status]
                : httpMessage
            ;
          },
          request: function() {
            return module.request || false;
          },
          xhr: function() {
            return module.xhr || false;
          },
          settings: function() {
            var
              runSettings
            ;
            runSettings = settings.beforeSend.call(context, settings);
            if(runSettings) {
              if(runSettings.success !== undefined) {
                module.debug('Legacy success callback detected', runSettings);
                module.error(error.legacyParameters, runSettings.success);
                runSettings.onSuccess = runSettings.success;
              }
              if(runSettings.failure !== undefined) {
                module.debug('Legacy failure callback detected', runSettings);
                module.error(error.legacyParameters, runSettings.failure);
                runSettings.onFailure = runSettings.failure;
              }
              if(runSettings.complete !== undefined) {
                module.debug('Legacy complete callback detected', runSettings);
                module.error(error.legacyParameters, runSettings.complete);
                runSettings.onComplete = runSettings.complete;
              }
            }
            if(runSettings === undefined) {
              module.error(error.noReturnedValue);
            }
            return (runSettings !== undefined)
              ? runSettings
              : settings
            ;
          },
          urlEncodedValue: function(value) {
            var
              decodedValue   = window.decodeURIComponent(value),
              encodedValue   = window.encodeURIComponent(value),
              alreadyEncoded = (decodedValue !== value)
            ;
            if(alreadyEncoded) {
              module.debug('URL value is already encoded, avoiding double encoding', value);
              return value;
            }
            module.verbose('Encoding value using encodeURIComponent', value, encodedValue);
            return encodedValue;
          },
          defaultData: function() {
            var
              data = {}
            ;
            if( !$.isWindow(element) ) {
              if( module.is.input() ) {
                data.value = $module.val();
              }
              else if( !module.is.form() ) {

              }
              else {
                data.text = $module.text();
              }
            }
            return data;
          },
          event: function() {
            if( $.isWindow(element) || settings.on == 'now' ) {
              module.debug('API called without element, no events attached');
              return false;
            }
            else if(settings.on == 'auto') {
              if( $module.is('input') ) {
                return (element.oninput !== undefined)
                  ? 'input'
                  : (element.onpropertychange !== undefined)
                    ? 'propertychange'
                    : 'keyup'
                ;
              }
              else if( $module.is('form') ) {
                return 'submit';
              }
              else {
                return 'click';
              }
            }
            else {
              return settings.on;
            }
          },
          templatedURL: function(action) {
            action = action || $module.data(metadata.action) || settings.action || false;
            url    = $module.data(metadata.url) || settings.url || false;
            if(url) {
              module.debug('Using specified url', url);
              return url;
            }
            if(action) {
              module.debug('Looking up url for action', action, settings.api);
              if(settings.api[action] === undefined && !module.is.mocked()) {
                module.error(error.missingAction, settings.action, settings.api);
                return;
              }
              url = settings.api[action];
            }
            else if( module.is.form() ) {
              url = $module.attr('action') || $context.attr('action') || false;
              module.debug('No url or action specified, defaulting to form action', url);
            }
            return url;
          }
        },

        abort: function() {
          var
            xhr = module.get.xhr()
          ;
          if( xhr && xhr.state() !== 'resolved') {
            module.debug('Cancelling API request');
            xhr.abort();
          }
        },

        // reset state
        reset: function() {
          module.remove.error();
          module.remove.loading();
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                //'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          instance.invoke('destroy');
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.api.settings = {

  name              : 'API',
  namespace         : 'api',

  debug             : false,
  verbose           : false,
  performance       : true,

  // object containing all templates endpoints
  api               : {},

  // whether to cache responses
  cache             : true,

  // whether new requests should abort previous requests
  interruptRequests : true,

  // event binding
  on                : 'auto',

  // context for applying state classes
  stateContext      : false,

  // duration for loading state
  loadingDuration   : 0,

  // whether to hide errors after a period of time
  hideError         : 'auto',

  // duration for error state
  errorDuration     : 2000,

  // whether parameters should be encoded with encodeURIComponent
  encodeParameters  : true,

  // API action to use
  action            : false,

  // templated URL to use
  url               : false,

  // base URL to apply to all endpoints
  base              : '',

  // data that will
  urlData           : {},

  // whether to add default data to url data
  defaultData          : true,

  // whether to serialize closest form
  serializeForm        : false,

  // how long to wait before request should occur
  throttle             : 0,

  // whether to throttle first request or only repeated
  throttleFirstRequest : true,

  // standard ajax settings
  method            : 'get',
  data              : {},
  dataType          : 'json',

  // mock response
  mockResponse      : false,
  mockResponseAsync : false,

  // callbacks before request
  beforeSend  : function(settings) { return settings; },
  beforeXHR   : function(xhr) {},
  onRequest   : function(promise, xhr) {},

  // after request
  onResponse  : false, // function(response) { },

  // response was successful, if JSON passed validation
  onSuccess   : function(response, $module) {},

  // request finished without aborting
  onComplete  : function(response, $module) {},

  // failed JSON success test
  onFailure   : function(response, $module) {},

  // server error
  onError     : function(errorMessage, $module) {},

  // request aborted
  onAbort     : function(errorMessage, $module) {},

  successTest : false,

  // errors
  error : {
    beforeSend        : 'The before send function has aborted the request',
    error             : 'There was an error with your request',
    exitConditions    : 'API Request Aborted. Exit conditions met',
    JSONParse         : 'JSON could not be parsed during error handling',
    legacyParameters  : 'You are using legacy API success callback names',
    method            : 'The method you called is not defined',
    missingAction     : 'API action used but no url was defined',
    missingSerialize  : 'jquery-serialize-object is required to add form data to an existing data object',
    missingURL        : 'No URL specified for api event',
    noReturnedValue   : 'The beforeSend callback must return a settings object, beforeSend ignored.',
    noStorage         : 'Caching responses locally requires session storage',
    parseError        : 'There was an error parsing your request',
    requiredParameter : 'Missing a required URL parameter: ',
    statusMessage     : 'Server gave an error: ',
    timeout           : 'Your request timed out'
  },

  regExp  : {
    required : /\{\$*[A-z0-9]+\}/g,
    optional : /\{\/\$*[A-z0-9]+\}/g,
  },

  className: {
    loading : 'loading',
    error   : 'error'
  },

  selector: {
    disabled : '.disabled',
    form      : 'form'
  },

  metadata: {
    action  : 'action',
    url     : 'url'
  }
};



})( jQuery, window , document );

/*!
 * # Semantic UI 2.1.4 - State
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2015 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.fn.state = function(parameters) {
  var
    $allModules     = $(this),

    moduleSelector  = $allModules.selector || '',

    hasTouch        = ('ontouchstart' in document.documentElement),
    time            = new Date().getTime(),
    performance     = [],

    query           = arguments[0],
    methodInvoked   = (typeof query == 'string'),
    queryArguments  = [].slice.call(arguments, 1),

    returnedValue
  ;
  $allModules
    .each(function() {
      var
        settings          = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.state.settings, parameters)
          : $.extend({}, $.fn.state.settings),

        error           = settings.error,
        metadata        = settings.metadata,
        className       = settings.className,
        namespace       = settings.namespace,
        states          = settings.states,
        text            = settings.text,

        eventNamespace  = '.' + namespace,
        moduleNamespace = namespace + '-module',

        $module         = $(this),

        element         = this,
        instance        = $module.data(moduleNamespace),

        module
      ;
      module = {

        initialize: function() {
          module.verbose('Initializing module');

          // allow module to guess desired state based on element
          if(settings.automatic) {
            module.add.defaults();
          }

          // bind events with delegated events
          if(settings.context && moduleSelector !== '') {
            $(settings.context)
              .on(moduleSelector, 'mouseenter' + eventNamespace, module.change.text)
              .on(moduleSelector, 'mouseleave' + eventNamespace, module.reset.text)
              .on(moduleSelector, 'click'      + eventNamespace, module.toggle.state)
            ;
          }
          else {
            $module
              .on('mouseenter' + eventNamespace, module.change.text)
              .on('mouseleave' + eventNamespace, module.reset.text)
              .on('click'      + eventNamespace, module.toggle.state)
            ;
          }
          module.instantiate();
        },

        instantiate: function() {
          module.verbose('Storing instance of module', module);
          instance = module;
          $module
            .data(moduleNamespace, module)
          ;
        },

        destroy: function() {
          module.verbose('Destroying previous module', instance);
          $module
            .off(eventNamespace)
            .removeData(moduleNamespace)
          ;
        },

        refresh: function() {
          module.verbose('Refreshing selector cache');
          $module = $(element);
        },

        add: {
          defaults: function() {
            var
              userStates = parameters && $.isPlainObject(parameters.states)
                ? parameters.states
                : {}
            ;
            $.each(settings.defaults, function(type, typeStates) {
              if( module.is[type] !== undefined && module.is[type]() ) {
                module.verbose('Adding default states', type, element);
                $.extend(settings.states, typeStates, userStates);
              }
            });
          }
        },

        is: {

          active: function() {
            return $module.hasClass(className.active);
          },
          loading: function() {
            return $module.hasClass(className.loading);
          },
          inactive: function() {
            return !( $module.hasClass(className.active) );
          },
          state: function(state) {
            if(className[state] === undefined) {
              return false;
            }
            return $module.hasClass( className[state] );
          },

          enabled: function() {
            return !( $module.is(settings.filter.active) );
          },
          disabled: function() {
            return ( $module.is(settings.filter.active) );
          },
          textEnabled: function() {
            return !( $module.is(settings.filter.text) );
          },

          // definitions for automatic type detection
          button: function() {
            return $module.is('.button:not(a, .submit)');
          },
          input: function() {
            return $module.is('input');
          },
          progress: function() {
            return $module.is('.ui.progress');
          }
        },

        allow: function(state) {
          module.debug('Now allowing state', state);
          states[state] = true;
        },
        disallow: function(state) {
          module.debug('No longer allowing', state);
          states[state] = false;
        },

        allows: function(state) {
          return states[state] || false;
        },

        enable: function() {
          $module.removeClass(className.disabled);
        },

        disable: function() {
          $module.addClass(className.disabled);
        },

        setState: function(state) {
          if(module.allows(state)) {
            $module.addClass( className[state] );
          }
        },

        removeState: function(state) {
          if(module.allows(state)) {
            $module.removeClass( className[state] );
          }
        },

        toggle: {
          state: function() {
            var
              apiRequest,
              requestCancelled
            ;
            if( module.allows('active') && module.is.enabled() ) {
              module.refresh();
              if($.fn.api !== undefined) {
                apiRequest       = $module.api('get request');
                requestCancelled = $module.api('was cancelled');
                if( requestCancelled ) {
                  module.debug('API Request cancelled by beforesend');
                  settings.activateTest   = function(){ return false; };
                  settings.deactivateTest = function(){ return false; };
                }
                else if(apiRequest) {
                  module.listenTo(apiRequest);
                  return;
                }
              }
              module.change.state();
            }
          }
        },

        listenTo: function(apiRequest) {
          module.debug('API request detected, waiting for state signal', apiRequest);
          if(apiRequest) {
            if(text.loading) {
              module.update.text(text.loading);
            }
            $.when(apiRequest)
              .then(function() {
                if(apiRequest.state() == 'resolved') {
                  module.debug('API request succeeded');
                  settings.activateTest   = function(){ return true; };
                  settings.deactivateTest = function(){ return true; };
                }
                else {
                  module.debug('API request failed');
                  settings.activateTest   = function(){ return false; };
                  settings.deactivateTest = function(){ return false; };
                }
                module.change.state();
              })
            ;
          }
        },

        // checks whether active/inactive state can be given
        change: {

          state: function() {
            module.debug('Determining state change direction');
            // inactive to active change
            if( module.is.inactive() ) {
              module.activate();
            }
            else {
              module.deactivate();
            }
            if(settings.sync) {
              module.sync();
            }
            settings.onChange.call(element);
          },

          text: function() {
            if( module.is.textEnabled() ) {
              if(module.is.disabled() ) {
                module.verbose('Changing text to disabled text', text.hover);
                module.update.text(text.disabled);
              }
              else if( module.is.active() ) {
                if(text.hover) {
                  module.verbose('Changing text to hover text', text.hover);
                  module.update.text(text.hover);
                }
                else if(text.deactivate) {
                  module.verbose('Changing text to deactivating text', text.deactivate);
                  module.update.text(text.deactivate);
                }
              }
              else {
                if(text.hover) {
                  module.verbose('Changing text to hover text', text.hover);
                  module.update.text(text.hover);
                }
                else if(text.activate){
                  module.verbose('Changing text to activating text', text.activate);
                  module.update.text(text.activate);
                }
              }
            }
          }

        },

        activate: function() {
          if( settings.activateTest.call(element) ) {
            module.debug('Setting state to active');
            $module
              .addClass(className.active)
            ;
            module.update.text(text.active);
            settings.onActivate.call(element);
          }
        },

        deactivate: function() {
          if( settings.deactivateTest.call(element) ) {
            module.debug('Setting state to inactive');
            $module
              .removeClass(className.active)
            ;
            module.update.text(text.inactive);
            settings.onDeactivate.call(element);
          }
        },

        sync: function() {
          module.verbose('Syncing other buttons to current state');
          if( module.is.active() ) {
            $allModules
              .not($module)
                .state('activate');
          }
          else {
            $allModules
              .not($module)
                .state('deactivate')
            ;
          }
        },

        get: {
          text: function() {
            return (settings.selector.text)
              ? $module.find(settings.selector.text).text()
              : $module.html()
            ;
          },
          textFor: function(state) {
            return text[state] || false;
          }
        },

        flash: {
          text: function(text, duration, callback) {
            var
              previousText = module.get.text()
            ;
            module.debug('Flashing text message', text, duration);
            text     = text     || settings.text.flash;
            duration = duration || settings.flashDuration;
            callback = callback || function() {};
            module.update.text(text);
            setTimeout(function(){
              module.update.text(previousText);
              callback.call(element);
            }, duration);
          }
        },

        reset: {
          // on mouseout sets text to previous value
          text: function() {
            var
              activeText   = text.active   || $module.data(metadata.storedText),
              inactiveText = text.inactive || $module.data(metadata.storedText)
            ;
            if( module.is.textEnabled() ) {
              if( module.is.active() && activeText) {
                module.verbose('Resetting active text', activeText);
                module.update.text(activeText);
              }
              else if(inactiveText) {
                module.verbose('Resetting inactive text', activeText);
                module.update.text(inactiveText);
              }
            }
          }
        },

        update: {
          text: function(text) {
            var
              currentText = module.get.text()
            ;
            if(text && text !== currentText) {
              module.debug('Updating text', text);
              if(settings.selector.text) {
                $module
                  .data(metadata.storedText, text)
                  .find(settings.selector.text)
                    .text(text)
                ;
              }
              else {
                $module
                  .data(metadata.storedText, text)
                  .html(text)
                ;
              }
            }
            else {
              module.debug('Text is already set, ignoring update', text);
            }
          }
        },

        setting: function(name, value) {
          module.debug('Changing setting', name, value);
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          instance.invoke('destroy');
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.state.settings = {

  // module info
  name           : 'State',

  // debug output
  debug          : false,

  // verbose debug output
  verbose        : false,

  // namespace for events
  namespace      : 'state',

  // debug data includes performance
  performance    : true,

  // callback occurs on state change
  onActivate     : function() {},
  onDeactivate   : function() {},
  onChange       : function() {},

  // state test functions
  activateTest   : function() { return true; },
  deactivateTest : function() { return true; },

  // whether to automatically map default states
  automatic      : true,

  // activate / deactivate changes all elements instantiated at same time
  sync           : false,

  // default flash text duration, used for temporarily changing text of an element
  flashDuration  : 1000,

  // selector filter
  filter     : {
    text   : '.loading, .disabled',
    active : '.disabled'
  },

  context    : false,

  // error
  error: {
    beforeSend : 'The before send function has cancelled state change',
    method     : 'The method you called is not defined.'
  },

  // metadata
  metadata: {
    promise    : 'promise',
    storedText : 'stored-text'
  },

  // change class on state
  className: {
    active   : 'active',
    disabled : 'disabled',
    error    : 'error',
    loading  : 'loading',
    success  : 'success',
    warning  : 'warning'
  },

  selector: {
    // selector for text node
    text: false
  },

  defaults : {
    input: {
      disabled : true,
      loading  : true,
      active   : true
    },
    button: {
      disabled : true,
      loading  : true,
      active   : true,
    },
    progress: {
      active   : true,
      success  : true,
      warning  : true,
      error    : true
    }
  },

  states     : {
    active   : true,
    disabled : true,
    error    : true,
    loading  : true,
    success  : true,
    warning  : true
  },

  text     : {
    disabled   : false,
    flash      : false,
    hover      : false,
    active     : false,
    inactive   : false,
    activate   : false,
    deactivate : false
  }

};



})( jQuery, window , document );

/*!
 * # Semantic UI 2.1.4 - Visibility
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Copyright 2015 Contributors
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

;(function ( $, window, document, undefined ) {

"use strict";

$.fn.visibility = function(parameters) {
  var
    $allModules    = $(this),
    moduleSelector = $allModules.selector || '',

    time           = new Date().getTime(),
    performance    = [],

    query          = arguments[0],
    methodInvoked  = (typeof query == 'string'),
    queryArguments = [].slice.call(arguments, 1),
    returnedValue
  ;

  $allModules
    .each(function() {
      var
        settings        = ( $.isPlainObject(parameters) )
          ? $.extend(true, {}, $.fn.visibility.settings, parameters)
          : $.extend({}, $.fn.visibility.settings),

        className       = settings.className,
        namespace       = settings.namespace,
        error           = settings.error,
        metadata        = settings.metadata,

        eventNamespace  = '.' + namespace,
        moduleNamespace = 'module-' + namespace,

        $window         = $(window),

        $module         = $(this),
        $context        = $(settings.context),

        $placeholder,

        selector        = $module.selector || '',
        instance        = $module.data(moduleNamespace),

        requestAnimationFrame = window.requestAnimationFrame
          || window.mozRequestAnimationFrame
          || window.webkitRequestAnimationFrame
          || window.msRequestAnimationFrame
          || function(callback) { setTimeout(callback, 0); },

        element         = this,
        disabled        = false,

        observer,
        module
      ;

      module = {

        initialize: function() {
          module.debug('Initializing', settings);

          module.setup.cache();

          if( module.should.trackChanges() ) {

            if(settings.type == 'image') {
              module.setup.image();
            }
            if(settings.type == 'fixed') {
              module.setup.fixed();
            }

            if(settings.observeChanges) {
              module.observeChanges();
            }
            module.bind.events();
          }

          module.save.position();
          if( !module.is.visible() ) {
            module.error(error.visible, $module);
          }

          if(settings.initialCheck) {
            module.checkVisibility();
          }
          module.instantiate();
        },

        instantiate: function() {
          module.debug('Storing instance', module);
          $module
            .data(moduleNamespace, module)
          ;
          instance = module;
        },

        destroy: function() {
          module.verbose('Destroying previous module');
          if(observer) {
            observer.disconnect();
          }
          $window
            .off('load'   + eventNamespace, module.event.load)
            .off('resize' + eventNamespace, module.event.resize)
          ;
          $context
            .off('scrollchange' + eventNamespace, module.event.scrollchange)
          ;
          $module
            .off(eventNamespace)
            .removeData(moduleNamespace)
          ;
        },

        observeChanges: function() {
          if('MutationObserver' in window) {
            observer = new MutationObserver(function(mutations) {
              module.verbose('DOM tree modified, updating visibility calculations');
              module.timer = setTimeout(function() {
                module.verbose('DOM tree modified, updating sticky menu');
                module.refresh();
              }, 100);
            });
            observer.observe(element, {
              childList : true,
              subtree   : true
            });
            module.debug('Setting up mutation observer', observer);
          }
        },

        bind: {
          events: function() {
            module.verbose('Binding visibility events to scroll and resize');
            if(settings.refreshOnLoad) {
              $window
                .on('load'   + eventNamespace, module.event.load)
              ;
            }
            $window
              .on('resize' + eventNamespace, module.event.resize)
            ;
            // pub/sub pattern
            $context
              .off('scroll'      + eventNamespace)
              .on('scroll'       + eventNamespace, module.event.scroll)
              .on('scrollchange' + eventNamespace, module.event.scrollchange)
            ;
          }
        },

        event: {
          resize: function() {
            module.debug('Window resized');
            if(settings.refreshOnResize) {
              requestAnimationFrame(module.refresh);
            }
          },
          load: function() {
            module.debug('Page finished loading');
            requestAnimationFrame(module.refresh);
          },
          // publishes scrollchange event on one scroll
          scroll: function() {
            if(settings.throttle) {
              clearTimeout(module.timer);
              module.timer = setTimeout(function() {
                $context.triggerHandler('scrollchange' + eventNamespace, [ $context.scrollTop() ]);
              }, settings.throttle);
            }
            else {
              requestAnimationFrame(function() {
                $context.triggerHandler('scrollchange' + eventNamespace, [ $context.scrollTop() ]);
              });
            }
          },
          // subscribes to scrollchange
          scrollchange: function(event, scrollPosition) {
            module.checkVisibility(scrollPosition);
          },
        },

        precache: function(images, callback) {
          if (!(images instanceof Array)) {
            images = [images];
          }
          var
            imagesLength  = images.length,
            loadedCounter = 0,
            cache         = [],
            cacheImage    = document.createElement('img'),
            handleLoad    = function() {
              loadedCounter++;
              if (loadedCounter >= images.length) {
                if ($.isFunction(callback)) {
                  callback();
                }
              }
            }
          ;
          while (imagesLength--) {
            cacheImage         = document.createElement('img');
            cacheImage.onload  = handleLoad;
            cacheImage.onerror = handleLoad;
            cacheImage.src     = images[imagesLength];
            cache.push(cacheImage);
          }
        },

        enableCallbacks: function() {
          module.debug('Allowing callbacks to occur');
          disabled = false;
        },

        disableCallbacks: function() {
          module.debug('Disabling all callbacks temporarily');
          disabled = true;
        },

        should: {
          trackChanges: function() {
            if(methodInvoked) {
              module.debug('One time query, no need to bind events');
              return false;
            }
            module.debug('Callbacks being attached');
            return true;
          }
        },

        setup: {
          cache: function() {
            module.cache = {
              occurred : {},
              screen   : {},
              element  : {},
            };
          },
          image: function() {
            var
              src = $module.data(metadata.src)
            ;
            if(src) {
              module.verbose('Lazy loading image', src);
              settings.once           = true;
              settings.observeChanges = false;

              // show when top visible
              settings.onOnScreen = function() {
                module.debug('Image on screen', element);
                module.precache(src, function() {
                  module.set.image(src);
                });
              };
            }
          },
          fixed: function() {
            module.debug('Setting up fixed');
            settings.once           = false;
            settings.observeChanges = false;
            settings.initialCheck   = true;
            settings.refreshOnLoad  = true;
            if(!parameters.transition) {
              settings.transition = false;
            }
            module.create.placeholder();
            module.debug('Added placeholder', $placeholder);
            settings.onTopPassed = function() {
              module.debug('Element passed, adding fixed position', $module);
              module.show.placeholder();
              module.set.fixed();
              if(settings.transition) {
                if($.fn.transition !== undefined) {
                  $module.transition(settings.transition, settings.duration);
                }
              }
            };
            settings.onTopPassedReverse = function() {
              module.debug('Element returned to position, removing fixed', $module);
              module.hide.placeholder();
              module.remove.fixed();
            };
          }
        },

        create: {
          placeholder: function() {
            module.verbose('Creating fixed position placeholder');
            $placeholder = $module
              .clone(false)
              .css('display', 'none')
              .addClass(className.placeholder)
              .insertAfter($module)
            ;
          }
        },

        show: {
          placeholder: function() {
            module.verbose('Showing placeholder');
            $placeholder
              .css('display', 'block')
              .css('visibility', 'hidden')
            ;
          }
        },
        hide: {
          placeholder: function() {
            module.verbose('Hiding placeholder');
            $placeholder
              .css('display', 'none')
              .css('visibility', '')
            ;
          }
        },

        set: {
          fixed: function() {
            module.verbose('Setting element to fixed position');
            $module
              .addClass(className.fixed)
              .css({
                position : 'fixed',
                top      : settings.offset + 'px',
                left     : 'auto',
                zIndex   : '1'
              })
            ;
          },
          image: function(src) {
            $module
              .attr('src', src)
            ;
            if(settings.transition) {
              if( $.fn.transition !== undefined ) {
                $module.transition(settings.transition, settings.duration);
              }
              else {
                $module.fadeIn(settings.duration);
              }
            }
            else {
              $module.show();
            }
          }
        },

        is: {
          onScreen: function() {
            var
              calculations   = module.get.elementCalculations()
            ;
            return calculations.onScreen;
          },
          offScreen: function() {
            var
              calculations   = module.get.elementCalculations()
            ;
            return calculations.offScreen;
          },
          visible: function() {
            if(module.cache && module.cache.element) {
              return !(module.cache.element.width === 0 && module.cache.element.offset.top === 0);
            }
            return false;
          }
        },

        refresh: function() {
          module.debug('Refreshing constants (width/height)');
          if(settings.type == 'fixed') {
            module.remove.fixed();
            module.remove.occurred();
          }
          module.reset();
          module.save.position();
          if(settings.checkOnRefresh) {
            module.checkVisibility();
          }
          settings.onRefresh.call(element);
        },

        reset: function() {
          module.verbose('Reseting all cached values');
          if( $.isPlainObject(module.cache) ) {
            module.cache.screen = {};
            module.cache.element = {};
          }
        },

        checkVisibility: function(scroll) {
          module.verbose('Checking visibility of element', module.cache.element);

          if( !disabled && module.is.visible() ) {

            // save scroll position
            module.save.scroll(scroll);

            // update calculations derived from scroll
            module.save.calculations();

            // percentage
            module.passed();

            // reverse (must be first)
            module.passingReverse();
            module.topVisibleReverse();
            module.bottomVisibleReverse();
            module.topPassedReverse();
            module.bottomPassedReverse();

            // one time
            module.onScreen();
            module.offScreen();
            module.passing();
            module.topVisible();
            module.bottomVisible();
            module.topPassed();
            module.bottomPassed();

            // on update callback
            if(settings.onUpdate) {
              settings.onUpdate.call(element, module.get.elementCalculations());
            }
          }
        },

        passed: function(amount, newCallback) {
          var
            calculations   = module.get.elementCalculations(),
            amountInPixels
          ;
          // assign callback
          if(amount && newCallback) {
            settings.onPassed[amount] = newCallback;
          }
          else if(amount !== undefined) {
            return (module.get.pixelsPassed(amount) > calculations.pixelsPassed);
          }
          else if(calculations.passing) {
            $.each(settings.onPassed, function(amount, callback) {
              if(calculations.bottomVisible || calculations.pixelsPassed > module.get.pixelsPassed(amount)) {
                module.execute(callback, amount);
              }
              else if(!settings.once) {
                module.remove.occurred(callback);
              }
            });
          }
        },

        onScreen: function(newCallback) {
          var
            calculations = module.get.elementCalculations(),
            callback     = newCallback || settings.onOnScreen,
            callbackName = 'onScreen'
          ;
          if(newCallback) {
            module.debug('Adding callback for onScreen', newCallback);
            settings.onOnScreen = newCallback;
          }
          if(calculations.onScreen) {
            module.execute(callback, callbackName);
          }
          else if(!settings.once) {
            module.remove.occurred(callbackName);
          }
          if(newCallback !== undefined) {
            return calculations.onOnScreen;
          }
        },

        offScreen: function(newCallback) {
          var
            calculations = module.get.elementCalculations(),
            callback     = newCallback || settings.onOffScreen,
            callbackName = 'offScreen'
          ;
          if(newCallback) {
            module.debug('Adding callback for offScreen', newCallback);
            settings.onOffScreen = newCallback;
          }
          if(calculations.offScreen) {
            module.execute(callback, callbackName);
          }
          else if(!settings.once) {
            module.remove.occurred(callbackName);
          }
          if(newCallback !== undefined) {
            return calculations.onOffScreen;
          }
        },

        passing: function(newCallback) {
          var
            calculations = module.get.elementCalculations(),
            callback     = newCallback || settings.onPassing,
            callbackName = 'passing'
          ;
          if(newCallback) {
            module.debug('Adding callback for passing', newCallback);
            settings.onPassing = newCallback;
          }
          if(calculations.passing) {
            module.execute(callback, callbackName);
          }
          else if(!settings.once) {
            module.remove.occurred(callbackName);
          }
          if(newCallback !== undefined) {
            return calculations.passing;
          }
        },


        topVisible: function(newCallback) {
          var
            calculations = module.get.elementCalculations(),
            callback     = newCallback || settings.onTopVisible,
            callbackName = 'topVisible'
          ;
          if(newCallback) {
            module.debug('Adding callback for top visible', newCallback);
            settings.onTopVisible = newCallback;
          }
          if(calculations.topVisible) {
            module.execute(callback, callbackName);
          }
          else if(!settings.once) {
            module.remove.occurred(callbackName);
          }
          if(newCallback === undefined) {
            return calculations.topVisible;
          }
        },

        bottomVisible: function(newCallback) {
          var
            calculations = module.get.elementCalculations(),
            callback     = newCallback || settings.onBottomVisible,
            callbackName = 'bottomVisible'
          ;
          if(newCallback) {
            module.debug('Adding callback for bottom visible', newCallback);
            settings.onBottomVisible = newCallback;
          }
          if(calculations.bottomVisible) {
            module.execute(callback, callbackName);
          }
          else if(!settings.once) {
            module.remove.occurred(callbackName);
          }
          if(newCallback === undefined) {
            return calculations.bottomVisible;
          }
        },

        topPassed: function(newCallback) {
          var
            calculations = module.get.elementCalculations(),
            callback     = newCallback || settings.onTopPassed,
            callbackName = 'topPassed'
          ;
          if(newCallback) {
            module.debug('Adding callback for top passed', newCallback);
            settings.onTopPassed = newCallback;
          }
          if(calculations.topPassed) {
            module.execute(callback, callbackName);
          }
          else if(!settings.once) {
            module.remove.occurred(callbackName);
          }
          if(newCallback === undefined) {
            return calculations.topPassed;
          }
        },

        bottomPassed: function(newCallback) {
          var
            calculations = module.get.elementCalculations(),
            callback     = newCallback || settings.onBottomPassed,
            callbackName = 'bottomPassed'
          ;
          if(newCallback) {
            module.debug('Adding callback for bottom passed', newCallback);
            settings.onBottomPassed = newCallback;
          }
          if(calculations.bottomPassed) {
            module.execute(callback, callbackName);
          }
          else if(!settings.once) {
            module.remove.occurred(callbackName);
          }
          if(newCallback === undefined) {
            return calculations.bottomPassed;
          }
        },

        passingReverse: function(newCallback) {
          var
            calculations = module.get.elementCalculations(),
            callback     = newCallback || settings.onPassingReverse,
            callbackName = 'passingReverse'
          ;
          if(newCallback) {
            module.debug('Adding callback for passing reverse', newCallback);
            settings.onPassingReverse = newCallback;
          }
          if(!calculations.passing) {
            if(module.get.occurred('passing')) {
              module.execute(callback, callbackName);
            }
          }
          else if(!settings.once) {
            module.remove.occurred(callbackName);
          }
          if(newCallback !== undefined) {
            return !calculations.passing;
          }
        },


        topVisibleReverse: function(newCallback) {
          var
            calculations = module.get.elementCalculations(),
            callback     = newCallback || settings.onTopVisibleReverse,
            callbackName = 'topVisibleReverse'
          ;
          if(newCallback) {
            module.debug('Adding callback for top visible reverse', newCallback);
            settings.onTopVisibleReverse = newCallback;
          }
          if(!calculations.topVisible) {
            if(module.get.occurred('topVisible')) {
              module.execute(callback, callbackName);
            }
          }
          else if(!settings.once) {
            module.remove.occurred(callbackName);
          }
          if(newCallback === undefined) {
            return !calculations.topVisible;
          }
        },

        bottomVisibleReverse: function(newCallback) {
          var
            calculations = module.get.elementCalculations(),
            callback     = newCallback || settings.onBottomVisibleReverse,
            callbackName = 'bottomVisibleReverse'
          ;
          if(newCallback) {
            module.debug('Adding callback for bottom visible reverse', newCallback);
            settings.onBottomVisibleReverse = newCallback;
          }
          if(!calculations.bottomVisible) {
            if(module.get.occurred('bottomVisible')) {
              module.execute(callback, callbackName);
            }
          }
          else if(!settings.once) {
            module.remove.occurred(callbackName);
          }
          if(newCallback === undefined) {
            return !calculations.bottomVisible;
          }
        },

        topPassedReverse: function(newCallback) {
          var
            calculations = module.get.elementCalculations(),
            callback     = newCallback || settings.onTopPassedReverse,
            callbackName = 'topPassedReverse'
          ;
          if(newCallback) {
            module.debug('Adding callback for top passed reverse', newCallback);
            settings.onTopPassedReverse = newCallback;
          }
          if(!calculations.topPassed) {
            if(module.get.occurred('topPassed')) {
              module.execute(callback, callbackName);
            }
          }
          else if(!settings.once) {
            module.remove.occurred(callbackName);
          }
          if(newCallback === undefined) {
            return !calculations.onTopPassed;
          }
        },

        bottomPassedReverse: function(newCallback) {
          var
            calculations = module.get.elementCalculations(),
            callback     = newCallback || settings.onBottomPassedReverse,
            callbackName = 'bottomPassedReverse'
          ;
          if(newCallback) {
            module.debug('Adding callback for bottom passed reverse', newCallback);
            settings.onBottomPassedReverse = newCallback;
          }
          if(!calculations.bottomPassed) {
            if(module.get.occurred('bottomPassed')) {
              module.execute(callback, callbackName);
            }
          }
          else if(!settings.once) {
            module.remove.occurred(callbackName);
          }
          if(newCallback === undefined) {
            return !calculations.bottomPassed;
          }
        },

        execute: function(callback, callbackName) {
          var
            calculations = module.get.elementCalculations(),
            screen       = module.get.screenCalculations()
          ;
          callback = callback || false;
          if(callback) {
            if(settings.continuous) {
              module.debug('Callback being called continuously', callbackName, calculations);
              callback.call(element, calculations, screen);
            }
            else if(!module.get.occurred(callbackName)) {
              module.debug('Conditions met', callbackName, calculations);
              callback.call(element, calculations, screen);
            }
          }
          module.save.occurred(callbackName);
        },

        remove: {
          fixed: function() {
            module.debug('Removing fixed position');
            $module
              .removeClass(className.fixed)
              .css({
                position : '',
                top      : '',
                left     : '',
                zIndex   : ''
              })
            ;
          },
          occurred: function(callback) {
            if(callback) {
              var
                occurred = module.cache.occurred
              ;
              if(occurred[callback] !== undefined && occurred[callback] === true) {
                module.debug('Callback can now be called again', callback);
                module.cache.occurred[callback] = false;
              }
            }
            else {
              module.cache.occurred = {};
            }
          }
        },

        save: {
          calculations: function() {
            module.verbose('Saving all calculations necessary to determine positioning');
            module.save.direction();
            module.save.screenCalculations();
            module.save.elementCalculations();
          },
          occurred: function(callback) {
            if(callback) {
              if(module.cache.occurred[callback] === undefined || (module.cache.occurred[callback] !== true)) {
                module.verbose('Saving callback occurred', callback);
                module.cache.occurred[callback] = true;
              }
            }
          },
          scroll: function(scrollPosition) {
            scrollPosition      = scrollPosition + settings.offset || $context.scrollTop() + settings.offset;
            module.cache.scroll = scrollPosition;
          },
          direction: function() {
            var
              scroll     = module.get.scroll(),
              lastScroll = module.get.lastScroll(),
              direction
            ;
            if(scroll > lastScroll && lastScroll) {
              direction = 'down';
            }
            else if(scroll < lastScroll && lastScroll) {
              direction = 'up';
            }
            else {
              direction = 'static';
            }
            module.cache.direction = direction;
            return module.cache.direction;
          },
          elementPosition: function() {
            var
              element = module.cache.element,
              screen  = module.get.screenSize()
            ;
            module.verbose('Saving element position');
            // (quicker than $.extend)
            element.fits          = (element.height < screen.height);
            element.offset        = $module.offset();
            element.width         = $module.outerWidth();
            element.height        = $module.outerHeight();
            // store
            module.cache.element = element;
            return element;
          },
          elementCalculations: function() {
            var
              screen     = module.get.screenCalculations(),
              element    = module.get.elementPosition()
            ;
            // offset
            if(settings.includeMargin) {
              element.margin        = {};
              element.margin.top    = parseInt($module.css('margin-top'), 10);
              element.margin.bottom = parseInt($module.css('margin-bottom'), 10);
              element.top    = element.offset.top - element.margin.top;
              element.bottom = element.offset.top + element.height + element.margin.bottom;
            }
            else {
              element.top    = element.offset.top;
              element.bottom = element.offset.top + element.height;
            }

            // visibility
            element.topVisible       = (screen.bottom >= element.top);
            element.topPassed        = (screen.top >= element.top);
            element.bottomVisible    = (screen.bottom >= element.bottom);
            element.bottomPassed     = (screen.top >= element.bottom);
            element.pixelsPassed     = 0;
            element.percentagePassed = 0;

            // meta calculations
            element.onScreen  = (element.topVisible && !element.bottomPassed);
            element.passing   = (element.topPassed && !element.bottomPassed);
            element.offScreen = (!element.onScreen);

            // passing calculations
            if(element.passing) {
              element.pixelsPassed     = (screen.top - element.top);
              element.percentagePassed = (screen.top - element.top) / element.height;
            }
            module.cache.element = element;
            module.verbose('Updated element calculations', element);
            return element;
          },
          screenCalculations: function() {
            var
              scroll = module.get.scroll()
            ;
            module.save.direction();
            module.cache.screen.top    = scroll;
            module.cache.screen.bottom = scroll + module.cache.screen.height;
            return module.cache.screen;
          },
          screenSize: function() {
            module.verbose('Saving window position');
            module.cache.screen = {
              height: $context.height()
            };
          },
          position: function() {
            module.save.screenSize();
            module.save.elementPosition();
          }
        },

        get: {
          pixelsPassed: function(amount) {
            var
              element = module.get.elementCalculations()
            ;
            if(amount.search('%') > -1) {
              return ( element.height * (parseInt(amount, 10) / 100) );
            }
            return parseInt(amount, 10);
          },
          occurred: function(callback) {
            return (module.cache.occurred !== undefined)
              ? module.cache.occurred[callback] || false
              : false
            ;
          },
          direction: function() {
            if(module.cache.direction === undefined) {
              module.save.direction();
            }
            return module.cache.direction;
          },
          elementPosition: function() {
            if(module.cache.element === undefined) {
              module.save.elementPosition();
            }
            return module.cache.element;
          },
          elementCalculations: function() {
            if(module.cache.element === undefined) {
              module.save.elementCalculations();
            }
            return module.cache.element;
          },
          screenCalculations: function() {
            if(module.cache.screen === undefined) {
              module.save.screenCalculations();
            }
            return module.cache.screen;
          },
          screenSize: function() {
            if(module.cache.screen === undefined) {
              module.save.screenSize();
            }
            return module.cache.screen;
          },
          scroll: function() {
            if(module.cache.scroll === undefined) {
              module.save.scroll();
            }
            return module.cache.scroll;
          },
          lastScroll: function() {
            if(module.cache.screen === undefined) {
              module.debug('First scroll event, no last scroll could be found');
              return false;
            }
            return module.cache.screen.top;
          }
        },

        setting: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, settings, name);
          }
          else if(value !== undefined) {
            settings[name] = value;
          }
          else {
            return settings[name];
          }
        },
        internal: function(name, value) {
          if( $.isPlainObject(name) ) {
            $.extend(true, module, name);
          }
          else if(value !== undefined) {
            module[name] = value;
          }
          else {
            return module[name];
          }
        },
        debug: function() {
          if(settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.debug = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.debug.apply(console, arguments);
            }
          }
        },
        verbose: function() {
          if(settings.verbose && settings.debug) {
            if(settings.performance) {
              module.performance.log(arguments);
            }
            else {
              module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ':');
              module.verbose.apply(console, arguments);
            }
          }
        },
        error: function() {
          module.error = Function.prototype.bind.call(console.error, console, settings.name + ':');
          module.error.apply(console, arguments);
        },
        performance: {
          log: function(message) {
            var
              currentTime,
              executionTime,
              previousTime
            ;
            if(settings.performance) {
              currentTime   = new Date().getTime();
              previousTime  = time || currentTime;
              executionTime = currentTime - previousTime;
              time          = currentTime;
              performance.push({
                'Name'           : message[0],
                'Arguments'      : [].slice.call(message, 1) || '',
                'Element'        : element,
                'Execution Time' : executionTime
              });
            }
            clearTimeout(module.performance.timer);
            module.performance.timer = setTimeout(module.performance.display, 500);
          },
          display: function() {
            var
              title = settings.name + ':',
              totalTime = 0
            ;
            time = false;
            clearTimeout(module.performance.timer);
            $.each(performance, function(index, data) {
              totalTime += data['Execution Time'];
            });
            title += ' ' + totalTime + 'ms';
            if(moduleSelector) {
              title += ' \'' + moduleSelector + '\'';
            }
            if( (console.group !== undefined || console.table !== undefined) && performance.length > 0) {
              console.groupCollapsed(title);
              if(console.table) {
                console.table(performance);
              }
              else {
                $.each(performance, function(index, data) {
                  console.log(data['Name'] + ': ' + data['Execution Time']+'ms');
                });
              }
              console.groupEnd();
            }
            performance = [];
          }
        },
        invoke: function(query, passedArguments, context) {
          var
            object = instance,
            maxDepth,
            found,
            response
          ;
          passedArguments = passedArguments || queryArguments;
          context         = element         || context;
          if(typeof query == 'string' && object !== undefined) {
            query    = query.split(/[\. ]/);
            maxDepth = query.length - 1;
            $.each(query, function(depth, value) {
              var camelCaseValue = (depth != maxDepth)
                ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                : query
              ;
              if( $.isPlainObject( object[camelCaseValue] ) && (depth != maxDepth) ) {
                object = object[camelCaseValue];
              }
              else if( object[camelCaseValue] !== undefined ) {
                found = object[camelCaseValue];
                return false;
              }
              else if( $.isPlainObject( object[value] ) && (depth != maxDepth) ) {
                object = object[value];
              }
              else if( object[value] !== undefined ) {
                found = object[value];
                return false;
              }
              else {
                module.error(error.method, query);
                return false;
              }
            });
          }
          if ( $.isFunction( found ) ) {
            response = found.apply(context, passedArguments);
          }
          else if(found !== undefined) {
            response = found;
          }
          if($.isArray(returnedValue)) {
            returnedValue.push(response);
          }
          else if(returnedValue !== undefined) {
            returnedValue = [returnedValue, response];
          }
          else if(response !== undefined) {
            returnedValue = response;
          }
          return found;
        }
      };

      if(methodInvoked) {
        if(instance === undefined) {
          module.initialize();
        }
        instance.save.scroll();
        instance.save.calculations();
        module.invoke(query);
      }
      else {
        if(instance !== undefined) {
          instance.invoke('destroy');
        }
        module.initialize();
      }
    })
  ;

  return (returnedValue !== undefined)
    ? returnedValue
    : this
  ;
};

$.fn.visibility.settings = {

  name                   : 'Visibility',
  namespace              : 'visibility',

  debug                  : false,
  verbose                : false,
  performance            : true,

  // whether to use mutation observers to follow changes
  observeChanges         : true,

  // check position immediately on init
  initialCheck           : true,

  // whether to refresh calculations after all page images load
  refreshOnLoad          : true,

  // whether to refresh calculations after page resize event
  refreshOnResize        : true,

  // should call callbacks on refresh event (resize, etc)
  checkOnRefresh         : true,

  // callback should only occur one time
  once                   : true,

  // callback should fire continuously whe evaluates to true
  continuous             : false,

  // offset to use with scroll top
  offset                 : 0,

  // whether to include margin in elements position
  includeMargin          : false,

  // scroll context for visibility checks
  context                : window,

  // visibility check delay in ms (defaults to animationFrame)
  throttle               : false,

  // special visibility type (image, fixed)
  type                   : false,

  // image only animation settings
  transition             : 'fade in',
  duration               : 1000,

  // array of callbacks for percentage
  onPassed               : {},

  // standard callbacks
  onOnScreen             : false,
  onOffScreen            : false,
  onPassing              : false,
  onTopVisible           : false,
  onBottomVisible        : false,
  onTopPassed            : false,
  onBottomPassed         : false,

  // reverse callbacks
  onPassingReverse       : false,
  onTopVisibleReverse    : false,
  onBottomVisibleReverse : false,
  onTopPassedReverse     : false,
  onBottomPassedReverse  : false,

  // utility callbacks
  onUpdate               : false, // disabled by default for performance
  onRefresh              : function(){},

  metadata : {
    src: 'src'
  },

  className: {
    fixed       : 'fixed',
    placeholder : 'placeholder'
  },

  error : {
    method  : 'The method you called is not defined.',
    visible : 'Element is hidden, you must call refresh after element becomes visible'
  }

};

})( jQuery, window , document );