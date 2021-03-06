'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var shallowEqual = require('react-pure-render/shallowEqual');
//var { shouldComponentUpdate: scu } = require('react-pure-render-debug')
var invariant = require('invariant');
var types = require('./util/types');
var paths = require('./util/paths');
var Input = require('./inputs/Input');

var has = ({}).hasOwnProperty;
var MessageTrigger = require('react-input-message/lib/MessageTrigger');

var useRealContext = /^0\.14/.test(React.version);

var options = { recursive: undefined };

/**
 * The Field Component renders a form control and handles input value updates and validations.
 * Changes to the Field value are automatically propagated back up to the containing Form
 * Component.
 *
 * Fields provide a light abstraction over normal input components where values and onChange handlers
 * are take care of for you. Beyond that they just render the input for their type, Fields whille pass along
 * any props and children to the input so you can easily configure new input types.
 *
 * ```editable
 * <Form noValidate
 *   schema={modelSchema}
 *   defaultValue={{ name: { first: 'Sally'}, colorID: 0 }}
 * >
 *   <label>Name</label>
 *   <Form.Field name='name.first' placeholder='First name'/>
 *
 *   <label>Favorite Color</label>
 *   <Form.Field name='colorId' type='select'>
 *     <option value={0}>Red</option>
 *     <option value={1}>Yellow</option>
 *     <option value={2}>Blue</option>
 *     <option value={3}>other</option>
 *   </Form.Field>
 *   <Form.Button type='submit'>Submit</Form.Button>
 * </Form>
 * ```
 */

