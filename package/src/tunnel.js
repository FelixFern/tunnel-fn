"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTunnelFunction = exports.useTunnel = void 0;
var react_1 = require("react");
var TunnelContext = (0, react_1.createContext)({});
var useTunnel = function () {
    var tunnel = (0, react_1.useContext)(TunnelContext);
    var callTunnel = (0, react_1.useCallback)(function (key, param) {
        if (tunnel[key]) {
            tunnel[key](param);
        }
    }, [tunnel]);
    return {
        callTunnel: callTunnel,
    };
};
exports.useTunnel = useTunnel;
var useTunnelFunction = function (key, fn) {
    var tunnel = (0, react_1.useContext)(TunnelContext);
    (0, react_1.useEffect)(function () {
        tunnel[key] = fn;
        return function () {
            delete tunnel[key];
        };
    }, [fn, key, tunnel]);
    return fn;
};
exports.useTunnelFunction = useTunnelFunction;
