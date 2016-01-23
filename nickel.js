"use strict";
/*global window: false */
/*global console: false */
/*esversion: 6*/

if (typeof window.NickelBridge == "undefined") {
	window.NickelBridge = {

		responseCallbacks: [],

		operationCallbacks: [],

		mockedOperations: [],

		handleMessage: function (data) {
			if (this.responseCallbacks[data.operation]) {
				this.responseCallbacks[data.operation](data.data);
				delete this.responseCallbacks[data.operation];
			} else {
				if (this.operationCallbacks[data.operation]) {
					this.operationCallbacks[data.operation](data.data);
				}
			}
		},

		postMessage: function (operation, messageBody, callback) {
			if (!window.webkit) {
				if (this.mockedOperations[operation]) {
					let returnValue = this.mockedOperations[operation](messageBody);
					if (callback) {
						callback(returnValue);
					}
				} else {
					console.log("Native OP : %o -> %o", operation, messageBody);
					// TODO Handle Navigator
					// Simulates a response from swift invocation
					callback(messageBody);

					// Simulates a callback invocation from swift
					this.handleMessage({
						operation: "sampleCallback",
						data: messageBody
					});
				}
			} else {
				var native = window.webkit.messageHandlers.native;

				if (native) {
					var currentTime = new Date().getTime();
					if (callback) {
						this.responseCallbacks[`${operation}-${currentTime}`] = callback;
					}
					var messageData = {
						timestamp: currentTime,
						operation: operation,
						callback: callback ? true : false,
						data: messageBody
					};
					native.postMessage(JSON.stringify(messageData));
				}
			}
		}

	};
}