var Field = (function (_React$Component) {
  _inherits(Field, _React$Component);

  function Field() {
    _classCallCheck(this, Field);

    _React$Component.apply(this, arguments);
  }

  Field.prototype.componentWillMount = function componentWillMount() {
    var _this = this;

    var name = this.props.name;
    var first = true;

    var warn = function warn() {
      first = false;
      if (process.env.NODE_ENV !== 'production') invariant(_this._noValidate || !!_this._schema, 'There is no corresponding schema defined for this field: "' + _this.props.name + '" ' + 'Each Field\'s `name` prop must be a valid path defined by the parent Form schema');
    };

    var updateValue = function updateValue(form) {
      var last = _this._value,
          oldValidate = _this._noValidate;

      _this._value = form.value(_this.props.valueAccessor || _this.props.name), _this._schema = form.schema(_this.props.name), _this._noValidate = form.noValidate;

      first && warn();

      if (!first && (last !== _this._value || oldValidate !== form.noValidate)) _this.forceUpdate();
    };

    this._form = this.getContext().registerWithForm(updateValue);
  };

  Field.prototype.componentWillUnmount = function componentWillUnmount(nextProps, nextState) {
    this._form && this._form.remove();
  };

  Field.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState, nextContext) {
    //return scu.call(this, nextProps, nextState)
    var result = !shallowEqual(nextProps, this.props);
    return result;
  };

  Field.prototype.render = function render() {
    var _props = this.props;
    var events = _props.events;
    var group = _props.group;
    var mapValue = _props.mapValue;
    var name = _props.name;
    var props = _objectWithoutProperties(_props, ['events', 'group', 'mapValue', 'name']);
    var schema = this._schema;
    var value = this._value;
    var type = this.props.type || schema && schema._type || '';
    var Widget = type;

    Widget = typeof this.props.type === 'function' ? (type = undefined, this.props.type) : types[type.toLowerCase()] || Input;

    Widget = React.createElement(Widget, _extends({
      ref: 'input',
      name: name,
      type: type,
      value: value
    }, props, {
      onChange: this._change.bind(this)
    }));

    if (this.props.noValidate || this._noValidate) return Widget;

    name = props.alsoValidates == null ? name : [name].concat(props.alsoValidates);

    if (options.recursive !== props.recursive) options = { recursive: props.recursive };

    return React.createElement(
      MessageTrigger,
      {
        'for': name,
        group: group,
        events: events,
        options: options,
        activeClass: props.errorClass
      },
      Widget
    );
  };

  Field.prototype._change = function _change() {
    var _props2;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this._form.onChange(this.props.name, this.props.mapValue, args);
    this.props.onChange && (_props2 = this.props).onChange.apply(_props2, args);
  };

  Field.prototype.getContext = function getContext() {
    return useRealContext ? this.context : this._reactInternalInstance._context;
  };

  Field.prototype.inputInstance = function inputInstance() {
    return this.refs.input;
  };

  _createClass(Field, null, [{
    key: '_isYupFormField',
    value: true,
    enumerable: true
  }, {
    key: 'contextTypes',
    value: {
      registerWithForm: React.PropTypes.func
    },
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      /**
       * The Field name, which should be path corresponding to a specific form `value` path.
       *
       * ```js
       * // given the form value
       * value = {
       *   name: { first: '' }
       *   languages: ['english', 'spanish']
       * }
       *
       * // the path "name.first" would update the "first" property of the form value
       * <Form.Field name='name.first' />
       *
       * // use indexes for paths that cross arrays
       * <Form.Field name='languages[0]' />
       *
       * ```
       */
      name: React.PropTypes.string.isRequired,

      /**
       * Group Fields together with a common `group` name. Groups can be
       * validated together, helpful for multi-part forms.
       *
       * ```editable
       * <Form schema={modelSchema} defaultValue={modelSchema.default()}>
       *
       *   <Form.Field name='name.first' group='name'
       *     placeholder='first'/>
       *
       *   <Form.Field name='name.last' group='name'
       *     placeholder='surname'/>
       *
       *   <Form.Message for={['name.first', 'name.last']}/>
       *
       *   <Form.Field name='dateOfBirth' placeholder='dob'/>
       *
       *   <Form.Button group='name'>
       *     Validate Name
       *   </Form.Button>
       * </Form>
       * ```
       */
      group: React.PropTypes.string,

      /**
       * The Component Input the form should render. You can sepcify a builtin type
       * with a string name e.g `'text'`, `'datetime-local'`, etc. or provide a Component
       * type class directly. When no type is provided the Field will attempt determine
       * the correct input from the corresponding scheme. A Field corresponding to a `yup.number()`
       * will render a `type='number'` input by default.
       *
       * ```editable
       * <Form noValidate schema={modelSchema}>
       *   Use the schema to determine type
       *   <Form.Field
       *     name='dateOfBirth'
       *     placeholder='date'/>
       *
       *   Override it!
       *   <Form.Field name='dateOfBirth'
       *       type='time'
       *       placeholder='time only'/>
       *
       *   Use a custom Component
       *   (need native 'datetime' support to see it)
       *   <Form.Field
       *     name='dateOfBirth'
       *     type={MyDateInput}/>
       *
       * </Form>
       * ```
       * Custom Inputs should comply with the basic input api contract: set a value via a `value` prop and
       * broadcast changes to that value via an `onChange` handler.
       *
       * You can also permenantly map Components to a string `type` name via the top-level
       * `addInputType()` api.
       */
      type: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string]),

      /**
       * An array of event names that the Field should trigger a validation.
       */
      events: React.PropTypes.arrayOf(React.PropTypes.string),

      /**
       * Customize how the Field value maps to the overall Form `value`.
       * `mapValue` can be a a string property name or a function that returns a
       * value for `name`'d path, allowing you to set commuted values from the Field.
       *
       * ```js
       * <Form.Field name='name'
       *   mapValue={ fieldValue => fieldValue.first + ' ' + fieldValue.last }
       * />
       * ```
       *
       * You can also provide an object hash, mapping paths of the Form `value`
       * to fields in the field value using a string field name, or a function accessor.
       *
       * ```editable
       * <Form
       *   schema={modelSchema}
       *   defaultValue={modelSchema.default()}
       * >
       *   <label>Name</label>
       *   <Form.Field name='name.first' placeholder='First name'/>
       *
       *   <label>Date of Birth</label>
       *   <Form.Field name='dateOfBirth'
       *     mapValue={{
       *       'dateOfBirth': date => date,
       *       'age': date =>
       *       (new Date()).getFullYear() - date.getFullYear()
       *   }}/>
         *   <label>Age</label>
       *   <Form.Field name='age'/>
       *
       *   <Form.Button type='submit'>Submit</Form.Button>
       * </Form>
       * ```
       */
      mapValue: React.PropTypes.oneOfType([React.PropTypes.func, React.PropTypes.string, React.PropTypes.object]),

      /**
       * The css class added to the Field Input when it fails validation
       */
      errorClass: React.PropTypes.string,

      /**
       * Tells the Field to trigger validation for addition paths as well as its own (`name`).
       * Useful when used in conjuction with a `mapValue` hash that updates more than one value, or
       * if you want to trigger validation for the parent path as well.
       *
       * ```js
       * <Form.Field name='name.first' alsoValidates={['name']}/>
       * <Form.Field name='name.last' alsoValidates={['name']}/>
       * ```
       */
      alsoValidates: React.PropTypes.arrayOf(React.PropTypes.string),

      /**
       * Specify whether the Field will recursively validate sub paths.
       * The below example will also validate `name.first` and `name.last`. Generally you won't need to tough this
       * as `react-formal` makes some intelligent guesses about whether to recurse or not on any given path.
       * ```js
       * <Form.Field name='name' recursive={true}/>
       * ```
       */
      recursive: React.PropTypes.string,

      /**
       * Disables validation for the Field.
       */
      noValidate: React.PropTypes.bool
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      type: '',
      events: ['onChange', 'onBlur'],
      errorClass: 'invalid-field'
    },
    enumerable: true
  }]);

  return Field;
})(React.Component);

module.exports = Field;