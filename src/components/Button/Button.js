import React, {Component, PureComponent} from 'react';
import setClass from 'classnames';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import './Button.css';

const BLACK_LIST = [
    'type',
    'size',
    'htmlType',
    'block',
    'component',
    'disabled',
    'loading',
    'outline',
    'bordered',
    'className',
    'prefix',
    'active',
    'ghost',
    'radius'
];

const BTN_BLACK_LIST = ['href', 'target'].concat(BLACK_LIST);

const A_BLACK_LIST = ['href', 'target'].concat(BLACK_LIST);

export default class Button extends (PureComponent || Component) {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    // 处理点击事件
    handleClick(event) {
        if (this.props.disabled || this.props.loading) return;

        if (this.props.onClick) {
            this.props.onClick(event);
        }
    }

    // render a 标签
    renderLink(classNames) {
        const Node = this.props.component || 'a';
        const disabled = this.props.disabled || this.props.loading;
        const loading = this.props.loading;
        const {href = '', target} = this.props;
        const nodeProps = omit(this.props, A_BLACK_LIST);

        return (
            <Node
                {...(disabled ? {} : {href, target})}
                {...nodeProps}
                className={classNames}
                onClick={this.handleClick}
            >
                {loading}
                {this.props.children}
            </Node>
        );
    }

    // render button 标签
    renderButton(classNames) {
        const Node = this.props.component || 'button';
        const disabled = this.props.disabled || this.props.loading;
        const htmlType = this.props.htmlType;
        const loading = this.props.loading;
        const active = this.props.active;
        const nodeProps = omit(this.props, BTN_BLACK_LIST);

        return (
            <Node
                {...nodeProps}
                {...(htmlType ? {type: htmlType} : {})}
                className={classNames}
                disabled={disabled || !active}
                onClick={this.handleClick}
            >
                <div className={`gat-button-wrapper`}>
                    {loading}
                    {this.props.children}
                </div>
            </Node>
        );
    }

    render() {
        let renderer =
            this.props.href || this.props.target ? 'renderLink' : 'renderButton';
        let {
            className,
            type,
            size,
            block,
            disabled,
            loading,
            outline,
            bordered,
            prefix,
            active,
            ghost,
            radius,
        } = this.props;
        let classNames = setClass(
            {
                [`${prefix}-btn-${type}${outline ? '-outline' : ''}`]: type !== 'default',
                [`${prefix}-btn-${size}`]: size !== 'medium',
                [`${prefix}-btn-block`]: block,
                [`${prefix}-btn-loading`]: loading,
                [`${prefix}-btn-disabled`]: disabled,
                [`${prefix}-btn-border-transparent`]: !bordered,
                [`${prefix}-btn-unactivated`]: !active,
                [`${prefix}-btn-ghost`]: ghost,
                [`${prefix}-btn-border-radius`]: radius,
            },
            `${prefix}-btn-default`,
            className
        );

        if (!active || disabled || ghost) {
            classNames = classNames.replace('gat-btn-default', '')
        }

        return this[renderer](classNames);
        // return this.renderDiv(classNames);
    }
}

Button.propTypes = {
    type: PropTypes.oneOf(['default', 'primary', 'success', 'danger', 'link', 'info']),
    size: PropTypes.oneOf(['large', 'medium', 'small', 'huge']),
    htmlType: PropTypes.oneOf(['button', 'submit', 'reset']),
    className: PropTypes.string,
    block: PropTypes.bool,
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    disabled: PropTypes.bool,
    active: PropTypes.bool,
    loading: PropTypes.bool,
    outline: PropTypes.bool,
    ghost: PropTypes.bool,
    bordered: PropTypes.bool,
    radius: PropTypes.bool,
    prefix: PropTypes.string
};

Button.defaultProps = {
    type: 'primary',
    size: 'medium',
    htmlType: 'button',
    className: '',
    block: false,
    disabled: false,
    loading: false,
    outline: false,
    bordered: true,
    prefix: 'gat',
    active: true,
    ghost: false,
    radius: false,
};
